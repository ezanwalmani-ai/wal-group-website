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
  duration = 0.4,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '200px 0px 50px 0px' }}
      transition={{
        duration: duration,
        ease: [0.22, 1, 0.36, 1],
        delay: delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
