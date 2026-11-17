import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp, 
  Trophy, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { AnimatedIcon } from './AnimatedIcon';

interface TimelineStep {
  number: string;
  title: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  description: string;
  metrics: string;
}

export const TimelineSection: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.7', 'end 0.3'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });
  const pathLength = useTransform(smoothProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (latest) => {
      if (latest < 0.25) setActiveStep(0);
      else if (latest < 0.5) setActiveStep(1);
      else if (latest < 0.75) setActiveStep(2);
      else setActiveStep(3);
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  const steps: TimelineStep[] = [
    {
      number: '01',
      title: 'Operational Bottleneck',
      icon: AlertTriangle,
      iconBg: 'bg-red-500/10 border-red-500/30',
      iconColor: 'text-red-400',
      description: 'Peak-season hiring pressure, compliance risks, and rising fleet overhead.',
      metrics: 'Overhead & Audit Risks',
    },
    {
      number: '02',
      title: 'AI Voicebots & Outsourcing',
      icon: Lightbulb,
      iconBg: 'bg-[#ff6600]/10 border-[#ff6600]/30',
      iconColor: 'text-[#ff6600]',
      description: 'Bilingual AI hiring, 24×7 Cortex dispatchers, and QBO payroll experts.',
      metrics: '30–40% Lower Hiring Cost',
    },
    {
      number: '03',
      title: 'Real-Time Dispatch & Audits',
      icon: TrendingUp,
      iconBg: 'bg-blue-500/10 border-blue-500/30',
      iconColor: 'text-blue-400',
      description: 'Netradyne mitigation, timecard audits, and 100% on-time load dispatch.',
      metrics: '50% Total Cost Savings',
    },
    {
      number: '04',
      title: 'Scalable Zero-Violation Growth',
      icon: Trophy,
      iconBg: 'bg-emerald-500/10 border-emerald-500/30',
      iconColor: 'text-emerald-400',
      description: 'Scale peak volume without internal headcount and hit top scorecards.',
      metrics: 'Fantastic Plus Performance',
    },
  ];

  return (
    <section ref={containerRef} className="py-12 sm:py-14 px-4 sm:px-6 lg:px-8 bg-[#000000] border-y border-white/10 relative overflow-hidden">
      {/* Background Radial Light Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,102,0,0.12),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/5 border border-[#ff6600]/40 text-[11px] font-bold text-[#ff6600]"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#ff6600]" />
            <span>5+ YEARS PROVEN WORKFLOW</span>
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How We Transform <span className="gold-text italic font-serif">Logistics Operations</span>
          </h2>
          <p className="text-sm text-slate-400 font-normal">
            24×7×365 backend execution from onboarding to peak-season scale.
          </p>
        </div>

        {/* Timeline Grid with Self-Drawing Pulse Connection Line */}
        <div className="relative">
          
          {/* Horizontal Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[2px] bg-white/10 -translate-y-4 z-0">
            {/* Drawing Line Progress */}
            <motion.div
              style={{ scaleX: pathLength }}
              className="h-full bg-gradient-to-r from-[#ff8800] via-[#ff5500] to-[#e63e00] origin-left shadow-[0_0_12px_#ff6600]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isReached = activeStep >= index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '200px 0px 50px 0px' }}
                  transition={{ duration: 0.3, delay: index * 0.06 }}
                  whileHover={{ y: -4 }}
                  className={`glass-panel p-4 sm:p-5 rounded-xl border transition-all duration-300 relative flex flex-col justify-between cursor-default group shadow-lg ${
                    isReached 
                      ? 'border-[#ff6600]/50 shadow-[0_0_20px_rgba(255,102,0,0.2)] bg-[#121217]' 
                      : 'border-white/10 bg-[#0d0d10]'
                  }`}
                >
                  {/* Active Soft Orange Spotlight */}
                  {isReached && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-br from-[#ff6600]/12 via-transparent to-transparent pointer-events-none rounded-xl"
                    />
                  )}

                  <div className="relative z-10">
                    {/* Step Top Bar */}
                    <div className="flex items-center justify-between mb-2.5 border-b border-white/10 pb-2">
                      <motion.span 
                        animate={{ color: isReached ? '#ff6600' : '#475569' }}
                        className="text-xl font-black font-mono tracking-tighter"
                      >
                        {step.number}
                      </motion.span>
                      
                      <AnimatedIcon animation="rotate" className={`p-2 rounded-lg border ${step.iconBg} ${step.iconColor}`}>
                        <Icon className="w-4 h-4" />
                      </AnimatedIcon>
                    </div>

                    <h3 className="text-sm sm:text-[15px] font-bold text-white group-hover:text-[#ff6600] transition-colors mb-1.5 leading-snug">
                      {step.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed font-normal line-clamp-2">
                      {step.description}
                    </p>
                  </div>

                  {/* Highlight Metric Badge */}
                  <div className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-semibold text-[#ff6600]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{step.metrics}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* CTA Link */}
        <div className="text-center pt-1">
          <button
            onClick={() => navigate('/success-stories')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#ff6600] hover:text-white transition-colors cursor-pointer"
          >
            <span>Explore Client Case Studies &amp; Success Stories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
