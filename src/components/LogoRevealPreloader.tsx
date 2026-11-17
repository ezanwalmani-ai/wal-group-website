import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const PRELOADER_STORAGE_KEY = 'walgroups_preloader_seen';

interface LogoRevealPreloaderProps {
  /**
   * Force preloader to show regardless of sessionStorage (useful for testing)
   */
  forceShow?: boolean;
  onComplete?: () => void;
}

export const LogoRevealPreloader: React.FC<LogoRevealPreloaderProps> = ({
  forceShow = false,
  onComplete,
}) => {
  const [shouldRender, setShouldRender] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (forceShow) return true;
    
    // Check URL override query param: ?preloader=replay or ?preview_loader=true
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('preloader') === 'replay' || params.get('preview_loader') === 'true') {
        return true;
      }
    } catch {
      // Ignore URL parsing errors
    }

    // Standard session check
    try {
      return !sessionStorage.getItem(PRELOADER_STORAGE_KEY);
    } catch {
      return false;
    }
  });

  const [phase, setPhase] = useState<'revealing' | 'accent' | 'curtain' | 'complete'>('revealing');
  const timerRef = useRef<number[]>([]);

  useEffect(() => {
    if (!shouldRender) return;

    // Check prefers-reduced-motion safely
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      try {
        sessionStorage.setItem(PRELOADER_STORAGE_KEY, 'true');
      } catch {
        // ignore
      }
      setShouldRender(false);
      onComplete?.();
      return;
    }

    // 1. Lock scrolling while preloader is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 2. Timing sequence (Total: ~1.35s - 1.4s)
    // 0.40s: Trigger amber accent line
    const t1 = window.setTimeout(() => {
      setPhase('accent');
    }, 400);

    // 0.85s: Trigger cinematic curtain reveal of homepage
    const t2 = window.setTimeout(() => {
      setPhase('curtain');
    }, 850);

    // 1.40s: Complete preloader, restore scrolling, remove from DOM
    const t3 = window.setTimeout(() => {
      setPhase('complete');
      setShouldRender(false);
      document.body.style.overflow = originalOverflow || '';
      try {
        sessionStorage.setItem(PRELOADER_STORAGE_KEY, 'true');
      } catch {
        // ignore
      }
      onComplete?.();
    }, 1400);

    timerRef.current = [t1, t2, t3];

    return () => {
      timerRef.current.forEach((t) => clearTimeout(t));
      document.body.style.overflow = originalOverflow || '';
    };
  }, [shouldRender, onComplete]);

  if (!shouldRender || phase === 'complete') {
    return null;
  }

  const isExiting = phase === 'curtain';

  return (
    <div
      aria-hidden={isExiting}
      role="status"
      aria-label="Loading WAL GROUPS"
      className="fixed inset-0 z-[999999] pointer-events-none select-none overflow-hidden"
    >
      {/* Upper Theatrical Shutter Panel */}
      <motion.div
        initial={{ y: '0%' }}
        animate={{ y: isExiting ? '-100%' : '0%' }}
        transition={{
          duration: 0.55,
          ease: [0.77, 0, 0.175, 1], // Cinematic cubic-bezier
        }}
        className="absolute top-0 left-0 right-0 h-1/2 bg-[#050404] pointer-events-auto border-b border-[#ff7700]/10 shadow-[0_10px_30px_rgba(0,0,0,0.9)]"
      />

      {/* Lower Theatrical Shutter Panel */}
      <motion.div
        initial={{ y: '0%' }}
        animate={{ y: isExiting ? '100%' : '0%' }}
        transition={{
          duration: 0.55,
          ease: [0.77, 0, 0.175, 1],
        }}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#050404] pointer-events-auto border-t border-[#ff7700]/10 shadow-[0_-10px_30px_rgba(0,0,0,0.9)]"
      />

      {/* Center Cinematic Stage */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(10px)' }}
          animate={{
            opacity: isExiting ? 0 : 1,
            scale: isExiting ? 1.05 : 1,
            filter: isExiting ? 'blur(8px)' : 'blur(0px)',
          }}
          transition={{
            opacity: { duration: isExiting ? 0.35 : 0.45, ease: 'easeOut' },
            scale: { duration: isExiting ? 0.45 : 0.55, ease: [0.16, 1, 0.3, 1] },
            filter: { duration: 0.4 },
          }}
          className="relative flex flex-col items-center justify-center"
        >
          {/* Subtle Ambient Radial Glow Behind Logo */}
          <div className="absolute -inset-16 bg-[radial-gradient(ellipse_at_center,rgba(255,102,0,0.18)_0%,rgba(5,4,4,0)_70%)] pointer-events-none" />

          {/* Core WAL GROUPS Hexagon & Monogram Brand Icon */}
          <div className="relative flex items-center gap-3.5 sm:gap-4">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-[0_0_24px_rgba(255,102,0,0.55)]"
              >
                <defs>
                  {/* Linear gradient for W monogram */}
                  <linearGradient id="preloaderWMono" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff8800" />
                    <stop offset="50%" stopColor="#ff5500" />
                    <stop offset="100%" stopColor="#e64400" />
                  </linearGradient>

                  {/* Hexagon Border Stroke Gradient */}
                  <linearGradient id="preloaderHexBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff9900" />
                    <stop offset="45%" stopColor="#ff5500" />
                    <stop offset="100%" stopColor="#401900" />
                  </linearGradient>
                </defs>

                {/* Hexagon Outer Frame */}
                <polygon
                  points="50,4 92,26 92,74 50,96 8,74 8,26"
                  stroke="url(#preloaderHexBorder)"
                  strokeWidth="4"
                  strokeLinejoin="round"
                  fill="#0b0808"
                />

                {/* Left Stem */}
                <path
                  d="M22 30 L35 74 L46 44 L38 32 Z"
                  fill="url(#preloaderWMono)"
                />

                {/* Right Stem */}
                <path
                  d="M78 30 L65 74 L54 44 L62 32 Z"
                  fill="url(#preloaderWMono)"
                />

                {/* Center Interlocking V Chevron */}
                <path
                  d="M36 68 L50 32 L64 68 L56 68 L50 48 L44 68 Z"
                  fill="#ff7700"
                />
              </svg>
            </div>

            {/* Brand Typography */}
            <div className="flex flex-col justify-center select-none text-left">
              <span className="text-white font-black text-2xl sm:text-3xl leading-none tracking-wider">
                WAL
              </span>
              <span className="text-[#ff6600] font-black text-xs sm:text-sm leading-none tracking-[0.24em] mt-1">
                GROUPS
              </span>
            </div>
          </div>

          {/* STEP 3: Brand Amber Accent Line Expanding Underneath Logo */}
          <div className="relative w-48 sm:w-56 h-[2px] mt-4 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: phase === 'revealing' ? 0 : 1,
                opacity: phase === 'revealing' ? 0 : 1,
              }}
              transition={{
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full h-full origin-center bg-gradient-to-r from-transparent via-[#ff7700] to-transparent shadow-[0_0_12px_#ff7700]"
            />
          </div>

          {/* Micro-text Tagline: Cinematic & Minimal */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{
              opacity: phase === 'revealing' ? 0 : 0.85,
              y: phase === 'revealing' ? 5 : 0,
            }}
            transition={{
              duration: 0.35,
              delay: 0.1,
              ease: 'easeOut',
            }}
            className="mt-3 text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] text-slate-400 uppercase select-none"
          >
            OPERATIONS &bull; TECHNOLOGY &bull; GROWTH
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
