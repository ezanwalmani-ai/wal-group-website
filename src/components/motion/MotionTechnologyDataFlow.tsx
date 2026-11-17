import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface MotionTechnologyDataFlowProps {
  className?: string;
}

export const MotionTechnologyDataFlow: React.FC<MotionTechnologyDataFlowProps> = ({
  className = '',
}) => {
  const prefersReduced = useReducedMotion();

  const sourceSystems = [
    { label: 'Relay & Cortex', code: 'RELAY-API', x: 80, y: 70 },
    { label: 'Netradyne AI', code: 'SAFETY-AI', x: 280, y: 50 },
    { label: 'Motive ELD', code: 'TELEMETRY', x: 480, y: 50 },
    { label: 'QuickBooks & ADP', code: 'FINANCE-SYNC', x: 680, y: 50 },
    { label: 'Fleet HR / Paycom', code: 'WORKFORCE', x: 880, y: 70 },
  ];

  return (
    <div className={`relative w-full max-w-5xl mx-auto rounded-2xl bg-[#07070a] border border-white/10 p-6 sm:p-8 overflow-hidden select-none shadow-[0_25px_60px_rgba(0,0,0,0.9)] ${className}`}>
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(255,119,0,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* SVG Circuit Canvas */}
      <svg
        viewBox="0 0 1000 480"
        className="w-full h-full object-contain overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="dataFlowGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <linearGradient id="streamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#ff7700" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ff7700" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* 1. Inflow Pipes from Systems into Central WAL GROUPS Engine */}
        <path d="M 120 100 Q 120 190 400 230" stroke="#ffffff12" strokeWidth="1.2" />
        <path d="M 320 80 Q 340 180 440 230" stroke="#ffffff15" strokeWidth="1.2" />
        <path d="M 500 80 V 220" stroke="#ffffff18" strokeWidth="1.5" />
        <path d="M 680 80 Q 660 180 560 230" stroke="#ffffff15" strokeWidth="1.2" />
        <path d="M 880 100 Q 880 190 600 230" stroke="#ffffff12" strokeWidth="1.2" />

        {/* 2. Outflow Pipes from Central Engine to Unified Business Operations */}
        <path d="M 440 260 Q 320 310 240 390" stroke="#ffffff12" strokeWidth="1.2" />
        <path d="M 500 270 V 390" stroke="#ffffff18" strokeWidth="1.5" />
        <path d="M 560 260 Q 680 310 760 390" stroke="#ffffff12" strokeWidth="1.2" />

        {/* 3. Continuously Flowing Data Packets (Amber pulses) */}
        {!prefersReduced && (
          <>
            {/* Relay to WAL */}
            <motion.circle
              r="2.5"
              fill="#ff9900"
              filter="url(#dataFlowGlow)"
              animate={{
                cx: [120, 200, 300, 420],
                cy: [100, 160, 210, 230],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0 }}
            />
            {/* Netradyne to WAL */}
            <motion.circle
              r="2.5"
              fill="#ff7700"
              filter="url(#dataFlowGlow)"
              animate={{
                cx: [320, 360, 410, 450],
                cy: [80, 140, 190, 230],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ repeat: Infinity, duration: 3.0, ease: "easeInOut", delay: 0.6 }}
            />
            {/* Motive to WAL */}
            <motion.circle
              r="3"
              fill="#ffaa22"
              filter="url(#dataFlowGlow)"
              animate={{
                cx: [500, 500, 500],
                cy: [80, 150, 220],
                opacity: [0, 1, 0],
              }}
              transition={{ repeat: Infinity, duration: 2.6, ease: "linear", delay: 1.2 }}
            />
            {/* QuickBooks to WAL */}
            <motion.circle
              r="2.5"
              fill="#ff7700"
              filter="url(#dataFlowGlow)"
              animate={{
                cx: [680, 640, 590, 550],
                cy: [80, 140, 190, 230],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", delay: 0.9 }}
            />
            {/* Paycom to WAL */}
            <motion.circle
              r="2.5"
              fill="#ff9900"
              filter="url(#dataFlowGlow)"
              animate={{
                cx: [880, 800, 700, 580],
                cy: [100, 160, 210, 230],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.3 }}
            />

            {/* Outflow pulses */}
            <motion.circle
              r="3"
              fill="#ff7700"
              filter="url(#dataFlowGlow)"
              animate={{
                cx: [440, 340, 240],
                cy: [260, 320, 390],
                opacity: [0, 1, 0],
              }}
              transition={{ repeat: Infinity, duration: 3.2, ease: "easeOut", delay: 1.5 }}
            />
            <motion.circle
              r="3"
              fill="#ffaa33"
              filter="url(#dataFlowGlow)"
              animate={{
                cx: [500, 500, 500],
                cy: [270, 330, 390],
                opacity: [0, 1, 0],
              }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "linear", delay: 1.8 }}
            />
            <motion.circle
              r="3"
              fill="#ff8800"
              filter="url(#dataFlowGlow)"
              animate={{
                cx: [560, 660, 760],
                cy: [260, 320, 390],
                opacity: [0, 1, 0],
              }}
              transition={{ repeat: Infinity, duration: 3.2, ease: "easeOut", delay: 2.1 }}
            />
          </>
        )}

        {/* 4. Top System Source Badges */}
        {sourceSystems.map((sys, i) => (
          <g key={i} transform={`translate(${sys.x}, ${sys.y})`}>
            <rect x="-60" y="-18" width="120" height="36" rx="6" fill="#111116" stroke="#ffffff1a" strokeWidth="1" />
            <text x="0" y="-1" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">{sys.label}</text>
            <text x="0" y="11" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">{sys.code}</text>
          </g>
        ))}

        {/* 5. Central Unified WAL GROUPS Operational Engine */}
        <g transform="translate(500, 245)">
          <rect x="-140" y="-30" width="280" height="60" rx="10" fill="#13131a" stroke="#ff7700" strokeWidth="1.5" filter="url(#dataFlowGlow)" opacity="0.9" />
          <rect x="-138" y="-28" width="276" height="56" rx="9" fill="#0d0d12" />
          <circle cx="-110" cy="0" r="5" fill="#ff7700" />
          <text x="-95" y="4" fill="#ffffff" fontSize="12" fontWeight="900" letterSpacing="0.1em" fontFamily="sans-serif">WAL GROUPS ENGINE</text>
          <text x="65" y="4" fill="#ff9900" fontSize="9" fontWeight="bold" fontFamily="monospace">UNIFIED HUB</text>
        </g>

        {/* 6. Bottom Output Destinations */}
        <g transform="translate(240, 410)">
          <rect x="-65" y="-18" width="130" height="36" rx="6" fill="#111116" stroke="#ffffff15" strokeWidth="1" />
          <text x="0" y="-1" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Fleet Execution</text>
          <text x="0" y="11" textAnchor="middle" fill="#38bdf8" fontSize="7" fontFamily="monospace">ZERO DOWNTIME</text>
        </g>

        <g transform="translate(500, 410)">
          <rect x="-65" y="-18" width="130" height="36" rx="6" fill="#111116" stroke="#ffffff15" strokeWidth="1" />
          <text x="0" y="-1" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Financial Accuracy</text>
          <text x="0" y="11" textAnchor="middle" fill="#34d399" fontSize="7" fontFamily="monospace">AUDIT-READY</text>
        </g>

        <g transform="translate(760, 410)">
          <rect x="-65" y="-18" width="130" height="36" rx="6" fill="#111116" stroke="#ffffff15" strokeWidth="1" />
          <text x="0" y="-1" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Executive Oversight</text>
          <text x="0" y="11" textAnchor="middle" fill="#ff7700" fontSize="7" fontFamily="monospace">REAL-TIME KPI</text>
        </g>
      </svg>
    </div>
  );
};
