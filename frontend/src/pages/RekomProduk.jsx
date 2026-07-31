import { useMemo } from 'react';
import { useProduct } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

export default function RekomProduk() {
  const { products, loading, error } = useProduct();

  const recommended = useMemo(() => {
    return products.filter((product) => product.status === 'active').slice(0, 6);
  }, [products]);

  return (
    <main>
      <div className="page-header">
        <div className="container">
          <span className="api-badge">Rekomendasi Kopi</span>
          <h1>Menu <span>Terbaik</span></h1>
          <p>Nikmati pilihan kopi dan minuman unggulan yang paling banyak direkomendasikan pelanggan Kopi Kombo.</p>
        </div>
      </div>

      <section>
        <div className="container">
          {loading ? (
            <Loading text="Memuat rekomendasi kopi terbaik..." />
          ) : error ? (
            <div className="error-state animate-fade-up">
              <i className="fas fa-exclamation-triangle" />
              <h3>Gagal Memuat Rekomendasi</h3>
              <p>{error}</p>
            </div>
          ) : recommended.length === 0 ? (
            <EmptyState
              icon="fas fa-mug-hot"
              title="Rekomendasi Belum Tersedia"
              message="Silakan kembali nanti atau lihat seluruh menu Kopi Kombo di halaman Menu."
              buttonText="Lihat Menu"
              buttonLink="/menu"
            />
          ) : (
            <div className="products-grid animate-fade-up">
              {recommended.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
