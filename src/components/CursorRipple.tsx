import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export const CursorRipple: React.FC = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const id = Date.now() + Math.random();
    const newRipple: Ripple = {
      id,
      x: e.clientX,
      y: e.clientY,
    };

    setRipples((prev) => [...prev.slice(-10), newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 500);
  }, []);

  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [handleMouseDown]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{
              scale: 0.15,
              opacity: 0.9,
              filter: 'blur(1px)',
            }}
            animate={{
              scale: 9.5,
              opacity: 0,
              filter: 'blur(10px)',
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1], // Spring-like smooth acceleration
            }}
            style={{
              position: 'absolute',
              left: ripple.x - 6,
              top: ripple.y - 6,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 122, 0, 0.9) 0%, rgba(255, 140, 26, 0.4) 45%, rgba(255, 122, 0, 0) 80%)',
              boxShadow: '0 0 25px rgba(255, 122, 0, 0.7), 0 0 10px rgba(255, 140, 26, 0.5)',
              willChange: 'transform, opacity, filter',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
