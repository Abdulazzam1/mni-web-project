import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Layouts
import AdminLayout from '@/components/layout/AdminLayout';
import AuthLayout from '@/components/layout/AuthLayout';

// Pages — Auth
import LoginPage from '@/pages/auth/LoginPage';

// Pages — App
import DashboardPage       from '@/pages/dashboard/DashboardPage';
import ProductsPage        from '@/pages/products/ProductsPage';
import ProductFormPage     from '@/pages/products/ProductFormPage';
import ServicesPage        from '@/pages/services/ServicesPage';
import ServiceFormPage     from '@/pages/services/ServiceFormPage';
import PortfolioPage       from '@/pages/portfolio/PortfolioPage';
import PortfolioFormPage   from '@/pages/portfolio/PortfolioFormPage';
import NewsPage            from '@/pages/news/NewsPage';
import NewsFormPage        from '@/pages/news/NewsFormPage';
// ─── IMPORT BARU: Banner ────────────────────────────────────
import BannerPage          from '@/pages/banner/Banner';
// ────────────────────────────────────────────────────────────
import TestimonialsPage    from '@/pages/testimonials/TestimonialsPage';
import RFQPage             from '@/pages/rfq/RFQPage';
import ContactPage         from '@/pages/contact/ContactPage';

// ─── IMPORT BARU: Settings (Web Profile) ────────────────────
import SettingsPage        from '@/pages/settings/SettingsPage';
// ────────────────────────────────────────────────────────────

// ─── Guard: butuh login ─────────────────────────────────────
function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageSpinner />;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

// ─── Guard: sudah login, redirect ke dashboard ──────────────
function GuestOnly({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

function FullPageSpinner() {
  return (
    <div className="h-screen flex items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-navy-200 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-sm text-obsidian-400 font-body">Memuat...</p>
      </div>
    </div>
  );
}

// ─── Main Router ────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      {/* ── Auth routes ── */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <GuestOnly>
              <LoginPage />
            </GuestOnly>
          }
        />
      </Route>

      {/* ── Protected admin routes ── */}
      <Route
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"          element={<DashboardPage />} />

        {/* Products */}
        <Route path="/produk"             element={<ProductsPage />} />
        <Route path="/produk/baru"        element={<ProductFormPage />} />
        <Route path="/produk/:id/edit"    element={<ProductFormPage />} />

        {/* Services */}
        <Route path="/layanan"            element={<ServicesPage />} />
        <Route path="/layanan/baru"       element={<ServiceFormPage />} />
        <Route path="/layanan/:id/edit"   element={<ServiceFormPage />} />

        {/* Portfolio */}
        <Route path="/portfolio"          element={<PortfolioPage />} />
        <Route path="/portfolio/baru"     element={<PortfolioFormPage />} />
        <Route path="/portfolio/:id/edit" element={<PortfolioFormPage />} />

        {/* News */}
        <Route path="/berita"             element={<NewsPage />} />
        <Route path="/berita/baru"        element={<NewsFormPage />} />
        <Route path="/berita/:id/edit"    element={<NewsFormPage />} />

        {/* ── RUTE BARU: Banner ────────────────────────────── */}
        <Route path="/banner"             element={<BannerPage />} />
        {/* ─────────────────────────────────────────────────── */}

        {/* Others */}
        <Route path="/testimoni"          element={<TestimonialsPage />} />
        <Route path="/rfq"                element={<RFQPage />} />
        <Route path="/pesan"              element={<ContactPage />} />

        {/* ── RUTE BARU: Settings (Web Profile) ─────────────── */}
        <Route path="/settings"           element={<SettingsPage />} />
        {/* ─────────────────────────────────────────────────── */}

        {/* 404 inside admin */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}