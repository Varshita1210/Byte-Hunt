import React from 'react';
import { X, HelpCircle, Info, Sparkles, KeyRound, Award, BookOpen, Clock } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#F8F6EF] rounded-2xl border-2 border-[#DFD6C2] max-w-xl w-full p-6 sm:p-8 text-[#252B22] shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#DFD6C2] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#3F4928] text-[#C8AE68] flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-bold font-['Cinzel',serif] text-[#1E2716]">
              About BYTE HUNT
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#EDE5D5] flex items-center justify-center hover:bg-[#DFD6C2] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-[#252B22]" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#4D5838] leading-relaxed">
          <p>
            <strong>BYTE HUNT</strong> is a premier collegiate technical puzzle adventure designed to test computational logic, network theory, systems knowledge, and lateral problem-solving.
          </p>
          <div className="p-4 bg-[#EDE5D5] rounded-xl border border-[#DFD6C2] space-y-2 text-[#252B22]">
            <div className="flex items-start gap-2">
              <KeyRound className="w-4 h-4 text-[#C8AE68] shrink-0 mt-0.5" />
              <span><strong>13 Unique Hidden Words:</strong> Drawn from foundational computer science concepts (Operating Systems, Security, Hardware, Algorithms).</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-[#C8AE68] shrink-0 mt-0.5" />
              <span><strong>Server-Authoritative Timer:</strong> Timing starts the instant your team clicks Start Hunt on registration, continuing seamlessly across reloads.</span>
            </div>
            <div className="flex items-start gap-2">
              <Award className="w-4 h-4 text-[#C8AE68] shrink-0 mt-0.5" />
              <span><strong>Scoring & Speed:</strong> Earn 1 point per solved clue plus a 2-point bonus for unlocking the secret word before other teams!</span>
            </div>
          </div>
          <p>
            Every participating team receives an independent random challenge with shuffled clues to prevent copying, ensuring fair competition across the tournament.
          </p>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#3E4A2A] text-[#F8F6EF] hover:bg-[#4E5C35] transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

export const HowToPlayModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#F8F6EF] rounded-2xl border-2 border-[#DFD6C2] max-w-xl w-full p-6 sm:p-8 text-[#252B22] shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#DFD6C2] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#3F4928] text-[#C8AE68] flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-bold font-['Cinzel',serif] text-[#1E2716]">
              How To Play BYTE HUNT
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#EDE5D5] flex items-center justify-center hover:bg-[#DFD6C2] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-[#252B22]" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <div className="p-3.5 bg-white rounded-xl border border-[#DFD6C2] flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#3F4928] text-[#F8F6EF] font-bold text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <strong className="text-xs sm:text-sm text-[#1E2716] block">Receive Your Challenge</strong>
                <span className="text-xs text-[#5D6B42]">
                  You are told only how many letters your hidden word contains (e.g. 8 or 10 letters). The word itself remains a mystery!
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-[#DFD6C2] flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#3F4928] text-[#F8F6EF] font-bold text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <strong className="text-xs sm:text-sm text-[#1E2716] block">Solve Each Clue Sequentially</strong>
                <span className="text-xs text-[#5D6B42]">
                  Clues come as technical questions, riddles, picture puzzles, rebuses, and anagrams. Type the answer and submit.
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-[#DFD6C2] flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#3F4928] text-[#F8F6EF] font-bold text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <strong className="text-xs sm:text-sm text-[#1E2716] block">Collect The First Letters</strong>
                <span className="text-xs text-[#5D6B42]">
                  Every correct answer automatically awards its FIRST letter into your Collected Letters tray.
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-[#DFD6C2] flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#3F4928] text-[#F8F6EF] font-bold text-xs flex items-center justify-center shrink-0">
                4
              </span>
              <div>
                <strong className="text-xs sm:text-sm text-[#1E2716] block">Arrange & Unlock The Word</strong>
                <span className="text-xs text-[#5D6B42]">
                  Because clue order was shuffled, rearrange your collected letters to formulate the technical target word and stop the clock!
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#3E4A2A] text-[#F8F6EF] hover:bg-[#4E5C35] transition-colors cursor-pointer"
          >
            Ready to Play
          </button>
        </div>
      </div>
    </div>
  );
};
