import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Layout, Palette, Code2, Database, Globe } from 'lucide-react';

interface MotionWebsiteBuildingProps {
  className?: string;
}

export const MotionWebsiteBuilding: React.FC<MotionWebsiteBuildingProps> = ({
  className = '',
}) => {
  const prefersReduced = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { id: 'wireframe', label: 'WIREFRAME', desc: 'Architecture & UX Grid', icon: Layout },
    { id: 'design', label: 'DESIGN', desc: 'Brand Polish & UI Systems', icon: Palette },
    { id: 'development', label: 'DEVELOPMENT', desc: 'High-Speed React Code', icon: Code2 },
    { id: 'database', label: 'DATABASE', desc: 'Secure APIs & Storage', icon: Database },
    { id: 'live', label: 'LIVE WEBSITE', desc: 'Global CDN Deployment', icon: Globe },
  ];

  useEffect(() => {
    if (prefersReduced) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [prefersReduced, steps.length]);

  return (
    <div className={`relative w-full max-w-4xl mx-auto rounded-2xl bg-[#09090d] border border-white/10 p-6 sm:p-8 select-none ${className}`}>
      {/* 5 Stages Progress Tracker */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === activeStep;
          const isPassed = idx < activeStep;

          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded-lg border text-left transition-all duration-300 relative ${
                isActive
                  ? 'bg-white/10 border-[#ff7700] shadow-[0_0_15px_rgba(255,119,0,0.25)]'
                  : isPassed
                  ? 'bg-white/5 border-white/20 text-slate-300'
                  : 'bg-black/40 border-white/5 text-slate-400 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#ff7700]' : 'text-slate-400'}`} />
                <span className="text-[11px] font-bold tracking-wider uppercase font-mono">
                  {step.label}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                {step.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Browser Window Shape Simulating Active Build Stage */}
      <div className="relative rounded-xl border border-white/15 bg-[#0e0e14] overflow-hidden shadow-2xl">
        {/* Browser Top Bar */}
        <div className="h-8 bg-black/60 border-b border-white/10 px-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <div className="px-3 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
            wal-production.preview // {steps[activeStep].label.toLowerCase()}
          </div>
          <div className="w-10" />
        </div>

        {/* Dynamic Canvas Simulation for current step */}
        <div className="p-6 sm:p-8 min-h-[220px] flex items-center justify-center">
          {activeStep === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg space-y-3"
            >
              <div className="h-5 w-1/3 bg-white/15 rounded border border-dashed border-white/30" />
              <div className="h-16 w-full bg-white/5 rounded border border-dashed border-white/20 grid grid-cols-3 gap-2 p-2">
                <div className="bg-white/10 rounded" />
                <div className="bg-white/10 rounded" />
                <div className="bg-white/10 rounded" />
              </div>
              <div className="h-20 w-full bg-white/5 rounded border border-dashed border-white/20" />
            </motion.div>
          )}

          {activeStep === 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-white">WAL GROUPS UI</span>
                <span className="text-[10px] font-mono text-[#ff7700]">#ff7700 ACCENT</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="h-24 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-[#ff7700]/30 p-2.5 flex flex-col justify-end">
                  <span className="text-[10px] font-bold text-white">Hero Plate</span>
                </div>
                <div className="h-24 rounded-lg bg-[#14141d] border border-white/10 p-2.5 flex flex-col justify-end">
                  <span className="text-[10px] font-bold text-slate-300">Glass Depth</span>
                </div>
                <div className="h-24 rounded-lg bg-gradient-to-tr from-[#ff7700]/20 to-transparent border border-white/10 p-2.5 flex flex-col justify-end">
                  <span className="text-[10px] font-bold text-[#ff7700]">Typography</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeStep === 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg font-mono text-xs text-slate-300 space-y-1.5 bg-black/50 p-4 rounded-lg border border-white/10"
            >
              <p><span className="text-[#38bdf8]">const</span> <span className="text-white">website</span> = <span className="text-[#ff7700]">createProductionApp</span>();</p>
              <p><span className="text-slate-500">// 100/100 Core Web Vitals Guaranteed</span></p>
              <p><span className="text-[#34d399]">await</span> website.<span className="text-[#ffaa22]">optimizeBuild</span>(&#123; responsive: <span className="text-[#38bdf8]">true</span> &#125;);</p>
              <p className="text-emerald-400 font-bold">✔ Build succeeded in 320ms</p>
            </motion.div>
          )}

          {activeStep === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg space-y-2 text-xs font-mono"
            >
              <div className="p-3 rounded bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-slate-300">Edge Storage: Supabase &amp; PostgreSql</span>
                <span className="text-emerald-400">CONNECTED</span>
              </div>
              <div className="p-3 rounded bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-slate-300">Lead Webhooks &amp; Email Dispatch</span>
                <span className="text-emerald-400">ACTIVE</span>
              </div>
            </motion.div>
          )}

          {activeStep === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg text-center space-y-3"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                LIVE ON GLOBAL CDN
              </div>
              <h5 className="text-lg font-bold text-white">Your High-Converting Digital Presence</h5>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Engineered for logistics carriers, corporate contractors, and enterprise fleets.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
