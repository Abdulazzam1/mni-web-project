import styles from './ProductFilter.module.css';

export default function ProductFilter({ 
  categories = [], 
  active, 
  onChange, 
  searchValue = '', 
  onSearchChange 
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
      
      {/* ─── FIX REVISI 1: Kolom Pencarian (Search Bar) ─────────── */}
      <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto', width: '100%' }}>
        <input
          type="text"
          placeholder="Cari nama produk, merek, atau kategori..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.8rem 1rem 0.8rem 2.5rem',
            borderRadius: '50px',
            border: '1px solid var(--clr-navy-200)',
            backgroundColor: 'var(--clr-surface)',
            color: 'var(--clr-obsidian-800)',
            fontSize: '0.95rem',
            outline: 'none',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            transition: 'border-color 0.2s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--clr-amber)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--clr-navy-200)'}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ 
            position: 'absolute', 
            left: '1rem', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'var(--clr-obsidian-400)',
            pointerEvents: 'none'
          }}
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      {/* ────────────────────────────────────────────────────────── */}

      {/* ─── FIX TAHAP 4: Tombol Kategori Dinamis ───────────────── */}
      <div className={styles.filter}>
        {/* Tombol Default untuk menampilkan semua produk */}
        <button
          className={`${styles.btn} ${!active ? styles.active : ''}`}
          onClick={() => onChange('')}
        >
          Semua Produk
        </button>

        {/* Pemetaan kategori dinamis dari database */}
        {categories.map((cat) => (
          <button
            key={cat.id || cat.slug}
            className={`${styles.btn} ${active === cat.slug ? styles.active : ''}`}
            onClick={() => onChange(cat.slug)}
          >
            {cat.name}
          </button>
        ))}
      </div>
      {/* ────────────────────────────────────────────────────────── */}
      
    </div>
  );
}