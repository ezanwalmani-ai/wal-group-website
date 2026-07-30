import React, { useEffect, useRef } from 'react';

interface CinematicHeroScanLightProps {
  className?: string;
}

interface DustParticle {
  x: number; // 0 to 1 normalized
  y: number; // 0 to 1 normalized
  radius: number;
  driftX: number;
  driftY: number;
  phase: number;
}

export const CinematicHeroScanLight: React.FC<CinematicHeroScanLightProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTimestamp: number | null = null;

    // Check reduced motion preference
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReducedMotion = reducedMotionQuery.matches;

    if (isReducedMotion) return;

    // Dust particles setup (35 tiny subtle floating motes)
    const dustParticles: DustParticle[] = Array.from({ length: 35 }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 0.9 + 0.6, // 0.6px to 1.5px
      driftX: (Math.random() - 0.5) * 0.00012,
      driftY: (Math.random() - 0.5) * 0.00018,
      phase: Math.random() * Math.PI * 2,
    }));

    // Timing constants
    const SWEEP_DURATION = 7000; // 7 seconds sweep
    const PAUSE_DURATION = 12000; // 12 seconds pause
    const CYCLE_DURATION = SWEEP_DURATION + PAUSE_DURATION;

    let cycleTime = 0; // ms within current cycle

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = container.clientWidth;
      const height = container.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    resizeObserver.observe(container);
    resizeCanvas();

    const render = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      cycleTime = (cycleTime + delta) % CYCLE_DURATION;

      const width = container.clientWidth;
      const height = container.clientHeight;

      ctx.clearRect(0, 0, width, height);

      // Only animate sweep during SWEEP_DURATION window
      if (cycleTime < SWEEP_DURATION) {
        // Normalized progress 0.0 to 1.0
        const progress = cycleTime / SWEEP_DURATION;

        // Smooth easeInOutCubic for cinematic sweep movement
        const easeProgress =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        // Beam position across screen with padding
        const beamWidth = 320; // 320px wide feathered sweep
        const startX = -beamWidth;
        const endX = width + beamWidth;
        const beamX = startX + easeProgress * (endX - startX);

        // Overall alpha curve: fade in at start (0 to 0.15), fade out at end (0.85 to 1.0)
        let alphaFade = 1;
        if (progress < 0.15) {
          alphaFade = progress / 0.15;
        } else if (progress > 0.85) {
          alphaFade = (1.0 - progress) / 0.15;
        }

        const maxOpacity = 0.09 * alphaFade; // Pure white low opacity 9% max for soft luxury studio look

        // Expose CSS custom variables on container for interactive lighting reaction on text/cards
        if (container) {
          container.style.setProperty('--scan-pct', `${((beamX / width) * 100).toFixed(2)}%`);
          container.style.setProperty('--scan-alpha', alphaFade.toFixed(3));
        }

        // 1. Draw Cinematic Horizontal Scanning Light Beam
        ctx.save();

        // Horizontal gradient across beam width (Pure White Studio Light Sweep)
        const beamGrad = ctx.createLinearGradient(beamX - beamWidth / 2, 0, beamX + beamWidth / 2, 0);
        beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        beamGrad.addColorStop(0.3, `rgba(255, 255, 255, ${(maxOpacity * 0.4).toFixed(4)})`);
        beamGrad.addColorStop(0.5, `rgba(255, 255, 255, ${(maxOpacity * 0.95).toFixed(4)})`);
        beamGrad.addColorStop(0.7, `rgba(255, 255, 255, ${(maxOpacity * 0.4).toFixed(4)})`);
        beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        // Vertical masking gradient so beam feathers gently at top and bottom edges
        const vertGrad = ctx.createLinearGradient(0, 0, 0, height);
        vertGrad.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
        vertGrad.addColorStop(0.15, 'rgba(0, 0, 0, 0.95)');
        vertGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.95)');
        vertGrad.addColorStop(1, 'rgba(0, 0, 0, 0.1)');

        ctx.fillStyle = beamGrad;
        ctx.fillRect(beamX - beamWidth / 2, 0, beamWidth, height);

        // Soft core line (3px sharp white studio light center line with feathered glow)
        const coreGrad = ctx.createLinearGradient(beamX - 3, 0, beamX + 3, 0);
        coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        coreGrad.addColorStop(0.5, `rgba(255, 255, 255, ${(maxOpacity * 1.8).toFixed(4)})`);
        coreGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = coreGrad;
        ctx.fillRect(beamX - 3, 0, 6, height);

        // Very soft subtle warm orange reflection pulse at center intersection
        const accentGrad = ctx.createRadialGradient(
          beamX, height * 0.5, 0,
          beamX, height * 0.5, 200
        );
        accentGrad.addColorStop(0, `rgba(255, 119, 0, ${(maxOpacity * 0.4).toFixed(4)})`);
        accentGrad.addColorStop(0.5, `rgba(255, 119, 0, ${(maxOpacity * 0.1).toFixed(4)})`);
        accentGrad.addColorStop(1, 'rgba(255, 119, 0, 0)');

        ctx.fillStyle = accentGrad;
        ctx.fillRect(beamX - 200, height * 0.5 - 200, 400, 400);

        ctx.restore();

        // 2. Dust Particles Catching Light as Beam Passes
        dustParticles.forEach((p) => {
          // Update particle position (drift)
          p.x = (p.x + p.driftX + 1) % 1;
          p.y = (p.y + p.driftY + 1) % 1;

          const px = p.x * width;
          const py = p.y * height;

          // Distance to beam center
          const distToBeam = Math.abs(px - beamX);
          const halfBeam = beamWidth * 0.6;

          if (distToBeam < halfBeam) {
            // Illumination factor based on proximity to beam
            const illuminateFactor = (1 - distToBeam / halfBeam) * alphaFade;
            const pOpacity = Math.min(0.65, illuminateFactor * 0.6);

            ctx.save();
            ctx.fillStyle = `rgba(255, 255, 255, ${pOpacity.toFixed(3)})`;

            // Draw glowing micro dust mote
            ctx.beginPath();
            ctx.arc(px, py, p.radius, 0, Math.PI * 2);
            ctx.fill();

            // Tiny outer aura for dust caught in beam
            if (illuminateFactor > 0.4) {
              ctx.fillStyle = `rgba(255, 200, 150, ${(pOpacity * 0.3).toFixed(3)})`;
              ctx.beginPath();
              ctx.arc(px, py, p.radius * 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.restore();
          }
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden z-[2] ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
