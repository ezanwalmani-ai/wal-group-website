import React from 'react';
import { InfiniteSlider } from './core/infinite-slider';
import { ProgressiveBlur } from './core/progressive-blur';
import { platforms } from './InfiniteSliderHoverSpeed';

export interface ProgressiveBlurInfiniteSliderProps {
  speed?: number;
  speedOnHover?: number;
  gap?: number;
  className?: string;
}

export function ProgressiveBlurInfiniteSlider({
  speed = 36,
  speedOnHover = 20,
  gap = 24,
  className = '',
}: ProgressiveBlurInfiniteSliderProps) {
  // Curate platform rows for distinct operational suites
  const rowOnePlatforms = [
    platforms[0], // Amazon Relay
    platforms[1], // Amazon DSP
    platforms[2], // Amazon Flex
    platforms[3], // Cortex
    platforms[4], // Netradyne
    platforms[8], // Motive
  ];

  const rowTwoPlatforms = [
    platforms[5], // QuickBooks Online
    platforms[6], // ADP
    platforms[7], // Paycom
    platforms[9], // ELD Compliance
    platforms[10], // Hours of Service
    platforms[0], // Amazon Relay
  ];

  return (
    <div className={`relative w-full overflow-hidden space-y-4 py-2 ${className}`}>
      {/* Progressive Blur Left & Right Edges */}
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
        <InfiniteSlider 
          speed={speed} 
          speedOnHover={speedOnHover} 
          gap={gap} 
          reverse={false}
        >
          {rowOnePlatforms.map((platform, idx) => (
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
        <InfiniteSlider 
          speed={speed * 0.9} 
          speedOnHover={speedOnHover} 
          gap={gap} 
          reverse={true}
        >
          {rowTwoPlatforms.map((platform, idx) => (
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
  );
}

export default ProgressiveBlurInfiniteSlider;
