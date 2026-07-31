/**
 * ===================================================
 * FILE: Contact.jsx
 * ASSIGNED TO: [Nama & NIM Anda]
 * JOBDESK: Halaman Kontak & Official Sosial Media
 * ===================================================
 */

export default function Contact() {
  const contactItems = [
    {
      icon: 'fab fa-instagram',
      title: 'Instagram Official',
      desc: 'Ikuti info promo terbaru dan keseruan event harian.',
      actionText: '@kopikombo',
      link: 'https://www.instagram.com/kopikombo?igsh=MTRibzdwY2poc3B5dA=='
    },
    {
      icon: 'fab fa-tiktok',
      title: 'TikTok Official',
      desc: 'Lihat konten estetik, racikan menu, dan video review.',
      actionText: '@kopikombo',
      link: 'https://www.tiktok.com/@kopikombo?_r=1&_t=ZS-96AVyyS3mi4'
    },
    {
      icon: 'fab fa-whatsapp',
      title: 'WhatsApp Official',
      desc: 'Kontak pesanan cepat dan saluran informasi official.',
      actionText: '+62 823-2211-5127',
      link: 'https://wa.me/6282322115127'
    },
    {
      icon: 'fas fa-envelope',
      title: 'Email Official',
      desc: 'Email umum untuk penawaran dan kritik konstruktif.',
      actionText: 'kopikombo@gmail.com',
      link: 'mailto:kopikombo@gmail.com'
    }
  ];

  return (
    <main>
      <div className="page-header">
        <div className="container">
          <span className="api-badge">Sosial Media & Lokasi</span>
          <h1>Kontak <span>Resmi</span></h1>
          <p>Kunjungi media sosial resmi kami atau datang langsung ke lokasi outlet terdekat.</p>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="contact-grid animate-fade-up">
            
            <div className="contact-info">
              <h2 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>Official Media Sosial</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Ikuti seluruh akun sosial media resmi Kopi Kombo untuk mendapatkan pembaruan promo dan event menarik.
              </p>
              
              {contactItems.map((item, idx) => (
                <div key={idx} className="contact-info-item">
                  <i className={item.icon} />
                  <div>
                    <h4>{item.title}</h4>
                    <p style={{ marginBottom: '6px' }}>{item.desc}</p>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontWeight: '600', color: 'var(--primary)' }}>
                      {item.actionText} <i className="fas fa-external-link-alt" style={{ fontSize: '0.75rem', marginLeft: '4px' }} />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h2 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>Peta Outlet Gejayan</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Kunjungi outlet fisik kami di Gejayan, Yogyakarta. Tempat nugas ternyaman di Yogyakarta.
              </p>
              <div className="map-container">
                <iframe
                  title="Kopi Kombo Map Contact"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.9473223772816!2d110.401473!3d-7.757043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59a0b6d8f0f1%3A0x6d6e5bdbf786d3b!2sJl.%20Gejayan%2C%20Yogyakarta!5e0!3m2!1sid!2sid!4v1710000000000"
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
