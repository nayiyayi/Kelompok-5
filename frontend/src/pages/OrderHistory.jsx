import { useState, useEffect, useCallback } from 'react';
import { getMyOrders, deleteMyOrder, completeMyOrder } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';

const statusColors = {
  pending: '#FFD700',
  confirmed: '#00c16a',
  processing: '#4dabf7',
  delivered: '#69db7c',
  cancelled: '#ff4d4d',
};

const statusLabels = {
  pending: '⏳ Menunggu Konfirmasi',
  confirmed: '✅ Pesanan Dikonfirmasi',
  processing: '☕ Sedang Diproses Barista',
  delivered: '🛵 Telah Diantar / Selesai',
  cancelled: '❌ Dibatalkan',
};

export default function OrderHistory() {
  const { isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      const res = await getMyOrders();
      setOrders(res.data.data || []);
    } catch (err) {
      setToast({ message: err.message || 'Gagal mengambil riwayat pesanan', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCompleteOrder = async (id) => {
    try {
      await completeMyOrder(id);
      setToast({ message: 'Terima kasih! Pesanan telah dikonfirmasi selesai.', type: 'success' });
      fetchOrders();
    } catch (err) {
      setToast({ message: err.message || 'Gagal mengubah status pesanan', type: 'error' });
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menyelesaikan dan menghapus pesanan ini dari riwayat?')) return;
    try {
      await deleteMyOrder(id);
      setToast({ message: 'Pesanan berhasil dihapus dari riwayat.', type: 'success' });
      fetchOrders();
    } catch (err) {
      setToast({ message: err.message || 'Gagal menghapus pesanan dari riwayat', type: 'error' });
    }
  };

  const formatCurrency = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (!isLoggedIn) {
    return (
      <main>
        <div className="page-header">
          <div className="container">
            <span className="api-badge">Riwayat Pembelian</span>
            <h1>Riwayat <span>Pesanan</span></h1>
            <p>Pantau status pengiriman dan riwayat pesanan kopi milikmu.</p>
          </div>
        </div>
        <section>
          <div className="container">
            <EmptyState
              icon="fas fa-lock"
              title="Perlu Login"
              message="Silakan login terlebih dahulu untuk melihat riwayat pesanan kamu."
              buttonText="Masuk ke Akun"
              buttonLink="/login"
            />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <div className="page-header">
        <div className="container">
          <span className="api-badge">Riwayat Pembelian</span>
          <h1>Riwayat <span>Pesanan</span></h1>
          <p>Pantau status pengantaran real-time dan kelola riwayat pesanan kopi milikmu.</p>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="admin-section-header" style={{ marginBottom: '2rem' }}>
            <h2>
              <i className="fas fa-shopping-bag" style={{ color: 'var(--primary)', marginRight: '8px' }} />
              Daftar Transaksi Saya ({orders.length})
            </h2>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button className="btn btn-outline btn-sm" onClick={fetchOrders} disabled={loading}>
                <i className={`fas fa-sync-alt${loading ? ' fa-spin' : ''}`} /> Refresh Status
              </button>
              <Link to="/menu-coffee" className="btn btn-primary btn-sm">
                <i className="fas fa-plus" /> Pesan Kopi Baru
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="admin-loading"><i className="fas fa-spinner fa-spin" /> Memuat riwayat pesanan...</div>
          ) : orders.length === 0 ? (
            <EmptyState
              icon="fas fa-receipt"
              title="Belum Ada Pesanan"
              message="Kamu belum memiliki transaksi pesanan aktif di Kopi Kombo."
              buttonText="Pesan Kopi Sekarang"
              buttonLink="/menu-coffee"
            />
          ) : (
            <div className="order-history-list animate-fade-up">
              {orders.map((order) => (
                <div key={order.id} className="order-history-card">
                  
                  {/* Card Header */}
                  <div className="order-card-header">
                    <div>
                      <span className="order-card-id">Order #{order.id}</span>
                      <span className="order-card-date">{formatDate(order.created_at)}</span>
                    </div>
                    <span className="admin-status-badge" style={{
                      background: (statusColors[order.status] || '#FFD700') + '22',
                      color: statusColors[order.status] || '#FFD700',
                      border: `1px solid ${(statusColors[order.status] || '#FFD700')}44`,
                      fontSize: '0.8rem',
                      padding: '0.35rem 0.8rem'
                    }}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="order-card-body">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item) => (
                        <div key={item.id} className="order-card-item">
                          <div className="order-card-item-info">
                            <i className="fas fa-coffee" style={{ color: 'var(--primary)' }} />
                            <div>
                              <span className="order-item-name">{item.name}</span>
                              <span className="order-item-qty">{item.qty} &times; {formatCurrency(item.price)}</span>
                            </div>
                          </div>
                          <span className="order-item-subtotal">{formatCurrency(item.subtotal)}</span>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Detail produk dimasukkan dalam pesanan #{order.id}</p>
                    )}
                  </div>

                  {/* Footer Info & Action Buttons */}
                  <div className="order-card-footer">
                    <div className="order-delivery-info">
                      <span><i className="fas fa-map-marker-alt" /> {order.address}</span>
                      {order.note && <small style={{ fontStyle: 'italic', display: 'block', color: 'var(--text-muted)' }}>Catatan: {order.note}</small>}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                      <div className="order-total-box">
                        <span>Total Pembayaran</span>
                        <span className="order-total-price">{formatCurrency(order.total)}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleCompleteOrder(order.id)}
                            title="Konfirmasi bahwa pesanan telah diterima"
                            style={{ borderColor: '#00c16a', color: '#00c16a' }}
                          >
                            <i className="fas fa-check-circle" /> Konfirmasi Selesai
                          </button>
                        )}
                        
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleDeleteOrder(order.id)}
                          title="Hapus / Hilangkan pesanan ini dari riwayat"
                          style={{ borderColor: 'rgba(255,77,77,0.4)', color: '#ff4d4d' }}
                        >
                          <i className="fas fa-trash-alt" /> Selesaikan & Hapus
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {toast && (
        <div className="toast-container">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
    </main>
  );
}
