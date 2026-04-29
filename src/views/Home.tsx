/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

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
import { Zap, Play, ChevronRight, Trophy, CheckCircle2, GraduationCap, Cpu } from 'lucide-react';
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
           <h1 className="text-5xl font-black italic tracking-tighter mb-2 uppercase text-slate-900">Hello, Beast.</h1>
           <p className="text-xl text-neutral-400 font-medium leading-relaxed">{getLevelAdvice()}</p>
        </div>
        <div className={`px-3 py-1 border-2 border-black font-black text-[10px] uppercase tracking-tighter ${progress.level === 'engineer' ? 'bg-red-500' : progress.level === 'builder' ? 'bg-yellow-400' : 'bg-emerald-500'}`}>
          LVL: {progress.level}
        </div>
      </section>

      {/* Hero Card */}
      <Card brutal className="bg-white/60 backdrop-blur-md p-0 overflow-hidden border border-white/20 relative shadow-slate-200/50">
        <div className={`h-1 w-full ${progress.level === 'engineer' ? 'bg-red-500' : progress.level === 'builder' ? 'bg-yellow-400' : 'bg-emerald-500'} shadow-[0_0_10px_rgba(16,185,129,0.5)]`} />
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-500 mb-2">Recommended Course</p>
              <h2 className="text-4xl font-black leading-tight mt-1 text-slate-900">{recommendedCourse.title}</h2>
            </div>
            <div className="bg-emerald-500 text-black p-2 cyber-glow">
              <Zap className="fill-black" size={24} />
            </div>
          </div>
          
          <div className="p-8 bg-black/40 border-2 border-white/5 rounded-3xl space-y-3">
             <div className="flex justify-between items-center">
                 <p className="text-xs font-bold uppercase text-emerald-500 tracking-widest">Expected Outcome</p>
                 <span className="bg-emerald-500 text-black px-3 py-1 rounded-full text-[10px] font-black">ACTIVE TRAINING</span>
             </div>
             <p className="text-lg font-medium italic text-slate-900/90 leading-relaxed">
                "{recommendedCourse.outcome}"
             </p>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 border-dashed space-y-2">
             <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">Learning Objectives</p>
             <ul className="text-[10px] font-bold space-y-2">
                {progress.level === 'beginner' && (
                    <>
                        <li className="flex items-center gap-2 text-emerald-600"><CheckCircle2 size={12} /> Master AI-900 Objectives</li>
                        <li className="flex items-center gap-2 text-slate-500"><div className="w-1.5 h-1.5 rounded-full bg-slate-300" /> Google AI Essentials</li>
                        <li className="flex items-center gap-2 text-slate-500"><div className="w-1.5 h-1.5 rounded-full bg-slate-300" /> Generative AI 18-Lesson</li>
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
            <span>START LEARNING</span>
            <Play size={18} className="fill-black group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Card>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4 border border-white/20 bg-black/40 space-y-3">
          <div className="flex items-center gap-2 text-blue-400">
            <GraduationCap size={16} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Official Certification Path</p>
          </div>
          <p className="text-xs font-bold text-neutral-300 leading-relaxed">
            Track real Microsoft and AWS credentials through official exam pages and verified completion states.
          </p>
          <Button variant="outline" size="sm" className="w-full" onClick={() => onNavigate('certifications')}>
            OPEN CERTIFICATION COMMAND
          </Button>
        </Card>

        <Card className="p-4 border border-white/20 bg-black/40 space-y-3">
          <div className="flex items-center gap-2 text-emerald-500">
            <Cpu size={16} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Leeway Agent Society Path</p>
          </div>
          <p className="text-xs font-bold text-neutral-300 leading-relaxed">
            Build agents with LeeWay Standards first, then unlock the Agent Lee VM demonstration as the advanced reveal.
          </p>
          <Button variant="outline" size="sm" className="w-full" onClick={() => onNavigate('agent-vm')}>
            OPEN AGENT VM PATH
          </Button>
        </Card>

        <Button variant="ghost" size="sm" className="w-full" onClick={() => onNavigate('resources')}>
          OPEN TECHNICAL RESOURCES
        </Button>
      </section>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex flex-col items-center justify-center py-4 bg-emerald-500 text-black border border-white/20 cyber-glow">
          <Trophy size={20} className="mb-1" />
          <span className="text-2xl font-black">{progress.xp}</span>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Total XP</span>
        </Card>
        <Card className="flex flex-col items-center justify-center py-4 bg-black/40 border border-white/10 text-slate-900">
          <Zap size={20} className="mb-1 text-yellow-400 fill-yellow-400" />
          <span className="text-2xl font-black">{progress.streak}</span>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Day Streak</span>
        </Card>
      </div>

      {/* Intelligence Feed */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-2xl uppercase italic text-slate-900">Academy Intelligence Feed</h3>
          <button className="text-xs font-bold uppercase tracking-widest text-emerald-600 hover:underline" onClick={() => onNavigate('library')}>Browse Full Curriculum</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map(course => (
            <Card key={course.id} className="p-8 group hover:border-emerald-500 cursor-pointer bg-white border-slate-100 transition-all" onClick={() => onNavigate('library')}>
              <div className="w-full h-48 rounded-2xl overflow-hidden border-2 border-slate-100 mb-6 relative">
                <img src={course.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">{course.targetLevel} Track</p>
                <h4 className="font-black text-xl uppercase tracking-tight text-slate-900 leading-tight">{course.title}</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-2">{course.description}</p>
                <div className="pt-4 flex items-center justify-between">
                   <span className="text-[10px] font-black uppercase text-slate-300">{course.modules.length} Specialized Modules</span>
                   <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
