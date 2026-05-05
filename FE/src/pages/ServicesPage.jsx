// FE/src/pages/ServicesPage.jsx
// REVISI TAHAP 2: Tampilkan gambar pertama (images[0]) dari JSONB column
// menggunakan imgUrl() sebagai thumbnail di atas setiap card layanan.

import { Link } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import { getServices } from '@/services/serviceService';
import { imgUrl } from '@/utils/formatters';          // ← digunakan untuk thumbnail
import SEOMeta from '@/components/common/SEOMeta';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import styles from './ServicesPage.module.css';

export default function ServicesPage() {
  const { data: services, loading } = useFetch(getServices);

  return (
    <>
      <SEOMeta
        title="Layanan"
        description="Layanan MNI: Preventive Maintenance AC, Perbaikan, Instalasi, dan Maintenance Genset."
      />

      <div className={styles.hero}>
        <div className="container">
          <span className={styles.overline}>Layanan Kami</span>
          <h1>Jasa Teknis Profesional</h1>
          <p>Dari maintenance preventif hingga perbaikan darurat, kami hadir untuk Anda.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="spinner" />
          ) : (
            <div className={styles.grid}>
              {(services || []).map((svc) => (
                <div key={svc.id} className={styles.card}>

                  {/* REVISI TAHAP 2: thumbnail gambar pertama dari JSONB images */}
                  {svc.images?.[0] && (
                    <div className={styles.cardThumb}>
                      <img
                        src={imgUrl(svc.images[0])}
                        alt={svc.name}
                        loading="lazy"
                        onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                      />
                    </div>
                  )}

                  <div className={styles.cardHeader}>
                    <h3>{svc.name}</h3>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.desc}>{svc.description}</p>
                    {svc.scope && (
                      <div className={styles.scope}>
                        <h4>Ruang Lingkup</h4>
                        <p>{svc.scope}</p>
                      </div>
                    )}
                  </div>
                  <div className={styles.cardFooter}>
                    <Link to="/kontak" className="btn btn-primary">
                      Jadwalkan Konsultasi
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <TestimonialsSection />
    </>
  );
}