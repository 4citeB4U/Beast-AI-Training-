/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: PRODUCT.BEAST.BACKEND
TAG: AUTH.ROUTES

5WH:
WHAT = Express routes for OAuth authentication gateway
WHY = Handle OAuth flow and create/resume hero profiles
WHO = Leeway Innovations
WHERE = backend/src/routes/auth.ts
WHEN = 2026-04-28
HOW = OAuth 2.0 server-side flow with hero record management

AGENTS: ARIA, GOVERNOR
LICENSE: MIT
*/

import { Router, Request, Response } from 'express';
import { OAuthGateway, type OAuthProvider, type OAuthUserData } from '../services/oauthGateway';
import { LearnerService, ProctorService } from '../models/learner';

const router = Router();

interface OAuthSession {
  state: string;
  provider: OAuthProvider;
  createdAt: number;
}

interface HeroSession {
  learnerId: string;
  oauthProvider: OAuthProvider;
  username: string;
  email?: string;
  avatar?: string;
  createdAt: number;
}

// In-memory stores (use Redis/database in production)
const oauthSessions = new Map<string, OAuthSession>();
const heroSessions = new Map<string, HeroSession>();

/**
 * Generate random state for CSRF protection
 */
function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Clean up expired sessions (every 5 minutes)
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, session] of oauthSessions.entries()) {
    if (now - session.createdAt > 10 * 60 * 1000) {
      oauthSessions.delete(key);
    }
  }
  for (const [key, session] of heroSessions.entries()) {
    if (now - session.createdAt > 24 * 60 * 60 * 1000) {
      heroSessions.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Start OAuth flow
 * GET /auth/:provider
 */
router.get('/:provider', async (req: Request, res: Response) => {
  const { provider } = req.params as { provider: string };
  
  if (!['github', 'discord', 'huggingface', 'google'].includes(provider)) {
    return res.status(400).json({ error: 'Invalid provider' });
  }

  try {
    const state = generateState();
    
    // Store state in session
    oauthSessions.set(state, {
      state,
      provider: provider as OAuthProvider,
      createdAt: Date.now(),
    });

    // Set state in cookie for validation on callback
    res.cookie(`oauth_state_${provider}`, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000, // 10 minutes
    });

    const authUrl = OAuthGateway.generateAuthUrl(provider as OAuthProvider, state);
    return res.json({ redirect_url: authUrl });
  } catch (error) {
    console.error(`OAuth start error for ${provider}:`, error);
    return res.status(500).json({ error: 'Failed to start OAuth flow' });
  }
});

/**
 * Mock login for development
 * GET /auth/:provider/mock-login
 */
router.get('/:provider/mock-login', async (req: Request, res: Response) => {
  const { provider } = req.params as { provider: string };
  const { state } = req.query as { state: string };

  if (!state) {
    return res.status(400).send('Missing state');
  }

  // Simulate a successful learner profile creation
  const mockUserData: OAuthUserData = {
    id: `mock_${provider}_${Math.floor(Math.random() * 10000)}`,
    username: `Mock Hero (${provider})`,
    email: `hero@mock-${provider}.com`,
    avatar: '',
    provider: provider as OAuthProvider,
  };

  const learner = await LearnerService.createOrResumeLearner(
    mockUserData.provider,
    mockUserData.id,
    mockUserData.username,
    mockUserData.email,
    mockUserData.avatar,
  );

  const heroSessionId = `hero_mock_${generateState()}`;
  heroSessions.set(heroSessionId, {
    learnerId: learner.id,
    oauthProvider: mockUserData.provider,
    username: mockUserData.username,
    email: mockUserData.email,
    avatar: mockUserData.avatar,
    createdAt: Date.now(),
  });

  res.cookie('hero_session', heroSessionId, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.send(`
    <div style="background: #000; color: #10b981; font-family: monospace; padding: 20px; text-align: center; border: 2px solid #10b981;">
      <h2>🦸 BEAST AI MOCK AUTH</h2>
      <p>Bypassing real OAuth for development...</p>
      <p>Logged in as: ${mockUserData.username}</p>
      <button onclick="window.opener.postMessage({ type: 'auth_success', learnerId: '${learner.id}' }, '*'); window.close();" 
              style="background: #10b981; border: none; padding: 10px 20px; font-weight: bold; cursor: pointer;">
        CONTINUE TO ACADEMY
      </button>
    </div>
  `);
});

/**
 * Handle OAuth callback
 * GET /auth/:provider/callback
 */
router.get('/:provider/callback', async (req: Request, res: Response) => {
  const { provider, code, state, error } = req.query as { provider: string; code?: string; state?: string; error?: string };

  if (!['github', 'discord', 'huggingface', 'google'].includes(provider)) {
    return res.status(400).send('Invalid provider');
  }

  if (error) {
    return res.status(400).send(`OAuth error: ${error}`);
  }

  if (!code || !state) {
    return res.status(400).send('Missing authorization code or state');
  }

  try {
    // Validate state
    const storedState = req.cookies[`oauth_state_${provider}`];
    if (!storedState || storedState !== state) {
      return res.status(400).send('State mismatch - possible CSRF attack');
    }

    // Clear state cookie
    res.clearCookie(`oauth_state_${provider}`);

    // Exchange code for token
    const token = await OAuthGateway.exchangeCodeForToken(provider as OAuthProvider, code);

    // Fetch user data
    const userData = await OAuthGateway.fetchUserData(provider as OAuthProvider, token.access_token);

    // Create or resume hero profile
    const learner = await LearnerService.createOrResumeLearner(
      userData.provider,
      userData.id,
      userData.username,
      userData.email,
      userData.avatar,
    );

    // Create hero session
    const heroSessionId = `hero_${generateState()}`;
    heroSessions.set(heroSessionId, {
      learnerId: learner.id,
      oauthProvider: userData.provider,
      username: userData.username,
      email: userData.email,
      avatar: userData.avatar,
      createdAt: Date.now(),
    });

    // Store session in cookie
    res.cookie('hero_session', heroSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Redirect to a success page or close the popup
    res.send(`
      <script>
        window.opener.postMessage({ type: 'auth_success', learnerId: '${learner.id}' }, '*');
        window.close();
      </script>
    `);
  } catch (error) {
    console.error(`OAuth callback error for ${provider}:`, error);
    res.status(500).send('Authentication failed');
  }
});

/**
 * Get current hero session
 * GET /auth/:provider/session
 */
router.get('/:provider/session', (req: Request, res: Response) => {
  const { provider } = req.params as { provider: string };
  const heroSessionId = req.cookies.hero_session;

  if (!heroSessionId) {
    return res.status(204).send();
  }

  const session = heroSessions.get(heroSessionId);
  if (!session || session.oauthProvider !== provider) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const learner = LearnerService.getLearnerById(session.learnerId);
  if (!learner) {
    return res.status(404).json({ error: 'Learner not found' });
  }

  return res.json({
    provider: session.oauthProvider,
    username: session.username,
    email: session.email,
    avatarUrl: session.avatar,
    accessToken: `session_${heroSessionId}`,
    userId: learner.id,
  });
});

/**
 * Clear hero session (logout)
 * POST /auth/logout
 */
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('hero_session');
  return res.json({ success: true });
});

/**
 * Get learner profile by session
 * GET /auth/me
 */
router.get('/me', (req: Request, res: Response) => {
  const heroSessionId = req.cookies.hero_session;

  if (!heroSessionId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const session = heroSessions.get(heroSessionId);
  if (!session) {
    return res.status(401).json({ error: 'Session expired' });
  }

  const learner = LearnerService.getLearnerById(session.learnerId);
  if (!learner) {
    return res.status(404).json({ error: 'Learner not found' });
  }

  return res.json(learner);
});

export default router;
