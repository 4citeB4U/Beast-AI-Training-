/*
LEEWAY HEADER — DO NOT REMOVE

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
WHAT = BEAST AI Component: data.ts
WHY = Part of the BEAST AI Leeway Standards alignment
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = src/data.ts
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

import { Course, UserLevel } from './types';

export const CURRICULUM = {
  beginner: {
    startCourse: 'setup-0',
    focus: 'Tool Stack & Environment'
  },
  builder: {
    startCourse: 'builder-1',
    focus: 'Low-code & Automation'
  },
  engineer: {
    startCourse: 'agent-engineer',
    focus: 'Evaluation & Optimized RAG'
  }
};

export const COURSES: Course[] = [
  {
    id: 'setup-0',
    title: 'Mission 0: The Base',
    description: 'Establish your developer identity and terminal setup.',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=800',
    targetLevel: 'beginner',
    expectations: [
      'Git basics and account linking',
      'IDE environment configuration',
      'First repository deployment'
    ],
    outcome: 'A fully personalized developer environment with verified GitHub & HuggingFace uplinks.',
    modules: [
      {
        id: 'beginner-m0',
        title: 'Module 0: The Command Center',
        description: 'Installing your munitions: IDE, Git, and accounts.',
        outcome: 'Ready-to-use VS Code installation and GitHub connectivity.',
        lessons: [
          {
            id: 'lesson-setup-1',
            title: 'Digital Identity',
            description: 'Connecting to GitHub and HuggingFace.',
            duration: '5m',
            narration: 'Your code needs a home. Before we build, we must establish your uplink to the global developer community.',
            steps: [
              {
                type: 'hook',
                title: 'The Developer Cloud',
                content: 'GitHub is your portfolio. HuggingFace is your model library. Without these, you are building in isolation.',
              },
              {
                type: 'teach',
                title: 'Checklist: Armory Setup',
                content: 'Do you have your specialized munitions ready?\n1. Visual Studio Code (The IDE)\n2. GitHub Account (Version Control)\n3. HuggingFace Account (Models)\n4. Discord (Community Intel)',
                codeSnippet: {
                  language: 'bash',
                  code: 'git config --global user.name "Your Name"\ngit config --global user.email "your@email.com"',
                  description: 'Run these commands in your terminal to initialize your git identity.'
                }
              },
              {
                type: 'video',
                title: 'Tactical Intel: Terminal Mastery for Elite Developers',
                content: 'Configure your environment for maximum flow state and architectural visibility.',
                videoUrl: 'L_T0yP_a-6s'
              },
              {
                type: 'interaction',
                title: 'Identity Check',
                content: 'Have you verified your GitHub account and connected to the LEEWAY community?',
                interaction: {
                  type: 'multiple-choice',
                  options: ['Yes, Uplink Clear', 'Not yet', 'Need Help'],
                  correctIndex: 0
                }
              }
            ]
          },
          {
            id: 'github-basics',
            title: 'GitHub Mechanics',
            description: 'Pull, Push, and Collaborate like a pro.',
            duration: '10m',
            steps: [
              {
                type: 'teach',
                title: 'The Pull/Push Cycle',
                content: 'To contribute, you first "Fork" a repo, "Clone" it locally, make changes, "Push" back to your fork, and then open a "Pull Request" (PR) to the original project.',
                codeSnippet: {
                  language: 'bash',
                  code: 'git clone https://github.com/USERNAME/REPO.git\ncd REPO\ngit checkout -b my-new-feature\n# ... make changes ...\ngit add .\ngit commit -m "feat: added agent logic"\ngit push origin my-new-feature',
                  description: 'Standard contribution workflow for collaborating on GitHub.'
                }
              },
              {
                type: 'sorting',
                title: 'Contribution Sequence',
                content: 'Order the steps of becoming a collaborator.',
                interaction: {
                  type: 'sorting',
                  items: ['Fork Repo', 'Make Changes', 'Push to Fork', 'Pull Request'],
                  correctItems: ['Fork Repo', 'Make Changes', 'Push to Fork', 'Pull Request']
                }
              }
            ]
          },
          {
            id: 'leeway-sdk-intro',
            title: 'The Leeway SDK',
            description: 'Acquiring the official architectural standards.',
            duration: '8m',
            steps: [
              {
                type: 'hook',
                title: 'The Master Blueprint',
                content: 'Building an agent from scratch is slow. Using a standardized SDK like the LeeWay Standards is the fast track to production dominance.',
              },
              {
                type: 'teach',
                title: 'What is the LeeWay SDK?',
                content: 'This repository contains the official architectural framework for autonomous agents. It defines how models should interact with tools, how memory (RAG) is structured, and how multi-agent swarms communicate. It is the gold standard for agentic reliability.',
                codeSnippet: {
                  language: 'bash',
                  code: 'git clone https://github.com/4citeB4U/LeeWay-Standards.git',
                  description: 'Clone the official LeeWay Standards SDK to your local armory.'
                }
              },
              {
                type: 'interaction',
                title: 'Installation Check',
                content: 'Have you localized the LeeWay Standards repository to your environment?',
                interaction: {
                  type: 'multiple-choice',
                  options: ['Yes, Repository Cloned', 'Working on it', 'Need more info'],
                  correctIndex: 0
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'agent-engineer',
    title: 'Mission 1: Agent Engineering',
    description: 'Build your first autonomous chat and tool-calling agent.',
    image: 'https://images.unsplash.com/photo-1676277791608-ac54525aa94d?auto=format&fit=crop&q=80&w=800',
    targetLevel: 'builder',
    expectations: [
      'Master the ReAct (Reason + Act) pattern',
      'Integrate real-world tools via API',
      'Build a portable chat agent'
    ],
    outcome: 'A production-grade Chat Agent that can call external tools to solve problems.',
    modules: [
      {
        id: 'eng-m1',
        title: 'Module 1: The Fabric Architect',
        description: 'Constructing the structural layers of intelligence.',
        outcome: 'A reusable Agent Class template for all your future projects.',
        lessons: [
          {
            id: 'arch-puzzle-1',
            title: 'The ReAct Loop',
            description: 'Master the flow of information through an agent.',
            duration: '15m',
            steps: [
              {
                type: 'teach',
                title: 'Reasoning + Acting',
                content: 'Agents don\'t just predict text. They Think, then Act, then Observe the result. This is the ReAct loop.',
                codeSnippet: {
                  language: 'typescript',
                  code: `class Agent {
  async run(goal: string) {
    const thought = await this.think(goal);
    const action = await this.chooseAction(thought);
    const result = await this.execute(action);
    return this.reflect(result);
  }
}`,
                  description: 'A foundational ReAct class for any autonomous AI agent.'
                }
              },
              {
                type: 'video',
                title: 'Deep Study: The ReAct Pattern Deep Dive',
                content: 'Mastering the official LangGraph ReAct pattern for high-reliability autonomous agents.',
                videoUrl: 'pG4InRKue90'
              },
              {
                type: 'sorting',
                title: 'The ReAct Cycle',
                content: 'Order the cycle steps for a thinking agent.',
                interaction: {
                  type: 'sorting',
                  items: ['Think', 'Act', 'Observe', 'Reflect'],
                  correctItems: ['Think', 'Act', 'Observe', 'Reflect']
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'leeway-advanced',
    title: 'Mission 2: Leeway Architect',
    description: 'Autonomous multi-agent engineering & RAG frameworks.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800',
    targetLevel: 'engineer',
    expectations: [
      'Implement Vector Memory (RAG)',
      'Design Multi-Agent swarms',
      'Build a Phone/Voice Agent interface'
    ],
    outcome: 'A complete RAG-powered Voice Agent that acts as your personal digital twin.',
    modules: [
      {
        id: 'leeway-m1',
        title: 'Leeway Foundation: RAG',
        description: 'Downloading and implementing the Leeway Standards.',
        outcome: 'A fully functional RAG pipeline using local vector storage.',
        lessons: [
          {
            id: 'leeway-1',
            title: 'The RAG Blueprint',
            description: 'Introduction to Leeway framework architecture.',
            duration: '20m',
            narration: 'Leeway Industries has defined the gold standard for agent autonomy. We will now build the memory layer.',
            steps: [
              {
                type: 'teach',
                title: 'Vector Embeddings',
                content: 'To give an agent memory, we turn text into math (Vectors) and store them in a Vector DB. This is Retrieval Augmented Generation (RAG).',
                codeSnippet: {
                  language: 'typescript',
                  code: `import { VectorStore } from 'leeway-sdk';

const store = new VectorStore();
await store.add('My secret knowledge base...');
const context = await store.search('What is the secret?');
// Send context to LLM`,
                  description: 'Real-world RAG implementation using the Leeway Standards.'
                }
              },
              {
                type: 'video',
                title: 'Architecture Briefing: Advanced Retrieval (RAG) & Multi-Agent Swarms',
                content: 'Deep dive into advanced retrieval pipelines and multi-agent orchestration by DeepLearning.AI.',
                videoUrl: '7_8yvLzN1W0'
              },
              {
                type: 'workshop',
                title: 'RAG Integration',
                content: 'Configure your first Leeway Agent node. What is the retrieval threshold?',
                interaction: {
                  type: 'workshop',
                  question: 'Primary Directive of Leeway RAG?'
                }
              }
            ]
          }
        ]
      }
    ]
  }
];
