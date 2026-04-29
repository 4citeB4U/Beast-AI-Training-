/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

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

import { CertificationProgram, Course, UserLevel, Badge } from './types';

export const CURRICULUM = {
  beginner: {
    startCourse: 'ai-900-track',
    focus: 'AI Fundamentals & Azure Ecosystem'
  },
  builder: {
    startCourse: 'gen-ai-beginners',
    focus: 'Generative AI & LLM Applications'
  },
  engineer: {
    startCourse: 'google-ai-pro',
    focus: 'Professional AI Engineering & GCP'
  }
};

export const COURSES: Course[] = [
  {
    id: 'ai-900-track',
    title: 'Azure AI Fundamentals (AI-900)',
    description: 'Official Microsoft prep for the Azure AI Fundamentals certification. Covering AI workloads, ML on Azure, and Generative AI basics.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop', // Azure-blue high-tech
    targetLevel: 'beginner',
    expectations: [
      'Master AI-900 exam objectives',
      'Understand Azure AI services (Computer Vision, NLP)',
      'Prepare for official Microsoft certification'
    ],
    outcome: 'Ready to pass the AI-900 certification exam with verified Microsoft Learn progress.',
    modules: [
      {
        id: 'ms-ai-900-m1',
        title: 'Introduction to AI in Azure',
        description: 'Self-paced course introducing AI workloads and Azure AI services.',
        outcome: 'Foundational understanding of Azure AI capabilities.',
        lessons: [
          {
            id: 'ai-900-intro',
            title: 'AI Fundamentals Overview',
            description: 'Course AI-900T00-A: Official Microsoft Introduction.',
            duration: '15m',
            steps: [
              {
                type: 'video',
                title: 'Azure AI Fundamentals 2024 Prep',
                content: 'Full walkthrough of the AI-900 certification objectives by freeCodeCamp.',
                videoUrl: 'hHjmr_YOqnU'
              },
              {
                type: 'cert',
                title: 'Microsoft Learn: AI-900 Path',
                content: 'Access the official prep path for the Azure AI Fundamentals exam.',
                externalUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'gen-ai-beginners',
    title: 'Generative AI for Beginners',
    description: '18-lesson free course from Microsoft covering LLMs, agents, and building generative AI applications.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop', // Generative AI / Brain
    targetLevel: 'builder',
    expectations: [
      'Understand LLM architectures',
      'Build AI agents with planning and execution',
      'Master prompt engineering and fine-tuning'
    ],
    outcome: 'A full portfolio of generative AI projects including functional autonomous agents.',
    modules: [
      {
        id: 'ms-gen-ai-m1',
        title: 'LLMs & AI Agents',
        description: 'Building the intelligence layer using Microsoft standards.',
        outcome: 'Functional AI agents capable of multi-step reasoning.',
        lessons: [
          {
            id: 'ms-agents-lesson',
            title: 'AI Agents: Planning & Execution',
            description: 'Microsoft 18-module curriculum focus on agentic workflows.',
            duration: '25m',
            steps: [
              {
                type: 'teach',
                title: 'Agentic Architectures',
                content: 'Agents use LLMs to make decisions, use tools, and complete multi-step goals. We follow the Microsoft Generative AI for Beginners curriculum.'
              },
              {
                type: 'video',
                title: 'Microsoft Azure AI Fundamentals Intro',
                content: 'Official session on Azure AI with hands-on labs.',
                videoUrl: 'euwJLq-HD4o'
              },
              {
                type: 'cert',
                title: 'Official 18-Lesson Course',
                content: 'Access the full Generative AI for Beginners curriculum on GitHub.',
                externalUrl: 'https://github.com/microsoft/generative-ai-for-beginners'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'google-ai-essentials',
    title: 'Google AI Essentials',
    description: 'Grow with Google certification covering generative AI basics, prompt engineering, and workflow optimization.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop', // Google-style clean office
    targetLevel: 'beginner',
    expectations: [
      'Master prompt engineering for productivity',
      'Optimize daily workflows with AI tools',
      'Earn a professional Google certificate'
    ],
    outcome: 'Verified Google AI Essentials certificate and AI-powered workflow mastery.',
    modules: [
      {
        id: 'google-essentials-m1',
        title: 'Core AI Productivity',
        description: 'How to use Gemini and other LLMs for professional tasks.',
        outcome: 'Verified productivity skills using Google AI tools.',
        lessons: [
          {
            id: 'google-basics',
            title: 'Introduction to Generative AI',
            description: 'Official Google training on LLM fundamentals.',
            duration: '20m',
            steps: [
              {
                type: 'video',
                title: 'Google AI Courses with Certificates',
                content: 'Simplilearn walkthrough of the free Google AI course track.',
                videoUrl: 'Pj-nCWYRmA4'
              },
              {
                type: 'cert',
                title: 'Google Grow: AI Essentials',
                content: 'Start the official Google AI Essentials course on Coursera.',
                externalUrl: 'https://grow.google/ai'
              }
            ]
          }
        ]
      }
    ]
  }
];

export const CERTIFICATION_PROGRAMS: CertificationProgram[] = [
  {
    id: 'ms-ai-900',
    provider: 'Microsoft',
    title: 'Azure AI Fundamentals (AI-900)',
    examCode: 'AI-900',
    officialUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/',
    track: 'foundation'
  },
  {
    id: 'google-ai-pro',
    provider: 'Google',
    title: 'Google AI Professional Certificate',
    officialUrl: 'https://grow.google/ai',
    track: 'advanced',
    embeddedContent: '<iframe src="https://grow.google/ai" style="width:100%; height:800px; border:none;" title="Google AI Professional"></iframe>'
  },
  {
    id: 'ms-gen-ai-pro',
    provider: 'Microsoft',
    title: 'Generative AI for Beginners',
    officialUrl: 'https://techcommunity.microsoft.com/blog/azuredevcommunityblog/new-video-course-generative-ai-for-beginners/4184264',
    track: 'foundation'
  },
  {
    id: 'aws-ai-practitioner',
    provider: 'AWS',
    title: 'AWS Certified AI Practitioner',
    officialUrl: 'https://aws.amazon.com/certification/certified-ai-practitioner/',
    track: 'foundation'
  }
];

export const AGENT_LEE_VM_PHASES = [
  {
    id: 'phase-1',
    title: 'Leeway Standards Foundation',
    detail: 'Download and inspect the LeeWay Standards repository and training manuals.'
  },
  {
    id: 'phase-2',
    title: 'Agent Build Layer',
    detail: 'Build and run core agents, then map agent contracts and behavior policies.'
  },
  {
    id: 'phase-3',
    title: 'Society Orchestration',
    detail: 'Compose multi-agent flows and validate collaboration without direct LLM dependency.'
  },
  {
    id: 'phase-4',
    title: 'Agent Lee VM Demonstration',
    detail: 'Unlock and run the Agent VM experience as the final capability reveal.'
  }
];

export const BEAST_BADGES: Badge[] = [
  { id: 'origin-hero', name: 'Origin Hero', icon: '🟢', category: 'identity', unlock: 'Complete first sign-in' },
  { id: 'github-hero', name: 'GitHub Hero', icon: '🔵', category: 'identity', unlock: 'Connect GitHub' },
  { id: 'discord-hero', name: 'Discord Hero', icon: '🟣', category: 'identity', unlock: 'Connect Discord' },
  { id: 'huggingface-hero', name: 'HuggingFace Hero', icon: '🤗', category: 'identity', unlock: 'Connect HuggingFace' },
  { id: 'google-hero', name: 'Google Hero', icon: '🔴', category: 'identity', unlock: 'Connect Google' },

  { id: 'beginner-path', name: 'Beginner Path', icon: '⚡', category: 'path', unlock: 'Start Beginner path' },
  { id: 'builder-path', name: 'Builder Path', icon: '🛠️', category: 'path', unlock: 'Start Builder path' },
  { id: 'engineer-path', name: 'Engineer Path', icon: '🏗️', category: 'path', unlock: 'Start Engineer path' },

  { id: 'vector-badge', name: 'VECTOR Badge', icon: '🧭', category: 'agent', unlock: 'Use navigation guidance' },
  { id: 'aria-badge', name: 'ARIA Badge', icon: '🎙️', category: 'agent', unlock: 'Complete guided interaction' },
  { id: 'ward-badge', name: 'WARD Badge', icon: '🛡️', category: 'agent', unlock: 'Pass safety check' },
  { id: 'governor-badge', name: 'GOVERNOR Badge', icon: '⚖️', category: 'agent', unlock: 'Pass compliance check' },

  { id: 'azure-initiate', name: 'Azure Initiate', icon: '☁️', category: 'certification', unlock: 'Enroll in Azure track' },
  { id: 'gcp-initiate', name: 'Google Cloud Initiate', icon: '🌐', category: 'certification', unlock: 'Enroll in GCP track' },
  { id: 'aws-initiate', name: 'AWS Initiate', icon: '📦', category: 'certification', unlock: 'Enroll in AWS track' },

  { id: 'practice-warrior', name: 'Practice Exam Warrior', icon: '🧪', category: 'certification', unlock: 'Complete practice exam' },
  { id: 'proctored-hero', name: 'Proctored Hero', icon: '🔐', category: 'certification', unlock: 'Complete verified exam session' },
  { id: 'certified-beast', name: 'Certified Beast Hero', icon: '🏆', category: 'certification', unlock: 'Earn final certificate' }
];
