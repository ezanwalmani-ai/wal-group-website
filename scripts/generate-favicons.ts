import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Official Wal Group Hexagon Emblem SVG (512x512)
const svgEmblem = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Radial Gradient -->
    <radialGradient id="bgGlow" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#1c130d" />
      <stop offset="45%" stop-color="#0e0a08" />
      <stop offset="100%" stop-color="#050404" />
    </radialGradient>

    <!-- Outer Hexagon Border Gradient -->
    <linearGradient id="hexBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff9900" />
      <stop offset="35%" stop-color="#d96a00" />
      <stop offset="70%" stop-color="#8a3c00" />
      <stop offset="100%" stop-color="#401900" />
    </linearGradient>

    <!-- Left Wing Gradient -->
    <linearGradient id="leftWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff7a00" />
      <stop offset="60%" stop-color="#ff5500" />
      <stop offset="100%" stop-color="#e03e00" />
    </linearGradient>

    <!-- Center A Left Facet -->
    <linearGradient id="centerLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff9922" />
      <stop offset="100%" stop-color="#ff5500" />
    </linearGradient>

    <!-- Center A Right Facet -->
    <linearGradient id="centerRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffab33" />
      <stop offset="100%" stop-color="#ff6600" />
    </linearGradient>

    <!-- Right Wing Gradient -->
    <linearGradient id="rightWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff8800" />
      <stop offset="60%" stop-color="#ff5e00" />
      <stop offset="100%" stop-color="#d93800" />
    </linearGradient>

    <!-- Subtle Drop Shadow -->
    <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="#ff6600" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="512" height="512" rx="96" fill="url(#bgGlow)" />

  <!-- Outer Ambient Hexagon Glow -->
  <polygon
    points="256,44 440,150 440,362 256,468 72,362 72,150"
    fill="#0a0808"
    stroke="url(#hexBorderGrad)"
    stroke-width="14"
    stroke-linejoin="round"
    filter="url(#logoGlow)"
  />

  <!-- Inner Hexagon Dark Plate -->
  <polygon
    points="256,58 428,157 428,355 256,454 84,355 84,157"
    fill="#0e0a0a"
  />

  <!-- ================= WAL GROUP ICONIC 'W-A' MONOGRAM ================= -->
  <!-- Left Wing -->
  <path
    d="M 148,168 
       L 214,178 
       L 194,302 
       L 182,274 
       L 158,228 Z"
    fill="url(#leftWingGrad)"
  />
  
  <!-- Left Wing Upper Facet -->
  <polygon
    points="148,168 214,178 240,250 182,274"
    fill="url(#leftWingGrad)"
  />

  <!-- Right Wing -->
  <polygon
    points="364,168 298,178 272,250 330,274"
    fill="url(#rightWingGrad)"
  />
  
  <!-- Right Wing Outer Edge -->
  <path
    d="M 364,168 
       L 298,178 
       L 318,302 
       L 330,274 
       L 354,228 Z"
    fill="url(#rightWingGrad)"
  />

  <!-- Center 'A' Apex & Chevron Structure -->
  <!-- Left Half of Center A -->
  <polygon
    points="256,172 256,236 218,312 188,312 230,224"
    fill="url(#centerLeftGrad)"
  />

  <!-- Right Half of Center A -->
  <polygon
    points="256,172 256,236 294,312 324,312 282,224"
    fill="url(#centerRightGrad)"
  />

  <!-- Center A Triangular Cutout (Bottom Inverted Triangle) -->
  <polygon
    points="256,236 226,302 286,302"
    fill="#0e0a0a"
  />
</svg>`;

async function generateFavicons() {
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Write favicon.svg
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgEmblem);
  console.log('Created favicon.svg');

  const svgBuffer = Buffer.from(svgEmblem);

  // 2. Generate PNG sizes
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'favicon.png', size: 64 },
  ];

  for (const { name, size } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, name));
    console.log(`Generated ${name} (${size}x${size})`);
  }

  // 3. Generate favicon.ico from 32x32 PNG
  const png32Buffer = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), png32Buffer);
  console.log('Created favicon.ico');

  // 4. Create site.webmanifest
  const manifest = {
    name: 'Wal Group',
    short_name: 'Wal Group',
    description: 'Wal Group - Backend Operations, Amazon DSP/AFP Support & BPO Solutions',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    theme_color: '#050404',
    background_color: '#050404',
    display: 'standalone'
  };

  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
  console.log('Created site.webmanifest');
}

generateFavicons().catch((err) => {
  console.error(err);
  process.exit(1);
});
