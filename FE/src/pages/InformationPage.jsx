import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import { getNews } from '@/services/newsService';
import SEOMeta from '@/components/common/SEOMeta';
import { formatDate, imgUrl, truncate } from '@/utils/formatters';
import styles from './InformationPage.module.css';

const CATEGORIES = [
  { value: '', label: 'Semua' },
  { value: 'berita', label: 'Berita' },
  { value: 'aktivitas', label: 'Aktivitas' },
  { value: 'csr', label: 'CSR' },
];

export default function InformationPage() {
  const [cat, setCat] = useState('');

  const fetchFn = useCallback(
    () => getNews({ category: cat || undefined, limit: 12 }),
    [cat]
  );

  const { data, loading } = useFetch(fetchFn, [cat]);

  return (
    <>
      <SEOMeta title="Informasi" description="Berita, aktivitas, dan program CSR PT. Mitra Niaga Indonesia." />

      <div className={styles.hero}>
        <div className="container">
          <span className={styles.overline}>Informasi</span>
          <h1>Berita & Aktivitas</h1>
          <p>Update terbaru dari PT. Mitra Niaga Indonesia.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          
          {/* FITUR BARU: Wrapper untuk memberikan Hint dan Efek Gradasi */}
          <div className={styles.tabsWrapper}>
            <span className={styles.scrollHint}>Geser kategori ➔</span>
            
            <div className={styles.tabs}>
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  className={`${styles.tab} ${cat === c.value ? styles.active : ''}`}
                  onClick={() => setCat(c.value)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="spinner" />
          ) : (
            <div className={styles.grid}>
              {(data?.items || []).map((n) => (
                <Link key={n.id} to={`/informasi/${n.slug}`} className={styles.card}>
                  <div className={styles.imgWrap}>
                    <img
                      src={imgUrl(n.cover_image)}
                      alt={n.title}
                      onError={(e) => { e.target.src = `https://placehold.co/600x380/0F2040/E8A020?text=${n.category.toUpperCase()}`; }}
                    />
                    <span className={styles.catBadge}>{n.category}</span>
                  </div>
                  <div className={styles.cardBody}>
                    <time className={styles.date}>{formatDate(n.published_at)}</time>
                    <h3>{n.title}</h3>
                    <p>{truncate(n.excerpt, 110)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}