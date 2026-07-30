import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface CinematicSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const CinematicSection: React.FC<CinematicSectionProps> = ({
  children,
  className = '',
  id,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track progress of this section through the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Entrance (0 to 0.2), Middle focus (0.2 to 0.75), Exit (0.75 to 1)
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.75, 1],
    [0.1, 1, 1, 0.88]
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 0.15, 0.75, 1],
    [0.97, 1, 1, 0.98]
  );

  const blur = useTransform(
    scrollYProgress,
    [0, 0.15, 0.75, 1],
    ['blur(6px)', 'blur(0px)', 'blur(0px)', 'blur(3px)']
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.15, 0.75, 1],
    [24, 0, 0, -16]
  );

  return (
    <motion.section
      ref={containerRef}
      id={id}
      style={{
        opacity,
        scale,
        filter: blur,
        y,
        willChange: 'opacity, transform, filter',
      }}
      className={`relative transition-colors duration-700 ${className}`}
    >
      {children}
    </motion.section>
  );
};
