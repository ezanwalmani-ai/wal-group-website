import React from 'react';
import { Database, ShieldCheck, Bot, CheckCircle2, ArrowRight, Clock, FileText, Calendar } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

interface Props {
  navigate: (path: string) => void;
}

export const GigProjectsPage: React.FC<Props> = ({ navigate }) => {
  const { openBookDemo } = useBooking();
  return (
    <div className="font-sans text-slate-800 bg-white">
      {/* Hero */}
      <section className="bg-[#0A2647] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            One-Time Fixed Scope Engagements
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Gig Projects for DSPs &amp; Trucking Companies
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal">
            Targeted expertise for specific operational challenges. Fixed timeline, fixed price, immediate impact without long-term commitment.
          </p>
        </div>
      </section>

      {/* Main Breakdown */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 space-y-16">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* Gig 1 */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-md space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-extrabold text-[#2271B1] uppercase tracking-wider">Gig Project 01</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2647]">Fountain to SmartRecruiters Migration</h2>
              </div>
              <span className="px-3.5 py-1.5 bg-blue-50 text-[#2271B1] border border-blue-200 rounded-full text-xs font-bold">
                4-Week Structured Rollout
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Complete migration of your entire recruitment ecosystem from Fountain to SmartRecruiters, executed in 4 weeks with zero candidate data loss and minimal disruption to hiring.
            </p>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-[#0A2647] uppercase tracking-wider">Week-by-Week Rollout Plan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="font-extrabold text-[#0A2647]">Week 1</div>
                  <div className="text-slate-600 mt-1">Data Audit &amp; System Field Mapping</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="font-extrabold text-[#0A2647]">Week 2</div>
                  <div className="text-slate-600 mt-1">SmartRecruiters Environment Setup</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="font-extrabold text-[#0A2647]">Week 3</div>
                  <div className="text-slate-600 mt-1">Phased Migration &amp; Team Training</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="font-extrabold text-[#0A2647]">Week 4</div>
                  <div className="text-slate-600 mt-1">Go-Live &amp; Parallel Validation</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4 pt-2">
              <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                Key Benefit: $50K+ Annual Platform Cost Reduction
              </div>
              <button
                onClick={() => navigate('/contact')}
                className="bg-[#2271B1] hover:bg-[#1B5A8C] text-white text-xs font-bold py-2.5 px-5 rounded-lg shadow transition-all"
              >
                Get Migration Quote
              </button>
            </div>
          </div>

          {/* Gig 2 */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-md space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-extrabold text-[#2271B1] uppercase tracking-wider">Gig Project 02</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2647]">Amazon DSP Audit Readiness Check</h2>
              </div>
              <span className="px-3.5 py-1.5 bg-blue-50 text-[#2271B1] border border-blue-200 rounded-full text-xs font-bold">
                2-Week Comprehensive Audit
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              AI-powered continuous compliance monitoring that scans driver licenses, medical certificates, drug testing records, insurance certificates, and contracts for gaps or expirations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-[#0A2647]">Driver Compliance</div>
                <div className="text-slate-600">Valid DL expirations, medical cards, drug testing, MVR status.</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-[#0A2647]">Vehicle &amp; Fleet Compliance</div>
                <div className="text-slate-600">Insurance certificates per van, registration renewals, maintenance logs.</div>
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4 pt-2">
              <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                Key Benefit: Walk into any Amazon audit 100% confident
              </div>
              <button
                onClick={() => navigate('/contact')}
                className="bg-[#2271B1] hover:bg-[#1B5A8C] text-white text-xs font-bold py-2.5 px-5 rounded-lg shadow transition-all"
              >
                Schedule Compliance Audit
              </button>
            </div>
          </div>

          {/* Gig 3 */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-md space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-extrabold text-[#2271B1] uppercase tracking-wider">Gig Project 03</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2647]">AI Voicebot for Timecard Reconciliation</h2>
              </div>
              <span className="px-3.5 py-1.5 bg-blue-50 text-[#2271B1] border border-blue-200 rounded-full text-xs font-bold">
                3-Week Deployment
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Automated AI voicebot that detects timecard missing punches, calls drivers in Spanish/English, guides them through corrections, and updates payroll systems.
            </p>

            <div className="p-6 bg-[#0A2647] text-white rounded-xl space-y-3 text-center">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest">4-Step Automated Flow</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-800 p-2.5 rounded-lg">1. DETECT Exception</div>
                <div className="bg-slate-800 p-2.5 rounded-lg">2. CALL Driver</div>
                <div className="bg-slate-800 p-2.5 rounded-lg">3. GUIDE Fix</div>
                <div className="bg-slate-800 p-2.5 rounded-lg">4. CONFIRM System</div>
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4 pt-2">
              <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                Key Benefit: 100% timecard compliance before payroll deadlines
              </div>
              <button
                onClick={openBookDemo}
                className="bg-[#2271B1] hover:bg-[#1B5A8C] text-white text-xs font-bold py-2.5 px-5 rounded-lg shadow transition-all cursor-pointer"
              >
                Request Voicebot Demo
              </button>
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
          Discuss Your Custom Scope
        </button>
      </section>
    </div>
  );
};
