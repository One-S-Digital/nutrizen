"use client";

import { useEffect, useRef } from "react";

const C_SHADOW: [number, number, number] = [92, 51, 24];
const C_COPPER: [number, number, number] = [181, 112, 46];
const C_GOLD: [number, number, number] = [232, 168, 92];
const C_PALE: [number, number, number] = [248, 222, 176];

const TURNS = 4;
// Particle density — full on desktop, ~9x lighter on phones/touch (where the
// cursor-dispersion can't fire anyway) so the per-frame canvas cost stays cheap.
const BACKBONE_PER_STRAND_FULL = 2016;
const RUNGS_FULL = 52;
const PER_RUNG_FULL = 80;
const BACKBONE_PER_STRAND_LOW = 280;
const RUNGS_LOW = 26;
const PER_RUNG_LOW = 14;

// Cursor dispersion — particles spring away from the cursor and snap back.
const DISPERSE_R = 180;
const PUSH = 14;
const LIFT = 3.0;
const SPRING = 0.038;
const DAMP = 0.88;

// LUT resolution
const CN = 36;
const AN = 24;

interface P {
  strand: 0 | 1;
  t: number;
  isRung: boolean;
  frac: number;
  ox: number;
  oy: number;
  r: number;
  jitter: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  z: number;
}

