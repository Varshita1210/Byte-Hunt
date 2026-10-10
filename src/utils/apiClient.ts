// Client-side API caller with session recovery

const SESSION_TOKEN_KEY = 'bytehunt_session_token';
const SESSION_ID_KEY = 'bytehunt_session_id';
const TEAM_DATA_KEY = 'bytehunt_team_data';
const ADMIN_TOKEN_KEY = 'bytehunt_admin_token';

export const storage = {
  getSessionToken: () => localStorage.getItem(SESSION_TOKEN_KEY),
  setSessionToken: (t: string) => localStorage.setItem(SESSION_TOKEN_KEY, t),
  clearSessionToken: () => localStorage.removeItem(SESSION_TOKEN_KEY),

  getSessionId: () => localStorage.getItem(SESSION_ID_KEY),
  setSessionId: (id: string) => localStorage.setItem(SESSION_ID_KEY, id),
  clearSessionId: () => localStorage.removeItem(SESSION_ID_KEY),

  getTeamData: () => {
    try {
      const raw = localStorage.getItem(TEAM_DATA_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setTeamData: (d: any) => localStorage.setItem(TEAM_DATA_KEY, JSON.stringify(d)),
  clearTeamData: () => localStorage.removeItem(TEAM_DATA_KEY),

  getAdminToken: () => localStorage.getItem(ADMIN_TOKEN_KEY),
  setAdminToken: (t: string) => localStorage.setItem(ADMIN_TOKEN_KEY, t),
  clearAdminToken: () => localStorage.removeItem(ADMIN_TOKEN_KEY),

  clearAllGameData: () => {
    localStorage.removeItem(SESSION_TOKEN_KEY);
    localStorage.removeItem(SESSION_ID_KEY);
    localStorage.removeItem(TEAM_DATA_KEY);
  }
};

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const sessionToken = storage.getSessionToken();
  const adminToken = storage.getAdminToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (sessionToken) {
    headers['x-session-token'] = sessionToken;
  }
  if (adminToken) {
    headers['x-admin-token'] = adminToken;
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers
  });

  let data: any;
  try {
    data = await response.json();
  } catch {
    const statusInfo = response.statusText ? ` (${response.status} ${response.statusText})` : ` (${response.status})`;
    data = { success: false, error: `Invalid response from server${statusInfo}` };
  }

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}: Request failed`);
  }

  return data;
}
