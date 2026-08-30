import React from 'react';
import { Headphones, CheckCircle2, ShieldCheck, Clock, AlertTriangle, ArrowRight, Video, FileText, Activity } from 'lucide-react';
import { AnimatedImage } from '../components/AnimatedImage';

interface Props {
  navigate: (path: string) => void;
}

export const DspDispatchPage: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="font-sans text-slate-800 bg-white">
      {/* Hero */}
      <section className="bg-[#0A2647] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              Amazon DSP Operations
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">DSP Dispatch Support Services</h1>
            <p className="text-lg text-slate-300">
              24×7×365 Dispatch Operations That Never Miss a Beat. Amazon Cortex power users &amp; Netradyne safety experts keeping your vans compliant, safe, and on schedule.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate('/contact')}
                className="bg-[#2271B1] hover:bg-[#1B5A8C] text-white font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg"
              >
                Schedule Dispatch Consultation
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <AnimatedImage 
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d" 
              alt="Netradyne and Cortex Command Center Screen" 
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

      {/* Overview & Key Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-2xl font-extrabold text-[#0A2647]">24×7×365 End-to-End Coverage</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our DSP Dispatch Support team provides end-to-end dispatch operations specifically designed for Amazon Delivery Service Partners. We combine deep expertise in Amazon's Cortex platform with comprehensive Netradyne knowledge to ensure your drivers stay safe, compliant, and productive. With 24×7×365 coverage across three shifts, we guarantee that every load is monitored, every violation is addressed, and every driver has the support they need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Activity className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Amazon Cortex Expertise</h3>
              <p className="text-xs text-slate-600">Managing route assignments, real-time adjustments, route pacing, and delivery metric protection.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Video className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Netradyne Driveri Mastery</h3>
              <p className="text-xs text-slate-600">Active monitoring of the Driveri dashboard for real-time alerts, coachable moments, and instant driver intervention.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <FileText className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">DVIC Checklist Management</h3>
              <p className="text-xs text-slate-600">Tracking Daily Vehicle Inspection Checklist completion before vans roll out, follow-ups on vehicle defects.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <AlertTriangle className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Violation Alert &amp; Disputes</h3>
              <p className="text-xs text-slate-600">Immediate footage review, context gathering, and submitting evidence-backed disputes directly into Amazon portals.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <ShieldCheck className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Driver Scorecard Tracking</h3>
              <p className="text-xs text-slate-600">Daily driver and fleet scorecard tracking to identify coaching needs before standings drop.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Clock className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">3-Shift Continuous Overlap</h3>
              <p className="text-xs text-slate-600">Dedicated night shift for overnight returns, morning loadouts, and full weekend/holiday staffing.</p>
            </div>
          </div>

          {/* Dispute Workflow */}
          <div className="bg-[#0A2647] text-white p-8 rounded-2xl space-y-6">
            <h3 className="text-xl font-bold text-amber-400">Violation Dispute Management Workflow</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center text-xs">
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">1. Detection</div>
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">2. Review (15 min)</div>
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">3. Evidence Gathering</div>
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">4. Dispute Filing</div>
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">5. Status Tracking</div>
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">6. Outcome Coaching</div>
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
          Schedule Dispatch Consultation
        </button>
      </section>
    </div>
  );
};
