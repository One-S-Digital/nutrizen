"use client";

import { motion } from "framer-motion";
import React, { ReactNode } from "react";

export default function AuroraBackground({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <div className={`relative w-full min-h-screen overflow-hidden bg-background-main transition-colors duration-1000 ${className}`}>
      {/* Container for the glowing/blurring gradient orbs */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.35] z-0 flex items-center justify-center blur-[120px] mix-blend-color-burn">
         <motion.div 
           animate={{
             scale: [1, 1.2, 1],
             rotate: [0, 90, 0],
             x: ["-20%", "20%", "-20%"],
             y: ["-20%", "10%", "-20%"]
           }}
           transition={{ duration: 15, ease: "easeInOut", repeat: Infinity }}
           className="absolute w-[60vw] h-[60vh] rounded-[100%] bg-primary/70" 
         />
         <motion.div 
           animate={{
             scale: [1, 1.4, 1],
             rotate: [0, -90, 0],
             x: ["20%", "-20%", "20%"],
             y: ["20%", "-10%", "20%"]
           }}
           transition={{ duration: 20, ease: "easeInOut", repeat: Infinity, delay: 2 }}
           className="absolute w-[50vw] h-[50vh] rounded-[100%] bg-secondary/80" 
         />
         <motion.div 
           animate={{
             scale: [1, 1.3, 1],
             rotate: [0, 180, 0],
             x: ["0%", "30%", "0%"],
             y: ["-30%", "20%", "-30%"]
           }}
           transition={{ duration: 18, ease: "easeInOut", repeat: Infinity, delay: 5 }}
           className="absolute w-[70vw] h-[40vh] rounded-[100%] bg-primary/50" 
         />
      </div>
      
      {/* Soft gradient mask overlay over the aurora to blend edges into background-main */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background-main z-0" />
      
      {/* Front Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
