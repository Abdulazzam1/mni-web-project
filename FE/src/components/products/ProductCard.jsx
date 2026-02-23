import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';
import { imgUrl } from '@/utils/formatters';
import { PRODUCT_CATEGORIES } from '@/utils/constants';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const catLabel = PRODUCT_CATEGORIES.find((c) => c.value === product.category)?.label || product.category;

  return (
    <Link to={`/produk/${product.slug}`} className={styles.card}>
      <div className={styles.imgWrap}>
        <img
          src={imgUrl(product.images?.[0])}
          alt={product.name}
          loading="lazy"
          onError={(e) => { e.target.src = '/placeholder.jpg'; }}
        />
        {product.is_featured && <span className={styles.featured}>Unggulan</span>}
      </div>
      <div className={styles.body}>
        <span className={styles.cat}>
          <Tag size={12} /> {catLabel}
        </span>
        <h3 className={styles.name}>{product.name}</h3>
        {product.brand && <p className={styles.brand}>{product.brand}</p>}
        <p className={styles.desc}>{product.description}</p>
        <span className={styles.cta}>Lihat Detail →</span>
      </div>
    </Link>
  );
}