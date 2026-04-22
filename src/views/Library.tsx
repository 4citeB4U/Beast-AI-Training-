/*
LEEWAY HEADER — DO NOT REMOVE

REGION: PRODUCT.BEAST.VIEW
TAG: UI.BEAST.VIEW.LIBRARY

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#E8F5E9

ICON_ASCII:
family=lucide
glyph=layout

5WH:
WHAT = BEAST AI Component: Library.tsx
WHY = Part of the BEAST AI Leeway Standards alignment
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = src/views/Library.tsx
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
import { Search, Filter, BookOpen, Lock, GraduationCap } from 'lucide-react';
import { COURSES } from '../data';
import { useApp } from '../AppContext';

export const LibraryView: React.FC<{
  onOpenModule: (courseId: string, moduleId: string) => void;
}> = ({ onOpenModule }) => {
  const { progress } = useApp();
  const [filterLevel, setFilterLevel] = React.useState(progress.level || 'beginner');

  const filteredCourses = COURSES.filter(c => c.targetLevel === filterLevel);
  const otherCourses = COURSES.filter(c => c.targetLevel !== filterLevel);

  return (
    <div className="space-y-6">
      <section className="flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-black italic tracking-tighter uppercase">COURSE LAB.</h1>
           <p className="text-neutral-500 font-medium italic">Your personalized sector: {filterLevel}</p>
        </div>
        <div className="flex gap-1">
            {['beginner', 'builder', 'engineer'].map(lvl => (
                <button 
                   key={lvl}
                   onClick={() => setFilterLevel(lvl as any)}
                   className={`px-2 py-0.5 text-[8px] font-black uppercase border border-black ${filterLevel === lvl ? 'bg-black text-white' : 'bg-white'}`}
                >
                    {lvl.slice(0,3)}
                </button>
            ))}
        </div>
      </section>

      <div className="space-y-8">
        {filteredCourses.length === 0 && (
            <p className="text-center py-12 text-xs font-black text-neutral-400 uppercase tracking-widest border-2 border-dashed border-neutral-200">
                No missions active in this sector.
            </p>
        )}
        
        {filteredCourses.map(course => (
          <div key={course.id} className="space-y-4">
            <div className="relative aspect-video border border-white/20 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] group tactical-image-container">
              <img src={course.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100" referrerPolicy="no-referrer" />
              <div className="tactical-overlay opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-20" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-30">
                <div>
                  <div className="flex gap-1 mb-1">
                    <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${filterLevel === 'engineer' ? 'bg-red-500 text-white' : filterLevel === 'builder' ? 'bg-yellow-400 text-black' : 'bg-emerald-500 text-black'}`}>
                        Active Mission
                    </span>
                    {course.isCertificationCourse && (
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-blue-500 text-white flex items-center gap-1 leading-none border border-white/20">
                        <GraduationCap size={10} /> PRO CERT
                      </span>
                    )}
                  </div>
                  <h2 className="text-white text-2xl font-black uppercase tracking-tighter drop-shadow-md">{course.title}</h2>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {course.modules.map(module => (
                <Card key={module.id} className="p-4 flex flex-col gap-4 border-2 border-black hover:bg-neutral-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-lg uppercase tracking-tight">{module.title}</h3>
                      <p className="text-xs text-neutral-500 font-medium">{module.lessons.length} Lessons &bull; {module.description}</p>
                    </div>
                  </div>
                  <Button 
                    variant="brutal" 
                    size="sm" 
                    className="w-full"
                    onClick={() => onOpenModule(course.id, module.id)}
                  >
                    DEPLOY UNIT
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Locked/Other Chapters */}
        <div className="pt-8 border-t-2 border-black border-dashed">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-4">External Sectors</h3>
            {otherCourses.map(course => (
                <div key={course.id} className="flex items-center justify-between p-3 border-2 border-neutral-200 bg-neutral-50 mb-2 grayscale opacity-50">
                    <div className="flex items-center gap-3">
                        <Lock size={14} className="text-neutral-400" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-tight">{course.title}</p>
                            <p className="text-[8px] font-bold text-neutral-400 uppercase">Required: {course.targetLevel}</p>
                        </div>
                    </div>
                    <button className="text-[8px] font-black uppercase tracking-widest text-neutral-300">Locked</button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
