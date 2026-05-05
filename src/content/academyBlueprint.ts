export type AcademyTier = {
  id: 'explorer' | 'architect' | 'leader' | 'engineer';
  title: string;
  duration: string;
  transformation: string;
  skills: string[];
  tools: string[];
  project: string;
  outcome: string;
};

export type WeeklyProgramWeek = {
  week: number;
  title: string;
  focus: string;
  outcome: string;
};

export const ACADEMY_NAME = 'Beast AI Hero Academy Global';

export const CORE_POSITIONING =
  'Beast AI Hero Academy is a global AI training, internship, and startup incubation system that takes learners from zero knowledge to real-world AI deployment, team-based product building, and venture launch readiness across India and the United States.';

export const HERO_HEADLINE =
  'Train In AI. Build Beast AI. Launch Startups And Global Careers.';

export const HERO_SUBHEAD =
  'This is not only a course platform. It is a full AI academy, internship engine, application engineering lab, and startup incubator where students learn, join teams, build real Beast AI features, create AI tools they keep, and pitch ventures for launch support.';

export const HERO_PILLARS = [
  'Global AI academy with Microsoft, Azure, Google, and advanced Leeway standards training',
  'Beast AI application engineering lab where teams build real platform features',
  'Internship-to-startup pathway with team formation, MVP delivery, demo day, and Shark Tank pitch prep',
  'India + USA operating model for education, mentorship, deployment, and launch support',
];

export const PROGRAM_TIERS: AcademyTier[] = [
  {
    id: 'explorer',
    title: 'Explorer',
    duration: '4 Weeks',
    transformation: 'From curious learner to AI-capable practitioner.',
    skills: [
      'AI foundations, prompting, and automation logic',
      'Data thinking and ethical AI usage',
      'Personal productivity workflows with AI assistants',
    ],
    tools: ['ChatGPT', 'Claude', 'Gemini', 'Notion AI', 'Canva AI'],
    project: 'AI Productivity Command Center for a student or freelancer workflow.',
    outcome: 'Can design and run daily AI-assisted workflows without code dependency.',
  },
  {
    id: 'architect',
    title: 'Architect',
    duration: '8 Weeks',
    transformation: 'From user to builder of practical AI products.',
    skills: [
      'Python for AI workflows and API integrations',
      'Prompt engineering for business outcomes',
      'RAG basics, evaluations, and guardrails',
    ],
    tools: ['Python', 'OpenAI API', 'FastAPI', 'LangChain', 'Vector DB'],
    project: 'Domain AI Copilot with retrieval, memory, and evaluation dashboard.',
    outcome: 'Can build and ship a portfolio-ready AI application with measurable quality.',
  },
  {
    id: 'leader',
    title: 'Leader',
    duration: '10 Weeks',
    transformation: 'From builder to team-level AI operator and mentor.',
    skills: [
      'AI strategy, change management, and roadmap planning',
      'Experiment design, KPI tracking, and governance controls',
      'Cross-functional leadership across product, engineering, and operations',
    ],
    tools: ['Miro', 'Power BI', 'Jira', 'Slack AI', 'Governance Playbooks'],
    project: 'AI Transformation Plan for a department with ROI model and rollout path.',
    outcome: 'Can lead AI adoption programs and align teams to business outcomes.',
  },
  {
    id: 'engineer',
    title: 'Engineer',
    duration: '12 Weeks',
    transformation: 'From AI operator to production deployment specialist.',
    skills: [
      'MLOps and agent orchestration in production',
      'Cloud deployment, observability, and security hardening',
      'Client delivery, sprint execution, and post-launch optimization',
    ],
    tools: ['Docker', 'Azure', 'AWS', 'GCP', 'CI/CD', 'Monitoring Stack'],
    project: 'End-to-end deployed AI system with API, dashboard, and monitoring.',
    outcome: 'Can deploy, maintain, and scale real client-grade AI systems.',
  },
];

