import { describe, it, expect } from 'vitest';
import { AnimatedBackground } from '../src/components/core/animated-background';
import { AnimatedTabsHover, WAL_NAV_TABS } from '../src/components/AnimatedTabsHover';

describe('Animated Tabs Hover & Navigation Integration', () => {
  it('should export AnimatedBackground component properly', () => {
    expect(AnimatedBackground).toBeDefined();
    expect(typeof AnimatedBackground).toBe('function');
  });

  it('should export AnimatedTabsHover component properly', () => {
    expect(AnimatedTabsHover).toBeDefined();
    expect(typeof AnimatedTabsHover).toBe('function');
  });

  it('should contain all required WAL GROUPS navigation tabs with real routes', () => {
    const tabLabels = WAL_NAV_TABS.map(t => t.label);
    const tabPaths = WAL_NAV_TABS.map(t => t.path);

    // Required core tabs from specification
    expect(tabLabels).toContain('Home');
    expect(tabLabels).toContain('About');
    expect(tabLabels).toContain('Services');
    expect(tabLabels).toContain('Website Development');
    expect(tabLabels).toContain('Contact');

    // Real route verification (no dead links or placeholders)
    expect(tabPaths).toContain('/');
    expect(tabPaths).toContain('/about');
    expect(tabPaths).toContain('/services');
    expect(tabPaths).toContain('/website-design-development');
    expect(tabPaths).toContain('/contact');

    WAL_NAV_TABS.forEach(tab => {
      expect(tab.path.startsWith('/')).toBe(true);
      expect(tab.path).not.toBe('#');
      expect(tab.path).not.toBe('/placeholder');
    });
  });

  it('should include operations suites with dropdown triggers', () => {
    const servicesTab = WAL_NAV_TABS.find(t => t.id === 'services');
    const dspTab = WAL_NAV_TABS.find(t => t.id === 'dsp');
    const afpTab = WAL_NAV_TABS.find(t => t.id === 'afp');
    const bpoTab = WAL_NAV_TABS.find(t => t.id === 'bpo');

    expect(servicesTab?.hasDropdown).toBe(true);
    expect(dspTab?.hasDropdown).toBe(true);
    expect(afpTab?.hasDropdown).toBe(true);
    expect(bpoTab?.hasDropdown).toBe(true);
  });
});
