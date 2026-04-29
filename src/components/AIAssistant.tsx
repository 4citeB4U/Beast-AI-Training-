/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: PRODUCT.BEAST.ASSISTANT
TAG: AI.BEAST.ASSISTANT_UI

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#E8F5E9

ICON_ASCII:
family=lucide
glyph=bot

5WH:
WHAT = BEAST AI Assistant Interface
WHY = Provides natural language interaction with the curriculum agents
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = src/components/AIAssistant.tsx
WHEN = 2026-04-21
HOW = Motion-enhanced React component with voice/TTS synapses

AGENTS:
ARIA
GOVERNOR
VECTOR

LICENSE:
MIT
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, Loader2, Mic, Settings2 } from 'lucide-react';
import { askAssistant, generateSpeech, subscribeToAgentEvents, startVoiceSession, stopVoiceSession } from '../services/ai';
import { Card, Button } from './UI';
import { useApp } from '../AppContext';
import { COURSES } from '../data';
import { VoiceService } from 'leeway-sdk/src/core/VoiceService';

const QUICK_PROMPTS = [
  'Career Plan',
  'Cert Roadmap',
  'Show Me Tool Calling'
];

export const AIAssistant: React.FC = () => {
  const { progress } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const learnerContext = React.useMemo(() => {
    const level = progress.level || 'beginner';
    const recommendedCourse = COURSES.find(c => c.targetLevel === level) || COURSES[0];
    const verifiedCerts = Object.values(progress.certificationStatus || {}).filter(status => status === 'verified').length;

    return [
      `Program: BEAST AI Learning`,
      `Learner Level: ${level}`,
      `Current Mission: ${recommendedCourse?.title || 'Mission 0'}`,
      `Completed Lessons: ${progress.completedLessonIds.length}`,
      `XP: ${progress.xp}`,
      `Certification Verifications: ${verifiedCerts}`,
      `Agent VM Unlocked: ${progress.vmShowcaseUnlocked ? 'yes' : 'no'}`,
      `Guidance Scope: Course coaching, career advising, coding and tool-calling examples`,
      `Leeway Baseline Autonomy: 70% load by standards core, 80% power with low agent duty, 90% with full agent orchestration`
    ].join('\n');
  }, [progress]);

  useEffect(() => {
    if (!isOpen) return;
    
    // Subscribe to real-time agent broadcasts from the SDK
    const unsubscribe = subscribeToAgentEvents((event: any) => {
      console.log('[AIAssistant] Event received:', event);
      
      switch (event.type) {
        case 'agent:active':
          setActiveAgents(prev => [...prev.slice(-2), `${event.agent}: ${event.task}`]);
          break;
        case 'agent:thinking':
          setActiveAgents(prev => [...prev.slice(-2), `AGENT_LEE: Thinking...`]);
          break;
        case 'agent:speaking':
          // Optional: handle streaming text if needed
          break;
        case 'agent:error':
          setActiveAgents(prev => [...prev.slice(-2), `ERROR: ${event.error}`]);
          break;
        case 'perception:voice-listening':
          setIsListening(true);
          break;
        case 'perception:voice-final':
          setIsListening(false);
          setInput(event.transcript);
          break;
        case 'runtime:ready':
          setActiveAgents(['SDK_READY: All systems nominal']);
          break;
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isOpen]);

  const startVoiceInput = async () => {
    try {
        if (isListening) {
            await stopVoiceSession();
            setIsListening(false);
        } else {
            await startVoiceSession();
            setIsListening(true);
        }
    } catch (error) {
        alert("VOICE_LINK_FAILURE: Could not establish secure audio channel.");
        console.error(error);
    }
  };

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim()) return;
    
    const userMsg = { role: 'user' as const, text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askAssistant(textToSend, learnerContext);
      const assistantMsg = { role: 'assistant' as const, text: response || "I'm sorry, I couldn't process that." };
      setMessages(prev => [...prev, assistantMsg]);
      
      if (isLive) {
        setIsSynthesizing(true);
        try {
          await VoiceService.speak({ text: assistantMsg.text });
        } finally {
          setIsSynthesizing(false);
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Engineering error. Check your uplink/API key." }]);
    } finally {
      setIsLoading(false);
      // In SDK voice mode, we might want to automatically resume listening
      if (isListening) {
          // The SDK's VoiceSession handles silence detection and stop_listening
          // We can reactivate it here if we want a continuous loop
      }
    }
  };

  const toggleLive = () => {
    setIsLive(!isLive);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 right-8 w-20 h-20 bg-emerald-600 text-white border-4 border-white shadow-2xl rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group"
      >
        <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
        <Bot size={32} className="relative z-10" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed inset-x-6 bottom-8 top-24 bg-white/95 backdrop-blur-3xl border border-slate-200 rounded-[3.5rem] shadow-[0_20px_70px_rgba(0,0,0,0.15)] z-50 flex flex-col md:max-w-md md:left-auto md:right-8 overflow-hidden"
          >
            <header className="p-8 border-b border-slate-100 flex items-center justify-between bg-emerald-600">
              <div className="flex flex-col -space-y-1">
                <span className="font-black text-lg italic tracking-tighter text-white">AGENT LEE</span>
                <span className="text-[8px] font-bold tracking-[0.2em] text-white/60 uppercase">Academy Intelligence Core</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleLive}
                  className={`p-1.5 border border-black transition-colors ${isLive ? 'bg-red-500 text-white animate-pulse' : 'bg-white/20 text-black'}`}
                  title="Toggle Natural Voice"
                >
                  <Mic size={16} />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-black"><X size={20} /></button>
              </div>
            </header>

            {/* SDK AGENT STATUS BAR */}
            <div className="bg-black text-emerald-500 px-4 py-1.5 flex items-center justify-between overflow-hidden border-b border-emerald-500/30">
              <div className="flex gap-4">
                {activeAgents.length > 0 ? activeAgents.map((m, i) => (
                  <span key={i} className="text-[8px] font-black tracking-widest uppercase animate-in fade-in slide-in-from-left-2 duration-500">
                    &gt; {m}
                  </span>
                )) : (
                  <span className="text-[8px] font-black tracking-widest uppercase opacity-50">&gt; SDK_INITIALIZING...</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-[8px] font-black">ACTIVE</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50 custom-scrollbar">
              {messages.length === 0 && (
                <div className="space-y-8 mt-10">
                  <p className="text-center text-sm font-medium text-slate-400 leading-relaxed">
                    Agent Lee is active. Ask for step-by-step guidance on courses, career development, or AI engineering.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSend(prompt)}
                        className="w-full text-left px-6 py-4 text-xs font-bold uppercase tracking-widest bg-white text-emerald-700 border border-slate-200 rounded-2xl hover:bg-emerald-50 hover:border-emerald-200 transition-all shadow-sm"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <Card className={`max-w-[85%] p-6 text-sm font-medium leading-relaxed ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                    {msg.text}
                  </Card>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="p-4 bg-white border border-slate-200 rounded-full shadow-sm animate-pulse">
                    <Loader2 size={20} className="animate-spin text-emerald-600" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t-2 border-black flex gap-2">
              <button 
                onClick={startVoiceInput}
                className={`p-2 border-2 border-black transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-black'}`}
              >
                <Mic size={16} />
              </button>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? "Listening..." : "Ask for clarification..."}
                className="flex-1 border-2 border-black p-2 text-xs font-bold focus:outline-none focus:bg-emerald-50 text-black"
              />
              <button 
                onClick={() => handleSend()} 
                className="bg-black text-white p-2 border-2 border-black"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
