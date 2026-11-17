import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { UserCheck, Database, Send, CalendarCheck, FileSpreadsheet } from 'lucide-react';

interface MotionAiWorkflowProps {
  className?: string;
}

export const MotionAiWorkflow: React.FC<MotionAiWorkflowProps> = ({
  className = '',
}) => {
  const prefersReduced = useReducedMotion();

  const steps = [
    { id: 'lead', title: '01. LEAD', desc: 'Inbound Driver / Fleet Inquiry', icon: UserCheck },
    { id: 'crm', title: '02. CRM', desc: 'Instant Qualification & Tagging', icon: Database },
    { id: 'followup', title: '03. FOLLOW-UP', desc: 'Bilingual AI Voice & SMS', icon: Send },
    { id: 'appointment', title: '04. APPOINTMENT', desc: 'Calendar Slot Locked', icon: CalendarCheck },
    { id: 'report', title: '05. REPORT', desc: 'Real-Time ROI & Conversion', icon: FileSpreadsheet },
  ];

  return (
    <div className={`relative w-full max-w-5xl mx-auto rounded-2xl bg-[#09090d] border border-white/10 p-6 sm:p-8 select-none ${className}`}>
      {/* Horizontal Workflow Track */}
      <div className="relative">
        {/* Subtle Connecting Line behind circles */}
        <div className="hidden lg:block absolute left-12 right-12 top-6 h-[2px] bg-white/10 z-0">
          {!prefersReduced && (
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-[#ff7700] to-transparent shadow-[0_0_12px_#ff7700]"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                repeat: Infinity,
                duration: 3.5,
                ease: 'easeInOut',
              }}
              style={{ width: '30%' }}
            />
          )}
        </div>

        {/* 5 Sequential Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="p-4 rounded-xl bg-[#121218] border border-white/10 hover:border-[#ff7700]/40 transition-colors flex flex-col items-center text-center group"
              >
                <div className="w-12 h-12 rounded-full bg-black/60 border border-white/15 flex items-center justify-center mb-3 group-hover:border-[#ff7700] transition-colors shadow-inner">
                  <Icon className="w-5 h-5 text-slate-300 group-hover:text-[#ff7700] transition-colors" />
                </div>
                <span className="text-xs font-mono font-bold text-white tracking-wider mb-1">
                  {step.title}
                </span>
                <span className="text-[11px] text-slate-400 leading-tight">
                  {step.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Metric Proofline */}
      <div className="mt-6 pt-5 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">AUTONOMOUS DISPATCH &amp; RECRUITMENT LOGIC</span>
        </div>
        <div className="text-[#ff9900]">
          -35% COST PER HIRE &bull; 0 MISSED APPOINTMENTS
        </div>
      </div>
    </div>
  );
};
