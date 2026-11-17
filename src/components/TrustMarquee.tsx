import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

export const TrustMarquee: React.FC = () => {
  const ecosystemBadges = [
    { name: 'Amazon Cortex DSP', category: 'Dispatch & Safety' },
    { name: 'Netradyne Safety', category: 'Telematics & Driver Scorecards' },
    { name: 'SmartRecruiters', category: 'ATS & Driver Onboarding' },
    { name: 'Amazon Relay AFP', category: 'Linehaul & Load Booking' },
    { name: 'QuickBooks Online', category: 'Bookkeeping & Invoicing' },
    { name: 'ADP & Paycom', category: 'Driver Weekly Payroll' },
    { name: 'Alvys & AscendTMS', category: 'TMS & Route Management' },
    { name: 'Samsara & Motive', category: 'ELDs & Fleet Compliance' },
  ];

  return (
    <div className="py-16 bg-[#000000] border-y border-white/10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,102,0,0.08),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header Statement */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#ff6600]/40 text-xs font-bold text-[#ff6600] backdrop-blur-md"
          >
            <ShieldCheck className="w-4 h-4 text-[#ff6600]" />
            <span>TRUSTED BY LOGISTICS TEAMS &amp; AMAZON DSPs NATIONWIDE</span>
          </motion.div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            5+ Years of Operational Excellence &amp; Ecosystem Integration
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-normal">
            Deep technical fluency across Amazon’s core platforms, accounting suites, and fleet compliance systems.
          </p>
        </div>

        {/* Animated Infinite Horizontal Marquee */}
        <div className="relative w-full overflow-hidden py-4 border-y border-white/10 bg-white/[0.02] backdrop-blur-sm">
          <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-[#000000] to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-[#000000] to-transparent z-20 pointer-events-none" />

          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
            className="flex items-center gap-6 whitespace-nowrap w-max"
          >
            {/* Repeat array twice for seamless infinite loop */}
            {[...ecosystemBadges, ...ecosystemBadges].map((badge, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#ff6600]/50 hover:bg-white/10 transition-all cursor-default group"
              >
                <div className="w-2 h-2 rounded-full bg-[#ff6600] group-hover:animate-ping" />
                <span className="text-sm font-bold text-white group-hover:text-[#ff6600] transition-colors">
                  {badge.name}
                </span>
                <span className="text-[11px] font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                  {badge.category}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </div>
  );
};
