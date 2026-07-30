import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface PremiumImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  glowColor?: string;
  glow?: boolean;
}

export const PremiumImage: React.FC<PremiumImageProps> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  glowColor = 'rgba(255, 122, 0, 0.15)',
  glow = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [reflectionKey, setReflectionKey] = useState(0);

  // Interval light reflection sweep every 12 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setReflectionKey((prev) => prev + 1);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Normalize -1 to 1 and map to max 7px translation
    const deltaX = ((e.clientX - centerX) / (rect.width / 2)) * 7;
    const deltaY = ((e.clientY - centerY) / (rect.height / 2)) * 7;
    setMousePos({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative group rounded-2xl ${className}`}
      style={{ isolation: 'isolate' }}
    >
      {/* Ambient Orange Glow behind image */}
      {glow && (
        <motion.div
          animate={{
            opacity: isHovered ? 0.35 : 0.12,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute -inset-4 rounded-3xl blur-2xl pointer-events-none z-0"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, rgba(255, 122, 0, 0) 70%)`,
          }}
        />
      )}

      {/* Main Image Container with Scroll Reveal & Parallax */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97, filter: 'blur(8px)' }}
        animate={
          isInView
            ? {
                opacity: 1,
                y: mousePos.y,
                x: mousePos.x,
                scale: isHovered ? 1.03 : 1,
                filter: 'blur(0px)',
              }
            : { opacity: 0, y: 30, scale: 0.97, filter: 'blur(8px)' }
        }
        transition={{
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative overflow-hidden rounded-2xl z-10 w-full h-full border border-white/10"
        style={{
          boxShadow: isHovered
            ? `0 24px 48px -12px rgba(0, 0, 0, 0.85), ${mousePos.x * 2}px ${20 + mousePos.y * 2}px 30px rgba(255, 122, 0, 0.25)`
            : '0 16px 32px -10px rgba(0, 0, 0, 0.7)',
          willChange: 'transform, opacity, filter',
        }}
      >
        {/* Actual Image */}
        <motion.img
          src={src}
          alt={alt}
          animate={{
            filter: isHovered
              ? 'brightness(1.04) contrast(1.03)'
              : 'brightness(1) contrast(1)',
          }}
          transition={{ duration: 0.4 }}
          className={`w-full h-full object-cover transition-transform duration-700 ${imgClassName}`}
          loading="lazy"
        />

        {/* Premium Glass Reflection Sweep Layer */}
        <motion.div
          key={`reflection-${reflectionKey}`}
          initial={{ x: '-150%' }}
          animate={isHovered ? { x: '150%' } : { x: ['-150%', '150%'] }}
          transition={
            isHovered
              ? { duration: 0.85, ease: 'easeInOut' }
              : { duration: 1.2, ease: 'easeInOut', delay: 0.2 }
          }
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background:
              'linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.12) 45%, rgba(255, 140, 26, 0.18) 50%, rgba(255, 255, 255, 0.12) 55%, transparent 80%)',
            transform: 'skewX(-20deg)',
          }}
        />

        {/* Subtle Dark Gradient Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none z-15" />
      </motion.div>
    </div>
  );
};
