import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Clock, Users, ArrowLeft, ArrowRight,
  ChevronDown, Download, Share2, Heart, AlertCircle,
  CheckCircle, Info, X
} from 'lucide-react';
import { openEventRegistration } from '../components/layout/auth/EventRegistrationModal';
import { useAuthStore } from '../store/authStore';
import { EVENT_CATEGORIES } from '../constants';
import type { AuthUser } from '../types';

// ─────────────────────────────────────────────
//  MOCK EVENT DATA (replace with Supabase)
// ─────────────────────────────────────────────
const MOCK_EVENT = {
  id:          '1',
  title:       'Sabarmati River Clean-Up Drive 2026',
  teaser:      'Join 60 volunteers to clean a 3km stretch of the Sabarmati River in Ahmedabad. Equipment and refreshments provided.',
  description: `The Sabarmati River is the lifeline of Ahmedabad, but years of industrial runoff, plastic waste, and urban pollution have taken their toll. 

This clean-up drive brings together volunteers from across Gujarat for a single day of direct environmental action. We will cover a 3km stretch from Ellis Bridge to Sardar Bridge, collecting over 2 tonnes of waste for proper disposal and recycling.

All equipment is provided — gloves, bags, collection tools. Refreshments will be available throughout the day. A Pruthwee coordinator will guide every sector. You will receive a verified certificate and hours credited immediately after the event.

This event is ideal for first-time volunteers as well as experienced environmentalists. Every person who shows up makes a measurable difference.`,
  category:    'environment',
  date_start:  '2026-04-15',
  date_end:    '2026-04-15',
  date_display:'Tuesday, 15 April 2026',
  time_start:  '07:00',
  time_end:    '13:00',
  venue_name:  'Ellis Bridge, Sabarmati Riverfront',
  venue_address:'Ellis Bridge, Ashram Road, Ahmedabad — 380009, Gujarat',
  city:        'Ahmedabad',
  maps_link:   'https://maps.google.com/?q=Ellis+Bridge+Ahmedabad',
  capacity:    60,
  seats_left:  18,
  status:      'open',
  banner_url:  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1400&q=85',
  photo_urls:  [
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80',
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80',
  ],
  org:         { name: 'Paryavaran Trust', city: 'Ahmedabad', logo: null },
  requirements: [
    { id: 'tshirt', label: 'T-Shirt Size', type: 'select', options: ['XS','S','M','L','XL','XXL'], required: true  },
    { id: 'med',    label: 'Any medical conditions we should know?', type: 'text',   required: false },
    { id: 'first',  label: 'Is this your first Pruthwee event?',    type: 'select', options: ['Yes','No'], required: true },
  ],
  sectors: [
    {
      id: 's1', name: 'River Collection', location: 'Ellis to Nehru Bridge',
      tasks: [
        { id: 't1', name: 'Waste Collection', assignments: [
          { id: 'a1', type: 'allocation', date: '15 Apr', time_start: '07:00', time_end: '10:00', location: 'Zone A', needed: 15, allocated: 12 },
          { id: 'a2', type: 'allocation', date: '15 Apr', time_start: '10:00', time_end: '13:00', location: 'Zone A', needed: 15, allocated: 10 },
        ]},
      ],
    },
    {
      id: 's2', name: 'Sorting & Disposal', location: 'Central Collection Point',
      tasks: [
        { id: 't2', name: 'Waste Sorting', assignments: [
          { id: 'a3', type: 'allocation', date: '15 Apr', time_start: '07:30', time_end: '13:00', location: 'Zone B', needed: 10, allocated: 8 },
        ]},
      ],
    },
    {
      id: 's3', name: 'Logistics & Support', location: 'All Zones',
      tasks: [
        { id: 't3', name: 'Equipment Distribution', assignments: [
          { id: 'a4', type: 'registration', date: '15 Apr', time_start: '06:30', time_end: '07:30', location: 'HQ', needed: 5, allocated: 3 },
        ]},
      ],
    },
  ],
  schedule: [
    { time: '06:30', event: 'Volunteer Assembly & Briefing', location: 'Ellis Bridge HQ' },
    { time: '07:00', event: 'River Clean-Up Begins (All Zones)', location: 'Sabarmati Riverfront' },
    { time: '09:30', event: 'Refreshment Break', location: 'Central Collection Point' },
    { time: '10:00', event: 'Second Collection Phase', location: 'Zones A, B, C' },
    { time: '12:00', event: 'Final Waste Sorting & Weighing', location: 'Zone B' },
    { time: '12:30', event: 'Group Photo & Certificate Distribution', location: 'Ellis Bridge Stage' },
    { time: '13:00', event: 'Volunteer Dispersal', location: '' },
  ],
};

