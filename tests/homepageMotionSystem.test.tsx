// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { HomePage } from '../src/pages/HomePage';
import { MotionBackendToBusiness } from '../src/components/motion/MotionBackendToBusiness';
import { MotionOperationsEcosystem } from '../src/components/motion/MotionOperationsEcosystem';
import { MotionLogisticsRoute } from '../src/components/motion/MotionLogisticsRoute';
import { MotionTechnologyDataFlow } from '../src/components/motion/MotionTechnologyDataFlow';
import { MotionWebsiteBuilding } from '../src/components/motion/MotionWebsiteBuilding';
import { MotionAiWorkflow } from '../src/components/motion/MotionAiWorkflow';
import { BookingProvider } from '../src/context/BookingContext';

describe('WAL GROUPS Homepage Motion System Architecture', () => {
  const navigateMock = vi.fn();

  beforeAll(() => {
    global.IntersectionObserver = class IntersectionObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as any;
  });

  it('should export all 6 custom motion components properly', () => {
    expect(MotionBackendToBusiness).toBeDefined();
    expect(MotionOperationsEcosystem).toBeDefined();
    expect(MotionLogisticsRoute).toBeDefined();
    expect(MotionTechnologyDataFlow).toBeDefined();
    expect(MotionWebsiteBuilding).toBeDefined();
    expect(MotionAiWorkflow).toBeDefined();
  });

  it('should render the full HomePage with complete motion rhythm hierarchy', () => {
    const { container } = render(
      <BookingProvider>
        <HomePage navigate={navigateMock} />
      </BookingProvider>
    );

    // 02 Hero & Motion #1
    expect(container.textContent).toContain('We Run the Backend. So You Can Run the Business.');

    // 03 Trust / Quick Proof Strip
    expect(container.textContent).toContain('PROVEN ECOSYSTEM FLUENCY');
    expect(container.textContent).toContain('Amazon Relay');
    expect(container.textContent).toContain('Cortex');

    // 04 Core Services
    expect(container.textContent).toContain('Our Core Services');
    expect(container.textContent).toContain('Website Design & Development');
    expect(container.textContent).toContain('DSP Dispatch Support Services');

    // 05 Trust Marquee & Experience
    expect(container.textContent).toContain('Operational Excellence');

    // 06 Inside Wal Group & Global Presence
    expect(container.textContent).toContain('Inside Wal Group');
    expect(container.textContent).toContain('Global Presence');

    // 07 Why Partner With Us
    expect(container.textContent).toContain('Why Partner With Us');
    expect(container.textContent).toContain('End-to-End Ownership');

    // 08 Call to Action
    expect(container.textContent).toContain('Ready to Streamline Your Backend Operations?');
    expect(container.textContent).toContain('Explore Our Solutions');
  });

  it('should render MotionBackendToBusiness with subtle intensity without error', () => {
    const { container } = render(<MotionBackendToBusiness intensity="subtle" />);
    expect(container.querySelector('svg')).toBeDefined();
  });
});
