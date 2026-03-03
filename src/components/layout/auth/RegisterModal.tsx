import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Mail, Lock, Eye, EyeOff, User, Phone, MapPin,
  AlertCircle, Loader2, CheckCircle, ChevronDown,
  Building2, Shield,
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { CITIES, VOLUNTEER_SKILLS, CAUSES } from '../../../constants';

// ── CONSTANTS ─────────────────────────────────
const ROLE_HOME: Record<string, string> = {
  volunteer: '/dashboard',
  organiser: '/organiser/dashboard',
};

const STEPS = ['Role', 'Details', 'Interests', 'Done'] as const;
type Step = 0 | 1 | 2 | 3;

// ── ROLE CARD ─────────────────────────────────
function RoleCard({
  role, icon, title, desc, features, color, selected, onClick,
}: {
  role: string; icon: React.ReactNode; title: string;
  desc: string; features: string[]; color: string;
  selected: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200 w-full ${
        selected
          ? 'border-current bg-current/10'
          : 'border-[rgba(84,172,191,0.15)] bg-[rgba(1,28,64,0.4)] hover:border-[rgba(84,172,191,0.3)]'
      }`}
      style={{ color: selected ? color : undefined }}
    >
      {selected && (
        <span className="absolute top-3 right-3">
          <CheckCircle size={16} style={{ color }} />
        </span>
      )}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        style={{ background: `${color}20`, color }}
      >
        {icon}
      </div>
      <p className="font-display font-black text-[#F0FAFB] text-base uppercase tracking-wide leading-none mb-1">
        {title}
      </p>
      <p className="font-sans text-[#8BBFCC] text-xs leading-snug mb-3">{desc}</p>
      <ul className="space-y-1">
        {features.map(f => (
          <li key={f} className="flex items-center gap-1.5 font-sans text-[11px]" style={{ color: selected ? color : '#54ACBF' }}>
            <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'currentColor' }} />
            {f}
          </li>
        ))}
      </ul>
    </button>
  );
}

// ── SKILL CHIP ────────────────────────────────
function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg border font-display font-bold text-xs uppercase tracking-wide transition-all ${
        selected
          ? 'bg-[rgba(84,172,191,0.15)] border-[#54ACBF] text-[#A7EBF2]'
          : 'border-[rgba(84,172,191,0.15)] text-[#8BBFCC] hover:border-[rgba(84,172,191,0.35)] hover:text-[#F0FAFB]'
      }`}
    >
      {selected && <span className="mr-1">✓</span>}
      {label}
    </button>
  );
}

