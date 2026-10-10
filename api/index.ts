import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { apiRouter } from '../server/api';
import { db } from '../server/db';

dotenv.config();

const app = express();

// Safe body parsing:
// On Vercel, the serverless runtime might have already parsed the request stream into req.body.
// Attempting to run express.json() on an already consumed stream will cause the request to hang indefinitely!
// If req.body is already an object, skip express.json. Otherwise, invoke express.json.
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.body !== undefined && typeof req.body === 'object') {
    return next();
  }
  express.json({ limit: '10mb' })(req, _res, (err) => {
    if (err) {
      console.warn('[Vercel API] express.json warning:', err.message);
    }
    next();
  });
});

app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.body !== undefined && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    return next();
  }
  express.urlencoded({ extended: true })(req, _res, (err) => {
    if (err) {
      console.warn('[Vercel API] express.urlencoded warning:', err.message);
    }
    next();
  });
});

// Ensure database is initialized before any route handler executes
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    await db.ensureInitialized();
  } catch (err: any) {
    console.error('[BYTE HUNT API] DB initialization warning:', err.message);
  }
  next();
});

// Mount routes on both '/api' and '/'
// This ensures compatibility whether Vercel rewrites to /api or retains /api in req.url
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Export Express app for Vercel Serverless Functions
export default app;
