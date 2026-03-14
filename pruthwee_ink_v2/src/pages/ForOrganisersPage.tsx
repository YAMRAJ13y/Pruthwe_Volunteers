import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, CheckCircle, Users, Calendar, MessageSquare, BarChart3, Shield, Layers, Zap } from 'lucide-react';
import { openRegisterModal } from '../components/layout/Navbar';

// ── SCROLL REVEAL ─────────────────────────────
function useScrollReveal() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
  return { ref, inView };
}

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ── HOW IT WORKS ──────────────────────────────
const STEPS = [
  {
    step: '01',
    icon: '🏢',
    title: 'Register Your Organisation',
    desc: 'Create your event organisation profile. Add org details, logo, contact info. Pruthwee reviews and approves your account.',
  },
  {
    step: '02',
    icon: '📋',
    title: 'Build Your Event',
    desc: 'Use our 10-step wizard to create a complete event — dates, venue, sectors, tasks, assignments, and custom registration requirements.',
  },
  {
    step: '03',
    icon: '🌐',
    title: 'Publish & Open',
    desc: 'Publish your event to the Pruthwee directory. Open registration when ready. Volunteers browse and register from across India.',
  },
  {
    step: '04',
    icon: '🎯',
    title: 'Allocate & Activate',
    desc: 'Use the smart Allocation Tool to assign volunteers to specific shifts. MQ scores guide your decisions. Activate when ready.',
  },
  {
    step: '05',
    icon: '📣',
    title: 'Communicate & Run',
    desc: 'Send bulk email and SMS to volunteers. Run your event with a fully prepared, confirmed team at every station.',
  },
  {
    step: '06',
    icon: '✅',
    title: 'Close & Certificate',
    desc: 'Confirm volunteer hours after the event. Certificates auto-generate for every volunteer. Submit closure for final invoice.',
  },
];

// ── FEATURES ─────────────────────────────────
const FEATURES = [
  {
    icon: <Layers size={26} className="text-[#CCFF00]" />,
    title: '4-Level Sector System',
    desc: 'Structure your volunteer force into Sectors → Sub-sectors → Tasks → Assignments. Full structured model adapted for India.',
  },
  {
    icon: <Zap size={26} className="text-[#CCFF00]" />,
    title: 'MQ Matching Engine',
    desc: 'Matching Quota (MQ) scores rank volunteers 0–100% per assignment based on skills, availability, preferences, and experience.',
  },
  {
    icon: <Users size={26} className="text-[#CCFF00]" />,
    title: 'Group Registration',
    desc: 'Create club/NGO groups with unique registration links. Manage fictitious placeholders until all real members confirm.',
  },
  {
    icon: <MessageSquare size={26} className="text-[#CCFF00]" />,
    title: 'Bulk Communication',
    desc: 'Email and SMS all volunteers, specific sectors, or individual people. Pre-built templates for common messages.',
  },
  {
    icon: <Calendar size={26} className="text-[#CCFF00]" />,
    title: '10-Step Event Wizard',
    desc: 'Create a complete event in one guided flow: info, dates, media, registration, requirements, sectors, tasks, groups, comms, publish.',
  },
  {
    icon: <BarChart3 size={26} className="text-[#CCFF00]" />,
    title: 'Real-Time Dashboard',
    desc: 'Monitor registrations, allocations, confirmations, and hours across all your events from one central organiser hub.',
  },
  {
    icon: <Shield size={26} className="text-[#CCFF00]" />,
    title: 'Auto Certificates',
    desc: 'Hour confirmation triggers automatic PDF certificate generation for every volunteer. No manual work required.',
  },
  {
    icon: <CheckCircle size={26} className="text-[#CCFF00]" />,
    title: 'Multi-Role Access',
    desc: 'EO Admin → Event Admin → Sector Admin → Group Manager. Delegate event management without losing oversight.',
  },
];

