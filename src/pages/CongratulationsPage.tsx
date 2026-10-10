import React, { useEffect, useState } from 'react';
import { Trophy, Clock, CheckCircle, Home, RotateCcw, Award } from 'lucide-react';
import { apiRequest } from '../utils/apiClient';
import confetti from 'canvas-confetti';

interface CongratulationsPageProps {
  sessionId: string;
  onReturnHome: () => void;
  onPlayAgain: () => void;
}

export const CongratulationsPage: React.FC<CongratulationsPageProps> = ({
  sessionId,
  onReturnHome,
  onPlayAgain
}) => {
  const [resultData, setResultData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 400);
    } catch {
      // ignore
    }

    const fetchResult = async () => {
      try {
        const res = await apiRequest(`/game/session/${sessionId}`);
        if (res.success) {
          setResultData(res);
        }
      } catch (err) {
        console.error('Failed to load result:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResult();
  }, [sessionId]);

  const formatTime = (ms?: number) => {
    if (!ms) return '00:00:00';
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSec % 60).toString().padStart(2, '0');
    return `${hours}:${mins}:${secs}`;
  };

  return (
    <div className="min-h-[calc(100vh-60px)] py-10 px-4 bg-[#182012] flex justify-center items-center">
      <div className="w-full max-w-xl bg-[#F8F6EF] rounded-2xl border-2 border-[#DFD6C2] shadow-2xl p-6 sm:p-10 text-[#252B22] text-center relative overflow-hidden">
        
        {/* Subtle decorative leaf graphics in corners */}
        <div className="absolute top-0 left-0 w-24 h-24 opacity-10 pointer-events-none text-[#5D6B42]">
          <svg viewBox="0 0 100 100">
            <path d="M0 0 C50 0 100 50 100 100 C50 100 0 50 0 0 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 opacity-10 pointer-events-none text-[#5D6B42] rotate-90">
          <svg viewBox="0 0 100 100">
            <path d="M0 0 C50 0 100 50 100 100 C50 100 0 50 0 0 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Trophy with Laurel Wreath Illustration */}
        <div className="relative inline-flex items-center justify-center my-2">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-[#FEF3C7] to-[#FDE68A] border-4 border-[#C8AE68] flex items-center justify-center shadow-xl">
            <Trophy className="w-12 h-12 sm:w-14 sm:h-14 text-[#92400E] drop-shadow-md" />
          </div>
          <div className="absolute -inset-2 rounded-full border border-[#C8AE68]/30 animate-ping opacity-25" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wider font-['Cinzel',serif] text-[#1E2716] uppercase mt-4 mb-2">
          Congratulations!
        </h1>
        <p className="text-sm sm:text-base font-semibold text-[#5D6B42] mb-5">
          You have successfully completed BYTE HUNT
        </p>

        {/* Revealed Secret Word Banner */}
        {resultData?.targetWord && (
          <div className="mb-8 p-4 bg-[#EDE5D5] rounded-xl border border-[#DFD6C2] inline-block w-full max-w-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A6B48] block mb-1">
              Secret Word Unlocked
            </span>
            <span className="font-mono font-extrabold text-2xl sm:text-3xl tracking-widest text-[#1E2716] text-[#B45309]">
              {resultData.targetWord}
            </span>
          </div>
        )}

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
          {/* Score */}
          <div className="p-3 sm:p-4 bg-white rounded-xl border border-[#E3DAC7] shadow-xs flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#B45309] flex items-center justify-center mb-1">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold uppercase text-[#737C66]">Score</span>
            <span className="font-mono font-extrabold text-base sm:text-xl text-[#1E2716] mt-0.5">
              {resultData?.score || 0}
            </span>
          </div>

          {/* Time Taken */}
          <div className="p-3 sm:p-4 bg-white rounded-xl border border-[#E3DAC7] shadow-xs flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#E0E7FF] text-[#3730A3] flex items-center justify-center mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold uppercase text-[#737C66]">Time Taken</span>
            <span className="font-mono font-extrabold text-xs sm:text-sm text-[#1E2716] mt-1 tabular-nums">
              {formatTime(resultData?.durationMs)}
            </span>
          </div>

          {/* Clues Completed */}
          <div className="p-3 sm:p-4 bg-white rounded-xl border border-[#E3DAC7] shadow-xs flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#DCFCE7] text-[#166534] flex items-center justify-center mb-1">
              <CheckCircle className="w-4 h-4" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold uppercase text-[#737C66]">Clues Solved</span>
            <span className="font-mono font-extrabold text-base sm:text-xl text-[#1E2716] mt-0.5">
              {resultData?.targetLength || 8} / {resultData?.targetLength || 8}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onReturnHome}
            className="w-full sm:w-auto px-6 py-3.5 font-bold text-sm text-[#F8F6EF] bg-[#3E4A2A] hover:bg-[#4E5C35] rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#C8AE68]" />
            <span>Return to Home</span>
          </button>

          <button
            onClick={onPlayAgain}
            className="w-full sm:w-auto px-6 py-3.5 font-bold text-sm text-[#3E4A2A] bg-[#EDE5D5] hover:bg-[#E5DCB8] border border-[#CDC3AD] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#68734A]" />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
