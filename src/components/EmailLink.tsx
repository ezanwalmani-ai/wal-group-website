import React, { useState } from 'react';
import { Mail, Copy, Check, ExternalLink } from 'lucide-react';

interface EmailLinkProps {
  email: 'thewalgroupinfo@gmail.com' | 'thewalgroup@gmail.com';
  label?: string;
  variant?: 'card' | 'inline' | 'compact' | 'badge';
  className?: string;
  subject?: string;
}

export const EMAIL_DETAILS = {
  'thewalgroupinfo@gmail.com': {
    email: 'thewalgroupinfo@gmail.com',
    label: 'Support & Business Enquiries',
    description: 'For client support, technical help, DSP/AFP onboarding & general business enquiries.',
    badge: 'Support & Business',
  },
  'thewalgroup@gmail.com': {
    email: 'thewalgroup@gmail.com',
    label: 'General Enquiries & Partnerships',
    description: 'For careers, recruitment, partnerships, media, vendors & business proposals.',
    badge: 'Partnerships & Careers',
  },
};

export const EmailLink: React.FC<EmailLinkProps> = ({
  email,
  label,
  variant = 'card',
  className = '',
  subject,
}) => {
  const [copied, setCopied] = useState(false);
  const info = EMAIL_DETAILS[email];
  const displayLabel = label || info.label;

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailToUrl = subject
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`;

  if (variant === 'badge' || variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 group ${className}`}>
        <a
          href={mailToUrl}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-[#ff7700] transition-colors"
        >
          <Mail className="w-3.5 h-3.5 text-[#ff7700] shrink-0" />
          <span>{email}</span>
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#ff7700]" />
        </a>
        <button
          onClick={handleCopy}
          type="button"
          title="Copy email address"
          className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          {copied ? (
            <Check className="w-3 h-3 text-emerald-400" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#ff7700]/50 transition-all ${className}`}>
        <a
          href={mailToUrl}
          className="flex items-center gap-2.5 text-xs font-semibold text-slate-200 hover:text-[#ff7700] transition-colors truncate"
        >
          <div className="w-7 h-7 rounded-lg bg-[#ff7700]/10 border border-[#ff7700]/30 flex items-center justify-center shrink-0">
            <Mail className="w-3.5 h-3.5 text-[#ff7700]" />
          </div>
          <div className="truncate">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{displayLabel}</div>
            <div className="text-xs font-bold text-white group-hover:text-[#ff7700] truncate">{email}</div>
          </div>
        </a>

        <button
          onClick={handleCopy}
          type="button"
          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#ff7700]/20 text-xs text-slate-300 hover:text-white border border-white/10 flex items-center gap-1 shrink-0 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-[11px] text-emerald-400 font-bold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-[#ff7700]" />
              <span className="text-[11px] font-medium">Copy</span>
            </>
          )}
        </button>
      </div>
    );
  }

  // Card Variant
  return (
    <div className={`glass-panel p-4 rounded-2xl border border-white/10 hover:border-[#ff7700]/40 transition-all space-y-2 group ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="px-2.5 py-0.5 rounded-full bg-[#ff7700]/10 border border-[#ff7700]/30 text-[10px] font-bold text-[#ff7700] uppercase tracking-wider">
          {displayLabel}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          className="px-2 py-1 rounded-lg bg-white/5 hover:bg-[#ff7700]/20 text-slate-300 hover:text-white text-xs flex items-center gap-1 border border-white/10 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-[#ff7700]" />
              <span className="text-[10px]">Copy</span>
            </>
          )}
        </button>
      </div>

      <a
        href={mailToUrl}
        className="flex items-center gap-2.5 pt-1 text-sm sm:text-base font-extrabold text-white group-hover:text-[#ff7700] transition-colors"
      >
        <Mail className="w-4 h-4 text-[#ff7700] shrink-0" />
        <span className="break-all">{email}</span>
        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-[#ff7700]" />
      </a>

      <p className="text-xs text-slate-400 font-normal leading-relaxed">
        {info.description}
      </p>
    </div>
  );
};
