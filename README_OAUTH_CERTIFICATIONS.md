<!--
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: PRODUCT.BEAST.DOCUMENTATION
TAG: DOCS.OAUTH_CERTIFICATION_ARCHITECTURE

5WH:
WHAT = OAuth Authentication & Embedded Certification System Architecture
WHY = Enable seamless user authentication and embedded industry certifications
WHO = Leeway Innovations
WHERE = README_OAUTH_CERTIFICATIONS.md
WHEN = 2026-04-28
HOW = OAuth 2.0 flows with embedded certification platform integration

AGENTS: ARIA, GOVERNOR
LICENSE: MIT
-->

# BEAST AI Learning Platform: OAuth & Certification Integration Guide

## Overview

The BEAST AI Learning Platform integrates OAuth 2.0 authentication with embedded certification platforms, allowing users to authenticate via their preferred developer accounts and access industry certifications directly within the application without leaving to external websites.

## Architecture

### 1. Authentication Flow (OAuth 2.0)

The platform supports four OAuth providers:

- **GitHub** - Developer portfolio and code repository access
- **Discord** - Community and social connections
- **HuggingFace** - ML model and dataset ecosystem
- **Google** - Enterprise authentication and ecosystem integration

#### Flow Diagram

```
User → OAuth Provider Selection
   ↓
   → Provider Authorization Screen
   ↓
   → Authorization Code Returned
   ↓
   → Token Exchange (access_token + refresh_token)
   ↓
   → User Data Fetch
   ↓
   → Account Storage in localStorage
   ↓
   → Curriculum Initialization
```

### 2. Component Architecture

#### OAuth Service (`src/services/oauth.ts`)

Handles all OAuth operations:

```typescript
class OAuthService {
  // Initiate OAuth flow with provider
  static initiateLogin(provider: OAuthProvider): void
  
  // Handle OAuth callback and token exchange
  static async handleCallback(provider: OAuthProvider, code: string): Promise<OAuthAccount>
  
  // Token management
  static async refreshToken(account: OAuthAccount): Promise<OAuthAccount>
  
  // Account storage
  static storeAccount(account: OAuthAccount): void
  static getStoredAccounts(): OAuthAccount[]
  static getAccount(provider: OAuthProvider): OAuthAccount | undefined
}
```

#### OAuth Login Component (`src/components/OAuthLogin.tsx`)

Visual interface for OAuth authentication:

- OAuth provider buttons (GitHub, Discord, HuggingFace, Google)
- Connected accounts display
- Token validation and expiry handling
- Session state management

#### Onboarding Flow (`src/views/Onboarding.tsx`)

Three-step user initialization:

1. **Step 1**: Introduction and assessment start
2. **Step 2**: Learning path selection (Beginner, Builder, Engineer)
3. **Step 3**: OAuth authentication and account linking

### 3. State Management

#### Updated UserProgress Interface (`src/types.ts`)

```typescript
interface UserProgress {
  // ... existing fields ...
  credentials?: {
    // OAuth fields
    oauthProvider?: 'github' | 'discord' | 'huggingface' | 'google';
    oauthUsername?: string;
    oauthEmail?: string;
    oauthUserId?: string;
    // Legacy fields (deprecated)
    githubUsername?: string;
    hfUsername?: string;
    discordUsername?: string;
  };
}
```

#### AppContext Updates (`src/AppContext.tsx`)

```typescript
updateCredentials(creds: Partial<UserProgress['credentials']>): void
```

## Hosted Authentication Contract

End users never see provider app IDs, never enter OAuth codes, and never type platform credentials into BEAST. The application expects hosted authentication routes that hand sign-in and sign-up off to the provider and then return an authenticated session to the platform.

### Required Auth Routes

```text
GET /auth/github
GET /auth/discord
GET /auth/huggingface
GET /auth/google

GET /auth/github/session
GET /auth/discord/session
GET /auth/huggingface/session
GET /auth/google/session
```

### Runtime Behavior

1. The learner clicks a provider button in BEAST.
2. The app opens the hosted auth route for that provider.
3. The provider handles sign-in or sign-up in its own secure flow.
4. The backend or gateway resolves the authenticated session.
5. BEAST polls the matching `/session` endpoint and resumes the learner automatically.

## Certification Integration Architecture

### Supported Certification Providers

1. **Microsoft** - Azure certifications and fundamentals
2. **Google Cloud** - Cloud Associate and specialization certifications
3. **AWS** - Solutions Architect and developer certifications

### Embedded Integration Approach

Rather than redirecting users to external certification platforms, the system embeds certification experiences:

#### Integration Methods

##### 1. Direct API Integration
- Utilize provider APIs to fetch training modules
- Embed practice questions and exams directly in-app
- Track progress via API callbacks

