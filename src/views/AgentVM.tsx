/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: PRODUCT.BEAST.VIEW
TAG: UI.BEAST.VIEW.AGENTVM

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#E8F5E9

ICON_ASCII:
family=lucide
glyph=layout

5WH:
WHAT = BEAST AI Component: AgentVM.tsx
WHY = Part of the BEAST AI Leeway Standards alignment
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = src/views/AgentVM.tsx
WHEN = 2026-04-22
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
import { Button, Card } from '../components/UI';
import { AGENT_LEE_VM_PHASES } from '../data';
import { useApp } from '../AppContext';
import { CheckCircle2, Cpu, Lock, TerminalSquare, Zap } from 'lucide-react';

export const AgentVMView: React.FC = () => {
  const { progress, unlockVmShowcase } = useApp();

  const lessonsCompleted = progress.completedLessonIds.length;
  const verifiedCerts = Object.values(progress.certificationStatus || {}).filter(s => s === 'verified').length;
  const canUnlock = lessonsCompleted >= 3 || verifiedCerts >= 1;
  const unlocked = !!progress.vmShowcaseUnlocked;

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">Agent Lee VM.</h1>
        <p className="text-neutral-400 font-medium">
          This is the advanced reveal path where Agent Lee demonstrates the virtual machine and society-level orchestration.
        </p>
      </section>

      <Card brutal className="bg-black border border-emerald-500/40 p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-emerald-500">
            <Cpu size={18} />
            <p className="text-xs font-black uppercase tracking-[0.2em]">Unlock Conditions</p>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
            Lessons: {lessonsCompleted} / 3
          </span>
        </div>
        <p className="text-xs font-bold text-white/80 leading-relaxed">
          Complete at least 3 lessons or verify at least 1 official certification to unlock the VM demonstration sequence.
        </p>
        {!unlocked && (
          <Button
            variant={canUnlock ? 'secondary' : 'outline'}
            className="w-full"
            disabled={!canUnlock}
            onClick={unlockVmShowcase}
          >
            {canUnlock ? <Zap size={14} /> : <Lock size={14} />}
            {canUnlock ? 'UNLOCK AGENT LEE VM' : 'LOCKED - CONTINUE TRAINING'}
          </Button>
        )}
      </Card>

      <div className="space-y-3">
        {AGENT_LEE_VM_PHASES.map((phase, index) => {
          const isFinal = index === AGENT_LEE_VM_PHASES.length - 1;
          const available = !isFinal || unlocked;

          return (
            <Card key={phase.id} className={`p-4 border ${available ? 'border-white/20 bg-black/40' : 'border-neutral-700 bg-neutral-900/70 opacity-70'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 flex items-center justify-center border font-black text-xs ${available ? 'border-emerald-500 text-emerald-500' : 'border-neutral-600 text-neutral-500'}`}>
                  {available ? <CheckCircle2 size={16} /> : <Lock size={16} />}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Phase {index + 1}</p>
                  <h3 className="text-base font-black uppercase tracking-tight">{phase.title}</h3>
                  <p className="text-xs font-bold text-neutral-400 leading-relaxed">{phase.detail}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-5 border border-white/20 bg-neutral-950 space-y-3">
        <div className="flex items-center gap-2 text-emerald-500">
          <TerminalSquare size={16} />
          <p className="text-xs font-black uppercase tracking-[0.2em]">VM Console Preview</p>
        </div>
        <div className="bg-black border border-neutral-800 p-3 font-mono text-[11px] text-emerald-400 space-y-1">
          <p>&gt; agent_lee_vm --boot</p>
          <p>&gt; loading society orchestration graph...</p>
          <p>&gt; policy contract sync: active</p>
          <p>&gt; toolchain readiness: operational</p>
          <p>&gt; voice channel: armed</p>
        </div>
      </Card>
    </div>
  );
};
