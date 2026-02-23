import { MapPin, CalendarDays } from 'lucide-react';
import { imgUrl } from '@/utils/formatters';
import styles from './PortfolioCard.module.css';

export default function PortfolioCard({ portfolio }) {
  return (
    <div className={styles.card}>
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
        {portfolio.client_name && <span className={styles.client}>{portfolio.client_name}</span>}
        <div className={styles.info}>
          {portfolio.location && (
            <span><MapPin size={13} /> {portfolio.location}</span>
          )}
          {portfolio.year && (
            <span><CalendarDays size={13} /> {portfolio.year}</span>
          )}
        </div>
      </div>
    </div>
  );
}