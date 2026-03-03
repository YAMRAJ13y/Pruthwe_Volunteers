import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  Calendar,
  Newspaper,
  Image,
  Info,
  Users,
  Mail,
  Bell,
  LayoutDashboard,
  ClipboardList,
  Award,
  User,
  FolderKanban,
  PlusCircle,
  Shield,
  LogOut,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';

// ── REGISTER / LOGIN MODAL STATE (simple global via custom event) ──
export function openRegisterModal() {
  window.dispatchEvent(new CustomEvent('open-register'));
}
export function openLoginModal() {
  window.dispatchEvent(new CustomEvent('open-login'));
}

type MenuItem = {
  label: string;
  to: string;
  desc: string;
  icon: LucideIcon;
};

const EXPLORE_ITEMS: MenuItem[] = [
  {
    label: 'Gallery',
    to: '/gallery',
    desc: 'Moments from volunteer drives and impact stories.',
    icon: Image,
  },
  {
    label: 'News & Blog',
    to: '/news',
    desc: 'Latest updates, announcements, and articles.',
    icon: Newspaper,
  },
];

const ABOUT_ITEMS: MenuItem[] = [
  {
    label: 'About Us',
    to: '/about',
    desc: 'Our mission, model, and volunteer-first vision.',
    icon: Info,
  },
  {
    label: 'Partners',
    to: '/partners',
    desc: 'Organisations supporting our initiatives.',
    icon: Users,
  },
  {
    label: 'Contact',
    to: '/contact',
    desc: 'Reach the Pruthwee team for support.',
    icon: Mail,
  },
  {
    label: 'Newsletter',
    to: '/newsletter',
    desc: 'Monthly opportunities and platform updates.',
    icon: Bell,
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState<'explore' | 'about' | null>(null);
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, profile, logout } = useAuthStore();
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const desktopMenuRef = useRef<HTMLDivElement | null>(null);

  // ── Scroll detection ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Close mobile menu on route change ──
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setDesktopMenuOpen(null);
  }, [location.pathname]);

  // ── Close user menu on outside click ──
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }

      if (desktopMenuRef.current && !desktopMenuRef.current.contains(e.target as Node)) {
        setDesktopMenuOpen(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── Lock body scroll when mobile menu open ──
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  function handleLogout() {
    logout();
    navigate('/');
  }

  const displayName = profile?.fullName?.trim() || user?.email.split('@')[0] || 'Account';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const exploreActive = location.pathname === '/gallery' || location.pathname.startsWith('/news');
  const aboutActive =
    location.pathname.startsWith('/about') ||
    location.pathname.startsWith('/partners') ||
    location.pathname.startsWith('/contact') ||
    location.pathname.startsWith('/newsletter');

  const mobileDiscover = [
    { label: 'Events', to: '/events' },
    // Summit link kept for future release
    // { label: 'Summit 2026', to: '/summit-2026' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'News', to: '/news' },
  ];

  const mobileOrganisation = [
    { label: 'About', to: '/about' },
    { label: 'Partners', to: '/partners' },
    { label: 'Contact', to: '/contact' },
  ];

  const mobileJoin: Array<{ label: string; to: string }> = [
    // { label: 'For Volunteers', to: '/for-volunteers' },
    // { label: 'For Organisers', to: '/for-organisers' },
  ];

  const volunteerMenu = [
    { label: 'My Dashboard', to: '/dashboard', desc: 'Overview and progress', icon: LayoutDashboard },
    { label: 'Assignments', to: '/dashboard/assignments', desc: 'Upcoming allocations', icon: ClipboardList },
    { label: 'Certificates', to: '/dashboard/certificates', desc: 'Issued certificates', icon: Award },
    { label: 'Groups', to: '/dashboard/groups', desc: 'Volunteer groups', icon: Users },
    { label: 'My Profile', to: '/profile', desc: 'Update profile details', icon: User },
  ];

  const organiserMenu = [
    { label: 'My Events', to: '/organiser/dashboard', desc: 'Manage active events', icon: FolderKanban },
    { label: 'Create Event', to: '/organiser/events/create', desc: 'Start a new event', icon: PlusCircle },
  ];

  const adminMenu = [
    { label: 'Admin Panel', to: '/admin', desc: 'Platform administration', icon: Shield },
  ];

  function getDashboardLink() {
    if (!user) return '/';
    if (user.role === 'admin')     return '/admin';
    if (user.role === 'organiser') return '/organiser/dashboard';
    return '/dashboard';
  }

  const accountMenuItems = user?.role === 'volunteer'
    ? volunteerMenu
    : user?.role === 'organiser'
      ? organiserMenu
      : adminMenu;

  const itemClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-2 font-display font-bold text-xs uppercase tracking-wide transition-colors ${
      isActive ? 'text-[#A7EBF2]' : 'text-[#8BBFCC] hover:text-[#F0FAFB]'
    }`;

  return (
    <>
      {/* ── NAVBAR ── */}
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300
          ${scrolled
            ? 'bg-[#011C40]/95 backdrop-blur-xl shadow-[0_2px_20px_rgba(1,28,64,0.8)] border-b border-[rgba(84,172,191,0.12)]'
            : 'bg-transparent'
          }
        `}
      >
        <div className="w-full px-5 md:px-10">
          <div className="flex items-center justify-between h-16 md:h-[72px]">

            {/* ── LOGO ── */}
            <Link
              to="/"
              className="flex items-center gap-2 group"
              aria-label="Pruthwe volunteers home"
            >
              {/* Logo mark */}
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#54ACBF] to-[#26658C] flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-200">
                <span className="text-[#011C40] font-display font-black text-sm leading-none">P</span>
              </div>
              {/* Wordmark */}
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-[#F0FAFB] text-sm tracking-wide">
                  PRUTHWEE
                </span>
                <span className="font-mono text-[#54ACBF] text-[9px] tracking-[3px] uppercase">
                  Volunteers
                </span>
              </div>
            </Link>

            {/* ── DESKTOP NAV LINKS ── */}
            <nav className="hidden lg:flex items-center gap-2" aria-label="Main navigation" ref={desktopMenuRef}>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18 }}>
              <NavLink to="/events" className={itemClass}>
                {({ isActive }) => (
                  <>
                    <span>Events</span>
                    <span className={`absolute left-3 right-3 -bottom-0.5 h-[2px] bg-[#54ACBF] rounded-full transition-transform origin-left ${isActive ? 'scale-x-100' : 'scale-x-0'}`} />
                  </>
                )}
              </NavLink>
              </motion.div>

              {/* Summit nav kept for future release */}
              {/*
              <NavLink to="/summit-2026" className={itemClass}>
                {({ isActive }) => (
                  <>
                    <span className="inline-flex items-center gap-2">
                      Summit 2026
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-[#54ACBF] opacity-75 animate-ping" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#54ACBF]" />
                      </span>
                    </span>
                    <span className={`absolute left-3 right-3 -bottom-0.5 h-[2px] bg-[#54ACBF] rounded-full transition-transform origin-left ${isActive ? 'scale-x-100' : 'scale-x-0'}`} />
                  </>
                )}
              </NavLink>
              */}

              <div className="relative">
                <motion.button
                  type="button"
                  onClick={() => setDesktopMenuOpen((v) => (v === 'explore' ? null : 'explore'))}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative px-3 py-2 font-display font-bold text-xs uppercase tracking-wide transition-colors inline-flex items-center gap-1.5 ${exploreActive ? 'text-[#A7EBF2]' : 'text-[#8BBFCC] hover:text-[#F0FAFB]'}`}
                >
                  Explore <ChevronDown size={14} className={`transition-transform ${desktopMenuOpen === 'explore' ? 'rotate-180' : ''}`} />
                  <span className={`absolute left-3 right-3 -bottom-0.5 h-[2px] bg-[#54ACBF] rounded-full transition-transform origin-left ${exploreActive ? 'scale-x-100' : 'scale-x-0'}`} />
                </motion.button>
                <AnimatePresence>
                  {desktopMenuOpen === 'explore' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 top-full mt-3 w-[360px] bg-[#023859]/95 backdrop-blur border border-[rgba(84,172,191,0.2)] rounded-2xl shadow-card p-2"
                    >
                      {EXPLORE_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-[rgba(84,172,191,0.08)] transition-colors"
                          >
                            <span className="mt-0.5 text-[#54ACBF]"><Icon size={16} /></span>
                            <span>
                              <span className="block font-display font-bold text-[#F0FAFB] text-xs uppercase tracking-wide">{item.label}</span>
                              <span className="block font-sans text-[#8BBFCC] text-xs mt-0.5 leading-snug">{item.desc}</span>
                            </span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <motion.button
                  type="button"
                  onClick={() => setDesktopMenuOpen((v) => (v === 'about' ? null : 'about'))}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative px-3 py-2 font-display font-bold text-xs uppercase tracking-wide transition-colors inline-flex items-center gap-1.5 ${aboutActive ? 'text-[#A7EBF2]' : 'text-[#8BBFCC] hover:text-[#F0FAFB]'}`}
                >
                  About <ChevronDown size={14} className={`transition-transform ${desktopMenuOpen === 'about' ? 'rotate-180' : ''}`} />
                  <span className={`absolute left-3 right-3 -bottom-0.5 h-[2px] bg-[#54ACBF] rounded-full transition-transform origin-left ${aboutActive ? 'scale-x-100' : 'scale-x-0'}`} />
                </motion.button>
                <AnimatePresence>
                  {desktopMenuOpen === 'about' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 top-full mt-3 w-[360px] bg-[#023859]/95 backdrop-blur border border-[rgba(84,172,191,0.2)] rounded-2xl shadow-card p-2"
                    >
                      {ABOUT_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-[rgba(84,172,191,0.08)] transition-colors"
                          >
                            <span className="mt-0.5 text-[#54ACBF]"><Icon size={16} /></span>
                            <span>
                              <span className="block font-display font-bold text-[#F0FAFB] text-xs uppercase tracking-wide">{item.label}</span>
                              <span className="block font-sans text-[#8BBFCC] text-xs mt-0.5 leading-snug">{item.desc}</span>
                            </span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* ── DESKTOP CTAs ── */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                /* Logged-in user menu */
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[rgba(84,172,191,0.25)] hover:border-[rgba(84,172,191,0.5)] transition-all duration-200 group"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#54ACBF] to-[#26658C] flex items-center justify-center text-[#011C40] font-bold text-xs">
                      {avatarLetter}
                    </div>
                    <span className="text-[#A7EBF2] text-sm font-medium max-w-[120px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-[#54ACBF] transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{  opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-72 bg-[#023859]/95 backdrop-blur border border-[rgba(84,172,191,0.2)] rounded-2xl shadow-card overflow-hidden"
                      >
                        <div className="p-2">
                          {accountMenuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.to}
                                to={item.to}
                                className="flex items-start gap-3 px-3 py-2.5 rounded-xl text-[#8BBFCC] hover:text-[#F0FAFB] hover:bg-[rgba(84,172,191,0.08)] transition-all duration-150"
                              >
                                <Icon size={15} className="text-[#54ACBF] mt-0.5" />
                                <span>
                                  <span className="block font-display font-bold text-xs uppercase tracking-wide">{item.label}</span>
                                  <span className="block font-sans text-[11px] leading-snug text-[#7FB2C0] mt-0.5">{item.desc}</span>
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                        <div className="border-t border-[rgba(84,172,191,0.12)] p-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#FCA5A5] hover:bg-[rgba(239,68,68,0.08)] transition-all duration-150 text-sm"
                          >
                            <LogOut size={15} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Guest CTAs */
                <>
                  {/* <NavLink
                    to="/for-volunteers"
                    className={({ isActive }) =>
                      `px-2 py-1.5 font-display font-bold text-xs uppercase tracking-wide transition-colors ${isActive ? 'text-[#A7EBF2]' : 'text-[#8BBFCC] hover:text-[#F0FAFB]'}`
                    }
                  >
                    For Volunteers
                  </NavLink>
                  <NavLink
                    to="/for-organisers"
                    className={({ isActive }) =>
                      `px-2 py-1.5 font-display font-bold text-xs uppercase tracking-wide transition-colors ${isActive ? 'text-[#A7EBF2]' : 'text-[#8BBFCC] hover:text-[#F0FAFB]'}`
                    }
                  >
                    For Organisers
                  </NavLink> */}
                  <motion.button
                    onClick={openLoginModal}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-outline text-xs px-4 py-2.5"
                  >
                    Log In
                  </motion.button>
                  <motion.button
                    onClick={openRegisterModal}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary text-xs py-2.5 px-5"
                  >
                    Register Free
                  </motion.button>
                </>
              )}
            </div>

            {/* ── MOBILE HAMBURGER ── */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-[#8BBFCC] hover:text-[#F0FAFB] hover:bg-[rgba(84,172,191,0.08)] transition-all duration-200"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>
        </div>
      </motion.header>

      {/* ── MOBILE FULLSCREEN MENU ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{  opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-[#011C40]/80 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{  x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full bg-[#011C40] border-l border-[rgba(84,172,191,0.15)] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-[rgba(84,172,191,0.12)]">
                <span className="font-display font-bold text-[#F0FAFB] text-lg">Navigation</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg text-[#8BBFCC] hover:text-[#F0FAFB] hover:bg-[rgba(84,172,191,0.08)]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <section>
                  <h3 className="font-display font-black text-[#A7EBF2] uppercase tracking-[2px] text-xs mb-3">Discover</h3>
                  <div className="space-y-1.5">
                    {mobileDiscover.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="block px-4 py-3 rounded-xl text-sm font-sans text-[#8BBFCC] hover:text-[#F0FAFB] hover:bg-[rgba(84,172,191,0.08)] transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="font-display font-black text-[#A7EBF2] uppercase tracking-[2px] text-xs mb-3">Organisation</h3>
                  <div className="space-y-1.5">
                    {mobileOrganisation.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="block px-4 py-3 rounded-xl text-sm font-sans text-[#8BBFCC] hover:text-[#F0FAFB] hover:bg-[rgba(84,172,191,0.08)] transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="font-display font-black text-[#A7EBF2] uppercase tracking-[2px] text-xs mb-3">Join</h3>
                  <div className="space-y-1.5">
                    {mobileJoin.map((item: { label: string; to: string }) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="block px-4 py-3 rounded-xl text-sm font-sans text-[#8BBFCC] hover:text-[#F0FAFB] hover:bg-[rgba(84,172,191,0.08)] transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </section>
              </div>

              {/* Bottom CTAs */}
              <div className="p-4 border-t border-[rgba(84,172,191,0.12)] space-y-3">
                {user ? (
                  <>
                    <Link
                      to={getDashboardLink()}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[rgba(84,172,191,0.1)] border border-[rgba(84,172,191,0.2)] text-[#A7EBF2] font-medium text-sm"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[#FCA5A5] text-sm font-medium hover:bg-[rgba(239,68,68,0.08)] transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setMobileOpen(false); openRegisterModal(); }}
                      className="w-full btn-primary justify-center py-3"
                    >
                      Register Free
                    </button>
                    <button
                      onClick={() => { setMobileOpen(false); openLoginModal(); }}
                      className="w-full btn-outline justify-center py-3"
                    >
                      Log In
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer so content doesn't hide under fixed navbar */}
      <div className="h-16 md:h-[72px]" />
    </>
  );
}
