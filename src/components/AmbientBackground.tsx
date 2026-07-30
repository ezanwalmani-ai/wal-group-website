import React from 'react';
import { motion } from 'motion/react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Top-Right Floating Animated Orange Mesh Orb */}
      <motion.div 
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.95, 1],
          opacity: [0.08, 0.12, 0.07, 0.08],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-[10%] -right-[10%] w-[55vw] h-[55vw] rounded-full blur-[140px]"
        style={{
          background: 'radial-gradient(circle, #ff6600 0%, #ff8800 40%, transparent 70%)',
          willChange: 'transform, opacity',
        }}
      />

      {/* Center-Left Floating Soft Warm Amber Orb */}
      <motion.div 
        animate={{
          x: [0, -35, 25, 0],
          y: [0, 40, -25, 0],
          scale: [1, 0.9, 1.08, 1],
          opacity: [0.05, 0.09, 0.04, 0.05],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[35%] -left-[15%] w-[50vw] h-[50vw] rounded-full blur-[150px]"
        style={{
          background: 'radial-gradient(circle, #ff8800 0%, #ffaa00 45%, transparent 70%)',
          willChange: 'transform, opacity',
        }}
      />

      {/* Bottom-Right Breathing Accent Orb */}
      <motion.div 
        animate={{
          x: [0, 25, -30, 0],
          y: [0, -20, 30, 0],
          scale: [1, 1.05, 0.92, 1],
          opacity: [0.06, 0.1, 0.05, 0.06],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-[12%] right-[8%] w-[45vw] h-[45vw] rounded-full blur-[130px]"
        style={{
          background: 'radial-gradient(circle, #ff7700 0%, transparent 70%)',
          willChange: 'transform, opacity',
        }}
      />

      {/* Micro Grid Ambient Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 102, 0, 0.4) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Subtle Noise Texture for Cinematic Depth */}
      <div 
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
