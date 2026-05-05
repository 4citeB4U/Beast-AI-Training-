/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: PRODUCT.BEAST.VIEW
TAG: UI.BEAST.VIEW.ACADEMY_PORTAL

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#E8F5E9

ICON_ASCII:
family=lucide
glyph=layout

5WH:
WHAT = BEAST AI Component: AcademyPortal.tsx
WHY = Dedicated academy access, profile, and instructor-student messaging
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = src/views/AcademyPortal.tsx
WHEN = 2026-05-05
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
import { Mail, UserRound, LogIn, UserPlus, Send, ShieldCheck, GraduationCap, Users, Workflow, Calendar, CheckCircle2 } from 'lucide-react';
import { useApp } from '../AppContext';
import { BEAST_LOGO_SRC } from '../assets/beastLogo';

export const AcademyPortalView: React.FC = () => {
  const { progress, updateAcademyProfile, sendAcademyMessage, enrollMentorship } = useApp();

  const scrollTo = (id: string) => {
    const node = document.getElementById(id);
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const [authMode, setAuthMode] = React.useState<'login' | 'signup'>('signup');
  const [authForm, setAuthForm] = React.useState({
    fullName: progress.academyProfile?.fullName || progress.credentials?.oauthUsername || '',
    email: progress.academyProfile?.email || progress.credentials?.oauthEmail || '',
    password: '',
  });

  const [profileForm, setProfileForm] = React.useState({
    fullName: progress.academyProfile?.fullName || progress.credentials?.oauthUsername || '',
    email: progress.academyProfile?.email || progress.credentials?.oauthEmail || '',
    role: progress.academyProfile?.role || 'student',
    organization: progress.academyProfile?.organization || 'Beast AI Academy',
    timezone: progress.academyProfile?.timezone || 'UTC-05:00',
    bio: progress.academyProfile?.bio || '',
  });

  const [studentEmail, setStudentEmail] = React.useState({ subject: '', body: '' });
  const [instructorEmail, setInstructorEmail] = React.useState({ subject: '', body: '' });
  const [mentorshipForm, setMentorshipForm] = React.useState({
    fullName: progress.academyProfile?.fullName || progress.credentials?.oauthUsername || '',
    email: progress.academyProfile?.email || progress.credentials?.oauthEmail || '',
    track: 'peer' as 'peer' | 'mentor-led' | 'team-pod',
    focusArea: 'AI Tool Building',
    weeklyAvailability: '6 hours / week',
    goals: '',
  });

  const messages = progress.academyMessages || [];
  const mentorshipEnrollments = progress.mentorshipEnrollments || [];

  const handleAuthSubmit = () => {
    if (!authForm.email.trim()) {
      alert('Please provide a valid email.');
      return;
    }

    updateAcademyProfile({
      fullName: authForm.fullName || progress.academyProfile?.fullName || 'Academy Member',
      email: authForm.email,
      role: (progress.academyProfile?.role || 'student') as 'student' | 'instructor',
    });

    alert(authMode === 'signup' ? 'Academy signup completed.' : 'Academy login successful.');
  };

  const handleSaveProfile = () => {
    updateAcademyProfile({
      fullName: profileForm.fullName,
      email: profileForm.email,
      role: profileForm.role as 'student' | 'instructor',
      organization: profileForm.organization,
      timezone: profileForm.timezone,
      bio: profileForm.bio,
    });

    alert('Profile updated successfully.');
  };

  const handleStudentSend = () => {
    if (!studentEmail.subject.trim() || !studentEmail.body.trim()) return;
    sendAcademyMessage({
      from: 'student',
      to: 'instructor',
      subject: studentEmail.subject,
      body: studentEmail.body,
    });
    setStudentEmail({ subject: '', body: '' });
  };

  const handleInstructorSend = () => {
    if (!instructorEmail.subject.trim() || !instructorEmail.body.trim()) return;
    sendAcademyMessage({
      from: 'instructor',
      to: 'student',
      subject: instructorEmail.subject,
      body: instructorEmail.body,
    });
    setInstructorEmail({ subject: '', body: '' });
  };

  const handleMentorshipSignup = () => {
    if (!mentorshipForm.fullName.trim() || !mentorshipForm.email.trim() || !mentorshipForm.goals.trim()) {
      alert('Please complete full name, email, and mentorship goals.');
      return;
    }

    enrollMentorship({
      fullName: mentorshipForm.fullName,
      email: mentorshipForm.email,
      track: mentorshipForm.track,
      focusArea: mentorshipForm.focusArea,
      weeklyAvailability: mentorshipForm.weeklyAvailability,
      goals: mentorshipForm.goals,
    });

    sendAcademyMessage({
      from: 'student',
      to: 'instructor',
      subject: `Mentorship Signup: ${mentorshipForm.track.toUpperCase()}`,
      body: `Learner ${mentorshipForm.fullName} requested mentorship. Focus: ${mentorshipForm.focusArea}. Availability: ${mentorshipForm.weeklyAvailability}. Goals: ${mentorshipForm.goals}`,
    });

    setMentorshipForm(prev => ({ ...prev, goals: '' }));
    alert('Mentorship signup submitted. Matching review has started.');
  };

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <img
          src={BEAST_LOGO_SRC}
          alt="B.E.A.S.T. AI Technologies logo"
          className="h-24 w-24 rounded-3xl border border-yellow-400/40 bg-white object-cover p-1 shadow-[0_18px_40px_-18px_rgba(250,204,21,0.45)]"
        />
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">Academy Access Center.</h1>
        <p className="text-neutral-500 font-medium">
          Join the Academy, manage your profile, and run direct instructor-student email communication in one place.
        </p>
      </section>

      <Card className="p-3 border-2 border-black bg-white">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => scrollTo('academy-access')}>
            Access
          </Button>
          <Button size="sm" variant="primary" onClick={() => scrollTo('academy-mentorship')}>
            Membership / Mentorship
          </Button>
          <Button size="sm" variant="outline" onClick={() => scrollTo('academy-email')}>
            Email
          </Button>
        </div>
      </Card>

      <section id="academy-access" className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="p-5 border-2 border-black bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-[0.15em]">Signup / Login</h2>
            <div className="flex gap-2">
              <Button size="sm" variant={authMode === 'signup' ? 'primary' : 'outline'} onClick={() => setAuthMode('signup')}>
                <UserPlus size={12} />
                Sign Up
              </Button>
              <Button size="sm" variant={authMode === 'login' ? 'primary' : 'outline'} onClick={() => setAuthMode('login')}>
                <LogIn size={12} />
                Login
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={authForm.fullName}
              onChange={(e) => setAuthForm(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="Full Name"
              className="w-full border-2 border-black p-2 text-xs font-bold uppercase tracking-wide"
            />
            <input
              type="email"
              value={authForm.email}
              onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Email Address"
              className="w-full border-2 border-black p-2 text-xs font-bold uppercase tracking-wide"
            />
            <input
              type="password"
              value={authForm.password}
              onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Password"
              className="w-full border-2 border-black p-2 text-xs font-bold uppercase tracking-wide"
            />
          </div>

          <Button className="w-full" onClick={handleAuthSubmit}>
            {authMode === 'signup' ? 'Create Academy Account' : 'Login to Academy'}
          </Button>

          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Status: {progress.academyProfile?.email ? 'Account connected' : 'Pending account setup'}
          </p>
        </Card>

        <Card className="p-5 border-2 border-black bg-white space-y-4">
          <div className="flex items-center gap-2">
            <UserRound size={16} className="text-emerald-600" />
            <h2 className="text-sm font-black uppercase tracking-[0.15em]">User Profile</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={profileForm.fullName}
              onChange={(e) => setProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="Full Name"
              className="w-full border-2 border-black p-2 text-xs font-bold uppercase tracking-wide"
            />
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
              className="w-full border-2 border-black p-2 text-xs font-bold uppercase tracking-wide"
            />
            <select
              value={profileForm.role}
              onChange={(e) => setProfileForm(prev => ({ ...prev, role: e.target.value as 'student' | 'instructor' }))}
              className="w-full border-2 border-black p-2 text-xs font-bold uppercase tracking-wide"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
            <input
              type="text"
              value={profileForm.timezone}
              onChange={(e) => setProfileForm(prev => ({ ...prev, timezone: e.target.value }))}
              placeholder="Timezone"
              className="w-full border-2 border-black p-2 text-xs font-bold uppercase tracking-wide"
            />
            <input
              type="text"
              value={profileForm.organization}
              onChange={(e) => setProfileForm(prev => ({ ...prev, organization: e.target.value }))}
              placeholder="Organization"
              className="w-full border-2 border-black p-2 text-xs font-bold uppercase tracking-wide md:col-span-2"
            />
            <textarea
              value={profileForm.bio}
              onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Bio / Learning goals"
              className="w-full border-2 border-black p-2 text-xs font-bold tracking-wide md:col-span-2 min-h-24"
            />
          </div>

          <Button className="w-full" onClick={handleSaveProfile}>
            Save Profile
          </Button>
        </Card>
      </section>

      <Card id="academy-mentorship" className="p-5 border-2 border-black bg-white space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-violet-700">
            <Users size={16} />
            <h2 className="text-sm font-black uppercase tracking-[0.15em]">Mentorship Program</h2>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-neutral-500">Under Academy Button</p>
        </div>

        <p className="text-sm font-semibold text-neutral-700 leading-relaxed">
          Full mentorship structure is now part of Academy: peer guidance, mentor-led coaching, and team pod execution mapped to the 12-week system.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="border border-black bg-neutral-50 p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-violet-700">Peer Mentorship</p>
            <p className="text-xs font-medium mt-1 text-neutral-700">Student-to-student support circles for accountability, weekly check-ins, and build unblock sessions.</p>
          </div>
          <div className="border border-black bg-neutral-50 p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Mentor-Led Coaching</p>
            <p className="text-xs font-medium mt-1 text-neutral-700">Expert feedback on architecture, prompting strategy, quality review, deployment, and pitch readiness.</p>
          </div>
          <div className="border border-black bg-neutral-50 p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-yellow-700">Team Pod Execution</p>
            <p className="text-xs font-medium mt-1 text-neutral-700">Small squads combine tools into one MVP and prepare for Demo Day and Shark Tank style presentation.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="space-y-3 border-2 border-black p-4 bg-white">
            <div className="flex items-center gap-2 text-emerald-700">
              <Workflow size={14} />
              <p className="text-[11px] font-black uppercase tracking-wider">Mentorship Stages</p>
            </div>
            <div className="space-y-2">
              {[
                'Week 1-2: Onboard and baseline assessment',
                'Week 3-6: Guided build + weekly mentorship checkpoints',
                'Week 7-10: MVP coaching, testing, and deployment review',
                'Week 11-12: Demo prep, pitch mentoring, launch pathway',
              ].map((stage) => (
                <div key={stage} className="flex items-start gap-2 text-xs font-semibold text-neutral-700">
                  <CheckCircle2 size={14} className="text-emerald-600 mt-0.5" />
                  <span>{stage}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-2 border-black p-4 bg-neutral-50">
            <div className="flex items-center gap-2 text-violet-700">
              <Calendar size={14} />
              <p className="text-[11px] font-black uppercase tracking-wider">Mentorship Signup</p>
            </div>
            <input
              type="text"
              value={mentorshipForm.fullName}
              onChange={(e) => setMentorshipForm(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="Full Name"
              className="w-full border-2 border-black p-2 text-xs font-bold uppercase tracking-wide bg-white"
            />
            <input
              type="email"
              value={mentorshipForm.email}
              onChange={(e) => setMentorshipForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
              className="w-full border-2 border-black p-2 text-xs font-bold uppercase tracking-wide bg-white"
            />
            <select
              value={mentorshipForm.track}
              onChange={(e) => setMentorshipForm(prev => ({ ...prev, track: e.target.value as 'peer' | 'mentor-led' | 'team-pod' }))}
              className="w-full border-2 border-black p-2 text-xs font-bold uppercase tracking-wide bg-white"
            >
              <option value="peer">Peer Mentorship</option>
              <option value="mentor-led">Mentor-Led Coaching</option>
              <option value="team-pod">Team Pod Mentorship</option>
            </select>
            <input
              type="text"
              value={mentorshipForm.focusArea}
              onChange={(e) => setMentorshipForm(prev => ({ ...prev, focusArea: e.target.value }))}
              placeholder="Focus Area"
              className="w-full border-2 border-black p-2 text-xs font-bold uppercase tracking-wide bg-white"
            />
            <input
              type="text"
              value={mentorshipForm.weeklyAvailability}
              onChange={(e) => setMentorshipForm(prev => ({ ...prev, weeklyAvailability: e.target.value }))}
              placeholder="Weekly Availability"
              className="w-full border-2 border-black p-2 text-xs font-bold uppercase tracking-wide bg-white"
            />
            <textarea
              value={mentorshipForm.goals}
              onChange={(e) => setMentorshipForm(prev => ({ ...prev, goals: e.target.value }))}
              placeholder="What do you want to achieve through mentorship?"
              className="w-full border-2 border-black p-2 text-xs font-bold tracking-wide bg-white min-h-20"
            />
            <Button className="w-full" onClick={handleMentorshipSignup}>
              <UserPlus size={12} />
              Join Mentorship Program
            </Button>
          </div>
        </div>

        <div className="border-2 border-black p-3 bg-neutral-50 space-y-2 max-h-64 overflow-y-auto">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-black uppercase tracking-wider">Mentorship Signups</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{mentorshipEnrollments.length} submitted</p>
          </div>
          {mentorshipEnrollments.length === 0 && (
            <p className="text-xs font-bold text-neutral-400">No mentorship signups yet. Submit from the panel above.</p>
          )}
          {mentorshipEnrollments
            .slice()
            .reverse()
            .map((enrollment) => (
              <div key={enrollment.id} className="border border-black bg-white p-2 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest">{enrollment.fullName} • {enrollment.track}</p>
                  <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">{enrollment.status}</p>
                </div>
                <p className="text-[10px] font-black uppercase tracking-wide">{enrollment.focusArea} • {enrollment.weeklyAvailability}</p>
                <p className="text-xs font-medium text-neutral-700 leading-relaxed">{enrollment.goals}</p>
              </div>
            ))}
        </div>
      </Card>

      <Card id="academy-email" className="p-5 border-2 border-black bg-white space-y-4">
        <div className="flex items-center gap-2 text-emerald-600">
          <Mail size={16} />
          <h2 className="text-sm font-black uppercase tracking-[0.15em]">Academy Email System</h2>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="space-y-3">
            <p className="text-[11px] font-black uppercase tracking-wider text-neutral-500">Student to Instructor</p>
            <input
              type="text"
              value={studentEmail.subject}
              onChange={(e) => setStudentEmail(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Subject"
              className="w-full border-2 border-black p-2 text-xs font-bold uppercase tracking-wide"
            />
            <textarea
              value={studentEmail.body}
              onChange={(e) => setStudentEmail(prev => ({ ...prev, body: e.target.value }))}
              placeholder="Write your question to the instructor..."
              className="w-full border-2 border-black p-2 text-xs font-bold tracking-wide min-h-24"
            />
            <Button className="w-full" onClick={handleStudentSend}>
              <Send size={12} />
              Send to Instructor
            </Button>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-black uppercase tracking-wider text-neutral-500">Instructor to Students</p>
            <input
              type="text"
              value={instructorEmail.subject}
              onChange={(e) => setInstructorEmail(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Subject"
              className="w-full border-2 border-black p-2 text-xs font-bold uppercase tracking-wide"
            />
            <textarea
              value={instructorEmail.body}
              onChange={(e) => setInstructorEmail(prev => ({ ...prev, body: e.target.value }))}
              placeholder="Broadcast assignment or feedback..."
              className="w-full border-2 border-black p-2 text-xs font-bold tracking-wide min-h-24"
            />
            <Button className="w-full" onClick={handleInstructorSend}>
              <Send size={12} />
              Send to Students
            </Button>
          </div>
        </div>

        <div className="border-2 border-black p-3 bg-neutral-50 space-y-2 max-h-64 overflow-y-auto">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-black uppercase tracking-wider">Message Thread</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{messages.length} messages</p>
          </div>

          {messages.length === 0 && (
            <p className="text-xs font-bold text-neutral-400">No messages yet. Start communication from either panel.</p>
          )}

          {messages
            .slice()
            .reverse()
            .map((msg) => (
              <div key={msg.id} className="border border-black bg-white p-2 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    {msg.from.toUpperCase()} → {msg.to.toUpperCase()}
                  </p>
                  <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                    {new Date(msg.timestamp).toLocaleString()}
                  </p>
                </div>
                <p className="text-[11px] font-black uppercase tracking-wide">{msg.subject}</p>
                <p className="text-xs font-medium text-neutral-700 leading-relaxed">{msg.body}</p>
              </div>
            ))}
        </div>
      </Card>

      <Card brutal className="bg-emerald-500 text-black p-5">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={16} />
          <p className="text-[11px] font-black uppercase tracking-[0.2em]">Academy Policy</p>
        </div>
        <p className="text-sm font-black italic leading-tight">
          Academy handles enrollment, identity, and communication. Curriculum holds Microsoft, Azure, Google, and Leeway training paths.
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
          <GraduationCap size={14} />
          Training content remains under Curriculum.
        </div>
      </Card>
    </div>
  );
};
