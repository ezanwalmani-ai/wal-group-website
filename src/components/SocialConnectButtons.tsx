import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Mail } from 'lucide-react';
import { INSTAGRAM_URL } from './InstagramLink';
import { useBehavior } from '../context/BehaviorContext';
import { soundFx } from '../utils/audio';

interface SocialConnectButtonsProps {
  className?: string;
  showLabels?: boolean;
  source?: string;
}

export const WHATSAPP_NUMBER = '6363698148';
export const WHATSAPP_INTERNATIONAL = '+91 6363698148';
export const WHATSAPP_URL = 'https://wa.me/916363698148';
export const OFFICIAL_EMAIL = 'thewalgroups@gmail.com';
export const LINKEDIN_URL = 'https://www.linkedin.com/company/wal-groups/';

export const SocialConnectButtons: React.FC<SocialConnectButtonsProps> = ({
  className = '',
  source = 'footer_social_icons',
}) => {
  const { trackContactClick } = useBehavior();

  const handleLinkClick = (
    method: 'whatsapp' | 'email' | 'linkedin' | 'instagram',
    target: string,
    label: string
  ) => {
    soundFx.playClick();
    trackContactClick(method, {
      source,
      target,
      label
    });
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* LinkedIn */}
      <motion.a
        whileHover={{ y: -3, scale: 1.08, shadow: '0 0 20px rgba(10, 102, 194, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        href={LINKEDIN_URL}
        onClick={() => handleLinkClick('linkedin', LINKEDIN_URL, 'LinkedIn Profile')}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-all shadow-sm relative group overflow-hidden"
        title="Wal Group on LinkedIn"
        aria-label="LinkedIn"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      </motion.a>

      {/* Instagram */}
      <motion.a
        whileHover={{ y: -3, scale: 1.08, shadow: '0 0 20px rgba(255, 119, 0, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        href={INSTAGRAM_URL}
        onClick={() => handleLinkClick('instagram', INSTAGRAM_URL, 'Instagram Channel')}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent transition-all shadow-sm relative group overflow-hidden"
        title="Wal Group on Instagram (@thewalgroups)"
        aria-label="Instagram"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
        <Instagram className="w-5 h-5 stroke-[2]" />
      </motion.a>

      {/* WhatsApp */}
      <motion.a
        whileHover={{ y: -3, scale: 1.08, shadow: '0 0 20px rgba(37, 211, 102, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        href={WHATSAPP_URL}
        onClick={() => handleLinkClick('whatsapp', WHATSAPP_INTERNATIONAL, 'WhatsApp Chat')}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#25D366] hover:border-[#25D366] transition-all shadow-sm relative group overflow-hidden"
        title={`Chat on WhatsApp (${WHATSAPP_INTERNATIONAL})`}
        aria-label="WhatsApp"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.35C9.33 7.35 9.01 7.42 8.74 7.71C8.47 8 7.71 8.72 7.71 10.18C7.71 11.64 8.77 13.04 8.92 13.24C9.07 13.44 11.13 16.61 14.28 17.97C17.29 19.26 17.29 18.46 17.84 18.41C18.39 18.36 19.61 17.69 19.86 16.99C20.11 16.29 20.11 15.69 20.03 15.56C19.96 15.44 19.76 15.36 19.46 15.21C19.16 15.06 17.7 14.34 17.43 14.24C17.15 14.14 16.96 14.09 16.76 14.39C16.56 14.69 15.99 15.36 15.81 15.56C15.64 15.76 15.46 15.79 15.16 15.64C14.86 15.49 13.9 15.18 12.77 14.17C11.89 13.38 11.3 12.41 11.13 12.11C10.95 11.81 11.11 11.65 11.26 11.5C11.39 11.37 11.56 11.15 11.71 10.97C11.86 10.8 11.91 10.67 12.01 10.47C12.11 10.27 12.06 10.1 11.99 9.95C11.91 9.8 11.33 8.36 11.08 7.77C10.85 7.19 10.61 7.27 10.43 7.26C10.26 7.25 10.06 7.25 9.86 7.25L9.53 7.35Z" />
        </svg>
      </motion.a>

      {/* Email (thewalgroups@gmail.com) */}
      <motion.a
        whileHover={{ y: -3, scale: 1.08, shadow: '0 0 20px rgba(255, 119, 0, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        href={`mailto:${OFFICIAL_EMAIL}`}
        onClick={() => handleLinkClick('email', OFFICIAL_EMAIL, 'Email Direct')}
        className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-black hover:bg-[#ff7700] hover:border-[#ff7700] transition-all shadow-sm relative group overflow-hidden"
        title={`Send email to ${OFFICIAL_EMAIL}`}
        aria-label={`Email ${OFFICIAL_EMAIL}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
        <Mail className="w-5 h-5 stroke-[2]" />
      </motion.a>
    </div>
  );
};
