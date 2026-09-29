import React from 'react';
import { motion } from 'motion/react';
import { MotionSection } from '../components/MotionSection';
import { TextRoll } from '@/components/core/text-roll';
import { 
  Monitor, 
  Headphones, 
  Calculator, 
  Users, 
  Truck, 
  BarChart3, 
  MapPin, 
  Bot, 
  Globe, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';

interface ServicesOverviewPageProps {
  navigate: (path: string) => void;
}

export const ServicesOverviewPage: React.FC<ServicesOverviewPageProps> = ({ navigate }) => {
  const services = [
    {
      title: 'Website Design & Development',
      path: '/website-design-development',
      icon: Monitor,
      category: 'Digital Infrastructure',
      desc: 'Crafting responsive, user-friendly websites that showcase your brand and drive engagement. WordPress, Shopify, HTML/CSS, SEO & UI/UX design.',
      points: ['Mobile Responsive', 'SEO Optimized', 'Portal & E-commerce', 'Fast Loading Performance']
    },
    {
      title: 'DSP Dispatch Support Services',
      path: '/dsp-dispatch-support',
      icon: Headphones,
      category: 'Amazon DSP Operations',
      desc: '24×7×365 Cortex & Netradyne power users proactively managing real-time violation alerts, DVIC checks, driver scorecard tracking, and dispute management.',
      points: ['Amazon Cortex Certified', 'Netradyne Proactive Alerts', 'DVIC Checks', '40-60% Violation Reduction']
    },
    {
      title: 'DSP Accounting & Payroll Services',
      path: '/dsp-accounting-payroll',
      icon: Calculator,
      category: 'Amazon DSP Operations',
      desc: 'Certified QBO and ADP/Paycom specialists managing monthly closures, timecard/punch exception fixes, Amazon invoice validation, and weekly payroll runs.',
      points: ['Certified QBO ProAdvisors', 'ADP & Paycom Specialists', 'Amazon Invoice Audit', 'Error-Free Weekly Payroll']
    },
    {
      title: 'DSP HR & Recruitment Services',
      path: '/dsp-hr-recruitment',
      icon: Users,
      category: 'Amazon DSP Operations',
      desc: 'SmartRecruiters certified team utilizing bilingual AI voicebots (Spanish/English) to automate high-volume hiring and reduce cost per hire by 30-40%.',
      points: ['SmartRecruiters Experts', 'Bilingual AI Voicebots', 'Fountain Migration', '30-40% Cost Reduction']
    },
    {
      title: 'AFP Dispatch Support Services',
      path: '/afp-dispatch-support',
      icon: Truck,
      category: 'Amazon Freight Operations',
      desc: 'Amazon Relay certified team providing complete shift management, route gap resolution, real-time HOS ELD tracking, and documentation audit.',
      points: ['Amazon Relay Specialists', 'Real-Time HOS Log Audits', 'Load Error Resolution', 'On-Time Performance']
    },
    {
      title: 'AFP Accounting & TMS Management',
      path: '/afp-accounting-tms',
      icon: BarChart3,
      category: 'Amazon Freight Operations',
      desc: 'Per-load P&L profitability tracking, automated IFTA filing, TMS configuration (Alvys, AscendTMS), and seamless factoring company coordination.',
      points: ['Per-Load Profitability', 'Accurate IFTA Filing', 'Alvys & AscendTMS', 'Factoring Coordination']
    },
    {
      title: 'Dedicated Lane Services',
      path: '/dedicated-lane-services',
      icon: MapPin,
      category: 'Logistics Operations',
      desc: 'Complete load lifecycle management following Amazon 12-Step Proof of Delivery (POD) workflow with continuous shift oversight and BOL verification.',
      points: ['12-Step POD Lifecycle', 'Real-Time GPS & HOS', 'BOL Verification', 'Zero Missed Steps']
    },
    {
      title: 'HR BPO Services',
      path: '/hr-bpo-services',
      icon: Users,
      category: 'Business Process Outsourcing',
      desc: 'End-to-end HR operations: payroll processing, benefits administration, employee data management, compliance reporting, and time/attendance setup.',
      points: ['Payroll & Tax Processing', 'Benefits Administration', 'Compliance & EEO-1', 'Scalable Workforce']
    },
    {
      title: 'Virtual Assistants',
      path: '/virtual-assistants',
      icon: Bot,
      category: 'Business Process Outsourcing',
      desc: 'Dedicated remote virtual assistants handling executive administration, customer service ticketing, data entry, social media, and market research.',
      points: ['Admin & Email Support', 'Customer Live Chat', 'Data Cleaning & Entry', 'Flexible Hours & Scale']
    },
    {
      title: 'Digital Marketing Operations',
      path: '/digital-marketing',
      icon: Globe,
      category: 'Digital Infrastructure',
      desc: 'Full digital spectrum coverage: SEO, social media ad management, email marketing campaigns, CRM solutions, and outcome-based pricing models.',
      points: ['One-Stop Digital Shop', 'Outcome-Based Pricing', '8 Industry Expertise', 'Measurable Growth ROI']
    }
  ];

  return (
    <div className="font-sans text-slate-100 bg-[#0a0a0a]">
      
      {/* HERO SECTION */}
      <section className="bg-[#050505] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(197,160,89,0.1),transparent_70%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-block px-3.5 py-1.5 rounded-full bg-white/5 text-[#c5a059] border border-[#c5a059]/30 text-xs font-bold uppercase tracking-wider">
            Complete Operations Suite
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            <TextRoll className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              Comprehensive Operational Solutions
            </TextRoll>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            Explore our specialized backend support services designed specifically for Amazon DSPs, Amazon Freight Partners, trucking companies, and growing enterprises.
          </p>
        </div>
      </section>

      {/* SERVICES GRID */}
      <MotionSection className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((s, index) => {
              const Icon = s.icon;
              return (
                <motion.div 
                  key={s.path}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="glass-panel p-8 hover:border-[#c5a059]/50 transition-all flex flex-col justify-between group shadow-xl cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="p-3.5 rounded-xl bg-white/5 text-[#c5a059] border border-white/10 group-hover:scale-110 group-hover:border-[#c5a059]/40 transition-all">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold text-[#c5a059] bg-[#c5a059]/10 px-2.5 py-1 rounded-full border border-[#c5a059]/30">
                        {s.category}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white group-hover:text-[#c5a059] transition-colors">{s.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{s.desc}</p>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {s.points.map((pt, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(s.path)}
                    className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#c5a059] group-hover:text-[#e0bb75]"
                  >
                    <span>View Dedicated Page &amp; Detailed Specs</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              );
            })}
          </div>

        </div>
      </MotionSection>

      {/* CTA */}
      <MotionSection className="py-16 px-4 sm:px-6 lg:px-8 bg-[#050505] border-t border-white/10 text-white text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl font-extrabold">Need a Custom Operations Package?</h2>
          <p className="text-slate-300 text-sm sm:text-base">
            We tailor our services to match your exact fleet size, route volumes, and software setup.
          </p>
          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/contact')}
              className="bg-[#c5a059] hover:bg-[#d8b36c] text-black font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-[0_0_20px_rgba(197,160,89,0.2)] hover:shadow-[0_0_30px_rgba(197,160,89,0.4)] transition-all cursor-pointer"
            >
              Talk to an Operations Specialist
            </motion.button>
          </div>
        </div>
      </MotionSection>

    </div>
  );
};

