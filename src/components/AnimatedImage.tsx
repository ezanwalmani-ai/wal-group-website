import React, { useState } from 'react';
import { motion } from 'motion/react';

export interface AnimatedImageProps {
  src: string;
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
      className={`relative overflow-hidden group ${containerClassName}`}
    >
      {/* Skeleton Loading Pulse */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-800/80 animate-pulse flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-[#ff6600]/40 border-t-[#ff6600] rounded-full animate-spin" />
        </div>
      )}

      {/* Main Animated Image */}
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setIsLoaded(true)}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
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
