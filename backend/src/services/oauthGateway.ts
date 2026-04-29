/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: PRODUCT.BEAST.BACKEND
TAG: AUTH.GATEWAY_SERVICE

5WH:
WHAT = OAuth Gateway Service for multi-provider authentication
WHY = Handle OAuth token exchange server-side and manage hero sessions
WHO = Leeway Innovations
WHERE = backend/src/services/oauthGateway.ts
WHEN = 2026-04-28
HOW = Server-side OAuth 2.0 flows with secure token management

AGENTS: ARIA, GOVERNOR
LICENSE: MIT
*/

import fetch from 'node-fetch';

export type OAuthProvider = 'github' | 'discord' | 'huggingface' | 'google';

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
  authUrl: string;
  tokenUrl: string;
  userUrl: string;
}

export interface OAuthUserData {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  provider: OAuthProvider;
}

const OAUTH_CONFIGS: Record<OAuthProvider, OAuthConfig> = {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    redirectUri: `${process.env.APP_URL || 'http://localhost:3001'}/auth/github/callback`,
    scope: ['user:email', 'read:user', 'public_repo'],
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userUrl: 'https://api.github.com/user',
  },
  discord: {
    clientId: process.env.DISCORD_CLIENT_ID || '',
    clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    redirectUri: `${process.env.APP_URL || 'http://localhost:3001'}/auth/discord/callback`,
    scope: ['identify', 'email', 'guilds'],
    authUrl: 'https://discord.com/api/oauth2/authorize',
    tokenUrl: 'https://discord.com/api/oauth2/token',
    userUrl: 'https://discord.com/api/users/@me',
  },
  huggingface: {
    clientId: process.env.HF_CLIENT_ID || '',
    clientSecret: process.env.HF_CLIENT_SECRET || '',
    redirectUri: `${process.env.APP_URL || 'http://localhost:3001'}/auth/huggingface/callback`,
    scope: ['profile', 'email', 'openid'],
    authUrl: 'https://huggingface.co/oauth/authorize',
    tokenUrl: 'https://huggingface.co/oauth/token',
    userUrl: 'https://huggingface.co/api/user',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: `${process.env.APP_URL || 'http://localhost:3001'}/auth/google/callback`,
    scope: ['openid', 'profile', 'email'],
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userUrl: 'https://openidconnect.googleapis.com/v1/userinfo',
  },
};

export class OAuthGateway {
  /**
   * Generate authorization URL for provider
   */
  static generateAuthUrl(provider: OAuthProvider, state: string): string {
    const config = OAUTH_CONFIGS[provider];
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scope.join(' '),
      state,
    });

    if (provider === 'github') {
      params.append('allow_signup', 'true');
    } else if (provider === 'google') {
      params.append('access_type', 'offline');
    }

    if (config.clientId.includes('your_') || !config.clientId) {
      return `${process.env.BACKEND_URL || 'http://localhost:3000'}/auth/${provider}/mock-login?state=${state}`;
    }

    return `${config.authUrl}?${params}`;
  }

  /**
   * Exchange authorization code for access token
   */
  static async exchangeCodeForToken(
    provider: OAuthProvider,
    code: string,
  ): Promise<{ access_token: string; refresh_token?: string; expires_in?: number }> {
    const config = OAUTH_CONFIGS[provider];

    const body: Record<string, string> = {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code',
    };

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams(body),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    return response.json() as Promise<{ access_token: string; refresh_token?: string; expires_in?: number }>;
  }

  /**
   * Fetch user data from OAuth provider
   */
  static async fetchUserData(
    provider: OAuthProvider,
    accessToken: string,
  ): Promise<OAuthUserData> {
    const config = OAUTH_CONFIGS[provider];

    const response = await fetch(config.userUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'User-Agent': 'Beast-AI-Heroes-Academy',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.statusText}`);
    }

    const data = await response.json() as Record<string, unknown>;
    return this.extractUserData(provider, data);
  }

  /**
   * Extract normalized user data from provider response
   */
  private static extractUserData(provider: OAuthProvider, data: Record<string, unknown>): OAuthUserData {
    switch (provider) {
      case 'github':
        return {
          id: String(data.id),
          username: String(data.login || data.name || 'user'),
          email: String(data.email || ''),
          avatar: String(data.avatar_url || ''),
          provider,
        };
      case 'discord':
        return {
          id: String(data.id),
          username: String(data.username || data.global_name || 'user'),
          email: String(data.email || ''),
          avatar: data.avatar
            ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
            : '',
          provider,
        };
      case 'huggingface':
        return {
          id: String(data.id),
          username: String(data.username || data.name || 'user'),
          email: String(data.email || ''),
          avatar: String(data.avatar_url || ''),
          provider,
        };
      case 'google':
        return {
          id: String(data.sub),
          username: String(data.name || (typeof data.email === 'string' ? data.email.split('@')[0] : '') || 'user'),
          email: String(data.email || ''),
          avatar: String(data.picture || ''),
          provider,
        };
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }
}
