import React from 'react';
import { Users, Bot, Database, CheckCircle2, TrendingDown, ArrowRight } from 'lucide-react';
import { AnimatedImage } from '../components/AnimatedImage';

interface Props {
  navigate: (path: string) => void;
}

export const DspHrPage: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="font-sans text-slate-800 bg-white">
      {/* Hero */}
      <section className="bg-[#0A2647] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              Amazon DSP Operations
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">DSP HR &amp; Recruitment Services</h1>
            <p className="text-lg text-slate-300">
              AI-Powered Hiring That Cuts Cost Per Hire by 30-40%. Certified SmartRecruiters specialists with bilingual AI voicebots handling 24×7 driver recruitment.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate('/contact')}
                className="bg-[#2271B1] hover:bg-[#1B5A8C] text-white font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg"
              >
                Speak with HR Specialists
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <AnimatedImage 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2" 
              alt="AI Recruitment Interface and Driver Candidate Screening" 
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

      {/* Breakdown */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Bot className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Bilingual AI Voicebots</h3>
              <p className="text-xs text-slate-600">24×7 candidate outreach in Spanish and English. Voicebots screen applicants, answer questions, and schedule interviews automatically.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Database className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Fountain to SmartRecruiters</h3>
              <p className="text-xs text-slate-600">4-week structured migration from Fountain to SmartRecruiters. Zero candidate data loss with potential $50K+ annual platform savings.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Users className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Amazon Audit Compliance</h3>
              <p className="text-xs text-slate-600">Full audit trail for driver files, background checks, drug test tracking, and Amazon onboarding verification.</p>
            </div>
          </div>

          {/* Cost Savings Comparison Box */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 space-y-6">
            <h3 className="text-xl font-bold text-[#0A2647]">Quantifiable Cost Reduction Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500">Traditional Cost Per Hire</div>
                <div className="text-2xl font-bold text-slate-700">$800 - $1,200</div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-xs text-emerald-700 font-bold">Wal Group Cost Per Hire</div>
                <div className="text-2xl font-extrabold text-emerald-800">$500 - $700</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-xs text-[#0A2647] font-bold">Annual Savings (100 Hires)</div>
                <div className="text-2xl font-extrabold text-[#2271B1]">$30,000 - $50,000</div>
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
          Speak with HR Specialists
        </button>
      </section>
    </div>
  );
};
