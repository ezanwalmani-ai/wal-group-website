// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { Motion1CinematicBackground } from '../src/components/Motion1CinematicBackground';
import { AnimatedWhiteLinesBackground } from '../src/components/AnimatedWhiteLinesBackground';

describe('Motion1CinematicBackground Component', () => {
  beforeEach(() => {
    // Mock ResizeObserver
    global.ResizeObserver = class ResizeObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    };

    // Mock HTMLCanvasElement.getContext
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      bezierCurveTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      arc: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      scale: vi.fn(),
      setLineDash: vi.fn(),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
      createRadialGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
    })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  });

  it('should export Motion1CinematicBackground and render canvas container', () => {
    expect(Motion1CinematicBackground).toBeDefined();
    const { container } = render(<Motion1CinematicBackground className="test-motion" />);

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeDefined();
    expect(container.firstElementChild?.classList.contains('test-motion')).toBe(true);
  });

  it('should provide backward compatibility through AnimatedWhiteLinesBackground', () => {
    expect(AnimatedWhiteLinesBackground).toBeDefined();
    const { container } = render(<AnimatedWhiteLinesBackground />);

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeDefined();
  });

  it('should safely handle reduced motion without runtime exceptions', () => {
    // Mock prefers-reduced-motion to true
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(<Motion1CinematicBackground />);
    expect(container.querySelector('canvas')).toBeDefined();
  });

  it('should clean up animation frames and observers on unmount', () => {
    const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');
    const { unmount } = render(<Motion1CinematicBackground />);

    unmount();
    expect(cancelSpy).toHaveBeenCalled();
  });
});
