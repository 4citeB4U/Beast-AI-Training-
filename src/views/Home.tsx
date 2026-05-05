/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: PRODUCT.BEAST.VIEW
TAG: UI.BEAST.VIEW.HOME

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#E8F5E9

ICON_ASCII:
family=lucide
glyph=layout

5WH:
WHAT = BEAST AI Component: Home.tsx
WHY = Part of the BEAST AI Leeway Standards alignment
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = src/views/Home.tsx
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
import { ArrowRight, BriefcaseBusiness, Globe2, GraduationCap, ShieldCheck, Sparkles, Target, UserCheck, Workflow } from 'lucide-react';
import { useApp } from '../AppContext';
import { BEAST_LOGO_SRC } from '../assets/beastLogo';
import {
  ACADEMY_NAME,
  AUDIENCE_SEGMENTS,
  BUILD_TRACK_PHASES,
  CAREER_PIPELINE,
  CORE_POSITIONING,
  DIFFERENTIATORS,
  FOUNDER_AUTHORITY,
  GLOBAL_MODEL,
  HERO_HEADLINE,
  HERO_PILLARS,
  HERO_SUBHEAD,
  INCUBATOR_PHASES,
  LEARNING_EXPERIENCE,
  PRICING_TIERS,
  PROGRAM_TIERS,
  STUDENT_JOURNEY,
  TAKE_HOME_STACK,
  TEAM_ROLES,
} from '../content/academyBlueprint';

