// Script to check OAuth configuration
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Import check function
import { checkGoogleOAuthEnv } from '../config/checkenv';

console.log('==== Google OAuth Configuration Check ====');

// Check all OAuth environment variables
const isConfigured = checkGoogleOAuthEnv();

if (isConfigured) {
  console.log('✅ Google OAuth is properly configured');
  
  // Check callback URL structure
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL;
  if (callbackUrl) {
    try {
      const url = new URL(callbackUrl);
      console.log('Callback URL is valid:', url.toString());
      console.log('Protocol:', url.protocol);
      console.log('Host:', url.host);
      console.log('Pathname:', url.pathname);
    } catch (error) {
      console.error('⚠️ Invalid callback URL format:', callbackUrl);
    }
  }
  
  // Generate a test OAuth URL
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_CALLBACK_URL;
  
  if (clientId && redirectUri) {
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.append('client_id', clientId);
    googleAuthUrl.searchParams.append('redirect_uri', redirectUri);
    googleAuthUrl.searchParams.append('response_type', 'code');
    googleAuthUrl.searchParams.append('scope', 'profile email openid');
    googleAuthUrl.searchParams.append('access_type', 'offline');
    googleAuthUrl.searchParams.append('prompt', 'consent');
    
    console.log('\nTest OAuth URL:');
    console.log(googleAuthUrl.toString());
  }
} else {
  console.error('❌ Google OAuth configuration is incomplete');
  process.exit(1);
} 