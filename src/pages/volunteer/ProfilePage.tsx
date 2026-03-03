import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  User, MapPin, Phone, Mail, Globe, Camera, Save, CheckCircle,
  Plus, X, AlertCircle, Zap, ChevronDown,
} from 'lucide-react';
import { VOLUNTEER_SKILLS, CAUSES, CITIES, LANGUAGES, AVAILABILITY_TYPES, STATUS_TIERS, TSHIRT_SIZES } from '../../constants';
import { useAuthStore } from '../../store/authStore';

function SR({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
  );
}

const SECTION_TABS = [
  { id: 'basic',     label: 'Basic Info'    },
  { id: 'skills',    label: 'Skills'        },
  { id: 'causes',    label: 'Causes'        },
  { id: 'avail',     label: 'Availability'  },
  { id: 'prefs',     label: 'Preferences'   },
  { id: 'privacy',   label: 'Privacy'       },
];

// Initial profile state
const INITIAL = {
  firstName:    'Arjun',
  lastName:     'Patel',
  email:        'arjun.patel@gmail.com',
  phone:        '+91-9876543210',
  city:         'Ahmedabad',
  bio:          'Environmental volunteer with a passion for river conservation. Available weekends and during office holidays.',
  dob:          '1998-07-14',
  gender:       'male',
  languages:    ['Gujarati', 'Hindi', 'English'] as string[],
  skills:       ['Photography', 'First Aid', 'Event Management', 'Social Media'] as string[],
  causes:       ['environment', 'education'] as string[],
  availability: 'full',
  tshirt:       'L',
  medical:      '',
  firstEvent:   'no',
  notifications:{ email: true,  sms: false,  whatsapp: true  },
  visibility:   { profile: true, hours: true, city: true      },
};

type ProfileState = typeof INITIAL;

// MQ Score factors
const MQ_FACTORS = [
  { label: 'Profile completeness', score: 20, max: 20, tip: 'Profile is complete.' },
  { label: 'Skills added',         score: 15, max: 20, tip: 'Add more skills to improve.' },
  { label: 'Causes selected',      score: 10, max: 15, tip: 'Add more causes.' },
  { label: 'Verified events',      score: 14, max: 20, tip: 'Attend more events.' },
  { label: 'Response rate',        score: 14, max: 25, tip: 'Reply faster to allocation emails.' },
];

