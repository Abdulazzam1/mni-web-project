// FE/src/pages/HomePage.jsx
// REVISI TAHAP 6: Tambah section "Informasi Terbaru" tepat di bawah
// FeaturedProducts. Hanya menampilkan artikel dengan show_on_home = true.

import { Link } from 'react-router-dom';
import SEOMeta             from '@/components/common/SEOMeta';
import BannerSlider        from '@/components/home/BannerSlider';
import HeroSection         from '@/components/home/HeroSection';
import ServicesSummary     from '@/components/home/ServicesSummary';
import FeaturedProducts    from '@/components/home/FeaturedProducts';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTABanner           from '@/components/home/CTABanner';
import useFetch            from '@/hooks/useFetch';
import { getHomeNews }     from '@/services/newsService';    // TAHAP 6
import { formatDate, imgUrl, truncate } from '@/utils/formatters';

export default function HomePage() {
  // TAHAP 6: artikel yang admin tandai "Tampilkan di Beranda"
  const { data: newsData } = useFetch(getHomeNews);
  const homeNews = newsData?.items || [];

  return (
    <>
      <SEOMeta
        title="Beranda"
        description="PT. Mitra Niaga Indonesia - Principal Distributor Masagi, penyedia solusi VAC, AC, Genset, dan Maintenance untuk gedung komersial & industri."
      />

      <BannerSlider />
      <HeroSection />
      <ServicesSummary />
      <FeaturedProducts />

      {/* ── TAHAP 6: Informasi Terbaru (tepat di bawah Produk Unggulan) ── */}
      {homeNews.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="overline">Info &amp; Aktivitas</span>
              <h2>Informasi Terbaru</h2>
              <p>Berita, aktivitas, dan program terbaru dari PT. Mitra Niaga Indonesia.</p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {homeNews.map((n) => (
                <Link
                  key={n.id}
                  to={`/informasi/${n.slug}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    background: 'var(--clr-white)',
                    border: '1px solid var(--clr-border)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  {/* Cover Image */}
                  <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: 'var(--clr-surface)' }}>
                    <img
                      src={imgUrl(n.cover_image)}
                      alt={n.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onError={(e) => {
                        e.target.src = `https://placehold.co/600x338/0F2040/E8A020?text=${n.category.toUpperCase()}`;
                      }}
                    />
                  </div>

                  {/* Body */}
                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span
                      style={{
                        fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.08em', color: 'var(--clr-amber)',
                      }}
                    >
                      {n.category}
                    </span>
                    <h3
                      style={{
                        fontSize: '0.95rem', fontWeight: 700,
                        color: 'var(--clr-navy)', lineHeight: 1.4,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}
                    >
                      {n.title}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--clr-text-lt)', lineHeight: 1.6, flex: 1 }}>
                      {truncate(n.excerpt, 90)}
                    </p>
                    <time style={{ fontSize: '0.72rem', color: 'var(--clr-muted)', marginTop: '0.5rem' }}>
                      {formatDate(n.published_at)}
                    </time>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link to="/informasi" className="btn btn-outline">
                Lihat Semua Informasi
              </Link>
            </div>
          </div>
        </section>
      )}
      {/* ──────────────────────────────────────────────────────────── */}

      <TestimonialsSection />
      <CTABanner />
    </>
  );
}