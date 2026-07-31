import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder } from '../services/orderService';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';

export default function Checkout() {
  const { cart, total, clearAll } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    note: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user?.name) {
      setFormData(prev => ({ ...prev, name: user.name }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nama lengkap wajib diisi';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor HP wajib diisi';
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = 'Nomor HP hanya berupa angka';
    }
    if (!formData.address.trim()) newErrors.address = 'Alamat pengiriman wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    try {
      setLoading(true);

      const orderData = {
        ...formData,
        items: cart.map(item => ({
          product_id: item.product_id,
          qty: item.qty
        }))
      };

      const res = await createOrder(orderData);

      await clearAll();
      setToast({ message: res.data.message || 'Checkout Berhasil! Mengalihkan ke riwayat pesanan...', type: 'success' });

      // Pindah langsung ke halaman Riwayat Pesanan
      setTimeout(() => {
        navigate('/orders');
      }, 1500);
    } catch (err) {
      setToast({ message: err.message || 'Terjadi kesalahan saat memproses checkout', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main>
        <div className="page-header">
          <div className="container">
            <span className="api-badge">Proses Pengiriman</span>
            <h1>Checkout <span>Pesanan</span></h1>
            <p>Lengkapi formulir alamat pengiriman untuk memproses pengantaran kopi premium milikmu.</p>
          </div>
        </div>
        <section>
          <div className="container">
            <EmptyState
              icon="fas fa-receipt"
              title="Keranjang Kosong"
              message="Belum ada kopi di keranjangmu untuk dicheckout."
              buttonText="Pilih Kopi Sekarang"
              buttonLink="/menu-coffee"
            />
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link to="/orders" className="btn btn-outline">
                <i className="fas fa-history" /> Lihat Riwayat Pesanan Saya
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const formattedTotal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(total);

  return (
    <main>
      <div className="page-header">
        <div className="container">
          <span className="api-badge">Proses Pengiriman</span>
          <h1>Checkout <span>Pesanan</span></h1>
          <p>Lengkapi formulir alamat pengiriman untuk memproses pengantaran kopi premium milikmu.</p>
        </div>
      </div>

      <section>
        <div className="container">

          {/* Navigation Bar to Riwayat Pesanan */}
          <div className="reservation-tabs-wrapper" style={{ marginBottom: '2.5rem' }}>
            <span className="reservation-tab-btn active">
              <i className="fas fa-shipping-fast" /> Form Checkout & Pengiriman
            </span>
            <Link to="/orders" className="reservation-tab-btn">
              <i className="fas fa-history" /> Lihat Riwayat Pesanan Saya
            </Link>
          </div>

          <div className="checkout-grid animate-fade-up">

            {/* Form Box */}
            <div className="form-box" style={{ maxWidth: '100%', margin: '0' }}>
              <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '10px' }}>
                Data Pengiriman
              </h3>
              <form onSubmit={handleOpenConfirm}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Nama Penerima</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`form-control${errors.name ? ' error' : ''}`}
                    placeholder="Nama lengkap Anda"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <span className="error-msg">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Nomor WhatsApp/HP</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={`form-control${errors.phone ? ' error' : ''}`}
                    placeholder="Contoh: 081234567890"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && <span className="error-msg">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="address" className="form-label">Alamat Lengkap</label>
                  <textarea
                    id="address"
                    name="address"
                    rows="4"
                    className={`form-control${errors.address ? ' error' : ''}`}
                    placeholder="Nama jalan, nomor rumah, RT/RW, kecamatan, kota"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  {errors.address && <span className="error-msg">{errors.address}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="note" className="form-label">Catatan Tambahan (Opsional)</label>
                  <textarea
                    id="note"
                    name="note"
                    rows="2"
                    className="form-control"
                    placeholder="Contoh: kopi lebih manis, less ice, dll"
                    value={formData.note}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full btn-lg"
                  disabled={loading}
                  style={{ marginTop: '1.5rem' }}
                >
                  Selesaikan Pembayaran
                </button>
              </form>
            </div>

            {/* Order Summary Box */}
            <div className="cart-summary" style={{ marginTop: '0' }}>
              <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '10px' }}>
                Ringkasan Belanja
              </h3>
              <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem' }}>
                {cart.map((item) => (
                  <div key={item.id} className="order-summary-item">
                    <div>
                      <span style={{ fontWeight: '600' }}>{item.name}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>
                        Qty: {item.qty} &times; {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price)}
                      </span>
                    </div>
                    <span style={{ fontWeight: '600' }}>
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>{formattedTotal}</span>
              </div>
              <div className="cart-summary-row">
                <span>Ongkos Kirim</span>
                <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Gratis</span>
              </div>
              <div className="cart-summary-total">
                <span>Total</span>
                <span>{formattedTotal}</span>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <Link to="/cart" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <i className="fas fa-chevron-left" /> Kembali ke Keranjang
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="app-modal-overlay">
          <div className="app-modal animate-fade-up">
            <div className="app-modal-header">
              <h3><i className="fas fa-receipt" /> Konfirmasi Transaksi Belanja</h3>
              <button className="modal-close-btn" onClick={() => setShowConfirmModal(false)}>&times;</button>
            </div>
            <div className="app-modal-body">
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.2rem', fontSize: '0.9rem' }}>
                Silakan tinjau rincian pesanan dan alamat pengiriman Anda sebelum menyelesaikan pesanan.
              </p>
              <div className="confirm-summary-list">
                <div className="confirm-summary-item">
                  <span className="confirm-label">Nama Penerima</span>
                  <span className="confirm-val">{formData.name}</span>
                </div>
                <div className="confirm-summary-item">
                  <span className="confirm-label">No. WhatsApp/HP</span>
                  <span className="confirm-val">{formData.phone}</span>
                </div>
                <div className="confirm-summary-item">
                  <span className="confirm-label">Alamat Pengiriman</span>
                  <span className="confirm-val">{formData.address}</span>
                </div>
                {formData.note && (
                  <div className="confirm-summary-item">
                    <span className="confirm-label">Catatan Pesanan</span>
                    <span className="confirm-val">{formData.note}</span>
                  </div>
                )}
                <div className="confirm-summary-item" style={{ borderTop: '1px solid var(--card-border)', paddingTop: '0.8rem', marginTop: '0.8rem' }}>
                  <span className="confirm-label">Total Item ({cart.length} Produk)</span>
                  <span className="confirm-val" style={{ color: 'var(--primary)', fontWeight: 700 }}>{formattedTotal}</span>
                </div>
              </div>
            </div>
            <div className="app-modal-footer">
              <button className="btn btn-outline" onClick={() => setShowConfirmModal(false)}>Ubah Data</button>
              <button className="btn btn-primary" onClick={handleConfirmSubmit}>Ya, Bayar & Kirim Pesanan</button>
            </div>
          </div>
        </div>
      )}

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
