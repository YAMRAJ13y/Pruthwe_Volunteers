import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useAnimation, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown, Play, MapPin, Calendar, Users } from 'lucide-react';
import { openRegisterModal } from '../components/layout/Navbar';
import { PLATFORM_STATS, EVENT_CATEGORIES, STATUS_TIERS } from '../constants';

// ─────────────────────────────────────────────
//  SCROLL REVEAL HOOK
// ─────────────────────────────────────────────
function useScrollReveal(threshold = 0.15) {
  const ref      = useRef<HTMLDivElement>(null);
  const inView   = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [inView, controls]);

  return { ref, controls, inView };
}

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// ─────────────────────────────────────────────
//  ANIMATED COUNTER
// ─────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount]   = useState(0);
  const ref                 = useRef<HTMLSpanElement>(null);
  const inView              = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration  = 1800;
    const steps     = 60;
    const increment = target / steps;
    let current     = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  const display = count >= 1000 ? (count / 1000).toFixed(count >= 10000 ? 0 : 1) + 'K' : count.toString();

  return <span ref={ref}>{display}{suffix}</span>;
}

// ─────────────────────────────────────────────
//  MOCK DATA (replace with Supabase later)
// ─────────────────────────────────────────────
const MOCK_EVENTS = [
  { id: '1', title: 'Sabarmati River Clean-Up',     city: 'Ahmedabad', date: 'Apr 15, 2026', seats: 18,  category: 'Environment', banner: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80' },
  { id: '2', title: 'Tree Plantation Drive',         city: 'Gandhinagar',date: 'Apr 22, 2026', seats: 6,   category: 'Environment', banner: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80' },
  { id: '3', title: 'Youth Education Camp',          city: 'Surat',      date: 'May 5, 2026',  seats: 32,  category: 'Education',   banner: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80' },
  { id: '4', title: 'Coastal Clean-Up Initiative',   city: 'Jamnagar',   date: 'May 12, 2026', seats: 45,  category: 'Environment', banner: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80' },
  { id: '5', title: 'Health Awareness Camp',         city: 'Vadodara',   date: 'May 19, 2026', seats: 24,  category: 'Health',      banner: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80' },
  { id: '6', title: 'Heritage Walk & Restoration',   city: 'Ahmedabad',  date: 'Jun 1, 2026',  seats: 14,  category: 'Cultural',    banner: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80' },
];

type PreviewEvent = (typeof MOCK_EVENTS)[number];

const MOCK_GALLERY = [
  { id: '1', url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80', h: 'h-56' },
  { id: '2', url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80', h: 'h-40' },
  { id: '3', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80', h: 'h-48' },
  { id: '4', url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80', h: 'h-44' },
  { id: '5', url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80', h: 'h-52' },
  { id: '6', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80', h: 'h-36' },
];

const OBJECTIVES = [
  { icon: '🌿', title: 'Volunteer Recognition',     desc: 'Structured tier system that recognises every hour of service with certificates and badges.' },
  { icon: '🗂️', title: 'Event Management',          desc: 'Powerful tools for organisers to create, manage and run volunteer events at scale.' },
  { icon: '🌐', title: 'National Ecosystem',        desc: 'Building India\'s largest verified volunteer network across 48 cities.' },
  { icon: '📜', title: 'Digital Certificates',      desc: 'Instant PDF certificates after every event — sharable on LinkedIn and WhatsApp.' },
  { icon: '🤝', title: 'Government Partnership',    desc: 'Backed by MoEF, NITI Aayog, NYK and MSJE for national impact.' },
  { icon: '📊', title: 'Transparent Impact',        desc: 'Real-time tracking of hours, events and volunteer footprint across India.' },
];

const WHY_JOIN = [
  { icon: '🏅', title: 'Official Certificates',   desc: 'PDF proof of service for every event. Add to your LinkedIn, CV or portfolio.' },
  { icon: '🌐', title: 'National Network',        desc: 'Connect with 12,000+ volunteers across 48 Indian cities and growing.' },
  { icon: '🏛️', title: 'Govt. Recognition',      desc: 'Pruthwee is backed by MoEF, NITI Aayog, NYK and MSJE — your work matters.' },
  { icon: '⭐', title: 'Status & Rewards',        desc: 'Climb from Volunteer to Diamond tier. Earn perks, merch and event invites.' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma',   city: 'Ahmedabad',  tier: 'Gold',     quote: 'Volunteering with Pruthwee gave me purpose and a national community. My Gold badge opened doors I never expected.' },
  { name: 'Arjun Mehta',    city: 'Surat',      tier: 'Silver',   quote: 'The certificate system is brilliant. I have added 6 Pruthwee certificates to my resume. Employers notice them.' },
  { name: 'Kavya Nair',     city: 'Vadodara',   tier: 'Bronze',   quote: 'I signed up not knowing what to expect. Within 3 events I had found my tribe and a cause I genuinely care about.' },
];

// ─────────────────────────────────────────────
//  SEAT COLOR HELPER
// ─────────────────────────────────────────────
function seatColor(seats: number) {
  if (seats > 20) return 'text-[#6EE07A]';
  if (seats > 5)  return 'text-[#FCD34D]';
  return 'text-[#FCA5A5]';
}

// ═════════════════════════════════════════════
//  HOME PAGE
// ═════════════════════════════════════════════
export default function HomePage() {
  return (
    <div className="landing-root-bg overflow-x-hidden">

      {/* ══════════════════════════════════════
          1. TRIBAL BANNER (top)
      ══════════════════════════════════════ */}
      <div className="tribal-banner" />

      {/* ══════════════════════════════════════
          3. HERO SECTION
      ══════════════════════════════════════ */}
      <HeroSection />

      {/* ══════════════════════════════════════
          4. MARQUEE STRIP
      ══════════════════════════════════════ */}
      <MarqueeStrip />

      {/* ══════════════════════════════════════
          5. STATS BAND
      ══════════════════════════════════════ */}
      <StatsBand />

      {/* ══════════════════════════════════════
          6. ABOUT SPLIT
      ══════════════════════════════════════ */}
      <AboutSplit />

      {/* ══════════════════════════════════════
          7. OBJECTIVES GRID
      ══════════════════════════════════════ */}
      <ObjectivesGrid />

      {/* ══════════════════════════════════════
          8. EVENTS PREVIEW
      ══════════════════════════════════════ */}
      <EventsPreview />

      {/* ══════════════════════════════════════
          9. STATUS TIER SECTION
      ══════════════════════════════════════ */}
      {/* Volunteer badge section kept for future release */}
      {/* <TierSection /> */}

      {/* ══════════════════════════════════════
          10. WHY JOIN
      ══════════════════════════════════════ */}
      {/* Reasons to join section kept for future release */}
      {/* <WhyJoinSection /> */}

      {/* ══════════════════════════════════════
          11. SUMMIT BAND
      ══════════════════════════════════════ */}
      {/* Summit section kept for future release */}
      {/* <SummitBand countdown={countdown} /> */}

      {/* ══════════════════════════════════════
          12. GALLERY SECTION
      ══════════════════════════════════════ */}
      {/* Moments That Matter section kept for future release */}
      {/* <GallerySection /> */}

      {/* ══════════════════════════════════════
          13. TESTIMONIALS
      ══════════════════════════════════════ */}
      <TestimonialsSection />

      {/* ══════════════════════════════════════
          14. ECOSYSTEM / INDIA CONTEXT
      ══════════════════════════════════════ */}
      {/* Why need Pruthwe section kept for future release */}
      {/* <EcosystemSection /> */}

      {/* ══════════════════════════════════════
          15. NEWSLETTER SECTION
      ══════════════════════════════════════ */}
      <NewsletterSection />

      {/* ══════════════════════════════════════
          16. TRIBAL BANNER (bottom)
      ══════════════════════════════════════ */}
      <div className="tribal-banner" />

    </div>
  );
}

// ─────────────────────────────────────────────
//  SECTION 3: HERO
// ─────────────────────────────────────────────
function HeroSection() {
  type Sparkle = { id: number; x: number; y: number; size: number; createdAt: number };

  const heroRef = useRef<HTMLElement>(null);
  const sparkleIdRef = useRef(0);
  const lastSparkleAtRef = useRef(0);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [heroSize, setHeroSize] = useState({ width: 0, height: 0 });
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 });
  const moveFrameRef = useRef<number | null>(null);
  const pendingMoveRef = useRef<{ x: number; y: number; nx: number; ny: number } | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [showWarpIntro, setShowWarpIntro] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !window.sessionStorage.getItem('pruthwe.heroWarpSeen');
  });
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 64]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.25]);

  const galaxyStars = useMemo(
    () =>
      Array.from({ length: prefersReducedMotion ? 72 : 116 }).map((_, index) => ({
        id: index,
        leftPct: (index * 37) % 100,
        topPct: (index * 53) % 100,
        size: 0.8 + ((index * 7) % 4),
        delay: (index % 8) * 0.35,
        duration: 2.8 + (index % 5) * 0.55,
        layer: index % 3 === 0 ? 'far' : index % 3 === 1 ? 'mid' : 'near',
      })),
    [prefersReducedMotion]
  );

  const shootingStars = useMemo(
    () =>
      Array.from({ length: prefersReducedMotion ? 4 : 7 }).map((_, index) => ({
        id: index,
        top: `${6 + (index * 9) % 38}%`,
        left: `${2 + (index * 11) % 42}%`,
        delay: `${1.2 + index * 1.4}s`,
        duration: `${3.8 + (index % 3) * 1.2}s`,
      })),
    [prefersReducedMotion]
  );

  const constellationGroups = useMemo(
    () => [
      [
        { x: 10, y: 24 }, { x: 17, y: 17 }, { x: 24, y: 22 }, { x: 31, y: 18 }, { x: 38, y: 26 },
      ],
      [
        { x: 52, y: 20 }, { x: 59, y: 14 }, { x: 66, y: 19 }, { x: 72, y: 13 }, { x: 79, y: 22 }, { x: 85, y: 17 },
      ],
      [
        { x: 18, y: 63 }, { x: 24, y: 56 }, { x: 31, y: 60 }, { x: 39, y: 54 }, { x: 46, y: 62 },
      ],
      [
        { x: 63, y: 64 }, { x: 70, y: 57 }, { x: 77, y: 61 }, { x: 84, y: 55 }, { x: 90, y: 63 },
      ],
    ],
    []
  );

  useEffect(() => {
    if (!sparkles.length) return;

    const timer = window.setInterval(() => {
      const now = Date.now();
      setSparkles((prev) => prev.filter((sparkle) => now - sparkle.createdAt < 560));
    }, 120);

    return () => window.clearInterval(timer);
  }, [sparkles.length]);

  useEffect(() => () => {
    if (moveFrameRef.current) {
      window.cancelAnimationFrame(moveFrameRef.current);
      moveFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    const element = heroRef.current;
    if (!element) return;

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setHeroSize({ width: rect.width, height: rect.height });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const cursorLinks = useMemo(() => {
    if (!cursorPos || !heroSize.width || !heroSize.height) return [];

    return galaxyStars
      .map((star) => {
        const x = (star.leftPct / 100) * heroSize.width;
        const y = (star.topPct / 100) * heroSize.height;
        const distance = Math.hypot(cursorPos.x - x, cursorPos.y - y);
        return { id: star.id, x, y, distance };
      })
        .filter((star) => star.distance < 260)
      .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);
  }, [cursorPos, heroSize.height, heroSize.width, galaxyStars]);

  function createSparkle(x: number, y: number) {
    const now = Date.now();
    if (now - lastSparkleAtRef.current < (prefersReducedMotion ? 80 : 28)) return;
    lastSparkleAtRef.current = now;

    setCursorPos({ x, y });

    setSparkles((prev) => [
      ...prev.slice(-(prefersReducedMotion ? 8 : 16)),
      {
        id: sparkleIdRef.current++,
        x,
        y,
        size: 4 + Math.random() * (prefersReducedMotion ? 4 : 6),
        createdAt: now,
      },
    ]);
  }

  function handleHeroMove(event: React.MouseEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const nx = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const ny = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

    pendingMoveRef.current = { x, y, nx, ny };
    if (moveFrameRef.current) return;

    moveFrameRef.current = window.requestAnimationFrame(() => {
      moveFrameRef.current = null;
      const move = pendingMoveRef.current;
      if (!move) return;

      setCursorPos({ x: move.x, y: move.y });
      setHeroTilt({ x: move.nx * 4.8, y: -move.ny * 4.2 });
      if (!prefersReducedMotion) {
        createSparkle(move.x, move.y);
      }
    });
  }

  const particles = Array.from({ length: prefersReducedMotion ? 6 : 10 }).map((_, index) => ({
    id: index,
    left: `${8 + (index * 7) % 86}%`,
    top: `${12 + (index * 13) % 70}%`,
    duration: 4 + (index % 5),
    delay: (index % 6) * 0.28,
  }));

  const warpStreaks = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, index) => ({
        id: index,
        left: `${6 + (index * 6) % 90}%`,
        top: `${10 + (index * 11) % 72}%`,
        rotate: -28 + (index % 7) * 8,
        delay: index * 0.035,
      })),
    []
  );

  useEffect(() => {
    if (!showWarpIntro || typeof window === 'undefined') return;

    window.sessionStorage.setItem('pruthwe.heroWarpSeen', '1');
    const timer = window.setTimeout(() => setShowWarpIntro(false), 1200);
    return () => window.clearTimeout(timer);
  }, [showWarpIntro]);

  return (
    <section
      ref={heroRef}
      onMouseMove={handleHeroMove}
      onMouseLeave={() => {
        setCursorPos(null);
        setHeroTilt({ x: 0, y: 0 });
      }}
      className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden"
    >

      {showWarpIntro && !prefersReducedMotion && (
        <div className="hero-warp-overlay" aria-hidden="true">
          {warpStreaks.map((streak) => (
            <span
              key={streak.id}
              className="hero-warp-streak"
              style={{
                left: streak.left,
                top: streak.top,
                rotate: `${streak.rotate}deg`,
                animationDelay: `${streak.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hero-space-vignette" />
        {galaxyStars.map((star) => (
          <span
            key={star.id}
            className={`hero-galaxy-star hero-galaxy-star--${star.layer}`}
            style={{
              left: `${star.leftPct}%`,
              top: `${star.topPct}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}

        {shootingStars.map((trail) => (
          <span
            key={trail.id}
            className="hero-shooting-star"
            style={{
              top: trail.top,
              left: trail.left,
              animationDelay: trail.delay,
              animationDuration: trail.duration,
            }}
          />
        ))}

        <div className="hero-planet-glow" />

        <svg className="absolute inset-0 w-full h-full opacity-55" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {constellationGroups.map((group, groupIndex) => (
            <g key={`constellation-${groupIndex}`}>
              {group.slice(0, -1).map((point, index) => {
                const next = group[index + 1];
                return (
                  <line
                    key={`${groupIndex}-${point.x}-${point.y}`}
                    x1={point.x}
                    y1={point.y}
                    x2={next.x}
                    y2={next.y}
                    stroke="rgba(204,255,0,0.35)"
                    strokeWidth="0.22"
                    className="hero-constellation-line"
                  />
                );
              })}
              {group.map((point) => (
                <circle
                  key={`dot-${groupIndex}-${point.x}-${point.y}`}
                  cx={point.x}
                  cy={point.y}
                  r="0.58"
                  fill="rgba(204,255,0,0.95)"
                  className="hero-constellation-dot"
                />
              ))}
            </g>
          ))}
        </svg>
      </div>

      {cursorPos && !prefersReducedMotion && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          {cursorLinks.map((link) => (
            <line
              key={`cursor-link-${link.id}`}
              x1={cursorPos.x}
              y1={cursorPos.y}
              x2={link.x}
              y2={link.y}
              className="hero-cursor-link"
              style={{ opacity: Math.max(0.15, 1 - link.distance / 260) }}
            />
          ))}
          <circle cx={cursorPos.x} cy={cursorPos.y} r="5" className="hero-cursor-orb" />
        </svg>
      )}

      {/* Background layers */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 brand-hero-gradient" />
      <motion.div style={{ y: bgY }} className="absolute inset-0 grid-overlay opacity-60" />
      <motion.div style={{ opacity: glowOpacity }} className="absolute inset-0 radial-glow" />

      {!prefersReducedMotion && <div className="absolute inset-0 pointer-events-none">
        {sparkles.map((sparkle) => (
          <span
            key={sparkle.id}
            className="hero-sparkle"
            style={{
              left: sparkle.x,
              top: sparkle.y,
              width: sparkle.size,
              height: sparkle.size,
            }}
          />
        ))}
      </div>}

      {/* Decorative blobs */}
      {!prefersReducedMotion && <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 90]) }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#CCFF00]/5 rounded-full blur-3xl pointer-events-none"
      />}
      {!prefersReducedMotion && <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -70]) }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#222200]/10 rounded-full blur-3xl pointer-events-none"
      />}

      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#CCFF00]/70"
            style={{ left: particle.left, top: particle.top }}
            animate={{ y: [0, -18, 0], opacity: [0.2, 0.9, 0.2], scale: [0.8, 1.15, 0.8] }}
            transition={{ duration: particle.duration, repeat: Infinity, ease: 'easeInOut', delay: particle.delay }}
          />
        ))}
      </div>

      <motion.div
        style={{ y: contentY, rotateX: heroTilt.y, rotateY: heroTilt.x, transformPerspective: 1200 }}
        transition={{ type: 'spring', stiffness: 90, damping: 18, mass: 0.8 }}
        className="relative z-10 max-w-5xl mx-auto px-5 md:px-10 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: showWarpIntro ? -40 : -14, scale: showWarpIntro ? 1.06 : 1 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: showWarpIntro ? 0.9 : 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(204,255,0,0.28)] bg-[rgba(255,255,255,0.05)] mb-7"
        >
          <span className="w-2 h-2 rounded-full bg-[#6EE07A] animate-pulse" />
          <span className="font-mono text-[#CCFF00] text-xs tracking-[2px] uppercase">
            Live now in 48 cities
          </span>
        </motion.div>

        {/* Headline — Syne, massive */}
        <motion.h1
          initial={{ opacity: 0, y: showWarpIntro ? 56 : 32, scale: showWarpIntro ? 1.08 : 1 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: showWarpIntro ? 1.05 : 0.7, delay: 0.1 }}
          className="font-hero-display font-black text-[#F2F2F2] uppercase leading-none tracking-wide mb-4"
          style={{ fontSize: 'clamp(56px, 10vw, 120px)' }}
        >
          Pruthwe{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] to-[#BBEE00] hero-shimmer-text">
            Volunteers
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: showWarpIntro ? 40 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: showWarpIntro ? 0.9 : 0.6, delay: 0.25 }}
          className="font-sans text-[#888888] text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Join India's largest volunteer movement — 12,000+ changemakers across 48 cities,
          serving communities and the environment.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <motion.button
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openRegisterModal}
            className="btn-primary text-base px-8 py-4 gap-2"
          >
            Register Free <ArrowRight size={17} />
          </motion.button>
          <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to="/events" className="btn-outline text-base px-8 py-4">
            Explore Events
            </Link>
          </motion.div>
        </motion.div>

      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounceY"
      >
        <span className="font-mono text-[#CCFF00] text-[9px] tracking-[3px] uppercase">Scroll</span>
        <ChevronDown size={18} className="text-[#CCFF00]" />
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  SECTION 4: MARQUEE STRIP
// ─────────────────────────────────────────────
function MarqueeStrip() {
  const [activePulse, setActivePulse] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActivePulse((prev) => (prev + 1) % 8);
    }, 1200);
    return () => window.clearInterval(id);
  }, []);

  const items = [
    'PRUTHWE VOLUNTEERS',
    '12K+ VOLUNTEERS',
    '48 CITIES',
    '320+ EVENTS',
    '5 LAKH HOURS',
    'PRUTHWE VOLUNTEERS',
    'GUJARAT',
    'INDIA',
  ];
  const repeated = [...items, ...items];

  return (
    <div className="luna-marquee-band py-3 overflow-hidden relative">
      <div className="marquee-glint" aria-hidden="true" />
      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className={`font-display font-black text-sm tracking-[3px] uppercase px-6 whitespace-nowrap transition-all duration-300 ${i % items.length === activePulse ? 'text-[#1A1A1A] drop-shadow-[0_0_10px_rgba(12,12,12,0.45)]' : 'text-[#0C0C0C]'}`}>
              {item}
            </span>
            <span className="text-[#0C0C0C]/40 text-lg">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  SECTION 5: STATS BAND
// ─────────────────────────────────────────────
function StatsBand() {
  const { ref, controls } = useScrollReveal();
  const accentWidths = ['72%', '58%', '64%', '69%'];
  const miniContext = ['Updated in real time', 'Verified platform metrics'];

  return (
    <section className="landing-surface-ocean border-y border-[rgba(255,255,255,0.07)] relative overflow-hidden">
      <div className="absolute inset-0 stats-ambient-gradient pointer-events-none" aria-hidden="true" />
      <motion.div
        ref={ref}
        variants={stagger}
        initial="hidden"
        animate={controls}
        className="max-w-7xl mx-auto px-5 md:px-10 py-14 grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        <motion.div variants={fadeUp} className="col-span-2 md:col-span-4 flex flex-wrap items-center justify-center gap-2.5 mb-1">
          {miniContext.map((item) => (
            <span
              key={item}
              className="landing-chip"
            >
              {item}
            </span>
          ))}
        </motion.div>
        {PLATFORM_STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.22 }}
            className="stats-premium-card text-center px-4 py-5"
          >
            <div className="stats-card-glint" aria-hidden="true" />
            <div className="w-2 h-2 rounded-full bg-[#6EE07A] mx-auto mb-2 animate-pulse" />
            <div
              className="font-display font-black text-[#CCFF00] leading-none mb-2"
              style={{ fontSize: 'clamp(44px, 6vw, 72px)' }}
            >
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </div>
            <div className="font-display font-bold text-[#CCFF00] text-xs tracking-[3px] uppercase">
              {stat.label}
            </div>
            <div className="h-1.5 mt-3 rounded-full bg-[rgba(255,255,255,0.07)] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: accentWidths[index % accentWidths.length] }}
                transition={{ duration: 1, delay: 0.25 + index * 0.08 }}
                className="h-full rounded-full bg-gradient-to-r from-[#CCFF00] to-[#BBEE00]"
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  SECTION 6: ABOUT SPLIT
// ─────────────────────────────────────────────
function AboutSplit() {
  const { ref, controls } = useScrollReveal();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const points = [
    'Free registration + personal profile',
    'Certificates for every event attended',
    'Backed by MoEF, NITI Aayog, NYK & MSJE',
    'Tier system: Bronze to Diamond',
    'Events across 48 Indian cities',
  ];

  function handleImageMove(event: React.MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const nx = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const ny = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    setTilt({ x: nx * 4.6, y: -ny * 4.2 });
  }

  return (
    <section className="py-20 md:py-28 landing-surface-ink">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={stagger}
          className="grid md:grid-cols-2 gap-12 md:gap-20 items-center"
        >
          {/* Left — content */}
          <motion.div variants={fadeUp}>
            <span className="section-label">About Pruthwee</span>
            <h2
              className="heading-gradient font-display font-black text-[#F2F2F2] uppercase leading-none mb-6"
              style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}
            >
              India's Volunteer{' '}
              <span className="luna-text-gradient">Platform</span>
            </h2>
            <p className="font-sans text-[#888888] text-base leading-relaxed mb-8">
              Pruthwe volunteers is India's most comprehensive volunteer management platform —
              built for India's unique context, culture, and scale.
            </p>

            <ul className="space-y-3 mb-8">
              {points.map((pt) => (
                <li key={pt} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#CCFF00] text-xs">✓</span>
                  </span>
                  <span className="font-sans text-[#888888] text-sm">{pt}</span>
                </li>
              ))}
            </ul>

            <Link to="/about" className="btn-outline inline-flex">
              Learn More <ArrowRight size={15} />
            </Link>
          </motion.div>

          {/* Right — image */}
          <motion.div
            variants={fadeUp}
            onMouseMove={handleImageMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            style={{ rotateX: tilt.y, rotateY: tilt.x, transformPerspective: 1100 }}
            transition={{ type: 'spring', stiffness: 95, damping: 18, mass: 0.75 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80"
                alt="Pruthwe volunteers in action"
                className="w-full h-full object-cover about-depth-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C]/60 to-transparent" />

              <div className="about-grid-overlay" />

              {/* Floating stat card */}
              <div className="absolute bottom-4 left-4 right-4 bg-[rgba(12,12,12,0.85)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-display font-black text-[#CCFF00] text-3xl leading-none">5L+</div>
                  <div className="font-display font-bold text-[#CCFF00] text-xs tracking-[2px] uppercase mt-0.5">Hours Served</div>
                </div>
                <div className="h-10 w-px bg-[rgba(204,255,0,0.2)]" />
                <div>
                  <div className="font-display font-black text-[#CCFF00] text-3xl leading-none">48</div>
                  <div className="font-display font-bold text-[#CCFF00] text-xs tracking-[2px] uppercase mt-0.5">Cities</div>
                </div>
                <div className="h-10 w-px bg-[rgba(204,255,0,0.2)]" />
                <div>
                  <div className="font-display font-black text-[#CCFF00] text-3xl leading-none">320+</div>
                  <div className="font-display font-bold text-[#CCFF00] text-xs tracking-[2px] uppercase mt-0.5">Events</div>
                </div>
              </div>

              <div className="about-floating-chip about-floating-chip--one">Realtime Allocation Engine</div>
              <div className="about-floating-chip about-floating-chip--two">48 City Network</div>
              <div className="about-floating-chip about-floating-chip--three">Auto Certificates</div>
            </div>

            {/* Decorative border */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-[rgba(255,255,255,0.08)] rounded-2xl -z-10" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  SECTION 7: OBJECTIVES GRID
// ─────────────────────────────────────────────
function ObjectivesGrid() {
  const { ref, controls } = useScrollReveal();

  return (
    <section className="py-20 md:py-28 landing-surface-ocean">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div ref={ref} initial="hidden" animate={controls} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-14">
            <span className="section-label">Platform Objectives</span>
            <h2
              className="heading-gradient font-display font-black text-[#F2F2F2] uppercase leading-none"
              style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
            >
              What We're Building
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {OBJECTIVES.map((obj, i) => (
              <motion.div
                key={obj.title}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-[rgba(12,12,12,0.5)] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 hover:border-[rgba(204,255,0,0.35)] transition-all duration-250 group cursor-default"
              >
                <div className="text-4xl mb-4">{obj.icon}</div>
                <h3 className="heading-gradient font-display font-black text-[#F2F2F2] text-xl uppercase tracking-wide mb-2 no-caps group-hover:text-[#CCFF00] transition-colors">
                  {obj.title}
                </h3>
                <p className="font-sans text-[#888888] text-sm leading-relaxed">
                  {obj.desc}
                </p>
                {/* Bottom accent */}
                <div className="mt-5 h-0.5 bg-gradient-to-r from-[#CCFF00] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  SECTION 8: EVENTS PREVIEW
// ─────────────────────────────────────────────
function EventsPreview() {
  const { ref, controls } = useScrollReveal();
  const highlights = ['Live volunteer demand', 'City-wise opportunities', 'Fast registration'];

  return (
    <section className="py-20 md:py-28 landing-surface-ink relative overflow-hidden">
      <div className="absolute inset-0 events-ambient-gradient pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div ref={ref} initial="hidden" animate={controls} variants={stagger}>

          {/* Header */}
          <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="section-label">Upcoming Events</span>
              <h2
                className="heading-gradient landing-title text-[#F2F2F2]"
                style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
              >
                Find Your{' '}
                <span className="luna-text-gradient">Next Event</span>
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                {highlights.map((item) => (
                  <span
                    key={item}
                    className="landing-chip"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <Link
              to="/events"
              className="btn-outline inline-flex self-start md:self-auto whitespace-nowrap"
            >
              View All Events <ArrowRight size={15} />
            </Link>
          </motion.div>

          {/* Events grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_EVENTS.map((ev) => (
              <EventPreviewCard key={ev.id} ev={ev} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function EventPreviewCard({ ev }: { ev: PreviewEvent }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const seatRatio = Math.max(8, Math.min(92, Math.round((ev.seats / 50) * 100)));

  function handleMove(event: React.MouseEvent<HTMLAnchorElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const nx = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const ny = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    setTilt({ x: nx * 4.2, y: -ny * 4.2 });
  }

  return (
    <motion.div variants={fadeUp}>
      <motion.div
        style={{ rotateX: tilt.y, rotateY: tilt.x, transformPerspective: 1200 }}
        transition={{ type: 'spring', stiffness: 110, damping: 18, mass: 0.75 }}
      >
        <Link
          to={`/events/${ev.id}`}
          onMouseMove={handleMove}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          className="block group"
        >
          <div className="relative border border-[rgba(204,255,0,0.16)] rounded-2xl overflow-hidden hover:border-[rgba(204,255,0,0.46)] transition-all duration-250 hover:shadow-card event-card-shell">
            <div className="event-card-glint" aria-hidden="true" />

            {/* Image */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={ev.banner}
                alt={ev.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="badge badge-teal">{ev.category}</span>
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 bg-[rgba(12,12,12,0.7)] border border-[rgba(204,255,0,0.22)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6EE07A] animate-pulse" />
                  <span className="font-mono text-[9px] tracking-[1.2px] uppercase text-[#CCFF00]">Live</span>
                </span>
              </div>

              <div className="absolute top-3 right-3 bg-[rgba(12,12,12,0.85)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] rounded-lg px-2 py-1">
                <span className="font-display font-bold text-[#CCFF00] text-xs tracking-wide uppercase">
                  {ev.date}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="heading-gradient font-display font-black text-[#F2F2F2] text-lg uppercase leading-tight tracking-wide mb-3 group-hover:text-[#CCFF00] transition-colors">
                {ev.title}
              </h3>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-[#888888] text-sm">
                  <MapPin size={13} className="text-[#CCFF00]" />
                  <span className="font-sans">{ev.city}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Users size={13} className="text-[#CCFF00]" />
                  <span className={`font-display font-bold text-sm tracking-wide uppercase ${seatColor(ev.seats)}`}>
                    {ev.seats} Seats Left
                  </span>
                </div>
              </div>

              <div className="h-1.5 rounded-full bg-[rgba(204,255,0,0.14)] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${seatRatio}%` }}
                  viewport={{ once: true, amount: 0.65 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-[#CCFF00] to-[#BBEE00] event-seat-fill"
                />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
//  SECTION 9: STATUS TIER SECTION
// ─────────────────────────────────────────────
function TierSection() {
  const { ref, controls } = useScrollReveal();

  return (
    <section className="py-20 md:py-28 landing-surface-ocean">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div ref={ref} initial="hidden" animate={controls} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-14">
            <span className="section-label">Volunteer Status</span>
            <h2
              className="heading-gradient font-display font-black text-[#F2F2F2] uppercase leading-none mb-4"
              style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
            >
              Earn Your{' '}
              <span className="text-[#CCFF00]">Badge</span>
            </h2>
            <p className="font-sans text-[#888888] text-base max-w-xl mx-auto">
              Every hour you volunteer counts. Climb from New Volunteer to Diamond Ambassador
              and unlock exclusive perks, recognition, and opportunities.
            </p>
          </motion.div>

          {/* Tier cards — horizontal scroll on mobile */}
          <motion.div variants={fadeUp} className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-7 md:overflow-visible">
            {STATUS_TIERS.map((tier) => (
              <div
                key={tier.id}
                className="flex-shrink-0 w-36 md:w-auto bg-[rgba(12,12,12,0.5)] border rounded-2xl p-4 text-center hover:scale-105 transition-transform duration-200 cursor-default"
                style={{ borderColor: tier.borderColor }}
              >
                <div className="text-3xl mb-2">{tier.icon}</div>
                <div className="font-display font-black text-sm uppercase tracking-wide mb-1" style={{ color: tier.color }}>
                  {tier.label}
                </div>
                <div className="font-mono text-[#CCFF00] text-[10px] tracking-wide mb-3">
                  {tier.hoursMin === 0 && tier.id === 'none' ? '0h' : `${tier.hoursMin}h+`}
                </div>
                <ul className="space-y-1">
                  {tier.perks.slice(0, 2).map((perk, i) => (
                    <li key={i} className="font-sans text-[#888888] text-[10px] leading-snug text-left">
                      · {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="text-center mt-10">
            <Link to="/for-volunteers" className="btn-primary inline-flex">
              Learn How to Level Up <ArrowRight size={15} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  SECTION 10: WHY JOIN
// ─────────────────────────────────────────────
function WhyJoinSection() {
  const { ref, controls } = useScrollReveal();

  return (
    <section className="py-20 md:py-28 landing-surface-ink">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div ref={ref} initial="hidden" animate={controls} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-14">
            <span className="section-label">Why Volunteer With Us</span>
            <h2
              className="heading-gradient font-display font-black text-[#F2F2F2] uppercase leading-none"
              style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
            >
              4 Reasons to{' '}
              <span className="text-[#CCFF00]">Join</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {WHY_JOIN.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="flex items-start gap-5 bg-[rgba(20,20,20,0.4)] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 hover:border-[rgba(255,255,255,0.15)] transition-all duration-200 group"
              >
                <div className="text-4xl flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="heading-gradient font-display font-black text-[#F2F2F2] text-xl uppercase tracking-wide mb-2 group-hover:text-[#CCFF00] transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-sans text-[#888888] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA band */}
          <motion.div
            variants={fadeUp}
            className="text-center bg-gradient-to-r from-[#141414] via-[#1A1A1A] to-[#141414] rounded-2xl p-10 border border-[rgba(255,255,255,0.1)]"
          >
            <h3
              className="heading-gradient font-display font-black text-[#F2F2F2] uppercase leading-none mb-3"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
            >
              Ready to Make a Difference?
            </h3>
            <p className="font-sans text-[#888888] mb-6 text-base">
              Join 12,000+ volunteers. It's free. It's impactful. It's Pruthwee.
            </p>
            <button onClick={openRegisterModal} className="btn-primary text-base px-8 py-4">
              Register Free Today <ArrowRight size={16} />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  SECTION 11: SUMMIT BAND
// ─────────────────────────────────────────────
function SummitBand({ countdown }: { countdown: { days: number; hours: number; mins: number; secs: number } }) {
  const { ref, controls } = useScrollReveal();

  return (
    <section className="py-20 landing-surface-aurora border-y border-[rgba(255,255,255,0.08)] relative overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 text-center">
        <motion.div ref={ref} initial="hidden" animate={controls} variants={stagger}>
          <motion.div variants={fadeUp}>
            <span className="section-label">Flagship Event</span>
            <h2
              className="heading-gradient font-display font-black text-[#F2F2F2] uppercase leading-none mb-2"
              style={{ fontSize: 'clamp(40px, 7vw, 88px)' }}
            >
              Pruthwee Summit{' '}
              <span className="text-[#CCFF00]">2026</span>
            </h2>
            <p className="font-display font-bold text-[#888888] text-lg uppercase tracking-[3px] mb-10">
              12–13 April · Gandhinagar, Gujarat
            </p>
          </motion.div>

          {/* Countdown */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 md:gap-8 mb-10">
            {[
              { v: countdown.days,  l: 'Days'  },
              { v: countdown.hours, l: 'Hours' },
              { v: countdown.mins,  l: 'Mins'  },
              { v: countdown.secs,  l: 'Secs'  },
            ].map(({ v, l }, i) => (
              <div key={l} className="flex items-center">
                {i > 0 && (
                  <span className="font-display font-black text-[#1A1A1A] text-4xl md:text-6xl mx-2 md:mx-4">:</span>
                )}
                <div className="text-center">
                  <div className="font-display font-black text-[#CCFF00] leading-none tabular-nums" style={{ fontSize: 'clamp(48px, 8vw, 96px)' }}>
                    {String(v).padStart(2, '0')}
                  </div>
                  <div className="font-display font-bold text-[#CCFF00] text-xs tracking-[3px] uppercase mt-1">
                    {l}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp}>
            <Link to="/summit-2026" className="btn-primary text-base px-10 py-4">
              View Summit Details <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  SECTION 12: GALLERY
// ─────────────────────────────────────────────
function GallerySection() {
  const { ref, controls } = useScrollReveal();

  return (
    <section className="py-20 md:py-28 landing-surface-ocean">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div ref={ref} initial="hidden" animate={controls} variants={stagger}>
          <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="section-label">From The Field</span>
              <h2
                className="heading-gradient font-display font-black text-[#F2F2F2] uppercase leading-none"
                style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
              >
                Moments That{' '}
                <span className="text-[#CCFF00]">Matter</span>
              </h2>
            </div>
            <Link to="/gallery" className="btn-outline inline-flex self-start md:self-auto">
              Full Gallery <ArrowRight size={15} />
            </Link>
          </motion.div>

          {/* Masonry-ish grid */}
          <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {MOCK_GALLERY.map((photo) => (
              <motion.div
                key={photo.id}
                variants={fadeUp}
                className={`relative ${photo.h} rounded-xl overflow-hidden group cursor-pointer`}
              >
                <img
                  src={photo.url}
                  alt="Gallery"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4">
                  <span className="font-display font-bold text-[#CCFF00] text-xs uppercase tracking-widest">
                    View Photo
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  SECTION 13: TESTIMONIALS
// ─────────────────────────────────────────────
function TestimonialsSection() {
  const { ref, controls } = useScrollReveal();

  return (
    <section className="py-20 md:py-28 landing-surface-ink relative overflow-hidden">
      <div className="absolute inset-0 testimonial-orbital-glow pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div ref={ref} initial="hidden" animate={controls} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-14">
            <span className="section-label">Volunteer Stories</span>
            <h2
              className="heading-gradient landing-title text-[#F2F2F2]"
              style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
            >
              Hear From Our{' '}
              <span className="luna-text-gradient">Community</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="testimonial-premium-card p-6 flex flex-col"
              >
                <div className="testimonial-card-glint" aria-hidden="true" />
                {/* Quote mark */}
                <div className="font-display font-black text-[#CCFF00] text-6xl leading-none mb-3 opacity-40">"</div>
                <p className="font-sans text-[#888888] text-sm leading-relaxed flex-1 mb-5">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-[rgba(255,255,255,0.07)]">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#CCFF00] to-[#888800] flex items-center justify-center flex-shrink-0">
                    <span className="font-display font-black text-[#0C0C0C] text-sm">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="heading-gradient font-display font-black text-[#F2F2F2] text-sm uppercase tracking-wide">
                      {t.name}
                    </div>
                    <div className="font-mono text-[#CCFF00] text-[10px] tracking-wider">
                      {t.tier} · {t.city}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  SECTION 14: ECOSYSTEM
// ─────────────────────────────────────────────
function EcosystemSection() {
  const { ref, controls } = useScrollReveal();

  const facts = [
    { num: '450M+', label: 'Indians willing to volunteer', sub: 'NSSO Survey' },
    { num: '3.3M',  label: 'Registered NGOs in India',    sub: 'Ministry of Home Affairs' },
    { num: '₹800Cr',label: 'CSR spent on volunteering',   sub: 'Annual estimate' },
  ];

  return (
    <section className="py-20 md:py-28 landing-surface-deepsea">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div ref={ref} initial="hidden" animate={controls} variants={stagger}>
          <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-label">India's Volunteer Ecosystem</span>
              <h2
                className="heading-gradient font-display font-black text-[#F2F2F2] uppercase leading-none mb-6"
                style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
              >
                Why India Needs{' '}
                <span className="text-[#CCFF00]">Pruthwee</span>
              </h2>
              <p className="font-sans text-[#888888] text-base leading-relaxed mb-6">
                India has one of the world's largest populations willing to volunteer,
                but lacks a structured, verified, digital platform to connect them with
                meaningful opportunities. Pruthwe fills that gap at India's scale and diversity.
              </p>
              <p className="font-sans text-[#888888] text-base leading-relaxed">
                We work with NGOs, corporates, and government bodies to create verified,
                structured volunteer experiences that genuinely move the needle on
                environmental and social impact.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {facts.map((f) => (
                <motion.div
                  key={f.num}
                  variants={fadeUp}
                  className="bg-[rgba(12,12,12,0.5)] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5 flex items-center gap-5"
                >
                  <div className="font-display font-black text-[#CCFF00] text-4xl leading-none flex-shrink-0">
                    {f.num}
                  </div>
                  <div>
                    <div className="font-display font-bold text-[#F2F2F2] text-base uppercase tracking-wide">
                      {f.label}
                    </div>
                    <div className="font-mono text-[#CCFF00] text-xs tracking-wider mt-0.5">
                      Source: {f.sub}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  SECTION 15: NEWSLETTER
// ─────────────────────────────────────────────
function NewsletterSection() {
  const [email,      setEmail]      = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { ref, controls }           = useScrollReveal();
  const perks = ['Early event alerts', 'Verified certificates', 'Zero spam'];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  }

  return (
    <section className="py-20 landing-surface-ink relative overflow-hidden">
      <div className="absolute inset-0 newsletter-ambient-gradient pointer-events-none" aria-hidden="true" />
      <div className="max-w-3xl mx-auto px-5 md:px-10 text-center">
        <motion.div ref={ref} initial="hidden" animate={controls} variants={stagger}>
          <motion.div variants={fadeUp} className="newsletter-shell">
            <span className="section-label">Stay Updated</span>
            <h2
              className="heading-gradient landing-title text-[#F2F2F2] mb-4"
              style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
            >
              Get Events in{' '}
              <span className="luna-text-gradient">Your Inbox</span>
            </h2>
            <p className="font-sans text-[#888888] mb-8 text-base">
              Monthly newsletter · New events first · No spam
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 mb-7">
              {perks.map((perk) => (
                <span
                  key={perk}
                  className="landing-chip"
                >
                  {perk}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            {subscribed ? (
              <div className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[rgba(110,224,122,0.1)] border border-[rgba(110,224,122,0.3)] text-[#6EE07A] font-display font-bold uppercase tracking-wider text-lg">
                ✓ You're subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="input flex-1"
                />
                <button type="submit" className="btn-primary whitespace-nowrap">
                  Subscribe <ArrowRight size={15} />
                </button>
              </form>
            )}
            <p className="font-sans text-[#888888] text-xs mt-4">
              By subscribing you agree to receive monthly updates. Unsubscribe anytime.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}