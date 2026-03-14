import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Calendar, MapPin, Users, FileText,
  CheckCircle, Image, Tag, Clock, Info, ArrowLeft,
} from 'lucide-react';
import { CITIES } from '../../constants';

const CATEGORIES = ['Environment', 'Education', 'Health', 'Sports', 'Cultural', 'Community'];
const STEPS = ['Basics', 'Details', 'Setup', 'Review'] as const;
type Step = 0 | 1 | 2 | 3;

function StepDot({ step, current }: { step: number; current: number }) {
  const done   = step < current;
  const active = step === current;
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-xs transition-all flex-shrink-0 ${
      done   ? 'bg-[#CCFF00] text-[#0C0C0C]' :
      active ? 'bg-[#CCFF00]/20 border-2 border-[#CCFF00] text-[#CCFF00]' :
               'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#888888]'
    }`}>
      {done ? <CheckCircle size={14} /> : step + 1}
    </div>
  );
}

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [step,   setStep]   = useState<Step>(0);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  // Form state
  const [title,       setTitle]       = useState('');
  const [category,    setCategory]    = useState('');
  const [description, setDescription] = useState('');
  const [date,        setDate]        = useState('');
  const [endDate,     setEndDate]     = useState('');
  const [city,        setCity]        = useState('');
  const [venue,       setVenue]       = useState('');
  const [maxSeats,    setMaxSeats]    = useState('');
  const [bannerUrl,   setBannerUrl]   = useState('');
  const [isPublic,    setIsPublic]    = useState(true);
  const [regDeadline, setRegDeadline] = useState('');

  function validate(): string {
    if (step === 0) {
      if (!title.trim())    return 'Event title is required.';
      if (!category)        return 'Please select a category.';
      if (!description.trim() || description.length < 30) return 'Description must be at least 30 characters.';
    }
    if (step === 1) {
      if (!date)   return 'Event date is required.';
      if (!city)   return 'Please select a city.';
      if (!venue.trim()) return 'Venue is required.';
    }
    if (step === 2) {
      if (!maxSeats || parseInt(maxSeats) < 1) return 'Max seats must be at least 1.';
    }
    return '';
  }

  function handleNext() {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    if (step < 3) setStep((step + 1) as Step);
  }

  async function handlePublish() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setSaving(false);
    navigate('/organiser/dashboard');
  }

  const progressPct = (step / 3) * 100;

  return (
    <div className="bg-[#0C0C0C] min-h-screen">
      {/* Top bar */}
      <div className="bg-[#02294D] border-b border-[rgba(204,255,0,0.1)] sticky top-[72px] z-20">
        <div className="max-w-3xl mx-auto px-5 md:px-8 py-4">
          <div className="flex items-center gap-3 mb-3">
            <Link to="/organiser/dashboard" className="flex items-center gap-1.5 font-mono text-[#CCFF00] text-xs uppercase tracking-wide hover:text-[#CCFF00] transition-colors">
              <ArrowLeft size={12} /> Dashboard
            </Link>
            <ChevronRight size={12} className="text-[#CCFF00]" />
            <span className="font-mono text-[#CCFF00] text-xs uppercase tracking-wide">Create Event</span>
          </div>
          {/* Step dots */}
          <div className="flex items-center gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => i < step && setStep(i as Step)}>
                  <StepDot step={i} current={step} />
                  <span className={`font-display font-bold text-xs uppercase tracking-wide hidden sm:block ${i === step ? 'text-[#CCFF00]' : i < step ? 'text-[#CCFF00]' : 'text-[#888888]'}`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && <ChevronRight size={12} className="text-[rgba(204,255,0,0.3)] hidden sm:block" />}
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-1 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-[#CCFF00] to-[#BBEE00] rounded-full"
              animate={{ width: `${progressPct}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 md:px-8 py-10">
        <AnimatePresence mode="wait">
          {/* ── STEP 0: BASICS ── */}
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <p className="font-mono text-[#CCFF00] text-[10px] uppercase tracking-[2px] mb-1">Step 1</p>
                <h1 className="heading-gradient font-display font-black text-[#F2F2F2] uppercase" style={{ fontSize: 'clamp(22px,3vw,36px)' }}>Event Basics</h1>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="label flex items-center gap-1.5"><FileText size={12} /> Event Title *</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Sabarmati River Clean-Up 2026" className="input w-full mt-1" />
                </div>
                <div>
                  <label className="label flex items-center gap-1.5"><Tag size={12} /> Category *</label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {CATEGORIES.map(cat => (
                      <button key={cat} type="button" onClick={() => setCategory(cat)}
                        className={`px-3 py-2.5 rounded-xl border font-display font-bold text-xs uppercase tracking-wide transition-all ${
                          category === cat
                            ? 'bg-[rgba(255,255,255,0.08)] border-[#CCFF00] text-[#CCFF00]'
                            : 'border-[rgba(255,255,255,0.07)] text-[#888888] hover:border-[rgba(255,255,255,0.15)]'
                        }`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label flex items-center gap-1.5"><Info size={12} /> Description * <span className="ml-auto font-mono text-[10px] opacity-60">{description.length}/1000</span></label>
                  <textarea value={description} onChange={e => setDescription(e.target.value.slice(0,1000))}
                    rows={5} placeholder="Describe the event, its goals, what volunteers will do, and any requirements..."
                    className="input w-full mt-1 resize-none" />
                </div>
                <div>
                  <label className="label flex items-center gap-1.5"><Image size={12} /> Banner Image URL <span className="font-sans normal-case tracking-normal opacity-60">(optional)</span></label>
                  <input value={bannerUrl} onChange={e => setBannerUrl(e.target.value)} placeholder="https://..." className="input w-full mt-1" />
                  {bannerUrl && (
                    <div className="mt-2 h-32 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
                      <img src={bannerUrl} className="w-full h-full object-cover" onError={e => (e.currentTarget.src = '')} />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 1: DETAILS ── */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <p className="font-mono text-[#CCFF00] text-[10px] uppercase tracking-[2px] mb-1">Step 2</p>
                <h1 className="heading-gradient font-display font-black text-[#F2F2F2] uppercase" style={{ fontSize: 'clamp(22px,3vw,36px)' }}>Date & Location</h1>
              </div>
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label flex items-center gap-1.5"><Calendar size={12} /> Start Date *</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input w-full mt-1" />
                  </div>
                  <div>
                    <label className="label flex items-center gap-1.5"><Calendar size={12} /> End Date <span className="font-sans normal-case tracking-normal opacity-60">(optional)</span></label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input w-full mt-1" />
                  </div>
                </div>
                <div>
                  <label className="label flex items-center gap-1.5"><Clock size={12} /> Registration Deadline <span className="font-sans normal-case tracking-normal opacity-60">(optional)</span></label>
                  <input type="date" value={regDeadline} onChange={e => setRegDeadline(e.target.value)} className="input w-full mt-1" />
                </div>
                <div>
                  <label className="label flex items-center gap-1.5"><MapPin size={12} /> City *</label>
                  <select value={city} onChange={e => setCity(e.target.value)} className="input w-full mt-1">
                    <option value="">Select city...</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label flex items-center gap-1.5"><MapPin size={12} /> Venue / Address *</label>
                  <input value={venue} onChange={e => setVenue(e.target.value)} placeholder="e.g. Sabarmati Riverfront, Ellis Bridge" className="input w-full mt-1" />
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: SETUP ── */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <p className="font-mono text-[#CCFF00] text-[10px] uppercase tracking-[2px] mb-1">Step 3</p>
                <h1 className="heading-gradient font-display font-black text-[#F2F2F2] uppercase" style={{ fontSize: 'clamp(22px,3vw,36px)' }}>Volunteer Setup</h1>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="label flex items-center gap-1.5"><Users size={12} /> Max Volunteers *</label>
                  <input type="number" min="1" max="10000" value={maxSeats} onChange={e => setMaxSeats(e.target.value)} placeholder="e.g. 100" className="input w-full mt-1" />
                  <p className="font-sans text-[#888888] text-xs mt-1.5">You can close registrations manually at any time.</p>
                </div>
                <div>
                  <label className="label mb-2 block">Visibility</label>
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(204,255,0,0.03)]">
                    <button onClick={() => setIsPublic(true)}
                      className={`flex-1 py-2.5 rounded-lg border font-display font-bold text-xs uppercase tracking-wide transition-all ${isPublic ? 'bg-[rgba(255,255,255,0.08)] border-[#CCFF00] text-[#CCFF00]' : 'border-[rgba(255,255,255,0.07)] text-[#888888]'}`}>
                      🌐 Public
                    </button>
                    <button onClick={() => setIsPublic(false)}
                      className={`flex-1 py-2.5 rounded-lg border font-display font-bold text-xs uppercase tracking-wide transition-all ${!isPublic ? 'bg-[rgba(255,255,255,0.08)] border-[#CCFF00] text-[#CCFF00]' : 'border-[rgba(255,255,255,0.07)] text-[#888888]'}`}>
                      🔒 Private
                    </button>
                  </div>
                  <p className="font-sans text-[#888888] text-xs mt-1.5">
                    {isPublic ? 'Visible on the events listing. Anyone can register.' : 'Only visible via direct link. Invite-only.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: REVIEW ── */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <p className="font-mono text-[#CCFF00] text-[10px] uppercase tracking-[2px] mb-1">Step 4</p>
                <h1 className="heading-gradient font-display font-black text-[#F2F2F2] uppercase" style={{ fontSize: 'clamp(22px,3vw,36px)' }}>Review & Publish</h1>
              </div>

              {bannerUrl && (
                <div className="h-44 rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
                  <img src={bannerUrl} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="bg-[#141414] border border-[rgba(204,255,0,0.1)] rounded-2xl divide-y divide-[rgba(204,255,0,0.07)]">
                {[
                  { label: 'Title',       value: title       },
                  { label: 'Category',    value: category    },
                  { label: 'Date',        value: date + (endDate ? ` → ${endDate}` : '') },
                  { label: 'City',        value: city        },
                  { label: 'Venue',       value: venue       },
                  { label: 'Max Seats',   value: maxSeats    },
                  { label: 'Visibility',  value: isPublic ? 'Public' : 'Private' },
                  { label: 'Reg Deadline', value: regDeadline || '—' },
                ].map(row => (
                  <div key={row.label} className="flex items-start gap-4 px-5 py-3">
                    <span className="font-mono text-[#CCFF00] text-[10px] uppercase tracking-[2px] w-28 flex-shrink-0 pt-0.5">{row.label}</span>
                    <span className="font-sans text-[#F2F2F2] text-sm">{row.value}</span>
                  </div>
                ))}
              </div>

              {description && (
                <div className="bg-[#141414] border border-[rgba(204,255,0,0.1)] rounded-2xl p-5">
                  <p className="font-mono text-[#CCFF00] text-[10px] uppercase tracking-[2px] mb-2">Description</p>
                  <p className="font-sans text-[#888888] text-sm leading-relaxed">{description}</p>
                </div>
              )}

              <div className="flex items-start gap-3 p-4 bg-[rgba(204,255,0,0.05)] border border-[rgba(255,255,255,0.08)] rounded-xl">
                <Info size={14} className="text-[#CCFF00] flex-shrink-0 mt-0.5" />
                <p className="font-sans text-[#888888] text-sm">
                  After publishing, you can set up sectors and start accepting registrations from the event workspace.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-5 flex items-center gap-2 px-4 py-3 bg-[rgba(252,165,165,0.08)] border border-[rgba(252,165,165,0.25)] rounded-xl">
            <CheckCircle size={14} className="text-[#FCA5A5]" />
            <p className="font-sans text-[#FCA5A5] text-sm">{error}</p>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button onClick={() => { setStep((step - 1) as Step); setError(''); }} className="btn-outline px-6 py-3">
              Back
            </button>
          )}
          {step < 3 ? (
            <button onClick={handleNext} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handlePublish} disabled={saving}
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-60">
              {saving ? (
                <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Publishing...</>
              ) : (
                <><CheckCircle size={16} /> Publish Event</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}