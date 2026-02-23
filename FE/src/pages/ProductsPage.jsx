import { useState, useCallback } from 'react';
import useFetch from '@/hooks/useFetch';
import { getProducts } from '@/services/productService';
import SEOMeta from '@/components/common/SEOMeta';
import ProductCard from '@/components/products/ProductCard';
import ProductFilter from '@/components/products/ProductFilter';
import styles from './ProductsPage.module.css';

export default function ProductsPage() {
  const [category, setCategory] = useState('all');

  const fetchFn = useCallback(
    () => getProducts({ category: category === 'all' ? undefined : category, limit: 24 }),
    [category]
  );

  const { data, loading } = useFetch(fetchFn, [category]);

  return (
    <>
      <SEOMeta title="Produk" description="Katalog produk MNI: AC, Genset, Lampu LED, Elektrikal dari merek terpercaya." />

      <div className={styles.hero}>
        <div className="container">
          <span className={styles.overline}>Katalog Produk</span>
          <h1>Produk Berkualitas Tinggi</h1>
          <p>Distributor resmi Masagi dan berbagai merek terpercaya dengan garansi resmi.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <ProductFilter active={category} onChange={setCategory} />

          {loading ? (
            <div className="spinner" />
          ) : (
            <>
              {data?.items?.length === 0 ? (
                <p className={styles.empty}>Tidak ada produk untuk kategori ini.</p>
              ) : (
                <div className={styles.grid}>
                  {data?.items?.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}