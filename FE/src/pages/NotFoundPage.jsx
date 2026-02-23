import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.wrap}>
      <span className={styles.code}>404</span>
      <h1>Halaman Tidak Ditemukan</h1>
      <p>Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
      <Link to="/" className="btn btn-primary btn-lg">
        Kembali ke Beranda
      </Link>
    </div>
  );
}