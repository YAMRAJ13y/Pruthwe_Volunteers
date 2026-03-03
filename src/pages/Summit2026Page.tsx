import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, MapPin, Calendar, Users, Mic, ChevronDown, CheckCircle, ExternalLink } from 'lucide-react';
import { openRegisterModal } from '../components/layout/Navbar';
import { SUMMIT_DATE } from '../constants';

// ── SCROLL REVEAL ─────────────────────────────
function SR({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ── COUNTDOWN ─────────────────────────────────
function useCountdown(target: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  useEffect(() => {
    function tick() {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setTime({ days: 0, hours: 0, mins: 0, secs: 0 }); return; }
      setTime({
        days:  Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins:  Math.floor((diff % 3600000) / 60000),
        secs:  Math.floor((diff % 60000) / 1000),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

// ── DATA ──────────────────────────────────────
const PROGRAMME = {
  day1: [
    { time: '08:00', title: 'Volunteer Registration & Welcome Kit Distribution',  type: 'logistics',  venue: 'Main Entrance' },
    { time: '09:00', title: 'Opening Ceremony — Chief Guest Address',             type: 'keynote',    venue: 'Main Stage' },
    { time: '09:45', title: 'Keynote: The Future of Volunteering in India',       type: 'keynote',    venue: 'Main Stage' },
    { time: '10:30', title: 'Community Solutions Expo Opens',                     type: 'expo',       venue: 'Expo Hall A' },
    { time: '11:00', title: 'Panel: NGO + Corporate + Government Partnerships',   type: 'panel',      venue: 'Conference Room 1' },
    { time: '12:30', title: 'Networking Lunch',                                   type: 'break',      venue: 'Dining Hall' },
    { time: '14:00', title: 'Workshop: Volunteer Management Best Practices',      type: 'workshop',   venue: 'Room B' },
    { time: '14:00', title: 'Workshop: Building a Volunteer Culture in Your NGO', type: 'workshop',   venue: 'Room C' },
    { time: '15:30', title: 'Break & Expo Exploration',                           type: 'break',      venue: 'Expo Hall A' },
    { time: '16:00', title: 'Awards: Best Volunteer 2025 Announcement',           type: 'keynote',    venue: 'Main Stage' },
    { time: '17:00', title: 'Cultural Programme & Day 1 Close',                   type: 'break',      venue: 'Main Stage' },
  ],
  day2: [
    { time: '08:30', title: 'Morning Tea & Networking',                           type: 'break',      venue: 'Foyer' },
    { time: '09:00', title: 'Keynote: India\'s Environmental Volunteer Movement', type: 'keynote',    venue: 'Main Stage' },
    { time: '09:45', title: 'Panel: Women in Volunteering',                       type: 'panel',      venue: 'Main Stage' },
    { time: '10:30', title: 'Platform Demo: Pruthwee v3.0 Launch',                type: 'keynote',    venue: 'Main Stage' },
    { time: '11:15', title: 'Community Solutions Expo — Final Hours',             type: 'expo',       venue: 'Expo Hall A' },
    { time: '12:30', title: 'Closing Lunch',                                      type: 'break',      venue: 'Dining Hall' },
    { time: '14:00', title: 'Workshop: Digital Tools for Volunteer Coordinators', type: 'workshop',   venue: 'Room B' },
    { time: '14:00', title: 'Workshop: Grant Writing for Volunteer Programs',     type: 'workshop',   venue: 'Room C' },
    { time: '15:30', title: 'Volunteer Oath Ceremony',                            type: 'keynote',    venue: 'Main Stage' },
    { time: '16:00', title: 'Closing Address & Summit Declaration',               type: 'keynote',    venue: 'Main Stage' },
    { time: '16:45', title: 'Summit Concludes',                                   type: 'logistics',  venue: '' },
  ],
};

const SPEAKERS = [
  { name: 'Dr. Anjali Mehta',    title: 'Director, Environmental Policy',  org: 'NITI Aayog',       letter: 'A', color: '#A7EBF2' },
  { name: 'Rajesh Kumar IFS',    title: 'Additional Secretary',             org: 'Ministry of Environment', letter: 'R', color: '#54ACBF' },
  { name: 'Priya Vasavada',      title: 'CEO',                              org: 'CSR India Foundation',  letter: 'P', color: '#C4B5FD' },
  { name: 'Arjun Patel',         title: 'Founder',                          org: 'Paryavaran Trust',  letter: 'A', color: '#FCD34D' },
  { name: 'Dr. Sneha Sharma',    title: 'Programme Director',               org: 'National Youth Corps',  letter: 'S', color: '#6EE07A' },
  { name: 'Vikram Desai',        title: 'Head of Sustainability',           org: 'Adani Foundation',  letter: 'V', color: '#FCA5A5' },
];

const REGISTRATION_CATEGORIES = [
  {
    id:    'delegate',
    label: 'Delegate',
    price: '₹1,500',
    desc:  'NGO leaders, corporate CSR managers, government officials. Full access to all sessions, expo, and meals.',
    perks: ['All sessions access', 'Expo entry', 'Meals included', 'Summit kit'],
  },
  {
    id:    'volunteer',
    label: 'Volunteer',
    price: 'Free',
    desc:  'Registered Pruthwe volunteers. Apply to volunteer at the summit itself.',
    perks: ['Volunteer at summit', 'Certificate', 'Meals on duty', 'Pruthwee merch'],
    highlight: true,
  },
  {
    id:    'press',
    label: 'Press',
    price: 'Free',
    desc:  'Journalists and media professionals. Press pass with media room access.',
    perks: ['Press pass', 'Media room', 'Speaker interviews', 'Press kit'],
  },
  {
    id:    'student',
    label: 'Student',
    price: '₹500',
    desc:  'Full-time students with valid ID. Subsidised entry to all sessions.',
    perks: ['All sessions access', 'Networking lunch', 'Certificate', 'Student kit'],
  },
];

const SESSION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  keynote:  { bg: 'rgba(167,235,242,0.08)',  text: '#A7EBF2', border: 'rgba(167,235,242,0.25)' },
  panel:    { bg: 'rgba(84,172,191,0.08)',   text: '#54ACBF', border: 'rgba(84,172,191,0.25)'  },
  workshop: { bg: 'rgba(196,181,253,0.08)',  text: '#C4B5FD', border: 'rgba(196,181,253,0.25)' },
  expo:     { bg: 'rgba(255,215,0,0.06)',    text: '#FCD34D', border: 'rgba(255,215,0,0.2)'    },
  break:    { bg: 'rgba(110,224,122,0.06)',  text: '#6EE07A', border: 'rgba(110,224,122,0.15)' },
  logistics:{ bg: 'rgba(156,163,175,0.06)', text: '#9CA3AF', border: 'rgba(156,163,175,0.15)' },
};

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };

// ═════════════════════════════════════════════
//  SUMMIT 2026 PAGE
// ═════════════════════════════════════════════
export default function Summit2026Page() {
  const countdown = useCountdown(SUMMIT_DATE);
  const [activeDay, setActiveDay] = useState<'day1' | 'day2'>('day1');
  const [regCategory, setRegCategory] = useState('volunteer');

  return (
    <div className="bg-[#011C40] overflow-x-hidden">

      {/* ── HERO ── */}
      <SummitHero countdown={countdown} />

      {/* ── ABOUT SUMMIT ── */}
      <AboutSection />

      {/* ── PROGRAMME ── */}
      <ProgrammeSection activeDay={activeDay} setActiveDay={setActiveDay} />

      {/* ── SPEAKERS ── */}
      <SpeakersSection />

      {/* ── EXPO ── */}
      <ExpoSection />

      {/* ── VENUE ── */}
      <VenueSection />

      {/* ── REGISTRATION ── */}
      <RegistrationSection regCategory={regCategory} setRegCategory={setRegCategory} />

      {/* ── SPONSORS ── */}
      <SponsorsSection />

    </div>
  );
}

// ─────────────────────────────────────────────
//  HERO
// ─────────────────────────────────────────────
function SummitHero({ countdown }: { countdown: ReturnType<typeof useCountdown> }) {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#011C40]" />
      <div className="absolute inset-0 grid-overlay opacity-50" />

      {/* Radial glow blobs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#54ACBF]/6 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#26658C]/10 rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#A7EBF2]/5 rounded-full blur-3xl" />

      {/* Horizontal accent lines */}
      <div className="absolute left-0 right-0 top-1/3 h-px bg-gradient-to-r from-transparent via-[rgba(84,172,191,0.15)] to-transparent" />
      <div className="absolute left-0 right-0 bottom-1/3 h-px bg-gradient-to-r from-transparent via-[rgba(84,172,191,0.1)] to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-10 text-center">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[rgba(84,172,191,0.25)] bg-[rgba(84,172,191,0.06)] mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#6EE07A] animate-pulse" />
          <span className="font-mono text-[#A7EBF2] text-xs tracking-[2px] uppercase">
            Flagship Event · Registration Open
          </span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div
            className="font-display font-black text-[#54ACBF] uppercase tracking-[6px] mb-2"
            style={{ fontSize: 'clamp(14px, 2vw, 20px)' }}
          >
            Pruthwee Presents
          </div>
          <h1
            className="font-display font-black text-[#F0FAFB] uppercase leading-none"
            style={{ fontSize: 'clamp(52px, 11vw, 130px)' }}
          >
            Summit
          </h1>
          <h1
            className="font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#54ACBF] via-[#A7EBF2] to-[#54ACBF] uppercase leading-none -mt-2 md:-mt-4"
            style={{ fontSize: 'clamp(52px, 11vw, 130px)' }}
          >
            2026
          </h1>
        </motion.div>

        {/* Date + location */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 mt-6 mb-10"
        >
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-[#54ACBF]" />
            <span className="font-display font-black text-[#A7EBF2] text-lg uppercase tracking-widest">
              12–13 April 2026
            </span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#54ACBF] hidden sm:block" />
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-[#54ACBF]" />
            <span className="font-display font-black text-[#A7EBF2] text-lg uppercase tracking-widest">
              Gandhinagar, Gujarat
            </span>
          </div>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-2 md:gap-6 mb-10"
        >
          {[
            { v: countdown.days,  l: 'Days'  },
            { v: countdown.hours, l: 'Hours' },
            { v: countdown.mins,  l: 'Mins'  },
            { v: countdown.secs,  l: 'Secs'  },
          ].map(({ v, l }, i) => (
            <div key={l} className="flex items-center">
              {i > 0 && (
                <span className="font-display font-black text-[#26658C] text-4xl md:text-6xl mx-1 md:mx-3">:</span>
              )}
              <div className="text-center min-w-[60px] md:min-w-[90px]">
                <div
                  className="font-display font-black text-[#F0FAFB] leading-none tabular-nums"
                  style={{ fontSize: 'clamp(44px, 8vw, 90px)' }}
                >
                  {String(v).padStart(2, '0')}
                </div>
                <div className="font-display font-bold text-[#54ACBF] text-xs uppercase tracking-[3px] mt-1">
                  {l}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#register" className="btn-primary text-base px-10 py-4">
            Register for Summit <ArrowRight size={16} />
          </a>
          <a href="#programme" className="btn-outline text-base px-8 py-4">
            View Programme
          </a>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounceY"
      >
        <ChevronDown size={22} className="text-[#54ACBF]" />
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  ABOUT SUMMIT
// ─────────────────────────────────────────────
function AboutSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const facts = [
    { num: '500+', label: 'Attendees Expected' },
    { num: '2',    label: 'Action-Packed Days'  },
    { num: '12+',  label: 'Expert Speakers'     },
    { num: '20+',  label: 'NGO Exhibitors'      },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#023859] border-y border-[rgba(84,172,191,0.1)]">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={fadeUp}>
            <span className="section-label">About The Summit</span>
            <h2
              className="font-display font-black text-[#F0FAFB] uppercase leading-none mb-6"
              style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
            >
              India's Biggest{' '}
              <span className="text-[#54ACBF]">Volunteer Gathering</span>
            </h2>
            <p className="font-sans text-[#8BBFCC] text-base leading-relaxed mb-4">
              The Pruthwee Summit 2026 is a two-day national event bringing together volunteers,
              NGO leaders, corporate CSR teams, government officials, and social entrepreneurs
              to celebrate, connect, and chart the future of volunteering in India.
            </p>
            <p className="font-sans text-[#8BBFCC] text-base leading-relaxed mb-6">
              Featuring keynote addresses, panel discussions, hands-on workshops, the Community
              Solutions Expo, and the prestigious Pruthwee Volunteer Awards — this is the
              definitive gathering for everyone who believes in the power of community service.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Keynotes', 'Panels', 'Workshops', 'Awards', 'Expo', 'Networking'].map(tag => (
                <span key={tag} className="badge badge-teal">{tag}</span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={stagger} className="grid grid-cols-2 gap-4">
            {facts.map((f) => (
              <motion.div
                key={f.label}
                variants={fadeUp}
                className="bg-[rgba(1,28,64,0.5)] border border-[rgba(84,172,191,0.15)] rounded-2xl p-6 text-center hover:border-[rgba(84,172,191,0.35)] transition-all"
              >
                <div
                  className="font-display font-black text-[#A7EBF2] leading-none mb-2"
                  style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}
                >
                  {f.num}
                </div>
                <div className="font-display font-bold text-[#54ACBF] text-xs uppercase tracking-[2px]">
                  {f.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  PROGRAMME
// ─────────────────────────────────────────────
function ProgrammeSection({
  activeDay,
  setActiveDay,
}: {
  activeDay: 'day1' | 'day2';
  setActiveDay: (d: 'day1' | 'day2') => void;
}) {
  return (
    <section id="programme" className="py-20 md:py-28 bg-[#011C40]">
      <div className="max-w-4xl mx-auto px-5 md:px-10">
        <SR>
          <div className="text-center mb-12">
            <span className="section-label">Event Programme</span>
            <h2
              className="font-display font-black text-[#F0FAFB] uppercase leading-none"
              style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
            >
              2-Day{' '}
              <span className="text-[#54ACBF]">Schedule</span>
            </h2>
          </div>
        </SR>

        {/* Day tabs */}
        <SR delay={0.1}>
          <div className="flex gap-3 mb-8 justify-center">
            {(['day1', 'day2'] as const).map((d, i) => (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className={`px-6 py-3 rounded-xl border font-display font-black text-sm uppercase tracking-widest transition-all duration-200 ${
                  activeDay === d
                    ? 'bg-[rgba(84,172,191,0.15)] border-[#54ACBF] text-[#A7EBF2]'
                    : 'border-[rgba(84,172,191,0.15)] text-[#8BBFCC] hover:border-[#54ACBF]'
                }`}
              >
                Day {i + 1} — {i === 0 ? '12 April' : '13 April'}
              </button>
            ))}
          </div>
        </SR>

        {/* Session type legend */}
        <SR delay={0.15}>
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {Object.entries(SESSION_COLORS).filter(([k]) => k !== 'logistics').map(([type, style]) => (
              <span
                key={type}
                className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-[2px] border"
                style={{ background: style.bg, color: style.text, borderColor: style.border }}
              >
                {type}
              </span>
            ))}
          </div>
        </SR>

        {/* Programme list */}
        <motion.div
          key={activeDay}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {PROGRAMME[activeDay].map((session, i) => {
            const style = SESSION_COLORS[session.type];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 rounded-xl p-4 border transition-all hover:brightness-110"
                style={{ background: style.bg, borderColor: style.border }}
              >
                {/* Time */}
                <div className="w-14 flex-shrink-0 text-center">
                  <span className="font-display font-black text-sm uppercase tracking-wide" style={{ color: style.text }}>
                    {session.time}
                  </span>
                </div>

                {/* Divider */}
                <div className="w-px h-8 flex-shrink-0" style={{ background: style.border }} />

                {/* Content */}
                <div className="flex-1">
                  <div className="font-display font-black text-[#F0FAFB] text-sm uppercase tracking-wide leading-tight">
                    {session.title}
                  </div>
                  {session.venue && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={10} style={{ color: style.text }} />
                      <span className="font-mono text-[10px] tracking-wide" style={{ color: style.text }}>
                        {session.venue}
                      </span>
                    </div>
                  )}
                </div>

                {/* Type pill */}
                <span
                  className="flex-shrink-0 text-[9px] font-mono uppercase tracking-[2px] px-2 py-1 rounded-full border hidden sm:block"
                  style={{ color: style.text, borderColor: style.border }}
                >
                  {session.type}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  SPEAKERS
// ─────────────────────────────────────────────
function SpeakersSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

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
            <span className="section-label">Confirmed Speakers</span>
            <h2
              className="font-display font-black text-[#F0FAFB] uppercase leading-none"
              style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
            >
              Meet The{' '}
              <span className="text-[#54ACBF]">Speakers</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {SPEAKERS.map((speaker) => (
              <motion.div
                key={speaker.name}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-[rgba(1,28,64,0.5)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-6 flex items-center gap-5 hover:border-[rgba(84,172,191,0.35)] transition-all group cursor-default"
              >
                {/* Avatar */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 font-display font-black text-[#011C40] text-2xl"
                  style={{ background: `linear-gradient(135deg, ${speaker.color}, ${speaker.color}99)` }}
                >
                  {speaker.letter}
                </div>
                <div>
                  <div className="font-display font-black text-[#F0FAFB] text-base uppercase tracking-wide group-hover:text-[#A7EBF2] transition-colors">
                    {speaker.name}
                  </div>
                  <div className="font-sans text-[#8BBFCC] text-xs mt-0.5">{speaker.title}</div>
                  <div
                    className="font-mono text-[10px] uppercase tracking-[2px] mt-1"
                    style={{ color: speaker.color }}
                  >
                    {speaker.org}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="text-center mt-10">
            <p className="font-sans text-[#8BBFCC] text-sm">
              More speakers to be announced. Follow us on social for updates.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  EXPO
// ─────────────────────────────────────────────
function ExpoSection() {
  return (
    <section className="py-20 bg-[#011C40]">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SR>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-label">Summit Feature</span>
              <h2
                className="font-display font-black text-[#F0FAFB] uppercase leading-none mb-6"
                style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
              >
                Community Solutions{' '}
                <span className="text-[#54ACBF]">Expo</span>
              </h2>
              <p className="font-sans text-[#8BBFCC] text-base leading-relaxed mb-4">
                The Expo Hall hosts 20+ NGOs, social enterprises, and community initiatives
                showcasing their work and seeking volunteers, partners, and funding.
              </p>
              <p className="font-sans text-[#8BBFCC] text-base leading-relaxed mb-6">
                Walk through live demonstrations of environmental projects, meet the teams behind
                India's most impactful initiatives, and connect directly with organisations
                you can volunteer with.
              </p>
              <ul className="space-y-2">
                {[
                  'Live project demonstrations',
                  'Direct NGO networking',
                  'Volunteer recruitment booths',
                  'Fundraising and CSR matching',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 font-sans text-[#8BBFCC] text-sm">
                    <CheckCircle size={14} className="text-[#54ACBF] flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-5 aspect-square flex flex-col items-center justify-center text-center hover:border-[rgba(84,172,191,0.3)] transition-all">
                <div className="font-display font-black text-[#A7EBF2] text-5xl leading-none mb-2">20+</div>
                <div className="font-display font-bold text-[#54ACBF] text-xs uppercase tracking-[2px]">NGO Exhibitors</div>
              </div>
              <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-5 aspect-square flex flex-col items-center justify-center text-center hover:border-[rgba(84,172,191,0.3)] transition-all">
                <div className="font-display font-black text-[#A7EBF2] text-5xl leading-none mb-2">2</div>
                <div className="font-display font-bold text-[#54ACBF] text-xs uppercase tracking-[2px]">Full Days</div>
              </div>
              <div className="col-span-2 bg-[rgba(84,172,191,0.06)] border border-[rgba(84,172,191,0.15)] rounded-2xl p-5 text-center hover:border-[rgba(84,172,191,0.3)] transition-all">
                <div className="font-display font-black text-[#A7EBF2] text-3xl leading-none mb-1">Free Entry</div>
                <div className="font-sans text-[#8BBFCC] text-sm">Expo open to all summit attendees</div>
              </div>
            </div>
          </div>
        </SR>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  VENUE
// ─────────────────────────────────────────────
function VenueSection() {
  return (
    <section className="py-20 bg-[#023859] border-y border-[rgba(84,172,191,0.1)]">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SR>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-label">Venue & Travel</span>
              <h2
                className="font-display font-black text-[#F0FAFB] uppercase leading-none mb-6"
                style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
              >
                Mahatma Mandir{' '}
                <span className="text-[#54ACBF]">Gandhinagar</span>
              </h2>
              <p className="font-sans text-[#8BBFCC] text-base leading-relaxed mb-6">
                Gandhinagar's iconic Mahatma Mandir Convention Centre — Gujarat's premier
                event venue — is the home of Pruthwee Summit 2026. Just 30 minutes from
                Ahmedabad airport, easily accessible by rail and road.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { icon: <MapPin size={15} className="text-[#54ACBF]" />, text: 'Sector 13, Gandhinagar — 382016, Gujarat' },
                  { icon: <Calendar size={15} className="text-[#54ACBF]" />, text: '12–13 April 2026' },
                  { icon: <Users size={15} className="text-[#54ACBF]" />, text: 'Capacity: 2,000 · Summit expects 500+' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-sans text-[#8BBFCC] text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
              <a
                href="https://maps.google.com/?q=Mahatma+Mandir+Gandhinagar"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex"
              >
                Get Directions <ExternalLink size={14} />
              </a>
            </div>

            {/* Map placeholder */}
            <div className="bg-[rgba(1,28,64,0.5)] border border-[rgba(84,172,191,0.12)] rounded-2xl h-72 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={36} className="text-[#54ACBF] mx-auto mb-3" />
                <div className="font-display font-black text-[#F0FAFB] text-lg uppercase tracking-wide">
                  Mahatma Mandir
                </div>
                <div className="font-sans text-[#8BBFCC] text-sm mt-1">Gandhinagar, Gujarat</div>
                <a
                  href="https://maps.google.com/?q=Mahatma+Mandir+Gandhinagar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 btn-outline text-xs py-2 px-4"
                >
                  View on Maps
                </a>
              </div>
            </div>
          </div>
        </SR>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  REGISTRATION
// ─────────────────────────────────────────────
function RegistrationSection({
  regCategory,
  setRegCategory,
}: {
  regCategory: string;
  setRegCategory: (c: string) => void;
}) {
  const activeCat = REGISTRATION_CATEGORIES.find(c => c.id === regCategory)!;
  const [form, setForm] = useState({ name: '', email: '', phone: '', org: '', dietary: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.name && form.email && form.phone) setSubmitted(true);
  }

  return (
    <section id="register" className="py-20 md:py-28 bg-[#011C40]">
      <div className="max-w-4xl mx-auto px-5 md:px-10">
        <SR>
          <div className="text-center mb-12">
            <span className="section-label">Secure Your Spot</span>
            <h2
              className="font-display font-black text-[#F0FAFB] uppercase leading-none"
              style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
            >
              Register for{' '}
              <span className="text-[#54ACBF]">Summit 2026</span>
            </h2>
          </div>
        </SR>

        {/* Category selector */}
        <SR delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {REGISTRATION_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setRegCategory(cat.id)}
                className={`rounded-xl p-4 border text-center transition-all duration-200 ${
                  regCategory === cat.id
                    ? 'bg-[rgba(84,172,191,0.12)] border-[#54ACBF]'
                    : 'border-[rgba(84,172,191,0.12)] hover:border-[rgba(84,172,191,0.35)]'
                } ${cat.highlight ? 'ring-1 ring-[#54ACBF]' : ''}`}
              >
                <div className={`font-display font-black text-lg uppercase tracking-wide ${regCategory === cat.id ? 'text-[#A7EBF2]' : 'text-[#F0FAFB]'}`}>
                  {cat.label}
                </div>
                <div className={`font-display font-black text-sm mt-1 ${regCategory === cat.id ? 'text-[#54ACBF]' : 'text-[#8BBFCC]'}`}>
                  {cat.price}
                </div>
                {cat.highlight && (
                  <div className="font-mono text-[#6EE07A] text-[9px] uppercase tracking-[2px] mt-1">Popular</div>
                )}
              </button>
            ))}
          </div>
        </SR>

        {/* Active category perks */}
        <SR delay={0.15}>
          <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-xl p-4 mb-8">
            <p className="font-sans text-[#8BBFCC] text-sm mb-3">{activeCat.desc}</p>
            <div className="flex flex-wrap gap-2">
              {activeCat.perks.map(p => (
                <span key={p} className="flex items-center gap-1 badge badge-teal text-[10px]">
                  <CheckCircle size={10} /> {p}
                </span>
              ))}
            </div>
          </div>
        </SR>

        {/* Form */}
        {submitted ? (
          <SR>
            <div className="text-center bg-[rgba(110,224,122,0.06)] border border-[rgba(110,224,122,0.25)] rounded-2xl p-10">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="font-display font-black text-[#6EE07A] text-2xl uppercase tracking-wide mb-2">
                Registration Submitted!
              </h3>
              <p className="font-sans text-[#8BBFCC] text-sm">
                We'll confirm your registration by email within 48 hours.
                Check your inbox for the confirmation.
              </p>
            </div>
          </SR>
        ) : (
          <SR delay={0.2}>
            <form
              onSubmit={handleSubmit}
              className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-8 space-y-5"
            >
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="label">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Your full name"
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com"
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Phone *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 XXXXX XXXXX"
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Organisation</label>
                  <input
                    type="text"
                    value={form.org}
                    onChange={e => setForm(p => ({ ...p, org: e.target.value }))}
                    placeholder="NGO / Company / University"
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label className="label">Dietary Requirements</label>
                <select
                  value={form.dietary}
                  onChange={e => setForm(p => ({ ...p, dietary: e.target.value }))}
                  className="input appearance-none cursor-pointer"
                >
                  <option value="">No preference</option>
                  <option value="veg">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="jain">Jain</option>
                  <option value="none">None / Other</option>
                </select>
              </div>
              <button type="submit" className="btn-primary w-full justify-center py-4 text-base">
                Submit Registration — {activeCat.price} <ArrowRight size={16} />
              </button>
              <p className="font-sans text-[#8BBFCC] text-xs text-center">
                Payment details (if applicable) will be shared in your confirmation email.
              </p>
            </form>
          </SR>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  SPONSORS
// ─────────────────────────────────────────────
function SponsorsSection() {
  const tiers = [
    { label: 'Title Partner',   sponsors: ['Ministry of Environment, Forest & Climate Change'] },
    { label: 'Gold Partners',   sponsors: ['NITI Aayog', 'National Youth Corps (NYK)'] },
    { label: 'Silver Partners', sponsors: ['MSJE', 'CSR India', 'Adani Foundation'] },
  ];

  return (
    <section className="py-16 bg-[#023859] border-t border-[rgba(84,172,191,0.1)]">
      <div className="max-w-5xl mx-auto px-5 md:px-10 text-center">
        <SR>
          <span className="section-label">Our Partners</span>
          <h2
            className="font-display font-black text-[#F0FAFB] uppercase leading-none mb-12"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
          >
            Summit{' '}
            <span className="text-[#54ACBF]">Supporters</span>
          </h2>

          <div className="space-y-8">
            {tiers.map(tier => (
              <div key={tier.label}>
                <p className="font-mono text-[#54ACBF] text-[10px] tracking-[3px] uppercase mb-4">
                  {tier.label}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                  {tier.sponsors.map(s => (
                    <span
                      key={s}
                      className="font-display font-bold text-[#8BBFCC] uppercase tracking-wider hover:text-[#A7EBF2] transition-colors cursor-default"
                      style={{ fontSize: tier.label === 'Title Partner' ? '18px' : tier.label === 'Gold Partners' ? '15px' : '13px' }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link to="/contact" className="btn-outline inline-flex">
              Become a Sponsor <ArrowRight size={14} />
            </Link>
          </div>
        </SR>
      </div>
    </section>
  );
}