import React from 'react';
import { Bot, Headphones, FileText, CheckCircle2, Globe, Clock } from 'lucide-react';
import { AnimatedImage } from '../components/AnimatedImage';

interface Props {
  navigate: (path: string) => void;
}

export const VirtualAssistantsPage: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="font-sans text-slate-800 bg-white">
      {/* Hero */}
      <section className="bg-[#0A2647] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              BPO Services
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Virtual Assistants</h1>
            <p className="text-lg text-slate-300">
              Professional Dedicated Remote Virtual Assistants. Administrative support, customer service ticketing, data entry, social media management, and research back-office.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate('/contact')}
                className="bg-[#2271B1] hover:bg-[#1B5A8C] text-white font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg"
              >
                Speak with BPO Specialist
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <AnimatedImage 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2" 
              alt="Virtual Assistant Professional Remote Setup" 
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
              <FileText className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Admin &amp; Executive Support</h3>
              <p className="text-xs text-slate-600">Email triage, calendar scheduling, travel booking, document formatting, and meeting minutes.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Headphones className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Customer Service &amp; Live Chat</h3>
              <p className="text-xs text-slate-600">Handling customer inquiries via live chat, support tickets, email responses, and phone calls.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Bot className="w-8 h-8 text-[#2271B1]" />
              <h3 className="text-lg font-bold text-[#0A2647]">Data Cleaning &amp; Entry</h3>
              <p className="text-xs text-slate-600">Database updates, spreadsheet maintenance, CRM data enrichment, and lead research.</p>
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
          Speak with BPO Specialist
        </button>
      </section>
    </div>
  );
};
