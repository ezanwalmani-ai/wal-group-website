import React, { useEffect, useRef } from 'react';

interface AnimatedWhiteLinesBackgroundProps {
  className?: string;
}

interface NodePoint {
  nx: number; // normalized x (0 to 1)
  ny: number; // normalized y (0 to 1)
  driftRx: number; // px drift radius x
  driftRy: number; // px drift radius y
  speedX: number;
  speedY: number;
  phaseX: number;
  phaseY: number;
}

interface ConnectionLine {
  nodeA: number;
  nodeB: number;
  ctrl1?: { cx: number; cy: number }; // normalized curve offset
  ctrl2?: { cx: number; cy: number };
  baseOpacity: number;
  fadeSpeed: number;
  fadePhase: number;
}

interface OrangePulse {
  lineIndex: number;
  progress: number;
  speed: number;
  delayTimer: number;
  reverse: boolean;
}

export const AnimatedWhiteLinesBackground: React.FC<AnimatedWhiteLinesBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Check prefers-reduced-motion
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReducedMotion = reducedMotionQuery.matches;

    // Mouse tracking state
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Node definitions (16 structured points across hero grid)
    const nodes: NodePoint[] = [
      { nx: 0.05, ny: 0.15, driftRx: 25, driftRy: 20, speedX: 0.0003, speedY: 0.0004, phaseX: 0.2, phaseY: 0.5 },
      { nx: 0.25, ny: 0.10, driftRx: 30, driftRy: 25, speedX: 0.0002, speedY: 0.0003, phaseX: 1.1, phaseY: 0.8 },
      { nx: 0.50, ny: 0.08, driftRx: 20, driftRy: 30, speedX: 0.0004, speedY: 0.0002, phaseX: 2.3, phaseY: 1.4 },
      { nx: 0.75, ny: 0.12, driftRx: 35, driftRy: 20, speedX: 0.0003, speedY: 0.0005, phaseX: 0.7, phaseY: 2.1 },
      { nx: 0.95, ny: 0.20, driftRx: 20, driftRy: 25, speedX: 0.0005, speedY: 0.0003, phaseX: 1.8, phaseY: 0.3 },

      { nx: 0.12, ny: 0.40, driftRx: 35, driftRy: 30, speedX: 0.0003, speedY: 0.0004, phaseX: 2.9, phaseY: 1.0 },
      { nx: 0.35, ny: 0.35, driftRx: 25, driftRy: 20, speedX: 0.0002, speedY: 0.0005, phaseX: 0.4, phaseY: 2.8 },
      { nx: 0.65, ny: 0.38, driftRx: 30, driftRy: 35, speedX: 0.0004, speedY: 0.0003, phaseX: 1.5, phaseY: 0.9 },
      { nx: 0.88, ny: 0.45, driftRx: 25, driftRy: 20, speedX: 0.0003, speedY: 0.0002, phaseX: 2.1, phaseY: 1.7 },

      { nx: 0.08, ny: 0.70, driftRx: 20, driftRy: 35, speedX: 0.0004, speedY: 0.0003, phaseX: 0.9, phaseY: 2.5 },
      { nx: 0.28, ny: 0.68, driftRx: 35, driftRy: 25, speedX: 0.0003, speedY: 0.0004, phaseX: 1.7, phaseY: 0.6 },
      { nx: 0.58, ny: 0.72, driftRx: 25, driftRy: 30, speedX: 0.0002, speedY: 0.0003, phaseX: 2.8, phaseY: 1.2 },
      { nx: 0.82, ny: 0.75, driftRx: 30, driftRy: 20, speedX: 0.0005, speedY: 0.0004, phaseX: 0.3, phaseY: 2.0 },

      { nx: 0.18, ny: 0.92, driftRx: 25, driftRy: 20, speedX: 0.0003, speedY: 0.0002, phaseX: 1.2, phaseY: 0.4 },
      { nx: 0.48, ny: 0.95, driftRx: 30, driftRy: 25, speedX: 0.0004, speedY: 0.0005, phaseX: 2.0, phaseY: 1.9 },
      { nx: 0.78, ny: 0.90, driftRx: 20, driftRy: 30, speedX: 0.0002, speedY: 0.0003, phaseX: 0.6, phaseY: 2.7 },
    ];

    // Interconnecting line topologies (straight + subtle curved infrastructure paths)
    const lines: ConnectionLine[] = [
      { nodeA: 0, nodeB: 1, baseOpacity: 0.14, fadeSpeed: 0.0008, fadePhase: 0.0 },
      { nodeA: 1, nodeB: 2, ctrl1: { cx: 0.38, cy: 0.02 }, baseOpacity: 0.16, fadeSpeed: 0.0006, fadePhase: 0.8 },
      { nodeA: 2, nodeB: 3, baseOpacity: 0.12, fadeSpeed: 0.0009, fadePhase: 1.5 },
      { nodeA: 3, nodeB: 4, ctrl1: { cx: 0.88, cy: 0.18 }, baseOpacity: 0.15, fadeSpeed: 0.0007, fadePhase: 2.2 },

      { nodeA: 0, nodeB: 5, baseOpacity: 0.13, fadeSpeed: 0.0005, fadePhase: 0.4 },
      { nodeA: 1, nodeB: 6, ctrl1: { cx: 0.28, cy: 0.22 }, baseOpacity: 0.17, fadeSpeed: 0.0008, fadePhase: 1.2 },
      { nodeA: 2, nodeB: 7, baseOpacity: 0.15, fadeSpeed: 0.0006, fadePhase: 1.9 },
      { nodeA: 3, nodeB: 8, ctrl1: { cx: 0.82, cy: 0.28 }, baseOpacity: 0.14, fadeSpeed: 0.0007, fadePhase: 2.7 },

      { nodeA: 5, nodeB: 6, baseOpacity: 0.16, fadeSpeed: 0.0009, fadePhase: 0.2 },
      { nodeA: 6, nodeB: 7, ctrl1: { cx: 0.50, cy: 0.42 }, baseOpacity: 0.18, fadeSpeed: 0.0006, fadePhase: 1.0 },
      { nodeA: 7, nodeB: 8, baseOpacity: 0.13, fadeSpeed: 0.0008, fadePhase: 2.1 },

      { nodeA: 5, nodeB: 9, ctrl1: { cx: 0.08, cy: 0.55 }, baseOpacity: 0.12, fadeSpeed: 0.0007, fadePhase: 0.5 },
      { nodeA: 6, nodeB: 10, baseOpacity: 0.17, fadeSpeed: 0.0005, fadePhase: 1.4 },
      { nodeA: 7, nodeB: 11, ctrl1: { cx: 0.62, cy: 0.55 }, baseOpacity: 0.15, fadeSpeed: 0.0008, fadePhase: 2.0 },
      { nodeA: 8, nodeB: 12, baseOpacity: 0.14, fadeSpeed: 0.0006, fadePhase: 2.8 },

      { nodeA: 9, nodeB: 10, baseOpacity: 0.15, fadeSpeed: 0.0008, fadePhase: 0.3 },
      { nodeA: 10, nodeB: 11, ctrl1: { cx: 0.42, cy: 0.62 }, baseOpacity: 0.18, fadeSpeed: 0.0007, fadePhase: 1.1 },
      { nodeA: 11, nodeB: 12, baseOpacity: 0.14, fadeSpeed: 0.0009, fadePhase: 1.8 },

      { nodeA: 9, nodeB: 13, baseOpacity: 0.13, fadeSpeed: 0.0006, fadePhase: 0.7 },
      { nodeA: 10, nodeB: 14, ctrl1: { cx: 0.38, cy: 0.82 }, baseOpacity: 0.16, fadeSpeed: 0.0008, fadePhase: 1.6 },
      { nodeA: 11, nodeB: 15, baseOpacity: 0.15, fadeSpeed: 0.0005, fadePhase: 2.4 },

      { nodeA: 13, nodeB: 14, baseOpacity: 0.12, fadeSpeed: 0.0007, fadePhase: 0.1 },
      { nodeA: 14, nodeB: 15, ctrl1: { cx: 0.62, cy: 0.98 }, baseOpacity: 0.14, fadeSpeed: 0.0009, fadePhase: 1.3 },

      // Additional diagonal & cross-connect lines for richer white infrastructure
      { nodeA: 1, nodeB: 7, ctrl1: { cx: 0.45, cy: 0.25 }, baseOpacity: 0.12, fadeSpeed: 0.0007, fadePhase: 0.9 },
      { nodeA: 6, nodeB: 11, ctrl1: { cx: 0.48, cy: 0.52 }, baseOpacity: 0.13, fadeSpeed: 0.0006, fadePhase: 1.7 },
      { nodeA: 5, nodeB: 10, baseOpacity: 0.11, fadeSpeed: 0.0008, fadePhase: 2.3 },
      { nodeA: 2, nodeB: 8, ctrl1: { cx: 0.70, cy: 0.22 }, baseOpacity: 0.12, fadeSpeed: 0.0005, fadePhase: 0.6 },
    ];

    // Two active orange light pulses moving across the network
    const pulses: OrangePulse[] = [
      { lineIndex: 1, progress: 0.1, speed: 0.0025, delayTimer: 0, reverse: false },
      { lineIndex: 9, progress: 0.6, speed: 0.0020, delayTimer: 0, reverse: true },
    ];

    // Helper: calculate calculated point at time `t` for a node
    const getPoint = (node: NodePoint, width: number, height: number, t: number) => {
      if (isReducedMotion) {
        return {
          x: node.nx * width,
          y: node.ny * height,
        };
      }
      const x = node.nx * width + Math.sin(t * node.speedX + node.phaseX) * node.driftRx;
      const y = node.ny * height + Math.cos(t * node.speedY + node.phaseY) * node.driftRy;
      return { x, y };
    };

    // Helper: evaluate point on quadratic bezier or straight line
    const getLinePoint = (
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      ctrl: { x: number; y: number } | undefined,
      u: number
    ) => {
      if (!ctrl) {
        return {
          x: (1 - u) * p1.x + u * p2.x,
          y: (1 - u) * p1.y + u * p2.y,
        };
      }
      // Quadratic Bezier B(u) = (1-u)^2 * P1 + 2(1-u)u * Ctrl + u^2 * P2
      const invU = 1 - u;
      return {
        x: invU * invU * p1.x + 2 * invU * u * ctrl.x + u * u * p2.x,
        y: invU * invU * p1.y + 2 * invU * u * ctrl.y + u * u * p2.y,
      };
    };

    // Distance from point to line segment
    const distToSegment = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
      const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
      if (l2 === 0) return Math.hypot(px - x1, py - y1);
      let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
      t = Math.max(0, Math.min(1, t));
      return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
    };

    // Resize handler
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

    // Main animation render loop
    const render = () => {
      time += 1;

      // Smooth mouse position lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      const width = container.clientWidth;
      const height = container.clientHeight;

      ctx.clearRect(0, 0, width, height);

      // Compute current node coordinates
      const currentPoints = nodes.map(n => getPoint(n, width, height, time));

      // 1. Draw Soft Cursor Glow
      if (mouse.x > -500 && mouse.y > -500) {
        const mouseGlowRadius = 180;
        const mouseGradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, mouseGlowRadius
        );
        mouseGradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
        mouseGradient.addColorStop(0.5, 'rgba(255, 119, 0, 0.04)');
        mouseGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = mouseGradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouseGlowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw Network Lines (Slate/Dark Translucent Lines on White Canvas)
      lines.forEach((line) => {
        const p1 = currentPoints[line.nodeA];
        const p2 = currentPoints[line.nodeB];

        let ctrlPoint: { x: number; y: number } | undefined;
        if (line.ctrl1) {
          ctrlPoint = {
            x: line.ctrl1.cx * width,
            y: line.ctrl1.cy * height,
          };
        }

        // Natural smooth opacity pulsation
        const pulseAlpha = Math.sin(time * line.fadeSpeed + line.fadePhase) * 0.04;
        let finalOpacity = Math.max(0.10, Math.min(0.24, line.baseOpacity + pulseAlpha));
        let lineWidth = 1.0;

        // Proximity mouse brightening
        if (mouse.x > -500) {
          const distToMouse = distToSegment(mouse.x, mouse.y, p1.x, p1.y, p2.x, p2.y);
          if (distToMouse < 180) {
            const proximityFactor = 1 - distToMouse / 180;
            finalOpacity = Math.min(0.40, finalOpacity + proximityFactor * 0.20);
            lineWidth = 1.0 + proximityFactor * 0.5;
          }
        }

        ctx.strokeStyle = `rgba(255, 255, 255, ${finalOpacity.toFixed(3)})`;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);

        if (ctrlPoint) {
          ctx.quadraticCurveTo(ctrlPoint.x, ctrlPoint.y, p2.x, p2.y);
        } else {
          ctx.lineTo(p2.x, p2.y);
        }
        ctx.stroke();

        // Subtle node intersection point
        ctx.fillStyle = `rgba(255, 119, 0, ${Math.min(0.7, finalOpacity * 2.0).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Draw Orange Light Pulses along lines
      if (!isReducedMotion) {
        pulses.forEach((pulse) => {
          if (pulse.delayTimer > 0) {
            pulse.delayTimer -= 1;
            return;
          }

          pulse.progress += pulse.speed;
          if (pulse.progress >= 1.0) {
            // Reset and pick new line or path
            pulse.progress = 0;
            pulse.delayTimer = Math.floor(Math.random() * 80) + 30; // random delay
            pulse.lineIndex = Math.floor(Math.random() * lines.length);
            pulse.reverse = Math.random() > 0.5;
            return;
          }

          const line = lines[pulse.lineIndex];
          const p1 = pulse.reverse ? currentPoints[line.nodeB] : currentPoints[line.nodeA];
          const p2 = pulse.reverse ? currentPoints[line.nodeA] : currentPoints[line.nodeB];

          let ctrlPoint: { x: number; y: number } | undefined;
          if (line.ctrl1) {
            ctrlPoint = {
              x: line.ctrl1.cx * width,
              y: line.ctrl1.cy * height,
            };
          }

          const u = pulse.progress;
          const pos = getLinePoint(p1, p2, ctrlPoint, u);

          // Previous position for tail gradient
          const tailU = Math.max(0, u - 0.08);
          const tailPos = getLinePoint(p1, p2, ctrlPoint, tailU);

          // Draw Glowing Orange Head & Tail
          const pulseGradient = ctx.createLinearGradient(tailPos.x, tailPos.y, pos.x, pos.y);
          pulseGradient.addColorStop(0, 'rgba(255, 119, 0, 0)');
          pulseGradient.addColorStop(0.6, 'rgba(255, 119, 0, 0.25)');
          pulseGradient.addColorStop(1, 'rgba(255, 140, 20, 0.85)');

          ctx.strokeStyle = pulseGradient;
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(tailPos.x, tailPos.y);
          if (ctrlPoint) {
            const subCtrl = getLinePoint(p1, p2, ctrlPoint, (u + tailU) / 2);
            ctx.quadraticCurveTo(subCtrl.x, subCtrl.y, pos.x, pos.y);
          } else {
            ctx.lineTo(pos.x, pos.y);
          }
          ctx.stroke();

          // Soft radial glow at pulse head
          const headGlow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 10);
          headGlow.addColorStop(0, 'rgba(255, 170, 50, 0.9)');
          headGlow.addColorStop(0.4, 'rgba(255, 119, 0, 0.4)');
          headGlow.addColorStop(1, 'rgba(255, 119, 0, 0)');

          ctx.fillStyle = headGlow;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden z-[1] ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
