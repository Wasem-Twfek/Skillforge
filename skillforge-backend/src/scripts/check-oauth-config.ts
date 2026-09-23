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
  
  // Check callback URL structure (presence/structure only — never print values)
  const callbackUrl = process.env.GOOGLE_REDIRECT_URI;
  if (callbackUrl) {
    try {
      const url = new URL(callbackUrl);
      console.log('Callback URL has valid format');
      console.log('Protocol:', url.protocol);
    } catch (error) {
      console.error('⚠️ Invalid callback URL format');
    }
  }
  
  // Generate a test OAuth URL (do not print it — it embeds the client ID)
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  
  if (clientId && redirectUri) {
    console.log('\nTest OAuth URL can be constructed (not printed to avoid leaking client ID).');
  }
} else {
  console.error('❌ Google OAuth configuration is incomplete');
  process.exit(1);
} 