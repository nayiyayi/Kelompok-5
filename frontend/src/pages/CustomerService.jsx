/**
 * ===================================================
 * FILE: CustomerService.jsx
 * ASSIGNED TO: [Nama & NIM Anda]
 * JOBDESK: Fitur Layanan Pelanggan & Live Chat CS (Customer Service)
 * ===================================================
 */

import { useState } from 'react';
import Toast from '../components/Toast';

export default function CustomerService() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: 'Reservasi & Meja',
    message: ''
  });

  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const csContacts = [
    {
      title: 'WhatsApp Live CS',
      badge: 'Respon Cepat',
      desc: 'Terhubung langsung dengan Customer Service via WhatsApp.',
      link: 'https://wa.me/6282322115127?text=Halo%20CS%20Kopi%20Kombo,%20saya%20butuh%20bantuan',
      icon: 'fab fa-whatsapp',
      color: '#25D366'
    },
    {
      title: 'Email Support',
      badge: '24/7 Service',
      desc: 'Kirimkan pertanyaan, saran, atau kerjasama ke email resmi kami.',
      link: 'mailto:kopikombo@gmail.com',
      icon: 'fas fa-envelope',
      color: '#EA4335'
    },
    {
      title: 'Hotline CS',
      badge: 'Buka 08:00 - 22:00',
      desc: 'Hubungi panggilan telepon langsung untuk keadaan darurat.',
      link: 'tel:082322115127',
      icon: 'fas fa-phone-alt',
      color: '#FF6B00'
    }
  ];

  const faqs = [
    {
      q: 'Bagaimana cara melakukan reservasi meja?',
      a: 'Anda dapat masuk ke menu Reservasi di website ini, memilih tanggal, jam, dan jumlah orang, lalu mengonfirmasi booking.'
    },
    {
      q: 'Apakah Kopi Kombo menyediakan katering / sewa tempat acara?',
      a: 'Ya! Kami menerima acara ulang tahun, gathering komunitas, dan private event. Silakan hubungi CS WhatsApp kami untuk info pricelist.'
    },
    {
      q: 'Apa saja metode pembayaran yang diterima?',
      a: 'Kami menerima pembayaran Tunai (COD), Transfer Bank, QRIS, dan E-Wallet (GoPay, OVO, Dana).'
    }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      setToast({ message: 'Mohon lengkapi Nama, No HP, dan Pesan Anda.', type: 'error' });
      return;
    }

    setLoading(true);

    // Format pesan WhatsApp otomatis
    setTimeout(() => {
      const waMessage = `Halo CS Kopi Kombo!%0A%0A*Nama:* ${encodeURIComponent(formData.name)}%0A*No HP:* ${encodeURIComponent(formData.phone)}%0A*Kategori:* ${encodeURIComponent(formData.category)}%0A*Pesan:* ${encodeURIComponent(formData.message)}`;
      
      window.open(`https://wa.me/6282322115127?text=${waMessage}`, '_blank');
      
      setToast({ message: 'Pesan berhasil diteruskan ke WhatsApp Customer Service!', type: 'success' });
      setFormData({ name: '', phone: '', category: 'Reservasi & Meja', message: '' });
      setLoading(false);
    }, 600);
  };

  return (
    <main>
      <div className="page-header">
        <div className="container">
          <span className="api-badge">Center Helpdesk</span>
          <h1>Customer <span>Service</span></h1>
          <p>Pusat bantuan resmi Kopi Kombo. Layanan informasi, keluhan, dan bantuan pelanggan 24/7.</p>
        </div>
      </div>

      <section>
        <div className="container">
          {/* Card Kontak CS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {csContacts.map((c, idx) => (
              <div key={idx} className="card animate-fade-up" style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${c.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, fontSize: '1.5rem' }}>
                    <i className={c.icon} />
                  </div>
                  <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px', background: `${c.color}22`, color: c.color, fontWeight: '600' }}>
                    {c.badge}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{c.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>{c.desc}</p>
                <a href={c.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-full btn-sm">
                  Hubungi Sekarang <i className="fas fa-arrow-right" style={{ marginLeft: '6px' }} />
                </a>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
            {/* Form Pesan CS Direct */}
            <div className="form-box animate-fade-up">
              <h3 style={{ marginBottom: '1.2rem', fontSize: '1.4rem' }}>
                <i className="fas fa-paper-plane" style={{ color: 'var(--primary)', marginRight: '8px' }} />
                Kirim Pesan CS
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Masukkan nama Anda"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nomor WhatsApp / HP</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="Contoh: 081234567890"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Kategori Pertanyaan</label>
                  <select
                    name="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Reservasi & Meja">Reservasi & Meja</option>
                    <option value="Pesanan & Delivery">Pesanan & Delivery</option>
                    <option value="Saran & Keluhan">Saran & Keluhan</option>
                    <option value="Private Event & Katering">Private Event & Katering</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Pesan / Bantuan yang Dibutuhkan</label>
                  <textarea
                    name="message"
                    rows="4"
                    className="form-control"
                    placeholder="Tuliskan pertanyaan atau kendala yang Anda alami secara detail..."
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? <i className="fas fa-spinner fa-spin" /> : <><i className="fab fa-whatsapp" /> Kirim ke CS WhatsApp</>}
                </button>
              </form>
            </div>

            {/* FAQ Section */}
            <div className="animate-fade-up">
              <h3 style={{ marginBottom: '1.2rem', fontSize: '1.4rem' }}>
                <i className="fas fa-question-circle" style={{ color: 'var(--primary)', marginRight: '8px' }} />
                Pertanyaan Umum (FAQ)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {faqs.map((faq, idx) => (
                  <div key={idx} style={{ padding: '1.2rem', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '8px' }}>
                      <i className="fas fa-chevron-right" style={{ color: 'var(--primary)', fontSize: '0.8rem', marginRight: '8px' }} />
                      {faq.q}
                    </h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
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
