import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'motion/react';
import { soundFx } from '../utils/audio';

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // Distance pull multiplier, default 0.35
  playSoundOnHover?: boolean;
}

export const Magnetic: React.FC<MagneticProps> = ({ 
  children, 
  className = '',
  strength = 0.35,
  playSoundOnHover = true
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { damping: 18, stiffness: 200 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;

    // Cap maximum offset to 12px
    const maxOffset = 12;
    const clampedX = Math.max(-maxOffset, Math.min(maxOffset, distanceX));
    const clampedY = Math.max(-maxOffset, Math.min(maxOffset, distanceY));

    x.set(clampedX);
    y.set(clampedY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (playSoundOnHover) {
      soundFx.playHover();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`inline-block ${className}`}
    >
      <motion.div
        animate={{ scale: isHovered ? 1.02 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
