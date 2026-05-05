/*
AGENT LEE VM — STANDALONE WORKSTATION
A fully self-contained virtual machine interface for autonomous AI agents.
Includes: Gemini AI Bridge, Firebase Handlers, VFS, Terminal, Code Editor, and Web Search.
*/

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  type User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
} from 'firebase/firestore';
import { 
  Terminal as TerminalIcon, 
  Code, 
  Globe, 
  Folder, 
  File, 
  ChevronRight, 
  ChevronDown, 
  X, 
  User,
  Layers,
  Zap,
  Cpu,
  Activity,
  MessageSquare,
  Send,
  Loader2,
  Monitor,
  FileText,
  Sparkles,
  RotateCcw,
  Trash2,
  CheckCircle2,
  BrainCircuit,
  CheckSquare,
  Square,
  Pencil,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import 'xterm/css/xterm.css';

// --- Firebase Configuration & Init ---
const firebaseConfig = {
  apiKey: "placeholder",
  authDomain: "placeholder",
  projectId: "placeholder",
  storageBucket: "placeholder",
  messagingSenderId: "placeholder",
  appId: "placeholder"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const leewayProvider = new GoogleAuthProvider();

// --- AI Tool Definitions ---
const webSearchTool: FunctionDeclaration = {
  name: 'execute_web_search',
  parameters: {
    type: Type.OBJECT,
    description: 'Updates the web interface with a search query or a direct URL.',
    properties: {
      query: { type: Type.STRING, description: 'The search keywords or target URL.' },
    },
    required: ['query'],
  },
};

const openAppTool: FunctionDeclaration = {
  name: 'open_workspace_app',
  parameters: {
    type: Type.OBJECT,
    description: 'Opens a specific workspace application inside the Agent VM.',
    properties: {
      app: { type: Type.STRING, description: 'One of: desktop, vscode, browser, notepad, pallium, diagnostics, terminal, database.' },
    },
    required: ['app'],
  },
};

const openFileTool: FunctionDeclaration = {
  name: 'open_file_in_editor',
  parameters: {
    type: Type.OBJECT,
    description: 'Opens a file from the virtual workspace inside the editor.',
    properties: {
      path: { type: Type.STRING, description: 'Virtual file path like /src/App.tsx or /notes.txt.' },
    },
    required: ['path'],
  },
};

const saveFileTool: FunctionDeclaration = {
  name: 'save_file_content',
  parameters: {
    type: Type.OBJECT,
    description: 'Saves full file content back into the virtual workspace.',
    properties: {
      path: { type: Type.STRING, description: 'Target virtual file path.' },
      content: { type: Type.STRING, description: 'Full updated file content.' },
    },
    required: ['path', 'content'],
  },
};

const installPackageTool: FunctionDeclaration = {
  name: 'install_vm_package',
  parameters: {
    type: Type.OBJECT,
    description: 'Installs a named package into the virtual machine inventory.',
    properties: {
      packageName: { type: Type.STRING, description: 'Package name to add to the VM inventory.' },
    },
    required: ['packageName'],
  },
};

const getSystemPrompt = () => `
Role: You are "Agent Lee", a VM controller.
Task: Assist the user with coding, terminal commands, web navigation, package setup, and virtual file operations.
Use tools when the user asks to open apps, search the web, inspect files, install packages, or update the workspace.
`;

// --- VFS Types & Data ---
export interface VFSFile {
  name: string;
  content: string;
  type: 'file';
  path: string;
}

export interface VFSDirectory {
  name: string;
  type: 'dir';
  path: string;
  children: (VFSFile | VFSDirectory)[];
}

export type VFSItem = VFSFile | VFSDirectory;
type VMApp = 'desktop'|'vscode'|'browser'|'notepad'|'pallium'|'diagnostics'|'terminal'|'database';
type VMMessage = { role: 'user'|'agent'|'system'; content: string };

export const initialVFS: VFSDirectory = {
  name: 'root',
  type: 'dir',
  path: '/',
  children: [
    {
      name: 'src',
      type: 'dir',
      path: '/src',
      children: [
        {
          name: 'App.tsx',
          type: 'file',
          path: '/src/App.tsx',
          content: '// Root component logic\n\nconst App = () => {\n  return <div>Agent Lee VM</div>;\n};'
        }
      ]
    },
    {
      name: 'notes.txt',
      type: 'file',
      path: '/notes.txt',
      content: '# AGENT LEE VM NOTES\n\n- [x] Initial boot sequence\n- [ ] Connect to brain lake\n- [ ] Execute autonomous search'
    }
  ]
};

// --- Helper Functions ---
const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

const findItemByPath = (vfs: VFSDirectory, path: string): VFSItem | null => {
  if (path === '/') return vfs;
  const parts = path.split('/').filter(Boolean);
  let current: VFSItem = vfs;

  for (const part of parts) {
    if (current.type === 'dir') {
      const found: VFSItem | undefined = current.children.find((child: VFSItem) => child.name === part);
      if (found) {
        current = found;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  return current;
};

const updateFileContentByPath = (dir: VFSDirectory, path: string, content: string): VFSDirectory => ({
  ...dir,
  children: dir.children.map((child) => {
    if (child.type === 'file') {
      return child.path === path ? { ...child, content } : child;
    }
    return path.startsWith(`${child.path}/`) || path === child.path
      ? updateFileContentByPath(child, path, content)
      : child;
  }),
});

const collectFilePaths = (dir: VFSDirectory): string[] =>
  dir.children.flatMap((child) => (child.type === 'file' ? [child.path] : collectFilePaths(child)));

const normalizeVmApp = (value: string): VMApp | null => {
  const key = value.trim().toLowerCase();
  const lookup: Record<string, VMApp> = {
    desktop: 'desktop',
    home: 'desktop',
    vscode: 'vscode',
    editor: 'vscode',
    code: 'vscode',
    browser: 'browser',
    web: 'browser',
    search: 'browser',
    notepad: 'notepad',
    notes: 'notepad',
    pallium: 'pallium',
    memory: 'pallium',
    diagnostics: 'diagnostics',
    diag: 'diagnostics',
    terminal: 'terminal',
    shell: 'terminal',
    database: 'database',
    data: 'database',
  };
  return lookup[key] || null;
};

const interpretLocalVmIntent = (
  text: string,
  vfs: VFSDirectory,
  installedPackages: string[],
  activeFilePath: string,
): { reply: string; app?: VMApp; url?: string; filePath?: string; packageName?: string; save?: { path: string; content: string } } => {
  const input = text.trim();
  const lower = input.toLowerCase();
  const files = collectFilePaths(vfs);

  const openAppMatch = lower.match(/(?:open|launch|switch to)\s+(desktop|home|vscode|editor|code|browser|web|search|notepad|notes|pallium|memory|diagnostics|diag|terminal|shell|database|data)\b/);
  if (openAppMatch) {
    const app = normalizeVmApp(openAppMatch[1]);
    if (app) {
      return { app, reply: `Opening ${app} inside the VM.` };
    }
  }

  const fileMatch = input.match(/(\/[A-Za-z0-9._/-]+\.[A-Za-z0-9]+)/);
  if (fileMatch && files.includes(fileMatch[1])) {
    return { app: 'vscode', filePath: fileMatch[1], reply: `Opening ${fileMatch[1]} in the editor.` };
  }

  if (lower.startsWith('search ') || lower.startsWith('look up ') || lower.startsWith('find ')) {
    const query = input.replace(/^(search|look up|find)\s+/i, '');
    return {
      app: 'browser',
      url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
      reply: `Searching the web for "${query}".`,
    };
  }

  const installMatch = lower.match(/(?:install|add)\s+package\s+([a-z0-9@._/-]+)/) || lower.match(/(?:install|add)\s+([a-z0-9@._/-]+)$/);
  if (installMatch) {
    return {
      app: 'terminal',
      packageName: installMatch[1],
      reply: `Installing ${installMatch[1]} into the VM package inventory.`,
    };
  }

  const saveMatch = input.match(/^save\s+(\/[A-Za-z0-9._/-]+\.[A-Za-z0-9]+)\s*:::\s*([\s\S]+)$/i);
  if (saveMatch) {
    return {
      app: 'vscode',
      save: { path: saveMatch[1], content: saveMatch[2] },
      reply: `Saved new content into ${saveMatch[1]}.`,
    };
  }

  if (lower.includes('list files') || lower.includes('show files') || lower.includes('workspace')) {
    return {
      reply: `Workspace files: ${files.join(', ') || 'No files loaded.'}`,
    };
  }

  if (lower.includes('status')) {
    return {
      reply: `VM status: ${files.length} files loaded, ${installedPackages.length} installed packages, active editor file ${activeFilePath}.`,
    };
  }

  return {
    reply: [
      'Local VM intelligence is active.',
      `Active file: ${activeFilePath}`,
      `Files: ${files.join(', ')}`,
      `Installed packages: ${installedPackages.join(', ') || 'none'}`,
      'Try: "open browser", "search agent orchestration", "open /notes.txt", "install react", or "status".',
    ].join('\n'),
  };
};

// --- UI Sub-Components ---

const FileTreeItem: React.FC<{
  item: VFSItem;
  level: number;
  onSelect: (path: string) => void;
  selectedPath: string;
}> = ({ item, level, onSelect, selectedPath }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isSelected = selectedPath === item.path;

  if (item.type === 'file') {
    return (
      <button
        onClick={() => onSelect(item.path)}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-1 text-xs hover:bg-white/5 transition-colors",
          isSelected ? "bg-blue-500/20 text-blue-400 border-l-2 border-blue-500" : "text-zinc-400"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <File size={14} className="shrink-0" />
        <span className="truncate text-left font-mono">{item.name}</span>
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-2 py-1 text-xs text-zinc-300 hover:bg-white/5 transition-colors"
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <Folder size={14} className="text-blue-400 shrink-0" />
        <span className="truncate text-left font-mono">{item.name}</span>
      </button>
      {isOpen && (
        <div>
          {item.children.map((child, i) => (
            <FileTreeItem 
              key={i} 
              item={child} 
              level={level + 1} 
              onSelect={onSelect} 
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Desktop: React.FC<{ onOpenApp: (app: string) => void, installedPackages: string[] }> = ({ onOpenApp, installedPackages }) => {
  const apps = [
    { id: 'vscode', name: 'LeeCode', icon: <Code size={24} />, color: 'text-blue-400' },
    { id: 'browser', name: 'Web Search', icon: <Globe size={24} />, color: 'text-orange-400' },
    { id: 'notepad', name: 'Notepad', icon: <FileText size={24} />, color: 'text-yellow-400' },
    { id: 'pallium', name: 'Pallium', icon: <Folder size={24} />, color: 'text-cyan-400' },
    { id: 'database', name: 'Database', icon: <Database size={24} />, color: 'text-purple-400' },
    { id: 'diagnostics', name: 'Diagnostics', icon: <Activity size={24} />, color: 'text-green-400' },
    { id: 'terminal', name: 'Terminal', icon: <TerminalIcon size={24} />, color: 'text-zinc-400' },
  ];

  return (
    <div className="flex-grow bg-[#008080] p-4 flex flex-col gap-8 overflow-y-auto">
      <div className="grid grid-cols-4 gap-4 content-start">
        {apps.map(app => (
          <button key={app.id} onClick={() => onOpenApp(app.id)} className="flex flex-col items-center gap-1 group">
            <div className={cn("p-3 bg-zinc-900/20 rounded-lg border border-transparent group-hover:border-white/20 group-hover:bg-zinc-900/40 transition-all shadow-lg", app.color)}>
              {app.icon}
            </div>
            <span className="text-[10px] font-bold text-white drop-shadow-md">{app.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const AgentLeeNotepad: React.FC = () => {
  const [userContent, setUserContent] = useState('');
  const [agentContent, setAgentContent] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [tasks, setTasks] = useState<{ id: string; text: string; done: boolean }[]>([]);
  const [command, setCommand] = useState('');
  const [view, setView] = useState<'split' | 'user' | 'agent'>('split');
  const [displayAgentText, setDisplayAgentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getAI = () => {
    const key = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
    if (!key) throw new Error('VITE_GEMINI_API_KEY is required');
    return new GoogleGenAI({ apiKey: key });
  };

  useEffect(() => {
    if (!isTyping) setDisplayAgentText(agentContent);
  }, [agentContent, isTyping]);

  const typeText = (newText: string, append = false) => {
    setIsTyping(true);
    let i = 0;
    const baseText = append ? `${agentContent}\n\n` : '';
    if (!append) setDisplayAgentText('');

    const interval = setInterval(() => {
      const currentChunk = newText.slice(0, i + 1);
      setDisplayAgentText(baseText + currentChunk);
      i += 1;
      if (i >= newText.length) {
        clearInterval(interval);
        setIsTyping(false);
        setAgentContent(baseText + newText);
      }
    }, 15);
  };

  const syncToAgent = () => {
    setAgentContent(userContent);
    setDisplayAgentText(userContent);
  };

  const applyToUser = () => {
    if (window.confirm("Replace your notes with Agent Lee's refined version?")) {
      setUserContent(agentContent);
    }
  };

  const handleClear = () => {
    if (window.confirm('Wipe the session?')) {
      setUserContent('');
      setAgentContent('');
      setDisplayAgentText('');
      setTasks([]);
    }
  };

  const askAgent = async (action: 'rewrite' | 'expand' | 'tasks' | 'command') => {
    const context = agentContent || userContent;
    if (!context.trim() && action !== 'command') return;

    setIsThinking(true);
    const cmdToProcess = command;
    if (action === 'command') setCommand('');

    try {
      const aiClient = getAI();
      let prompt = '';
      let isAppend = false;

      if (action === 'rewrite') {
        prompt = `You are Agent Lee. Refine and reorganize this note in your workspace. Return ONLY the rewritten text.\nSource: "${context}"`;
      } else if (action === 'expand') {
        prompt = `You are Agent Lee. Depth-process these thoughts and add meaningful expansions. Return ONLY the expanded text.\nSource: "${context}"`;
        isAppend = true;
      } else if (action === 'tasks') {
        prompt = `You are Agent Lee. Extract tasks from this content as a JSON array of strings.\nSource: "${context}"`;
      } else if (action === 'command') {
        const lowerCmd = cmdToProcess.toLowerCase();
        isAppend = lowerCmd.includes('add') || lowerCmd.includes('append');
        prompt = `You are Agent Lee. Handle this command: "${cmdToProcess}". If asking to add/append, return ONLY the new part to add. If asking to edit/rewrite, return the FULL new version. Note context: "${context}"`;
      }

      const result = await aiClient.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
      });

      const text = result.text || '';

      if (action === 'tasks') {
        try {
          const list = JSON.parse(text.replace(/```json|```/g, '').trim());
          if (Array.isArray(list)) {
            setTasks((prev) => [
              ...prev,
              ...list.map((t) => ({
                id: Math.random().toString(36).slice(2, 11),
                text: String(t),
                done: false,
              })),
            ]);
          }
        } catch {
          setTasks((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).slice(2, 11),
              text: 'Task parsing failed. Try rewrite/expand first.',
              done: false,
            },
          ]);
        }
      } else {
        typeText(text, isAppend);
      }
    } catch (error: any) {
      typeText(`Agent Lee Error: ${error?.message || 'Unknown failure'}`);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="h-full bg-stone-200 p-3 md:p-4 font-sans text-stone-800 overflow-y-auto">
      <div className="max-w-[1600px] mx-auto mb-4 flex flex-col md:flex-row justify-between items-center gap-3 bg-white p-3 rounded-xl shadow-md border border-stone-300">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-stone-900 rounded-full flex items-center justify-center text-white shadow-lg">
            <BrainCircuit size={18} />
          </div>
          <div>
            <h1 className="font-black text-sm tracking-tighter uppercase leading-none">Agent Lee Collaborative</h1>
            <p className="text-[9px] text-stone-400 font-bold tracking-widest uppercase">Dual-Thinking Workspace v3.0</p>
          </div>
        </div>

        <div className="flex bg-stone-100 p-1 rounded-lg border border-stone-200">
          {(['split', 'user', 'agent'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${view === v ? 'bg-white shadow text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        <button
          onClick={handleClear}
          className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
          title="Clear everything"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <AnimatePresence mode="wait">
          {(view === 'split' || view === 'user') && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1"
            >
              <div className="relative pt-6">
                <div className="absolute top-0 left-0 right-0 z-20 flex justify-around px-8 pointer-events-none">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-2 h-8 bg-gradient-to-r from-stone-400 via-stone-200 to-stone-400 rounded-full shadow-md" />
                      <div className="w-3 h-3 bg-stone-800 rounded-full -mt-2 border border-stone-600 shadow-inner" />
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-b-lg shadow-[0_18px_40px_rgba(0,0,0,0.2)] border border-stone-300 relative overflow-hidden mt-3">
                  <div className="h-10 bg-stone-50 border-b-2 border-stone-200 flex items-center justify-between px-4">
                    <span className="font-black text-[9px] uppercase tracking-[0.3em] text-stone-400">Master Workspace</span>
                    <button
                      onClick={syncToAgent}
                      className="flex items-center gap-1 text-[9px] font-black uppercase text-blue-600 hover:text-blue-700 transition-all"
                    >
                      Process with Lee <ChevronRight size={10} />
                    </button>
                  </div>
                  <div className="relative bg-[#fffdf5] min-h-[42vh] flex shadow-inner">
                    <div className="w-[42px] border-r-2 border-red-200 flex flex-col items-center pt-5">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-stone-100 border border-stone-200 mb-6" />
                      ))}
                    </div>
                    <textarea
                      value={userContent}
                      onChange={(e) => setUserContent(e.target.value)}
                      placeholder="Draft your main ideas here..."
                      className="flex-1 p-5 text-sm leading-8 outline-none resize-none bg-transparent font-serif"
                      style={{ backgroundImage: 'linear-gradient(transparent 1.95rem, #eef2ff 2rem)', backgroundSize: '100% 2rem' }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {(view === 'split' || view === 'agent') && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, rotate: isTyping ? [0, 0.1, -0.1, 0] : 0 }}
              transition={isTyping ? { repeat: Infinity, duration: 0.2 } : { duration: 0.2 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1"
            >
              <div className="relative pt-6">
                <div className="absolute top-0 left-0 right-0 z-20 flex justify-around px-8 pointer-events-none">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className={`w-2 h-8 bg-gradient-to-r from-stone-900 via-stone-700 to-stone-900 rounded-full shadow-md transition-all duration-1000 ${isThinking ? 'brightness-150' : ''}`} />
                      <div className="w-3 h-3 bg-stone-900 rounded-full -mt-2 border border-stone-700 shadow-inner" />
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-b-lg shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-stone-800 relative overflow-hidden mt-3 ring-1 ring-stone-900/5">
                  <div className="h-10 bg-stone-900 border-b-2 border-stone-950 flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isThinking || isTyping ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'bg-stone-700'}`} />
                      <span className="font-bold text-[9px] uppercase tracking-[0.2em] text-stone-400">Agent Lee Refinement Pad</span>
                    </div>
                    <button
                      onClick={applyToUser}
                      disabled={!agentContent}
                      className="text-[9px] font-black uppercase text-green-400 hover:text-green-300 transition-all disabled:opacity-20"
                    >
                      Commit
                    </button>
                  </div>
                  <div className="relative bg-[#fcfcfc] min-h-[42vh] flex shadow-inner border-b border-stone-200">
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, x: [0, 5, -5, 0], y: [0, 2, -2, 0] }}
                        transition={{ repeat: Infinity, duration: 0.3 }}
                        className="absolute z-50 pointer-events-none text-stone-900/40"
                        style={{ top: '20px', right: '20px' }}
                      >
                        <Pencil size={24} className="transform -rotate-45" />
                      </motion.div>
                    )}

                    <div className="w-[42px] border-r-2 border-stone-200 flex flex-col items-center pt-5">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full bg-stone-50 border-stone-200 mb-6 border transition-colors ${isThinking ? 'border-blue-400' : ''}`} />
                      ))}
                    </div>
                    <textarea
                      value={displayAgentText}
                      readOnly
                      placeholder="Agent Lee will refine your notes here..."
                      className={`flex-1 p-5 text-sm leading-8 outline-none resize-none bg-transparent font-serif italic text-stone-600 transition-opacity ${isThinking ? 'opacity-50' : 'opacity-100'}`}
                      style={{ backgroundImage: 'linear-gradient(transparent 1.95rem, #f1f5f9 2rem)', backgroundSize: '100% 2rem' }}
                    />
                  </div>

                  <div className="p-3 bg-stone-50 flex flex-col gap-3 border-t border-stone-200">
                    <div className="flex gap-2">
                      <button onClick={() => askAgent('rewrite')} disabled={isThinking} className="flex-1 bg-stone-800 text-white p-2 rounded text-[9px] font-black uppercase hover:bg-stone-700 disabled:opacity-50">Refine</button>
                      <button onClick={() => askAgent('expand')} disabled={isThinking} className="flex-1 bg-stone-800 text-white p-2 rounded text-[9px] font-black uppercase hover:bg-stone-700 disabled:opacity-50">Expand</button>
                      <button onClick={() => askAgent('tasks')} disabled={isThinking} className="flex-1 border-2 border-stone-800 p-2 rounded text-[9px] font-black uppercase hover:bg-stone-100 disabled:opacity-50">Tasks</button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && askAgent('command')}
                        placeholder="Give Lee a custom command..."
                        className="w-full text-xs p-2 rounded border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 pr-10"
                      />
                      <button onClick={() => askAgent('command')} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900 transition-colors">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {tasks.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-4 right-4 w-72 bg-stone-900 text-white rounded-2xl shadow-2xl p-4 border border-stone-700 z-50"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-[10px] uppercase tracking-widest text-stone-400">Collaboration Queue</h3>
              <button onClick={() => setTasks([])} className="text-[10px] hover:text-red-400 transition-colors">Clear</button>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {tasks.map((t) => (
                <div key={t.id} className="flex items-start gap-2 group">
                  <button
                    onClick={() => setTasks(tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
                    className={`mt-1 w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${t.done ? 'bg-white border-white text-stone-900' : 'border-stone-700'}`}
                  >
                    {t.done && <CheckCircle2 size={10} />}
                  </button>
                  <span className={`text-[11px] leading-tight transition-all ${t.done ? 'line-through text-stone-600' : 'text-stone-200'}`}>{t.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

type SearchEngine = 'google' | 'bing' | 'duckduckgo' | 'brave';

const searchProviders: Record<SearchEngine, { label: string; buildUrl: (query: string) => string }> = {
  google: { label: 'Google', buildUrl: (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}` },
  bing: { label: 'Bing', buildUrl: (q) => `https://www.bing.com/search?q=${encodeURIComponent(q)}` },
  duckduckgo: { label: 'DuckDuckGo', buildUrl: (q) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}` },
  brave: { label: 'Brave', buildUrl: (q) => `https://search.brave.com/search?q=${encodeURIComponent(q)}` },
};

const Browser: React.FC<{ url: string; feedback?: string; onNavigate: (nextUrl: string) => void }> = ({ url, feedback, onNavigate }) => {
  const [query, setQuery] = useState('Agent Lee OS');
  const [engine, setEngine] = useState<SearchEngine>('google');
  const [frameMode, setFrameMode] = useState<'direct' | 'proxy' | 'fallback'>('direct');

  useEffect(() => {
    setFrameMode('direct');
    try {
      const parsed = new URL(url);
      if (parsed.searchParams.get('q')) {
        setQuery(parsed.searchParams.get('q') || 'Agent Lee OS');
      }
    } catch {
      // keep existing query when URL is malformed
    }
  }, [url]);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const isDirectUrl = /^https?:\/\//i.test(trimmed);
    const nextUrl = isDirectUrl ? trimmed : searchProviders[engine].buildUrl(trimmed);
    onNavigate(nextUrl);
  };

  const openInNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const proxyPreviewUrl = `https://r.jina.ai/http://${url.replace(/^https?:\/\//i, '')}`;
  const frameSrc = frameMode === 'direct' ? url : proxyPreviewUrl;

  return (
    <div className="flex-grow flex flex-col bg-[#f0f0f0] text-zinc-900 font-sans relative">
      <div className="bg-zinc-200 p-2 border-b border-zinc-300 flex flex-col gap-2">
        <div className="flex gap-1">
          {(Object.keys(searchProviders) as SearchEngine[]).map((key) => (
            <button
              key={key}
              onClick={() => setEngine(key)}
              className={cn(
                'px-2 py-1 text-[10px] border rounded font-bold',
                engine === key ? 'bg-blue-600 text-white border-blue-700' : 'bg-white border-zinc-300 text-zinc-700',
              )}
            >
              {searchProviders[key].label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search the web or paste a URL..."
            className="flex-grow bg-white border border-zinc-300 rounded px-3 py-1 text-[11px] shadow-inner h-7 outline-none"
          />
          <button onClick={handleSearch} className="px-2 py-1 text-[10px] font-bold bg-green-600 text-white rounded border border-green-700">Search</button>
          <button onClick={openInNewTab} className="px-2 py-1 text-[10px] font-bold bg-zinc-800 text-white rounded border border-zinc-900">Open Tab</button>
        </div>
        <div className="flex-grow bg-white border border-zinc-300 rounded px-3 py-1 text-[10px] flex items-center gap-2 shadow-inner h-6">
          <Globe size={10} className="text-zinc-400" />
          <span className="truncate text-zinc-600">{url}</span>
        </div>
      </div>
      <div className="flex-grow bg-white overflow-hidden">
        {frameMode !== 'fallback' ? (
          <iframe
            src={frameSrc}
            className="w-full h-full border-none"
            title="Web Search Preview"
            onError={() => {
              if (frameMode === 'direct') setFrameMode('proxy');
              else setFrameMode('fallback');
            }}
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center p-6 gap-3 bg-zinc-50 text-center">
            <p className="text-xs font-black uppercase text-zinc-700">Preview blocked by target website</p>
            <p className="text-[11px] text-zinc-500 max-w-md">This site blocks iframe/proxy previews. Open in a real tab or use one of the provider links below.</p>
            <button onClick={openInNewTab} className="px-3 py-1 text-[10px] font-bold bg-zinc-800 text-white rounded border border-zinc-900">Open in New Tab</button>
          </div>
        )}
      </div>
      <div className="bg-zinc-100 border-t border-zinc-300 p-2 text-[10px]">
        <p className="font-bold text-zinc-700">Quick Real Search Links:</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {(Object.keys(searchProviders) as SearchEngine[]).map((key) => (
            <a key={key} href={searchProviders[key].buildUrl(query || 'AI')} target="_blank" rel="noreferrer" className="underline text-blue-700">
              {searchProviders[key].label}
            </a>
          ))}
        </div>
        <p className="mt-1 text-zinc-500">If a site blocks embedding, use Open Tab or the quick links above.</p>
      </div>
      {feedback && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 max-w-[80%] z-50">
          <div className="bg-blue-600 text-white text-[10px] p-2 rounded shadow-lg border border-white/20 text-center font-mono animate-pulse uppercase">
            {feedback}
          </div>
        </div>
      )}
    </div>
  );
};

const PalliumExplorer: React.FC<{ user: FirebaseUser | null }> = ({ user }) => (
  <div className="flex-grow flex flex-col bg-[#c0c0c0] text-zinc-900 p-4">
    <div className="bg-[#000080] text-white px-2 py-1 mb-2">Memory Explorer</div>
    <div className="flex-grow bg-white border-2 border-zinc-500 p-2 text-[10px] overflow-y-auto">
      {user ? `Session: ${user.email}` : "Connecting to Memory Lake..."}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {['L', 'E', 'E'].map((d, idx) => <div key={`${d}-${idx}`} className="flex flex-col items-center"><Monitor size={20} /><span>{d}:</span></div>)}
      </div>
    </div>
  </div>
);

const Diagnostics: React.FC<{ fileCount: number; packageCount: number; messageCount: number }> = ({ fileCount, packageCount, messageCount }) => {
  const metrics = {
    cpu: Math.min(92, 18 + packageCount * 9),
    ram: Math.min(95, 32 + fileCount * 11),
    temp: 30 + Math.min(25, messageCount * 2),
  };
  return (
    <div className="flex-grow flex flex-col bg-[#1a1a1a] text-green-500 font-mono p-4">
      <h2 className="text-xs font-black uppercase mb-4 border-b border-green-900/50 pb-2 flex gap-2"><Activity size={14} /> System Diags</h2>
      <div className="space-y-4">
        <div><div className="text-[8px]">CPU</div><div className="h-1 bg-green-950 mt-1"><div className="h-full bg-green-500" style={{ width: `${metrics.cpu}%` }} /></div></div>
        <div><div className="text-[8px]">RAM</div><div className="h-1 bg-green-950 mt-1"><div className="h-full bg-blue-500" style={{ width: `${metrics.ram}%` }} /></div></div>
        <div className="text-[9px]">TEMP: {metrics.temp}C</div>
        <div className="text-[9px]">FILES: {fileCount}</div>
        <div className="text-[9px]">PACKAGES: {packageCount}</div>
      </div>
    </div>
  );
};

const DatabaseWorkbench: React.FC<{ user: FirebaseUser | null; installedPackages: string[]; messages: {role: 'user'|'agent'|'system', content: string}[] }> = ({ user, installedPackages, messages }) => (
  <div className="flex-grow flex flex-col bg-[#101418] text-zinc-100 p-4 gap-3">
    <h2 className="text-xs font-black uppercase tracking-wider flex items-center gap-2"><Database size={14} /> Data Workbench</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <div className="border border-zinc-700 bg-zinc-900 p-2 text-[10px]">
        <p className="text-zinc-400 uppercase">Session User</p>
        <p className="font-mono mt-1">{user?.email || 'local-guest@vm'}</p>
      </div>
      <div className="border border-zinc-700 bg-zinc-900 p-2 text-[10px]">
        <p className="text-zinc-400 uppercase">Installed Packages</p>
        <p className="font-mono mt-1">{installedPackages.length}</p>
      </div>
      <div className="border border-zinc-700 bg-zinc-900 p-2 text-[10px]">
        <p className="text-zinc-400 uppercase">Chat Records</p>
        <p className="font-mono mt-1">{messages.length}</p>
      </div>
    </div>
    <div className="border border-zinc-700 bg-black/40 p-2 text-[10px] overflow-auto">
      <p className="text-zinc-400 uppercase mb-2">Package Inventory</p>
      {installedPackages.length === 0 ? <p className="text-zinc-500">No packages installed yet.</p> : (
        <ul className="space-y-1">
          {installedPackages.map((pkg, idx) => <li key={`${pkg}-${idx}`} className="font-mono">- {pkg}</li>)}
        </ul>
      )}
    </div>
  </div>
);

const Terminal: React.FC<{
  installedPackages: string[];
  activeFilePath: string;
  onInstall?: (pkg: string) => void;
  onNavigateApp?: (app: VMApp) => void;
  onSearch?: (query: string) => void;
  onOpenFile?: (path: string) => void;
  onSystemMessage?: (message: string) => void;
}> = ({ installedPackages, activeFilePath, onInstall, onNavigateApp, onSearch, onOpenFile, onSystemMessage }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const currentLineRef = useRef('');

  useEffect(() => {
    if (!terminalRef.current) return;
    const term = new XTerm({ cursorBlink: true, fontSize: 12, theme: { background: '#0c0c0c' } });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();
    xtermRef.current = term;
    term.writeln('\x1b[1;34mAgent Lee Standalone OS v1.0.0\x1b[0m');
    term.write('\r\n\x1b[1;32mlee@vm\x1b[0m:\x1b[1;34m~\x1b[0m$ ');
    
    term.onData(data => {
      if (data === '\r') {
        term.write('\r\n');
        const rawCmd = currentLineRef.current.trim();
        const cmd = rawCmd.toLowerCase();
        if (cmd === 'help') {
          term.writeln('Commands: help, clear, status, apps, pkg install [p], open [app], search [query], openfile [/path]');
        } else if (cmd === 'clear') {
          term.clear();
        } else if (cmd === 'status') {
          term.writeln(`ACTIVE_FILE=${activeFilePath}`);
          term.writeln(`PACKAGES=${installedPackages.join(', ') || 'none'}`);
        } else if (cmd === 'apps') {
          term.writeln('APPS=desktop, vscode, browser, notepad, pallium, diagnostics, terminal, database');
        } else if (cmd.startsWith('open ')) {
          const app = normalizeVmApp(rawCmd.slice(5).trim());
          if (app) {
            onNavigateApp?.(app);
            term.writeln(`Opening ${app}...`);
          } else {
            term.writeln(`Unknown app: ${rawCmd.slice(5).trim()}`);
          }
        } else if (cmd.startsWith('search ')) {
          const query = rawCmd.slice(7).trim();
          onSearch?.(query);
          term.writeln(`Searching for ${query}...`);
        } else if (cmd.startsWith('openfile ')) {
          const path = rawCmd.slice(9).trim();
          onOpenFile?.(path);
          term.writeln(`Opening file ${path}...`);
        } else if (cmd.startsWith('pkg install ')) {
          const pkg = rawCmd.replace(/^pkg install\s+/i, '').trim();
          term.writeln(`Installing ${pkg}...`);
          setTimeout(() => { term.writeln(`${pkg} installed.`); onInstall?.(pkg); onSystemMessage?.(`VM_PACKAGE_INSTALLED: ${pkg}`); term.write('\r\n\x1b[1;32mlee@vm\x1b[0m:\x1b[1;34m~\x1b[0m$ '); }, 800);
          currentLineRef.current = '';
          return;
        } else if (cmd) {
          term.writeln(`Unknown command: ${rawCmd}`);
        }
        term.write('\x1b[1;32mlee@vm\x1b[0m:\x1b[1;34m~\x1b[0m$ ');
        currentLineRef.current = '';
      } else if (data === '\x7f') {
        if (currentLineRef.current.length > 0) { currentLineRef.current = currentLineRef.current.slice(0,-1); term.write('\b \b'); }
      } else {
        currentLineRef.current += data;
        term.write(data);
      }
    });
    return () => term.dispose();
  }, [activeFilePath, installedPackages, onInstall, onNavigateApp, onOpenFile, onSearch, onSystemMessage]);

  return <div className="h-full w-full bg-[#0c0c0c] p-2" ref={terminalRef} />;
};

const VirtualKeyboard: React.FC<{ onKeyType: (key: string) => void, onClose: () => void }> = ({ onKeyType, onClose }) => (
  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#c0c0c0] p-2 border-2 border-white shadow-xl z-[100] flex flex-col gap-1 rounded">
    <div className="flex justify-between items-center px-1 mb-1"><span className="text-[6px] font-bold">V-INPUT</span><X size={8} onClick={onClose} className="cursor-pointer" /></div>
    {[['1','2','3','4','5','6','7','8','9','0','BKSP'],['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L','ENTER'],['SPACE']].map((row, i) => (
      <div key={i} className="flex gap-0.5">
        {row.map(k => <button key={k} onClick={() => onKeyType(k)} className={cn("bg-gray-200 border border-zinc-500 rounded text-[6px] p-1 h-6 flex items-center justify-center hover:bg-white", k === 'SPACE' ? "w-20" : "w-5")}>{k}</button>)}
      </div>
    ))}
  </motion.div>
);

const DesktopFrame: React.FC<{ children: React.ReactNode; isThinking: boolean; onMinimize: () => void; showKeyboard: boolean; setShowKeyboard: (s: boolean) => void; onKeyType: (k: string) => void }> = ({ children, isThinking, onMinimize, showKeyboard, setShowKeyboard, onKeyType }) => (
  <div className="relative flex flex-col h-full max-w-5xl mx-auto w-full p-4">
    <div className="relative flex-grow bg-[#dcd7c0] rounded-[20px] shadow-2xl border-[6px] border-[#c5bfab] overflow-hidden flex flex-col p-2">
      <div className="flex-grow bg-[#1a1b1e] rounded-[8px] border-[4px] border-[#b0aa93] overflow-hidden flex flex-col relative">
        {isThinking && <div className="absolute top-2 right-2 z-50 bg-green-500 px-2 py-0.5 rounded text-[7px] font-bold text-black animate-pulse">PROCESSING...</div>}
        {children}
      </div>
      <div className="h-8 flex items-center justify-between px-2 mt-1">
        <span className="text-[8px] text-[#8a846d] font-bold italic">AGENT_LEE_VM_STANDALONE</span>
        <div className="flex gap-2">
          <button onClick={() => setShowKeyboard(!showKeyboard)} className={cn("px-2 py-0.5 rounded text-[6px] font-bold border", showKeyboard ? "bg-green-600 text-white" : "bg-gray-300 shadow-sm")}>KEYBD</button>
          <button onClick={onMinimize} className="w-4 h-4 bg-red-600 rounded-full border border-red-900 shadow-inner" />
        </div>
      </div>
    </div>
    <AnimatePresence>{showKeyboard && <VirtualKeyboard onKeyType={onKeyType} onClose={() => setShowKeyboard(false)} />}</AnimatePresence>
  </div>
);

// --- Standalone VM Wrapper ---

export const StandaloneAgentVM = () => {
  const [vfs, setVfs] = useState<VFSDirectory>(initialVFS);
  const [activeFilePath, setActiveFilePath] = useState('/src/App.tsx');
  const [messages, setMessages] = useState<VMMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('https://duckduckgo.com/?q=Agent+Lee+OS');
  const [browserFeedback, setBrowserFeedback] = useState('');
  const [currentApp, setCurrentApp] = useState<VMApp>('desktop');
  const [isMinimized, setIsMinimized] = useState(false);
  const [user, setUser] = useState<FirebaseUser|null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [installedPackages, setInstalledPackages] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState('');

  const geminiApiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  const ai = useRef<GoogleGenAI | null>(geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  const fileCount = collectFilePaths(vfs).length;
  const activeFile = findItemByPath(vfs, activeFilePath)?.type === 'file' ? (findItemByPath(vfs, activeFilePath) as VFSFile) : null;

  const appendSystemMessage = useCallback((content: string) => {
    setMessages((prev) => [...prev, { role: 'system', content }]);
  }, []);

  const installPackage = useCallback((pkg: string) => {
    setInstalledPackages((prev) => (prev.includes(pkg) ? prev : [...prev, pkg]));
  }, []);

  const saveVirtualFile = useCallback((path: string, content: string) => {
    setVfs((prev) => updateFileContentByPath(prev, path, content));
  }, []);

  const executeToolCall = useCallback((call: any) => {
    if (call.name === 'execute_web_search') {
      const q = call.args.query as string;
      setCurrentUrl(q.startsWith('http') ? q : `https://duckduckgo.com/?q=${encodeURIComponent(q)}`);
      setBrowserFeedback(`Navigating: ${q}`);
      setCurrentApp('browser');
      return `Opened web search for ${q}.`;
    }

    if (call.name === 'open_workspace_app') {
      const app = normalizeVmApp(String(call.args.app || ''));
      if (app) {
        setCurrentApp(app);
        return `Opened ${app}.`;
      }
    }

    if (call.name === 'open_file_in_editor') {
      const path = String(call.args.path || '');
      if (findItemByPath(vfs, path)?.type === 'file') {
        setActiveFilePath(path);
        setCurrentApp('vscode');
        return `Opened ${path} in the editor.`;
      }
    }

    if (call.name === 'save_file_content') {
      const path = String(call.args.path || '');
      const content = String(call.args.content || '');
      if (findItemByPath(vfs, path)?.type === 'file') {
        saveVirtualFile(path, content);
        setActiveFilePath(path);
        setCurrentApp('vscode');
        return `Saved ${path}.`;
      }
    }

    if (call.name === 'install_vm_package') {
      const pkg = String(call.args.packageName || '');
      if (pkg) {
        installPackage(pkg);
        setCurrentApp('terminal');
        return `Installed ${pkg}.`;
      }
    }

    return '';
  }, [installPackage, saveVirtualFile, vfs]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    setIsThinking(true);
    setBrowserFeedback('');
    const newMsgs = [...messages, { role: 'user', content: text }] as any;
    setMessages(newMsgs);

    if (!ai.current) {
      const local = interpretLocalVmIntent(text, vfs, installedPackages, activeFilePath);
      if (local.app) setCurrentApp(local.app);
      if (local.url) {
        setCurrentUrl(local.url);
        setBrowserFeedback(local.reply);
      }
      if (local.filePath) setActiveFilePath(local.filePath);
      if (local.packageName) installPackage(local.packageName);
      if (local.save) saveVirtualFile(local.save.path, local.save.content);
      setMessages(prev => [...prev, { role: 'agent', content: local.reply }]);
      setIsThinking(false);
      return;
    }

    try {
      const model = (ai.current as any).models.getGenerativeModel({
        model: 'gemini-1.5-flash',
        tools: [{ functionDeclarations: [webSearchTool, openAppTool, openFileTool, saveFileTool, installPackageTool] }],
      });
      const chat = model.startChat({ systemInstruction: getSystemPrompt() });
      const result = await chat.sendMessageStream(text);
      
      let agentText = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          agentText += chunkText;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.role === 'agent') return [...prev.slice(0,-1), { role: 'agent', content: agentText }];
            return [...prev, { role: 'agent', content: agentText }];
          });
        }
        const calls = chunk.functionCalls();
        if (calls) {
          for (const call of calls) {
            const toolMessage = executeToolCall(call);
            if (toolMessage) {
              setMessages(prev => [...prev, { role: 'system', content: toolMessage }]);
            }
          }
        }
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'system', content: `AI_ERROR: ${e.message}` }]);
    }
    setIsThinking(false);
  };

  const handleKeyType = (k: string) => {
    if (k === 'ENTER') { handleSendMessage(chatInput); setChatInput(''); }
    else if (k === 'BKSP') setChatInput(p => p.slice(0,-1));
    else if (k === 'SPACE') setChatInput(p => p + ' ');
    else if (k.length === 1) setChatInput(p => p + k.toLowerCase());
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-8 right-8 w-16 h-16 bg-black rounded-full flex items-center justify-center border-2 border-green-500 shadow-2xl cursor-pointer" onClick={() => setIsMinimized(false)}>
        <Cpu className="text-green-500" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black overflow-hidden font-sans">
      <DesktopFrame isThinking={isThinking} onMinimize={() => setIsMinimized(true)} showKeyboard={showKeyboard} setShowKeyboard={setShowKeyboard} onKeyType={handleKeyType}>
         {/* Taskbar */}
         <div className="h-6 bg-[#c0c0c0] border-b border-black flex items-center px-1 shrink-0 z-50 text-[8px] font-bold">
            <button onClick={() => setCurrentApp('desktop')} className="px-2 bg-gray-300 border border-t-white border-l-white border-r-gray-600 border-b-gray-600 mr-1 hover:bg-white active:bg-gray-400">START</button>
            {['vscode', 'browser', 'terminal', 'diagnostics'].map(a => (
              <button key={a} onClick={() => setCurrentApp(a as any)} className={cn("px-2 border", currentApp === a ? "bg-zinc-400" : "bg-gray-300")}>{a.toUpperCase()}</button>
            ))}
            <div className="ml-auto flex items-center gap-2 text-[7px] uppercase tracking-wide text-zinc-700">
              <span>{fileCount} files</span>
              <span>{installedPackages.length} pkgs</span>
              <span>{currentApp}</span>
            </div>
         </div>

         <div className="flex-grow flex overflow-hidden">
            {currentApp === 'desktop' && <Desktop onOpenApp={(a) => setCurrentApp(a as any)} installedPackages={installedPackages} />}
            {currentApp === 'browser' && <Browser url={currentUrl} feedback={browserFeedback} onNavigate={setCurrentUrl} />}
            {currentApp === 'terminal' && (
              <Terminal
                installedPackages={installedPackages}
                activeFilePath={activeFilePath}
                onInstall={installPackage}
                onNavigateApp={setCurrentApp}
                onSearch={(query) => {
                  setCurrentUrl(`https://duckduckgo.com/?q=${encodeURIComponent(query)}`);
                  setCurrentApp('browser');
                  setBrowserFeedback(`Navigating: ${query}`);
                }}
                onOpenFile={(path) => {
                  if (findItemByPath(vfs, path)?.type === 'file') {
                    setActiveFilePath(path);
                    setCurrentApp('vscode');
                  }
                }}
                onSystemMessage={appendSystemMessage}
              />
            )}
            {currentApp === 'diagnostics' && <Diagnostics fileCount={fileCount} packageCount={installedPackages.length} messageCount={messages.length} />}
            {currentApp === 'notepad' && <AgentLeeNotepad />}
            {currentApp === 'pallium' && <PalliumExplorer user={user} />}
            {currentApp === 'database' && <DatabaseWorkbench user={user} installedPackages={installedPackages} messages={messages} />}
            {currentApp === 'vscode' && (
              <div className="flex-grow flex flex-col bg-[#1e1e1e]">
                <div className="flex-grow flex overflow-hidden">
                  <div className="w-10 bg-[#333] flex flex-col items-center py-4 gap-4 border-r border-black shrink-0">
                    <Folder className="text-zinc-500 hover:text-white cursor-pointer" size={16} />
                    <MessageSquare size={16} className="text-zinc-500 hover:text-white cursor-pointer" />
                  </div>
                  <div className="bg-[#252526] w-32 shrink-0 border-r border-black overflow-y-auto">
                    <div className="p-2 text-[7px] text-zinc-500 font-bold">EXPLORER</div>
                    <FileTreeItem item={vfs} level={0} onSelect={setActiveFilePath} selectedPath={activeFilePath} />
                  </div>
                  <div className="flex-grow flex flex-col bg-[#1e1e1e] border-r border-black">
                    <div className="h-7 px-3 flex items-center justify-between text-[8px] font-bold uppercase text-zinc-400 border-b border-zinc-800">
                      <span>{activeFilePath}</span>
                      <span>{activeFile ? `${activeFile.content.length} chars` : 'no file selected'}</span>
                    </div>
                    <Editor
                      height="100%"
                      theme="vs-dark"
                      defaultLanguage="typescript"
                      path={activeFilePath}
                      value={activeFile?.content || ''}
                      onChange={(value) => {
                        if (activeFilePath && typeof value === 'string') {
                          saveVirtualFile(activeFilePath, value);
                        }
                      }}
                    />
                  </div>
                  <div className="w-56 overflow-y-auto p-2 bg-[#252526] flex flex-col">
                    <div className="text-[7px] text-zinc-500 font-bold mb-2">CHAT_LOG</div>
                    <div className="flex-grow space-y-2 mb-2">
                       {messages.map((m, i) => (
                         <div key={i} className={cn("p-1 text-[7px] border", m.role === 'user' ? "text-blue-400 border-blue-900" : "text-green-400 border-green-900")}>{m.content}</div>
                       ))}
                    </div>
                    <div className="relative">
                      <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage(chatInput)} placeholder="CMD..." className="w-full bg-black text-green-500 text-[8px] p-1 border border-zinc-700 outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}
         </div>
      </DesktopFrame>
    </div>
  );
};
