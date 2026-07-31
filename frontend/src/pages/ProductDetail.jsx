import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import { getProductImageUrl } from '../utils/media';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { isWishlisted, addItem: addToWishlistContext, removeItem: removeFromWishlistContext, wishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [addingCart, setAddingCart] = useState(false);
  const [addingWish, setAddingWish] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const res = await getProductById(id);
        setProduct(res.data.data);
      } catch (err) {
        setError(err.message || 'Gagal memuat detail produk');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [id]);

  const favorited = product ? isWishlisted(product.id) : false;

  const handleCart = async () => {
    if (!product) return;
    try {
      setAddingCart(true);
      await addItem(product.id, qty);
      setToast({ message: `Berhasil menambahkan ${qty} ${product.name} ke Keranjang!`, type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Gagal menambahkan ke keranjang', type: 'error' });
    } finally {
      setAddingCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!product) return;
    try {
      setAddingWish(true);
      if (favorited) {
        const item = wishlist.find(w => w.product_id === product.id);
        if (item) {
          await removeFromWishlistContext(item.id);
          setToast({ message: `Berhasil menghapus ${product.name} dari Wishlist`, type: 'info' });
        }
      } else {
        await addToWishlistContext(product.id);
        setToast({ message: `Berhasil menambahkan ${product.name} ke Wishlist!`, type: 'success' });
      }
    } catch (err) {
      setToast({ message: err.message || 'Gagal memperbarui wishlist', type: 'error' });
    } finally {
      setAddingWish(false);
    }
  };

  if (loading) return <section><Loading text="Sedang menyiapkan detail produk..." /></section>;

  if (error || !product) {
    return (
      <section>
        <div className="container error-state">
          <i className="fas fa-exclamation-triangle" />
          <h3>Detail Produk Tidak Tersedia</h3>
          <p>{error || 'Produk mungkin telah dinonaktifkan atau dihapus.'}</p>
          <Link to="/menu" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Kembali ke Menu</Link>
        </div>
      </section>
    );
  }

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(product.price);

  return (
    <main>
      <div className="page-header">
        <div className="container">
          <Link to="/menu" style={{ color: 'var(--primary)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <i className="fas fa-arrow-left" /> Kembali ke Menu Selection
          </Link>
          <h1>Detail <span>Produk</span></h1>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="product-detail-grid animate-fade-up">
            <div className="product-detail-img">
              <img
                src={getProductImageUrl(product.image)}
                alt={product.name}
              />
            </div>
            <div className="product-detail-info">
              <span className="product-detail-category">{product.category_name}</span>
              <h2 className="product-detail-name">{product.name}</h2>
              <div className="product-detail-price">{formattedPrice}</div>
              
              <div>
                {product.stock > 0 ? (
                  <span className="stock-badge in-stock">
                    <i className="fas fa-check" /> Stok Tersedia ({product.stock} pcs)
                  </span>
                ) : (
                  <span className="stock-badge out-of-stock">
                    <i className="fas fa-times" /> Stok Habis
                  </span>
                )}
              </div>

              <p className="product-detail-desc">{product.description}</p>

              {product.stock > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1rem 0' }}>
                  <span style={{ fontWeight: '500' }}>Jumlah:</span>
                  <div className="qty-controls">
                    <button
                      className="qty-btn"
                      onClick={() => setQty(prev => Math.max(1, prev - 1))}
                      disabled={qty <= 1}
                    >
                      -
                    </button>
                    <span className="qty-value">{qty}</span>
                    <button
                      className="qty-btn"
                      onClick={() => setQty(prev => Math.min(product.stock, prev + 1))}
                      disabled={qty >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleCart}
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                  disabled={product.stock <= 0 || addingCart}
                >
                  {addingCart ? <i className="fas fa-spinner fa-spin" /> : <><i className="fas fa-shopping-cart" /> Tambah Keranjang</>}
                </button>
                <button
                  onClick={handleWishlist}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                  disabled={addingWish}
                >
                  {addingWish ? (
                    <i className="fas fa-spinner fa-spin" />
                  ) : (
                    <><i className={favorited ? "fas fa-heart" : "far fa-heart"} style={{ marginRight: '8px' }} /> Wishlist</>
                  )}
                </button>
              </div>
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
