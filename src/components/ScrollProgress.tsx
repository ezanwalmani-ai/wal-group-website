import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[100] pointer-events-none overflow-hidden">
      {/* Track background */}
      <div className="w-full h-full bg-white/5" />
      
      {/* Progress fill */}
      <motion.div
        className="absolute top-0 left-0 bottom-0 right-0 origin-left bg-gradient-to-r from-[#ff6600] via-[#ff9933] to-[#ff6600] rounded-r-full shadow-[0_0_12px_rgba(255,102,0,0.8)]"
        style={{ scaleX }}
      >
        {/* Subtle light sweep traveling across filled portion */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" 
             style={{ backgroundSize: '200% 100%' }} />
      </motion.div>
    </div>
  );
};
