import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { ArrowRight, ChevronDown, CheckCircle, Shield, Award, Globe, Users, Star } from 'lucide-react';
import { openRegisterModal } from '../components/layout/Navbar';
import { STATUS_TIERS, CAUSES, VOLUNTEER_SKILLS } from '../constants';

// ── SCROLL REVEAL ────────────────────────────
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

// ── FAQ DATA ─────────────────────────────────
const FAQ = [
  {
    q: 'Am I obliged to help once I register for an event?',
    a: 'No. Registering expresses your interest. You only become committed once you receive and confirm your specific assignment. You can withdraw before confirmation.',
  },
  {
    q: 'Will I get board and lodging during multi-day events?',
    a: 'This depends on the event organiser. Some events include meals and accommodation, others don\'t. Check the event details page or contact the organiser directly.',
  },
  {
    q: 'Can organisers contact me directly outside the platform?',
    a: 'Only if you choose to make your profile public. You control exactly which organisers can see your contact details through your privacy settings.',
  },
  {
    q: 'How are my volunteer hours calculated?',
    a: 'Hours are calculated from your actual shift assignment times. After the event, the organiser confirms your hours and a certificate is automatically generated.',
  },
  {
    q: 'Can I register as a group or with my club / NGO?',
    a: 'Yes! Organisers can create group registration links. Ask your club manager for the group link and register together as a team.',
  },
  {
    q: 'How is my status tier (Bronze, Silver, Gold etc.) calculated?',
    a: 'Your tier is based on total verified hours across all Pruthwee events. Hours are confirmed by organisers — not self-reported. The system updates automatically.',
  },
  {
    q: 'Is my personal data shared with third parties?',
    a: 'Never. Your data is only shared with the organisers of events you register for — and only if you have enabled profile visibility in your settings.',
  },
  {
    q: 'Can I volunteer in a city different from where I live?',
    a: 'Absolutely. You can register for events in any of the 48+ cities we cover. Many volunteers travel for flagship events like the Pruthwee Summit.',
  },
];

// ── HOW IT WORKS ─────────────────────────────
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Create Your Profile',
    desc: 'Register free in under 2 minutes. Add your skills, causes you care about, city, and availability. Your profile is your volunteer identity on the platform.',
    icon: '👤',
  },
  {
    step: '02',
    title: 'Find & Register',
    desc: 'Browse events by city, cause, and date. Register with your availability and sector preferences. Add any special comments for the organiser.',
    icon: '🔍',
  },
  {
    step: '03',
    title: 'Confirm Assignment',
    desc: 'The organiser reviews registrations and allocates you to a specific shift. You get notified and confirm with one click from your dashboard.',
    icon: '✅',
  },
  {
    step: '04',
    title: 'Attend & Earn',
    desc: 'Show up, serve your community, and make an impact. After the event, your hours are confirmed and your certificate is automatically generated.',
    icon: '🏅',
  },
];

// ── BENEFITS ─────────────────────────────────
const BENEFITS = [
  {
    icon: <Award size={28} className="text-[#54ACBF]" />,
    title: 'Official Certificates',
    desc: 'PDF certificates for every event. Downloadable and shareable on LinkedIn, WhatsApp, and your portfolio.',
  },
  {
    icon: <Globe size={28} className="text-[#54ACBF]" />,
    title: 'National Network',
    desc: 'Connect with 12,000+ volunteers across 48 Indian cities. Build friendships that last beyond events.',
  },
  {
    icon: <Star size={28} className="text-[#54ACBF]" />,
    title: 'Status & Rewards',
    desc: 'Climb from Volunteer to Diamond tier. Unlock merch, press features, summit invitations, and Advisory Board seats.',
  },
  {
    icon: <Shield size={28} className="text-[#54ACBF]" />,
    title: 'Govt. Recognition',
    desc: 'Pruthwee is backed by MoEF, NITI Aayog, NYK and MSJE. Your work is nationally recognised.',
  },
  {
    icon: <Users size={28} className="text-[#54ACBF]" />,
    title: 'Mission Plans',
    desc: 'Clear deployment instructions and assignment schedules before every event — no guesswork on the day.',
  },
  {
    icon: <CheckCircle size={28} className="text-[#54ACBF]" />,
    title: 'Privacy Control',
    desc: 'You choose which organisers see your data. Your profile, your rules. Delete your account anytime.',
  },
];

