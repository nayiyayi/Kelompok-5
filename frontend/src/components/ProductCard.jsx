import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useState } from 'react';
import { getProductImageUrl } from '../utils/media';

export default function ProductCard({ product, onToast }) {
  const { addItem } = useCart();
  const { isWishlisted, addItem: addToWishlistContext, removeItem: removeFromWishlistContext, wishlist } = useWishlist();
  const [addingCart, setAddingCart] = useState(false);
  const [addingWish, setAddingWish] = useState(false);

  const favorited = isWishlisted(product.id);

  const handleCart = async () => {
    try {
      setAddingCart(true);
      await addItem(product.id, 1);
      if (onToast) onToast(`Berhasil menambahkan ${product.name} ke Keranjang!`, 'success');
    } catch (err) {
      if (onToast) onToast(err.message || 'Gagal menambahkan ke keranjang', 'error');
    } finally {
      setAddingCart(false);
    }
  };

  const handleWishlist = async () => {
    try {
      setAddingWish(true);
      if (favorited) {
        // Cari id wishlist
        const item = wishlist.find(w => w.product_id === product.id);
        if (item) {
          await removeFromWishlistContext(item.id);
          if (onToast) onToast(`Berhasil menghapus ${product.name} dari Wishlist`, 'info');
        }
      } else {
        await addToWishlistContext(product.id);
        if (onToast) onToast(`Berhasil menambahkan ${product.name} ke Wishlist!`, 'success');
      }
    } catch (err) {
      if (onToast) onToast(err.message || 'Gagal memperbarui wishlist', 'error');
    } finally {
      setAddingWish(false);
    }
  };

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(product.price);

  return (
    <article className="product-card">
      <div className="product-card__img">
        <img 
          src={getProductImageUrl(product.image)} 
          alt={product.name} 
        />
        {product.stock <= 0 && <span className="product-card__badge" style={{ background: '#dc3545' }}>Habis</span>}
      </div>
      <div className="product-card__body">
        <span className="product-card__category">{product.category_name || 'Menu'}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__desc">{product.description}</p>
        <div className="product-card__price">{formattedPrice}</div>
        <div className="product-card__actions">
          <Link to={`/products/${product.id}`} className="btn btn-secondary btn-sm">
            Detail
          </Link>
          <button 
            onClick={handleWishlist} 
            className="btn btn-outline btn-sm btn-icon" 
            title={favorited ? "Hapus dari Wishlist" : "Tambah ke Wishlist"}
            disabled={addingWish}
          >
            <i className={addingWish ? "fas fa-spinner fa-spin" : (favorited ? "fas fa-heart" : "far fa-heart")} style={{ color: favorited ? 'var(--primary)' : 'inherit' }} />
          </button>
          <button 
            onClick={handleCart} 
            className="btn btn-primary btn-sm"
            disabled={product.stock <= 0 || addingCart}
          >
            {addingCart ? <i className="fas fa-spinner fa-spin" /> : <><i className="fas fa-shopping-cart" /> +</>}
          </button>
        </div>
      </div>
    </article>
  );
}
