import React from 'react';
import { Trophy, TrendingUp, CheckCircle2, Quote, Star } from 'lucide-react';

interface Props {
  navigate: (path: string) => void;
}

export const SuccessStoriesPage: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="font-sans text-slate-800 bg-white">
      {/* Hero */}
      <section className="bg-[#0A2647] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            Proven Operational Track Record
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Client Success Stories</h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            Real Results for Real Logistics Businesses Across the United States.
          </p>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 space-y-12">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Case 1 */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold text-[#2271B1] uppercase tracking-wider">Midwest Regional DSP • 45 to 75 Vans</span>
              <h2 className="text-2xl font-extrabold text-[#0A2647]">Scaling 67% During Peak Season Without Adding Headcount</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                "This DSP won additional routes requiring rapid scaling from 45 to 75 vans in just 4 months. Wal Group deployed AI voicebots for driver screening, dedicated dispatch coverage, and payroll automation."
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs italic text-slate-700">
                <Quote className="w-4 h-4 text-amber-500 inline mr-1" />
                "Wal Group made our growth possible. We couldn't have scaled this fast without them, and we certainly couldn't have maintained our quality." — DSP Owner, Midwest
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#0A2647] text-white p-6 rounded-xl space-y-3 text-center">
              <div className="text-3xl font-extrabold text-amber-400">45 &rarr; 75 Vans</div>
              <div className="text-xs text-slate-300">45% Operational Cost Savings</div>
              <div className="text-xs text-slate-300">12 Pt Scorecard Improvement</div>
              <div className="text-xs font-bold text-emerald-400">0 Compliance Violations</div>
            </div>
          </div>

          {/* Case 2 */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold text-[#2271B1] uppercase tracking-wider">West Coast DSP • 60 Vans</span>
              <h2 className="text-2xl font-extrabold text-[#0A2647]">Turnaround: From Bottom 10% to Top 20% Ranking in 90 Days</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                "Struggling with low safety scores and 120% driver turnover, this DSP partnered with Wal Group for proactive Netradyne monitoring, intensive coaching, and streamlined onboarding."
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs italic text-slate-700">
                <Quote className="w-4 h-4 text-amber-500 inline mr-1" />
                "Six months ago, I was worried about losing my contract. Today, we're one of the top performers in our station." — West Coast DSP Owner
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#0A2647] text-white p-6 rounded-xl space-y-3 text-center">
              <div className="text-2xl font-extrabold text-amber-400">Bottom 10% &rarr; Top 20%</div>
              <div className="text-xs text-slate-300">70% Violation Reduction</div>
              <div className="text-xs text-slate-300">Turnover Cut 120% &rarr; 65%</div>
              <div className="text-xs font-bold text-emerald-400">$200K+ Annual Savings</div>
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
          Become Our Next Success Story
        </button>
      </section>
    </div>
  );
};
