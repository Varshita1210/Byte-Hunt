import React, { useState, useEffect } from 'react';
import { Lightbulb, Send, HelpCircle, CheckCircle2, AlertCircle, ArrowRight, Sparkles, KeyRound } from 'lucide-react';
import { apiRequest } from '../utils/apiClient';
import { PuzzleVisual } from '../components/PuzzleVisual';
import { sounds } from '../utils/audio';

interface ActiveClue {
  clueId: string;
  clueIndex: number;
  totalClues: number;
  type: string;
  typeDisplay: string;
  question: string;
  visualAssetKey?: string;
  hint?: string;
  scrambledLetters?: string;
  missingLetterPattern?: string;
}

interface ActiveHuntPageProps {
  sessionId: string;
  sessionToken: string;
  onAllCluesSolved: () => void;
  onExit: () => void;
}

export const ActiveHuntPage: React.FC<ActiveHuntPageProps> = ({
  sessionId,
  sessionToken,
  onAllCluesSolved,
  onExit
}) => {
  const [currentClue, setCurrentClue] = useState<ActiveClue | null>(null);
  const [targetLength, setTargetLength] = useState<number>(8);
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [answerInput, setAnswerInput] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [shakeInput, setShakeInput] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch initial game state from server
  const loadSession = async () => {
    try {
      setIsLoading(true);
      const res = await apiRequest(`/game/session/${sessionId}`);
      if (res.success) {
        if (res.status === 'completed' || res.isAllCluesSolved) {
          onAllCluesSolved();
          return;
        }
        setTargetLength(res.targetLength);
        setCollectedLetters(res.collectedLetters || []);
        setScore(res.score || 0);
        setCurrentClue(res.currentClue);
      }
    } catch (err: any) {
      console.error('Failed to load session:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Error connecting to hunt session' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await apiRequest('/game/answer', {
        method: 'POST',
        body: JSON.stringify({
          sessionId,
          answer: answerInput.trim()
        })
      });

      if (!res.success) {
        throw new Error(res.error || 'Server error occurred');
      }

      if (res.correct) {
        sounds.playCorrect();
        setCollectedLetters(res.collectedLetters);
        setScore(res.score);
        setAnswerInput('');
        setShowHint(false);
        setStatusMessage({
          type: 'success',
          text: res.message || "Correct! Letter collected."
        });

        if (res.isAllCluesSolved) {
          // Brief pause to show celebration before transitioning
          setTimeout(() => {
            onAllCluesSolved();
          }, 1200);
        } else if (res.nextClue) {
          // Auto advance to next clue after brief feedback
          setTimeout(() => {
            setCurrentClue(res.nextClue);
            setStatusMessage(null);
          }, 1100);
        }
      } else {
        sounds.playIncorrect();
        setShakeInput(true);
        setTimeout(() => setShakeInput(false), 500);
        setStatusMessage({
          type: 'error',
          text: res.message || "Not quite! Think again and try another answer."
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Submission failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-6 bg-[#1a2314] text-[#EDE5D5]">
        <div className="w-12 h-12 rounded-xl border-2 border-[#C8AE68] border-t-transparent animate-spin mb-4" />
        <p className="font-semibold text-sm">Retrieving Secret Challenge from Server...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-60px)] py-6 sm:py-10 px-4 bg-[#182012] flex justify-center items-start">
      <div className="w-full max-w-3xl space-y-6">
        
        {/* Secret Word Progress Banner */}
        <div className="bg-[#242F1B] rounded-2xl border border-[#404F2E] p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C8AE68] mb-1">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Your Secret Word</span>
            </div>
            {/* Visual word blanks */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {Array.from({ length: targetLength }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-7 h-9 sm:w-9 sm:h-11 rounded-lg border-2 border-[#4A5A35] bg-[#1A2313] flex items-center justify-center font-mono font-bold text-base sm:text-lg text-[#C8AE68] shadow-inner"
                >
                  {/* Note: Target word is never revealed until final completion! */}
                  <span className="opacity-30">_</span>
                </div>
              ))}
            </div>
          </div>

          {/* Clue Count Pill */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto text-xs text-[#B5AE9E] gap-1">
            <span className="font-semibold">Current Progress</span>
            <span className="font-mono font-bold text-sm text-[#F8F6EF] bg-[#323E25] px-3 py-1 rounded-full border border-[#4A5A35]">
              Clue {currentClue?.clueIndex || 1} of {targetLength}
            </span>
          </div>
        </div>

        {/* Main Clue Card (Parchment Aesthetic) */}
        <div className="bg-[#F8F6EF] rounded-2xl border-2 border-[#DFD6C2] shadow-2xl p-6 sm:p-8 text-[#252B22]">
          {/* Card Top Strip */}
          <div className="flex items-center justify-between pb-4 border-b border-[#DFD6C2] mb-5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EAE2CE] flex items-center justify-center text-[#B45309]">
                <Lightbulb className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#5D6B42]">
                Clue {currentClue?.clueIndex} of {targetLength}
              </span>
            </div>

            {/* Type badge */}
            <span className="text-xs font-bold uppercase tracking-wider text-[#3D472D] bg-[#EBE4D2] px-3 py-1 rounded-full border border-[#D5CAAe]">
              {currentClue?.typeDisplay || 'CLUE'}
            </span>
          </div>

          {/* Clue Question & Content */}
          <div className="space-y-4 mb-6">
            <h3 className="text-base sm:text-lg font-bold text-[#1E2716] leading-relaxed">
              {currentClue?.question}
            </h3>

            {/* Scrambled Word Visual Box */}
            {currentClue?.scrambledLetters && (
              <div className="p-4 bg-[#EDE5D5] rounded-xl border border-[#DFD6C2] text-center my-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B735F] block mb-2">
                  Scrambled Letters
                </span>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {currentClue.scrambledLetters.split(/\s+/).map((char, i) => (
                    <span
                      key={i}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-white border-2 border-[#C4B79D] font-mono font-extrabold text-lg text-[#252B22] flex items-center justify-center shadow-xs"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Letter Box */}
            {currentClue?.missingLetterPattern && (
              <div className="p-4 bg-[#EDE5D5] rounded-xl border border-[#DFD6C2] text-center my-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B735F] block mb-2">
                  Find The Missing Letter
                </span>
                <div className="flex items-center justify-center gap-2 flex-wrap font-mono text-xl font-bold tracking-widest text-[#252B22]">
                  {currentClue.missingLetterPattern.split(/\s+/).map((char, i) => (
                    <span
                      key={i}
                      className={`w-10 h-11 rounded-lg flex items-center justify-center border-2 ${
                        char === '?'
                          ? 'bg-[#FEF3C7] border-[#D97706] text-[#B45309] animate-pulse'
                          : 'bg-white border-[#C4B79D] text-[#252B22]'
                      }`}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Vector Illustration / Rebus Puzzle Visual Asset */}
            {currentClue?.visualAssetKey && (
              <PuzzleVisual assetKey={currentClue.visualAssetKey} type={currentClue.type} />
            )}
          </div>

          {/* Feedback Alerts */}
          {statusMessage && (
            <div
              className={`mb-5 p-3.5 rounded-xl border text-xs sm:text-sm font-medium flex items-center gap-2.5 transition-all ${
                statusMessage.type === 'success'
                  ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
                  : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#059669]" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Answer Input Form */}
          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            <div className={`relative ${shakeInput ? 'animate-bounce' : ''}`}>
              <input
                type="text"
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder="Enter your answer..."
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-white border-2 border-[#CDC3AD] rounded-xl text-base font-semibold text-[#252B22] placeholder-[#A49D8B] focus:outline-none focus:ring-2 focus:ring-[#5C6D3F] focus:border-transparent transition-all shadow-inner"
                autoFocus
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              {/* Hint button */}
              {currentClue?.hint ? (
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-[#63532C] bg-[#F5EEDD] hover:bg-[#EFE5CE] border border-[#DDD1B8] transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-[#C8AE68]" />
                  <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
                </button>
              ) : <div />}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting || !answerInput.trim()}
                className="w-full sm:w-auto px-7 py-3 font-bold text-[#F8F6EF] bg-[#3F4928] hover:bg-[#4E5C35] active:bg-[#343C21] rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Checking...</span>
                ) : (
                  <>
                    <span>Submit</span>
                    <Send className="w-4 h-4 text-[#C8AE68] group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Hint disclosure */}
          {showHint && currentClue?.hint && (
            <div className="mt-4 p-3 bg-[#FEF9C3]/70 rounded-xl border border-[#FDE047] text-xs text-[#854D0E] flex items-start gap-2">
              <span className="font-bold shrink-0">HINT:</span>
              <span>{currentClue.hint}</span>
            </div>
          )}
        </div>

        {/* Collected Letters Section */}
        <div className="bg-[#242F1B] rounded-2xl border border-[#404F2E] p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C8AE68] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Collected Letters</span>
            </span>
            <span className="text-xs text-[#8B9875]">
              {collectedLetters.length} of {targetLength} acquired
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {Array.from({ length: targetLength }).map((_, idx) => {
              const letter = collectedLetters[idx];
              return (
                <div
                  key={idx}
                  className={`w-10 h-12 sm:w-12 sm:h-14 rounded-xl flex items-center justify-center font-mono font-extrabold text-lg sm:text-xl transition-all shadow-md ${
                    letter
                      ? 'bg-gradient-to-b from-[#C8AE68] to-[#A4883F] text-[#1E2716] border-2 border-[#EAD598] scale-105'
                      : 'bg-[#182112] text-[#4A5A35] border-2 border-[#364426] border-dashed'
                  }`}
                >
                  {letter || '?'}
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-[#86966F] mt-3">
            Tip: Letters are collected in the order clues were solved. Solve all {targetLength} clues to unlock final word arrangement.
          </p>
        </div>
      </div>
    </div>
  );
};
