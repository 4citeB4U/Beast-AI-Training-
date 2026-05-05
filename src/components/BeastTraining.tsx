import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import {
  Bot,
  Calendar,
  Users,
  Terminal,
  ChevronRight,
  Zap,
  ShieldCheck,
  Layers,
  Code2,
  Rocket,
  Send,
  Search,
  Settings,
  Activity,
  Box,
  Copy,
  X,
  Cpu,
  Workflow,
  Plus,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { BEAST_BADGES } from '../data';
import { BEAST_LOGO_SRC } from '../assets/beastLogo';

type AppView = 'code' | 'workflow';

type ProjectFile = {
  name: string;
  language: string;
  content: string;
  level: 'starter' | 'core' | 'agentic';
};

type Tool = {
  id: string;
  title: string;
  role: string;
  description: string;
  why: string;
  build: string;
  useCase: string;
  stack: string[];
  workflow: string[];
  prompts: string[];
  icon: React.ReactNode;
  files: ProjectFile[];
};

const MODULE_FILES: Record<string, ProjectFile[]> = {
  assistant: [
    {
      name: 'assistant_starter.ts',
      language: 'typescript',
      level: 'starter',
      content: `// WEEK 1: STARTER AI ASSISTANT
import { BeastAI } from "@beast/core";

const bot = new BeastAI({
  name: "BeastBot",
  role: "General Assistant",
  temperature: 0.7
});

export const onMessage = (msg: string) => {
  return bot.chat(msg);
};`,
    },
    {
      name: 'assistant_core.ts',
      language: 'typescript',
      level: 'core',
      content: `// WEEK 2: CONTEXT-AWARE CORE
import { BeastAI, Memory } from "@beast/core";

const memory = new Memory("user_profile");
const bot = new BeastAI({ role: "Personal Brain Extension", memory: true });

export const onMessage = async (msg: string) => {
  const context = await memory.retrieve(msg);
  return bot.chat(msg, { context });
};`,
    },
    {
      name: 'assistant_agentic.ts',
      language: 'typescript',
      level: 'agentic',
      content: `// WEEK 3: FULL AGENTIC (MCP POWERS)
import { Agent } from "@beast/agents";

const agent = new Agent({
  model: "gemini-3-flash",
  tools: ["email", "calendar", "web_search"],
  mcp: true,
});

export const run = () => agent.start_listening();`,
    },
  ],
  scheduler: [
    {
      name: 'calendar_v1.ts',
      language: 'typescript',
      level: 'starter',
      content: `// BASIC SCHEDULING NODE
import { Calendar } from "@beast/integrations";

export const book = (date: string) => {
  return Calendar.createEvent({ title: "New Meeting", date });
};`,
    },
    {
      name: 'agentic_scheduler.ts',
      language: 'typescript',
      level: 'agentic',
      content: `// AUTONOMOUS NEGOTIATION
import { Negotiator } from "@beast/agents";

const boss = new Negotiator({ preference: "afternoons", priority: "high" });

export const handleRequest = (msg: string) => boss.negotiate_time(msg);`,
    },
  ],
  crm: [
    {
      name: 'crm_base.ts',
      language: 'typescript',
      level: 'starter',
      content: `// MINI CRM STORAGE
import { DB } from "@beast/storage";

export const saveLead = (lead: Record<string, unknown>) => DB.table("leads").push(lead);`,
    },
    {
      name: 'intelligent_enrich.ts',
      language: 'typescript',
      level: 'core',
      content: `// AI ENRICHMENT PIPELINE
import { Scraper, Summarizer } from "@beast/tools";

export const processLead = async (url: string) => {
  const raw = await Scraper.fetch(url);
  return Summarizer.extract(raw);
};`,
    },
  ],
};

const TOOLS: Tool[] = [
  {
    id: 'assistant',
    title: 'Personal AI Assistant',
    role: 'Productivity Architect',
    description: 'A context-aware helper that manages your tasks and queries.',
    why: 'Own your own logic instead of relying on generic public bots.',
    build: 'MCP powers, contextual memory, intent detection.',
    useCase: 'Automate your email sorting and daily briefing.',
    stack: ['Memory retrieval', 'Intent routing', 'Prompt contracts'],
    workflow: ['Capture request', 'Retrieve context', 'Run assistant logic', 'Return guided action'],
    prompts: ['Summarize today and highlight blockers.', 'Draft a response with three action options.'],
    icon: <Bot className="w-6 h-6" />,
    files: MODULE_FILES.assistant,
  },
  {
    id: 'scheduler',
    title: 'Smart Scheduler',
    role: 'Time Optimizer',
    description: 'Automated meeting orchestrator using natural language.',
    why: 'Eliminate the back-and-forth of scheduling forever.',
    build: 'Natural language parsing to calendar API events.',
    useCase: 'Voice-to-schedule for busy executives.',
    stack: ['Intent parsing', 'Calendar actions', 'Negotiation loop'],
    workflow: ['Parse scheduling request', 'Check constraints', 'Negotiate options', 'Book event'],
    prompts: ['Find a meeting slot next Tuesday afternoon.', 'Resolve a conflict between two executive calendars.'],
    icon: <Calendar className="w-6 h-6" />,
    files: MODULE_FILES.scheduler,
  },
  {
    id: 'crm',
    title: 'Mini CRM',
    role: 'Growth Engine',
    description: 'Lead tracking system that scrapes and summarizes prospect info.',
    why: 'Sales intelligence that works while you sleep.',
    build: 'Web scraping, summarization, and data structuring.',
    useCase: 'Identify high-value leads from profile/company pages.',
    stack: ['Source capture', 'Lead enrichment', 'Structured records'],
    workflow: ['Capture source URL', 'Extract company details', 'Score opportunity', 'Store lead record'],
    prompts: ['Enrich this founder profile for outreach.', 'Rank these leads by likelihood to convert.'],
    icon: <Users className="w-6 h-6" />,
    files: MODULE_FILES.crm,
  },
];

const ToolCard: React.FC<{ tool: Tool; onSelect: (id: string) => void }> = ({ tool, onSelect }) => (
  <div
    onClick={() => onSelect(tool.id)}
    className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-emerald-400 transition-colors cursor-pointer"
  >
    <div className="flex items-center justify-between">
      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">{tool.icon}</div>
      <span className="text-[10px] uppercase font-black tracking-[0.16em] text-slate-500">{tool.role}</span>
    </div>
    <h3 className="text-lg font-black uppercase mt-3 text-slate-900">{tool.title}</h3>
    <p className="text-sm text-slate-600 mt-1">{tool.description}</p>
    <p className="text-xs text-slate-500 mt-3"><span className="font-black">Build scope:</span> {tool.build}</p>
    <p className="text-xs text-slate-500 mt-1"><span className="font-black">Use case:</span> {tool.useCase}</p>
  </div>
);

const AcademyIDE: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeModule, setActiveModule] = useState<Tool>(TOOLS[0]);
  const [activeFile, setActiveFile] = useState<ProjectFile>(TOOLS[0].files[0]);
  const [viewMode, setViewMode] = useState<AppView>('code');
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[Beast OS] Kernel v2.4.0 active.',
    '[Beast OS] Ready for extraction.',
  ]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [showAgentLee, setShowAgentLee] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: 'I am Agent Lee. Focus on the build and I will guide the orchestration.' },
  ]);

  const handleBuild = () => {
    setIsBuilding(true);
    setConsoleLogs((prev) => [
      ...prev,
      `[CLI] Compiling ${activeFile.name}...`,
      ...activeModule.workflow.map((stage, index) => `[PIPELINE] Stage ${index + 1}/${activeModule.workflow.length}: ${stage}`),
      `[CLI] Deploying ${activeModule.title}...`,
    ]);
    window.setTimeout(() => {
      setConsoleLogs((prev) => [...prev, `[CLI] Success. ${activeModule.title} deployed with ${activeModule.stack.join(', ')}.`]);
      setIsBuilding(false);
      setViewMode('workflow');
    }, 900);
  };

  const copyLogic = async () => {
    try {
      await navigator.clipboard.writeText(activeFile.content);
      setConsoleLogs((prev) => [...prev, `[CLI] Copied ${activeFile.name} to clipboard.`]);
    } catch {
      setConsoleLogs((prev) => [...prev, '[CLI] Clipboard unavailable in this browser context.']);
    }
  };

  const sendAgentLeeMessage = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setChatInput('');

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
      if (!apiKey) {
        setChatMessages((prev) => [...prev, { role: 'assistant', text: 'Add VITE_GEMINI_API_KEY to enable live Agent Lee cloud responses.' }]);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are Agent Lee, Beast AI training mentor. Student module: ${activeModule.title}. Question: ${msg}`,
      });
      setChatMessages((prev) => [...prev, { role: 'assistant', text: response.text || 'Refine the interface and tighten your prompt structure.' }]);
    } catch {
      setChatMessages((prev) => [...prev, { role: 'assistant', text: 'Connection issue. Continue with local build instructions for now.' }]);
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-950 text-slate-100 flex flex-col overflow-hidden rounded-2xl border-4 border-emerald-500/80 shadow-[0_20px_60px_-18px_rgba(16,185,129,0.45)]">
      <div className="h-11 border-b border-white/10 flex items-center justify-between px-4 shrink-0 bg-slate-900">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={BEAST_LOGO_SRC}
            alt="B.E.A.S.T. AI Technologies logo"
            className="w-9 h-9 rounded-lg border border-yellow-400/40 bg-white object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300 truncate">Beast AI</p>
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400 truncate">Engine IDE</p>
          </div>
        </div>
        <button onClick={onClose} className="text-xs font-black uppercase tracking-[0.16em] text-red-300 hover:text-red-200">Exit</button>
      </div>

      <div
        className="flex-1 grid overflow-hidden transition-[grid-template-columns] duration-300"
        style={{
          gridTemplateColumns: `48px ${leftCollapsed ? '0px' : '260px'} 1fr ${rightCollapsed ? '0px' : '320px'}`,
        }}
      >
        <aside className="border-r border-white/10 bg-slate-900/90 flex flex-col items-center py-4 gap-6">
          <button
            onClick={() => setViewMode('code')}
            className={`p-2 rounded ${viewMode === 'code' ? 'text-emerald-300 bg-emerald-500/20' : 'text-slate-400 hover:text-slate-200'}`}
            title="VS Code Mode"
          >
            <Code2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('workflow')}
            className={`p-2 rounded ${viewMode === 'workflow' ? 'text-emerald-300 bg-emerald-500/20' : 'text-slate-400 hover:text-slate-200'}`}
            title="n8n Workflow Mode"
          >
            <Workflow className="w-5 h-5" />
          </button>
          <div className="mt-auto">
            <button className="p-2 rounded text-slate-500 hover:text-slate-300" title="Settings">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </aside>

        <aside className={`overflow-auto bg-slate-900/80 ${leftCollapsed ? 'w-0 min-w-0 border-r-0 opacity-0 pointer-events-none' : 'border-r border-white/10 opacity-100'}`}>
          <div className="p-3 text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 border-b border-white/10 flex items-center justify-between">
            <button
              onClick={() => setLeftCollapsed(true)}
              className="flex items-center gap-2 hover:text-emerald-300 transition-colors"
              title="Close Left Panel"
            >
              Sources <Search className="w-3 h-3" />
            </button>
            <button
              onClick={() => setLeftCollapsed(true)}
              className="p-1.5 rounded-md bg-amber-400 text-black border border-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.45)] hover:brightness-110"
              title="Close Left Panel"
            >
              <ChevronRight className="w-3 h-3 rotate-180" />
            </button>
          </div>
          <div className="p-2 space-y-2">
            {TOOLS.map((tool) => (
              <div key={tool.id} className="rounded-lg border border-white/10">
                <button
                  onClick={() => {
                    setActiveModule(tool);
                    setActiveFile(tool.files[0]);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-black uppercase tracking-[0.12em] flex items-center gap-2 ${activeModule.id === tool.id ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-300 hover:bg-white/5'}`}
                >
                  <ChevronRight className="w-3 h-3" /> {tool.title}
                </button>
                {activeModule.id === tool.id && (
                  <div className="px-2 pb-2 space-y-1">
                    {tool.files.map((file) => (
                      <button
                        key={file.name}
                        onClick={() => {
                          setActiveFile(file);
                          setViewMode('code');
                        }}
                        className={`w-full text-left px-2 py-1 text-[11px] rounded ${activeFile.name === file.name ? 'bg-emerald-500/20 text-emerald-200' : 'text-slate-400 hover:bg-white/5'}`}
                      >
                        {file.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        <section className="flex flex-col overflow-hidden bg-slate-950">
          {leftCollapsed && (
            <button
              onClick={() => setLeftCollapsed(false)}
              className="absolute left-[48px] top-1/2 -translate-y-1/2 z-20 h-12 w-7 rounded-r-xl bg-amber-400 text-black border-2 border-amber-200 border-l-0 shadow-[0_0_18px_rgba(251,191,36,0.5)] hover:brightness-110"
              title="Open Left Panel"
            >
              <ChevronRight className="w-4 h-4 mx-auto" />
            </button>
          )}

          {rightCollapsed && (
            <button
              onClick={() => setRightCollapsed(false)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-12 w-7 rounded-l-xl bg-cyan-400 text-black border-2 border-cyan-200 border-r-0 shadow-[0_0_18px_rgba(34,211,238,0.45)] hover:brightness-110"
              title="Open Right Panel"
            >
              <ChevronRight className="w-4 h-4 mx-auto rotate-180" />
            </button>
          )}

          <div className="h-10 border-b border-white/10 flex items-center justify-between px-3 text-xs uppercase font-black tracking-[0.16em]">
            <span>{activeFile.name}</span>
            <div className="flex gap-2">
              <button onClick={() => setViewMode('code')} className={`px-2 py-1 rounded ${viewMode === 'code' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'}`}>
                Code
              </button>
              <button onClick={() => setViewMode('workflow')} className={`px-2 py-1 rounded ${viewMode === 'workflow' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'}`}>
                Workflow
              </button>
              <button onClick={copyLogic} className="px-2 py-1 rounded border border-white/20 text-slate-300"><Copy className="w-3 h-3 inline mr-1" />Copy</button>
              <button onClick={handleBuild} disabled={isBuilding} className="px-2 py-1 rounded bg-emerald-500 text-black font-black disabled:opacity-60"><Rocket className="w-3 h-3 inline mr-1" />{isBuilding ? 'Building' : 'Deploy'}</button>
            </div>
          </div>

          {viewMode === 'code' ? (
            <pre className="flex-1 overflow-auto p-4 text-xs leading-relaxed text-slate-200 font-mono">
              {activeFile.content.split('\n').map((line, idx) => (
                <div key={`${line}-${idx}`} className="grid grid-cols-[40px_1fr] gap-3 hover:bg-white/5 px-2 -mx-2 rounded">
                  <span className="text-slate-500 text-right select-none">{idx + 1}</span>
                  <span>{line}</span>
                </div>
              ))}
            </pre>
          ) : (
            <div className="flex-1 p-6 grid place-items-center">
              <div className="w-full max-w-xl rounded-2xl border border-emerald-400/40 bg-slate-900 p-6">
                <p className="text-xs uppercase font-black tracking-[0.18em] text-emerald-300">Pipeline Orchestrator</p>
                <h3 className="text-2xl font-black uppercase mt-2">{activeModule.title}</h3>
                <p className="text-sm text-slate-400 mt-2">{activeModule.why}</p>
                <div className="mt-4 grid grid-cols-1 gap-2 text-center text-xs uppercase font-black tracking-[0.1em] md:grid-cols-2">
                  {activeModule.workflow.map((stage, index) => (
                    <div key={stage} className="border border-white/15 rounded-lg p-3 text-left">
                      <p className="text-[10px] text-emerald-300">Stage {index + 1}</p>
                      <p className="mt-1 text-slate-100">{stage}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="h-28 border-t border-white/10 p-3 overflow-auto bg-black/30 font-mono text-[11px]">
            {consoleLogs.map((log, i) => (
              <div key={`${log}-${i}`} className="text-slate-300">&gt;&gt; {log}</div>
            ))}
          </div>
        </section>

        <aside className={`bg-slate-900/80 flex flex-col ${rightCollapsed ? 'w-0 min-w-0 border-l-0 opacity-0 pointer-events-none' : 'border-l border-white/10 opacity-100'}`}>
          <div className="p-3 border-b border-white/10 text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 flex items-center gap-2">
            <button
              onClick={() => setRightCollapsed(true)}
              className="flex items-center gap-2 hover:text-emerald-300 transition-colors"
              title="Close Right Panel"
            >
              <Activity className="w-3 h-3" /> Live Preview
            </button>
            <button
              onClick={() => setRightCollapsed(true)}
              className="ml-auto p-1.5 rounded-md bg-cyan-400 text-black border border-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.45)] hover:brightness-110"
              title="Close Right Panel"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="p-4 flex-1">
            <div className="rounded-2xl border border-white/10 bg-slate-950 p-4 h-full flex flex-col">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">Beast Instance</div>
              <div className="mt-3 rounded-xl border border-white/10 p-4 flex-1 grid place-items-center">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-300 grid place-items-center">{activeModule.icon}</div>
                  <p className="text-sm font-black uppercase">{activeModule.title}</p>
                  <p className="text-xs text-slate-400">{activeModule.description}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {activeModule.stack.map((item) => (
                      <span key={item} className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-200">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={handleBuild} className="mt-3 py-2 rounded bg-emerald-500 text-black text-xs font-black uppercase tracking-[0.14em]">Execute</button>
            </div>
          </div>
        </aside>
      </div>

      <div className="h-7 bg-emerald-500 text-black px-4 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.18em] shrink-0">
        <div className="flex gap-6">
          <span className="flex items-center gap-1"><Terminal className="w-3 h-3" /> VS CODE / N8N MODE</span>
          <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> CLOUD COMPUTE STABLE</span>
        </div>
        <span>Pipeline: READY</span>
      </div>

      <div className="absolute bottom-4 right-4 z-[120]">
        <AnimatePresence>
          {showAgentLee && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="mb-3 w-80 h-96 rounded-2xl border border-emerald-400/30 bg-slate-900 shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs uppercase font-black tracking-[0.18em] text-emerald-300"><Bot className="w-4 h-4" />Agent Lee</div>
                <button onClick={() => setShowAgentLee(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 p-3 overflow-auto space-y-2">
                {chatMessages.map((m, i) => (
                  <div key={`${m.text}-${i}`} className={`max-w-[90%] p-2 text-xs rounded-xl ${m.role === 'user' ? 'ml-auto bg-emerald-500 text-black' : 'bg-slate-800 text-slate-200 border border-white/10'}`}>
                    {m.text}
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-white/10 flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      void sendAgentLeeMessage();
                    }
                  }}
                  placeholder="Ask Agent Lee..."
                  className="flex-1 rounded border border-white/20 bg-slate-950 text-slate-100 px-2 py-1 text-xs"
                />
                <button onClick={() => void sendAgentLeeMessage()} className="px-2 rounded bg-emerald-500 text-black"><Send className="w-4 h-4" /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setShowAgentLee((v) => !v)} className="w-14 h-14 rounded-full bg-emerald-500 text-black grid place-items-center shadow-xl" title="Open Agent Lee">
          <Bot className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};

const WorkflowNode: React.FC<{ icon: React.ReactNode; title: string; active?: boolean }> = ({ icon, title, active = false }) => (
  <div className={`rounded-xl border p-4 text-center ${active ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
    <div className="w-10 h-10 mx-auto rounded-lg bg-slate-100 grid place-items-center">{icon}</div>
    <div className="text-xs uppercase font-black tracking-[0.14em] mt-2">{title}</div>
  </div>
);

type BeastTrainingProps = {
  onNavigate?: (view: any) => void;
};

const BADGE_CATEGORY_STYLES: Record<string, { label: string; accent: string; chip: string; border: string }> = {
  identity: {
    label: 'Identity',
    accent: 'text-sky-700',
    chip: 'bg-sky-100 text-sky-700',
    border: 'border-sky-200',
  },
  path: {
    label: 'Pathway',
    accent: 'text-emerald-700',
    chip: 'bg-emerald-100 text-emerald-700',
    border: 'border-emerald-200',
  },
  agent: {
    label: 'Agent Mastery',
    accent: 'text-violet-700',
    chip: 'bg-violet-100 text-violet-700',
    border: 'border-violet-200',
  },
  certification: {
    label: 'Certification',
    accent: 'text-amber-700',
    chip: 'bg-amber-100 text-amber-700',
    border: 'border-amber-200',
  },
};

export default function BeastTraining({ onNavigate }: BeastTrainingProps) {
  const [selectedToolId, setSelectedToolId] = useState('assistant');
  const [showIDE, setShowIDE] = useState(true);

  useEffect(() => {
    document.body.style.overflow = showIDE ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showIDE]);

  const selectedTool = TOOLS.find((t) => t.id === selectedToolId) || TOOLS[0];
  const badgeGroups = Object.entries(BADGE_CATEGORY_STYLES).map(([category, style]) => ({
    category,
    ...style,
    badges: BEAST_BADGES.filter((badge) => badge.category === category),
  }));

  if (showIDE) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-[calc(100vh-15rem)] min-h-[520px] max-h-[760px]"
        >
          <AcademyIDE
            onClose={() => {
              if (onNavigate) {
                onNavigate('library');
              } else {
                setShowIDE(false);
              }
            }}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <AnimatePresence>
        {showIDE && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100]">
            <AcademyIDE onClose={() => {
              if (onNavigate) {
                onNavigate('library');
              } else {
                setShowIDE(false);
              }
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      <section className="overflow-hidden rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-yellow-50 shadow-[0_20px_60px_-24px_rgba(16,185,129,0.35)]">
        <div className="grid gap-8 p-8 md:grid-cols-[1.15fr_0.85fr] md:p-12">
          <div className="max-w-4xl space-y-5">
            <img
              src={BEAST_LOGO_SRC}
              alt="B.E.A.S.T. AI Technologies logo"
              className="h-28 w-28 rounded-3xl border border-yellow-400/40 bg-white object-cover p-1 shadow-[0_20px_50px_-20px_rgba(250,204,21,0.45)]"
            />
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-emerald-200 bg-white text-[10px] uppercase font-black tracking-[0.2em] text-emerald-700">
              <Zap className="w-3.5 h-3.5" /> Beast AI Hero Academy
            </div>
            <div className="space-y-4">
              <img
                src={BEAST_LOGO_SRC}
                alt="Unleash the Beast logo"
                className="h-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_20px_45px_-25px_rgba(15,23,42,0.35)]"
              />
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-[0.95] text-slate-900">
                Build Real AI Tools You Actually Own
              </h1>
            </div>
            <p className="text-base md:text-xl text-slate-700 font-semibold">
              Learn. Build. Deploy. Take it home. Theory ends here, ownership begins.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowIDE(true)} className="px-6 py-3 rounded-full bg-emerald-600 text-white font-black uppercase text-xs tracking-[0.14em]">
                Start Training Now
              </button>
              <button
                onClick={() => onNavigate?.('library')}
                className="px-6 py-3 rounded-full border-2 border-slate-300 text-slate-700 font-black uppercase text-xs tracking-[0.14em]"
              >
                Join Program
              </button>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.7)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase font-black tracking-[0.22em] text-emerald-300">Badge Index</p>
                <h2 className="mt-2 text-2xl font-black uppercase leading-tight">See The Badges You Earn</h2>
              </div>
              <img
                src={BEAST_LOGO_SRC}
                alt="B.E.A.S.T. AI Technologies logo"
                className="h-16 w-16 rounded-2xl border border-yellow-400/30 bg-white object-cover p-1"
              />
            </div>
            <p className="mt-3 text-sm text-slate-300">
              Every training milestone unlocks visible recognition. Learners can now preview the full badge path before they begin.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {badgeGroups.map((group) => (
                <div key={group.category} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${group.chip}`}>
                      {group.label}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      {group.badges.length} badges
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.badges.slice(0, 3).map((badge) => (
                      <div key={badge.id} className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 text-2xl shadow-inner">
                        <span aria-hidden="true">{badge.icon}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase font-black tracking-[0.2em] text-emerald-700">Rewards Preview</p>
            <h2 className="mt-2 text-3xl font-black uppercase text-slate-900">Badges Learners Will Receive</h2>
            <p className="mt-2 max-w-3xl text-sm font-medium text-slate-600">
              These are the exact badge milestones visible across identity setup, learning paths, agent mastery, and certifications.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
            <Lock className="h-3.5 w-3.5" /> Previewing locked and upcoming rewards
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {badgeGroups.map((group) => (
            <div key={group.category} className={`rounded-3xl border ${group.border} bg-slate-50/70 p-5`}>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className={`text-xl font-black uppercase ${group.accent}`}>{group.label} Badges</h3>
                  <p className="text-sm font-medium text-slate-600">Unlock path for {group.label.toLowerCase()} progression inside Beast AI training.</p>
                </div>
                <span className={`self-start rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${group.chip}`}>
                  {group.badges.length} total
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {group.badges.map((badge) => (
                  <div key={badge.id} className="rounded-2xl border border-white bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-slate-950 text-3xl shadow-inner">
                        <span aria-hidden="true">{badge.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black uppercase text-slate-900">{badge.name}</p>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Unlock Condition</p>
                        <p className="mt-1 text-sm text-slate-700">{badge.unlock}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-violet-200 bg-violet-50/40 p-6">
          <h2 className="text-xs uppercase font-black tracking-[0.2em] text-violet-700">Core Promise</h2>
          <h3 className="text-2xl font-black uppercase mt-2">Hands-On, Deployable, Take-Home</h3>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-slate-700">
            <li className="flex gap-2"><ShieldCheck className="w-4 h-4 mt-0.5 text-emerald-600" />Build real tools step-by-step</li>
            <li className="flex gap-2"><Code2 className="w-4 h-4 mt-0.5 text-emerald-600" />Guided code with copy/modify workflow</li>
            <li className="flex gap-2"><Rocket className="w-4 h-4 mt-0.5 text-emerald-600" />Deploy working applications</li>
            <li className="flex gap-2"><Cpu className="w-4 h-4 mt-0.5 text-emerald-600" />Keep what you build</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6">
          <h2 className="text-xs uppercase font-black tracking-[0.2em] text-emerald-700">Build Flow</h2>
          <h3 className="text-2xl font-black uppercase mt-2">Learn, Build, Deploy, Own, Launch</h3>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {['Learn', 'Build', 'Deploy', 'Own', 'Launch'].map((step) => (
              <div key={step} className="rounded-lg border border-emerald-200 bg-white p-2 text-center text-[10px] uppercase font-black tracking-[0.12em] text-emerald-700">
                {step}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-3xl font-black uppercase">Toolkit Systems Loaded</h2>
            <p className="text-sm text-slate-600 font-medium">Personal assistant, scheduler, CRM, and orchestration-ready workflows.</p>
          </div>
          <button onClick={() => setShowIDE(true)} className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs uppercase font-black tracking-[0.12em]">
            Open IDE
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onSelect={(id) => { setSelectedToolId(id); setShowIDE(true); }} />
          ))}
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 grid place-items-center text-center">
            <Plus className="w-8 h-8 text-slate-400" />
            <p className="text-xs uppercase font-black tracking-[0.16em] text-slate-500 mt-2">Custom Loadout</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xs uppercase font-black tracking-[0.2em] text-slate-500">Selected Tool</h2>
        <h3 className="text-2xl font-black uppercase mt-2">{selectedTool.title}</h3>
        <p className="text-slate-700 mt-2 font-medium">{selectedTool.why}</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <WorkflowNode icon={<Layers className="w-5 h-5" />} title="Concept" active />
          <WorkflowNode icon={<Code2 className="w-5 h-5" />} title="Guided Build" active />
          <WorkflowNode icon={<Rocket className="w-5 h-5" />} title="Deploy" active />
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Engine Stack</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedTool.stack.map((item) => (
                <span key={item} className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-700 border border-slate-200">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-700">Workflow</p>
            <div className="mt-3 space-y-2">
              {selectedTool.workflow.map((step, index) => (
                <p key={step} className="text-sm font-semibold text-slate-700">{index + 1}. {step}</p>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-700">Operator Prompts</p>
            <div className="mt-3 space-y-2">
              {selectedTool.prompts.map((prompt) => (
                <p key={prompt} className="text-sm text-slate-700 font-medium">"{prompt}"</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase font-black tracking-[0.2em] text-violet-700">Go Build</p>
          <h3 className="text-2xl font-black uppercase">Launch The Full Beast Training Environment</h3>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowIDE(true)} className="px-4 py-2 rounded-full bg-emerald-600 text-white text-xs uppercase font-black tracking-[0.12em]">Open Training IDE</button>
          <button onClick={() => onNavigate?.('agent-vm')} className="px-4 py-2 rounded-full border-2 border-slate-300 text-slate-700 text-xs uppercase font-black tracking-[0.12em]">Open Agent VM</button>
          <button onClick={() => setShowIDE(true)} className="px-4 py-2 rounded-full border-2 border-violet-300 text-violet-700 text-xs uppercase font-black tracking-[0.12em]">Open Agent Lee <ArrowRight className="w-3 h-3 inline ml-1" /></button>
        </div>
      </section>
    </div>
  );
}
