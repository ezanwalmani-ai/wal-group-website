import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface InfiniteSliderProps {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
}

export const InfiniteSlider: React.FC<InfiniteSliderProps> = ({
  children,
  gap = 28,
  duration = 35,
  reverse = false,
  className = '',
}) => {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div className={`flex overflow-x-auto py-2 no-scrollbar ${className}`} style={{ gap: `${gap}px` }}>
        {children}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden w-full select-none ${className}`}>
      {/* Left/Right Progressive Fade Mask */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-black via-black/80 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-black via-black/80 to-transparent" />

      <motion.div
        className="flex w-max items-center"
        style={{ gap: `${gap}px` }}
        animate={{
          x: reverse ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration: duration,
          ease: 'linear',
        }}
      >
        <div className="flex items-center shrink-0" style={{ gap: `${gap}px` }}>
          {children}
        </div>
        <div className="flex items-center shrink-0" style={{ gap: `${gap}px` }} aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default InfiniteSlider;
