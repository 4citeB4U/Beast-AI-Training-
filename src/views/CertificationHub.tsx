/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: PRODUCT.BEAST.VIEW
TAG: UI.BEAST.VIEW.CERTIFICATIONHUB

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#E8F5E9

ICON_ASCII:
family=lucide
glyph=layout

5WH:
WHAT = BEAST AI Component: CertificationHub.tsx
WHY = Part of the BEAST AI Leeway Standards alignment
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = src/views/CertificationHub.tsx
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
import { CERTIFICATION_PROGRAMS } from '../data';
import { useApp } from '../AppContext';
import { CertificationStatus } from '../types';
import { ExternalLink, GraduationCap, Send, ShieldCheck, PlayCircle, X, ChevronLeft, AlertTriangle } from 'lucide-react';
import { ProctorSession } from '../components/ProctorSession';

const STATUS_ORDER: CertificationStatus[] = ['not-started', 'in-progress', 'submitted', 'verified'];

const STATUS_LABEL: Record<CertificationStatus, string> = {
  'not-started': 'NOT STARTED',
  'in-progress': 'IN PROGRESS',
  'submitted': 'SUBMITTED',
  'verified': 'VERIFIED'
};

const STATUS_CLASS: Record<CertificationStatus, string> = {
  'not-started': 'bg-neutral-700 text-white',
  'in-progress': 'bg-yellow-400 text-black',
  'submitted': 'bg-blue-500 text-white',
  'verified': 'bg-emerald-500 text-black'
};

export const CertificationHubView: React.FC = () => {
  const { progress, updateCertificationStatus } = useApp();

  const [selectedCertId, setSelectedCertId] = React.useState<string | null>(null);

  const selectedCert = CERTIFICATION_PROGRAMS.find(c => c.id === selectedCertId);

  const verifiedCount = CERTIFICATION_PROGRAMS.filter(
    cert => (progress.certificationStatus?.[cert.id] || 'not-started') === 'verified'
  ).length;

  const nextStatus = (current: CertificationStatus): CertificationStatus => {
    const idx = STATUS_ORDER.indexOf(current);
    return STATUS_ORDER[Math.min(idx + 1, STATUS_ORDER.length - 1)];
  };

  if (selectedCert) {
    return (
      <div className="fixed inset-0 bg-neutral-900 z-[100] flex flex-col">
        <header className="h-16 bg-black border-b border-white/10 flex items-center justify-between px-6">
          <button onClick={() => setSelectedCertId(null)} className="flex items-center gap-2 text-white/60 hover:text-white">
            <ChevronLeft size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Abort Session</span>
          </button>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Proctoring Active</p>
            <h2 className="text-white font-black uppercase tracking-tight">{selectedCert.title}</h2>
          </div>
          <div className="w-24" />
        </header>

        <main className="flex-1 p-4 md:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6 overflow-y-auto lg:overflow-hidden">
          <div className="flex-1 bg-white border-2 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] lg:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col min-h-[400px] lg:min-h-0">
            <div className="bg-neutral-100 p-2 border-b border-black flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Secure Browser Stream</span>
              <span className="text-[8px] font-bold text-neutral-400">Source: {(selectedCert as any).officialUrl}</span>
            </div>
            <div className="flex-1">
                {(selectedCert as any).embeddedContent ? (
                    <div dangerouslySetInnerHTML={{ __html: (selectedCert as any).embeddedContent }} className="w-full h-full" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center space-y-4">
                        <AlertTriangle size={48} className="text-yellow-500" />
                        <h3 className="text-2xl font-black uppercase italic">In-App View Restricted</h3>
                        <p className="max-w-md font-bold text-neutral-500">The vendor has restricted in-app framing. You must continue the certification on their official portal while keeping the BEAST AI proctoring session active in this window.</p>
                        <Button variant="primary" onClick={() => window.open(selectedCert.officialUrl, '_blank')}>
                            Open Secure Terminal
                        </Button>
                    </div>
                )}
            </div>
          </div>

          <aside className="w-full lg:w-80 space-y-4 flex flex-col shrink-0">
            <ProctorSession isExam />
            <Card brutal className="bg-black text-white p-4 space-y-3 flex-1 overflow-y-auto">
                <div className="flex items-center gap-2 text-emerald-500">
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Integrity Logic</span>
                </div>
                <div className="space-y-4 text-[10px] font-bold text-white/60">
                    <p>1. Keep eyes on the training terminal.</p>
                    <p>2. Complete all modules within the vendor ecosystem.</p>
                    <p>3. Capture your final exam receipt or transcript.</p>
                    <p>4. Advance your status once completion is confirmed.</p>
                </div>
                <div className="pt-4 border-t border-white/10 mt-auto">
                    <Button 
                        variant="brutal" 
                        className="w-full bg-emerald-500 text-black"
                        onClick={() => {
                            updateCertificationStatus(selectedCert.id, 'verified');
                            setSelectedCertId(null);
                        }}
                    >
                        CONFIRM VERIFICATION
                    </Button>
                </div>
            </Card>
          </aside>
        </main>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">Certification Command.</h1>
        <p className="text-neutral-400 font-medium">
          Official vendor pathways only. This application tracks your completion and submission state for real external certifications.
        </p>
      </section>

      <Card brutal className="bg-emerald-500 text-black space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-xs font-black uppercase tracking-[0.2em]">Verification Progress</p>
          <div className="flex items-center gap-1 text-xs font-black uppercase">
            <ShieldCheck size={14} />
            {verifiedCount}/{CERTIFICATION_PROGRAMS.length}
          </div>
        </div>
        <p className="text-sm font-black italic leading-tight">
          Certifications are issued by Microsoft and AWS through their official exam systems.
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CERTIFICATION_PROGRAMS.map((cert) => {
          const status = progress.certificationStatus?.[cert.id] || 'not-started';
          return (
            <Card key={cert.id} className="border border-white/20 bg-black/40 p-4 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">{cert.provider}</p>
                  <h3 className="text-lg font-black leading-tight uppercase tracking-tight">{cert.title}</h3>
                  <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                    {cert.examCode ? `Exam ${cert.examCode}` : 'Official credential pathway'}
                  </p>
                </div>
                <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest ${STATUS_CLASS[status]}`}>
                  {STATUS_LABEL[status]}
                </span>
              </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedCertId(cert.id)}
                  >
                    <PlayCircle size={12} />
                    ENTER PROCTORING
                  </Button>
                  <Button
                    size="sm"
                    variant="brutal"
                    className="flex-1"
                    onClick={() => updateCertificationStatus(cert.id, nextStatus(status))}
                  >
                    <Send size={12} />
                    ADVANCE STATUS
                  </Button>
                </div>
            </Card>
          );
        })}
      </div>

      <Card className="bg-black border border-white/20 p-5 space-y-3">
        <div className="flex items-center gap-2 text-emerald-500">
          <GraduationCap size={16} />
          <p className="text-xs font-black uppercase tracking-[0.2em]">Certification Policy</p>
        </div>
        <p className="text-xs font-bold text-neutral-300 leading-relaxed">
          BEAST AI Learning tracks your journey, but certificates are granted by official vendor systems after exam completion and verification.
        </p>
        <Button
          size="sm"
          variant="secondary"
          className="w-full"
          onClick={() => window.open('https://learn.microsoft.com/credentials/', '_blank')}
        >
          <Send size={12} />
          OPEN CREDENTIAL PORTALS
        </Button>
      </Card>
    </div>
  );
};
