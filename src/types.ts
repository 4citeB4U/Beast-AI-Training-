/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: CORE.BEAST.TYPES
TAG: CORE.BEAST.SCHEMA

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#E8F5E9

ICON_ASCII:
family=lucide
glyph=database

5WH:
WHAT = BEAST AI Component: types.ts
WHY = Part of the BEAST AI Leeway Standards alignment
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = src/types.ts
WHEN = 2026-04-21
HOW = Autonomous Agent Engineering

AGENTS:
VECTOR
ARIA
WARD
GOVERNOR

LICENSE:
MIT
*/

export type StepType = 'hook' | 'teach' | 'interaction' | 'reinforcement' | 'reward' | 'workshop' | 'live' | 'puzzle' | 'sorting' | 'video' | 'cert';

export interface LessonStep {
  type: StepType;
  title: string;
  content: string;
  image?: string;
  videoUrl?: string; // YouTube embed ID or URL
  externalUrl?: string; // Link to lab or cert
  codeSnippet?: {
    language: string;
    code: string;
    description: string;
  };
  interaction?: {
    type: 'multiple-choice' | 'true-false' | 'reflection' | 'tap-to-reveal' | 'workshop' | 'puzzle' | 'sorting';
    options?: string[];
    correctIndex?: number;
    question?: string;
    items?: string[]; // For sorting/puzzles
    correctItems?: string[]; // Ordered items
  };
  narration?: string;
  printableContent?: string;
  embeddedContent?: string; // HTML or iframe string for in-app training
  proctoringRequired?: boolean; // If true, show ProctorSession
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g. "5m"
  narration?: string;
  steps: LessonStep[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  outcome?: string; // Practical asset built in this module
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  expectations: string[]; // What the student will learn
  outcome: string; // The primary tool/result they will have by the end
  modules: Module[];
  targetLevel: UserLevel;
  isCertificationCourse?: boolean;
}

export type CertificationStatus = 'not-started' | 'in-progress' | 'submitted' | 'verified';

export interface CertificationProgram {
  id: string;
  provider: 'Microsoft' | 'AWS' | 'Google';
  title: string;
  examCode?: string;
  officialUrl: string;
  track: 'foundation' | 'advanced';
}

export type UserLevel = 'beginner' | 'builder' | 'engineer';

export interface Badge {
  id: string;
  name: string;
  unlock: string;
  category: 'identity' | 'path' | 'agent' | 'certification';
  icon: string;
}

export interface UserProgress {
  streak: number;
  xp: number;
  completedLessonIds: string[];
  badges: string[];
  lastSync: string;
  level?: UserLevel;
  hasOnboarded: boolean;
  preferences: {
    narrationEnabled: boolean;
    autoAdvance: boolean;
    performanceMode?: boolean; // Disables heavy animations and effects
  };
  credentials?: {
    // OAuth credentials
    oauthProvider?: 'github' | 'discord' | 'huggingface' | 'google';
    oauthUsername?: string;
    oauthEmail?: string;
    oauthUserId?: string;
    // Legacy credentials (deprecated)
    githubUsername?: string;
    hfUsername?: string;
    discordUsername?: string;
  };
  feedback?: {
    id: string;
    rating: number; // 1-5
    comment: string;
    timestamp: string;
    aiResponse?: string;
  }[];
  certificationStatus?: Record<string, CertificationStatus>;
  vmShowcaseUnlocked?: boolean;
  activeBadgeId?: string;
}
