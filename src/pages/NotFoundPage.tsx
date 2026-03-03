import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Calendar, Compass } from 'lucide-react';

// ── FLOATING PARTICLES ────────────────────────
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id:    i,
  x:     Math.random() * 100,
  y:     Math.random() * 100,
  size:  Math.random() * 3 + 1,
  delay: Math.random() * 4,
  dur:   Math.random() * 6 + 6,
}));

// ── QUICK LINKS ───────────────────────────────
const QUICK_LINKS = [
  { icon: <Home size={16} />,     label: 'Home',         href: '/',        color: '#A7EBF2' },
  { icon: <Calendar size={16} />, label: 'Browse Events',href: '/events',  color: '#6EE07A' },
  { icon: <Compass size={16} />,  label: 'Gallery',      href: '/gallery', color: '#C4B5FD' },
  { icon: <Search size={16} />,   label: 'News',         href: '/news',    color: '#FCD34D' },
];

export default function NotFoundPage() {
  const navigate  = useNavigate();
  const [count, setCount] = useState(10);

  // Auto-redirect countdown
  useEffect(() => {
    if (count <= 0) { navigate('/'); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, navigate]);

  return (
    <div className="min-h-screen bg-[#011C40] flex flex-col items-center justify-center relative overflow-hidden px-5">

      {/* ── BACKGROUND GRID ── */}
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

      {/* ── FLOATING PARTICLES ── */}
      {PARTICLES.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#54ACBF] pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -30, 0], opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── GIANT 404 BACKGROUND TEXT ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="font-display font-black text-[#023859] leading-none"
          style={{ fontSize: 'clamp(180px, 35vw, 420px)', letterSpacing: '-0.04em', opacity: 0.35 }}
        >
          404
        </span>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 text-center max-w-xl">

        {/* Glowing orb */}
        <motion.div
          className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle at 40% 35%, #A7EBF2, #54ACBF 60%, #26658C)',
            boxShadow: '0 0 60px rgba(84,172,191,0.4), 0 0 120px rgba(84,172,191,0.15)',
          }}
          animate={{ scale: [1, 1.06, 1], boxShadow: ['0 0 60px rgba(84,172,191,0.4)', '0 0 90px rgba(84,172,191,0.6)', '0 0 60px rgba(84,172,191,0.4)'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <Compass size={32} className="text-[#011C40]" />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="font-mono text-[#54ACBF] text-xs tracking-[4px] uppercase mb-3">
            Page Not Found
          </p>
          <h1
            className="font-display font-black text-[#F0FAFB] uppercase leading-none mb-4"
            style={{ fontSize: 'clamp(32px, 6vw, 72px)', letterSpacing: '-0.02em' }}
          >
            Lost in the{' '}
            <span
              className="relative inline-block"
              style={{ color: '#54ACBF' }}
            >
              field
              {/* underline squiggle */}
              <svg className="absolute -bottom-1 left-0 w-full" height="4" viewBox="0 0 100 4" preserveAspectRatio="none">
                <path d="M0,2 Q25,0 50,2 T100,2" fill="none" stroke="#54ACBF" strokeWidth="1.5" strokeDasharray="4 2" />
              </svg>
            </span>
          </h1>
          <p className="font-sans text-[#8BBFCC] text-base leading-relaxed max-w-md mx-auto">
            The page you're looking for has moved, been removed, or never existed.
            Even the best volunteers sometimes take a wrong turn.
          </p>
        </motion.div>

        {/* Countdown + home button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/" className="btn-primary px-8 py-3 text-base flex items-center gap-2">
            <Home size={16} /> Back to Home
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="btn-outline px-6 py-3 text-base flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </motion.div>

        {/* Auto-redirect notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-5 font-mono text-[#54ACBF] text-xs tracking-wider"
        >
          Redirecting to home in{' '}
          <span className="font-black text-[#A7EBF2]">{count}s</span>
          {' '}·{' '}
          <button onClick={() => setCount(999)} className="underline hover:text-[#F0FAFB] transition-colors">
            cancel
          </button>
        </motion.p>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12"
        >
          <p className="font-mono text-[#54ACBF] text-[10px] uppercase tracking-[3px] mb-5">
            Or go somewhere useful
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.07 }}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
              >
                <Link
                  to={link.href}
                  className="flex flex-col items-center gap-2 px-4 py-4 rounded-2xl border border-[rgba(84,172,191,0.12)] bg-[rgba(2,56,89,0.4)] hover:border-[rgba(84,172,191,0.3)] hover:bg-[rgba(84,172,191,0.06)] transition-all duration-200 group"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                    style={{ background: `${link.color}18`, color: link.color }}
                  >
                    {link.icon}
                  </div>
                  <span className="font-display font-bold text-[#8BBFCC] text-xs uppercase tracking-wide group-hover:text-[#F0FAFB] transition-colors">
                    {link.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Decorative bottom line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-14 mx-auto h-px bg-gradient-to-r from-transparent via-[rgba(84,172,191,0.4)] to-transparent max-w-xs"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 font-mono text-[#54ACBF] text-[10px] tracking-[3px] uppercase"
        >
          Pruthwe volunteers · Est. 2019
        </motion.p>
      </div>
    </div>
  );
}