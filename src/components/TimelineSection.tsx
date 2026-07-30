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
      title: 'The Operational Bottleneck',
      icon: AlertTriangle,
      iconBg: 'bg-red-500/10 border-red-500/30',
      iconColor: 'text-red-400',
      description: 'High-volume hiring pressures during peak season, complex Amazon compliance mandates, and rising overhead costs threatening fleet profitability.',
      metrics: 'Overhead Pressure & Audit Risks',
    },
    {
      number: '02',
      title: 'Strategic Outsourcing & AI Voicebots',
      icon: Lightbulb,
      iconBg: 'bg-[#ff6600]/10 border-[#ff6600]/30',
      iconColor: 'text-[#ff6600]',
      description: 'Deploying bilingual AI voicebots for driver screening combined with 24x7x365 Cortex dispatchers and certified QuickBooks payroll managers.',
      metrics: '30-40% Cost per Hire Reduction',
    },
    {
      number: '03',
      title: 'Real-Time Dispatch & Compliance',
      icon: TrendingUp,
      iconBg: 'bg-blue-500/10 border-blue-500/30',
      iconColor: 'text-blue-400',
      description: 'Netradyne violation mitigation, proactive timecard reconciliation before Amazon audits, and 100% on-time load dispatching.',
      metrics: '50% Total Cost Savings Achieved',
    },
    {
      number: '04',
      title: 'Scalable Growth & Zero Violations',
      icon: Trophy,
      iconBg: 'bg-emerald-500/10 border-emerald-500/30',
      iconColor: 'text-emerald-400',
      description: 'Client seamlessly scales operations during peak season without expanding internal headcount, achieving Fantastic Plus scorecards.',
      metrics: 'Fantastic Plus Performance',
    },
  ];

  return (
    <section ref={containerRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-[#000000] border-y border-white/10 relative overflow-hidden">
      {/* Background Radial Light Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,102,0,0.12),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-[#ff6600]/40 text-xs font-bold text-[#ff6600]"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#ff6600]" />
            <span>5+ YEARS PROVEN WORKFLOW METHODOLOGY</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How We Transform <span className="gold-text italic font-serif">Logistics Operations</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 font-normal">
            A continuous storytelling workflow driven by 24×7×365 backend excellence and real-time execution.
          </p>
        </div>

        {/* Timeline Grid with Self-Drawing Pulse Connection Line */}
        <div className="relative">
          
          {/* Horizontal Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[3px] bg-white/10 -translate-y-8 z-0">
            {/* Drawing Line Progress */}
            <motion.div
              style={{ scaleX: pathLength }}
              className="h-full bg-gradient-to-r from-[#ff8800] via-[#ff5500] to-[#e63e00] origin-left shadow-[0_0_15px_#ff6600]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isReached = activeStep >= index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`glass-panel p-6 rounded-2xl border transition-all duration-500 relative flex flex-col justify-between cursor-default group shadow-2xl ${
                    isReached 
                      ? 'border-[#ff6600]/50 shadow-[0_0_25px_rgba(255,102,0,0.25)] bg-[#121217]' 
                      : 'border-white/10 bg-[#0d0d10]'
                  }`}
                >
                  {/* Active Soft Orange Spotlight */}
                  {isReached && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-br from-[#ff6600]/15 via-transparent to-transparent pointer-events-none rounded-2xl"
                    />
                  )}

                  <div>
                    {/* Step Top Bar */}
                    <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                      <motion.span 
                        animate={{ color: isReached ? '#ff6600' : '#475569' }}
                        className="text-3xl font-black font-mono tracking-tighter"
                      >
                        {step.number}
                      </motion.span>
                      
                      <AnimatedIcon animation="rotate" className={`p-2.5 rounded-xl border ${step.iconBg} ${step.iconColor}`}>
                        <Icon className="w-5 h-5" />
                      </AnimatedIcon>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-[#ff6600] transition-colors mb-2">
                      {step.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                      {step.description}
                    </p>
                  </div>

                  {/* Highlight Metric Badge */}
                  <div className="mt-6 pt-3 border-t border-white/10 flex items-center gap-1.5 text-xs font-bold text-[#ff6600]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{step.metrics}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* CTA Link */}
        <div className="text-center pt-4">
          <button
            onClick={() => navigate('/success-stories')}
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[#ff6600] hover:text-white transition-colors cursor-pointer"
          >
            <span>Explore All 5+ Years Client Case Studies &amp; Success Stories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
