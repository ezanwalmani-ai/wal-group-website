/**
 * High-Performance Universal Image Optimizer for Wal Group
 * Handles dynamic image resizing, WebP/AVIF conversions, and responsive srcSets
 * for both local assets (/images/..., /logo.png) and external URLs.
 */

export interface ResponsiveImageVariants {
  src: string;
  srcSet: string;
  webpSrcSet: string;
  avifSrcSet?: string;
  sizes: string;
  width?: number;
  height?: number;
  alt: string;
}

/**
 * Strips existing query parameters from an image URL
 */
export function cleanImageUrl(url: string): string {
  if (!url) return '';
  return url.split('?')[0].split('#')[0];
}

/**
 * Checks if a URL is an Unsplash remote image
 */
export function isUnsplashUrl(url: string): boolean {
  return typeof url === 'string' && url.includes('images.unsplash.com');
}

/**
 * Optimizes an Unsplash URL directly with Unsplash's dynamic parameters
 */
export function getOptimizedUnsplashUrl(
  url: string,
  width: number,
  quality = 75,
  format: 'webp' | 'avif' | 'auto' = 'webp'
): string {
  if (!url) return '';
  const baseUrl = cleanImageUrl(url);
  const fmtParam = format === 'auto' ? 'auto=format' : `fm=${format}`;
  return `${baseUrl}?fit=crop&w=${width}&q=${quality}&${fmtParam}`;
}

/**
 * Generates an optimized, dynamically resized image URL.
 * Supports local assets (/images/..., /logo.png) and external images.
 */
export function getOptimizedImageUrl(
  src: string,
  width?: number,
  quality = 80,
  format: 'webp' | 'avif' | 'jpeg' | 'png' | 'auto' = 'webp',
  fit: 'cover' | 'contain' | 'inside' = 'cover'
): string {
  if (!src) return '';

  // Direct Unsplash optimization (fast CDN origin parameterization)
  if (isUnsplashUrl(src)) {
    const fmt = format === 'auto' ? 'auto' : format === 'avif' ? 'avif' : 'webp';
    return getOptimizedUnsplashUrl(src, width || 800, quality, fmt);
  }

  // If width is specified or format conversion to WebP is requested
  const params = new URLSearchParams();
  params.set('url', src);
  if (width) params.set('w', width.toString());
  if (quality) params.set('q', quality.toString());
  if (format && format !== 'auto') params.set('format', format);
  if (fit && fit !== 'cover') params.set('fit', fit);

  return `/api/optimize-image?${params.toString()}`;
}

/**
 * Generates a responsive srcset string with dynamic widths and WebP format
 */
export function getResponsiveSrcSet(
  src: string,
  widths: number[] = [360, 600, 800, 1200],
  quality = 75,
  format: 'webp' | 'avif' | 'auto' = 'webp'
): string {
  if (!src) return '';

  if (isUnsplashUrl(src)) {
    return widths
      .map((w) => `${getOptimizedUnsplashUrl(src, w, quality, format)} ${w}w`)
      .join(', ');
  }

  return widths
    .map((w) => `${getOptimizedImageUrl(src, w, quality, format)} ${w}w`)
    .join(', ');
}

/**
 * Backward compatibility alias for Unsplash srcSet
 */
export function getUnsplashSrcSet(
  url: string,
  widths: number[] = [360, 600, 800, 1200],
  quality = 75,
  format: 'webp' | 'avif' | 'auto' = 'webp'
): string {
  return getResponsiveSrcSet(url, widths, quality, format);
}

/**
 * Generates full responsive WebP and fallback variants for a service card
 */
export interface ServiceCardImageVariants {
  name: string;
  alt: string;
  avifSrcSet: string;
  webpSrcSet: string;
  fallbackJpg: string;
  defaultWebp: string;
  width: number;
  height: number;
}

export function getServiceCardImages(name: string, alt: string): ServiceCardImageVariants {
  const baseLocalJpg = `/images/services/${name}.jpg`;
  return {
    name,
    alt,
    avifSrcSet: `${getOptimizedImageUrl(baseLocalJpg, 400, 75, 'avif')} 400w, ${getOptimizedImageUrl(baseLocalJpg, 800, 80, 'avif')} 800w`,
    webpSrcSet: `${getOptimizedImageUrl(baseLocalJpg, 400, 75, 'webp')} 400w, ${getOptimizedImageUrl(baseLocalJpg, 800, 80, 'webp')} 800w`,
    fallbackJpg: `/images/services/${name}.jpg`,
    defaultWebp: getOptimizedImageUrl(baseLocalJpg, 800, 80, 'webp'),
    width: 800,
    height: 600,
  };
}

/**
 * Generates full responsive WebP and fallback variants for portfolio cards
 */
export function getPortfolioCardImages(name: string, alt: string) {
  const baseLocal = `/images/portfolio/${name}.webp`;
  return {
    name,
    alt,
    webpSrcSet: `${getOptimizedImageUrl(baseLocal, 400, 75, 'webp')} 400w, ${getOptimizedImageUrl(baseLocal, 800, 80, 'webp')} 800w, ${getOptimizedImageUrl(baseLocal, 1200, 85, 'webp')} 1200w`,
    defaultWebp: getOptimizedImageUrl(baseLocal, 800, 80, 'webp'),
    fallback: baseLocal,
    width: 1200,
    height: 675,
  };
}
