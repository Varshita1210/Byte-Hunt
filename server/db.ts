import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { ALL_PUZZLES, PuzzleData } from './puzzles';

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
}

export interface Team {
  id: string;
  name: string;
  leaderName: string;
  participants: string;
  department: string;
  teamSize: number;
  createdAt: string;
}

export interface GameSession {
  id: string;
  teamId: string;
  sessionToken: string;
  puzzleId: string;
  assignedClueIds: string[];
  currentClueIndex: number;
  collectedLetters: string[];
  startTime: number;
  lastActivityTime: number;
  completedTime: number | null;
  durationMs: number | null;
  score: number;
  status: 'active' | 'completed' | 'abandoned';
  finalSubmittedWord: string | null;
  tabSwitchCount?: number;
  penaltySeconds?: number;
}

export interface ClueAttempt {
  id: string;
  sessionId: string;
  teamId: string;
  clueId: string;
  submittedAnswer: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface GameResult {
  id: string;
  sessionId: string;
  teamId: string;
  teamName: string;
  leaderName: string;
  participants: string;
  puzzleId: string;
  targetWord: string;
  score: number;
  durationMs: number;
  completedAt: string;
  penaltySeconds?: number;
}

export interface TabSwitchIncident {
  id: string;
  sessionId: string;
  teamId: string;
  teamName: string;
  timestamp: string;
  count: number;
}

export interface AdminSettings {
  registrationsOpen: boolean;
  cluePointValue: number;
  finalBonusPoints: number;
  disabledPuzzleIds: string[];
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
}

interface DatabaseSchema {
  teams: Team[];
  sessions: GameSession[];
  clueAttempts: ClueAttempt[];
  results: GameResult[];
  settings: AdminSettings;
  auditLogs: AuditLog[];
  tabSwitchIncidents?: TabSwitchIncident[];
}

// Authoritative legitimate baseline for Dual Impact and Tech Max
const BASELINE_TEAMS: Team[] = [
  {
    id: 'team-1791616926495-xkv2y',
    name: 'Dual Impact',
    leaderName: 'varshita',
    participants: 'kartika,katika,kathika',
    department: 'csm/3rd year',
    teamSize: 4,
    createdAt: '2026-10-10T07:22:06.495Z'
  },
  {
    id: 'team-1791615925555-15gqk',
    name: 'Tech Max',
    leaderName: 'varshu',
    participants: '',
    department: 'csm/3rd year',
    teamSize: 1,
    createdAt: '2026-10-10T07:05:25.555Z'
  }
];

const BASELINE_RESULTS: GameResult[] = [
  {
    id: 'res-1791617174441-ysj4',
    sessionId: 'sess-1791616926620-ocslb',
    teamId: 'team-1791616926495-xkv2y',
    teamName: 'Dual Impact',
    leaderName: 'varshita',
    participants: 'kartika,katika,kathika',
    puzzleId: 'puzzle-b1-04',
    targetWord: 'BLOCKCHAIN',
    score: 12,
    durationMs: 247820,
    completedAt: '2026-10-10T07:26:14.441Z'
  },
  {
    id: 'res-1791616349422-1egp',
    sessionId: 'sess-1791615925633-f2kn7',
    teamId: 'team-1791615925555-15gqk',
    teamName: 'Tech Max',
    leaderName: 'varshu',
    participants: '',
    puzzleId: 'puzzle-b1-03',
    targetWord: 'AUTOMATION',
    score: 12,
    durationMs: 423789,
    completedAt: '2026-10-10T07:12:29.422Z'
  }
];

const BASELINE_SESSIONS: GameSession[] = [
  {
    id: 'sess-1791616926620-ocslb',
    teamId: 'team-1791616926495-xkv2y',
    sessionToken: 'tok-1791616926620-sb7fv4xw',
    puzzleId: 'puzzle-b1-04',
    assignedClueIds: [
      'b1-04-c3', 'b1-04-c7', 'b1-04-c4', 'b1-04-c2', 'b1-04-c8',
      'b1-04-c9', 'b1-04-c6', 'b1-04-c5', 'b1-04-c1', 'b1-04-c10'
    ],
    currentClueIndex: 10,
    collectedLetters: ['O', 'H', 'C', 'L', 'A', 'I', 'C', 'K', 'B', 'N'],
    startTime: 1791616926620,
    lastActivityTime: 1791617174440,
    completedTime: 1791617174440,
    durationMs: 247820,
    score: 12,
    status: 'completed',
    finalSubmittedWord: 'BLOCK CHAIN'
  },
  {
    id: 'sess-1791615925633-f2kn7',
    teamId: 'team-1791615925555-15gqk',
    sessionToken: 'tok-1791615925633-5qx3ilxc',
    puzzleId: 'puzzle-b1-03',
    assignedClueIds: [
      'b1-03-c3', 'b1-03-c8', 'b1-03-c7', 'b1-03-c1', 'b1-03-c4',
      'b1-03-c6', 'b1-03-c9', 'b1-03-c10', 'b1-03-c5', 'b1-03-c2'
    ],
    currentClueIndex: 10,
    collectedLetters: ['T', 'I', 'T', 'A', 'O', 'A', 'O', 'N', 'M', 'U'],
    startTime: 1791615925633,
    lastActivityTime: 1791616349422,
    completedTime: 1791616349422,
    durationMs: 423789,
    score: 12,
    status: 'completed',
    finalSubmittedWord: 'AUTOMATION'
  }
];

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'bytehunt.json');

