import React from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowUpRight } from 'lucide-react';
import { soundFx } from '../utils/audio';

export type EmailAddress = 'thewalgroupinfo@gmail.com' | 'thewalgroups@gmail.com' | 'thewalgroup@gmail.com' | string;

interface EmailLinkProps {
  email: EmailAddress;
  label?: string;
  variant?: 'card' | 'inline' | 'compact' | 'badge';
  className?: string;
  subject?: string;
  body?: string;
}

export const EMAIL_DETAILS: Record<string, {
  email: string;
  label: string;
  description: string;
  badge: string;
  subject: string;
  body: string;
}> = {
  'thewalgroupinfo@gmail.com': {
    email: 'thewalgroupinfo@gmail.com',
    label: 'Support & Business Enquiries',
    description: 'For client support, technical help, DSP/AFP onboarding & general business enquiries.',
    badge: 'Support & Business',
    subject: 'Business Enquiry - Wal Group',
    body: `Hello Wal Group Team,

I would like to know more about your services.

Company Name:

Country:

Service Interested In:

Message:

Regards,`,
  },
  'thewalgroups@gmail.com': {
    email: 'thewalgroups@gmail.com',
    label: 'General Enquiries',
    description: 'For general inquiries, partnerships, media, vendor proposals & corporate communications.',
    badge: 'General Enquiries',
    subject: 'General Enquiry - Wal Group',
    body: `Hello Wal Group,

I have an enquiry regarding your business.

Message:

Thank you.`,
  },
  'thewalgroup@gmail.com': {
    email: 'thewalgroups@gmail.com',
    label: 'General Enquiries',
    description: 'For general inquiries, partnerships, media, vendor proposals & corporate communications.',
    badge: 'General Enquiries',
    subject: 'General Enquiry - Wal Group',
    body: `Hello Wal Group,

I have an enquiry regarding your business.

Message:

Thank you.`,
  }
};

export const EmailLink: React.FC<EmailLinkProps> = ({
  email,
  label,
  variant = 'card',
  className = '',
  subject,
  body,
}) => {
  const info = EMAIL_DETAILS[email] || {
    email,
    label: 'Email Us',
    description: 'Reach out to the Wal Group executive team directly via email.',
    badge: 'Contact',
    subject: 'Enquiry - Wal Group',
    body: `Hello Wal Group Team,\n\nI have an enquiry regarding your business.\n\nRegards,`
  };

  const displayEmail = info.email;
  const displayLabel = label || info.label;
  const finalSubject = subject || info.subject;
  const finalBody = body !== undefined ? body : info.body;

  const mailToUrl = `mailto:${displayEmail}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(finalBody)}`;

  const handleClick = () => {
    soundFx.playClick();
  };

  const handleHover = () => {
    soundFx.playHover();
  };

  if (variant === 'badge' || variant === 'compact') {
    return (
      <motion.a
        href={mailToUrl}
        onClick={handleClick}
        onMouseEnter={handleHover}
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        className={`inline-flex items-center gap-2 group cursor-pointer px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#ff7700] hover:bg-[#ff7700]/10 transition-all duration-250 ${className}`}
        title={`Send email to ${displayEmail}`}
      >
        <Mail className="w-3.5 h-3.5 text-[#ff7700] shrink-0 transform group-hover:rotate-12 transition-transform duration-300" />
        <span className="text-xs font-bold text-slate-200 group-hover:text-[#ff7700] transition-colors">{displayEmail}</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#ff7700] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
      </motion.a>
    );
  }

  if (variant === 'inline') {
    return (
      <motion.a
        href={mailToUrl}
        onClick={handleClick}
        onMouseEnter={handleHover}
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#ff7700] hover:bg-[#ff7700]/10 hover:shadow-[0_0_20px_rgba(255,119,0,0.25)] transition-all duration-250 cursor-pointer group relative overflow-hidden ${className}`}
        title={`Click to send email to ${displayEmail}`}
      >
        {/* Subtle glass reflection light sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

        <div className="flex items-center gap-3 truncate">
          <div className="w-8 h-8 rounded-lg bg-[#ff7700]/10 border border-[#ff7700]/30 flex items-center justify-center shrink-0 group-hover:bg-[#ff7700] transition-colors duration-250 shadow-sm">
            <Mail className="w-4 h-4 text-[#ff7700] group-hover:text-black transition-colors transform group-hover:rotate-12 duration-300" />
          </div>
          <div className="truncate">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{displayLabel}</div>
            <div className="text-xs font-bold text-white group-hover:text-[#ff7700] transition-colors truncate">{displayEmail}</div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400 group-hover:text-[#ff7700] text-xs font-semibold shrink-0 transition-colors">
          <span className="text-[11px] hidden sm:inline">Send</span>
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#ff7700]" />
        </div>
      </motion.a>
    );
  }

  // Card Variant
  return (
    <motion.a
      href={mailToUrl}
      onClick={handleClick}
      onMouseEnter={handleHover}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`glass-panel p-5 rounded-2xl border border-white/10 hover:border-[#ff7700] hover:shadow-[0_0_25px_rgba(255,119,0,0.3)] transition-all duration-250 cursor-pointer block group relative overflow-hidden ${className}`}
      title={`Click to compose email to ${displayEmail}`}
    >
      {/* Subtle glass reflection light sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="px-2.5 py-0.5 rounded-full bg-[#ff7700]/10 border border-[#ff7700]/30 text-[10px] font-bold text-[#ff7700] uppercase tracking-wider flex items-center gap-1.5">
          <Mail className="w-3 h-3 text-[#ff7700] transform group-hover:rotate-12 transition-transform duration-300" />
          <span>{displayLabel}</span>
        </span>

        <div className="flex items-center gap-1 text-slate-400 group-hover:text-[#ff7700] text-xs font-semibold transition-colors">
          <span className="text-[11px] font-medium">Send Email</span>
          <ArrowUpRight className="w-4 h-4 text-[#ff7700] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <div className="w-10 h-10 rounded-xl bg-[#ff7700]/10 border border-[#ff7700]/30 flex items-center justify-center shrink-0 group-hover:bg-[#ff7700] group-hover:border-[#ff7700] transition-all duration-250 shadow-md">
          <Mail className="w-5 h-5 text-[#ff7700] group-hover:text-black transition-colors duration-250 transform group-hover:rotate-12" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm sm:text-base font-extrabold text-white group-hover:text-[#ff7700] transition-colors truncate">
            {displayEmail}
          </div>
          <p className="text-xs text-slate-400 font-normal leading-relaxed mt-1">
            {info.description}
          </p>
        </div>
      </div>
    </motion.a>
  );
};
