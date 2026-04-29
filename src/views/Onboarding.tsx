/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: PRODUCT.BEAST.VIEW
TAG: UI.BEAST.VIEW.ONBOARDING

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#E8F5E9

ICON_ASCII:
family=lucide
glyph=layout

5WH:
WHAT = BEAST AI Component: Onboarding.tsx
WHY = Part of the BEAST AI Leeway Standards alignment
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = src/views/Onboarding.tsx
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

import React, { useState } from 'react';
import { Card, Button } from '../components/UI';
import { useApp } from '../AppContext';
import { motion } from 'motion/react';
import { Zap, Target, Cpu, Rocket } from 'lucide-react';
import { UserLevel } from '../types';
import { OAuthLogin } from '../components/OAuthLogin';
import type { OAuthAccount } from '../services/oauth';

export const OnboardingView: React.FC = () => {
  const { setOnboarding, updateCredentials } = useApp();
  const [step, setStep] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<UserLevel | null>(null);
  const [oauthAccount, setOauthAccount] = useState<OAuthAccount | null>(null);

  const levels = [
    { 
      id: 'beginner', 
      title: 'Beginner', 
      icon: Target, 
      desc: "I'm new to AI and want to understand how it works.", 
      color: 'bg-emerald-500' 
    },
    { 
      id: 'builder', 
      title: 'Builder', 
      icon: Cpu, 
      desc: "I want to integrate AI into my current workflows/projects.", 
      color: 'bg-yellow-400' 
    },
    { 
      id: 'engineer', 
      title: 'Engineer', 
      icon: Rocket, 
      desc: "I want to build full AI architectures and deploy agents.", 
      color: 'bg-red-500' 
    }
  ];

  const handleLevelSelect = (level: UserLevel) => {
    setSelectedLevel(level);
    setStep(2);
  };

  const handleOAuthSuccess = (account: OAuthAccount) => {
    setOauthAccount(account);
    if (selectedLevel) {
      updateCredentials({
        oauthProvider: account.provider,
        oauthUsername: account.username,
        oauthEmail: account.email,
        oauthUserId: account.userId,
      });
      setOnboarding(selectedLevel);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center text-center space-y-8 py-12">
      {step === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 max-w-sm"
        >
          <div className="w-20 h-20 bg-black text-white flex items-center justify-center mx-auto border-4 border-emerald-500 rotate-3">
            <Zap size={48} className="fill-yellow-400 text-yellow-400" />
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
            UNLEASH THE <span className="text-emerald-500">BEAST</span>.
          </h1>
          <p className="text-[10px] font-black tracking-[0.2em] text-emerald-500 uppercase">Powered by Leeway Innovations</p>
          <p className="text-xl font-bold italic text-neutral-600">
            Before we begin the hunt, we must gauge your initial strength.
          </p>
          <Button size="xl" variant="brutal" className="w-full" onClick={() => setStep(1)}>
            START ASSESSMENT
          </Button>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8 w-full max-w-sm"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Choose Your Path</h2>
            <p className="font-bold text-neutral-400 uppercase tracking-widest text-xs">Curriculum will adapt to your choice</p>
          </div>

          <div className="space-y-4">
            {levels.map((level) => (
              <Card 
                key={level.id} 
                className={`p-6 cursor-pointer border-2 border-black transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${level.color} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left group`}
                onClick={() => handleLevelSelect(level.id as UserLevel)}
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
                    <level.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight">{level.title}</h3>
                    <p className="text-sm font-bold text-black/70 leading-snug">{level.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {step === 2 && selectedLevel && (
        <OAuthLogin 
          onSuccess={handleOAuthSuccess}
          selectedLevel={selectedLevel}
        />
      )}
    </div>
  );
};
