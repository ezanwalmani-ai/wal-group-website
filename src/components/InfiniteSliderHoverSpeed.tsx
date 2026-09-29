import React from 'react';
import { InfiniteSlider } from './core/infinite-slider';
import { ProgressiveBlur } from './core/progressive-blur';

export const platforms = [
  {
    name: 'Amazon Relay',
    category: 'Amazon Operations',
    logo: '/logos/amazon-relay.svg',
  },
  {
    name: 'Amazon DSP',
    category: 'Amazon Operations',
    logo: '/logos/amazon-dsp.svg',
  },
  {
    name: 'Amazon Flex',
    category: 'Amazon Operations',
    logo: '/logos/amazon-flex.svg',
  },
  {
    name: 'Cortex',
    category: 'Dispatch Operations',
    logo: '/logos/cortex.svg',
  },
  {
    name: 'Netradyne',
    category: 'Fleet Safety',
    logo: '/logos/netradyne.svg',
  },
  {
    name: 'QuickBooks Online',
    category: 'Accounting',
    logo: '/logos/quickbooks.svg',
  },
  {
    name: 'ADP',
    category: 'Payroll',
    logo: '/logos/adp.svg',
  },
  {
    name: 'Paycom',
    category: 'Payroll',
    logo: '/logos/paycom.svg',
  },
  {
    name: 'Motive',
    category: 'Fleet Management',
    logo: '/logos/motive.svg',
  },
  {
    name: 'ELD Compliance',
    category: 'Fleet Compliance',
    logo: '/logos/eld.svg',
  },
  {
    name: 'Hours of Service',
    category: 'Fleet Compliance',
    logo: '/logos/hos.svg',
  },
];

export interface InfiniteSliderHoverSpeedProps {
  speed?: number;
  speedOnHover?: number;
  gap?: number;
}

export function InfiniteSliderHoverSpeed({
  speed = 36,
  speedOnHover = 20,
  gap = 24,
}: InfiniteSliderHoverSpeedProps = {}) {
  // Row 1: Amazon & Logistics Fleet Operations (Direction: Left)
  const rowOne = [
    platforms[0], // Amazon Relay
    platforms[1], // Amazon DSP
    platforms[2], // Amazon Flex
    platforms[3], // Cortex
    platforms[4], // Netradyne
    platforms[8], // Motive
  ];

  // Row 2: Accounting, Payroll & Compliance Ecosystem (Direction: Right)
  const rowTwo = [
    platforms[5], // QuickBooks Online
    platforms[6], // ADP
    platforms[7], // Paycom
    platforms[9], // ELD Compliance
    platforms[10], // Hours of Service
    platforms[0], // Amazon Relay
  ];

  return (
    <section className="w-full overflow-hidden py-14 bg-transparent relative">
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,102,0,0.04),transparent_70%)] pointer-events-none" />

      <div className="mx-auto mb-8 max-w-5xl px-6 text-center relative z-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-[#ff7700]">
          Technology &amp; Operations
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl leading-tight">
          Deep technical fluency across Amazon’s core platforms,
          accounting suites, and fleet compliance systems.
        </h2>
      </div>

      {/* Progressive Blur Infinite Slider with Different Directions */}
      <div className="relative w-full space-y-4 py-2 z-10">
        {/* Progressive Blur Left Edge */}
        <ProgressiveBlur
          direction="left"
          blurLayers={8}
          blurIntensity={0.7}
          className="left-0 top-0 bottom-0 w-24 sm:w-40 md:w-56"
        />
        <div 
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-32 md:w-44 z-20 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent dark:from-[#080808] dark:via-[#080808]/80 dark:to-transparent" 
        />

        {/* Progressive Blur Right Edge */}
        <ProgressiveBlur
          direction="right"
          blurLayers={8}
          blurIntensity={0.7}
          className="right-0 top-0 bottom-0 w-24 sm:w-40 md:w-56"
        />
        <div 
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-32 md:w-44 z-20 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent dark:from-[#080808] dark:via-[#080808]/80 dark:to-transparent" 
        />

        {/* Row 1: Forward scrolling (Direction: Left) */}
        <div className="relative z-10">
          <InfiniteSlider speed={speed} speedOnHover={speedOnHover} gap={gap} reverse={false}>
            {rowOne.map((platform, idx) => (
              <div
                key={`${platform.name}-row1-${idx}`}
                className="flex h-24 w-52 shrink-0 items-center justify-center gap-3
                           rounded-xl border border-slate-200 dark:border-white/10
                           bg-white dark:bg-[#0c101b] px-5
                           shadow-sm transition-all duration-200 hover:shadow-md
                           dark:hover:border-[#ff7700]/50 dark:hover:shadow-[0_4px_20px_rgba(255,119,0,0.15)]
                           hover:border-amber-500/50 cursor-default group"
                title={`${platform.name} — ${platform.category}`}
              >
                <img
                  src={platform.logo}
                  alt={`${platform.name} logo`}
                  className="h-10 w-10 shrink-0 object-contain rounded-md transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                />

                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                    {platform.name}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {platform.category}
                  </span>
                </div>
              </div>
            ))}
          </InfiniteSlider>
        </div>

        {/* Row 2: Reverse scrolling (Direction: Right) */}
        <div className="relative z-10">
          <InfiniteSlider speed={speed * 0.9} speedOnHover={speedOnHover} gap={gap} reverse={true}>
            {rowTwo.map((platform, idx) => (
              <div
                key={`${platform.name}-row2-${idx}`}
                className="flex h-24 w-52 shrink-0 items-center justify-center gap-3
                           rounded-xl border border-slate-200 dark:border-white/10
                           bg-white dark:bg-[#0c101b] px-5
                           shadow-sm transition-all duration-200 hover:shadow-md
                           dark:hover:border-[#ff7700]/50 dark:hover:shadow-[0_4px_20px_rgba(255,119,0,0.15)]
                           hover:border-amber-500/50 cursor-default group"
                title={`${platform.name} — ${platform.category}`}
              >
                <img
                  src={platform.logo}
                  alt={`${platform.name} logo`}
                  className="h-10 w-10 shrink-0 object-contain rounded-md transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                />

                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                    {platform.name}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {platform.category}
                  </span>
                </div>
              </div>
            ))}
          </InfiniteSlider>
        </div>
      </div>

      <div className="mt-6 text-center px-6">
        <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-2xl mx-auto">
          All brand names, trademarks, and registered trademarks are the property of their respective owners. WAL GROUPS operates as an independent management service provider and is not directly affiliated with, sponsored by, or endorsed by Amazon, ADP, Intuit, or other listed platforms.
        </p>
      </div>
    </section>
  );
}

export default InfiniteSliderHoverSpeed;
