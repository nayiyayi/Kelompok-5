import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, total, loading, updateQty, removeItem } = useCart();
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const formattedTotal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(total);

  return (
    <main>
      <div className="page-header">
        <div className="container">
          <span className="api-badge">Konfirmasi Pesanan</span>
          <h1>Keranjang <span>Belanja</span></h1>
          <p>Tinjau pesanan kopi premium milikmu sebelum lanjut ke proses pembayaran.</p>
        </div>
      </div>

      <section>
        <div className="container" style={{ maxWidth: '900px' }}>
          {loading && cart.length === 0 ? (
            <Loading text="Menyiapkan keranjang belanja..." />
          ) : cart.length === 0 ? (
            <EmptyState
              icon="fas fa-shopping-basket"
              title="Keranjang Kosong"
              message="Sepertinya kamu belum memilih kopi apa pun. Yuk, pesan kopi pertamamu!"
              buttonText="Lihat Pilihan Kopi"
              buttonLink="/menu"
            />
          ) : (
            <div className="animate-fade-up">
              <div style={{ marginBottom: '2rem' }}>
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQty={updateQty}
                    onRemove={removeItem}
                    onToast={showToast}
                  />
                ))}
              </div>

              <div className="cart-summary">
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>{formattedTotal}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Pajak & Layanan</span>
                  <span>Free</span>
                </div>
                <div className="cart-summary-total">
                  <span>Total Bayar</span>
                  <span>{formattedTotal}</span>
                </div>
                
                <div style={{ marginTop: '2rem' }}>
                  <Link to="/checkout" className="btn btn-primary btn-full btn-lg">
                    Lanjut Ke Checkout <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }} />
                  </Link>
                </div>
              </div>
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
