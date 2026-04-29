/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: PRODUCT.BEAST.BACKEND
TAG: DATA.LEARNER_MODEL

5WH:
WHAT = Learner/Hero data model and service
WHY = Persist hero profiles, progress, and credentials after OAuth
WHO = Leeway Innovations
WHERE = backend/src/models/learner.ts
WHEN = 2026-04-28
HOW = Database schema and service layer for hero records

AGENTS: ARIA, GOVERNOR
LICENSE: MIT
*/

import type { OAuthProvider } from '../services/oauthGateway';

export type UserLevel = 'beginner' | 'builder' | 'engineer';

export interface LearnerProfile {
  id: string;
  oauthProvider: OAuthProvider;
  oauthId: string;
  username: string;
  email?: string;
  avatar?: string;
  
  // Learning data
  level?: UserLevel;
  xp: number;
  streak: number;
  badges: string[];
  completedLessonIds: string[];
  
  // Certification tracking
  enrolledCertifications: string[];
  certificationProgress: Record<string, CertificationProgress>;
  
  // Account lifecycle
  createdAt: string;
  lastAccessedAt: string;
  isActive: boolean;
}

export interface CertificationProgress {
  certId: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'failed' | 'expired';
  enrollmentDate: string;
  completionDate?: string;
  score?: number;
  certificateUrl?: string;
  practiceTestScores: number[];
  modulesCompleted: string[];
}

export interface ProctorSession {
  id: string;
  learnerId: string;
  certId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'flagged' | 'verified';
  
  // Session metadata
  startedAt?: string;
  endedAt?: string;
  durationSeconds?: number;
  
  // Identity verification
  identityVerified: boolean;
  identityVerificationMethod?: 'photo_id' | 'facial_recognition' | 'liveness';
  
  // Proctoring data
  recordingUrl?: string;
  recordingEncrypted: boolean;
  anomaliesDetected: string[];
  flaggedActivities: FlaggedActivity[];
  
  // Results
  score?: number;
  passed?: boolean;
  verifiedBy?: string;
  verificationNotes?: string;
}

export interface FlaggedActivity {
  timestamp: number;
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

/**
 * In-memory learner store (replace with database in production)
 */
export class LearnerService {
  private static learners = new Map<string, LearnerProfile>();
  private static nextId = 1;

  /**
   * Create or retrieve hero profile from OAuth data
   */
  static async createOrResumeLearner(
    oauthProvider: OAuthProvider,
    oauthId: string,
    username: string,
    email?: string,
    avatar?: string,
  ): Promise<LearnerProfile> {
    const key = `${oauthProvider}:${oauthId}`;
    
    // Check if learner exists
    const existing = Array.from(this.learners.values()).find(
      l => l.oauthProvider === oauthProvider && l.oauthId === oauthId
    );

    if (existing) {
      existing.lastAccessedAt = new Date().toISOString();
      return existing;
    }

    // Create new learner profile
    const learner: LearnerProfile = {
      id: `hero_${this.nextId++}_${Date.now()}`,
      oauthProvider,
      oauthId,
      username,
      email,
      avatar,
      xp: 0,
      streak: 1,
      badges: [],
      completedLessonIds: [],
      enrolledCertifications: [],
      certificationProgress: {},
      createdAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      isActive: true,
    };

    this.learners.set(learner.id, learner);
    return learner;
  }

  /**
   * Retrieve learner by ID
   */
  static getLearnerById(learnerId: string): LearnerProfile | undefined {
    return this.learners.get(learnerId);
  }

  /**
   * Retrieve learner by OAuth credentials
   */
  static getLearnerByOAuth(oauthProvider: OAuthProvider, oauthId: string): LearnerProfile | undefined {
    return Array.from(this.learners.values()).find(
      l => l.oauthProvider === oauthProvider && l.oauthId === oauthId
    );
  }

  /**
   * Update learner profile
   */
  static updateLearner(learnerId: string, updates: Partial<LearnerProfile>): LearnerProfile {
    const learner = this.learners.get(learnerId);
    if (!learner) {
      throw new Error(`Learner not found: ${learnerId}`);
    }

    const updated = { ...learner, ...updates, lastAccessedAt: new Date().toISOString() };
    this.learners.set(learnerId, updated);
    return updated;
  }

  /**
   * Update learning progress
   */
  static addXP(learnerId: string, amount: number): void {
    const learner = this.learners.get(learnerId);
    if (learner) {
      learner.xp += amount;
      learner.lastAccessedAt = new Date().toISOString();
    }
  }

  /**
   * Enroll learner in certification
   */
  static enrollCertification(learnerId: string, certId: string, level: UserLevel = 'beginner'): void {
    const learner = this.learners.get(learnerId);
    if (!learner) {
      throw new Error(`Learner not found: ${learnerId}`);
    }

    if (!learner.enrolledCertifications.includes(certId)) {
      learner.enrolledCertifications.push(certId);
      learner.certificationProgress[certId] = {
        certId,
        status: 'not-started',
        enrollmentDate: new Date().toISOString(),
        practiceTestScores: [],
        modulesCompleted: [],
      };
      learner.lastAccessedAt = new Date().toISOString();
    }
  }

  /**
   * Set learner's learning level
   */
  static setLearnerLevel(learnerId: string, level: UserLevel): void {
    const learner = this.learners.get(learnerId);
    if (learner) {
      learner.level = level;
      learner.lastAccessedAt = new Date().toISOString();
    }
  }

  /**
   * Get all learners (admin)
   */
  static getAllLearners(): LearnerProfile[] {
    return Array.from(this.learners.values());
  }
}

/**
 * Proctoring session store (replace with database in production)
 */
export class ProctorService {
  private static sessions = new Map<string, ProctorSession>();
  private static nextId = 1;

  /**
   * Create new proctoring session
   */
  static createSession(learnerId: string, certId: string): ProctorSession {
    const session: ProctorSession = {
      id: `session_${this.nextId++}_${Date.now()}`,
      learnerId,
      certId,
      status: 'pending',
      identityVerified: false,
      recordingEncrypted: true,
      anomaliesDetected: [],
      flaggedActivities: [],
    };

    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * Get session by ID
   */
  static getSession(sessionId: string): ProctorSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Start proctoring session
   */
  static startSession(sessionId: string): ProctorSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.status = 'in-progress';
    session.startedAt = new Date().toISOString();
    return session;
  }

  /**
   * End proctoring session
   */
  static endSession(sessionId: string, score?: number, passed?: boolean): ProctorSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.status = 'completed';
    session.endedAt = new Date().toISOString();
    if (session.startedAt) {
      session.durationSeconds = Math.floor((new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 1000);
    }
    if (score !== undefined) {
      session.score = score;
    }
    if (passed !== undefined) {
      session.passed = passed;
    }

    return session;
  }

  /**
   * Flag activity during proctoring
   */
  static flagActivity(sessionId: string, type: string, severity: 'low' | 'medium' | 'high', description: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.flaggedActivities.push({
        timestamp: Date.now(),
        type,
        severity,
        description,
      });
      if (severity === 'high') {
        session.anomaliesDetected.push(type);
      }
    }
  }

  /**
   * Verify session and mark results as legitimate
   */
  static verifySession(sessionId: string, verifiedBy: string, notes?: string): ProctorSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.status = 'verified';
    session.verifiedBy = verifiedBy;
    session.verificationNotes = notes;
    return session;
  }

  /**
   * Get all sessions for a learner
   */
  static getSessionsByLearner(learnerId: string): ProctorSession[] {
    return Array.from(this.sessions.values()).filter(s => s.learnerId === learnerId);
  }
}
