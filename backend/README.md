# Beast AI Heroes Academy - Backend OAuth Gateway

This is the backend authentication gateway for Beast AI Heroes Academy. It handles server-side OAuth flows, learner profile management, and proctoring session tracking.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your OAuth credentials:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your provider credentials:

```env
# OAuth Credentials (get from provider dashboards)
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret

HF_CLIENT_ID=your_client_id
HF_CLIENT_SECRET=your_client_secret

GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# URLs
APP_URL=http://localhost:3001
PORT=3000
NODE_ENV=development
```

### 3. Start Backend Development Server

```bash
npm run dev
```

The backend will start on `http://localhost:3000`.

### 4. Update Frontend Configuration

In the frontend root `.env.local`, ensure:

```env
VITE_BACKEND_URL=http://localhost:3000
```

Then start the frontend dev server:

```bash
npm run dev
```

The frontend will start on `http://localhost:3001`.

## Architecture

### OAuth Flow

1. **Frontend User Clicks Provider Button** → Calls `GET /auth/:provider`
2. **Backend Generates Auth URL** → Returns redirect URL to provider
3. **User Completes Sign-In** → Provider redirects to `GET /auth/:provider/callback`
4. **Backend Exchanges Code for Token** → Fetches user data from provider
5. **Backend Creates Hero Profile** → Links OAuth identity to learner record
6. **Frontend Polls Session** → `GET /auth/:provider/session` until success
7. **Session Returned** → Hero profile with credentials stored

### Key Endpoints

- `GET /auth/:provider` - Start OAuth flow (returns redirect URL)
- `GET /auth/:provider/callback?code=...` - OAuth callback handler
- `GET /auth/:provider/session` - Poll for authenticated session
- `POST /auth/logout` - Clear session
- `GET /auth/me` - Get current hero profile
- `GET /health` - Server health check

### Data Models

#### LearnerProfile

```typescript
{
  id: string;
  oauthProvider: 'github' | 'discord' | 'huggingface' | 'google';
  oauthId: string;
  username: string;
  email?: string;
  avatar?: string;
  level?: 'beginner' | 'builder' | 'engineer';
  xp: number;
  streak: number;
  badges: string[];
  enrolledCertifications: string[];
  certificationProgress: Record<string, CertificationProgress>;
  createdAt: ISO8601 timestamp;
  lastAccessedAt: ISO8601 timestamp;
  isActive: boolean;
}
```

#### ProctorSession

```typescript
{
  id: string;
  learnerId: string;
  certId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'flagged' | 'verified';
  startedAt?: ISO8601 timestamp;
  endedAt?: ISO8601 timestamp;
  durationSeconds?: number;
  identityVerified: boolean;
  identityVerificationMethod?: 'photo_id' | 'facial_recognition' | 'liveness';
  recordingUrl?: string;
  recordingEncrypted: boolean;
  anomaliesDetected: string[];
  flaggedActivities: FlaggedActivity[];
  score?: number;
  passed?: boolean;
}
```

## Setting Up OAuth Providers

### GitHub

1. Go to `https://github.com/settings/developers`
2. Click "New OAuth App"
3. Fill in application details:
   - **Authorization callback URL**: `http://localhost:3001/auth/github/callback`
4. Copy `Client ID` and `Client Secret` to `.env.local`

### Discord

1. Go to `https://discord.com/developers/applications`
2. Click "New Application"
3. Go to OAuth2 tab, copy Client ID
4. Add redirect: `http://localhost:3001/auth/discord/callback`
5. Copy `Client ID` and `Client Secret` to `.env.local`

### HuggingFace

1. Go to `https://huggingface.co/settings/tokens`
2. Create new token with `api` scope
3. Go to `https://huggingface.co/settings/applications`
4. Add OAuth app with redirect: `http://localhost:3001/auth/huggingface/callback`
5. Copy credentials to `.env.local`

### Google

1. Go to `https://console.cloud.google.com/`
2. Create new project
3. Enable OAuth 2.0 consent screen
4. Create OAuth 2.0 Client ID (Web application)
5. Add authorized redirect URI: `http://localhost:3001/auth/google/callback`
6. Copy `Client ID` and `Client Secret` to `.env.local`

## Database Integration (Future)

Currently uses in-memory storage. To migrate to PostgreSQL:

1. Create database schema (see `backend/schema.sql`)
2. Replace `LearnerService` and `ProctorService` with database implementations
3. Update `backend/src/models/learner.ts` to use database queries

## Security Considerations

- **Never expose OAuth secrets** - Always keep in backend `.env`
- **CORS restricted** - Frontend origin must be whitelisted
- **Session cookies** - `httpOnly`, `secure`, `sameSite` flags set
- **CSRF protection** - State parameter validated on callback
- **Token expiration** - Sessions expire after 24 hours

## Building & Deployment

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Docker Deployment (Example)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### "Failed to retrieve auth gateway URL"

- Ensure backend is running on the configured `VITE_BACKEND_URL`
- Check CORS settings in `backend/src/index.ts`
- Verify frontend origin is whitelisted

### "State mismatch - possible CSRF attack"

- Clear browser cookies
- Verify `APP_URL` in backend `.env` matches where OAuth redirects expect
- Check that state is being properly stored and validated

### "Session not found"

- Ensure `credentials: 'include'` on frontend fetch requests
- Check that cookies are being set with `httpOnly: true`
- Verify same-site domain configuration

## Support

For issues or questions, refer to:
- Frontend README: `../README.md`
- OAuth Documentation: `../README_OAUTH_CERTIFICATIONS.md`
- Architecture Docs: `../LeeWay-Standards/`
