import React from 'react';
import { Target, Rocket, Star, ShieldCheck, HeartHandshake, Award } from 'lucide-react';
import { AnimatedImage } from '../components/AnimatedImage';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="font-sans text-slate-800 bg-white">
      
      {/* HERO SECTION */}
      <section className="bg-[#0A2647] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-slate-900 to-black"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              About Wal Group
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Relationships First. <br />
              <span className="text-amber-400">Business Follows.</span>
            </h1>

            <p className="text-lg text-slate-200 leading-relaxed max-w-2xl font-normal">
              At Wal Group, our priority is understanding the unique operational and growth challenges of every client. We invest significant time in learning your business model, objectives, and pain points before recommending any solution.
            </p>
          </div>

          <div className="lg:col-span-5">
            <AnimatedImage 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80" 
              alt="Wal Group Leadership Team" 
              containerClassName="rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
              className="w-full h-auto object-cover"
              entranceAnimation="scaleUp"
              hoverEffect="zoom"
              floating={true}
            />
          </div>
        </div>
      </section>

      {/* WHO WE ARE & PHILOSOPHY */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-md space-y-6">
            <h2 className="text-3xl font-extrabold text-[#0A2647]">Who We Are</h2>
            
            <p className="text-slate-600 leading-relaxed text-base">
              At Wal Group, our priority is understanding the unique operational and growth challenges of every client. We invest significant time in learning your business model, objectives, and pain points before recommending any solution. This consultative approach ensures we deliver precisely what you need, not a one-size-fits-all template.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 font-medium space-y-1">
                <div className="font-bold text-[#0A2647]">• Robust Digital Platforms</div>
                <div>Enhancing customer experience &amp; operational visibility</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 font-medium space-y-1">
                <div className="font-bold text-[#0A2647]">• Automation-Driven Workflows</div>
                <div>Eliminating manual errors and accelerating cycle times</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 font-medium space-y-1">
                <div className="font-bold text-[#0A2647]">• Strategic Digital Marketing</div>
                <div>Amplifying online visibility and qualified lead flow</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 font-medium space-y-1">
                <div className="font-bold text-[#0A2647]">• Scalable Business Systems</div>
                <div>Building resilient backend infrastructures for sustained growth</div>
              </div>
            </div>

            <div className="p-6 bg-[#0A2647] text-white rounded-xl space-y-2 mt-6">
              <h3 className="text-lg font-bold text-amber-400">Our Commitment</h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                "Our goal is to serve as a comprehensive, end-to-end partner aligned with your business vision. From strategy development through execution and continuous optimization, we focus on delivering solutions that are practical, secure, scalable, and results-oriented. At Wal Group, we are not just service providers — we are growth partners committed to driving long-term value and operational excellence."
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* THREE INTERACTIVE GLASSMORPHISM CARDS (Purpose, Mission, Employee Motto) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0A2647] text-white">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Our Core Pillars
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Hover over each card below to reveal our driving philosophy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Purpose */}
            <div className="group relative min-h-[280px] p-8 rounded-2xl bg-slate-900/60 border border-slate-700/80 hover:border-[#2271B1] hover:shadow-[0_0_25px_rgba(34,113,177,0.3)] transition-all duration-300 backdrop-blur-md flex flex-col items-center justify-center text-center overflow-hidden cursor-pointer">
              {/* Default State */}
              <div className="space-y-4 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-4 absolute">
                <div className="w-16 h-16 rounded-2xl bg-blue-950/80 text-amber-400 border border-amber-400/30 flex items-center justify-center mx-auto">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">Purpose</h3>
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-widest block">Hover to Reveal</span>
              </div>

              {/* Hover State Text */}
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 text-slate-200 text-sm leading-relaxed font-medium">
                "To deploy 5+ years of experience, knowledge and information with the latest technology to not only reduce our valued client's operational cost but also ensure they EXCEED their previous performances."
              </div>
            </div>

            {/* Card 2: Mission */}
            <div className="group relative min-h-[280px] p-8 rounded-2xl bg-slate-900/60 border border-slate-700/80 hover:border-[#2271B1] hover:shadow-[0_0_25px_rgba(34,113,177,0.3)] transition-all duration-300 backdrop-blur-md flex flex-col items-center justify-center text-center overflow-hidden cursor-pointer">
              {/* Default State */}
              <div className="space-y-4 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-4 absolute">
                <div className="w-16 h-16 rounded-2xl bg-blue-950/80 text-amber-400 border border-amber-400/30 flex items-center justify-center mx-auto">
                  <Rocket className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">Mission</h3>
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-widest block">Hover to Reveal</span>
              </div>

              {/* Hover State Text */}
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 text-slate-200 text-sm leading-relaxed font-medium">
                "To leverage industry expertise, operational knowledge, and modern technology to help our clients reduce operational complexity, optimize costs, and achieve performance beyond their previous benchmarks."
              </div>
            </div>

            {/* Card 3: Employee Motto */}
            <div className="group relative min-h-[280px] p-8 rounded-2xl bg-slate-900/60 border-2 border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all duration-300 backdrop-blur-md flex flex-col items-center justify-center text-center overflow-hidden cursor-pointer">
              {/* Default State */}
              <div className="space-y-4 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-4 absolute">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/50 flex items-center justify-center mx-auto">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-amber-300">Employee Motto</h3>
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-widest block">Hover to Reveal</span>
              </div>

              {/* Hover State Text */}
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 text-slate-200 text-sm leading-relaxed font-medium">
                "We devote ourselves to helping businesses simplify operations, reduce operational costs, and build efficient systems that allow them to grow with confidence and stability."
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl font-extrabold text-[#0A2647]">Let's Work Together</h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Discover how Wal Group can transform your logistics and backend operations today.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/contact')}
              className="bg-[#2271B1] hover:bg-[#1B5A8C] text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg transition-all"
            >
              Get in Touch with Our Team
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
