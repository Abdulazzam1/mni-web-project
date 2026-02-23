import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import styles from './CTABanner.module.css';

export default function CTABanner() {
  return (
    <section className={styles.banner}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.text}>
            <h2>Siap Berdiskusi Kebutuhan Proyek Anda?</h2>
            <p>Tim sales kami siap memberikan penawaran terbaik, gratis konsultasi teknis.</p>
          </div>
          <div className={styles.actions}>
            <Link to="/kontak" className="btn btn-primary btn-lg">
              Request Penawaran <ArrowRight size={18} />
            </Link>
            <Link to="/portfolio" className="btn btn-outline-light">
              Lihat Portfolio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}