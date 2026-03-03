import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, MapPin, Calendar, Users,
  X, ChevronDown, Flame, Star, ArrowRight
} from 'lucide-react';
import { EVENT_CATEGORIES, CITIES, EVENTS_PER_PAGE } from '../constants';
import { useDebounce } from '../hooks';
import type { EventCategory } from '../types';
import { EventsPageSkeleton } from '../components/ui/Skeletons';

// ─────────────────────────────────────────────
//  MOCK EVENTS DATA (replace with Supabase)
// ─────────────────────────────────────────────
const ALL_EVENTS = [
  { id: '1',  title: 'Sabarmati River Clean-Up',          city: 'Ahmedabad',  date: 'Apr 15, 2026', dateRaw: '2026-04-15', seats: 18,  capacity: 60,  category: 'environment' as EventCategory, status: 'open',      banner: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=700&q=80',  is_featured: true,  is_trending: true,  org: 'Paryavaran Trust' },
  { id: '2',  title: 'Tree Plantation Drive',              city: 'Gandhinagar',date: 'Apr 22, 2026', dateRaw: '2026-04-22', seats: 6,   capacity: 40,  category: 'environment' as EventCategory, status: 'open',      banner: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=700&q=80',  is_featured: false, is_trending: true,  org: 'Green India NGO' },
  { id: '3',  title: 'Youth Education Camp',               city: 'Surat',      date: 'May 5, 2026',  dateRaw: '2026-05-05', seats: 32,  capacity: 50,  category: 'education'   as EventCategory, status: 'open',      banner: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&q=80',  is_featured: true,  is_trending: false, org: 'Shiksha Foundation' },
  { id: '4',  title: 'Coastal Clean-Up Initiative',        city: 'Jamnagar',   date: 'May 12, 2026', dateRaw: '2026-05-12', seats: 45,  capacity: 80,  category: 'environment' as EventCategory, status: 'open',      banner: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=700&q=80',  is_featured: false, is_trending: false, org: 'Sea Care India' },
  { id: '5',  title: 'Health Awareness Camp',              city: 'Vadodara',   date: 'May 19, 2026', dateRaw: '2026-05-19', seats: 24,  capacity: 60,  category: 'health'      as EventCategory, status: 'open',      banner: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&q=80',  is_featured: false, is_trending: false, org: 'Arogya Sewa' },
  { id: '6',  title: 'Heritage Walk & Restoration',        city: 'Ahmedabad',  date: 'Jun 1, 2026',  dateRaw: '2026-06-01', seats: 14,  capacity: 30,  category: 'cultural'    as EventCategory, status: 'open',      banner: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=700&q=80',  is_featured: true,  is_trending: false, org: 'Heritage Society Gujarat' },
  { id: '7',  title: 'Marathon Volunteer Drive',           city: 'Mumbai',     date: 'Jun 8, 2026',  dateRaw: '2026-06-08', seats: 120, capacity: 200, category: 'sports'      as EventCategory, status: 'open',      banner: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=80',  is_featured: true,  is_trending: true,  org: 'Mumbai Runners' },
  { id: '8',  title: 'Mangrove Plantation Day',            city: 'Surat',      date: 'Jun 15, 2026', dateRaw: '2026-06-15', seats: 0,   capacity: 40,  category: 'environment' as EventCategory, status: 'open',      banner: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=700&q=80',  is_featured: false, is_trending: false, org: 'Paryavaran Trust' },
  { id: '9',  title: 'Digital Literacy Workshop',          city: 'Rajkot',     date: 'Jun 22, 2026', dateRaw: '2026-06-22', seats: 20,  capacity: 35,  category: 'education'   as EventCategory, status: 'open',      banner: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=700&q=80',  is_featured: false, is_trending: false, org: 'Tech for India' },
  { id: '10', title: 'Blood Donation Camp',                city: 'Ahmedabad',  date: 'Jul 1, 2026',  dateRaw: '2026-07-01', seats: 50,  capacity: 100, category: 'health'      as EventCategory, status: 'open',      banner: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=700&q=80',  is_featured: false, is_trending: true,  org: 'Red Cross Gujarat' },
  { id: '11', title: 'Folk Music Festival Support',        city: 'Gandhinagar',date: 'Jul 10, 2026', dateRaw: '2026-07-10', seats: 30,  capacity: 70,  category: 'cultural'    as EventCategory, status: 'open',      banner: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=700&q=80',  is_featured: false, is_trending: false, org: 'Lok Kala Kendra' },
  { id: '12', title: 'Pruthwee Summit 2026',               city: 'Gandhinagar',date: 'Apr 12, 2026', dateRaw: '2026-04-12', seats: 200, capacity: 500, category: 'environment' as EventCategory, status: 'open',      banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&q=80',  is_featured: true,  is_trending: true,  org: 'Pruthwee Volunteers' },
];

const SORT_OPTIONS = [
  { value: 'soonest', label: 'Soonest First' },
  { value: 'needed',  label: 'Most Needed'   },
  { value: 'newest',  label: 'Recently Added' },
];

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
function seatColor(seats: number, capacity: number) {
  if (seats === 0)             return { text: 'text-[#FCA5A5]', label: 'Full' };
  const pct = seats / capacity;
  if (pct < 0.15)              return { text: 'text-[#FCA5A5]', label: `${seats} left` };
  if (pct < 0.4)               return { text: 'text-[#FCD34D]', label: `${seats} left` };
  return                              { text: 'text-[#6EE07A]',  label: `${seats} left` };
}

const catColor: Record<string, string> = {
  environment: '#6EE07A',
  education:   '#93C5FD',
  health:      '#FCA5A5',
  sports:      '#FCD34D',
  cultural:    '#C4B5FD',
};

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

// ═════════════════════════════════════════════
//  EVENTS PAGE
// ═════════════════════════════════════════════
export default function EventsPage() {
  const [search,   setSearch]   = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [city,     setCity]     = useState('');
  const [category, setCategory] = useState<EventCategory | ''>('');
  const [sortBy,   setSortBy]   = useState('soonest');
  const [page,     setPage]     = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Simulate data loading (replace with real Supabase fetch)
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  // Filter + sort
  const filtered = useMemo(() => {
    let res = [...ALL_EVENTS];

    if (debouncedSearch) res = res.filter(e => e.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || e.city.toLowerCase().includes(debouncedSearch.toLowerCase()));
    if (city)     res = res.filter(e => e.city === city);
    if (category) res = res.filter(e => e.category === category);

    if (sortBy === 'soonest') res.sort((a, b) => a.dateRaw.localeCompare(b.dateRaw));
    if (sortBy === 'needed')  res.sort((a, b) => a.seats - b.seats);
    if (sortBy === 'newest')  res.sort((a, b) => b.id.localeCompare(a.id));

    return res;
  }, [debouncedSearch, city, category, sortBy]);

  const paginated = filtered.slice(0, page * EVENTS_PER_PAGE);
  const hasMore   = paginated.length < filtered.length;

  const featured  = ALL_EVENTS.filter(e => e.is_featured).slice(0, 3);

  const activeFilters = [city, category].filter(Boolean).length;

  if (isLoading) return <EventsPageSkeleton />;

  function clearFilters() {
    setSearch(''); setCity(''); setCategory(''); setSortBy('soonest'); setPage(1);
  }

  return (
    <div className="bg-[#011C40] min-h-screen">

      {/* ── HERO HEADER ── */}
      <section className="relative pt-8 pb-12 border-b border-[rgba(84,172,191,0.1)] overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-label">Pruthwee Volunteers</span>
            <h1
              className="font-display font-black text-[#F0FAFB] uppercase leading-none mb-4"
              style={{ fontSize: 'clamp(40px, 7vw, 80px)' }}
            >
              Find Your{' '}
              <span className="text-[#54ACBF]">Event</span>
            </h1>
            <p className="font-sans text-[#8BBFCC] text-base max-w-lg">
              {ALL_EVENTS.length} volunteer opportunities across {new Set(ALL_EVENTS.map(e => e.city)).size} cities.
              Filter by cause, location, or date to find your perfect match.
            </p>
          </motion.div>

          {/* ── SEARCH BAR ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 flex flex-col md:flex-row gap-3"
          >
            {/* Search input */}
            <div className="relative flex-1">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#54ACBF]" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search events or cities..."
                className="input pl-11 h-12"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#54ACBF] hover:text-[#A7EBF2]">
                  <X size={15} />
                </button>
              )}
            </div>

            {/* City select */}
            <div className="relative">
              <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#54ACBF]" />
              <select
                value={city}
                onChange={e => { setCity(e.target.value); setPage(1); }}
                className="input pl-9 pr-8 h-12 appearance-none md:w-44 cursor-pointer"
              >
                <option value="">All Cities</option>
                {[...new Set(ALL_EVENTS.map(e => e.city))].sort().map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#54ACBF] pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => { setSortBy(e.target.value); setPage(1); }}
                className="input pr-8 h-12 appearance-none md:w-44 cursor-pointer"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#54ACBF] pointer-events-none" />
            </div>

            {/* Filter toggle button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                flex items-center gap-2 h-12 px-5 rounded-lg border font-display font-bold text-sm uppercase tracking-wide transition-all duration-200
                ${showFilters || activeFilters > 0
                  ? 'bg-[rgba(84,172,191,0.15)] border-[#54ACBF] text-[#A7EBF2]'
                  : 'border-[rgba(84,172,191,0.2)] text-[#8BBFCC] hover:border-[#54ACBF] hover:text-[#A7EBF2]'
                }
              `}
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilters > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#54ACBF] text-[#011C40] font-black text-xs flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>
          </motion.div>

          {/* ── CATEGORY FILTER PILLS ── */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => { setCategory(''); setPage(1); }}
                    className={`px-4 py-2 rounded-full border font-display font-bold text-xs uppercase tracking-wide transition-all duration-150 ${
                      category === ''
                        ? 'bg-[rgba(84,172,191,0.15)] border-[#54ACBF] text-[#A7EBF2]'
                        : 'border-[rgba(84,172,191,0.15)] text-[#8BBFCC] hover:border-[#54ACBF]'
                    }`}
                  >
                    All Categories
                  </button>
                  {EVENT_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { setCategory(cat.id as EventCategory); setPage(1); }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full border font-display font-bold text-xs uppercase tracking-wide transition-all duration-150 ${
                        category === cat.id
                          ? 'border-current'
                          : 'border-[rgba(84,172,191,0.15)] text-[#8BBFCC] hover:border-[#54ACBF]'
                      }`}
                      style={category === cat.id ? { color: cat.color, borderColor: cat.color, background: `${cat.color}15` } : {}}
                    >
                      <span>{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}

                  {(activeFilters > 0 || search) && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[rgba(239,68,68,0.3)] text-[#FCA5A5] font-display font-bold text-xs uppercase tracking-wide hover:bg-[rgba(239,68,68,0.08)] transition-all"
                    >
                      <X size={12} /> Clear All
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-12">

        {/* ── FEATURED STRIP ── */}
        {!search && !city && !category && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <div className="flex items-center gap-2 mb-5">
              <Star size={15} className="text-[#FFD700]" />
              <span className="font-display font-black text-[#A7EBF2] text-sm uppercase tracking-[3px]">
                Featured Events
              </span>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {featured.map((ev, i) => (
                <FeaturedCard key={ev.id} ev={ev} delay={i * 0.1} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── RESULTS HEADER ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-black text-[#F0FAFB] text-xl uppercase tracking-wide">
              {filtered.length === 0 ? 'No Events Found' : `${filtered.length} Event${filtered.length !== 1 ? 's' : ''}`}
            </h2>
            {(search || city || category) && (
              <span className="badge badge-teal">Filtered</span>
            )}
          </div>
          {filtered.length > 0 && (
            <span className="font-mono text-[#54ACBF] text-xs tracking-wider">
              Showing {Math.min(paginated.length, filtered.length)} of {filtered.length}
            </span>
          )}
        </div>

        {/* ── EVENTS GRID ── */}
        {filtered.length === 0 ? (
          <EmptyState onClear={clearFilters} />
        ) : (
          <>
            <motion.div
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
              initial="hidden"
              animate="visible"
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {paginated.map(ev => (
                <EventCard key={ev.id} ev={ev} />
              ))}
            </motion.div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="btn-outline px-10 py-3"
                >
                  Load More Events <ChevronDown size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  FEATURED CARD (larger, for featured strip)
// ─────────────────────────────────────────────
function FeaturedCard({ ev, delay }: { ev: typeof ALL_EVENTS[0]; delay: number }) {
  const seat = seatColor(ev.seats, ev.capacity);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Link to={`/events/${ev.id}`} className="block group">
        <div className="relative rounded-2xl overflow-hidden border border-[rgba(84,172,191,0.2)] hover:border-[rgba(84,172,191,0.5)] transition-all duration-250 hover:-translate-y-1.5 hover:shadow-glow">
          {/* Image */}
          <div className="relative h-52 overflow-hidden">
            <img
              src={ev.banner}
              alt={ev.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#011C40] via-[#011C40]/30 to-transparent" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {ev.is_trending && (
                <span className="flex items-center gap-1 badge badge-amber">
                  <Flame size={10} /> Hot
                </span>
              )}
              <span
                className="badge"
                style={{
                  color: catColor[ev.category],
                  background: `${catColor[ev.category]}18`,
                  borderColor: `${catColor[ev.category]}40`,
                }}
              >
                {EVENT_CATEGORIES.find(c => c.id === ev.category)?.icon}{' '}
                {EVENT_CATEGORIES.find(c => c.id === ev.category)?.label}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="bg-[#023859] p-5">
            <div className="font-mono text-[#54ACBF] text-[10px] tracking-[2px] uppercase mb-1">
              {ev.org}
            </div>
            <h3 className="font-display font-black text-[#F0FAFB] text-lg uppercase tracking-wide leading-tight mb-3 group-hover:text-[#A7EBF2] transition-colors">
              {ev.title}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[#8BBFCC] text-xs font-sans">
                  <MapPin size={12} className="text-[#54ACBF]" />
                  {ev.city}
                </div>
                <div className="flex items-center gap-1.5 text-[#8BBFCC] text-xs font-sans">
                  <Calendar size={12} className="text-[#54ACBF]" />
                  {ev.date}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Users size={12} className="text-[#54ACBF]" />
                <span className={`font-display font-bold text-xs uppercase tracking-wide ${seat.text}`}>
                  {seat.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
//  EVENT CARD (grid)
// ─────────────────────────────────────────────
function EventCard({ ev }: { ev: typeof ALL_EVENTS[0] }) {
  const seat    = seatColor(ev.seats, ev.capacity);
  const fillPct = Math.round(((ev.capacity - ev.seats) / ev.capacity) * 100);

  return (
    <motion.div variants={fadeUp}>
      <Link to={`/events/${ev.id}`} className="block group h-full">
        <div className="h-full flex flex-col bg-[#023859] border border-[rgba(84,172,191,0.12)] rounded-2xl overflow-hidden hover:border-[rgba(84,172,191,0.4)] hover:-translate-y-1.5 transition-all duration-250 hover:shadow-card">

          {/* Image */}
          <div className="relative h-44 overflow-hidden flex-shrink-0">
            <img
              src={ev.banner}
              alt={ev.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#023859] via-transparent to-transparent" />

            {/* Category */}
            <div className="absolute top-3 left-3">
              <span
                className="badge"
                style={{
                  color: catColor[ev.category],
                  background: `${catColor[ev.category]}18`,
                  borderColor: `${catColor[ev.category]}40`,
                }}
              >
                {EVENT_CATEGORIES.find(c => c.id === ev.category)?.icon}{' '}
                {EVENT_CATEGORIES.find(c => c.id === ev.category)?.label}
              </span>
            </div>

            {/* Trending */}
            {ev.is_trending && (
              <div className="absolute top-3 right-3">
                <span className="badge badge-amber flex items-center gap-1">
                  <Flame size={10} /> Hot
                </span>
              </div>
            )}

            {/* Full */}
            {ev.seats === 0 && (
              <div className="absolute inset-0 bg-[rgba(1,28,64,0.7)] flex items-center justify-center">
                <span className="font-display font-black text-[#FCA5A5] text-xl uppercase tracking-widest">Full</span>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col p-5">
            <div className="font-mono text-[#54ACBF] text-[9px] tracking-[2px] uppercase mb-1">{ev.org}</div>
            <h3 className="font-display font-black text-[#F0FAFB] text-base uppercase tracking-wide leading-tight mb-3 group-hover:text-[#A7EBF2] transition-colors flex-1">
              {ev.title}
            </h3>

            {/* Meta */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1.5 text-[#8BBFCC] text-xs font-sans">
                <MapPin size={11} className="text-[#54ACBF]" /> {ev.city}
              </div>
              <div className="flex items-center gap-1.5 text-[#8BBFCC] text-xs font-sans">
                <Calendar size={11} className="text-[#54ACBF]" /> {ev.date}
              </div>
            </div>

            {/* Capacity bar */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="font-display font-bold text-[#8BBFCC] text-[10px] uppercase tracking-wide">
                  {fillPct}% filled
                </span>
                <span className={`font-display font-bold text-[10px] uppercase tracking-wide ${seat.text}`}>
                  {seat.label}
                </span>
              </div>
              <div className="h-1.5 bg-[rgba(84,172,191,0.1)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${fillPct}%`,
                    background: fillPct > 85 ? '#FCA5A5' : fillPct > 60 ? '#FCD34D' : '#54ACBF',
                  }}
                />
              </div>
            </div>

            {/* Register button */}
            <div className="flex items-center justify-between pt-3 border-t border-[rgba(84,172,191,0.1)]">
              <span className="font-sans text-[#54ACBF] text-xs">
                {ev.seats === 0 ? 'Waitlist available' : 'Registration open'}
              </span>
              <span className="flex items-center gap-1 font-display font-bold text-[#A7EBF2] text-xs uppercase tracking-wide group-hover:gap-2 transition-all">
                View <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
//  EMPTY STATE
// ─────────────────────────────────────────────
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="font-display font-black text-[#F0FAFB] text-2xl uppercase tracking-wide mb-2">
        No Events Found
      </h3>
      <p className="font-sans text-[#8BBFCC] text-sm mb-6">
        Try adjusting your search terms or removing some filters.
      </p>
      <button onClick={onClear} className="btn-outline">
        Clear All Filters <X size={14} />
      </button>
    </div>
  );
}