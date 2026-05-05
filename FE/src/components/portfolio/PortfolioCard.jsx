// FE/src/components/portfolio/PortfolioCard.jsx
// REVISI TAHAP 4: Bungkus card dengan <Link to="/portfolio/:slug">

import { Link } from 'react-router-dom';
import { MapPin, CalendarDays, ArrowRight } from 'lucide-react';
import { imgUrl } from '@/utils/formatters';
import styles from './PortfolioCard.module.css';

export default function PortfolioCard({ portfolio }) {
  return (
    <Link
      to={`/portfolio/${portfolio.slug}`}
      className={styles.cardLink}
      aria-label={`Lihat detail proyek: ${portfolio.title}`}
    >
      <article className={styles.card}>
        <div className={styles.imgWrap}>
          <img
            src={imgUrl(portfolio.images?.[0])}
            alt={portfolio.title}
            loading="lazy"
            onError={(e) => { e.target.src = '/placeholder.jpg'; }}
          />
          <div className={styles.overlay}>
            <h3>{portfolio.title}</h3>
            <p>{portfolio.scope}</p>
          </div>
        </div>
        <div className={styles.meta}>
          {portfolio.client_name && (
            <span className={styles.client}>{portfolio.client_name}</span>
          )}
          <div className={styles.info}>
            {portfolio.location && (
              <span><MapPin size={13} /> {portfolio.location}</span>
            )}
            {portfolio.year && (
              <span><CalendarDays size={13} /> {portfolio.year}</span>
            )}
          </div>
          <span className={styles.cta}>
            Lihat Detail <ArrowRight size={13} />
          </span>
        </div>
      </article>
    </Link>
  );
}