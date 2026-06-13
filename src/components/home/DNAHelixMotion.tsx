"use client";

import { useEffect, useRef } from "react";

// Brand palette as RGB for manual rgba construction
const C_BRIGHT: [number, number, number] = [242, 252, 232];
const C_GLOW: [number, number, number] = [217, 232, 196];
const C_SAGE: [number, number, number] = [140, 171, 119];
const C_DEEP: [number, number, number] = [68, 98, 52];

const HELIX_TURNS = 2.3;
const PARTICLE_COUNT = 960;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  homeStrand: 0 | 1;
  t: number;          // normalized position along helix height [0,1]
  isRung: boolean;
  rungFraction: number;
  r: number;          // base radius
  // pre-computed disperse impulse (applied once on hover start)
  dvx: number;
  dvy: number;
}

type Mode = "rest" | "dispersing" | "returning";

function seededRand(seed: number) {
  return Math.abs(Math.sin(seed * 127.1 + 311.7) * 43758.5453) % 1;
}

function lerp3(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

export default function DNAHelixMotion({
  reduceMotion = false,
  className = "",
  hovered = false,
}: {
  reduceMotion?: boolean;
  className?: string;
  hovered?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // hovered prop → ref so rAF loop can read it without stale closure
  const hoveredRef = useRef(hovered);

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let raf = 0;
    let inView = true;
    let pageVisible = true;
    let rotPhase = 0;

    // Mode management (all inside closure — no refs needed)
    let mode: Mode = "rest";
    let prevHov = false;
    let returnFrames = 0;

    const particles: Particle[] = [];

    /* ─── Geometry ─────────────────────────────────────── */

    const getHome = (p: Particle, phase: number) => {
      const cx = w * 0.5;
      const amp = w * 0.32;
      const k = Math.PI * 2 * HELIX_TURNS;

      if (p.isRung) {
        const a0 = p.t * k + phase;
        const a1 = p.t * k + phase + Math.PI;
        const x0 = cx + Math.sin(a0) * amp;
        const x1 = cx + Math.sin(a1) * amp;
        const y = h * 0.04 + p.t * h * 0.92;
        const z0 = (Math.cos(a0) + 1) / 2;
        const z1 = (Math.cos(a1) + 1) / 2;
        const rf = p.rungFraction;
        return { x: x0 + (x1 - x0) * rf, y, z: z0 + (z1 - z0) * rf };
      }

      const offset = p.homeStrand === 1 ? Math.PI : 0;
      const a = p.t * k + phase + offset;
      return {
        x: cx + Math.sin(a) * amp,
        y: h * 0.04 + p.t * h * 0.92,
        z: (Math.cos(a) + 1) / 2,
      };
    };

    /* ─── Particle init ─────────────────────────────────── */

    const initParticles = () => {
      particles.length = 0;
      let si = 0;
      const strandN = Math.floor((PARTICLE_COUNT * 0.76) / 2);

      for (let strand = 0; strand < 2; strand++) {
        for (let i = 0; i < strandN; i++) {
          const t = i / strandN;
          const idx = si++;
          particles.push({
            x: 0, y: 0, vx: 0, vy: 0,
            homeStrand: strand as 0 | 1,
            t,
            isRung: false,
            rungFraction: 0,
            r: 0.9 + seededRand(idx * 7 + 1) * 1.5,
            dvx: (seededRand(idx * 7 + 2) - 0.5) * 18,
            dvy: -(3 + seededRand(idx * 7 + 3) * 22),
          });
        }
      }

      const rungs = Math.floor(HELIX_TURNS * 17);
      const perRung = Math.max(2, Math.floor((PARTICLE_COUNT * 0.24) / rungs));
      for (let r = 0; r < rungs; r++) {
        for (let j = 0; j < perRung; j++) {
          const idx = si++;
          particles.push({
            x: 0, y: 0, vx: 0, vy: 0,
            homeStrand: 0,
            t: r / rungs,
            isRung: true,
            rungFraction: perRung > 1 ? j / (perRung - 1) : 0.5,
            r: 0.65 + seededRand(idx * 7 + 1) * 1.0,
            dvx: (seededRand(idx * 7 + 2) - 0.5) * 13,
            dvy: -(1.5 + seededRand(idx * 7 + 3) * 18),
          });
        }
      }

      // Place at home immediately (no animation on init)
      for (const p of particles) {
        const pos = getHome(p, rotPhase);
        p.x = pos.x;
        p.y = pos.y;
      }
    };

    /* ─── Canvas resize ─────────────────────────────────── */

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* ─── Draw loop ─────────────────────────────────────── */

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      if (!reduceMotion) rotPhase = time * 0.00046;

      // Detect hover transitions
      const curHov = hoveredRef.current;
      if (curHov !== prevHov) {
        if (curHov) {
          // Apply impulse — particles fly apart
          for (const p of particles) {
            p.vx += p.dvx;
            p.vy += p.dvy;
          }
          mode = "dispersing";
          returnFrames = 0;
        } else {
          mode = "returning";
          returnFrames = 0;
        }
        prevHov = curHov;
      }

      // Settle back to rest after returning is done
      if (mode === "returning") {
        returnFrames++;
        if (returnFrames > 180) mode = "rest";
      }

      for (const p of particles) {
        const { x: hx, y: hy, z } = getHome(p, rotPhase);

        if (mode === "rest") {
          // Strong spring — particles track rotating helix precisely
          p.vx += (hx - p.x) * 0.16;
          p.vy += (hy - p.y) * 0.16;
          p.vx *= 0.66;
          p.vy *= 0.66;
        } else if (mode === "dispersing") {
          // Free flight with gravity and air resistance
          p.vy += 0.14;
          p.vx *= 0.965;
          p.vy *= 0.972;
        } else {
          // Returning: spring eases in as frames accumulate
          const sp = 0.048 + Math.min(returnFrames, 90) / 90 * 0.03;
          p.vx += (hx - p.x) * sp;
          p.vy += (hy - p.y) * sp;
          p.vx *= 0.80;
          p.vy *= 0.80;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Colour: depth-modulated from deep sage → sage → glow → bright highlight
        const col = lerp3(lerp3(C_DEEP, C_SAGE, z), lerp3(C_GLOW, C_BRIGHT, z), z * z);
        const alpha = 0.18 + z * 0.76;
        const rad = p.r * (0.5 + z * 1.08);

        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha.toFixed(3)})`;
        ctx.fill();
      }

      raf = pageVisible && inView && !reduceMotion
        ? requestAnimationFrame(draw)
        : 0;
    };

    /* ─── Lifecycle ─────────────────────────────────────── */

    resize();
    initParticles();

    if (reduceMotion) {
      draw(0);
    } else {
      raf = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(() => {
      resize();
      initParticles();
      if (reduceMotion) draw(0);
    });
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !raf && !reduceMotion && pageVisible)
        raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible && inView && !raf && !reduceMotion)
        raf = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
