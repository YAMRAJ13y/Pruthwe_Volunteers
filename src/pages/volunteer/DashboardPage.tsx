import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Award, Calendar, Clock, MapPin, ChevronRight, CheckCircle,
  TrendingUp, Star, Bell, Download, ArrowRight, Zap, Users,
} from 'lucide-react';
import { STATUS_TIERS } from '../../constants';
import { useAuthStore } from '../../store/authStore';
import { DashboardSkeleton } from '../../components/ui/Skeletons';

// ── SHARED HELPERS ────────────────────────────
function SR({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// ── MOCK DATA ─────────────────────────────────
const MOCK_VOLUNTEER = {
  name:        'Arjun Patel',
  initials:    'AP',
  city:        'Ahmedabad',
  tier:        STATUS_TIERS[3],  // Silver
  totalHours:  87.5,
  nextTierHours: 200,
  eventsAttended: 14,
  certificates: 6,
  groups:      2,
  mqScore:     73,
  joinedDate:  'March 2023',
  skills:      ['Photography', 'First Aid', 'Event Management', 'Social Media'],
  causes:      ['Environment', 'Education'],
};

const UPCOMING_ASSIGNMENTS = [
  {
    id:     'a1',
    event:  'Sabarmati River Clean-Up 2026',
    org:    'Paryavaran Trust',
    date:   'Mar 15, 2026',
    time:   '07:00 – 12:00',
    venue:  'Riverfront West, Ahmedabad',
    sector: 'Waste Collection Team A',
    status: 'confirmed',
    image:  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=70',
  },
  {
    id:     'a2',
    event:  'Tree Plantation Drive – Gandhinagar',
    org:    'Green India Foundation',
    date:   'Mar 22, 2026',
    time:   '08:00 – 13:00',
    venue:  'Sector 7 Park, Gandhinagar',
    sector: 'Sapling Distribution',
    status: 'allocated',
    image:  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=70',
  },
  {
    id:     'a3',
    event:  'Pruthwee Summit 2026 – Volunteer Crew',
    org:    'Pruthwee Volunteers',
    date:   'Apr 12–13, 2026',
    time:   'Both days',
    venue:  'Mahatma Mandir, Gandhinagar',
    sector: 'Registration Desk',
    status: 'allocated',
    image:  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=70',
  },
];

const RECENT_ACTIVITY = [
  { icon: '🎖️', text: 'Silver tier achieved — 75+ hours logged',       date: 'Feb 10, 2026', color: '#C0C0C0' },
  { icon: '📄', text: 'Certificate issued for Coastal Clean-Up 2025',   date: 'Jan 28, 2026', color: '#54ACBF' },
  { icon: '✅', text: 'Confirmed for Sabarmati Clean-Up 2026',           date: 'Jan 22, 2026', color: '#6EE07A' },
  { icon: '📋', text: 'Registered for Tree Plantation Drive',            date: 'Jan 18, 2026', color: '#A7EBF2' },
  { icon: '⏱️', text: '12.5 hours logged — Health Camp Rajkot',          date: 'Jan 5, 2026',  color: '#FCD34D' },
];

const HOURS_BY_MONTH = [
  { month: 'Jul', hours: 0   },
  { month: 'Aug', hours: 8   },
  { month: 'Sep', hours: 12  },
  { month: 'Oct', hours: 5   },
  { month: 'Nov', hours: 18  },
  { month: 'Dec', hours: 22  },
  { month: 'Jan', hours: 14.5},
  { month: 'Feb', hours: 8   },
];

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  confirmed: { bg: 'rgba(110,224,122,0.1)', text: '#6EE07A', border: 'rgba(110,224,122,0.3)', label: 'Confirmed' },
  allocated: { bg: 'rgba(167,235,242,0.1)', text: '#A7EBF2', border: 'rgba(167,235,242,0.3)', label: 'Allocated' },
  completed: { bg: 'rgba(84,172,191,0.1)',  text: '#54ACBF', border: 'rgba(84,172,191,0.3)',  label: 'Completed' },
};

const maxHours = Math.max(...HOURS_BY_MONTH.map(m => m.hours));

// ═════════════════════════════════════════════
export default function DashboardPage() {
  // ── Read from authStore (populated by LoginModal / RegisterModal) ──
  const { user, profile } = useAuthStore();

  // Simulate data loading (replace with Supabase fetch)
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) return <DashboardSkeleton />;

  // Build display values — fall back to MOCK_VOLUNTEER if not logged in (dev mode)
  const displayName    = profile?.fullName   ?? MOCK_VOLUNTEER.name;
  const displayCity    = profile?.city       ?? MOCK_VOLUNTEER.city;
  const totalHours     = profile?.total_hours  ?? MOCK_VOLUNTEER.totalHours;
  const mqScore        = profile?.mq_score     ?? MOCK_VOLUNTEER.mqScore;
  const eventsAtt      = profile?.events_attended ?? MOCK_VOLUNTEER.eventsAttended;
  const certsCount     = profile?.certificates_count ?? MOCK_VOLUNTEER.certificates;
  const tierId         = profile?.status_tier  ?? MOCK_VOLUNTEER.tier.id;

  const tier           = STATUS_TIERS.find(t => t.id === tierId) ?? STATUS_TIERS[0];
  const nextTier       = STATUS_TIERS[STATUS_TIERS.findIndex(t => t.id === tier.id) + 1];
  const hoursToNext    = nextTier ? nextTier.hoursMin - totalHours : 0;
  const tierProgress   = nextTier
    ? ((totalHours - tier.hoursMin) / (nextTier.hoursMin - tier.hoursMin)) * 100
    : 100;

  // Alias for template
  const v = {
    ...MOCK_VOLUNTEER,
    name:           displayName,
    initials:       displayName.split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase(),
    city:           displayCity,
    tier,
    totalHours,
    mqScore,
    eventsAttended: eventsAtt,
    certificates:   certsCount,
  };

  return (
    <div className="bg-[#011C40] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">

        {/* ── HEADER ── */}
        <SR>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[#54ACBF] text-xs tracking-[2px] uppercase mb-1">Welcome back</p>
              <h1 className="font-display font-black text-[#F0FAFB] uppercase leading-none"
                style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
                {v.name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-display font-bold text-xs uppercase tracking-wide"
                  style={{ color: tier.color, borderColor: tier.borderColor, background: tier.bgColor }}>
                  {tier.icon} {tier.label}
                </span>
                <span className="font-sans text-[#8BBFCC] text-xs">{v.city}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/dashboard/assignments" className="btn-outline text-xs py-2.5 px-5">
                My Assignments
              </Link>
              <Link to="/profile" className="btn-primary text-xs py-2.5 px-5">
                Edit Profile <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        </SR>

        {/* ── STAT CARDS ── */}
        <SR delay={0.07}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Clock size={18} />,    label: 'Total Hours',   value: `${v.totalHours}h`,     color: '#A7EBF2', sub: `+14.5h this month`    },
              { icon: <Calendar size={18} />, label: 'Events',        value: v.eventsAttended,        color: '#54ACBF', sub: `3 upcoming`            },
              { icon: <Award size={18} />,    label: 'Certificates',  value: v.certificates,          color: '#FCD34D', sub: `Latest: Jan 2026`      },
              { icon: <Zap size={18} />,      label: 'MQ Score',      value: v.mqScore,               color: '#6EE07A', sub: `Top 28% in your city`  },
            ].map((stat) => (
              <motion.div key={stat.label}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                className="bg-[rgba(2,56,89,0.5)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-5 hover:border-[rgba(84,172,191,0.3)] transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}18`, color: stat.color }}>
                    {stat.icon}
                  </div>
                </div>
                <div className="font-display font-black leading-none mb-1"
                  style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: stat.color }}>
                  {stat.value}
                </div>
                <div className="font-display font-bold text-[#8BBFCC] text-xs uppercase tracking-[2px] mb-1">{stat.label}</div>
                <div className="font-sans text-[#54ACBF] text-[11px]">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </SR>

        {/* ── TIER PROGRESS + HOURS CHART ── */}
        <div className="grid md:grid-cols-[1fr_340px] gap-5">

          {/* Hours chart */}
          <SR delay={0.1}>
            <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-black text-[#F0FAFB] text-base uppercase tracking-wide">Hours Chart</h3>
                  <p className="font-sans text-[#8BBFCC] text-xs">Aug 2025 – Feb 2026</p>
                </div>
                <div className="flex items-center gap-1.5 text-[#6EE07A]">
                  <TrendingUp size={14} />
                  <span className="font-display font-bold text-xs uppercase tracking-wide">+44% vs last period</span>
                </div>
              </div>
              {/* Bar chart */}
              <div className="flex items-end gap-3 h-36">
                {HOURS_BY_MONTH.map((m, i) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="font-sans text-[#54ACBF] text-[10px]">{m.hours > 0 ? `${m.hours}h` : ''}</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(m.hours / maxHours) * 100}%` }}
                      transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full rounded-t-lg min-h-[4px]"
                      style={{
                        background: m.month === 'Feb' || m.month === 'Jan'
                          ? 'linear-gradient(to top, #54ACBF, #A7EBF2)'
                          : 'rgba(84,172,191,0.25)',
                      }}
                    />
                    <span className="font-display font-bold text-[#8BBFCC] text-[10px] uppercase">{m.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </SR>

          {/* Tier progress */}
          <SR delay={0.12}>
            <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-6 flex flex-col">
              <h3 className="font-display font-black text-[#F0FAFB] text-base uppercase tracking-wide mb-5">Tier Progress</h3>

              {/* Current tier */}
              <div className="flex items-center gap-4 mb-6 p-4 rounded-xl border" style={{ borderColor: tier.borderColor, background: tier.bgColor }}>
                <div className="text-3xl">{tier.icon}</div>
                <div>
                  <div className="font-display font-black uppercase tracking-wide" style={{ color: tier.color, fontSize: 20 }}>
                    {tier.label}
                  </div>
                  <div className="font-sans text-[#8BBFCC] text-xs">{v.totalHours}h total</div>
                </div>
              </div>

              {/* Progress bar */}
              {nextTier && (
                <div className="mb-5">
                  <div className="flex justify-between mb-2">
                    <span className="font-display font-bold text-[#8BBFCC] text-xs uppercase tracking-wide">{tier.label}</span>
                    <span className="font-display font-bold text-xs uppercase tracking-wide" style={{ color: nextTier.color }}>{nextTier.label}</span>
                  </div>
                  <div className="h-3 bg-[rgba(84,172,191,0.1)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${tier.color}, ${nextTier.color})` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(tierProgress, 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                  <p className="font-sans text-[#54ACBF] text-xs mt-2">
                    <span className="font-black text-[#A7EBF2]">{hoursToNext.toFixed(1)}h</span> more to {nextTier.label}
                  </p>
                </div>
              )}

              {/* Tier ladder */}
              <div className="space-y-2 mt-auto">
                {STATUS_TIERS.slice(1).map((t) => (
                  <div key={t.id} className="flex items-center gap-2">
                    <span className="text-sm">{t.icon}</span>
                    <div className="flex-1 h-1 rounded-full" style={{
                      background: v.totalHours >= t.hoursMin ? t.color : 'rgba(84,172,191,0.1)'
                    }} />
                    <span className="font-display font-bold text-[10px] uppercase tracking-wide w-14 text-right"
                      style={{ color: v.totalHours >= t.hoursMin ? t.color : '#4B6A7A' }}>
                      {t.hoursMin}h
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </SR>
        </div>

        {/* ── UPCOMING ASSIGNMENTS + ACTIVITY ── */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-5">

          {/* Upcoming assignments */}
          <SR delay={0.14}>
            <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(84,172,191,0.1)]">
                <h3 className="font-display font-black text-[#F0FAFB] text-base uppercase tracking-wide">
                  Upcoming Assignments
                </h3>
                <Link to="/dashboard/assignments"
                  className="flex items-center gap-1.5 font-display font-bold text-[#54ACBF] text-xs uppercase tracking-wide hover:text-[#A7EBF2] transition-colors">
                  View All <ChevronRight size={13} />
                </Link>
              </div>

              <div className="divide-y divide-[rgba(84,172,191,0.07)]">
                {UPCOMING_ASSIGNMENTS.map((a) => {
                  const sc = STATUS_COLORS[a.status];
                  return (
                    <motion.div key={a.id}
                      whileHover={{ backgroundColor: 'rgba(84,172,191,0.04)', transition: { duration: 0.1 } }}
                      className="flex gap-4 px-6 py-4">
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={a.image} alt={a.event} className="w-full h-full object-cover" />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-display font-black text-[#F0FAFB] text-sm uppercase tracking-wide leading-tight line-clamp-1">
                            {a.event}
                          </p>
                          <span className="flex-shrink-0 text-[9px] font-mono uppercase tracking-[1.5px] px-2 py-0.5 rounded-full border"
                            style={{ color: sc.text, borderColor: sc.border, background: sc.bg }}>
                            {sc.label}
                          </span>
                        </div>
                        <p className="font-sans text-[#54ACBF] text-xs mt-0.5">{a.sector}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                          <span className="flex items-center gap-1 font-sans text-[#8BBFCC] text-[11px]">
                            <Calendar size={10} className="text-[#54ACBF]" />{a.date}
                          </span>
                          <span className="flex items-center gap-1 font-sans text-[#8BBFCC] text-[11px]">
                            <Clock size={10} className="text-[#54ACBF]" />{a.time}
                          </span>
                          <span className="flex items-center gap-1 font-sans text-[#8BBFCC] text-[11px]">
                            <MapPin size={10} className="text-[#54ACBF]" />{a.venue}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="px-6 py-4 border-t border-[rgba(84,172,191,0.07)]">
                <Link to="/events" className="flex items-center gap-2 font-display font-bold text-[#54ACBF] text-xs uppercase tracking-wide hover:text-[#A7EBF2] transition-colors">
                  <Star size={12} /> Browse More Events <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </SR>

          {/* Right column: activity + quick links */}
          <div className="space-y-5">

            {/* Recent activity */}
            <SR delay={0.16}>
              <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(84,172,191,0.1)]">
                  <h3 className="font-display font-black text-[#F0FAFB] text-sm uppercase tracking-wide">
                    Recent Activity
                  </h3>
                  <Bell size={14} className="text-[#54ACBF]" />
                </div>
                <div className="divide-y divide-[rgba(84,172,191,0.07)]">
                  {RECENT_ACTIVITY.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 px-5 py-3">
                      <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-[#8BBFCC] text-xs leading-snug">{item.text}</p>
                        <p className="font-mono text-[#54ACBF] text-[10px] mt-0.5">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SR>

            {/* Quick links */}
            <SR delay={0.18}>
              <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-4 space-y-2">
                {[
                  { icon: <Award size={15} />,    label: 'My Certificates',  to: '/dashboard/certificates', color: '#FCD34D' },
                  { icon: <Users size={15} />,    label: 'My Groups',        to: '/dashboard/groups',       color: '#C4B5FD' },
                  { icon: <Calendar size={15} />, label: 'Browse Events',    to: '/events',                 color: '#6EE07A' },
                  { icon: <Download size={15} />, label: 'Download Profile', to: '#',                       color: '#54ACBF' },
                ].map((item) => (
                  <Link key={item.label} to={item.to}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[rgba(84,172,191,0.06)] transition-colors group">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${item.color}18`, color: item.color }}>
                      {item.icon}
                    </div>
                    <span className="font-display font-bold text-[#8BBFCC] text-xs uppercase tracking-wide group-hover:text-[#F0FAFB] transition-colors flex-1">
                      {item.label}
                    </span>
                    <ChevronRight size={13} className="text-[#54ACBF] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </SR>

            {/* MQ Score card */}
            <SR delay={0.2}>
              <div className="bg-[rgba(110,224,122,0.05)] border border-[rgba(110,224,122,0.2)] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={14} className="text-[#6EE07A]" />
                  <span className="font-display font-black text-[#6EE07A] text-xs uppercase tracking-[2px]">MQ Score</span>
                </div>
                <div className="flex items-end gap-3 mb-3">
                  <span className="font-display font-black text-[#F0FAFB] leading-none" style={{ fontSize: 48 }}>
                    {v.mqScore}
                  </span>
                  <span className="font-display font-bold text-[#8BBFCC] text-sm mb-2">/ 100</span>
                </div>
                <div className="h-2 bg-[rgba(110,224,122,0.1)] rounded-full overflow-hidden mb-2">
                  <motion.div className="h-full bg-[#6EE07A] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${v.mqScore}%` }}
                    transition={{ duration: 0.8, delay: 0.4 }} />
                </div>
                <p className="font-sans text-[#8BBFCC] text-[11px] leading-snug">
                  Your Matching Quotient score. Higher scores get priority allocation to popular events.
                  Complete your profile to improve.
                </p>
                <Link to="/profile" className="inline-flex items-center gap-1 mt-3 font-display font-bold text-[#6EE07A] text-xs uppercase tracking-wide hover:underline">
                  Improve Score <ArrowRight size={11} />
                </Link>
              </div>
            </SR>
          </div>
        </div>

        {/* ── SKILLS & CAUSES ── */}
        <SR delay={0.2}>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-black text-[#F0FAFB] text-sm uppercase tracking-wide">My Skills</h3>
                <Link to="/profile" className="font-display font-bold text-[#54ACBF] text-[10px] uppercase tracking-wide hover:text-[#A7EBF2] transition-colors">Edit</Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {v.skills.map(s => (
                  <span key={s} className="badge badge-teal">{s}</span>
                ))}
              </div>
            </div>
            <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-black text-[#F0FAFB] text-sm uppercase tracking-wide">My Causes</h3>
                <Link to="/profile" className="font-display font-bold text-[#54ACBF] text-[10px] uppercase tracking-wide hover:text-[#A7EBF2] transition-colors">Edit</Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {v.causes.map(c => (
                  <span key={c} className="badge" style={{ color: '#A7EBF2', background: 'rgba(167,235,242,0.1)', borderColor: 'rgba(167,235,242,0.25)' }}>
                    {c}
                  </span>
                ))}
                <Link to="/profile" className="badge border-dashed border-[rgba(84,172,191,0.3)] text-[#54ACBF] hover:border-[#54ACBF] transition-colors">
                  + Add Cause
                </Link>
              </div>
            </div>
          </div>
        </SR>

      </div>
    </div>
  );
}