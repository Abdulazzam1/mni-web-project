import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, User } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { getNewsBySlug } from '@/services/newsService';
import SEOMeta from '@/components/common/SEOMeta';
import { formatDate, imgUrl } from '@/utils/formatters';
import styles from './NewsDetailPage.module.css';

export default function NewsDetailPage() {
  const { slug } = useParams();
  const { data: news, loading, error } = useFetch(() => getNewsBySlug(slug), [slug]);

  if (loading) return <div className="spinner" style={{ marginTop: '10rem' }} />;
  if (error || !news) {
    return (
      <div className={styles.notFound}>
        <h2>Berita tidak ditemukan.</h2>
        <Link to="/informasi" className="btn btn-outline">← Kembali</Link>
      </div>
    );
  }

  return (
    <>
      <SEOMeta title={news.title} description={news.excerpt} image={imgUrl(news.cover_image)} />

      <div className={styles.breadcrumb}>
        <div className="container">
          <Link to="/informasi"><ArrowLeft size={14} /> Kembali ke Informasi</Link>
        </div>
      </div>

      <article className={`section ${styles.article}`}>
        <div className="container">
          <div className={styles.inner}>
            <div className={styles.meta}>
              <span className="badge">{news.category}</span>
              <div className={styles.metaInfo}>
                <span><CalendarDays size={14} /> {formatDate(news.published_at)}</span>
                <span><User size={14} /> {news.author}</span>
              </div>
            </div>

            <h1 className={styles.title}>{news.title}</h1>

            {news.cover_image && (
              <div className={styles.cover}>
                <img src={imgUrl(news.cover_image)} alt={news.title} />
              </div>
            )}

            <div className={styles.content}>
              {news.content?.split('\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}