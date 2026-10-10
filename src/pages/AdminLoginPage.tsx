import React, { useState } from 'react';
import { Shield, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { apiRequest, storage } from '../utils/apiClient';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onCancel
}) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await apiRequest('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ password })
      });

      if (res.success && res.adminToken) {
        storage.setAdminToken(res.adminToken);
        onLoginSuccess();
      } else {
        throw new Error(res.error || 'Authentication failed');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid administrator password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4 bg-[#182012]">
      <div className="w-full max-w-md bg-[#F8F6EF] rounded-2xl border-2 border-[#DFD6C2] shadow-2xl p-6 sm:p-8 text-[#252B22]">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-[#384325] to-[#202917] border border-[#C8AE68] items-center justify-center text-[#C8AE68] shadow-md mb-3">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-wider font-['Cinzel',serif] text-[#1E2716] uppercase">
            Admin Portal
          </h2>
          <p className="text-xs font-semibold text-[#5D6B42] mt-1">
            Event Management, Answer Keys & Live Analytics
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3D472D] mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#68734A]" />
              <span>Admin Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter administrator password..."
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-white border border-[#CDC3AD] rounded-xl text-sm font-medium text-[#252B22] placeholder-[#9E9785] focus:outline-none focus:ring-2 focus:ring-[#68734A] shadow-xs"
              autoFocus
              required
            />
            <p className="text-[11px] text-[#78836A] mt-1.5">
              Default organizer credential: <code className="bg-[#EAE2CE] px-1.5 py-0.5 rounded text-[#2A341E] font-mono">admin_bytehunt_2026</code>
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full py-3 px-6 font-bold text-sm text-[#F8F6EF] bg-[#3E4A2A] hover:bg-[#4E5C35] rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4 text-[#C8AE68] group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-[#737C66] hover:text-[#252B22] transition-colors"
            >
              ← Return to Main Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
