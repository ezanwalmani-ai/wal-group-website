import React from 'react';
import { IndustriesSlider } from '../components/IndustriesSlider';
import { Globe, Search, Share2, Mail, Database, Target, Layers, ArrowRight } from 'lucide-react';
import { AnimatedImage } from '../components/AnimatedImage';

interface Props {
  navigate: (path: string) => void;
}

export const DigitalMarketingPage: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="font-sans text-slate-800 bg-white">
      {/* Hero */}
      <section className="bg-[#0A2647] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              Digital Marketing Operations
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Content-Driven Digital Marketing</h1>
            <p className="text-lg text-slate-300">
              Cut Through the Digital Noise with Outcome-Based Growth Strategies. Full-stack marketing across SEO, social media, CRM, and email campaigns.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate('/contact')}
                className="bg-[#2271B1] hover:bg-[#1B5A8C] text-white font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg"
              >
                Schedule Marketing Consultation
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <AnimatedImage 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f" 
              alt="Digital Marketing Analytics Dashboard" 
              containerClassName="rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
              className="w-full h-auto object-cover"
              width={800}
              height={550}
              entranceAnimation="scaleUp"
              hoverEffect="zoom"
              floating={true}
              priority={true}
            />
          </div>
        </div>
      </section>

      {/* Core Value Props */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <Layers className="w-10 h-10 text-[#2271B1]" />
              <h3 className="text-xl font-bold text-[#0A2647]">One-Stop Shop Solution</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Wal Group offers end-to-end digital marketing, from websites and SEO to social media, CRM, email marketing, and AI automation — all coordinated under one roof. No more managing multiple vendors or disconnected strategies.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <Target className="w-10 h-10 text-[#2271B1]" />
              <h3 className="text-xl font-bold text-[#0A2647]">Outcome-Based Model</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our data-driven approach delivers measurable results that directly impact your bottom line. We don't just report vanity metrics — we track qualified leads, conversions, and revenue generated from every campaign.
              </p>
            </div>
          </div>

          {/* Full Digital Spectrum Cards */}
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-[#0A2647] text-center">Full Digital Spectrum Coverage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <Globe className="w-7 h-7 text-[#2271B1]" />
                <h4 className="font-bold text-[#0A2647]">1. Website Design &amp; Dev</h4>
                <p className="text-xs text-slate-600">Mobile responsive, fast loading, SEO-optimized, and conversion-focused web layouts.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <Search className="w-7 h-7 text-[#2271B1]" />
                <h4 className="font-bold text-[#0A2647]">2. Search Engine Optimization (SEO)</h4>
                <p className="text-xs text-slate-600">Keyword research, technical on-page SEO, high-authority backlinking, and local search visibility.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <Share2 className="w-7 h-7 text-[#2271B1]" />
                <h4 className="font-bold text-[#0A2647]">3. Social Media &amp; Paid Ads</h4>
                <p className="text-xs text-slate-600">Community management and target campaign management across LinkedIn, Instagram, Meta, and Google.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <Mail className="w-7 h-7 text-[#2271B1]" />
                <h4 className="font-bold text-[#0A2647]">4. Email Marketing Campaigns</h4>
                <p className="text-xs text-slate-600">Segmented automated email drips, newsletter design, A/B testing, and deliverability optimization.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <Database className="w-7 h-7 text-[#2271B1]" />
                <h4 className="font-bold text-[#0A2647]">5. Comprehensive CRM Solutions</h4>
                <p className="text-xs text-slate-600">System setup, workflow automation, lead pipeline tracking, and reporting dashboards.</p>
              </div>

            </div>
          </div>

          {/* INDUSTRIES SLIDER SECTION */}
          <div className="space-y-6 pt-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2647]">Industries We Serve</h2>
              <p className="text-xs sm:text-sm text-slate-600">Explore how our marketing operations adapt across diverse industry verticals.</p>
            </div>

            <IndustriesSlider />
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#0A2647] text-white text-center">
        <button
          onClick={() => navigate('/contact')}
          className="bg-[#2271B1] hover:bg-[#1B5A8C] text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg"
        >
          Schedule Marketing Consultation
        </button>
      </section>
    </div>
  );
};
