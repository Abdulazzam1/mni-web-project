import { Star } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { getTestimonials } from '@/services/testimonialService';
import styles from './TestimonialsSection.module.css';

export default function TestimonialsSection() {
  const { data: testimonials, loading } = useFetch(getTestimonials);

  if (loading) return null;

  return (
    <section className={`section section--dark ${styles.section}`}>
      <div className="container">
        <div className="section-header">
          <span className="overline">Testimoni</span>
          <h2>Yang Klien Kami Katakan</h2>
        </div>

        <div className={styles.grid}>
          {(testimonials || []).map((t) => (
            <div key={t.id} className={styles.card}>
              <div className={styles.stars}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className={styles.quote}>"{t.content}"</p>
              <div className={styles.author}>
                <div className={styles.avatar}>
                  {t.client_name.charAt(0)}
                </div>
                <div>
                  <strong>{t.client_name}</strong>
                  <span>{t.client_title}, {t.client_company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}