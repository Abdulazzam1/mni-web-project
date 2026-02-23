import { PRODUCT_CATEGORIES } from '@/utils/constants';
import styles from './ProductFilter.module.css';

export default function ProductFilter({ active, onChange }) {
  return (
    <div className={styles.filter}>
      {PRODUCT_CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          className={`${styles.btn} ${active === cat.value ? styles.active : ''}`}
          onClick={() => onChange(cat.value)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}