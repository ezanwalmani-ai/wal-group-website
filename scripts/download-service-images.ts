import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';

const services = [
  {
    name: 'web-design-dev',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
    desc: 'Website Design & Development - Web workstation & UI wireframes'
  },
  {
    name: 'dsp-dispatch',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
    desc: 'DSP Dispatch Support - Route planning & GPS telemetry grid'
  },
  {
    name: 'dsp-accounting',
    url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
    desc: 'DSP Accounting - Financial analytics, ledger & payroll sheets'
  },
  {
    name: 'dsp-hr-recruitment',
    url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
    desc: 'DSP HR & Recruitment - Talent candidate pipeline & network'
  },
  {
    name: 'afp-dispatch',
    url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1000&q=80',
    desc: 'AFP Dispatch - Semi truck freight hauler on highway'
  },
  {
    name: 'afp-accounting',
    url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1000&q=80',
    desc: 'AFP Accounting & TMS - Freight load profitability analytics'
  },
  {
    name: 'dedicated-lanes',
    url: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1000&q=80',
    desc: 'Dedicated Lanes - Interstate highway transport lane'
  }
];

function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // Follow redirects
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location).then(resolve).catch(reject);
      }
      const data: Buffer[] = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  const targetDir = path.join(process.cwd(), 'public', 'images', 'services');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (const s of services) {
    console.log(`Downloading ${s.name} (${s.desc})...`);
    try {
      const buffer = await downloadImage(s.url);
      
      // Process image: resize to 800x600, apply subtle cinematic contrast and save as WebP and JPG
      const processedWebp = await sharp(buffer)
        .resize(800, 600, { fit: 'cover', position: 'center' })
        .modulate({
          brightness: 0.85,
          saturation: 0.85,
        })
        .webp({ quality: 80 })
        .toBuffer();

      const processedJpg = await sharp(buffer)
        .resize(800, 600, { fit: 'cover', position: 'center' })
        .modulate({
          brightness: 0.85,
          saturation: 0.85,
        })
        .jpeg({ quality: 80 })
        .toBuffer();

      fs.writeFileSync(path.join(targetDir, `${s.name}.webp`), processedWebp);
      fs.writeFileSync(path.join(targetDir, `${s.name}.jpg`), processedJpg);
      console.log(`✓ Saved ${s.name}.webp and ${s.name}.jpg`);
    } catch (e) {
      console.error(`Failed for ${s.name}:`, e);
    }
  }
}

run();
