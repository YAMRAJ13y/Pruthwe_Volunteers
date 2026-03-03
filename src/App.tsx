import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, useLayoutEffect } from 'react';

// Layout
import Navbar        from './components/layout/Navbar';
import Footer        from './components/layout/Footer';
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
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background:   '#023859',
            color:        '#F0FAFB',
            border:       '1px solid rgba(84, 172, 191, 0.3)',
            borderRadius: '10px',
            fontFamily:   "'DM Sans', sans-serif",
            fontSize:     '14px',
          },
          success: { iconTheme: { primary: '#6EE07A', secondary: '#011C40' } },
          error:   { iconTheme: { primary: '#FCA5A5', secondary: '#011C40' } },
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