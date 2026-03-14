import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, Users, Calendar, Award, ClipboardList, PlusCircle, Settings, CheckCircle, ArrowRight, Layers } from 'lucide-react';

// ─────────────────────────────────────────────
//  BOOK CONTENT — all pages
// ─────────────────────────────────────────────

type PageContent = {
  id: number;
  type: 'cover' | 'toc' | 'chapter-divider' | 'content' | 'back-cover';
  chapterNum?: number;
  chapterTitle?: string;
  role?: 'volunteer' | 'organiser' | 'both';
  title: string;
  subtitle?: string;
  body?: React.ReactNode;
  icon?: React.ReactNode;
  accentColor?: string;
};

const LIME = '#CCFF00';
const GREEN = '#4ADE80';
const BLUE = '#38BDF8';
const RED = '#FB7185';
const YELLOW = '#FACC15';
const PURPLE = '#C4B5FD';

function Step({ num, text, sub }: { num: string; text: string; sub?: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#0C0C0C] font-mono font-bold text-xs"
        style={{ background: LIME }}
      >
        {num}
      </div>
      <div>
        <div className="font-display font-black text-[#F2F2F2] text-sm uppercase tracking-wide leading-snug">{text}</div>
        {sub && <div className="font-sans text-[#666] text-xs mt-1 leading-relaxed">{sub}</div>}
      </div>
    </div>
  );
}

function Tip({ color, text }: { color: string; text: string }) {
  return (
    <div
      className="flex gap-3 items-start p-3 rounded-lg border"
      style={{ background: `${color}08`, borderColor: `${color}25` }}
    >
      <span className="text-base flex-shrink-0">💡</span>
      <span className="font-sans text-xs leading-relaxed" style={{ color: `${color}CC` }}>{text}</span>
    </div>
  );
}

function Tag({ color, label }: { color: string; label: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase border"
      style={{ color, borderColor: `${color}40`, background: `${color}0D` }}
    >
      {label}
    </span>
  );
}

