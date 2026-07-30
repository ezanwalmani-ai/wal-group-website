import React from 'react';
import { motion } from 'motion/react';

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export const MotionSection: React.FC<MotionSectionProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        type: 'spring',
        stiffness: 80,
        damping: 18,
        duration: duration,
        delay: delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
