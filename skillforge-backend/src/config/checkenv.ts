// Check environment variables for Google OAuth
console.log('Checking environment variables for Google OAuth:');
console.log({
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'Not Set',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'Not Set',
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'Not Set',
  FRONTEND_URL: process.env.FRONTEND_URL || 'Not Set',
  JWT_SECRET: process.env.JWT_SECRET || 'Not Set',
});

// Check if all required variables are set
const missingVars: string[] = [];
if (!process.env.GOOGLE_CLIENT_ID) missingVars.push('GOOGLE_CLIENT_ID');
if (!process.env.GOOGLE_CLIENT_SECRET) missingVars.push('GOOGLE_CLIENT_SECRET');
if (!process.env.GOOGLE_CALLBACK_URL) missingVars.push('GOOGLE_CALLBACK_URL');
if (!process.env.FRONTEND_URL) missingVars.push('FRONTEND_URL');
if (!process.env.JWT_SECRET) missingVars.push('JWT_SECRET');

if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  console.error('Please set these variables in your .env file');
} else {
  console.log('All required environment variables are set');
}

// Export a function to check env vars
export function checkGoogleOAuthEnv(): boolean {
  return !!(
    process.env.GOOGLE_CLIENT_ID && 
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CALLBACK_URL &&
    process.env.FRONTEND_URL
  );
} 