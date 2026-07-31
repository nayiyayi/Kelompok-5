import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrders, updateOrderStatus, deleteOrder } from '../services/orderService';
import { getReservations, updateReservationStatus, deleteReservation } from '../services/reservationService';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'delivered', 'cancelled'];
const RESERVATION_STATUSES = ['pending', 'confirmed', 'cancelled'];

const statusColors = {
  pending: '#FFD700',
  confirmed: '#00c16a',
  processing: '#4dabf7',
  delivered: '#69db7c',
  cancelled: '#ff4d4d',
};

const formatCurrency = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const formatDate = (d) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showToast = (message, type) => setToast({ message, type });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOrders();
      setOrders(res.data.data || []);
    } catch (e) {
      showToast('Gagal memuat order: ' + e.message, 'error');
    } finally { setLoading(false); }
  }, []);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getReservations();
      setReservations(res.data.data || []);
    } catch (e) {
      showToast('Gagal memuat reservasi: ' + e.message, 'error');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (activeSection === 'orders') fetchOrders();
    else if (activeSection === 'reservations') fetchReservations();
  }, [activeSection, fetchOrders, fetchReservations]);

  const handleOrderStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      showToast(`Status order diperbarui ke "${status}"`, 'success');
      fetchOrders();
    } catch (e) { showToast(e.message, 'error'); }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Hapus order ini?')) return;
    try {
      await deleteOrder(id);
      showToast('Order berhasil dihapus', 'success');
      fetchOrders();
    } catch (e) { showToast(e.message, 'error'); }
  };

  const handleReservationStatus = async (id, status) => {
    try {
      await updateReservationStatus(id, status);
      showToast(`Status reservasi diperbarui ke "${status}"`, 'success');
      fetchReservations();
    } catch (e) { showToast(e.message, 'error'); }
  };

  const handleDeleteReservation = async (id) => {
    if (!window.confirm('Hapus reservasi ini?')) return;
    try {
      await deleteReservation(id);
      showToast('Reservasi berhasil dihapus', 'success');
      fetchReservations();
    } catch (e) { showToast(e.message, 'error'); }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { key: 'orders', icon: 'fas fa-receipt', label: 'Kelola Order', count: orders.length },
    { key: 'reservations', icon: 'fas fa-calendar-alt', label: 'Reservasi', count: reservations.length },
    { key: 'overview', icon: 'fas fa-chart-bar', label: 'Overview', count: null },
  ];

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const pendingRes = reservations.filter(r => r.status === 'pending').length;

  return (
    <div className="admin-layout">
      {/* Overlay untuk mobile */}
      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-brand">☕ Kopi<span>Kombo</span></Link>
          <span className="admin-label">ADMIN PANEL</span>
        </div>

        <div className="admin-user-info">
          <div className="admin-avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
          <div>
            <p className="admin-user-name">{user?.name}</p>
            <p className="admin-user-role">Administrator</p>
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map(({ key, icon, label, count }) => (
            <button
              key={key}
              className={`admin-nav-item${activeSection === key ? ' active' : ''}`}
              onClick={() => { setActiveSection(key); setSidebarOpen(false); }}
            >
              <i className={icon} />
              <span>{label}</span>
              {count !== null && count > 0 && <span className="admin-nav-badge">{count}</span>}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/profile" className="admin-footer-btn">
            <i className="fas fa-user" /> Profil Saya
          </Link>
          <Link to="/" className="admin-footer-btn">
            <i className="fas fa-home" /> Ke Website
          </Link>
          <button className="admin-footer-btn admin-logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <button className="admin-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <i className="fas fa-bars" />
          </button>
          <h1 className="admin-page-title">
            {activeSection === 'orders' && 'Kelola Order'}
            {activeSection === 'reservations' && 'Kelola Reservasi'}
            {activeSection === 'overview' && 'Overview Dashboard'}
          </h1>
          <div className="admin-topbar-right">
            <span className="admin-badge-alert">
              {pendingOrders + pendingRes > 0 && (
                <><i className="fas fa-bell" /> {pendingOrders + pendingRes} Pending</>
              )}
            </span>
          </div>
        </header>

        {/* Section: Overview */}
        {activeSection === 'overview' && (
          <div className="admin-content animate-fade-up">
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: 'rgba(255,77,77,0.15)' }}>
                  <i className="fas fa-receipt" style={{ color: 'var(--primary)' }} />
                </div>
                <div className="admin-stat-info">
                  <span className="admin-stat-num">{orders.length || '—'}</span>
                  <span className="admin-stat-label">Total Order</span>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: 'rgba(0,193,106,0.15)' }}>
                  <i className="fas fa-calendar-check" style={{ color: '#00c16a' }} />
                </div>
                <div className="admin-stat-info">
                  <span className="admin-stat-num">{reservations.length || '—'}</span>
                  <span className="admin-stat-label">Total Reservasi</span>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: 'rgba(255,215,0,0.15)' }}>
                  <i className="fas fa-clock" style={{ color: '#FFD700' }} />
                </div>
                <div className="admin-stat-info">
                  <span className="admin-stat-num">{pendingOrders}</span>
                  <span className="admin-stat-label">Order Pending</span>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: 'rgba(77,171,247,0.15)' }}>
                  <i className="fas fa-calendar-alt" style={{ color: '#4dabf7' }} />
                </div>
                <div className="admin-stat-info">
                  <span className="admin-stat-num">{pendingRes}</span>
                  <span className="admin-stat-label">Reservasi Pending</span>
                </div>
              </div>
            </div>

            <div className="admin-quick-actions">
              <h2>Aksi Cepat</h2>
              <div className="quick-action-grid">
                <button className="quick-action-card" onClick={() => setActiveSection('orders')}>
                  <i className="fas fa-receipt" />
                  <span>Lihat Semua Order</span>
                </button>
                <button className="quick-action-card" onClick={() => setActiveSection('reservations')}>
                  <i className="fas fa-calendar-alt" />
                  <span>Lihat Reservasi</span>
                </button>
                <Link to="/menu" className="quick-action-card">
                  <i className="fas fa-coffee" />
                  <span>Lihat Menu</span>
                </Link>
                <Link to="/" className="quick-action-card">
                  <i className="fas fa-home" />
                  <span>Ke Beranda</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Section: Orders */}
        {activeSection === 'orders' && (
          <div className="admin-content animate-fade-up">
            <div className="admin-section-header">
              <h2>Daftar Order <span className="admin-count-badge">{orders.length}</span></h2>
              <button className="btn btn-outline btn-sm" onClick={fetchOrders}>
                <i className="fas fa-sync-alt" /> Refresh
              </button>
            </div>
            {loading ? (
              <div className="admin-loading"><i className="fas fa-spinner fa-spin" /> Memuat data...</div>
            ) : orders.length === 0 ? (
              <div className="admin-empty">
                <i className="fas fa-receipt" />
                <p>Belum ada order masuk</p>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#ID</th>
                      <th>Pelanggan</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Tanggal</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td><span className="admin-id-badge">#{order.id}</span></td>
                        <td>
                          <div className="admin-customer-cell">
                            <strong>{order.customer_name}</strong>
                            <small>{order.phone}</small>
                          </div>
                        </td>
                        <td><strong style={{ color: 'var(--primary)' }}>{formatCurrency(order.total)}</strong></td>
                        <td>
                          <span className="admin-status-badge" style={{ background: statusColors[order.status] + '22', color: statusColors[order.status], border: `1px solid ${statusColors[order.status]}44` }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{formatDate(order.created_at)}</td>
                        <td>
                          <div className="admin-action-group">
                            <select
                              className="admin-select"
                              value={order.status}
                              onChange={e => handleOrderStatus(order.id, e.target.value)}
                            >
                              {ORDER_STATUSES.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                            <button
                              className="admin-btn-delete"
                              onClick={() => handleDeleteOrder(order.id)}
                              title="Hapus order"
                            >
                              <i className="fas fa-trash" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Section: Reservations */}
        {activeSection === 'reservations' && (
          <div className="admin-content animate-fade-up">
            <div className="admin-section-header">
              <h2>Daftar Reservasi <span className="admin-count-badge">{reservations.length}</span></h2>
              <button className="btn btn-outline btn-sm" onClick={fetchReservations}>
                <i className="fas fa-sync-alt" /> Refresh
              </button>
            </div>
            {loading ? (
              <div className="admin-loading"><i className="fas fa-spinner fa-spin" /> Memuat data...</div>
            ) : reservations.length === 0 ? (
              <div className="admin-empty">
                <i className="fas fa-calendar-alt" />
                <p>Belum ada reservasi</p>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#ID</th>
                      <th>Nama</th>
                      <th>Tanggal & Jam</th>
                      <th>Tamu</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map(res => (
                      <tr key={res.id}>
                        <td><span className="admin-id-badge">#{res.id}</span></td>
                        <td>
                          <div className="admin-customer-cell">
                            <strong>{res.name}</strong>
                            <small>{res.phone}</small>
                            {res.note && <small style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>{res.note}</small>}
                          </div>
                        </td>
                        <td>
                          <div className="admin-customer-cell">
                            <strong>{new Date(res.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                            <small>{res.time}</small>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600 }}>{res.people} orang</span>
                        </td>
                        <td>
                          <span className="admin-status-badge" style={{ background: statusColors[res.status] + '22', color: statusColors[res.status], border: `1px solid ${statusColors[res.status]}44` }}>
                            {res.status}
                          </span>
                        </td>
                        <td>
                          <div className="admin-action-group">
                            <select
                              className="admin-select"
                              value={res.status}
                              onChange={e => handleReservationStatus(res.id, e.target.value)}
                            >
                              {RESERVATION_STATUSES.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                            <button
                              className="admin-btn-delete"
                              onClick={() => handleDeleteReservation(res.id)}
                              title="Hapus reservasi"
                            >
                              <i className="fas fa-trash" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {toast && (
        <div className="toast-container">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
}
