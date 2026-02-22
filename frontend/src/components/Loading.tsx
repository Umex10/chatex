import Image from 'next/image';
import React from 'react';

/**
 * Full-screen loading animation component.
 * Displays the Chatex logo alongside an orbital spinner animation
 * while the application bootstraps (e.g. fetching the auth session).
 */
export default function Loading() {
  return (
    <>
      <style>{`
        @keyframes slowRotate {
          100% { transform: rotate(360deg); }
        }
        @keyframes customPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.6; }
        }
        
        /* Die Keyframes wurden angepasst, um vom echten Zentrum aus zu rotieren. 
           Verschiedene Startwinkel (0deg, 90deg...) sorgen dafür, dass die Punkte verteilt sind. */
        @keyframes orbit1 {
          from { transform: translate(-50%, -50%) rotate(0deg) translateX(50px); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateX(50px); }
        }
        @keyframes orbit2 {
          from { transform: translate(-50%, -50%) rotate(90deg) translateX(40px); }
          to { transform: translate(-50%, -50%) rotate(450deg) translateX(40px); }
        }
        @keyframes orbit3 {
          from { transform: translate(-50%, -50%) rotate(180deg) translateX(30px); }
          to { transform: translate(-50%, -50%) rotate(540deg) translateX(30px); }
        }
        @keyframes orbit4 {
          from { transform: translate(-50%, -50%) rotate(270deg) translateX(40px); }
          to { transform: translate(-50%, -50%) rotate(630deg) translateX(40px); }
        }
        
        @keyframes coreGlow {
          0% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.3); }
          100% { box-shadow: 0 0 30px rgba(255, 255, 255, 0.8), inset 0 0 15px rgba(255, 255, 255, 0.6); }
        }
      `}</style>

      <div className="min-h-screen bg-[#120b1a] flex flex-col items-center justify-center gap-8">
        
        {/* Logo */}
        <div className="flex flex-col items-center">
          <Image
            src="/chatex4.png" 
            width={200}
            height={200}
            alt="Chatex Logo" 
            className="w-32 md:w-[200px] h-auto object-contain mb-2 transition-all duration-300" 
            style={{ color: 'white', fontStyle: 'italic' }} 
            loading='eager'
          />
        </div>

        {/* Spinner Container */}
        <div className="relative w-[120px] h-[120px] animate-[slowRotate_10s_linear_infinite]">
          
          {/* Ringe (Orbits) */}
          <div className="absolute top-1/2 left-1/2 w-[100px] h-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/10 animate-[customPulse_2s_ease-in-out_infinite]"></div>
          <div className="absolute top-1/2 left-1/2 w-[80px] h-[80px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/10 animate-[customPulse_2s_ease-in-out_infinite] [animation-delay:0.3s]"></div>
          <div className="absolute top-1/2 left-1/2 w-[60px] h-[60px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/10 animate-[customPulse_2s_ease-in-out_infinite] [animation-delay:0.6s]"></div>

          {/* Partikel - Alle starten jetzt exakt bei top-1/2 und left-1/2 */}
          <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-full bg-pink-400 shadow-[0_0_20px_currentColor] text-pink-400 animate-[orbit1_3s_linear_infinite]"></div>
          <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-full bg-sky-300 shadow-[0_0_20px_currentColor] text-sky-300 animate-[orbit2_2.5s_linear_infinite]"></div>
          <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-full bg-green-300 shadow-[0_0_20px_currentColor] text-green-300 animate-[orbit3_3.5s_linear_infinite]"></div>
          <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_20px_currentColor] text-orange-400 animate-[orbit4_2.8s_linear_infinite]"></div>

          {/* Kern (Core) */}
          <div className="absolute top-1/2 left-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 bg-[#f5deb3] rounded-full animate-[coreGlow_2s_ease-in-out_infinite_alternate]"></div>
        
        </div>

        {/* Loading Text */}
        <p className="text-white/60 text-sm tracking-[0.3em] uppercase animate-pulse font-medium">
          Loading...
        </p>

      </div>
    </>
  );
}