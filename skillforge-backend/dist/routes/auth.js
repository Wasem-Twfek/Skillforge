"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const google_auth_library_1 = require("google-auth-library");
const prisma_1 = __importDefault(require("../lib/prisma"));
const config_1 = require("../config/config");
const router = express_1.default.Router();
// Use the config instead of process.env
const GOOGLE_CLIENT_ID = config_1.config.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = config_1.config.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = config_1.config.GOOGLE_REDIRECT_URI;
const JWT_SECRET = config_1.config.JWT_SECRET;
const FRONTEND_URL = config_1.config.FRONTEND_URL;
console.log('Auth route using credentials:', {
    GOOGLE_CLIENT_ID,
    GOOGLE_REDIRECT_URI,
    FRONTEND_URL
});
const oAuth2Client = new google_auth_library_1.OAuth2Client(GOOGLE_CLIENT_ID);
// Direct callback route to handle Google redirects to /auth/callback
router.get('/callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Received direct callback with params:', req.query);
    try {
        // Check if we have a token parameter (from our backend)
        if (req.query.token) {
            const token = req.query.token.toString();
            console.log('Token found in callback, redirecting to frontend');
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
            console.log('Code parameter found, redirecting to google callback handler');
            // Redirect to the proper handler with all query parameters
            const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
            return res.redirect(`/auth/google/callback${queryString}`);
        }
        // No token or code, handle error
        console.error('No token or code parameter in direct callback');
        if (req.query.error) {
            return res.redirect(`${FRONTEND_URL}/login?error=${encodeURIComponent(req.query.error.toString())}`);
        }
        else {
            return res.redirect(`${FRONTEND_URL}/login`);
        }
    }
    catch (error) {
        console.error('Error in callback route:', error);
        return res.redirect(`${FRONTEND_URL}/login?error=authentication_error`);
    }
}));
// Step 1: Redirect to Google OAuth consent screen
router.get('/google', (req, res) => {
    // Generate a random state to prevent CSRF attacks
    const state = Math.random().toString(36).substring(2, 15);
    // Store the state in the session or cookie for verification later
    // This is a simplified example - in production, use a secure session store
    res.cookie('oauth_state', state, { httpOnly: true, maxAge: 10 * 60 * 1000 }); // 10 minutes
    const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: GOOGLE_REDIRECT_URI,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent',
        state: state,
    });
    console.log('Redirecting to Google with params:', params.toString());
    console.log('Using redirect URI:', GOOGLE_REDIRECT_URI);
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});
// Step 2: Google redirects back with code, exchange for tokens, verify, create user, issue JWT
router.get('/google/callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Received callback with query params:', req.query);
    console.log('Headers:', req.headers);
    const { code, state, error } = req.query;
    // Handle error from Google
    if (error) {
        console.error('Google OAuth error:', error);
        return res.redirect(`${FRONTEND_URL}/auth/callback?error=${error}`);
    }
    // Check if code is missing
    if (!code) {
        console.error('Missing authorization code in callback');
        return res.redirect(`${FRONTEND_URL}/auth/callback?error=missing_code`);
    }
    try {
        // Exchange code for tokens
        console.log('Exchanging code for tokens with params:', {
            code,
            client_id: GOOGLE_CLIENT_ID,
            redirect_uri: GOOGLE_REDIRECT_URI,
        });
        const tokenRes = yield axios_1.default.post('https://oauth2.googleapis.com/token', null, {
            params: {
                code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: GOOGLE_REDIRECT_URI,
                grant_type: 'authorization_code',
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        const { id_token, access_token } = tokenRes.data;
        if (!id_token)
            throw new Error('No id_token returned from Google');
        // Verify ID token
        const ticket = yield oAuth2Client.verifyIdToken({ idToken: id_token, audience: GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        if (!payload || !payload.email)
            throw new Error('Invalid Google ID token payload');
        console.log('Successfully verified Google token for:', payload.email);
        // Find or create user
        let user = yield prisma_1.default.user.findUnique({ where: { email: payload.email } });
        if (!user) {
            user = yield prisma_1.default.user.create({
                data: {
                    email: payload.email,
                    name: payload.name || '',
                    googleId: payload.sub,
                    picture: payload.picture || null,
                },
            });
            console.log('Created new user:', user.id);
        }
        else if (!user.googleId) {
            user = yield prisma_1.default.user.update({ where: { id: user.id }, data: { googleId: payload.sub, picture: payload.picture || user.picture } });
            console.log('Updated user with Google ID:', user.id);
        }
        // Issue JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        // Redirect to frontend with token
        const redirectUrl = new URL('/auth/callback', FRONTEND_URL);
        redirectUrl.searchParams.append('token', token);
        console.log('Redirecting to frontend with token:', redirectUrl.toString());
        res.redirect(redirectUrl.toString());
    }
    catch (err) {
        console.error('Google OAuth error:', err);
        res.redirect(`${FRONTEND_URL}/auth/callback?error=server_error&message=${encodeURIComponent(err.message || 'Unknown error')}`);
    }
}));
// Authenticated user info
router.get('/me', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('[/auth/me] Request received');
    console.log('[/auth/me] Headers:', req.headers);
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        console.error('[/auth/me] No token provided');
        return res.status(401).json({ error: 'No token' });
    }
    try {
        const token = auth.replace('Bearer ', '');
        console.log('[/auth/me] Verifying token:', token.substring(0, 10) + '...');
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        console.log('[/auth/me] Decoded token:', decoded);
        const user = yield prisma_1.default.user.findUnique({
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
            console.error('[/auth/me] User not found for id:', decoded.id);
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('[/auth/me] User found:', { id: user.id, email: user.email, name: user.name });
        res.json(user);
    }
    catch (err) {
        console.error('[/auth/me] Token verification error:', err);
        res.status(401).json({ error: 'Invalid token' });
    }
}));
// Email + Password Login
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validate request body
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        // Find user by email
        const user = yield prisma_1.default.user.findUnique({ where: { email } });
        // If user doesn't exist or doesn't have a password (Google-only user)
        if (!user || !user.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Verify password
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
}));
// Register with Email + Password
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        // Validate request body
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, password, and name are required' });
        }
        // Check if user already exists
        const existingUser = yield prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create user
        const user = yield prisma_1.default.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        // Return user info and token
        res.status(201).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'An error occurred during registration' });
    }
}));
// Signup with Email + Password (alias of register for frontend compatibility)
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const existingUser = yield prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create user
        const user = yield prisma_1.default.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        // Return user info and token
        res.status(201).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'An error occurred during signup' });
    }
}));
exports.default = router;
