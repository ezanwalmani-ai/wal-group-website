/**
 * High-performance image optimization utilities for Wal Group.
 * Generates modern WebP/AVIF responsive srcSets, optimal dimensions,
 * and eliminates high-latency oversized asset downloads.
 */

/**
 * Optimizes an Unsplash URL by applying width, quality, and modern format parameters.
 */
export function getOptimizedUnsplashUrl(
  url: string,
  width: number,
  quality = 75
): string {
  if (!url || !url.includes('images.unsplash.com')) {
    return url;
  }
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('auto', 'format');
    urlObj.searchParams.set('fit', 'crop');
    urlObj.searchParams.set('w', width.toString());
    urlObj.searchParams.set('q', quality.toString());
    return urlObj.toString();
  } catch {
    // Fallback if malformed
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?auto=format&fit=crop&w=${width}&q=${quality}`;
  }
}

/**
 * Generates a responsive srcset string for an Unsplash image URL.
 */
export function getUnsplashSrcSet(
  url: string,
  widths = [400, 800, 1200, 1600],
  quality = 75
): string {
  if (!url || !url.includes('images.unsplash.com')) {
    return '';
  }
  return widths
    .map((w) => `${getOptimizedUnsplashUrl(url, w, quality)} ${w}w`)
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
