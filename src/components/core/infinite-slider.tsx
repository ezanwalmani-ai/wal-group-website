import React, { ReactNode, useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useAnimationFrame } from 'motion/react';

export interface InfiniteSliderProps {
  children: ReactNode;
  gap?: number;
  speed?: number;
  speedOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
}

export function InfiniteSlider({
  children,
  gap = 24,
  speed = 40,
  speedOnHover,
  direction = 'horizontal',
  reverse = false,
  className = '',
}: InfiniteSliderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentSize, setContentSize] = useState(0);

  const translation = useMotionValue(0);

  useEffect(() => {
    const updateSize = () => {
      if (contentRef.current) {
        const size = direction === 'horizontal' 
          ? contentRef.current.scrollWidth 
          : contentRef.current.scrollHeight;
        setContentSize(size + gap);
      }
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    if (contentRef.current) {
      ro.observe(contentRef.current);
    }

    window.addEventListener('resize', updateSize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [children, gap, direction]);

  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion || contentSize === 0) return;

    const currentSpeed = isHovered && speedOnHover !== undefined ? speedOnHover : speed;
    if (currentSpeed === 0) return;

    const moveBy = (currentSpeed * (delta / 1000));
    let nextValue = translation.get();

    if (reverse) {
      nextValue += moveBy;
      if (nextValue >= 0) {
        nextValue -= contentSize;
      }
    } else {
      nextValue -= moveBy;
      if (nextValue <= -contentSize) {
        nextValue += contentSize;
      }
    }

    translation.set(nextValue);
  });

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`overflow-hidden select-none w-full ${className}`}
    >
      <motion.div
        style={{
          display: 'flex',
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
          gap: `${gap}px`,
          x: direction === 'horizontal' ? translation : 0,
          y: direction === 'vertical' ? translation : 0,
          width: direction === 'horizontal' ? 'max-content' : undefined,
          height: direction === 'vertical' ? 'max-content' : undefined,
          willChange: 'transform',
        }}
      >
        <div 
          ref={contentRef} 
          className={`flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} shrink-0`}
          style={{ gap: `${gap}px` }}
        >
          {children}
        </div>
        <div 
          className={`flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} shrink-0`}
          style={{ gap: `${gap}px` }}
          aria-hidden="true"
        >
          {children}
        </div>
        <div 
          className={`flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} shrink-0`}
          style={{ gap: `${gap}px` }}
          aria-hidden="true"
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export default InfiniteSlider;
