import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Plus, Calendar, Users, CheckCircle, Clock,
  TrendingUp, Eye, ChevronRight,
  MapPin, BarChart2, Zap, Edit2,
  AlertCircle, Archive,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

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

type EventStatus = 'open' | 'draft' | 'full' | 'closed' | 'upcoming';
interface OrgEvent {
  id: string; title: string; date: string; city: string; status: EventStatus;
  category: string; regCount: number; maxSeats: number; sectors: number;
  image: string; pendingRegs: number;
}

const MOCK_EVENTS: OrgEvent[] = [
  { id: 'e1', title: 'Sabarmati River Clean-Up 2026', date: 'Mar 15, 2026', city: 'Ahmedabad', status: 'open', category: 'Environment', regCount: 87, maxSeats: 120, sectors: 5, pendingRegs: 6, image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=70' },
  { id: 'e2', title: 'Tree Plantation Drive – Gandhinagar', date: 'Mar 22, 2026', city: 'Gandhinagar', status: 'open', category: 'Environment', regCount: 43, maxSeats: 80, sectors: 3, pendingRegs: 2, image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=70' },
  { id: 'e3', title: 'Pruthwee Summit 2026 Volunteer Crew', date: 'Apr 12–13, 2026', city: 'Gandhinagar', status: 'upcoming', category: 'Community', regCount: 12, maxSeats: 50, sectors: 6, pendingRegs: 12, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=70' },
  { id: 'e4', title: 'Health Camp – Rajkot', date: 'Feb 10, 2026', city: 'Rajkot', status: 'closed', category: 'Health', regCount: 65, maxSeats: 65, sectors: 4, pendingRegs: 0, image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=70' },
  { id: 'e5', title: 'Coastal Clean-Up – Surat', date: 'Jan 25, 2026', city: 'Surat', status: 'closed', category: 'Environment', regCount: 110, maxSeats: 100, sectors: 5, pendingRegs: 0, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=70' },
  { id: 'e6', title: 'Education Fair – Vadodara', date: 'Apr 28, 2026', city: 'Vadodara', status: 'draft', category: 'Education', regCount: 0, maxSeats: 60, sectors: 0, pendingRegs: 0, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=70' },
];

const STATUS_META: Record<EventStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  open:     { label: 'Open',     color: '#6EE07A', bg: 'rgba(110,224,122,0.1)',  border: 'rgba(110,224,122,0.3)',  icon: <CheckCircle size={11} /> },
  upcoming: { label: 'Upcoming', color: '#A7EBF2', bg: 'rgba(167,235,242,0.1)', border: 'rgba(167,235,242,0.3)', icon: <Clock size={11} /> },
  draft:    { label: 'Draft',    color: '#FCD34D', bg: 'rgba(252,211,77,0.1)',   border: 'rgba(252,211,77,0.3)',   icon: <Edit2 size={11} /> },
  full:     { label: 'Full',     color: '#F97316', bg: 'rgba(249,115,22,0.1)',   border: 'rgba(249,115,22,0.3)',   icon: <AlertCircle size={11} /> },
  closed:   { label: 'Closed',   color: '#9CA3AF', bg: 'rgba(156,163,175,0.1)', border: 'rgba(156,163,175,0.3)', icon: <Archive size={11} /> },
};

const FILTER_TABS: { id: EventStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All Events' }, { id: 'open', label: 'Open' },
  { id: 'upcoming', label: 'Upcoming' }, { id: 'draft', label: 'Draft' }, { id: 'closed', label: 'Closed' },
];

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="bg-[#023859] border border-[rgba(84,172,191,0.1)] rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="font-mono text-[#8BBFCC] text-[10px] uppercase tracking-[2px]">{label}</span>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <span style={{ color }}>{icon}</span>
        </div>
      </div>
      <p className="font-display font-black text-[#F0FAFB] leading-none mb-1" style={{ fontSize: 'clamp(26px,3vw,36px)' }}>{value}</p>
      {sub && <p className="font-sans text-[#8BBFCC] text-xs">{sub}</p>}
    </div>
  );
}

function EventCard({ event }: { event: OrgEvent }) {
  const meta = STATUS_META[event.status];
  const fillPct = Math.min(Math.round((event.regCount / Math.max(event.maxSeats,1)) * 100), 100);
  const fillColor = fillPct >= 90 ? '#F97316' : fillPct >= 60 ? '#FCD34D' : '#6EE07A';
  return (
    <div className="bg-[#023859] border border-[rgba(84,172,191,0.1)] rounded-2xl overflow-hidden hover:border-[rgba(84,172,191,0.28)] transition-all group">
      <div className="relative h-36 overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#011C40] via-[#011C4060] to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-display font-bold text-[10px] uppercase tracking-wide"
            style={{ color: meta.color, background: meta.bg, borderColor: meta.border }}>
            {meta.icon} {meta.label}
          </span>
        </div>
        {event.pendingRegs > 0 && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[rgba(252,211,77,0.15)] border border-[rgba(252,211,77,0.4)] font-mono text-[#FCD34D] text-[10px]">
              {event.pendingRegs} pending
            </span>
          </div>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <p className="font-mono text-[#54ACBF] text-[10px] uppercase tracking-[2px] mb-1">{event.category}</p>
          <h3 className="font-display font-black text-[#F0FAFB] text-sm uppercase tracking-wide leading-tight line-clamp-2">{event.title}</h3>
        </div>
        <div className="flex items-center gap-3 text-[#8BBFCC]">
          <span className="flex items-center gap-1 text-xs"><Calendar size={11} />{event.date}</span>
          <span className="flex items-center gap-1 text-xs"><MapPin size={11} />{event.city}</span>
        </div>
        {event.status !== 'draft' && (
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-mono text-[#8BBFCC] text-[10px]">{event.regCount} / {event.maxSeats} registered</span>
              <span className="font-mono text-[10px]" style={{ color: fillColor }}>{fillPct}%</span>
            </div>
            <div className="h-1.5 bg-[rgba(84,172,191,0.1)] rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${fillPct}%`, background: fillColor }} />
            </div>
          </div>
        )}
        <div className="flex gap-2 pt-1">
          {(event.status === 'open' || event.status === 'upcoming' || event.status === 'full') ? (
            <>
              <Link to={`/organiser/events/${event.id}/registrations`} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-[rgba(84,172,191,0.1)] border border-[rgba(84,172,191,0.2)] text-[#54ACBF] hover:bg-[rgba(84,172,191,0.18)] transition-colors font-display font-bold text-[10px] uppercase tracking-wide">
                <Users size={11} /> Registrations
              </Link>
              <Link to={`/organiser/events/${event.id}/sectors`} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-[rgba(84,172,191,0.07)] border border-[rgba(84,172,191,0.12)] text-[#8BBFCC] hover:text-[#F0FAFB] hover:border-[rgba(84,172,191,0.3)] transition-colors font-display font-bold text-[10px] uppercase tracking-wide">
                <Zap size={11} /> Manage
              </Link>
            </>
          ) : event.status === 'draft' ? (
            <Link to={`/organiser/events/${event.id}/sectors`} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-[rgba(252,211,77,0.08)] border border-[rgba(252,211,77,0.2)] text-[#FCD34D] hover:bg-[rgba(252,211,77,0.14)] transition-colors font-display font-bold text-[10px] uppercase tracking-wide">
              <Edit2 size={11} /> Continue Setup
            </Link>
          ) : (
            <Link to={`/organiser/events/${event.id}/close`} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-[rgba(84,172,191,0.06)] border border-[rgba(84,172,191,0.1)] text-[#8BBFCC] hover:text-[#F0FAFB] transition-colors font-display font-bold text-[10px] uppercase tracking-wide">
              <Eye size={11} /> View Summary
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrgDashboardPage() {
  const { profile } = useAuthStore();
  const navigate    = useNavigate();
  const [filter, setFilter] = useState<EventStatus | 'all'>('all');
  const orgName = profile?.org_name ?? profile?.fullName ?? 'Your Organisation';
  const filtered = filter === 'all' ? MOCK_EVENTS : MOCK_EVENTS.filter(e => e.status === filter);
  const totalRegs    = MOCK_EVENTS.reduce((s, e) => s + e.regCount, 0);
  const openEvents   = MOCK_EVENTS.filter(e => e.status === 'open' || e.status === 'upcoming').length;
  const totalPending = MOCK_EVENTS.reduce((s, e) => s + e.pendingRegs, 0);
  const totalSeats   = MOCK_EVENTS.reduce((s, e) => s + e.maxSeats, 0);
  const fillRate     = totalSeats > 0 ? Math.round((totalRegs / totalSeats) * 100) : 0;

  return (
    <div className="bg-[#011C40] min-h-screen">
      <div className="bg-[#02294D] border-b border-[rgba(84,172,191,0.1)]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-mono text-[#54ACBF] text-[10px] uppercase tracking-[2px] mb-1">Organiser Portal</p>
              <h1 className="font-display font-black text-[#F0FAFB] uppercase leading-none" style={{ fontSize: 'clamp(22px,3vw,36px)' }}>{orgName}</h1>
              <p className="font-sans text-[#8BBFCC] text-sm mt-1">Manage your events and volunteer workforce</p>
            </div>
            <button onClick={() => navigate('/organiser/events/create')} className="btn-primary inline-flex items-center gap-2 self-start sm:self-auto">
              <Plus size={16} /> Create Event
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 space-y-8">
        <SR>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Calendar size={16} />}    label="Active Events"  value={openEvents}     sub={`${MOCK_EVENTS.length} total`}   color="#54ACBF" />
            <StatCard icon={<Users size={16} />}       label="Registrations"  value={totalRegs}      sub="across all events"               color="#6EE07A" />
            <StatCard icon={<TrendingUp size={16} />}  label="Fill Rate"      value={`${fillRate}%`} sub={`${totalSeats} total seats`}     color="#A7EBF2" />
            <StatCard icon={<AlertCircle size={16} />} label="Pending Review" value={totalPending}   sub="awaiting decision"               color="#FCD34D" />
          </div>
        </SR>

        <SR delay={0.05}>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {FILTER_TABS.map(tab => (
              <button key={tab.id} onClick={() => setFilter(tab.id as EventStatus | 'all')}
                className={`flex-shrink-0 px-4 py-2 rounded-xl border font-display font-bold text-xs uppercase tracking-wide transition-all ${
                  filter === tab.id
                    ? 'bg-[rgba(84,172,191,0.15)] border-[#54ACBF] text-[#A7EBF2]'
                    : 'border-[rgba(84,172,191,0.12)] text-[#8BBFCC] hover:border-[rgba(84,172,191,0.3)] hover:text-[#F0FAFB]'
                }`}>
                {tab.label}
                <span className="ml-1.5 font-mono text-[10px] opacity-60">
                  {tab.id === 'all' ? MOCK_EVENTS.length : MOCK_EVENTS.filter(e => e.status === tab.id).length}
                </span>
              </button>
            ))}
          </div>
        </SR>

        <SR delay={0.1}>
          {filtered.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[rgba(84,172,191,0.15)] rounded-2xl">
              <Calendar size={32} className="text-[#54ACBF] mx-auto mb-3 opacity-50" />
              <p className="font-display font-bold text-[#8BBFCC] text-sm uppercase tracking-wide">No events in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((event, i) => (
                <motion.div key={event.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.05 }}>
                  <EventCard event={event} />
                </motion.div>
              ))}
              {(filter === 'all' || filter === 'draft') && (
                <button onClick={() => navigate('/organiser/events/create')}
                  className="border-2 border-dashed border-[rgba(84,172,191,0.15)] rounded-2xl flex flex-col items-center justify-center gap-3 py-16 hover:border-[rgba(84,172,191,0.35)] hover:bg-[rgba(84,172,191,0.03)] transition-all group min-h-[280px]">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(84,172,191,0.08)] border border-[rgba(84,172,191,0.2)] flex items-center justify-center group-hover:bg-[rgba(84,172,191,0.14)] transition-colors">
                    <Plus size={20} className="text-[#54ACBF]" />
                  </div>
                  <div className="text-center">
                    <p className="font-display font-bold text-[#8BBFCC] text-sm uppercase tracking-wide group-hover:text-[#F0FAFB] transition-colors">New Event</p>
                    <p className="font-sans text-[#8BBFCC] text-xs mt-1 opacity-60">Start from scratch</p>
                  </div>
                </button>
              )}
            </div>
          )}
        </SR>

        <SR delay={0.15}>
          <div className="bg-[#023859] border border-[rgba(84,172,191,0.1)] rounded-2xl p-6">
            <p className="font-mono text-[#54ACBF] text-[10px] uppercase tracking-[2px] mb-4">Quick Actions</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Review Pending',      icon: <AlertCircle size={16} />, to: '/organiser/events/e1/registrations', color: '#FCD34D', count: totalPending },
                { label: 'Allocate Volunteers', icon: <Zap size={16} />,         to: '/organiser/events/e1/allocations',   color: '#A7EBF2', count: null },
                { label: 'Send Message',        icon: <BarChart2 size={16} />,   to: '/organiser/events/e1/messages',      color: '#6EE07A', count: null },
                { label: 'Close Event',         icon: <Archive size={16} />,     to: '/organiser/events/e1/close',         color: '#9CA3AF', count: null },
              ].map(action => (
                <Link key={action.label} to={action.to}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[rgba(84,172,191,0.1)] hover:border-[rgba(84,172,191,0.25)] hover:bg-[rgba(84,172,191,0.05)] transition-all group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${action.color}18` }}>
                    <span style={{ color: action.color }}>{action.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-[#8BBFCC] group-hover:text-[#F0FAFB] text-xs uppercase tracking-wide transition-colors truncate">{action.label}</p>
                    {action.count !== null && action.count > 0 && <p className="font-mono text-[10px]" style={{ color: action.color }}>{action.count} items</p>}
                  </div>
                  <ChevronRight size={12} className="text-[#54ACBF] ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </SR>
      </div>
    </div>
  );
}