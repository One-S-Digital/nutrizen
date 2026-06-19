"use client";

import { motion } from "framer-motion";

/* A premium glass capsule for the centre of the formula orbit. */
export default function CenterCapsule({ reduceMotion = false }: { reduceMotion?: boolean }) {
  return (
    <div className="relative flex items-center justify-center" aria-hidden>
      {/* warm glow halo */}
      <div className="pointer-events-none absolute h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(231,164,108,0.40),rgba(140,171,119,0.16)_46%,transparent_72%)] blur-md" />
      {/* grounding shadow */}
      <div className="pointer-events-none absolute bottom-[-14px] h-3 w-16 rounded-[50%] bg-black/20 blur-md" />
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
        transition={reduceMotion ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div className="relative h-[90px] w-[40px] -rotate-[18deg] overflow-hidden rounded-full shadow-[0_16px_30px_-8px_rgba(47,58,51,0.5),inset_0_-3px_9px_rgba(0,0,0,0.14)]">
          {/* amber top half */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#EBBB87] to-[#D89455]" />
          {/* cream bottom half */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-[#F7F3E7] to-[#E3DBC6]" />
          {/* seam */}
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/10" />
          {/* specular highlight */}
          <div className="absolute left-[7px] top-3 h-[62%] w-[7px] rounded-full bg-white/60 blur-[1.5px]" />
          {/* rim light */}
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/35" />
        </div>
      </motion.div>
    </div>
  );
}
