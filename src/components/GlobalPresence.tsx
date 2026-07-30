import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Headphones, 
  Truck, 
  Users, 
  FileText, 
  BarChart3, 
  Building2, 
  CheckCircle2, 
  Zap, 
  ArrowUpRight, 
  Radio, 
  Compass, 
  Server,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import { soundFx } from '../utils/audio';

// Interface for Remote Service Regions
interface ServiceRegion {
  id: string;
  name: string;
  code: string;
  x: number; // percentage in SVG coordinate space (0-100)
  y: number; // percentage in SVG coordinate space (0-100)
  timezones: string;
  coverage: string;
  keyServices: string[];
  description: string;
  curveOffset: number; // For bezier arc curvature
}

// Interface for Global Service Badges
interface ServiceCard {
  id: string;
  title: string;
  tag: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  description: string;
}

export const GlobalPresence: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });

  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const mapY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const cardY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const ambientBgY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  // Bangalore HQ Coordinates (Normalized 0-1000 SVG viewbox: 690, 275)
  const HQ = {
    x: 690,
    y: 275,
    name: 'Bangalore, India',
    label: 'Corporate & Operational HQ',
    address: '55, 100 Feet Road, HAL 2nd Stage, Indiranagar 12th Main, Bengaluru, Karnataka 560038'
  };

  // Remote-First Supported Regions
  const serviceRegions: ServiceRegion[] = [
    {
      id: 'na',
      name: 'North America',
      code: 'NA',
      x: 230,
      y: 190,
      timezones: 'EST • CST • MST • PST',
      coverage: '24/7 Real-Time Coverage',
      keyServices: ['Amazon DSP Dispatch', 'AFP Linehaul Logistics', 'US Payroll & Audit'],
      description: 'Synchronized with US time zones for zero-latency dispatching, driver scheduling, and real-time route auditing.',
      curveOffset: -90
    },
    {
      id: 'eu',
      name: 'Europe',
      code: 'EU',
      x: 485,
      y: 155,
      timezones: 'GMT • BST • CET',
      coverage: 'Full Shift & Peak Sync',
      keyServices: ['Cross-Border Freight', 'Amazon Relay TMS', 'HR & Talent BPO'],
      description: 'Dedicated European support specialists managing cross-border logistics, driver onboarding, and TMS workflows.',
      curveOffset: -60
    },
    {
      id: 'me',
      name: 'Middle East',
      code: 'ME',
      x: 580,
      y: 220,
      timezones: 'GST • AST • AFT',
      coverage: '24/7 Operations Hub Sync',
      keyServices: ['Freight Forwarding BPO', 'Multi-Currency Accounting', 'Customer Success'],
      description: 'High-speed remote operations backing Middle Eastern freight carriers and corporate logistics teams.',
      curveOffset: -40
    },
    {
      id: 'apac',
      name: 'Asia-Pacific',
      code: 'APAC',
      x: 820,
      y: 260,
      timezones: 'SGT • HKT • JST',
      coverage: 'Day & Night Shift Sync',
      keyServices: ['Customer Escalations', 'Dedicated Virtual VAs', 'Data Analytics'],
      description: 'Enterprise BPO workflow execution, automated data reconciliation, and customer support for regional hubs.',
      curveOffset: 30
    },
    {
      id: 'aus',
      name: 'Australia',
      code: 'AUS',
      x: 850,
      y: 390,
      timezones: 'AEST • ACST • AWST',
      coverage: 'Synchronized Business Hours',
      keyServices: ['Fleet Route Management', 'Administrative BPO', 'Financial Audit'],
      description: 'Real-time transport monitoring, dispatch assistance, and administrative automation for transport networks.',
      curveOffset: 50
    }
  ];

  // Services Delivered Worldwide
  const servicesList: ServiceCard[] = [
    {
      id: 'dsp',
      title: 'Amazon DSP Operations',
      tag: '24/7 Route Audit',
      icon: Truck,
      color: 'from-amber-500 to-orange-600',
      description: 'Cortex route tracking, Cortex driver assistance, and Fantastic Plus scorecard management.'
    },
    {
      id: 'dispatch',
      title: 'Truck Dispatch',
      tag: 'Linehaul & AFP',
      icon: Zap,
      color: 'from-orange-500 to-red-600',
      description: '24/7 load assignment, Amazon Relay loadboard monitoring, and emergency road assistance.'
    },
    {
      id: 'logistics',
      title: 'Logistics Support',
      tag: 'Route Optimization',
      icon: Compass,
      color: 'from-blue-500 to-indigo-600',
      description: 'POD collection, 12-step verification, route re-sequencing, and fleet telemetry monitoring.'
    },
    {
      id: 'hr',
      title: 'HR Services',
      tag: 'AI Driver ATS',
      icon: Users,
      color: 'from-emerald-500 to-teal-600',
      description: 'Automated AI voicebot applicant screening, background checks, and driver onboarding.'
    },
    {
      id: 'support',
      title: 'Customer Support',
      tag: 'Bilingual Escalations',
      icon: Headphones,
      color: 'from-purple-500 to-violet-600',
      description: 'Multilingual customer dispatch lines, escalation resolution, and delivery exception logging.'
    },
    {
      id: 'va',
      title: 'Virtual Assistance',
      tag: 'Dedicated Remote VAs',
      icon: Radio,
      color: 'from-[#ff6600] to-amber-600',
      description: 'Dedicated executive virtual assistants for calendar, email, load booking, and vendor triage.'
    },
    {
      id: 'admin',
      title: 'Administrative Support',
      tag: 'Audit & Compliance',
      icon: FileText,
      color: 'from-cyan-500 to-blue-600',
      description: 'QuickBooks reconciliation, ADP payroll execution, timecard audits, and expense tagging.'
    },
    {
      id: 'bpo',
      title: 'Business Operations',
      tag: 'Custom BPO Workflows',
      icon: BarChart3,
      color: 'from-rose-500 to-pink-600',
      description: 'Custom operational telemetry, KPI dashboard maintenance, and backend software engineering.'
    }
  ];

  // Mouse tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  // Helper to construct curved SVG arc path between HQ and Region
  const getArcPath = (region: ServiceRegion) => {
    const sx = HQ.x;
    const sy = HQ.y;
    const ex = region.x;
    const ey = region.y;

    const mx = (sx + ex) / 2;
    const my = (sy + ey) / 2 + region.curveOffset;

    return `M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`;
  };

  return (
    <section 
      ref={containerRef}
      className="relative py-24 sm:py-32 bg-[#07070a] text-slate-100 overflow-hidden border-t border-b border-white/10"
      onMouseMove={handleMouseMove}
    >
      {/* BACKGROUND EFFECTS: Mesh gradients, ambient light orbs & particles */}
      <motion.div 
        style={{ y: ambientBgY }}
        className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40"
      >
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#ff6600]/15 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-[#c5a059]/10 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[180px]" />
        
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#ff6600]/40 text-xs font-bold text-[#ff6600] backdrop-blur-md shadow-[0_0_15px_rgba(255,102,0,0.15)]"
          >
            <Radio className="w-3.5 h-3.5 text-[#ff6600] animate-pulse" />
            <span className="tracking-widest uppercase">ONE HEADQUARTERS • GLOBAL REACH</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight"
          >
            Global <span className="gold-text italic font-serif">Presence</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed"
          >
            Headquartered in Bangalore. Delivering world-class remote operations to businesses across the globe.
          </motion.p>
        </div>

        {/* MAIN TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: INTERACTIVE WORLD MAP (7 cols) */}
          <motion.div 
            style={{ y: mapY }}
            initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
            animate={isInView ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-7 glass-panel rounded-3xl border border-white/10 bg-[#0d0d12]/90 p-4 sm:p-6 backdrop-blur-xl relative shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden group"
          >
            {/* Top Bar Indicator */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff6600] animate-ping" />
                <span className="font-bold text-white tracking-wider uppercase">Live Global Remote Operations Map</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                <span className="hidden sm:inline">HQ: 12°58'N 77°38'E</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-sans border border-emerald-500/20">
                  24/7 ACTIVE
                </span>
              </div>
            </div>

            {/* Interactive Map Canvas Container */}
            <div 
              className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-[#09090e] rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center"
              style={{
                transform: `perspective(1000px) rotateY(${mousePos.x * 4}deg) rotateX(${-mousePos.y * 4}deg)`,
                transition: 'transform 0.15s ease-out'
              }}
            >
              {/* Map Vector Grid Background */}
              <svg 
                viewBox="0 0 1000 500" 
                className="w-full h-full object-cover select-none pointer-events-auto"
              >
                <defs>
                  {/* Linear Gradient for Connection Arcs */}
                  <linearGradient id="glowArc" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff6600" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#ff9900" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#c5a059" stopOpacity="0.4" />
                  </linearGradient>

                  {/* Active Region Highlight Gradient */}
                  <linearGradient id="activeArc" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff3300" stopOpacity="1" />
                    <stop offset="50%" stopColor="#ffaa00" stopOpacity="1" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
                  </linearGradient>

                  {/* Filter for glowing elements */}
                  <filter id="orangeGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* World Map Stylized Continental Dots / Grids */}
                <g opacity="0.2" fill="#475569">
                  {/* North America Dots */}
                  <path d="M 150 120 h 120 v 80 h -120 z" fill="none" />
                  <circle cx="180" cy="150" r="1.5" />
                  <circle cx="200" cy="140" r="1.5" />
                  <circle cx="220" cy="160" r="1.5" />
                  <circle cx="240" cy="180" r="1.5" />
                  <circle cx="260" cy="170" r="1.5" />
                  <circle cx="210" cy="190" r="1.5" />
                  <circle cx="190" cy="210" r="1.5" />
                  <circle cx="230" cy="200" r="1.5" />

                  {/* South America Dots */}
                  <circle cx="300" cy="320" r="1.5" />
                  <circle cx="320" cy="350" r="1.5" />
                  <circle cx="310" cy="380" r="1.5" />

                  {/* Europe Dots */}
                  <circle cx="470" cy="140" r="1.5" />
                  <circle cx="490" cy="130" r="1.5" />
                  <circle cx="510" cy="150" r="1.5" />
                  <circle cx="480" cy="160" r="1.5" />
                  <circle cx="500" cy="170" r="1.5" />

                  {/* Africa Dots */}
                  <circle cx="500" cy="270" r="1.5" />
                  <circle cx="520" cy="300" r="1.5" />
                  <circle cx="540" cy="280" r="1.5" />

                  {/* Asia / India / China / SE Asia Dots */}
                  <circle cx="620" cy="200" r="1.5" />
                  <circle cx="650" cy="220" r="1.5" />
                  <circle cx="680" cy="240" r="1.5" />
                  <circle cx="710" cy="210" r="1.5" />
                  <circle cx="730" cy="230" r="1.5" />
                  <circle cx="760" cy="250" r="1.5" />
                  <circle cx="780" cy="270" r="1.5" />

                  {/* Australia Dots */}
                  <circle cx="830" cy="370" r="1.5" />
                  <circle cx="860" cy="390" r="1.5" />
                  <circle cx="880" cy="410" r="1.5" />
                </g>

                {/* Drawn Connection Arcs from Bangalore HQ to Remote Regions */}
                {serviceRegions.map((region) => {
                  const pathD = getArcPath(region);
                  const isHovered = activeRegion === region.id;

                  return (
                    <g key={`arc-${region.id}`}>
                      {/* Outer Glow Path */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke={isHovered ? "#ff6600" : "#ff6600"}
                        strokeWidth={isHovered ? "3" : "1.5"}
                        strokeOpacity={isHovered ? "0.9" : "0.35"}
                        strokeDasharray={isHovered ? "none" : "6 4"}
                        filter={isHovered ? "url(#orangeGlowFilter)" : undefined}
                        className="transition-all duration-300"
                      />

                      {/* Animated Traveling Pulse along the Route */}
                      <circle r={isHovered ? "4" : "2.5"} fill="#ffffff">
                        <animateMotion
                          path={pathD}
                          dur={isHovered ? "2.5s" : "4s"}
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  );
                })}

                {/* REMOTE REGION MARKERS */}
                {serviceRegions.map((region) => {
                  const isHovered = activeRegion === region.id;

                  return (
                    <g 
                      key={`region-pin-${region.id}`}
                      transform={`translate(${region.x}, ${region.y})`}
                      className="cursor-pointer group"
                      onMouseEnter={() => {
                        setActiveRegion(region.id);
                        soundFx.playHover();
                      }}
                      onMouseLeave={() => setActiveRegion(null)}
                    >
                      {/* Pulse Ring */}
                      <circle
                        r={isHovered ? "16" : "10"}
                        fill="#ff6600"
                        fillOpacity={isHovered ? "0.3" : "0.15"}
                        className="animate-ping"
                      />

                      {/* Region Dot */}
                      <circle
                        r={isHovered ? "6" : "4"}
                        fill={isHovered ? "#ffffff" : "#ff7700"}
                        stroke="#000000"
                        strokeWidth="1.5"
                        filter="url(#orangeGlowFilter)"
                        className="transition-all duration-300"
                      />

                      {/* Label below dot */}
                      <text
                        y="18"
                        textAnchor="middle"
                        fill={isHovered ? "#ffffff" : "#94a3b8"}
                        fontSize="10"
                        fontWeight={isHovered ? "700" : "500"}
                        className="transition-colors duration-200 pointer-events-none"
                      >
                        {region.name}
                      </text>
                    </g>
                  );
                })}

                {/* BANGALORE HQ MARKER (Central Highlight) */}
                <g 
                  transform={`translate(${HQ.x}, ${HQ.y})`}
                  className="cursor-pointer"
                  onMouseEnter={() => {
                    setActiveRegion('hq');
                    soundFx.playHover();
                  }}
                  onMouseLeave={() => setActiveRegion(null)}
                >
                  {/* Concentric Soft Lighting Rings */}
                  <circle r="36" fill="#ff6600" fillOpacity="0.08" className="animate-pulse" />
                  <circle r="24" fill="#ff6600" fillOpacity="0.15" className="animate-ping" />
                  <circle r="14" fill="#ff6600" fillOpacity="0.3" />

                  {/* HQ Core Pin */}
                  <circle
                    r="8"
                    fill="#ff6600"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    filter="url(#orangeGlowFilter)"
                  />
                  <circle r="3" fill="#ffffff" />

                  {/* HQ Label Pin Box */}
                  <g transform="translate(0, -22)">
                    <rect
                      x="-55"
                      y="-12"
                      width="110"
                      height="20"
                      rx="10"
                      fill="#0d0d12"
                      stroke="#ff6600"
                      strokeWidth="1.5"
                      fillOpacity="0.95"
                    />
                    <text
                      x="0"
                      y="1"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="800"
                      className="tracking-wider"
                    >
                      📍 HQ: BANGALORE
                    </text>
                  </g>
                </g>
              </svg>

              {/* FLOATING GLASS TOOLTIP ON MAP HOVER */}
              <AnimatePresence>
                {activeRegion && activeRegion !== 'hq' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xs glass-panel bg-black/90 border border-[#ff6600]/50 p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-30 space-y-2 pointer-events-none"
                  >
                    {(() => {
                      const reg = serviceRegions.find(r => r.id === activeRegion);
                      if (!reg) return null;
                      return (
                        <>
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-[#ff6600]" />
                              <span className="font-bold text-white text-sm">{reg.name}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                              Remote Available
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed">
                            {reg.description}
                          </p>

                          <div className="pt-1 flex flex-wrap gap-1">
                            {reg.keyServices.map((srv, idx) => (
                              <span key={idx} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-amber-300">
                                {srv}
                              </span>
                            ))}
                          </div>

                          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 pt-1">
                            <Clock className="w-3 h-3 text-[#ff6600]" />
                            <span>{reg.timezones}</span>
                          </div>
                        </>
                      );
                    })()}
                  </motion.div>
                )}

                {activeRegion === 'hq' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xs glass-panel bg-black/90 border border-[#ff6600]/60 p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-30 space-y-2 pointer-events-none"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#ff6600]" />
                        <span className="font-bold text-white text-sm">Bangalore Headquarters</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#ff6600]/20 text-[#ff6600] text-[10px] font-bold">
                        Central Hub
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {HQ.address}
                    </p>
                    <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 pt-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Command center for global strategy, tech &amp; dispatch</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Region Quick Bar */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-[#ff6600]" />
                <span>Primary Remote Regions:</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {serviceRegions.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setActiveRegion(r.id);
                      soundFx.playClick();
                    }}
                    onMouseEnter={() => {
                      setActiveRegion(r.id);
                      soundFx.playHover();
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      activeRegion === r.id
                        ? 'bg-[#ff6600] text-black font-bold shadow-[0_0_12px_rgba(255,102,0,0.5)]'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>


          {/* RIGHT COLUMN: INFORMATION CARD & SERVICES (5 cols) */}
          <motion.div 
            style={{ y: cardY }}
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* HEADQUARTERS CARD */}
            <div className="glass-panel rounded-3xl border border-white/10 bg-[#0d0d12]/90 p-6 backdrop-blur-xl relative overflow-hidden group hover:border-[#ff6600]/40 transition-all duration-300 shadow-xl">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#ff6600]/10 rounded-full blur-2xl group-hover:bg-[#ff6600]/20 transition-all" />

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff6600] to-amber-600 flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,102,0,0.4)] shrink-0 mt-0.5">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6600] uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Headquarters</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">📍 Bangalore, India</h3>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-300 leading-relaxed font-normal">
                Our headquarters serve as the operational hub where strategy, leadership, and innovation come together to support our clients worldwide.
              </p>
            </div>


            {/* GLOBAL REMOTE OPERATIONS CARD */}
            <div className="glass-panel rounded-3xl border border-white/10 bg-[#0d0d12]/90 p-6 backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300 shadow-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-amber-400">
                  <Globe className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white">Global Remote Operations</h4>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Our remote-first team collaborates seamlessly across multiple time zones, enabling us to deliver reliable business operations and support services to companies around the world without geographical limitations.
              </p>

              <div className="pt-2 flex items-center gap-4 text-xs text-slate-400 border-t border-white/10">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% Boundaryless Execution</span>
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Zero Off-Hour Delays</span>
                </span>
              </div>
            </div>


            {/* SERVICES DELIVERED WORLDWIDE */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ff6600]" />
                  <span>Services Delivered Worldwide</span>
                </h4>
                <span className="text-xs text-slate-400 font-mono">8 Core Capabilities</span>
              </div>

              {/* 2-Column Grid of Interactive Glass Service Chips */}
              <div className="grid grid-cols-2 gap-2.5">
                {servicesList.map((srv, idx) => {
                  const IconComp = srv.icon;
                  const isSelected = activeService === srv.id;

                  return (
                    <motion.div
                      key={srv.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.4 + idx * 0.05 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      onMouseEnter={() => {
                        setActiveService(srv.id);
                        soundFx.playHover();
                      }}
                      onMouseLeave={() => setActiveService(null)}
                      onClick={() => soundFx.playClick()}
                      className={`glass-panel p-3 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                        isSelected 
                          ? 'border-[#ff6600] bg-[#1a120c] shadow-[0_0_20px_rgba(255,102,0,0.25)]' 
                          : 'border-white/10 bg-[#0d0d12]/80 hover:border-white/25 hover:bg-white/5'
                      }`}
                    >
                      {/* Glass Reflection Highlight */}
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                      <div className="flex items-start justify-between gap-2">
                        <div className={`p-2 rounded-xl bg-gradient-to-br ${srv.color} text-black font-bold shrink-0 shadow-md`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10 shrink-0">
                          {srv.tag}
                        </span>
                      </div>

                      <div className="mt-2.5 space-y-0.5">
                        <h5 className="text-xs font-bold text-white group-hover:text-[#ff6600] transition-colors">
                          {srv.title}
                        </h5>
                        <p className="text-[11px] text-slate-400 line-clamp-1 leading-snug">
                          {srv.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </motion.div>

        </div>


        {/* ANIMATED STATISTICS COUNTERS ROW */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="pt-8 border-t border-white/10"
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
            
            {/* Stat 1 */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#0b0b10] text-center space-y-1 relative overflow-hidden group hover:border-[#ff6600]/40 transition-all">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight group-hover:text-[#ff6600] transition-colors">
                1
              </div>
              <div className="text-xs font-bold text-slate-200">Headquarters</div>
              <div className="text-[11px] text-slate-400">📍 Bangalore, India</div>
            </div>

            {/* Stat 2 */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#0b0b10] text-center space-y-1 relative overflow-hidden group hover:border-amber-500/40 transition-all">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono tracking-tight">
                100%
              </div>
              <div className="text-xs font-bold text-slate-200">Global Remote Team</div>
              <div className="text-[11px] text-slate-400">Boundaryless Talent</div>
            </div>

            {/* Stat 3 */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#0b0b10] text-center space-y-1 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight">
                24/7/365
              </div>
              <div className="text-xs font-bold text-slate-200">Worldwide Support</div>
              <div className="text-[11px] text-slate-400">Zero Downtime</div>
            </div>

            {/* Stat 4 */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#0b0b10] text-center space-y-1 relative overflow-hidden group hover:border-blue-500/40 transition-all">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-mono tracking-tight">
                24+
              </div>
              <div className="text-xs font-bold text-slate-200">Time Zones Covered</div>
              <div className="text-[11px] text-slate-400">US, EU &amp; APAC Sync</div>
            </div>

            {/* Stat 5 */}
            <div className="col-span-2 md:col-span-1 glass-panel p-5 rounded-2xl border border-white/10 bg-[#0b0b10] text-center space-y-1 relative overflow-hidden group hover:border-purple-500/40 transition-all">
              <div className="text-3xl sm:text-4xl font-extrabold text-purple-400 font-mono tracking-tight">
                &lt; 60s
              </div>
              <div className="text-xs font-bold text-slate-200">Operational Response</div>
              <div className="text-[11px] text-slate-400">Instant Escalation</div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
