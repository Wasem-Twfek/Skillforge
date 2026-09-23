import express from 'express';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../lib/prisma';
import { config } from '../config/config';

const router = express.Router();

// Use the config instead of process.env
const GOOGLE_CLIENT_ID = config.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = config.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = config.GOOGLE_REDIRECT_URI;
const JWT_SECRET = config.JWT_SECRET;
const FRONTEND_URL = config.FRONTEND_URL;

const oAuth2Client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Direct callback route to handle Google redirects to /auth/callback
router.get('/callback', async (req, res) => {
  try {
    // Check if we have a token parameter (from our backend)
    if (req.query.token) {
      const token = req.query.token.toString();
      // Instead of redirecting, render an HTML page that will handle the redirect with JavaScript
      // This avoids issues with long tokens and redirect loops
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Redirecting...</title>
          <script>
            // Store the token in localStorage
            localStorage.setItem('token', '${token}');
            // Redirect to the courses page
            window.location.href = '${FRONTEND_URL}/courses';
          </script>
        </head>
        <body>
          <p>Redirecting to SkillForge...</p>
        </body>
        </html>
      `);
    }
    
    // Check if we have a code parameter (from Google)
    if (req.query.code) {
      // Redirect to the proper handler with all query parameters
      const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
      return res.redirect(`/auth/google/callback${queryString}`);
    }
    
    // No token or code, handle error
    if (req.query.error) {
      return res.redirect(`${FRONTEND_URL}/login?error=${encodeURIComponent(req.query.error.toString())}`);
    } else {
      return res.redirect(`${FRONTEND_URL}/login`);
    }
  } catch (error) {
    console.error('Callback route error:', error);
    return res.redirect(`${FRONTEND_URL}/login?error=authentication_error`);
  }
});

// Step 1: Redirect to Google OAuth consent screen
router.get('/google', (req, res) => {
  // Generate a random state to prevent CSRF attacks
  const state = randomBytes(32).toString('hex');

  res.cookie('oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 10 * 60 * 1000,
  });
  
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
    state: state,
  });
  
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

// Step 2: Google redirects back with code, exchange for tokens, verify, create user, issue JWT
router.get('/google/callback', async (req, res) => {
  const { code, state, error } = req.query;

  const storedState = (() => {
    const header = req.headers.cookie;
    if (!header) return null;
    const value = header
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith('oauth_state='));
    return value ? decodeURIComponent(value.slice('oauth_state='.length)) : null;
  })();

  if (!state || typeof state !== 'string' || !storedState) {
    return res.redirect(`${FRONTEND_URL}/auth/callback?error=invalid_state`);
  }

  const stateValid =
    state.length === storedState.length &&
    timingSafeEqual(Buffer.from(state), Buffer.from(storedState));

  if (!stateValid) {
    return res.redirect(`${FRONTEND_URL}/auth/callback?error=invalid_state`);
  }

  res.clearCookie('oauth_state');
  
  // Handle error from Google
  if (error) {
    console.error('Google OAuth error:', error);
    return res.redirect(`${FRONTEND_URL}/auth/callback?error=${error}`);
  }
  
  // Check if code is missing
  if (!code) {
    return res.redirect(`${FRONTEND_URL}/auth/callback?error=missing_code`);
  }
  try {
    // Exchange code for tokens
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    
    interface GoogleTokenResponse {
      id_token: string;
      access_token: string;
    }
    
    const { id_token, access_token } = tokenRes.data as GoogleTokenResponse;
    if (!id_token) throw new Error('No id_token returned from Google');

    // Verify ID token
    const ticket = await oAuth2Client.verifyIdToken({ idToken: id_token, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) throw new Error('Invalid Google ID token payload');

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name || '',
          googleId: payload.sub,
          picture: payload.picture || null,
        },
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({ where: { id: user.id }, data: { googleId: payload.sub, picture: payload.picture || user.picture } });
    }

    // Issue JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    // Redirect to frontend with token
    const redirectUrl = new URL('/auth/callback', FRONTEND_URL);
    redirectUrl.searchParams.append('token', token);
    res.redirect(redirectUrl.toString());
  } catch (err: any) {
    console.error('Google OAuth error:', err);
    res.redirect(`${FRONTEND_URL}/auth/callback?error=server_error`);
  }
});

// Authenticated user info
router.get('/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token' });
  }
  
  try {
    const token = auth.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        picture: true,
        bio: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Email + Password Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate request body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    
    // If user doesn't exist or doesn't have a password (Google-only user)
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user info and token
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

// Register with Email + Password
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Validate request body
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    });
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user info and token
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'An error occurred during registration' });
  }
});

// Signup with Email + Password (alias of register for frontend compatibility)
router.post('/signup', async (req, res) => {
  try {
    const { email, password, confirmPassword, name } = req.body;
    
    // Validate request body
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }
    
    // Validate password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    
    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    });
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user info and token
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'An error occurred during signup' });
  }
});

export default router; 