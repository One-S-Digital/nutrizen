/**
 * Quiet Lab background textures. Decoration must carry information:
 * contour lines read as botanical topography / lab chart paper,
 * the dot lattice as a measurement grid. Color via currentColor.
 */

export function ContourField({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden
    >
      <defs>
        <pattern id="dot-lattice" width="56" height="56" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.35" />
        </pattern>
      </defs>
      <rect width="1200" height="800" fill="url(#dot-lattice)" opacity="0.5" />
      <g stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
        <path
          d="M260 690 C90 640 30 480 90 350 C150 220 330 150 480 190 C630 230 690 360 640 480 C590 600 430 740 260 690 Z"
          opacity="0.5"
        />
        <path
          d="M270 630 C140 590 90 470 135 370 C180 270 330 210 450 240 C570 270 620 380 580 470 C540 560 400 670 270 630 Z"
          opacity="0.42"
        />
        <path
          d="M285 570 C190 540 150 455 180 385 C215 305 330 265 420 290 C510 315 550 400 520 465 C485 540 380 600 285 570 Z"
          opacity="0.34"
        />
        <path
          d="M300 510 C240 490 210 440 230 395 C255 340 330 315 390 335 C450 355 475 415 455 460 C430 510 360 530 300 510 Z"
          opacity="0.26"
        />
        <path
          d="M960 260 C840 230 790 130 850 50 C910 -30 1080 -40 1170 30 C1260 100 1250 220 1170 270 C1100 315 1050 285 960 260 Z"
          opacity="0.45"
        />
        <path
          d="M965 205 C880 185 845 115 890 55 C935 -5 1060 -15 1125 35 C1190 85 1185 175 1125 215 C1075 245 1030 220 965 205 Z"
          opacity="0.35"
        />
        <path
          d="M975 150 C920 135 900 90 930 50 C960 10 1040 5 1080 40 C1120 75 1115 135 1075 160 C1045 178 1015 162 975 150 Z"
          opacity="0.25"
        />
        <path
          d="M1010 740 C920 720 880 650 915 590 C950 530 1060 510 1130 555 C1200 600 1200 690 1140 725 C1095 752 1075 755 1010 740 Z"
          opacity="0.4"
        />
        <path
          d="M1020 690 C965 678 940 635 962 597 C985 558 1055 545 1100 575 C1145 605 1145 660 1105 683 C1075 700 1060 700 1020 690 Z"
          opacity="0.28"
        />
      </g>
    </svg>
  );
}

function leafPath(len: number) {
  return `M0 0 Q ${len * 0.3} ${-len * 0.16} ${len} 0 Q ${len * 0.3} ${len * 0.16} 0 0 Z`;
}

const FROND_LEAVES = Array.from({ length: 11 }, (_, i) => {
  const t = 0.08 + (i / 10) * 0.84;
  return {
    x: 210 + Math.sin(t * 2.4) * 12,
    y: 640 - t * 590,
    len: 130 * (1 - t * 0.72),
    leftAng: -130 + t * 24,
    rightAng: -50 - t * 24,
  };
});

/** Fern-like frond silhouette for herbal depth layers. */
export function BotanicalFrond({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 420 660" fill="none" aria-hidden>
      <path
        d="M210 650 C196 480 226 300 206 30"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {FROND_LEAVES.map((leaf, i) => (
        <g key={i} transform={`translate(${leaf.x} ${leaf.y})`} fill="currentColor">
          <path d={leafPath(leaf.len)} transform={`rotate(${leaf.leftAng})`} opacity="0.92" />
          <path d={leafPath(leaf.len)} transform={`rotate(${leaf.rightAng})`} opacity="0.92" />
        </g>
      ))}
    </svg>
  );
}

const SPRIG_LEAVES = Array.from({ length: 9 }, (_, i) => {
  const t = 0.1 + (i / 8) * 0.82;
  const side = i % 2 === 0 ? 1 : -1;
  return {
    x: 180 + Math.sin(t * 3.1) * 26 + side * (30 - t * 14),
    y: 560 - t * 510,
    r: 36 - t * 21,
    tilt: side * (18 - t * 10),
  };
});

/** Eucalyptus-like sprig silhouette — round coin leaves on a curving stem. */
export function BotanicalSprig({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 360 580" fill="none" aria-hidden>
      <path
        d="M180 575 C150 430 212 270 168 30"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {SPRIG_LEAVES.map((leaf, i) => (
        <ellipse
          key={i}
          cx={leaf.x}
          cy={leaf.y}
          rx={leaf.r}
          ry={leaf.r * 0.84}
          transform={`rotate(${leaf.tilt} ${leaf.x} ${leaf.y})`}
          fill="currentColor"
          opacity="0.92"
        />
      ))}
    </svg>
  );
}

const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")";

export function GrainOverlay({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 mix-blend-soft-light ${className}`}
      style={{ backgroundImage: GRAIN_URI, backgroundRepeat: "repeat" }}
      aria-hidden
    />
  );
}
