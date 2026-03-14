import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, useLayoutEffect, useRef } from 'react';

// ── GLOBAL LIGHTNING ──────────────────────────
type LPt   = { x: number; y: number };
type LBolt = { pts: LPt[]; branches: LPt[][]; born: number; life: number };

function boltPts(x1: number, y1: number, x2: number, y2: number, d: number, depth: number): LPt[] {
  if (depth === 0 || d < 2) return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
  const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * d;
  const my = (y1 + y2) / 2 + (Math.random() - 0.5) * d;
  return [...boltPts(x1, y1, mx, my, d / 1.8, depth - 1), ...boltPts(mx, my, x2, y2, d / 1.8, depth - 1).slice(1)];
}

function GlobalLightning() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const boltsRef   = useRef<LBolt[]>([]);
  const frameRef   = useRef<number | null>(null);
  const coolRef    = useRef(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const now = Date.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      boltsRef.current = boltsRef.current.filter(b => now - b.born < b.life + 60);

      for (const bolt of boltsRef.current) {
        const t       = Math.min(1, (now - bolt.born) / bolt.life);
        const alpha   = Math.max(0, 1 - t) * (0.55 + Math.random() * 0.45);

        const seg = (pts: LPt[], lw: number, color: string, blur: number) => {
          if (pts.length < 2) return;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.lineWidth   = lw;
          ctx.strokeStyle = color;
          ctx.shadowBlur  = blur;
          ctx.shadowColor = '#CCFF00';
          ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
          ctx.stroke();
          ctx.restore();
        };

        seg(bolt.pts, 6,   'rgba(204,255,0,0.28)', 32);
        seg(bolt.pts, 2.5, 'rgba(180,255,60,0.75)', 10);
        seg(bolt.pts, 0.8, 'rgba(255,255,255,0.95)', 3);
        for (const br of bolt.branches) {
          seg(br, 3.5, 'rgba(204,255,0,0.22)', 20);
          seg(br, 1.5, 'rgba(180,255,80,0.65)',  7);
          seg(br, 0.5, 'rgba(255,255,255,0.85)', 0);
        }
      }
      frameRef.current = requestAnimationFrame(draw);
    };
    frameRef.current = requestAnimationFrame(draw);

    const spawn = (cx: number, cy: number) => {
      const now = Date.now();
      if (now - coolRef.current < 80) return;
      coolRef.current = now;
      const angle  = Math.random() * Math.PI * 2;
      const length = 100 + Math.random() * 200;
      const ex = cx + Math.cos(angle) * length;
      const ey = cy + Math.sin(angle) * length;
      const pts = boltPts(cx, cy, ex, ey, 55, 6);
      const branches: LPt[][] = Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () => {
        const si = Math.floor(pts.length * (0.2 + Math.random() * 0.5));
        const sp = pts[si] ?? pts[0];
        const ba = angle + (Math.random() - 0.5) * 1.4;
        const bl = length * (0.2 + Math.random() * 0.3);
        return boltPts(sp.x, sp.y, sp.x + Math.cos(ba) * bl, sp.y + Math.sin(ba) * bl, 28, 4);
      });
      boltsRef.current = [...boltsRef.current.slice(-8), { pts, branches, born: now, life: 180 + Math.random() * 160 }];
    };

    const onClick = (e: MouseEvent) => {
      // skip clicks on interactive elements so buttons/links still work normally
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      if (['input','button','a','textarea','select','label'].includes(tag)) return;
      coolRef.current = 0; spawn(e.clientX, e.clientY);
      coolRef.current = 0; spawn(e.clientX, e.clientY);
      coolRef.current = 0; spawn(e.clientX, e.clientY);
    };

    window.addEventListener('click', onClick, { capture: false });
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', onClick);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9998 }}
    />
  );
}

// Layout
import Navbar        from './components/layout/Navbar';
import Footer        from './components/layout/Footer';
import CustomCursor  from './components/layout/CustomCursor';
import VolunteerLayout from './components/layout/VolunteerLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import RoleGuard     from './components/layout/RoleGuard';

