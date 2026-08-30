import React from 'react';
import { Monitor, CheckCircle2, ArrowRight, Layout, Code, Search, ShieldCheck } from 'lucide-react';
import { AnimatedImage } from '../components/AnimatedImage';

interface Props {
  navigate: (path: string) => void;
}

export const WebsiteDesignPage: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="font-sans text-slate-800 bg-white">
      {/* Hero */}
      <section className="bg-[#0A2647] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              Digital Infrastructure
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Website Design &amp; Development</h1>
            <p className="text-lg text-slate-300">
              We build modern, responsive websites that help your logistics brand or corporate enterprise stand out online. From high-converting business portals to custom web applications.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate('/contact')}
                className="bg-[#2271B1] hover:bg-[#1B5A8C] text-white font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg"
              >
                Start Your Website Project
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <AnimatedImage 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f" 
              alt="Website Mockups across Laptop and Mobile" 
              containerClassName="rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
              className="w-full h-auto object-cover"
              width={800}
              height={550}
              entranceAnimation="slideLeft"
              hoverEffect="tilt"
              floating={true}
              priority={true}
            />
          </div>
        </div>
      </section>

      {/* Services Breakdown */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-[#0A2647]">Technologies &amp; Expertise</h2>
            <p className="text-slate-600 text-sm sm:text-base">Built with speed, responsiveness, and conversion best practices.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Layout className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">WordPress &amp; Shopify</h3>
              <p className="text-xs text-slate-600">Custom theme development, plugin integrations, CMS training, and secure e-commerce portals.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Code className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">HTML5, CSS3 &amp; React</h3>
              <p className="text-xs text-slate-600">Fast, lightweight, mobile-first code architectures delivering optimal Core Web Vitals scores.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Search className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">SEO Optimization &amp; UI/UX</h3>
              <p className="text-xs text-slate-600">On-page technical SEO, clean schema markup, intuitive navigation, and high contrast typography.</p>
            </div>
          </div>

          {/* Development Process */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 space-y-6">
            <h3 className="text-xl font-bold text-[#0A2647]">Development Process</h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-center">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-extrabold text-[#0A2647]">01</div>
                <div className="text-xs font-bold mt-1">Discovery</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-extrabold text-[#0A2647]">02</div>
                <div className="text-xs font-bold mt-1">Design</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-extrabold text-[#0A2647]">03</div>
                <div className="text-xs font-bold mt-1">Development</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-extrabold text-[#0A2647]">04</div>
                <div className="text-xs font-bold mt-1">Testing</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-extrabold text-[#0A2647]">05</div>
                <div className="text-xs font-bold mt-1">Launch</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#0A2647] text-white text-center">
        <button
          onClick={() => navigate('/contact')}
          className="bg-[#2271B1] hover:bg-[#1B5A8C] text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg"
        >
          Start Your Website Project
        </button>
      </section>
    </div>
  );
};
