import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Users, Calendar, Award, TrendingUp, Shield, AlertCircle,
  CheckCircle, Clock, Search, Filter, ChevronDown, Eye,
  Ban, Trash2, RefreshCw, Download, Zap, Activity,
  Database, Globe, Bell, Settings, BarChart2, X,
  ArrowUp, ArrowDown, MapPin,
} from 'lucide-react';

function SR({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// ── MOCK DATA ─────────────────────────────────
const PLATFORM_STATS = [
  { label: 'Total Volunteers',   value: 12483,   delta: '+214 this week',  up: true,  color: '#A7EBF2', icon: <Users size={18} />     },
  { label: 'Active Events',      value: 18,      delta: '+3 vs last week', up: true,  color: '#6EE07A', icon: <Calendar size={18} />  },
  { label: 'Hours Logged',       value: '5.1L',  delta: '+8,200 this week',up: true,  color: '#54ACBF', icon: <Clock size={18} />     },
  { label: 'Certs Issued',       value: 9841,    delta: '+312 this week',  up: true,  color: '#FCD34D', icon: <Award size={18} />     },
  { label: 'Organisers',         value: 47,      delta: '+2 pending',      up: false, color: '#C4B5FD', icon: <Shield size={18} />    },
  { label: 'Cities Active',      value: 48,      delta: 'All cities live', up: true,  color: '#FCA5A5', icon: <Globe size={18} />     },
];

const RECENT_EVENTS = [
  { id: 'e1', title: 'Sabarmati River Clean-Up 2026',   city: 'Ahmedabad',   org: 'Paryavaran Trust',    date: 'Apr 15', regs: 47, max: 60, status: 'open',      flagged: false },
  { id: 'e2', title: 'Pruthwee Summit 2026 Crew',        city: 'Gandhinagar', org: 'Pruthwe volunteers', date: 'Apr 12', regs: 80, max: 80, status: 'full',      flagged: false },
  { id: 'e3', title: 'Tree Plantation — Earth Day',       city: 'Gandhinagar', org: 'Green India Foundation',date:'Apr 22',regs: 23, max: 50, status: 'open',      flagged: false },
  { id: 'e4', title: 'Untitled Draft Event',              city: 'Rajkot',      org: 'New Org 2024',        date: 'TBD',    regs: 0,  max: 30, status: 'draft',     flagged: true  },
  { id: 'e5', title: 'Health Camp — Vadodara',            city: 'Vadodara',    org: 'Arogya Sewa Trust',   date: 'May 10', regs: 5,  max: 30, status: 'draft',     flagged: false },
];

const RECENT_USERS = [
  { id: 'u1',  name: 'Vikram Desai',    email: 'vikram@email.com', role: 'volunteer', tier: 'Diamond', tierColor: '#A7EBF2', mq: 99,  joined: 'Mar 10, 2026', status: 'active',   flagged: false },
  { id: 'u2',  name: 'Sneha Desai',     email: 'sneha@email.com',  role: 'volunteer', tier: 'Gold',    tierColor: '#FFD700', mq: 91,  joined: 'Mar 5, 2026',  status: 'active',   flagged: false },
  { id: 'u3',  name: 'New Organiser',   email: 'neworg@test.com',  role: 'organiser', tier: '—',       tierColor: '#C4B5FD', mq: 0,   joined: 'Mar 14, 2026', status: 'pending',  flagged: true  },
  { id: 'u4',  name: 'Rohan Shah',      email: 'rohan@email.com',  role: 'volunteer', tier: 'Volunteer',tierColor:'#6EE07A', mq: 61,  joined: 'Mar 4, 2026',  status: 'active',   flagged: false },
  { id: 'u5',  name: 'Spam Account',    email: 'spam1234@fake.com',role: 'volunteer', tier: 'New',     tierColor: '#9CA3AF', mq: 0,   joined: 'Mar 13, 2026', status: 'suspended',flagged: true  },
];

const ACTIVITY_FEED = [
  { icon: '👤', text: 'New organiser "New Org 2024" awaiting approval',      time: '5m ago',   color: '#C4B5FD', action: true  },
  { icon: '⚠️', text: 'Event "Untitled Draft Event" flagged for review',      time: '12m ago',  color: '#FCD34D', action: true  },
  { icon: '🎖️', text: 'Vikram Desai reached Diamond tier — 1000+ hours',      time: '1h ago',   color: '#A7EBF2', action: false },
  { icon: '📋', text: '312 certificates issued today',                         time: '2h ago',   color: '#54ACBF', action: false },
  { icon: '🏙️', text: 'Bhopal city chapter now active — 12 volunteers',       time: '3h ago',   color: '#6EE07A', action: false },
  { icon: '🚫', text: 'Account spam1234@fake.com suspended (bot detection)',   time: '4h ago',   color: '#FCA5A5', action: false },
  { icon: '✅', text: 'Summit 2026 volunteer allocation completed (80/80)',     time: '5h ago',   color: '#6EE07A', action: false },
  { icon: '📧', text: '1,240 emails dispatched — Sabarmati reminder',          time: '6h ago',   color: '#54ACBF', action: false },
];

const SYSTEM_HEALTH = [
  { label: 'API Latency',      value: '48ms',  status: 'good',    bar: 92 },
  { label: 'DB Uptime',        value: '99.97%',status: 'good',    bar: 99 },
  { label: 'Email Deliverability',value:'98.4%',status: 'good',   bar: 98 },
  { label: 'SMS Delivery',     value: '94.1%', status: 'warning', bar: 94 },
  { label: 'Storage',          value: '61%',   status: 'good',    bar: 61 },
  { label: 'CDN',              value: 'OK',    status: 'good',    bar: 100},
];

const CITY_BREAKDOWN = [
  { city: 'Ahmedabad',   volunteers: 2840, events: 58, hours: '1.2L' },
  { city: 'Surat',       volunteers: 1920, events: 41, hours: '82K'  },
  { city: 'Gandhinagar', volunteers: 980,  events: 22, hours: '41K'  },
  { city: 'Vadodara',    volunteers: 870,  events: 19, hours: '36K'  },
  { city: 'Rajkot',      volunteers: 720,  events: 16, hours: '30K'  },
  { city: 'Mumbai',      volunteers: 680,  events: 14, hours: '29K'  },
];

const EVENT_STATUS_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  open:   { color: '#6EE07A', bg: 'rgba(110,224,122,0.1)',  border: 'rgba(110,224,122,0.3)'  },
  full:   { color: '#FCA5A5', bg: 'rgba(252,165,165,0.1)',  border: 'rgba(252,165,165,0.3)'  },
  draft:  { color: '#FCD34D', bg: 'rgba(252,211,77,0.1)',   border: 'rgba(252,211,77,0.3)'   },
  closed: { color: '#A7EBF2', bg: 'rgba(167,235,242,0.08)', border: 'rgba(167,235,242,0.2)'  },
};

const USER_STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  active:    { color: '#6EE07A', bg: 'rgba(110,224,122,0.1)'  },
  pending:   { color: '#FCD34D', bg: 'rgba(252,211,77,0.1)'   },
  suspended: { color: '#FCA5A5', bg: 'rgba(252,165,165,0.1)'  },
};

