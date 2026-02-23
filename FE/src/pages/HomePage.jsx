import SEOMeta from '@/components/common/SEOMeta';
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
      <HeroSection />
      <ServicesSummary />
      <FeaturedProducts />
      <TestimonialsSection />
      <CTABanner />
    </>
  );
}