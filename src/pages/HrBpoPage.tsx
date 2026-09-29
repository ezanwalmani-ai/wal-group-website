import React from 'react';
import { Users, ShieldCheck, Calculator, FileText, CheckCircle2 } from 'lucide-react';
import { AnimatedImage } from '../components/AnimatedImage';
import { TextRoll } from '@/components/core/text-roll';

interface Props {
  navigate: (path: string) => void;
}

export const HrBpoPage: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="font-sans text-slate-800 bg-white">
      {/* Hero */}
      <section className="bg-[#0A2647] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              BPO Services
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              <TextRoll className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                HR BPO Services
              </TextRoll>
            </h1>
            <p className="text-lg text-slate-300">
              Scale Operations Without Scaling Headcount. Comprehensive HR BPO handling payroll, benefits, employee records, compliance reporting, and HRIS maintenance.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate('/contact')}
                className="bg-[#2271B1] hover:bg-[#1B5A8C] text-white font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg"
              >
                Explore BPO Solutions
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <AnimatedImage 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c" 
              alt="HR BPO Corporate Team Workspace" 
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

      {/* Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Calculator className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Payroll Processing</h3>
              <p className="text-xs text-slate-600">Complete payroll tax calculations, deductions, direct deposit, and wage garnish management.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Users className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Benefits Administration</h3>
              <p className="text-xs text-slate-600">Carrier enrollment, open enrollment support, medical/dental insurance tracking, and worker inquiries.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <ShieldCheck className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Compliance &amp; Reporting</h3>
              <p className="text-xs text-slate-600">EEO-1, ACA, OSHA compliance monitoring, and labor regulation updates across multiple states.</p>
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
          Explore BPO Solutions
        </button>
      </section>
    </div>
  );
};