type AdminTab = 'overview' | 'users' | 'events' | 'cities' | 'system';

// ── USER ROW ──────────────────────────────────
function UserRow({ user, onAction }: { user: typeof RECENT_USERS[0]; onAction: (action: string, user: typeof RECENT_USERS[0]) => void }) {
  const usc = USER_STATUS_COLORS[user.status];
  return (
    <div className={`flex items-center gap-4 px-5 py-3.5 border-b border-[rgba(84,172,191,0.06)] last:border-0 hover:bg-[rgba(84,172,191,0.03)] transition-colors ${user.flagged ? 'bg-[rgba(252,211,77,0.03)]' : ''}`}>
      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-display font-black text-sm text-[#011C40]"
        style={{ background: user.tierColor }}>
        {user.name.slice(0, 1)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-display font-black text-[#F0FAFB] text-sm uppercase tracking-wide truncate">{user.name}</p>
          {user.flagged && <AlertCircle size={12} className="text-[#FCD34D] flex-shrink-0" />}
        </div>
        <p className="font-sans text-[#8BBFCC] text-xs truncate">{user.email}</p>
      </div>
      <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-[9px] font-mono uppercase tracking-[1.5px] px-2 py-0.5 rounded-full border"
          style={{ color: user.tierColor, borderColor: `${user.tierColor}40` }}>{user.tier}</span>
        <span className="font-mono text-[#54ACBF] text-[10px]">MQ {user.mq}</span>
      </div>
      <span className="text-[9px] font-mono uppercase tracking-[1.5px] px-2 py-0.5 rounded-full hidden md:block flex-shrink-0"
        style={{ color: usc.color, background: usc.bg }}>{user.status}</span>
      <div className="flex gap-1 flex-shrink-0">
        <button onClick={() => onAction('view', user)}
          className="w-7 h-7 rounded-lg bg-[rgba(84,172,191,0.08)] flex items-center justify-center text-[#54ACBF] hover:bg-[rgba(84,172,191,0.18)] transition-all">
          <Eye size={12} />
        </button>
        {user.status !== 'suspended' ? (
          <button onClick={() => onAction('suspend', user)}
            className="w-7 h-7 rounded-lg bg-[rgba(252,165,165,0.06)] flex items-center justify-center text-[#FCA5A5] hover:bg-[rgba(252,165,165,0.15)] transition-all">
            <Ban size={12} />
          </button>
        ) : (
          <button onClick={() => onAction('unsuspend', user)}
            className="w-7 h-7 rounded-lg bg-[rgba(110,224,122,0.06)] flex items-center justify-center text-[#6EE07A] hover:bg-[rgba(110,224,122,0.15)] transition-all">
            <CheckCircle size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

// ── EVENT ROW ─────────────────────────────────
function EventRow({ ev, onAction }: { ev: typeof RECENT_EVENTS[0]; onAction: (action: string, ev: typeof RECENT_EVENTS[0]) => void }) {
  const sc = EVENT_STATUS_COLORS[ev.status] ?? EVENT_STATUS_COLORS.draft;
  const fillPct = ev.max > 0 ? Math.round((ev.regs / ev.max) * 100) : 0;
  return (
    <div className={`flex items-center gap-4 px-5 py-3.5 border-b border-[rgba(84,172,191,0.06)] last:border-0 hover:bg-[rgba(84,172,191,0.03)] transition-colors ${ev.flagged ? 'bg-[rgba(252,211,77,0.03)]' : ''}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-display font-black text-[#F0FAFB] text-sm uppercase tracking-wide truncate">{ev.title}</p>
          {ev.flagged && <AlertCircle size={12} className="text-[#FCD34D] flex-shrink-0" />}
        </div>
        <p className="font-sans text-[#8BBFCC] text-xs">{ev.org} · {ev.city} · {ev.date}</p>
      </div>
      <div className="hidden sm:flex flex-col items-end gap-1.5 flex-shrink-0 min-w-[80px]">
        <span className="font-sans text-[#8BBFCC] text-xs">{ev.regs}/{ev.max}</span>
        <div className="w-16 h-1 bg-[rgba(84,172,191,0.15)] rounded-full">
          <div className="h-full rounded-full bg-[#54ACBF]" style={{ width: `${fillPct}%` }} />
        </div>
      </div>
      <span className="text-[9px] font-mono uppercase tracking-[1.5px] px-2 py-0.5 rounded-full border flex-shrink-0"
        style={{ color: sc.color, borderColor: sc.border, background: sc.bg }}>{ev.status}</span>
      <div className="flex gap-1 flex-shrink-0">
        <button onClick={() => onAction('view', ev)}
          className="w-7 h-7 rounded-lg bg-[rgba(84,172,191,0.08)] flex items-center justify-center text-[#54ACBF] hover:bg-[rgba(84,172,191,0.18)] transition-all">
          <Eye size={12} />
        </button>
        <button onClick={() => onAction('delete', ev)}
          className="w-7 h-7 rounded-lg bg-[rgba(252,165,165,0.06)] flex items-center justify-center text-[#FCA5A5] hover:bg-[rgba(252,165,165,0.15)] transition-all">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════
export default function AdminDashboardPage() {
  const [tab,        setTab]        = useState<AdminTab>('overview');
  const [userSearch, setUserSearch] = useState('');
  const [eventSearch,setEventSearch]= useState('');
  const [toast,      setToast]      = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleUserAction(action: string, user: typeof RECENT_USERS[0]) {
    if (action === 'suspend')   showToast(`${user.name} suspended.`);
    if (action === 'unsuspend') showToast(`${user.name} re-activated.`);
    if (action === 'view')      showToast(`Viewing ${user.name}'s profile…`);
  }

  function handleEventAction(action: string, ev: typeof RECENT_EVENTS[0]) {
    if (action === 'delete') showToast(`Event "${ev.title}" deleted.`);
    if (action === 'view')   showToast(`Viewing "${ev.title}"…`);
  }

  const filteredUsers  = RECENT_USERS.filter(u => !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));
  const filteredEvents = RECENT_EVENTS.filter(e => !eventSearch || e.title.toLowerCase().includes(eventSearch.toLowerCase()) || e.org.toLowerCase().includes(eventSearch.toLowerCase()));
  const flaggedCount   = RECENT_USERS.filter(u => u.flagged).length + RECENT_EVENTS.filter(e => e.flagged).length;

  const ADMIN_TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview',   icon: <BarChart2 size={14} />  },
    { id: 'users',    label: 'Users',      icon: <Users size={14} />      },
    { id: 'events',   label: 'Events',     icon: <Calendar size={14} />   },
    { id: 'cities',   label: 'Cities',     icon: <MapPin size={14} />     },
    { id: 'system',   label: 'System',     icon: <Activity size={14} />   },
  ];

  return (
    <div className="bg-[#011C40] min-h-screen">

      {/* Admin header bar */}
      <div className="bg-[rgba(252,165,165,0.05)] border-b border-[rgba(252,165,165,0.15)]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[rgba(252,165,165,0.12)] border border-[rgba(252,165,165,0.25)] flex items-center justify-center">
              <Shield size={16} className="text-[#FCA5A5]" />
            </div>
            <div>
              <span className="font-mono text-[#FCA5A5] text-[10px] tracking-[3px] uppercase block">Admin Portal</span>
              <span className="font-display font-black text-[#F0FAFB] text-lg uppercase leading-none">Control Centre</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {flaggedCount > 0 && (
              <div className="flex items-center gap-1.5 bg-[rgba(252,211,77,0.1)] border border-[rgba(252,211,77,0.3)] rounded-xl px-3 py-1.5">
                <AlertCircle size={13} className="text-[#FCD34D]" />
                <span className="font-display font-bold text-[#FCD34D] text-xs uppercase tracking-wide">{flaggedCount} Flagged</span>
              </div>
            )}
            <button className="btn-outline text-xs py-2 px-4 flex items-center gap-2">
              <Download size={13} /> Export
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 space-y-6">

        {/* Tab nav */}
        <SR>
          <div className="flex gap-1 bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-xl p-1 overflow-x-auto">
            {ADMIN_TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 flex-shrink-0 px-4 py-2.5 rounded-lg font-display font-bold text-xs uppercase tracking-wide transition-all ${
                  tab === t.id
                    ? 'bg-[rgba(84,172,191,0.15)] text-[#A7EBF2]'
                    : 'text-[#8BBFCC] hover:text-[#A7EBF2]'
                }`}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>
        </SR>

        {/* ── OVERVIEW TAB ── */}
        {tab === 'overview' && (
          <div className="space-y-6">
            {/* Platform stats grid */}
            <SR delay={0.05}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {PLATFORM_STATS.map((s, i) => (
                  <motion.div key={s.label}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-[rgba(2,56,89,0.5)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-4 hover:border-[rgba(84,172,191,0.25)] transition-colors">
                    <div className="flex items-center justify-between mb-2" style={{ color: s.color }}>
                      {s.icon}
                      {s.up
                        ? <ArrowUp size={11} className="text-[#6EE07A]" />
                        : <ArrowDown size={11} className="text-[#FCA5A5]" />}
                    </div>
                    <div className="font-display font-black leading-none mb-1"
                      style={{ fontSize: 'clamp(20px, 2.5vw, 30px)', color: s.color }}>
                      {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
                    </div>
                    <div className="font-display font-bold text-[#8BBFCC] text-[9px] uppercase tracking-[2px] mb-1">{s.label}</div>
                    <div className="font-sans text-[#54ACBF] text-[10px]">{s.delta}</div>
                  </motion.div>
                ))}
              </div>
            </SR>

            {/* Activity feed + flagged */}
            <div className="grid lg:grid-cols-[1fr_320px] gap-5">
              {/* Activity feed */}
              <SR delay={0.1}>
                <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(84,172,191,0.1)]">
                    <div className="flex items-center gap-2">
                      <Activity size={15} className="text-[#54ACBF]" />
                      <h3 className="font-display font-black text-[#F0FAFB] text-sm uppercase tracking-wide">Live Activity</h3>
                    </div>
                    <button className="text-[#54ACBF] hover:text-[#A7EBF2] transition-colors">
                      <RefreshCw size={14} />
                    </button>
                  </div>
                  <div className="divide-y divide-[rgba(84,172,191,0.06)] max-h-96 overflow-y-auto">
                    {ACTIVITY_FEED.map((item, i) => (
                      <div key={i} className={`flex items-start gap-3 px-5 py-3 ${item.action ? 'bg-[rgba(252,211,77,0.03)]' : ''}`}>
                        <span className="text-base flex-shrink-0">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-[#8BBFCC] text-xs leading-snug">{item.text}</p>
                          <p className="font-mono text-[#54ACBF] text-[10px] mt-0.5">{item.time}</p>
                        </div>
                        {item.action && (
                          <button className="flex-shrink-0 text-[9px] font-mono uppercase tracking-[1.5px] px-2 py-1 rounded border border-[rgba(252,211,77,0.3)] text-[#FCD34D] hover:bg-[rgba(252,211,77,0.1)] transition-colors">
                            Review
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </SR>

              {/* Right: pending approvals + quick links */}
              <div className="space-y-4">
                <SR delay={0.12}>
                  <div className="bg-[rgba(252,211,77,0.05)] border border-[rgba(252,211,77,0.2)] rounded-2xl overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[rgba(252,211,77,0.1)]">
                      <AlertCircle size={14} className="text-[#FCD34D]" />
                      <h3 className="font-display font-black text-[#FCD34D] text-sm uppercase tracking-wide">
                        Needs Attention ({flaggedCount})
                      </h3>
                    </div>
                    <div className="divide-y divide-[rgba(252,211,77,0.07)]">
                      {[...RECENT_USERS.filter(u => u.flagged), ...RECENT_EVENTS.filter(e => e.flagged)].map((item: any, i) => (
                        <div key={i} className="flex items-center gap-3 px-5 py-3">
                          <AlertCircle size={12} className="text-[#FCD34D] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-display font-bold text-[#F0FAFB] text-xs uppercase tracking-wide truncate">
                              {item.name || item.title}
                            </p>
                            <p className="font-sans text-[#8BBFCC] text-[11px]">
                              {item.role ? `${item.role} · ${item.status}` : `${item.org} · ${item.status}`}
                            </p>
                          </div>
                          <button className="flex-shrink-0 text-[9px] font-mono uppercase tracking-[1.5px] px-2 py-1 rounded border border-[rgba(252,211,77,0.3)] text-[#FCD34D] hover:bg-[rgba(252,211,77,0.1)] transition-colors">
                            Review
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </SR>

                <SR delay={0.14}>
                  <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-4 space-y-2">
                    <p className="font-mono text-[#54ACBF] text-[10px] uppercase tracking-[2px] mb-3">Quick Actions</p>
                    {[
                      { label: 'Export All Volunteer Data', icon: <Download size={13} />, color: '#A7EBF2'  },
                      { label: 'Recalculate All MQ Scores', icon: <Zap size={13} />,      color: '#6EE07A'  },
                      { label: 'Send Platform Announcement',icon: <Bell size={13} />,      color: '#FCD34D'  },
                      { label: 'Database Backup',           icon: <Database size={13} />,  color: '#C4B5FD'  },
                    ].map(item => (
                      <button key={item.label} onClick={() => showToast(`${item.label}…`)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[rgba(84,172,191,0.06)] transition-colors group text-left">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${item.color}18`, color: item.color }}>
                          {item.icon}
                        </div>
                        <span className="font-display font-bold text-[#8BBFCC] text-xs uppercase tracking-wide group-hover:text-[#F0FAFB] transition-colors">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </SR>
              </div>
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {tab === 'users' && (
          <div className="space-y-5">
            <SR>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div>
                  <h2 className="font-display font-black text-[#F0FAFB] uppercase text-2xl tracking-wide">
                    User <span className="text-[#54ACBF]">Management</span>
                  </h2>
                  <p className="font-sans text-[#8BBFCC] text-sm">12,483 registered accounts</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#54ACBF]" />
                  <input type="text" value={userSearch} onChange={e => setUserSearch(e.target.value)}
                    placeholder="Search name or email…" className="input h-10 pl-9 text-sm" />
                </div>
              </div>
            </SR>

            {/* Tier distribution */}
            <SR delay={0.05}>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                {[
                  { tier: 'New',      count: 2100, color: '#9CA3AF' },
                  { tier: 'Volunteer',count: 4800, color: '#6EE07A' },
                  { tier: 'Bronze',   count: 2900, color: '#CD7F32' },
                  { tier: 'Silver',   count: 1600, color: '#C0C0C0' },
                  { tier: 'Gold',     count: 720,  color: '#FFD700' },
                  { tier: 'Platinum', count: 290,  color: '#E5E4E2' },
                  { tier: 'Diamond',  count: 73,   color: '#A7EBF2' },
                ].map(t => (
                  <div key={t.tier} className="bg-[rgba(2,56,89,0.5)] border border-[rgba(84,172,191,0.1)] rounded-xl p-3 text-center">
                    <div className="font-display font-black text-xl leading-none mb-0.5" style={{ color: t.color }}>
                      {t.count >= 1000 ? `${(t.count/1000).toFixed(1)}K` : t.count}
                    </div>
                    <div className="font-display font-bold text-[#8BBFCC] text-[9px] uppercase tracking-[1.5px]">{t.tier}</div>
                  </div>
                ))}
              </div>
            </SR>

            <SR delay={0.08}>
              <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[rgba(84,172,191,0.1)]">
                  <h3 className="font-display font-black text-[#F0FAFB] text-sm uppercase tracking-wide">
                    Recent & Flagged Users
                  </h3>
                </div>
                <div className="divide-y divide-[rgba(84,172,191,0.06)]">
                  {filteredUsers.map(user => (
                    <UserRow key={user.id} user={user} onAction={handleUserAction} />
                  ))}
                </div>
              </div>
            </SR>
          </div>
        )}

        {/* ── EVENTS TAB ── */}
        {tab === 'events' && (
          <div className="space-y-5">
            <SR>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div>
                  <h2 className="font-display font-black text-[#F0FAFB] uppercase text-2xl tracking-wide">
                    Event <span className="text-[#54ACBF]">Moderation</span>
                  </h2>
                  <p className="font-sans text-[#8BBFCC] text-sm">320+ events total · 18 active</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#54ACBF]" />
                  <input type="text" value={eventSearch} onChange={e => setEventSearch(e.target.value)}
                    placeholder="Search events or orgs…" className="input h-10 pl-9 text-sm" />
                </div>
              </div>
            </SR>

            <SR delay={0.05}>
              <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[rgba(84,172,191,0.1)] flex items-center justify-between">
                  <h3 className="font-display font-black text-[#F0FAFB] text-sm uppercase tracking-wide">
                    Upcoming & Draft Events
                  </h3>
                  <span className="font-mono text-[#54ACBF] text-xs">{filteredEvents.length} shown</span>
                </div>
                <div>
                  {filteredEvents.map(ev => (
                    <EventRow key={ev.id} ev={ev} onAction={handleEventAction} />
                  ))}
                </div>
              </div>
            </SR>
          </div>
        )}

        {/* ── CITIES TAB ── */}
        {tab === 'cities' && (
          <div className="space-y-5">
            <SR>
              <h2 className="font-display font-black text-[#F0FAFB] uppercase text-2xl tracking-wide">
                City <span className="text-[#54ACBF]">Breakdown</span>
              </h2>
            </SR>
            <SR delay={0.05}>
              <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[rgba(84,172,191,0.1)] grid grid-cols-4 gap-4">
                  {['City', 'Volunteers', 'Events', 'Hours'].map(h => (
                    <span key={h} className="font-mono text-[#54ACBF] text-[10px] uppercase tracking-[2px]">{h}</span>
                  ))}
                </div>
                {CITY_BREAKDOWN.map((row, i) => (
                  <motion.div key={row.city}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="grid grid-cols-4 gap-4 px-5 py-4 border-b border-[rgba(84,172,191,0.06)] last:border-0 hover:bg-[rgba(84,172,191,0.03)] transition-colors">
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-[#54ACBF]" />
                      <span className="font-display font-black text-[#F0FAFB] text-sm uppercase tracking-wide">{row.city}</span>
                    </div>
                    <span className="font-display font-bold text-[#A7EBF2] text-sm">{row.volunteers.toLocaleString()}</span>
                    <span className="font-display font-bold text-[#6EE07A] text-sm">{row.events}</span>
                    <span className="font-display font-bold text-[#FCD34D] text-sm">{row.hours}</span>
                  </motion.div>
                ))}
              </div>
            </SR>
          </div>
        )}

        {/* ── SYSTEM TAB ── */}
        {tab === 'system' && (
          <div className="space-y-5">
            <SR>
              <h2 className="font-display font-black text-[#F0FAFB] uppercase text-2xl tracking-wide">
                System <span className="text-[#54ACBF]">Health</span>
              </h2>
            </SR>
            <SR delay={0.05}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SYSTEM_HEALTH.map((item, i) => (
                  <motion.div key={item.label}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`bg-[rgba(2,56,89,0.4)] border rounded-2xl p-5 ${item.status === 'warning' ? 'border-[rgba(252,211,77,0.3)]' : 'border-[rgba(84,172,191,0.12)]'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-display font-bold text-[#8BBFCC] text-xs uppercase tracking-wide">{item.label}</span>
                      <span className={`w-2 h-2 rounded-full ${item.status === 'good' ? 'bg-[#6EE07A]' : 'bg-[#FCD34D] animate-pulse'}`} />
                    </div>
                    <div className="font-display font-black leading-none mb-3"
                      style={{ fontSize: 28, color: item.status === 'good' ? '#6EE07A' : '#FCD34D' }}>
                      {item.value}
                    </div>
                    <div className="h-2 bg-[rgba(84,172,191,0.1)] rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full"
                        style={{ background: item.status === 'good' ? '#6EE07A' : '#FCD34D' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.bar}%` }}
                        transition={{ duration: 0.7, delay: i * 0.06 }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </SR>

            <SR delay={0.12}>
              <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-6">
                <h3 className="font-display font-black text-[#F0FAFB] text-base uppercase tracking-wide mb-4">
                  Platform Configuration
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'MQ Score Recalculation', value: 'Daily at 02:00 IST',       status: 'active'  },
                    { label: 'Certificate Auto-Issue',  value: 'Enabled (48h post-close)', status: 'active'  },
                    { label: 'Email Queue',             value: 'Brevo API (active)',        status: 'active'  },
                    { label: 'SMS Gateway',             value: 'Msg91 (rate limited)',      status: 'warning' },
                    { label: 'Backup Schedule',         value: 'Daily + weekly (Supabase)', status: 'active'  },
                    { label: 'Maintenance Mode',        value: 'Off',                       status: 'active'  },
                  ].map(cfg => (
                    <div key={cfg.label} className="flex items-center justify-between px-4 py-3 bg-[rgba(1,28,64,0.5)] rounded-xl border border-[rgba(84,172,191,0.08)]">
                      <div>
                        <p className="font-display font-bold text-[#F0FAFB] text-xs uppercase tracking-wide">{cfg.label}</p>
                        <p className="font-sans text-[#8BBFCC] text-xs">{cfg.value}</p>
                      </div>
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ml-3 ${cfg.status === 'active' ? 'bg-[#6EE07A]' : 'bg-[#FCD34D] animate-pulse'}`} />
                    </div>
                  ))}
                </div>
              </div>
            </SR>
          </div>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            className="fixed bottom-6 right-6 z-[300] bg-[#023859] border border-[rgba(84,172,191,0.3)] rounded-xl px-5 py-3 flex items-center gap-3 shadow-card"
          >
            <CheckCircle size={15} className="text-[#6EE07A] flex-shrink-0" />
            <span className="font-display font-bold text-[#F0FAFB] text-sm uppercase tracking-wide">{toast}</span>
            <button onClick={() => setToast(null)} className="text-[#8BBFCC] hover:text-[#FCA5A5] transition-colors ml-1">
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}