const sharp = require('sharp');
const path = require('path');

async function generateIcons() {
  const sizes = [192, 512];
  
  for (const size of sizes) {
    await sharp('icon.svg')
      .resize(size, size)
      .png()
      .toFile(`icon-${size}x${size}.png`);
  }

  await sharp('icon.svg')
    .resize(180, 180)
    .png()
    .toFile('apple-touch-icon.png');

  console.log('✅ Icons generated successfully!');
}

generateIcons().catch(console.error); 