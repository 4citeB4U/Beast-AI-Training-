/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

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
import { Home, Compass, Trophy, Settings, Zap, GraduationCap, Cpu, MessageSquarePlus, Bot, Code2 } from 'lucide-react';
import { AppProvider, useApp } from './AppContext';
import { OnboardingView } from './views/Onboarding';
import { FeedbackModal } from './components/FeedbackModal';
import { Lesson } from './types';
import { loadRuntimeModules as loadOptionalRuntimeModules } from './services/leewayRuntime';
import { BEAST_LOGO_SRC } from './assets/beastLogo';

type RuntimeBootstrap = {
  setLiteMode: (enabled: boolean) => void;
};

type EventBusLike = {
  on: (event: string, handler: (data: any) => void) => () => void;
};

let runtimeModulesPromise: Promise<{ runtimeBootstrap: RuntimeBootstrap; runtimeEventBus: EventBusLike }> | null = null;

const loadRuntimeModules = () => {
  if (!runtimeModulesPromise) {
    runtimeModulesPromise = loadOptionalRuntimeModules().then((modules) => ({
      runtimeBootstrap: modules.runtimeBootstrap as RuntimeBootstrap,
      runtimeEventBus: modules.runtimeEventBus as EventBusLike,
    }));
  }

  return runtimeModulesPromise;
};