const RELATED_EVENTS = [
  { id: '1', title: 'Sabarmati River Clean-Up Drive 2026', city: 'Ahmedabad', date: 'Apr 15, 2026', banner: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80', seats: 18, org: 'Paryavaran Trust' },
  { id: '2', title: 'Tree Plantation Drive', city: 'Gandhinagar', date: 'Apr 22, 2026', banner: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', seats: 6, org: 'Green India NGO' },
  { id: '3', title: 'Youth Education Camp', city: 'Surat', date: 'May 5, 2026', banner: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80', seats: 32, org: 'Shiksha Foundation' },
  { id: '4', title: 'Coastal Clean-Up Initiative', city: 'Jamnagar', date: 'May 12, 2026', banner: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80', seats: 45, org: 'Sea Care India' },
  { id: '5', title: 'Health Awareness Camp', city: 'Vadodara', date: 'May 19, 2026', banner: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80', seats: 24, org: 'Arogya Sewa' },
  { id: '6', title: 'Heritage Walk & Restoration', city: 'Ahmedabad', date: 'Jun 1, 2026', banner: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80', seats: 14, org: 'Heritage Society Gujarat' },
  { id: '7', title: 'Marathon Volunteer Drive', city: 'Mumbai', date: 'Jun 8, 2026', banner: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', seats: 120, org: 'Mumbai Runners' },
  { id: '8', title: 'Mangrove Plantation Day', city: 'Surat', date: 'Jun 15, 2026', banner: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=400&q=80', seats: 0, org: 'Paryavaran Trust' },
  { id: '9', title: 'Digital Literacy Workshop', city: 'Rajkot', date: 'Jun 22, 2026', banner: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80', seats: 20, org: 'Tech for India' },
  { id: '10', title: 'Blood Donation Camp', city: 'Ahmedabad', date: 'Jul 1, 2026', banner: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&q=80', seats: 50, org: 'Red Cross Gujarat' },
  { id: '11', title: 'Folk Music Festival Support', city: 'Gandhinagar', date: 'Jul 10, 2026', banner: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80', seats: 30, org: 'Lok Kala Kendra' },
  { id: '12', title: 'Pruthwee Summit 2026',        city: 'Gandhinagar', date: 'Apr 12, 2026', banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80', seats: 200, org: 'Pruthwee Volunteers' },
];

type EventDetailData = typeof MOCK_EVENT;

const EVENT_OVERRIDES: Record<string, Partial<EventDetailData>> = {
  '1': {
    category: 'environment',
    time_start: '07:00',
    time_end: '13:00',
    venue_name: 'Ellis Bridge, Sabarmati Riverfront',
    venue_address: 'Ellis Bridge, Ashram Road, Ahmedabad — 380009, Gujarat',
    maps_link: 'https://maps.google.com/?q=Ellis+Bridge+Ahmedabad',
  },
  '2': {
    category: 'environment',
    teaser: 'Join volunteers in Gandhinagar to plant native saplings and restore local green cover.',
    time_start: '08:00',
    time_end: '13:00',
    venue_name: 'Sector 7 Park, Gandhinagar',
    venue_address: 'Sector 7 Park, Gandhinagar, Gujarat',
    maps_link: 'https://maps.google.com/?q=Sector+7+Park+Gandhinagar',
    org: { name: 'Green India NGO', city: 'Gandhinagar', logo: null },
  },
  '4': {
    category: 'environment',
    teaser: 'A one-day coastal mission to remove waste and protect marine biodiversity in Jamnagar.',
    time_start: '07:30',
    time_end: '14:00',
    venue_name: 'Coastal Belt, Jamnagar',
    venue_address: 'Sea Care Assembly Point, Jamnagar, Gujarat',
    maps_link: 'https://maps.google.com/?q=Jamnagar+coastal+cleanup',
    org: { name: 'Sea Care India', city: 'Jamnagar', logo: null },
  },
  '8': {
    category: 'environment',
    teaser: 'Work with local experts to plant mangroves and improve shoreline resilience in Surat.',
    time_start: '06:30',
    time_end: '12:30',
    venue_name: 'Mangrove Belt, Surat',
    venue_address: 'Mangrove Zone, Surat Coastal Area, Gujarat',
    maps_link: 'https://maps.google.com/?q=Surat+mangrove+plantation',
    org: { name: 'Paryavaran Trust', city: 'Surat', logo: null },
  },
  '12': {
    category: 'cultural',
    teaser: 'Pruthwee Summit 2026 brings delegates, organisers, and volunteers together for two days of impact.',
    time_start: '08:00',
    time_end: '18:30',
    venue_name: 'Mahatma Mandir, Gandhinagar',
    venue_address: 'Mahatma Mandir Convention Center, Gandhinagar, Gujarat',
    maps_link: 'https://maps.google.com/?q=Mahatma+Mandir+Gandhinagar',
    org: { name: 'Pruthwee Volunteers', city: 'Gandhinagar', logo: null },
    capacity: 500,
  },
};

function resolveEventById(routeId?: string): EventDetailData | null {
  const safeId = routeId ?? '1';
  const summary = RELATED_EVENTS.find(ev => ev.id === safeId);
  if (!summary) return null;

  const override = EVENT_OVERRIDES[safeId] ?? {};
  return {
    ...MOCK_EVENT,
    ...override,
    id: safeId,
    title: summary.title,
    city: summary.city,
    date_display: summary.date,
    seats_left: summary.seats,
    banner_url: summary.banner,
    org: {
      ...MOCK_EVENT.org,
      ...(override.org ?? {}),
      name: override.org?.name ?? summary.org ?? MOCK_EVENT.org.name,
      city: override.org?.city ?? summary.city,
    },
  };
}

const TABS = ['Overview', 'Schedule', 'Sectors', 'Location'] as const;
type Tab = typeof TABS[number];

const catColor: Record<string, string> = {
  environment: '#6EE07A',
  education:   '#93C5FD',
  health:      '#FCA5A5',
  sports:      '#FCD34D',
  cultural:    '#C4B5FD',
};

// ═════════════════════════════════════════════
//  EVENT DETAIL PAGE
// ═════════════════════════════════════════════
export default function EventDetailPage() {
  const { id: routeId } = useParams();
  const event = useMemo(() => resolveEventById(routeId), [routeId]);
  const { user }  = useAuthStore();
  const [tab, setTab]           = useState<Tab>('Overview');
  const [wishlist, setWishlist]  = useState(false);
  const [seatsLeft, setSeatsLeft]= useState(event?.seats_left ?? 0);
  const [showShareToast, setShowShareToast] = useState(false);

  useEffect(() => {
    if (!event) return;
    setTab('Overview');
    setWishlist(false);
    setSeatsLeft(event.seats_left);
  }, [event]);

  // Simulated real-time seat update
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeatsLeft(s => Math.max(0, s - Math.round(Math.random())));
    }, 8000);
    return () => clearInterval(intervalId);
  }, [event?.id]);

  function handleShare() {
    navigator.clipboard?.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
  }

  if (!event) {
    return (
      <div className="bg-[#0C0C0C] min-h-screen flex items-center justify-center px-5">
        <div className="text-center">
          <h1 className="heading-gradient font-display font-black text-[#F2F2F2] text-2xl uppercase tracking-wide mb-3">Event not found</h1>
          <p className="font-sans text-[#888888] text-sm mb-5">This event link is invalid or no longer available.</p>
          <Link to="/events" className="btn-primary">Back to Events</Link>
        </div>
      </div>
    );
  }

  const fillPct = Math.round(((event.capacity - seatsLeft) / event.capacity) * 100);
  const catInfo = EVENT_CATEGORIES.find(c => c.id === event.category);
  const relatedEvents = RELATED_EVENTS.filter(ev => ev.id !== event.id).slice(0, 3);

  return (
    <div className="bg-[#0C0C0C] min-h-screen">

      {/* ── HERO BANNER ── */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={event.banner_url}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C0C]/60 to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-6">
          <Link
            to="/events"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(12,12,12,0.7)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] text-[#888888] hover:text-[#F2F2F2] font-display font-bold text-sm uppercase tracking-wide transition-all"
          >
            <ArrowLeft size={15} /> All Events
          </Link>
        </div>

        {/* Action buttons */}
        <div className="absolute top-6 right-6 flex gap-2">
          <button
            onClick={() => setWishlist(!wishlist)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm border transition-all ${
              wishlist
                ? 'bg-[rgba(239,68,68,0.2)] border-[rgba(239,68,68,0.4)] text-[#FCA5A5]'
                : 'bg-[rgba(12,12,12,0.7)] border-[rgba(255,255,255,0.1)] text-[#888888] hover:text-[#FCA5A5]'
            }`}
          >
            <Heart size={16} fill={wishlist ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-lg flex items-center justify-center bg-[rgba(12,12,12,0.7)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] text-[#888888] hover:text-[#CCFF00] transition-all"
          >
            <Share2 size={16} />
          </button>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="badge"
                style={{
                  color: catColor[event.category],
                  background: `${catColor[event.category]}18`,
                  borderColor: `${catColor[event.category]}40`,
                }}
              >
                {catInfo?.icon} {catInfo?.label}
              </span>
              <span className="badge badge-green">Registration Open</span>
            </div>
            <h1
              className="heading-gradient font-display font-black text-[#F2F2F2] uppercase leading-none"
              style={{ fontSize: 'clamp(28px, 5vw, 60px)' }}
            >
              {event.title}
            </h1>
          </div>
        </div>
      </section>

      {/* ── META BAR ── */}
      <div className="bg-[#141414] border-b border-[rgba(255,255,255,0.07)]">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-4">
          <div className="flex flex-wrap items-center gap-5 md:gap-8">
            <div className="flex items-center gap-2 text-[#888888] text-sm font-sans">
              <Calendar size={15} className="text-[#CCFF00]" />
              {event.date_display}
            </div>
            <div className="flex items-center gap-2 text-[#888888] text-sm font-sans">
              <Clock size={15} className="text-[#CCFF00]" />
              {event.time_start} – {event.time_end}
            </div>
            <div className="flex items-center gap-2 text-[#888888] text-sm font-sans">
              <MapPin size={15} className="text-[#CCFF00]" />
              {event.venue_name}, {event.city}
            </div>
            {/* Real-time seats */}
            <div className="flex items-center gap-2 ml-auto">
              <Users size={15} className="text-[#CCFF00]" />
              <span
                className={`font-display font-black text-sm uppercase tracking-wide transition-colors duration-500 ${
                  seatsLeft === 0 ? 'text-[#FCA5A5]' :
                  seatsLeft < 10 ? 'text-[#FCA5A5] animate-pulse' :
                  seatsLeft < 20 ? 'text-[#FCD34D]' : 'text-[#6EE07A]'
                }`}
              >
                {seatsLeft === 0 ? 'FULL' : `${seatsLeft} Seats Left`}
              </span>
              <span className="font-mono text-[#CCFF00] text-[10px]">/ {event.capacity}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-10">
        <div className="grid lg:grid-cols-[1fr_360px] gap-10">

          {/* LEFT COLUMN */}
          <div>
            {/* Tabs */}
            <div className="tab-list mb-0">
              {TABS.map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`tab ${tab === t ? 'active' : ''}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="pt-8"
              >
                {tab === 'Overview'  && <OverviewTab event={event} />}
                {tab === 'Schedule'  && <ScheduleTab event={event} />}
                {tab === 'Sectors'   && <SectorsTab key={event.id} event={event} />}
                {tab === 'Location'  && <LocationTab event={event} />}
              </motion.div>
            </AnimatePresence>

            {/* Photo gallery */}
            <div className="mt-10">
              <h3 className="heading-gradient font-display font-black text-[#F2F2F2] text-lg uppercase tracking-wide mb-4">
                Event Photos
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {event.photo_urls.map((url, i) => (
                  <div key={i} className="aspect-video rounded-xl overflow-hidden">
                    <img src={url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>

            {/* Organiser info */}
            <div className="mt-10 bg-[rgba(20,20,20,0.4)] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6">
              <h3 className="heading-gradient font-display font-black text-[#F2F2F2] text-base uppercase tracking-wide mb-4">
                About the Organiser
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#CCFF00] to-[#888800] flex items-center justify-center flex-shrink-0">
                  <span className="font-display font-black text-[#0C0C0C] text-lg">
                    {event.org.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="heading-gradient font-display font-black text-[#F2F2F2] text-base uppercase tracking-wide">
                    {event.org.name}
                  </div>
                  <div className="font-sans text-[#CCFF00] text-sm">{event.org.city}</div>
                </div>
              </div>
            </div>

            {/* Related events */}
            <div className="mt-10">
              <h3 className="heading-gradient font-display font-black text-[#F2F2F2] text-lg uppercase tracking-wide mb-5">
                Similar Events
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedEvents.map(ev => (
                  <Link key={ev.id} to={`/events/${ev.id}`} className="block group">
                    <div className="bg-[#141414] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden hover:border-[rgba(204,255,0,0.35)] transition-all hover:-translate-y-1">
                      <div className="relative h-24 overflow-hidden">
                        <img src={ev.banner} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
                      </div>
                      <div className="p-3">
                        <div className="heading-gradient font-display font-black text-[#F2F2F2] text-sm uppercase tracking-wide leading-tight mb-1 group-hover:text-[#CCFF00] transition-colors">
                          {ev.title}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-[#888888] text-xs">{ev.city} · {ev.date}</span>
                          <span className={`font-display font-bold text-[10px] uppercase ${ev.seats === 0 ? 'text-[#FCA5A5]' : ev.seats < 10 ? 'text-[#FCD34D]' : 'text-[#6EE07A]'}`}>
                            {ev.seats === 0 ? 'Full' : `${ev.seats} left`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — STICKY REGISTRATION SIDEBAR */}
          <div>
            <div className="lg:sticky lg:top-24">
              <RegistrationSidebar event={event} seatsLeft={seatsLeft} fillPct={fillPct} user={user} />
            </div>
          </div>

        </div>
      </div>

      {/* Share toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 bg-[#141414] border border-[rgba(255,255,255,0.15)] rounded-xl shadow-card"
          >
            <CheckCircle size={16} className="text-[#6EE07A]" />
            <span className="font-display font-bold text-[#F2F2F2] text-sm uppercase tracking-wide">
              Link Copied!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
//  TAB: OVERVIEW
// ─────────────────────────────────────────────
function OverviewTab({ event }: { event: EventDetailData }) {
  return (
    <div>
      <p className="font-sans text-[#888888] text-base leading-relaxed mb-4">
        {event.teaser}
      </p>
      {event.description.split('\n\n').map((para, i) => (
        <p key={i} className="font-sans text-[#888888] text-sm leading-relaxed mb-4">
          {para}
        </p>
      ))}

      {/* What to bring */}
      <div className="mt-6 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Info size={15} className="text-[#CCFF00]" />
          <h4 className="font-display font-black text-[#CCFF00] text-sm uppercase tracking-wide">
            What's Provided
          </h4>
        </div>
        <ul className="space-y-1.5">
          {['Gloves and safety equipment', 'Collection bags and tools', 'Refreshments throughout the day', 'Volunteer coordinator at each sector', 'Verified hours certificate after the event'].map(item => (
            <li key={item} className="flex items-center gap-2 font-sans text-[#888888] text-sm">
              <CheckCircle size={13} className="text-[#6EE07A] flex-shrink-0" /> {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  TAB: SCHEDULE
// ─────────────────────────────────────────────
function ScheduleTab({ event }: { event: EventDetailData }) {
  return (
    <div>
      <h3 className="heading-gradient font-display font-black text-[#F2F2F2] text-lg uppercase tracking-wide mb-6">
        Event Day Schedule
      </h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-16 top-0 bottom-0 w-px bg-gradient-to-b from-[#CCFF00] via-[rgba(204,255,0,0.3)] to-transparent" />

        <div className="space-y-4">
          {event.schedule.map((item, i) => (
            <div key={i} className="flex gap-6 items-start">
              {/* Time */}
              <div className="w-14 flex-shrink-0 text-right">
                <span className="font-display font-black text-[#CCFF00] text-sm uppercase tracking-wide">
                  {item.time}
                </span>
              </div>

              {/* Dot */}
              <div className="relative flex-shrink-0 z-10">
                <div className="w-3 h-3 rounded-full bg-[#CCFF00] mt-1 ring-4 ring-[rgba(204,255,0,0.15)]" />
              </div>

              {/* Content */}
              <div className="flex-1 bg-[rgba(20,20,20,0.4)] border border-[rgba(204,255,0,0.1)] rounded-xl p-4 hover:border-[rgba(255,255,255,0.12)] transition-colors">
                <div className="heading-gradient font-display font-black text-[#F2F2F2] text-sm uppercase tracking-wide">
                  {item.event}
                </div>
                {item.location && (
                  <div className="flex items-center gap-1.5 mt-1 font-sans text-[#888888] text-xs">
                    <MapPin size={11} className="text-[#CCFF00]" /> {item.location}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  TAB: SECTORS
// ─────────────────────────────────────────────
function SectorsTab({ event }: { event: EventDetailData }) {
  const [open, setOpen] = useState<string | null>('s1');

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <h3 className="heading-gradient font-display font-black text-[#F2F2F2] text-lg uppercase tracking-wide">
          Volunteer Sectors
        </h3>
        <span className="badge badge-teal">{event.sectors.length} Sectors</span>
      </div>
      <p className="font-sans text-[#888888] text-sm mb-6">
        When you register, you can indicate your sector preferences. The organiser will allocate you based on your skills and availability.
      </p>

      <div className="space-y-3">
        {event.sectors.map(sector => (
          <div key={sector.id} className="border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === sector.id ? null : sector.id)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[rgba(204,255,0,0.05)] transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-[#CCFF00] flex-shrink-0" />
              <div className="flex-1">
                <div className="heading-gradient font-display font-black text-[#F2F2F2] text-sm uppercase tracking-wide">
                  {sector.name}
                </div>
                <div className="flex items-center gap-1.5 font-sans text-[#888888] text-xs mt-0.5">
                  <MapPin size={10} className="text-[#CCFF00]" /> {sector.location}
                </div>
              </div>
              <ChevronDown
                size={16}
                className={`text-[#CCFF00] transition-transform duration-200 ${open === sector.id ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {open === sector.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t border-[rgba(204,255,0,0.1)]">
                    {sector.tasks.map(task => (
                      <div key={task.id} className="mt-4">
                        <div className="font-display font-bold text-[#CCFF00] text-xs uppercase tracking-[2px] mb-2">
                          Task: {task.name}
                        </div>
                        <div className="space-y-2">
                          {task.assignments.map(a => (
                            <div key={a.id} className="flex items-center justify-between bg-[rgba(12,12,12,0.5)] rounded-lg px-4 py-2.5">
                              <div className="flex items-center gap-3">
                                <span className={`w-1.5 h-1.5 rounded-full ${a.type === 'allocation' ? 'bg-[#6EE07A]' : 'bg-[#FCD34D]'}`} />
                                <span className="font-display font-bold text-[#F2F2F2] text-sm uppercase tracking-wide">
                                  {a.date} · {a.time_start}–{a.time_end}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-sans text-[#888888] text-xs">{a.location}</span>
                                <span className="font-display font-bold text-xs uppercase tracking-wide" style={{
                                  color: a.allocated >= a.needed ? '#FCA5A5' : a.allocated > a.needed * 0.7 ? '#FCD34D' : '#6EE07A'
                                }}>
                                  {a.allocated}/{a.needed}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  TAB: LOCATION
// ─────────────────────────────────────────────
function LocationTab({ event }: { event: EventDetailData }) {
  return (
    <div>
      <h3 className="heading-gradient font-display font-black text-[#F2F2F2] text-lg uppercase tracking-wide mb-4">
        Venue & Directions
      </h3>

      <div className="bg-[rgba(20,20,20,0.4)] border border-[rgba(255,255,255,0.07)] rounded-xl p-5 mb-5">
        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-[#CCFF00] flex-shrink-0 mt-0.5" />
          <div>
            <div className="heading-gradient font-display font-black text-[#F2F2F2] text-base uppercase tracking-wide">
              {event.venue_name}
            </div>
            <div className="font-sans text-[#888888] text-sm mt-1">{event.venue_address}</div>
            <a
              href={event.maps_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 font-display font-bold text-[#CCFF00] text-xs uppercase tracking-wide hover:text-[#CCFF00] transition-colors"
            >
              Open in Google Maps <ArrowRight size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.07)] h-64 bg-[rgba(20,20,20,0.4)] flex items-center justify-center">
        <div className="text-center">
          <MapPin size={32} className="text-[#CCFF00] mx-auto mb-2" />
          <p className="font-display font-bold text-[#888888] text-sm uppercase tracking-wide">
            {event.venue_name}
          </p>
          <a
            href={event.maps_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 btn-outline text-xs py-2 px-4"
          >
            View Map
          </a>
        </div>
      </div>

      {/* Assembly point */}
      <div className="mt-4 flex items-start gap-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4">
        <AlertCircle size={15} className="text-[#FCD34D] flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-display font-black text-[#FCD34D] text-xs uppercase tracking-wide">Assembly Point</span>
          <p className="font-sans text-[#888888] text-sm mt-0.5">
            Report to Ellis Bridge HQ tent at 06:30 AM. Bring photo ID. Your assignment sheet will be distributed on arrival.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  REGISTRATION SIDEBAR
// ─────────────────────────────────────────────
type RegistrationSidebarProps = {
  event: EventDetailData;
  seatsLeft: number;
  fillPct: number;
  user: AuthUser | null;
};

function RegistrationSidebar(props: RegistrationSidebarProps) {
  const { event, seatsLeft, fillPct, user } = props;
  const [availability,   setAvailability]   = useState('full');
  const [sectorPriority, setSectorPriority] = useState<string[]>([]);
  const [answers,        setAnswers]         = useState<Record<string, string>>({});
  const [groupToken,     setGroupToken]      = useState('');
  const [showGroup,      setShowGroup]       = useState(false);
  const [comments,       setComments]        = useState('');

  function toggleSector(id: string) {
    setSectorPriority(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  }

  function handleRegister() {
    openEventRegistration({
      id:        event.id,
      title:     event.title,
      date:      event.date_display,
      org:       event.org.name,
      city:      event.city,
      seatsLeft: seatsLeft,
      banner:    event.banner_url,
    });
  }



  return (
    <div className="bg-[#141414] border border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[rgba(255,255,255,0.07)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="heading-gradient font-display font-black text-[#F2F2F2] text-lg uppercase tracking-wide">
            Register Now
          </h3>
          <span className={`font-display font-black text-sm uppercase tracking-wide ${
            seatsLeft === 0 ? 'text-[#FCA5A5]' :
            seatsLeft < 10 ? 'text-[#FCA5A5]' :
            seatsLeft < 20 ? 'text-[#FCD34D]' : 'text-[#6EE07A]'
          }`}>
            {seatsLeft === 0 ? 'FULL' : `${seatsLeft} spots left`}
          </span>
        </div>

        {/* Capacity bar */}
        <div className="progress-track">
          <div
            className="progress-fill transition-all duration-700"
            style={{
              width: `${fillPct}%`,
              background: fillPct > 85 ? '#FCA5A5' : fillPct > 60 ? '#FCD34D' : undefined,
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="font-mono text-[#CCFF00] text-[9px]">{fillPct}% filled</span>
          <span className="font-mono text-[#CCFF00] text-[9px]">{event.capacity} total</span>
        </div>
      </div>

      {/* Form */}
      <div className="p-5 space-y-5">

        {/* Availability */}
        <div>
          <label className="label">Availability</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'full',   label: 'Full Day'  },
              { value: 'days',   label: 'Some Days' },
              { value: 'shifts', label: 'Shifts'    },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setAvailability(opt.value)}
                className={`py-2 rounded-lg border font-display font-bold text-xs uppercase tracking-wide transition-all duration-150 ${
                  availability === opt.value
                    ? 'bg-[rgba(255,255,255,0.08)] border-[#CCFF00] text-[#CCFF00]'
                    : 'border-[rgba(255,255,255,0.08)] text-[#888888] hover:border-[#CCFF00]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sector preferences */}
        <div>
          <label className="label">
            Sector Preferences
            <span className="font-mono text-[#CCFF00] text-[9px] normal-case ml-2">
              (choose up to 3)
            </span>
          </label>
          <div className="space-y-2">
            {event.sectors.map((s) => (
              <button
                key={s.id}
                onClick={() => toggleSector(s.id)}
                disabled={!sectorPriority.includes(s.id) && sectorPriority.length >= 3}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all duration-150 ${
                  sectorPriority.includes(s.id)
                    ? 'bg-[rgba(255,255,255,0.07)] border-[#CCFF00] text-[#CCFF00]'
                    : 'border-[rgba(255,255,255,0.07)] text-[#888888] hover:border-[rgba(204,255,0,0.35)] disabled:opacity-40'
                }`}
              >
                <span className="font-display font-bold text-xs uppercase tracking-wide text-left">
                  {s.name}
                </span>
                {sectorPriority.includes(s.id) && (
                  <span className="font-mono text-[#CCFF00] text-[10px]">
                    #{sectorPriority.indexOf(s.id) + 1}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom requirements */}
        {event.requirements.map(req => (
          <div key={req.id}>
            <label className="label">
              {req.label}
              {req.required && <span className="text-[#FCA5A5] ml-1">*</span>}
            </label>
            {req.type === 'text' ? (
              <input
                type="text"
                value={answers[req.id] ?? ''}
                onChange={e => setAnswers(prev => ({ ...prev, [req.id]: e.target.value }))}
                className="input"
                placeholder="Your answer..."
              />
            ) : (
              <select
                value={answers[req.id] ?? ''}
                onChange={e => setAnswers(prev => ({ ...prev, [req.id]: e.target.value }))}
                className="input appearance-none cursor-pointer"
              >
                <option value="">Select...</option>
                {req.options?.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            )}
          </div>
        ))}

        {/* Comments */}
        <div>
          <label className="label">Comments (optional)</label>
          <textarea
            value={comments}
            onChange={e => setComments(e.target.value)}
            rows={2}
            placeholder="Anything you'd like the organiser to know..."
            className="input resize-none"
          />
        </div>

        {/* Group toggle */}
        <div>
          <button
            onClick={() => setShowGroup(!showGroup)}
            className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wide text-[#CCFF00] hover:text-[#CCFF00] transition-colors"
          >
            <Users size={13} />
            {showGroup ? 'Cancel Group' : 'Register as Part of a Group'}
          </button>
          <AnimatePresence>
            {showGroup && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3">
                  <input
                    type="text"
                    value={groupToken}
                    onChange={e => setGroupToken(e.target.value)}
                    placeholder="Enter group token / link"
                    className="input"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Register button */}
        <button
          onClick={handleRegister}
          disabled={seatsLeft === 0}
          className={`w-full btn-primary justify-center py-4 text-base ${seatsLeft === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {seatsLeft === 0
            ? 'Event Full'
            : user
            ? 'Submit Registration'
            : 'Sign In to Register'
          }
          {seatsLeft > 0 && <ArrowRight size={16} />}
        </button>

        {!user && (
          <p className="font-sans text-[#888888] text-xs text-center">
            Free account required.{' '}
            <button
              onClick={() => openEventRegistration({
                id: event.id, title: event.title,
                date: event.date_display, org: event.org.name,
                city: event.city, seatsLeft: seatsLeft,
                banner: event.banner_url,
              })}
              className="text-[#CCFF00] hover:text-[#CCFF00] underline"
            >
              Register in 2 mins
            </button>
          </p>
        )}

        {/* Download mission plan */}
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-[rgba(255,255,255,0.08)] text-[#888888] hover:text-[#CCFF00] hover:border-[rgba(204,255,0,0.35)] font-display font-bold text-xs uppercase tracking-wide transition-all">
          <Download size={13} /> Download Mission Plan PDF
        </button>
      </div>
    </div>
  );
}