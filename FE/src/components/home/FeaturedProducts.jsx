import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { getProducts } from '@/services/productService';
import ProductCard from '@/components/products/ProductCard';
import styles from './FeaturedProducts.module.css';

export default function FeaturedProducts() {
  const { data, loading } = useFetch(() => getProducts({ featured: true, limit: 4 }));

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="overline">Produk Unggulan</span>
          <h2>Distributor Resmi Produk Berkualitas</h2>
          <p>Kami menyediakan produk Masagi dan berbagai merek terpercaya dengan garansi resmi.</p>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : (
          <div className={styles.grid}>
            {data?.items?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className={styles.cta}>
          <Link to="/produk" className="btn btn-primary">
            Lihat Semua Produk <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}