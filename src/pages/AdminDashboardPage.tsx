import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Trophy,
  Users,
  BookOpen,
  BarChart3,
  Download,
  Settings,
  LogOut,
  RefreshCw,
  Clock,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Eye,
  EyeOff,
  Search,
  Filter,
  Check,
  X,
  ShieldAlert,
  Timer
} from 'lucide-react';
import { apiRequest, storage } from '../utils/apiClient';

interface AdminDashboardPageProps {
  onLogout: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leaderboard' | 'teams' | 'incidents' | 'puzzles' | 'analytics' | 'settings'>('dashboard');
  
  // Data states
  const [stats, setStats] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [puzzles, setPuzzles] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [incidentsSummary, setIncidentsSummary] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    registrationsOpen: true,
    cluePointValue: 1,
    finalBonusPoints: 2
  });

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPuzzleDetail, setSelectedPuzzleDetail] = useState<any | null>(null);
  const [resetConfirmTeam, setResetConfirmTeam] = useState<any | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Penalty review modal state
  const [penaltyModalTeam, setPenaltyModalTeam] = useState<any | null>(null);
  const [penaltySecondsInput, setPenaltySecondsInput] = useState<number>(0);
  const [penaltyReasonInput, setPenaltyReasonInput] = useState<string>('');
  const [isApplyingPenalty, setIsApplyingPenalty] = useState<boolean>(false);

  const formatDuration = (ms?: number) => {
    if (!ms) return '—';
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSec % 60).toString().padStart(2, '0');
    return `${hours}:${mins}:${secs}`;
  };

  const loadAllAdminData = async () => {
    try {
      setIsLoading(true);
      const [dashRes, teamsRes, puzzlesRes, analyticsRes, incidentsRes] = await Promise.all([
        apiRequest('/admin/dashboard'),
        apiRequest('/admin/teams'),
        apiRequest('/admin/puzzles'),
        apiRequest('/admin/analytics'),
        apiRequest('/admin/incidents')
      ]);

      if (dashRes.success) {
        setStats(dashRes.stats);
        if (dashRes.settings) setSettings(dashRes.settings);
      }
      if (teamsRes.success) setTeams(teamsRes.teams);
      if (puzzlesRes.success) setPuzzles(puzzlesRes.puzzles);
      if (analyticsRes.success) setAnalytics(analyticsRes.analytics);
      if (incidentsRes.success) {
        setIncidents(incidentsRes.incidents || []);
        setIncidentsSummary(incidentsRes.summaryByTeam || []);
      }
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      if (err.message && err.message.includes('401')) {
        storage.clearAdminToken();
        onLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const handleTogglePuzzle = async (puzzleId: string) => {
    try {
      const res = await apiRequest(`/admin/puzzles/${puzzleId}/toggle`, { method: 'POST' });
      if (res.success) {
        setPuzzles(prev =>
          prev.map(p =>
            p.puzzleId === puzzleId ? { ...p, enabled: !p.enabled } : p
          )
        );
        setActionSuccessMessage('Puzzle status updated.');
        setTimeout(() => setActionSuccessMessage(null), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Error updating puzzle');
    }
  };

  const handleResetSession = async (teamId: string) => {
    try {
      const res = await apiRequest(`/admin/teams/${teamId}/reset`, { method: 'POST' });
      if (res.success) {
        setResetConfirmTeam(null);
        setActionSuccessMessage('Team session has been reset.');
        setTimeout(() => setActionSuccessMessage(null), 3000);
        loadAllAdminData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to reset session');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiRequest('/admin/settings', {
        method: 'POST',
        body: JSON.stringify(settings)
      });
      if (res.success) {
        setActionSuccessMessage('Event settings saved.');
        setTimeout(() => setActionSuccessMessage(null), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    }
  };

  const handleDownloadCsv = () => {
    const token = storage.getAdminToken();
    window.open(`/api/admin/export?token=${token}`, '_blank');
  };

  const openPenaltyModal = (team: any) => {
    setPenaltyModalTeam(team);
    setPenaltySecondsInput(team.penaltySeconds || 0);
    setPenaltyReasonInput('Tab switch violations during active hunt');
  };

  const handleApplyPenalty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!penaltyModalTeam) return;

    try {
      setIsApplyingPenalty(true);
      const res = await apiRequest(`/admin/teams/${penaltyModalTeam.id || penaltyModalTeam.teamId}/penalty`, {
        method: 'POST',
        body: JSON.stringify({
          penaltySeconds: Number(penaltySecondsInput) || 0,
          reason: penaltyReasonInput.trim()
        })
      });

      if (res.success) {
        setActionSuccessMessage(`Time penalty of ${penaltySecondsInput}s saved for team ${penaltyModalTeam.name || penaltyModalTeam.teamName}.`);
        setPenaltyModalTeam(null);
        setTimeout(() => setActionSuccessMessage(null), 4000);
        await loadAllAdminData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to apply penalty');
    } finally {
      setIsApplyingPenalty(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#182012] text-[#F8F6EF] flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#141B0F] border-r border-[#2C3820] p-4 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2.5 px-3 py-3 mb-6 border-b border-[#2C3820]">
            <div className="w-8 h-8 rounded-lg bg-[#3F4928] border border-[#C8AE68] flex items-center justify-center text-[#C8AE68]">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#F8F6EF] font-['Cinzel',serif] tracking-wider block">
                ADMIN CONSOLE
              </span>
              <span className="text-[10px] text-[#86966F]">BYTE HUNT Controls</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#3F4928] text-[#F8F6EF] shadow-xs'
                  : 'text-[#A0AC8E] hover:bg-[#202917] hover:text-[#EDE5D5]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#C8AE68]" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'leaderboard'
                  ? 'bg-[#3F4928] text-[#F8F6EF] shadow-xs'
                  : 'text-[#A0AC8E] hover:bg-[#202917] hover:text-[#EDE5D5]'
              }`}
            >
              <Trophy className="w-4 h-4 text-[#C8AE68]" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => setActiveTab('teams')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'teams'
                  ? 'bg-[#3F4928] text-[#F8F6EF] shadow-xs'
                  : 'text-[#A0AC8E] hover:bg-[#202917] hover:text-[#EDE5D5]'
              }`}
            >
              <Users className="w-4 h-4 text-[#C8AE68]" />
              <span>Team Details</span>
            </button>

            <button
              onClick={() => setActiveTab('incidents')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'incidents'
                  ? 'bg-[#3F4928] text-[#F8F6EF] shadow-xs'
                  : 'text-[#A0AC8E] hover:bg-[#202917] hover:text-[#EDE5D5]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className={`w-4 h-4 ${incidents.length > 0 ? 'text-[#F59E0B]' : 'text-[#8A9876]'}`} />
                <span>Tab Incidents</span>
              </div>
              {incidents.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#DC2626] text-white">
                  {incidents.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('puzzles')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'puzzles'
                  ? 'bg-[#3F4928] text-[#F8F6EF] shadow-xs'
                  : 'text-[#A0AC8E] hover:bg-[#202917] hover:text-[#EDE5D5]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#C8AE68]" />
              <span>Puzzles & Answer Key</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-[#3F4928] text-[#F8F6EF] shadow-xs'
                  : 'text-[#A0AC8E] hover:bg-[#202917] hover:text-[#EDE5D5]'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-[#C8AE68]" />
              <span>Analytics & Difficulty</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#3F4928] text-[#F8F6EF] shadow-xs'
                  : 'text-[#A0AC8E] hover:bg-[#202917] hover:text-[#EDE5D5]'
              }`}
            >
              <Settings className="w-4 h-4 text-[#C8AE68]" />
              <span>Event Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Actions */}
        <div className="pt-4 border-t border-[#2C3820] space-y-2">
          <button
            onClick={handleDownloadCsv}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#F8F6EF] bg-[#2E3A20] hover:bg-[#3D4C2B] border border-[#44522E] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#C8AE68]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              storage.clearAdminToken();
              onLogout();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#EF4444] bg-[#2A1717] hover:bg-[#3A1E1E] border border-[#522525] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Admin Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        
        {/* Top bar feedback message */}
        {actionSuccessMessage && (
          <div className="mb-6 p-3 rounded-xl bg-[#064E3B] border border-[#059669] text-[#A7F3D0] text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-[#F8F6EF]">
                  Event Overview
                </h2>
                <p className="text-xs text-[#8C9877]">Live telemetry of teams, game activity, and incidents.</p>
              </div>

              <button
                onClick={loadAllAdminData}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#26321D] hover:bg-[#344427] border border-[#445431] text-[#EDE5D5] cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-[#C8AE68]" />
                <span>Refresh Data</span>
              </button>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 bg-[#202B18] rounded-2xl border border-[#3A4A28] shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A9876] block mb-1">
                  Total Teams
                </span>
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#F8F6EF]">
                  {stats?.totalTeams || 0}
                </span>
              </div>

              <div className="p-4 bg-[#202B18] rounded-2xl border border-[#3A4A28] shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A9876] block mb-1">
                  Active Hunts
                </span>
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#FBBF24]">
                  {stats?.activeTeams || 0}
                </span>
              </div>

              <div className="p-4 bg-[#202B18] rounded-2xl border border-[#3A4A28] shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A9876] block mb-1">
                  Completed
                </span>
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#34D399]">
                  {stats?.completedTeams || 0}
                </span>
              </div>

              <div className="p-4 bg-[#202B18] rounded-2xl border border-[#3A4A28] shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A9876] block mb-1">
                  Not Started
                </span>
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#94A3B8]">
                  {stats?.notStartedTeams || 0}
                </span>
              </div>
            </div>

            {/* Secondary KPIs + Incidents KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 bg-[#202B18] rounded-2xl border border-[#3A4A28]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A9876] block mb-1">
                  Avg. Completion Time
                </span>
                <span className="font-mono text-lg sm:text-xl font-bold text-[#E5DCB8]">
                  {formatDuration(stats?.avgDurationMs)}
                </span>
              </div>

              <div className="p-4 bg-[#202B18] rounded-2xl border border-[#3A4A28]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A9876] block mb-1">
                  Fastest Completion
                </span>
                <span className="font-mono text-lg sm:text-xl font-bold text-[#34D399]">
                  {formatDuration(stats?.fastestDurationMs)}
                </span>
              </div>

              <div className="p-4 bg-[#202B18] rounded-2xl border border-[#3A4A28]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A9876] block mb-1">
                  Highest Score
                </span>
                <span className="font-mono text-lg sm:text-xl font-bold text-[#FCD34D]">
                  {stats?.highestScore || 0} pts
                </span>
              </div>

              <div
                onClick={() => setActiveTab('incidents')}
                className="p-4 bg-[#202B18] rounded-2xl border border-[#3A4A28] hover:border-[#F59E0B] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#F59E0B]">
                    Tab Incidents
                  </span>
                  <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-lg sm:text-xl font-extrabold text-[#F87171]">
                    {incidents.length}
                  </span>
                  <span className="text-[11px] text-[#A0AC8E]">
                    ({new Set(incidents.map(i => i.teamId)).size} teams flagged)
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Event Log */}
            <div className="p-5 bg-[#202B18] rounded-2xl border border-[#3A4A28]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#C8AE68] mb-3">
                Live Audit Logs
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto font-mono text-xs text-[#CBD5E1]">
                {stats?.recentLogs && stats.recentLogs.length > 0 ? (
                  stats.recentLogs.map((log: any) => (
                    <div key={log.id} className="p-2 rounded bg-[#161E11] border border-[#2B3820] flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[#A4883F] font-bold mr-2">[{log.action}]</span>
                        <span className="text-[#EDE5D5]">{log.details}</span>
                      </div>
                      <span className="text-[10px] text-[#738062] shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-[#738062] italic">No event logs recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FULL LEADERBOARD (WITH SECRET WORDS VISIBLE TO ADMIN ONLY) */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-[#F8F6EF]">
                  Admin Leaderboard
                </h2>
                <p className="text-xs text-[#8C9877]">
                  Authoritative rankings. Applied time penalties are factored into official completion times.
                </p>
              </div>

              <button
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#3F4928] hover:bg-[#4E5C35] border border-[#68734A] text-[#F8F6EF] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#C8AE68]" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Table */}
            <div className="bg-[#F8F6EF] rounded-2xl border-2 border-[#DFD6C2] overflow-hidden text-[#252B22]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#EDE5D5] border-b border-[#DFD6C2] text-[#4F5938] uppercase font-bold text-[11px] tracking-wider">
                      <th className="py-3 px-4 text-center w-12">#</th>
                      <th className="py-3 px-4">Team Name</th>
                      <th className="py-3 px-4">Leader</th>
                      <th className="py-3 px-4">Assigned Word</th>
                      <th className="py-3 px-4 text-center">Score</th>
                      <th className="py-3 px-4 text-right">Time Taken</th>
                      <th className="py-3 px-4 text-right">Completed At</th>
                      <th className="py-3 px-4 text-right">Penalty Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE2CE]">
                    {teams.filter(t => t.status === 'completed').length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-xs text-[#737C66]">
                          No teams have completed the hunt yet.
                        </td>
                      </tr>
                    ) : (
                      teams
                        .filter(t => t.status === 'completed')
                        .sort((a, b) => {
                          if (b.score !== a.score) return b.score - a.score;
                          const effA = (a.durationMs || 0) + ((a.penaltySeconds || 0) * 1000);
                          const effB = (b.durationMs || 0) + ((b.penaltySeconds || 0) * 1000);
                          return effA - effB;
                        })
                        .map((team, idx) => {
                          const penaltySec = team.penaltySeconds || 0;
                          const effectiveMs = (team.durationMs || 0) + (penaltySec * 1000);

                          return (
                            <tr key={team.id} className="hover:bg-[#F3EFE4] transition-colors">
                              <td className="py-3 px-4 text-center font-bold text-[#68734A]">
                                {idx + 1}
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-bold text-[#1E2716] block">{team.name}</span>
                                {team.tabSwitchCount > 0 && (
                                  <span className="text-[10px] text-[#DC2626] font-semibold flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> {team.tabSwitchCount} tab switch{team.tabSwitchCount > 1 ? 'es' : ''}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-[#3D472D]">
                                {team.leaderName}
                              </td>
                              <td className="py-3 px-4 font-mono font-bold text-[#B45309]">
                                {team.targetWord || '—'}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="px-2 py-0.5 rounded bg-[#E5DCB8] font-mono font-bold text-xs">
                                  {team.score}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="font-mono font-bold text-[#252B22]">
                                  {formatDuration(effectiveMs)}
                                </div>
                                {penaltySec > 0 && (
                                  <span className="inline-block px-1.5 py-0.2 rounded bg-[#FEF3C7] text-[#B45309] text-[10px] font-bold">
                                    +{penaltySec}s penalty
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right text-[11px] text-[#738062]">
                                {team.completedTime ? new Date(team.completedTime).toLocaleTimeString() : '—'}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => openPenaltyModal(team)}
                                  className="px-2.5 py-1 text-[11px] font-bold text-[#92400E] bg-[#FEF3C7] hover:bg-[#FDE68A] border border-[#FCD34D] rounded-lg transition-colors cursor-pointer"
                                >
                                  {penaltySec > 0 ? `Edit (+${penaltySec}s)` : 'Set Penalty'}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TEAM DETAILS & LIVE PROGRESS */}
        {activeTab === 'teams' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-[#F8F6EF]">
                  Team Management & Real-Time State
                </h2>
                <p className="text-xs text-[#8C9877]">
                  Inspect live clue progress, letter collection, tab violations, and session status.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#738062] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter teams..."
                  className="w-full pl-9 pr-3 py-1.5 bg-[#202B18] border border-[#3A4A28] rounded-xl text-xs text-[#F8F6EF] focus:outline-none focus:border-[#C8AE68]"
                />
              </div>
            </div>

            <div className="bg-[#F8F6EF] rounded-2xl border-2 border-[#DFD6C2] overflow-hidden text-[#252B22]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#EDE5D5] border-b border-[#DFD6C2] text-[#4F5938] uppercase font-bold text-[11px] tracking-wider">
                      <th className="py-3 px-4">Team</th>
                      <th className="py-3 px-4">Leader / Members</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Assigned Word</th>
                      <th className="py-3 px-4">Clues Solved</th>
                      <th className="py-3 px-4">Tab Violations</th>
                      <th className="py-3 px-4 text-center">Score</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE2CE]">
                    {teams
                      .filter(t =>
                        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.leaderName.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((t) => (
                        <tr key={t.id} className="hover:bg-[#F3EFE4] transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-bold text-[#1E2716] block">{t.name}</span>
                            <span className="text-[10px] text-[#738062] font-mono">{t.id}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[#3D472D] font-medium block">{t.leaderName}</span>
                            <span className="text-[11px] text-[#738062] truncate max-w-[150px] block">
                              {t.participants || '—'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                t.status === 'completed'
                                   ? 'bg-[#DCFCE7] text-[#166534]'
                                  : t.status === 'active'
                                  ? 'bg-[#FEF3C7] text-[#92400E]'
                                  : 'bg-[#F1F5F9] text-[#64748B]'
                              }`}
                            >
                              {t.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-[#B45309]">
                            {t.targetWord || 'Pending'}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-[#1E2716]">
                              {t.cluesCompleted} / {t.targetLength || '—'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {t.tabSwitchCount > 0 ? (
                              <button
                                onClick={() => openPenaltyModal(t)}
                                className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] hover:bg-[#FEE2E2] flex items-center gap-1 cursor-pointer transition-colors"
                                title="Click to view incidents and set penalty"
                              >
                                <AlertTriangle className="w-3 h-3 text-[#DC2626]" />
                                <span>{t.tabSwitchCount} switch{t.tabSwitchCount > 1 ? 'es' : ''}</span>
                                {t.penaltySeconds > 0 && (
                                  <span className="font-mono text-[#B45309]"> (+{t.penaltySeconds}s)</span>
                                )}
                              </button>
                            ) : (
                              <span className="text-[11px] text-[#738062] font-medium">None</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold">
                            {t.score}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openPenaltyModal(t)}
                                className="px-2.5 py-1 text-[11px] font-bold text-[#92400E] bg-[#FEF3C7] hover:bg-[#FDE68A] rounded-lg transition-colors cursor-pointer"
                                title="Manage time penalty"
                              >
                                {t.penaltySeconds > 0 ? `+${t.penaltySeconds}s` : 'Penalty'}
                              </button>

                              {t.status !== 'not_started' && (
                                <button
                                  onClick={() => setResetConfirmTeam(t)}
                                  className="px-2.5 py-1 text-[11px] font-bold text-[#DC2626] bg-[#FEE2E2] hover:bg-[#FCA5A5] rounded-lg transition-colors cursor-pointer"
                                >
                                  Reset
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TAB-SWITCH INCIDENTS & PENALTIES */}
        {activeTab === 'incidents' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-[#F8F6EF] flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-[#F59E0B]" />
                  <span>Tab-Switch Incidents & Integrity Log</span>
                </h2>
                <p className="text-xs text-[#8C9877]">
                  Real-time monitoring of participants leaving the game page. Review timestamps and manually enforce time penalties.
                </p>
              </div>

              <button
                onClick={loadAllAdminData}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#26321D] hover:bg-[#344427] border border-[#445431] text-[#EDE5D5] cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-[#C8AE68]" />
                <span>Refresh Incidents</span>
              </button>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[#202B18] rounded-2xl border border-[#3A4A28]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A9876] block mb-1">
                  Total Incidents Logged
                </span>
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#F87171]">
                  {incidents.length}
                </span>
              </div>

              <div className="p-4 bg-[#202B18] rounded-2xl border border-[#3A4A28]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A9876] block mb-1">
                  Teams With Violations
                </span>
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#FBBF24]">
                  {incidentsSummary.length}
                </span>
              </div>

              <div className="p-4 bg-[#202B18] rounded-2xl border border-[#3A4A28]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A9876] block mb-1">
                  Active Penalties Enforced
                </span>
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#34D399]">
                  {teams.filter(t => t.penaltySeconds > 0).length} teams ({teams.reduce((s, t) => s + (t.penaltySeconds || 0), 0)}s total)
                </span>
              </div>
            </div>

            {/* Summary by Team */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#C8AE68]">
                Teams With Tab Violations
              </h3>

              <div className="bg-[#F8F6EF] rounded-2xl border-2 border-[#DFD6C2] overflow-hidden text-[#252B22]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[#EDE5D5] border-b border-[#DFD6C2] text-[#4F5938] uppercase font-bold text-[11px] tracking-wider">
                        <th className="py-3 px-4">Team Name</th>
                        <th className="py-3 px-4">Team Leader</th>
                        <th className="py-3 px-4 text-center">Incidents</th>
                        <th className="py-3 px-4">Latest Incident</th>
                        <th className="py-3 px-4 text-center">Current Penalty</th>
                        <th className="py-3 px-4 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE2CE]">
                      {incidentsSummary.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-xs text-[#737C66]">
                            No tab-switch incidents recorded. All teams have remained on the game page!
                          </td>
                        </tr>
                      ) : (
                        incidentsSummary.map((item) => (
                          <tr key={item.teamId} className="hover:bg-[#F3EFE4] transition-colors">
                            <td className="py-3 px-4 font-bold text-[#1E2716]">
                              {item.teamName}
                            </td>
                            <td className="py-3 px-4 text-[#3D472D]">
                              {item.leaderName}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-extrabold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                                #{item.incidentCount}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-xs text-[#4F5938] font-mono">
                              {item.latestIncident ? new Date(item.latestIncident).toLocaleString() : '—'}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {item.penaltySeconds > 0 ? (
                                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-extrabold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]">
                                  +{item.penaltySeconds}s
                                </span>
                              ) : (
                                <span className="text-xs text-[#738062]">0s (None)</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => {
                                  const fullTeam = teams.find(t => t.id === item.teamId) || item;
                                  openPenaltyModal(fullTeam);
                                }}
                                className="px-3 py-1.5 text-xs font-bold bg-[#3F4928] hover:bg-[#4E5C35] text-[#F8F6EF] rounded-xl transition-colors cursor-pointer"
                              >
                                Review & Apply Penalty
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Complete incident timeline */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#C8AE68]">
                Complete Incident Timeline ({incidents.length} events)
              </h3>

              <div className="bg-[#202B18] rounded-2xl border border-[#3A4A28] overflow-hidden">
                <div className="max-h-80 overflow-y-auto divide-y divide-[#2E3C22] font-mono text-xs text-[#CBD5E1]">
                  {incidents.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#738062]">
                      No incidents logged yet.
                    </div>
                  ) : (
                    incidents.map((inc) => (
                      <div key={inc.id} className="p-3 hover:bg-[#25321C] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-[#3A1F1F] text-[#EF4444] border border-[#522525] flex items-center justify-center font-bold text-[10px]">
                            #{inc.count}
                          </span>
                          <div>
                            <span className="font-bold text-[#F8F6EF] mr-2">{inc.teamName}</span>
                            <span className="text-[11px] text-[#A0AC8E]">
                              switched tabs or minimized browser during hunt
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-[#8C9877] text-[11px] shrink-0">
                          <span>{new Date(inc.timestamp).toLocaleString()}</span>
                          <button
                            onClick={() => {
                              const t = teams.find(team => team.id === inc.teamId);
                              if (t) openPenaltyModal(t);
                            }}
                            className="text-[#C8AE68] hover:underline cursor-pointer"
                          >
                            Manage Penalty
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PUZZLE MANAGEMENT & 13 WORDS ANSWER KEY */}
        {activeTab === 'puzzles' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-[#F8F6EF]">
                  13 Technical Puzzle Challenges
                </h2>
                <p className="text-xs text-[#8C9877]">
                  All target words and original clues extracted directly from Booklet 1 & 2.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {puzzles.map((p) => (
                <div
                  key={p.puzzleId}
                  className={`p-5 rounded-2xl border transition-all ${
                    p.enabled
                      ? 'bg-[#202B18] border-[#3A4A28]'
                      : 'bg-[#181D14] border-[#2B3324] opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A4883F]">
                      {p.sourceBooklet} · Round {p.sourceRound}
                    </span>
                    <button
                      onClick={() => handleTogglePuzzle(p.puzzleId)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        p.enabled ? 'bg-[#064E3B] text-[#34D399]' : 'bg-[#450A0A] text-[#F87171]'
                      }`}
                    >
                      {p.enabled ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <h3 className="font-mono text-xl font-extrabold text-[#F8F6EF] tracking-wider mb-1">
                    {p.targetWord}
                  </h3>
                  <span className="text-xs text-[#8C9877] block mb-4">
                    {p.targetLength} Letters · {p.clues?.length || 0} Clues
                  </span>

                  <div className="pt-3 border-t border-[#2C3820] flex items-center justify-between">
                    <div className="text-[11px] text-[#A0AC8E]">
                      Assignments: <strong className="text-[#F8F6EF]">{p.assignmentsCount}</strong>
                    </div>

                    <button
                      onClick={() => setSelectedPuzzleDetail(p)}
                      className="px-3 py-1 bg-[#2E3C22] hover:bg-[#3D4C2B] text-xs font-semibold text-[#EDE5D5] rounded-lg transition-colors cursor-pointer"
                    >
                      View Answer Key
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: ANALYTICS & DIFFICULTY */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-[#F8F6EF]">
              Event Analytics & Clue Difficulty
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#202B18] rounded-2xl border border-[#3A4A28]">
                <span className="text-xs font-bold uppercase text-[#8A9876] block mb-1">
                  Overall Completion Rate
                </span>
                <span className="font-mono text-2xl font-bold text-[#F8F6EF]">
                  {analytics?.completionRate || 0}%
                </span>
              </div>

              <div className="p-4 bg-[#202B18] rounded-2xl border border-[#3A4A28]">
                <span className="text-xs font-bold uppercase text-[#8A9876] block mb-1">
                  Average Final Score
                </span>
                <span className="font-mono text-2xl font-bold text-[#FBBF24]">
                  {analytics?.avgScore || 0} / 12
                </span>
              </div>

              <div className="p-4 bg-[#202B18] rounded-2xl border border-[#3A4A28]">
                <span className="text-xs font-bold uppercase text-[#8A9876] block mb-1">
                  Total Answer Attempts Recorded
                </span>
                <span className="font-mono text-2xl font-bold text-[#38BDF8]">
                  {analytics?.totalAttemptsRecorded || 0}
                </span>
              </div>
            </div>

            {/* Difficult Clues Table */}
            <div className="p-5 bg-[#202B18] rounded-2xl border border-[#3A4A28]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#C8AE68] mb-3">
                Top 10 Most Challenging Clues
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#2C3820] text-[#8A9876] uppercase">
                      <th className="py-2 px-3">Clue ID</th>
                      <th className="py-2 px-3">Target Word</th>
                      <th className="py-2 px-3">Clue Question</th>
                      <th className="py-2 px-3">Correct Answer</th>
                      <th className="py-2 px-3 text-right">Wrong Attempts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#28341E]">
                    {analytics?.difficultClues?.map((c: any) => (
                      <tr key={c.clueId}>
                        <td className="py-2 px-3 font-bold text-[#F87171]">{c.clueId}</td>
                        <td className="py-2 px-3 font-bold text-[#C8AE68]">{c.word}</td>
                        <td className="py-2 px-3 text-[#EDE5D5] truncate max-w-xs">{c.question}</td>
                        <td className="py-2 px-3 text-[#34D399] font-bold">{c.answer}</td>
                        <td className="py-2 px-3 text-right font-bold text-[#F87171]">{c.incorrectAttempts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: EVENT SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-xl space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-[#F8F6EF]">
                BYTE HUNT Settings
              </h2>
              <p className="text-xs text-[#8C9877]">Manage registration states and scoring rules.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="p-6 bg-[#202B18] rounded-2xl border border-[#3A4A28] space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#2E3C22]">
                <div>
                  <span className="text-sm font-bold text-[#F8F6EF] block">
                    Allow New Registrations
                  </span>
                  <span className="text-xs text-[#8C9877]">
                    Toggle whether participating teams can register and start new hunts.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.registrationsOpen}
                  onChange={(e) => setSettings({ ...settings, registrationsOpen: e.target.checked })}
                  className="w-5 h-5 rounded text-[#68734A] focus:ring-0 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#8C9877] mb-1.5">
                  Points Per Correct Clue
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.cluePointValue}
                  onChange={(e) => setSettings({ ...settings, cluePointValue: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-[#172011] border border-[#2E3C22] rounded-xl text-sm font-mono text-[#F8F6EF] focus:outline-none focus:border-[#C8AE68]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#8C9877] mb-1.5">
                  Bonus Points for Final Hidden Word
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={settings.finalBonusPoints}
                  onChange={(e) => setSettings({ ...settings, finalBonusPoints: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-[#172011] border border-[#2E3C22] rounded-xl text-sm font-mono text-[#F8F6EF] focus:outline-none focus:border-[#C8AE68]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 font-bold text-sm text-[#1E2716] bg-[#C8AE68] hover:bg-[#DFC67D] rounded-xl transition-colors cursor-pointer"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}
      </main>

      {/* TIME PENALTY REVIEW MODAL */}
      {penaltyModalTeam && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F8F6EF] rounded-2xl border-2 border-[#DFD6C2] max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 text-[#252B22] shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#DFD6C2] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] border border-[#F59E0B] flex items-center justify-center text-[#D97706]">
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-['Cinzel',serif] text-[#1E2716]">
                    Review & Apply Time Penalty
                  </h3>
                  <span className="text-xs text-[#5D6B42]">
                    Team: <strong>{penaltyModalTeam.name || penaltyModalTeam.teamName}</strong> (Leader: {penaltyModalTeam.leaderName})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPenaltyModalTeam(null)}
                className="w-8 h-8 rounded-lg bg-[#EDE5D5] flex items-center justify-center hover:bg-[#DFD6C2] cursor-pointer"
              >
                <X className="w-4 h-4 text-[#252B22]" />
              </button>
            </div>

            {/* Incident Summary */}
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3.5 mb-4 text-xs text-[#92400E]">
              <div className="flex items-center justify-between mb-1 font-bold">
                <span>Tab Violations Recorded:</span>
                <span className="font-mono text-sm text-[#DC2626]">
                  #{penaltyModalTeam.tabSwitchCount ?? penaltyModalTeam.incidentCount ?? 0}
                </span>
              </div>
              <p className="text-[11px] text-[#78350F]">
                BYTE HUNT does not automatically adjust the game timer or score. As admin, you decide whether to apply a time penalty to their official hunt duration.
              </p>
            </div>

            {/* Incident timestamps list */}
            {incidents.filter(i => i.teamId === (penaltyModalTeam.id || penaltyModalTeam.teamId)).length > 0 && (
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase text-[#738062] block mb-1.5">
                  Logged Incident Timestamps:
                </span>
                <div className="bg-[#EDE5D5] rounded-xl p-2.5 max-h-32 overflow-y-auto space-y-1 font-mono text-[11px]">
                  {incidents
                    .filter(i => i.teamId === (penaltyModalTeam.id || penaltyModalTeam.teamId))
                    .map((inc, i) => (
                      <div key={inc.id || i} className="flex justify-between items-center text-[#252B22]">
                        <span className="font-bold text-[#DC2626]">Incident #{inc.count}:</span>
                        <span>{new Date(inc.timestamp).toLocaleString()}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <form onSubmit={handleApplyPenalty} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#4F5938] mb-1.5">
                  Select Quick Penalty:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPenaltySecondsInput(30)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                      penaltySecondsInput === 30
                        ? 'bg-[#B45309] text-white border-[#B45309]'
                        : 'bg-[#EDE5D5] text-[#252B22] border-[#DFD6C2] hover:bg-[#DFD6C2]'
                    }`}
                  >
                    +30 Seconds
                  </button>
                  <button
                    type="button"
                    onClick={() => setPenaltySecondsInput(60)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                      penaltySecondsInput === 60
                        ? 'bg-[#B45309] text-white border-[#B45309]'
                        : 'bg-[#EDE5D5] text-[#252B22] border-[#DFD6C2] hover:bg-[#DFD6C2]'
                    }`}
                  >
                    +60s (1 min)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPenaltySecondsInput(120)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                      penaltySecondsInput === 120
                        ? 'bg-[#B45309] text-white border-[#B45309]'
                        : 'bg-[#EDE5D5] text-[#252B22] border-[#DFD6C2] hover:bg-[#DFD6C2]'
                    }`}
                  >
                    +120s (2 min)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPenaltySecondsInput(300)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                      penaltySecondsInput === 300
                        ? 'bg-[#B45309] text-white border-[#B45309]'
                        : 'bg-[#EDE5D5] text-[#252B22] border-[#DFD6C2] hover:bg-[#DFD6C2]'
                    }`}
                  >
                    +300s (5 min)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPenaltySecondsInput(0)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                      penaltySecondsInput === 0
                        ? 'bg-[#064E3B] text-white border-[#064E3B]'
                        : 'bg-[#EDE5D5] text-[#252B22] border-[#DFD6C2] hover:bg-[#DFD6C2]'
                    }`}
                  >
                    Clear (0s)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#4F5938] mb-1.5">
                  Or Custom Penalty Seconds:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="3600"
                    value={penaltySecondsInput}
                    onChange={(e) => setPenaltySecondsInput(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-white border border-[#DFD6C2] rounded-xl text-sm font-mono text-[#252B22] focus:outline-none focus:border-[#B45309]"
                  />
                  <span className="text-xs font-semibold text-[#5D6B42] shrink-0">seconds</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#4F5938] mb-1.5">
                  Reason / Notes:
                </label>
                <input
                  type="text"
                  value={penaltyReasonInput}
                  onChange={(e) => setPenaltyReasonInput(e.target.value)}
                  placeholder="e.g. Tab switch violation"
                  className="w-full px-3 py-2 bg-white border border-[#DFD6C2] rounded-xl text-xs text-[#252B22] focus:outline-none focus:border-[#B45309]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DFD6C2]">
                <button
                  type="button"
                  onClick={() => setPenaltyModalTeam(null)}
                  className="px-4 py-2 text-xs font-semibold bg-[#EDE5D5] hover:bg-[#DFD6C2] rounded-xl text-[#252B22] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApplyingPenalty}
                  className="px-5 py-2 text-xs font-bold bg-[#B45309] hover:bg-[#92400E] text-white rounded-xl transition-colors cursor-pointer"
                >
                  {isApplyingPenalty ? 'Saving...' : 'Apply Penalty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT PUZZLE MODAL */}
      {selectedPuzzleDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F8F6EF] rounded-2xl border-2 border-[#DFD6C2] max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 text-[#252B22]">
            <div className="flex items-center justify-between pb-4 border-b border-[#DFD6C2] mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#68734A] block">
                  {selectedPuzzleDetail.sourceBooklet} · Round {selectedPuzzleDetail.sourceRound}
                </span>
                <h3 className="text-2xl font-extrabold font-mono tracking-wider text-[#1E2716]">
                  {selectedPuzzleDetail.targetWord}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPuzzleDetail(null)}
                className="w-8 h-8 rounded-lg bg-[#EDE5D5] flex items-center justify-center hover:bg-[#DFD6C2] cursor-pointer"
              >
                <X className="w-4 h-4 text-[#252B22]" />
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#68734A]">
                Associated Clues & Private Answer Key ({selectedPuzzleDetail.clues?.length})
              </h4>
              <div className="space-y-3">
                {selectedPuzzleDetail.clues?.map((c: any, i: number) => (
                  <div key={c.clueId} className="p-3.5 bg-white rounded-xl border border-[#E5DCB8]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-[#68734A]">
                        Clue {i + 1} ({c.typeDisplay})
                      </span>
                      <span className="font-mono font-bold text-[#B45309]">
                        Required Letter: [{c.requiredLetter}]
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#1E2716] mb-2">{c.question}</p>
                    <div className="p-2 bg-[#F5EEDD] rounded-lg text-xs font-mono">
                      <span className="text-[#738062]">Correct Answer: </span>
                      <strong className="text-[#1E2716]">{c.correctAnswer}</strong>
                      {c.acceptedAnswers?.length > 1 && (
                        <span className="text-[#86966F] ml-2">
                          (Also accepts: {c.acceptedAnswers.filter((a: string) => a !== c.correctAnswer).join(', ')})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM RESET MODAL */}
      {resetConfirmTeam && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F8F6EF] rounded-2xl border-2 border-[#DFD6C2] max-w-md w-full p-6 text-[#252B22]">
            <div className="flex items-center gap-3 text-[#DC2626] mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold">Confirm Reset Team Session?</h3>
            </div>
            <p className="text-xs text-[#5D6B42] mb-4">
              Are you sure you want to reset the active hunt session for team{' '}
              <strong>"{resetConfirmTeam.name}"</strong>? This will clear their current progress, attempts, and timer.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setResetConfirmTeam(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#EDE5D5] hover:bg-[#DFD6C2] rounded-xl text-[#252B22] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleResetSession(resetConfirmTeam.id)}
                className="px-4 py-2 text-xs font-bold bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl text-white cursor-pointer"
              >
                Yes, Reset Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
