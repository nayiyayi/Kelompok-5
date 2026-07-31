import { useState } from 'react';
import Toast from '../components/Toast';
import { Link } from 'react-router-dom';

export default function Promo() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const copyPromoCode = (code) => {
    navigator.clipboard.writeText(code);
    showToast(`Kode voucher "${code}" berhasil disalin! Silakan gunakan saat checkout atau di kasir.`, 'success');
  };

  const promoCategories = ['Semua', 'Voucher Diskon', 'Paket Hemat', 'Event & Special'];

  const promos = [
    {
      id: 1,
      category: 'Voucher Diskon',
      title: 'Diskon Mahasiswa & Pelajar 20%',
      badge: 'Diskon 20%',
      tag: 'Setiap Hari',
      icon: 'fas fa-graduation-cap',
      desc: 'Tunjukkan Kartu Tanda Mahasiswa (KTM) aktif di kasir & dapatkan diskon 20% untuk seluruh varian Kopi Kombo.',
      code: 'MAHASISWAKOMBO',
      validUntil: '31 Desember 2026',
      terms: 'Berlaku untuk dine-in dan take away dengan menunjukkan KTM.'
    },
    {
      id: 2,
      category: 'Paket Hemat',
      title: 'Kombo Beli 2 Gratis 1 Signature',
      badge: 'B2G1 Free',
      tag: 'Hot Offer 🔥',
      icon: 'fas fa-mug-hot',
      desc: 'Beli 2 Kopi Kombo Signature varian apa saja, gratis 1 minuman Non-Kopi favoritmu!',
      code: 'BUY2GET1KOMBO',
      validUntil: 'Selama Persediaan Ada',
      terms: 'Berlaku untuk semua pembelian varian kopi signature.'
    },
    {
      id: 3,
      category: 'Voucher Diskon',
      title: 'Voucher Potongan Rp 10.000',
      badge: 'Hemat Rp 10rb',
      tag: 'Favorit',
      icon: 'fas fa-ticket-alt',
      desc: 'Dapatkan potongan langsung Rp 10.000 untuk setiap transaksi online atau reservasi minimal Rp 35.000.',
      code: 'KOMBOJOGJA',
      validUntil: '31 Agustus 2026',
      terms: 'Dapat digunakan untuk pemesanan online & reservasi meja.'
    },
    {
      id: 4,
      category: 'Event & Special',
      title: 'Promo Midnight Nugas (Jam 22.00 - 04.00)',
      badge: 'Hemat 15%',
      tag: 'Khusus Malam',
      icon: 'fas fa-moon',
      desc: 'Diskon khusus 15% untuk kamu yang nugas malam di Kopi Kombo Gejayan. Free refill air mineral!',
      code: 'NUGASMIDNIGHT',
      validUntil: 'Setiap Hari Jam 22.00-04.00',
      terms: 'Khusus transaksi di outlet Kopi Kombo Gejayan.'
    },
    {
      id: 5,
      category: 'Paket Hemat',
      title: 'Free Dessert Donat Red Velvet',
      badge: 'Free Dessert',
      tag: 'Manis Hemat',
      icon: 'fas fa-cookie-bite',
      desc: 'Gratis 1 Donat Red Velvet lembut setiap pembelian 2 minuman Non-Kopi varian Chocolate / Matcha.',
      code: 'SWEETDONUT',
      validUntil: '15 Agustus 2026',
      terms: 'Berlaku untuk pembelian dine-in dan take away.'
    },
    {
      id: 6,
      category: 'Event & Special',
      title: 'Promo Rombongan / Gathering 15%',
      badge: 'Diskon Group',
      tag: 'Reservasi',
      icon: 'fas fa-users',
      desc: 'Nikmati diskon 15% total bill untuk reservasi kelompok atau komunitas minimal 6 orang.',
      code: 'GROUPKOMBO',
      validUntil: '31 Desember 2026',
      terms: 'Wajib melakukan reservasi meja di website terlebih dahulu.'
    }
  ];

  const filteredPromos = activeCategory === 'Semua'
    ? promos
    : promos.filter(p => p.category === activeCategory);

  return (
    <main style={{ background: 'var(--dark)', minHeight: '100vh' }}>
      {/* Header Halaman Promo */}
      <div className="page-header">
        <div className="container">
          <span className="api-badge">Hemat & Terjangkau</span>
          <h1>Promo <span>Spesial</span></h1>
          <p>Kumpulan promo menarik, paket hemat nongkrong, dan kode voucher spesial dari Kopi Kombo!</p>
        </div>
      </div>

      <section>
        <div className="container">

          {/* Filter Kategori Promo */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '3rem' }}>
            {promoCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '8px 20px', borderRadius: '25px', fontSize: '0.9rem' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid Kartu Promo */}
          <div className="promo-grid">
            {filteredPromos.map((p) => (
              <div key={p.id} className="promo-card animate-fade-up">
                <div>
                  <div className="promo-header">
                    <div className="promo-icon-wrap">
                      <i className={p.icon} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <span className="promo-badge">{p.badge}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: '600' }}>
                        <i className="fas fa-bolt" /> {p.tag}
                      </span>
                    </div>
                  </div>
                  <h3 className="promo-title">{p.title}</h3>
                  <p className="promo-desc">{p.desc}</p>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fas fa-clock" style={{ color: 'var(--primary)' }} />
                    <span>Berlaku hingga: <strong>{p.validUntil}</strong></span>
                  </div>
                </div>

                <div>
                  <div className="promo-code-container" style={{ marginBottom: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Kode Voucher:</span>
                      <span className="promo-code-text">{p.code}</span>
                    </div>
                    <button className="promo-copy-btn" onClick={() => copyPromoCode(p.code)}>
                      <i className="fas fa-copy" style={{ marginRight: '5px' }} /> Salin Kode
                    </button>
                  </div>

                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
                    *{p.terms}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Infografis / Langkah Klaim Promo */}
          <div style={{ marginTop: '5rem', background: 'var(--dark-2)', padding: '3rem 2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--card-border)' }}>
            <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '2.5rem' }}>
              Cara Menggunakan <span>Kode Promo</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', textAlign: 'center' }}>
              <div>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  1
                </div>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Pilih Voucher</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Temukan penawaran promo yang sesuai dengan keinginanmu di daftar atas.</p>
              </div>

              <div>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  2
                </div>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Salin Kode</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Klik tombol <strong>Salin Kode</strong> untuk menyimpan kode voucher otomatis.</p>
              </div>

              <div>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  3
                </div>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Gunakan & Hemat</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Tunjukkan ke Kasir Gejayan atau gunakan saat checkout & reservasi meja online.</p>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link to="/reservasi" className="btn btn-primary" style={{ marginRight: '1rem' }}>
                <i className="fas fa-calendar-check" style={{ marginRight: '8px' }} /> Reservasi Meja Sekarang
              </Link>
              <Link to="/menu-coffee" className="btn btn-outline">
                <i className="fas fa-mug-hot" style={{ marginRight: '8px' }} /> Lihat Menu Kopi
              </Link>
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
