import useFetch from '@/hooks/useFetch';
import { getPortfolios } from '@/services/portfolioService';
import SEOMeta from '@/components/common/SEOMeta';
import PortfolioCard from '@/components/portfolio/PortfolioCard';
import styles from './PortfolioPage.module.css';

export default function PortfolioPage() {
  const { data, loading } = useFetch(() => getPortfolios({ limit: 20 }));

  return (
    <>
      <SEOMeta title="Portfolio" description="Daftar proyek yang telah diselesaikan oleh PT. Mitra Niaga Indonesia." />

      <div className={styles.hero}>
        <div className="container">
          <span className={styles.overline}>Portofolio</span>
          <h1>Proyek yang Telah Kami Selesaikan</h1>
          <p>Ratusan proyek sukses di berbagai gedung komersial, perkantoran, dan industri.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="spinner" />
          ) : (
            <div className={styles.grid}>
              {(data?.items || []).map((p) => (
                <PortfolioCard key={p.id} portfolio={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}