// ═════════════════════════════════════════════
export default function RegisterModal() {
  const [open,     setOpen]     = useState(false);
  const [step,     setStep]     = useState<Step>(0);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // Form fields
  const [role,     setRole]     = useState<'volunteer' | 'organiser'>('volunteer');
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [phone,    setPhone]    = useState('');
  const [city,     setCity]     = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPass, setShowPass] = useState(false);
  const [orgName,  setOrgName]  = useState('');
  const [skills,   setSkills]   = useState<string[]>([]);
  const [causes,   setCauses]   = useState<string[]>([]);

  const nameRef  = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setUser, setProfile } = useAuthStore();

  // ── Listen for open event ──
  useEffect(() => {
    function handle() {
      setOpen(true);
      resetForm();
    }
    window.addEventListener('open-register', handle);
    return () => window.removeEventListener('open-register', handle);
  }, []);

  // ── ESC to close ──
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && step !== 3) setOpen(false); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [step]);

  // ── Focus first field when step 1 opens ──
  useEffect(() => {
    if (step === 1) setTimeout(() => nameRef.current?.focus(), 100);
  }, [step]);

  function resetForm() {
    setStep(0); setError('');
    setRole('volunteer'); setName(''); setEmail(''); setPhone('');
    setCity(''); setPassword(''); setConfirm(''); setOrgName('');
    setSkills([]); setCauses([]);
  }

  function close() { if (step !== 3) { setOpen(false); } }

  function openLogin() {
    setOpen(false);
    setTimeout(() => window.dispatchEvent(new CustomEvent('open-login')), 150);
  }

  function toggleSkill(s: string) {
    setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  function toggleCause(id: string) {
    setCauses(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  // ── Step validations ──
  function validateStep1(): string {
    if (!name.trim())   return 'Please enter your full name.';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email.';
    if (!phone.trim())  return 'Please enter your phone number.';
    if (!city)          return 'Please select your city.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (password !== confirm) return 'Passwords do not match.';
    if (role === 'organiser' && !orgName.trim()) return 'Please enter your organisation name.';
    return '';
  }

  function handleNext() {
    setError('');
    if (step === 0) { setStep(1); return; }
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
      if (role === 'organiser') { handleFinalSubmit(); return; } // organisers skip interests
      setStep(2);
      return;
    }
    if (step === 2) { handleFinalSubmit(); }
  }

  async function handleFinalSubmit() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));

    const newId = `u_${Date.now()}`;
    setUser({
      id:         newId,
      email:      email.toLowerCase().trim(),
      role,
    });
    setProfile({
      userId:             newId,
      fullName:           name.trim(),
      firstName:          name.trim().split(' ')[0],
      lastName:           name.trim().split(' ').slice(1).join(' '),
      phone:              phone.trim(),
      city,
      org_name:           role === 'organiser' ? orgName.trim() : undefined,
      // New accounts start at zero — Supabase will provide real values later
      total_hours:        0,
      status_tier:        'none',
      mq_score:           0,
      events_attended:    0,
      certificates_count: 0,
      skills:             skills,
      causes:             causes,
    });

    setLoading(false);
    setStep(3);
  }

  function handleGoToDashboard() {
    setOpen(false);
    navigate(ROLE_HOME[role]);
  }

  // ── PROGRESS BAR ──────────────────────────
  const totalSteps = role === 'organiser' ? 2 : 3;
  const progress   = step === 3 ? 100 : Math.round((step / totalSteps) * 100);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[150] bg-[#011C40]/85 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
          />

          <motion.div
            role="dialog" aria-modal="true" aria-label="Create account"
            className="fixed inset-0 z-[160] flex items-center justify-center p-4 pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{   opacity: 0, scale: 0.95,  y: 8  }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto w-full max-w-lg max-h-[92vh] flex flex-col"
            >
              <div className="bg-[#023859] border border-[rgba(84,172,191,0.2)] rounded-2xl shadow-[0_24px_80px_rgba(1,28,64,0.8)] flex flex-col overflow-hidden">

                {/* Top strip + progress */}
                <div className="flex-shrink-0">
                  <div className="h-1 bg-[rgba(84,172,191,0.1)] relative">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#54ACBF] to-[#6EE07A]"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>

                  {/* Header */}
                  <div className="flex items-start justify-between px-7 pt-5 pb-4">
                    <div>
                      <p className="font-mono text-[#54ACBF] text-[10px] tracking-[3px] uppercase mb-1">
                        Step {Math.min(step + 1, 3)} of {totalSteps} — {STEPS[step]}
                      </p>
                      <h2 className="font-display font-black text-[#F0FAFB] uppercase text-2xl leading-none tracking-tight">
                        {step === 0 && 'Join Pruthwee'}
                        {step === 1 && 'Your Details'}
                        {step === 2 && 'Your Interests'}
                        {step === 3 && 'Welcome Aboard!'}
                      </h2>
                    </div>
                    {step !== 3 && (
                      <button
                        onClick={close}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8BBFCC] hover:text-[#FCA5A5] hover:bg-[rgba(252,165,165,0.08)] transition-all mt-0.5"
                        aria-label="Close"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-7 pb-6 space-y-5">

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2.5 bg-[rgba(252,165,165,0.08)] border border-[rgba(252,165,165,0.25)] rounded-xl px-4 py-3"
                      >
                        <AlertCircle size={14} className="text-[#FCA5A5] flex-shrink-0" />
                        <p className="font-sans text-[#FCA5A5] text-sm">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── STEP 0: ROLE ── */}
                  {step === 0 && (
                    <motion.div
                      key="step0"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      className="space-y-3"
                    >
                      <p className="font-sans text-[#8BBFCC] text-sm">
                        How will you use Pruthwee?
                      </p>
                      <RoleCard
                        role="volunteer"
                        icon={<User size={20} />}
                        title="Volunteer"
                        desc="Join events, log hours, earn certificates and climb the tier ladder."
                        features={['Browse & register for events', 'Track hours & certificates', 'Tier system: Bronze → Diamond']}
                        color="#6EE07A"
                        selected={role === 'volunteer'}
                        onClick={() => setRole('volunteer')}
                      />
                      <RoleCard
                        role="organiser"
                        icon={<Building2 size={20} />}
                        title="Organiser / NGO"
                        desc="Create events, manage sectors, allocate volunteers and close events."
                        features={['Create & publish events', 'Allocation & messaging tools', 'Sector & group management']}
                        color="#A7EBF2"
                        selected={role === 'organiser'}
                        onClick={() => setRole('organiser')}
                      />
                    </motion.div>
                  )}

                  {/* ── STEP 1: DETAILS ── */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      {/* Name */}
                      <div>
                        <label className="label" htmlFor="reg-name">Full Name</label>
                        <div className="relative mt-1">
                          <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#54ACBF] pointer-events-none z-10" />
                          <input
                            ref={nameRef}
                            id="reg-name"
                            type="text"
                            value={name}
                            onChange={e => { setName(e.target.value); setError(''); }}
                            placeholder="Arjun Patel"
                            required
                            autoComplete="name"
                            className="input !pl-10"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="label" htmlFor="reg-email">Email</label>
                        <div className="relative mt-1">
                          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#54ACBF] pointer-events-none z-10" />
                          <input
                            id="reg-email"
                            type="email"
                            value={email}
                            onChange={e => { setEmail(e.target.value); setError(''); }}
                            placeholder="you@email.com"
                            required
                            autoComplete="email"
                            className="input !pl-10"
                          />
                        </div>
                      </div>

                      {/* Phone + City row */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="label" htmlFor="reg-phone">Phone</label>
                          <div className="relative mt-1">
                            <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#54ACBF] pointer-events-none z-10" />
                            <input
                              id="reg-phone"
                              type="tel"
                              value={phone}
                              onChange={e => { setPhone(e.target.value); setError(''); }}
                              placeholder="+91 98765..."
                              required
                              autoComplete="tel"
                              className="input !pl-10"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="label" htmlFor="reg-city">City</label>
                          <div className="relative mt-1">
                            <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#54ACBF] pointer-events-none z-10" />
                            <select
                              id="reg-city"
                              value={city}
                              onChange={e => { setCity(e.target.value); setError(''); }}
                              required
                              className="input !pl-10 appearance-none cursor-pointer"
                            >
                              <option value="">Select...</option>
                              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#54ACBF] pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      {/* Org name (organiser only) */}
                      {role === 'organiser' && (
                        <div>
                          <label className="label" htmlFor="reg-org">Organisation Name</label>
                          <div className="relative mt-1">
                            <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#54ACBF] pointer-events-none z-10" />
                            <input
                              id="reg-org"
                              type="text"
                              value={orgName}
                              onChange={e => { setOrgName(e.target.value); setError(''); }}
                              placeholder="Green Earth Foundation"
                              required
                              className="input !pl-10"
                            />
                          </div>
                        </div>
                      )}

                      {/* Password */}
                      <div>
                        <label className="label" htmlFor="reg-pass">Password</label>
                        <div className="relative mt-1">
                          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#54ACBF] pointer-events-none z-10" />
                          <input
                            id="reg-pass"
                            type={showPass ? 'text' : 'password'}
                            value={password}
                            onChange={e => { setPassword(e.target.value); setError(''); }}
                            placeholder="Min 8 characters"
                            required
                            autoComplete="new-password"
                            className="input !pl-10 !pr-11"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPass(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#54ACBF] hover:text-[#A7EBF2] transition-colors p-1"
                          >
                            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                        {/* Strength bar */}
                        {password.length > 0 && (
                          <div className="mt-1.5 flex gap-1">
                            {[1, 2, 3, 4].map(i => (
                              <div
                                key={i}
                                className="flex-1 h-1 rounded-full transition-all duration-300"
                                style={{
                                  background: i <= Math.min(4, Math.ceil(password.length / 3))
                                    ? password.length >= 12 ? '#6EE07A' : password.length >= 8 ? '#FCD34D' : '#FCA5A5'
                                    : 'rgba(84,172,191,0.15)',
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Confirm */}
                      <div>
                        <label className="label" htmlFor="reg-confirm">Confirm Password</label>
                        <div className="relative mt-1">
                          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#54ACBF] pointer-events-none z-10" />
                          <input
                            id="reg-confirm"
                            type={showPass ? 'text' : 'password'}
                            value={confirm}
                            onChange={e => { setConfirm(e.target.value); setError(''); }}
                            placeholder="Repeat password"
                            required
                            autoComplete="new-password"
                            className={`input !pl-10 ${confirm && confirm !== password ? 'border-[rgba(252,165,165,0.5)]' : confirm && confirm === password ? 'border-[rgba(110,224,122,0.4)]' : ''}`}
                          />
                          {confirm && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2">
                              {confirm === password
                                ? <CheckCircle size={15} className="text-[#6EE07A]" />
                                : <AlertCircle size={15} className="text-[#FCA5A5]" />}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 2: INTERESTS (volunteer only) ── */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      className="space-y-5"
                    >
                      {/* Skills */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="label">Skills</label>
                          <span className="font-mono text-[#54ACBF] text-[10px] tracking-wide">
                            {skills.length} selected
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {VOLUNTEER_SKILLS.map(s => (
                            <Chip key={s} label={s} selected={skills.includes(s)} onClick={() => toggleSkill(s)} />
                          ))}
                        </div>
                      </div>

                      {/* Causes */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="label">Causes You Care About</label>
                          <span className="font-mono text-[#54ACBF] text-[10px] tracking-wide">
                            {causes.length} selected
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {CAUSES.map(c => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => toggleCause(c.id)}
                              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border font-display font-bold text-xs uppercase tracking-wide transition-all text-left ${
                                causes.includes(c.id)
                                  ? 'bg-[rgba(84,172,191,0.12)] border-[#54ACBF] text-[#A7EBF2]'
                                  : 'border-[rgba(84,172,191,0.12)] text-[#8BBFCC] hover:border-[rgba(84,172,191,0.3)]'
                              }`}
                            >
                              <span className="text-base">{c.icon}</span>
                              {c.label}
                              {causes.includes(c.id) && <CheckCircle size={11} className="ml-auto text-[#54ACBF]" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      <p className="font-sans text-[#8BBFCC] text-xs">
                        You can update these anytime from your profile.
                      </p>
                    </motion.div>
                  )}

                  {/* ── STEP 3: SUCCESS ── */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="text-center py-4"
                    >
                      <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                        className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
                        style={{
                          background: 'radial-gradient(circle, #6EE07A, #54ACBF)',
                          boxShadow: '0 0 40px rgba(110,224,122,0.4)',
                        }}
                      >
                        <CheckCircle size={36} className="text-[#011C40]" />
                      </motion.div>

                      <h3 className="font-display font-black text-[#F0FAFB] text-2xl uppercase tracking-wide mb-2">
                        You're in!
                      </h3>
                      <p className="font-sans text-[#8BBFCC] text-sm leading-relaxed max-w-xs mx-auto mb-1">
                        Welcome to Pruthwee, <span className="text-[#A7EBF2] font-medium">{name.split(' ')[0]}</span>.
                        {role === 'volunteer'
                          ? ' Start by exploring events or completing your profile.'
                          : ' Your organiser account is ready. Create your first event.'}
                      </p>
                      {role === 'organiser' && (
                        <div className="flex items-center justify-center gap-1.5 mt-2 bg-[rgba(252,211,77,0.08)] border border-[rgba(252,211,77,0.2)] rounded-xl px-4 py-2 max-w-xs mx-auto">
                          <Shield size={13} className="text-[#FCD34D]" />
                          <p className="font-sans text-[#FCD34D] text-xs">
                            Organiser accounts are reviewed within 24h.
                          </p>
                        </div>
                      )}

                      <button
                        onClick={handleGoToDashboard}
                        className="btn-primary mt-6 px-10 py-3 text-base mx-auto"
                      >
                        {role === 'volunteer' ? 'Go to My Dashboard' : 'Go to Organiser Panel'}
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Footer actions */}
                {step !== 3 && (
                  <div className="flex-shrink-0 px-7 pb-6 pt-3 border-t border-[rgba(84,172,191,0.1)] space-y-3">
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={loading}
                      className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading
                        ? <><Loader2 size={16} className="animate-spin" /> Creating account…</>
                        : step === 0 ? 'Continue'
                        : step === 1 && role === 'organiser' ? 'Create Account'
                        : step === 1 ? 'Next: Interests'
                        : 'Create Account'}
                    </button>

                    {step > 0 && (
                      <button
                        type="button"
                        onClick={() => { setStep((step - 1) as Step); setError(''); }}
                        className="btn-outline w-full justify-center py-2.5 text-sm"
                      >
                        ← Back
                      </button>
                    )}

                    {step === 0 && (
                      <p className="font-sans text-[#8BBFCC] text-sm text-center">
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={openLogin}
                          className="text-[#54ACBF] font-medium hover:text-[#A7EBF2] transition-colors underline underline-offset-2"
                        >
                          Sign in
                        </button>
                      </p>
                    )}
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