import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { getProductBySlug } from '@/services/productService';
import SEOMeta from '@/components/common/SEOMeta';
import RFQForm from '@/components/contact/RFQForm';
import { imgUrl } from '@/utils/formatters';
import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { data: product, loading, error } = useFetch(() => getProductBySlug(slug), [slug]);

  if (loading) return <div className="spinner" style={{ marginTop: '10rem' }} />;
  if (error || !product) {
    return (
      <div className={styles.notFound}>
        <h2>Produk tidak ditemukan.</h2>
        <Link to="/produk" className="btn btn-outline">← Kembali ke Produk</Link>
      </div>
    );
  }

  const specs = product.specs || {};

  return (
    <>
      <SEOMeta title={product.name} description={product.description} />

      <div className={styles.breadcrumb}>
        <div className="container">
          <Link to="/produk"><ArrowLeft size={14} /> Kembali ke Produk</Link>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {/* Left - Image */}
            <div className={styles.imgCol}>
              <div className={styles.mainImg}>
                <img
                  src={imgUrl(product.images?.[0])}
                  alt={product.name}
                  onError={(e) => { e.target.src = 'https://placehold.co/600x450/EEE/999?text=No+Image'; }}
                />
              </div>
            </div>

            {/* Right - Info */}
            <div className={styles.infoCol}>
              {product.brand && <span className={styles.brand}>{product.brand}</span>}
              <h1>{product.name}</h1>
              <p className={styles.desc}>{product.description}</p>

              {Object.keys(specs).length > 0 && (
                <div className={styles.specs}>
                  <h3>Spesifikasi Teknis</h3>
                  <table>
                    <tbody>
                      {Object.entries(specs).map(([k, v]) => (
                        <tr key={k}>
                          <th>{k.replace(/_/g, ' ')}</th>
                          <td>{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className={styles.actions}>
                <Link to="/kontak" className="btn btn-primary btn-lg">
                  Request Penawaran
                </Link>
                <a
                  href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '6281234567890'}?text=Halo, saya tertarik dengan produk ${product.name}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                >
                  Tanya via WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* RFQ Form */}
          <div className={styles.rfq}>
            <RFQForm />
          </div>
        </div>
      </section>
    </>
  );
}