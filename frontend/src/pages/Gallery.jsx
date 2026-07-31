export default function Gallery() {
  const images = [
    { src: '/about.jpg', title: 'Suasana Cafe', subtitle: 'Interior hangat dan nyaman untuk nongkrong sambil menikmati kopi.', size: 'big' },
    { src: '/coffe.jpg', title: 'Kopi Segar', subtitle: 'Kopi dingin dan panas disajikan dengan tampilan estetis.', size: 'tall' },
    { src: '/kombo1.jpeg', title: 'Kedai Kopi Kombo', subtitle: 'Spot foto terbaik dengan desain kekinian.', size: 'normal' },
    { src: '/kombo2.jpeg', title: 'Manual Brew', subtitle: 'Teknik penyeduhan kopi manual yang rapi dan detail.', size: 'wide' },
    { src: '/kombo3.jpeg', title: 'Tempat Duduk Cozy', subtitle: 'Area nyaman untuk kerja, belajar, atau santai bersama teman.', size: 'normal' },
    { src: '/kombo4.jpeg', title: 'Kopi Matcha', subtitle: 'Minuman kekinian favorit dengan tampilan warna yang menarik.', size: 'normal' },
    { src: '/kombo5.jpeg', title: 'Highlight Menu', subtitle: 'Kombinasi kopi dan non-kopi pilihan pelanggan.', size: 'wide' },
    { src: '/non-coffe.jpeg', title: 'Pilihan Non-Kopi', subtitle: 'Minuman non-kopi segar dengan presentasi modern.', size: 'normal' },
    { src: '/artikel1.jpg', title: 'Brand Story', subtitle: 'Cerita Kopi Kombo dan gaya hidup cafe lokal.', size: 'tall' }
  ];

  return (
    <main>
      <div className="page-header">
        <div className="container">
          <span className="api-badge">Visual Tour</span>
          <h1>Galeri <span>Kombo</span></h1>
          <p>Lihat sudut-sudut kenyamanan dan keseruan penyeduhan kebahagiaan di Kopi Kombo Cafe Jogja.</p>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="gallery-grid animate-fade-up">
            {images.map((img, i) => (
              <div key={i} className={`gallery-item ${img.size}`}>
                <img src={img.src} alt={img.title} />
                <div className="gallery-overlay">
                  <h4 style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '4px' }}>{img.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{img.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