export const WEEKLY_PROGRAM_STRUCTURE: WeeklyProgramWeek[] = [
  {
    week: 1,
    title: 'Identity, Discovery, and AI Readiness',
    focus: 'Personal intelligence mapping, goal clarity, AI readiness baseline, and cohort orientation.',
    outcome: 'Learner defines what they have, what they give, and what they want to build.',
  },
  {
    week: 2,
    title: 'AI Foundations and Prompting',
    focus: 'Core AI concepts, prompting systems, responsible use, and productivity workflows.',
    outcome: 'Learner can use modern AI tools with confidence and structure.',
  },
  {
    week: 3,
    title: 'Tool Stack and Workflow Design',
    focus: 'Hands-on use of ChatGPT, Claude, Gemini, automation tools, and organized work systems.',
    outcome: 'Learner can design a repeatable AI-assisted workflow for daily execution.',
  },
  {
    week: 4,
    title: 'Team Formation and Role Assignment',
    focus: 'Scout peers, form execution teams, assign roles, and define leadership structure.',
    outcome: 'Each learner enters a team with clear accountability and direction.',
  },
  {
    week: 5,
    title: 'Python, APIs, and Builder Foundations',
    focus: 'Python basics, API calls, integration patterns, and structured build thinking.',
    outcome: 'Learner can begin building AI-enabled product components.',
  },
  {
    week: 6,
    title: 'Application Engineering Lab',
    focus: 'Build Beast AI components such as profiles, lesson systems, assistant flows, dashboards, and productivity tools.',
    outcome: 'Teams produce real platform features with visible product value.',
  },
  {
    week: 7,
    title: 'MVP Planning and Market Framing',
    focus: 'Choose a real problem, define the user, validate demand, and shape the MVP scope.',
    outcome: 'Each team locks a startup or product direction with a usable roadmap.',
  },
  {
    week: 8,
    title: 'MVP Build Sprint',
    focus: 'Prototype design, AI feature integration, testing loops, and mentor reviews.',
    outcome: 'Teams move from concept into a functioning MVP build.',
  },
  {
    week: 9,
    title: 'AI Toolkit Ownership',
    focus: 'Create take-home tools such as assistants, schedulers, CRM systems, contract analyzers, and workflows.',
    outcome: 'Learners leave with useful AI assets they personally own and can demo.',
  },
  {
    week: 10,
    title: 'Leadership, Operations, and Deployment',
    focus: 'Project operations, team coordination, deployment readiness, and execution discipline.',
    outcome: 'Teams can manage delivery with stronger leadership and production thinking.',
  },
  {
    week: 11,
    title: 'Demo Day and Shark Tank Preparation',
    focus: 'Pitch narrative, business model framing, market positioning, and live demonstration rehearsal.',
    outcome: 'Teams are ready to present both product proof and startup vision.',
  },
  {
    week: 12,
    title: 'Launch Readiness and Global Pathways',
    focus: 'Capstone presentation, internship selection, startup launch support, and India-USA transition planning.',
    outcome: 'Learner exits with a portfolio, team outcome, and a next-step path into work or venture building.',
  },
];

export const LEARNING_EXPERIENCE = {
  model: ['Self-paced core modules', 'Live mentorship labs', 'Cohort-based accountability pods'],
  weeklyMilestones: [
    'Monday: Mission briefing + goals',
    'Wednesday: Guided build lab',
    'Friday: Demo day + feedback loop',
    'Weekend: Portfolio polish + reflection',
  ],
  handsOnLabs: [
    'Prompt tuning and agent behavior control',
    'API integrations and workflow automation',
    'Deployment simulations and incident drills',
  ],
};

export const GLOBAL_MODEL = {
  india: [
    'High-scale learner onboarding and technical foundation programs',
    'Cohort operations and project sprint execution hubs',
  ],
  usa: [
    'Enterprise deployment leadership and consulting engagements',
    'Executive mentoring and client-facing solution architecture',
  ],
  bridge: [
    'Cross-border internship squads (India delivery + USA business context)',
    'Shared mentorship circles with global reviewers',
    'Joint capstone deployments for real clients',
  ],
};

export const CAREER_PIPELINE = [
  'Train in Hero Academy pathways',
  'Qualify into Pivot2AI transition track',
  'Work on Beast AI consulting projects',
  'Earn deployment references before placement',
  'Move into jobs, freelancing, or venture building',
];

