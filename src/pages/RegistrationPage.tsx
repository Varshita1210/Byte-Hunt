import React, { useState } from 'react';
import { Users, User, ArrowRight, Compass, ShieldAlert, GraduationCap, Hash } from 'lucide-react';
import { apiRequest, storage } from '../utils/apiClient';

interface RegistrationPageProps {
  onHuntStarted: (sessionId: string, sessionToken: string) => void;
  onCancel: () => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  onHuntStarted,
  onCancel
}) => {
  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [participants, setParticipants] = useState('');
  const [department, setDepartment] = useState('');
  const [teamSize, setTeamSize] = useState('3');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!teamName.trim()) {
      setErrorMessage('Please enter your Team Name.');
      return;
    }
    if (!leaderName.trim()) {
      setErrorMessage('Please enter the Team Leader Name.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Register team
      const regRes = await apiRequest('/teams/register', {
        method: 'POST',
        body: JSON.stringify({
          teamName: teamName.trim(),
          leaderName: leaderName.trim(),
          participants: participants.trim(),
          department: department.trim(),
          teamSize: Number(teamSize) || 1
        })
      });

      if (!regRes.success) {
        throw new Error(regRes.error || 'Registration failed');
      }

      const team = regRes.team;
      storage.setTeamData(team);

      // 2. Start game session
      const startRes = await apiRequest('/game/start', {
        method: 'POST',
        body: JSON.stringify({ teamId: team.id })
      });

      if (!startRes.success) {
        throw new Error(startRes.error || 'Failed to start hunt');
      }

      // Store authoritative session credentials
      storage.setSessionId(startRes.sessionId);
      storage.setSessionToken(startRes.sessionToken);

      // Navigate to puzzle
      onHuntStarted(startRes.sessionId, startRes.sessionToken);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while starting the hunt.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-60px)] flex flex-col justify-center items-center px-4 py-8 bg-[#182012]">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#68734A] blur-3xl" />
      </div>

      {/* Main Parchment Registration Card */}
      <div className="relative z-10 w-full max-w-lg bg-[#F7F4EB] rounded-2xl border-2 border-[#DFD6C2] shadow-2xl p-6 sm:p-10 text-[#252B22]">
        {/* Card Header with Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex w-14 h-14 rounded-xl bg-gradient-to-br from-[#384325] to-[#202917] border border-[#C8AE68] items-center justify-center text-[#C8AE68] shadow-md mb-3">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-current stroke-2">
              <path d="M12 2 L20 6.5 L20 17.5 L12 22 L4 17.5 L4 6.5 Z" />
              <path d="M12 2 L12 22" />
              <path d="M12 12 L20 6.5" />
              <path d="M12 12 L4 6.5" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wider font-['Cinzel',serif] text-[#1E2716] uppercase">
            BYTE HUNT
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-[#5D6B42] mt-0.5">
            Crack the Clues. Collect the Letters. Unlock the Word.
          </p>
        </div>

        {/* Form Title */}
        <div className="border-t border-[#DFD6C2] pt-4 mb-5 text-center">
          <h3 className="text-lg font-bold text-[#2A341E]">
            Enter Team Details
          </h3>
          <p className="text-xs text-[#6B735F]">
            Provide your team credentials to unlock your randomly assigned technical challenge.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-xs sm:text-sm flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Team Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3D472D] mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#68734A]" />
              <span>Team Name <span className="text-red-600">*</span></span>
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. CodeCrafters"
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-white border border-[#CDC3AD] rounded-xl text-sm font-medium text-[#252B22] placeholder-[#9E9785] focus:outline-none focus:ring-2 focus:ring-[#68734A] focus:border-transparent transition-all shadow-xs"
              required
            />
          </div>

          {/* Leader Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3D472D] mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#68734A]" />
              <span>Team Leader Name <span className="text-red-600">*</span></span>
            </label>
            <input
              type="text"
              value={leaderName}
              onChange={(e) => setLeaderName(e.target.value)}
              placeholder="e.g. Aditi Sharma"
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-white border border-[#CDC3AD] rounded-xl text-sm font-medium text-[#252B22] placeholder-[#9E9785] focus:outline-none focus:ring-2 focus:ring-[#68734A] focus:border-transparent transition-all shadow-xs"
              required
            />
          </div>

          {/* Participant Names (Optional) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3D472D] mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#68734A]" />
              <span>Team Members (Optional)</span>
            </label>
            <input
              type="text"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="e.g. Rohan, Priya, Vikram"
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-white border border-[#CDC3AD] rounded-xl text-sm font-medium text-[#252B22] placeholder-[#9E9785] focus:outline-none focus:ring-2 focus:ring-[#68734A] focus:border-transparent transition-all shadow-xs"
            />
          </div>

          {/* Department & Team Size (2-column) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3D472D] mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#68734A]" />
                <span>Department / Year</span>
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. CSE / 3rd Year"
                disabled={isLoading}
                className="w-full px-3.5 py-2 bg-white border border-[#CDC3AD] rounded-xl text-xs font-medium text-[#252B22] placeholder-[#9E9785] focus:outline-none focus:ring-2 focus:ring-[#68734A] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3D472D] mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#68734A]" />
                <span>Team Size</span>
              </label>
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                disabled={isLoading}
                className="w-full px-3.5 py-2 bg-white border border-[#CDC3AD] rounded-xl text-xs font-medium text-[#252B22] focus:outline-none focus:ring-2 focus:ring-[#68734A] transition-all"
              >
                <option value="1">1 Person (Solo)</option>
                <option value="2">2 Members</option>
                <option value="3">3 Members</option>
                <option value="4">4 Members</option>
              </select>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 font-bold text-[#F8F6EF] bg-[#3E4A2A] hover:bg-[#4E5C35] active:bg-[#323C22] rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <span>Assigning Challenge & Starting Timer...</span>
              ) : (
                <>
                  <span>Start Hunt</span>
                  <ArrowRight className="w-4 h-4 text-[#C8AE68] group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-medium text-[#737C66] hover:text-[#252B22] transition-colors"
            >
              ← Back to Overview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
