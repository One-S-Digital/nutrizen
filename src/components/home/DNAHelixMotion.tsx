"use client";

import { useEffect, useRef } from "react";

/* Copper-dust palette (shadow → highlight), matching the reference helix. */
const C_SHADOW: [number, number, number] = [92, 51, 24];
const C_COPPER: [number, number, number] = [181, 112, 46];
const C_GOLD: [number, number, number] = [232, 168, 92];
const C_PALE: [number, number, number] = [248, 222, 176];

const TURNS = 4; // full twists over the visible height
const BACKBONE_PER_STRAND = 672; // +40% density
const RUNGS = 40; // distinct ladder cross-bars (with vertical gaps)
const PER_RUNG = 34; // dense particles per bar so the rung reads as a line
const DUST_COUNT = 504;

// Local hover dispersion — a big rising burst, like the top fray
const DISPERSE_R = 180;
const PUSH = 14;
const LIFT = 3.0;
const SPRING = 0.038;
const DAMP = 0.88;

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  strand: 0 | 1;
  t: number; // 0..1 down the height
  isRung: boolean;
  frac: number; // across-rung position
  ox: number; // dust jitter offset
  oy: number;
  r: number;
  jitter: number;
  z: number; // current depth (paint sort)
}

interface Dust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  r: number;
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

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let raf = 0;
    let inView = true;
    let pageVisible = true;
    let phase = 0;

    let clientX = -99999;
    let clientY = -99999;

    const particles: P[] = [];
    const dust: Dust[] = [];

    // Precomputed "r,g,b" strings keyed by depth — avoids per-particle
    // array allocation (lerp3) and GC churn in the hot draw loop.
    const LUT_N = 64;
    const colLUT: string[] = [];
    for (let i = 0; i < LUT_N; i++) {
      const z = i / (LUT_N - 1);
      const c =
        z < 0.55
          ? lerp3(C_SHADOW, C_COPPER, z / 0.55)
          : lerp3(C_COPPER, z > 0.85 ? C_PALE : C_GOLD, (z - 0.55) / 0.45);
      colLUT[i] = `${c[0] | 0},${c[1] | 0},${c[2] | 0}`;
    }
    const colStr = (z: number) => colLUT[(z * (LUT_N - 1)) | 0];
    const dustLUT: string[] = [];
    for (let i = 0; i < LUT_N; i++) {
      const c = lerp3(C_GOLD, C_PALE, i / (LUT_N - 1));
      dustLUT[i] = `${c[0] | 0},${c[1] | 0},${c[2] | 0}`;
    }

    type Geom = { cx: number; amp: number; k: number; top: number; usable: number };
    const geom = (): Geom => ({
      cx: w * 0.5,
      amp: w * 0.253, // +15% width
      k: Math.PI * 2 * TURNS,
      top: h * 0.06,
      usable: h * 0.88,
    });

    const home = (p: P, ph: number, g: Geom) => {
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
            x: 0, y: 0, vx: 0, vy: 0,
            strand: s as 0 | 1,
            t: i / (BACKBONE_PER_STRAND - 1),
            isRung: false,
            frac: 0,
            ox: (seeded(idx * 5 + 1) - 0.5) * 5.5,
            oy: (seeded(idx * 5 + 2) - 0.5) * 5.5,
            r: 0.55 + seeded(idx * 5 + 3) * 1.0,
            jitter: seeded(idx * 5 + 4),
            z: 0,
          });
        }
      }
      for (let r = 0; r < RUNGS; r++) {
        for (let j = 0; j < PER_RUNG; j++) {
          idx++;
          particles.push({
            x: 0, y: 0, vx: 0, vy: 0,
            strand: 0,
            t: (r + 0.5) / RUNGS,
            isRung: true,
            frac: PER_RUNG > 1 ? j / (PER_RUNG - 1) : 0.5,
            ox: (seeded(idx * 5 + 1) - 0.5) * 4,
            oy: (seeded(idx * 5 + 2) - 0.5) * 2,
            r: 0.55 + seeded(idx * 5 + 3) * 1.0,
            jitter: seeded(idx * 5 + 4),
            z: 0,
          });
        }
      }

      const g = geom();
      for (const p of particles) {
        const pos = home(p, phase, g);
        p.x = pos.x;
        p.y = pos.y;
      }
    };

    const spawnDust = (d: Dust, g: Geom) => {
      d.x = g.cx + (Math.random() - 0.5) * g.amp * 0.7;
      d.y = g.top + Math.random() * g.usable * 0.05;
      d.vx = (Math.random() - 0.5) * 0.8;
      d.vy = -(0.45 + Math.random() * 1.3);
      d.max = 70 + Math.random() * 130;
      d.life = d.max;
      d.r = 0.4 + Math.random() * 1.0;
    };

    const buildDust = () => {
      dust.length = 0;
      const g = geom();
      for (let i = 0; i < DUST_COUNT; i++) {
        const d: Dust = { x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 1, r: 1 };
        spawnDust(d, g);
        // stagger initial life so the column is populated immediately
        d.life = Math.random() * d.max;
        d.y -= (d.max - d.life) * 0.6;
        dust.push(d);
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
      if (!reduceMotion) phase = time * 0.0004;
      const g = geom();

      const rect = canvas.getBoundingClientRect();
      const cmx = clientX - rect.left;
      const cmy = clientY - rect.top;
      const active = clientX > -9999;

      // ── Pass 1: helix physics ──
      for (const p of particles) {
        const hpos = home(p, phase, g);
        p.z = hpos.z;

        if (active && !reduceMotion) {
          const dx = p.x - cmx;
          const dy = p.y - cmy;
          const d2 = dx * dx + dy * dy;
          if (d2 < DISPERSE_R * DISPERSE_R) {
            const d = Math.sqrt(d2) || 0.001;
            const fall = 1 - d / DISPERSE_R;
            const f = fall * fall * PUSH;
            // Big rising burst: outward push + strong upward lift + spread,
            // so the hovered section evaporates into a dust cloud like the top.
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

      // ── Pass 2: paint helix particles, back half then front half ──
      // (Two-bucket depth ordering — cheaper than a full per-frame sort.)
      // Rails are the bright curving envelope; rung particles form the
      // ladder cross-bars — dense and bright so they read as lines across.
      const paintParticle = (p: P) => {
        const z = p.z;
        // Top of the rope fades as it gives way to the rising dust.
        const fade = smooth(0.0, 0.12, p.t);
        // Rungs are now as visible as the rails (same alpha/size curve).
        const alpha = (0.58 + z * 0.42) * fade;
        const rad = p.r * (0.7 + z * 0.95);
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colStr(z)},${alpha})`;
        ctx.fill();
      };
      for (const p of particles) if (p.z < 0.5) paintParticle(p);
      for (const p of particles) if (p.z >= 0.5) paintParticle(p);

      // ── Pass 3: rising dust cloud (top fray) ──
      if (!reduceMotion) {
        for (const d of dust) {
          d.x += d.vx;
          d.y += d.vy;
          d.vy *= 0.992;
          d.vx += (d.x - g.cx) * 0.0009; // gentle outward fan
          d.vx *= 0.997;
          d.life -= 1;
          if (d.life <= 0 || d.y < -12) spawnDust(d, g);

          const lf = d.life / d.max;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r * (0.6 + lf * 0.7), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${dustLUT[((1 - lf) * (LUT_N - 1)) | 0]},${lf * 0.6})`;
          ctx.fill();
        }
      }

      raf = pageVisible && inView && !reduceMotion ? requestAnimationFrame(draw) : 0;
    };

    resize();
    build();
    buildDust();
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
      buildDust();
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