export const AUDIENCE_SEGMENTS = [
  {
    title: 'Students',
    message: 'Launch an AI-first career with portfolio projects, internships, and mentorship.',
    cta: 'Start Your AI Career Path',
  },
  {
    title: 'Professionals',
    message: 'Switch to AI roles with guided transition plans, live coaching, and project proof.',
    cta: 'Apply for Pivot2AI Track',
  },
  {
    title: 'Companies',
    message: 'Build AI capability through talent pipelines, team upskilling, and deployment support.',
    cta: 'Partner for AI Implementation',
  },
];

export const DIFFERENTIATORS = [
  'Beyond courses: every tier includes a real build and measurable output.',
  'Beyond bootcamps: mentorship + accountability + deployment rigor.',
  'Beyond certifications: project evidence, client workflows, and consulting exposure.',
  'Global execution model: India scale paired with USA enterprise deployment.',
  'Beyond internships: startup incubation, team formation, and real company creation pathways.',
];

export const INCUBATOR_PHASES = [
  {
    title: 'Phase 1: Self Discovery',
    detail: 'Map identity, value, goals, and role clarity through personal intelligence profiling.',
  },
  {
    title: 'Phase 2: Team Formation',
    detail: 'Scout talent, assign leads, and organize 20 learners into focused five-person execution teams.',
  },
  {
    title: 'Phase 3: Bootcamp Core',
    detail: 'Combine entrepreneurship, AI systems, and personal mastery into one disciplined operating rhythm.',
  },
  {
    title: 'Phase 4: MVP Build',
    detail: 'Choose a real problem, design a solution, and ship an AI-enabled MVP with mentor feedback loops.',
  },
  {
    title: 'Phase 5: Demo to Launch',
    detail: 'Run demo day, Shark Tank pitch, and startup-readiness selection across India and USA support layers.',
  },
];

export const TEAM_ROLES = [
  'AI Engineer',
  'Product Builder',
  'Business Strategist',
  'Operations / Execution Lead',
  'Pitch / Communication Lead',
];

export const BUILD_TRACK_PHASES = [
  'Micro Builds: note generator, summarizer, prompt assistant, email writer',
  'Core Tools: AI assistant, smart scheduler, mini CRM, contract analyzer',
  'Agent Systems: research agent, task agent, decision agent, multi-agent workflow',
  'Deployment: publish, demo, and hand off usable AI tools students keep',
];

export const TAKE_HOME_STACK = [
  'Personal AI Assistant',
  'Smart Scheduler',
  'Mini CRM',
  'Contract / Negotiation Assistant',
  'Multi-Agent Workflow System',
];

export const PRICING_TIERS = [
  {
    name: 'Free Entry',
    price: '$0',
    value: ['AI readiness assessment', 'Sample lessons', 'Community events'],
  },
  {
    name: 'Pro Cohort',
    price: '$799-$1,999',
    value: ['Tier-based training track', 'Live mentorship', 'Portfolio project reviews'],
  },
  {
    name: 'Elite Deployment',
    price: '$3,500+',
    value: ['Engineer track', 'Client project exposure', 'Internship and job pipeline support'],
  },
  {
    name: 'Corporate Partnership',
    price: 'Custom',
    value: ['Team upskilling', 'AI implementation advisory', 'Talent pipeline access'],
  },
  {
    name: 'Startup Incubator',
    price: '$5,000+',
    value: ['Team formation', 'MVP build labs', 'Pitch day support', 'Startup launch advisory'],
  },
];

export const STUDENT_JOURNEY = [
  'Discover and complete AI readiness test',
  'Choose track and join weekly cohort rhythm',
  'Build project milestones with mentor reviews',
  'Publish portfolio and complete capstone deployment',
  'Enter internship or consulting project stream',
  'Graduate job-ready with verified experience',
];

export const FOUNDER_AUTHORITY = {
  name: 'Navneet Porwal (Monk)',
  role: 'CIO & Founder, Beast AI',
  journey:
    'Built leadership from enterprise DevOps execution to global AI transformation strategy, now guiding learners and teams to deliver production-grade AI systems.',
};
