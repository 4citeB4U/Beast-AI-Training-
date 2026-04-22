/*
LEEWAY HEADER — DO NOT REMOVE

REGION: PRODUCT.BEAST.VIEW
TAG: UI.BEAST.VIEW.RESOURCES

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#E8F5E9

ICON_ASCII:
family=lucide
glyph=layout

5WH:
WHAT = BEAST AI Component: Resources.tsx
WHY = Part of the BEAST AI Leeway Standards alignment
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = src/views/Resources.tsx
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
import { Github, Globe, Book, ExternalLink, Cpu, Shield, Zap, FileText, Download } from 'lucide-react';

const RESOURCES = [
  {
    title: "Awesome AI Agents",
    desc: "Curated list of AI agents, frameworks, and tools.",
    url: "https://github.com/eugeneyan/applied-ml",
    type: "GitHub",
    icon: Github,
    color: "bg-neutral-800"
  },
  {
    title: "The Agent Protocol",
    desc: "Open standard for interaction with AI agents.",
    url: "https://agentprotocol.ai/",
    type: "Docs",
    icon: Globe,
    color: "bg-emerald-500"
  },
  {
    title: "Prompt Engineering Guide",
    desc: "Comprehensive training on adversarial prompting.",
    url: "https://www.promptingguide.ai/",
    type: "Free Course",
    icon: Book,
    color: "bg-yellow-400"
  },
  {
    title: "LangChain Academy",
    desc: "Build RAG systems with production-grade tools.",
    url: "https://academy.langchain.com/",
    type: "Video",
    icon: Cpu,
    color: "bg-blue-500"
  }
];

const STUDY_MUNITIONS = [
  { id: 'ai-900', title: 'Microsoft AI-900 Study Guide', desc: 'Condensed exam objectives and Azure AI terminology.', type: 'Booklet' },
  { id: 'agent-man', title: 'Agent Engineering Manual', desc: 'Technical breakdown of the ReAct pattern and Tool Classes.', type: 'Manual' },
  { id: 'leeway-std', title: 'Leeway Standard Booklet', desc: 'Definitive guide to RAG architecture and Vector memory.', type: 'Technical' }
];

export const ResourceView: React.FC = () => {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">THE ARMORY.</h1>
        <p className="text-neutral-500 font-medium italic mt-2">Free training & open-source munitions.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
            <FileText size={20} className="text-blue-500" />
            Mission Study Munitions
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {STUDY_MUNITIONS.map(item => (
            <Card key={item.id} className="p-4 bg-white border-2 border-black flex items-center gap-4 hover:bg-neutral-50 transition-all group cursor-pointer" onClick={() => alert(`VIEWING: ${item.title}. This manual provides high-stakes tactical theory for Mission Architects.`)}>
              <div className="w-10 h-10 bg-neutral-100 border-2 border-black flex items-center justify-center shrink-0">
                <FileText size={18} className="text-neutral-400 group-hover:text-black" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-black text-xs uppercase tracking-tight">{item.title}</h4>
                  <span className="text-[8px] font-black uppercase text-neutral-400 border border-neutral-200 px-1">{item.type}</span>
                </div>
                <p className="text-[10px] font-bold text-neutral-500 leading-tight">{item.desc}</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); alert(`DOWNLOADING: ${item.title}.pdf`); }}
                className="p-1.5 hover:bg-black hover:text-white transition-colors"
                title="Download PDF"
              >
                <Download size={16} />
              </button>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4">
        {RESOURCES.map(res => (
          <Card key={res.title} className="p-0 overflow-hidden border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer" onClick={() => window.open(res.url, '_blank')}>
            <div className="flex">
              <div className={`w-20 ${res.color} flex items-center justify-center border-r-2 border-black`}>
                <res.icon size={32} className={res.color === 'bg-neutral-800' ? 'text-white' : 'text-black'} />
              </div>
              <div className="p-4 flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-black text-sm uppercase tracking-tight">{res.title}</h3>
                  <div className="bg-black text-white text-[8px] px-1.5 py-0.5 font-black uppercase tracking-widest leading-none">{res.type}</div>
                </div>
                <p className="text-xs font-bold text-neutral-500 leading-tight">{res.desc}</p>
                <div className="flex items-center gap-1 text-[10px] font-black text-neutral-400 italic mt-2 group">
                   FETCH RESOURCE <ExternalLink size={10} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
            <Zap size={20} className="text-yellow-500 fill-yellow-500" />
            Leeway Industry Munitions
        </h2>
        <Card brutal className="bg-black text-white p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rotate-45 translate-x-12 -translate-y-12" />
            <div className="relative z-10 space-y-4">
                <div>
                    <h3 className="text-lg font-black tracking-tighter leading-none mb-2">LEEWAY ARCHITECT STANDARDS v2.4</h3>
                    <p className="text-xs font-bold text-neutral-400 leading-relaxed uppercase">
                        The definitive handbook for building autonomous multi-agent engineering frameworks. Includes the Leeway Performance Matrix (LPM) templates.
                    </p>
                </div>
                <div className="p-3 bg-neutral-900 border border-neutral-800 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-emerald-500">
                        <span>Framework Docs</span>
                        <span>DEPLOYED</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-emerald-500">
                        <span>Agent Matrix</span>
                        <span>DEPLOYED</span>
                    </div>
                </div>
                <Button size="sm" className="w-full bg-emerald-500 text-black hover:bg-emerald-400" onClick={() => alert("DOWNLOADING: Leeway_Standard_Architect_v2.4.pdf")}>
                    DOWNLOAD STANDARDS
                </Button>
            </div>
        </Card>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
            <Shield size={20} />
            Community Intel
        </h2>
        <Card brutal className="bg-emerald-50 text-emerald-900">
            <p className="font-bold text-sm italic leading-relaxed">
                "We found a massive repository of pre-trained small LLMs on HuggingFace. We've added the link to your mission logs below."
            </p>
            <Button size="sm" variant="primary" className="mt-4" onClick={() => window.open('https://huggingface.co/models?pipeline_tag=text-generation&sort=trending', '_blank')}>
                VIEW MODELS
            </Button>
        </Card>
      </section>
    </div>
  );
};
