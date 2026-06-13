"use client";

import { useEffect, useRef } from "react";

const SAGE = "140,171,119";
const GLOW = "217,232,196";

type DNAHelixMotionProps = {
  reduceMotion?: boolean;
  className?: string;
};

/**
 * Slowly rotating double helix rendered as depth-modulated dots and rungs —
 * the strand appears to turn around its vertical axis. Sized by its parent.
 */
export default function DNAHelixMotion({
  reduceMotion = false,
  className = "",
}: DNAHelixMotionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let raf = 0;
    let inView = true;
    let pageVisible = true;

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

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const amp = w * 0.37;
      const k = (Math.PI * 2 * 2.1) / h;
      const phase = reduceMotion ? 0.6 : t * 0.00052;
      const step = 13;

      // Base pairs — strongest where the strands are widest apart.
      ctx.lineWidth = 1;
      for (let y = 10; y < h - 10; y += step * 2) {
        const a = y * k + phase;
        const spread = Math.abs(Math.sin(a));
        if (spread < 0.18) continue;
        const x1 = cx + Math.sin(a) * amp;
        const x2 = cx + Math.sin(a + Math.PI) * amp;
        ctx.strokeStyle = `rgba(${SAGE},${(0.07 + spread * 0.2).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
      }

      // Strands — dot size and brightness encode depth as the helix turns.
      for (const offset of [0, Math.PI]) {
        for (let y = 6; y < h - 6; y += step) {
          const a = y * k + phase + offset;
          const x = cx + Math.sin(a) * amp;
          const z = (Math.cos(a) + 1) / 2;
          const r = 1 + z * 1.9;
          const alpha = 0.12 + z * 0.5;
          ctx.fillStyle =
            z > 0.6
              ? `rgba(${GLOW},${alpha.toFixed(3)})`
              : `rgba(${SAGE},${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf =
        pageVisible && inView && !reduceMotion ? requestAnimationFrame(draw) : 0;
    };

    resize();
    if (reduceMotion) {
      draw(0);
    } else {
      raf = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw(0);
    });
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !raf && !reduceMotion && pageVisible) {
        raf = requestAnimationFrame(draw);
      }
    });
    io.observe(canvas);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible && inView && !raf && !reduceMotion) {
        raf = requestAnimationFrame(draw);
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