export const HomeView: React.FC<{ 
  onNavigate: (view: any) => void;
  onOpenModule: (courseId: string, moduleId: string) => void;
}> = ({ onNavigate }) => {
  const { progress } = useApp();

  const scrollTo = (id: string) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-10 pb-10">
      <section className="academy-hero-card p-8 md:p-12 rounded-3xl border border-violet-200/70 relative overflow-hidden">
        <div className="academy-hero-glow" />
        <div className="relative z-10 max-w-4xl space-y-6">
          <img
            src={BEAST_LOGO_SRC}
            alt="B.E.A.S.T. AI Technologies logo"
            className="h-28 w-28 rounded-3xl border border-yellow-400/40 bg-white object-cover p-1 shadow-[0_20px_50px_-20px_rgba(250,204,21,0.45)]"
          />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-800 text-xs font-black uppercase tracking-[0.2em]">
            <Sparkles size={14} />
            Global AI Academy + Internship + Startup Incubator
          </div>
          <h1 className="text-4xl md:text-6xl leading-[0.95] font-black uppercase tracking-tight text-slate-950">
            {HERO_HEADLINE}
          </h1>
          <p className="text-base md:text-xl text-slate-700 max-w-3xl leading-relaxed font-medium">
            {HERO_SUBHEAD}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {HERO_PILLARS.map((pillar) => (
              <Card key={pillar} className="p-4 bg-white/80 border-slate-200">
                <p className="text-sm font-bold leading-relaxed text-slate-800">{pillar}</p>
              </Card>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="brutal" size="lg" onClick={() => onNavigate('library')} className="bg-violet-700 text-white border-violet-900 hover:bg-violet-800">
              Enter Curriculum
            </Button>
            <Button variant="outline" size="lg" onClick={() => scrollTo('program-structure')} className="border-violet-300 text-violet-700 hover:bg-violet-50">
              See Program Structure
            </Button>
            <Button variant="outline" size="lg" onClick={() => scrollTo('global-model')} className="border-emerald-400 text-emerald-700 hover:bg-emerald-50">
              Explore India USA Model
            </Button>
            <Button variant="outline" size="lg" onClick={() => scrollTo('pricing')} className="border-yellow-400 text-yellow-700 hover:bg-yellow-50">
              Startup Track Pricing
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <Card className="p-3 bg-white/70 border-violet-100">
              <p className="text-xs uppercase font-black text-violet-600">Current Track</p>
              <p className="text-lg font-black text-slate-900">{progress.level || 'Explorer'}</p>
            </Card>
            <Card className="p-3 bg-white/70 border-emerald-100">
              <p className="text-xs uppercase font-black text-emerald-600">Progress XP</p>
              <p className="text-lg font-black text-slate-900">{progress.xp}</p>
            </Card>
            <Card className="p-3 bg-white/70 border-yellow-100">
              <p className="text-xs uppercase font-black text-yellow-700">Streak</p>
              <p className="text-lg font-black text-slate-900">{progress.streak} days</p>
            </Card>
            <Card className="p-3 bg-white/70 border-violet-100">
              <p className="text-xs uppercase font-black text-violet-600">Model</p>
              <p className="text-lg font-black text-slate-900">Hybrid</p>
            </Card>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-4 md:p-5">
            <p className="text-xs uppercase font-black tracking-[0.2em] text-violet-700">What This Program Actually Does</p>
            <p className="mt-2 text-sm md:text-base text-slate-700 leading-relaxed font-semibold">
              {CORE_POSITIONING}
            </p>
          </div>
        </div>
      </section>

      <section id="program-structure" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900">Program Structure</h2>
          <button className="text-xs uppercase font-black tracking-[0.2em] text-violet-700 hover:underline" onClick={() => onNavigate('library')}>
            Open Curriculum
          </button>
        </div>
        <p className="text-slate-600 font-medium max-w-4xl">
          {ACADEMY_NAME} uses a four-tier transformation path designed for outcomes, not just completion.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROGRAM_TIERS.map((tier) => (
            <Card key={tier.id} className="p-6 border border-slate-200 bg-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">{tier.duration}</p>
                  <h3 className="text-2xl font-black uppercase text-slate-950 tracking-tight">{tier.title}</h3>
                  <p className="text-sm text-slate-600 font-semibold mt-1">{tier.transformation}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-yellow-100 text-yellow-800">
                  Tier {tier.id}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-xs uppercase font-black text-emerald-700 tracking-wider">Skills Learned</p>
                  <p className="text-sm text-slate-700">{tier.skills.join(' • ')}</p>
                </div>
                <div>
                  <p className="text-xs uppercase font-black text-violet-700 tracking-wider">Tools Used</p>
                  <p className="text-sm text-slate-700">{tier.tools.join(' • ')}</p>
                </div>
                <div>
                  <p className="text-xs uppercase font-black text-yellow-700 tracking-wider">Project Built</p>
                  <p className="text-sm text-slate-700">{tier.project}</p>
                </div>
                <div className="rounded-xl p-3 bg-emerald-50 border border-emerald-200">
                  <p className="text-xs uppercase font-black text-emerald-800 tracking-wider">After This Tier, Learner Can</p>
                  <p className="text-sm font-semibold text-emerald-900">{tier.outcome}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Card className="p-5 border border-dashed border-violet-300 bg-violet-50/60">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase font-black tracking-[0.2em] text-violet-700">Curriculum Access</p>
              <h3 className="text-2xl font-black uppercase tracking-tight text-slate-950 mt-1">Weekly Detail Lives In The Curriculum Library</h3>
              <p className="text-sm text-slate-700 mt-2 max-w-3xl">
                To avoid repeating the curriculum in two places, the full week-by-week module breakdown now lives in the library where learners launch the actual lessons.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="brutal" size="sm" className="bg-violet-700 text-white border-violet-900" onClick={() => onNavigate('library')}>
                Open Curriculum Library
              </Button>
              <Button variant="outline" size="sm" className="border-emerald-400 text-emerald-700" onClick={() => onNavigate('beast-training')}>
                Open Tools Track
              </Button>
            </div>
          </div>
        </Card>
      </section>

      <section id="learning-experience" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 bg-violet-50 border-violet-200">
          <div className="flex items-center gap-2 text-violet-700 font-black uppercase text-xs tracking-[0.18em]">
            <Workflow size={14} /> Hybrid Learning Model
          </div>
          <h3 className="text-2xl font-black uppercase text-slate-900 mt-2">Self Paced + Live + Cohort</h3>
          <p className="text-slate-700 mt-2">{LEARNING_EXPERIENCE.model.join(' • ')}</p>
        </Card>
        <Card className="p-6 bg-emerald-50 border-emerald-200">
          <div className="flex items-center gap-2 text-emerald-700 font-black uppercase text-xs tracking-[0.18em]">
            <Target size={14} /> Weekly Milestones
          </div>
          <h3 className="text-2xl font-black uppercase text-slate-900 mt-2">Cadence That Prevents Drop Off</h3>
          <p className="text-slate-700 mt-2">{LEARNING_EXPERIENCE.weeklyMilestones.join(' • ')}</p>
        </Card>
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-2 text-yellow-800 font-black uppercase text-xs tracking-[0.18em]">
            <ShieldCheck size={14} /> Hands On Labs
          </div>
          <h3 className="text-2xl font-black uppercase text-slate-900 mt-2">Real Tools, Real Outputs</h3>
          <p className="text-slate-700 mt-2">{LEARNING_EXPERIENCE.handsOnLabs.join(' • ')}</p>
        </Card>
      </section>

      <section id="global-model" className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900">Global Model: India ↔ USA</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 bg-white border-violet-200">
            <p className="text-xs uppercase font-black tracking-[0.2em] text-violet-700">India: Education + Scale</p>
            <p className="text-sm mt-2 text-slate-700">{GLOBAL_MODEL.india.join(' • ')}</p>
          </Card>
          <Card className="p-5 bg-white border-yellow-200">
            <p className="text-xs uppercase font-black tracking-[0.2em] text-yellow-700">USA: Leadership + Deployment</p>
            <p className="text-sm mt-2 text-slate-700">{GLOBAL_MODEL.usa.join(' • ')}</p>
          </Card>
          <Card className="p-5 bg-white border-emerald-200">
            <div className="flex items-center gap-2">
              <Globe2 size={16} className="text-emerald-700" />
              <p className="text-xs uppercase font-black tracking-[0.2em] text-emerald-700">Bridge Layer</p>
            </div>
            <p className="text-sm mt-2 text-slate-700">{GLOBAL_MODEL.bridge.join(' • ')}</p>
          </Card>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 border-violet-200">
          <div className="flex items-center gap-2 text-violet-700 text-xs uppercase font-black tracking-[0.2em]">
            <BriefcaseBusiness size={14} /> Career & Business Pipeline
          </div>
          <h3 className="text-2xl font-black uppercase mt-2 text-slate-900">Pivot2AI + Beast Consulting</h3>
          <p className="text-slate-700 mt-2">{CAREER_PIPELINE.join(' → ')}</p>
          <div className="mt-4 flex gap-2 flex-wrap">
            <Button size="sm" variant="brutal" className="bg-violet-700 text-white border-violet-900" onClick={() => onNavigate('dashboard')}>Apply Transition Track</Button>
            <Button size="sm" variant="outline" className="border-emerald-400 text-emerald-700" onClick={() => onNavigate('agent-vm')}>View Deployment Path</Button>
          </div>
        </Card>
        <Card className="p-6 border-emerald-200">
          <div className="flex items-center gap-2 text-emerald-700 text-xs uppercase font-black tracking-[0.2em]">
            <UserCheck size={14} /> Founder Authority
          </div>
          <h3 className="text-2xl font-black uppercase mt-2 text-slate-900">{FOUNDER_AUTHORITY.name}</h3>
          <p className="text-sm font-bold text-yellow-700 uppercase tracking-wider">{FOUNDER_AUTHORITY.role}</p>
          <p className="text-slate-700 mt-3">{FOUNDER_AUTHORITY.journey}</p>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900">Audience Segments</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AUDIENCE_SEGMENTS.map((segment) => (
            <Card key={segment.title} className="p-5 bg-white border-slate-200">
              <p className="text-xs uppercase font-black tracking-[0.2em] text-violet-700">{segment.title}</p>
              <p className="text-sm text-slate-700 mt-2">{segment.message}</p>
              <button className="mt-4 inline-flex items-center gap-2 text-sm font-black text-emerald-700 hover:text-emerald-800" onClick={() => onNavigate('library')}>
                {segment.cta}
                <ArrowRight size={14} />
              </button>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 border-yellow-200 bg-yellow-50/40">
          <div className="flex items-center gap-2 text-yellow-800 text-xs uppercase font-black tracking-[0.2em]">
            <GraduationCap size={14} /> Differentiation
          </div>
          <h3 className="text-2xl font-black uppercase mt-2 text-slate-900">Why Beast AI Is Different</h3>
          <p className="text-slate-700 mt-2">{DIFFERENTIATORS.join(' • ')}</p>
        </Card>
        <Card className="p-6 border-violet-200 bg-violet-50/40">
          <div className="flex items-center gap-2 text-violet-700 text-xs uppercase font-black tracking-[0.2em]">
            <Workflow size={14} /> Student Journey
          </div>
          <h3 className="text-2xl font-black uppercase mt-2 text-slate-900">Start to Job Ready</h3>
          <p className="text-slate-700 mt-2">{STUDENT_JOURNEY.join(' → ')}</p>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900">Global Incubator Engine</h2>
        <p className="text-slate-700 max-w-4xl font-medium">
          Beast AI Hero Academy now includes a premium startup-incubation layer: identity discovery, team formation, bootcamp execution, MVP creation, demo day, Shark Tank pitch, and startup launch support.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {INCUBATOR_PHASES.map((phase) => (
            <Card key={phase.title} className="p-5 border-violet-200 bg-white h-full">
              <p className="text-xs uppercase font-black tracking-[0.2em] text-violet-700">{phase.title}</p>
              <p className="text-sm mt-3 text-slate-700 leading-relaxed">{phase.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6 border-emerald-200 bg-emerald-50/50">
          <div className="flex items-center gap-2 text-emerald-700 text-xs uppercase font-black tracking-[0.2em]">
            <Workflow size={14} /> Team Formation & Leadership
          </div>
          <h3 className="text-2xl font-black uppercase mt-2 text-slate-900">Structured Team Roles</h3>
          <p className="text-slate-700 mt-2">Twenty students scout, evaluate, and form four teams of five with clear responsibility ownership.</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TEAM_ROLES.map((role) => (
              <div key={role} className="px-3 py-3 border border-emerald-200 bg-white rounded-xl text-sm font-bold text-slate-800">
                {role}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-yellow-200 bg-yellow-50/50">
          <div className="flex items-center gap-2 text-yellow-800 text-xs uppercase font-black tracking-[0.2em]">
            <BriefcaseBusiness size={14} /> Build Real AI Tools
          </div>
          <h3 className="text-2xl font-black uppercase mt-2 text-slate-900">Take-Home AI Toolkit</h3>
          <p className="text-slate-700 mt-2">Students do not leave with theory only. They leave with deployed tools, portfolio proof, and startup-building confidence.</p>
          <div className="mt-4 space-y-2">
            {TAKE_HOME_STACK.map((tool) => (
              <div key={tool} className="px-3 py-2 border border-yellow-200 bg-white rounded-xl text-sm font-semibold text-slate-800">
                {tool}
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900">Build Beast AI Track</h2>
        <p className="text-slate-700 max-w-4xl font-medium">
          This hands-on backbone turns the internship into real product engineering. Learners build actual Beast AI platform features, integrate them in teams, test them, and present live outcomes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {BUILD_TRACK_PHASES.map((phase) => (
            <Card key={phase} className="p-5 border-slate-200 bg-white h-full">
              <p className="text-sm font-bold text-slate-800 leading-relaxed">{phase}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="pricing" className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900">Business Model</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {PRICING_TIERS.map((tier) => (
            <Card key={tier.name} className="p-5 border-slate-200 bg-white h-full">
              <p className="text-xs uppercase font-black tracking-[0.2em] text-violet-700">{tier.name}</p>
              <p className="text-3xl font-black text-slate-950 mt-2">{tier.price}</p>
              <p className="text-sm mt-2 text-slate-700">{tier.value.join(' • ')}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="academy-cta p-8 rounded-3xl border border-violet-300">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-950">Become a Job Ready AI Hero</h2>
        <p className="text-slate-700 mt-2 max-w-3xl">
          Join as a learner, apply as a career switcher, or partner as a company building AI capability.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="brutal" size="lg" className="bg-violet-700 text-white border-violet-900" onClick={() => onNavigate('library')}>Join Now</Button>
          <Button variant="outline" size="lg" className="border-emerald-400 text-emerald-700" onClick={() => onNavigate('dashboard')}>Apply for Internship</Button>
          <Button variant="outline" size="lg" className="border-yellow-400 text-yellow-700" onClick={() => onNavigate('certifications')}>Partner with Beast AI</Button>
        </div>
      </section>
    </div>
  );
};
