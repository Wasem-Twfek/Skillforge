// Script to test OAuth flow
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { URL } from 'url';

// Configure environment
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Check required environment variables
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackUrl = process.env.GOOGLE_CALLBACK_URL;
const frontendUrl = process.env.FRONTEND_URL;

if (!clientId || !clientSecret || !callbackUrl || !frontendUrl) {
  console.error('Missing required environment variables:');
  console.error({
    GOOGLE_CLIENT_ID: clientId ? 'Set' : 'Missing',
    GOOGLE_CLIENT_SECRET: clientSecret ? 'Set' : 'Missing',
    GOOGLE_CALLBACK_URL: callbackUrl ? 'Set' : 'Missing',
    FRONTEND_URL: frontendUrl ? 'Set' : 'Missing'
  });
  
  console.error('\nPlease create an .env file in the skillforge-backend directory with these variables.\n');
  
  // Provide template
  console.log('Here is a template for your .env file:');
  console.log(`
# Google OAuth configuration
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
FRONTEND_URL=http://localhost:3000
JWT_SECRET=a_secure_jwt_secret_key_for_development
`);
  
  process.exit(1);
}

// Create express app
const app = express();
const port = 8088;

// Serve a simple HTML page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>OAuth Test Tool</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        pre { background: #f4f4f4; border: 1px solid #ddd; border-radius: 3px; padding: 10px; overflow: auto; }
        .card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        button { background: #4285f4; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; }
        button:hover { background: #3367d6; }
        h2 { color: #333; }
      </style>
    </head>
    <body>
      <h1>OAuth Test Tool</h1>
      
      <div class="card">
        <h2>Current Configuration</h2>
        <p>Google Client ID: ${clientId ? clientId.substring(0, 8) + '...' : 'Not configured'}</p>
        <p>Google Client Secret: ${clientSecret ? '✓ Configured' : 'Not configured'}</p>
        <p>Google Callback URL: ${callbackUrl || 'Not configured'}</p>
        <p>Frontend URL: ${frontendUrl || 'Not configured'}</p>
      </div>
      
      <div class="card">
        <h2>Test Google OAuth Flow</h2>
        <p>Click the button below to initiate a complete OAuth flow:</p>
        <button onclick="window.location.href='/test-oauth'">Test OAuth Flow</button>
      </div>
      
      <div class="card">
        <h2>Manual URL Construction</h2>
        <p>If you want to manually construct a URL, here's a properly formatted OAuth URL:</p>
        <pre id="oauth-url"></pre>
        <script>
          const oauthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
          oauthUrl.searchParams.append('client_id', '${clientId}');
          oauthUrl.searchParams.append('redirect_uri', '${callbackUrl}');
          oauthUrl.searchParams.append('response_type', 'code');
          oauthUrl.searchParams.append('scope', 'profile email openid');
          oauthUrl.searchParams.append('access_type', 'offline');
          oauthUrl.searchParams.append('prompt', 'consent');
          
          document.getElementById('oauth-url').textContent = oauthUrl.toString();
        </script>
      </div>
      
      <div class="card">
        <h2>Debugging Tips</h2>
        <ul>
          <li>Make sure your Google OAuth credentials are configured with the exact callback URL</li>
          <li>Verify that your backend server is running and accessible</li>
          <li>Check browser console for any errors during the OAuth flow</li>
          <li>Ensure your backend is correctly processing the OAuth callback</li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

// OAuth test endpoint
app.get('/test-oauth', (req, res) => {
  // Generate OAuth URL
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.append('client_id', clientId);
  googleAuthUrl.searchParams.append('redirect_uri', callbackUrl);
  googleAuthUrl.searchParams.append('response_type', 'code');
  googleAuthUrl.searchParams.append('scope', 'profile email openid');
  googleAuthUrl.searchParams.append('access_type', 'offline');
  googleAuthUrl.searchParams.append('prompt', 'consent');
  
  console.log('Redirecting to Google OAuth:', googleAuthUrl.toString());
  res.redirect(googleAuthUrl.toString());
});

// Start server
app.listen(port, () => {
  console.log(`
===============================================
🔑 OAuth Test Server Running at http://localhost:${port}
===============================================

This tool helps you test your Google OAuth configuration.

1. Visit http://localhost:${port} in your browser
2. Use the "Test OAuth Flow" button to start the OAuth process
3. After authentication, you should be redirected back to your application

Current Configuration:
- Google Client ID: ${clientId ? '✓ Configured' : '❌ Missing'}
- Google Client Secret: ${clientId ? '✓ Configured' : '❌ Missing'}
- Google Callback URL: ${callbackUrl}
- Frontend URL: ${frontendUrl}

Press Ctrl+C to stop the server
`);
}); 