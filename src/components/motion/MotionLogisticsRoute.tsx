import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Truck, Headphones, CheckCircle2 } from 'lucide-react';

interface MotionLogisticsRouteProps {
  className?: string;
}

export const MotionLogisticsRoute: React.FC<MotionLogisticsRouteProps> = ({
  className = '',
}) => {
  const prefersReduced = useReducedMotion();

  const stages = [
    {
      id: 'driver',
      label: 'Fleet Driver',
      sub: 'On-Road Van / Linehaul',
      icon: Truck,
      color: '#38bdf8',
    },
    {
      id: 'dispatch',
      label: 'WAL Dispatch Hub',
      sub: 'Real-Time Oversight & SOS',
      icon: Headphones,
      color: '#ff7700',
    },
    {
      id: 'customer',
      label: 'Verified Delivery',
      sub: 'POD & Shift Closure',
      icon: CheckCircle2,
      color: '#34d399',
    },
  ];

  return (
    <div className={`relative w-full max-w-4xl mx-auto rounded-xl bg-[#09090d] border border-white/10 p-6 sm:p-8 select-none ${className}`}>
      {/* Route Stream Pipeline */}
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
        {/* Animated Connecting Track Line behind stations */}
        <div className="hidden md:block absolute left-12 right-12 top-7 h-[2px] bg-white/10 z-0">
          {!prefersReduced && (
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-[#ff7700] to-transparent shadow-[0_0_10px_#ff7700]"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.8,
                ease: 'easeInOut',
              }}
              style={{ width: '40%' }}
            />
          )}
        </div>

        {/* 3 Interactive Route Checkpoints */}
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div
              key={stage.id}
              className="relative z-10 flex flex-col items-center text-center w-full md:w-1/3"
            >
              {/* Station Icon Ring */}
              <div className="w-14 h-14 rounded-full bg-[#121218] border border-white/15 flex items-center justify-center shadow-lg relative mb-3">
                <Icon className="w-6 h-6 text-white" style={{ color: stage.color }} />
                {idx === 1 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff7700] opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff7700]" />
                  </span>
                )}
              </div>

              {/* Station Titles */}
              <h4 className="text-sm sm:text-base font-bold text-white tracking-wide">
                {stage.label}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {stage.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Real-time Status Micro-badge */}
      <div className="mt-6 pt-5 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ff7700] animate-pulse" />
          <span className="font-mono text-slate-300">ROUTE SYNC: 100% DISPATCH CONTINUITY</span>
        </div>
        <div className="font-mono text-slate-400">
          AVERAGE DISPATCH RESPONSE: &lt; 45 SECONDS
        </div>
      </div>
    </div>
  );
};
