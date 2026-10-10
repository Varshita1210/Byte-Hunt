import React from 'react';
import { Compass, Trophy, Shield, HelpCircle, Info, LogOut } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  teamName?: string;
  timerFormatted?: string;
  onExitGame?: () => void;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  teamName,
  timerFormatted,
  onExitGame,
  isAdminLoggedIn
}) => {
  const isPlaying = currentView === 'hunt' || currentView === 'final-word';

  return (
    <header className="sticky top-0 z-40 bg-[#192213]/95 backdrop-blur-md border-b border-[#364227] px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          {/* Isometric Cube Emblem */}
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#3F4928] to-[#252E1B] border border-[#68734A]/40 flex items-center justify-center text-[#C8AE68] shadow-md group-hover:border-[#C8AE68] transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
              <path d="M12 2 L20 6.5 L20 17.5 L12 22 L4 17.5 L4 6.5 Z" />
              <path d="M12 2 L12 22" />
              <path d="M12 12 L20 6.5" />
              <path d="M12 12 L4 6.5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-wider text-base sm:text-lg text-[#F8F6EF] group-hover:text-[#C8AE68] transition-colors whitespace-nowrap font-['Cinzel',serif]">
              BYTE HUNT
            </span>
          </div>
        </button>

        {/* Center / Game HUD if playing */}
        {isPlaying ? (
          <div className="flex items-center gap-3 sm:gap-6 bg-[#26321D]/90 px-4 py-1.5 rounded-full border border-[#44522E] shadow-inner">
            {teamName && (
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#EDE5D5] truncate max-w-[140px] sm:max-w-[200px]">
                <span className="w-2 h-2 rounded-full bg-[#C8AE68] shrink-0" />
                <span className="truncate">{teamName}</span>
              </div>
            )}
            {timerFormatted && (
              <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-[#E5DCB8] tracking-widest tabular-nums bg-[#161D10] px-2.5 py-0.5 rounded-md border border-[#3A4628]">
                <span className="text-[#C8AE68]">⏱</span>
                {timerFormatted}
              </div>
            )}
          </div>
        ) : (
          /* Zone 2: Navigation Links */
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#C4BCAB]">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-[#F8F6EF] transition-colors ${currentView === 'home' ? 'text-[#F8F6EF] font-semibold' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-[#F8F6EF] transition-colors flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5 text-[#C8AE68]" />
              About
            </button>
            <button
              onClick={() => onNavigate('how-to-play')}
              className="hover:text-[#F8F6EF] transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#C8AE68]" />
              How to Play
            </button>
          </nav>
        )}

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isPlaying ? (
            <button
              onClick={onExitGame}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#EDE5D5] bg-[#3B452A] hover:bg-[#4E5B36] border border-[#58673E] rounded-lg transition-colors"
              title="Exit Hunt"
            >
              <LogOut className="w-3.5 h-3.5 text-[#C8AE68]" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          ) : (
            <>
              {isAdminLoggedIn ? (
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#F8F6EF] bg-[#3A4528] hover:bg-[#4E5B36] border border-[#68734A] rounded-lg transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-[#C8AE68]" />
                  <span>Admin Panel</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('admin-login')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#EDE5D5] bg-[#29341C] hover:bg-[#384626] border border-[#485630] rounded-lg transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-[#C8AE68]" />
                  <span>Login</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
