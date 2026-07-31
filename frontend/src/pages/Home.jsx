import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import { useProduct } from '../context/ProductContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const { products, loading, error } = useProduct();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (products && products.length > 0) {
      // Ambil 3 menu signature teratas
      setFeaturedProducts(products.slice(0, 3));
    }
  }, [products]);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const copyPromoCode = (code) => {
    navigator.clipboard.writeText(code);
    showToast(`Kode promo "${code}" berhasil disalin!`, 'success');
  };

  const promos = [
    {
      id: 1,
      title: 'Diskon Pelajar 20%',
      badge: 'Diskon 20%',
      icon: 'fas fa-graduation-cap',
      desc: 'Tunjukkan Kartu Tanda Mahasiswa (KTM) aktif kamu di kasir & dapatkan diskon 20% untuk semua varian Kopi Kombo.',
      code: 'MAHASISWAKOMBO'
    },
    {
      id: 2,
      title: 'Kombo Hemat Beli 2 Gratis 1',
      badge: 'B2G1 Free',
      icon: 'fas fa-tags',
      desc: 'Setiap pembelian 2 Kopi Kombo Signature varian apa saja, gratis 1 minuman Non-Kopi pilihanmu!',
      code: 'BUY2GET1KOMBO'
    },
    {
      id: 3,
      title: 'Voucher Spesial Jogja',
      badge: 'Hemat Rp 10.000',
      icon: 'fas fa-gift',
      desc: 'Gunakan kode voucher saat checkout online atau reservasi meja untuk mendapat potongan harga langsung.',
      code: 'KOMBOJOGJA'
    }
  ];

  const reviews = [
    {
      id: 1,
      name: 'Aceng Frstyle',
      role: 'Mahasiswa',
      text: 'Tempatnya aesthetic banget buat nongkrong dan nugas sampai pagi. Kopinya mantap, harganya bersahabat!',
      stars: 5,
      avatar: 'https://i.pravatar.cc/100?img=12'
    },
    {
      id: 2,
      name: 'Elang Jawa',
      role: 'Content Creator',
      text: 'Vibes cafenya Jogja banget, tenang dan banyak spot foto bagus. Kombo Salted Caramel wajib dicoba!',
      stars: 5,
      avatar: 'https://i.pravatar.cc/100?img=32'
    },
    {
      id: 3,
      name: 'Pito Petruk',
      role: 'Freelancer',
      text: 'WiFi super kencang, colokan listrik banyak, dan pelayanan ramah. Minuman Matcha Latte-nya juara.',
      stars: 5,
      avatar: 'https://i.pravatar.cc/100?img=15'
    }
  ];

  return (
    <main>
      <Hero />

      {/* Tentang Kami */}
      <section id="tentang" style={{ background: 'var(--dark-2)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }} className="product-detail-grid">
            <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
              <img src="/about.jpg" alt="Tentang Kopi Kombo" style={{ width: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h2 style={{ textAlign: 'left', marginBottom: '1.5rem' }} className="section-title">Tentang <span>Kami</span></h2>
              <p style={{ color: 'var(--text-light)', marginBottom: '1rem', lineHeight: '1.8' }}>
                Kopi Kombo didirikan dengan mimpi sederhana: menyajikan kopi berkualitas premium dalam suasana cafe modern aesthetic, namun dengan harga yang tetap terjangkau untuk mahasiswa.
              </p>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.8' }}>
                Terletak di jantung daerah Gejayan, Yogyakarta, kami menyediakan tempat nongkrong yang nyaman selama 24 jam dengan WiFi cepat, colokan melimpah, dan musik santai untuk menemani obrolan hangat atau tugas kuliahmu.
              </p>
              <Link to="/gallery" className="btn btn-primary">Lihat Galeri Cafe</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Promo & Penawaran Spesial */}
      <section id="promo" style={{ background: 'var(--dark-3)' }}>
        <div className="container">
          <h2 className="section-title">Promo & <span>Penawaran Spesial</span></h2>
          <p className="section-subtitle">Gunakan voucher & penawaran hemat Kopi Kombo untuk pesanan kopi dan tempat nugas favoritmu!</p>
          
          <div className="promo-grid">
            {promos.map((p) => (
              <div key={p.id} className="promo-card">
                <div>
                  <div className="promo-header">
                    <div className="promo-icon-wrap">
                      <i className={p.icon} />
                    </div>
                    <span className="promo-badge">{p.badge}</span>
                  </div>
                  <h3 className="promo-title">{p.title}</h3>
                  <p className="promo-desc">{p.desc}</p>
                </div>

                <div className="promo-code-container">
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Kode Promo:</span>
                    <span className="promo-code-text">{p.code}</span>
                  </div>
                  <button className="promo-copy-btn" onClick={() => copyPromoCode(p.code)}>
                    <i className="fas fa-copy" style={{ marginRight: '5px' }} /> Salin
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Signature / Unggulan */}
      <section id="unggulan">
        <div className="container">
          <h2 className="section-title">Menu <span>Signature</span></h2>
          <p className="section-subtitle">Menu favorit Kopi Kombo dengan rasa premium, harga bersahabat, dan penampilan yang Instagrammable.</p>
          {loading ? (
            <Loading text="Memuat menu unggulan..." />
          ) : error ? (
            <div className="error-state">
              <i className="fas fa-exclamation-triangle" />
              <p>{error}</p>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onToast={showToast} 
                />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/menu" className="btn btn-outline">Lihat Seluruh Menu</Link>
          </div>
        </div>
      </section>

      {/* Layanan */}
      <section id="layanan" style={{ background: 'var(--dark-3)' }}>
        <div className="container">
          <h2 className="section-title">Layanan <span>Unggulan</span></h2>
          <p className="section-subtitle">Nikmati layanan lengkap Kopi Kombo, dari kopi premium hingga live music dan fasilitas untuk kamu yang ingin nongkrong lama.</p>
          <div className="service-grid">
            <div className="service-card">
              <i className="fas fa-mug-hot" />
              <h3>Coffee Premium</h3>
              <p>Menggunakan biji kopi pilihan nusantara dengan teknik roasting profesional.</p>
            </div>
            <div className="service-card">
              <i className="fas fa-wifi" />
              <h3>Free WiFi Kencang</h3>
              <p>Koneksi internet stabil berkecepatan tinggi, cocok untuk nugas atau mabar.</p>
            </div>
            <div className="service-card">
              <i className="fas fa-music" />
              <h3>Live Music</h3>
              <p>Nikmati alunan musik akustik langsung setiap akhir pekan yang romantis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Review */}
      <section id="review">
        <div className="container">
          <h2 className="section-title">Review <span>Pelanggan</span></h2>
          <div className="review-grid">
            {reviews.map((rev) => (
              <div key={rev.id} className="review-card">
                <div className="review-stars">
                  {Array.from({ length: rev.stars }).map((_, i) => (
                    <i key={i} className="fas fa-star" />
                  ))}
                </div>
                <p className="review-text">"{rev.text}"</p>
                <div className="review-user">
                  <img src={rev.avatar} alt={rev.name} />
                  <div>
                    <h4>{rev.name}</h4>
                    <span>{rev.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lokasi */}
      <section id="lokasi" style={{ background: 'var(--dark-2)' }}>
        <div className="container">
          <h2 className="section-title">Lokasi <span>Kami</span></h2>
          <div className="contact-box" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h3 style={{ marginBottom: '0.8rem', fontSize: '1.8rem' }}>
              <i className="fas fa-map-marker-alt" style={{ color: 'var(--primary)', marginRight: '10px' }} />
              Gejayan, Yogyakarta
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Buka setiap hari - 24 Jam Nonstop</p>
            <div className="map-container">
              <iframe
                title="Kopi Kombo Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.9473223772816!2d110.401473!3d-7.757043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59a0b6d8f0f1%3A0x6d6e5bdbf786d3b!2sJl.%20Gejayan%2C%20Yogyakarta!5e0!3m2!1sid!2sid!4v1710000000000"
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>
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
