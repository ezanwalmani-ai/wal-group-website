import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  onClick,
  size = 'md'
}) => {
  // Size configurations
  const iconSizes = {
    sm: 'w-8 h-8 p-1',
    md: 'w-10 h-10 sm:w-11 sm:h-11 p-1.5',
    lg: 'w-14 h-14 sm:w-16 sm:h-16 p-2'
  };

  const textWalSizes = {
    sm: 'text-base font-black leading-none tracking-wider',
    md: 'text-xl sm:text-2xl font-black leading-none tracking-wider',
    lg: 'text-2xl sm:text-3xl font-black leading-none tracking-wider'
  };

  const textGroupsSizes = {
    sm: 'text-[11px] font-extrabold leading-none tracking-[0.2em]',
    md: 'text-[13px] sm:text-[15px] font-extrabold leading-none tracking-[0.22em]',
    lg: 'text-[16px] sm:text-[18px] font-extrabold leading-none tracking-[0.25em]'
  };

  return (
    <div
      onClick={onClick}
      className={`group inline-flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none ${className}`}
      title="WAL GROUP"
    >
      {/* Precision Hexagonal Logo Icon */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`relative flex items-center justify-center ${iconSizes[size]} transition-all duration-300`}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_12px_rgba(255,102,0,0.4)] group-hover:drop-shadow-[0_0_20px_rgba(255,102,0,0.75)] transition-all duration-300"
        >
          <defs>
            {/* Bright Orange Gradient for W monogram */}
            <linearGradient id="walWMonoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff8800" />
              <stop offset="50%" stopColor="#ff5500" />
              <stop offset="100%" stopColor="#e64400" />
            </linearGradient>

            {/* Hexagon Border Stroke Gradient */}
            <linearGradient id="walHexBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff8800" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#802b00" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#331100" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Hexagon Outer Frame */}
          <polygon
            points="50,4 92,26 92,74 50,96 8,74 8,26"
            stroke="url(#walHexBorder)"
            strokeWidth="4.5"
            strokeLinejoin="round"
            className="group-hover:stroke-[#ff6600] transition-colors duration-300"
            fill="#0d0d12"
          />

          {/* Glowing Inner 'W' Monogram - Bold Geometry directly styled after Wal Group brand */}
          {/* Left Stem */}
          <path
            d="M22 30 L35 74 L46 44 L38 32 Z"
            fill="url(#walWMonoGrad)"
          />

          {/* Right Stem */}
          <path
            d="M78 30 L65 74 L54 44 L62 32 Z"
            fill="url(#walWMonoGrad)"
          />

          {/* Center Interlocking V Chevron */}
          <path
            d="M36 68 L50 32 L64 68 L56 68 L50 48 L44 68 Z"
            fill="#ff7700"
          />
        </svg>
      </motion.div>

      {/* Brand Name Typography */}
      <div className="flex flex-col justify-center">
        {/* WAL in bold white */}
        <span className={`text-white font-black uppercase tracking-wider group-hover:text-[#ff7700] transition-colors duration-300 ${textWalSizes[size]}`}>
          WAL
        </span>

        {/* GROUPS in bold orange right below */}
        <span className={`text-[#ff6600] font-black uppercase tracking-[0.22em] mt-0.5 group-hover:text-white transition-colors duration-300 ${textGroupsSizes[size]}`}>
          GROUPS
        </span>
      </div>
    </div>
  );
};
