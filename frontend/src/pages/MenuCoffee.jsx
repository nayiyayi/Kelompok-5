import { useState, useEffect } from 'react';
import { useProduct } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';

export default function MenuCoffee() {
  const { products, loading, error, fetchProducts } = useProduct();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [toast, setToast] = useState(null);

  // Fetch only Coffee category (category_id = 1)
  useEffect(() => {
    fetchProducts({
      category_id: '1',
      search,
      sort
    });
  }, [search, sort, fetchProducts]);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  return (
    <main className="menu-coffee-page">
      {/* Premium Coffee Header */}
      <div className="coffee-page-header">
        <div className="coffee-header-overlay" />
        <div className="container coffee-header-content">
          <span className="coffee-badge-premium"><i className="fas fa-award" /> Premium Blend Selection</span>
          <h1>Kopi Kombo <span>Coffee Menu</span></h1>
          <p>Rasakan kelezatan es kopi susu kekinian, racikan espresso espresso premium, dan racikan kopi berkualitas dengan biji arabika terbaik Yogyakarta.</p>
        </div>
      </div>

      <section className="coffee-menu-section">
        <div className="container">
          
          {/* Glassmorphic Control Bar */}
          <div className="menu-controls-glass">
            <SearchBar 
              value={search} 
              onChange={setSearch} 
              placeholder="Cari kopi favoritmu (cth: Aren, Espresso)..." 
            />
            <FilterBar 
              sortValue={sort} 
              onSortChange={setSort} 
            />
          </div>

          {loading ? (
            <Loading text="Sedang menyeduh daftar kopi terbaik..." />
          ) : error ? (
            <div className="error-state animate-fade-up">
              <i className="fas fa-exclamation-triangle" />
              <h3>Terjadi Gangguan</h3>
              <p>{error}</p>
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon="fas fa-coffee"
              title="Menu Kopi Tidak Ditemukan"
              message="Coba cari dengan kata kunci lain."
            />
          ) : (
            <div className="products-grid coffee-grid animate-fade-up">
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
