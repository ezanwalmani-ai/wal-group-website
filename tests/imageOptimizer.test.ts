import { describe, it, expect } from 'vitest';
import {
  cleanUnsplashUrl,
  getOptimizedUnsplashUrl,
  getUnsplashSrcSet,
  getServiceCardImages,
} from '../src/lib/imageOptimizer';

describe('Image Optimizer Module', () => {
  const sampleUnsplash = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80';

  it('should cleanly strip query parameters from an Unsplash URL', () => {
    const cleaned = cleanUnsplashUrl(sampleUnsplash);
    expect(cleaned).toBe('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d');
  });

  it('should generate optimized Unsplash URLs with custom width and quality', () => {
    const url = getOptimizedUnsplashUrl(sampleUnsplash, 800, 80);
    expect(url).toContain('w=800');
    expect(url).toContain('q=80');
    expect(url).toContain('auto=format');
  });

  it('should generate formatted Unsplash URLs for AVIF and WebP', () => {
    const avifUrl = getOptimizedUnsplashUrl(sampleUnsplash, 600, 75, 'avif');
    const webpUrl = getOptimizedUnsplashUrl(sampleUnsplash, 600, 75, 'webp');

    expect(avifUrl).toContain('fm=avif');
    expect(webpUrl).toContain('fm=webp');
    expect(avifUrl).toContain('w=600');
    expect(webpUrl).toContain('w=600');
  });

  it('should generate responsive srcSets for multiple widths and formats', () => {
    const srcSet = getUnsplashSrcSet(sampleUnsplash, [400, 800, 1200], 75, 'avif');
    expect(srcSet).toContain('400w');
    expect(srcSet).toContain('800w');
    expect(srcSet).toContain('1200w');
    expect(srcSet).toContain('fm=avif');
  });

  it('should generate service image props for local webp and avif assets', () => {
    const props = getServiceCardImages('dsp-dispatch', 'Amazon DSP Dispatch');
    expect(props.avifSrcSet).toContain('/images/services/dsp-dispatch-400.avif');
    expect(props.avifSrcSet).toContain('/images/services/dsp-dispatch-800.avif');
    expect(props.webpSrcSet).toContain('/images/services/dsp-dispatch-400.webp');
    expect(props.webpSrcSet).toContain('/images/services/dsp-dispatch-800.webp');
    expect(props.fallbackJpg).toBe('/images/services/dsp-dispatch.jpg');
    expect(props.defaultWebp).toBe('/images/services/dsp-dispatch.webp');
    expect(props.width).toBe(800);
    expect(props.height).toBe(600);
  });

  it('should gracefully handle non-Unsplash or empty URLs', () => {
    expect(getOptimizedUnsplashUrl('', 800)).toBe('');
    expect(cleanUnsplashUrl('')).toBe('');
    expect(getUnsplashSrcSet('/local-image.jpg')).toBe('');
  });
});
