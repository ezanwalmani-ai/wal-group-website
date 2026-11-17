import React, { useEffect, useRef } from 'react';

interface Motion1CinematicBackgroundProps {
  className?: string;
}

interface GlassNode {
  nx: number;
  ny: number;
  radius: number;
  driftRx: number;
  driftRy: number;
  speedX: number;
  speedY: number;
  phaseX: number;
  phaseY: number;
  pulsePhase: number;
  pulseSpeed: number;
  hasRing: boolean;
  ringRadiusFactor: number;
}

interface ArchitecturalDatum {
  type: 'horizontal' | 'vertical' | 'diagonal';
  pos: number; // 0 to 1
  start: number;
  end: number;
  dash: number[];
  alpha: number;
  crosshairs?: number[]; // positions along line
}

interface FlowingCurveRibbon {
  startNorm: { x: number; y: number };
  endNorm: { x: number; y: number };
  ctrl1Norm: { x: number; y: number };
  ctrl2Norm: { x: number; y: number };
  oscillation: {
    ampX: number;
    ampY: number;
    speed1: number;
    speed2: number;
    phase1: number;
    phase2: number;
  };
  baseAlpha: number;
  lineWidth: number;
  photons: Array<{
    progress: number;
    speed: number;
    size: number;
    trailLength: number;
  }>;
}