// ═════════════════════════════════════════════
//  FOR VOLUNTEERS PAGE
// ═════════════════════════════════════════════
export default function ForVolunteersPage() {
  return (
    <div className="bg-[#011C40] overflow-x-hidden">

      {/* Hero */}
      <VolunteerHero />

      {/* Benefits */}
      <BenefitsSection />

      {/* How it works */}
      <HowItWorksSection />

      {/* Status Tier System */}
      <TierSystemSection />

      {/* Skills & Causes */}
      <SkillsCausesSection />

      {/* FAQ */}
      <FAQSection />

      {/* Data Privacy */}
      <PrivacySection />

      {/* Newsletter CTA */}
      <VolunteerCTASection />

    </div>
  );
}

// ─────────────────────────────────────────────
//  HERO
// ─────────────────────────────────────────────
function VolunteerHero() {
  return (
    <section className="relative pt-10 pb-24 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#011C40] via-[#023859] to-[#011C40]" />
      <div className="absolute inset-0 grid-overlay opacity-40" />
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#54ACBF]/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label">For Volunteers</span>
            <h1
              className="font-display font-black text-[#F0FAFB] uppercase leading-none mb-6"
              style={{ fontSize: 'clamp(44px, 7vw, 88px)' }}
            >
              Become a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#54ACBF] to-[#A7EBF2]">
                Pruthwee
              </span>{' '}
              Volunteer
            </h1>
            <p className="font-sans text-[#8BBFCC] text-lg leading-relaxed mb-8 max-w-md">
              Join thousands of changemakers serving India's communities and environment.
              Free registration. Official certificates. Real impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={openRegisterModal} className="btn-primary text-base px-8 py-4">
                Register Free <ArrowRight size={16} />
              </button>
              <Link to="/events" className="btn-outline text-base px-8 py-4">
                Browse Events
              </Link>
            </div>

            {/* Trust line */}
            <div className="flex items-center gap-2 mt-8">
              <div className="flex -space-x-2">
                {['P', 'A', 'K', 'S', 'M'].map((l, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[#54ACBF] to-[#26658C] border-2 border-[#011C40] flex items-center justify-center"
                  >
                    <span className="font-display font-black text-[#011C40] text-xs">{l}</span>
                  </div>
                ))}
              </div>
              <p className="font-sans text-[#8BBFCC] text-sm">
                <span className="text-[#A7EBF2] font-semibold">12,000+</span> volunteers already registered
              </p>
            </div>
          </motion.div>

          {/* Right — tier preview cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Stacked tier cards */}
            <div className="space-y-3">
              {STATUS_TIERS.slice(1, 5).map((tier, i) => (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-4 bg-[rgba(2,56,89,0.5)] border rounded-xl px-5 py-4"
                  style={{ borderColor: tier.borderColor }}
                >
                  <span className="text-3xl">{tier.icon}</span>
                  <div className="flex-1">
                    <div className="font-display font-black text-sm uppercase tracking-wider" style={{ color: tier.color }}>
                      {tier.label}
                    </div>
                    <div className="font-sans text-[#8BBFCC] text-xs">{tier.perks[0]}</div>
                  </div>
                  <div className="font-display font-black text-[#54ACBF] text-sm">
                    {tier.hoursMin}h+
                  </div>
                </motion.div>
              ))}
              {/* More indicator */}
              <div className="text-center">
                <span className="font-mono text-[#54ACBF] text-xs tracking-[2px]">+ 3 MORE TIERS ↓</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  BENEFITS
// ─────────────────────────────────────────────
function BenefitsSection() {
  const { ref, inView } = useScrollReveal();

  return (
    <section className="py-20 md:py-28 bg-[#023859]">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={fadeUp} className="text-center mb-14">
            <span className="section-label">What You Get</span>
            <h2
              className="font-display font-black text-[#F0FAFB] uppercase leading-none"
              style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
            >
              Benefits of{' '}
              <span className="text-[#54ACBF]">Volunteering</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b) => (
              <motion.div
                key={b.title}
                variants={fadeUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-[rgba(1,28,64,0.5)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-6 hover:border-[rgba(84,172,191,0.35)] transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[rgba(84,172,191,0.1)] border border-[rgba(84,172,191,0.2)] flex items-center justify-center mb-4 group-hover:bg-[rgba(84,172,191,0.15)] transition-colors">
                  {b.icon}
                </div>
                <h3 className="font-display font-black text-[#F0FAFB] text-lg uppercase tracking-wide mb-2 group-hover:text-[#A7EBF2] transition-colors">
                  {b.title}
                </h3>
                <p className="font-sans text-[#8BBFCC] text-sm leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
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
    <section className="py-20 md:py-28 bg-[#011C40]">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="section-label">The Process</span>
            <h2
              className="font-display font-black text-[#F0FAFB] uppercase leading-none"
              style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
            >
              How It{' '}
              <span className="text-[#54ACBF]">Works</span>
            </h2>
          </motion.div>

          {/* Steps */}
          <div className="grid md:grid-cols-4 gap-6 md:gap-4 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-transparent via-[rgba(84,172,191,0.3)] to-transparent" />

            {HOW_IT_WORKS.map((step, i) => (
              <motion.div key={step.step} variants={fadeUp} className="relative text-center group">
                {/* Step circle */}
                <div className="relative w-20 h-20 mx-auto mb-5">
                  <div className="w-full h-full rounded-full bg-[rgba(2,56,89,0.8)] border-2 border-[rgba(84,172,191,0.25)] flex items-center justify-center group-hover:border-[#54ACBF] transition-all duration-200">
                    <span className="text-3xl">{step.icon}</span>
                  </div>
                  {/* Step number badge */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#54ACBF] flex items-center justify-center">
                    <span className="font-display font-black text-[#011C40] text-xs">{i + 1}</span>
                  </div>
                </div>

                <div className="font-mono text-[#54ACBF] text-[10px] tracking-[3px] uppercase mb-2">
                  Step {step.step}
                </div>
                <h3 className="font-display font-black text-[#F0FAFB] text-lg uppercase tracking-wide mb-3 group-hover:text-[#A7EBF2] transition-colors">
                  {step.title}
                </h3>
                <p className="font-sans text-[#8BBFCC] text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="text-center mt-14">
            <button onClick={openRegisterModal} className="btn-primary text-base px-10 py-4">
              Start Your Journey <ArrowRight size={16} />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  TIER SYSTEM
// ─────────────────────────────────────────────
function TierSystemSection() {
  const { ref, inView } = useScrollReveal();
  const [active, setActive] = useState<(typeof STATUS_TIERS)[number]['id']>(STATUS_TIERS[0].id);
  const activeTier = STATUS_TIERS.find(t => t.id === active) ?? STATUS_TIERS[0];

  return (
    <section className="py-20 md:py-28 bg-[#023859]">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={fadeUp} className="text-center mb-14">
            <span className="section-label">Volunteer Status System</span>
            <h2
              className="font-display font-black text-[#F0FAFB] uppercase leading-none mb-4"
              style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
            >
              Your Journey to{' '}
              <span className="text-[#54ACBF]">Diamond</span>
            </h2>
            <p className="font-sans text-[#8BBFCC] max-w-xl mx-auto text-base">
              Every hour you volunteer is tracked and verified. Click a tier to see what you unlock.
            </p>
          </motion.div>

          {/* Tier selector — horizontal scroll */}
          <motion.div variants={fadeUp} className="flex gap-3 overflow-x-auto pb-4 mb-8 justify-start md:justify-center">
            {STATUS_TIERS.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setActive(tier.id)}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border transition-all duration-200"
                style={{
                  borderColor: active === tier.id ? tier.color : 'rgba(84,172,191,0.12)',
                  background:  active === tier.id ? `${tier.bgColor}` : 'rgba(1,28,64,0.4)',
                }}
              >
                <span className="text-2xl">{tier.icon}</span>
                <span
                  className="font-display font-black text-xs uppercase tracking-wider"
                  style={{ color: active === tier.id ? tier.color : '#8BBFCC' }}
                >
                  {tier.label}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Active tier detail */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto bg-[rgba(1,28,64,0.6)] border-2 rounded-2xl p-8"
            style={{ borderColor: activeTier.borderColor }}
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl">{activeTier.icon}</span>
              <div>
                <div
                  className="font-display font-black text-3xl uppercase tracking-wider"
                  style={{ color: activeTier.color }}
                >
                  {activeTier.label}
                </div>
                <div className="font-mono text-[#54ACBF] text-sm">
                  {activeTier.id === 'none'
                    ? 'Starting level'
                    : activeTier.hoursMax === Infinity
                    ? `${activeTier.hoursMin}+ hours`
                    : `${activeTier.hoursMin} – ${activeTier.hoursMax} hours`
                  }
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(
                      ((STATUS_TIERS.findIndex(t => t.id === active)) / (STATUS_TIERS.length - 1)) * 100,
                      100
                    )}%`
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-mono text-[#54ACBF] text-[10px]">0h</span>
                <span className="font-mono text-[#54ACBF] text-[10px]">1000h+</span>
              </div>
            </div>

            <div>
              <p className="font-display font-bold text-[#8BBFCC] text-xs uppercase tracking-[2px] mb-3">
                Perks & Benefits
              </p>
              <ul className="space-y-2">
                {activeTier.perks.map((perk, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: activeTier.bgColor, border: `1px solid ${activeTier.borderColor}` }}>
                      <span className="text-xs">✓</span>
                    </span>
                    <span className="font-sans text-[#F0FAFB] text-sm">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  SKILLS & CAUSES
// ─────────────────────────────────────────────
function SkillsCausesSection() {
  const { ref, inView } = useScrollReveal();

  return (
    <section className="py-20 bg-[#011C40]">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="section-label">Your Strengths</span>
            <h2
              className="font-display font-black text-[#F0FAFB] uppercase leading-none"
              style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
            >
              Skills & Causes{' '}
              <span className="text-[#54ACBF]">We Need</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Skills */}
            <motion.div variants={fadeUp}>
              <p className="font-display font-black text-[#A7EBF2] text-sm uppercase tracking-[3px] mb-4">
                Skills We Look For
              </p>
              <div className="flex flex-wrap gap-2">
                {VOLUNTEER_SKILLS.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-[rgba(2,56,89,0.6)] border border-[rgba(84,172,191,0.2)] rounded-lg font-sans text-[#8BBFCC] text-sm hover:border-[#54ACBF] hover:text-[#A7EBF2] transition-all duration-150 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Causes */}
            <motion.div variants={fadeUp}>
              <p className="font-display font-black text-[#A7EBF2] text-sm uppercase tracking-[3px] mb-4">
                Causes You Can Serve
              </p>
              <div className="flex flex-col gap-3">
                {CAUSES.map((cause) => (
                  <div
                    key={cause.id}
                    className="flex items-center gap-3 px-4 py-3 bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-xl hover:border-[rgba(84,172,191,0.35)] transition-all duration-150"
                  >
                    <span className="text-2xl">{cause.icon}</span>
                    <span className="font-display font-bold text-[#F0FAFB] text-base uppercase tracking-wide">
                      {cause.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  FAQ
// ─────────────────────────────────────────────
function FAQSection() {
  const { ref, inView } = useScrollReveal();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-28 bg-[#023859]">
      <div className="max-w-3xl mx-auto px-5 md:px-10">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="section-label">Got Questions?</span>
            <h2
              className="font-display font-black text-[#F0FAFB] uppercase leading-none"
              style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
            >
              Frequently Asked{' '}
              <span className="text-[#54ACBF]">Questions</span>
            </h2>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-3">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="bg-[rgba(1,28,64,0.5)] border border-[rgba(84,172,191,0.12)] rounded-xl overflow-hidden hover:border-[rgba(84,172,191,0.25)] transition-colors"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-display font-black text-[#F0FAFB] text-base uppercase tracking-wide leading-tight">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-[#54ACBF] flex-shrink-0 transition-transform duration-250 ${open === i ? 'rotate-180' : ''}`}
                  />
                </button>

                <motion.div
                  initial={false}
                  animate={{ height: open === i ? 'auto' : 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t border-[rgba(84,172,191,0.1)]">
                    <p className="font-sans text-[#8BBFCC] text-sm leading-relaxed pt-4">
                      {item.a}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  PRIVACY
// ─────────────────────────────────────────────
function PrivacySection() {
  const { ref, inView } = useScrollReveal();

  const points = [
    'Your data is only shared with organisers of events you register for',
    'You control which organisers can see your profile and contact info',
    'Data is stored securely and never sold to third parties',
    'You can delete your account and all associated data anytime',
    'Certificates and hours remain yours — even if you delete your account',
  ];

  return (
    <section className="py-20 bg-[#011C40]">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={fadeUp}>
            <span className="section-label">Your Data, Your Rules</span>
            <h2
              className="font-display font-black text-[#F0FAFB] uppercase leading-none mb-6"
              style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
            >
              Privacy &{' '}
              <span className="text-[#54ACBF]">Control</span>
            </h2>
            <ul className="space-y-3">
              {points.map((pt, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Shield size={16} className="text-[#54ACBF] flex-shrink-0 mt-0.5" />
                  <span className="font-sans text-[#8BBFCC] text-sm leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.15)] rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="font-display font-black text-[#F0FAFB] text-2xl uppercase tracking-wide mb-3">
                Data Never Sold
              </h3>
              <p className="font-sans text-[#8BBFCC] text-sm leading-relaxed mb-5">
                Pruthwe volunteers is a non-profit initiative. We have no business model
                based on selling your personal data. Your privacy is our commitment.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['GDPR Principles', 'End-to-End Control', 'Secure Storage', 'Delete Anytime'].map((tag) => (
                  <span key={tag} className="badge badge-teal">{tag}</span>
                ))}
              </div>
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
function VolunteerCTASection() {
  const [email, setEmail] = useState('');
  const [done, setDone]   = useState(false);

  return (
    <section className="py-20 bg-[#023859] border-t border-[rgba(84,172,191,0.12)]">
      <div className="max-w-3xl mx-auto px-5 md:px-10 text-center">
        <span className="section-label">Join the Movement</span>
        <h2
          className="font-display font-black text-[#F0FAFB] uppercase leading-none mb-4"
          style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
        >
          Your First Step{' '}
          <span className="text-[#54ACBF]">Starts Here</span>
        </h2>
        <p className="font-sans text-[#8BBFCC] text-base mb-8">
          Register free. Browse events. Confirm your assignment. Earn your certificate.
          That's all it takes.
        </p>
        <button onClick={openRegisterModal} className="btn-primary text-base px-10 py-4 mb-6">
          Create My Free Profile <ArrowRight size={16} />
        </button>

        <div className="divider my-8" />

        {/* Newsletter mini */}
        <p className="font-display font-bold text-[#A7EBF2] text-sm uppercase tracking-[2px] mb-4">
          Or Get New Events in Your Inbox First
        </p>
        {done ? (
          <div className="inline-flex items-center gap-2 text-[#6EE07A] font-display font-bold uppercase tracking-wider text-sm">
            ✓ Subscribed!
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}
            className="flex gap-2 max-w-sm mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="input flex-1"
            />
            <button type="submit" className="btn-primary px-4">
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}