class DatabaseService {
  private fileData: DatabaseSchema;
  private pgPool: pg.Pool | null = null;
  private isPostgresReady = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.fileData = this.loadFileDatabase();
    // Start initialization in background; all public methods await ensureInitialized()
    this.ensureInitialized().catch(err => {
      console.warn('[BYTE HUNT DB] Background initialization notice:', err.message);
    });
  }

  public async ensureInitialized(): Promise<void> {
    if (this.isPostgresReady) return;
    if (!this.initPromise) {
      this.initPromise = this.initPostgresIfAvailable();
    }
    return this.initPromise;
  }

  // --- File Storage System ---
  private loadFileDatabase(): DatabaseSchema {
    // If running in Vercel serverless environment, use baseline without disk ops
    if (process.env.VERCEL) {
      return {
        teams: BASELINE_TEAMS,
        sessions: BASELINE_SESSIONS,
        clueAttempts: [],
        results: BASELINE_RESULTS,
        settings: {
          registrationsOpen: true,
          cluePointValue: 1,
          finalBonusPoints: 2,
          disabledPuzzleIds: []
        },
        auditLogs: [
          {
            id: 'log-baseline',
            action: 'DB_INITIALIZED',
            details: 'BYTE HUNT serverless instance initialized',
            timestamp: new Date().toISOString()
          }
        ],
        tabSwitchIncidents: []
      };
    }

    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);

        // Sanitize existing file data to ensure ONLY valid teams exist and duplicates are removed
        const filteredTeams = (parsed.teams || []).filter((t: Team) => {
          const lower = t.name.trim().toLowerCase();
          return lower === 'dual impact' || lower === 'tech max' || !lower.includes('seed');
        });

        // Deduplicate teams by normalized name
        const uniqueTeams: Team[] = [];
        const seenNames = new Set<string>();
        for (const t of filteredTeams) {
          const norm = t.name.trim().toLowerCase();
          if (!seenNames.has(norm)) {
            seenNames.add(norm);
            uniqueTeams.push(t);
          }
        }

        // Deduplicate results by teamId and sessionId
        const filteredResults: GameResult[] = [];
        const seenResults = new Set<string>();
        for (const r of parsed.results || []) {
          const norm = r.teamName.trim().toLowerCase();
          if (norm === 'dual impact' || norm === 'tech max' || !norm.includes('seed')) {
            if (!seenResults.has(norm)) {
              seenResults.add(norm);
              filteredResults.push(r);
            }
          }
        }

        return {
          teams: uniqueTeams.length > 0 ? uniqueTeams : BASELINE_TEAMS,
          sessions: parsed.sessions || BASELINE_SESSIONS,
          clueAttempts: parsed.clueAttempts || [],
          results: filteredResults.length > 0 ? filteredResults : BASELINE_RESULTS,
          settings: parsed.settings || {
            registrationsOpen: true,
            cluePointValue: 1,
            finalBonusPoints: 2,
            disabledPuzzleIds: []
          },
          auditLogs: parsed.auditLogs || [],
          tabSwitchIncidents: parsed.tabSwitchIncidents || []
        };
      }
    } catch (err) {
      console.error('Error reading file database, using baseline state:', err);
    }

    const baseline: DatabaseSchema = {
      teams: BASELINE_TEAMS,
      sessions: BASELINE_SESSIONS,
      clueAttempts: [],
      results: BASELINE_RESULTS,
      settings: {
        registrationsOpen: true,
        cluePointValue: 1,
        finalBonusPoints: 2,
        disabledPuzzleIds: []
      },
      auditLogs: [
        {
          id: 'log-baseline',
          action: 'DB_CLEANED',
          details: 'BYTE HUNT database initialized with Dual Impact and Tech Max',
          timestamp: new Date().toISOString()
        }
      ],
      tabSwitchIncidents: []
    };
    this.saveFileDatabase(baseline);
    return baseline;
  }

  private saveFileDatabase(dataToSave: DatabaseSchema = this.fileData): void {
    // Never attempt local file writes in Vercel or when PostgreSQL is active
    if (this.isPostgresReady || process.env.VERCEL) {
      return;
    }
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch {
      // Ignored in read-only / serverless filesystems
    }
  }

  // --- PostgreSQL / Cloud Database Support ---
  private async initPostgresIfAvailable() {
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;
    if (!dbUrl) {
      console.log('[BYTE HUNT DB] No DATABASE_URL found. Running with in-memory baseline state.');
      return;
    }

    try {
      if (!this.pgPool) {
        const isLocal = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');
        this.pgPool = new pg.Pool({
          connectionString: dbUrl,
          ssl: isLocal ? false : { rejectUnauthorized: false },
          max: 10, // Supports 15-20 simultaneous participants across serverless lambdas
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 10000
        });

        this.pgPool.on('error', (err) => {
          console.error('[BYTE HUNT DB] Unexpected error on idle Postgres client:', err);
        });
      }

      // Verify connection and create tables
      const client = await this.pgPool.connect();
      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS bytehunt_teams (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            name_lower TEXT NOT NULL UNIQUE,
            leader_name TEXT NOT NULL,
            participants TEXT,
            department TEXT,
            team_size INT DEFAULT 1,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );

          CREATE TABLE IF NOT EXISTS bytehunt_sessions (
            id TEXT PRIMARY KEY,
            team_id TEXT NOT NULL REFERENCES bytehunt_teams(id) ON DELETE CASCADE,
            session_token TEXT NOT NULL UNIQUE,
            puzzle_id TEXT NOT NULL,
            assigned_clue_ids JSONB NOT NULL,
            current_clue_index INT DEFAULT 0,
            collected_letters JSONB NOT NULL DEFAULT '[]'::jsonb,
            start_time BIGINT NOT NULL,
            last_activity_time BIGINT NOT NULL,
            completed_time BIGINT,
            duration_ms BIGINT,
            score INT DEFAULT 0,
            status TEXT DEFAULT 'active',
            final_submitted_word TEXT,
            penalty_seconds INT DEFAULT 0,
            tab_switch_count INT DEFAULT 0
          );

          CREATE TABLE IF NOT EXISTS bytehunt_clue_attempts (
            id TEXT PRIMARY KEY,
            session_id TEXT NOT NULL,
            team_id TEXT NOT NULL,
            clue_id TEXT NOT NULL,
            submitted_answer TEXT NOT NULL,
            is_correct BOOLEAN NOT NULL,
            timestamp BIGINT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS bytehunt_results (
            id TEXT PRIMARY KEY,
            session_id TEXT NOT NULL UNIQUE,
            team_id TEXT NOT NULL UNIQUE,
            team_name TEXT NOT NULL,
            leader_name TEXT NOT NULL,
            participants TEXT,
            puzzle_id TEXT NOT NULL,
            target_word TEXT NOT NULL,
            score INT NOT NULL,
            duration_ms BIGINT NOT NULL,
            completed_at TIMESTAMPTZ DEFAULT NOW(),
            penalty_seconds INT DEFAULT 0
          );

          CREATE TABLE IF NOT EXISTS bytehunt_settings (
            id INT PRIMARY KEY DEFAULT 1,
            registrations_open BOOLEAN DEFAULT TRUE,
            clue_point_value INT DEFAULT 1,
            final_bonus_points INT DEFAULT 2,
            disabled_puzzle_ids JSONB DEFAULT '[]'::jsonb
          );

          CREATE TABLE IF NOT EXISTS bytehunt_audit_logs (
            id TEXT PRIMARY KEY,
            action TEXT NOT NULL,
            details TEXT,
            timestamp TIMESTAMPTZ DEFAULT NOW()
          );

          CREATE TABLE IF NOT EXISTS bytehunt_tab_incidents (
            id TEXT PRIMARY KEY,
            session_id TEXT NOT NULL,
            team_id TEXT NOT NULL,
            team_name TEXT NOT NULL,
            timestamp TIMESTAMPTZ DEFAULT NOW(),
            count INT NOT NULL
          );

          ALTER TABLE bytehunt_sessions ADD COLUMN IF NOT EXISTS penalty_seconds INT DEFAULT 0;
          ALTER TABLE bytehunt_sessions ADD COLUMN IF NOT EXISTS tab_switch_count INT DEFAULT 0;
          ALTER TABLE bytehunt_results ADD COLUMN IF NOT EXISTS penalty_seconds INT DEFAULT 0;
        `);

        // Check if teams exist, if not seed baseline Dual Impact and Tech Max
        const countRes = await client.query('SELECT COUNT(*) FROM bytehunt_teams');
        if (parseInt(countRes.rows[0].count, 10) === 0) {
          for (const t of BASELINE_TEAMS) {
            await client.query(
              `INSERT INTO bytehunt_teams (id, name, name_lower, leader_name, participants, department, team_size, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
               ON CONFLICT (name_lower) DO NOTHING`,
              [t.id, t.name, t.name.toLowerCase().trim(), t.leaderName, t.participants, t.department, t.teamSize, t.createdAt]
            );
          }
          for (const s of BASELINE_SESSIONS) {
            await client.query(
              `INSERT INTO bytehunt_sessions (id, team_id, session_token, puzzle_id, assigned_clue_ids, current_clue_index, collected_letters, start_time, last_activity_time, completed_time, duration_ms, score, status, final_submitted_word, penalty_seconds, tab_switch_count)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
               ON CONFLICT (id) DO NOTHING`,
              [s.id, s.teamId, s.sessionToken, s.puzzleId, JSON.stringify(s.assignedClueIds), s.currentClueIndex, JSON.stringify(s.collectedLetters), s.startTime, s.lastActivityTime, s.completedTime, s.durationMs, s.score, s.status, s.finalSubmittedWord, s.penaltySeconds || 0, s.tabSwitchCount || 0]
            );
          }
          for (const r of BASELINE_RESULTS) {
            await client.query(
              `INSERT INTO bytehunt_results (id, session_id, team_id, team_name, leader_name, participants, puzzle_id, target_word, score, duration_ms, completed_at, penalty_seconds)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
               ON CONFLICT (team_id) DO NOTHING`,
              [r.id, r.sessionId, r.teamId, r.teamName, r.leaderName, r.participants, r.puzzleId, r.targetWord, r.score, r.durationMs, r.completedAt, r.penaltySeconds || 0]
            );
          }
        }
        this.isPostgresReady = true;
        console.log('[BYTE HUNT DB] Connected to PostgreSQL successfully with pooled connection.');
      } finally {
        client.release();
      }
    } catch (err) {
      console.error('[BYTE HUNT DB] PostgreSQL connection failed:', err);
      this.isPostgresReady = false;
      this.initPromise = null; // Allow retry on subsequent requests
    }
  }

  // --- Audit Logs ---
  public async log(action: string, details: string) {
    await this.ensureInitialized();
    const logItem: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      details,
      timestamp: new Date().toISOString()
    };

    if (this.isPostgresReady && this.pgPool) {
      try {
        await this.pgPool.query(
          'INSERT INTO bytehunt_audit_logs (id, action, details, timestamp) VALUES ($1, $2, $3, $4)',
          [logItem.id, logItem.action, logItem.details, logItem.timestamp]
        );
      } catch (err) {
        console.error('Failed to log to Postgres:', err);
      }
    }

    this.fileData.auditLogs.unshift(logItem);
    if (this.fileData.auditLogs.length > 500) {
      this.fileData.auditLogs.pop();
    }
    this.saveFileDatabase();
  }

  public async getLogs(): Promise<AuditLog[]> {
    await this.ensureInitialized();
    if (this.isPostgresReady && this.pgPool) {
      try {
        const res = await this.pgPool.query('SELECT * FROM bytehunt_audit_logs ORDER BY timestamp DESC LIMIT 50');
        return res.rows;
      } catch (err) {
        console.error('Failed to get logs from Postgres:', err);
      }
    }
    return [...this.fileData.auditLogs];
  }

  // --- Settings ---
  public async getSettings(): Promise<AdminSettings> {
    await this.ensureInitialized();
    if (this.isPostgresReady && this.pgPool) {
      try {
        const res = await this.pgPool.query('SELECT * FROM bytehunt_settings WHERE id = 1');
        if (res.rows.length > 0) {
          const row = res.rows[0];
          return {
            registrationsOpen: row.registrations_open,
            cluePointValue: row.clue_point_value,
            finalBonusPoints: row.final_bonus_points,
            disabledPuzzleIds: typeof row.disabled_puzzle_ids === 'string' ? JSON.parse(row.disabled_puzzle_ids) : (row.disabled_puzzle_ids || [])
          };
        }
      } catch (err) {
        console.error('Failed to get settings from Postgres:', err);
      }
    }
    return { ...this.fileData.settings };
  }

  public async updateSettings(partial: Partial<AdminSettings>): Promise<AdminSettings> {
    await this.ensureInitialized();
    const updated = { ...this.fileData.settings, ...partial };
    this.fileData.settings = updated;
    this.saveFileDatabase();

    if (this.isPostgresReady && this.pgPool) {
      try {
        await this.pgPool.query(`
          INSERT INTO bytehunt_settings (id, registrations_open, clue_point_value, final_bonus_points, disabled_puzzle_ids)
          VALUES (1, $1, $2, $3, $4)
          ON CONFLICT (id) DO UPDATE SET
            registrations_open = EXCLUDED.registrations_open,
            clue_point_value = EXCLUDED.clue_point_value,
            final_bonus_points = EXCLUDED.final_bonus_points,
            disabled_puzzle_ids = EXCLUDED.disabled_puzzle_ids
        `, [updated.registrationsOpen, updated.cluePointValue, updated.finalBonusPoints, JSON.stringify(updated.disabledPuzzleIds)]);
      } catch (err) {
        console.error('Failed to update settings in Postgres:', err);
      }
    }

    await this.log('UPDATE_SETTINGS', JSON.stringify(partial));
    return updated;
  }

  // --- Teams (Atomic deduplication) ---
  public async createTeam(teamData: Omit<Team, 'id' | 'createdAt'>): Promise<Team> {
    await this.ensureInitialized();
    const cleanName = teamData.name.trim();
    const cleanLower = cleanName.toLowerCase();

    // Check if team already exists by normalized name to prevent duplicate teams
    const existing = await this.getTeamByName(cleanName);
    if (existing) {
      return existing;
    }

    const id = `team-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const team: Team = {
      ...teamData,
      name: cleanName,
      id,
      createdAt: new Date().toISOString()
    };

    if (this.isPostgresReady && this.pgPool) {
      try {
        const res = await this.pgPool.query(`
          INSERT INTO bytehunt_teams (id, name, name_lower, leader_name, participants, department, team_size, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (name_lower) DO UPDATE SET name = EXCLUDED.name
          RETURNING *
        `, [team.id, team.name, cleanLower, team.leaderName, team.participants, team.department, team.teamSize, team.createdAt]);

        if (res.rows.length > 0) {
          const row = res.rows[0];
          const persistedTeam: Team = {
            id: row.id,
            name: row.name,
            leaderName: row.leader_name,
            participants: row.participants || '',
            department: row.department || '',
            teamSize: row.team_size,
            createdAt: row.created_at
          };
          this.fileData.teams = this.fileData.teams.filter(t => t.id !== persistedTeam.id && t.name.toLowerCase() !== cleanLower);
          this.fileData.teams.push(persistedTeam);
          this.saveFileDatabase();
          await this.log('CREATE_TEAM', `Team "${persistedTeam.name}" registered (ID: ${persistedTeam.id})`);
          return persistedTeam;
        }
      } catch (err) {
        console.error('Postgres createTeam error:', err);
      }
    }

    this.fileData.teams.push(team);
    this.saveFileDatabase();
    await this.log('CREATE_TEAM', `Team "${team.name}" registered (ID: ${team.id})`);
    return team;
  }

  public async getTeam(teamId: string): Promise<Team | undefined> {
    await this.ensureInitialized();
    if (this.isPostgresReady && this.pgPool) {
      try {
        const res = await this.pgPool.query('SELECT * FROM bytehunt_teams WHERE id = $1', [teamId]);
        if (res.rows.length > 0) {
          const row = res.rows[0];
          return {
            id: row.id,
            name: row.name,
            leaderName: row.leader_name,
            participants: row.participants || '',
            department: row.department || '',
            teamSize: row.team_size,
            createdAt: row.created_at
          };
        }
      } catch (err) {
        console.error('Postgres getTeam error:', err);
      }
    }
    return this.fileData.teams.find(t => t.id === teamId);
  }

  public async getTeamByName(name: string): Promise<Team | undefined> {
    await this.ensureInitialized();
    const cleanLower = name.trim().toLowerCase();
    if (this.isPostgresReady && this.pgPool) {
      try {
        const res = await this.pgPool.query('SELECT * FROM bytehunt_teams WHERE name_lower = $1', [cleanLower]);
        if (res.rows.length > 0) {
          const row = res.rows[0];
          return {
            id: row.id,
            name: row.name,
            leaderName: row.leader_name,
            participants: row.participants || '',
            department: row.department || '',
            teamSize: row.team_size,
            createdAt: row.created_at
          };
        }
      } catch (err) {
        console.error('Postgres getTeamByName error:', err);
      }
    }
    return this.fileData.teams.find(t => t.name.trim().toLowerCase() === cleanLower);
  }

  public async getAllTeams(): Promise<Team[]> {
    await this.ensureInitialized();
    if (this.isPostgresReady && this.pgPool) {
      try {
        const res = await this.pgPool.query('SELECT * FROM bytehunt_teams ORDER BY created_at ASC');
        return res.rows.map(row => ({
          id: row.id,
          name: row.name,
          leaderName: row.leader_name,
          participants: row.participants || '',
          department: row.department || '',
          teamSize: row.team_size,
          createdAt: row.created_at
        }));
      } catch (err) {
        console.error('Postgres getAllTeams error:', err);
      }
    }
    return [...this.fileData.teams];
  }

  // --- Random Puzzle Assignment ---
  public async pickPuzzleForTeam(): Promise<PuzzleData> {
    await this.ensureInitialized();
    const settings = await this.getSettings();
    const disabled = new Set(settings.disabledPuzzleIds || []);
    const availablePuzzles = ALL_PUZZLES.filter(p => !disabled.has(p.puzzleId));
    const pool = availablePuzzles.length > 0 ? availablePuzzles : ALL_PUZZLES;

    const allSessions = await this.getAllSessions();
    const countMap: Record<string, number> = {};
    for (const p of pool) {
      countMap[p.puzzleId] = 0;
    }
    for (const s of allSessions) {
      if (countMap[s.puzzleId] !== undefined) {
        countMap[s.puzzleId]++;
      }
    }

    const minCount = Math.min(...pool.map(p => countMap[p.puzzleId] || 0));
    const leastAssigned = pool.filter(p => (countMap[p.puzzleId] || 0) === minCount);
    return leastAssigned[Math.floor(Math.random() * leastAssigned.length)];
  }

  public shuffleClues(clueIds: string[]): string[] {
    const copy = [...clueIds];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // --- Game Sessions (Idempotent) ---
  public async createGameSession(teamId: string, puzzle: PuzzleData): Promise<GameSession> {
    await this.ensureInitialized();
    // If active session already exists for this team, return it immediately to prevent duplicate sessions
    const existing = await this.getSessionByTeamId(teamId);
    if (existing) {
      return existing;
    }

    const sessionId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const sessionToken = `tok-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    const clueIds = puzzle.clues.map(c => c.clueId);
    const randomizedClueOrder = this.shuffleClues(clueIds);

    const session: GameSession = {
      id: sessionId,
      teamId,
      sessionToken,
      puzzleId: puzzle.puzzleId,
      assignedClueIds: randomizedClueOrder,
      currentClueIndex: 0,
      collectedLetters: [],
      startTime: Date.now(),
      lastActivityTime: Date.now(),
      completedTime: null,
      durationMs: null,
      score: 0,
      status: 'active',
      finalSubmittedWord: null,
      penaltySeconds: 0,
      tabSwitchCount: 0
    };

    if (this.isPostgresReady && this.pgPool) {
      try {
        await this.pgPool.query(`
          INSERT INTO bytehunt_sessions (id, team_id, session_token, puzzle_id, assigned_clue_ids, current_clue_index, collected_letters, start_time, last_activity_time, score, status, penalty_seconds, tab_switch_count)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `, [session.id, session.teamId, session.sessionToken, session.puzzleId, JSON.stringify(session.assignedClueIds), session.currentClueIndex, JSON.stringify(session.collectedLetters), session.startTime, session.lastActivityTime, session.score, session.status, 0, 0]);
      } catch (err) {
        console.error('Postgres createGameSession error:', err);
      }
    }

    this.fileData.sessions.push(session);
    this.saveFileDatabase();
    await this.log('START_HUNT', `Session started for team ${teamId} (Assigned word length: ${puzzle.targetLength})`);
    return session;
  }

  public async getSession(sessionId: string): Promise<GameSession | undefined> {
    await this.ensureInitialized();
    if (this.isPostgresReady && this.pgPool) {
      try {
        const res = await this.pgPool.query('SELECT * FROM bytehunt_sessions WHERE id = $1', [sessionId]);
        if (res.rows.length > 0) {
          const row = res.rows[0];
          return {
            id: row.id,
            teamId: row.team_id,
            sessionToken: row.session_token,
            puzzleId: row.puzzle_id,
            assignedClueIds: typeof row.assigned_clue_ids === 'string' ? JSON.parse(row.assigned_clue_ids) : (row.assigned_clue_ids || []),
            currentClueIndex: row.current_clue_index,
            collectedLetters: typeof row.collected_letters === 'string' ? JSON.parse(row.collected_letters) : (row.collected_letters || []),
            startTime: Number(row.start_time),
            lastActivityTime: Number(row.last_activity_time),
            completedTime: row.completed_time ? Number(row.completed_time) : null,
            durationMs: row.duration_ms ? Number(row.duration_ms) : null,
            score: row.score,
            status: row.status,
            finalSubmittedWord: row.final_submitted_word,
            penaltySeconds: Number(row.penalty_seconds) || 0,
            tabSwitchCount: Number(row.tab_switch_count) || 0
          };
        }
      } catch (err) {
        console.error('Postgres getSession error:', err);
      }
    }
    return this.fileData.sessions.find(s => s.id === sessionId);
  }

  public async getSessionByTeamId(teamId: string): Promise<GameSession | undefined> {
    await this.ensureInitialized();
    if (this.isPostgresReady && this.pgPool) {
      try {
        const res = await this.pgPool.query("SELECT * FROM bytehunt_sessions WHERE team_id = $1 AND status = 'active' LIMIT 1", [teamId]);
        if (res.rows.length > 0) {
          const row = res.rows[0];
          return {
            id: row.id,
            teamId: row.team_id,
            sessionToken: row.session_token,
            puzzleId: row.puzzle_id,
            assignedClueIds: typeof row.assigned_clue_ids === 'string' ? JSON.parse(row.assigned_clue_ids) : (row.assigned_clue_ids || []),
            currentClueIndex: row.current_clue_index,
            collectedLetters: typeof row.collected_letters === 'string' ? JSON.parse(row.collected_letters) : (row.collected_letters || []),
            startTime: Number(row.start_time),
            lastActivityTime: Number(row.last_activity_time),
            completedTime: row.completed_time ? Number(row.completed_time) : null,
            durationMs: row.duration_ms ? Number(row.duration_ms) : null,
            score: row.score,
            status: row.status,
            finalSubmittedWord: row.final_submitted_word,
            penaltySeconds: Number(row.penalty_seconds) || 0,
            tabSwitchCount: Number(row.tab_switch_count) || 0
          };
        }
      } catch (err) {
        console.error('Postgres getSessionByTeamId error:', err);
      }
    }
    return this.fileData.sessions.find(s => s.teamId === teamId && s.status === 'active');
  }

  public async getAllSessions(): Promise<GameSession[]> {
    await this.ensureInitialized();
    if (this.isPostgresReady && this.pgPool) {
      try {
        const res = await this.pgPool.query('SELECT * FROM bytehunt_sessions ORDER BY start_time ASC');
        return res.rows.map(row => ({
          id: row.id,
          teamId: row.team_id,
          sessionToken: row.session_token,
          puzzleId: row.puzzle_id,
          assignedClueIds: typeof row.assigned_clue_ids === 'string' ? JSON.parse(row.assigned_clue_ids) : (row.assigned_clue_ids || []),
          currentClueIndex: row.current_clue_index,
          collectedLetters: typeof row.collected_letters === 'string' ? JSON.parse(row.collected_letters) : (row.collected_letters || []),
          startTime: Number(row.start_time),
          lastActivityTime: Number(row.last_activity_time),
          completedTime: row.completed_time ? Number(row.completed_time) : null,
          durationMs: row.duration_ms ? Number(row.duration_ms) : null,
          score: row.score,
          status: row.status,
          finalSubmittedWord: row.final_submitted_word,
          penaltySeconds: Number(row.penalty_seconds) || 0,
          tabSwitchCount: Number(row.tab_switch_count) || 0
        }));
      } catch (err) {
        console.error('Postgres getAllSessions error:', err);
      }
    }
    return [...this.fileData.sessions];
  }

  public async updateSession(sessionId: string, updates: Partial<GameSession>): Promise<GameSession | undefined> {
    await this.ensureInitialized();
    const session = await this.getSession(sessionId);
    if (!session) return undefined;

    const merged = { ...session, ...updates, lastActivityTime: Date.now() };

    // Update in memory & file
    const fileSession = this.fileData.sessions.find(s => s.id === sessionId);
    if (fileSession) {
      Object.assign(fileSession, merged);
      this.saveFileDatabase();
    }

    if (this.isPostgresReady && this.pgPool) {
      try {
        await this.pgPool.query(`
          UPDATE bytehunt_sessions SET
            current_clue_index = $1,
            collected_letters = $2,
            score = $3,
            status = $4,
            completed_time = $5,
            duration_ms = $6,
            final_submitted_word = $7,
            last_activity_time = $8,
            penalty_seconds = COALESCE($9, penalty_seconds),
            tab_switch_count = COALESCE($10, tab_switch_count)
          WHERE id = $11
        `, [
          merged.currentClueIndex,
          JSON.stringify(merged.collectedLetters),
          merged.score,
          merged.status,
          merged.completedTime,
          merged.durationMs,
          merged.finalSubmittedWord,
          merged.lastActivityTime,
          merged.penaltySeconds !== undefined ? merged.penaltySeconds : null,
          merged.tabSwitchCount !== undefined ? merged.tabSwitchCount : null,
          sessionId
        ]);
      } catch (err) {
        console.error('Postgres updateSession error:', err);
      }
    }

    return merged;
  }

  public async resetTeamSession(teamId: string): Promise<boolean> {
    await this.ensureInitialized();
    if (this.isPostgresReady && this.pgPool) {
      try {
        await this.pgPool.query('DELETE FROM bytehunt_tab_incidents WHERE team_id = $1', [teamId]);
        await this.pgPool.query('DELETE FROM bytehunt_results WHERE team_id = $1', [teamId]);
        await this.pgPool.query('DELETE FROM bytehunt_clue_attempts WHERE team_id = $1', [teamId]);
        await this.pgPool.query('DELETE FROM bytehunt_sessions WHERE team_id = $1', [teamId]);
      } catch (err) {
        console.error('Postgres resetTeamSession error:', err);
      }
    }

    const sessionIdx = this.fileData.sessions.findIndex(s => s.teamId === teamId);
    if (sessionIdx !== -1) {
      const session = this.fileData.sessions[sessionIdx];
      this.fileData.results = this.fileData.results.filter(r => r.sessionId !== session.id);
      this.fileData.clueAttempts = this.fileData.clueAttempts.filter(a => a.sessionId !== session.id);
      this.fileData.tabSwitchIncidents = (this.fileData.tabSwitchIncidents || []).filter(i => i.teamId !== teamId);
      this.fileData.sessions.splice(sessionIdx, 1);
      this.saveFileDatabase();
      await this.log('RESET_SESSION', `Session reset for team ${teamId}`);
      return true;
    }
    return false;
  }

  // --- Clue Attempts ---
  public async recordClueAttempt(attempt: Omit<ClueAttempt, 'id' | 'timestamp'>): Promise<ClueAttempt> {
    await this.ensureInitialized();
    const fullAttempt: ClueAttempt = {
      ...attempt,
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now()
    };

    if (this.isPostgresReady && this.pgPool) {
      try {
        await this.pgPool.query(`
          INSERT INTO bytehunt_clue_attempts (id, session_id, team_id, clue_id, submitted_answer, is_correct, timestamp)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [fullAttempt.id, fullAttempt.sessionId, fullAttempt.teamId, fullAttempt.clueId, fullAttempt.submittedAnswer, fullAttempt.isCorrect, fullAttempt.timestamp]);
      } catch (err) {
        console.error('Postgres recordClueAttempt error:', err);
      }
    }

    this.fileData.clueAttempts.push(fullAttempt);
    this.saveFileDatabase();
    return fullAttempt;
  }

  public async getAllAttempts(): Promise<ClueAttempt[]> {
    await this.ensureInitialized();
    if (this.isPostgresReady && this.pgPool) {
      try {
        const res = await this.pgPool.query('SELECT * FROM bytehunt_clue_attempts ORDER BY timestamp DESC');
        return res.rows.map(row => ({
          id: row.id,
          sessionId: row.session_id,
          teamId: row.team_id,
          clueId: row.clue_id,
          submittedAnswer: row.submitted_answer,
          isCorrect: row.is_correct,
          timestamp: Number(row.timestamp)
        }));
      } catch (err) {
        console.error('Postgres getAllAttempts error:', err);
      }
    }
    return [...this.fileData.clueAttempts];
  }

  // --- Results & Leaderboard (Strict Idempotency) ---
  public async recordGameCompletion(resultData: Omit<GameResult, 'id' | 'completedAt'>): Promise<GameResult> {
    await this.ensureInitialized();
    // 1. Strict duplicate check in memory/file
    const existing = this.fileData.results.find(
      r => r.sessionId === resultData.sessionId || r.teamId === resultData.teamId || r.teamName.trim().toLowerCase() === resultData.teamName.trim().toLowerCase()
    );
    if (existing) {
      return existing;
    }

    const result: GameResult = {
      ...resultData,
      id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      completedAt: new Date().toISOString()
    };

    if (this.isPostgresReady && this.pgPool) {
      try {
        const res = await this.pgPool.query(`
          INSERT INTO bytehunt_results (id, session_id, team_id, team_name, leader_name, participants, puzzle_id, target_word, score, duration_ms, completed_at, penalty_seconds)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (team_id) DO UPDATE SET
            score = EXCLUDED.score,
            duration_ms = EXCLUDED.duration_ms,
            penalty_seconds = EXCLUDED.penalty_seconds
          RETURNING *
        `, [result.id, result.sessionId, result.teamId, result.teamName, result.leaderName, result.participants, result.puzzleId, result.targetWord, result.score, result.durationMs, result.completedAt, result.penaltySeconds || 0]);

        if (res.rows.length > 0) {
          const row = res.rows[0];
          const persisted: GameResult = {
            id: row.id,
            sessionId: row.session_id,
            teamId: row.team_id,
            teamName: row.team_name,
            leaderName: row.leader_name,
            participants: row.participants || '',
            puzzleId: row.puzzle_id,
            targetWord: row.target_word,
            score: row.score,
            durationMs: Number(row.duration_ms),
            completedAt: row.completed_at,
            penaltySeconds: Number(row.penalty_seconds) || 0
          };
          this.fileData.results = this.fileData.results.filter(r => r.teamId !== persisted.teamId);
          this.fileData.results.push(persisted);
          this.saveFileDatabase();
          await this.log('GAME_COMPLETED', `Team ${persisted.teamName} completed hunt in ${Math.round(persisted.durationMs / 1000)}s!`);
          return persisted;
        }
      } catch (err) {
        console.error('Postgres recordGameCompletion error:', err);
      }
    }

    this.fileData.results.push(result);
    this.saveFileDatabase();
    await this.log('GAME_COMPLETED', `Team ${result.teamName} completed hunt in ${Math.round(result.durationMs / 1000)}s!`);
    return result;
  }

  public async getLeaderboard(): Promise<GameResult[]> {
    await this.ensureInitialized();
    if (this.isPostgresReady && this.pgPool) {
      try {
        const res = await this.pgPool.query(`
          SELECT * FROM bytehunt_results
          ORDER BY score DESC, (duration_ms + COALESCE(penalty_seconds, 0) * 1000) ASC, completed_at ASC
        `);
        return res.rows.map(row => ({
          id: row.id,
          sessionId: row.session_id,
          teamId: row.team_id,
          teamName: row.team_name,
          leaderName: row.leader_name,
          participants: row.participants || '',
          puzzleId: row.puzzle_id,
          targetWord: row.target_word,
          score: row.score,
          durationMs: Number(row.duration_ms),
          completedAt: row.completed_at,
          penaltySeconds: Number(row.penalty_seconds) || 0
        }));
      } catch (err) {
        console.error('Postgres getLeaderboard error:', err);
      }
    }

    // Ranking rules:
    // 1. Higher score ranks first
    // 2. Shorter effective completion time (durationMs + penalty) ranks next
    // 3. Earlier completion timestamp tie breaker
    return [...this.fileData.results].sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      const effectiveA = a.durationMs + ((a.penaltySeconds || 0) * 1000);
      const effectiveB = b.durationMs + ((b.penaltySeconds || 0) * 1000);
      if (effectiveA !== effectiveB) {
        return effectiveA - effectiveB;
      }
      return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
    });
  }

  public async getAllResults(): Promise<GameResult[]> {
    return this.getLeaderboard();
  }

  // --- Tab Switch Incidents & Penalties ---
  public async recordTabSwitchIncident(sessionId: string): Promise<{ incident: TabSwitchIncident; count: number; teamName: string } | null> {
    await this.ensureInitialized();
    const session = await this.getSession(sessionId);
    if (!session) return null;
    const team = await this.getTeam(session.teamId);
    const teamName = team ? team.name : 'Unknown Team';

    if (!this.fileData.tabSwitchIncidents) {
      this.fileData.tabSwitchIncidents = [];
    }

    const teamIncidents = this.fileData.tabSwitchIncidents.filter(i => i.teamId === session.teamId);
    const newCount = teamIncidents.length + 1;

    const incident: TabSwitchIncident = {
      id: `inc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sessionId,
      teamId: session.teamId,
      teamName,
      timestamp: new Date().toISOString(),
      count: newCount
    };

    this.fileData.tabSwitchIncidents.push(incident);
    await this.updateSession(sessionId, { tabSwitchCount: newCount });

    if (this.isPostgresReady && this.pgPool) {
      try {
        await this.pgPool.query(`
          INSERT INTO bytehunt_tab_incidents (id, session_id, team_id, team_name, timestamp, count)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [incident.id, incident.sessionId, incident.teamId, incident.teamName, incident.timestamp, incident.count]);
      } catch (err) {
        console.error('Postgres recordTabSwitchIncident error:', err);
      }
    }

    this.saveFileDatabase();
    await this.log('TAB_SWITCH_INCIDENT', `Team "${teamName}" left active hunt page (Incident #${newCount})`);

    return { incident, count: newCount, teamName };
  }

  public async getAllTabIncidents(): Promise<TabSwitchIncident[]> {
    await this.ensureInitialized();
    if (this.isPostgresReady && this.pgPool) {
      try {
        const res = await this.pgPool.query('SELECT * FROM bytehunt_tab_incidents ORDER BY timestamp DESC');
        return res.rows.map(row => ({
          id: row.id,
          sessionId: row.session_id,
          teamId: row.team_id,
          teamName: row.team_name,
          timestamp: new Date(row.timestamp).toISOString(),
          count: Number(row.count)
        }));
      } catch (err) {
        console.error('Postgres getAllTabIncidents error:', err);
      }
    }
    return [...(this.fileData.tabSwitchIncidents || [])].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public async getTabIncidentsByTeam(teamId: string): Promise<TabSwitchIncident[]> {
    const all = await this.getAllTabIncidents();
    return all.filter(i => i.teamId === teamId);
  }

  public async applyPenalty(teamId: string, penaltySeconds: number, reason?: string): Promise<{ success: boolean; penaltySeconds: number; teamName: string } | null> {
    await this.ensureInitialized();
    const team = await this.getTeam(teamId);
    if (!team) return null;

    // Update session
    const session = await this.getSessionByTeamId(teamId);
    if (session) {
      await this.updateSession(session.id, { penaltySeconds });
    }

    // Update in file results
    const resIndex = this.fileData.results.findIndex(r => r.teamId === teamId);
    if (resIndex !== -1) {
      this.fileData.results[resIndex].penaltySeconds = penaltySeconds;
      this.saveFileDatabase();
    }

    if (this.isPostgresReady && this.pgPool) {
      try {
        await this.pgPool.query(`UPDATE bytehunt_sessions SET penalty_seconds = $1 WHERE team_id = $2`, [penaltySeconds, teamId]);
        await this.pgPool.query(`UPDATE bytehunt_results SET penalty_seconds = $1 WHERE team_id = $2`, [penaltySeconds, teamId]);
      } catch (err) {
        console.error('Postgres applyPenalty error:', err);
      }
    }

    await this.log('TIME_PENALTY_APPLIED', `Admin applied ${penaltySeconds}s penalty to team "${team.name}". ${reason || ''}`);
    return { success: true, penaltySeconds, teamName: team.name };
  }
}

export const db = new DatabaseService();
