// Script to check environment variables (presence only — never log values)
console.log('Checking environment variables...');
console.log('=============================');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'set' : 'not set');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'set' : 'not set');
console.log('GOOGLE_REDIRECT_URI:', process.env.GOOGLE_REDIRECT_URI ? 'set' : 'not set');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL ? 'set' : 'not set');
console.log('=============================');

// Check if all required variables are set
const requiredVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI', 'FRONTEND_URL'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
} else {
  console.log('All required environment variables are set');
  
  // Test GOOGLE_REDIRECT_URI format (structure only — value stays local)
  try {
    const callbackUrl = process.env.GOOGLE_REDIRECT_URI;
    if (callbackUrl) {
      const url = new URL(callbackUrl);
      console.log('Callback URL has valid format');
      console.log('Protocol:', url.protocol);
      console.log('Host set:', url.host ? 'yes' : 'no');
      console.log('Pathname set:', url.pathname ? 'yes' : 'no');
    }
  } catch (error) {
    console.error('Invalid callback URL format');
  }
} 