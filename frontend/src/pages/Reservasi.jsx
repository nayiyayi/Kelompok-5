/**
 * ===================================================
 * FILE: Reservasi.jsx
 * ASSIGNED TO: [Nama & NIM Anda]
 * JOBDESK: Fitur Reservasi Meja Cafe (Dine-In Booking)
 * ===================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { createReservation, getMyReservations } from '../services/reservationService';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Toast from '../components/Toast';

const statusColors = {
  pending: '#FFD700',
  confirmed: '#00c16a',
  cancelled: '#ff4d4d',
};

const formatDate = (d) => {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function Reservasi() {
  const { user, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState('form');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    date: '',
    time: '',
    people: '',
    note: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // User history state
  const [myReservations, setMyReservations] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Pre-fill user name if logged in
  useEffect(() => {
    if (user?.name) {
      setFormData(prev => ({ ...prev, name: user.name }));
    }
  }, [user]);

  const fetchHistory = useCallback(async () => {
    if (!isLoggedIn) return;
    setLoadingHistory(true);
    try {
      const res = await getMyReservations();
      setMyReservations(res.data.data || []);
    } catch {
      setMyReservations([]);
    } finally {
      setLoadingHistory(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

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
      newErrors.phone = 'Nomor HP hanya boleh berisi angka';
    }

    const today = new Date().toISOString().split('T')[0];
    if (!formData.date) {
      newErrors.date = 'Tanggal reservasi wajib diisi';
    } else if (formData.date < today) {
      newErrors.date = 'Tanggal tidak boleh kurang dari hari ini';
    }

    if (!formData.time) newErrors.time = 'Jam reservasi wajib diisi';

    if (!formData.people) {
      newErrors.people = 'Jumlah orang wajib diisi';
    } else if (parseInt(formData.people) < 1) {
      newErrors.people = 'Jumlah orang minimal 1 orang';
    }

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
      const res = await createReservation(formData);
      setToast({ message: res.data.message || 'Reservasi meja berhasil dikonfirmasi!', type: 'success' });
      setFormData({
        name: user?.name || '',
        phone: '',
        date: '',
        time: '',
        people: '',
        note: ''
      });
      // Refresh history & otomatis pindah ke tab riwayat
      await fetchHistory();
      setActiveTab('history');
    } catch (err) {
      setToast({ message: err.message || 'Gagal mengirimkan reservasi meja', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="page-header">
        <div className="container">
          <span className="api-badge">Dine-In Booking</span>
          <h1>Reservasi <span>Meja</span></h1>
          <p>Pesan tempat nongkrong terfavoritmu terlebih dahulu agar berkumpul dengan teman jadi lebih seru.</p>
        </div>
      </div>

      <section>
        <div className="container">
          {/* Tab Navigation: Pisahkan Form dan Riwayat */}
          <div className="reservation-tabs-wrapper">
            <button
              className={`reservation-tab-btn${activeTab === 'form' ? ' active' : ''}`}
              onClick={() => setActiveTab('form')}
            >
              <i className="fas fa-calendar-plus" /> Form Reservasi Baru
            </button>
            <button
              className={`reservation-tab-btn${activeTab === 'history' ? ' active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <i className="fas fa-history" /> Riwayat Reservasi Saya
              {isLoggedIn && myReservations.length > 0 && (
                <span className="reservation-badge">{myReservations.length}</span>
              )}
            </button>
          </div>

          {/* TAB 1: FORM RESERVASI BARU */}
          {activeTab === 'form' && (
            <div className="form-box animate-fade-up">
              <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.6rem' }}>
                Booking Form
              </h3>

              <form onSubmit={handleOpenConfirm}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`form-control${errors.name ? ' error' : ''}`}
                    placeholder="Nama pemesan meja"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <span className="error-msg">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Nomor HP / WhatsApp</label>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="date" className="form-label">Tanggal</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      className={`form-control${errors.date ? ' error' : ''}`}
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={handleChange}
                    />
                    {errors.date && <span className="error-msg">{errors.date}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="time" className="form-label">Jam</label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      className={`form-control${errors.time ? ' error' : ''}`}
                      value={formData.time}
                      onChange={handleChange}
                    />
                    {errors.time && <span className="error-msg">{errors.time}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="people" className="form-label">Jumlah Orang</label>
                  <input
                    type="number"
                    id="people"
                    name="people"
                    min="1"
                    className={`form-control${errors.people ? ' error' : ''}`}
                    placeholder="Contoh: 4"
                    value={formData.people}
                    onChange={handleChange}
                  />
                  {errors.people && <span className="error-msg">{errors.people}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="note" className="form-label">Catatan Spesial (Opsional)</label>
                  <textarea
                    id="note"
                    name="note"
                    rows="3"
                    className="form-control"
                    placeholder="Contoh: meja dekat panggung, butuh baby chair, dll"
                    value={formData.note}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full btn-lg"
                  disabled={loading}
                  style={{ marginTop: '1rem' }}
                >
                  Konfirmasi Sekarang
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: RIWAYAT RESERVASI SAYA */}
          {activeTab === 'history' && (
            <div className="profile-panel animate-fade-up">
              <div className="admin-section-header" style={{ marginBottom: '1.5rem' }}>
                <h2>
                  <i className="fas fa-history" style={{ color: 'var(--primary)', marginRight: '8px' }} />
                  Daftar & Status Reservasi Saya
                </h2>
                {isLoggedIn && (
                  <button className="btn btn-outline btn-sm" onClick={fetchHistory} disabled={loadingHistory}>
                    <i className={`fas fa-sync-alt${loadingHistory ? ' fa-spin' : ''}`} /> Refresh
                  </button>
                )}
              </div>

              {isLoggedIn ? (
                loadingHistory ? (
                  <div className="admin-loading"><i className="fas fa-spinner fa-spin" /> Memuat data riwayat...</div>
                ) : myReservations.length === 0 ? (
                  <div className="admin-empty">
                    <i className="fas fa-calendar-times" />
                    <p>Kamu belum memiliki riwayat reservasi meja.</p>
                    <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }} onClick={() => setActiveTab('form')}>
                      Buat Reservasi Baru
                    </button>
                  </div>
                ) : (
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>#ID</th>
                          <th>Tanggal & Jam</th>
                          <th>Jumlah Orang</th>
                          <th>Catatan</th>
                          <th>Status</th>
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
                                {res.status === 'pending' ? '⏳ Menunggu Konfirmasi' : res.status === 'confirmed' ? '✅ Disetujui' : '❌ Dibatalkan'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                <div className="admin-empty">
                  <i className="fas fa-lock" />
                  <p>Silakan <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link> untuk melihat riwayat reservasi meja kamu.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="app-modal-overlay">
          <div className="app-modal animate-fade-up">
            <div className="app-modal-header">
              <h3><i className="fas fa-calendar-check" /> Konfirmasi Reservasi</h3>
              <button className="modal-close-btn" onClick={() => setShowConfirmModal(false)}>&times;</button>
            </div>
            <div className="app-modal-body">
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.2rem', fontSize: '0.9rem' }}>
                Silakan periksa kembali detail pesanan reservasi meja Anda sebelum melanjutkan konfirmasi.
              </p>
              <div className="confirm-summary-list">
                <div className="confirm-summary-item">
                  <span className="confirm-label">Nama Pemesan</span>
                  <span className="confirm-val">{formData.name}</span>
                </div>
                <div className="confirm-summary-item">
                  <span className="confirm-label">No. WhatsApp/HP</span>
                  <span className="confirm-val">{formData.phone}</span>
                </div>
                <div className="confirm-summary-item">
                  <span className="confirm-label">Tanggal Reservasi</span>
                  <span className="confirm-val">{formatDate(formData.date)}</span>
                </div>
                <div className="confirm-summary-item">
                  <span className="confirm-label">Waktu Kedatangan</span>
                  <span className="confirm-val">Pukul {formData.time} WIB</span>
                </div>
                <div className="confirm-summary-item">
                  <span className="confirm-label">Jumlah Orang (Tamu)</span>
                  <span className="confirm-val">{formData.people} Orang</span>
                </div>
                <div className="confirm-summary-item">
                  <span className="confirm-label">Catatan Tambahan</span>
                  <span className="confirm-val">{formData.note || '-'}</span>
                </div>
              </div>
            </div>
            <div className="app-modal-footer">
              <button className="btn btn-outline" onClick={() => setShowConfirmModal(false)}>Perbaiki Data</button>
              <button className="btn btn-primary" onClick={handleConfirmSubmit}>Ya, Konfirmasi Booking</button>
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
