// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { LogoRevealPreloader } from '../src/components/LogoRevealPreloader';

describe('LogoRevealPreloader Component', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    document.body.style.overflow = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should export LogoRevealPreloader component properly', () => {
    expect(LogoRevealPreloader).toBeDefined();
    expect(typeof LogoRevealPreloader).toBe('function');
  });

  it('should render on first visit and display WAL GROUPS branding', () => {
    const { container } = render(<LogoRevealPreloader forceShow />);

    expect(screen.getByRole('status', { name: /Loading WAL GROUPS/i })).toBeDefined();
    expect(container.textContent).toContain('WAL');
    expect(container.textContent).toContain('GROUPS');
    expect(container.textContent).toContain('OPERATIONS • TECHNOLOGY • GROWTH');
  });

  it('should lock body scroll while active and restore when animation completes', () => {
    render(<LogoRevealPreloader forceShow />);

    expect(document.body.style.overflow).toBe('hidden');

    // Fast-forward through the 1400ms animation
    act(() => {
      vi.advanceTimersByTime(1450);
    });

    expect(document.body.style.overflow).toBe('');
    expect(window.sessionStorage.getItem('walgroups_preloader_seen')).toBe('true');
  });

  it('should skip animation and not render if walgroups_preloader_seen is already set in sessionStorage', () => {
    window.sessionStorage.setItem('walgroups_preloader_seen', 'true');

    const { container } = render(<LogoRevealPreloader />);

    // Should not render anything
    expect(container.firstChild).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });

  it('should call onComplete callback after preloader finishes', () => {
    const onComplete = vi.fn();
    render(<LogoRevealPreloader forceShow onComplete={onComplete} />);

    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1450);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
