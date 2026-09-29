import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { InfiniteSlider } from '../src/components/core/infinite-slider';
import { ProgressiveBlur } from '../src/components/core/progressive-blur';
import { InfiniteSliderHoverSpeed, platforms } from '../src/components/InfiniteSliderHoverSpeed';
import { ProgressiveBlurInfiniteSlider } from '../src/components/ProgressiveBlurInfiniteSlider';

describe('Progressive Blur Infinite Slider with Different Directions', () => {
  it('should export InfiniteSlider component properly', () => {
    expect(InfiniteSlider).toBeDefined();
    expect(typeof InfiniteSlider).toBe('function');
  });

  it('should export ProgressiveBlur component properly', () => {
    expect(ProgressiveBlur).toBeDefined();
    expect(typeof ProgressiveBlur).toBe('function');
  });

  it('should export ProgressiveBlurInfiniteSlider component properly', () => {
    expect(ProgressiveBlurInfiniteSlider).toBeDefined();
    expect(typeof ProgressiveBlurInfiniteSlider).toBe('function');
  });

  it('should export InfiniteSliderHoverSpeed component properly', () => {
    expect(InfiniteSliderHoverSpeed).toBeDefined();
    expect(typeof InfiniteSliderHoverSpeed).toBe('function');
  });

  it('should include all 11 required platforms for WAL GROUPS logistics operations', () => {
    const platformNames = platforms.map(p => p.name);
    
    expect(platformNames).toContain('Amazon Relay');
    expect(platformNames).toContain('Amazon DSP');
    expect(platformNames).toContain('Amazon Flex');
    expect(platformNames).toContain('Cortex');
    expect(platformNames).toContain('Netradyne');
    expect(platformNames).toContain('QuickBooks Online');
    expect(platformNames).toContain('ADP');
    expect(platformNames).toContain('Paycom');
    expect(platformNames).toContain('Motive');
    expect(platformNames).toContain('ELD Compliance');
    expect(platformNames).toContain('Hours of Service');

    expect(platforms.length).toBe(11);
  });

  it('should have verified SVG logo files for every platform in /public/logos/', () => {
    platforms.forEach(platform => {
      expect(platform.logo.startsWith('/logos/')).toBe(true);
      const relativePath = platform.logo.replace('/logos/', '');
      const fullPath = path.resolve(process.cwd(), 'public/logos', relativePath);
      expect(fs.existsSync(fullPath)).toBe(true);
    });
  });

  it('should verify each platform has an operational category', () => {
    platforms.forEach(platform => {
      expect(platform.category).toBeDefined();
      expect(platform.category.length).toBeGreaterThan(0);
    });
  });
});