// ── ORGANISER ROLES ───────────────────────────
const ORG_ROLES = [
  {
    role: 'EO Administrator',
    icon: '👑',
    color: '#FFD700',
    border: 'rgba(255,215,0,0.3)',
    bg:    'rgba(255,215,0,0.08)',
    desc:  'Full rights for the entire event organisation. Creates events, assigns all sub-roles. One per organisation.',
    can:   ['Create & delete events', 'Assign Event Admins', 'View all billing', 'Manage org settings'],
  },
  {
    role: 'Event Administrator',
    icon: '🗂️',
    color: '#CCFF00',
    border:'rgba(204,255,0,0.3)',
    bg:    'rgba(204,255,0,0.08)',
    desc:  'Manages a single event. No access to other events or org settings. Assigned by EO Admin.',
    can:   ['Manage event details', 'Handle registrations', 'Run allocation tool', 'Send bulk messages'],
  },
  {
    role: 'Sector Administrator',
    icon: '📍',
    color: '#C4B5FD',
    border:'rgba(196,181,253,0.3)',
    bg:    'rgba(196,181,253,0.08)',
    desc:  'Manages one sector and its tasks/assignments. Optional role for large events with complex structures.',
    can:   ['Manage one sector', 'View sector volunteers', 'Upload sector PDFs', 'Message sector team'],
  },
  {
    role: 'Group Manager',
    icon: '👥',
    color: '#6EE07A',
    border:'rgba(110,224,122,0.3)',
    bg:    'rgba(110,224,122,0.08)',
    desc:  'Contact person for a club/NGO group. Can add/remove volunteers from their group within the event.',
    can:   ['Manage group members', 'Share group reg link', 'Confirm group registration', 'View group assignments'],
  },
];

// ── PRICING ───────────────────────────────────
const PRICING_FEATURES = [
  'Unlimited event creation',
  'Sector/Task/Assignment system (4-level)',
  'Smart MQ allocation tool',
  'Bulk email communication',
  'Auto certificate generation',
  'Group registration management',
  'Real-time volunteer dashboard',
  'Communication measures (up to 70% discount)',
  'NGO pricing available',
  'Repeat event discounts',
];

// ═════════════════════════════════════════════
//  FOR ORGANISERS PAGE
// ═════════════════════════════════════════════
export default function ForOrganisersPage() {
  return (
    <div className="bg-[#0C0C0C] overflow-x-hidden">
      <OrgHero />
      <HowItWorksSection />
      <FeaturesSection />
      <OrgRolesSection />
      <SectorSystemSection />
      <PricingSection />
      <OrgCTASection />
    </div>
  );
}

