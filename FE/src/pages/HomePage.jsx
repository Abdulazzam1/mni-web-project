import SEOMeta from '@/components/common/SEOMeta';
// ─── IMPORT BARU: Banner Bumper Promo ───────────────────────
import BannerSlider from '@/components/home/BannerSlider';
// ────────────────────────────────────────────────────────────
import HeroSection from '@/components/home/HeroSection';
import ServicesSummary from '@/components/home/ServicesSummary';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTABanner from '@/components/home/CTABanner';

export default function HomePage() {
  return (
    <>
      <SEOMeta
        title="Beranda"
        description="PT. Mitra Niaga Indonesia - Principal Distributor Masagi, penyedia solusi VAC, AC, Genset, dan Maintenance untuk gedung komersial & industri."
      />
      
      {/* ─── KOMPONEN BARU: Menampilkan Banner Dinamis dari CMS ─── */}
      <BannerSlider />
      {/* ────────────────────────────────────────────────────────── */}
      
      <HeroSection />
      <ServicesSummary />
      <FeaturedProducts />
      <TestimonialsSection />
      <CTABanner />
    </>
  );
}