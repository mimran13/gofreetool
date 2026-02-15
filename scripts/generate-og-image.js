const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../public');

// Create OG image SVG (1200x630)
function createOgImageSvg() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0d9488"/>
          <stop offset="50%" style="stop-color:#0891b2"/>
          <stop offset="100%" style="stop-color:#6366f1"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#grad)"/>

      <!-- Wrench icon -->
      <g transform="translate(550, 100)">
        <circle cx="50" cy="50" r="60" fill="rgba(255,255,255,0.15)"/>
        <path d="M70 30 L90 10 L95 15 L75 35 L85 45 L95 35 L100 40 L80 60 L70 50 L30 90 L20 80 L60 40 L50 30 L70 30Z" fill="white"/>
      </g>

      <!-- Title -->
      <text x="600" y="280" font-size="72" font-weight="800" fill="white" text-anchor="middle" font-family="Arial, sans-serif">GoFreeTool</text>

      <!-- Tagline -->
      <text x="600" y="360" font-size="36" fill="rgba(255,255,255,0.9)" text-anchor="middle" font-family="Arial, sans-serif">Free Daily-Use Tools &amp; Calculators</text>

      <!-- Features -->
      <text x="600" y="440" font-size="24" fill="rgba(255,255,255,0.7)" text-anchor="middle" font-family="Arial, sans-serif">No Signup Required • 100% Free • Browser-Based</text>

      <!-- URL -->
      <text x="600" y="560" font-size="20" fill="rgba(255,255,255,0.5)" text-anchor="middle" font-family="Arial, sans-serif">gofreetool.com</text>
    </svg>
  `;
}

async function generateOgImage() {
  const svg = Buffer.from(createOgImageSvg());
  const outputPath = path.join(outputDir, 'og-image.png');

  try {
    await sharp(svg)
      .resize(1200, 630)
      .png()
      .toFile(outputPath);

    console.log(`✓ Generated ${outputPath}`);
  } catch (error) {
    console.error('✗ Failed to generate OG image:', error.message);
  }
}

generateOgImage().then(() => {
  console.log('\nDone! OG image generated in public/');
});
