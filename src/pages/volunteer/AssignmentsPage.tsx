import { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Calendar, Clock, MapPin, ChevronDown, ChevronUp,
  Download, Filter, Search, CheckCircle, AlertCircle,
  ArrowRight, FileText,
} from 'lucide-react';

function SR({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
  );
}

// ── MOCK DATA ─────────────────────────────────
type Assignment = {
  id:        string;
  event:     string;
  org:       string;
  date:      string;
  dateRaw:   string;
  time:      string;
  venue:     string;
  sector:    string;
  task:      string;
  status:    'confirmed' | 'allocated' | 'completed' | 'attended';
  hours:     number;
  image:     string;
  hasMission:boolean;
  certReady: boolean;
};

const ALL_ASSIGNMENTS: Assignment[] = [
  { id: 'a1',  event: 'Sabarmati River Clean-Up 2026',     org: 'Paryavaran Trust',       date: 'Mar 15, 2026', dateRaw: '2026-03-15', time: '07:00–12:00', venue: 'Riverfront West, Ahmedabad', sector: 'Waste Collection Team A', task: 'Manual Waste Sorting',      status: 'confirmed',  hours: 0,   image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&q=70', hasMission: true,  certReady: false },
  { id: 'a2',  event: 'Tree Plantation Drive – Gandhinagar',org: 'Green India Foundation', date: 'Mar 22, 2026', dateRaw: '2026-03-22', time: '08:00–13:00', venue: 'Sector 7 Park, Gandhinagar', sector: 'Sapling Distribution',   task: 'Distribution & Planting', status: 'allocated',  hours: 0,   image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=70', hasMission: false, certReady: false },
  { id: 'a3',  event: 'Pruthwee Summit 2026 – Crew',        org: 'Pruthwe volunteers',    date: 'Apr 12–13, 2026', dateRaw: '2026-04-12', time: 'Both days',  venue: 'Mahatma Mandir, Gandhinagar', sector: 'Registration Desk', task: 'Registration & Info',    status: 'allocated',  hours: 0,   image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&q=70', hasMission: false, certReady: false },
  { id: 'a4',  event: 'Coastal Clean-Up – Jamnagar 2025',   org: 'Sea Care India',         date: 'Dec 14, 2025', dateRaw: '2025-12-14', time: '06:30–11:30', venue: 'Bedi Port Beach, Jamnagar', sector: 'Zone B Team 2',         task: 'Debris Collection',       status: 'completed',  hours: 5,   image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300&q=70', hasMission: true,  certReady: true  },
  { id: 'a5',  event: 'Health Camp – Rajkot 2025',           org: 'Arogya Sewa Trust',      date: 'Jan 5, 2026',  dateRaw: '2026-01-05', time: '08:00–14:30', venue: 'Community Hall, Rajkot',    sector: 'Registration',          task: 'Patient Registration',    status: 'completed',  hours: 6.5, image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&q=70', hasMission: true,  certReady: true  },
  { id: 'a6',  event: 'Education Drive – Surat 2025',        org: 'Shiksha Foundation',     date: 'Nov 20, 2025', dateRaw: '2025-11-20', time: '09:00–13:00', venue: 'Govt School, Surat',        sector: 'Class A Support',       task: 'Teaching Assistant',      status: 'completed',  hours: 4,   image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&q=70', hasMission: true,  certReady: true  },
  { id: 'a7',  event: 'Mangrove Planting – Surat 2025',     org: 'Sea Care India',         date: 'Oct 12, 2025', dateRaw: '2025-10-12', time: '07:00–11:00', venue: 'Dumas Beach, Surat',        sector: 'Zone A',                task: 'Planting & Maintenance',  status: 'attended',   hours: 4,   image: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=300&q=70', hasMission: false, certReady: true  },
  { id: 'a8',  event: 'Heritage Walk – Ahmedabad 2025',      org: 'Heritage Foundation',    date: 'Sep 7, 2025',  dateRaw: '2025-09-07', time: '06:00–10:00', venue: 'Swaminarayan Mandir Area',  sector: 'Guide Team',            task: 'Visitor Guidance',        status: 'attended',   hours: 4,   image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=300&q=70', hasMission: false, certReady: false },
];

const STATUS_META: Record<string, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
  confirmed: { label: 'Confirmed', bg: 'rgba(110,224,122,0.1)',  text: '#6EE07A', border: 'rgba(110,224,122,0.3)',  icon: <CheckCircle size={11} /> },
  allocated: { label: 'Allocated', bg: 'rgba(167,235,242,0.1)', text: '#A7EBF2', border: 'rgba(167,235,242,0.3)', icon: <AlertCircle size={11} /> },
  completed: { label: 'Completed', bg: 'rgba(84,172,191,0.1)',   text: '#54ACBF', border: 'rgba(84,172,191,0.3)',   icon: <CheckCircle size={11} /> },
  attended:  { label: 'Attended',  bg: 'rgba(196,181,253,0.1)', text: '#C4B5FD', border: 'rgba(196,181,253,0.3)', icon: <CheckCircle size={11} /> },
};

const TABS = [
  { id: 'all',      label: 'All'      },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past',     label: 'Past'     },
];

// ═════════════════════════════════════════════
export default function AssignmentsPage() {
  const [tab,      setTab]      = useState('all');
  const [search,   setSearch]   = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const now = new Date();

  const filtered = useMemo(() => {
    return ALL_ASSIGNMENTS.filter(a => {
      const aDate   = new Date(a.dateRaw);
      const isPast  = aDate < now;
      const matchTab = tab === 'all' ? true : tab === 'upcoming' ? !isPast : isPast;
      const matchSearch = !search || a.event.toLowerCase().includes(search.toLowerCase()) ||
        a.org.toLowerCase().includes(search.toLowerCase()) || a.sector.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [tab, search]);

  const totalHours  = ALL_ASSIGNMENTS.filter(a => a.status === 'completed' || a.status === 'attended').reduce((s, a) => s + a.hours, 0);
  const upcomingCnt = ALL_ASSIGNMENTS.filter(a => new Date(a.dateRaw) >= now).length;
  const completedCnt= ALL_ASSIGNMENTS.filter(a => a.status === 'completed' || a.status === 'attended').length;

  return (
    <div className="bg-[#011C40] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6">

        {/* Header */}
        <SR>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <Link to="/dashboard" className="flex items-center gap-1 font-mono text-[#54ACBF] text-xs tracking-[2px] uppercase mb-2 hover:text-[#A7EBF2] transition-colors">
                ← Dashboard
              </Link>
              <h1 className="font-display font-black text-[#F0FAFB] uppercase leading-none"
                style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
                My <span className="text-[#54ACBF]">Assignments</span>
              </h1>
            </div>
            <Link to="/events" className="btn-primary text-xs py-2.5 px-5">
              Find Events <ArrowRight size={13} />
            </Link>
          </div>
        </SR>

        {/* Summary stats */}
        <SR delay={0.07}>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Assignments', value: ALL_ASSIGNMENTS.length, color: '#A7EBF2' },
              { label: 'Upcoming',          value: upcomingCnt,            color: '#6EE07A' },
              { label: 'Hours Logged',      value: `${totalHours}h`,      color: '#FCD34D' },
            ].map(s => (
              <div key={s.label} className="bg-[rgba(2,56,89,0.5)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-4 text-center">
                <div className="font-display font-black leading-none mb-1"
                  style={{ fontSize: 'clamp(22px, 3vw, 32px)', color: s.color }}>{s.value}</div>
                <div className="font-display font-bold text-[#8BBFCC] text-[10px] uppercase tracking-[2px]">{s.label}</div>
              </div>
            ))}
          </div>
        </SR>

        {/* Filters */}
        <SR delay={0.1}>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Tabs */}
            <div className="flex gap-1 bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-xl p-1">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`px-4 py-2 rounded-lg font-display font-bold text-xs uppercase tracking-wide transition-all duration-150 ${
                    tab === t.id ? 'bg-[rgba(84,172,191,0.15)] text-[#A7EBF2] shadow-inner-teal' : 'text-[#8BBFCC] hover:text-[#A7EBF2]'
                  }`}>
                  {t.label}
                  <span className="ml-1.5 font-mono text-[10px] opacity-70">
                    {t.id === 'all' ? ALL_ASSIGNMENTS.length :
                     t.id === 'upcoming' ? upcomingCnt : completedCnt}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#54ACBF]" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search events, sectors..." className="input h-10 pl-9 text-sm" />
            </div>

            <span className="font-mono text-[#54ACBF] text-xs ml-auto">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </SR>

        {/* Assignment list */}
        <SR delay={0.13}>
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-[rgba(2,56,89,0.3)] rounded-2xl border border-[rgba(84,172,191,0.1)]">
              <FileText size={36} className="text-[#54ACBF] mx-auto mb-3 opacity-50" />
              <h3 className="font-display font-black text-[#F0FAFB] text-lg uppercase tracking-wide mb-1">No Assignments Found</h3>
              <p className="font-sans text-[#8BBFCC] text-sm">
                {search ? 'Try a different search term.' : 'Register for events to get assignments.'}
              </p>
              <Link to="/events" className="btn-primary inline-flex mt-5 text-sm">
                Browse Events <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((a, i) => {
                const sm     = STATUS_META[a.status];
                const isOpen = expanded === a.id;
                const isPast = new Date(a.dateRaw) < now;

                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl overflow-hidden hover:border-[rgba(84,172,191,0.25)] transition-colors"
                  >
                    {/* Main row */}
                    <button
                      onClick={() => setExpanded(isOpen ? null : a.id)}
                      className="w-full flex items-center gap-4 p-4 text-left"
                    >
                      {/* Image */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={a.image} alt={a.event} className="w-full h-full object-cover" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-[1.5px] px-2 py-0.5 rounded-full border"
                            style={{ color: sm.text, borderColor: sm.border, background: sm.bg }}>
                            {sm.icon}{sm.label}
                          </span>
                          {isPast && a.certReady && (
                            <span className="text-[9px] font-mono text-[#FCD34D] uppercase tracking-[1.5px] border border-[rgba(252,211,77,0.3)] px-2 py-0.5 rounded-full bg-[rgba(252,211,77,0.08)]">
                              Cert Ready
                            </span>
                          )}
                        </div>
                        <p className="font-display font-black text-[#F0FAFB] text-sm uppercase tracking-wide leading-tight line-clamp-1">
                          {a.event}
                        </p>
                        <p className="font-sans text-[#54ACBF] text-xs mt-0.5">{a.sector} · {a.task}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                          <span className="flex items-center gap-1 font-sans text-[#8BBFCC] text-[11px]">
                            <Calendar size={10} className="text-[#54ACBF]" />{a.date}
                          </span>
                          <span className="flex items-center gap-1 font-sans text-[#8BBFCC] text-[11px]">
                            <Clock size={10} className="text-[#54ACBF]" />{a.time}
                          </span>
                          {a.hours > 0 && (
                            <span className="font-sans text-[#6EE07A] text-[11px] font-bold">{a.hours}h logged</span>
                          )}
                        </div>
                      </div>

                      {/* Expand icon */}
                      <div className="flex-shrink-0">
                        {isOpen ? <ChevronUp size={16} className="text-[#54ACBF]" /> : <ChevronDown size={16} className="text-[#54ACBF]" />}
                      </div>
                    </button>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-5 pt-0 border-t border-[rgba(84,172,191,0.1)] space-y-4">
                            {/* Details grid */}
                            <div className="grid sm:grid-cols-2 gap-3 pt-4">
                              <div className="bg-[rgba(1,28,64,0.5)] rounded-xl p-4 space-y-2">
                                <p className="font-mono text-[#54ACBF] text-[10px] uppercase tracking-[2px] mb-2">Event Details</p>
                                <p className="font-display font-bold text-[#8BBFCC] text-xs">Organiser: <span className="text-[#F0FAFB]">{a.org}</span></p>
                                <div className="flex items-start gap-2">
                                  <MapPin size={12} className="text-[#54ACBF] mt-0.5 flex-shrink-0" />
                                  <p className="font-sans text-[#8BBFCC] text-xs leading-snug">{a.venue}</p>
                                </div>
                              </div>
                              <div className="bg-[rgba(1,28,64,0.5)] rounded-xl p-4 space-y-2">
                                <p className="font-mono text-[#54ACBF] text-[10px] uppercase tracking-[2px] mb-2">Assignment</p>
                                <p className="font-display font-bold text-[#8BBFCC] text-xs">Sector: <span className="text-[#F0FAFB]">{a.sector}</span></p>
                                <p className="font-display font-bold text-[#8BBFCC] text-xs">Task: <span className="text-[#F0FAFB]">{a.task}</span></p>
                                {a.hours > 0 && (
                                  <p className="font-display font-bold text-[#8BBFCC] text-xs">Hours: <span className="text-[#6EE07A]">{a.hours}h</span></p>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                              {a.hasMission && (
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(84,172,191,0.1)] border border-[rgba(84,172,191,0.2)] text-[#A7EBF2] font-display font-bold text-xs uppercase tracking-wide hover:bg-[rgba(84,172,191,0.18)] transition-all">
                                  <Download size={13} /> Mission Plan PDF
                                </button>
                              )}
                              {a.certReady && (
                                <Link to="/dashboard/certificates"
                                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(252,211,77,0.1)] border border-[rgba(252,211,77,0.25)] text-[#FCD34D] font-display font-bold text-xs uppercase tracking-wide hover:bg-[rgba(252,211,77,0.16)] transition-all">
                                  <Download size={13} /> View Certificate
                                </Link>
                              )}
                              <Link to={`/events/1`}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(84,172,191,0.15)] text-[#8BBFCC] font-display font-bold text-xs uppercase tracking-wide hover:border-[rgba(84,172,191,0.35)] hover:text-[#A7EBF2] transition-all">
                                Event Details <ArrowRight size={11} />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </SR>

      </div>
    </div>
  );
}