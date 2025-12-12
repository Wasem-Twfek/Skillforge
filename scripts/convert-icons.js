const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Convert SVG to PNG using PowerShell script
 * This script is used to generate PNG icons from SVG files
 * It requires InkScape to be installed on the system
 */

// Configuration
const ICONS_SRC = path.join(__dirname, '..', 'public', 'icons');
const ICONS_DEST = path.join(__dirname, '..', 'public', 'icons');
const SIZES = [192, 512];
const INKSCAPE_PATH = 'C:\\Program Files\\Inkscape\\bin\\inkscape.exe';

function checkInkscape() {
  try {
    execSync(`"${INKSCAPE_PATH}" --version`);
    return true;
  } catch (error) {
    console.error('❌ Inkscape not found. Please install Inkscape or update the path in this script.');
    return false;
  }
}

function convertSvgToPng(svgPath, pngPath, size) {
  const command = `"${INKSCAPE_PATH}" --export-filename="${pngPath}" --export-width=${size} --export-height=${size} "${svgPath}"`;
  
  try {
    execSync(command);
    console.log(`✅ Generated: ${pngPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to convert ${svgPath}:`, error.message);
    return false;
  }
}

function main() {
  if (!checkInkscape()) return;
  
  // Check if icons source directory exists
  if (!fs.existsSync(ICONS_SRC)) {
    console.error(`❌ Source directory not found: ${ICONS_SRC}`);
    return;
  }
  
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(ICONS_DEST)) {
    fs.mkdirSync(ICONS_DEST, { recursive: true });
  }
  
  // Convert base icon
  const svgPath = path.join(ICONS_SRC, 'icon.svg');
  if (fs.existsSync(svgPath)) {
    // Convert to different sizes
    for (const size of SIZES) {
      const pngPath = path.join(ICONS_DEST, `icon-${size}x${size}.png`);
      convertSvgToPng(svgPath, pngPath, size);
    }
    
    // Generate apple touch icon
    const appleTouchPath = path.join(ICONS_DEST, 'apple-touch-icon.png');
    convertSvgToPng(svgPath, appleTouchPath, 180);
  } else {
    console.error(`❌ Base SVG icon not found: ${svgPath}`);
  }
}

main(); 