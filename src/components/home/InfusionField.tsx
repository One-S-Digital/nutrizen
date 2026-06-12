"use client";

import { useEffect, useRef } from "react";

type InfusionFieldProps = {
  /** Section-relative cursor position in px (spring-lagged upstream). */
  getCursor: () => { x: number; y: number };
  reduceMotion?: boolean;
  className?: string;
};

const SAGE = "140,171,119";
const GLOW = "217,232,196";

const LINK_DIST = 116;
const STIR_DIST = 190;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  bvx: number;
  bvy: number;
  r: number;
  tw: number;
  glow: boolean;
};

type Burst = { x: number; y: number; vx: number; vy: number; life: number };
type TrailBlob = { x: number; y: number; r: number; a: number };

/** Deterministic pseudo-random so server/client agree and frames are stable. */
function seeded(channel: number, i: number) {
  const s = Math.sin(i * 127.1 + channel * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/**
 * The hero's living background: botanical specks drift upward like an
 * infusion steeping, link into a molecular web, and condense in a slow
 * swirl around the cursor, which leaves a luminous diffusion trail.
 */
export default function InfusionField({
  getCursor,
  reduceMotion = false,
  className = "",
}: InfusionFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef(getCursor);

  useEffect(() => {
    cursorRef.current = getCursor;
  }, [getCursor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let raf = 0;
    let pageVisible = true;
    let inView = true;
    let particles: Particle[] = [];
    const bursts: Burst[] = [];
    const blobs: TrailBlob[] = [];
    let prevCursor = { x: -9999, y: -9999 };
    let lastBlobAt = { x: -9999, y: -9999 };

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
      const count = Math.round(Math.min(Math.max((w * h) / 15000, 60), 130));
      particles = Array.from({ length: count }, (_, i) => {
        const bvx = (seeded(1, i) - 0.5) * 0.18;
        const bvy = -0.07 - seeded(2, i) * 0.22;
        return {
          x: seeded(3, i) * w,
          y: seeded(4, i) * h,
          vx: bvx,
          vy: bvy,
          bvx,
          bvy,
          r: 0.7 + seeded(5, i) * 1.25,
          tw: seeded(6, i) * Math.PI * 2,
          glow: seeded(7, i) > 0.72,
        };
      });
    };

    const drawLinks = (cx: number, cy: number) => {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          if (Math.abs(dx) > LINK_DIST || Math.abs(dy) > LINK_DIST) continue;
          const d = Math.hypot(dx, dy);
          if (d > LINK_DIST) continue;
          const mx = (p.x + q.x) / 2;
          const my = (p.y + q.y) / 2;
          const dc = Math.hypot(mx - cx, my - cy);
          const nearCursor = Math.max(0, 1 - dc / (STIR_DIST * 1.35));
          const alpha = (1 - d / LINK_DIST) * (0.1 + nearCursor * 0.42);
          ctx.strokeStyle = `rgba(${nearCursor > 0.25 ? GLOW : SAGE},${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    };

    const drawParticles = (t: number, cx: number, cy: number) => {
      for (const p of particles) {
        const twinkle = 0.55 + 0.45 * Math.sin(t * 0.0011 + p.tw);
        const dc = Math.hypot(p.x - cx, p.y - cy);
        const lift = Math.max(0, 1 - dc / STIR_DIST);
        const alpha = (p.glow ? 0.5 : 0.32) * twinkle + lift * 0.45;
        ctx.fillStyle = `rgba(${p.glow ? GLOW : SAGE},${Math.min(alpha, 0.95).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + lift * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      drawLinks(-9999, -9999);
      drawParticles(0, -9999, -9999);
    };

    const step = (t: number) => {
      const { x: cx, y: cy } = cursorRef.current();

      // Diffusion trail — light steeping into the field behind the cursor.
      if (Math.hypot(cx - lastBlobAt.x, cy - lastBlobAt.y) > 14) {
        blobs.push({ x: cx, y: cy, r: 30, a: 0.075 });
        lastBlobAt = { x: cx, y: cy };
        if (blobs.length > 70) blobs.shift();
      }

      // Fast stirs kick up glowing specks.
      const speed = Math.hypot(cx - prevCursor.x, cy - prevCursor.y);
      if (speed > 13 && bursts.length < 36) {
        for (let k = 0; k < 2; k++) {
          const a = Math.random() * Math.PI * 2;
          const v = 0.8 + Math.random() * 1.4;
          bursts.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.3, life: 1 });
        }
      }
      prevCursor = { x: cx, y: cy };

      for (const p of particles) {
        const dx = cx - p.x;
        const dy = cy - p.y;
        const d = Math.hypot(dx, dy);
        if (d < STIR_DIST && d > 0.001) {
          // Gentle pull plus tangential swirl — the field stirs around the cursor.
          const f = (1 - d / STIR_DIST) * 0.028;
          p.vx += (dx / d) * f + (-dy / d) * f * 0.6;
          p.vy += (dy / d) * f + (dx / d) * f * 0.6;
        } else {
          p.vx += (p.bvx - p.vx) * 0.012;
          p.vy += (p.bvy - p.vy) * 0.012;
        }
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 0.85) {
          p.vx = (p.vx / sp) * 0.85;
          p.vy = (p.vy / sp) * 0.85;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -8) p.x = w + 8;
        if (p.x > w + 8) p.x = -8;
        if (p.y < -8) p.y = h + 8;
        if (p.y > h + 8) p.y = -8;
      }

      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = blobs.length - 1; i >= 0; i--) {
        const b = blobs[i];
        b.r += 1.1;
        b.a *= 0.952;
        if (b.a < 0.004) {
          blobs.splice(i, 1);
          continue;
        }
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, `rgba(${GLOW},${b.a.toFixed(4)})`);
        g.addColorStop(1, `rgba(${GLOW},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      ctx.lineWidth = 1;
      drawLinks(cx, cy);
      drawParticles(t, cx, cy);

      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.life -= 0.02;
        if (b.life <= 0) {
          bursts.splice(i, 1);
          continue;
        }
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.985;
        b.vy *= 0.985;
        ctx.fillStyle = `rgba(${GLOW},${(b.life * 0.55).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 1.1 + b.life, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = pageVisible && inView ? requestAnimationFrame(step) : 0;
    };

    resize();

    if (reduceMotion) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(step);
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) drawStatic();
    });
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !raf && !reduceMotion && pageVisible) {
        raf = requestAnimationFrame(step);
      }
    });
    io.observe(canvas);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible && inView && !raf && !reduceMotion) {
        raf = requestAnimationFrame(step);
      }
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
