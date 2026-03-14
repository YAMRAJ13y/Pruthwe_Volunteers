import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, ChevronDown, Calendar, Newspaper, Image, Info,
  Users, Mail, Bell, LayoutDashboard, ClipboardList, Award,
  User, FolderKanban, PlusCircle, Shield, LogOut, BookOpen,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';

export function openRegisterModal() { window.dispatchEvent(new CustomEvent('open-register')); }
export function openLoginModal()    { window.dispatchEvent(new CustomEvent('open-login')); }

type MenuItem = { label: string; to: string; desc: string; icon: LucideIcon; };

const EXPLORE_ITEMS: MenuItem[] = [
  { label: 'Gallery',    to: '/gallery',   desc: 'Moments from volunteer drives and impact stories.', icon: Image },
  { label: 'Guidebook',  to: '/guidebook', desc: 'Complete guide to volunteering and organising.',    icon: BookOpen },
  { label: 'News & Blog',to: '/news',      desc: 'Latest updates, announcements, and articles.',      icon: Newspaper },
];
const ABOUT_ITEMS: MenuItem[] = [
  { label: 'About Us',   to: '/about',        desc: 'Our mission, model, and volunteer-first vision.', icon: Info },
  { label: 'Partners',   to: '/partners',     desc: 'Organisations supporting our initiatives.',        icon: Users },
  { label: 'Contact',    to: '/contact',      desc: 'Reach the Pruthwee team for support.',             icon: Mail },
  { label: 'Newsletter', to: '/newsletter',   desc: 'Monthly opportunities and platform updates.',       icon: Bell },
];