function seeded(n: number) {
  return Math.abs(Math.sin(n * 127.1 + 311.7) * 43758.5453) % 1;
}
function smooth(e0: number, e1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}
function lerp3(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

export default function DNAHelixMotion({
  reduceMotion = false,
  className = "",
}: {
  reduceMotion?: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lowPower =
      window.matchMedia("(max-width: 768px)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    const BACKBONE_PER_STRAND = lowPower ? BACKBONE_PER_STRAND_LOW : BACKBONE_PER_STRAND_FULL;
    const RUNGS = lowPower ? RUNGS_LOW : RUNGS_FULL;
    const PER_RUNG = lowPower ? PER_RUNG_LOW : PER_RUNG_FULL;

    const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.5);
    let w = 0;
    let h = 0;
    let raf = 0;
    let inView = true;
    let pageVisible = true;
    let phase = 0;

    let clientX = -99999;
    let clientY = -99999;

    const particles: P[] = [];

    // Precomputed rgba strings: CN depth buckets × AN alpha buckets.
    // Avoids per-particle string allocation in the hot loop.
    const rgbaLUT: string[] = new Array(CN * AN);
    for (let ci = 0; ci < CN; ci++) {
      const z = ci / (CN - 1);
      const c =
        z < 0.55
          ? lerp3(C_SHADOW, C_COPPER, z / 0.55)
          : lerp3(C_COPPER, z > 0.85 ? C_PALE : C_GOLD, (z - 0.55) / 0.45);
      const r = c[0] | 0;
      const g = c[1] | 0;
      const b = c[2] | 0;
      for (let ai = 0; ai < AN; ai++) {
        rgbaLUT[ci * AN + ai] = `rgba(${r},${g},${b},${(ai / (AN - 1)).toFixed(3)})`;
      }
    }

    type Geom = { cx: number; amp: number; k: number; top: number; usable: number };
    const geom = (): Geom => ({
      cx: w * 0.5,
      amp: w * 0.291,
      k: Math.PI * 2 * TURNS,
      top: h * 0.05,
      usable: h * 0.9,
    });

    // Returns the rest (home) position + depth without mutating the particle.
    const home = (p: P, ph: number, g: Geom): { x: number; y: number; z: number } => {
      const y = g.top + p.t * g.usable;
      if (p.isRung) {
        const aA = p.t * g.k + ph;
        const aB = aA + Math.PI;
        const xA = g.cx + Math.sin(aA) * g.amp;
        const xB = g.cx + Math.sin(aB) * g.amp;
        const zA = (Math.cos(aA) + 1) / 2;
        const zB = (Math.cos(aB) + 1) / 2;
        return {
          x: xA + (xB - xA) * p.frac + p.ox,
          y: y + p.oy,
          z: zA + (zB - zA) * p.frac,
        };
      }
      const a = p.t * g.k + ph + (p.strand === 1 ? Math.PI : 0);
      return {
        x: g.cx + Math.sin(a) * g.amp + p.ox,
        y: y + p.oy,
        z: (Math.cos(a) + 1) / 2,
      };
    };

    const build = () => {
      particles.length = 0;
      let idx = 0;
      for (let s = 0; s < 2; s++) {
        for (let i = 0; i < BACKBONE_PER_STRAND; i++) {
          idx++;
          particles.push({
            strand: s as 0 | 1,
            t: i / (BACKBONE_PER_STRAND - 1),
            isRung: false,
            frac: 0,
            ox: (seeded(idx * 5 + 1) - 0.5) * 5,
            oy: (seeded(idx * 5 + 2) - 0.5) * 5,
            r: 0.7 + seeded(idx * 5 + 3) * 0.9,
            jitter: seeded(idx * 5 + 4),
            x: 0, y: 0, vx: 0, vy: 0, z: 0,
          });
        }
      }
      for (let r = 0; r < RUNGS; r++) {
        for (let j = 0; j < PER_RUNG; j++) {
          idx++;
          particles.push({
            strand: 0,
            t: (r + 0.5) / RUNGS,
            isRung: true,
            frac: PER_RUNG > 1 ? j / (PER_RUNG - 1) : 0.5,
            ox: (seeded(idx * 5 + 1) - 0.5) * 3,
            oy: (seeded(idx * 5 + 2) - 0.5) * 2,
            r: 0.7 + seeded(idx * 5 + 3) * 0.8,
            jitter: seeded(idx * 5 + 4),
            x: 0, y: 0, vx: 0, vy: 0, z: 0,
          });
        }
      }
      // Pre-place so particles start at their home positions.
      const g = geom();
      for (const p of particles) {
        const pos = home(p, phase, g);
        p.x = pos.x;
        p.y = pos.y;
        p.z = pos.z;
      }
    };

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

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      phase = reduceMotion ? 0.6 : time * 0.0004;
      const g = geom();

      const rect = canvas.getBoundingClientRect();
      const cmx = clientX - rect.left;
      const cmy = clientY - rect.top;
      const active = clientX > -9999 && !reduceMotion;

      for (const p of particles) {
        const hpos = home(p, phase, g);
        p.z = hpos.z;

        if (active) {
          const dx = p.x - cmx;
          const dy = p.y - cmy;
          const d2 = dx * dx + dy * dy;
          if (d2 < DISPERSE_R * DISPERSE_R) {
            const d = Math.sqrt(d2) || 0.001;
            const fall = 1 - d / DISPERSE_R;
            const f = fall * fall * PUSH;
            const jit = (p.jitter - 0.5) * fall * 6;
            p.vx += (dx / d) * f + jit;
            p.vy += (dy / d) * f - fall * fall * LIFT + (Math.random() - 0.5) * fall * 4;
          }
        }

        p.vx += (hpos.x - p.x) * SPRING;
        p.vy += (hpos.y - p.y) * SPRING;
        p.vx *= DAMP;
        p.vy *= DAMP;
        p.x += p.vx;
        p.y += p.vy;
      }

      // Two-bucket depth ordering — back half then front half.
      const paintParticle = (p: P) => {
        const z = p.z;
        const fade = smooth(0.0, 0.05, p.t);
        const alpha = (p.isRung ? 0.74 + z * 0.26 : 0.58 + z * 0.42) * fade;
        const ci = (z * (CN - 1)) | 0;
        let ai = (alpha * (AN - 1)) | 0;
        if (ai < 0) ai = 0;
        else if (ai >= AN) ai = AN - 1;
        ctx.fillStyle = rgbaLUT[ci * AN + ai];
        const s = p.r * (0.5 + z * 0.7);
        ctx.fillRect(p.x - s * 0.5, p.y - s * 0.5, s, s);
      };
      for (const p of particles) if (p.z < 0.5) paintParticle(p);
      for (const p of particles) if (p.z >= 0.5) paintParticle(p);

      raf = pageVisible && inView && !reduceMotion ? requestAnimationFrame(draw) : 0;
    };

    resize();
    build();
    if (reduceMotion) draw(0);
    else raf = requestAnimationFrame(draw);

    const onMove = (e: MouseEvent) => {
      clientX = e.clientX;
      clientY = e.clientY;
    };
    const onLeave = () => {
      clientX = -99999;
      clientY = -99999;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    const ro = new ResizeObserver(() => {
      resize();
      build();
      if (reduceMotion) draw(0);
    });
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !raf && !reduceMotion && pageVisible) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible && inView && !raf && !reduceMotion) raf = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
