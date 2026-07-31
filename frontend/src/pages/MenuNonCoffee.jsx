import { useState, useEffect } from 'react';
import { useProduct } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';

export default function MenuNonCoffee() {
  const { products, loading, error, fetchProducts } = useProduct();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [toast, setToast] = useState(null);

  // Fetch only Non-Coffee category (category_id = 2)
  useEffect(() => {
    fetchProducts({
      category_id: '2',
      search,
      sort
    });
  }, [search, sort, fetchProducts]);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  return (
    <main className="menu-noncoffee-page">
      {/* Premium Non-Coffee Header */}
      <div className="noncoffee-page-header">
        <div className="noncoffee-header-overlay" />
        <div className="container noncoffee-header-content">
          <span className="noncoffee-badge-premium"><i className="fas fa-glass-cheers" /> Refreshing Selection</span>
          <h1>Kopi Kombo <span>Non-Coffee Menu</span></h1>
          <p>Nikmati kelezatan matcha premium, cokelat premium creamy, serta aneka minuman segar peredam dahaga terbaik tanpa kandungan kafein.</p>
        </div>
      </div>

      <section className="noncoffee-menu-section">
        <div className="container">
          
          {/* Glassmorphic Control Bar */}
          <div className="menu-controls-glass">
            <SearchBar 
              value={search} 
              onChange={setSearch} 
              placeholder="Cari minuman non-kopi favoritmu (cth: Matcha, Cokelat)..." 
            />
            <FilterBar 
              sortValue={sort} 
              onSortChange={setSort} 
            />
          </div>

          {loading ? (
            <Loading text="Sedang meracik minuman segar terbaik..." />
          ) : error ? (
            <div className="error-state animate-fade-up">
              <i className="fas fa-exclamation-triangle" />
              <h3>Terjadi Gangguan</h3>
              <p>{error}</p>
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon="fas fa-glass-martini-alt"
              title="Menu Non-Kopi Tidak Ditemukan"
              message="Coba cari dengan kata kunci lain."
            />
          ) : (
            <div className="products-grid noncoffee-grid animate-fade-up">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onToast={showToast}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {toast && (
        <div className="toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </main>
  );
}