// ═════════════════════════════════════════════
export default function ProfilePage() {
  const { profile: authProfile, setProfile: setAuthProfile } = useAuthStore();

  // Seed local form state from authStore on mount — falls back to INITIAL for dev
  const seed: ProfileState = {
    ...INITIAL,
    firstName:  authProfile?.firstName ?? authProfile?.fullName?.split(' ')[0] ?? INITIAL.firstName,
    lastName:   authProfile?.lastName  ?? authProfile?.fullName?.split(' ').slice(1).join(' ') ?? INITIAL.lastName,
    phone:      authProfile?.phone     ?? INITIAL.phone,
    city:       authProfile?.city      ?? INITIAL.city,
    skills:     (authProfile?.skills   ?? INITIAL.skills) as string[],
    causes:     (authProfile?.causes   ?? INITIAL.causes) as string[],
  };

  const [profile, setProfile] = useState<ProfileState>(seed);
  const [tab,     setTab]     = useState('basic');
  const [saved,   setSaved]   = useState(false);
  const [dirty,   setDirty]   = useState(false);

  const mqScore = authProfile?.mq_score ?? MQ_FACTORS.reduce((s, f) => s + f.score, 0);
  const tierId  = authProfile?.status_tier ?? 'silver';
  const tier    = STATUS_TIERS.find(t => t.id === tierId) ?? STATUS_TIERS[3];

  function update<K extends keyof ProfileState>(key: K, value: ProfileState[K]) {
    setProfile(p => ({ ...p, [key]: value }));
    setDirty(true);
  }

  function toggleArray(key: 'skills' | 'causes' | 'languages', value: string) {
    const arr = profile[key] as string[];
    update(key, arr.includes(value) ? arr.filter(x => x !== value) : [...arr, value]);
  }

  function handleSave() {
    // Persist key fields back to authStore so Navbar/Sidebar stay in sync
    setAuthProfile({
      ...(authProfile ?? { userId: '' }),
      fullName:  `${profile.firstName} ${profile.lastName}`.trim(),
      firstName: profile.firstName,
      lastName:  profile.lastName,
      phone:     profile.phone,
      city:      profile.city,
      skills:    profile.skills,
      causes:    profile.causes,
    });
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 2500);
  }

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
                My <span className="text-[#54ACBF]">Profile</span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {dirty && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center gap-1 font-mono text-[#FCD34D] text-xs tracking-wider">
                  <AlertCircle size={12} /> Unsaved changes
                </motion.span>
              )}
              <button onClick={handleSave}
                className={`btn-primary text-xs py-2.5 px-5 ${saved ? 'bg-[#6EE07A] border-[#6EE07A]' : ''}`}>
                {saved ? <><CheckCircle size={13} /> Saved!</> : <><Save size={13} /> Save Changes</>}
              </button>
            </div>
          </div>
        </SR>

        <div className="grid lg:grid-cols-[260px_1fr] gap-6">

          {/* ── LEFT: Avatar + MQ ── */}
          <div className="space-y-5">
            <SR>
              {/* Avatar card */}
              <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-6 text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#54ACBF] to-[#26658C] flex items-center justify-center mx-auto">
                    <span className="font-display font-black text-[#011C40] text-4xl">AP</span>
                  </div>
                  <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#023859] border border-[rgba(84,172,191,0.3)] flex items-center justify-center text-[#54ACBF] hover:text-[#A7EBF2] transition-colors">
                    <Camera size={13} />
                  </button>
                </div>

                {/* Name + tier */}
                <h2 className="font-display font-black text-[#F0FAFB] text-lg uppercase tracking-wide mb-1">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="font-sans text-[#8BBFCC] text-sm mb-3">{profile.city}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-display font-bold text-xs uppercase tracking-wide"
                  style={{ color: tier.color, borderColor: tier.borderColor, background: tier.bgColor }}>
                  {tier.icon} {tier.label}
                </div>
                <div className="mt-4 pt-4 border-t border-[rgba(84,172,191,0.1)] text-left space-y-2">
                  {[
                    { label: 'Joined',      value: 'March 2023'   },
                    { label: 'Events',      value: '14 attended'  },
                    { label: 'Hours',       value: '87.5h'        },
                    { label: 'Certs',       value: '6 issued'     },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between">
                      <span className="font-display font-bold text-[#8BBFCC] text-[10px] uppercase tracking-wide">{item.label}</span>
                      <span className="font-sans text-[#F0FAFB] text-xs">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SR>

            {/* MQ Score breakdown */}
            <SR delay={0.08}>
              <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={14} className="text-[#6EE07A]" />
                  <h3 className="font-display font-black text-[#A7EBF2] text-xs uppercase tracking-[2px]">MQ Score</h3>
                  <span className="ml-auto font-display font-black text-[#6EE07A] text-xl">{mqScore}</span>
                </div>
                <div className="h-2 bg-[rgba(110,224,122,0.1)] rounded-full overflow-hidden mb-4">
                  <motion.div className="h-full bg-[#6EE07A] rounded-full"
                    initial={{ width: 0 }} animate={{ width: `${mqScore}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }} />
                </div>
                <div className="space-y-2">
                  {MQ_FACTORS.map(f => (
                    <div key={f.label}>
                      <div className="flex justify-between mb-0.5">
                        <span className="font-sans text-[#8BBFCC] text-[11px]">{f.label}</span>
                        <span className="font-mono text-[#54ACBF] text-[11px]">{f.score}/{f.max}</span>
                      </div>
                      <div className="h-1 bg-[rgba(84,172,191,0.1)] rounded-full">
                        <div className="h-full rounded-full bg-[#54ACBF]" style={{ width: `${(f.score / f.max) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SR>
          </div>

          {/* ── RIGHT: Editor ── */}
          <SR delay={0.1}>
            <div className="bg-[rgba(2,56,89,0.4)] border border-[rgba(84,172,191,0.12)] rounded-2xl overflow-hidden">
              {/* Tab nav */}
              <div className="flex overflow-x-auto border-b border-[rgba(84,172,191,0.1)]">
                {SECTION_TABS.map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className={`flex-shrink-0 px-5 py-3.5 font-display font-bold text-xs uppercase tracking-wide transition-all border-b-2 ${
                      tab === t.id
                        ? 'text-[#A7EBF2] border-[#54ACBF]'
                        : 'text-[#8BBFCC] border-transparent hover:text-[#A7EBF2]'
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div key={tab}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>

                    {/* BASIC INFO */}
                    {tab === 'basic' && (
                      <div className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-5">
                          <div>
                            <label className="label">First Name</label>
                            <input className="input" value={profile.firstName}
                              onChange={e => update('firstName', e.target.value)} />
                          </div>
                          <div>
                            <label className="label">Last Name</label>
                            <input className="input" value={profile.lastName}
                              onChange={e => update('lastName', e.target.value)} />
                          </div>
                          <div>
                            <label className="label">Email</label>
                            <input className="input" type="email" value={profile.email}
                              onChange={e => update('email', e.target.value)} />
                          </div>
                          <div>
                            <label className="label">Phone</label>
                            <input className="input" type="tel" value={profile.phone}
                              onChange={e => update('phone', e.target.value)} />
                          </div>
                          <div>
                            <label className="label">City</label>
                            <div className="relative">
                              <select className="input appearance-none cursor-pointer"
                                value={profile.city} onChange={e => update('city', e.target.value)}>
                                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#54ACBF] pointer-events-none" />
                            </div>
                          </div>
                          <div>
                            <label className="label">Date of Birth</label>
                            <input className="input" type="date" value={profile.dob}
                              onChange={e => update('dob', e.target.value)} />
                          </div>
                          <div>
                            <label className="label">Gender</label>
                            <div className="relative">
                              <select className="input appearance-none cursor-pointer"
                                value={profile.gender} onChange={e => update('gender', e.target.value)}>
                                {['male','female','other','prefer_not'].map(g => (
                                  <option key={g} value={g}>{g === 'prefer_not' ? 'Prefer not to say' : g.charAt(0).toUpperCase() + g.slice(1)}</option>
                                ))}
                              </select>
                              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#54ACBF] pointer-events-none" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="label">Bio</label>
                          <textarea className="input resize-none" rows={3} value={profile.bio}
                            onChange={e => update('bio', e.target.value)}
                            placeholder="Tell organisers a little about yourself..." />
                          <p className="font-sans text-[#54ACBF] text-[11px] mt-1">
                            {profile.bio.length}/300 chars
                          </p>
                        </div>
                        {/* Languages */}
                        <div>
                          <label className="label">Languages</label>
                          <div className="flex flex-wrap gap-2">
                            {LANGUAGES.map(lang => {
                              const active = profile.languages.includes(lang);
                              return (
                                <button key={lang} type="button"
                                  onClick={() => toggleArray('languages', lang)}
                                  className={`px-3 py-1.5 rounded-full border font-display font-bold text-xs uppercase tracking-wide transition-all duration-150 ${
                                    active ? 'bg-[rgba(84,172,191,0.15)] border-[#54ACBF] text-[#A7EBF2]' : 'border-[rgba(84,172,191,0.15)] text-[#8BBFCC] hover:border-[#54ACBF]'
                                  }`}>
                                  {lang}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SKILLS */}
                    {tab === 'skills' && (
                      <div>
                        <p className="font-sans text-[#8BBFCC] text-sm mb-5 leading-relaxed">
                          Select all skills you have. These are used by the MQ matching engine to allocate you to the most suitable tasks.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {VOLUNTEER_SKILLS.map(skill => {
                            const active = profile.skills.includes(skill);
                            return (
                              <button key={skill} type="button"
                                onClick={() => toggleArray('skills', skill)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border font-display font-bold text-xs uppercase tracking-wide transition-all duration-150 ${
                                  active
                                    ? 'bg-[rgba(167,235,242,0.12)] border-[#A7EBF2] text-[#A7EBF2]'
                                    : 'border-[rgba(84,172,191,0.15)] text-[#8BBFCC] hover:border-[rgba(167,235,242,0.4)]'
                                }`}>
                                {active && <CheckCircle size={11} />}
                                {skill}
                              </button>
                            );
                          })}
                        </div>
                        <p className="font-sans text-[#54ACBF] text-xs mt-4">
                          {profile.skills.length} skill{profile.skills.length !== 1 ? 's' : ''} selected
                        </p>
                      </div>
                    )}

                    {/* CAUSES */}
                    {tab === 'causes' && (
                      <div>
                        <p className="font-sans text-[#8BBFCC] text-sm mb-5 leading-relaxed">
                          Choose the causes you care most about. This determines which events appear first in your recommended feed.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {CAUSES.map(cause => {
                            const active = profile.causes.includes(cause.id);
                            return (
                              <button key={cause.id} type="button"
                                onClick={() => toggleArray('causes', cause.id)}
                                className={`flex items-center gap-3 p-4 rounded-xl border font-display font-bold text-xs uppercase tracking-wide transition-all duration-150 text-left ${
                                  active
                                    ? 'bg-[rgba(84,172,191,0.1)] border-[#54ACBF] text-[#A7EBF2]'
                                    : 'border-[rgba(84,172,191,0.12)] text-[#8BBFCC] hover:border-[rgba(84,172,191,0.3)]'
                                }`}>
                                <span className="text-xl">{cause.icon}</span>
                                <div>
                                  <div>{cause.label}</div>
                                  {active && <div className="font-mono text-[#6EE07A] text-[9px] mt-0.5 normal-case tracking-wide">Selected</div>}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* AVAILABILITY */}
                    {tab === 'avail' && (
                      <div className="space-y-6">
                        <div>
                          <label className="label mb-3 block">Availability Type</label>
                          <div className="space-y-3">
                            {AVAILABILITY_TYPES.map(a => (
                              <button key={a.id} type="button"
                                onClick={() => update('availability', a.id)}
                                className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-150 ${
                                  profile.availability === a.id
                                    ? 'bg-[rgba(84,172,191,0.1)] border-[#54ACBF]'
                                    : 'border-[rgba(84,172,191,0.12)] hover:border-[rgba(84,172,191,0.3)]'
                                }`}>
                                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${profile.availability === a.id ? 'border-[#54ACBF]' : 'border-[rgba(84,172,191,0.3)]'}`}>
                                  {profile.availability === a.id && <div className="w-2 h-2 rounded-full bg-[#54ACBF]" />}
                                </div>
                                <div>
                                  <div className="font-display font-black text-[#F0FAFB] text-sm uppercase tracking-wide">{a.label}</div>
                                  <div className="font-sans text-[#8BBFCC] text-xs mt-0.5">{a.desc}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-5">
                          <div>
                            <label className="label">T-Shirt Size</label>
                            <div className="relative">
                              <select className="input appearance-none cursor-pointer"
                                value={profile.tshirt} onChange={e => update('tshirt', e.target.value)}>
                                {TSHIRT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#54ACBF] pointer-events-none" />
                            </div>
                          </div>
                          <div>
                            <label className="label">First-time volunteer?</label>
                            <div className="relative">
                              <select className="input appearance-none cursor-pointer"
                                value={profile.firstEvent} onChange={e => update('firstEvent', e.target.value)}>
                                <option value="no">No, I've volunteered before</option>
                                <option value="yes">Yes, first time</option>
                              </select>
                              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#54ACBF] pointer-events-none" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="label">Medical Conditions (Optional)</label>
                          <textarea className="input resize-none" rows={2} value={profile.medical}
                            onChange={e => update('medical', e.target.value)}
                            placeholder="Any relevant medical conditions for organiser awareness..." />
                          <p className="font-sans text-[#54ACBF] text-[11px] mt-1">Private — only shared with event organisers of events you register for.</p>
                        </div>
                      </div>
                    )}

                    {/* PREFERENCES */}
                    {tab === 'prefs' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-display font-black text-[#F0FAFB] text-sm uppercase tracking-wide mb-4">Notification Preferences</h3>
                          <div className="space-y-3">
                            {([['email', 'Email'], ['sms', 'SMS'], ['whatsapp', 'WhatsApp']] as const).map(([key, label]) => (
                              <div key={key} className="flex items-center justify-between p-4 bg-[rgba(1,28,64,0.5)] rounded-xl border border-[rgba(84,172,191,0.1)]">
                                <div>
                                  <div className="font-display font-bold text-[#F0FAFB] text-sm uppercase tracking-wide">{label}</div>
                                  <div className="font-sans text-[#8BBFCC] text-xs">Event notifications, assignment updates</div>
                                </div>
                                <button
                                  onClick={() => update('notifications', { ...profile.notifications, [key]: !profile.notifications[key] })}
                                  className={`relative w-11 h-6 rounded-full transition-all duration-200 ${profile.notifications[key] ? 'bg-[#54ACBF]' : 'bg-[rgba(84,172,191,0.2)]'}`}>
                                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${profile.notifications[key] ? 'left-6' : 'left-1'}`} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PRIVACY */}
                    {tab === 'privacy' && (
                      <div className="space-y-5">
                        <p className="font-sans text-[#8BBFCC] text-sm leading-relaxed">
                          Control what information is visible on your public Pruthwee profile.
                          Your email address is never publicly visible.
                        </p>
                        {[
                          { key: 'profile' as const, label: 'Public Profile',   desc: 'Organisers can find and view your profile.' },
                          { key: 'hours' as const,   label: 'Volunteer Hours',  desc: 'Show your total hours on your profile.' },
                          { key: 'city' as const,    label: 'City',             desc: 'Show your city on your profile.' },
                        ].map(item => (
                          <div key={item.key} className="flex items-center justify-between p-4 bg-[rgba(1,28,64,0.5)] rounded-xl border border-[rgba(84,172,191,0.1)]">
                            <div>
                              <div className="font-display font-bold text-[#F0FAFB] text-sm uppercase tracking-wide">{item.label}</div>
                              <div className="font-sans text-[#8BBFCC] text-xs">{item.desc}</div>
                            </div>
                            <button
                              onClick={() => update('visibility', { ...profile.visibility, [item.key]: !profile.visibility[item.key] })}
                              className={`relative w-11 h-6 rounded-full transition-all duration-200 ${profile.visibility[item.key] ? 'bg-[#54ACBF]' : 'bg-[rgba(84,172,191,0.2)]'}`}>
                              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${profile.visibility[item.key] ? 'left-6' : 'left-1'}`} />
                            </button>
                          </div>
                        ))}

                        <div className="pt-4 border-t border-[rgba(84,172,191,0.1)]">
                          <p className="font-display font-black text-[#FCA5A5] text-sm uppercase tracking-wide mb-3">Danger Zone</p>
                          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[rgba(252,165,165,0.25)] text-[#FCA5A5] font-display font-bold text-xs uppercase tracking-wide hover:bg-[rgba(252,165,165,0.08)] transition-all">
                            Delete My Account
                          </button>
                        </div>
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Save button */}
              <div className="px-6 py-4 border-t border-[rgba(84,172,191,0.1)] flex justify-end">
                <button onClick={handleSave}
                  className={`btn-primary text-xs py-2.5 px-6 ${saved ? '!bg-[#6EE07A] !border-[#6EE07A]' : ''}`}>
                  {saved ? <><CheckCircle size={13} /> Saved!</> : <><Save size={13} /> Save Changes</>}
                </button>
              </div>
            </div>
          </SR>
        </div>
      </div>
    </div>
  );
}