export const Motion1CinematicBackground: React.FC<Motion1CinematicBackgroundProps> = ({
  className = '',
}) => {
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

    // Check reduced motion preference safely
    const isReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse tracking for fluid reactive interaction
    const mouse = {
      x: -2000,
      y: -2000,
      targetX: -2000,
      targetY: -2000,
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
      mouse.targetX = -2000;
      mouse.targetY = -2000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // 1. Dark Glass-Like Nodes (13 precision points distributed across the hero field)
    const glassNodes: GlassNode[] = [
      // Top sector nodes
      { nx: 0.08, ny: 0.16, radius: 22, driftRx: 24, driftRy: 18, speedX: 0.00032, speedY: 0.00028, phaseX: 0.4, phaseY: 1.1, pulsePhase: 0.2, pulseSpeed: 0.0012, hasRing: true, ringRadiusFactor: 1.6 },
      { nx: 0.32, ny: 0.12, radius: 17, driftRx: 28, driftRy: 22, speedX: 0.00024, speedY: 0.00035, phaseX: 1.8, phaseY: 0.6, pulsePhase: 1.5, pulseSpeed: 0.0009, hasRing: false, ringRadiusFactor: 1.4 },
      { nx: 0.58, ny: 0.10, radius: 26, driftRx: 22, driftRy: 26, speedX: 0.00030, speedY: 0.00022, phaseX: 2.9, phaseY: 2.3, pulsePhase: 2.7, pulseSpeed: 0.0011, hasRing: true, ringRadiusFactor: 1.5 },
      { nx: 0.85, ny: 0.14, radius: 20, driftRx: 30, driftRy: 19, speedX: 0.00028, speedY: 0.00033, phaseX: 0.9, phaseY: 3.1, pulsePhase: 0.8, pulseSpeed: 0.0014, hasRing: true, ringRadiusFactor: 1.7 },

      // Mid-field nodes (kept mostly peripheral / right-leaning to maintain central text isolation)
      { nx: 0.06, ny: 0.48, radius: 18, driftRx: 25, driftRy: 30, speedX: 0.00029, speedY: 0.00025, phaseX: 2.1, phaseY: 0.9, pulsePhase: 1.1, pulseSpeed: 0.0010, hasRing: false, ringRadiusFactor: 1.3 },
      { nx: 0.46, ny: 0.42, radius: 15, driftRx: 20, driftRy: 20, speedX: 0.00020, speedY: 0.00022, phaseX: 0.3, phaseY: 2.6, pulsePhase: 3.2, pulseSpeed: 0.0008, hasRing: true, ringRadiusFactor: 1.5 },
      { nx: 0.72, ny: 0.38, radius: 28, driftRx: 32, driftRy: 28, speedX: 0.00034, speedY: 0.00027, phaseX: 1.4, phaseY: 1.7, pulsePhase: 0.5, pulseSpeed: 0.0013, hasRing: true, ringRadiusFactor: 1.6 },
      { nx: 0.93, ny: 0.46, radius: 21, driftRx: 26, driftRy: 24, speedX: 0.00026, speedY: 0.00031, phaseX: 3.4, phaseY: 0.4, pulsePhase: 2.0, pulseSpeed: 0.0011, hasRing: false, ringRadiusFactor: 1.4 },

      // Lower field nodes
      { nx: 0.14, ny: 0.78, radius: 24, driftRx: 28, driftRy: 32, speedX: 0.00031, speedY: 0.00024, phaseX: 0.7, phaseY: 2.0, pulsePhase: 1.7, pulseSpeed: 0.0009, hasRing: true, ringRadiusFactor: 1.55 },
      { nx: 0.38, ny: 0.82, radius: 16, driftRx: 22, driftRy: 20, speedX: 0.00022, speedY: 0.00036, phaseX: 2.5, phaseY: 1.3, pulsePhase: 2.9, pulseSpeed: 0.0012, hasRing: false, ringRadiusFactor: 1.3 },
      { nx: 0.64, ny: 0.75, radius: 25, driftRx: 34, driftRy: 26, speedX: 0.00027, speedY: 0.00029, phaseX: 1.2, phaseY: 2.8, pulsePhase: 0.4, pulseSpeed: 0.0010, hasRing: true, ringRadiusFactor: 1.5 },
      { nx: 0.88, ny: 0.80, radius: 19, driftRx: 27, driftRy: 25, speedX: 0.00035, speedY: 0.00021, phaseX: 3.0, phaseY: 0.8, pulsePhase: 1.8, pulseSpeed: 0.0013, hasRing: false, ringRadiusFactor: 1.4 },
      { nx: 0.50, ny: 0.92, radius: 20, driftRx: 25, driftRy: 22, speedX: 0.00025, speedY: 0.00030, phaseX: 1.6, phaseY: 1.9, pulsePhase: 2.4, pulseSpeed: 0.0011, hasRing: true, ringRadiusFactor: 1.6 },
    ];

    // 2. Thin Amber Architectural Datum & Grid Lines
    const architecturalDatums: ArchitecturalDatum[] = [
      // Horizontal coordinate datums
      { type: 'horizontal', pos: 0.14, start: 0.02, end: 0.98, dash: [4, 8], alpha: 0.12, crosshairs: [0.08, 0.32, 0.58, 0.85] },
      { type: 'horizontal', pos: 0.44, start: 0.04, end: 0.96, dash: [2, 10], alpha: 0.09, crosshairs: [0.46, 0.72, 0.93] },
      { type: 'horizontal', pos: 0.76, start: 0.02, end: 0.98, dash: [5, 7], alpha: 0.11, crosshairs: [0.14, 0.38, 0.64, 0.88] },
      { type: 'horizontal', pos: 0.90, start: 0.08, end: 0.92, dash: [1, 5], alpha: 0.08, crosshairs: [0.50] },

      // Vertical structural guides
      { type: 'vertical', pos: 0.08, start: 0.06, end: 0.94, dash: [3, 9], alpha: 0.09, crosshairs: [0.14, 0.44, 0.76] },
      { type: 'vertical', pos: 0.50, start: 0.05, end: 0.95, dash: [2, 8], alpha: 0.07, crosshairs: [0.90] },
      { type: 'vertical', pos: 0.72, start: 0.08, end: 0.92, dash: [4, 6], alpha: 0.10, crosshairs: [0.44, 0.76] },
      { type: 'vertical', pos: 0.92, start: 0.06, end: 0.94, dash: [3, 7], alpha: 0.09, crosshairs: [0.14, 0.44] },
    ];

    // 3. Flowing Amber Harmonic Curves (Fluid Arteries)
    const flowingCurves: FlowingCurveRibbon[] = [
      // Major upper sweeping curve
      {
        startNorm: { x: -0.05, y: 0.22 },
        endNorm: { x: 1.05, y: 0.28 },
        ctrl1Norm: { x: 0.30, y: 0.05 },
        ctrl2Norm: { x: 0.68, y: 0.42 },
        oscillation: { ampX: 25, ampY: 35, speed1: 0.00035, speed2: 0.00028, phase1: 0.2, phase2: 1.5 },
        baseAlpha: 0.20,
        lineWidth: 1.3,
        photons: [
          { progress: 0.12, speed: 0.00065, size: 3.5, trailLength: 0.10 },
          { progress: 0.65, speed: 0.00055, size: 2.8, trailLength: 0.08 },
        ],
      },
      // Central organic flow (dipping gently under the hero headline)
      {
        startNorm: { x: -0.05, y: 0.52 },
        endNorm: { x: 1.05, y: 0.48 },
        ctrl1Norm: { x: 0.35, y: 0.65 },
        ctrl2Norm: { x: 0.75, y: 0.30 },
        oscillation: { ampX: 30, ampY: 40, speed1: 0.00028, speed2: 0.00032, phase1: 2.1, phase2: 0.8 },
        baseAlpha: 0.17,
        lineWidth: 1.1,
        photons: [
          { progress: 0.35, speed: 0.00070, size: 3.0, trailLength: 0.12 },
          { progress: 0.88, speed: 0.00060, size: 2.5, trailLength: 0.07 },
        ],
      },
      // Lower sweeping transit ribbon
      {
        startNorm: { x: -0.05, y: 0.82 },
        endNorm: { x: 1.05, y: 0.68 },
        ctrl1Norm: { x: 0.28, y: 0.95 },
        ctrl2Norm: { x: 0.70, y: 0.60 },
        oscillation: { ampX: 22, ampY: 32, speed1: 0.00040, speed2: 0.00025, phase1: 1.1, phase2: 2.6 },
        baseAlpha: 0.18,
        lineWidth: 1.2,
        photons: [
          { progress: 0.20, speed: 0.00058, size: 3.2, trailLength: 0.09 },
          { progress: 0.74, speed: 0.00064, size: 2.6, trailLength: 0.08 },
        ],
      },
      // Diagonal interconnecting arch (subtle secondary depth)
      {
        startNorm: { x: 0.15, y: 0.05 },
        endNorm: { x: 0.88, y: 0.95 },
        ctrl1Norm: { x: 0.48, y: 0.25 },
        ctrl2Norm: { x: 0.52, y: 0.75 },
        oscillation: { ampX: 20, ampY: 28, speed1: 0.00030, speed2: 0.00038, phase1: 0.8, phase2: 1.9 },
        baseAlpha: 0.12,
        lineWidth: 0.9,
        photons: [
          { progress: 0.45, speed: 0.00050, size: 2.6, trailLength: 0.07 },
        ],
      },
    ];

    // Helper: calculate node coordinates with harmonic drift & subtle mouse repulsion
    const getNodePos = (node: GlassNode, width: number, height: number, t: number) => {
      if (isReducedMotion) {
        return {
          x: node.nx * width,
          y: node.ny * height,
        };
      }

      let x = node.nx * width + Math.sin(t * node.speedX + node.phaseX) * node.driftRx;
      let y = node.ny * height + Math.cos(t * node.speedY + node.phaseY) * node.driftRy;

      // Subtle mouse deflection
      if (mouse.x > -1000) {
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const maxDist = 180;
        if (dist < maxDist && dist > 0.001) {
          const force = (1 - dist / maxDist) * 18;
          x += (dx / dist) * force;
          y += (dy / dist) * force;
        }
      }

      return { x, y };
    };

    // Helper: evaluate cubic bezier curve at parameter u (0 <= u <= 1)
    const getCubicPoint = (
      p0: { x: number; y: number },
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      p3: { x: number; y: number },
      u: number
    ) => {
      const invU = 1 - u;
      const invU2 = invU * invU;
      const invU3 = invU2 * invU;
      const u2 = u * u;
      const u3 = u2 * u;

      return {
        x: invU3 * p0.x + 3 * invU2 * u * p1.x + 3 * invU * u2 * p2.x + u3 * p3.x,
        y: invU3 * p0.y + 3 * invU2 * u * p1.y + 3 * invU * u2 * p2.y + u3 * p3.y,
      };
    };

    // Resize canvas with DPR support
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

    // Main 60fps cinematic render loop
    const render = () => {
      time += 1;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      const width = container.clientWidth;
      const height = container.clientHeight;

      ctx.clearRect(0, 0, width, height);

      // ==============================================================
      // 1. LAYER 1: AMBIENT AMBER CHROMATIC FIELD
      // ==============================================================
      // Deep atmospheric warmth in top-right and bottom-left, keeping text center calm
      const ambientGlow1 = ctx.createRadialGradient(
        width * 0.78, height * 0.32, 20,
        width * 0.78, height * 0.32, width * 0.45
      );
      ambientGlow1.addColorStop(0, 'rgba(255, 119, 0, 0.07)');
      ambientGlow1.addColorStop(0.6, 'rgba(200, 80, 0, 0.02)');
      ambientGlow1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ambientGlow1;
      ctx.fillRect(0, 0, width, height);

      const ambientGlow2 = ctx.createRadialGradient(
        width * 0.18, height * 0.85, 20,
        width * 0.18, height * 0.85, width * 0.35
      );
      ambientGlow2.addColorStop(0, 'rgba(255, 140, 20, 0.05)');
      ambientGlow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ambientGlow2;
      ctx.fillRect(0, 0, width, height);

      // ==============================================================
      // 2. LAYER 2: THIN AMBER ARCHITECTURAL LINES & RETICLES
      // ==============================================================
      architecturalDatums.forEach((datum) => {
        ctx.save();
        ctx.strokeStyle = `rgba(255, 130, 20, ${datum.alpha.toFixed(3)})`;
        ctx.lineWidth = 0.85;
        ctx.setLineDash(datum.dash);
        ctx.beginPath();

        if (datum.type === 'horizontal') {
          const y = datum.pos * height;
          ctx.moveTo(datum.start * width, y);
          ctx.lineTo(datum.end * width, y);
          ctx.stroke();

          // Reticle crosshairs
          if (datum.crosshairs) {
            ctx.setLineDash([]);
            ctx.strokeStyle = `rgba(255, 150, 40, ${(datum.alpha * 1.8).toFixed(3)})`;
            ctx.lineWidth = 1;
            datum.crosshairs.forEach((chNorm) => {
              const chX = chNorm * width;
              ctx.beginPath();
              ctx.moveTo(chX - 4, y);
              ctx.lineTo(chX + 4, y);
              ctx.moveTo(chX, y - 4);
              ctx.lineTo(chX, y + 4);
              ctx.stroke();
            });
          }
        } else if (datum.type === 'vertical') {
          const x = datum.pos * width;
          ctx.moveTo(x, datum.start * height);
          ctx.lineTo(x, datum.end * height);
          ctx.stroke();

          if (datum.crosshairs) {
            ctx.setLineDash([]);
            ctx.strokeStyle = `rgba(255, 150, 40, ${(datum.alpha * 1.8).toFixed(3)})`;
            ctx.lineWidth = 1;
            datum.crosshairs.forEach((chNorm) => {
              const chY = chNorm * height;
              ctx.beginPath();
              ctx.moveTo(x - 4, chY);
              ctx.lineTo(x + 4, chY);
              ctx.moveTo(x, chY - 4);
              ctx.lineTo(x, chY + 4);
              ctx.stroke();
            });
          }
        }
        ctx.restore();
      });

      // Calculate current dynamic positions of glass nodes
      const nodePositions = glassNodes.map((n) => getNodePos(n, width, height, time));

      // ==============================================================
      // 3. LAYER 3: INTER-NODE ARCHITECTURAL CONNECTOR LINES
      // ==============================================================
      // Dynamic laser-fine amber lines that connect nearby drifting nodes
      ctx.save();
      for (let i = 0; i < nodePositions.length; i++) {
        for (let j = i + 1; j < nodePositions.length; j++) {
          const pA = nodePositions[i];
          const pB = nodePositions[j];
          const dist = Math.hypot(pB.x - pA.x, pB.y - pA.y);
          const maxDist = 260;

          if (dist < maxDist) {
            const proximityFactor = Math.pow(1 - dist / maxDist, 1.8);
            const lineAlpha = (proximityFactor * 0.15).toFixed(3);

            ctx.strokeStyle = `rgba(255, 130, 20, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.setLineDash([dist > 180 ? 4 : 0, dist > 180 ? 6 : 0]);
            ctx.beginPath();
            ctx.moveTo(pA.x, pA.y);
            ctx.lineTo(pB.x, pB.y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // ==============================================================
      // 4. LAYER 4: FLOWING AMBER CURVES (DYNAMIC BEZIER ARTERIES)
      // ==============================================================
      flowingCurves.forEach((curve) => {
        // Calculate animated control points
        const osc = curve.oscillation;
        const cp1X =
          curve.ctrl1Norm.x * width +
          Math.sin(time * osc.speed1 + osc.phase1) * osc.ampX;
        const cp1Y =
          curve.ctrl1Norm.y * height +
          Math.cos(time * osc.speed2 + osc.phase2) * osc.ampY;

        const cp2X =
          curve.ctrl2Norm.x * width +
          Math.cos(time * osc.speed1 + osc.phase2) * osc.ampX;
        const cp2Y =
          curve.ctrl2Norm.y * height +
          Math.sin(time * osc.speed2 + osc.phase1) * osc.ampY;

        const p0 = { x: curve.startNorm.x * width, y: curve.startNorm.y * height };
        const p1 = { x: cp1X, y: cp1Y };
        const p2 = { x: cp2X, y: cp2Y };
        const p3 = { x: curve.endNorm.x * width, y: curve.endNorm.y * height };

        // Flowing curve gradient
        const curveGrad = ctx.createLinearGradient(p0.x, p0.y, p3.x, p3.y);
        curveGrad.addColorStop(0, `rgba(255, 119, 0, 0)`);
        curveGrad.addColorStop(0.2, `rgba(255, 130, 20, ${curve.baseAlpha.toFixed(3)})`);
        curveGrad.addColorStop(0.5, `rgba(255, 170, 40, ${(curve.baseAlpha * 1.3).toFixed(3)})`);
        curveGrad.addColorStop(0.8, `rgba(220, 80, 0, ${curve.baseAlpha.toFixed(3)})`);
        curveGrad.addColorStop(1, `rgba(255, 119, 0, 0)`);

        ctx.strokeStyle = curveGrad;
        ctx.lineWidth = curve.lineWidth;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        ctx.stroke();

        // Photons traveling along the curve
        if (!isReducedMotion) {
          curve.photons.forEach((photon) => {
            photon.progress = (photon.progress + photon.speed) % 1.0;
            const u = photon.progress;
            const head = getCubicPoint(p0, p1, p2, p3, u);

            // Tail coordinates for comet effect
            const tailU = Math.max(0, u - photon.trailLength);
            const tail = getCubicPoint(p0, p1, p2, p3, tailU);

            // Photon trailing gradient
            const photonGrad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
            photonGrad.addColorStop(0, 'rgba(255, 119, 0, 0)');
            photonGrad.addColorStop(0.7, 'rgba(255, 140, 20, 0.4)');
            photonGrad.addColorStop(1, 'rgba(255, 200, 80, 0.95)');

            ctx.strokeStyle = photonGrad;
            ctx.lineWidth = curve.lineWidth + 1.2;
            ctx.beginPath();
            ctx.moveTo(tail.x, tail.y);
            ctx.lineTo(head.x, head.y);
            ctx.stroke();

            // Photon radiant core
            const photonCore = ctx.createRadialGradient(
              head.x, head.y, 0,
              head.x, head.y, photon.size * 2.5
            );
            photonCore.addColorStop(0, 'rgba(255, 230, 160, 0.95)');
            photonCore.addColorStop(0.3, 'rgba(255, 140, 20, 0.6)');
            photonCore.addColorStop(1, 'rgba(255, 100, 0, 0)');

            ctx.fillStyle = photonCore;
            ctx.beginPath();
            ctx.arc(head.x, head.y, photon.size * 2.5, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      });

      // ==============================================================
      // 5. LAYER 5: DARK GLASS-LIKE NODES (CINEMATIC LENSES)
      // ==============================================================
      nodePositions.forEach((pos, idx) => {
        const node = glassNodes[idx];
        const r = node.radius;

        // Subtle breathing pulsation
        const pulse = Math.sin(time * node.pulseSpeed + node.pulsePhase);
        const dynamicR = r + pulse * 1.5;

        // 5a. Ambient amber back-glow
        const backGlow = ctx.createRadialGradient(
          pos.x, pos.y, dynamicR * 0.4,
          pos.x, pos.y, dynamicR * 2.2
        );
        backGlow.addColorStop(0, 'rgba(255, 130, 20, 0.16)');
        backGlow.addColorStop(0.6, 'rgba(255, 100, 0, 0.04)');
        backGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = backGlow;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, dynamicR * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // 5b. Outer Telemetry Orbit Ring (if configured)
        if (node.hasRing) {
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 140, 30, 0.18)';
          ctx.lineWidth = 0.8;
          ctx.setLineDash([3, 7]);
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, dynamicR * node.ringRadiusFactor, 0, Math.PI * 2);
          ctx.stroke();

          // Satellite tick dot on ring
          const ringAngle = time * 0.0006 + node.phaseX;
          const satX = pos.x + Math.cos(ringAngle) * (dynamicR * node.ringRadiusFactor);
          const satY = pos.y + Math.sin(ringAngle) * (dynamicR * node.ringRadiusFactor);
          ctx.fillStyle = 'rgba(255, 160, 40, 0.6)';
          ctx.beginPath();
          ctx.arc(satX, satY, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // 5c. Dark Smoked Glass Lens Body (Deep obsidian radial gradient)
        // Offset light center slightly to top-left (-0.35r) to emulate physical dome reflection
        const glassBody = ctx.createRadialGradient(
          pos.x - dynamicR * 0.35, pos.y - dynamicR * 0.35, dynamicR * 0.1,
          pos.x, pos.y, dynamicR
        );
        glassBody.addColorStop(0, 'rgba(28, 20, 15, 0.88)'); // subtle smoked highlight
        glassBody.addColorStop(0.45, 'rgba(12, 10, 14, 0.94)'); // dark glass core
        glassBody.addColorStop(0.85, 'rgba(6, 6, 9, 0.98)');   // deep obsidian edge
        glassBody.addColorStop(1, 'rgba(35, 20, 10, 0.85)');   // amber refracted rim base

        ctx.fillStyle = glassBody;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, dynamicR, 0, Math.PI * 2);
        ctx.fill();

        // 5d. Thin Amber Architectural Glass Border
        ctx.strokeStyle = 'rgba(255, 140, 30, 0.38)';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, dynamicR, 0, Math.PI * 2);
        ctx.stroke();

        // 5e. Specular Glass Arc Highlight (Physical curvature reflection)
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        // Arc along top-left rim (approx 135 deg to 215 deg)
        ctx.arc(pos.x, pos.y, dynamicR - 1.8, Math.PI * 1.05, Math.PI * 1.55);
        ctx.stroke();
        ctx.restore();

        // 5f. Inner Concentric Aperture Ring
        ctx.strokeStyle = 'rgba(255, 130, 20, 0.18)';
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, dynamicR * 0.45, 0, Math.PI * 2);
        ctx.stroke();

        // 5g. Central Warm Optical Dot
        ctx.fillStyle = 'rgba(255, 170, 50, 0.75)';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // ==============================================================
      // 6. LAYER 6: TYPOGRAPHY CONTRAST MASK (HERO TEXT READABILITY PROTECTION)
      // ==============================================================
      // Soft radial darkening over the primary reading column (desktop left/center)
      // Guarantees 100% effortless legibility of headlines, text rolls & paragraphs.
      const textVignette = ctx.createRadialGradient(
        width * 0.30, height * 0.48, 50,
        width * 0.30, height * 0.48, width * 0.48
      );
      textVignette.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
      textVignette.addColorStop(0.65, 'rgba(0, 0, 0, 0.18)');
      textVignette.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = textVignette;
      ctx.fillRect(0, 0, width, height);

      // Soft interactive cursor flare
      if (mouse.x > -500 && mouse.y > -500) {
        const cursorGlow = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 180
        );
        cursorGlow.addColorStop(0, 'rgba(255, 130, 20, 0.08)');
        cursorGlow.addColorStop(0.5, 'rgba(255, 100, 0, 0.02)');
        cursorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = cursorGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 180, 0, Math.PI * 2);
        ctx.fill();
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