// ─────────────────────────────────────────────
//  HERO
// ─────────────────────────────────────────────
function OrgHero() {
  return (
    <section className="relative pt-10 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0C0C0C] via-[#141414] to-[#0C0C0C]" />
      <div className="absolute inset-0 grid-overlay opacity-40" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#222200]/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label">For Event Organisers</span>
            <h1
              className="heading-gradient font-display font-black text-[#F2F2F2] uppercase leading-none mb-6"
              style={{ fontSize: 'clamp(44px, 7vw, 88px)' }}
            >
              Run Your Event{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] to-[#BBEE00]">
                With Pruthwee
              </span>
            </h1>
            <p className="font-sans text-[#888888] text-lg leading-relaxed mb-8 max-w-md">
              India's most complete volunteer management platform for NGOs, corporates,
              and government bodies. From registration to certificates — fully automated.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={openRegisterModal} className="btn-primary text-base px-8 py-4">
                Create Your Event <ArrowRight size={16} />
              </button>
              <Link to="/contact" className="btn-outline text-base px-8 py-4">
                Talk to Us
              </Link>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 mt-10">
              {[
                { num: '320+',  label: 'Events Hosted' },
                { num: '12K+',  label: 'Volunteers' },
                { num: '48',    label: 'Cities' },
              ].map((s) => (
                <div key={s.label} className="text-center bg-[rgba(20,20,20,0.4)] border border-[rgba(255,255,255,0.07)] rounded-xl py-4">
                  <div className="font-display font-black text-[#CCFF00] text-2xl leading-none">{s.num}</div>
                  <div className="font-display font-bold text-[#CCFF00] text-[10px] uppercase tracking-[2px] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — feature highlights */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-3"
          >
            {[
              { icon: '🗂️', text: '4-Level Sector / Task / Assignment system' },
              { icon: '🎯', text: 'MQ Matching Quota — intelligent volunteer-shift pairing' },
              { icon: '📣', text: 'Bulk email + SMS to all or filtered volunteers' },
              { icon: '📜', text: 'Auto-PDF certificates after hour confirmation' },
              { icon: '👥', text: 'Club & NGO group registration management' },
              { icon: '🔐', text: 'Multi-role access: EO Admin → Group Manager' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-4 bg-[rgba(20,20,20,0.4)] border border-[rgba(255,255,255,0.07)] rounded-xl px-4 py-3 hover:border-[rgba(255,255,255,0.15)] transition-colors"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-display font-bold text-[#F2F2F2] text-base uppercase tracking-wide">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  HOW IT WORKS
// ─────────────────────────────────────────────
function HowItWorksSection() {
  const { ref, inView } = useScrollReveal();

  return (
    <section className="py-20 md:py-28 bg-[#141414]">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="section-label">The Organiser Journey</span>
            <h2
              className="heading-gradient font-display font-black text-[#F2F2F2] uppercase leading-none"
              style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
            >
              6 Steps to a{' '}
              <span className="text-[#CCFF00]">Successful Event</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                variants={fadeUp}
                className="relative bg-[rgba(12,12,12,0.5)] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 hover:border-[rgba(255,255,255,0.15)] transition-all duration-200 group"
              >
                {/* Step number */}
                <div className="absolute top-4 right-4 font-display font-black text-[rgba(204,255,0,0.15)] text-5xl leading-none">
                  {step.step}
                </div>

                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="heading-gradient font-display font-black text-[#F2F2F2] text-lg uppercase tracking-wide mb-2 group-hover:text-[#CCFF00] transition-colors">
                  {step.title}
                </h3>
                <p className="font-sans text-[#888888] text-sm leading-relaxed">
                  {step.desc}
                </p>
                <div className="mt-4 h-0.5 bg-gradient-to-r from-[#CCFF00] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  FEATURES
// ─────────────────────────────────────────────
function FeaturesSection() {
  const { ref, inView } = useScrollReveal();

  return (
    <section className="py-20 md:py-28 bg-[#0C0C0C]">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={fadeUp} className="text-center mb-14">
            <span className="section-label">Platform Capabilities</span>
            <h2
              className="heading-gradient font-display font-black text-[#F2F2F2] uppercase leading-none"
              style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
            >
              Everything You{' '}
              <span className="text-[#CCFF00]">Need</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-[rgba(20,20,20,0.4)] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5 hover:border-[rgba(204,255,0,0.35)] transition-all duration-200 group"
              >
                <div className="w-11 h-11 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center mb-4 group-hover:bg-[rgba(255,255,255,0.08)] transition-colors">
                  {f.icon}
                </div>
                <h3 className="heading-gradient font-display font-black text-[#F2F2F2] text-base uppercase tracking-wide mb-2 group-hover:text-[#CCFF00] transition-colors">
                  {f.title}
                </h3>
                <p className="font-sans text-[#888888] text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  ORGANISER ROLES
// ─────────────────────────────────────────────
function OrgRolesSection() {
  const { ref, inView } = useScrollReveal();
  const [active, setActive] = useState(0);

  return (
    <section className="py-20 md:py-28 bg-[#141414]">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={fadeUp} className="text-center mb-14">
            <span className="section-label">Multi-Level Access</span>
            <h2
              className="heading-gradient font-display font-black text-[#F2F2F2] uppercase leading-none mb-4"
              style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
            >
              4 Organiser{' '}
              <span className="text-[#CCFF00]">Roles</span>
            </h2>
            <p className="font-sans text-[#888888] max-w-xl mx-auto text-base">
              Delegate without losing control. Each role has precisely scoped permissions.
            </p>
          </motion.div>

          {/* Role tab selector */}
          <motion.div variants={fadeUp} className="flex gap-3 overflow-x-auto pb-4 mb-8 justify-start md:justify-center">
            {ORG_ROLES.map((role, i) => (
              <button
                key={role.role}
                onClick={() => setActive(i)}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 font-display font-bold text-sm uppercase tracking-wide"
                style={{
                  borderColor: active === i ? role.color : 'rgba(204,255,0,0.15)',
                  background:  active === i ? role.bg : 'rgba(12,12,12,0.4)',
                  color:       active === i ? role.color : '#888888',
                }}
              >
                <span>{role.icon}</span>
                {role.role}
              </button>
            ))}
          </motion.div>

          {/* Active role detail */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div
              className="bg-[rgba(12,12,12,0.6)] border-2 rounded-2xl p-8"
              style={{ borderColor: ORG_ROLES[active].border }}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{ORG_ROLES[active].icon}</span>
                <div>
                  <h3
                    className="font-display font-black text-2xl uppercase tracking-wider"
                    style={{ color: ORG_ROLES[active].color }}
                  >
                    {ORG_ROLES[active].role}
                  </h3>
                </div>
              </div>
              <p className="font-sans text-[#888888] text-sm leading-relaxed mb-6">
                {ORG_ROLES[active].desc}
              </p>
              <div>
                <p className="font-display font-bold text-[#CCFF00] text-xs uppercase tracking-[2px] mb-3">
                  Can Do
                </p>
                <ul className="grid grid-cols-2 gap-2">
                  {ORG_ROLES[active].can.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle size={14} style={{ color: ORG_ROLES[active].color }} className="flex-shrink-0" />
                      <span className="font-sans text-[#888888] text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  SECTOR SYSTEM EXPLAINER
// ─────────────────────────────────────────────
function SectorSystemSection() {
  const { ref, inView } = useScrollReveal();

  const levels = [
    { level: 'L1', name: 'Sector',      example: 'Food & Drinks',       color: '#CCFF00', desc: 'Top-level department. E.g. Security, Catering, Stage Crew.' },
    { level: 'L2', name: 'Sub-Sector',  example: 'Gate A / Gate B',     color: '#CCFF00', desc: 'Optional sub-group. E.g. North Zone, VIP Area.' },
    { level: 'L3', name: 'Task',        example: 'Entrance Control',     color: '#1A1A1A', desc: 'Specific activity with skill requirements and PDF briefing.' },
    { level: 'L4', name: 'Assignment',  example: 'Mon 08:30–11:30 · 4 volunteers', color: '#141414', desc: 'Actual shift with date, time, location, and volunteer count.' },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#0C0C0C]">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-label">Structured Volunteer Model</span>
              <h2
                className="heading-gradient font-display font-black text-[#F2F2F2] uppercase leading-none mb-6"
                style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
              >
                4-Level Sector{' '}
                <span className="text-[#CCFF00]">Hierarchy</span>
              </h2>
              <p className="font-sans text-[#888888] text-base leading-relaxed mb-6">
                This system gives you complete control over how volunteers are organised,
                deployed, and scheduled at every level of your event.
              </p>
              <p className="font-sans text-[#888888] text-base leading-relaxed">
                Two assignment types: <span className="text-[#CCFF00] font-semibold">Registration</span> (inquiry, shown on registration form)
                and <span className="text-[#CCFF00] font-semibold">Allocation</span> (actual shift, only visible after organiser activates).
              </p>
            </div>

            {/* Visual hierarchy */}
            <motion.div variants={fadeUp} className="space-y-3">
              {levels.map((lv, i) => (
                <div
                  key={lv.level}
                  className="flex items-center gap-4 rounded-xl p-4 border border-[rgba(255,255,255,0.07)]"
                  style={{
                    marginLeft: `${i * 16}px`,
                    background: `${lv.color}10`,
                    borderLeftColor: lv.color,
                    borderLeftWidth: '3px',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-display font-black text-sm"
                    style={{ background: `${lv.color}20`, color: lv.color }}
                  >
                    {lv.level}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="heading-gradient font-display font-black text-[#F2F2F2] text-sm uppercase tracking-wide">
                      {lv.name}
                    </div>
                    <div className="font-mono text-[10px] mt-0.5 truncate" style={{ color: lv.color }}>
                      e.g. {lv.example}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  PRICING
// ─────────────────────────────────────────────
function PricingSection() {
  const { ref, inView } = useScrollReveal();

  return (
    <section className="py-20 md:py-28 bg-[#141414]">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={fadeUp} className="text-center mb-14">
            <span className="section-label">Transparent Pricing</span>
            <h2
              className="heading-gradient font-display font-black text-[#F2F2F2] uppercase leading-none mb-4"
              style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
            >
              Simple &{' '}
              <span className="text-[#CCFF00]">Fair Pricing</span>
            </h2>
            <p className="font-sans text-[#888888] max-w-xl mx-auto">
              Base platform fee + per-volunteer variable cost. NGO discounts available.
              Communication measures can reduce your invoice by up to 70%.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Pricing card */}
            <motion.div
              variants={fadeUp}
              className="bg-[rgba(12,12,12,0.6)] border border-[rgba(255,255,255,0.12)] rounded-2xl p-8"
            >
              <div className="font-mono text-[#CCFF00] text-xs tracking-[2px] uppercase mb-2">Standard</div>
              <div className="heading-gradient font-display font-black text-[#F2F2F2] text-4xl uppercase mb-1">
                Base Fee +
              </div>
              <div className="font-display font-black text-[#CCFF00] text-2xl uppercase mb-6">
                Per Volunteer Cost
              </div>
              <p className="font-sans text-[#888888] text-sm mb-6">
                Final invoice calculated after event closure based on confirmed volunteer count
                and completed communication measures.
              </p>
              <button onClick={openRegisterModal} className="btn-primary w-full justify-center">
                Get Exact Quote <ArrowRight size={15} />
              </button>
            </motion.div>

            {/* Features included */}
            <motion.div
              variants={fadeUp}
              className="bg-[rgba(12,12,12,0.4)] border border-[rgba(255,255,255,0.07)] rounded-2xl p-8"
            >
              <div className="font-display font-black text-[#CCFF00] text-sm uppercase tracking-[2px] mb-5">
                All Plans Include
              </div>
              <ul className="space-y-3">
                {PRICING_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <CheckCircle size={15} className="text-[#CCFF00] flex-shrink-0" />
                    <span className="font-sans text-[#888888] text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Communication measures note */}
          <motion.div
            variants={fadeUp}
            className="mt-8 max-w-4xl mx-auto bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-xl p-5 flex items-start gap-4"
          >
            <span className="text-2xl flex-shrink-0">💡</span>
            <div>
              <p className="font-display font-black text-[#CCFF00] text-sm uppercase tracking-wide mb-1">
                Communication Measures Discount
              </p>
              <p className="font-sans text-[#888888] text-sm leading-relaxed">
                Complete promotional activities (social media posts, email blasts, banners, press releases)
                during your event and earn points that reduce your final invoice by up to 70%.
                Upload proof of each measure after the event.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  FINAL CTA
// ─────────────────────────────────────────────
function OrgCTASection() {
  return (
    <section className="py-20 bg-[#0C0C0C] border-t border-[rgba(255,255,255,0.07)]">
      <div className="max-w-3xl mx-auto px-5 md:px-10 text-center">
        <span className="section-label">Get Started</span>
        <h2
          className="heading-gradient font-display font-black text-[#F2F2F2] uppercase leading-none mb-4"
          style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
        >
          Ready to Build{' '}
          <span className="text-[#CCFF00]">Your Event?</span>
        </h2>
        <p className="font-sans text-[#888888] text-base mb-8">
          Join 320+ events already managed on Pruthwe volunteers.
          Register your organisation today — it's free to get started.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={openRegisterModal} className="btn-primary text-base px-10 py-4">
            Register Your Organisation <ArrowRight size={16} />
          </button>
          <Link to="/contact" className="btn-outline text-base px-8 py-4">
            Talk to Our Team
          </Link>
        </div>

        {/* Trusted by */}
        <div className="mt-12">
          <p className="font-mono text-[#CCFF00] text-[10px] tracking-[3px] uppercase mb-4">
            Backed by
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {['MoEF', 'NITI Aayog', 'NYK', 'MSJE', 'CSR India'].map((p) => (
              <span key={p} className="font-display font-bold text-[#888888] text-sm uppercase tracking-wider hover:text-[#CCFF00] transition-colors cursor-default">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}