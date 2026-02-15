const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const outputDir = path.join(__dirname, '../public/icons');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create SVG with gradient background and tool emoji
function createSvg(size) {
  const borderRadius = Math.round(size * 0.15);
  const fontSize = Math.round(size * 0.45);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0d9488"/>
          <stop offset="100%" style="stop-color:#0891b2"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${borderRadius}" fill="url(#grad)"/>
      <text x="${size/2}" y="${size/2 + fontSize/3}" font-size="${fontSize}" text-anchor="middle" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif">🛠️</text>
    </svg>
  `;
}

// Alternative: Create a simple icon with "GF" text
function createTextSvg(size) {
  const borderRadius = Math.round(size * 0.15);
  const fontSize = Math.round(size * 0.4);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0d9488"/>
          <stop offset="100%" style="stop-color:#0891b2"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${borderRadius}" fill="url(#grad)"/>
      <text x="${size/2}" y="${size/2 + fontSize/3}" font-size="${fontSize}" font-weight="bold" fill="white" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">GF</text>
    </svg>
  `;
}

async function generateIcons() {
  for (const size of sizes) {
    const svg = Buffer.from(createTextSvg(size));
    const outputPath = path.join(outputDir, `icon-${size}.png`);

    try {
      await sharp(svg)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated ${outputPath}`);
    } catch (error) {
      console.error(`✗ Failed to generate ${size}x${size} icon:`, error.message);
    }
  }
}

generateIcons().then(() => {
  console.log('\nDone! Icons generated in public/icons/');
});
