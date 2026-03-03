import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { PARTNER_LOGOS } from '../constants';

function SR({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };
const fadeUp  = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } };

const GOVT_PARTNERS = [
  {
    short: 'MoEF',
    name:  'Ministry of Environment, Forest & Climate Change',
    role:  'National Policy Partner',
    desc:  'The apex government ministry responsible for India\'s environmental policy provides official recognition and programme alignment for all Pruthwee environmental volunteer events.',
    tier:  'Title',
    color: '#A7EBF2',
    since: '2021',
  },
  {
    short: 'NITI Aayog',
    name:  'NITI Aayog — National Institution for Transforming India',
    role:  'Strategic Policy Partner',
    desc:  'India\'s premier policy think tank supports Pruthwee\'s volunteer ecosystem development and alignment with national development goals under the India@2047 framework.',
    tier:  'Title',
    color: '#54ACBF',
    since: '2022',
  },
  {
    short: 'NYK',
    name:  'National Youth Corps — Ministry of Youth Affairs & Sports',
    role:  'Youth Engagement Partner',
    desc:  'NYK\'s network of 640 youth coordinators across India channels young volunteers to Pruthwee events, creating a direct pipeline from government youth programmes to structured volunteering.',
    tier:  'Gold',
    color: '#FCD34D',
    since: '2021',
  },
  {
    short: 'MSJE',
    name:  'Ministry of Social Justice & Empowerment',
    role:  'Social Impact Partner',
    desc:  'MSJE partnership ensures Pruthwee events reach marginalised and underserved communities, with special emphasis on accessible volunteering and inclusive programme design.',
    tier:  'Gold',
    color: '#C4B5FD',
    since: '2022',
  },
];

const CIVIL_PARTNERS = [
  {
    short: 'CSR India',
    name:  'CSR India Foundation',
    role:  'Corporate Volunteering Partner',
    desc:  'Facilitates corporate CSR volunteering through Pruthwee\'s platform, connecting companies\' employee volunteer programmes with verified events across India.',
    color: '#6EE07A',
    since: '2022',
    type:  'Civil Society',
  },
  {
    short: 'Paryavaran Trust',
    name:  'Paryavaran Trust',
    role:  'Environmental Action Partner',
    desc:  'Gujarat-based environmental NGO and one of Pruthwee\'s oldest event partners. Runs the Sabarmati River Clean-Up series and tree plantation drives.',
    color: '#54ACBF',
    since: '2019',
    type:  'NGO',
  },
  {
    short: 'Green India NGO',
    name:  'Green India Foundation',
    role:  'Reforestation Partner',
    desc:  'Coordinates large-scale tree plantation events across Gujarat and Maharashtra, deploying Pruthwe volunteers for systematic reforestation campaigns.',
    color: '#6EE07A',
    since: '2020',
    type:  'NGO',
  },
  {
    short: 'Sea Care India',
    name:  'Sea Care India',
    role:  'Coastal Conservation Partner',
    desc:  'Runs coastal and marine clean-up events across Gujarat\'s coastline. Pruthwee provides volunteer coordination, certification, and communications support.',
    color: '#A7EBF2',
    since: '2021',
    type:  'NGO',
  },
  {
    short: 'Shiksha Foundation',
    name:  'Shiksha Foundation',
    role:  'Education Access Partner',
    desc:  'Connects Pruthwe volunteers with rural education camps, digital literacy workshops, and learning support programmes across South Gujarat.',
    color: '#93C5FD',
    since: '2020',
    type:  'NGO',
  },
  {
    short: 'Arogya Sewa',
    name:  'Arogya Sewa Trust',
    role:  'Health Outreach Partner',
    desc:  'Organises free health camps, blood donation drives, and awareness sessions in collaboration with Pruthwe volunteers across 12 cities.',
    color: '#FCA5A5',
    since: '2021',
    type:  'NGO',
  },
];

const BECOME_PARTNER_TYPES = [
  { icon: '🏛️', title: 'Government Body',     desc: 'MoUs with central and state government departments for official volunteer programme recognition.' },
  { icon: '🏢', title: 'Corporate / CSR',     desc: 'Structure your employee volunteer programmes with verified hours, certificates, and impact reports.' },
  { icon: '🌿', title: 'NGO / Trust',         desc: 'Use Pruthwee\'s platform to manage your volunteer events, registrations, and communications.' },
  { icon: '🎓', title: 'University / College', desc: 'Connect student volunteer requirements with structured, certified Pruthwee events.' },
];

