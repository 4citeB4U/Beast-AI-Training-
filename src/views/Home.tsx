/*
LEEWAY HEADER — DO NOT REMOVE

REGION: PRODUCT.BEAST.VIEW
TAG: UI.BEAST.VIEW.HOME

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#E8F5E9

ICON_ASCII:
family=lucide
glyph=layout

5WH:
WHAT = BEAST AI Component: Home.tsx
WHY = Part of the BEAST AI Leeway Standards alignment
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = src/views/Home.tsx
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
import { Card, Button, ProgressRing } from '../components/UI';
import { Zap, Play, ChevronRight, Trophy, CheckCircle2 } from 'lucide-react';
import { useApp } from '../AppContext';
import { COURSES } from '../data';

export const HomeView: React.FC<{ 
  onNavigate: (view: any) => void;
  onOpenModule: (courseId: string, moduleId: string) => void;
}> = ({ onNavigate, onOpenModule }) => {
  const { progress } = useApp();
  
  // Find the course matching user's level or fallback
  const recommendedCourse = COURSES.find(c => c.targetLevel === progress.level) || COURSES[0];
  const recommendedModule = recommendedCourse.modules[0];

  const getLevelAdvice = () => {
    switch(progress.level) {
      case 'engineer': return 'Primary Focus: Evaluation & Performance Matrices.';
      case 'builder': return 'Primary Focus: Tool Integration & Automation.';
      default: return 'Primary Focus: Munitions Setup & Identity.';
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex justify-between items-end">
        <div>
           <h1 className="text-4xl font-black italic tracking-tighter mb-1 uppercase">HELLO, BEAST.</h1>
           <p className="text-neutral-500 font-medium">{getLevelAdvice()}</p>
        </div>
        <div className={`px-3 py-1 border-2 border-black font-black text-[10px] uppercase tracking-tighter ${progress.level === 'engineer' ? 'bg-red-500' : progress.level === 'builder' ? 'bg-yellow-400' : 'bg-emerald-500'}`}>
          LVL: {progress.level}
        </div>
      </section>

      {/* Hero Card */}
      <Card brutal className="bg-black/60 backdrop-blur-md p-0 overflow-hidden border border-white/20 relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div className={`h-1 w-full ${progress.level === 'engineer' ? 'bg-red-500' : progress.level === 'builder' ? 'bg-yellow-400' : 'bg-emerald-500'} shadow-[0_0_10px_rgba(16,185,129,0.5)]`} />
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">Operation Status</p>
              <h2 className="text-3xl font-black leading-tight mt-1 cyber-text-glow">{recommendedCourse.title}</h2>
            </div>
            <div className="bg-emerald-500 text-black p-2 cyber-glow">
              <Zap className="fill-black" size={24} />
            </div>
          </div>
          
          <div className="p-4 bg-white/5 border border-white/10 border-dashed space-y-2">
             <div className="flex justify-between items-center">
                 <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">Practical Intent</p>
                 <span className="bg-emerald-500 text-black px-1.5 py-0.5 text-[8px] font-black animate-pulse">UPLINK ACTIVE</span>
             </div>
             <p className="text-xs font-black italic text-white/90 leading-tight">
                "{recommendedCourse.outcome}"
             </p>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 border-dashed space-y-2">
             <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">Loadout Objectives</p>
             <ul className="text-[10px] font-bold space-y-2">
                {progress.level === 'beginner' && (
                    <>
                        <li className="flex items-center gap-2 text-emerald-400"><CheckCircle2 size={12} /> Establish GitHub Link</li>
                        <li className="flex items-center gap-2 text-neutral-300"><div className="w-1.5 h-1.5 rounded-full bg-neutral-600" /> HuggingFace Account</li>
                        <li className="flex items-center gap-2 text-neutral-300"><div className="w-1.5 h-1.5 rounded-full bg-neutral-600" /> VS Code Setup</li>
                    </>
                )}
                {/* ... other levels ... */}
             </ul>
          </div>

          <Button 
            variant="brutal" 
            className="w-full justify-between group"
            onClick={() => onOpenModule(recommendedCourse.id, recommendedModule.id)}
          >
            <span>INITIATE DEPLOYMENT</span>
            <Play size={18} className="fill-black group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col items-center justify-center py-4 bg-emerald-500 text-black border border-white/20 cyber-glow">
          <Trophy size={20} className="mb-1" />
          <span className="text-2xl font-black">{progress.xp}</span>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Total XP</span>
        </Card>
        <Card className="flex flex-col items-center justify-center py-4 bg-black/40 border border-white/10 text-white">
          <Zap size={20} className="mb-1 text-yellow-400 fill-yellow-400" />
          <span className="text-2xl font-black">{progress.streak}</span>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Day Streak</span>
        </Card>
      </div>

      {/* Today's Focus */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-xl uppercase italic">Today's Focus</h3>
          <button className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-black">View All</button>
        </div>
        
        <div className="space-y-4">
          {COURSES.map(course => (
            <Card key={course.id} className="p-4 flex items-center gap-4 hover:border-emerald-500 cursor-pointer group bg-black/40 border-white/10" onClick={() => onNavigate('library')}>
              <div className="tactical-image-container w-16 h-16 border border-white/20">
                <img src={course.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                <div className="tactical-overlay opacity-50" />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-sm uppercase tracking-tight text-white">{course.title}</h4>
                <p className="text-xs text-neutral-400 font-medium">{course.modules.length} Modules &bull; {course.description.slice(0, 40)}...</p>
              </div>
              <ChevronRight size={16} className="text-neutral-600 group-hover:text-emerald-500 transition-colors" />
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