##### 2. iFrame Embedding
- Embed official certification dashboards in iframes
- Maintain single-sign-on via OAuth token passing
- Monitor user interactions

##### 3. Custom Training Interface
- Build custom training components for each certification
- Integrate official learning modules
- Display certification roadmaps and progress tracking

### Certification Component Structure

```
src/components/
├── CertificationHub/
│   ├── index.tsx (main hub)
│   ├── CertCard.tsx (cert preview card)
│   └── CertificationView.tsx (detail view)
├── Certifications/
│   ├── Microsoft/
│   │   ├── AzureFundamentals.tsx
│   │   ├── AzureArchitect.tsx
│   │   └── Training.tsx
│   ├── GoogleCloud/
│   │   ├── CloudAssociate.tsx
│   │   └── Training.tsx
│   └── AWS/
│       ├── SolutionsArchitect.tsx
│       └── Training.tsx
└── Proctoring/
    ├── ProctorSession.tsx
    ├── ExamInterface.tsx
    └── ResultsTracking.tsx
```

### Certification Data Structure

```typescript
interface CertificationProgram {
  id: string;
  provider: 'Microsoft' | 'AWS' | 'GoogleCloud';
  title: string;
  examCode?: string;
  description: string;
  estimatedDuration: string;
  difficulty: 'foundation' | 'associate' | 'professional';
  prerequisites?: string[];
  topics: string[];
  practiceQuestionsCount: number;
  examQuestionsCount: number;
  passingScore: number;
  cost?: number;
}

interface CertificationProgress {
  userId: string;
  certificationId: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'failed' | 'expired';
  enrollmentDate: string;
  completionDate?: string;
  score?: number;
  certificateUrl?: string;
  practiceTestScores: number[];
  modulesCompleted: string[];
}
```

## Proctoring System

### Features

- **Session Recording**: Monitor test sessions
- **Identity Verification**: Proctoring verification before exam start
- **Browser Lockdown**: Restrict tab switching and screen capture
- **Code Detection**: Detect and flag suspicious activities
- **Result Verification**: Manual or automated result verification

### Proctoring Flow

```
1. User enrolls in certification exam
   ↓
2. Identity verification (photo ID, face recognition)
   ↓
3. Environment check (browser security, no external apps)
   ↓
4. Session recording starts
   ↓
5. Exam interface locked (no tab switching, restricted copy/paste)
   ↓
6. Exam completion
   ↓
7. Session review and verification
   ↓
8. Results and certificate generation
```

### Implementation

```typescript
// src/components/Proctoring/ProctorSession.tsx

interface ProctorSessionConfig {
  examId: string;
  userId: string;
  timeLimit: number; // in minutes
  recordingEnabled: boolean;
  browserLockdown: boolean;
  identityVerificationRequired: boolean;
}

class ProctorSession {
  // Initialize proctoring
  startSession(config: ProctorSessionConfig): Promise<void>
  
  // Monitor user activity
  monitorActivity(): void
  
  // Detect suspicious behavior
  detectAnomalies(): SuspiciousActivity[]
  
  // End session and verify
  endSession(): Promise<VerificationResult>
}
```

## Data Storage

### Local Storage Schema

```javascript
{
  // OAuth accounts
  "oauth_accounts": [
    {
      provider: "github",
      username: "user123",
      email: "user@example.com",
      accessToken: "...",
      refreshToken: "...",
      tokenExpiry: 1234567890,
      userId: "github_12345"
    }
  ],
  
  // User progress (existing)
  "beast_ai_progress": {
    level: "builder",
    xp: 1200,
    credentials: {
      oauthProvider: "github",
      oauthUsername: "user123",
      oauthEmail: "user@example.com",
      oauthUserId: "github_12345"
    },
    certificationStatus: {
      "azure-fundamentals": "in-progress",
      "gcp-associate": "not-started"
    }
  }
}
```

### Backend Data Storage (Production)

Recommended PostgreSQL schema:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  oauth_provider VARCHAR(50) NOT NULL,
  oauth_id VARCHAR(255) NOT NULL,
  username VARCHAR(255),
  email VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(oauth_provider, oauth_id)
);

CREATE TABLE oauth_tokens (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  provider VARCHAR(50),
  access_token TEXT ENCRYPTED,
  refresh_token TEXT ENCRYPTED,
  token_expiry TIMESTAMP,
  created_at TIMESTAMP
);

