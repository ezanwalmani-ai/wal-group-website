import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'motion/react';

export const MouseSpotlight: React.FC = () => {
  const [isMobile, setIsMobile] = useState(true);

  const springConfig = { damping: 28, stiffness: 220, mass: 0.5 };
  const mouseX = useSpring(-200, springConfig);
  const mouseY = useSpring(-200, springConfig);

  useEffect(() => {
    // Disable on touch devices or small screens
    const checkIsMobile = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(hasTouch || window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('resize', checkIsMobile);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile, mouseX, mouseY]);

  if (isMobile) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-30 pointer-events-none"
      style={{
        x: mouseX,
        y: mouseY,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Outer Soft Orange Radial Aura */}
      <div className="w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,102,0,0.07)_0%,rgba(255,102,0,0.02)_40%,transparent_70%)] blur-[80px]" />
    </motion.div>
  );
};
