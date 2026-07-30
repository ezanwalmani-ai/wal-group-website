import React from 'react';
import { BarChart3, Calculator, FileText, DollarSign, CheckCircle2 } from 'lucide-react';
import { AnimatedImage } from '../components/AnimatedImage';

interface Props {
  navigate: (path: string) => void;
}

export const AfpAccountingPage: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="font-sans text-slate-800 bg-white">
      {/* Hero */}
      <section className="bg-[#0A2647] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              Amazon Freight Operations
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">AFP Accounting &amp; TMS Management</h1>
            <p className="text-lg text-slate-300">
              Financial Clarity and Operational Control for Freight Partners. Per-load profit visibility, IFTA tax compliance, and TMS management (Alvys &amp; AscendTMS).
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate('/contact')}
                className="bg-[#2271B1] hover:bg-[#1B5A8C] text-white font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg"
              >
                Request Financial Analysis
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <AnimatedImage 
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80" 
              alt="Trucking TMS and Financial Profitability Dashboards" 
              containerClassName="rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
              className="w-full h-auto object-cover"
              entranceAnimation="scaleUp"
              hoverEffect="zoom"
              floating={true}
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <BarChart3 className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Load Profitability</h3>
              <p className="text-xs text-slate-600">Per-load P&amp;L analysis connecting driver pay, fuel, maintenance, and accessorial fees to specific lanes.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <FileText className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Accurate IFTA Filing</h3>
              <p className="text-xs text-slate-600">State mileage categorization, fuel purchase tracking, quarterly IFTA preparation, and electronic submission.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Calculator className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">TMS Platform Setup</h3>
              <p className="text-xs text-slate-600">Complete TMS management across Alvys, AscendTMS, TruckLogics, and McLeod with accounting synchronization.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <DollarSign className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Factoring Coordination</h3>
              <p className="text-xs text-slate-600">Document auditing prior to factor submission, tracking advance payments, and monthly factor statement reconciliation.</p>
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
          Request Financial Analysis
        </button>
      </section>
    </div>
  );
};
