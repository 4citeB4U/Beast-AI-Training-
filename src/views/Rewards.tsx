/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

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
import { Card, Button } from '../components/UI';
import { Award, Lock, ShieldCheck, Trophy, Sparkles, User, GraduationCap, Cpu, ShieldAlert, Scale } from 'lucide-react';
import { useApp } from '../AppContext';
import { BEAST_BADGES } from '../data';
import { motion } from 'motion/react';

export const RewardsView: React.FC = () => {
  const { progress, setActiveBadge } = useApp();
  
  const categories = [
    { id: 'identity', name: 'Identity Badges', color: 'text-blue-500' },
    { id: 'path', name: 'Learning Path Badges', color: 'text-emerald-500' },
    { id: 'agent', name: 'Agent Mastery Badges', color: 'text-purple-500' },
    { id: 'certification', name: 'Certification Badges', color: 'text-yellow-500' }
  ];

  const activeBadge = BEAST_BADGES.find(b => b.id === progress.activeBadgeId);

  return (
    <div className="space-y-12 pb-24">
      {/* Header Section */}
      <section className="text-center space-y-4">
        <h1 className="text-5xl font-black italic tracking-tighter uppercase text-slate-900">Achievement Gallery</h1>
        <p className="text-xl text-neutral-400 font-medium italic">Track your progression through the Beast AI Heroes Academy.</p>
      </section>

      {/* Active Badge Selector */}
      <section className="max-w-xl mx-auto">
        <Card className="flex flex-col md:flex-row items-center gap-8 p-12 bg-white/90 border-2 border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative w-32 h-32 rounded-full border-4 border-emerald-500 flex items-center justify-center text-6xl bg-black shadow-2xl">
              {activeBadge?.icon || '🏅'}
            </div>
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 mb-1">Active Hero Badge</h3>
              <p className="text-3xl font-black text-slate-900 uppercase">{activeBadge?.name || 'No Active Badge'}</p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="heroBadgeSelect" className="text-[10px] font-bold uppercase text-neutral-500 tracking-widest">Equip Achievement</label>
              <select 
                id="heroBadgeSelect"
                value={progress.activeBadgeId || ''}
                onChange={(e) => setActiveBadge(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:border-emerald-500 outline-none appearance-none cursor-pointer hover:border-slate-300 transition-colors"
              >
                <option value="">Select a badge to equip...</option>
                {BEAST_BADGES.map(badge => {
                  const isUnlocked = progress.badges.includes(badge.id);
                  return (
                    <option key={badge.id} value={badge.id} disabled={!isUnlocked}>
                      {isUnlocked ? '✅' : '🔒'} {badge.icon} {badge.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </Card>
      </section>

      {/* Badge Grid Categories */}
      <div className="space-y-16">
        {categories.map(cat => (
          <section key={cat.id} className="space-y-8">
            <div className="flex items-center gap-4">
              <div className={`h-px flex-1 bg-gradient-to-r from-transparent to-neutral-800`} />
              <h2 className={`text-2xl font-black uppercase italic tracking-tighter ${cat.color}`}>{cat.name}</h2>
              <div className={`h-px flex-1 bg-gradient-to-l from-transparent to-neutral-800`} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {BEAST_BADGES.filter(b => b.category === cat.id).map(badge => {
                const isUnlocked = progress.badges.includes(badge.id);
                return (
                  <motion.div
                    key={badge.id}
                    whileHover={isUnlocked ? { y: -8, scale: 1.05 } : {}}
                    className="relative"
                  >
                    <Card 
                      className={`h-full flex flex-col items-center text-center p-8 transition-all duration-500 ${
                        isUnlocked 
                          ? 'bg-neutral-800 border-emerald-500/30 border-2 shadow-lg hover:shadow-emerald-500/20' 
                          : 'bg-black/40 opacity-40 grayscale border-white/5'
                      }`}
                    >
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 relative ${isUnlocked ? 'bg-black' : 'bg-neutral-900'}`}>
                         {isUnlocked ? badge.icon : <Lock className="text-neutral-600" size={32} />}
                         {isUnlocked && (
                           <div className="absolute -inset-2 border-2 border-dashed border-emerald-500/30 rounded-full animate-spin-slow" />
                         )}
                      </div>
                      <h3 className={`font-black text-sm uppercase tracking-tight mb-2 ${isUnlocked ? 'text-slate-900' : 'text-neutral-500'}`}>
                        {badge.name}
                      </h3>
                      <p className="text-[10px] font-medium text-neutral-400 leading-snug">
                        {isUnlocked ? `Unlocked: ${badge.unlock}` : `Condition: ${badge.unlock}`}
                      </p>
                      
                      {!isUnlocked && (
                        <div className="mt-4 px-3 py-1 bg-white/5 rounded-full">
                          <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600">Locked</span>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* University Seal / Footer */}
      <section className="pt-12 flex flex-col items-center space-y-6">
        <div className="w-24 h-24 border-4 border-white/10 rounded-full flex items-center justify-center relative">
          <GraduationCap size={48} className="text-white/20" />
          <div className="absolute inset-0 border-4 border-emerald-500/10 rounded-full border-dashed animate-spin-slow" />
        </div>
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.5em] text-neutral-600 mb-1">Beast AI Academy</p>
          <p className="text-[10px] font-bold text-neutral-500 italic">Official Certification Registry & Recognition System</p>
        </div>
      </section>
    </div>
  );
};
