import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../services/authService';
import { getMyReservations, deleteMyReservation } from '../services/reservationService';
import { getMyOrders, deleteMyOrder, completeMyOrder } from '../services/orderService';
import { Link } from 'react-router-dom';
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
  confirmed: '✅ Disetujui / Dikonfirmasi',
  processing: '☕ Diproses Barista',
  delivered: '🛵 Diantar / Selesai',
  cancelled: '❌ Dibatalkan',
};

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [toast, setToast] = useState(null);

  // Data states
  const [myReservations, setMyReservations] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Profile form
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passErrors, setPassErrors] = useState({});
  const [passLoading, setPassLoading] = useState(false);
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  const fetchMyReservations = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await getMyReservations();
      setMyReservations(res.data.data || []);
    } catch {
      setMyReservations([]);
    } finally {
      setLoadingData(false);
    }
  }, []);

  const fetchMyOrders = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await getMyOrders();
      setMyOrders(res.data.data || []);
    } catch {
      setMyOrders([]);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'reservations') {
      fetchMyReservations();
    } else if (activeTab === 'transactions') {
      fetchMyOrders();
    }
  }, [activeTab, fetchMyReservations, fetchMyOrders]);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  // Actions for Reservations
  const handleDeleteReservation = async (id) => {
    if (!window.confirm('Hapus reservasi ini dari riwayat Anda?')) return;
    try {
      await deleteMyReservation(id);
      showToast('Reservasi berhasil dihapus dari riwayat.', 'success');
      fetchMyReservations();
    } catch (err) {
      showToast(err.message || 'Gagal menghapus reservasi', 'error');
    }
  };

  // Actions for Transactions
  const handleCompleteOrder = async (id) => {
    try {
      await completeMyOrder(id);
      showToast('Pesanan telah dikonfirmasi selesai!', 'success');
      fetchMyOrders();
    } catch (err) {
      showToast(err.message || 'Gagal memperbarui status pesanan', 'error');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Hapus transaksi pesanan ini dari riwayat Anda?')) return;
    try {
      await deleteMyOrder(id);
      showToast('Transaksi pesanan berhasil dihapus dari riwayat.', 'success');
      fetchMyOrders();
    } catch (err) {
      showToast(err.message || 'Gagal menghapus transaksi', 'error');
    }
  };

  // Profile update handlers
  const handleProfileChange = (e) => {
    setProfileForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (profileErrors[e.target.name]) setProfileErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validateProfile = () => {
    const err = {};
    if (!profileForm.name.trim() || profileForm.name.trim().length < 2) err.name = 'Nama minimal 2 karakter';
    if (!profileForm.email.trim()) err.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) err.email = 'Format email tidak valid';
    setProfileErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;
    setProfileLoading(true);
    try {
      await updateProfile(profileForm);
      const updatedUser = { ...user, name: profileForm.name, email: profileForm.email };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      showToast('Profil berhasil diperbarui!', 'success');
    } catch (err) {
      showToast(err.message || 'Gagal memperbarui profil', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  // Password update handlers
  const handlePassChange = (e) => {
    setPassForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (passErrors[e.target.name]) setPassErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validatePass = () => {
    const err = {};
    if (!passForm.currentPassword) err.currentPassword = 'Password lama wajib diisi';
    if (!passForm.newPassword || passForm.newPassword.length < 6) err.newPassword = 'Password baru minimal 6 karakter';
    if (passForm.newPassword !== passForm.confirmPassword) err.confirmPassword = 'Konfirmasi password tidak cocok';
    setPassErrors(err);
    return Object.keys(err).length === 0;
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    if (!validatePass()) return;
    setPassLoading(true);
    try {
      await changePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Password berhasil diubah!', 'success');
    } catch (err) {
      showToast(err.message || 'Gagal mengubah password', 'error');
    } finally {
      setPassLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatCurrency = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  const avatarInitials = user?.name ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'U';

  const menuOptions = [
    { id: 'info', label: 'Informasi Akun', icon: 'fas fa-user-circle', desc: 'Ringkasan data diri & status akun' },
    { id: 'reservations', label: 'Riwayat Reservasi Meja', icon: 'fas fa-calendar-check', desc: 'Daftar pemesanan tempat & status meja' },
    { id: 'transactions', label: 'Riwayat Transaksi & Pembelian', icon: 'fas fa-receipt', desc: 'Daftar riwayat belanja kopi & pengiriman' },
    { id: 'edit', label: 'Edit Profil Saya', icon: 'fas fa-user-edit', desc: 'Ubah nama lengkap dan email' },
    { id: 'password', label: 'Keamanan & Password', icon: 'fas fa-shield-alt', desc: 'Perbarui kata sandi akun' },
  ];

  return (
    <main>
      <div className="page-header">
        <div className="container">
          <span className="api-badge">Dashboard Pengguna</span>
          <h1>Profil <span>Saya</span></h1>
          <p>Pilih menu navigasi di bawah untuk mengelola akun, melihat riwayat reservasi meja, atau mengecek transaksi pembelianmu.</p>
        </div>
      </div>

      <section style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div className="container">
          <div className="profile-layout">

            {/* Sidebar Navigation */}
            <aside className="profile-sidebar">
              <div className="profile-avatar-box">
                <div className="profile-avatar-circle">
                  {avatarInitials}
                </div>
                <h3 className="profile-avatar-name">{user?.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>{user?.email}</p>
                <span className={`profile-role-badge ${user?.role === 'admin' ? 'role-admin' : 'role-customer'}`}>
                  <i className={`fas ${user?.role === 'admin' ? 'fa-user-shield' : 'fa-user'}`} />
                  {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                </span>
              </div>

              <nav className="profile-nav">
                {menuOptions.map((opt) => (
                  <button
                    key={opt.id}
                    className={`profile-nav-btn${activeTab === opt.id ? ' active' : ''}`}
                    onClick={() => setActiveTab(opt.id)}
                  >
                    <i className={opt.icon} /> {opt.label}
                  </button>
                ))}

                {user?.role === 'admin' && (
                  <Link to="/admin" className="profile-nav-btn profile-nav-admin">
                    <i className="fas fa-tachometer-alt" /> Dashboard Admin
                  </Link>
                )}

                <button
                  className="profile-nav-btn"
                  style={{ color: '#ff4d4d', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}
                  onClick={logout}
                >
                  <i className="fas fa-sign-out-alt" /> Keluar (Logout)
                </button>
              </nav>
            </aside>

            {/* Main Content Area */}
            <div className="profile-content animate-fade-up">

              {/* 1. TAB INFORMASI AKUN */}
              {activeTab === 'info' && (
                <div className="profile-panel">
                  <h2 className="profile-panel-title">
                    <i className="fas fa-user-circle" /> Informasi Akun
                  </h2>

                  <div className="profile-info-grid" style={{ marginBottom: '2rem' }}>
                    <div className="profile-info-item">
                      <span className="profile-info-label"><i className="fas fa-user" /> Nama Lengkap</span>
                      <span className="profile-info-value">{user?.name}</span>
                    </div>
                    <div className="profile-info-item">
                      <span className="profile-info-label"><i className="fas fa-envelope" /> Alamat Email</span>
                      <span className="profile-info-value">{user?.email}</span>
                    </div>
                    <div className="profile-info-item">
                      <span className="profile-info-label"><i className="fas fa-user-shield" /> Tipe Akun</span>
                      <span className="profile-info-value" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
                    </div>
                    <div className="profile-info-item">
                      <span className="profile-info-label"><i className="fas fa-calendar-check" /> Tanggal Mendaftar</span>
                      <span className="profile-info-value">{formatDate(user?.created_at)}</span>
                    </div>
                  </div>

                  {/* Quick Shortcut Cards */}
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Menu Cepat Profile</h3>
                  <div className="profile-options-grid">
                    <button className="profile-option-card" onClick={() => setActiveTab('reservations')}>
                      <i className="fas fa-calendar-alt option-icon coffee-theme" />
                      <div>
                        <h4>Riwayat Reservasi Meja</h4>
                        <p>Cek reservasi & status booking tempatmu</p>
                      </div>
                    </button>

                    <button className="profile-option-card" onClick={() => setActiveTab('transactions')}>
                      <i className="fas fa-shopping-bag option-icon cart-theme" />
                      <div>
                        <h4>Riwayat Transaksi</h4>
                        <p>Pantau pengantaran pesanan kopi milikmu</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* 2. TAB RIWAYAT RESERVASI MEJA */}
              {activeTab === 'reservations' && (
                <div className="profile-panel">
                  <div className="admin-section-header" style={{ marginBottom: '1.5rem' }}>
                    <h2 className="profile-panel-title" style={{ border: 'none', padding: 0, margin: 0 }}>
                      <i className="fas fa-calendar-check" /> Riwayat Reservasi Meja
                    </h2>
                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                      <button className="btn btn-outline btn-sm" onClick={fetchMyReservations} disabled={loadingData}>
                        <i className={`fas fa-sync-alt${loadingData ? ' fa-spin' : ''}`} /> Refresh
                      </button>
                      <Link to="/reservasi" className="btn btn-primary btn-sm">
                        <i className="fas fa-plus" /> Reservasi Baru
                      </Link>
                    </div>
                  </div>

                  {loadingData ? (
                    <div className="admin-loading"><i className="fas fa-spinner fa-spin" /> Memuat riwayat reservasi...</div>
                  ) : myReservations.length === 0 ? (
                    <div className="admin-empty">
                      <i className="fas fa-calendar-times" />
                      <p>Kamu tidak memiliki riwayat reservasi meja aktif.</p>
                      <Link to="/reservasi" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                        Pesan Meja Sekarang
                      </Link>
                    </div>
                  ) : (
                    <div className="admin-table-wrapper">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>#ID</th>
                            <th>Tanggal & Jam</th>
                            <th>Tamu</th>
                            <th>Catatan</th>
                            <th>Status</th>
                            <th>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myReservations.map(res => (
                            <tr key={res.id}>
                              <td><span className="admin-id-badge">#{res.id}</span></td>
                              <td>
                                <div>
                                  <strong>{formatDate(res.date)}</strong>
                                  <small style={{ display: 'block', color: 'var(--text-muted)' }}>Pukul {res.time}</small>
                                </div>
                              </td>
                              <td><strong>{res.people} Orang</strong></td>
                              <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{res.note || '-'}</td>
                              <td>
                                <span className="admin-status-badge" style={{
                                  background: (statusColors[res.status] || '#FFD700') + '22',
                                  color: statusColors[res.status] || '#FFD700',
                                  border: `1px solid ${(statusColors[res.status] || '#FFD700')}44`
                                }}>
                                  {statusLabels[res.status] || res.status}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="btn btn-outline btn-sm"
                                  onClick={() => handleDeleteReservation(res.id)}
                                  title="Hilangkan dari riwayat"
                                  style={{ borderColor: 'rgba(255,77,77,0.4)', color: '#ff4d4d', padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                                >
                                  <i className="fas fa-trash-alt" /> Selesai & Hapus
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* 3. TAB RIWAYAT TRANSAKSI & PEMBELIAN */}
              {activeTab === 'transactions' && (
                <div className="profile-panel">
                  <div className="admin-section-header" style={{ marginBottom: '1.5rem' }}>
                    <h2 className="profile-panel-title" style={{ border: 'none', padding: 0, margin: 0 }}>
                      <i className="fas fa-receipt" /> Riwayat Transaksi & Pembelian
                    </h2>
                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                      <button className="btn btn-outline btn-sm" onClick={fetchMyOrders} disabled={loadingData}>
                        <i className={`fas fa-sync-alt${loadingData ? ' fa-spin' : ''}`} /> Refresh
                      </button>
                      <Link to="/orders" className="btn btn-primary btn-sm">
                        <i className="fas fa-external-link-alt" /> Halaman Detail Pesanan
                      </Link>
                    </div>
                  </div>

                  {loadingData ? (
                    <div className="admin-loading"><i className="fas fa-spinner fa-spin" /> Memuat data transaksi...</div>
                  ) : myOrders.length === 0 ? (
                    <div className="admin-empty">
                      <i className="fas fa-shopping-bag" />
                      <p>Tidak ada riwayat transaksi pesanan aktif.</p>
                      <Link to="/menu-coffee" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                        Belanja Kopi Sekarang
                      </Link>
                    </div>
                  ) : (
                    <div className="admin-table-wrapper">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>#ID Transaksi</th>
                            <th>Total Bayar</th>
                            <th>Tanggal</th>
                            <th>Status</th>
                            <th>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myOrders.map(ord => (
                            <tr key={ord.id}>
                              <td><span className="admin-id-badge">Order #{ord.id}</span></td>
                              <td><strong style={{ color: 'var(--primary)' }}>{formatCurrency(ord.total)}</strong></td>
                              <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{formatDate(ord.created_at)}</td>
                              <td>
                                <span className="admin-status-badge" style={{
                                  background: (statusColors[ord.status] || '#FFD700') + '22',
                                  color: statusColors[ord.status] || '#FFD700',
                                  border: `1px solid ${(statusColors[ord.status] || '#FFD700')}44`
                                }}>
                                  {statusLabels[ord.status] || ord.status}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                  {ord.status !== 'delivered' && ord.status !== 'cancelled' && (
                                    <button
                                      className="btn btn-outline btn-sm"
                                      onClick={() => handleCompleteOrder(ord.id)}
                                      title="Konfirmasi pesanan diterima"
                                      style={{ borderColor: '#00c16a', color: '#00c16a', padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                                    >
                                      <i className="fas fa-check" /> Selesai
                                    </button>
                                  )}
                                  <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => handleDeleteOrder(ord.id)}
                                    title="Hapus transaksi ini dari riwayat"
                                    style={{ borderColor: 'rgba(255,77,77,0.4)', color: '#ff4d4d', padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                                  >
                                    <i className="fas fa-trash-alt" /> Hapus
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

              {/* 4. TAB EDIT PROFIL */}
              {activeTab === 'edit' && (
                <div className="profile-panel">
                  <h2 className="profile-panel-title">
                    <i className="fas fa-user-edit" /> Edit Profil Saya
                  </h2>
                  <form onSubmit={handleProfileSubmit} className="auth-form">
                    <div className="form-group">
                      <label htmlFor="profile-name" className="form-label"><i className="fas fa-user" /> Nama Lengkap</label>
                      <input
                        id="profile-name"
                        type="text"
                        name="name"
                        className={`form-control${profileErrors.name ? ' error' : ''}`}
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        placeholder="Nama lengkap kamu"
                      />
                      {profileErrors.name && <span className="error-msg">{profileErrors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="profile-email" className="form-label"><i className="fas fa-envelope" /> Alamat Email</label>
                      <input
                        id="profile-email"
                        type="email"
                        name="email"
                        className={`form-control${profileErrors.email ? ' error' : ''}`}
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        placeholder="contoh@email.com"
                      />
                      {profileErrors.email && <span className="error-msg">{profileErrors.email}</span>}
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={profileLoading}>
                      {profileLoading ? <><i className="fas fa-spinner fa-spin" /> Menyimpan...</> : <><i className="fas fa-save" /> Simpan Perubahan</>}
                    </button>
                  </form>
                </div>
              )}

              {/* 5. TAB GANTI PASSWORD */}
              {activeTab === 'password' && (
                <div className="profile-panel">
                  <h2 className="profile-panel-title">
                    <i className="fas fa-shield-alt" /> Keamanan & Ganti Password
                  </h2>
                  <form onSubmit={handlePassSubmit} className="auth-form">
                    {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                      <div className="form-group" key={field}>
                        <label htmlFor={`pass-${field}`} className="form-label">
                          <i className="fas fa-lock" />
                          {field === 'currentPassword' ? ' Password Lama Saat Ini' : field === 'newPassword' ? ' Password Baru (Min 6 Karakter)' : ' Konfirmasi Password Baru'}
                        </label>
                        <div className="input-password-wrapper">
                          <input
                            id={`pass-${field}`}
                            type={showPass[field] ? 'text' : 'password'}
                            name={field}
                            className={`form-control${passErrors[field] ? ' error' : ''}`}
                            placeholder={field === 'currentPassword' ? 'Masukkan password lama' : field === 'newPassword' ? 'Masukkan password baru' : 'Ulangi password baru'}
                            value={passForm[field]}
                            onChange={handlePassChange}
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPass(s => ({ ...s, [field]: !s[field] }))}
                            tabIndex={-1}
                          >
                            <i className={`fas ${showPass[field] ? 'fa-eye-slash' : 'fa-eye'}`} />
                          </button>
                        </div>
                        {passErrors[field] && <span className="error-msg">{passErrors[field]}</span>}
                      </div>
                    ))}
                    <button type="submit" className="btn btn-primary" disabled={passLoading}>
                      {passLoading ? <><i className="fas fa-spinner fa-spin" /> Mengubah Password...</> : <><i className="fas fa-key" /> Simpan Password Baru</>}
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
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
