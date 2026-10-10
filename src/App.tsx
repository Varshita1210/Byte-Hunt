import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { ActiveHuntPage } from './pages/ActiveHuntPage';
import { FinalWordPage } from './pages/FinalWordPage';
import { CongratulationsPage } from './pages/CongratulationsPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutModal, HowToPlayModal } from './components/InfoModals';
import { apiRequest, storage } from './utils/apiClient';
import { sounds } from './utils/audio';

export function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [teamData, setTeamData] = useState<any | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Tab switch detection state
  const [showTabWarning, setShowTabWarning] = useState<boolean>(false);
  const [tabIncidentCount, setTabIncidentCount] = useState<number>(0);
  const [tabIncidentTime, setTabIncidentTime] = useState<string>('');
  const wasTabHiddenRef = useRef<boolean>(false);

  // Modals
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Check existing session / admin state on mount
  useEffect(() => {
    const savedAdminToken = storage.getAdminToken();
    if (savedAdminToken) {
      setIsAdminLoggedIn(true);
    }

    const savedSessionId = storage.getSessionId();
    const savedToken = storage.getSessionToken();
    const savedTeam = storage.getTeamData();

    if (savedSessionId && savedToken) {
      setSessionId(savedSessionId);
      setSessionToken(savedToken);
      if (savedTeam) setTeamData(savedTeam);

      // Verify active session with backend
      apiRequest(`/game/session/${savedSessionId}`)
        .then(res => {
          if (res.success) {
            setSessionStartTime(res.startTime);
            if (res.team) setTeamData(res.team);

            if (res.status === 'completed') {
              setCurrentView('congratulations');
            } else if (res.isAllCluesSolved) {
              setCurrentView('final-word');
            } else if (res.status === 'active') {
              setCurrentView('hunt');
            }
          }
        })
        .catch(err => {
          console.warn('Session check failed or expired:', err);
        });
    }
  }, []);

  // Authoritative live timer interval
  useEffect(() => {
    if (!sessionStartTime || (currentView !== 'hunt' && currentView !== 'final-word')) {
      return;
    }

    const tick = () => {
      setElapsedMs(Math.max(0, Date.now() - sessionStartTime));
    };
    tick();

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [sessionStartTime, currentView]);

  // Tab-switch visibility monitoring (starts as soon as hunt begins and timer runs)
  useEffect(() => {
    const isHuntActive = Boolean(sessionId && sessionToken && (currentView === 'hunt' || currentView === 'final-word'));

    if (!isHuntActive) {
      wasTabHiddenRef.current = false;
      return;
    }

    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState === 'hidden') {
        // Participant navigated away from tab or minimized browser
        wasTabHiddenRef.current = true;
      } else if ((!document.hidden || document.visibilityState === 'visible') && wasTabHiddenRef.current) {
        // Participant returned to the game tab!
        wasTabHiddenRef.current = false;

        // Play warning alert tone
        sounds.playWarning();

        // Show warning immediately
        setShowTabWarning(true);

        // Record incident in database
        if (sessionId) {
          apiRequest('/game/tab-switch', {
            method: 'POST',
            body: JSON.stringify({ sessionId })
          })
            .then(res => {
              if (res.success) {
                setTabIncidentCount(res.count);
                setTabIncidentTime(new Date(res.timestamp || Date.now()).toLocaleTimeString());
              }
            })
            .catch(err => {
              console.error('Failed to log tab switch incident:', err);
            });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sessionId, sessionToken, currentView]);

  const formatTimer = (ms: number): string => {
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSec % 60).toString().padStart(2, '0');
    return `${hours}:${mins}:${secs}`;
  };

  const handleStartHuntSession = (newSessionId: string, newToken: string) => {
    setSessionId(newSessionId);
    setSessionToken(newToken);
    setSessionStartTime(Date.now());
    setCurrentView('hunt');
  };

  const handleExitCurrentGame = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    setCurrentView('home');
  };

  const handlePlayAgain = () => {
    storage.clearAllGameData();
    setSessionId(null);
    setSessionToken(null);
    setTeamData(null);
    setSessionStartTime(null);
    setCurrentView('register');
  };

  return (
    <div className="min-h-screen bg-[#1c2415] text-[#252B22] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Universal Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'about') setShowAbout(true);
          else if (view === 'how-to-play') setShowHowToPlay(true);
          else if (view === 'leaderboard') {
            if (isAdminLoggedIn) {
              setCurrentView('admin-dashboard');
            } else {
              setCurrentView('admin-login');
            }
          } else setCurrentView(view);
        }}
        teamName={teamData?.name || teamData?.teamName}
        timerFormatted={formatTimer(elapsedMs)}
        onExitGame={handleExitCurrentGame}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* View Router */}
      <div className="flex-1">
        {currentView === 'home' && (
          <LandingPage
            onStartClick={() => setCurrentView('register')}
          />
        )}

        {currentView === 'register' && (
          <RegistrationPage
            onHuntStarted={handleStartHuntSession}
            onCancel={() => setCurrentView('home')}
          />
        )}

        {currentView === 'hunt' && sessionId && sessionToken && (
          <ActiveHuntPage
            sessionId={sessionId}
            sessionToken={sessionToken}
            onAllCluesSolved={() => setCurrentView('final-word')}
            onExit={handleExitCurrentGame}
          />
        )}

        {currentView === 'final-word' && sessionId && (
          <FinalWordPage
            sessionId={sessionId}
            onSuccess={() => setCurrentView('congratulations')}
          />
        )}

        {currentView === 'congratulations' && sessionId && (
          <CongratulationsPage
            sessionId={sessionId}
            onReturnHome={() => setCurrentView('home')}
            onPlayAgain={handlePlayAgain}
          />
        )}

        {currentView === 'leaderboard' && (
          isAdminLoggedIn ? (
            <AdminDashboardPage
              onLogout={() => {
                setIsAdminLoggedIn(false);
                setCurrentView('home');
              }}
            />
          ) : (
            <AdminLoginPage
              onLoginSuccess={() => {
                setIsAdminLoggedIn(true);
                setCurrentView('admin-dashboard');
              }}
              onCancel={() => setCurrentView('home')}
            />
          )
        )}

        {currentView === 'admin-login' && (
          <AdminLoginPage
            onLoginSuccess={() => {
              setIsAdminLoggedIn(true);
              setCurrentView('admin-dashboard');
            }}
            onCancel={() => setCurrentView('home')}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboardPage
            onLogout={() => {
              setIsAdminLoggedIn(false);
              setCurrentView('home');
            }}
          />
        )}
      </div>

      {/* Modals */}
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
      <HowToPlayModal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />

      {/* Tab Switch Security Warning Modal */}
      {showTabWarning && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FAF7EE] rounded-2xl border-2 border-[#D97706] max-w-md w-full p-6 text-[#252B22] shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] border border-[#F59E0B] flex items-center justify-center text-[#D97706] shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#92400E] font-['Cinzel',serif] tracking-wider">
                  SECURITY WARNING
                </h3>
                <span className="text-[11px] font-semibold text-[#B45309]">
                  Integrity Monitoring Alert
                </span>
              </div>
            </div>

            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4 mb-5 text-sm text-[#78350F] leading-relaxed font-semibold shadow-xs">
              Warning! Leaving the BYTE HUNT game page is not allowed. This incident has been reported to the admin. Please stay on the game page.
            </div>

            <div className="bg-[#EDE5D5] rounded-xl p-3 mb-5 flex items-center justify-between text-xs text-[#4F5938]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#738062] block">Team</span>
                <span className="font-bold text-[#1E2716]">
                  {teamData?.name || teamData?.teamName || 'Your Team'}
                </span>
              </div>
              {tabIncidentCount > 0 && (
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#738062] block">Total Incidents</span>
                  <span className="font-mono font-extrabold text-[#B45309]">
                    #{tabIncidentCount} {tabIncidentTime ? `(${tabIncidentTime})` : ''}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowTabWarning(false)}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#B45309] hover:bg-[#92400E] text-[#FFFBEB] font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                I Understand & Stay on Game Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F8F6EF] rounded-2xl border-2 border-[#DFD6C2] max-w-sm w-full p-6 text-[#252B22] shadow-2xl">
            <h3 className="text-lg font-bold text-[#1E2716] mb-2 font-['Cinzel',serif]">
              Leave Active Hunt?
            </h3>
            <p className="text-xs text-[#5D6B42] mb-5">
              Your session progress and letter collection are safely saved on the server. The timer will continue running until you complete the final word.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 text-xs font-semibold bg-[#EDE5D5] hover:bg-[#DFD6C2] rounded-xl text-[#252B22] cursor-pointer"
              >
                Keep Playing
              </button>
              <button
                onClick={confirmExit}
                className="px-4 py-2 text-xs font-bold bg-[#3E4A2A] hover:bg-[#4E5C35] rounded-xl text-[#F8F6EF] cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
