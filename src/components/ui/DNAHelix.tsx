"use client";

import React from "react";

export default function DNAHelix({ className = "" }: { className?: string }) {
  const nodeCount = 30; // Number of base pairs
  const duration = 6; // seconds for full rotation

  return (
    <div className={`relative flex flex-col justify-between items-center overflow-visible ${className}`} style={{ perspective: "1000px" }}>
      <style>{`
        @keyframes dnaSpin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        .dna-row {
          transform-style: preserve-3d;
          animation: dnaSpin ${duration}s linear infinite;
        }
        .dna-dot {
          backface-visibility: visible;
        }
      `}</style>

      {Array.from({ length: nodeCount }).map((_, i) => {
        // Calculate delay to create the helical twist
        // Negative delay ensures all elements are animating immediately
        const delay = -(i * (duration / 15)); 
        
        // Slightly vary the width or opacity to create depth (optional if native 3D works well)
        
        return (
          <div 
            key={i} 
            className="dna-row relative flex justify-between items-center w-32 md:w-48 my-2 md:my-3"
            style={{ animationDelay: `${delay}s` }}
          >
            {/* Left Dot (Strand 1) - Soft Blue Glowing */}
            <div 
              className="dna-dot w-3 h-3 md:w-4 md:h-4 rounded-full bg-secondary shadow-[0_0_20px_4px_rgba(105,149,177,0.7)]"
              style={{ transform: 'translateZ(20px)' }}
            />
            
            {/* Connecting Bridge (Base Pair) */}
            <div 
              className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-secondary/50 to-primary/50"
              style={{ transform: 'translateY(-50%)' }}
            />
            
            {/* Right Dot (Strand 2) - Sage Green Glowing */}
            <div 
              className="dna-dot w-3 h-3 md:w-4 md:h-4 rounded-full bg-primary shadow-[0_0_20px_4px_rgba(140,171,119,0.7)]"
              style={{ transform: 'translateZ(-20px)' }}
            />
          </div>
        );
      })}
    </div>
  );
}
