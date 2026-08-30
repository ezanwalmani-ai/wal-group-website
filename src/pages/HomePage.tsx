import React from 'react';
import { motion } from 'motion/react';
import { useBooking } from '../context/BookingContext';
import { AnimatedWhiteLinesBackground } from '../components/AnimatedWhiteLinesBackground';
import { CinematicHeroScanLight } from '../components/CinematicHeroScanLight';
import { StatsCounter } from '../components/StatsCounter';
import { AnimatedHeading } from '../components/AnimatedHeading';
import { MotionSection } from '../components/MotionSection';
import { AnimatedIcon } from '../components/AnimatedIcon';
import { AnimatedImage } from '../components/AnimatedImage';
import { TimelineSection } from '../components/TimelineSection';
import { TrustMarquee } from '../components/TrustMarquee';
import { SectionDivider } from '../components/SectionDivider';
import { Magnetic } from '../components/Magnetic';
import { ServiceComparison } from '../components/ServiceComparison';
import { InsideWalGroups } from '../components/InsideWalGroups';
import { GlobalPresence } from '../components/GlobalPresence';
import { InteractiveOfficeLocations } from '../components/InteractiveOfficeLocations';
import { 
  ArrowRight, 
  Monitor, 
  Headphones, 
  Calculator, 
  Users, 
  Truck, 
  BarChart3, 
  MapPin, 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp, 
  Trophy, 
  Database, 
  ShieldCheck, 
  Bot, 
  CheckCircle2, 
  Cpu, 
  Shield,
  Sparkles
} from 'lucide-react';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { openBookDemo } = useBooking();
  return (
    <div className="font-sans text-slate-100 bg-[#000000]">
      
      {/* HERO SECTION - Full Screen Command Center Impact */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-[#000000] text-white overflow-hidden py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        {/* Background image overlay showing logistics command center / dispatch control room */}
        <div className="absolute inset-0 z-0">
          <AnimatedImage 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80" 
            alt="Logistics Operations Control Room" 
            containerClassName="w-full h-full opacity-15"
            className="w-full h-full object-cover object-center"
            entranceAnimation="fadeIn"
            hoverEffect="none"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/95 to-black/90"></div>
          {/* Subtle light orange ambient glow behind hero */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,119,0,0.15),transparent_70%)] pointer-events-none"></div>
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#ff7700]/10 rounded-full blur-[120px] pointer-events-none"
          />
          {/* Network of thin animated white lines with ambient pulse & cursor interaction */}
          <AnimatedWhiteLinesBackground />
          {/* Ultra-premium cinematic scanning light sweep with dust particles */}
          <CinematicHeroScanLight />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-6 text-left">
            
            {/* Tagline Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#ff7700]/40 text-xs sm:text-sm font-bold text-[#ff7700] backdrop-blur-md shadow-lg"
            >
              <span className="w-2 h-2 rounded-full bg-[#ff7700] animate-pulse"></span>
              <span>24×7×365 BACKEND OPERATIONS &amp; OUTSOURCING</span>
            </motion.div>

            {/* H1 Headline Reveal Word by Word */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              <AnimatedHeading text="We Run the Backend So You Can Run the Business." highlightWord="So You Can" />
            </h1>

            {/* Subheadline with Blur-to-Sharp Fade */}
            <motion.p 
              initial={{ opacity: 0, filter: 'blur(8px)', y: 15 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed font-normal"
            >
              Smart outsourcing, streamlined delivery services, and professional websites — all in one place. Engineered for Amazon DSPs, Amazon Freight Partners, and growing logistics fleets.
            </motion.p>

            {/* CTA Buttons - Distinct Visual Hierarchy */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5"
            >
              {/* Primary CTA - Explore Our Solutions */}
              <motion.button
                whileHover={{ scale: 1.025, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                onClick={() => navigate('/services')}
                className="relative overflow-hidden bg-gradient-to-r from-[#e65c00] via-[#ff7700] to-[#ff8512] text-slate-950 font-bold text-base px-9 py-4 rounded-[16px] border border-white/30 shadow-[0_6px_24px_rgba(255,119,0,0.28)] hover:shadow-[0_10px_32px_rgba(255,119,0,0.45)] transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                {/* Subtle light sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
                <span className="tracking-tight">Explore Our Solutions</span>
                <ArrowRight className="w-5 h-5 text-slate-950 transform group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>

              {/* Secondary CTA - Book a Demo (Dark Glass + Orange Border) */}
              <motion.button
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                onClick={openBookDemo}
                className="relative overflow-hidden bg-black/60 hover:bg-white/10 text-white font-semibold text-base px-8 py-4 rounded-[16px] border border-[#ff7700]/35 hover:border-[#ff7700]/75 shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                {/* Subtle orange reflection sweep on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff7700]/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
                <Sparkles className="w-5 h-5 text-[#ff7700] shrink-0 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
                <span className="tracking-tight">Book a Demo</span>
              </motion.button>
            </motion.div>

            {/* Badges / Tech highlight */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-400"
            >
              <span className="font-bold text-[#ff7700] uppercase tracking-wider">Ecosystem Experts:</span>
              <span className="bg-white/5 px-3 py-1 rounded-md border border-white/10 hover:border-[#ff7700]/40 transition-colors">Amazon Cortex</span>
              <span className="bg-white/5 px-3 py-1 rounded-md border border-white/10 hover:border-[#ff7700]/40 transition-colors">Netradyne</span>
              <span className="bg-white/5 px-3 py-1 rounded-md border border-white/10 hover:border-[#ff7700]/40 transition-colors">SmartRecruiters</span>
              <span className="bg-white/5 px-3 py-1 rounded-md border border-white/10 hover:border-[#ff7700]/40 transition-colors">Amazon Relay</span>
              <span className="bg-white/5 px-3 py-1 rounded-md border border-white/10 hover:border-[#ff7700]/40 transition-colors">QuickBooks &amp; ADP</span>
            </motion.div>

          </div>

          {/* Hero Right Visual Dashboard Card with gentle floating animation */}
          <div className="lg:col-span-4 hidden lg:block">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="glass-panel p-6 shadow-2xl backdrop-blur-xl space-y-4 hover:border-[#ff7700]/40 transition-all cursor-default"
              >
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Live Control Center</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">24/7 ACTIVE</span>
                </div>

                <div className="space-y-3">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-xs flex justify-between items-center hover:bg-white/10 transition-colors">
                    <div>
                      <div className="text-slate-400 text-[10px]">NETRADYNE SAFETY SCORE</div>
                      <div className="text-lg font-extrabold text-white">995 <span className="text-emerald-400 text-xs font-normal">(+18 pts)</span></div>
                    </div>
                    <ShieldCheck className="w-8 h-8 text-emerald-400" />
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-xs flex justify-between items-center hover:bg-white/10 transition-colors">
                    <div>
                      <div className="text-slate-400 text-[10px]">TIME CARD RECONCILIATION</div>
                      <div className="text-lg font-extrabold text-white">100% Verified</div>
                    </div>
                    <Bot className="w-8 h-8 text-[#ff7700]" />
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-xs flex justify-between items-center hover:bg-white/10 transition-colors">
                    <div>
                      <div className="text-slate-400 text-[10px]">COST PER HIRE REDUCTION</div>
                      <div className="text-lg font-extrabold text-[#ff7700]">38% Savings</div>
                    </div>
                    <TrendingUp className="w-8 h-8 text-[#ff7700]" />
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 text-center italic border-t border-white/10">
                  "Proactive shift management &amp; automated compliance."
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CORE SERVICES GRID SECTION */}
      <MotionSection className="py-20 px-4 sm:px-6 lg:px-8 bg-[#000000]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Our Core <span className="gold-text italic font-serif">Services</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400 font-normal">
              Specialized backend support built for Amazon DSPs, Amazon Freight Partners, and trucking operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1: Website Design & Development */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate('/website-design-development')}
              className="relative p-7 bg-[#0b101b]/85 border border-white/10 hover:border-[#ff7700]/60 transition-all flex flex-col justify-between group shadow-lg cursor-pointer overflow-hidden rounded-2xl backdrop-blur-md"
            >
              {/* Background wrapper with absolute inset-0 z-0, smooth opacity transition, and mix-blend-multiply dark overlay mask */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-2xl transition-opacity duration-400 ease-in-out">
                <picture>
                  <source srcSet="/images/services/web-design-dev-400.avif 400w, /images/services/web-design-dev-800.avif 800w" type="image/avif" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px" />
                  <source srcSet="/images/services/web-design-dev-400.webp 400w, /images/services/web-design-dev-800.webp 800w" type="image/webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px" />
                  <img 
                    src="/images/services/web-design-dev.jpg" 
                    alt="Website Design & Development Background"
                    aria-hidden="true"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover object-center opacity-25 group-hover:opacity-35 group-hover:scale-105 transition-all duration-500 ease-out"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-b from-[#080d17]/55 via-[#05080f]/65 to-[#020408]/80 mix-blend-multiply transition-colors duration-500" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,119,0,0.12),transparent_70%)] pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#020408]/90 via-[#03060c]/50 to-transparent pointer-events-none" />
              </div>

              <div className="relative z-10 space-y-4">
                <AnimatedIcon animation="rotate" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#ff7700] group-hover:border-[#ff7700]/50 transition-all">
                  <Monitor className="w-6 h-6" />
                </AnimatedIcon>
                <h3 className="text-xl font-bold text-white group-hover:text-[#ff7700] transition-colors">Website Design &amp; Development</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  We build modern, responsive websites that help your business stand out online. From simple business sites to complex portals, we deliver exceptional digital experiences.
                </p>
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Technologies</span>
                  <div className="text-xs text-slate-300 font-medium">
                    WordPress | Shopify | HTML &amp; CSS | Responsive Design | SEO Optimization | UI/UX
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/website-design-development');
                }}
                className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#ff7700] group-hover:text-[#ff9933]"
              >
                <span>Learn More About Web Dev</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Card 2: DSP Dispatch Support Services */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate('/dsp-dispatch-support')}
              className="relative p-7 bg-[#0b101b]/85 border border-white/10 hover:border-[#ff7700]/60 transition-all flex flex-col justify-between group shadow-lg cursor-pointer overflow-hidden rounded-2xl backdrop-blur-md"
            >
              {/* Background wrapper with absolute inset-0 z-0, smooth opacity transition, and mix-blend-multiply dark overlay mask */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-2xl transition-opacity duration-400 ease-in-out">
                <picture>
                  <source srcSet="/images/services/dsp-dispatch-400.avif 400w, /images/services/dsp-dispatch-800.avif 800w" type="image/avif" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px" />
                  <source srcSet="/images/services/dsp-dispatch-400.webp 400w, /images/services/dsp-dispatch-800.webp 800w" type="image/webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px" />
                  <img 
                    src="/images/services/dsp-dispatch.jpg" 
                    alt="DSP Dispatch Support Background"
                    aria-hidden="true"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover object-center opacity-25 group-hover:opacity-35 group-hover:scale-105 transition-all duration-500 ease-out"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-b from-[#080d17]/55 via-[#05080f]/65 to-[#020408]/80 mix-blend-multiply transition-colors duration-500" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,119,0,0.12),transparent_70%)] pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#020408]/90 via-[#03060c]/50 to-transparent pointer-events-none" />
              </div>

              <div className="relative z-10 space-y-4">
                <AnimatedIcon animation="rotate" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#ff7700] group-hover:border-[#ff7700]/50 transition-all">
                  <Headphones className="w-6 h-6" />
                </AnimatedIcon>
                <h3 className="text-xl font-bold text-white group-hover:text-[#ff7700] transition-colors">DSP Dispatch Support Services</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  End-to-end dispatch operations with Amazon Cortex and Netradyne expertise. Our team provides 24×7×365 coverage ensuring no load is left behind and every violation is handled proactively.
                </p>
                <div className="space-y-1 text-xs text-slate-200 font-medium pt-2">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#ff7700]" /> Netradyne Power Users &amp; Real-Time Alerts</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#ff7700]" /> DVIC Checks &amp; Driver Scorecard Tracking</div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/dsp-dispatch-support');
                }}
                className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#ff7700] group-hover:text-[#ff9933]"
              >
                <span>Learn More About DSP Dispatch</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Card 3: DSP Accounting & Payroll Services */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate('/dsp-accounting-payroll')}
              className="relative p-7 bg-[#0b101b]/85 border border-white/10 hover:border-[#ff7700]/60 transition-all flex flex-col justify-between group shadow-lg cursor-pointer overflow-hidden rounded-2xl backdrop-blur-md"
            >
              {/* Background wrapper with absolute inset-0 z-0, smooth opacity transition, and mix-blend-multiply dark overlay mask */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-2xl transition-opacity duration-400 ease-in-out">
                <picture>
                  <source srcSet="/images/services/dsp-accounting-400.avif 400w, /images/services/dsp-accounting-800.avif 800w" type="image/avif" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px" />
                  <source srcSet="/images/services/dsp-accounting-400.webp 400w, /images/services/dsp-accounting-800.webp 800w" type="image/webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px" />
                  <img 
                    src="/images/services/dsp-accounting.jpg" 
                    alt="DSP Accounting & Payroll Background"
                    aria-hidden="true"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover object-center opacity-25 group-hover:opacity-35 group-hover:scale-105 transition-all duration-500 ease-out"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-b from-[#080d17]/55 via-[#05080f]/65 to-[#020408]/80 mix-blend-multiply transition-colors duration-500" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,119,0,0.12),transparent_70%)] pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#020408]/90 via-[#03060c]/50 to-transparent pointer-events-none" />
              </div>

              <div className="relative z-10 space-y-4">
                <AnimatedIcon animation="pulse" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#ff7700] group-hover:border-[#ff7700]/50 transition-all">
                  <Calculator className="w-6 h-6" />
                </AnimatedIcon>
                <h3 className="text-xl font-bold text-white group-hover:text-[#ff7700] transition-colors">DSP Accounting &amp; Payroll Services</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Certified QBO and ADP/Paycom experts ensuring accurate bookkeeping and seamless weekly payroll runs. We eliminate errors and ensure drivers are paid correctly, every time.
                </p>
                <div className="space-y-1 text-xs text-slate-200 font-medium pt-2">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#ff7700]" /> Certified QBO &amp; ADP Specialists</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#ff7700]" /> Amazon Invoice Validation &amp; Timecard Audits</div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/dsp-accounting-payroll');
                }}
                className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#ff7700] group-hover:text-[#ff9933]"
              >
                <span>Learn More About Accounting</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Card 4: DSP HR & Recruitment Services */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate('/dsp-hr-recruitment')}
              className="relative p-7 bg-[#0b101b]/85 border border-white/10 hover:border-[#ff7700]/60 transition-all flex flex-col justify-between group shadow-lg cursor-pointer overflow-hidden rounded-2xl backdrop-blur-md"
            >
              {/* Background wrapper with absolute inset-0 z-0, smooth opacity transition, and mix-blend-multiply dark overlay mask */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-2xl transition-opacity duration-400 ease-in-out">
                <picture>
                  <source srcSet="/images/services/dsp-hr-recruitment-400.avif 400w, /images/services/dsp-hr-recruitment-800.avif 800w" type="image/avif" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px" />
                  <source srcSet="/images/services/dsp-hr-recruitment-400.webp 400w, /images/services/dsp-hr-recruitment-800.webp 800w" type="image/webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px" />
                  <img 
                    src="/images/services/dsp-hr-recruitment.jpg" 
                    alt="DSP HR & Recruitment Background"
                    aria-hidden="true"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover object-center opacity-25 group-hover:opacity-35 group-hover:scale-105 transition-all duration-500 ease-out"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-b from-[#080d17]/55 via-[#05080f]/65 to-[#020408]/80 mix-blend-multiply transition-colors duration-500" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,119,0,0.12),transparent_70%)] pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#020408]/90 via-[#03060c]/50 to-transparent pointer-events-none" />
              </div>

              <div className="relative z-10 space-y-4">
                <AnimatedIcon animation="bounce" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#ff7700] group-hover:border-[#ff7700]/50 transition-all">
                  <Users className="w-6 h-6" />
                </AnimatedIcon>
                <h3 className="text-xl font-bold text-white group-hover:text-[#ff7700] transition-colors">DSP HR &amp; Recruitment Services</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Certified SmartRecruiters experts using AI-powered automation to reduce cost per hire by 30–40%. We handle high-volume hiring with bilingual AI voicebots.
                </p>
                <div className="space-y-1 text-xs text-slate-200 font-medium pt-2">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#ff7700]" /> Spanish/English AI Voicebots</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#ff7700]" /> Fountain to SmartRecruiters Migration</div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/dsp-hr-recruitment');
                }}
                className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#ff7700] group-hover:text-[#ff9933]"
              >
                <span>Learn More About Recruitment</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Card 5: AFP Dispatch Support Services */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate('/afp-dispatch-support')}
              className="relative p-7 bg-[#0b101b]/85 border border-white/10 hover:border-[#ff7700]/60 transition-all flex flex-col justify-between group shadow-lg cursor-pointer overflow-hidden rounded-2xl backdrop-blur-md"
            >
              {/* Background wrapper with absolute inset-0 z-0, smooth opacity transition, and mix-blend-multiply dark overlay mask */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-2xl transition-opacity duration-400 ease-in-out">
                <picture>
                  <source srcSet="/images/services/afp-dispatch-400.avif 400w, /images/services/afp-dispatch-800.avif 800w" type="image/avif" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px" />
                  <source srcSet="/images/services/afp-dispatch-400.webp 400w, /images/services/afp-dispatch-800.webp 800w" type="image/webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px" />
                  <img 
                    src="/images/services/afp-dispatch.jpg" 
                    alt="AFP Dispatch Support Background"
                    aria-hidden="true"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover object-center opacity-25 group-hover:opacity-35 group-hover:scale-105 transition-all duration-500 ease-out"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-b from-[#080d17]/55 via-[#05080f]/65 to-[#020408]/80 mix-blend-multiply transition-colors duration-500" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,119,0,0.12),transparent_70%)] pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#020408]/90 via-[#03060c]/50 to-transparent pointer-events-none" />
              </div>

              <div className="relative z-10 space-y-4">
                <AnimatedIcon animation="rotate" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#ff7700] group-hover:border-[#ff7700]/50 transition-all">
                  <Truck className="w-6 h-6" />
                </AnimatedIcon>
                <h3 className="text-xl font-bold text-white group-hover:text-[#ff7700] transition-colors">AFP Dispatch Support Services</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Complete end-to-end shift management for Amazon AFP operations with proactive resolution. We monitor every load, every hour, ensuring on-time performance.
                </p>
                <div className="space-y-1 text-xs text-slate-200 font-medium pt-2">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#ff7700]" /> Amazon Relay Experts &amp; Load Booking</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#ff7700]" /> Real-time HOS Log Monitoring &amp; Route Gaps</div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/afp-dispatch-support');
                }}
                className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#ff7700] group-hover:text-[#ff9933]"
              >
                <span>Learn More About AFP Dispatch</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Card 6: AFP Accounting & TMS Management */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate('/afp-accounting-tms')}
              className="relative p-7 bg-[#0b101b]/85 border border-white/10 hover:border-[#ff7700]/60 transition-all flex flex-col justify-between group shadow-lg cursor-pointer overflow-hidden rounded-2xl backdrop-blur-md"
            >
              {/* Background wrapper with absolute inset-0 z-0, smooth opacity transition, and mix-blend-multiply dark overlay mask */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-2xl transition-opacity duration-400 ease-in-out">
                <picture>
                  <source srcSet="/images/services/afp-accounting-400.avif 400w, /images/services/afp-accounting-800.avif 800w" type="image/avif" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px" />
                  <source srcSet="/images/services/afp-accounting-400.webp 400w, /images/services/afp-accounting-800.webp 800w" type="image/webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px" />
                  <img 
                    src="/images/services/afp-accounting.jpg" 
                    alt="AFP Accounting & TMS Reconciliation Background"
                    aria-hidden="true"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover object-center opacity-25 group-hover:opacity-35 group-hover:scale-105 transition-all duration-500 ease-out"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-b from-[#080d17]/55 via-[#05080f]/65 to-[#020408]/80 mix-blend-multiply transition-colors duration-500" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,119,0,0.12),transparent_70%)] pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#020408]/90 via-[#03060c]/50 to-transparent pointer-events-none" />
              </div>

              <div className="relative z-10 space-y-4">
                <AnimatedIcon animation="scale" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#ff7700] group-hover:border-[#ff7700]/50 transition-all">
                  <BarChart3 className="w-6 h-6" />
                </AnimatedIcon>
                <h3 className="text-xl font-bold text-white group-hover:text-[#ff7700] transition-colors">AFP Accounting &amp; TMS Management</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Certified QuickBooks team providing structured financial oversight and accurate IFTA filing. We track profitability per load and ensure tax compliance.
                </p>
                <div className="space-y-1 text-xs text-slate-200 font-medium pt-2">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#ff7700]" /> Profitability Tracking per Load</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#ff7700]" /> IFTA Filing &amp; TMS (Alvys / AscendTMS)</div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/afp-accounting-tms');
                }}
                className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#ff7700] group-hover:text-[#ff9933]"
              >
                <span>Learn More About AFP Accounting</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Card 7: Dedicated Lane Services */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate('/dedicated-lane-services')}
              className="relative p-7 bg-[#0b101b]/85 border border-white/10 hover:border-[#ff7700]/60 transition-all flex flex-col justify-between group shadow-lg cursor-pointer md:col-span-2 lg:col-span-1 overflow-hidden rounded-2xl backdrop-blur-md"
            >
              {/* Background wrapper with absolute inset-0 z-0, smooth opacity transition, and mix-blend-multiply dark overlay mask */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-2xl transition-opacity duration-400 ease-in-out">
                <picture>
                  <source srcSet="/images/services/dedicated-lanes-400.avif 400w, /images/services/dedicated-lanes-800.avif 800w" type="image/avif" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px" />
                  <source srcSet="/images/services/dedicated-lanes-400.webp 400w, /images/services/dedicated-lanes-800.webp 800w" type="image/webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px" />
                  <img 
                    src="/images/services/dedicated-lanes.jpg" 
                    alt="Dedicated Lane POD Lifecycle Background"
                    aria-hidden="true"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover object-center opacity-25 group-hover:opacity-35 group-hover:scale-105 transition-all duration-500 ease-out"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-b from-[#080d17]/55 via-[#05080f]/65 to-[#020408]/80 mix-blend-multiply transition-colors duration-500" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,119,0,0.12),transparent_70%)] pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#020408]/90 via-[#03060c]/50 to-transparent pointer-events-none" />
              </div>

              <div className="relative z-10 space-y-4">
                <AnimatedIcon animation="rotate" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#ff7700] group-hover:border-[#ff7700]/50 transition-all">
                  <MapPin className="w-6 h-6" />
                </AnimatedIcon>
                <h3 className="text-xl font-bold text-white group-hover:text-[#ff7700] transition-colors">Dedicated Lane Services</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Comprehensive dispatch management through Proof of Delivery (All 12 Steps) with complete shift oversight. We manage the entire lifecycle of every load.
                </p>
                <div className="space-y-1 text-xs text-slate-200 font-medium pt-2">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#ff7700]" /> Complete 12-Step POD Management</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#ff7700]" /> Real-time HOS Monitoring &amp; BOL Verification</div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/dedicated-lane-services');
                }}
                className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#ff7700] group-hover:text-[#ff9933]"
              >
                <span>Learn More About Dedicated Lanes</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

          </div>

        </div>
      </MotionSection>

      {/* STATS & SOCIAL PROOF STRIP */}
      <StatsCounter />

      <SectionDivider />

      {/* ENTERPRISE TRUST & ECOSYSTEM MARQUEE */}
      <TrustMarquee />

      <SectionDivider />

      {/* PREMIUM TIMELINE PROCESS SECTION */}
      <TimelineSection navigate={navigate} />

      <SectionDivider />

      {/* SERVICE COMPARISON & BEFORE/AFTER METRICS */}
      <ServiceComparison />

      <SectionDivider />

      {/* INSIDE WAL GROUP CULTURE GALLERY */}
      <InsideWalGroups />

      <SectionDivider />

      {/* GLOBAL PRESENCE WORLD MAP & REMOTE OPERATIONS */}
      <GlobalPresence />

      <SectionDivider />

      {/* GIG PROJECTS PREVIEW SECTION */}
      <MotionSection className="py-20 px-4 sm:px-6 lg:px-8 bg-[#000000] text-white">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-[#ff7700]/10 text-[#ff7700] border border-[#ff7700]/30 text-xs font-bold uppercase tracking-wider mb-2">
              Fixed Scope &amp; Fixed Timeline
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Gig Projects for DSPs
            </h2>
            <p className="text-base text-slate-400 font-normal">
              One-Time Strategic Scope Engagements — Immediate Impact, Fixed Timeline
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="glass-panel p-7 hover:border-[#ff7700]/50 transition-all flex flex-col justify-between space-y-6 shadow-lg cursor-pointer"
            >
              <div className="space-y-4">
                <AnimatedIcon animation="pulse" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#ff7700]">
                  <Database className="w-6 h-6" />
                </AnimatedIcon>
                <span className="text-[11px] font-bold text-[#ff7700] uppercase tracking-wider block">4-Week Structured Rollout</span>
                <h3 className="text-xl font-bold text-white">Fountain to SmartRecruiters Migration</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Seamlessly migrate your entire recruitment ecosystem from Fountain to SmartRecruiters with zero data loss and minimal disruption.
                </p>
                <div className="p-3 bg-white/5 rounded-lg text-xs text-emerald-400 font-semibold border border-emerald-500/20">
                  Key Benefit: Potential $50K+ annual savings through platform optimization.
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/gig-projects')}
                className="w-full bg-[#ff7700] hover:bg-[#ff8811] text-black font-extrabold text-xs py-3 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Learn More About Migration</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </motion.button>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="glass-panel p-7 hover:border-[#ff7700]/50 transition-all flex flex-col justify-between space-y-6 shadow-lg cursor-pointer"
            >
              <div className="space-y-4">
                <AnimatedIcon animation="rotate" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#ff7700]">
                  <ShieldCheck className="w-6 h-6" />
                </AnimatedIcon>
                <span className="text-[11px] font-bold text-[#ff7700] uppercase tracking-wider block">2-Week Comprehensive Audit</span>
                <h3 className="text-xl font-bold text-white">Amazon DSP Audit Readiness Check</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  AI-powered continuous compliance monitoring that scans licenses, insurance documents, contracts, and driver files for gaps or expirations.
                </p>
                <div className="p-3 bg-white/5 rounded-lg text-xs text-emerald-400 font-semibold border border-emerald-500/20">
                  Key Benefit: Prevent compliance violations before Amazon audits occur.
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/gig-projects')}
                className="w-full bg-[#ff7700] hover:bg-[#ff8811] text-black font-extrabold text-xs py-3 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Learn More About Audit Check</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </motion.button>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="glass-panel p-7 hover:border-[#ff7700]/50 transition-all flex flex-col justify-between space-y-6 shadow-lg cursor-pointer"
            >
              <div className="space-y-4">
                <AnimatedIcon animation="bounce" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#ff7700]">
                  <Bot className="w-6 h-6" />
                </AnimatedIcon>
                <span className="text-[11px] font-bold text-[#ff7700] uppercase tracking-wider block">3-Week Deployment</span>
                <h3 className="text-xl font-bold text-white">AI Voicebot for Timecard Reconciliation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Never chase a timecard again. Our AI voicebot automatically detects missing punches, calls drivers, guides them through correction, and confirms completion.
                </p>
                <div className="p-3 bg-white/5 rounded-lg text-xs text-[#ff7700] font-mono font-bold border border-[#ff7700]/30 text-center">
                  Detect &rarr; Call &rarr; Guide &rarr; Confirm
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/gig-projects')}
                className="w-full bg-[#ff7700] hover:bg-[#ff8811] text-black font-extrabold text-xs py-3 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Learn More About Voicebot</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </motion.button>
            </motion.div>

          </div>

        </div>
      </MotionSection>

      {/* WHY PARTNER WITH US - VALUE PROPOSITION */}
      <MotionSection className="py-20 px-4 sm:px-6 lg:px-8 bg-[#000000] border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs font-bold uppercase tracking-wider text-[#ff7700]">Your Operational Backbone</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Why Partner <span className="gold-text italic font-serif">With Us</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Partnering with us means gaining a dedicated operational backbone for your Amazon DSP or trucking business. We combine deep ecosystem expertise with structured processes and AI-driven automation to streamline dispatch, hiring, payroll, and compliance under one coordinated model. Unlike traditional outsourcing providers who simply take over tasks, we become an extension of your leadership team, focused on your growth and profitability.
              </p>

              <div className="space-y-4 pt-2">
                
                {/* Differentiator 1 */}
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="p-4 rounded-xl glass-panel border-subtle flex items-start gap-4 hover:border-[#ff7700]/40 transition-all"
                >
                  <div className="p-2.5 rounded-lg bg-white/5 text-[#ff7700] border border-white/10 shrink-0 mt-1">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">End-to-End Ownership, Not Just Support</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      We don't just complete tasks — we own outcomes. From driver recruitment through dispatch to payroll and compliance, we maintain complete visibility and accountability for every process.
                    </p>
                  </div>
                </motion.div>

                {/* Differentiator 2 */}
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="p-4 rounded-xl glass-panel border-subtle flex items-start gap-4 hover:border-[#ff7700]/40 transition-all"
                >
                  <div className="p-2.5 rounded-lg bg-white/5 text-[#ff7700] border border-white/10 shrink-0 mt-1">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">AI-Driven Efficiency with Human Oversight</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      We strategically deploy AI automation for repetitive tasks like candidate screening and timecard reconciliation, while our experienced team focuses on relationship management and judgment.
                    </p>
                  </div>
                </motion.div>

                {/* Differentiator 3 */}
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="p-4 rounded-xl glass-panel border-subtle flex items-start gap-4 hover:border-[#ff7700]/40 transition-all"
                >
                  <div className="p-2.5 rounded-lg bg-white/5 text-[#ff7700] border border-white/10 shrink-0 mt-1">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Measurable Cost &amp; Compliance Impact</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      Every solution we implement is measured against clear KPIs: cost per hire reduction, dispatch error rates, compliance violations prevented, and payroll accuracy.
                    </p>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Right Visual Image with gentle hover zoom & animated entrance */}
            <div className="lg:col-span-6">
              <AnimatedImage
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                alt="Wal Group Operations Team Collaborating"
                containerClassName="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                className="w-full h-full object-cover opacity-85"
                entranceAnimation="scaleUp"
                hoverEffect="zoom"
                overlay={
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-white space-y-1 z-10 pointer-events-none">
                      <div className="text-xs font-bold text-[#ff7700] uppercase tracking-wider">Operational Excellence</div>
                      <div className="text-lg font-bold">24×7 Operations Command Center</div>
                      <div className="text-xs text-slate-300">Dedicated specialists working alongside your leadership team.</div>
                    </div>
                  </>
                }
              />
            </div>

          </div>

        </div>
      </MotionSection>

      {/* FINAL CALL TO ACTION BANNER */}
      <MotionSection className="py-16 px-4 sm:px-6 lg:px-8 bg-[#000000] border-t border-white/10 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Streamline Your <span className="gold-text italic font-serif">Backend Operations?</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Book a 30-minute consultation with our operations team and explore how Wal Group can cut your operational costs while driving 100% compliance.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/contact')}
              className="bg-[#ff7700] hover:bg-[#ff8811] text-black font-extrabold text-sm px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(255,119,0,0.3)] hover:shadow-[0_0_30px_rgba(255,119,0,0.5)] transition-all cursor-pointer"
            >
              Schedule Consultation
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/raise-ticket')}
              className="bg-white/5 hover:bg-white/10 text-[#ff7700] font-bold text-sm px-8 py-4 rounded-xl border border-[#ff7700]/30 hover:border-[#ff7700]/60 transition-all cursor-pointer"
            >
              Raise a Support Ticket
            </motion.button>
          </div>
        </div>
      </MotionSection>

    </div>
  );
};

