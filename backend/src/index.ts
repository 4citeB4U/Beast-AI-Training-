/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: PRODUCT.BEAST.BACKEND
TAG: SERVER.MAIN

5WH:
WHAT = Express server for Beast AI Heroes Academy backend
WHY = Provide OAuth gateway, hero profiles, and certification management
WHO = Leeway Innovations
WHERE = backend/src/index.ts
WHEN = 2026-04-28
HOW = Express with auth routes and learner services

AGENTS: ARIA, GOVERNOR
LICENSE: MIT
*/

import express, { Express, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth';

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app: Express = express();
const PORT = process.env.PORT || 3000;
const APP_URL = process.env.APP_URL || 'http://localhost:3001';

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: [APP_URL, 'http://localhost:3001', 'http://localhost:3000'],
  credentials: true,
}));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// OAuth routes
app.use('/auth', authRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: any, req: Request, res: Response) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🦸 Beast AI Heroes Academy Backend`);
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ App URL: ${APP_URL}`);
  console.log(`✓ OAuth providers: GitHub, Discord, HuggingFace, Google`);
});

export default app;
