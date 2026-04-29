/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: PRODUCT.BEAST.VIEW
TAG: UI.BEAST.VIEW.MODULE

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#E8F5E9

ICON_ASCII:
family=lucide
glyph=layout

5WH:
WHAT = BEAST AI Component: Module.tsx
WHY = Part of the BEAST AI Leeway Standards alignment
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = src/views/Module.tsx
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
import { Card, Button, ProgressBar } from '../components/UI';
import { ArrowLeft, Play, CheckCircle2, Lock, Clock } from 'lucide-react';
import { COURSES } from '../data';
import { useApp } from '../AppContext';
import { Lesson } from '../types';

export const ModuleView: React.FC<{
  courseId: string;
  moduleId: string;
  onStartLesson: (lesson: Lesson) => void;
  onBack: () => void;
}> = ({ courseId, moduleId, onStartLesson, onBack }) => {
  const { progress } = useApp();
  const course = COURSES.find(c => c.id === courseId);
  const module = course?.modules.find(m => m.id === moduleId);

  if (!course || !module) return null;

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 border-2 border-black bg-white hover:bg-neutral-50">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">{module.title}</h1>
            {course.isCertificationCourse && (
                <span className="px-1.5 py-0.5 bg-blue-500 text-white text-[8px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">PRO CERT</span>
            )}
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-1">{course.title}</p>
        </div>
      </header>

      <Card brutal className="bg-emerald-500 p-6 space-y-4">
        <div className="flex justify-between items-center text-black font-black">
          <span className="text-sm uppercase tracking-tight">Practical Outcome</span>
        </div>
        <div className="p-3 bg-black/10 border-2 border-black/20 text-black">
          <p className="text-xs font-black italic">"{module.outcome || 'Build a reusable AI tool asset.'}"</p>
        </div>
        <Button variant="primary" className="w-full" onClick={() => module.lessons[0] && onStartLesson(module.lessons[0])}>
          START MISSION
        </Button>
      </Card>

      <section className="space-y-4">
        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-neutral-400">Mission Intelligence</h3>
        <Card className="p-4 bg-white border-2 border-black">
            <p className="text-[10px] font-black uppercase text-neutral-400 mb-2">What you will extract:</p>
            <ul className="space-y-2">
                {course.expectations.map((exp, i) => (
                    <li key={i} className="flex gap-2 text-xs font-bold leading-tight">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        {exp}
                    </li>
                ))}
            </ul>
        </Card>
      </section>

      <section className="space-y-4">
        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-neutral-400">Path Breakdown</h3>
        <div className="space-y-4 relative">
          {/* Vertical line connector */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-neutral-200 -z-10" />

          {module.lessons.map((lesson, idx) => {
            const isCompleted = progress.completedLessonIds.includes(lesson.id);
            const isLocked = !isCompleted && idx > 0 && !progress.completedLessonIds.includes(module.lessons[idx-1].id);
            
            return (
              <div 
                key={lesson.id} 
                className={`flex gap-4 items-start group ${isLocked ? 'opacity-50' : 'cursor-pointer hover:translate-x-1 transition-transform'}`}
                onClick={() => !isLocked && onStartLesson(lesson)}
              >
                <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center border-2 border-black z-10 ${isCompleted ? 'bg-black text-white' : 'bg-white'}`}>
                  {isCompleted ? <CheckCircle2 size={24} /> : isLocked ? <Lock size={20} /> : <span className="font-black text-lg">{idx + 1}</span>}
                </div>
                <div className="bg-white border flex-1 p-4 border-neutral-200 group-hover:border-black transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-black text-sm uppercase tracking-tight">{lesson.title}</h4>
                    <div className="flex items-center gap-1 text-neutral-400">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold">{lesson.duration}</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 font-medium">{lesson.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
