import React, { useState } from 'react';
import { motion } from 'motion/react';
import { getUnsplashSrcSet, getOptimizedUnsplashUrl, cleanUnsplashUrl } from '../lib/imageOptimizer';

export interface AnimatedImageProps {
  src: string;
  srcSet?: string;
  avifSrcSet?: string;
  webpSrcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  alt: string;
  className?: string;
  containerClassName?: string;
  hoverEffect?: 'zoom' | 'lift' | 'glow' | 'tilt' | 'none';
  entranceAnimation?: 'fadeIn' | 'scaleUp' | 'slideUp' | 'slideLeft' | 'slideRight';
  floating?: boolean;
  priority?: boolean;
  overlay?: React.ReactNode;
}

export const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  srcSet,
  avifSrcSet,
  webpSrcSet,
  sizes,
  width = 800,
  height = 500,
  alt,
  className = '',
  containerClassName = '',
  hoverEffect = 'zoom',
  entranceAnimation = 'scaleUp',
  floating = false,
  priority = false,
  overlay,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const isUnsplash = src.includes('images.unsplash.com');

  // Compute optimized default fallback URL
  const computedSrc = isUnsplash
    ? getOptimizedUnsplashUrl(src, priority ? 1200 : 800, 75, 'auto')
    : src;

  // Auto-generate AVIF and WebP responsive srcSets
  const computedAvifSrcSet = avifSrcSet || (isUnsplash
    ? getUnsplashSrcSet(src, [360, 600, 800, 1200, 1600], 75, 'avif')
    : undefined);

  const computedWebpSrcSet = webpSrcSet || (isUnsplash
    ? getUnsplashSrcSet(src, [360, 600, 800, 1200, 1600], 75, 'webp')
    : undefined);

  const computedSrcSet = srcSet || (isUnsplash
    ? getUnsplashSrcSet(src, [360, 600, 800, 1200, 1600], 75, 'auto')
    : undefined);

  const computedSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 800px';

  // Define entrance variants based on prop
  const getEntranceVariants = () => {
    switch (entranceAnimation) {
      case 'fadeIn':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } },
        };
      case 'slideUp':
        return {
          hidden: { opacity: 0, y: 24 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
        };
      case 'slideLeft':
        return {
          hidden: { opacity: 0, x: -24 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
        };
      case 'slideRight':
        return {
          hidden: { opacity: 0, x: 24 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
        };
      case 'scaleUp':
      default:
        return {
          hidden: { opacity: 0, scale: 0.96, y: 12 },
          visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
        };
    }
  };

  // Hover animations
  const getHoverAnimation = () => {
    switch (hoverEffect) {
      case 'lift':
        return { y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } };
      case 'glow':
        return { scale: 1.02, boxShadow: '0 0 25px rgba(255, 102, 0, 0.35)', transition: { duration: 0.4 } };
      case 'tilt':
        return { rotate: 1.2, scale: 1.02, transition: { type: 'spring', stiffness: 250, damping: 18 } };
      case 'none':
        return {};
      case 'zoom':
      default:
        return {};
    }
  };

  const entranceVariants = getEntranceVariants();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={entranceVariants}
      whileHover={getHoverAnimation()}
      animate={
        floating
          ? {
              y: [0, -6, 0],
              transition: {
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }
          : undefined
      }
      className={`relative overflow-hidden group bg-[#080d17] ${containerClassName}`}
    >
      {/* Subtle Dark Skeleton/Placeholder to prevent layout shift */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#080d17]/80 backdrop-blur-xs transition-opacity duration-300 pointer-events-none" />
      )}

      {/* Picture wrapper with responsive AVIF and WebP sources */}
      <picture className="w-full h-full block">
        {computedAvifSrcSet && (
          <source
            type="image/avif"
            srcSet={computedAvifSrcSet}
            sizes={computedSizes}
          />
        )}
        {computedWebpSrcSet && (
          <source
            type="image/webp"
            srcSet={computedWebpSrcSet}
            sizes={computedSizes}
          />
        )}
        <motion.img
          src={computedSrc}
          srcSet={computedSrcSet}
          sizes={computedSizes}
          width={width}
          height={height}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          // @ts-ignore fetchpriority is valid in HTML5 and React 18.2+
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setIsLoaded(true)}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          whileHover={
            hoverEffect === 'zoom'
              ? { scale: 1.06, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
              : undefined
          }
          className={`w-full h-full object-cover transition-transform duration-500 ${className}`}
        />
      </picture>

      {/* Subtle Shine Reflection on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      {/* Optional Overlay Content */}
      {overlay}
    </motion.div>
  );
};

