import React from 'react';
import { 
  MapPin, 
  Clock, 
  Users, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Globe, 
  ShieldCheck 
} from 'lucide-react';
import { getOptimizedUnsplashUrl, getUnsplashSrcSet } from '../lib/imageOptimizer';

interface OfficeLocation {
  id: string;
  name: string;
  region: string;
  city: string;
  coords: { x: number; y: number }; // Percentage positions on map SVG
  address: string;
  phone: string;
  email: string;
  hours: string;
  teamSize: string;
  services: string[];
  photo: string;
  description: string;
}

export const InteractiveOfficeLocations: React.FC = () => {
  const office: OfficeLocation = {
    id: 'bengaluru-hq',
    name: 'Corporate Headquarters',
    region: 'Bengaluru, Karnataka, India',
    city: 'Indiranagar, Bengaluru',
    coords: { x: 68, y: 52 },
    address: '55, 100 Feet Road, HAL 2nd Stage, Indiranagar 12th Main, Bengaluru, Karnataka 560038',
    phone: '+91 6363698148',
    email: 'thewalgroupinfo@gmail.com',
    hours: 'Mon - Sat: 9:00 AM - 7:00 PM IST (24/7 Emergency Dispatch Support)',
    teamSize: 'Executive & Global Operations Leadership',
    services: ['Amazon DSP & AFP Strategy', 'Global Payroll & Compliance', '24/7 Dispatch Management'],
    photo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    description: 'Operating from Bengaluru with remote teams serving clients worldwide, delivering professional outsourcing and logistics solutions across global markets.'
  };

  return (
    <div className="py-16 bg-[#08080c] border-y border-white/10 relative overflow-hidden">
      {/* Background Soft Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,102,0,0.1),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#ff6600]/40 text-xs font-bold text-[#ff6600]">
            <Globe className="w-3.5 h-3.5 text-[#ff6600]" />
            <span>CORPORATE HEADQUARTERS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Our <span className="gold-text italic font-serif">Headquarters</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400">
            55, 100 Feet Road, HAL 2nd Stage, Indiranagar 12th Main, Bengaluru, Karnataka 560038, India
          </p>
        </div>

        {/* Top Interactive Map Visualizer */}
        <div className="relative w-full h-80 sm:h-96 rounded-3xl bg-black/80 border border-white/10 overflow-hidden shadow-2xl p-4 flex flex-col justify-between">
          
          {/* World Map SVG Background Overlay */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Map Location Pin for HQ */}
          <div className="absolute inset-0 z-20">
            <div
              style={{ left: `${office.coords.x}%`, top: `${office.coords.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
            >
              {/* Glowing Pulse Rings */}
              <div className="absolute -inset-4 rounded-full bg-[#ff6600]/40 animate-ping" />
              <div className="absolute -inset-8 rounded-full bg-[#ff6600]/15 animate-pulse" />

              {/* Pin Circle */}
              <div className="relative w-9 h-9 rounded-full border-2 bg-[#ff6600] border-white text-black shadow-[0_0_25px_#ff6600] flex items-center justify-center scale-110">
                <MapPin className="w-5 h-5 stroke-[2.5]" />
              </div>

              {/* Floating Pin Label Tooltip */}
              <div className="absolute top-11 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-xs font-extrabold whitespace-nowrap bg-[#ff6600] text-black shadow-[0_4px_16px_rgba(255,102,0,0.6)]">
                📍 HQ: Bengaluru, India
              </div>
            </div>
          </div>

          {/* Map Bottom Status Bar */}
          <div className="relative z-30 flex justify-between items-end">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Bangalore Corporate HQ Active • 24/7 Global Remote Operations</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span>55, 100 Feet Road, Indiranagar, Bengaluru</span>
            </div>
          </div>
        </div>

        {/* Office Details Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Office Photo with Overlay Glass (5 cols) */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group min-h-[320px] bg-[#0a0a10]">
            <picture className="w-full h-full block">
              <source
                type="image/avif"
                srcSet={getUnsplashSrcSet(office.photo, [480, 800, 1200], 75, 'avif')}
                sizes="(max-width: 1024px) 100vw, 500px"
              />
              <source
                type="image/webp"
                srcSet={getUnsplashSrcSet(office.photo, [480, 800, 1200], 75, 'webp')}
                sizes="(max-width: 1024px) 100vw, 500px"
              />
              <img
                src={getOptimizedUnsplashUrl(office.photo, 800, 75)}
                srcSet={getUnsplashSrcSet(office.photo, [480, 800, 1200])}
                sizes="(max-width: 1024px) 100vw, 500px"
                width={800}
                height={600}
                alt={office.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0"
              />
            </picture>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

            {/* Photo Bottom Tag */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 space-y-1">
              <div className="text-xs font-bold text-[#ff6600] uppercase tracking-wider">{office.region}</div>
              <div className="text-xl font-black text-white">{office.name}</div>
              <div className="text-xs text-slate-300 flex items-center gap-1.5 pt-1">
                <Users className="w-3.5 h-3.5 text-[#ff6600]" />
                <span>{office.teamSize}</span>
              </div>
            </div>
          </div>

          {/* Office Info & Services Grid (7 cols) */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 flex flex-col justify-between">
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#ff6600]/10 border border-[#ff6600]/30 text-xs font-bold text-[#ff6600]">
                    {office.city}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Active Operations
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                  {office.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {office.description}
                </p>
              </div>

              {/* Info List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-white/10">
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#ff6600]" /> Address
                  </span>
                  <div className="text-slate-200 font-medium pl-5">{office.address}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#ff6600]" /> Operational Hours
                  </span>
                  <div className="text-slate-200 font-medium pl-5">{office.hours}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#ff6600]" /> Direct Phone
                  </span>
                  <div className="text-slate-200 font-medium pl-5">
                    <a href={`tel:${office.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-[#ff6600] font-bold">
                      {office.phone}
                    </a>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#ff6600]" /> Email Address
                  </span>
                  <div className="text-slate-200 font-medium pl-5">
                    <a href={`mailto:${office.email}`} className="hover:text-[#ff6600]">
                      {office.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Key Core Services at Location */}
              <div className="pt-3 border-t border-white/10">
                <div className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#ff6600]" /> Primary Operational Capabilities
                </div>
                <div className="flex flex-wrap gap-2">
                  {office.services.map((srv, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
