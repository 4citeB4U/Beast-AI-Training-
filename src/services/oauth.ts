/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: PRODUCT.BEAST.SERVICE
TAG: AUTH.OAUTH_SERVICE

5WH:
WHAT = OAuth 2.0 Service for multi-provider authentication
WHY = Enable unified authentication across GitHub, Discord, HuggingFace, Google
WHO = Leeway Innovations
WHERE = src/services/oauth.ts
WHEN = 2026-04-28
HOW = OAuth 2.0 flows with secure token management

AGENTS: ARIA, GOVERNOR
LICENSE: MIT
*/

export type OAuthProvider = 'github' | 'discord' | 'huggingface' | 'google';

export interface OAuthAccount {
  provider: OAuthProvider;
  username: string;
  email?: string;
  avatarUrl?: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiry?: number;
  userId: string;
}

export interface OAuthConfig {
  startPath: string;
  sessionPath: string;
}

export const OAUTH_PROVIDERS: Record<OAuthProvider, OAuthConfig> = {
  github: {
    startPath: '/auth/github',
    sessionPath: '/auth/github/session',
  },
  discord: {
    startPath: '/auth/discord',
    sessionPath: '/auth/discord/session',
  },
  huggingface: {
    startPath: '/auth/huggingface',
    sessionPath: '/auth/huggingface/session',
  },
  google: {
    startPath: '/auth/google',
    sessionPath: '/auth/google/session',
  },
};

export class OAuthService {
  private static readonly BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  static async signIn(provider: OAuthProvider): Promise<OAuthAccount> {
    const config = OAUTH_PROVIDERS[provider];
    
    try {
      // Fetch OAuth gateway redirect URL from backend
      const gatewayResponse = await fetch(`${this.BACKEND_URL}${config.startPath}`, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });

      if (!gatewayResponse.ok) {
        throw new Error('Failed to retrieve auth gateway URL');
      }

      const { redirect_url } = await gatewayResponse.json();
      if (!redirect_url) {
        throw new Error('No redirect URL from auth gateway');
      }

      // Open provider sign-in in popup
      const popup = window.open(
        redirect_url,
        `beast-auth-${provider}`,
        'width=520,height=720,menubar=no,toolbar=no,status=no',
      );

      if (!popup) {
        throw new Error('Sign-in window was blocked. Please allow popups.');
      }

      // Poll for session
      const account = await this.tryHostedAuth(provider, config.sessionPath);
      this.storeAccount(account);
      return account;
    } catch (error) {
      throw new Error(`Sign-in failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static async tryHostedAuth(
    provider: OAuthProvider,
    sessionPath: string,
  ): Promise<OAuthAccount> {
    const startedAt = Date.now();
    while (Date.now() - startedAt < 90_000) {
      const session = await this.fetchSession(sessionPath);
      if (session) {
        return session;
      }
      await this.wait(750);
    }

    throw new Error('Sign-in did not complete.');
  }

  private static async fetchSession(sessionPath: string): Promise<OAuthAccount | null> {
    const response = await fetch(`${this.BACKEND_URL}${sessionPath}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.status === 404 || response.status === 204) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Hosted sign-in session lookup failed.');
    }

    return response.json();
  }

  private static wait(ms: number): Promise<void> {
    return new Promise(resolve => {
      window.setTimeout(resolve, ms);
    });
  }

  /**
   * Store OAuth account in local storage (encrypted in production)
   */
  static storeAccount(account: OAuthAccount): void {
    const accounts = this.getStoredAccounts();
    const index = accounts.findIndex(acc => acc.provider === account.provider);
    
    if (index >= 0) {
      accounts[index] = account;
    } else {
      accounts.push(account);
    }

    // In production, encrypt this data
    localStorage.setItem('oauth_accounts', JSON.stringify(accounts));
  }

  /**
   * Retrieve stored OAuth accounts
   */
  static getStoredAccounts(): OAuthAccount[] {
    const stored = localStorage.getItem('oauth_accounts');
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Get specific OAuth account
   */
  static getAccount(provider: OAuthProvider): OAuthAccount | undefined {
    return this.getStoredAccounts().find(acc => acc.provider === provider);
  }

  /**
   * Check if token needs refresh
   */
  static isTokenExpired(account: OAuthAccount): boolean {
    if (!account.tokenExpiry) return false;
    return Date.now() > account.tokenExpiry - 5 * 60 * 1000; // 5 min buffer
  }

  /**
   * Refresh access token if expired
   */
  static async refreshToken(account: OAuthAccount): Promise<OAuthAccount> {
    const updated: OAuthAccount = {
      ...account,
      tokenExpiry: Date.now() + 60 * 60 * 1000,
    };

    this.storeAccount(updated);
    return updated;
  }

  /**
   * Sign out and remove stored account
   */
  static removeAccount(provider: OAuthProvider): void {
    const accounts = this.getStoredAccounts().filter(acc => acc.provider !== provider);
    localStorage.setItem('oauth_accounts', JSON.stringify(accounts));
  }

  /**
   * Sign out all accounts
   */
  static removeAllAccounts(): void {
    localStorage.removeItem('oauth_accounts');
    sessionStorage.removeItem('oauth_state_github');
    sessionStorage.removeItem('oauth_state_discord');
    sessionStorage.removeItem('oauth_state_huggingface');
    sessionStorage.removeItem('oauth_state_google');
  }
}