// ═════════════════════════════════════════════
export default function PartnersPage() {
  return (
    <div className="bg-[#011C40] overflow-x-hidden">

      {/* Hero */}
      <section className="relative pt-10 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#011C40] via-[#023859] to-[#011C40]" />
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#54ACBF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <span className="section-label">Our Supporters</span>
            <h1 className="font-display font-black text-[#F0FAFB] uppercase leading-none mb-4"
              style={{ fontSize: 'clamp(52px, 9vw, 110px)' }}>
              Partners &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#54ACBF] to-[#A7EBF2]">
                Supporters
              </span>
            </h1>
            <p className="font-sans text-[#8BBFCC] text-lg max-w-xl leading-relaxed">
              Pruthwee is backed by India's leading government ministries, civil society organisations,
              and NGOs — giving every volunteer hour national recognition and real impact.
            </p>
          </motion.div>

          {/* Partner logos marquee */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 py-4 border-y border-[rgba(84,172,191,0.12)] overflow-hidden"
          >
            <div className="marquee-track gap-12">
              {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((p, i) => (
                <span key={i} className="font-display font-black text-[#8BBFCC] text-sm tracking-[3px] uppercase px-8 hover:text-[#A7EBF2] transition-colors cursor-default whitespace-nowrap">
                  {p.short}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Government Partners */}
      <section className="py-20 md:py-28 bg-[#023859]">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <SR>
            <div className="mb-12">
              <span className="section-label">Government Partners</span>
              <h2 className="font-display font-black text-[#F0FAFB] uppercase leading-none"
                style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
                National <span className="text-[#54ACBF]">Recognition</span>
              </h2>
            </div>
          </SR>

          <div className="grid md:grid-cols-2 gap-6">
            {GOVT_PARTNERS.map((p, i) => (
              <SR key={p.short} delay={i * 0.08}>
                <div className="h-full bg-[rgba(1,28,64,0.5)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-7 hover:border-[rgba(84,172,191,0.35)] transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-display font-black uppercase tracking-widest mb-1"
                        style={{ fontSize: 'clamp(22px, 3vw, 32px)', color: p.color }}>
                        {p.short}
                      </div>
                      <div className="font-sans text-[#8BBFCC] text-xs leading-snug max-w-xs">{p.name}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                      <span className="badge badge-teal">{p.tier} Partner</span>
                      <span className="font-mono text-[#54ACBF] text-[10px] tracking-wider">Since {p.since}</span>
                    </div>
                  </div>
                  <div className="font-display font-bold text-xs uppercase tracking-[2px] mb-3" style={{ color: p.color }}>
                    {p.role}
                  </div>
                  <p className="font-sans text-[#8BBFCC] text-sm leading-relaxed">{p.desc}</p>
                  <div className="mt-5 h-0.5 bg-gradient-to-r from-current to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ color: p.color }} />
                </div>
              </SR>
            ))}
          </div>
        </div>
      </section>

      {/* Civil Society Partners */}
      <section className="py-20 md:py-28 bg-[#011C40]">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <SR>
            <div className="mb-12">
              <span className="section-label">NGOs & Civil Society</span>
              <h2 className="font-display font-black text-[#F0FAFB] uppercase leading-none"
                style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
                On-Ground <span className="text-[#54ACBF]">Partners</span>
              </h2>
            </div>
          </SR>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CIVIL_PARTNERS.map((p, i) => (
              <SR key={p.short} delay={i * 0.07}>
                <div className="h-full bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-6 hover:border-[rgba(84,172,191,0.3)] transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="font-display font-black text-xl uppercase tracking-wide group-hover:text-[#A7EBF2] transition-colors"
                      style={{ color: p.color }}>
                      {p.short}
                    </div>
                    <span className="font-mono text-[#54ACBF] text-[9px] tracking-[2px] uppercase border border-[rgba(84,172,191,0.2)] px-2 py-0.5 rounded">
                      {p.type}
                    </span>
                  </div>
                  <div className="font-sans text-[#8BBFCC] text-xs mb-2">{p.name}</div>
                  <div className="font-display font-bold text-[10px] uppercase tracking-[2px] mb-3" style={{ color: p.color }}>
                    {p.role} · Since {p.since}
                  </div>
                  <p className="font-sans text-[#8BBFCC] text-sm leading-relaxed">{p.desc}</p>
                </div>
              </SR>
            ))}
          </div>
        </div>
      </section>

      {/* Impact section */}
      <section className="py-20 bg-[#023859] border-y border-[rgba(84,172,191,0.1)]">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <SR>
            <div className="text-center mb-14">
              <span className="section-label">Combined Impact</span>
              <h2 className="font-display font-black text-[#F0FAFB] uppercase leading-none"
                style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
                What Partnership <span className="text-[#54ACBF]">Delivers</span>
              </h2>
            </div>
          </SR>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { num: '320+', label: 'Events Co-organised' },
              { num: '10+',  label: 'Partner Organisations' },
              { num: '5L+',  label: 'Hours Facilitated' },
              { num: '48',   label: 'Cities Reached' },
            ].map((s, i) => (
              <SR key={s.label} delay={i * 0.08}>
                <div className="bg-[rgba(1,28,64,0.5)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-6 text-center hover:border-[rgba(84,172,191,0.3)] transition-all">
                  <div className="font-display font-black text-[#A7EBF2] leading-none mb-2"
                    style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>{s.num}</div>
                  <div className="font-display font-bold text-[#54ACBF] text-xs uppercase tracking-[2px]">{s.label}</div>
                </div>
              </SR>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Partner */}
      <section className="py-20 md:py-28 bg-[#011C40]">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <SR>
            <div className="text-center mb-12">
              <span className="section-label">Work With Us</span>
              <h2 className="font-display font-black text-[#F0FAFB] uppercase leading-none mb-4"
                style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
                Become a <span className="text-[#54ACBF]">Partner</span>
              </h2>
              <p className="font-sans text-[#8BBFCC] text-base max-w-xl mx-auto">
                Whether you're a government body, corporate, NGO, or university —
                Pruthwee has a partnership model that works for you.
              </p>
            </div>
          </SR>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {BECOME_PARTNER_TYPES.map((t, i) => (
              <SR key={t.title} delay={i * 0.07}>
                <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-6 hover:border-[rgba(84,172,191,0.3)] transition-all text-center group">
                  <div className="text-4xl mb-4">{t.icon}</div>
                  <h3 className="font-display font-black text-[#F0FAFB] text-base uppercase tracking-wide mb-2 group-hover:text-[#A7EBF2] transition-colors">
                    {t.title}
                  </h3>
                  <p className="font-sans text-[#8BBFCC] text-sm leading-relaxed">{t.desc}</p>
                </div>
              </SR>
            ))}
          </div>

          <SR delay={0.2}>
            <div className="text-center">
              <Link to="/contact" className="btn-primary text-base px-10 py-4 inline-flex">
                Explore Partnership <ArrowRight size={16} />
              </Link>
            </div>
          </SR>
        </div>
      </section>

    </div>
  );
}