// ── AUTH MODALS ──────────────────────────────
import LoginModal    from './components/layout/auth/LoginModal';
import EventRegistrationModal from './components/layout/auth/EventRegistrationModal';
import RegisterModal from './components/layout/auth/RegisterModal';

// ── PUBLIC PAGES ─────────────────────────────
import HomePage          from './pages/HomePage';
import ForVolunteersPage from './pages/ForVolunteersPage';
import ForOrganisersPage from './pages/ForOrganisersPage';
import EventsPage        from './pages/EventsPage';
import EventDetailPage   from './pages/EventDetailPage';
import Summit2026Page    from './pages/Summit2026Page';
import GalleryPage       from './pages/GalleryPage';
import PartnersPage      from './pages/PartnersPage';
import AboutPage         from './pages/AboutPage';
import ContactPage       from './pages/ContactPage';
import NewsPage          from './pages/NewsPage';
import NewsArticlePage   from './pages/NewsArticlePage';
import NewsletterPage    from './pages/NewsletterPage';
import NotFoundPage      from './pages/NotFoundPage';
import GuidebookPage     from './pages/GuidebookPage';

// ── VOLUNTEER PORTAL ─────────────────────────
import DashboardPage    from './pages/volunteer/DashboardPage';
import AssignmentsPage  from './pages/volunteer/AssignmentsPage';
import CertificatesPage from './pages/volunteer/CertificatesPage';
import ProfilePage      from './pages/volunteer/ProfilePage';
import GroupsPage       from './pages/volunteer/GroupsPage';

// ── ORGANISER PORTAL ─────────────────────────
import OrgDashboardPage   from './pages/organiser/OrgDashboardPage';
import CreateEventPage    from './pages/organiser/CreateEventPage';
import SectorManagerPage  from './pages/organiser/SectorManagerPage';
import RegistrationsPage  from './pages/organiser/RegistrationsPage';
import AllocationToolPage from './pages/organiser/AllocationToolPage';
import MessagesPage       from './pages/organiser/MessagesPage';
import EventClosePage     from './pages/organiser/EventClosePage';
import GroupsManagerPage  from './pages/organiser/GroupsManagerPage';

// ── ADMIN ─────────────────────────────────────
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// ── SCROLL TO TOP ─────────────────────────────
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return;
    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = prev;
    };
  }, []);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const raf = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
    return () => window.cancelAnimationFrame(raf);
  }, [location.key, location.pathname, location.search, location.hash]);

  return null;
}

// ── LAYOUT WRAPPER ────────────────────────────
function WithLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ animation: 'fadeIn 0.2s ease-out both' }}>{children}</main>
      <Footer />
    </>
  );
}

