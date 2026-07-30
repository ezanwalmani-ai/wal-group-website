import React from 'react';
import { motion } from 'motion/react';
import { XCircle, CheckCircle2, ArrowRight, ShieldCheck, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

export const ServiceComparison: React.FC = () => {
  const traditionalPoints = [
    'Generalist Virtual Assistants with zero Amazon Cortex / Relay experience',
    'High driver turnover due to delayed screening and unmonitored ATS',
    'Unchecked Netradyne safety violations leading to scorecard drop',
    'Manual payroll delays & error-prone weekly scorecard reconciliation',
    'Fixed high overhead cost during non-peak operational off-seasons'
  ];

  const walGroupsPoints = [
    '24/7/365 Dedicated Cortex dispatchers trained specifically on Amazon DSP/AFP',
    'Bilingual AI Driver Voicebot reducing cost-per-hire by 30–40%',
    'Proactive Netradyne violation mitigation guaranteeing Fantastic Plus scorecards',
    '100% Audit-accurate weekly driver payroll integrated with QuickBooks & ADP',
    '50% Total operational cost savings with scalable, elastic BPO models'
  ];

  const beforeAfterMetrics = [
    {
      metric: 'Driver Onboarding Time',
      before: '7–10 Days Average',
      after: '24–48 Hours with AI Voicebot',
      impact: '80% Faster Hiring'
    },
    {
      metric: 'Netradyne Safety Score',
      before: 'Fair / Poor Scorecards',
      after: 'Fantastic Plus Certified',
      impact: 'Max Amazon Bonuses'
    },
    {
      metric: 'Operational Cost per Driver',
      before: '$450+ / Month Overhead',
      after: '$210 / Month Managed BPO',
      impact: '50%+ Cost Savings'
    },
    {
      metric: 'Dispatch Coverage & Response',
      before: 'Delayed Call Handling',
      after: 'Sub-60s Instant Cortex Dispatch',
      impact: '100% On-Time Route Execution'
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#000000] border-y border-white/10 relative overflow-hidden">
      {/* Soft Radial Ambient Lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#ff6600]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#ff6600]/40 text-xs font-bold text-[#ff6600]">
            <Zap className="w-3.5 h-3.5 text-[#ff6600]" />
            <span>THE WAL GROUP ADVANTAGE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Traditional Outsourcing <span className="gold-text italic font-serif">vs. Wal Group</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 font-normal">
            See how specialized Amazon DSP &amp; AFP back-office engineering transforms fleet profitability.
          </p>
        </div>

        {/* 2-Column Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Traditional Outsourcing Column (Red/Grey Accent) */}
          <div className="glass-panel p-8 rounded-3xl border border-red-500/20 bg-[#0d0909] space-y-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-red-500/10 border-b border-l border-red-500/30 text-red-400 text-xs font-bold rounded-bl-2xl">
              TRADITIONAL BPO
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Traditional Virtual Staffing</h3>
                  <p className="text-xs text-slate-400">Generic staffing agencies without domain expertise</p>
                </div>
              </div>

              <div className="space-y-4">
                {traditionalPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 text-xs text-red-400 font-bold flex items-center justify-between">
              <span>Risk: Unpredictable Scorecards &amp; High Turnover</span>
              <span className="text-slate-500 font-mono">Status Quo</span>
            </div>
          </div>

          {/* Wal Group Column (Gold/Orange Accent) */}
          <div className="glass-panel p-8 rounded-3xl border border-[#ff6600]/60 bg-[#140e0a] space-y-6 flex flex-col justify-between shadow-[0_0_30px_rgba(255,102,0,0.2)] relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#ff6600] text-black text-xs font-extrabold rounded-bl-2xl shadow-[0_0_12px_#ff6600]">
              THE WAL GROUP MODEL
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-[#ff6600]/20 border border-[#ff6600] text-[#ff6600] shadow-[0_0_15px_rgba(255,102,0,0.5)]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Wal Group Managed BPO &amp; AI</h3>
                  <p className="text-xs text-[#ff6600] font-medium">5+ Years specialized Amazon DSP/AFP engineering</p>
                </div>
              </div>

              <div className="space-y-4">
                {walGroupsPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-white font-medium leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 text-xs text-emerald-400 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> Fantastic Plus Scorecards Guaranteed
              </span>
              <span className="text-[#ff6600] font-mono font-black">50% Savings</span>
            </div>
          </div>

        </div>

        {/* Before vs After Impact Metrics Grid */}
        <div className="space-y-6 pt-6">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold text-white">Before vs. After <span className="gold-text">Transformation Metrics</span></h3>
            <p className="text-xs text-slate-400">Measured operational outcomes across partner DSP fleets.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {beforeAfterMetrics.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#ff6600]/50 transition-all space-y-4 bg-[#0a0a0f] flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {item.metric}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-red-400">Before</span>
                      <span className="font-semibold">{item.before}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-emerald-400">After</span>
                      <span className="font-bold">{item.after}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 text-center text-xs font-black text-[#ff6600] bg-[#ff6600]/10 py-2 rounded-xl border border-[#ff6600]/30">
                  {item.impact}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
