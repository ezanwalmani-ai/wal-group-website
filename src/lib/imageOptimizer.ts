/**
 * High-performance image optimization utilities for Wal Group.
 * Generates modern WebP/AVIF responsive srcSets, optimal dimensions,
 * and eliminates high-latency oversized asset downloads.
 */

/**
 * Strips existing query parameters from an Unsplash URL to allow clean parameterization.
 */
export function cleanUnsplashUrl(url: string): string {
  if (!url) return '';
  return url.split('?')[0];
}

/**
 * Optimizes an Unsplash URL by applying width, quality, and modern format parameters.
 */
export function getOptimizedUnsplashUrl(
  url: string,
  width: number,
  quality = 75,
  format?: 'webp' | 'avif' | 'auto'
): string {
  if (!url) return '';
  if (!url.includes('images.unsplash.com')) {
    return url;
  }
  const baseUrl = cleanUnsplashUrl(url);
  const fmtParam = format && format !== 'auto' ? `&fm=${format}` : '&auto=format';
  return `${baseUrl}?fit=crop&w=${width}&q=${quality}${fmtParam}`;
}

/**
 * Generates a responsive srcset string for an Unsplash image URL.
 */
export function getUnsplashSrcSet(
  url: string,
  widths = [360, 600, 800, 1200, 1600],
  quality = 75,
  format?: 'webp' | 'avif' | 'auto'
): string {
  if (!url || !url.includes('images.unsplash.com')) {
    return '';
  }
  return widths
    .map((w) => `${getOptimizedUnsplashUrl(url, w, quality, format)} ${w}w`)
    .join(', ');
}

/**
 * Service card background image descriptor with responsive AVIF / WebP / JPG sources.
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
  return {
    name,
    alt,
    avifSrcSet: `/images/services/${name}-400.avif 400w, /images/services/${name}-800.avif 800w`,
    webpSrcSet: `/images/services/${name}-400.webp 400w, /images/services/${name}-800.webp 800w`,
    fallbackJpg: `/images/services/${name}.jpg`,
    defaultWebp: `/images/services/${name}.webp`,
    width: 800,
    height: 600,
  };
}

