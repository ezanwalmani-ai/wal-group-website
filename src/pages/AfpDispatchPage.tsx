import React from 'react';
import { Truck, CheckCircle2, Clock, MapPin, ShieldCheck } from 'lucide-react';
import { AnimatedImage } from '../components/AnimatedImage';

interface Props {
  navigate: (path: string) => void;
}

export const AfpDispatchPage: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="font-sans text-slate-800 bg-white">
      {/* Hero */}
      <section className="bg-[#0A2647] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              Amazon Freight Operations
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">AFP Dispatch Support Services</h1>
            <p className="text-lg text-slate-300">
              Complete Shift Management for Amazon Freight Partners. Certified Relay specialists managing load booking, route gaps, ELD hours of service, and shift completion.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate('/contact')}
                className="bg-[#2271B1] hover:bg-[#1B5A8C] text-white font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg"
              >
                Contact AFP Team
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <AnimatedImage 
              src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1000&q=80" 
              alt="Amazon Freight Relay Dashboard and Fleet Logistics" 
              containerClassName="rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
              className="w-full h-auto object-cover"
              entranceAnimation="scaleUp"
              hoverEffect="zoom"
              floating={true}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Truck className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Amazon Relay Experts</h3>
              <p className="text-xs text-slate-600">Load booking, route optimization, driver assignment, appointment management, and proactive exception handling.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Clock className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Real-Time HOS Log Audit</h3>
              <p className="text-xs text-slate-600">Continuous ELD monitoring, hours forecasting, proactive alerts before violation thresholds, and log context logging.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <MapPin className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Proactive Load Resolution</h3>
              <p className="text-xs text-slate-600">Eliminating empty deadhead miles, rebidding on dropped loads, managing swaps and load transfer gaps.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <ShieldCheck className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">BOL &amp; Document Audit</h3>
              <p className="text-xs text-slate-600">Verifying Bills of Lading, load confirmation paperwork, returned delivery receipts, and factoring readiness.</p>
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
          Contact AFP Team
        </button>
      </section>
    </div>
  );
};
