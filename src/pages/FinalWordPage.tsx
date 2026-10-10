import React, { useState, useEffect } from 'react';
import { KeyRound, ArrowRight, AlertCircle, Sparkles, Trophy } from 'lucide-react';
import { apiRequest } from '../utils/apiClient';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface FinalWordPageProps {
  sessionId: string;
  onSuccess: () => void;
}

export const FinalWordPage: React.FC<FinalWordPageProps> = ({ sessionId, onSuccess }) => {
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [finalWordInput, setFinalWordInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await apiRequest(`/game/session/${sessionId}`);
        if (res.success) {
          setCollectedLetters(res.collectedLetters || []);
        }
      } catch (err: any) {
        console.error('Failed to load letters:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  const handleSubmitFinalWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalWordInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await apiRequest('/game/final-answer', {
        method: 'POST',
        body: JSON.stringify({
          sessionId,
          finalWord: finalWordInput.trim()
        })
      });

      if (!res.success) {
        throw new Error(res.error || 'Submission failed');
      }

      if (res.correct) {
        // VICTORY!
        sounds.playVictory();
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
        setTimeout(() => {
          onSuccess();
        }, 800);
      } else {
        sounds.playIncorrect();
        setErrorMessage(res.message || 'That is not the correct secret word. Rearrange your collected letters and try again!');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error validating final word');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTileClick = (letter: string) => {
    setFinalWordInput(prev => prev + letter);
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-60px)] flex items-center justify-center bg-[#182012] text-[#EDE5D5]">
        <div className="w-10 h-10 border-2 border-[#C8AE68] border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-60px)] py-10 px-4 bg-[#182012] flex justify-center items-center">
      <div className="w-full max-w-2xl bg-[#F8F6EF] rounded-2xl border-2 border-[#DFD6C2] shadow-2xl p-6 sm:p-10 text-[#252B22]">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-[#384325] to-[#202917] border-2 border-[#C8AE68] items-center justify-center text-[#C8AE68] shadow-lg mb-3">
            <KeyRound className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wider font-['Cinzel',serif] text-[#1E2716] uppercase">
            ALL CLUES COMPLETED!
          </h2>
          <p className="text-sm font-semibold text-[#5D6B42] mt-1">
            Now arrange your collected letters to unlock the secret word.
          </p>
        </div>

        {/* Collected Letters Display */}
        <div className="mb-8 p-5 bg-[#EDE5D5] rounded-2xl border border-[#DFD6C2] text-center shadow-inner">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B735F] block mb-3 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
            <span>Your Collected Letters</span>
          </span>

          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {collectedLetters.map((letter, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => handleTileClick(letter)}
                title="Click to append to input"
                className="w-11 h-13 sm:w-13 sm:h-16 rounded-xl bg-gradient-to-b from-[#C8AE68] to-[#A4883F] text-[#1E2716] border-2 border-[#EAD598] font-mono font-extrabold text-xl sm:text-2xl flex items-center justify-center shadow-md transform hover:-translate-y-1 active:translate-y-0 transition-all cursor-pointer"
              >
                {letter}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#78836A] mt-3">
            Click letters or type below to arrange them into the final technical word.
          </p>
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs sm:text-sm font-medium flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submission Form */}
        <form onSubmit={handleSubmitFinalWord} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3D472D] mb-2">
              Enter The Hidden Technical Word
            </label>
            <div className="relative">
              <input
                type="text"
                value={finalWordInput}
                onChange={(e) => setFinalWordInput(e.target.value.toUpperCase())}
                placeholder="e.g. SOFTWARE"
                disabled={isSubmitting}
                className="w-full px-4 py-3.5 bg-white border-2 border-[#CDC3AD] rounded-xl text-lg sm:text-xl font-mono font-bold tracking-widest text-[#1E2716] uppercase text-center placeholder-[#A49D8B] focus:outline-none focus:ring-2 focus:ring-[#5C6D3F] transition-all shadow-inner"
                autoFocus
              />
              {finalWordInput && (
                <button
                  type="button"
                  onClick={() => setFinalWordInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#86966F] hover:text-[#252B22] px-2 py-1 bg-[#F5EEDD] rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !finalWordInput.trim()}
            className="w-full py-4 px-6 font-bold text-base sm:text-lg text-[#F8F6EF] bg-[#3E4A2A] hover:bg-[#4E5C35] active:bg-[#323C22] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Validating Secret Word...</span>
            ) : (
              <>
                <span>Unlock The Word</span>
                <ArrowRight className="w-5 h-5 text-[#C8AE68] group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
