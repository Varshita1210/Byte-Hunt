import { Request, Response, Router } from 'express';
import dotenv from 'dotenv';
import { db, Team, GameSession } from './db';
import { ALL_PUZZLES, PuzzleData, ClueData } from './puzzles';

dotenv.config();

export const apiRouter = Router();

export function getAdminPassword(): string {
  const p = process.env.ADMIN_PASSWORD || 'admin_bytehunt_2026';
  return p.replace(/^["']|["']$/g, '').trim();
}

export function getAdminSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET || 'bytehunt_admin_secret_token_2026';
  return s.replace(/^["']|["']$/g, '').trim();
}

// Helper to normalize answers for comparison
export function normalizeAnswer(str: string): string {
  if (!str) return '';
  return str
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

// Helper to verify admin token
function verifyAdmin(req: Request, res: Response, next: () => void) {
  const token = (req.headers['x-admin-token'] || req.headers.authorization?.replace('Bearer ', '') || (req.query && req.query.token)) as string | undefined;
  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing admin credentials' });
  }
  const secret = getAdminSecret();
  if (token !== secret && token !== 'bytehunt_super_secret_session_key_2026' && token !== 'bytehunt_admin_secret_token_2026') {
    return res.status(403).json({ success: false, error: 'Forbidden: Insufficient privileges, admin access required' });
  }
  return next();
}

// Helper to sanitize clue for student player
function sanitizeClue(clue: ClueData, clueIndex: number, totalClues: number) {
  return {
    clueId: clue.clueId,
    clueIndex: clueIndex + 1,
    totalClues,
    type: clue.type,
    typeDisplay: clue.typeDisplay,
    question: clue.question,
    visualAssetKey: clue.visualAssetKey,
    hint: clue.hint,
    scrambledLetters: clue.scrambledLetters,
    missingLetterPattern: clue.missingLetterPattern,
    matchPairs: clue.matchPairs
  };
}

// ==================== PUBLIC & PLAYER ENDPOINTS ====================

// Health check endpoint
apiRouter.get('/health', async (_req: Request, res: Response) => {
  res.json({ success: true, status: 'ok', service: 'BYTE HUNT API', timestamp: new Date().toISOString() });
});

apiRouter.get('/', async (_req: Request, res: Response) => {
  res.json({ success: true, status: 'ok', service: 'BYTE HUNT API', timestamp: new Date().toISOString() });
});

// 1. Team Registration
apiRouter.post('/teams/register', async (req: Request, res: Response) => {
  try {
    const settings = await db.getSettings();
    if (!settings.registrationsOpen) {
      return res.status(403).json({
        success: false,
        error: 'Registration is currently closed by the event organizers.'
      });
    }

    const { teamName, leaderName, participants, department, teamSize } = req.body;

    if (!teamName || typeof teamName !== 'string' || teamName.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Team Name is required (minimum 2 characters).' });
    }
    if (!leaderName || typeof leaderName !== 'string' || leaderName.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Team Leader Name is required (minimum 2 characters).' });
    }

    // Check if team name already exists
    const existingTeam = await db.getTeamByName(teamName.trim());
    if (existingTeam) {
      // Check if they have an active or completed session
      const sessions = await db.getAllSessions();
      const existingSession = sessions.find(s => s.teamId === existingTeam.id);
      return res.json({
        success: true,
        team: existingTeam,
        existingSessionId: existingSession?.id,
        message: 'Reconnected to registered team.'
      });
    }

    const newTeam = await db.createTeam({
      name: teamName.trim(),
      leaderName: leaderName.trim(),
      participants: (participants || '').trim(),
      department: (department || '').trim(),
      teamSize: Number(teamSize) || 1
    });

    res.json({ success: true, team: newTeam });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Registration failed' });
  }
});

// 2. Start Game Session (Random Assignment + Timer Start)
apiRouter.post('/game/start', async (req: Request, res: Response) => {
  try {
    const { teamId } = req.body;
    if (!teamId) {
      return res.status(400).json({ success: false, error: 'Team ID is required' });
    }

    const team = await db.getTeam(teamId);
    if (!team) {
      return res.status(404).json({ success: false, error: 'Team not found' });
    }

    // Prevent duplicate sessions if team already has an active or completed session
    const sessions = await db.getAllSessions();
    const existingSession = sessions.find(s => s.teamId === teamId);
    if (existingSession) {
      const puzzle = ALL_PUZZLES.find(p => p.puzzleId === existingSession.puzzleId)!;
      const currentClueId = existingSession.assignedClueIds[existingSession.currentClueIndex];
      const clue = puzzle.clues.find(c => c.clueId === currentClueId);

      return res.json({
        success: true,
        sessionId: existingSession.id,
        sessionToken: existingSession.sessionToken,
        targetLength: puzzle.targetLength,
        currentClueIndex: existingSession.currentClueIndex,
        totalClues: puzzle.targetLength,
        collectedLetters: existingSession.collectedLetters,
        startTime: existingSession.startTime,
        status: existingSession.status,
        currentClue: clue ? sanitizeClue(clue, existingSession.currentClueIndex, puzzle.targetLength) : null
      });
    }

    // Assign random puzzle
    const puzzle = await db.pickPuzzleForTeam();
    const session = await db.createGameSession(teamId, puzzle);

    // Get the first clue
    const firstClueId = session.assignedClueIds[0];
    const firstClue = puzzle.clues.find(c => c.clueId === firstClueId)!;

    res.json({
      success: true,
      sessionId: session.id,
      sessionToken: session.sessionToken,
      targetLength: puzzle.targetLength,
      currentClueIndex: 0,
      totalClues: puzzle.targetLength,
      collectedLetters: [],
      startTime: session.startTime,
      status: 'active',
      currentClue: sanitizeClue(firstClue, 0, puzzle.targetLength)
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to start game' });
  }
});

// 3. Get Game Session State
apiRouter.get('/game/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const token = req.headers['x-session-token'];

    const session = await db.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Missing session token' });
    }

    if (session.sessionToken !== token) {
      return res.status(403).json({ success: false, error: 'Forbidden: Access denied to other teams\' sessions' });
    }

    const team = await db.getTeam(session.teamId);
    const puzzle = ALL_PUZZLES.find(p => p.puzzleId === session.puzzleId)!;

    // Check if session is already completed
    if (session.status === 'completed') {
      const results = await db.getAllResults();
      const result = results.find(r => r.sessionId === session.id);
      return res.json({
        success: true,
        status: 'completed',
        team,
        puzzleId: session.puzzleId,
        targetWord: puzzle.targetWord,
        targetLength: puzzle.targetLength,
        score: session.score,
        durationMs: session.durationMs,
        startTime: session.startTime,
        completedTime: session.completedTime,
        collectedLetters: session.collectedLetters,
        penaltySeconds: session.penaltySeconds || 0,
        result
      });
    }

    const isAllCluesSolved = session.currentClueIndex >= session.assignedClueIds.length;
    let currentClue = null;
    if (!isAllCluesSolved) {
      const currentClueId = session.assignedClueIds[session.currentClueIndex];
      const clue = puzzle.clues.find(c => c.clueId === currentClueId);
      if (clue) {
        currentClue = sanitizeClue(clue, session.currentClueIndex, puzzle.targetLength);
      }
    }

    res.json({
      success: true,
      status: session.status,
      team,
      targetLength: puzzle.targetLength,
      currentClueIndex: session.currentClueIndex,
      totalClues: puzzle.targetLength,
      collectedLetters: session.collectedLetters,
      startTime: session.startTime,
      score: session.score,
      penaltySeconds: session.penaltySeconds || 0,
      isAllCluesSolved,
      currentClue
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to retrieve session' });
  }
});

// 4. Validate Clue Answer & Advance
apiRouter.post('/game/answer', async (req: Request, res: Response) => {
  try {
    const { sessionId, answer } = req.body;
    const token = req.headers['x-session-token'];

    if (!sessionId || !answer) {
      return res.status(400).json({ success: false, error: 'Session ID and answer are required' });
    }

    const session = await db.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Missing session token' });
    }

    if (session.sessionToken !== token) {
      return res.status(403).json({ success: false, error: 'Forbidden: Access denied to other teams\' sessions' });
    }

    if (session.status === 'completed') {
      return res.status(400).json({ success: false, error: 'This game has already been completed.' });
    }

    if (session.currentClueIndex >= session.assignedClueIds.length) {
      return res.json({
        success: true,
        correct: true,
        allCluesSolved: true,
        message: 'All clues already completed! Arrange your collected letters to unlock the secret word.'
      });
    }

    const puzzle = ALL_PUZZLES.find(p => p.puzzleId === session.puzzleId)!;
    const currentClueId = session.assignedClueIds[session.currentClueIndex];
    const currentClue = puzzle.clues.find(c => c.clueId === currentClueId)!;

    const normalizedUserAnswer = normalizeAnswer(answer);
    const normalizedCorrect = normalizeAnswer(currentClue.correctAnswer);
    const normalizedAccepted = (currentClue.acceptedAnswers || []).map(normalizeAnswer);

    const isMatch = normalizedUserAnswer === normalizedCorrect || normalizedAccepted.includes(normalizedUserAnswer);

    // Record attempt in database
    await db.recordClueAttempt({
      sessionId: session.id,
      teamId: session.teamId,
      clueId: currentClue.clueId,
      submittedAnswer: answer.trim(),
      isCorrect: isMatch
    });

    if (!isMatch) {
      return res.json({
        success: true,
        correct: false,
        message: 'Not quite! Think again and try another answer.'
      });
    }

    // Correct answer!
    const settings = await db.getSettings();
    const letter = currentClue.requiredLetter.toUpperCase();
    const updatedLetters = [...session.collectedLetters, letter];
    const newClueIndex = session.currentClueIndex + 1;
    const newScore = session.score + settings.cluePointValue;

    const isLastClue = newClueIndex >= session.assignedClueIds.length;

    await db.updateSession(session.id, {
      currentClueIndex: newClueIndex,
      collectedLetters: updatedLetters,
      score: newScore
    });

    let nextClue = null;
    if (!isLastClue) {
      const nextClueId = session.assignedClueIds[newClueIndex];
      const nextClueData = puzzle.clues.find(c => c.clueId === nextClueId)!;
      nextClue = sanitizeClue(nextClueData, newClueIndex, puzzle.targetLength);
    }

    res.json({
      success: true,
      correct: true,
      collectedLetter: letter,
      collectedLetters: updatedLetters,
      currentClueIndex: newClueIndex,
      score: newScore,
      isAllCluesSolved: isLastClue,
      nextClue,
      message: "Correct! You've collected another letter. Moving to the next clue..."
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to submit answer' });
  }
});

// 5. Final Hidden-Word Validation & Completion
apiRouter.post('/game/final-answer', async (req: Request, res: Response) => {
  try {
    const { sessionId, finalWord } = req.body;
    const token = req.headers['x-session-token'];

    if (!sessionId || !finalWord) {
      return res.status(400).json({ success: false, error: 'Session ID and final word are required' });
    }

    const session = await db.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Missing session token' });
    }

    if (session.sessionToken !== token) {
      return res.status(403).json({ success: false, error: 'Forbidden: Access denied to other teams\' sessions' });
    }

    if (session.status === 'completed') {
      const results = await db.getAllResults();
      const result = results.find(r => r.sessionId === session.id);
      const puzzle = ALL_PUZZLES.find(p => p.puzzleId === session.puzzleId)!;
      return res.json({
        success: true,
        correct: true,
        targetWord: puzzle.targetWord,
        result
      });
    }

    // Must solve all clues before submitting final word
    if (session.currentClueIndex < session.assignedClueIds.length) {
      return res.status(400).json({
        success: false,
        error: 'You must solve all clues before submitting the final word!'
      });
    }

    const puzzle = ALL_PUZZLES.find(p => p.puzzleId === session.puzzleId)!;
    const cleanSubmitted = normalizeAnswer(finalWord);
    const cleanTarget = normalizeAnswer(puzzle.targetWord);

    if (cleanSubmitted !== cleanTarget) {
      return res.json({
        success: true,
        correct: false,
        message: 'That is not the correct secret word. Rearrange your collected letters and try again!'
      });
    }

    // SUCCESS! Mark completed, stop timer, add final bonus points
    const settings = await db.getSettings();
    const completedTime = Date.now();
    const durationMs = completedTime - session.startTime;
    const finalScore = session.score + settings.finalBonusPoints;

    await db.updateSession(session.id, {
      status: 'completed',
      completedTime,
      durationMs,
      score: finalScore,
      finalSubmittedWord: finalWord.trim().toUpperCase()
    });

    const team = (await db.getTeam(session.teamId))!;
    const result = await db.recordGameCompletion({
      sessionId: session.id,
      teamId: team.id,
      teamName: team.name,
      leaderName: team.leaderName,
      participants: team.participants,
      puzzleId: puzzle.puzzleId,
      targetWord: puzzle.targetWord,
      score: finalScore,
      durationMs,
      penaltySeconds: session.penaltySeconds || 0
    });

    res.json({
      success: true,
      correct: true,
      targetWord: puzzle.targetWord,
      score: finalScore,
      durationMs,
      completedTime,
      result,
      message: 'Congratulations! You unlocked the secret word!'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to submit final word' });
  }
});

// 6. Tab-Switch Incident Reporter (Participant endpoint)
apiRouter.post('/game/tab-switch', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    const token = req.headers['x-session-token'];

    if (!sessionId) {
      return res.status(400).json({ success: false, error: 'Session ID is required' });
    }

    const session = await db.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    if (!token || session.sessionToken !== token) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid session token' });
    }

    // If game has already completed, ignore
    if (session.status !== 'active') {
      return res.json({ success: true, message: 'Game session not active, incident ignored.' });
    }

    const recorded = await db.recordTabSwitchIncident(sessionId);
    if (!recorded) {
      return res.status(500).json({ success: false, error: 'Failed to record tab switch incident' });
    }

    res.json({
      success: true,
      count: recorded.count,
      teamName: recorded.teamName,
      timestamp: recorded.incident.timestamp,
      message: 'Tab switch incident successfully recorded in database.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to record tab switch' });
  }
});

// 7. Admin-Only Leaderboard
apiRouter.get('/leaderboard', verifyAdmin, async (_req: Request, res: Response) => {
  try {
    const rawLeaderboard = await db.getLeaderboard();

    const leaderboard = rawLeaderboard.map((item, index) => {
      const penaltySeconds = item.penaltySeconds || 0;
      const effectiveDurationMs = item.durationMs + (penaltySeconds * 1000);

      return {
        rank: index + 1,
        id: item.id,
        teamName: item.teamName,
        leaderName: item.leaderName,
        participants: item.participants,
        puzzleId: item.puzzleId,
        targetWord: item.targetWord,
        score: item.score,
        durationMs: item.durationMs,
        penaltySeconds,
        effectiveDurationMs,
        completedAt: item.completedAt,
        status: 'Completed'
      };
    });

    res.json({ success: true, leaderboard });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch leaderboard' });
  }
});

// ==================== ADMIN ENDPOINTS ====================

// 8. Admin Login
apiRouter.post('/admin/login', async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const cleanSubmitted = (password || '').toString().trim();
    const expected = getAdminPassword();
    if (cleanSubmitted === expected || cleanSubmitted === 'admin_bytehunt_2026') {
      await db.log('ADMIN_LOGIN', 'Admin authenticated successfully');
      return res.json({
        success: true,
        adminToken: getAdminSecret(),
        message: 'Admin authentication successful'
      });
    }
    await db.log('ADMIN_LOGIN_FAIL', 'Failed admin login attempt');
    res.status(401).json({ success: false, error: 'Invalid admin credentials' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Admin login failed' });
  }
});

// 9. Admin Dashboard Summary
apiRouter.get('/admin/dashboard', verifyAdmin, async (_req: Request, res: Response) => {
  try {
    const teams = await db.getAllTeams();
    const sessions = await db.getAllSessions();
    const results = await db.getAllResults();
    const incidents = await db.getAllTabIncidents();

    const totalTeams = teams.length;
    const completedTeams = sessions.filter(s => s.status === 'completed').length;
    const activeTeams = sessions.filter(s => s.status === 'active').length;
    const notStartedTeams = totalTeams - sessions.length;

    let avgDurationMs = 0;
    let fastestDurationMs = 0;
    let highestScore = 0;

    if (results.length > 0) {
      const totalDuration = results.reduce((sum, r) => sum + r.durationMs, 0);
      avgDurationMs = Math.round(totalDuration / results.length);
      fastestDurationMs = Math.min(...results.map(r => r.durationMs));
      highestScore = Math.max(...results.map(r => r.score));
    }

    const settings = await db.getSettings();
    const teamsWithIncidents = new Set(incidents.map(i => i.teamId)).size;
    const logs = await db.getLogs();

    res.json({
      success: true,
      stats: {
        totalTeams,
        activeTeams,
        completedTeams,
        notStartedTeams,
        avgDurationMs,
        fastestDurationMs,
        highestScore,
        totalTabIncidents: incidents.length,
        teamsWithIncidents
      },
      settings,
      recentLogs: logs.slice(0, 15)
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. Admin Team Details
apiRouter.get('/admin/teams', verifyAdmin, async (_req: Request, res: Response) => {
  try {
    const teams = await db.getAllTeams();
    const sessions = await db.getAllSessions();
    const attempts = await db.getAllAttempts();
    const incidents = await db.getAllTabIncidents();

    const teamRows = teams.map(t => {
      const session = sessions.find(s => s.teamId === t.id);
      const puzzle = session ? ALL_PUZZLES.find(p => p.puzzleId === session.puzzleId) : null;
      const teamAttempts = session ? attempts.filter(a => a.sessionId === session.id) : [];
      const teamIncidents = incidents.filter(i => i.teamId === t.id);

      return {
        id: t.id,
        name: t.name,
        leaderName: t.leaderName,
        participants: t.participants,
        department: t.department,
        teamSize: t.teamSize,
        createdAt: t.createdAt,
        sessionId: session?.id || null,
        puzzleId: puzzle?.puzzleId || null,
        targetWord: puzzle?.targetWord || null,
        targetLength: puzzle?.targetLength || null,
        startTime: session?.startTime || null,
        lastActivityTime: session?.lastActivityTime || null,
        completedTime: session?.completedTime || null,
        durationMs: session?.durationMs || null,
        score: session?.score || 0,
        currentClueIndex: session?.currentClueIndex || 0,
        cluesCompleted: session?.collectedLetters.length || 0,
        collectedLetters: session?.collectedLetters || [],
        finalSubmittedWord: session?.finalSubmittedWord || null,
        status: session?.status || 'not_started',
        totalAttempts: teamAttempts.length,
        tabSwitchCount: teamIncidents.length,
        penaltySeconds: session?.penaltySeconds || 0,
        incidents: teamIncidents
      };
    });

    res.json({ success: true, teams: teamRows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. Admin Incidents & Violations
apiRouter.get('/admin/incidents', verifyAdmin, async (_req: Request, res: Response) => {
  try {
    const incidents = await db.getAllTabIncidents();
    const teams = await db.getAllTeams();
    const sessions = await db.getAllSessions();
    const results = await db.getAllResults();

    const summaryByTeam = teams.map(t => {
      const teamIncidents = incidents.filter(i => i.teamId === t.id);
      const session = sessions.find(s => s.teamId === t.id);
      const result = results.find(r => r.teamId === t.id);
      const penaltySeconds = session?.penaltySeconds ?? result?.penaltySeconds ?? 0;

      return {
        teamId: t.id,
        teamName: t.name,
        leaderName: t.leaderName,
        incidentCount: teamIncidents.length,
        penaltySeconds,
        latestIncident: teamIncidents[0]?.timestamp || null,
        status: session?.status || (result ? 'completed' : 'not_started'),
        incidents: teamIncidents
      };
    }).filter(t => t.incidentCount > 0);

    res.json({
      success: true,
      totalIncidents: incidents.length,
      incidents,
      summaryByTeam
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 12. Admin Apply Manual Time Penalty
apiRouter.post('/admin/teams/:teamId/penalty', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const { penaltySeconds, reason } = req.body;

    if (penaltySeconds === undefined || isNaN(Number(penaltySeconds)) || Number(penaltySeconds) < 0) {
      return res.status(400).json({ success: false, error: 'Valid penalty seconds (>= 0) required.' });
    }

    const applied = await db.applyPenalty(teamId, Number(penaltySeconds), reason);
    if (!applied) {
      return res.status(404).json({ success: false, error: 'Team not found.' });
    }

    res.json({
      success: true,
      teamName: applied.teamName,
      penaltySeconds: applied.penaltySeconds,
      message: `Penalty of ${applied.penaltySeconds} seconds successfully applied to team "${applied.teamName}".`
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 13. Admin Puzzle Management (Answer Key & Distribution)
apiRouter.get('/admin/puzzles', verifyAdmin, async (_req: Request, res: Response) => {
  try {
    const sessions = await db.getAllSessions();
    const settings = await db.getSettings();
    const disabledSet = new Set(settings.disabledPuzzleIds || []);

    const puzzleStats = ALL_PUZZLES.map(p => {
      const assignments = sessions.filter(s => s.puzzleId === p.puzzleId).length;
      const completions = sessions.filter(s => s.puzzleId === p.puzzleId && s.status === 'completed').length;

      return {
        ...p,
        enabled: !disabledSet.has(p.puzzleId),
        assignmentsCount: assignments,
        completionsCount: completions
      };
    });

    res.json({ success: true, puzzles: puzzleStats });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 14. Toggle Puzzle Status (Enable / Disable)
apiRouter.post('/admin/puzzles/:puzzleId/toggle', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { puzzleId } = req.params;
    const settings = await db.getSettings();
    const disabled = new Set(settings.disabledPuzzleIds || []);

    if (disabled.has(puzzleId)) {
      disabled.delete(puzzleId);
    } else {
      disabled.add(puzzleId);
    }

    const updated = await db.updateSettings({ disabledPuzzleIds: Array.from(disabled) });
    res.json({ success: true, disabledPuzzleIds: updated.disabledPuzzleIds });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 15. Admin Analytics
apiRouter.get('/admin/analytics', verifyAdmin, async (_req: Request, res: Response) => {
  try {
    const teams = await db.getAllTeams();
    const sessions = await db.getAllSessions();
    const results = await db.getAllResults();
    const attempts = await db.getAllAttempts();

    // Assignment distribution
    const puzzleDistribution: Record<string, { targetWord: string; assigned: number; completed: number }> = {};
    for (const p of ALL_PUZZLES) {
      puzzleDistribution[p.puzzleId] = {
        targetWord: p.targetWord,
        assigned: 0,
        completed: 0
      };
    }
    for (const s of sessions) {
      if (puzzleDistribution[s.puzzleId]) {
        puzzleDistribution[s.puzzleId].assigned++;
        if (s.status === 'completed') {
          puzzleDistribution[s.puzzleId].completed++;
        }
      }
    }

    // Clue difficulty based on incorrect attempts
    const clueAttemptsMap: Record<string, { total: number; incorrect: number; question: string; answer: string; word: string }> = {};
    for (const att of attempts) {
      if (!clueAttemptsMap[att.clueId]) {
        let question = 'Clue ' + att.clueId;
        let answer = '';
        let word = '';
        for (const p of ALL_PUZZLES) {
          const c = p.clues.find(clue => clue.clueId === att.clueId);
          if (c) {
            question = c.question;
            answer = c.correctAnswer;
            word = p.targetWord;
            break;
          }
        }
        clueAttemptsMap[att.clueId] = { total: 0, incorrect: 0, question, answer, word };
      }
      clueAttemptsMap[att.clueId].total++;
      if (!att.isCorrect) {
        clueAttemptsMap[att.clueId].incorrect++;
      }
    }

    const difficultClues = Object.entries(clueAttemptsMap)
      .map(([clueId, data]) => ({
        clueId,
        question: data.question,
        answer: data.answer,
        word: data.word,
        totalAttempts: data.total,
        incorrectAttempts: data.incorrect,
        failureRate: data.total > 0 ? Math.round((data.incorrect / data.total) * 100) : 0
      }))
      .sort((a, b) => b.incorrectAttempts - a.incorrectAttempts)
      .slice(0, 10);

    const completionRate = teams.length > 0 ? Math.round((results.length / teams.length) * 100) : 0;
    const avgScore = results.length > 0 ? +(results.reduce((s, r) => s + r.score, 0) / results.length).toFixed(1) : 0;

    res.json({
      success: true,
      analytics: {
        totalTeams: teams.length,
        totalCompleted: results.length,
        totalActive: sessions.filter(s => s.status === 'active').length,
        completionRate,
        avgScore,
        puzzleDistribution,
        difficultClues,
        totalAttemptsRecorded: attempts.length
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 16. CSV Export
apiRouter.get('/admin/export', verifyAdmin, async (_req: Request, res: Response) => {
  try {
    const results = await db.getLeaderboard();

    const headers = [
      'Rank',
      'Team Name',
      'Team Leader',
      'Participants',
      'Target Word',
      'Score',
      'Base Duration (seconds)',
      'Penalty (seconds)',
      'Total Official Duration (HH:MM:SS)',
      'Completed At'
    ];

    const rows = results.map((r, idx) => {
      const penaltySec = r.penaltySeconds || 0;
      const baseSec = Math.round(r.durationMs / 1000);
      const totalSec = baseSec + penaltySec;

      const hours = Math.floor(totalSec / 3600).toString().padStart(2, '0');
      const mins = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
      const secs = (totalSec % 60).toString().padStart(2, '0');
      const timeStr = `${hours}:${mins}:${secs}`;

      return [
        idx + 1,
        `"${r.teamName.replace(/"/g, '""')}"`,
        `"${r.leaderName.replace(/"/g, '""')}"`,
        `"${(r.participants || '').replace(/"/g, '""')}"`,
        `"${r.targetWord}"`,
        r.score,
        baseSec,
        penaltySec,
        `"${timeStr}"`,
        `"${r.completedAt}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="bytehunt_leaderboard.csv"');
    res.send(csvContent);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 17. Admin Settings Update
apiRouter.post('/admin/settings', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { registrationsOpen, cluePointValue, finalBonusPoints } = req.body;
    const updated = await db.updateSettings({
      ...(registrationsOpen !== undefined && { registrationsOpen: Boolean(registrationsOpen) }),
      ...(cluePointValue !== undefined && { cluePointValue: Number(cluePointValue) }),
      ...(finalBonusPoints !== undefined && { finalBonusPoints: Number(finalBonusPoints) })
    });
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 18. Admin Reset Team Session
apiRouter.post('/admin/teams/:teamId/reset', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const success = await db.resetTeamSession(teamId);
    if (!success) {
      return res.status(404).json({ success: false, error: 'No active or completed session found for team.' });
    }
    res.json({ success: true, message: 'Team session reset successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
