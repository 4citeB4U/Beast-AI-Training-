# Beast AI Heroes Academy - Complete Setup Guide

This guide walks you through setting up the Beast AI Heroes Academy platform with OAuth authentication, learner profiles, and proctoring capabilities.

## System Architecture Overview

```
User Browser (Port 3001)
├── Frontend (React + Vite)
│   ├── OAuthLogin Component
│   ├── Onboarding Flow
│   └── OAuth Service
│       └── Calls Backend /auth/{provider}
│
Backend Server (Port 3000)
├── Express Server
├── OAuth Gateway Service
│   ├── GitHub OAuth
│   ├── Discord OAuth
│   ├── HuggingFace OAuth
│   └── Google OAuth
├── Learner Service (Hero Profiles)
├── Proctor Service (Exam Sessions)
└── Auth Routes
    ├── /auth/:provider → Redirect to provider
    ├── /auth/:provider/callback → Token exchange
    └── /auth/:provider/session → Poll for session
```

## Prerequisites

- Node.js 18+ and npm
- OAuth provider credentials (GitHub, Discord, HuggingFace, Google)
- Git

## Part 1: Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework
- `cookie-parser` - Session cookies
- `cors` - Cross-origin requests
- `dotenv` - Environment variable loading
- `node-fetch` - HTTP requests to OAuth providers

### Step 3: Get OAuth Credentials

You need to register your application with each OAuth provider and get `Client ID` and `Client Secret`.

#### GitHub OAuth Setup

1. Go to https://github.com/settings/developers
2. Click "Personal access tokens" → "Tokens (classic)"
3. Click "Generate new token"
4. Or go to "OAuth Apps" and click "New OAuth App"
5. Fill in:
   - **Application name**: Beast AI Heroes Academy
   - **Homepage URL**: http://localhost:3001
   - **Authorization callback URL**: http://localhost:3001/auth/github/callback
6. Copy the `Client ID` and `Client Secret`

#### Discord OAuth Setup

1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Name it "Beast AI Heroes Academy"
4. Go to OAuth2 → General
5. Copy the `Client ID`
6. Click "Reset Secret" to get `Client Secret`
7. Under "Redirects", click "Add Redirect" and add:
   - http://localhost:3001/auth/discord/callback

#### HuggingFace OAuth Setup

1. Go to https://huggingface.co/settings/applications
2. Click "New Application"
3. Fill in details and set redirect URI to:
   - http://localhost:3001/auth/huggingface/callback
4. Copy the credentials

#### Google OAuth Setup

1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable the "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Select "Web application"
6. Add Authorized redirect URIs:
   - http://localhost:3001/auth/google/callback
7. Copy `Client ID` and `Client Secret`

### Step 4: Configure Environment

Create `.env.local` in the `backend` directory:

```bash
cp .env.example .env.local
```

Edit `backend/.env.local` and add your credentials:

```env
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3001

# GitHub
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Discord
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret

# HuggingFace
HF_CLIENT_ID=your_huggingface_client_id
HF_CLIENT_SECRET=your_huggingface_client_secret

# Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

SESSION_SECRET=your_super_secret_session_key_here
```

### Step 5: Start Backend Server

```bash
npm run dev
```

You should see:
```
🦸 Beast AI Heroes Academy Backend
✓ Server running on http://localhost:3000
✓ App URL: http://localhost:3001
✓ OAuth providers: GitHub, Discord, HuggingFace, Google
```

Leave this running.

## Part 2: Frontend Setup

### Step 1: Navigate to Frontend Directory

In a new terminal, from the project root:

```bash
cd ../
```

### Step 2: Create Frontend Environment File

```bash
cp .env.example .env.local
```

Edit `.env.local` and ensure it has:

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_ENABLE_RTC_CAMERA=false
APP_URL=http://localhost:3001
```

### Step 3: Install Dependencies (if not already done)

```bash
npm install
```

### Step 4: Start Frontend Dev Server

```bash
npm run dev
```

You should see:
```
VITE v6.4.2  ready in 456 ms
➜  Local:   http://localhost:3001/
```

## Part 3: Test the OAuth Flow

### Step 1: Open Frontend

Go to http://localhost:3001 in your browser.

### Step 2: Complete Onboarding

1. Read the introduction
2. Click "START ASSESSMENT"
3. Select your learning level (Beginner/Builder/Engineer)
4. Click "CONTINUE"

### Step 3: Sign In with OAuth

You should see a "Secure Sign In" section with four provider buttons:
- GitHub
- Discord
- Hugging Face
- Google

### Step 4: Click a Provider

Click any provider button:
1. A popup window should open
2. Complete sign-in at the provider
3. You'll be redirected back
4. Frontend should show "✓ Connected" for that provider
5. Backend should have created a hero profile

### Step 5: Verify Backend Logs

Check the backend terminal for messages like:
```
GET /auth/github 200 - 5.23ms
POST /auth/github/callback 200 - 145.23ms
GET /auth/github/session 200 - 2.11ms
```

## Troubleshooting

### "Failed to retrieve auth gateway URL"

**Problem**: Frontend can't reach backend

**Solutions**:
- Ensure backend is running on http://localhost:3000
- Check frontend `.env.local` has `VITE_BACKEND_URL=http://localhost:3000`
- Verify CORS settings in `backend/src/index.ts`
- Check browser console for network errors

