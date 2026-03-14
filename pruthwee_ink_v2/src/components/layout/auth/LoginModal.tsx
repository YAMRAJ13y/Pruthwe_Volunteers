import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

// ── MOCK ACCOUNTS (remove when Supabase is wired) ────
// Each entry is: email → { id, role, display }
const MOCK_ACCOUNTS: Record<string, { id: string; role: 'volunteer' | 'organiser' | 'admin'; name: string }> = {
  'volunteer@pruthwee.org':  { id: 'v001', role: 'volunteer',  name: 'Arjun Patel'     },
  'organiser@pruthwee.org':  { id: 'o001', role: 'organiser',  name: 'Paryavaran Trust' },
  'admin@pruthwee.org':      { id: 'a001', role: 'admin',       name: 'Platform Admin'  },
};
const MOCK_PASSWORD = 'pruthwee123';

// ── REDIRECT MAP ──────────────────────────────
const ROLE_HOME: Record<string, string> = {
  volunteer:  '/dashboard',
  organiser:  '/organiser/dashboard',
  admin:      '/admin',
};

// ── BACKDROP ─────────────────────────────────
function Backdrop({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[150] bg-[#0C0C0C]/80 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClick}
    />
  );
}

// ═════════════════════════════════════════════
export default function LoginModal() {
  const [open,      setOpen]      = useState(false);
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  const emailRef   = useRef<HTMLInputElement>(null);
  const navigate   = useNavigate();
  const location   = useLocation();
  const { setUser, setProfile } = useAuthStore();

  // ── Listen for open event from Navbar ──
  useEffect(() => {
    function handle() {
      setOpen(true);
      setError('');
      setEmail('');
      setPassword('');
    }
    window.addEventListener('open-login', handle);
    return () => window.removeEventListener('open-login', handle);
  }, []);

  // ── Listen for ProtectedRoute redirect with openLogin state ──
  useEffect(() => {
    if ((location.state as any)?.openLogin) {
      setOpen(true);
    }
  }, [location.state]);

  // ── Focus email when opens ──
  useEffect(() => {
    if (open) setTimeout(() => emailRef.current?.focus(), 100);
  }, [open]);

  // ── ESC to close ──
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  function close() { setOpen(false); setError(''); }

  function openRegister() {
    setOpen(false);
    setTimeout(() => window.dispatchEvent(new CustomEvent('open-register')), 150);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    const account = MOCK_ACCOUNTS[email.toLowerCase().trim()];

    if (!account || password !== MOCK_PASSWORD) {
      setError('Incorrect email or password. Try a demo account below.');
      setLoading(false);
      return;
    }

    // Set auth state
    setUser({
      id:         account.id,
      email:      email.toLowerCase().trim(),
      role:       account.role,
    });
    setProfile({
      userId:           account.id,
      fullName:         account.name,
      firstName:        account.name.split(' ')[0],
      lastName:         account.name.split(' ').slice(1).join(' '),
      phone:            '',
      city:             'Ahmedabad',
      // Mock stats — replace with real Supabase fetch
      total_hours:      account.role === 'volunteer' ? 87.5  : 0,
      status_tier:      account.role === 'volunteer' ? 'silver' : 'none',
      mq_score:         account.role === 'volunteer' ? 73    : 0,
      events_attended:  account.role === 'volunteer' ? 14    : 0,
      certificates_count: account.role === 'volunteer' ? 6  : 0,
      skills:           account.role === 'volunteer' ? ['Photography', 'First Aid', 'Event Management', 'Social Media'] : [],
      causes:           account.role === 'volunteer' ? ['environment', 'education'] : [],
    });

    setLoading(false);
    setOpen(false);

    // Redirect to correct portal
    const from = (location.state as any)?.from?.pathname;
    navigate(from && from !== '/' ? from : ROLE_HOME[account.role]);
  }

  // ── DEMO ACCOUNT QUICK-FILL ──
  function fillDemo(role: 'volunteer' | 'organiser' | 'admin') {
    const entry = Object.entries(MOCK_ACCOUNTS).find(([, v]) => v.role === role);
    if (entry) { setEmail(entry[0]); setPassword(MOCK_PASSWORD); setError(''); }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <Backdrop onClick={close} />

          <motion.div
            role="dialog" aria-modal="true" aria-label="Sign in"
            className="fixed inset-0 z-[160] flex items-center justify-center p-4 pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{   opacity: 0, scale: 0.95,  y: 8  }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto w-full max-w-md"
            >
              {/* Card */}
              <div className="bg-[#141414] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-[0_24px_80px_rgba(12,12,12,0.8)] overflow-hidden">

                {/* Top colour strip */}
                <div className="h-1 bg-gradient-to-r from-[#CCFF00] via-[#CCFF00] to-[#CCFF00]" />

                {/* Header */}
                <div className="flex items-start justify-between px-7 pt-6 pb-0">
                  <div>
                    <p className="font-mono text-[#CCFF00] text-[10px] tracking-[3px] uppercase mb-1">
                      Pruthwe volunteers
                    </p>
                    <h2 className="heading-gradient font-display font-black text-[#F2F2F2] uppercase text-3xl leading-none tracking-tight">
                      Sign In
                    </h2>
                    <p className="font-sans text-[#888888] text-sm mt-1">
                      Welcome back — your volunteering awaits.
                    </p>
                  </div>
                  <button
                    onClick={close}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#888888] hover:text-[#FCA5A5] hover:bg-[rgba(252,165,165,0.08)] transition-all mt-1 flex-shrink-0"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">

                  {/* Error message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2.5 bg-[rgba(252,165,165,0.1)] border border-[rgba(252,165,165,0.25)] rounded-xl px-4 py-3"
                      >
                        <AlertCircle size={14} className="text-[#FCA5A5] flex-shrink-0" />
                        <p className="font-sans text-[#FCA5A5] text-sm">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email */}
                  <div>
                    <label className="label" htmlFor="login-email">Email</label>
                    <div className="relative mt-1">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CCFF00] pointer-events-none" />
                      <input
                        ref={emailRef}
                        id="login-email"
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

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="label" htmlFor="login-password">Password</label>
                      <button
                        type="button"
                        className="font-sans text-[#CCFF00] text-xs hover:text-[#CCFF00] transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CCFF00] pointer-events-none" />
                      <input
                        id="login-password"
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={e => { setPassword(e.target.value); setError(''); }}
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                        className="input !pl-10 !pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#CCFF00] hover:text-[#CCFF00] transition-colors p-1"
                        aria-label={showPass ? 'Hide password' : 'Show password'}
                      >
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center py-3 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? <><Loader2 size={16} className="animate-spin" /> Signing in…</>
                      : 'Sign In'}
                  </button>

                  {/* Register link */}
                  <p className="font-sans text-[#888888] text-sm text-center">
                    No account?{' '}
                    <button
                      type="button"
                      onClick={openRegister}
                      className="text-[#CCFF00] font-medium hover:text-[#CCFF00] transition-colors underline underline-offset-2"
                    >
                      Register free
                    </button>
                  </p>
                </form>

                {/* Demo accounts strip */}
                <div className="px-7 pb-6">
                  <div className="border-t border-[rgba(204,255,0,0.1)] pt-5">
                    <p className="font-mono text-[#CCFF00] text-[10px] uppercase tracking-[2.5px] mb-3 text-center">
                      Demo Accounts
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { role: 'volunteer' as const,  label: 'Volunteer', color: '#6EE07A' },
                        { role: 'organiser' as const,  label: 'Organiser', color: '#CCFF00' },
                        { role: 'admin'     as const,  label: 'Admin',     color: '#FCA5A5' },
                      ]).map(d => (
                        <button
                          key={d.role}
                          type="button"
                          onClick={() => fillDemo(d.role)}
                          className="py-2 px-2 rounded-xl border font-display font-bold text-xs uppercase tracking-wide transition-all hover:scale-[1.03] active:scale-[0.98]"
                          style={{
                            color:        d.color,
                            borderColor:  `${d.color}40`,
                            background:   `${d.color}10`,
                          }}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                    <p className="font-sans text-[#CCFF00] text-[11px] text-center mt-2 opacity-70">
                      Password for all: <span className="font-mono tracking-wider">pruthwee123</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}