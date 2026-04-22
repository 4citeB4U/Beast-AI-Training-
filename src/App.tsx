/*
LEEWAY HEADER — DO NOT REMOVE

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
WHAT = BEAST AI Component: App.tsx
WHY = Part of the BEAST AI Leeway Standards alignment
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = src/App.tsx
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
import { motion, AnimatePresence } from 'motion/react';
import { Home, Compass, BarChart2, Award, Settings, Zap } from 'lucide-react';
import { AppProvider, useApp } from './AppContext';
import { HomeView } from './views/Home';
import { LibraryView } from './views/Library';
import { DashboardView } from './views/Dashboard';
import { RewardsView } from './views/Rewards';
import { SettingsView } from './views/Settings';
import { LessonPlayerView } from './views/LessonPlayer';
import { ModuleView } from './views/Module';
import { ResourceView } from './views/Resources';
import { Lesson } from './types';

type View = 'home' | 'library' | 'dashboard' | 'rewards' | 'settings' | 'lesson-player' | 'module' | 'live' | 'resources';

import { OnboardingView } from './views/Onboarding';
import { LiveClassView } from './views/LiveClass';
import { AIAssistant } from './components/AIAssistant';
import { ProctorBanner } from './components/ProctorBanner';
import { FeedbackModal } from './components/FeedbackModal';
import { MessageSquarePlus } from 'lucide-react';
import { eventBus } from 'leeway-sdk/src/core/EventBus';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = React.useState<View>('home');
  const [activeCourseId, setActiveCourseId] = React.useState<string | null>(null);
  const [activeModuleId, setActiveModuleId] = React.useState<string | null>(null);
  const [activeLesson, setActiveLesson] = React.useState<Lesson | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false);
  const [isVoiceActive, setIsVoiceActive] = React.useState(false);
  const { progress } = useApp();

  React.useEffect(() => {
    // Listen for global voice session events from the SDK
    const unsub = eventBus.on('voice:state', (data: any) => {
      setIsVoiceActive(data.state === 'listening' || data.state === 'speaking');
    });
    return () => unsub();
  }, []);

  const navigate = (view: View) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const startLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setCurrentView('lesson-player');
  };

  const openModule = (courseId: string, moduleId: string) => {
    setActiveCourseId(courseId);
    setActiveModuleId(moduleId);
    setCurrentView('module');
  };

  if (!progress.hasOnboarded) {
    return (
      <div className="min-h-screen bg-neutral-50 text-black font-sans max-w-md mx-auto p-6">
        <OnboardingView />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans pb-24 relative overflow-hidden">
      {/* Tactical Overlays */}
      <div className="tactical-overlay" />
      <div className="vignette" />
      <div className="scanline" />
      
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('home')}>
          <div className="bg-white text-black p-1">
            <Zap size={20} className="fill-yellow-400 text-yellow-400" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="font-black text-xl tracking-tighter text-white">BEAST AI</span>
            <span className="text-[8px] font-black tracking-[0.1em] text-emerald-500 uppercase">Powered by Leeway Innovations</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isVoiceActive && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 border border-red-500/50"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[8px] font-black text-red-500 tracking-tighter uppercase">VOICE_LINK_ACTIVE</span>
            </motion.div>
          )}
          <button 
            onClick={() => setIsFeedbackOpen(true)}
            className="p-2 border border-white/20 bg-white/5 hover:bg-white/10 transition-colors text-white"
            title="Send Feedback"
          >
            <MessageSquarePlus size={18} />
          </button>
          <div className="flex items-center gap-1 bg-yellow-400 border border-black px-2 py-0.5 text-black">
            <Zap size={14} className="fill-black" />
            <span className="font-bold text-sm tracking-tight">{progress.streak}</span>
          </div>
          <div className="w-8 h-8 bg-neutral-800 border border-white/20 flex items-center justify-center font-black text-xs uppercase text-white">
            {progress.level?.charAt(0)}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-6 relative z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {currentView === 'home' && <HomeView onNavigate={navigate} onOpenModule={openModule} />}
            {currentView === 'library' && <LibraryView onOpenModule={openModule} />}
            {currentView === 'module' && activeCourseId && activeModuleId && (
              <ModuleView courseId={activeCourseId} moduleId={activeModuleId} onStartLesson={startLesson} onBack={() => navigate('library')} />
            )}
            {currentView === 'lesson-player' && activeLesson && (
              <LessonPlayerView lesson={activeLesson} onFinish={() => navigate('dashboard')} onBack={() => navigate('module')} />
            )}
            {currentView === 'dashboard' && <DashboardView onNavigate={(v: any) => navigate(v)} />}
            {currentView === 'live' && <LiveClassView onBack={() => navigate('dashboard')} />}
            {currentView === 'rewards' && <RewardsView />}
            {currentView === 'resources' && <ResourceView />}
            {currentView === 'settings' && <SettingsView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      {currentView !== 'lesson-player' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around h-20 px-4 z-50 max-w-md mx-auto">
          <NavButton icon={Home} label="Home" active={currentView === 'home'} onClick={() => navigate('home')} />
          <NavButton icon={Compass} label="Courses" active={currentView === 'library'} onClick={() => navigate('library')} />
          <NavButton icon={Compass} label="Armory" active={currentView === 'resources'} onClick={() => navigate('resources')} />
          <NavButton icon={BarChart2} label="Stats" active={currentView === 'dashboard'} onClick={() => navigate('dashboard')} />
          <NavButton icon={Award} label="Badges" active={currentView === 'rewards'} onClick={() => navigate('rewards')} />
          <NavButton icon={Settings} label="Setup" active={currentView === 'settings'} onClick={() => navigate('settings')} />
        </nav>
      )}

      {currentView !== 'lesson-player' && <AIAssistant />}
      <ProctorBanner />
    </div>
  );

};

const NavButton: React.FC<{ icon: any; label: string; active: boolean; onClick: () => void }> = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-black translate-y-[-4px]' : 'text-neutral-400'}`}
  >
    <div className={`p-2 ${active ? 'bg-emerald-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : ''}`}>
      <Icon size={20} strokeWidth={active ? 3 : 2} />
    </div>
    <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-50'}`}>{label}</span>
  </button>
);

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
