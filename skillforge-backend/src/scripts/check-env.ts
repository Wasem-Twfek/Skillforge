// Script to check environment variables
console.log('Checking environment variables...');
console.log('=============================');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID || 'not set');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '***********' : 'not set');
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL || 'not set');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'not set');
console.log('=============================');

// Check if all required variables are set
const requiredVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_CALLBACK_URL', 'FRONTEND_URL'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
} else {
  console.log('All required environment variables are set');
  
  // Test GOOGLE_CALLBACK_URL format
  try {
    const callbackUrl = process.env.GOOGLE_CALLBACK_URL;
    if (callbackUrl) {
      const url = new URL(callbackUrl);
      console.log('Callback URL is valid:', url.toString());
      console.log('Protocol:', url.protocol);
      console.log('Host:', url.host);
      console.log('Pathname:', url.pathname);
    }
  } catch (error) {
    console.error('Invalid callback URL format:', process.env.GOOGLE_CALLBACK_URL);
  }
} 