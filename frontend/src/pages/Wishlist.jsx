import { useWishlist } from '../context/WishlistContext';
import WishlistItem from '../components/WishlistItem';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import { useState } from 'react';

export default function Wishlist() {
  const { wishlist, loading, removeItem } = useWishlist();
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  return (
    <main>
      <div className="page-header">
        <div className="container">
          <span className="api-badge">Menu Favorit</span>
          <h1>Daftar <span>Wishlist</span></h1>
          <p>Kumpulan produk kopi dan non-kopi pilihan terbaik yang ingin kamu pesan nanti.</p>
        </div>
      </div>

      <section>
        <div className="container">
          {loading ? (
            <Loading text="Sedang membuka daftar favoritmu..." />
          ) : wishlist.length === 0 ? (
            <EmptyState
              icon="fas fa-heart-broken"
              title="Wishlist Kosong"
              message="Belum ada produk kopi atau non-kopi yang kamu tandai sebagai favorit."
              buttonText="Cari Produk Kopi"
              buttonLink="/menu"
            />
          ) : (
            <div className="products-grid animate-fade-up">
              {wishlist.map((item) => (
                <WishlistItem
                  key={item.id}
                  item={item}
                  onRemove={removeItem}
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
