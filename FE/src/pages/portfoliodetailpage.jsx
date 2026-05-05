// FE/src/pages/PortfolioDetailPage.jsx  ← FILE BARU
// TAHAP 4: Halaman detail portofolio
// - Memanggil GET /api/portfolio/:slug
// - Menampilkan galeri gambar
// - Mender deskripsi HTML (dari react-quill CMS) via dangerouslySetInnerHTML

import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CalendarDays, Building2 } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { getPortfolioBySlug } from '@/services/portfolioService';
import { imgUrl } from '@/utils/formatters';
import SEOMeta from '@/components/common/SEOMeta';
import styles from './PortfolioDetailPage.module.css';

export default function PortfolioDetailPage() {
  const { slug } = useParams();

  // deps=[slug] agar refetch saat navigasi antar portfolio
  const { data, loading, error } = useFetch(() => getPortfolioBySlug(slug), [slug]);

  // Backend sendSuccess membungkus ke { success, data: {...portfolio} }
  const portfolio = data?.data ?? data;

  /* ── Loading / Error ── */
  if (loading) {
    return <div className="spinner" style={{ marginTop: '10rem' }} />;
  }

  if (error || !portfolio) {
    return (
      <div className={styles.notFound}>
        <h2>Portofolio tidak ditemukan.</h2>
        <Link to="/portfolio" className="btn btn-primary">
          <ArrowLeft size={16} /> Kembali
        </Link>
      </div>
    );
  }

  const images = Array.isArray(portfolio.images) ? portfolio.images : [];

  return (
    <>
      <SEOMeta
        title={portfolio.title}
        description={portfolio.scope || portfolio.description?.replace(/<[^>]*>/g, '').slice(0, 160) || ''}
      />

      {/* Hero */}
      <div className={styles.hero}>
        <div className="container">
          <Link to="/portfolio" className={styles.back}>
            <ArrowLeft size={16} /> Semua Portofolio
          </Link>
          <span className={styles.overline}>Portofolio Proyek</span>
          <h1>{portfolio.title}</h1>
          <div className={styles.metaRow}>
            {portfolio.client_name && (
              <span><Building2 size={14} /> {portfolio.client_name}</span>
            )}
            {portfolio.location && (
              <span><MapPin size={14} /> {portfolio.location}</span>
            )}
            {portfolio.year && (
              <span><CalendarDays size={14} /> {portfolio.year}</span>
            )}
          </div>
        </div>
      </div>

      {/* Galeri Gambar */}
      {images.length > 0 && (
        <section className="section" style={{ paddingBottom: '2rem' }}>
          <div className="container">
            <div className={styles.mainImg}>
              <img
                src={imgUrl(images[0])}
                alt={portfolio.title}
                onError={(e) => { e.target.src = '/placeholder.jpg'; }}
              />
            </div>
            {images.length > 1 && (
              <div className={styles.thumbRow}>
                {images.slice(1).map((img, i) => (
                  <div key={i} className={styles.thumb}>
                    <img
                      src={imgUrl(img)}
                      alt={`${portfolio.title} foto ${i + 2}`}
                      loading="lazy"
                      onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Detail */}
      <section className="section">
        <div className="container">
          <div className={styles.layout}>

            {/* Konten Utama */}
            <div className={styles.main}>
              {portfolio.scope && (
                <div className={styles.block}>
                  <h2>Ruang Lingkup Pekerjaan</h2>
                  <p>{portfolio.scope}</p>
                </div>
              )}

              {portfolio.description && (
                <div className={styles.block}>
                  <h2>Deskripsi Proyek</h2>
                  {/* REVISI TAHAP 4: render HTML dari react-quill CMS */}
                  <div
                    className={styles.richContent}
                    dangerouslySetInnerHTML={{ __html: portfolio.description }}
                  />
                </div>
              )}
            </div>

            {/* Sidebar Info */}
            <aside className={styles.sidebar}>
              <div className={styles.infoCard}>
                <h3>Informasi Proyek</h3>
                {[
                  { label: 'Klien',   value: portfolio.client_name },
                  { label: 'Lokasi',  value: portfolio.location },
                  { label: 'Tahun',   value: portfolio.year },
                ].filter((r) => r.value).map((row) => (
                  <div key={row.label} className={styles.infoRow}>
                    <span className={styles.infoLabel}>{row.label}</span>
                    <span className={styles.infoVal}>{row.value}</span>
                  </div>
                ))}

                <div className={styles.infoAction}>
                  <p>Tertarik proyek serupa?</p>
                  <Link to="/kontak" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Hubungi Kami
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}