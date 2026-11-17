import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface MotionOperationsEcosystemProps {
  className?: string;
}

export const MotionOperationsEcosystem: React.FC<MotionOperationsEcosystemProps> = ({
  className = '',
}) => {
  const prefersReduced = useReducedMotion();

  const nodes = [
    { id: 'dispatch', label: 'DISPATCH', sub: '24×7 Active Routing', x: 120, y: 110, pulseDelay: 0 },
    { id: 'logistics', label: 'LOGISTICS', sub: 'Dedicated Freight', x: 480, y: 110, pulseDelay: 1.2 },
    { id: 'ai', label: 'AI AUTOMATION', sub: 'Smart Workflow', x: 120, y: 390, pulseDelay: 2.4 },
    { id: 'support', label: 'SUPPORT', sub: 'Continuous SLA', x: 480, y: 390, pulseDelay: 3.6 },
  ];

  return (
    <div className={`relative w-full aspect-[4/3] sm:aspect-[16/11] max-w-[620px] mx-auto rounded-2xl bg-[#08080c] border border-white/10 p-4 sm:p-6 overflow-hidden select-none shadow-[0_20px_60px_rgba(0,0,0,0.8)] ${className}`}>
      {/* Background Matrix & Subtle Gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(255,119,0,0.12)_0%,transparent_65%)] pointer-events-none" />

      {/* SVG Circuit Canvas */}
      <svg 
        viewBox="0 0 600 500" 
        className="w-full h-full object-contain overflow-visible"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="ecoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Connection Arc Ribbons */}
        <circle cx="300" cy="250" r="160" stroke="#ffffff0a" strokeWidth="1" strokeDasharray="6 8" />
        <circle cx="300" cy="250" r="210" stroke="#ffffff06" strokeWidth="1" />

        {/* 4 Architectural Connecting Lines to Nodes */}
        {/* Node 1: Top-Left (Dispatch) */}
        <path d="M 300 250 L 220 200 L 170 145" stroke="#ffffff18" strokeWidth="1.5" />
        {/* Node 2: Top-Right (Logistics) */}
        <path d="M 300 250 L 380 200 L 430 145" stroke="#ffffff18" strokeWidth="1.5" />
        {/* Node 3: Bottom-Left (AI) */}
        <path d="M 300 250 L 220 300 L 170 355" stroke="#ffffff18" strokeWidth="1.5" />
        {/* Node 4: Bottom-Right (Support) */}
        <path d="M 300 250 L 380 300 L 430 355" stroke="#ffffff18" strokeWidth="1.5" />

        {/* Amber Energy Signal Pulses Moving Along Paths */}
        {!prefersReduced && (
          <>
            {/* Core to Dispatch */}
            <motion.circle
              r="3"
              fill="#ff9900"
              filter="url(#ecoGlow)"
              animate={{
                cx: [300, 220, 170],
                cy: [250, 200, 145],
                opacity: [0, 1, 0],
              }}
              transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", delay: 0 }}
            />
            {/* Core to Logistics */}
            <motion.circle
              r="3"
              fill="#ff7700"
              filter="url(#ecoGlow)"
              animate={{
                cx: [300, 380, 430],
                cy: [250, 200, 145],
                opacity: [0, 1, 0],
              }}
              transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", delay: 1.6 }}
            />
            {/* Core to AI */}
            <motion.circle
              r="3"
              fill="#ffaa33"
              filter="url(#ecoGlow)"
              animate={{
                cx: [300, 220, 170],
                cy: [250, 300, 355],
                opacity: [0, 1, 0],
              }}
              transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", delay: 0.8 }}
            />
            {/* Core to Support */}
            <motion.circle
              r="3"
              fill="#ff8800"
              filter="url(#ecoGlow)"
              animate={{
                cx: [300, 380, 430],
                cy: [250, 300, 355],
                opacity: [0, 1, 0],
              }}
              transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", delay: 2.4 }}
            />
          </>
        )}

        {/* Central WAL GROUPS Core */}
        <g transform="translate(300, 250)">
          {/* Subtle slow rotating compass rings */}
          <motion.circle
            r="48"
            stroke="#ff7700"
            strokeWidth="1.5"
            strokeDasharray="20 40 10 30"
            fill="none"
            animate={!prefersReduced ? { rotate: 360 } : {}}
            transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
            style={{ originX: '0px', originY: '0px' }}
          />
          <motion.circle
            r="38"
            stroke="#ffffff25"
            strokeWidth="1"
            strokeDasharray="15 25"
            fill="none"
            animate={!prefersReduced ? { rotate: -360 } : {}}
            transition={{ repeat: Infinity, duration: 36, ease: "linear" }}
            style={{ originX: '0px', originY: '0px' }}
          />

          {/* Central Plate */}
          <circle r="26" fill="#0f0f14" stroke="#ffffff30" strokeWidth="1.5" />
          
          {/* Glowing Center Amber Hexagon Core */}
          <motion.polygon
            points="0,-12 10,-6 10,6 0,12 -10,6 -10,-6"
            fill="#ff7700"
            filter="url(#ecoGlow)"
            animate={!prefersReduced ? { scale: [0.9, 1.1, 0.9], opacity: [0.8, 1, 0.8] } : {}}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
          />
          <text y="3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900" fontFamily="sans-serif">WAL</text>
        </g>

        {/* 4 Surrounding Node Badges */}
        {nodes.map((node) => (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            {/* Backdrop card */}
            <rect
              x="-65"
              y="-24"
              width="130"
              height="48"
              rx="8"
              fill="#121218"
              stroke="#ffffff15"
              strokeWidth="1"
              className="drop-shadow-lg"
            />
            {/* Status indicator dot */}
            <circle cx="-48" cy="0" r="3.5" fill="#ff7700" />
            {/* Node Typography */}
            <text x="-36" y="-3" fill="#ffffff" fontSize="10" fontWeight="bold" letterSpacing="0.08em" fontFamily="sans-serif">
              {node.label}
            </text>
            <text x="-36" y="11" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">
              {node.sub}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
