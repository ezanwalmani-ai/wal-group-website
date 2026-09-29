import { describe, it, expect } from 'vitest';
import {
  cleanImageUrl,
  getOptimizedUnsplashUrl,
  getOptimizedImageUrl,
  getResponsiveSrcSet,
  getServiceCardImages,
  getPortfolioCardImages,
} from '../src/lib/imageOptimizer';
import { optimizeImage } from '../src/server/imageService';
import path from 'path';

describe('Universal Image Optimizer & Dynamic WebP Resizer', () => {
  const sampleUnsplash = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80';

  it('should cleanly strip query parameters from an image URL', () => {
    const cleaned = cleanImageUrl(sampleUnsplash);
    expect(cleaned).toBe('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d');
  });

  it('should generate optimized Unsplash URLs with custom width, quality and WebP format', () => {
    const url = getOptimizedUnsplashUrl(sampleUnsplash, 800, 80, 'webp');
    expect(url).toContain('w=800');
    expect(url).toContain('q=80');
    expect(url).toContain('fm=webp');
  });

  it('should route local assets through dynamic optimizer endpoint with WebP format', () => {
    const localOptimized = getOptimizedImageUrl('/images/portfolio/wal-groups.webp', 600, 80, 'webp');
    expect(localOptimized).toContain('/api/optimize-image?');
    expect(localOptimized).toContain('url=%2Fimages%2Fportfolio%2Fwal-groups.webp');
    expect(localOptimized).toContain('w=600');
    expect(localOptimized).toContain('format=webp');
  });

  it('should generate responsive WebP srcSets for local and remote assets', () => {
    const srcSet = getResponsiveSrcSet('/images/services/dsp-dispatch.jpg', [360, 720, 1080], 75, 'webp');
    expect(srcSet).toContain('360w');
    expect(srcSet).toContain('720w');
    expect(srcSet).toContain('1080w');
    expect(srcSet).toContain('format=webp');
  });

  it('should generate portfolio card variants with responsive WebP srcSets', () => {
    const portfolio = getPortfolioCardImages('wal-groups', 'Wal Groups Platform');
    expect(portfolio.name).toBe('wal-groups');
    expect(portfolio.webpSrcSet).toContain('400w');
    expect(portfolio.webpSrcSet).toContain('800w');
    expect(portfolio.webpSrcSet).toContain('1200w');
    expect(portfolio.defaultWebp).toContain('/api/optimize-image');
  });

  it('should perform server-side dynamic resizing and WebP conversion with Sharp', async () => {
    const result = await optimizeImage({
      src: '/images/services/dsp-accounting.jpg',
      width: 400,
      quality: 75,
      format: 'webp'
    });

    expect(result).toBeDefined();
    expect(result.contentType).toBe('image/webp');
    expect(result.buffer.length).toBeGreaterThan(0);
    expect(result.etag).toMatch(/^"[a-f0-9]+"/);
  });

  it('should return cached result instantly for repeated optimization requests', async () => {
    const opts = {
      src: '/images/services/dsp-accounting.jpg',
      width: 400,
      quality: 75,
      format: 'webp' as const
    };

    const first = await optimizeImage(opts);
    const second = await optimizeImage(opts);

    expect(second.isCached).toBe(true);
    expect(second.etag).toBe(first.etag);
    expect(second.buffer.length).toBe(first.buffer.length);
  });
});