// Lazy load views for better edge performance
const HomeView = React.lazy(() => import('./views/Home').then(m => ({ default: m.HomeView })));
const LibraryView = React.lazy(() => import('./views/Library').then(m => ({ default: m.LibraryView })));
const DashboardView = React.lazy(() => import('./views/Dashboard').then(m => ({ default: m.DashboardView })));
const RewardsView = React.lazy(() => import('./views/Rewards').then(m => ({ default: m.RewardsView })));
const SettingsView = React.lazy(() => import('./views/Settings').then(m => ({ default: m.SettingsView })));
const LessonPlayerView = React.lazy(() => import('./views/LessonPlayer').then(m => ({ default: m.LessonPlayerView })));
const ModuleView = React.lazy(() => import('./views/Module').then(m => ({ default: m.ModuleView })));
const ResourceView = React.lazy(() => import('./views/Resources').then(m => ({ default: m.ResourceView })));
const LiveClassView = React.lazy(() => import('./views/LiveClass').then(m => ({ default: m.LiveClassView })));
const AcademyPortalView = React.lazy(() => import('./views/AcademyPortal').then(m => ({ default: m.AcademyPortalView })));
const AgentVMView = React.lazy(() => import('./views/AgentVM').then(m => ({ default: m.AgentVMView })));
const BeastTrainingView = React.lazy(() => import('./components/BeastTraining').then(m => ({ default: m.default })));
const AIAssistant = React.lazy(() => import('./components/AIAssistant').then(m => ({ default: m.AIAssistant })));
const ProctorBanner = React.lazy(() => import('./components/ProctorBanner').then(m => ({ default: m.ProctorBanner })));
type View = 'home' | 'library' | 'beast-training' | 'dashboard' | 'rewards' | 'settings' | 'lesson-player' | 'module' | 'live' | 'resources' | 'certifications' | 'agent-vm';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = React.useState<View>('home');
  const [activeCourseId, setActiveCourseId] = React.useState<string | null>(null);
  const [activeModuleId, setActiveModuleId] = React.useState<string | null>(null);
  const [activeLesson, setActiveLesson] = React.useState<Lesson | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false);
  const [isVoiceActive, setIsVoiceActive] = React.useState(false);
  const { progress } = useApp();
  const devAutoSignIn = import.meta.env.DEV && ((import.meta.env.VITE_AUTO_SIGNIN_FOR_DEV ?? 'true') === 'true');

  React.useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let canceled = false;

    void loadRuntimeModules().then(({ runtimeBootstrap, runtimeEventBus }) => {
      if (canceled) return;

      // Listen for global voice session events from the SDK.
      unsubscribe = runtimeEventBus.on('voice:state', (data: any) => {
        setIsVoiceActive(data?.state === 'listening' || data?.state === 'speaking');
      });

      // Synchronize SDK LiteMode with App PerformanceMode.
      runtimeBootstrap.setLiteMode(!!progress.preferences.performanceMode);
    }).catch(() => {
      // Keep the app functional if runtime modules are unavailable.
    });

    return () => {
      canceled = true;
      if (unsubscribe) unsubscribe();
    };
  }, [progress.preferences.performanceMode]);

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

  if (!progress.hasOnboarded && !devAutoSignIn) {
    return (
      <div className="min-h-screen bg-neutral-50 text-black font-sans w-full max-w-md mx-auto p-4 md:p-6">
        <OnboardingView />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-hidden flex flex-col">
      {/* Tactical Overlays */}
      {!progress.preferences.performanceMode && (
        <>
          <div className="tactical-overlay" />
          <div className="vignette" />
          <div className="scanline" />
        </>
      )}
      
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('home')}>
          <img
            src={BEAST_LOGO_SRC}
            alt="B.E.A.S.T. AI Technologies logo"
            className="h-12 w-12 rounded-xl border border-yellow-400/40 bg-white object-cover shadow-[0_8px_20px_rgba(250,204,21,0.2)]"
          />
          <div className="flex flex-col -space-y-1">
            <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase">Beast AI <span className="text-emerald-600">Hero Academy Global</span></span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">India ↔ USA AI Transformation System</span>
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
            className="p-2 border border-white/20 bg-white/5 hover:bg-white/10 transition-colors text-slate-900"
            title="Send Feedback"
          >
            <MessageSquarePlus size={18} />
          </button>
          <div className="flex items-center gap-1 bg-yellow-400 border border-black px-2 py-0.5 text-black">
            <Zap size={14} className="fill-black" />
            <span className="font-bold text-sm tracking-tight">{progress.streak}</span>
          </div>
          <div className="w-8 h-8 bg-neutral-800 border border-white/20 flex items-center justify-center font-black text-xs uppercase text-slate-900">
            {progress.level?.charAt(0)}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto p-4 md:p-8 pb-40 md:pb-44 relative z-20 flex-1">
        <React.Suspense fallback={<div className="flex items-center justify-center h-64 font-black uppercase tracking-widest text-emerald-500 animate-pulse">Initializing Interface...</div>}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {currentView === 'home' && <HomeView onNavigate={navigate} onOpenModule={openModule} />}
              {currentView === 'library' && <LibraryView onOpenModule={openModule} onNavigate={navigate} />}
              {currentView === 'beast-training' && <BeastTrainingView onNavigate={navigate} />}
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
              {currentView === 'certifications' && <AcademyPortalView />}
              {currentView === 'agent-vm' && <AgentVMView />}
              {currentView === 'settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </React.Suspense>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 w-full px-4 md:px-6 py-3 border-t border-slate-200 bg-slate-50/95 backdrop-blur-sm z-30">
        {currentView !== 'lesson-player' && (
          <nav className="w-full max-w-6xl mx-auto bg-white border border-slate-200 flex items-center justify-between md:justify-around min-h-16 px-2 md:px-4 rounded-xl shadow-[0_10px_24px_-18px_rgba(0,0,0,0.35)] mb-2 overflow-x-auto">
            <NavButton icon={Home} label="Campus" active={currentView === 'home'} onClick={() => navigate('home')} />
            <NavButton icon={Compass} label="Curriculum" active={currentView === 'library'} onClick={() => navigate('library')} />
            <NavButton icon={Code2} label="Tools" active={currentView === 'beast-training'} onClick={() => navigate('beast-training')} />
            <NavButton icon={GraduationCap} label="Academy" active={currentView === 'certifications'} onClick={() => navigate('certifications')} />
            <NavButton icon={Trophy} label="Hall of Fame" active={currentView === 'rewards'} onClick={() => navigate('rewards')} />
            <NavButton icon={Cpu} label="Agent VM" active={currentView === 'agent-vm'} onClick={() => navigate('agent-vm')} />
            <NavButton icon={Settings} label="Identity" active={currentView === 'settings'} onClick={() => navigate('settings')} />
            <NavButton
              icon={Bot}
              label="Agent Monk"
              active={false}
              onClick={() => window.dispatchEvent(new Event('beast-open-assistant'))}
            />
          </nav>
        )}

        <div className="w-full max-w-6xl mx-auto flex items-center justify-center gap-2 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap overflow-x-auto">
          <span>© 2026 Beast AI Hero Academy Global</span>
          <span className="opacity-25">•</span>
          <span className="text-emerald-700/30 italic tracking-[0.25em]">Powered by Leeway Innovations</span>
        </div>
      </footer>

      <React.Suspense fallback={<div className="hidden" />}>
        {currentView !== 'lesson-player' && <AIAssistant hideLauncher />}
        <ProctorBanner />
      </React.Suspense>
    </div>
  );

};

const NavButton: React.FC<{ icon: any; label: string; active: boolean; onClick: () => void }> = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-0.5 transition-all px-1 py-1 ${active ? 'translate-y-[-2px]' : ''}`}
  >
    <div className={`p-2 rounded-xl transition-all duration-300 ${active ? 'bg-emerald-600 shadow-[0_8px_16px_rgba(5,150,105,0.28)] text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}>
      <Icon size={18} strokeWidth={active ? 2.4 : 2} />
    </div>
    <span className={`text-[9px] font-bold uppercase tracking-[0.12em] transition-opacity duration-300 ${active ? 'text-emerald-700 opacity-100' : 'opacity-40 text-slate-500'}`}>{label}</span>
  </button>
);

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
