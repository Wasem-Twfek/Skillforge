const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script to ensure PWA icons are created during the build process
 * This will check if the icon files exist and create them from SVGs if they don't
 */

const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons');
const ICON_SIZES = [192, 512];

// Check if directory exists, create it if it doesn't
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
  console.log(`✅ Created icons directory: ${ICONS_DIR}`);
}

// Check if we have the SVG source files
const svgIconPath = path.join(ICONS_DIR, 'icon.svg');
const maskableSvg192Path = path.join(ICONS_DIR, 'maskable-192.svg');
const maskableSvg512Path = path.join(ICONS_DIR, 'maskable-512.svg');

const createSvgIcon = () => {
  console.log('⚠️ icon.svg not found, creating default icon');
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>\n<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <circle cx="256" cy="256" r="256" fill="#3b82f6"/>\n  <path d="M180 160h152v40H220v112h92v40H180V160z" fill="white"/>\n  <path d="M220 200h92v40H220v-40z" fill="white"/>\n</svg>`;
  fs.writeFileSync(svgIconPath, svgContent);
};

const createMaskableIcon = (size) => {
  console.log(`⚠️ maskable-${size}.svg not found, creating default`);
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>\n<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#3b82f6"/>\n  <path d="M${size*0.3} ${size*0.28}h${size*0.4}v${size*0.08}H${size*0.4}v${size*0.28}h${size*0.23}v${size*0.08}H${size*0.3}V${size*0.28}z" fill="white"/>\n  <path d="M${size*0.4} ${size*0.36}h${size*0.23}v${size*0.08}H${size*0.4}V${size*0.36}z" fill="white"/>\n</svg>`;
  
  const outputPath = size === 192 ? maskableSvg192Path : maskableSvg512Path;
  fs.writeFileSync(outputPath, svgContent);
};

// Create SVG files if they don't exist
if (!fs.existsSync(svgIconPath)) {
  createSvgIcon();
}

if (!fs.existsSync(maskableSvg192Path)) {
  createMaskableIcon(192);
}

if (!fs.existsSync(maskableSvg512Path)) {
  createMaskableIcon(512);
}

// Function to convert SVG to PNG
const convertSvgToPng = (svgPath, pngPath, size) => {
  try {
    // Check if sharp is installed
    try {
      require.resolve('sharp');
      // Use sharp for conversion if available
      const sharp = require('sharp');
      sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(pngPath)
        .then(() => {
          console.log(`✅ Generated: ${pngPath}`);
        })
        .catch(err => {
          console.error(`❌ Error generating ${pngPath}:`, err);
        });
    } catch (e) {
      // Fallback to simple FS copy if sharp is not available
      console.log(`⚠️ Sharp not available, copying SVG file instead`);
      fs.copyFileSync(svgPath, pngPath.replace('.png', '.svg'));
    }
  } catch (error) {
    console.error(`❌ Error converting ${svgPath}:`, error);
  }
};

// Generate PNG icons from SVGs
ICON_SIZES.forEach(size => {
  const pngPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);
  const maskablePngPath = path.join(ICONS_DIR, `maskable-${size}.png`);
  
  convertSvgToPng(svgIconPath, pngPath, size);
  convertSvgToPng(size === 192 ? maskableSvg192Path : maskableSvg512Path, maskablePngPath, size);
});

// Generate apple-touch-icon.png
convertSvgToPng(svgIconPath, path.join(ICONS_DIR, 'apple-touch-icon.png'), 180);

console.log('✅ PWA icons prepared successfully');
