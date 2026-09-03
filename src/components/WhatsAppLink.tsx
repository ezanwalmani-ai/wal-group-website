import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { WHATSAPP_URL, WHATSAPP_INTERNATIONAL, WHATSAPP_NUMBER } from './SocialConnectButtons';
import { useBehavior } from '../context/BehaviorContext';
import { soundFx } from '../utils/audio';

interface WhatsAppLinkProps {
  variant?: 'card' | 'inline' | 'compact';
  className?: string;
  source?: string;
}

export const WhatsAppLink: React.FC<WhatsAppLinkProps> = ({
  variant = 'card',
  className = '',
  source = 'footer_contact_column',
}) => {
  const { trackContactClick } = useBehavior();

  const handleClick = () => {
    soundFx.playClick();
    trackContactClick('whatsapp', {
      source,
      target: WHATSAPP_INTERNATIONAL,
      label: 'Official WhatsApp Direct'
    });
  };

  if (variant === 'inline' || variant === 'compact') {
    return (
      <motion.a
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        href={WHATSAPP_URL}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#25D366]/50 hover:bg-[#25D366]/10 transition-all group relative overflow-hidden ${className}`}
        title={`Chat with Wal Group on WhatsApp (${WHATSAPP_INTERNATIONAL})`}
      >
        {/* Subtle glass reflection light sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

        <div className="flex items-center gap-2.5 truncate">
          <div className="w-7 h-7 rounded-lg bg-[#25D366] flex items-center justify-center text-white shrink-0 shadow-sm group-hover:shadow-[0_0_12px_rgba(37,211,102,0.5)] transition-shadow">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.35C9.33 7.35 9.01 7.42 8.74 7.71C8.47 8 7.71 8.72 7.71 10.18C7.71 11.64 8.77 13.04 8.92 13.24C9.07 13.44 11.13 16.61 14.28 17.97C17.29 19.26 17.29 18.46 17.84 18.41C18.39 18.36 19.61 17.69 19.86 16.99C20.11 16.29 20.11 15.69 20.03 15.56C19.96 15.44 19.76 15.36 19.46 15.21C19.16 15.06 17.7 14.34 17.43 14.24C17.15 14.14 16.96 14.09 16.76 14.39C16.56 14.69 15.99 15.36 15.81 15.56C15.64 15.76 15.46 15.79 15.16 15.64C14.86 15.49 13.9 15.18 12.77 14.17C11.89 13.38 11.3 12.41 11.13 12.11C10.95 11.81 11.11 11.65 11.26 11.5C11.39 11.37 11.56 11.15 11.71 10.97C11.86 10.8 11.91 10.67 12.01 10.47C12.11 10.27 12.06 10.1 11.99 9.95C11.91 9.8 11.33 8.36 11.08 7.77C10.85 7.19 10.61 7.27 10.43 7.26C10.26 7.25 10.06 7.25 9.86 7.25L9.53 7.35Z" />
            </svg>
          </div>
          <div className="truncate">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Official WhatsApp</div>
            <div className="text-xs font-bold text-white group-hover:text-[#25D366] transition-colors truncate">{WHATSAPP_INTERNATIONAL}</div>
          </div>
        </div>

        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#25D366] transition-colors shrink-0" />
      </motion.a>
    );
  }

  return (
    <motion.a
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      href={WHATSAPP_URL}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className={`glass-panel p-4 rounded-2xl border border-white/10 hover:border-[#25D366]/50 hover:shadow-[0_0_25px_rgba(37,211,102,0.25)] transition-all group relative overflow-hidden block ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="px-2.5 py-0.5 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-[10px] font-bold text-[#25D366] uppercase tracking-wider flex items-center gap-1">
          <span>Official WhatsApp Direct</span>
        </span>
        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#25D366] transition-colors" />
      </div>

      <div className="flex items-center gap-3 pt-1">
        <div className="w-9 h-9 rounded-xl bg-[#25D366] flex items-center justify-center text-white shrink-0 shadow-md group-hover:shadow-[0_0_15px_rgba(37,211,102,0.6)] transition-shadow">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.35C9.33 7.35 9.01 7.42 8.74 7.71C8.47 8 7.71 8.72 7.71 10.18C7.71 11.64 8.77 13.04 8.92 13.24C9.07 13.44 11.13 16.61 14.28 17.97C17.29 19.26 17.29 18.46 17.84 18.41C18.39 18.36 19.61 17.69 19.86 16.99C20.11 16.29 20.11 15.69 20.03 15.56C19.96 15.44 19.76 15.36 19.46 15.21C19.16 15.06 17.7 14.34 17.43 14.24C17.15 14.14 16.96 14.09 16.76 14.39C16.56 14.69 15.99 15.36 15.81 15.56C15.64 15.76 15.46 15.79 15.16 15.64C14.86 15.49 13.9 15.18 12.77 14.17C11.89 13.38 11.3 12.41 11.13 12.11C10.95 11.81 11.11 11.65 11.26 11.5C11.39 11.37 11.56 11.15 11.71 10.97C11.86 10.8 11.91 10.67 12.01 10.47C12.11 10.27 12.06 10.1 11.99 9.95C11.91 9.8 11.33 8.36 11.08 7.77C10.85 7.19 10.61 7.27 10.43 7.26C10.26 7.25 10.06 7.25 9.86 7.25L9.53 7.35Z" />
          </svg>
        </div>
        <div>
          <div className="text-base font-extrabold text-white group-hover:text-[#25D366] transition-colors">
            {WHATSAPP_INTERNATIONAL}
          </div>
          <div className="text-xs text-slate-400 font-normal">
            Message Wal Group on WhatsApp for quick inquiries &amp; dispatch assistance
          </div>
        </div>
      </div>
    </motion.a>
  );
};
