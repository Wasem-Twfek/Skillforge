const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Wrapper script for convert-icons.ps1
 * This script helps run the PowerShell script on different platforms
 */

// Configuration
const SCRIPT_DIR = __dirname;
const PS_SCRIPT = path.join(SCRIPT_DIR, 'convert-icons.ps1');
const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
  console.log(`✅ Created icons directory: ${ICONS_DIR}`);
}

// Check if we're on Windows
const isWindows = process.platform === 'win32';

if (isWindows) {
  try {
    console.log('🔄 Running PowerShell script...');
    execSync(`powershell -ExecutionPolicy Bypass -File "${PS_SCRIPT}"`, { stdio: 'inherit' });
    console.log('✅ PowerShell script executed successfully');
  } catch (error) {
    console.error('❌ Failed to execute PowerShell script:', error.message);
    process.exit(1);
  }
} else {
  console.log('⚠️ This script works best on Windows with PowerShell. Falling back to node version...');
  try {
    // Import and run the JS version
    require('./convert-icons.js');
  } catch (error) {
    console.error('❌ Failed to run JS conversion:', error.message);
    process.exit(1);
  }
} 