/*
LEEWAY HEADER — DO NOT REMOVE

REGION: PRODUCT.BEAST.VIEW
TAG: UI.BEAST.VIEW.REWARDS

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#E8F5E9

ICON_ASCII:
family=lucide
glyph=layout

5WH:
WHAT = BEAST AI Component: Rewards.tsx
WHY = Part of the BEAST AI Leeway Standards alignment
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = src/views/Rewards.tsx
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

import React from 'react';
import { Card } from '../components/UI';
import { Award, Lock, Zap, Star, Shield, Cpu, Download, Github, ExternalLink } from 'lucide-react';
import { useApp } from '../AppContext';

const BADGES = [
  { id: 'early-beast', title: 'Early Beast', icon: Zap, description: 'Started your journey.', color: 'bg-yellow-400' },
  { id: 'foundations', title: 'Solid Base', icon: Shield, description: 'Completed foundations module.', color: 'bg-emerald-500' },
  { id: 'streak-7', title: 'Weekend Warrior', icon: Star, description: '7-day learning streak.', color: 'bg-blue-400' },
  { id: 'agent-identity', title: 'Identity Architect', icon: Award, description: 'Mastered the Identity Layer.', color: 'bg-purple-500' },
  { id: 'fabric-master', title: 'Fabric Master', icon: Cpu, description: 'Completed all Fabric layers.', color: 'bg-red-500' },
  { id: 'leeway-sdk', title: 'SDK Explorer', icon: Download, description: 'Acquired the official LeeWay Standards SDK.', color: 'bg-orange-500' },
];

const OPPORTUNITIES = [
  { threshold: 1, title: 'LeeWay Standards SDK', desc: 'The official architectural framework for building autonomous agents. Build production-grade AI systems with industry benchmarks.', icon: Github, url: 'https://github.com/4citeB4U/LeeWay-Standards.git' },
  { threshold: 2, title: 'RAG Deployment Kit', desc: 'Unlock a full RAG framework you can use on your phone/PC.', icon: Cpu, unlocked: false },
  { threshold: 4, title: 'Chat Agent Template', desc: 'Deploy a production-ready chatbot for your own server.', icon: Zap, unlocked: false },
  { threshold: 5, title: 'Phone/Voice Interface', desc: 'Connect your agent to a real voice interface.', icon: Award, unlocked: false },
];

export const RewardsView: React.FC = () => {
  const { progress } = useApp();
  const badgeCount = progress.badges.length + 1; // +1 for the early beast fallback

  return (
    <div className="space-y-6">
      {/* ... hall of fame header ... */}
      <section>
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">HALL OF FAME.</h1>
        <p className="text-neutral-500 font-medium italic">Your proof of architectural dominance.</p>
      </section>

      <div className="grid grid-cols-2 gap-4">
        {BADGES.map(badge => {
// ... existing badge loop ...
          const isUnlocked = progress.badges.includes(badge.id) || badge.id === 'early-beast';
          const Icon = isUnlocked ? badge.icon : Lock;
          
          return (
            <Card 
              key={badge.id} 
              className={`flex flex-col items-center justify-center p-6 text-center gap-2 border-2 border-black transition-all ${
                isUnlocked 
                  ? `${badge.color} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]` 
                  : 'bg-neutral-100 grayscale opacity-40 shadow-none'
              }`}
            >
              <div className={`p-3 border-2 border-black ${isUnlocked ? 'bg-white' : ''}`}>
                <Icon size={24} className={isUnlocked ? 'text-black' : 'text-neutral-400'} />
              </div>
              <h3 className="font-black text-xs uppercase tracking-tight mt-2">{badge.title}</h3>
              <p className="text-[10px] font-bold leading-tight mt-1">{badge.description}</p>
            </Card>
          );
        })}
      </div>

      <section className="space-y-4">
        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-neutral-400">Mission Opportunities</h3>
        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest italic -mt-2">Earn badges to unlock deployable assets</p>
        <div className="space-y-3">
          {OPPORTUNITIES.map((opp, i) => {
            const isUnlocked = badgeCount >= opp.threshold;
            return (
              <Card key={i} className={`p-4 border-2 border-black flex gap-4 items-center ${isUnlocked ? 'bg-white' : 'bg-neutral-50 opacity-60'}`}>
                <div className={`w-12 h-12 flex items-center justify-center border-2 border-black shrink-0 ${isUnlocked ? 'bg-emerald-500' : 'bg-neutral-200'}`}>
                  {isUnlocked ? <opp.icon size={20} className="text-white" /> : <Lock size={18} className="text-neutral-400" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-sm uppercase tracking-tight">{opp.title}</h4>
                  <p className="text-[10px] font-bold text-neutral-500 leading-tight">{opp.desc}</p>
                </div>
                <div className="text-[10px] font-black uppercase text-neutral-400">
                  {isUnlocked ? (
                    opp.url ? (
                      <button 
                        onClick={() => {
                          window.open(opp.url, '_blank');
                          // logic to give badge could go here if we were tracking it
                        }}
                        className="flex items-center gap-1 text-emerald-500 font-black italic hover:underline"
                      >
                        DOWNLOAD <ExternalLink size={10} />
                      </button>
                    ) : <span className="text-emerald-500 italic">AVAILABLE</span>
                  ) : `${badgeCount}/${opp.threshold}`}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-neutral-400">Milestone Timeline</h3>
        <div className="space-y-4">
          <Card className="p-4 flex gap-4 items-center bg-white border-2 border-black">
            <span className="text-xl font-black italic opacity-20">01</span>
            <div className="flex-1">
              <h4 className="font-black text-sm uppercase tracking-tight">Identity Layer Certification</h4>
              <p className="text-xs text-neutral-500 font-medium">Coming soon in Week 3</p>
            </div>
            <div className="p-1 bg-yellow-400 border-2 border-black">
              <Lock size={12} />
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};
