import React from 'react';
import { Lightbulb, Cog, Puzzle, Unlock, ArrowRight, Compass, Map } from 'lucide-react';

interface LandingPageProps {
  onStartClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartClick
}) => {
  return (
    <div className="relative min-h-[calc(100vh-60px)] flex flex-col justify-center items-center px-4 sm:px-6 py-12 overflow-hidden bg-[#1a2314]">
      {/* Decorative Adventure Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#68734A] blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#C8AE68] blur-3xl" />
      </div>

      {/* Subtle Botanical / Compass Vector Accents */}
      <div className="absolute -top-12 -left-12 opacity-15 pointer-events-none text-[#C8AE68]">
        <svg viewBox="0 0 200 200" className="w-80 h-80">
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" />
          <polygon points="100,20 106,94 180,100 106,106 100,180 94,106 20,100 94,94" fill="currentColor" opacity="0.4" />
        </svg>
      </div>

      <div className="absolute -bottom-16 -right-16 opacity-10 pointer-events-none text-[#869661]">
        <svg viewBox="0 0 240 240" className="w-96 h-96">
          <path d="M120 20 C140 60 180 100 220 120 C180 140 140 180 120 220 C100 180 60 140 20 120 C60 100 100 60 120 20 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Main Hero Card Container */}
      <div className="relative z-10 max-w-4xl w-full mx-auto text-center flex flex-col items-center">
        {/* Isometric Cube Logo */}
        <div className="relative mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#384325] to-[#202917] border-2 border-[#C8AE68]/60 flex items-center justify-center text-[#C8AE68] shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <svg viewBox="0 0 48 48" className="w-12 h-12 fill-none stroke-current stroke-2">
              <path d="M24 4 L40 13 L40 35 L24 44 L8 35 L8 13 Z" />
              <path d="M24 4 L24 44" />
              <path d="M24 24 L40 13" />
              <path d="M24 24 L8 13" />
              <circle cx="24" cy="24" r="3" fill="#C8AE68" />
            </svg>
          </div>
          {/* Subtle warm glow around logo */}
          <div className="absolute inset-0 rounded-2xl bg-[#C8AE68]/20 blur-xl -z-10" />
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-wider text-[#F8F6EF] font-['Cinzel',serif] uppercase mb-4 drop-shadow-md">
          BYTE HUNT
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-2xl font-semibold text-[#E3D9C3] tracking-wide mb-3">
          Crack the Clues. Collect the Letters. Unlock the Word.
        </p>

        {/* Narrative Description */}
        <p className="text-sm sm:text-base text-[#B5AE9E] max-w-2xl mx-auto mb-10 leading-relaxed">
          Put your technical knowledge to the test. Solve mysterious clues, collect hidden letters,
          and discover the secret word before time runs out.
        </p>

        {/* 4 Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-2xl mb-10">
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#24301B]/80 border border-[#404F2E] backdrop-blur-sm shadow-md hover:border-[#C8AE68]/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#344226] flex items-center justify-center text-[#C8AE68] mb-2">
              <Lightbulb className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#EDE5D5]">Solve Clues</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#24301B]/80 border border-[#404F2E] backdrop-blur-sm shadow-md hover:border-[#C8AE68]/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#344226] flex items-center justify-center text-[#C8AE68] mb-2">
              <Cog className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#EDE5D5]">Think Logically</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#24301B]/80 border border-[#404F2E] backdrop-blur-sm shadow-md hover:border-[#C8AE68]/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#344226] flex items-center justify-center text-[#C8AE68] mb-2">
              <Puzzle className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#EDE5D5]">Collect Letters</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#24301B]/80 border border-[#404F2E] backdrop-blur-sm shadow-md hover:border-[#C8AE68]/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#344226] flex items-center justify-center text-[#C8AE68] mb-2">
              <Unlock className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#EDE5D5]">Unlock the Word</span>
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="flex justify-center">
          <button
            onClick={onStartClick}
            className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 text-base sm:text-lg font-bold text-[#F8F6EF] bg-gradient-to-r from-[#4E5C35] to-[#3B4628] hover:from-[#5C6D3F] hover:to-[#455230] border-2 border-[#C8AE68]/60 hover:border-[#C8AE68] rounded-xl shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>Start Hunt</span>
            <ArrowRight className="w-5 h-5 text-[#C8AE68] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Decorative Bottom Treasure Map Strip */}
      <div className="w-full max-w-4xl mt-12 pt-6 border-t border-[#344324]/50 flex items-center justify-between text-xs text-[#879471]">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#C8AE68]" />
          <span>13 Technical Secret Challenges</span>
        </div>
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-[#C8AE68]" />
          <span>Server Timed & Verified</span>
        </div>
      </div>
    </div>
  );
};