CREATE TABLE certifications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  provider VARCHAR(50),
  cert_id VARCHAR(255),
  status VARCHAR(50),
  enrollment_date TIMESTAMP,
  completion_date TIMESTAMP,
  score INT,
  certificate_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE proctoring_sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  exam_id VARCHAR(255),
  status VARCHAR(50),
  recording_url TEXT,
  verification_status VARCHAR(50),
  flagged_activities JSONB,
  created_at TIMESTAMP,
  started_at TIMESTAMP,
  ended_at TIMESTAMP
);
```

## API Endpoints (Backend Required)

For production deployment, implement these backend endpoints:

```
POST /api/oauth/callback/:provider
  - Exchange OAuth code for token
  - Create/update user account
  - Return session token

POST /api/certifications/enroll
  - Enroll user in certification
  - Initialize training path
  
GET /api/certifications/:certId/progress
  - Get user progress on certification
  - Fetch available modules/exams

POST /api/certifications/:certId/exam/start
  - Start exam session
  - Initialize proctoring

POST /api/certifications/:certId/exam/submit
  - Submit exam answers
  - Grade and return results

GET /api/certifications/:certId/certificate
  - Download certificate

POST /api/proctoring/:sessionId/verify
  - Verify proctoring session
  - Flag suspicious activities
```

## Security Considerations

### OAuth Security

- **State Parameter Validation**: Prevents CSRF attacks
- **Token Storage**: Use secure, HttpOnly cookies for tokens (backend)
- **Token Expiry**: Automatic refresh token handling
- **Scope Limitation**: Request only necessary OAuth scopes
- **HTTPS Only**: All OAuth redirects must use HTTPS in production

### Proctoring Security

- **Session Recording**: Secure encrypted storage
- **Identity Verification**: Government ID validation
- **Tamper Detection**: Detect screen recording tools, external monitors
- **Anomaly Detection**: Flag unusual answer patterns or timing
- **Chain of Custody**: Maintain audit logs for certification verification

### Best Practices

```typescript
// Good: Secure token handling
const account = OAuthService.getAccount('github');
if (OAuthService.isTokenExpired(account)) {
  const refreshed = await OAuthService.refreshToken(account);
}

// Bad: Passing tokens in URLs
window.location.href = `https://api.example.com?token=${accessToken}`;

// Good: Use Authorization headers
fetch('/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

## Development Workflow

### 1. Local Development Setup

```bash
# Install dependencies
npm install

# Create .env.local with OAuth credentials
cp .env.example .env.local
# Edit .env.local with your OAuth app credentials

# Start dev server
npm run dev
```

### 2. Testing Sign-In Flow

```typescript
// Open browser console
localStorage.clear();
// Navigate to http://localhost:3001/Beast-AI-Training-/
// Click a provider button to test the hosted sign-in contract
// If no hosted auth gateway exists yet, the UI falls back to a local demo session
```

### 3. Testing Certifications

Mock certification data available in:
```
src/data/certifications.ts
```

### 4. Production Deployment

1. Update `VITE_*_CLIENT_ID` environment variables
2. Set callback URLs to production domain
3. Implement backend token exchange endpoints
4. Enable HTTPS-only connections
5. Configure database for user persistence
6. Set up monitoring and audit logging

## Troubleshooting

### OAuth Redirect Issues

```
Error: "Invalid redirect URI"
Solution: Ensure callback URL matches exactly in OAuth provider settings
```

### Token Expiry Issues

```
Error: "Token expired"
Solution: OAuthService.refreshToken() handles auto-refresh
Check localStorage for valid refresh_token
```

### CORS Issues

```
Error: "No 'Access-Control-Allow-Origin' header"
Solution: Implement backend proxy for OAuth token exchange
Frontend should never handle client secrets
```

### Certification Embedding Issues

```
Error: "Iframe blocked by X-Frame-Options"
Solution: 
- Use certification provider embed APIs (preferred)
- Or negotiate X-Frame-Options with provider
- Or implement server-side proxy with iframe support
```

## Future Enhancements

1. **Single Sign-On (SSO)** - Unified login across multiple properties
2. **Social Linking** - Link multiple OAuth providers to one account
3. **Custom Certification Paths** - AI-powered learning path recommendations
4. **Skill Verification** - Automated skill assessment before proctoring
5. **Blockchain Certificates** - Verifiable on-chain credentials
6. **Mobile App** - Native iOS/Android with biometric proctoring
7. **Team Certifications** - Group enrollment and progress tracking
8. **Analytics Dashboard** - Comprehensive learning analytics
9. **AI Tutoring** - LLM-powered exam preparation assistance
10. **Marketplace** - Exchange or monetize certifications

## Support & Contact

For questions or issues:

- GitHub Issues: [beast-ai-learning/issues](https://github.com/leonardjerome/beast-ai-learning/issues)
- Documentation: [Leeway Standards](https://leeway-standards.example.com)
- Email: support@beastai.edu

---

**Version**: 1.0.0  
**Last Updated**: 2026-04-28  
**Maintained by**: Leeway Innovations  
**License**: MIT
