import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { ArrowRight, CheckCircle, Mail, Calendar, X, Eye } from 'lucide-react';

function SR({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const PAST_ISSUES = [
  {
    title:    'February 2026 — Summit Announced, Platform v3.0 Teaser',
    date:     'Feb 1, 2026',
    preview:  'Summit 2026 registration opens, first look at v3.0 features, February event calendar across 12 cities.',
    openRate: '64%',
  },
  {
    title:    'January 2026 — New Year, New Goals',
    date:     'Jan 5, 2026',
    preview:  '2025 annual impact report, most active cities, top volunteers of the year, 2026 event calendar preview.',
    openRate: '71%',
  },
  {
    title:    'December 2025 — Year in Review',
    date:     'Dec 3, 2025',
    preview:  'What a year — 5 lakh hours served, 12,000 volunteers, 48 cities. Reflecting on 2025 and what\'s next.',
    openRate: '78%',
  },
  {
    title:    'November 2025 — Coastal Clean-Up Season',
    date:     'Nov 3, 2025',
    preview:  'Winter event calendar, coastal clean-up registration open, NITI Aayog partnership renewal announcement.',
    openRate: '61%',
  },
  {
    title:    'October 2025 — Volunteer Stories Edition',
    date:     'Oct 6, 2025',
    preview:  'Feature: Priya Sharma\'s journey from first event to Gold tier. Plus October event listings.',
    openRate: '67%',
  },
  {
    title:    'September 2025 — 12,000 Volunteer Milestone',
    date:     'Sep 1, 2025',
    preview:  'We hit 12,000 registered volunteers. Behind the numbers, new cities launching, and September events.',
    openRate: '73%',
  },
];

const PREFERENCES = [
  { id: 'events',     label: 'New Events Near Me',          desc: 'Get notified when events open in your city.' },
  { id: 'news',       label: 'Platform News & Updates',     desc: 'Feature releases, policy changes, platform news.' },
  { id: 'stories',    label: 'Volunteer Stories',           desc: 'Monthly features on inspiring volunteers.' },
  { id: 'summit',     label: 'Summit & Flagship Events',    desc: 'Announcements for major Pruthwee events.' },
  { id: 'digest',     label: 'Monthly Digest',              desc: 'One email per month summarising everything.' },
];

// ═════════════════════════════════════════════
export default function NewsletterPage() {
  const [step, setStep]       = useState<'form' | 'prefs' | 'done'>('form');
  const [email, setEmail]     = useState('');
  const [name, setName]       = useState('');
  const [city, setCity]       = useState('');
  const [prefs, setPrefs]     = useState<string[]>(['events', 'digest']);
  const [frequency, setFreq]  = useState<'weekly' | 'monthly'>('monthly');
  const [previewOpen, setPreviewOpen] = useState<number | null>(null);

  function togglePref(id: string) {
    setPrefs(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  }

  function handleSubmitEmail(e: React.FormEvent) {
    e.preventDefault();
    if (email && name) setStep('prefs');
  }

  function handleSubmitPrefs(e: React.FormEvent) {
    e.preventDefault();
    setStep('done');
  }

  return (
    <div className="bg-[#0C0C0C] overflow-x-hidden">

      {/* Hero */}
      <section className="relative pt-10 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0C0C0C] via-[#141414] to-[#0C0C0C]" />
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#CCFF00]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65 }}>
            <span className="section-label">Stay Connected</span>
            <h1 className="heading-gradient font-display font-black text-[#F2F2F2] uppercase leading-none mb-4"
              style={{ fontSize: 'clamp(44px, 8vw, 96px)' }}>
              The Pruthwee{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] to-[#BBEE00]">
                Newsletter
              </span>
            </h1>
            <p className="font-sans text-[#888888] text-lg leading-relaxed mb-6 max-w-md">
              New events, volunteer stories, platform updates, and impact reports —
              delivered monthly to your inbox. No spam, ever.
            </p>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                { icon: '📬', text: '6,200+ subscribers' },
                { icon: '📈', text: '68% avg open rate' },
                { icon: '📅', text: 'Once a month' },
                { icon: '🔇', text: 'Zero spam' },
              ].map(s => (
                <div key={s.text} className="flex items-center gap-2 bg-[rgba(20,20,20,0.5)] border border-[rgba(255,255,255,0.07)] rounded-xl px-3 py-2">
                  <span className="text-base">{s.icon}</span>
                  <span className="font-display font-bold text-[#888888] text-xs uppercase tracking-wide">{s.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — subscription form */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.15 }}>
            <div className="bg-[rgba(20,20,20,0.5)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-8">

              {/* Step 1 — Email */}
              {step === 'form' && (
                <form onSubmit={handleSubmitEmail} className="space-y-5">
                  <div>
                    <h2 className="heading-gradient font-display font-black text-[#F2F2F2] text-2xl uppercase tracking-wide mb-1">
                      Subscribe Free
                    </h2>
                    <p className="font-sans text-[#888888] text-sm">Takes 30 seconds. Unsubscribe anytime.</p>
                  </div>

                  <div>
                    <label className="label">Your Name *</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="First name" required className="input" />
                  </div>
                  <div>
                    <label className="label">Email Address *</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="input" />
                  </div>
                  <div>
                    <label className="label">Your City</label>
                    <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Ahmedabad, Surat, Mumbai..." className="input" />
                    <p className="font-sans text-[#CCFF00] text-[10px] mt-1">Used to prioritise local event listings for you.</p>
                  </div>

                  <button type="submit" className="btn-primary w-full justify-center py-4 text-base">
                    Next — Choose Preferences <ArrowRight size={16} />
                  </button>

                  <p className="font-sans text-[#888888] text-xs text-center">
                    By subscribing you agree to receive email communications from Pruthwe volunteers.
                    We never share your data. <Link to="/privacy" className="text-[#CCFF00] hover:underline">Privacy Policy</Link>.
                  </p>
                </form>
              )}

              {/* Step 2 — Preferences */}
              {step === 'prefs' && (
                <form onSubmit={handleSubmitPrefs} className="space-y-5">
                  <div>
                    <h2 className="heading-gradient font-display font-black text-[#F2F2F2] text-2xl uppercase tracking-wide mb-1">
                      What Would You Like?
                    </h2>
                    <p className="font-sans text-[#888888] text-sm">Choose what {name} wants to hear about.</p>
                  </div>

                  <div className="space-y-2">
                    {PREFERENCES.map(pref => (
                      <button
                        key={pref.id}
                        type="button"
                        onClick={() => togglePref(pref.id)}
                        className={`w-full flex items-start gap-4 px-4 py-3 rounded-xl border text-left transition-all duration-150 ${
                          prefs.includes(pref.id)
                            ? 'bg-[rgba(255,255,255,0.06)] border-[#CCFF00]'
                            : 'border-[rgba(255,255,255,0.07)] hover:border-[rgba(204,255,0,0.35)]'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                          prefs.includes(pref.id) ? 'bg-[#CCFF00] border-[#CCFF00]' : 'border-[rgba(255,255,255,0.15)]'
                        }`}>
                          {prefs.includes(pref.id) && <CheckCircle size={11} className="text-[#0C0C0C]" />}
                        </div>
                        <div>
                          <div className={`font-display font-black text-sm uppercase tracking-wide ${prefs.includes(pref.id) ? 'text-[#CCFF00]' : 'text-[#F2F2F2]'}`}>
                            {pref.label}
                          </div>
                          <div className="font-sans text-[#888888] text-xs mt-0.5">{pref.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Frequency */}
                  <div>
                    <label className="label">Email Frequency</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['weekly', 'monthly'] as const).map(f => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFreq(f)}
                          className={`py-2.5 rounded-lg border font-display font-bold text-sm uppercase tracking-wide transition-all ${
                            frequency === f
                              ? 'bg-[rgba(255,255,255,0.07)] border-[#CCFF00] text-[#CCFF00]'
                              : 'border-[rgba(255,255,255,0.08)] text-[#888888] hover:border-[#CCFF00]'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                    <p className="font-sans text-[#CCFF00] text-[10px] mt-1">
                      {frequency === 'weekly' ? 'Every Monday morning — event highlights and platform news.' : 'First Monday of the month — full digest.'}
                    </p>
                  </div>

                  <button type="submit" className="btn-primary w-full justify-center py-4 text-base" disabled={prefs.length === 0}>
                    Subscribe <CheckCircle size={16} />
                  </button>
                  <button type="button" onClick={() => setStep('form')} className="w-full text-center font-display font-bold text-[#CCFF00] text-xs uppercase tracking-wide hover:text-[#CCFF00] transition-colors">
                    ← Back
                  </button>
                </form>
              )}

              {/* Step 3 — Done */}
              {step === 'done' && (
                <div className="text-center py-4">
                  <div className="text-5xl mb-5">🎉</div>
                  <h2 className="font-display font-black text-[#6EE07A] text-3xl uppercase tracking-wide mb-3">
                    You're In, {name}!
                  </h2>
                  <p className="font-sans text-[#888888] text-base mb-6 leading-relaxed">
                    Welcome to the Pruthwee newsletter. Your first email will arrive on{' '}
                    {frequency === 'weekly' ? 'next Monday' : 'the first Monday of next month'}.
                  </p>
                  <div className="space-y-3">
                    <Link to="/events" className="btn-primary w-full justify-center">
                      Browse Events <ArrowRight size={15} />
                    </Link>
                    <Link to="/news" className="btn-outline w-full justify-center">
                      Read Latest Articles
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What's in the newsletter */}
      <section className="py-20 bg-[#141414] border-y border-[rgba(204,255,0,0.1)]">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <SR>
            <div className="text-center mb-12">
              <span className="section-label">What's Inside</span>
              <h2 className="heading-gradient font-display font-black text-[#F2F2F2] uppercase leading-none"
                style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
                Every Issue Includes
              </h2>
            </div>
          </SR>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: '📅', title: 'Event Calendar',       desc: 'All upcoming events in your city, sorted by date. Direct registration links.' },
              { icon: '📖', title: 'Volunteer Story',      desc: 'One featured volunteer every month — their journey, their cause, their impact.' },
              { icon: '🔔', title: 'Platform Updates',     desc: 'New features, policy changes, and tips to get more from your Pruthwee profile.' },
              { icon: '📊', title: 'Monthly Impact Report', desc: 'Total hours, events, volunteers active — the numbers behind the movement.' },
            ].map((item, i) => (
              <SR key={item.title} delay={i * 0.07}>
                <div className="bg-[rgba(12,12,12,0.5)] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 hover:border-[rgba(255,255,255,0.15)] transition-all group text-center">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="heading-gradient font-display font-black text-[#F2F2F2] text-base uppercase tracking-wide mb-2 group-hover:text-[#CCFF00] transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-sans text-[#888888] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </SR>
            ))}
          </div>
        </div>
      </section>

      {/* Past issues */}
      <section className="py-20 md:py-28 bg-[#0C0C0C]">
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <SR>
            <div className="text-center mb-12">
              <span className="section-label">The Archive</span>
              <h2 className="heading-gradient font-display font-black text-[#F2F2F2] uppercase leading-none"
                style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
                Past <span className="text-[#CCFF00]">Issues</span>
              </h2>
            </div>
          </SR>

          <div className="space-y-3">
            {PAST_ISSUES.map((issue, i) => (
              <SR key={issue.title} delay={i * 0.06}>
                <div className="bg-[rgba(20,20,20,0.4)] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden hover:border-[rgba(255,255,255,0.12)] transition-all group">
                  <div className="flex items-start gap-5 p-5">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.06)] flex items-center justify-center flex-shrink-0">
                      <Mail size={18} className="text-[#CCFF00]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="heading-gradient font-display font-black text-[#F2F2F2] text-base uppercase tracking-wide leading-tight group-hover:text-[#CCFF00] transition-colors">
                        {issue.title}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 font-sans text-[#888888] text-xs">
                          <Calendar size={10} className="text-[#CCFF00]" /> {issue.date}
                        </span>
                        <span className="font-mono text-[#6EE07A] text-[10px] tracking-wider">
                          {issue.openRate} open rate
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setPreviewOpen(previewOpen === i ? null : i)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] text-[#888888] hover:text-[#CCFF00] hover:border-[rgba(204,255,0,0.35)] font-display font-bold text-[10px] uppercase tracking-wide transition-all flex-shrink-0"
                    >
                      <Eye size={12} /> Preview
                    </button>
                  </div>

                  {previewOpen === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0 border-t border-[rgba(204,255,0,0.1)] flex items-start gap-3">
                        <p className="font-sans text-[#888888] text-sm leading-relaxed flex-1">
                          {issue.preview}
                        </p>
                        <button onClick={() => setPreviewOpen(null)} className="text-[#CCFF00] hover:text-[#FCA5A5] transition-colors flex-shrink-0 mt-0.5">
                          <X size={14} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </SR>
            ))}
          </div>
        </div>
      </section>

      {/* Unsubscribe / privacy note */}
      <section className="py-16 bg-[#141414] border-t border-[rgba(204,255,0,0.1)]">
        <div className="max-w-3xl mx-auto px-5 md:px-10 text-center">
          <SR>
            <div className="space-y-3">
              <p className="font-sans text-[#888888] text-sm leading-relaxed">
                You can update your preferences or unsubscribe at any time using the link at the bottom of any newsletter.
                Your email address is never shared with third parties.
              </p>
              <div className="flex items-center justify-center gap-6 flex-wrap">
                <Link to="/privacy" className="font-display font-bold text-[#CCFF00] text-xs uppercase tracking-wide hover:text-[#CCFF00] transition-colors">
                  Privacy Policy
                </Link>
                <span className="text-[rgba(204,255,0,0.3)]">·</span>
                <Link to="/contact" className="font-display font-bold text-[#CCFF00] text-xs uppercase tracking-wide hover:text-[#CCFF00] transition-colors">
                  Contact Us
                </Link>
                <span className="text-[rgba(204,255,0,0.3)]">·</span>
                <span className="font-display font-bold text-[#888888] text-xs uppercase tracking-wide">
                  Pruthwe volunteers trust · Ahmedabad
                </span>
              </div>
            </div>
          </SR>
        </div>
      </section>
    </div>
  );
}