### "Sign-in window was blocked"

**Problem**: Popup blocker prevented auth window

**Solutions**:
- Disable popup blocker for localhost:3001
- Try a different provider
- Check browser developer console for errors

### "State mismatch - possible CSRF attack"

**Problem**: Session state validation failed

**Solutions**:
- Clear all cookies for localhost
- Restart backend server
- Try again

### Provider returns "Redirect URI mismatch"

**Problem**: OAuth redirect URI configured incorrectly

**Solutions**:
- Check that redirect URI in provider dashboard matches exactly: `http://localhost:3001/auth/{provider}/callback`
- Ensure no trailing slashes
- Save changes in provider dashboard

### Backend won't start

**Problem**: Port 3000 is already in use

**Solutions**:
```bash
# Find process on port 3000
lsof -i :3000

# Or change port in .env.local
PORT=3001
```

### TypeError: process.env is undefined

**Problem**: Backend not loading environment variables

**Solutions**:
- Ensure `.env.local` exists in `backend/` directory
- Restart backend: `npm run dev`
- Verify `NODE_ENV=development` in `.env.local`

## What Happens Behind the Scenes

### 1. User Clicks Provider Button

Frontend calls:
```
GET /auth/github → Backend returns: { redirect_url: "https://github.com/login/oauth/..." }
```

### 2. OAuth Provider Authenticates

User signs in at GitHub/Discord/etc.

### 3. Provider Redirects Back

Provider redirects to:
```
http://localhost:3001/auth/github/callback?code=xxx&state=yyy
```

Backend intercepts at `/auth/:provider/callback` and:
- Validates state (CSRF protection)
- Exchanges code for access token
- Fetches user profile from provider
- Creates hero record in LearnerService
- Sets secure session cookie

### 4. Frontend Polls Session

Frontend continuously polls:
```
GET /auth/github/session
```

Returns:
```json
{
  "provider": "github",
  "username": "your_github_username",
  "email": "your@email.com",
  "avatarUrl": "https://...",
  "userId": "hero_123_456",
  "accessToken": "session_xyz"
}
```

### 5. Frontend Updates App

Frontend stores session and updates UI:
- Shows "✓ Connected" for provider
- Updates UserProgress with credentials
- Initializes learning path

## Production Deployment

### Key Changes Needed

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use strong `SESSION_SECRET`
   - Set correct `APP_URL` (your domain)
   - Update OAuth redirect URIs in provider dashboards

2. **Database**
   - Migrate from in-memory to PostgreSQL
   - See `backend/src/models/learner.ts` for schema

3. **Session Storage**
   - Migrate from in-memory to Redis
   - See `backend/src/routes/auth.ts`

4. **HTTPS**
   - Ensure all URLs use https://
   - Set `secure: true` for cookies
   - Set `sameSite: 'strict'` for cookies

5. **Monitoring**
   - Add error tracking (Sentry, etc.)
   - Monitor OAuth failure rates
   - Track session creation/deletion

## Next Steps

1. **Customize Platform**
   - Update branding/colors in components
   - Add custom curriculum
   - Configure certification programs

2. **Add Certifications**
   - Integrate with Microsoft Azure, Google Cloud, AWS
   - Set up exam metadata

3. **Enable Proctoring**
   - Implement identity verification
   - Add session recording
   - Set up anomaly detection

4. **Analytics**
   - Track learner progress
   - Monitor certification completion
   - Analyze proctoring violations

## Support Resources

- **Frontend README**: See `README.md`
- **OAuth Architecture**: See `README_OAUTH_CERTIFICATIONS.md`
- **Backend README**: See `backend/README.md`
- **API Documentation**: See `backend/src/routes/auth.ts`
- **Data Models**: See `backend/src/models/learner.ts`

---

**You're all set!** Your Beast AI Heroes Academy platform is now ready for heroes to learn and certify. 🦸‍♂️
