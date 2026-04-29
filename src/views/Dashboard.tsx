/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: PRODUCT.BEAST.DASHBOARD
TAG: UI.BEAST.DASHBOARD_ANALYTICS

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#E8F5E9

ICON_ASCII:
family=lucide
glyph=bar-chart-2

5WH:
WHAT = BEAST AI Dashboard
WHY = Provides progress metrics and agent status visibility for the Operative
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = src/views/Dashboard.tsx
WHEN = 2026-04-21
HOW = Motion-enhanced React components with standard metrics

AGENTS:
VECTOR
WARD
GOVERNOR
SSA_MONITOR

LICENSE:
MIT
*/

import React from 'react';
import { Card, ProgressRing } from '../components/UI';
import { BarChart, Zap, Target, History, Star, GraduationCap } from 'lucide-react';
import { useApp } from '../AppContext';

export const DashboardView: React.FC<{ onNavigate: (v: any) => void }> = ({ onNavigate }) => {
  const { progress } = useApp();
  const verifiedCerts = Object.values(progress.certificationStatus || {}).filter(status => status === 'verified').length;
  const vmReady = !!progress.vmShowcaseUnlocked;

  return (
    <div className="space-y-6">
      <section>
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-black italic tracking-tighter uppercase">STRENGTH REPORT.</h1>
                <p className="text-neutral-500 font-medium italic">Level: {progress.level?.toUpperCase() || 'RECRUIT'}</p>
            </div>
            <div className="p-2 border-2 border-black bg-red-500 text-white animate-pulse cursor-pointer" onClick={() => onNavigate('live')}>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    <span className="font-black text-[10px] tracking-widest">LIVE</span>
                </div>
            </div>
        </div>
      </section>

      <Card brutal className="bg-white p-6 space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="font-black text-xs uppercase tracking-[0.2em] opacity-50">Mastery Progress</h2>
            <div className="bg-black text-white px-2 py-1 flex items-center gap-1">
                <Zap size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="font-black text-[10px]">RANK: {progress.xp > 500 ? 'HUNTER' : 'SCOUT'}</span>
            </div>
        </div>
        
        <div className="flex items-center gap-8">
            <ProgressRing progress={32} size={100} strokeWidth={10} color="#10b981" />
            <div className="space-y-2">
                <div>
                    <p className="text-3xl font-black italic tracking-tighter">LEVEL 4</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 underline decoration-emerald-500 underline-offset-4">Identity Architect</p>
                </div>
                <p className="text-xs font-bold text-neutral-500">{progress.xp} / 1000 XP to next rank</p>
            </div>
        </div>
      </Card>

      <section className="space-y-4">
        <h3 className="font-black text-lg italic uppercase tracking-tighter flex items-center gap-2">
            <BarChart size={18} />
            Tool Connection Status
        </h3>
        <div className="grid grid-cols-2 gap-4">
            <Card className={`p-4 border-2 ${progress.credentials?.githubUsername ? 'border-emerald-500 bg-emerald-50' : 'border-neutral-200 opacity-60'}`}>
                {/* ... github card ... */}
                <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">GitHub</p>
                <p className="text-xs font-black truncate">{progress.credentials?.githubUsername || 'Not Linked'}</p>
                <p className={`text-[8px] font-black uppercase mt-2 ${progress.credentials?.githubUsername ? 'text-emerald-600' : 'text-red-500'}`}>
                    {progress.credentials?.githubUsername ? 'UPLINK ACTIVE' : 'MISSING AUTH'}
                </p>
            </Card>
            <Card className={`p-4 border-2 ${progress.credentials?.hfUsername ? 'border-emerald-500 bg-emerald-50' : 'border-neutral-200 opacity-60'}`}>
                {/* ... hf card ... */}
                <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">HuggingFace</p>
                <p className="text-xs font-black truncate">{progress.credentials?.hfUsername || 'Not Linked'}</p>
                <p className={`text-[8px] font-black uppercase mt-2 ${progress.credentials?.hfUsername ? 'text-emerald-600' : 'text-red-500'}`}>
                    {progress.credentials?.hfUsername ? 'HUB CONNECTED' : 'MISSING AUTH'}
                </p>
            </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-black text-lg italic uppercase tracking-tighter flex items-center gap-2">
            <GraduationCap size={18} />
            Credential + VM State
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 border-2 border-blue-500/40 bg-blue-500/10">
            <p className="text-[10px] font-black uppercase text-blue-300 mb-1 tracking-widest">Verified Credentials</p>
            <p className="text-2xl font-black text-white">{verifiedCerts}</p>
            <button className="mt-3 text-[10px] font-black uppercase tracking-widest text-blue-300 hover:text-white" onClick={() => onNavigate('certifications')}>
              Open Command
            </button>
          </Card>
          <Card className={`p-4 border-2 ${vmReady ? 'border-emerald-500 bg-emerald-500/10' : 'border-neutral-600 bg-neutral-900/60'}`}>
            <p className="text-[10px] font-black uppercase text-neutral-300 mb-1 tracking-widest">Agent VM</p>
            <p className="text-sm font-black text-white">{vmReady ? 'UNLOCKED' : 'LOCKED'}</p>
            <button className="mt-3 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300" onClick={() => onNavigate('agent-vm')}>
              Open VM Path
            </button>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-black text-lg italic uppercase tracking-tighter flex items-center gap-2">
            <Target size={18} />
            Engagement & Sentiment
        </h3>
        <Card brutal className="bg-emerald-500 text-white p-4">
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Academy Sentiment</p>
                    <p className="text-2xl font-black italic tracking-tighter uppercase">High Operational Stability</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-black">{progress.feedback?.length || 0}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-80">Intel Reports</p>
                </div>
            </div>
            <div className="h-1 bg-black/20 w-full mt-4 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[88%]" />
            </div>
            <p className="text-[10px] font-bold mt-2 italic opacity-90">"88% Mission Success Rate reported by community architects."</p>
        </Card>
      </section>

      <section className="space-y-4">
        <h3 className="font-black text-lg italic uppercase tracking-tighter flex items-center gap-2">
            <Zap size={18} className="fill-emerald-500 text-emerald-500" />
            Agent System Health (SSA)
        </h3>
        <div className="grid gap-3">
          <div className="p-4 bg-black border border-white/10 flex justify-between items-center group hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Agents</p>
                <p className="text-lg font-black text-white leading-none">10 / 10</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Status</p>
              <p className="text-sm font-black text-white leading-none">NOMINAL</p>
            </div>
          </div>
          
          <div className="p-4 border-2 border-black flex justify-between items-center bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
             <div>
                <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">Receipt Audits</p>
                <p className="text-lg font-black leading-none">38 Processed</p>
             </div>
             <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-emerald-500 text-white">
                <Target size={20} />
             </div>
          </div>

          <div className="flex gap-2">
             {['VECTOR', 'ARIA', 'WARD', 'GOVERNOR'].map(agent => (
               <div key={agent} className="flex-1 p-2 bg-neutral-100 border border-black text-center">
                 <p className="text-[8px] font-black text-black/50 uppercase leading-none mb-1">{agent}</p>
                 <div className="h-1 bg-emerald-500 w-full" />
               </div>
             ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4">
        <Card className="flex items-center gap-4 p-4 hover:border-black transition-colors">
            <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center border-2 border-black">
                <Target size={24} className="text-black" />
            </div>
            <div className="flex-1">
                <h3 className="font-black text-sm uppercase tracking-tight">Active Goals</h3>
                <p className="text-xs text-neutral-500 font-medium">Complete Week 1 Foundations Path</p>
            </div>
            <div className="text-right">
                <p className="font-black text-sm">3/5</p>
            </div>
        </Card>

        <Card className="flex items-center gap-4 p-4 hover:border-black transition-colors">
            <div className="w-12 h-12 bg-neutral-100 border-2 border-black flex items-center justify-center">
                <History size={24} className="text-black" />
            </div>
            <div className="flex-1">
                <h3 className="font-black text-sm uppercase tracking-tight">Study Time</h3>
                <p className="text-xs text-neutral-500 font-medium">Last 7 Sessions</p>
            </div>
            <div className="text-right">
                <p className="font-black text-sm">4.2h</p>
            </div>
        </Card>
      </div>

      <section className="space-y-4">
        <h3 className="font-black text-lg italic uppercase tracking-tighter flex items-center gap-2">
            <Star size={18} className="fill-black" />
            Weak Areas To Review
        </h3>
        <Card className="p-4 border-2 border-dashed border-neutral-300 bg-neutral-50 text-center opacity-70">
            <p className="text-xs font-bold text-neutral-500">No weak areas detected yet. Keep pushing.</p>
        </Card>
      </section>
    </div>
  );
};
