/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: PRODUCT.BEAST.COMPONENT
TAG: UI.BEAST.COMPONENT.PROCTOR_BANNER
DESCRIPTION: Proctoring banner for Agent Lee to guide students

5WH:
  WHAT = ProctorBanner — UI Component
  WHY = Provides proctor-led guidance throughout the application
  WHO = Leeway Innovations
  WHERE = src/components/ProctorBanner.tsx
  WHEN = 2026-04-21
  HOW = Motion-enhanced React component listening to EventBus

AGENTS: GOVERNOR, ARIA
LICENSE: MIT
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Info, AlertTriangle, Zap } from 'lucide-react';
import { subscribeToAgentEvents } from '../services/ai';

export const ProctorBanner: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<'info' | 'warn' | 'alert'>('info');

  useEffect(() => {
    const unsubscribe = subscribeToAgentEvents((event: any) => {
      if (event.type === 'agent:active' && event.agent === 'AgentLee') {
        setMessage(event.task);
        setType('info');
      } else if (event.type === 'agent:error') {
        setMessage(event.error);
        setType('alert');
      } else if (event.type === 'agent:thinking') {
        setMessage('LEAD_PROCTOR: Analyzing your trajectory...');
        setType('info');
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-16 left-0 right-0 z-[60] max-w-md mx-auto p-3 border-b-2 border-black flex items-center gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.5)] ${
          type === 'info' ? 'bg-emerald-500 text-black' : 
          type === 'alert' ? 'bg-red-500 text-white' : 
          'bg-yellow-400 text-black'
        }`}
      >
        <div className="bg-black/20 p-1.5 rounded-none">
          {type === 'info' && <ShieldCheck size={18} />}
          {type === 'alert' && <AlertTriangle size={18} />}
          {type === 'warn' && <Zap size={18} />}
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest leading-tight">
            {type === 'info' ? 'PROCTOR_DIRECTIVE' : 'SYSTEM_ALERT'}
          </p>
          <p className="text-xs font-bold italic line-clamp-1">{message}</p>
        </div>
        <button 
          onClick={() => setMessage(null)}
          className="text-[10px] font-black underline uppercase"
        >
          Dismiss
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
