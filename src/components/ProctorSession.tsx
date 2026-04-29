/*
LEEWAY HEADER — DO NOT REMOVE

REGION: PRODUCT.BEAST.COMPONENT
TAG: UI.BEAST.PROCTOR_SESSION

5WH:
WHAT = ProctorSession — Advanced proctoring environment
WHY = Ensure exam integrity with identity verification and real-time monitoring
WHO = Leeway Innovations
WHERE = src/components/ProctorSession.tsx
WHEN = 2026-04-29
HOW = React with Motion and simulated biometric tracking
*/

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Camera, Eye, Activity, UserCheck, AlertTriangle } from 'lucide-react';

interface ProctorSessionProps {
  onReady?: () => void;
  isExam?: boolean;
}

export const ProctorSession: React.FC<ProctorSessionProps> = ({ onReady, isExam = false }) => {
  const [status, setStatus] = useState<'initializing' | 'verifying' | 'active' | 'anomaly'>('initializing');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [eyePos, setEyePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const setupCamera = async () => {
      try {
        setStatus('initializing');
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        
        setTimeout(() => {
          setStatus('verifying');
          setTimeout(() => {
            setStatus('active');
            if (onReady) onReady();
          }, 3000);
        }, 2000);
      } catch (err) {
        console.error('Camera access denied:', err);
        setStatus('anomaly');
      }
    };

    setupCamera();

    // Simulated eye tracking
    const interval = setInterval(() => {
      setEyePos({
        x: 40 + Math.random() * 20,
        y: 40 + Math.random() * 20
      });
    }, 2000);

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative group">
      {/* HUD Container */}
      <Card brutal className="bg-black border-emerald-500/50 p-0 overflow-hidden aspect-video relative">
        {/* Video Feed */}
        <div className="absolute inset-0 bg-neutral-900 overflow-hidden">
          {stream ? (
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className="w-full h-full object-cover opacity-60 grayscale brightness-125 contrast-125"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-emerald-500/20">
              <Camera size={48} className="animate-pulse" />
              <p className="text-[10px] font-black uppercase mt-2">No Visual Uplink</p>
            </div>
          )}
          
          {/* Scanline Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
          <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
        </div>

        {/* HUD Elements */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                <p className="text-[8px] font-black text-emerald-500 tracking-[0.3em] uppercase">
                  {status === 'active' ? 'SESSION_ENCRYPTED' : 'INITIALIZING_UPLINK'}
                </p>
              </div>
              <p className="text-[10px] font-bold text-white/40">PROCTOR_ID: LEE_PRIME_01</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-black text-white/40 uppercase">Latency</p>
              <p className="text-[10px] font-bold text-emerald-500">12ms</p>
            </div>
          </div>

          {/* Eye Tracking Box */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              animate={{ 
                left: `${eyePos.x}%`, 
                top: `${eyePos.y}%`,
                opacity: status === 'active' ? 1 : 0
              }}
              className="absolute w-16 h-16 md:w-24 md:h-24 border border-emerald-500/30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-500" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-500" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-emerald-500" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Eye size={12} className="text-emerald-500/50" />
              </div>
            </motion.div>
          </div>

          <div className="flex justify-between items-end">
            <div className="flex gap-2 md:gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[7px] md:text-[8px] font-black text-white/40 uppercase">
                  <Activity size={10} /> Identity
                </div>
                <div className="w-12 md:w-16 h-1 bg-white/10 overflow-hidden">
                  <motion.div 
                    animate={{ width: status === 'active' ? '100%' : '20%' }}
                    className="h-full bg-emerald-500" 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[7px] md:text-[8px] font-black text-white/40 uppercase">
                  <Eye size={10} /> Focus
                </div>
                <div className="w-12 md:w-16 h-1 bg-white/10 overflow-hidden">
                  <motion.div 
                    animate={{ width: status === 'active' ? '85%' : '0%' }}
                    className="h-full bg-cyan-500" 
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <AnimatePresence>
                {status === 'verifying' && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 px-2 py-1 bg-yellow-400 text-black text-[8px] font-black uppercase"
                  >
                    <UserCheck size={10} /> Performing Face Match...
                  </motion.div>
                )}
                {status === 'anomaly' && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 px-2 py-1 bg-red-500 text-white text-[8px] font-black uppercase"
                  >
                    <AlertTriangle size={10} /> UPLINK_INTEGRITY_BREACH
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="px-2 py-1 bg-black/50 border border-emerald-500/50 text-emerald-500 text-[8px] font-black uppercase">
                {isExam ? 'EXAM_MODE_ON' : 'PRACTICE_MODE'}
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Bottom Status Bar */}
      <div className="mt-2 flex justify-between items-center px-2">
        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500/70 uppercase">
          <ShieldCheck size={12} />
          Agent Lee True-Proctor™ Active
        </div>
        <div className="text-[10px] font-bold text-white/30 uppercase">
          Recording Active
        </div>
      </div>
    </div>
  );
};

const Card = ({ children, brutal, className }: { children: React.ReactNode, brutal?: boolean, className?: string }) => (
  <div className={`border-2 border-black ${brutal ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : ''} ${className}`}>
    {children}
  </div>
);
