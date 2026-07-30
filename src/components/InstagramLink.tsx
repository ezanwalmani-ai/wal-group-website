import React from 'react';
import { motion } from 'motion/react';
import { Instagram, ExternalLink } from 'lucide-react';

interface InstagramLinkProps {
  variant?: 'card' | 'inline' | 'compact';
  className?: string;
}

export const INSTAGRAM_URL = 'https://www.instagram.com/thewalgroup?igsh=MW10OXZqM2N4YXhvbQ==';
export const INSTAGRAM_HANDLE = '@thewalgroup';

export const InstagramLink: React.FC<InstagramLinkProps> = ({
  variant = 'card',
  className = '',
}) => {
  if (variant === 'inline' || variant === 'compact') {
    return (
      <motion.a
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#ff7700]/50 hover:bg-[#ff7700]/10 transition-all group relative overflow-hidden ${className}`}
      >
        {/* Subtle glass reflection light sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

        <div className="flex items-center gap-2.5 truncate">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shrink-0 shadow-sm group-hover:shadow-[0_0_12px_rgba(255,119,0,0.5)] transition-shadow">
            <Instagram className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <div className="truncate">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Official Instagram</div>
            <div className="text-xs font-bold text-white group-hover:text-[#ff7700] transition-colors truncate">{INSTAGRAM_HANDLE}</div>
          </div>
        </div>

        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#ff7700] transition-colors shrink-0" />
      </motion.a>
    );
  }

  return (
    <motion.a
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`glass-panel p-4 rounded-2xl border border-white/10 hover:border-[#ff7700]/50 hover:shadow-[0_0_25px_rgba(255,119,0,0.25)] transition-all group relative overflow-hidden block ${className}`}
    >
      {/* Subtle glass reflection light sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="px-2.5 py-0.5 rounded-full bg-[#ff7700]/10 border border-[#ff7700]/30 text-[10px] font-bold text-[#ff7700] uppercase tracking-wider flex items-center gap-1">
          <Instagram className="w-3 h-3 text-[#ff7700]" />
          <span>Official Social Profile</span>
        </span>
        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#ff7700] transition-colors" />
      </div>

      <div className="flex items-center gap-3 pt-1">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shrink-0 shadow-md group-hover:shadow-[0_0_15px_rgba(255,119,0,0.6)] transition-shadow">
          <Instagram className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <div className="text-base font-extrabold text-white group-hover:text-[#ff7700] transition-colors">
            {INSTAGRAM_HANDLE}
          </div>
          <div className="text-xs text-slate-400 font-normal">
            Follow Wal Group on Instagram for official updates &amp; media
          </div>
        </div>
      </div>
    </motion.a>
  );
};