export default function Navbar() {
  const [scrolled,        setScrolled]        = useState(false);
  const [mobileOpen,      setMobileOpen]      = useState(false);
  const [userMenuOpen,    setUserMenuOpen]    = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState<'explore'|'about'|null>(null);
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, profile, logout } = useAuthStore();
  const userMenuRef    = useRef<HTMLDivElement|null>(null);
  const desktopMenuRef = useRef<HTMLDivElement|null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false); setUserMenuOpen(false); setDesktopMenuOpen(null);
  }, [location.pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current    && !userMenuRef.current.contains(e.target as Node))    setUserMenuOpen(false);
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(e.target as Node)) setDesktopMenuOpen(null);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  function handleLogout() { logout(); navigate('/'); }

  const displayName  = profile?.fullName?.trim() || user?.email.split('@')[0] || 'Account';
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const exploreActive = location.pathname === '/gallery' || location.pathname.startsWith('/news');
  const aboutActive   = ['/about','/partners','/contact','/newsletter'].some(p => location.pathname.startsWith(p));

  const mobileDiscover    = [{ label:'Events',to:'/events'},{ label:'Gallery',to:'/gallery'},{ label:'News',to:'/news'}];
  const mobileOrganisation= [{ label:'About',to:'/about'},{ label:'Partners',to:'/partners'},{ label:'Contact',to:'/contact'}];
  const mobileJoin: Array<{label:string;to:string}> = [];

  const volunteerMenu = [
    { label:'My Dashboard',  to:'/dashboard',              desc:'Overview and progress',     icon:LayoutDashboard },
    { label:'Assignments',   to:'/dashboard/assignments',  desc:'Upcoming allocations',      icon:ClipboardList },
    { label:'Certificates',  to:'/dashboard/certificates', desc:'Issued certificates',       icon:Award },
    { label:'Groups',        to:'/dashboard/groups',       desc:'Volunteer groups',          icon:Users },
    { label:'My Profile',    to:'/profile',                desc:'Update profile details',    icon:User },
  ];
  const organiserMenu = [
    { label:'My Events',    to:'/organiser/dashboard',     desc:'Manage active events',      icon:FolderKanban },
    { label:'Create Event', to:'/organiser/events/create', desc:'Start a new event',         icon:PlusCircle },
  ];
  const adminMenu = [
    { label:'Admin Panel', to:'/admin', desc:'Platform administration', icon:Shield },
  ];

  function getDashboardLink() {
    if (!user) return '/';
    if (user.role === 'admin')     return '/admin';
    if (user.role === 'organiser') return '/organiser/dashboard';
    return '/dashboard';
  }

  const accountMenuItems = user?.role === 'volunteer' ? volunteerMenu
    : user?.role === 'organiser' ? organiserMenu : adminMenu;

  /* ── Active link class ── */
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-2 font-display font-bold text-xs uppercase tracking-wide transition-colors ${
      isActive ? 'text-[#CCFF00]' : 'text-[#888] hover:text-[#F2F2F2]'
    }`;

  /* ── Dropdown item ── */
  const DropItem = ({ item }: { item: MenuItem }) => {
    const Icon = item.icon;
    return (
      <Link to={item.to} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
        <span className="mt-0.5 text-[#CCFF00]"><Icon size={15} /></span>
        <span>
          <span className="block font-display font-bold text-[#F2F2F2] text-xs uppercase tracking-wide">{item.label}</span>
          <span className="block text-[#666] text-xs mt-0.5 leading-snug">{item.desc}</span>
        </span>
      </Link>
    );
  };

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0C0C0C]/95 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)] border-b border-white/[0.06]'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full px-5 md:px-10">
          <div className="flex items-center justify-between h-16 md:h-[68px]">

            {/* ── LOGO ── */}
            <Link to="/" className="flex items-center group" aria-label="Pruthwee volunteers home">
              <img
                src="/logo.png"
                alt="Pruthwee Volunteers"
                className="h-40 md:h-48 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </Link>

            {/* ── DESKTOP NAV ── */}
            <nav className="hidden lg:flex items-center gap-1" ref={desktopMenuRef}>
              <motion.div whileHover={{ y:-2 }} transition={{ duration:0.15 }}>
                <NavLink to="/events" className={linkCls}>
                  {({ isActive }) => (
                    <>
                      <span>Events</span>
                      <span className={`absolute left-3 right-3 -bottom-0.5 h-[2px] bg-[#CCFF00] rounded-full transition-transform origin-left ${isActive ? 'scale-x-100' : 'scale-x-0'}`} />
                    </>
                  )}
                </NavLink>
              </motion.div>

              {/* Explore dropdown */}
              <div className="relative">
                <motion.button
                  type="button"
                  onClick={() => setDesktopMenuOpen(v => v === 'explore' ? null : 'explore')}
                  whileHover={{ y:-2 }} whileTap={{ scale:0.98 }}
                  className={`relative px-3 py-2 font-display font-bold text-xs uppercase tracking-wide transition-colors inline-flex items-center gap-1.5 ${exploreActive ? 'text-[#CCFF00]' : 'text-[#888] hover:text-[#F2F2F2]'}`}
                >
                  Explore <ChevronDown size={13} className={`transition-transform ${desktopMenuOpen === 'explore' ? 'rotate-180' : ''}`} />
                  <span className={`absolute left-3 right-3 -bottom-0.5 h-[2px] bg-[#CCFF00] rounded-full transition-transform origin-left ${exploreActive ? 'scale-x-100' : 'scale-x-0'}`} />
                </motion.button>
                <AnimatePresence>
                  {desktopMenuOpen === 'explore' && (
                    <motion.div
                      initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:8 }}
                      transition={{ duration:0.16 }}
                      className="absolute left-0 top-full mt-2 w-72 bg-[#141414]/98 backdrop-blur border border-white/[0.08] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-1.5"
                    >
                      {EXPLORE_ITEMS.map(item => <DropItem key={item.to} item={item} />)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* About dropdown */}
              <div className="relative">
                <motion.button
                  type="button"
                  onClick={() => setDesktopMenuOpen(v => v === 'about' ? null : 'about')}
                  whileHover={{ y:-2 }} whileTap={{ scale:0.98 }}
                  className={`relative px-3 py-2 font-display font-bold text-xs uppercase tracking-wide transition-colors inline-flex items-center gap-1.5 ${aboutActive ? 'text-[#CCFF00]' : 'text-[#888] hover:text-[#F2F2F2]'}`}
                >
                  About <ChevronDown size={13} className={`transition-transform ${desktopMenuOpen === 'about' ? 'rotate-180' : ''}`} />
                  <span className={`absolute left-3 right-3 -bottom-0.5 h-[2px] bg-[#CCFF00] rounded-full transition-transform origin-left ${aboutActive ? 'scale-x-100' : 'scale-x-0'}`} />
                </motion.button>
                <AnimatePresence>
                  {desktopMenuOpen === 'about' && (
                    <motion.div
                      initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:8 }}
                      transition={{ duration:0.16 }}
                      className="absolute left-0 top-full mt-2 w-72 bg-[#141414]/98 backdrop-blur border border-white/[0.08] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-1.5"
                    >
                      {ABOUT_ITEMS.map(item => <DropItem key={item.to} item={item} />)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* ── DESKTOP CTAs ── */}
            <div className="hidden lg:flex items-center gap-2.5">
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.1] hover:border-white/25 transition-all duration-200"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#CCFF00] flex items-center justify-center text-[#0C0C0C] font-bold text-xs">
                      {avatarLetter}
                    </div>
                    <span className="text-[#F2F2F2] text-sm font-medium max-w-[120px] truncate">{displayName}</span>
                    <ChevronDown size={13} className={`text-[#666] transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity:0, y:8, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:8, scale:0.95 }}
                        transition={{ duration:0.14 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-[#141414]/98 backdrop-blur border border-white/[0.08] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden"
                      >
                        <div className="p-1.5">
                          {accountMenuItems.map(item => {
                            const Icon = item.icon;
                            return (
                              <Link key={item.to} to={item.to}
                                className="flex items-start gap-3 px-3 py-2.5 rounded-lg text-[#888] hover:text-[#F2F2F2] hover:bg-white/5 transition-all duration-150"
                              >
                                <Icon size={14} className="text-[#CCFF00] mt-0.5" />
                                <span>
                                  <span className="block font-display font-bold text-xs uppercase tracking-wide">{item.label}</span>
                                  <span className="block text-[11px] leading-snug text-[#555] mt-0.5">{item.desc}</span>
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                        <div className="border-t border-white/[0.06] p-1.5">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#FB7185] hover:bg-[rgba(251,113,133,0.08)] transition-all duration-150 text-sm"
                          >
                            <LogOut size={14} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <motion.button onClick={openLoginModal} whileHover={{ y:-2 }} whileTap={{ scale:0.97 }} className="btn-outline text-xs px-4 py-2.5">
                    Log In
                  </motion.button>
                  <motion.button onClick={openRegisterModal} whileHover={{ y:-2 }} whileTap={{ scale:0.97 }} className="btn-primary text-xs py-2.5 px-5">
                    Register Free
                  </motion.button>
                </>
              )}
            </div>

            {/* ── MOBILE HAMBURGER ── */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-[#888] hover:text-[#F2F2F2] hover:bg-white/5 transition-all duration-200"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }}
              transition={{ type:'spring', damping:28, stiffness:300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full bg-[#0C0C0C] border-l border-white/[0.07] flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/[0.07]">
                <span className="font-display font-bold text-[#F2F2F2] text-lg tracking-wide">Navigation</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg text-[#888] hover:text-[#F2F2F2] hover:bg-white/5">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {[
                  { title:'Discover',     items:mobileDiscover },
                  { title:'Organisation', items:mobileOrganisation },
                ].map(({ title, items }) => items.length > 0 && (
                  <section key={title}>
                    <h3 className="font-display font-black text-[#CCFF00] uppercase tracking-[3px] text-[10px] mb-3">{title}</h3>
                    <div className="space-y-1">
                      {items.map(item => (
                        <Link key={item.to} to={item.to}
                          className="block px-4 py-3 rounded-lg text-sm text-[#888] hover:text-[#F2F2F2] hover:bg-white/5 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
              <div className="p-4 border-t border-white/[0.07] space-y-3">
                {user ? (
                  <>
                    <Link to={getDashboardLink()}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-white/5 border border-white/[0.1] text-[#F2F2F2] font-medium text-sm"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-[#FB7185] text-sm font-medium hover:bg-[rgba(251,113,133,0.08)] transition-colors"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setMobileOpen(false); openRegisterModal(); }} className="w-full btn-primary justify-center py-3">
                      Register Free
                    </button>
                    <button onClick={() => { setMobileOpen(false); openLoginModal(); }} className="w-full btn-outline justify-center py-3">
                      Log In
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-16 md:h-[68px]" />
    </>
  );
}
