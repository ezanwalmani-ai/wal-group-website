import React from 'react';
import { MapPin, CheckCircle2, ShieldCheck, Clock, FileCheck } from 'lucide-react';
import { AnimatedImage } from '../components/AnimatedImage';

interface Props {
  navigate: (path: string) => void;
}

export const DedicatedLanePage: React.FC<Props> = ({ navigate }) => {
  const steps = [
    { num: '01', title: 'Load Assignment & Confirmation', desc: 'Immediate acceptance, detail verification, and window confirmation.' },
    { num: '02', title: 'Driver Assignment', desc: 'Matching qualified driver, checking available HOS, and equipment fit.' },
    { num: '03', title: 'Pre-Trip Planning', desc: 'Optimal routing, fuel stops, weather monitoring, and document preparation.' },
    { num: '04', title: 'Pickup Appointment Management', desc: 'Shipper confirmation, arrival tracking, delay proactive handling.' },
    { num: '05', title: 'In-Transit GPS Monitoring', desc: 'Real-time location tracking and schedule progress checks.' },
    { num: '06', title: 'ELD / HOS Compliance', desc: 'Continuous log monitoring and break/rest compliance.' },
    { num: '07', title: 'Delivery Appointment Coordination', desc: 'Receiver confirmation, ETA updates, and appointment locking.' },
    { num: '08', title: 'Proof of Delivery Collection', desc: 'Signature verification, damage checking, and delivery photo logs.' },
    { num: '09', title: 'Document Verification', desc: 'Checking paperwork completeness and driver correction follow-ups.' },
    { num: '10', title: 'Billing Documentation', desc: 'Packaging invoice with supporting BOLs and direct factor submission.' },
    { num: '11', title: 'Exception Management', desc: 'Fast resolution of chargeback or damage disputes.' },
    { num: '12', title: 'Performance Analysis', desc: 'On-time delivery scoring and weekly operational reporting.' },
  ];

  return (
    <div className="font-sans text-slate-800 bg-white">
      {/* Hero */}
      <section className="bg-[#0A2647] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              Logistics Operations
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Dedicated Lane Services</h1>
            <p className="text-lg text-slate-300">
              Complete Oversight from Pickup to Final Proof of Delivery. Executing Amazon's 12-Step POD Lifecycle with 100% Shift Visibility.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate('/contact')}
                className="bg-[#2271B1] hover:bg-[#1B5A8C] text-white font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg"
              >
                Learn More About Dedicated Lanes
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <AnimatedImage 
              src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1000&q=80" 
              alt="Trucks on Highway Route Map Visualization" 
              containerClassName="rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
              className="w-full h-auto object-cover"
              entranceAnimation="scaleUp"
              hoverEffect="zoom"
              floating={true}
            />
          </div>
        </div>
      </section>

      {/* 12-Step Timeline */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-[#0A2647]">The 12-Step POD Management Process</h2>
            <p className="text-slate-600 text-sm sm:text-base">Structured lifecycle management leaving zero steps to chance.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((st) => (
              <div key={st.num} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-[#2271B1]">{st.num}</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-base font-bold text-[#0A2647]">{st.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#0A2647] text-white text-center">
        <button
          onClick={() => navigate('/contact')}
          className="bg-[#2271B1] hover:bg-[#1B5A8C] text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg"
        >
          Schedule Process Review
        </button>
      </section>
    </div>
  );
};
