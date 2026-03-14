/**
 * EventRegistrationModal
 *
 * SETUP — add to App.tsx:
 *   import EventRegistrationModal from './components/events/EventRegistrationModal';
 *   // Inside App() JSX alongside LoginModal / RegisterModal:
 *   <EventRegistrationModal />
 *
 * OPEN FROM ANY PAGE:
 *   import { openEventRegistration } from '../components/events/EventRegistrationModal';
 *   openEventRegistration({
 *     id: 'e1', title: 'River Clean-Up 2026', date: 'Apr 15, 2026',
 *     org: 'Paryavaran Trust', city: 'Ahmedabad', seatsLeft: 13,
 *     banner: 'https://...',
 *   });
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Calendar, MapPin, Users, CheckCircle, ChevronRight,
  AlertCircle, Loader2, Clock, ChevronDown, Hash,
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

// ── PUBLIC TYPES + TRIGGER ─────────────────────
export type EventMeta = {
  id:        string;
  title:     string;
  date:      string;
  org:       string;
  city:      string;
  seatsLeft: number;
  banner?:   string;
};

export function openEventRegistration(event: EventMeta) {
  window.dispatchEvent(new CustomEvent('open-event-registration', { detail: event }));
}

// ── CONSTANTS ──────────────────────────────────
const SECTORS = [
  'River Collection', 'Logistics & Equipment', 'Medical Support',
  'Media & Photography', 'Registration Desk',
  'Crowd Management', 'Catering Support', 'No preference',
] as const;

const STEP_LABELS = ['Event', 'Availability', 'Preferences', 'Confirm'] as const;
type Step = 0 | 1 | 2 | 3 | 4; // 4 = success

// ── STEP DOT ───────────────────────────────────
function StepDot({ index, current, label }: { index: number; current: Step; label: string }) {
  const done = index < current, active = index === current;
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
        done   ? 'bg-[#6EE07A] border-[#6EE07A]'
        : active ? 'bg-[rgba(255,255,255,0.08)] border-[#CCFF00]'
        :          'bg-transparent border-[rgba(255,255,255,0.1)]'
      }`}>
        {done
          ? <CheckCircle size={14} className="text-[#0C0C0C]" />
          : <span className={`font-mono text-xs font-bold ${active ? 'text-[#CCFF00]' : 'text-[rgba(204,255,0,0.35)]'}`}>{index + 1}</span>
        }
      </div>
      <span className={`font-mono text-[9px] uppercase tracking-[1.5px] hidden sm:block ${
        active ? 'text-[#CCFF00]' : done ? 'text-[#6EE07A]' : 'text-[rgba(204,255,0,0.35)]'
      }`}>{label}</span>
    </div>
  );
}

// ── AVAILABILITY CARD ──────────────────────────
function AvailCard({ label, desc, selected, onClick }: {
  label: string; desc: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 ${
        selected
          ? 'border-[#CCFF00] bg-[rgba(255,255,255,0.06)]'
          : 'border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)]'
      }`}>
      <div className="flex items-center justify-between">
        <span className={`font-display font-black text-sm uppercase tracking-wide ${selected ? 'text-[#CCFF00]' : 'text-[#888888]'}`}>
          {label}
        </span>
        {selected && <CheckCircle size={15} className="text-[#CCFF00] flex-shrink-0" />}
      </div>
      <p className={`font-sans text-xs mt-0.5 ${selected ? 'text-[#888888]' : 'text-[rgba(139,191,204,0.6)]'}`}>{desc}</p>
    </button>
  );
}

// ── SECTOR CHIP ────────────────────────────────
function SectorChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-3 py-2 rounded-xl border font-display font-bold text-xs uppercase tracking-wide transition-all ${
        selected
          ? 'bg-[rgba(255,255,255,0.07)] border-[#CCFF00] text-[#CCFF00]'
          : 'border-[rgba(255,255,255,0.07)] text-[#888888] hover:border-[rgba(255,255,255,0.15)] hover:text-[#F2F2F2]'
      }`}>
      {selected && <span className="mr-1 text-[#CCFF00]">✓</span>}{label}
    </button>
  );
}

// ═════════════════════════════════════════════
export default function EventRegistrationModal() {
  const [open,       setOpen]       = useState(false);
  const [event,      setEvent]      = useState<EventMeta | null>(null);
  const [step,       setStep]       = useState<Step>(0);
  const [loading,    setLoading]    = useState(false);
  const [refCode,    setRefCode]    = useState('');

  // Form
  const [avail,      setAvail]      = useState<'full' | 'morning' | 'afternoon' | ''>('');
  const [sectors,    setSectors]    = useState<string[]>([]);
  const [groupToken, setGroupToken] = useState('');
  const [comments,   setComments]   = useState('');
  const [tshirt,     setTshirt]     = useState('');

  const { user, profile } = useAuthStore();
  const navigate           = useNavigate();

  // ── Listen for trigger ──
  useEffect(() => {
    const handle = (e: CustomEvent<EventMeta>) => {
      setEvent(e.detail);
      setOpen(true);
      setStep(0); setAvail(''); setSectors([]); setGroupToken('');
      setComments(''); setTshirt(''); setRefCode('');
    };
    window.addEventListener('open-event-registration', handle as EventListener);
    return () => window.removeEventListener('open-event-registration', handle as EventListener);
  }, []);

  // ── ESC closes ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && step < 4) setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [step]);

  function close() { if (step < 4) setOpen(false); }

  function toggleSector(s: string) {
    if (s === 'No preference') { setSectors(['No preference']); return; }
    setSectors(prev => {
      const without = prev.filter(x => x !== 'No preference');
      return without.includes(s) ? without.filter(x => x !== s) : [...without, s].slice(0, 3);
    });
  }

  function handleNext() {
    if (step === 0) {
      if (!user) {
        setOpen(false);
        setTimeout(() => window.dispatchEvent(new CustomEvent('open-login')), 150);
        return;
      }
      setStep(1); return;
    }
    if (step === 1) { if (!avail) return; setStep(2); return; }
    if (step === 2) { setStep(3); return; }
    if (step === 3) { handleSubmit(); }
  }

  async function handleSubmit() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setRefCode(`PVT-${event?.id?.toUpperCase() ?? 'EVT'}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`);
    setLoading(false);
    setStep(4);
  }

  const progressPct = step >= 4 ? 100 : Math.round((step / 3) * 100);

  if (!open || !event) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[150] bg-[#0C0C0C]/85 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[160] flex items-center justify-center p-4 pointer-events-none"
            role="dialog" aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{   opacity: 0, scale: 0.95,  y: 10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto w-full max-w-lg max-h-[90vh] flex flex-col"
            >
              <div className="bg-[#141414] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-[0_32px_80px_rgba(12,12,12,0.9)] flex flex-col overflow-hidden">

                {/* Progress bar */}
                <div className="h-1 bg-[rgba(255,255,255,0.05)] flex-shrink-0">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#CCFF00] via-[#CCFF00] to-[#6EE07A]"
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                {/* Header */}
                <div className="flex-shrink-0 px-6 pt-5 pb-4 border-b border-[rgba(204,255,0,0.08)]">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="font-mono text-[#CCFF00] text-[10px] tracking-[3px] uppercase mb-0.5">
                        Event Registration
                      </p>
                      <h2 className="heading-gradient font-display font-black text-[#F2F2F2] uppercase text-xl leading-tight tracking-tight line-clamp-2">
                        {event.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                        <span className="flex items-center gap-1 font-sans text-[#888888] text-xs">
                          <Calendar size={11} className="text-[#CCFF00]" />{event.date}
                        </span>
                        <span className="flex items-center gap-1 font-sans text-[#888888] text-xs">
                          <MapPin size={11} className="text-[#CCFF00]" />{event.city}
                        </span>
                        <span className={`flex items-center gap-1 font-sans text-xs ${
                          event.seatsLeft < 5 ? 'text-[#FCA5A5]' : event.seatsLeft < 15 ? 'text-[#FCD34D]' : 'text-[#6EE07A]'
                        }`}>
                          <Users size={11} />{event.seatsLeft} seats left
                        </span>
                      </div>
                    </div>
                    {step < 4 && (
                      <button onClick={close}
                        className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-[#888888] hover:text-[#FCA5A5] hover:bg-[rgba(252,165,165,0.08)] transition-all"
                        aria-label="Close">
                        <X size={18} />
                      </button>
                    )}
                  </div>

                  {/* Step dots */}
                  {step < 4 && (
                    <div className="flex items-start gap-0">
                      {STEP_LABELS.map((label, i) => (
                        <div key={label} className="flex items-center flex-1">
                          <StepDot index={i} current={step} label={label} />
                          {i < STEP_LABELS.length - 1 && (
                            <div className={`h-px flex-1 mb-5 mx-1 transition-all duration-300 ${
                              i < step ? 'bg-[#6EE07A]' : 'bg-[rgba(255,255,255,0.08)]'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

                  {/* ── STEP 0: OVERVIEW ── */}
                  {step === 0 && (
                    <motion.div key="s0" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      {event.banner && (
                        <div className="rounded-xl overflow-hidden h-36">
                          <img src={event.banner} alt="" className="w-full h-full object-cover opacity-80" />
                        </div>
                      )}
                      <div className="bg-[rgba(12,12,12,0.5)] border border-[rgba(204,255,0,0.1)] rounded-xl p-4">
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { icon: <Calendar size={13} />, label: 'Date',       value: event.date },
                            { icon: <MapPin   size={13} />, label: 'City',       value: event.city },
                            { icon: <Users    size={13} />, label: 'Organiser',  value: event.org  },
                            { icon: <Users    size={13} />, label: 'Seats Left', value: `${event.seatsLeft}` },
                          ].map(r => (
                            <div key={r.label}>
                              <div className="flex items-center gap-1.5 text-[#CCFF00] mb-0.5">
                                {r.icon}
                                <span className="font-mono text-[10px] uppercase tracking-[2px]">{r.label}</span>
                              </div>
                              <p className="font-display font-bold text-[#F2F2F2] text-sm uppercase tracking-wide">{r.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* What happens next */}
                      <div className="bg-[rgba(110,224,122,0.05)] border border-[rgba(110,224,122,0.12)] rounded-xl p-4">
                        <p className="font-mono text-[#6EE07A] text-[10px] uppercase tracking-[2px] mb-2">What happens next</p>
                        <ol className="space-y-1.5">
                          {['Submit registration', 'Organiser reviews & approves', 'Receive sector assignment', 'Attend & log hours', 'Get your certificate'].map((s, i) => (
                            <li key={i} className="flex items-center gap-2.5 font-sans text-[#888888] text-xs">
                              <span className="w-4 h-4 rounded-full bg-[rgba(110,224,122,0.15)] text-[#6EE07A] font-mono text-[9px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                              {s}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Auth status */}
                      {!user ? (
                        <div className="flex items-start gap-2.5 bg-[rgba(252,211,77,0.07)] border border-[rgba(252,211,77,0.2)] rounded-xl p-3.5">
                          <AlertCircle size={14} className="text-[#FCD34D] flex-shrink-0 mt-0.5" />
                          <p className="font-sans text-[#FCD34D] text-xs leading-relaxed">
                            You need to be signed in to register. Click Continue and you'll be prompted to log in.
                          </p>
                        </div>
                      ) : profile && (
                        <div className="flex items-center gap-3 bg-[rgba(204,255,0,0.07)] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3">
                          <div className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.08)] flex items-center justify-center font-display font-black text-[#CCFF00] text-xs flex-shrink-0">
                            {(profile?.fullName ?? user?.email ?? 'V').split(' ').map((p: string) => p[0]).join('').slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-display font-bold text-[#F2F2F2] text-sm uppercase tracking-wide truncate">{profile.fullName}</p>
                            <p className="font-sans text-[#888888] text-xs">{profile.city} · {user.email}</p>
                          </div>
                          <CheckCircle size={14} className="text-[#6EE07A] flex-shrink-0" />
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* ── STEP 1: AVAILABILITY ── */}
                  {step === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                      <p className="font-sans text-[#888888] text-sm">When can you volunteer at this event?</p>
                      <AvailCard label="Full Day"       desc="I can volunteer for the entire event duration."      selected={avail === 'full'}      onClick={() => setAvail('full')} />
                      <AvailCard label="Morning Only"   desc="I'm available for the first half / morning session." selected={avail === 'morning'}   onClick={() => setAvail('morning')} />
                      <AvailCard label="Afternoon Only" desc="I'm available for the second half / afternoon."      selected={avail === 'afternoon'} onClick={() => setAvail('afternoon')} />
                      {!avail && (
                        <p className="font-sans text-[#FCD34D] text-xs flex items-center gap-1.5">
                          <AlertCircle size={11} />Please select your availability to continue.
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* ── STEP 2: PREFERENCES ── */}
                  {step === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="label">Sector Preference</label>
                          <span className="font-mono text-[#CCFF00] text-[10px]">
                            {sectors.length === 0 ? 'Optional · max 3' : `${sectors.length} selected`}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {SECTORS.map(s => (
                            <SectorChip key={s} label={s} selected={sectors.includes(s)} onClick={() => toggleSector(s)} />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="label mb-1 block" htmlFor="tshirt">T-Shirt Size</label>
                        <div className="relative">
                          <select id="tshirt" value={tshirt} onChange={e => setTshirt(e.target.value)} className="input appearance-none cursor-pointer pr-9">
                            <option value="">Select size (optional)</option>
                            {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#CCFF00] pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="label mb-1 block" htmlFor="group-token">
                          Group Token
                          <span className="font-sans text-[#888888] text-xs font-normal ml-2 normal-case tracking-normal">— optional</span>
                        </label>
                        <div className="relative">
                          <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CCFF00]" />
                          <input
                            id="group-token" type="text" value={groupToken}
                            onChange={e => setGroupToken(e.target.value.toUpperCase())}
                            placeholder="e.g. GUE-2026-ECOX1"
                            className="input pl-10 font-mono tracking-wider uppercase placeholder:normal-case placeholder:tracking-normal placeholder:font-sans"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="label mb-1 block" htmlFor="comments">
                          Comments
                          <span className="font-sans text-[#888888] text-xs font-normal ml-2 normal-case tracking-normal">— optional</span>
                        </label>
                        <textarea
                          id="comments" value={comments} onChange={e => setComments(e.target.value)}
                          rows={3} placeholder="Medical conditions, dietary requirements, questions for the organiser…"
                          className="input resize-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 3: CONFIRM ── */}
                  {step === 3 && (
                    <motion.div key="s3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      <p className="font-sans text-[#888888] text-sm">Review your registration before submitting.</p>
                      <div className="bg-[rgba(12,12,12,0.5)] border border-[rgba(204,255,0,0.1)] rounded-xl divide-y divide-[rgba(204,255,0,0.07)]">
                        {([
                          { label: 'Volunteer',    value: profile?.fullName ?? user?.email ?? '—' },
                          { label: 'Event',        value: event.title },
                          { label: 'Date',         value: event.date  },
                          { label: 'City',         value: event.city  },
                          { label: 'Organiser',    value: event.org   },
                          { label: 'Availability', value: avail === 'full' ? 'Full Day' : avail === 'morning' ? 'Morning Only' : 'Afternoon Only' },
                          { label: 'Sectors',      value: sectors.length > 0 ? sectors.join(', ') : 'No preference' },
                          ...(tshirt     ? [{ label: 'T-Shirt',     value: tshirt     }] : []),
                          ...(groupToken ? [{ label: 'Group Token', value: groupToken }] : []),
                          ...(comments   ? [{ label: 'Comments',   value: comments   }] : []),
                        ] as { label: string; value: string }[]).map(row => (
                          <div key={row.label} className="flex items-start gap-4 px-4 py-3">
                            <span className="font-mono text-[#CCFF00] text-[10px] uppercase tracking-[2px] flex-shrink-0 w-24 pt-0.5">{row.label}</span>
                            <span className="font-sans text-[#F2F2F2] text-sm flex-1 break-words">{row.value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-start gap-2.5 bg-[rgba(110,224,122,0.05)] border border-[rgba(110,224,122,0.12)] rounded-xl p-3.5">
                        <CheckCircle size={14} className="text-[#6EE07A] flex-shrink-0 mt-0.5" />
                        <p className="font-sans text-[#888888] text-xs leading-relaxed">
                          By submitting, you agree to attend as confirmed. Your hours will be logged after the event closes.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 4: SUCCESS ── */}
                  {step === 4 && (
                    <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }} className="text-center py-4 space-y-5">
                      <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.1 }}
                        className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
                        style={{ background: 'radial-gradient(circle, #6EE07A, #CCFF00)', boxShadow: '0 0 40px rgba(110,224,122,0.35)' }}
                      >
                        <CheckCircle size={38} className="text-[#0C0C0C]" />
                      </motion.div>

                      <div>
                        <h3 className="heading-gradient font-display font-black text-[#F2F2F2] text-2xl uppercase tracking-tight mb-1">
                          You're Registered!
                        </h3>
                        <p className="font-sans text-[#888888] text-sm leading-relaxed max-w-xs mx-auto">
                          Registration for <span className="text-[#CCFF00] font-medium">{event.title}</span> submitted.
                          The organiser will confirm your spot shortly.
                        </p>
                      </div>

                      <div className="bg-[rgba(204,255,0,0.07)] border border-[rgba(255,255,255,0.1)] rounded-xl px-5 py-4 inline-block mx-auto">
                        <p className="font-mono text-[#CCFF00] text-[10px] uppercase tracking-[3px] mb-1">Reference Code</p>
                        <p className="font-mono font-bold text-[#CCFF00] text-xl tracking-[4px]">{refCode}</p>
                      </div>

                      <div className="bg-[rgba(12,12,12,0.4)] border border-[rgba(204,255,0,0.08)] rounded-xl p-4 text-left space-y-2">
                        <p className="font-mono text-[#CCFF00] text-[10px] uppercase tracking-[2px] mb-2">What's Next</p>
                        {[
                          { icon: <Clock size={12} />,       text: 'Organiser reviews your registration (usually within 48h)' },
                          { icon: <CheckCircle size={12} />, text: "You'll receive a confirmation notification"               },
                          { icon: <Calendar size={12} />,    text: 'Assignment details will appear in My Assignments'         },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2.5 font-sans text-[#888888] text-xs">
                            <span className="text-[#CCFF00] flex-shrink-0">{item.icon}</span>{item.text}
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button onClick={() => { setOpen(false); navigate('/dashboard/assignments'); }}
                          className="btn-primary flex-1 justify-center py-3">
                          View My Assignments
                        </button>
                        <button onClick={() => setOpen(false)} className="btn-outline flex-1 justify-center py-3">
                          Back to Events
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Footer buttons */}
                {step < 4 && (
                  <div className="flex-shrink-0 px-6 pb-5 pt-3 border-t border-[rgba(204,255,0,0.08)] flex gap-3">
                    {step > 0 && (
                      <button onClick={() => setStep((step - 1) as Step)} className="btn-outline py-3 px-5 text-sm">
                        ← Back
                      </button>
                    )}
                    <button
                      onClick={handleNext}
                      disabled={loading || (step === 1 && !avail)}
                      className="btn-primary flex-1 justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading
                        ? <><Loader2 size={16} className="animate-spin" />Submitting…</>
                        : step === 0 && !user ? 'Sign In to Register'
                        : step === 0 ? <><span>Continue</span><ChevronRight size={15} /></>
                        : step === 1 ? <><span>Preferences</span><ChevronRight size={15} /></>
                        : step === 2 ? <><span>Review</span><ChevronRight size={15} /></>
                        : <><span>Submit Registration</span><CheckCircle size={15} /></>
                      }
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}