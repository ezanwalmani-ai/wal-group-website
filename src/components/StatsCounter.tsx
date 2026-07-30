import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Clock, Percent, TrendingDown, ShieldAlert } from 'lucide-react';
import { AnimatedIcon } from './AnimatedIcon';

export const StatsCounter: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [yearsCount, setYearsCount] = useState(0);
  const [savingsCount, setSavingsCount] = useState(0);
  const [hiringMinCount, setHiringMinCount] = useState(0);
  const [hiringMaxCount, setHiringMaxCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const duration = 1500; // 1.5s smooth ease-out count

    const animateCounters = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic function
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setYearsCount(Math.round(easeProgress * 5));
      setSavingsCount(Math.round(easeProgress * 50));
      setHiringMinCount(Math.round(easeProgress * 30));
      setHiringMaxCount(Math.round(easeProgress * 40));

      if (progress < 1) {
        requestAnimationFrame(animateCounters);
      }
    };

    const animId = requestAnimationFrame(animateCounters);
    return () => cancelAnimationFrame(animId);
  }, [isVisible]);

  return (
    <section ref={containerRef} className="bg-[#000000] text-white py-12 px-4 sm:px-6 lg:px-8 border-y border-white/10 shadow-2xl relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Stat 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-panel p-6 hover:border-[#ff7700]/40 transition-all flex flex-col items-center text-center group cursor-default"
          >
            <AnimatedIcon animation="rotate" className="p-3 rounded-lg bg-white/5 border border-white/10 text-[#ff7700] mb-3 group-hover:border-[#ff7700]/50 transition-all">
              <Clock className="w-7 h-7" />
            </AnimatedIcon>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {yearsCount}+
            </div>
            <div className="text-sm font-bold text-[#ff7700] mt-1">
              Years of Operational Excellence
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Supporting DSP &amp; Trucking Operations
            </div>
          </motion.div>

          {/* Stat 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-panel p-6 hover:border-[#ff7700]/40 transition-all flex flex-col items-center text-center group cursor-default"
          >
            <AnimatedIcon animation="pulse" className="p-3 rounded-lg bg-white/5 border border-white/10 text-[#ff7700] mb-3 group-hover:border-[#ff7700]/50 transition-all">
              <Percent className="w-7 h-7" />
            </AnimatedIcon>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {savingsCount}%
            </div>
            <div className="text-sm font-bold text-[#ff7700] mt-1">
              Cost Savings Delivered
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Reduction in Operational Costs
            </div>
          </motion.div>

          {/* Stat 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-panel p-6 hover:border-[#ff7700]/40 transition-all flex flex-col items-center text-center group cursor-default"
          >
            <AnimatedIcon animation="bounce" className="p-3 rounded-lg bg-white/5 border border-white/10 text-[#ff7700] mb-3 group-hover:border-[#ff7700]/50 transition-all">
              <TrendingDown className="w-7 h-7" />
            </AnimatedIcon>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {hiringMinCount}-{hiringMaxCount}%
            </div>
            <div className="text-sm font-bold text-[#ff7700] mt-1">
              Hiring Cost Optimization
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Lower Cost per Hire for DSPs
            </div>
          </motion.div>

          {/* Stat 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-panel p-6 hover:border-[#ff7700]/40 transition-all flex flex-col items-center text-center group cursor-default"
          >
            <AnimatedIcon animation="float" className="p-3 rounded-lg bg-white/5 border border-white/10 text-[#ff7700] mb-3 group-hover:border-[#ff7700]/50 transition-all">
              <ShieldAlert className="w-7 h-7" />
            </AnimatedIcon>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              24×7×365
            </div>
            <div className="text-sm font-bold text-[#ff7700] mt-1">
              Operational Coverage
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Until the Last Truck Returns
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

