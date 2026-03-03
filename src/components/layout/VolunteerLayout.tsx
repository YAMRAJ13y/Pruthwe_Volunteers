import { useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ClipboardList, Award, Users,
  User, Calendar, LogOut, ChevronRight, Zap,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { STATUS_TIERS } from '../../constants';

// ── NAV ITEMS ─────────────────────────────────
const NAV_ITEMS = [
  { label: 'Dashboard',    href: '/dashboard',              icon: <LayoutDashboard size={18} />, exact: true  },
  { label: 'Assignments',  href: '/dashboard/assignments',  icon: <ClipboardList size={18} />,  exact: false },
  { label: 'Certificates', href: '/dashboard/certificates', icon: <Award size={18} />,          exact: false },
  { label: 'Groups',       href: '/dashboard/groups',       icon: <Users size={18} />,          exact: false },
  { label: 'Profile',      href: '/profile',                icon: <User size={18} />,           exact: true  },
] as const;

const BOTTOM_ITEMS = [
  { label: 'Browse Events', href: '/events', icon: <Calendar size={18} /> },
] as const;

// ── TIER LOOKUP ───────────────────────────────
function getTier(id: string) {
  return STATUS_TIERS.find(t => t.id === id) ?? STATUS_TIERS[0];
}

// ── AVATAR INITIALS ───────────────────────────
function getInitials(name: string) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
}

// ── HOURS PROGRESS ────────────────────────────
function hoursToNextTier(total: number) {
  let current: (typeof STATUS_TIERS)[number] = STATUS_TIERS[0];
  for (let i = STATUS_TIERS.length - 1; i >= 0; i -= 1) {
    const tier = STATUS_TIERS[i];
    if (total >= tier.hoursMin) {
      current = tier;
      break;
    }
  }
  const nextIdx = STATUS_TIERS.findIndex(t => t.id === current.id) + 1;
  const next    = STATUS_TIERS[nextIdx];
  if (!next) return { pct: 100, remaining: 0, nextLabel: 'Max tier', nextColor: current.color };
  const range = next.hoursMin - current.hoursMin;
  const done  = total - current.hoursMin;
  return {
    pct:       Math.min(Math.round((done / range) * 100), 100),
    remaining: Math.max(0, next.hoursMin - total),
    nextLabel: next.label,
    nextColor: next.color,
  };
}

