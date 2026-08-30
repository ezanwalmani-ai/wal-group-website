import React from 'react';
import { Calculator, CheckCircle2, DollarSign, FileText, Calendar, ShieldCheck } from 'lucide-react';
import { AnimatedImage } from '../components/AnimatedImage';

interface Props {
  navigate: (path: string) => void;
}

export const DspAccountingPage: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="font-sans text-slate-800 bg-white">
      {/* Hero */}
      <section className="bg-[#0A2647] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              Amazon DSP Operations
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">DSP Accounting &amp; Payroll Services</h1>
            <p className="text-lg text-slate-300">
              Certified QBO and ADP/Paycom Experts Ensuring Financial Accuracy and Driver Satisfaction. Timely, audit-ready bookkeeping and weekly payroll execution.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate('/contact')}
                className="bg-[#2271B1] hover:bg-[#1B5A8C] text-white font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg"
              >
                Talk to Our Accounting Team
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <AnimatedImage 
              src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c" 
              alt="QuickBooks Accounting and Financial Analysis" 
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

      {/* Core Services */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Calculator className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Bookkeeping &amp; Closures</h3>
              <p className="text-xs text-slate-600">Daily transaction categorization, bank reconciliations, monthly P&amp;L and balance sheet preparation.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <FileText className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Timecard &amp; Punch Audits</h3>
              <p className="text-xs text-slate-600">Cross-referencing delivery logs to fix missing punches, overtime errors, and schedule discrepancies.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <DollarSign className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Amazon Invoice Audits</h3>
              <p className="text-xs text-slate-600">Weekly validation of route counts against Amazon invoices to identify short payments and submit disputes.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Calendar className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Weekly Payroll Processing</h3>
              <p className="text-xs text-slate-600">ADP/Paycom workflow execution ensuring drivers receive 100% accurate pay, every single week.</p>
            </div>
          </div>

          {/* Weekly Workflow */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 space-y-4">
            <h3 className="text-xl font-bold text-[#0A2647]">Weekly Payroll Calendar Workflow</h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200"><strong>Mon:</strong> Collect Time Logs</div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200"><strong>Tue:</strong> Validate Routes &amp; Exception Fixes</div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200"><strong>Wed:</strong> Preliminary Calculations</div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200"><strong>Thu:</strong> Management Approval</div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200"><strong>Fri:</strong> Direct Deposit Execution</div>
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
          Talk to Our Accounting Team
        </button>
      </section>
    </div>
  );
};
