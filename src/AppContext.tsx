/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: PRODUCT.BEAST.UNKNOWN
TAG: UI.BEAST.UNKNOWN

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#E8F5E9

ICON_ASCII:
family=lucide
glyph=file

5WH:
WHAT = BEAST AI Component: AppContext.tsx
WHY = Part of the BEAST AI Leeway Standards alignment
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = src/AppContext.tsx
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

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CertificationStatus, UserProgress } from './types';

interface AppContextType {
  progress: UserProgress;
  completeLesson: (lessonId: string, xpEarned: number) => void;
  unlockBadge: (badgeId: string) => void;
  setOnboarding: (level: 'beginner' | 'builder' | 'engineer') => void;
  updatePreferences: (prefs: Partial<UserProgress['preferences']>) => void;
  updateCredentials: (creds: Partial<NonNullable<UserProgress['credentials']>>) => void;
  addFeedback: (rating: number, comment: string, aiResponse: string) => void;
  updateCertificationStatus: (certId: string, status: CertificationStatus) => void;
  unlockVmShowcase: () => void;
  setActiveBadge: (badgeId: string) => void;
}

const defaultProgress: UserProgress = {
  streak: 1,
  xp: 0,
  completedLessonIds: [],
  badges: [],
  lastSync: new Date().toISOString(),
  hasOnboarded: false,
  preferences: {
    narrationEnabled: true,
    autoAdvance: false,
    performanceMode: false,
  },
  certificationStatus: {},
  vmShowcaseUnlocked: false
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('beast_ai_progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultProgress,
        ...parsed,
        preferences: {
          ...defaultProgress.preferences,
          ...(parsed.preferences || {}),
        },
        certificationStatus: {
          ...(parsed.certificationStatus || {}),
        },
      };
    }
    return defaultProgress;
  });

  useEffect(() => {
    localStorage.setItem('beast_ai_progress', JSON.stringify(progress));
  }, [progress]);

  const setOnboarding = (level: 'beginner' | 'builder' | 'engineer') => {
    setProgress(prev => ({
      ...prev,
      level,
      hasOnboarded: true,
      lastSync: new Date().toISOString(),
    }));
  };

  const updatePreferences = (prefs: Partial<UserProgress['preferences']>) => {
    setProgress(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...prefs }
    }));
  };

  const updateCredentials = (creds: Partial<NonNullable<UserProgress['credentials']>>) => {
    setProgress(prev => ({
      ...prev,
      credentials: { ...(prev.credentials || {}), ...creds }
    }));
  };

  const completeLesson = (lessonId: string, xpEarned: number) => {
    setProgress(prev => {
      if (prev.completedLessonIds.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessonIds: [...prev.completedLessonIds, lessonId],
        xp: prev.xp + xpEarned,
        lastSync: new Date().toISOString(),
      };
    });
  };

  const unlockBadge = (badgeId: string) => {
    setProgress(prev => {
      if (prev.badges.includes(badgeId)) return prev;
      return {
        ...prev,
        badges: [...prev.badges, badgeId],
      };
    });
  };

  const addFeedback = (rating: number, comment: string, aiResponse: string) => {
    setProgress(prev => ({
      ...prev,
      xp: prev.xp + 5, // Award 5 XP for feedback
      feedback: [
        ...(prev.feedback || []),
        {
          id: Math.random().toString(36).substr(2, 9),
          rating,
          comment,
          aiResponse,
          timestamp: new Date().toISOString()
        }
      ]
    }));
  };

  const updateCertificationStatus = (certId: string, status: CertificationStatus) => {
    setProgress(prev => ({
      ...prev,
      certificationStatus: {
        ...(prev.certificationStatus || {}),
        [certId]: status,
      },
      lastSync: new Date().toISOString(),
    }));
  };

  const unlockVmShowcase = () => {
    setProgress(prev => ({
      ...prev,
      vmShowcaseUnlocked: true,
      lastSync: new Date().toISOString(),
    }));
  };

  const setActiveBadge = (badgeId: string) => {
    setProgress(prev => ({
      ...prev,
      activeBadgeId: badgeId,
      lastSync: new Date().toISOString(),
    }));
  };

  return (
    <AppContext.Provider value={{ progress, completeLesson, unlockBadge, setOnboarding, updatePreferences, updateCredentials, addFeedback, updateCertificationStatus, unlockVmShowcase, setActiveBadge }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