// ── SIDEBAR NAV LINK ──────────────────────────
function SideNavLink({
  href, icon, label, exact, onClick,
}: { href: string; icon: React.ReactNode; label: string; exact: boolean; onClick?: () => void }) {
  const location = useLocation();
  const active   = exact
    ? location.pathname === href
    : location.pathname.startsWith(href);

  return (
    <Link
      to={href}
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-150 ${
        active
          ? 'bg-[rgba(84,172,191,0.14)] text-[#A7EBF2]'
          : 'text-[#8BBFCC] hover:bg-[rgba(84,172,191,0.07)] hover:text-[#F0FAFB]'
      }`}
    >
      {/* Active left bar */}
      {active && (
        <motion.div
          layoutId="sidebar-active-bar"
          className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-[#54ACBF]"
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        />
      )}
      <span className={`flex-shrink-0 transition-colors ${active ? 'text-[#54ACBF]' : 'text-[#54ACBF] group-hover:text-[#A7EBF2]'}`}>
        {icon}
      </span>
      <span className="font-display font-bold text-sm uppercase tracking-wide flex-1 leading-none">
        {label}
      </span>
      {active && <ChevronRight size={13} className="opacity-50 flex-shrink-0" />}
    </Link>
  );
}

// ── MOBILE TAB LINK ───────────────────────────
function MobileTabLink({ href, icon, label, exact }: {
  href: string; icon: React.ReactNode; label: string; exact: boolean;
}) {
  const location = useLocation();
  const active   = exact
    ? location.pathname === href
    : location.pathname.startsWith(href);

  return (
    <Link
      to={href}
      className={`flex flex-col items-center gap-0.5 px-3 py-2 flex-1 transition-all ${
        active ? 'text-[#A7EBF2]' : 'text-[#54ACBF]'
      }`}
    >
      <span className={`relative transition-all ${active ? 'scale-110' : ''}`}>
        {active && (
          <motion.span
            layoutId="mobile-active-dot"
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#54ACBF]"
          />
        )}
        {icon}
      </span>
      <span className="font-mono text-[9px] uppercase tracking-[1.5px] leading-none">
        {label}
      </span>
    </Link>
  );
}

// ═════════════════════════════════════════════
export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, logout } = useAuthStore();
  const navigate = useNavigate();

  // Read real stats from profile (set by LoginModal / RegisterModal)
  const totalHours = profile?.total_hours  ?? 0;
  const tierId     = profile?.status_tier  ?? 'none';
  const mqScore    = profile?.mq_score     ?? 0;
  const tier       = getTier(tierId);
  const progress   = hoursToNextTier(totalHours);
  const initials   = profile?.fullName ? getInitials(profile.fullName) : user?.email?.[0]?.toUpperCase() ?? 'V';
  const firstName  = profile?.fullName?.split(' ')[0] || 'Volunteer';

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#011C40]">

      {/* ══════════════════════════════════════
          DESKTOP SIDEBAR (≥ lg)
      ══════════════════════════════════════ */}
      <aside className="hidden lg:flex flex-col w-56 xl:w-60 flex-shrink-0 bg-[#02294D] border-r border-[rgba(84,172,191,0.1)] sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">

        {/* ── VOLUNTEER CARD ── */}
        <div className="p-4 border-b border-[rgba(84,172,191,0.1)]">
          {/* Avatar + name */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-sm text-[#011C40] flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.color}99)` }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-display font-black text-[#F0FAFB] text-sm uppercase tracking-wide truncate leading-none">
                {firstName}
              </p>
              <p className="font-sans text-[#8BBFCC] text-[11px] truncate mt-0.5">
                {profile?.city ?? user?.email?.split('@')[0]}
              </p>
            </div>
          </div>

          {/* Tier badge */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border mb-3"
            style={{
              background:   tier.bgColor,
              borderColor:  tier.borderColor,
            }}
          >
            <span className="text-sm leading-none">{tier.icon}</span>
            <span className="font-display font-black text-xs uppercase tracking-wide leading-none" style={{ color: tier.color }}>
              {tier.label}
            </span>
            <span className="font-sans text-[10px] ml-auto opacity-70" style={{ color: tier.color }}>
              {totalHours}h
            </span>
          </div>

          {/* Progress to next tier */}
          {progress.remaining > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[#8BBFCC] text-[10px] tracking-wide">
                  Next: {progress.nextLabel}
                </span>
                <span className="font-mono text-[10px]" style={{ color: progress.nextColor }}>
                  {progress.remaining}h
                </span>
              </div>
              <div className="h-1 bg-[rgba(84,172,191,0.1)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, #54ACBF, ${progress.nextColor})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.pct}%` }}
                  transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── MQ SCORE CHIP ── */}
        {profile && (
          <div className="px-4 py-3 border-b border-[rgba(84,172,191,0.07)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap size={12} className="text-[#54ACBF]" />
                <span className="font-mono text-[#54ACBF] text-[10px] uppercase tracking-[2px]">
                  MQ Score
                </span>
              </div>
              <span className="font-display font-black text-[#A7EBF2] text-base leading-none">
                {mqScore}
              </span>
            </div>
            <div className="mt-1.5 h-1 bg-[rgba(84,172,191,0.1)] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#54ACBF] to-[#A7EBF2]" style={{ width: `${Math.min(mqScore, 100)}%` }} />
            </div>
          </div>
        )}

        {/* ── MAIN NAV ── */}
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV_ITEMS.map(item => (
            <SideNavLink key={item.href} {...item} />
          ))}
        </nav>

        {/* ── BOTTOM ── */}
        <div className="p-3 border-t border-[rgba(84,172,191,0.1)] space-y-0.5">
          {BOTTOM_ITEMS.map(item => (
            <SideNavLink key={item.href} {...item} exact={false} />
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#FCA5A5] hover:bg-[rgba(252,165,165,0.07)] transition-all duration-150 group"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className="font-display font-bold text-sm uppercase tracking-wide">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════ */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile: compact top identity bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-[#02294D] border-b border-[rgba(84,172,191,0.1)]">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-display font-black text-xs text-[#011C40] flex-shrink-0"
            style={{ background: tier.color }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-black text-[#F0FAFB] text-sm uppercase tracking-wide truncate leading-none">
              {firstName}
            </p>
            <p className="font-sans text-[#8BBFCC] text-[10px]">
              {tier.icon} {tier.label} · {totalHours}h
            </p>
          </div>
          {/* Progress mini */}
          <div className="w-20 flex-shrink-0">
            <div className="h-1 bg-[rgba(84,172,191,0.1)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#54ACBF] to-[#A7EBF2]"
                style={{ width: `${progress.pct}%` }}
              />
            </div>
            <p className="font-mono text-[#54ACBF] text-[9px] text-right mt-0.5">
              {progress.remaining > 0 ? `${progress.remaining}h to ${progress.nextLabel}` : 'Max tier'}
            </p>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      {/* ══════════════════════════════════════
          MOBILE BOTTOM TAB BAR (< lg)
      ══════════════════════════════════════ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#02294D]/95 backdrop-blur-md border-t border-[rgba(84,172,191,0.15)] safe-area-pb">
        <div className="flex items-stretch">
          {NAV_ITEMS.map(item => (
            <MobileTabLink key={item.href} {...item} />
          ))}
        </div>
      </nav>
    </div>
  );
}