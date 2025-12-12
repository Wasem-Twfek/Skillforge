const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  const sizes = [192, 512];
  
  try {
    // Create output directories if they don't exist
    ['public/icons', 'public/screenshots'].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Generate regular icons
    for (const size of sizes) {
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');
      
      // Draw icon
      const icon = await loadImage(path.join('public/icons', `icon-${size}x${size}.svg`));
      ctx.drawImage(icon, 0, 0, size, size);
      const iconBuffer = canvas.toBuffer('image/png');
      fs.writeFileSync(path.join('public/icons', `icon-${size}x${size}.png`), iconBuffer);
      
      // Draw maskable icon
      const maskableIcon = await loadImage(path.join('public/icons', `maskable-${size}.svg`));
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(maskableIcon, 0, 0, size, size);
      const maskableBuffer = canvas.toBuffer('image/png');
      fs.writeFileSync(path.join('public/icons', `maskable-${size}.png`), maskableBuffer);
    }

    // Generate screenshots
    const desktopCanvas = createCanvas(1920, 1080);
    const desktopCtx = desktopCanvas.getContext('2d');
    const desktopImage = await loadImage(path.join('public/screenshots', 'desktop.svg'));
    desktopCtx.drawImage(desktopImage, 0, 0, 1920, 1080);
    fs.writeFileSync(
      path.join('public/screenshots', 'desktop.png'),
      desktopCanvas.toBuffer('image/png')
    );

    const mobileCanvas = createCanvas(1080, 1920);
    const mobileCtx = mobileCanvas.getContext('2d');
    const mobileImage = await loadImage(path.join('public/screenshots', 'mobile.svg'));
    mobileCtx.drawImage(mobileImage, 0, 0, 1080, 1920);
    fs.writeFileSync(
      path.join('public/screenshots', 'mobile.png'),
      mobileCanvas.toBuffer('image/png')
    );

    console.log('All icons and screenshots generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons(); 