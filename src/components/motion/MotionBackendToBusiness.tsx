import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface MotionBackendToBusinessProps {
  className?: string;
  intensity?: 'full' | 'subtle'; // Subtle used for CTA section callback
}

export const MotionBackendToBusiness: React.FC<MotionBackendToBusinessProps> = ({
  className = '',
  intensity = 'full',
}) => {
  const prefersReduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = intensity === 'subtle' ? 0.75 : 1.0;
    }
  }, [intensity]);

  const isSubtle = intensity === 'subtle';

  return (
    <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
      {/* 1. Underlying Video Asset (Gracefully activates if /hero-motion.mp4 is available) */}
      <video
        ref={videoRef}
        src="/hero-motion.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 ${
          isSubtle ? 'opacity-25 filter blur-[1px]' : 'opacity-70'
        }`}
        onError={(e) => {
          // Gracefully hide video element if file not present on disk
          (e.currentTarget as HTMLElement).style.display = 'none';
        }}
      />

      {/* 2. Abstract Architectural Tech Core (Exact translation of the motion graphic) */}
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${isSubtle ? 'opacity-30' : 'opacity-100'}`}>
        
        {/* Technical Grid Pattern */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none"
        />

        {/* Ambient Amber Glow behind core */}
        <div className="absolute w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,119,0,0.14)_0%,transparent_70%)] pointer-events-none" />

        {/* SVG Architectural Canvas */}
        <svg 
          viewBox="0 0 1000 600" 
          className="w-full h-full max-w-[1200px] object-contain overflow-visible"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="amberLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#ff7700" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#141419" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0a0a0d" stopOpacity="0.95" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ===== 1. Connecting Architectural Stream Lines ===== */}
          {/* Top Left Branch */}
          <path d="M 220 140 H 380 Q 420 140 440 220 L 460 260" stroke="#ffffff15" strokeWidth="1.2" />
          <path d="M 160 200 H 320 Q 380 200 420 280 L 450 290" stroke="#ffffff15" strokeWidth="1.2" />
          
          {/* Bottom Left Branch */}
          <path d="M 180 400 H 340 Q 400 400 430 330 L 450 310" stroke="#ffffff15" strokeWidth="1.2" />
          <path d="M 240 480 H 380 Q 430 480 445 370 L 460 340" stroke="#ffffff15" strokeWidth="1.2" />

          {/* Top Center Inflow */}
          <path d="M 500 80 V 220" stroke="#ffffff15" strokeWidth="1.2" />

          {/* Top Right Branch */}
          <path d="M 780 140 H 620 Q 580 140 560 220 L 540 260" stroke="#ffffff15" strokeWidth="1.2" />
          <path d="M 840 220 H 680 Q 620 220 580 280 L 550 290" stroke="#ffffff15" strokeWidth="1.2" />

          {/* Bottom Right Branch */}
          <path d="M 820 400 H 660 Q 600 400 570 330 L 550 310" stroke="#ffffff15" strokeWidth="1.2" />
          <path d="M 760 480 H 620 Q 570 480 555 370 L 540 340" stroke="#ffffff15" strokeWidth="1.2" />

          {/* Bottom Center Outflow */}
          <path d="M 500 380 V 520" stroke="#ffffff15" strokeWidth="1.2" />

          {/* Horizontal Axis Guides */}
          <line x1="80" y1="300" x2="430" y2="300" stroke="#ffffff10" strokeWidth="1" strokeDasharray="3 4" />
          <line x1="570" y1="300" x2="920" y2="300" stroke="#ffffff10" strokeWidth="1" strokeDasharray="3 4" />

          {/* ===== 2. Animated Amber Energy Pulses Flowing into Backend ===== */}
          {!prefersReduced && (
            <>
              {/* Pulse 1: Top-Left to Center */}
              <motion.circle
                r="3"
                fill="#ff9900"
                filter="url(#glow)"
                animate={{
                  cx: [220, 380, 440, 480],
                  cy: [140, 140, 220, 280],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4.2,
                  ease: "easeInOut",
                  times: [0, 0.4, 0.8, 1],
                  delay: 0.2,
                }}
              />

              {/* Pulse 2: Bottom-Left to Center */}
              <motion.circle
                r="2.5"
                fill="#ff7700"
                filter="url(#glow)"
                animate={{
                  cx: [180, 340, 430, 480],
                  cy: [400, 400, 330, 310],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4.8,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
              />

              {/* Pulse 3: Top-Right to Center */}
              <motion.circle
                r="3"
                fill="#ffaa22"
                filter="url(#glow)"
                animate={{
                  cx: [780, 620, 560, 520],
                  cy: [140, 140, 220, 280],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4.4,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
              />

              {/* Pulse 4: Bottom-Right to Center */}
              <motion.circle
                r="2.5"
                fill="#ff7700"
                filter="url(#glow)"
                animate={{
                  cx: [820, 660, 570, 520],
                  cy: [400, 400, 330, 310],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5.1,
                  ease: "easeInOut",
                  delay: 2.2,
                }}
              />

              {/* Pulse 5: Outward Dispatch Beam (Center downward) */}
              <motion.circle
                r="3.5"
                fill="#ff8800"
                filter="url(#glow)"
                animate={{
                  cx: [500, 500, 500],
                  cy: [300, 420, 520],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3.5,
                  ease: "easeOut",
                  delay: 1.0,
                }}
              />
            </>
          )}

          {/* ===== 3. Central Operational Hub (Concentric Dials & Aperture) ===== */}
          <g transform="translate(500, 300)">
            {/* Outer Circular Track with Tick Marks */}
            <circle r="72" stroke="#ffffff18" strokeWidth="1" strokeDasharray="4 6" />
            <circle r="88" stroke="#ffffff0a" strokeWidth="1" />
            
            {/* Rotating Segmented Ring */}
            <motion.circle
              r="62"
              stroke="#ff7700"
              strokeWidth="2.5"
              strokeDasharray="40 70 20 50"
              strokeLinecap="round"
              fill="none"
              animate={!prefersReduced ? { rotate: 360 } : {}}
              transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
              style={{ originX: '0px', originY: '0px' }}
            />

            {/* Inner Counter-Rotating Dial */}
            <motion.circle
              r="48"
              stroke="#ffffff30"
              strokeWidth="1.5"
              strokeDasharray="25 35 15 45"
              strokeLinecap="round"
              fill="none"
              animate={!prefersReduced ? { rotate: -360 } : {}}
              transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
              style={{ originX: '0px', originY: '0px' }}
            />

            {/* Central Solid Hub */}
            <circle r="32" fill="#0d0d12" stroke="#ffffff25" strokeWidth="1.5" />
            
            {/* Inner Amber Core Glow */}
            <motion.circle 
              r="14" 
              fill="#ff6600" 
              opacity="0.85"
              filter="url(#glow)"
              animate={!prefersReduced ? { scale: [0.9, 1.15, 0.9], opacity: [0.7, 0.95, 0.7] } : {}}
              transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
            />
            <circle r="6" fill="#ffffff" />
          </g>

          {/* ===== 4. Peripheral Data Modules (Abstract Metric Cards) ===== */}
          {/* Card 1: Top-Left Analytics */}
          <g transform="translate(140, 100)">
            <rect width="90" height="48" rx="4" fill="url(#nodeGrad)" stroke="#ffffff1a" strokeWidth="1" />
            <circle cx="14" cy="14" r="3" fill="#ff7700" />
            <line x1="24" y1="14" x2="60" y2="14" stroke="#ffffff40" strokeWidth="2" strokeLinecap="round" />
            {/* Mini Sparkline */}
            <polyline points="14,36 30,30 45,34 60,24 76,28" stroke="#ff7700" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Card 2: Mid-Left DSP Dispatch Stream */}
          <g transform="translate(80, 185)">
            <rect width="105" height="42" rx="4" fill="url(#nodeGrad)" stroke="#ffffff1a" strokeWidth="1" />
            <rect x="12" y="12" width="22" height="6" rx="2" fill="#ffffff30" />
            <line x1="12" y1="28" x2="45" y2="28" stroke="#ff7700" strokeWidth="2" strokeLinecap="round" />
            <line x1="52" y1="28" x2="90" y2="28" stroke="#ffffff20" strokeWidth="2" strokeLinecap="round" />
            <circle cx="92" cy="14" r="3" fill="#34d399" />
          </g>

          {/* Card 3: Bottom-Left Accounting Ledger */}
          <g transform="translate(100, 380)">
            <rect width="100" height="46" rx="4" fill="url(#nodeGrad)" stroke="#ffffff1a" strokeWidth="1" />
            <line x1="14" y1="14" x2="50" y2="14" stroke="#ffffff30" strokeWidth="2" strokeLinecap="round" />
            {/* Mini Bar Graph */}
            <rect x="14" y="26" width="6" height="12" rx="1" fill="#ffffff20" />
            <rect x="24" y="22" width="6" height="16" rx="1" fill="#ffffff30" />
            <rect x="34" y="18" width="6" height="20" rx="1" fill="#ff7700" />
            <rect x="44" y="24" width="6" height="14" rx="1" fill="#ffffff25" />
            <text x="60" y="32" fill="#ffffff70" fontSize="10" fontFamily="monospace">99.8%</text>
          </g>

          {/* Card 4: Top-Right Operations Control */}
          <g transform="translate(760, 100)">
            <rect width="95" height="48" rx="4" fill="url(#nodeGrad)" stroke="#ffffff1a" strokeWidth="1" />
            <circle cx="16" cy="16" r="3" fill="#ff9900" />
            <line x1="28" y1="16" x2="75" y2="16" stroke="#ffffff35" strokeWidth="2" strokeLinecap="round" />
            {/* Progress Arc */}
            <path d="M 68 34 A 8 8 0 1 1 80 34" stroke="#ff7700" strokeWidth="2" fill="none" />
            <text x="14" y="36" fill="#ffffff60" fontSize="9" fontFamily="monospace">SYNCED</text>
          </g>

          {/* Card 5: Mid-Right Fleet Telematics */}
          <g transform="translate(820, 195)">
            <rect width="100" height="44" rx="4" fill="url(#nodeGrad)" stroke="#ffffff1a" strokeWidth="1" />
            <circle cx="16" cy="14" r="3" fill="#38bdf8" />
            <line x1="26" y1="14" x2="60" y2="14" stroke="#ffffff35" strokeWidth="2" strokeLinecap="round" />
            <polyline points="16,32 35,28 55,34 75,26 88,28" stroke="#ffffff40" strokeWidth="1.2" fill="none" />
          </g>

          {/* Card 6: Bottom-Right AI Automation */}
          <g transform="translate(780, 380)">
            <rect width="105" height="48" rx="4" fill="url(#nodeGrad)" stroke="#ffffff1a" strokeWidth="1" />
            <circle cx="16" cy="14" r="3" fill="#ff7700" />
            <text x="26" y="17" fill="#ff9900" fontSize="8" fontWeight="bold" fontFamily="monospace">ACTIVE</text>
            <line x1="14" y1="28" x2="88" y2="28" stroke="#ffffff20" strokeWidth="1.5" />
            <line x1="14" y1="36" x2="65" y2="36" stroke="#ffffff15" strokeWidth="1.5" />
          </g>
        </svg>
      </div>

      {/* 3. Gradient Vignette to keep left-side typography crisp and readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent pointer-events-none w-full lg:w-3/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />
    </div>
  );
};