// ── APP ───────────────────────────────────────
export default function App() {
  return (
    <>
      <CustomCursor />
      <GlobalLightning />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background:   '#141414',
            color:        '#F2F2F2',
            border:       '1px solid rgba(84, 172, 191, 0.3)',
            borderRadius: '10px',
            fontFamily:   "'DM Sans', sans-serif",
            fontSize:     '14px',
          },
          success: { iconTheme: { primary: '#6EE07A', secondary: '#0C0C0C' } },
          error:   { iconTheme: { primary: '#FCA5A5', secondary: '#0C0C0C' } },
        }}
      />

      {/* Auth modals — always mounted, shown via custom events */}
      <LoginModal />
      <EventRegistrationModal />
      <RegisterModal />

      <ScrollToTop />

      <Routes>

          {/* ── PUBLIC ── */}
          <Route path="/"               element={<WithLayout><HomePage /></WithLayout>} />
          <Route path="/for-volunteers" element={<WithLayout><ForVolunteersPage /></WithLayout>} />
          <Route path="/for-organisers" element={<WithLayout><ForOrganisersPage /></WithLayout>} />
          <Route path="/events"         element={<WithLayout><EventsPage /></WithLayout>} />
          <Route path="/events/:id"     element={<WithLayout><EventDetailPage /></WithLayout>} />
          <Route path="/summit-2026"    element={<WithLayout><Summit2026Page /></WithLayout>} />
          <Route path="/gallery"        element={<WithLayout><GalleryPage /></WithLayout>} />
          <Route path="/partners"       element={<WithLayout><PartnersPage /></WithLayout>} />
          <Route path="/about"          element={<WithLayout><AboutPage /></WithLayout>} />
          <Route path="/contact"        element={<WithLayout><ContactPage /></WithLayout>} />
          <Route path="/news"           element={<WithLayout><NewsPage /></WithLayout>} />
          <Route path="/news/:slug"     element={<WithLayout><NewsArticlePage /></WithLayout>} />
          <Route path="/newsletter"     element={<WithLayout><NewsletterPage /></WithLayout>} />
          <Route path="/guidebook"       element={<WithLayout><GuidebookPage /></WithLayout>} />

          {/* ── VOLUNTEER PORTAL ── */}
          <Route path="/dashboard" element={
            <ProtectedRoute><WithLayout><VolunteerLayout><DashboardPage /></VolunteerLayout></WithLayout></ProtectedRoute>
          } />
          <Route path="/dashboard/assignments" element={
            <ProtectedRoute><WithLayout><VolunteerLayout><AssignmentsPage /></VolunteerLayout></WithLayout></ProtectedRoute>
          } />
          <Route path="/dashboard/certificates" element={
            <ProtectedRoute><WithLayout><VolunteerLayout><CertificatesPage /></VolunteerLayout></WithLayout></ProtectedRoute>
          } />
          <Route path="/dashboard/groups" element={
            <ProtectedRoute><WithLayout><VolunteerLayout><GroupsPage /></VolunteerLayout></WithLayout></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><WithLayout><VolunteerLayout><ProfilePage /></VolunteerLayout></WithLayout></ProtectedRoute>
          } />

          {/* ── ORGANISER PORTAL ── */}
          <Route path="/organiser/dashboard" element={
            <ProtectedRoute><RoleGuard role="organiser"><WithLayout><OrgDashboardPage /></WithLayout></RoleGuard></ProtectedRoute>
          } />
          <Route path="/organiser/events/create" element={
            <ProtectedRoute><RoleGuard role="organiser"><WithLayout><CreateEventPage /></WithLayout></RoleGuard></ProtectedRoute>
          } />
          <Route path="/organiser/events/:id/sectors" element={
            <ProtectedRoute><RoleGuard role="organiser"><WithLayout><SectorManagerPage /></WithLayout></RoleGuard></ProtectedRoute>
          } />
          <Route path="/organiser/events/:id/registrations" element={
            <ProtectedRoute><RoleGuard role="organiser"><WithLayout><RegistrationsPage /></WithLayout></RoleGuard></ProtectedRoute>
          } />
          <Route path="/organiser/events/:id/allocations" element={
            <ProtectedRoute><RoleGuard role="organiser"><WithLayout><AllocationToolPage /></WithLayout></RoleGuard></ProtectedRoute>
          } />
          <Route path="/organiser/events/:id/messages" element={
            <ProtectedRoute><RoleGuard role="organiser"><WithLayout><MessagesPage /></WithLayout></RoleGuard></ProtectedRoute>
          } />
          <Route path="/organiser/events/:id/close" element={
            <ProtectedRoute><RoleGuard role="organiser"><WithLayout><EventClosePage /></WithLayout></RoleGuard></ProtectedRoute>
          } />
          <Route path="/organiser/events/:id/groups" element={
            <ProtectedRoute><RoleGuard role="organiser"><WithLayout><GroupsManagerPage /></WithLayout></RoleGuard></ProtectedRoute>
          } />

          {/* ── ADMIN ── */}
          <Route path="/admin" element={
            <ProtectedRoute><RoleGuard role="admin"><WithLayout><AdminDashboardPage /></WithLayout></RoleGuard></ProtectedRoute>
          } />

          {/* ── 404 ── */}
          <Route path="*" element={<WithLayout><NotFoundPage /></WithLayout>} />

      </Routes>
    </>
  );
}