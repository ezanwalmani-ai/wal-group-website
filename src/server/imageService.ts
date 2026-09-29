import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import sharp from 'sharp';

export interface OptimizeImageOptions {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png' | 'auto';
  fit?: 'cover' | 'contain' | 'inside' | 'fill';
}

interface CachedImageEntry {
  buffer: Buffer;
  contentType: string;
  etag: string;
  size: number;
  timestamp: number;
}

// In-memory LRU-like buffer cache (max 100 items / 64MB)
const MEMORY_CACHE = new Map<string, CachedImageEntry>();
const MAX_MEMORY_CACHE_ITEMS = 150;

// Disk cache directory
const CACHE_DIR = path.join(process.cwd(), 'data', 'cache', 'images');
try {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('[IMAGE OPTIMIZER] Could not initialize disk cache directory:', err);
}

const ALLOWED_REMOTE_HOSTS = [
  'images.unsplash.com',
  'plus.unsplash.com',
  'res.cloudinary.com',
  'lh3.googleusercontent.com'
];

/**
 * Downloads a remote image buffer with strict timeout and size limit
 */
async function fetchRemoteImageBuffer(urlStr: string): Promise<Buffer> {
  const url = new URL(urlStr);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Invalid URL protocol. Only HTTP and HTTPS are permitted.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(urlStr, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'WalGroup-ImageOptimizer/1.0',
        'Accept': 'image/avif,image/webp,image/jpeg,image/png,image/*;q=0.9'
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch remote image. HTTP Status: ${res.status}`);
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      throw new Error(`Remote resource is not an image (Content-Type: ${contentType})`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Limit to 20MB
    if (buffer.length > 20 * 1024 * 1024) {
      throw new Error('Remote image exceeds maximum permitted size of 20MB');
    }

    return buffer;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Resolves a local image path safely inside public/ or dist/
 */
function resolveLocalImagePath(relativePath: string): { filePath: string; mtimeMs: number } | null {
  // Strip query params or hash
  const cleanPath = relativePath.split('?')[0].split('#')[0];
  const normalizedPath = path.normalize(cleanPath).replace(/^(\.\.[\/\\])+/, '');

  // Potential directories
  const searchDirs = [
    path.join(process.cwd(), 'public'),
    path.join(process.cwd(), 'dist'),
    process.cwd()
  ];

  for (const baseDir of searchDirs) {
    const candidatePath = path.join(baseDir, normalizedPath);
    // Path traversal defense: ensure resolved candidate starts with baseDir
    if (!candidatePath.startsWith(baseDir)) {
      continue;
    }

    if (fs.existsSync(candidatePath)) {
      const stats = fs.statSync(candidatePath);
      if (stats.isFile()) {
        return { filePath: candidatePath, mtimeMs: stats.mtimeMs };
      }
    }
  }

  return null;
}

/**
 * Optimizes an image: resizes dynamically, converts to WebP (or specified format),
 * and caches results both in memory and on disk.
 */
export async function optimizeImage(options: OptimizeImageOptions): Promise<{
  buffer: Buffer;
  contentType: string;
  etag: string;
  isCached: boolean;
}> {
  const {
    src,
    width,
    height,
    quality = 80,
    format = 'webp',
    fit = 'cover'
  } = options;

  if (!src) {
    throw new Error('Image source parameter "src" or "url" is required.');
  }

  // Sanitize numeric constraints
  const targetWidth = width ? Math.min(Math.max(Math.round(width), 16), 3840) : undefined;
  const targetHeight = height ? Math.min(Math.max(Math.round(height), 16), 3840) : undefined;
  const targetQuality = Math.min(Math.max(Math.round(quality), 10), 100);
  const targetFormat = format === 'auto' ? 'webp' : format;

  const isRemote = src.startsWith('http://') || src.startsWith('https://');
  let sourceIdentifier = src;
  let sourceMtimeMs = 0;
  let localFilePath: string | null = null;

  if (!isRemote) {
    const local = resolveLocalImagePath(src);
    if (!local) {
      throw new Error(`Local image not found: ${src}`);
    }
    localFilePath = local.filePath;
    sourceIdentifier = local.filePath;
    sourceMtimeMs = local.mtimeMs;
  }

  // Compute deterministic hash key
  const cacheKeyInput = `${sourceIdentifier}::w${targetWidth || 'auto'}::h${targetHeight || 'auto'}::q${targetQuality}::f${targetFormat}::fit${fit}::mtime${sourceMtimeMs}`;
  const hash = crypto.createHash('sha1').update(cacheKeyInput).digest('hex');
  const etag = `"${hash}"`;

  // 1. Check in-memory LRU cache
  const memCached = MEMORY_CACHE.get(hash);
  if (memCached) {
    return {
      buffer: memCached.buffer,
      contentType: memCached.contentType,
      etag: memCached.etag,
      isCached: true
    };
  }

  // 2. Check disk cache
  const diskCacheFile = path.join(CACHE_DIR, `${hash}.${targetFormat}`);
  if (fs.existsSync(diskCacheFile)) {
    try {
      const diskBuffer = await fs.promises.readFile(diskCacheFile);
      const contentType = `image/${targetFormat === 'jpeg' ? 'jpeg' : targetFormat}`;

      // Populate memory cache
      if (MEMORY_CACHE.size >= MAX_MEMORY_CACHE_ITEMS) {
        const oldestKey = MEMORY_CACHE.keys().next().value;
        if (oldestKey) MEMORY_CACHE.delete(oldestKey);
      }
      MEMORY_CACHE.set(hash, {
        buffer: diskBuffer,
        contentType,
        etag,
        size: diskBuffer.length,
        timestamp: Date.now()
      });

      return {
        buffer: diskBuffer,
        contentType,
        etag,
        isCached: true
      };
    } catch (diskReadErr) {
      console.warn('[IMAGE OPTIMIZER] Disk cache read error, re-processing:', diskReadErr);
    }
  }

  // 3. Image not in cache - read original source buffer
  let inputBuffer: Buffer;
  if (isRemote) {
    inputBuffer = await fetchRemoteImageBuffer(src);
  } else if (localFilePath) {
    inputBuffer = await fs.promises.readFile(localFilePath);
  } else {
    throw new Error('Unable to resolve image source');
  }

  // 4. Initialize Sharp pipeline
  let pipeline = sharp(inputBuffer);

  // Auto-rotate by EXIF metadata
  pipeline = pipeline.rotate();

  // Dynamic resizing
  if (targetWidth || targetHeight) {
    pipeline = pipeline.resize({
      width: targetWidth,
      height: targetHeight,
      fit,
      withoutEnlargement: true
    });
  }

  // Target format conversion
  let contentType = 'image/webp';
  switch (targetFormat) {
    case 'webp':
      pipeline = pipeline.webp({
        quality: targetQuality,
        effort: 4,
        smartSubsample: true
      });
      contentType = 'image/webp';
      break;

    case 'avif':
      pipeline = pipeline.avif({
        quality: targetQuality,
        effort: 4
      });
      contentType = 'image/avif';
      break;

    case 'jpeg':
      pipeline = pipeline.jpeg({
        quality: targetQuality,
        mozjpeg: true
      });
      contentType = 'image/jpeg';
      break;

    case 'png':
      pipeline = pipeline.png({
        quality: targetQuality,
        compressionLevel: 8
      });
      contentType = 'image/png';
      break;

    default:
      pipeline = pipeline.webp({
        quality: targetQuality,
        effort: 4
      });
      contentType = 'image/webp';
      break;
  }

  const outputBuffer = await pipeline.toBuffer();

  // 5. Store in disk cache
  try {
    await fs.promises.writeFile(diskCacheFile, outputBuffer);
  } catch (diskWriteErr) {
    console.warn('[IMAGE OPTIMIZER] Disk cache write failed:', diskWriteErr);
  }

  // 6. Store in memory cache
  if (MEMORY_CACHE.size >= MAX_MEMORY_CACHE_ITEMS) {
    const oldestKey = MEMORY_CACHE.keys().next().value;
    if (oldestKey) MEMORY_CACHE.delete(oldestKey);
  }
  MEMORY_CACHE.set(hash, {
    buffer: outputBuffer,
    contentType,
    etag,
    size: outputBuffer.length,
    timestamp: Date.now()
  });

  return {
    buffer: outputBuffer,
    contentType,
    etag,
    isCached: false
  };
}

/**
 * Express Request Handler for dynamic image optimization
 * GET /api/optimize-image?url=...&w=800&q=80&format=webp
 */
export async function handleImageOptimization(req: express.Request, res: express.Response) {
  try {
    const src = (req.query.url || req.query.src || '') as string;
    if (!src) {
      return res.status(400).json({ error: 'Missing required "url" or "src" query parameter.' });
    }

    const width = req.query.w ? parseInt(req.query.w as string, 10) : req.query.width ? parseInt(req.query.width as string, 10) : undefined;
    const height = req.query.h ? parseInt(req.query.h as string, 10) : req.query.height ? parseInt(req.query.height as string, 10) : undefined;
    const quality = req.query.q ? parseInt(req.query.q as string, 10) : req.query.quality ? parseInt(req.query.quality as string, 10) : 80;
    
    // Auto format negotiation if requested format is auto or undefined
    let format = (req.query.format || req.query.fm || 'webp') as 'webp' | 'avif' | 'jpeg' | 'png' | 'auto';
    if (format === 'auto') {
      const acceptHeader = req.headers.accept || '';
      if (acceptHeader.includes('image/avif')) {
        format = 'avif';
      } else if (acceptHeader.includes('image/webp')) {
        format = 'webp';
      } else {
        format = 'webp';
      }
    }

    const fit = (req.query.fit as any) || 'cover';

    const result = await optimizeImage({
      src,
      width,
      height,
      quality,
      format,
      fit
    });

    // Check If-None-Match for 304 Not Modified
    if (req.headers['if-none-match'] === result.etag) {
      return res.status(304).end();
    }

    res.set({
      'Content-Type': result.contentType,
      'Content-Length': result.buffer.length.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'ETag': result.etag,
      'Vary': 'Accept',
      'X-Image-Optimizer': result.isCached ? 'HIT' : 'MISS'
    });

    return res.status(200).send(result.buffer);
  } catch (error: any) {
    console.error('[IMAGE OPTIMIZER ERROR]', error.message);
    return res.status(error.message.includes('not found') ? 404 : 500).json({
      error: error.message || 'Image processing failed'
    });
  }
}
