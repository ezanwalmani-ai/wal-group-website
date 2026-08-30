import React, { useState } from 'react';
import { motion } from 'motion/react';
import { getUnsplashSrcSet, getOptimizedUnsplashUrl } from '../lib/imageOptimizer';

export interface AnimatedImageProps {
  src: string;
  srcSet?: string;
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
  sizes,
  width,
  height,
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

  // Auto-generate responsive srcset for Unsplash images if not explicitly provided
  const computedSrc = src.includes('images.unsplash.com') && !src.includes('w=')
    ? getOptimizedUnsplashUrl(src, priority ? 1600 : 800)
    : src;

  const computedSrcSet = srcSet || (src.includes('images.unsplash.com')
    ? getUnsplashSrcSet(src, [480, 800, 1200, 1600])
    : undefined);

  const computedSizes = sizes || (computedSrcSet ? '(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 1200px' : undefined);

  // Define entrance variants based on prop
  const getEntranceVariants = () => {
    switch (entranceAnimation) {
      case 'fadeIn':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
        };
      case 'slideUp':
        return {
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
        };
      case 'slideLeft':
        return {
          hidden: { opacity: 0, x: -30 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
        };
      case 'slideRight':
        return {
          hidden: { opacity: 0, x: 30 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
        };
      case 'scaleUp':
      default:
        return {
          hidden: { opacity: 0, scale: 0.94, y: 15 },
          visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
        };
    }
  };

  // Hover animations
  const getHoverAnimation = () => {
    switch (hoverEffect) {
      case 'lift':
        return { y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } };
      case 'glow':
        return { scale: 1.02, boxShadow: '0 0 25px rgba(255, 102, 0, 0.35)', transition: { duration: 0.4 } };
      case 'tilt':
        return { rotate: 1.5, scale: 1.03, transition: { type: 'spring', stiffness: 250, damping: 18 } };
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
      viewport={{ once: true, margin: '-50px' }}
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
      {/* Subtle Dark Placeholder to prevent layout shift */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#080d17]/80 backdrop-blur-xs transition-opacity duration-300 pointer-events-none" />
      )}

      {/* Main Animated Image with Responsive srcSet and high-efficiency loading */}
      <motion.img
        src={computedSrc}
        srcSet={computedSrcSet}
        sizes={computedSizes}
        width={width}
        height={height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setIsLoaded(true)}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        whileHover={
          hoverEffect === 'zoom'
            ? { scale: 1.07, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
            : undefined
        }
        className={`w-full h-full object-cover transition-transform duration-500 ${className}`}
      />

      {/* Subtle Shine Reflection on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      {/* Optional Overlay Content */}
      {overlay}
    </motion.div>
  );
};
