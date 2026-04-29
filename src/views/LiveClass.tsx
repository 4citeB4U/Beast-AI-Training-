/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: PRODUCT.BEAST.VIEW
TAG: UI.BEAST.VIEW.LIVECLASS

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#E8F5E9

ICON_ASCII:
family=lucide
glyph=layout

5WH:
WHAT = BEAST AI Component: LiveClass.tsx
WHY = Part of the BEAST AI Leeway Standards alignment
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = src/views/LiveClass.tsx
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
import { Play, Users, MessageSquare, ArrowLeft, Clock, History } from 'lucide-react';

export const LiveClassView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [status, setStatus] = React.useState<'waiting' | 'in-class'>('waiting');

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 border-2 border-black bg-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tighter italic">LIVE COMMAND.</h1>
      </header>

      {status === 'waiting' ? (
        <Card brutal className="bg-black text-white space-y-6 text-center py-12">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 animate-pulse" />
            <Users size={64} className="relative z-10 mx-auto text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tighter uppercase italic">Waiting Room</h2>
            <p className="text-emerald-500 font-black uppercase tracking-[0.2em] text-xs">UPLINK ESTABLISHED: STANDBY</p>
          </div>
          <p className="text-neutral-400 font-bold max-w-xs mx-auto">
            The next session begins in 14 minutes. We will automatically transition you when the floor opens.
          </p>
          <div className="flex justify-center gap-2">
            <div className="bg-white/10 px-3 py-1 flex items-center gap-2">
                <Clock size={14} />
                <span className="text-[10px] font-black">START: 18:00 UTC</span>
            </div>
          </div>
          <Button variant="secondary" className="w-full" onClick={() => setStatus('in-class')}>MANUAL OVERRIDE</Button>
        </Card>
      ) : (
        <div className="space-y-6">
            <div className="aspect-video bg-neutral-900 border-4 border-black relative overflow-hidden">
                <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-0.5 flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase">LIVE</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white/20 font-black text-4xl italic select-none">BEAST STREAM</p>
                </div>
            </div>

            <div className="flex gap-4">
                <Card className="flex-1 p-4 flex items-center gap-3">
                    <Users size={20} className="text-emerald-500" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Attendees</p>
                        <p className="font-black">1.2k</p>
                    </div>
                </Card>
                <Card className="flex-1 p-4 flex items-center gap-3">
                    <MessageSquare size={20} className="text-yellow-400" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Pulse</p>
                        <p className="font-black">ACTIVE</p>
                    </div>
                </Card>
            </div>

            <section className="space-y-4">
                <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
                    <History size={16} />
                    Past Transmissions
                </h3>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <Card key={i} className="p-3 flex items-center justify-between hover:border-black cursor-pointer group">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center border-2 border-black">
                                    <Play size={16} className="group-hover:fill-black" />
                                </div>
                                <div>
                                    <h4 className="font-black text-xs uppercase tracking-tight">Session #{i} Recording</h4>
                                    <p className="text-[10px] text-neutral-500 font-bold">Recorded 2 days ago &bull; 45m</p>
                                </div>
                             </div>
                             <Button size="sm" variant="ghost"><Clock size={16} /></Button>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
      )}
    </div>
  );
};
