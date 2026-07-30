import React from 'react';
import { motion } from 'motion/react';

export const SectionDivider: React.FC = () => {
  return (
    <div className="relative w-full py-8 overflow-hidden pointer-events-none select-none my-2">
      {/* Top Gradient Fade Out */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#0a0a0a] to-transparent z-10" />

      {/* Center Precision Glowing Line with Light Pulse */}
      <div className="relative max-w-7xl mx-auto px-6 flex items-center justify-center">
        {/* Soft Background Glow Aura */}
        <div className="absolute w-2/3 h-1 bg-[#ff6600]/30 rounded-full blur-md" />

        {/* Hairline Border Line */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6600]/60 to-transparent relative overflow-hidden">
          {/* Animated Light Sweep Travelling Across Divider */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-[#ffaa00] to-transparent shadow-[0_0_10px_#ff6600]"
          />
        </div>

        {/* Center Glowing Micro Node */}
        <div className="absolute flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff6600] shadow-[0_0_12px_#ff6600]" />
          <div className="absolute w-5 h-5 rounded-full border border-[#ff6600]/40 animate-ping opacity-75" />
        </div>
      </div>

      {/* Bottom Gradient Fade In */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10" />
    </div>
  );
};
