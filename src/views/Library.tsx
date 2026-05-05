/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

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
import { GraduationCap, Rocket, Bot } from 'lucide-react';
import { COURSES } from '../data';
import { useApp } from '../AppContext';

const resolveCourseImage = (image: string): string => {
  if (/^https?:\/\//i.test(image)) return image;
  return `${import.meta.env.BASE_URL}${image.replace(/^\/+/, '')}`;
};

const fallbackCourseImage = `${import.meta.env.BASE_URL}assets/advanced.png`;

export const LibraryView: React.FC<{
  onOpenModule: (courseId: string, moduleId: string) => void;
  onNavigate: (view: any) => void;
}> = ({ onOpenModule, onNavigate }) => {
  const { progress } = useApp();
  const [filterLevel, setFilterLevel] = React.useState(progress.level || 'beginner');

  const orderedCourses = React.useMemo(() => {
    const levelRank: Record<string, number> = {
      beginner: 0,
      builder: 1,
      engineer: 2,
    };

    return [...COURSES].sort((a, b) => {
      const aIsLeeway = a.id === 'leeway-standards-engineer';
      const bIsLeeway = b.id === 'leeway-standards-engineer';
      if (aIsLeeway && !bIsLeeway) return 1;
      if (!aIsLeeway && bIsLeeway) return -1;
      return (levelRank[a.targetLevel] ?? 99) - (levelRank[b.targetLevel] ?? 99);
    });
  }, []);

  return (
    <div className="space-y-6">
      <section className="flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">Course Library.</h1>
          <p className="text-neutral-500 font-medium italic">All Microsoft, Azure, Google, and Agent tracks are available here. Suggested start: {filterLevel}.</p>
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

      <Card className="p-5 border-2 border-emerald-500 bg-emerald-50/50 space-y-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Hands-On Training Under Curriculum</p>
        <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">Build Real AI Tools - Take-Home Toolkit</h2>
        <p className="text-sm font-semibold text-slate-700 leading-relaxed">
          Open the Tools tab to launch the full BeastTraining component, build low-code/no-code AI products, deploy working systems, and keep your take-home toolkit.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="brutal" className="bg-emerald-600 text-white border-emerald-900" onClick={() => onNavigate('beast-training')}>
            <Rocket size={12} /> Open Tools Tab
          </Button>
          <Button size="sm" variant="outline" className="border-violet-300 text-violet-700" onClick={() => window.dispatchEvent(new Event('beast-open-assistant'))}>
            <Bot size={12} /> Ask Monk
          </Button>
        </div>
      </Card>

      <div className="space-y-8">
        {orderedCourses.map(course => (
          <div key={course.id} className="space-y-4">
            <div className="relative aspect-video border border-white/20 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] group tactical-image-container">
              <img
                src={resolveCourseImage(course.image)}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                onError={(e) => {
                  e.currentTarget.src = fallbackCourseImage;
                }}
              />
              <div className="tactical-overlay opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-20" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-30">
                <div>
                  <div className="flex gap-1 mb-1">
                    <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${course.targetLevel === 'engineer' ? 'bg-red-500 text-white' : course.targetLevel === 'builder' ? 'bg-yellow-400 text-black' : 'bg-emerald-500 text-black'}`}>
                        {course.targetLevel === filterLevel ? 'Recommended Now' : `Open Track • ${course.targetLevel}`}
                    </span>
                    {course.isCertificationCourse && (
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-blue-500 text-white flex items-center gap-1 leading-none border border-white/20">
                        <GraduationCap size={10} /> PRO CERT
                      </span>
                    )}
                    {course.id === 'leeway-standards-engineer' && (
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-purple-700 text-white border border-white/20">
                        ADVANCED MASTERY
                      </span>
                    )}
                  </div>
                  <h2 className="text-white text-2xl font-black uppercase tracking-tighter drop-shadow-md">{course.title}</h2>
                </div>
              </div>
            </div>

            {course.id === 'leeway-standards-engineer' && (
              <Card className="p-4 border-2 border-purple-700 bg-purple-50 text-purple-900">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Advanced Advisory</p>
                <p className="text-xs font-bold leading-relaxed">
                  Advanced Mastery Track. Recommended after Microsoft/Azure/Google completion. You can begin this path at any time.
                </p>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </div>
    </div>
  );
};