const PAGES: PageContent[] = [
  // ── COVER ─────────────────────────────────
  {
    id: 0, type: 'cover',
    title: 'Platform\nGuidebook',
    subtitle: 'Your complete reference for volunteering and organising on Pruthwee',
    accentColor: LIME,
  },

  // ── TABLE OF CONTENTS ─────────────────────
  {
    id: 1, type: 'toc',
    title: 'Contents',
    accentColor: LIME,
    body: (
      <div className="space-y-3">
        {[
          { ch: '01', title: 'Getting Started', sub: 'Register · Profile · First login', page: 3, color: LIME },
          { ch: '02', title: 'For Volunteers', sub: 'Find events · Register · Track hours', page: 5, color: GREEN },
          { ch: '03', title: 'Volunteer Dashboard', sub: 'Assignments · Certificates · Groups', page: 8, color: BLUE },
          { ch: '04', title: 'Status & Tiers', sub: 'Ranks · Badges · Benefits', page: 11, color: YELLOW },
          { ch: '05', title: 'For Organisers', sub: 'Create events · Manage teams', page: 13, color: RED },
          { ch: '06', title: 'Organiser Tools', sub: 'Sectors · Allocation · Certificates', page: 16, color: PURPLE },
          { ch: '07', title: 'Tips & Best Practices', sub: 'Make the most of Pruthwee', page: 19, color: LIME },
        ].map((item) => (
          <div key={item.ch} className="flex items-center gap-3 group">
            <span className="font-mono text-[10px] tracking-widest flex-shrink-0" style={{ color: item.color }}>
              {item.ch}
            </span>
            <div className="flex-1 border-b border-dashed border-white/[0.07] pb-1">
              <div className="font-display font-black text-[#F2F2F2] text-sm uppercase tracking-wide">{item.title}</div>
              <div className="font-sans text-[#555] text-[11px]">{item.sub}</div>
            </div>
            <span className="font-mono text-[10px] text-[#444]">{item.page}</span>
          </div>
        ))}
      </div>
    ),
  },

  // ── CHAPTER 1 DIVIDER ─────────────────────
  {
    id: 2, type: 'chapter-divider',
    chapterNum: 1, chapterTitle: 'Getting Started',
    title: 'Getting\nStarted',
    subtitle: 'Create your account and set up your profile in under 5 minutes',
    accentColor: LIME,
    icon: <BookOpen size={40} />,
  },

  // ── GETTING STARTED — Page 1 ───────────────
  {
    id: 3, type: 'content', chapterNum: 1, role: 'both',
    title: 'Create Your Account',
    accentColor: LIME,
    body: (
      <div className="space-y-5">
        <p className="font-sans text-[#888] text-sm leading-relaxed">
          Pruthwee is free to join. Choose your role — volunteer or organiser — and get started in minutes.
        </p>
        <div className="space-y-4">
          <Step num="1" text="Click Register Free" sub='Hit the lime "Register Free" button in the top navbar from any page.' />
          <Step num="2" text="Pick your role" sub="Choose Volunteer to join events, or Organiser to create and manage them." />
          <Step num="3" text="Fill your details" sub="Name, email, phone, and city. Takes under 2 minutes." />
          <Step num="4" text="Verify your email" sub="Check your inbox for a verification link. Click it to activate your account." />
        </div>
        <Tip color={LIME} text="Use your real name — organisers can see your profile when you register for their events." />
      </div>
    ),
  },

  // ── GETTING STARTED — Page 2 ───────────────
  {
    id: 4, type: 'content', chapterNum: 1, role: 'both',
    title: 'Complete Your Profile',
    accentColor: LIME,
    body: (
      <div className="space-y-5">
        <p className="font-sans text-[#888] text-sm leading-relaxed">
          A complete profile makes you stand out to organisers and helps build trust in the community.
        </p>
        <div className="space-y-3">
          {[
            { field: 'Profile Photo', why: 'Organisers recognise you at events', required: true },
            { field: 'City & District', why: 'Get notified about nearby events', required: true },
            { field: 'Skills & Interests', why: 'Get matched to relevant opportunities', required: false },
            { field: 'Emergency Contact', why: 'Required for field events', required: false },
            { field: 'Bio / About', why: 'Let the community know who you are', required: false },
          ].map((item) => (
            <div key={item.field} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <CheckCircle size={14} className="flex-shrink-0 mt-0.5" style={{ color: item.required ? LIME : '#444' }} />
              <div>
                <div className="font-display font-black text-[#F2F2F2] text-xs uppercase tracking-wide">{item.field}</div>
                <div className="font-sans text-[#555] text-[11px] mt-0.5">{item.why}</div>
              </div>
              {item.required && <Tag color={LIME} label="Required" />}
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // ── CHAPTER 2 DIVIDER ─────────────────────
  {
    id: 5, type: 'chapter-divider',
    chapterNum: 2, chapterTitle: 'For Volunteers',
    title: 'For\nVolunteers',
    subtitle: 'Find events that matter, register in one click, earn your hours',
    accentColor: GREEN,
    icon: <Users size={40} />,
  },

  // ── VOLUNTEER — Finding Events ─────────────
  {
    id: 6, type: 'content', chapterNum: 2, role: 'volunteer',
    title: 'Finding Events',
    accentColor: GREEN,
    body: (
      <div className="space-y-5">
        <p className="font-sans text-[#888] text-sm leading-relaxed">
          Browse hundreds of live events across 48 cities. Filter by what matters to you.
        </p>
        <div className="space-y-4">
          <Step num="1" text='Go to "Events" in the navbar' sub="This is the public events listing — no login needed to browse." />
          <Step num="2" text="Filter by category or city" sub="Environment, Education, Health, Sports, Cultural — or search by name." />
          <Step num="3" text="Read the event details" sub="Check the date, location, required skills, available seats, and organiser info." />
          <Step num="4" text="Click Register" sub="Hit the lime Register button. If not logged in, you'll be prompted to sign in first." />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {[
            { emoji: '🌿', label: 'Environment', color: GREEN },
            { emoji: '📚', label: 'Education', color: BLUE },
            { emoji: '❤️', label: 'Health', color: RED },
            { emoji: '⚽', label: 'Sports', color: YELLOW },
            { emoji: '🎭', label: 'Cultural', color: PURPLE },
            { emoji: '📍', label: '48 Cities', color: LIME },
          ].map((cat) => (
            <div key={cat.label} className="p-2 rounded-lg border text-center" style={{ borderColor: `${cat.color}25`, background: `${cat.color}08` }}>
              <div className="text-lg">{cat.emoji}</div>
              <div className="font-mono text-[9px] tracking-widest uppercase mt-1" style={{ color: cat.color }}>{cat.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // ── VOLUNTEER — Registering ─────────────────
  {
    id: 7, type: 'content', chapterNum: 2, role: 'volunteer',
    title: 'Registering for Events',
    accentColor: GREEN,
    body: (
      <div className="space-y-5">
        <p className="font-sans text-[#888] text-sm leading-relaxed">
          Registration is a guided 4-step process. It takes about 2 minutes.
        </p>
        <div className="space-y-3">
          {[
            { step: 'Step 1', label: 'Choose your role at the event', detail: 'General Volunteer, Team Lead, First Aid, etc.' },
            { step: 'Step 2', label: 'Confirm your availability', detail: 'Agree to the event date, time, and location.' },
            { step: 'Step 3', label: 'Emergency & health info', detail: 'Required for field events involving physical activity.' },
            { step: 'Step 4', label: 'Confirmation', detail: "You're registered! You'll receive a confirmation email." },
          ].map((s, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <div className="font-mono text-[9px] tracking-widest flex-shrink-0 mt-0.5" style={{ color: GREEN }}>{s.step}</div>
              <div>
                <div className="font-display font-black text-[#F2F2F2] text-xs uppercase tracking-wide">{s.label}</div>
                <div className="font-sans text-[#555] text-[11px] mt-0.5">{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
        <Tip color={GREEN} text="Register early — popular events fill up fast and seats are first-come, first-served." />
      </div>
    ),
  },

  // ── CHAPTER 3 DIVIDER ─────────────────────
  {
    id: 8, type: 'chapter-divider',
    chapterNum: 3, chapterTitle: 'Volunteer Dashboard',
    title: 'Your\nDashboard',
    subtitle: 'Track hours, download certificates, manage your groups',
    accentColor: BLUE,
    icon: <Layers size={40} />,
  },

  // ── DASHBOARD — Overview ───────────────────
  {
    id: 9, type: 'content', chapterNum: 3, role: 'volunteer',
    title: 'Dashboard Overview',
    accentColor: BLUE,
    body: (
      <div className="space-y-5">
        <p className="font-sans text-[#888] text-sm leading-relaxed">
          Your dashboard is your mission control. Access it at <span className="font-mono text-[#CCFF00] text-xs">/dashboard</span> after logging in.
        </p>
        <div className="space-y-3">
          {[
            { icon: '📊', section: 'Overview', desc: 'Total hours, tier rank, upcoming events at a glance', color: LIME },
            { icon: '📋', section: 'Assignments', desc: 'All your registered events — upcoming, ongoing, completed', color: BLUE },
            { icon: '🏆', section: 'Certificates', desc: 'Download your auto-generated certificates by event', color: YELLOW },
            { icon: '👥', section: 'Groups', desc: 'Volunteer groups you belong to for coordinating with teams', color: GREEN },
            { icon: '👤', section: 'Profile', desc: 'Update your info, skills, photo, and emergency contact', color: PURPLE },
          ].map((item) => (
            <div key={item.section} className="flex gap-3 items-start p-3 rounded-lg border bg-white/[0.02]" style={{ borderColor: `${item.color}20` }}>
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div>
                <div className="font-display font-black text-[#F2F2F2] text-xs uppercase tracking-wide">{item.section}</div>
                <div className="font-sans text-[#555] text-[11px] mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // ── DASHBOARD — Certificates ───────────────
  {
    id: 10, type: 'content', chapterNum: 3, role: 'volunteer',
    title: 'Certificates & Hours',
    accentColor: BLUE,
    body: (
      <div className="space-y-5">
        <p className="font-sans text-[#888] text-sm leading-relaxed">
          Every completed event generates an auto-certified certificate with your name, hours, and event details.
        </p>
        <div className="space-y-4">
          <Step num="1" text="Complete the event" sub="Attend on the day. The organiser marks you as attended after the event." />
          <Step num="2" text="Hours are added automatically" sub="Your volunteer hours update in your profile within 24 hours of the event closing." />
          <Step num="3" text="Go to Certificates tab" sub='Navigate to Dashboard → Certificates. All your issued certificates appear here.' />
          <Step num="4" text="Download as PDF" sub="Click Download on any certificate to save it as a properly formatted PDF." />
        </div>
        <div className="p-3 rounded-lg border border-yellow-400/20 bg-yellow-400/5">
          <div className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: YELLOW }}>Certificate includes</div>
          <div className="grid grid-cols-2 gap-1.5">
            {['Your full name', 'Event name & date', 'Hours logged', 'Organisation name', 'Event category', 'Digital signature'].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: YELLOW }} />
                <span className="font-sans text-[11px] text-[#888]">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },

  // ── CHAPTER 4 DIVIDER ─────────────────────
  {
    id: 11, type: 'chapter-divider',
    chapterNum: 4, chapterTitle: 'Status & Tiers',
    title: 'Status\n& Tiers',
    subtitle: 'Earn ranks as you serve. Every hour moves you forward.',
    accentColor: YELLOW,
    icon: <Award size={40} />,
  },

  // ── TIERS ─────────────────────────────────
  {
    id: 12, type: 'content', chapterNum: 4, role: 'volunteer',
    title: 'Volunteer Tier System',
    accentColor: YELLOW,
    body: (
      <div className="space-y-4">
        <p className="font-sans text-[#888] text-sm leading-relaxed">
          Your tier is calculated automatically from your total verified volunteer hours.
        </p>
        <div className="space-y-2">
          {[
            { icon: '⬜', label: 'New', hours: '0 hrs', color: '#9CA3AF', perks: 'Profile + event browsing' },
            { icon: '🌿', label: 'Volunteer', hours: '0.25 – 25 hrs', color: GREEN, perks: 'Certificates + profile visibility' },
            { icon: '🥉', label: 'Bronze', hours: '25 – 75 hrs', color: '#CD7F32', perks: 'Spotlight feature + priority reg.' },
            { icon: '🥈', label: 'Silver', hours: '75 – 200 hrs', color: '#C0C0C0', perks: 'Badge + newsletter shoutout' },
            { icon: '🥇', label: 'Gold', hours: '200 – 500 hrs', color: YELLOW, perks: 'Badge + awards ceremony + merch' },
            { icon: '💎', label: 'Platinum', hours: '500 – 1000 hrs', color: '#E5E4E2', perks: 'Press feature + summit invite' },
            { icon: '🌟', label: 'Diamond', hours: '1000+ hrs', color: LIME, perks: 'Ambassador + Advisory Board' },
          ].map((tier) => (
            <div key={tier.label} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.025] border border-white/[0.05]">
              <span className="text-xl w-7 text-center flex-shrink-0">{tier.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-xs uppercase tracking-wide" style={{ color: tier.color }}>{tier.label}</span>
                  <span className="font-mono text-[9px] text-[#444]">{tier.hours}</span>
                </div>
                <div className="font-sans text-[#444] text-[10px] truncate">{tier.perks}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // ── CHAPTER 5 DIVIDER ─────────────────────
  {
    id: 13, type: 'chapter-divider',
    chapterNum: 5, chapterTitle: 'For Organisers',
    title: 'For\nOrganisers',
    subtitle: 'Create events, build teams, and manage volunteers end-to-end',
    accentColor: RED,
    icon: <Calendar size={40} />,
  },

  // ── ORGANISER — Create Event ───────────────
  {
    id: 14, type: 'content', chapterNum: 5, role: 'organiser',
    title: 'Creating an Event',
    accentColor: RED,
    body: (
      <div className="space-y-5">
        <p className="font-sans text-[#888] text-sm leading-relaxed">
          As an organiser you can publish events that volunteers across India can find and register for.
        </p>
        <div className="space-y-4">
          <Step num="1" text="Go to Organiser Dashboard" sub='Login → click your name → "My Events" or go to /organiser/dashboard' />
          <Step num="2" text='Click "Create Event"' sub="Fill in event name, description, category, date/time, city, and venue." />
          <Step num="3" text="Set capacity & requirements" sub="Define total seats, minimum age, required skills, and any special notes." />
          <Step num="4" text="Add sectors" sub="Divide the event into work sectors (e.g. Registration Desk, Field Team, Media). Each gets its own seat count." />
          <Step num="5" text="Publish" sub="Hit Publish — your event goes live on the Events page immediately." />
        </div>
        <Tip color={RED} text="Draft first, publish when ready. You can save as draft and come back to edit before going live." />
      </div>
    ),
  },

  // ── ORGANISER — Manage ─────────────────────
  {
    id: 15, type: 'content', chapterNum: 5, role: 'organiser',
    title: 'Managing Registrations',
    accentColor: RED,
    body: (
      <div className="space-y-5">
        <p className="font-sans text-[#888] text-sm leading-relaxed">
          Once volunteers register, you have full control over allocation, messaging, and closing.
        </p>
        <div className="space-y-3">
          {[
            { icon: '📋', action: 'View Registrations', desc: 'See all who registered — name, tier, city, contact, skill set.', color: RED },
            { icon: '🗂️', action: 'Allocation Tool', desc: 'Assign each volunteer to a specific sector with drag-and-drop.', color: YELLOW },
            { icon: '💬', action: 'Messages', desc: 'Broadcast messages to all or specific volunteers for updates.', color: BLUE },
            { icon: '👥', action: 'Groups Manager', desc: 'Create sub-groups for team coordination within the event.', color: GREEN },
            { icon: '🔒', action: 'Close Event', desc: 'After the event: mark attendance, finalize hours, trigger certificates.', color: PURPLE },
          ].map((item) => (
            <div key={item.action} className="flex gap-3 items-start p-3 rounded-lg border bg-white/[0.02]" style={{ borderColor: `${item.color}20` }}>
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <div>
                <div className="font-display font-black text-[#F2F2F2] text-xs uppercase tracking-wide">{item.action}</div>
                <div className="font-sans text-[#555] text-[11px] mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // ── CHAPTER 6 DIVIDER ─────────────────────
  {
    id: 16, type: 'chapter-divider',
    chapterNum: 6, chapterTitle: 'Organiser Tools',
    title: 'Organiser\nTools',
    subtitle: 'Sectors, allocation engine, messaging and closing workflow',
    accentColor: PURPLE,
    icon: <Settings size={40} />,
  },

  // ── ORGANISER — Sector Manager ─────────────
  {
    id: 17, type: 'content', chapterNum: 6, role: 'organiser',
    title: 'Sector Manager',
    accentColor: PURPLE,
    body: (
      <div className="space-y-5">
        <p className="font-sans text-[#888] text-sm leading-relaxed">
          Sectors divide your event into functional work areas. Each sector has its own seat count and team.
        </p>
        <div className="space-y-4">
          <Step num="1" text="Open event → Sectors tab" sub="Navigate to your event from the Organiser Dashboard, then click Sectors." />
          <Step num="2" text="Add sectors" sub='Click "Add Sector". Give it a name (e.g. "Registration Desk"), description, and seat count.' />
          <Step num="3" text="Set roles per sector" sub="Define what skills or roles each sector needs. This helps during allocation." />
          <Step num="4" text="Publish sectors" sub="Once set, volunteers can see sector names during registration to know where they'll work." />
        </div>
        <div className="p-3 rounded-lg border border-purple-400/20 bg-purple-400/5">
          <div className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: PURPLE }}>Example sectors</div>
          <div className="flex flex-wrap gap-2">
            {['Registration Desk', 'Field Cleanup', 'Media & Photography', 'First Aid', 'Logistics', 'Welcome Team'].map((s) => (
              <span key={s} className="font-sans text-[10px] text-[#888] bg-white/[0.04] border border-white/[0.08] px-2 py-1 rounded">{s}</span>
            ))}
          </div>
        </div>
      </div>
    ),
  },

  // ── ORGANISER — Closing ────────────────────
  {
    id: 18, type: 'content', chapterNum: 6, role: 'organiser',
    title: 'Closing an Event',
    accentColor: PURPLE,
    body: (
      <div className="space-y-5">
        <p className="font-sans text-[#888] text-sm leading-relaxed">
          Closing an event finalises everything — hours, attendance, and certificates — all in one flow.
        </p>
        <div className="space-y-4">
          <Step num="1" text="Go to Event → Close" sub='From your event page, click the "Close Event" button.' />
          <Step num="2" text="Mark attendance" sub="For each registered volunteer, mark as Attended, Absent, or Partial." />
          <Step num="3" text="Confirm hours" sub="Review the total hours credited per volunteer. Adjust if needed." />
          <Step num="4" text="Submit & close" sub="Hit Submit. Hours are instantly added to volunteer profiles. Certificates auto-generate." />
        </div>
        <Tip color={PURPLE} text="Close events within 48 hours. Volunteers are waiting for their hours and certificates!" />
        <div className="p-3 rounded-lg border border-white/[0.08] bg-white/[0.02]">
          <div className="font-mono text-[10px] tracking-widest uppercase text-[#555] mb-2">What happens automatically</div>
          <div className="space-y-1.5">
            {['Volunteer hours added to profiles', 'Tier ranks recalculated', 'Certificates generated & available', 'Event marked as Closed'].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <CheckCircle size={11} style={{ color: PURPLE }} className="flex-shrink-0" />
                <span className="font-sans text-[11px] text-[#666]">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },

  // ── CHAPTER 7 DIVIDER ─────────────────────
  {
    id: 19, type: 'chapter-divider',
    chapterNum: 7, chapterTitle: 'Tips & Best Practices',
    title: 'Tips &\nBest Practices',
    subtitle: 'Get the most out of your Pruthwee experience',
    accentColor: LIME,
    icon: <ClipboardList size={40} />,
  },

  // ── TIPS ──────────────────────────────────
  {
    id: 20, type: 'content', chapterNum: 7, role: 'both',
    title: 'Volunteer Tips',
    accentColor: LIME,
    body: (
      <div className="space-y-4">
        <div className="space-y-3">
          {[
            { tip: 'Complete your profile first', detail: 'Organisers filter by skills and city. An incomplete profile means missed invites.', color: LIME },
            { tip: 'Register early', detail: 'Events list seats available. High-demand events fill in hours, not days.', color: GREEN },
            { tip: 'Show up prepared', detail: "Read the event description fully. Know your sector, bring what's needed.", color: BLUE },
            { tip: 'Consistent > occasional', detail: "25 hours across 10 events beats one big event. Consistency builds your rank faster.", color: YELLOW },
            { tip: 'Join your event group', detail: "Most organisers create a WhatsApp/group for the team. Check the Messages tab.", color: RED },
            { tip: 'Download certs promptly', detail: "Certificates are useful for college applications, CVs, and scholarship programs.", color: PURPLE },
          ].map((t, i) => (
            <div key={i} className="flex gap-3 p-2.5 rounded-lg border bg-white/[0.02]" style={{ borderColor: `${t.color}20` }}>
              <div className="w-1 flex-shrink-0 rounded-full mt-1" style={{ background: t.color, minHeight: 32 }} />
              <div>
                <div className="font-display font-black text-[#F2F2F2] text-xs uppercase tracking-wide">{t.tip}</div>
                <div className="font-sans text-[#555] text-[11px] mt-0.5">{t.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // ── TIPS — Organiser ──────────────────────
  {
    id: 21, type: 'content', chapterNum: 7, role: 'organiser',
    title: 'Organiser Tips',
    accentColor: LIME,
    body: (
      <div className="space-y-4">
        <div className="space-y-3">
          {[
            { tip: 'Publish 2+ weeks ahead', detail: 'Volunteers plan in advance. Last-minute events get fewer registrations.', color: LIME },
            { tip: 'Write a clear description', detail: 'What will they do? Where exactly? What to wear/bring? Be specific.', color: GREEN },
            { tip: 'Use sectors well', detail: 'Well-defined sectors reduce confusion on event day. Teams know exactly where to go.', color: BLUE },
            { tip: 'Message before the event', detail: 'Send a reminder 3 days before with meeting point, time, and what to expect.', color: YELLOW },
            { tip: 'Close events fast', detail: 'Volunteers check for hours and certs the day after. A quick close = happy team.', color: RED },
            { tip: 'Acknowledge your volunteers', detail: 'A message thanking your team after the event goes a long way for retention.', color: PURPLE },
          ].map((t, i) => (
            <div key={i} className="flex gap-3 p-2.5 rounded-lg border bg-white/[0.02]" style={{ borderColor: `${t.color}20` }}>
              <div className="w-1 flex-shrink-0 rounded-full mt-1" style={{ background: t.color, minHeight: 32 }} />
              <div>
                <div className="font-display font-black text-[#F2F2F2] text-xs uppercase tracking-wide">{t.tip}</div>
                <div className="font-sans text-[#555] text-[11px] mt-0.5">{t.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // ── BACK COVER ────────────────────────────
  {
    id: 22, type: 'back-cover',
    title: 'Ready to\nServe?',
    subtitle: 'Join 12,000+ volunteers already making a difference across India.',
    accentColor: LIME,
  },
];

const TOTAL_PAGES = PAGES.length;

// ─────────────────────────────────────────────
//  PAGE RENDERER
// ─────────────────────────────────────────────
function PageRenderer({ page, side }: { page: PageContent; side: 'left' | 'right' }) {
  const accent = page.accentColor || LIME;

  if (page.type === 'cover') {
    return (
      <div className="w-full h-full flex flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: '#0C0C0C' }}>
        {/* Grid bg */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(${accent}18 1px,transparent 1px),linear-gradient(90deg,${accent}18 1px,transparent 1px)`,
            backgroundSize: '32px 32px'
          }} />
        {/* Glow */}
        <div className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse 70% 60% at 30% 60%, ${accent}14 0%, transparent 70%)` }} />

        <div className="relative z-10">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-8"
            style={{ background: accent }}>
            <span className="font-display font-black text-[#0C0C0C] text-lg">P</span>
          </div>
          <div className="font-mono text-[10px] tracking-[4px] uppercase mb-4" style={{ color: accent }}>
            Pruthwee Volunteers
          </div>
          <h1 className="font-display font-black uppercase leading-none"
            style={{ fontSize: 'clamp(36px,4vw,52px)', letterSpacing: '-1px', color: '#F2F2F2', whiteSpace: 'pre-line' }}>
            {page.title}
          </h1>
        </div>

        <div className="relative z-10">
          <div className="w-16 h-px mb-6" style={{ background: accent }} />
          <p className="font-sans text-sm leading-relaxed max-w-xs" style={{ color: '#888' }}>
            {page.subtitle}
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="font-mono text-[10px] tracking-[3px] uppercase" style={{ color: accent }}>Vol. 01 · 2026</div>
            <div className="w-1 h-1 rounded-full" style={{ background: accent }} />
            <div className="font-mono text-[10px] tracking-[3px] uppercase text-[#444]">Gujarat, India</div>
          </div>
        </div>
      </div>
    );
  }

  if (page.type === 'back-cover') {
    return (
      <div className="w-full h-full flex flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: accent }}>
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(#0C0C0C 1px,transparent 1px),linear-gradient(90deg,#0C0C0C 1px,transparent 1px)`,
            backgroundSize: '32px 32px'
          }} />

        <div className="relative z-10">
          <div className="font-mono text-[10px] tracking-[4px] uppercase text-[#0C0C0C]/60 mb-3">
            You made it to the end
          </div>
          <h2 className="font-display font-black uppercase leading-none text-[#0C0C0C]"
            style={{ fontSize: 'clamp(36px,4vw,52px)', letterSpacing: '-1px', whiteSpace: 'pre-line' }}>
            {page.title}
          </h2>
        </div>

        <div className="relative z-10">
          <p className="font-sans text-sm leading-relaxed text-[#0C0C0C]/70 max-w-xs mb-8">
            {page.subtitle}
          </p>
          <div className="space-y-3">
            <a href="/events"
              className="flex items-center gap-2 bg-[#0C0C0C] text-[#CCFF00] font-display font-black text-xs uppercase tracking-widest px-5 py-3 rounded-lg w-fit">
              Browse Events <ArrowRight size={14} />
            </a>
            <a href="/"
              className="flex items-center gap-2 border border-[#0C0C0C]/30 text-[#0C0C0C] font-display font-black text-xs uppercase tracking-widest px-5 py-3 rounded-lg w-fit">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (page.type === 'chapter-divider') {
    return (
      <div className="w-full h-full flex flex-col justify-end p-10 relative overflow-hidden"
        style={{ background: '#0E0E0E' }}>
        <div className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse 80% 60% at ${side === 'right' ? '80%' : '20%'} 40%, ${accent}18 0%, transparent 70%)` }} />
        <div className="absolute top-10 left-10 right-10 flex items-center gap-3" style={{ color: accent }}>
          {page.icon}
          <div className="font-mono text-[10px] tracking-[4px] uppercase" style={{ color: accent }}>
            Chapter {page.chapterNum?.toString().padStart(2, '0')}
          </div>
        </div>
        <div className="relative z-10">
          <div className="w-12 h-px mb-6" style={{ background: accent }} />
          <h2 className="font-display font-black uppercase leading-none mb-4"
            style={{ fontSize: 'clamp(40px,4.5vw,60px)', letterSpacing: '-2px', color: '#F2F2F2', whiteSpace: 'pre-line' }}>
            {page.title}
          </h2>
          <p className="font-sans text-sm leading-relaxed text-[#666] max-w-xs">{page.subtitle}</p>
        </div>
      </div>
    );
  }

  if (page.type === 'toc') {
    return (
      <div className="w-full h-full flex flex-col p-10 relative overflow-hidden" style={{ background: '#0E0E0E' }}>
        <div className="mb-8">
          <div className="font-mono text-[10px] tracking-[4px] uppercase mb-3" style={{ color: accent }}>Index</div>
          <h2 className="font-display font-black uppercase text-[#F2F2F2]"
            style={{ fontSize: 'clamp(28px,3vw,40px)', letterSpacing: '-1px' }}>
            {page.title}
          </h2>
          <div className="w-10 h-0.5 mt-4" style={{ background: accent }} />
        </div>
        <div className="flex-1 overflow-hidden">{page.body}</div>
      </div>
    );
  }

  // content page
  return (
    <div className="w-full h-full flex flex-col p-10 relative overflow-hidden" style={{ background: '#0E0E0E' }}>
      {/* Chapter tag */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
          <div className="font-mono text-[9px] tracking-[3px] uppercase" style={{ color: accent }}>
            Chapter {page.chapterNum?.toString().padStart(2, '0')}
          </div>
        </div>
        {page.role && (
          <Tag
            color={page.role === 'volunteer' ? GREEN : page.role === 'organiser' ? RED : LIME}
            label={page.role === 'both' ? 'All users' : page.role}
          />
        )}
      </div>

      <h2 className="font-display font-black uppercase leading-tight mb-6"
        style={{ fontSize: 'clamp(20px,2.2vw,28px)', letterSpacing: '-0.5px', color: '#F2F2F2' }}>
        {page.title}
      </h2>

      <div className="flex-1 overflow-y-auto pr-1 custom-scroll">
        {page.body}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  BOOK COMPONENT
// ─────────────────────────────────────────────
function Book() {
  // currentSpread = index of the LEFT page (always even)
  // Spread 0 = pages [cover, toc], Spread 1 = pages [2,3], etc.
  const [spread, setSpread] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<'forward' | 'backward'>('forward');
  const [flipPhase, setFlipPhase] = useState<'idle' | 'lift' | 'turn' | 'land'>('idle');
  const timeouts = useRef<number[]>([]);

  // Group pages into spreads of 2
  const spreads: [PageContent, PageContent | null][] = [];
  for (let i = 0; i < PAGES.length; i += 2) {
    spreads.push([PAGES[i], PAGES[i + 1] ?? null]);
  }

  const maxSpread = spreads.length - 1;

  const clearTimers = () => { timeouts.current.forEach(clearTimeout); timeouts.current = []; };

  const flipTo = useCallback((newSpread: number, dir: 'forward' | 'backward') => {
    if (flipping) return;
    setFlipDir(dir);
    setFlipping(true);
    setFlipPhase('lift');

    const t1 = window.setTimeout(() => setFlipPhase('turn'), 80);
    const t2 = window.setTimeout(() => setFlipPhase('land'), 400);
    const t3 = window.setTimeout(() => {
      setSpread(newSpread);
      setFlipPhase('idle');
      setFlipping(false);
    }, 540);
    timeouts.current = [t1, t2, t3];
  }, [flipping]);

  const goNext = () => { if (spread < maxSpread && !flipping) flipTo(spread + 1, 'forward'); };
  const goPrev = () => { if (spread > 0 && !flipping) flipTo(spread - 1, 'backward'); };

  // Clear timers only on unmount
  useEffect(() => {
    return () => clearTimers();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft')  goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [spread, flipping]);

  const [left, right] = spreads[spread];
  const nextSpread = flipping ? (flipDir === 'forward' ? spreads[Math.min(spread + 1, maxSpread)] : spreads[Math.max(spread - 1, 0)]) : null;

  // Page turn animation values
  const getTurnStyles = () => {
    if (!flipping) return {};
    if (flipPhase === 'lift') {
      return { transform: flipDir === 'forward' ? 'rotateY(-8deg)' : 'rotateY(8deg)', zIndex: 20 };
    }
    if (flipPhase === 'turn') {
      return { transform: flipDir === 'forward' ? 'rotateY(-90deg)' : 'rotateY(90deg)', zIndex: 20, transition: 'transform 320ms cubic-bezier(0.4,0,0.2,1)' };
    }
    if (flipPhase === 'land') {
      return { transform: 'rotateY(0deg)', zIndex: 20, transition: 'transform 140ms ease-out' };
    }
    return {};
  };

  const spreadNum = spread + 1;
  const totalSpreads = spreads.length;

  return (
    <div className="flex flex-col items-center w-full">

      {/* ── SCENE ── */}
      <div className="relative select-none" style={{ perspective: '1600px', perspectiveOrigin: '50% 38%' }}>

        {/* Floor shadow */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-14 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(0,0,0,0.95) 0%, transparent 70%)', filter: 'blur(24px)' }} />

        {/* Book — slight tilt for depth */}
        <div style={{ transform: 'rotateX(3deg)', transformStyle: 'preserve-3d' }}>

          {/* ── OUTER COVER SHELL ── */}
          <div
            className="relative flex"
            style={{
              width: 'min(940px, 96vw)',
              height: 'min(620px, 76vw)',
              background: '#040404',
              borderRadius: '6px 12px 12px 6px',
              boxShadow: [
                '0 0 0 1px rgba(255,255,255,0.06)',
                '0 0 0 2px rgba(255,255,255,0.025)',
                '0 30px 60px rgba(0,0,0,0.95)',
                '0 60px 120px rgba(0,0,0,0.6)',
                'inset 0 0 60px rgba(0,0,0,0.5)',
              ].join(', '),
            }}
          >
            {/* Cover gloss sheen */}
            <div className="absolute inset-0 pointer-events-none z-40 rounded-[inherit]"
              style={{ background: 'linear-gradient(132deg, rgba(255,255,255,0.05) 0%, transparent 38%, rgba(0,0,0,0.18) 100%)' }} />

            {/* ── LEFT BINDING EDGE ── */}
            <div
              className="flex-shrink-0 relative z-20"
              style={{
                width: '16px',
                borderRadius: '6px 0 0 6px',
                background: 'linear-gradient(to right, #010101, #0b0b0b 55%, #050505)',
                boxShadow: 'inset -3px 0 8px rgba(0,0,0,0.6)',
              }}
            >
              {/* Lime spine accent */}
              <div className="absolute inset-y-0 right-0 w-px"
                style={{ background: 'linear-gradient(to bottom, transparent 5%, rgba(204,255,0,0.45) 22%, rgba(204,255,0,0.45) 78%, transparent 95%)' }} />
            </div>

            {/* ── PAGES AREA ── */}
            <div className="relative flex flex-1 overflow-hidden">

              {/* LEFT PAGE */}
              <div
                className="relative overflow-hidden"
                style={{
                  width: 'calc(50% - 17px)',
                  background: '#0B0B0B',
                  boxShadow: 'inset -10px 0 24px rgba(0,0,0,0.65)',
                }}
              >
                {flipping && flipDir === 'backward' && nextSpread && (
                  <div className="absolute inset-0 z-10">
                    <PageRenderer page={nextSpread[0]} side="left" />
                  </div>
                )}
                <div className="absolute inset-0">
                  <PageRenderer page={left} side="left" />
                </div>
                {/* Page number */}
                <div className="absolute bottom-3 left-6 font-mono text-[9px] text-[#2c2c2c] z-20 pointer-events-none select-none">
                  {spread * 2 + 1}
                </div>
              </div>

              {/* ── SPINE / GUTTER ── */}
              <div
                className="flex-shrink-0 z-10 relative flex flex-col items-center justify-between py-10"
                style={{
                  width: '34px',
                  background: 'linear-gradient(to right, #020202 0%, #0d0d0d 30%, #0d0d0d 70%, #020202 100%)',
                  boxShadow: [
                    '-6px 0 18px rgba(0,0,0,0.85)',
                    '6px 0 18px rgba(0,0,0,0.85)',
                    'inset 1px 0 3px rgba(255,255,255,0.03)',
                    'inset -1px 0 3px rgba(255,255,255,0.03)',
                  ].join(', '),
                }}
              >
                {/* Stitching thread line */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px"
                  style={{ background: 'linear-gradient(to bottom, transparent 6%, rgba(204,255,0,0.22) 22%, rgba(204,255,0,0.22) 78%, transparent 94%)' }} />
                <span
                  className="font-display font-black text-[8px] uppercase z-10"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '6px', color: '#2a2a2a' }}
                >PRUTHWEE</span>
                <span
                  className="font-mono text-[7px] z-10"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '3px', color: '#1e1e1e' }}
                >2026</span>
              </div>

              {/* RIGHT PAGE (flippable) */}
              <div
                className="relative flex-1 overflow-hidden"
                style={{
                  background: '#0B0B0B',
                  boxShadow: 'inset 10px 0 24px rgba(0,0,0,0.65)',
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'left center',
                  ...getTurnStyles(),
                }}
              >
                {flipping && flipDir === 'forward' && nextSpread?.[1] && (
                  <div className="absolute inset-0 z-10" style={{ backfaceVisibility: 'hidden' }}>
                    <PageRenderer page={nextSpread[1]} side="right" />
                    <div className="absolute inset-y-0 left-0 w-16 pointer-events-none"
                      style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.65), transparent)' }} />
                  </div>
                )}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                  {right ? <PageRenderer page={right} side="right" /> : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: '#070707' }}>
                      <div className="font-mono text-[10px] tracking-widest text-[#222] uppercase">End of book</div>
                    </div>
                  )}
                </div>
                {/* Page number */}
                <div className="absolute bottom-3 right-6 font-mono text-[9px] text-[#2c2c2c] z-20 pointer-events-none select-none">
                  {spread * 2 + 2}
                </div>
                {/* Corner curl glow */}
                {!flipping && spread < maxSpread && (
                  <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none z-20"
                    style={{ background: 'radial-gradient(circle at 100% 100%, rgba(204,255,0,0.16) 0%, transparent 65%)' }} />
                )}
              </div>

            </div>

            {/* ── RIGHT COVER EDGE (stacked pages) ── */}
            <div
              className="flex-shrink-0 relative z-20 overflow-hidden"
              style={{
                width: '14px',
                borderRadius: '0 12px 12px 0',
                background: '#060606',
              }}
            >
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i}
                  style={{
                    position: 'absolute',
                    left: 0, right: 0,
                    height: '1px',
                    top: `${(i / 48) * 100}%`,
                    background: i % 3 === 0 ? '#212121' : i % 3 === 1 ? '#191919' : '#1e1e1e',
                  }}
                />
              ))}
            </div>

            {/* Flip center shadow */}
            {flipping && flipPhase === 'turn' && (
              <div className="absolute inset-0 pointer-events-none z-30"
                style={{
                  background: flipDir === 'forward'
                    ? 'linear-gradient(to right, transparent 44%, rgba(0,0,0,0.32) 50%, transparent 56%)'
                    : 'linear-gradient(to left, transparent 44%, rgba(0,0,0,0.32) 50%, transparent 56%)',
                }}
              />
            )}
          </div>

          {/* ── BOTTOM PAGE THICKNESS EDGE ── */}
          <div style={{ marginLeft: '16px', marginRight: '14px', height: '7px', overflow: 'hidden', borderRadius: '0 0 4px 4px' }}>
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i}
                style={{
                  position: 'absolute',
                  left: 0, right: 0,
                  height: '1px',
                  top: i * (7 / 16),
                  background: i % 2 ? '#1d1d1d' : '#191919',
                }}
              />
            ))}
          </div>

        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div className="flex items-center gap-6 mt-12">
        <button
          onClick={goPrev}
          disabled={spread === 0 || flipping}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border font-display font-black text-xs uppercase tracking-widest transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
          style={{
            borderColor: spread === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.15)',
            color: spread === 0 ? '#444' : '#F2F2F2',
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          <ChevronLeft size={14} /> Prev
        </button>

        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1.5">
            {spreads.map((_, i) => (
              <button
                key={i}
                onClick={() => !flipping && i !== spread && flipTo(i, i > spread ? 'forward' : 'backward')}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === spread ? 20 : 6,
                  height: 6,
                  background: i === spread ? LIME : i < spread ? 'rgba(204,255,0,0.3)' : 'rgba(255,255,255,0.1)',
                }}
              />
            ))}
          </div>
          <div className="font-mono text-[9px] tracking-widest text-[#444] uppercase">
            {spreadNum} / {totalSpreads}
          </div>
        </div>

        <button
          onClick={goNext}
          disabled={spread === maxSpread || flipping}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-display font-black text-xs uppercase tracking-widest transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
          style={{
            background: spread === maxSpread ? 'rgba(255,255,255,0.04)' : LIME,
            color: spread === maxSpread ? '#444' : '#0C0C0C',
            border: 'none',
          }}
        >
          Next <ChevronRight size={14} />
        </button>
      </div>

      <div className="mt-4 font-mono text-[9px] tracking-widest text-[#2A2A2A] uppercase">
        Use ← → arrow keys to navigate
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────
export default function GuidebookPage() {
  return (
    <div className="min-h-screen bg-[#080808]" style={{ fontFamily: "'Barlow', system-ui, sans-serif" }}>

      {/* ── PAGE HEADER ── */}
      <div className="pt-14 pb-10 px-5 md:px-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 70% at 50% -10%, rgba(204,255,0,0.07) 0%, transparent 70%)' }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[rgba(204,255,0,0.2)] bg-[rgba(204,255,0,0.04)]">
            <BookOpen size={13} color="#CCFF00" />
            <span className="font-mono text-[10px] tracking-[3px] uppercase text-[#CCFF00]">Platform Guide</span>
          </div>
          <h1
            className="heading-gradient font-display font-black uppercase leading-none mb-4"
            style={{ fontSize: 'clamp(36px,5vw,64px)', letterSpacing: '-1px' }}
          >
            Guidebook
          </h1>
          <p className="font-sans text-[#666] text-base max-w-md mx-auto leading-relaxed">
            Everything you need to know to volunteer and organise on Pruthwee — in one interactive book.
          </p>
        </div>
      </div>

      {/* ── BOOK ── */}
      <div className="flex justify-center px-4 pb-20">
        <Book />
      </div>

      {/* ── CUSTOM SCROLL STYLE ── */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(204,255,0,0.2); border-radius: 2px; }
        .custom-scroll { scrollbar-width: thin; scrollbar-color: rgba(204,255,0,0.2) transparent; }
      `}</style>
    </div>
  );
}