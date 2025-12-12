/**
 * Simple PWA icon generator for Docker builds
 * Creates placeholder files instead of processing images with Sharp
 */
const fs = require('fs');
const path = require('path');

// Create icons directory in the Docker container
const ICONS_DIR = '/app/public/icons';
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
  console.log(`Created icons directory: ${ICONS_DIR}`);
}

// Create placeholder icon files
const createPlaceholderFile = (filePath, content = 'PWA Icon Placeholder') => {
  fs.writeFileSync(filePath, content);
  console.log(`Created placeholder: ${filePath}`);
};

// Create required icon files
const iconSizes = [192, 512];
iconSizes.forEach(size => {
  createPlaceholderFile(path.join(ICONS_DIR, `icon-${size}x${size}.png`));
  createPlaceholderFile(path.join(ICONS_DIR, `maskable-${size}.png`));
});

// Create apple touch icon
createPlaceholderFile(path.join(ICONS_DIR, 'apple-touch-icon.png'));

console.log('PWA icon placeholders created successfully');
