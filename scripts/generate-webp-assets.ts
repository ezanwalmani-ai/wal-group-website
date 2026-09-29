import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function processDirectory(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(fullPath);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      const baseName = path.basename(entry.name, ext);
      const webpPath = path.join(dir, `${baseName}.webp`);

      // 1. Generate full-resolution WebP if missing or smaller
      try {
        const metadata = await sharp(fullPath).metadata();
        const origSize = fs.statSync(fullPath).size;

        if (!fs.existsSync(webpPath)) {
          await sharp(fullPath)
            .webp({ quality: 80, effort: 4 })
            .toFile(webpPath);
          const newSize = fs.statSync(webpPath).size;
          console.log(`[GENERATED WEBP] ${webpPath} (${origSize}B -> ${newSize}B, saved ${Math.round((1 - newSize / origSize) * 100)}%)`);
        }

        // 2. Generate responsive variants for large images (e.g. portfolio & services)
        if (metadata.width && metadata.width > 600) {
          const widths = [400, 800];
          for (const w of widths) {
            if (metadata.width > w) {
              const resWebpPath = path.join(dir, `${baseName}-${w}.webp`);
              if (!fs.existsSync(resWebpPath)) {
                await sharp(fullPath)
                  .resize({ width: w, withoutEnlargement: true })
                  .webp({ quality: 78, effort: 4 })
                  .toFile(resWebpPath);
                console.log(`[RESPONSIVE WEBP] ${resWebpPath}`);
              }
            }
          }
        }
      } catch (err: any) {
        console.warn(`[FAILED TO CONVERT] ${fullPath}:`, err.message);
      }
    }
  }
}

async function run() {
  const publicDir = path.join(process.cwd(), 'public');
  console.log('Starting WebP asset pre-generation in:', publicDir);
  await processDirectory(publicDir);
  console.log('Finished pre-generating WebP assets.');
}

run();
