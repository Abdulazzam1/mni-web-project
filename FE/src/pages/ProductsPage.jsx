import { useState, useEffect, useCallback } from 'react';
import useFetch from '@/hooks/useFetch';
import { getProducts, getCategories } from '@/services/productService'; // Import getCategories
import SEOMeta from '@/components/common/SEOMeta';
import ProductCard from '@/components/products/ProductCard';
import ProductFilter from '@/components/products/ProductFilter';
import styles from './ProductsPage.module.css';

export default function ProductsPage() {
  // FIX TAHAP 4: State kategori diubah defaultnya menjadi string kosong '' (Semua Produk)
  const [category, setCategory] = useState('');
  
  // State untuk mengambil data kategori dinamis dari Backend
  const [categories, setCategories] = useState([]);

  // State untuk fitur pencarian string
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mengambil data kategori saat halaman pertama kali dimuat
  useEffect(() => {
    getCategories()
      .then((res) => {
        if (res.data && res.data.data) {
          setCategories(res.data.data);
        }
      })
      .catch((err) => console.error('Gagal memuat kategori:', err));
  }, []);

  // Fitur Debounce: Otomatis memicu pencarian 500ms setelah user berhenti mengetik
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  // Fungsi Fetch yang mendengarkan perubahan Kategori dan Search Query
  const fetchFn = useCallback(
    () => getProducts({ 
      category: category || undefined, 
      search: searchQuery || undefined, // Mengirim kata kunci ke backend
      limit: 24 
    }),
    [category, searchQuery] 
  );

  const { data, loading } = useFetch(fetchFn, [category, searchQuery]);

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
          
          {/* FIX TAHAP 4: Menampilkan Search Bar & Kategori Dinamis secara terpusat */}
          <ProductFilter 
            categories={categories}
            active={category} 
            onChange={setCategory} 
            searchValue={searchInput}
            onSearchChange={setSearchInput}
          />

          {loading ? (
            <div className="spinner" />
          ) : (
            <>
              {data?.items?.length === 0 ? (
                <p className={styles.empty}>Tidak ada produk yang sesuai dengan pencarian atau kategori ini.</p>
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