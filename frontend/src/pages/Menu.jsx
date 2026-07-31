import { useState, useEffect } from 'react';
import { useProduct } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';

export default function Menu() {
  const { products, loading, error, fetchProducts } = useProduct();
  const [activeTab, setActiveTab] = useState('coffee'); // 'coffee', 'non-coffee', 'all'
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [toast, setToast] = useState(null);

  // Fetch all products
  useEffect(() => {
    fetchProducts({
      search,
      sort
    });
  }, [search, sort, fetchProducts]);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  // Filter produk berdasarkan tab yang dipilih
  const coffeeProducts = products.filter(p =>
    p.category_id === 1 ||
    (p.category_name?.toLowerCase().includes('kopi') && !p.category_name?.toLowerCase().includes('non'))
  );

  const nonCoffeeProducts = products.filter(p =>
    p.category_id === 2 ||
    p.category_name?.toLowerCase().includes('non')
  );

  let displayedProducts = products;
  if (activeTab === 'coffee') {
    displayedProducts = coffeeProducts;
  } else if (activeTab === 'non-coffee') {
    displayedProducts = nonCoffeeProducts;
  }

  return (
    <main>
      <div className="page-header">
        <div className="container">
          <span className="api-badge">Menu Utama</span>
          <h1>Kopi Kombo <span>Menu</span></h1>
          <p>Pilih kategori menu kopi favoritmu atau minuman segar non-kopi di bawah ini.</p>
        </div>
      </div>

      <section style={{ paddingTop: '40px' }}>
        <div className="container">

          {/* TAB UTAMA: Pemisah Menu Coffee vs Non-Coffee */}
          <div className="reservation-tabs-wrapper" style={{ marginBottom: '2rem' }}>
            <button
              className={`reservation-tab-btn${activeTab === 'coffee' ? ' active' : ''}`}
              onClick={() => setActiveTab('coffee')}
            >
              <i className="fas fa-coffee" /> ☕ Menu Coffee ({coffeeProducts.length})
            </button>
            <button
              className={`reservation-tab-btn${activeTab === 'non-coffee' ? ' active' : ''}`}
              onClick={() => setActiveTab('non-coffee')}
            >
              <i className="fas fa-glass-cheers" /> 🍹 Menu Non-Coffee ({nonCoffeeProducts.length})
            </button>
            <button
              className={`reservation-tab-btn${activeTab === 'all' ? ' active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <i className="fas fa-th-large" /> 🌟 Semua Menu ({products.length})
            </button>
          </div>

          {/* Controls: Search & Filter */}
          <div className="search-filter-bar">
            <SearchBar value={search} onChange={setSearch} placeholder={`Cari di ${activeTab === 'coffee' ? 'menu kopi' : activeTab === 'non-coffee' ? 'menu non-kopi' : 'semua menu'}...`} />
            <FilterBar sortValue={sort} onSortChange={setSort} />
          </div>

          {/* Section Header sesuai Tab Aktif */}
          <div className="menu-section-header" style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
            <div className={`menu-section-icon-badge${activeTab === 'non-coffee' ? ' non-coffee' : ''}`}>
              <i className={`fas ${activeTab === 'coffee' ? 'fa-coffee' : activeTab === 'non-coffee' ? 'fa-glass-martini-alt' : 'fa-mug-hot'}`} />
            </div>
            <div>
              <h2>
                {activeTab === 'coffee' && <>Menu <span>Coffee (Kopi)</span></>}
                {activeTab === 'non-coffee' && <>Menu <span>Non-Coffee</span></>}
                {activeTab === 'all' && <>Seluruh <span>Daftar Menu</span></>}
              </h2>
              <p>
                {activeTab === 'coffee' && 'Koleksi varian kopi espresso premium, gula aren, dan signature kopi Kopi Kombo.'}
                {activeTab === 'non-coffee' && 'Pilihan minuman cokelat, matcha latte, dan varian segar bebas kafein.'}
                {activeTab === 'all' && 'Seluruh pilihan minuman coffee & non-coffee terbaik untuk nemenin nongkrongmu.'}
              </p>
            </div>
          </div>

          {loading ? (
            <Loading text="Sedang mengambil daftar menu..." />
          ) : error ? (
            <div className="error-state animate-fade-up">
              <i className="fas fa-exclamation-triangle" />
              <h3>Terjadi Gangguan</h3>
              <p>{error}</p>
            </div>
          ) : displayedProducts.length === 0 ? (
            <EmptyState
              icon={activeTab === 'coffee' ? 'fas fa-coffee' : 'fas fa-glass-martini-alt'}
              title={`Tidak Ada ${activeTab === 'coffee' ? 'Menu Kopi' : activeTab === 'non-coffee' ? 'Menu Non-Kopi' : 'Menu'}`}
              message="Coba cari dengan kata kunci lain atau pilih tab kategori menu yang berbeda."
            />
          ) : (
            <div className="products-grid animate-fade-up">
              {displayedProducts.map((product) => (
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
