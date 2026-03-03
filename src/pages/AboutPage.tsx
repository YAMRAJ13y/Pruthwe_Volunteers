import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { openRegisterModal } from '../components/layout/Navbar';
import { PARTNER_LOGOS } from '../constants';

// ── SCROLL REVEAL ─────────────────────────────
function SR({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const fadeUp  = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

// ── DATA ──────────────────────────────────────
const TEAM = [
  { name: 'Pruthwee Founder',     title: 'Founder & Director',            letter: 'P', color: '#A7EBF2' },
  { name: 'Programme Lead',       title: 'Head of Volunteer Programmes',  letter: 'P', color: '#54ACBF' },
  { name: 'Technology Head',      title: 'Chief Technology Officer',      letter: 'T', color: '#C4B5FD' },
  { name: 'Partnerships Manager', title: 'NGO & Govt Partnerships',       letter: 'P', color: '#FCD34D' },
  { name: 'Community Manager',    title: 'Volunteer Community Lead',      letter: 'C', color: '#6EE07A' },
  { name: 'Operations Head',      title: 'Events & Operations Manager',   letter: 'O', color: '#FCA5A5' },
];

const TIMELINE = [
  { year: '2019', title: 'Founded in Ahmedabad', desc: 'Pruthwe volunteers trust registered as a non-profit in Gujarat. First event: Sabarmati River Clean-Up with 40 volunteers.' },
  { year: '2020', title: 'Digital Platform Launch', desc: 'Launched first digital registration system. Ran 12 events across Ahmedabad and Gandhinagar despite pandemic restrictions.' },
  { year: '2021', title: 'Government Recognition', desc: 'Signed MoU with NYK and received support from MoEF. Expanded to 8 cities and crossed 500 registered volunteers.' },
  { year: '2022', title: 'NITI Aayog Partnership', desc: 'Partnered with NITI Aayog and CSR India. Hosted first Pruthwee Summit with 200 attendees. Reached 2,000 volunteers.' },
  { year: '2023', title: 'National Expansion', desc: 'Expanded to 25 cities. Launched tier system and certificates. Total hours crossed 1 lakh. 150+ events completed.' },
  { year: '2024', title: 'Platform Rebuild', desc: 'Began rebuilding the platform for scale. Reached 5,000 volunteers. Launched group registration feature.' },
  { year: '2025', title: '12,000 Volunteers & Growing', desc: 'Platform reaches 12,000 registered volunteers across 48 cities. 320+ events. 5 lakh volunteer hours. v3.0 platform in development.' },
  { year: '2026', title: 'Summit 2026 & v3.0 Launch', desc: 'Pruthwee Summit 2026 (April 12–13, Gandhinagar). Full v3.0 platform launch with sector system, MQ scores, and auto-certificates.' },
];

const VALUES = [
  { icon: '🌿', title: 'Environmental Stewardship', desc: 'Every action we facilitate moves India closer to a cleaner, greener future.' },
  { icon: '🤝', title: 'Community First',           desc: 'We serve communities, not metrics. Real impact over impressive numbers.' },
  { icon: '🔍', title: 'Radical Transparency',      desc: 'Open about our processes, pricing, data handling, and impact.' },
  { icon: '⚡', title: 'Volunteer Empowerment',     desc: 'Volunteers are not resources. They are the mission.' },
  { icon: '🌐', title: 'National Unity',            desc: 'Building bridges across India\'s 48+ cities, cultures, and causes.' },
  { icon: '📜', title: 'Recognition & Dignity',     desc: 'Every hour of service deserves acknowledgement and respect.' },
];

// ═════════════════════════════════════════════
//  ABOUT PAGE
// ═════════════════════════════════════════════
export default function AboutPage() {
  return (
    <div className="bg-[#011C40] overflow-x-hidden">
      <AboutHero />
      <MissionSection />
      <TimelineSection />
      <ValuesSection />
      <TeamSection />
      <PartnersSection />
      {/* Platform inspiration section kept for future release */}
      {/* <PlatformInspiration /> */}
      <AboutCTA />
    </div>
  );
}

// ─────────────────────────────────────────────
//  HERO
// ─────────────────────────────────────────────
function AboutHero() {
  return (
    <section className="relative pt-10 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#011C40] via-[#023859] to-[#011C40]" />
      <div className="absolute inset-0 grid-overlay opacity-40" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#54ACBF]/4 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <span className="section-label">Our Story</span>
          <h1
            className="font-display font-black text-[#F0FAFB] uppercase leading-none mb-6"
            style={{ fontSize: 'clamp(52px, 9vw, 110px)' }}
          >
            About{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#54ACBF] to-[#A7EBF2]">
              Pruthwee
            </span>
          </h1>
          <p className="font-sans text-[#8BBFCC] text-lg leading-relaxed max-w-2xl">
            We are India's leading volunteer management platform — a non-profit initiative
            dedicated to building the country's most structured, recognised, and impactful
            volunteer ecosystem. From a single river clean-up in Ahmedabad to a national
            movement across 48 cities.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-14"
        >
          {[
            { num: '2019',  label: 'Founded'          },
            { num: '12K+',  label: 'Volunteers'        },
            { num: '48',    label: 'Cities'             },
            { num: '5L+',   label: 'Hours Served'      },
          ].map((s) => (
            <div key={s.label} className="bg-[rgba(2,56,89,0.5)] border border-[rgba(84,172,191,0.15)] rounded-2xl p-5 text-center">
              <div
                className="font-display font-black text-[#A7EBF2] leading-none mb-1"
                style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
              >
                {s.num}
              </div>
              <div className="font-display font-bold text-[#54ACBF] text-xs uppercase tracking-[2px]">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  MISSION
// ─────────────────────────────────────────────
function MissionSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="py-20 md:py-28 bg-[#023859] border-y border-[rgba(84,172,191,0.1)]">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            {
              label: 'Our Mission',
              color: '#A7EBF2',
              text:  'To build India\'s most structured, transparent, and impactful volunteer ecosystem — empowering individuals to serve their communities with recognition, tools, and national reach.',
            },
            {
              label: 'Our Vision',
              color: '#54ACBF',
              text:  'A future where every Indian who wants to contribute meaningfully to their community can find, join, and be recognised for verified volunteer service.',
            },
            {
              label: 'Our Purpose',
              color: '#6EE07A',
              text:  'The name "Pruthwee" means Earth in Sanskrit. Everything we do — every event, every certificate, every connection — is in service of the Earth and the people who care for it.',
            },
          ].map((item) => (
            <motion.div
              key={item.label}
              variants={fadeUp}
              className="bg-[rgba(1,28,64,0.5)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-8 hover:border-[rgba(84,172,191,0.3)] transition-all"
            >
              <div
                className="font-display font-black text-lg uppercase tracking-[3px] mb-4"
                style={{ color: item.color }}
              >
                {item.label}
              </div>
              <p className="font-sans text-[#8BBFCC] text-base leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  TIMELINE
// ─────────────────────────────────────────────
function TimelineSection() {
  return (
    <section className="py-20 md:py-28 bg-[#011C40]">
      <div className="max-w-4xl mx-auto px-5 md:px-10">
        <SR>
          <div className="text-center mb-16">
            <span className="section-label">Our Journey</span>
            <h2
              className="font-display font-black text-[#F0FAFB] uppercase leading-none"
              style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
            >
              From One River to{' '}
              <span className="text-[#54ACBF]">48 Cities</span>
            </h2>
          </div>
        </SR>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#54ACBF] via-[rgba(84,172,191,0.3)] to-transparent ml-5 md:ml-0" />

          <div className="space-y-10">
            {TIMELINE.map((item, i) => (
              <SR key={item.year} delay={i * 0.05}>
                <div className={`relative flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Content */}
                  <div className={`flex-1 pl-12 md:pl-0 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div
                      className="font-display font-black text-[#54ACBF] text-sm uppercase tracking-[3px] mb-1"
                    >
                      {item.year}
                    </div>
                    <h3 className="font-display font-black text-[#F0FAFB] text-xl uppercase tracking-wide mb-2">
                      {item.title}
                    </h3>
                    <p className="font-sans text-[#8BBFCC] text-sm leading-relaxed">{item.desc}</p>
                  </div>

                  {/* Centre dot */}
                  <div className="absolute left-3 md:left-1/2 md:-translate-x-1/2 top-1 w-4 h-4 rounded-full bg-[#54ACBF] border-4 border-[#011C40] ring-2 ring-[rgba(84,172,191,0.3)]" />

                  {/* Empty half (desktop) */}
                  <div className="hidden md:block flex-1" />
                </div>
              </SR>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  VALUES
// ─────────────────────────────────────────────
function ValuesSection() {
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
            <span className="section-label">What We Stand For</span>
            <h2
              className="font-display font-black text-[#F0FAFB] uppercase leading-none"
              style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
            >
              Our Core{' '}
              <span className="text-[#54ACBF]">Values</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-[rgba(1,28,64,0.5)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-6 hover:border-[rgba(84,172,191,0.3)] transition-all group"
              >
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-display font-black text-[#F0FAFB] text-lg uppercase tracking-wide mb-2 group-hover:text-[#A7EBF2] transition-colors">
                  {v.title}
                </h3>
                <p className="font-sans text-[#8BBFCC] text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  TEAM
// ─────────────────────────────────────────────
function TeamSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="py-20 md:py-28 bg-[#011C40]">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={fadeUp} className="text-center mb-14">
            <span className="section-label">The People Behind Pruthwee</span>
            <h2
              className="font-display font-black text-[#F0FAFB] uppercase leading-none"
              style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
            >
              Our{' '}
              <span className="text-[#54ACBF]">Core Team</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {TEAM.map((member) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-6 flex items-center gap-5 hover:border-[rgba(84,172,191,0.3)] transition-all group"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 font-display font-black text-[#011C40] text-2xl"
                  style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}88)` }}
                >
                  {member.letter}
                </div>
                <div>
                  <div className="font-display font-black text-[#F0FAFB] text-base uppercase tracking-wide group-hover:text-[#A7EBF2] transition-colors">
                    {member.name}
                  </div>
                  <div className="font-sans text-[#8BBFCC] text-xs mt-0.5">{member.title}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="text-center mt-10">
            <p className="font-sans text-[#8BBFCC] text-sm">
              Supported by 50+ dedicated core volunteers across India.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  PARTNERS
// ─────────────────────────────────────────────
function PartnersSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="py-20 bg-[#023859] border-y border-[rgba(84,172,191,0.1)]">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={fadeUp} className="text-center mb-14">
            <span className="section-label">Recognition & Support</span>
            <h2
              className="font-display font-black text-[#F0FAFB] uppercase leading-none"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
            >
              Our{' '}
              <span className="text-[#54ACBF]">Partners</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PARTNER_LOGOS.map((p) => (
              <motion.div
                key={p.short}
                variants={fadeUp}
                className="bg-[rgba(1,28,64,0.5)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-6 hover:border-[rgba(84,172,191,0.3)] transition-all group"
              >
                <div className="font-display font-black text-[#A7EBF2] text-xl uppercase tracking-wider mb-2 group-hover:text-[#F0FAFB] transition-colors">
                  {p.short}
                </div>
                <div className="font-sans text-[#8BBFCC] text-sm leading-snug">{p.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  PLATFORM INSPIRATION
// ─────────────────────────────────────────────
function PlatformInspiration() {
  return (
    <section className="py-20 bg-[#011C40]">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SR>
          <div className="grid md:grid-cols-1 gap-12 items-center">
            <div>
              <span className="section-label">Platform Inspiration</span>
              <h2
                className="font-display font-black text-[#F0FAFB] uppercase leading-none mb-6"
                style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
              >
                Built for{' '}
                <span className="text-[#54ACBF]">India</span>
              </h2>
              <p className="font-sans text-[#8BBFCC] text-base leading-relaxed mb-4">
                Pruthwe volunteers is built around local needs: multilingual communication,
                city-level operations, and transparent event management from registration to
                certificate issuance.
              </p>
              <p className="font-sans text-[#8BBFCC] text-base leading-relaxed mb-6">
                The platform focuses on practical tools for organisers and volunteers so
                every event can be coordinated clearly and every volunteer contribution is
                recognised properly.
              </p>
            </div>
          </div>
        </SR>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  CTA
// ─────────────────────────────────────────────
function AboutCTA() {
  return (
    <section className="py-20 bg-[#023859] border-t border-[rgba(84,172,191,0.1)]">
      <div className="max-w-3xl mx-auto px-5 md:px-10 text-center">
        <SR>
          <span className="section-label">Be Part of the Story</span>
          <h2
            className="font-display font-black text-[#F0FAFB] uppercase leading-none mb-4"
            style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}
          >
            Join the{' '}
            <span className="text-[#54ACBF]">Movement</span>
          </h2>
          <p className="font-sans text-[#8BBFCC] text-base mb-8">
            Whether you want to volunteer, organise events, partner with us, or simply
            follow the journey — Pruthwee welcomes you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={openRegisterModal} className="btn-primary text-base px-10 py-4">
              Register Free <ArrowRight size={16} />
            </button>
            <Link to="/contact" className="btn-outline text-base px-8 py-4">
              Get In Touch
            </Link>
          </div>
        </SR>
      </div>
    </section>
  );
}