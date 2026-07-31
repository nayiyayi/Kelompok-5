import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { getProductImageUrl } from '../utils/media';

export default function WishlistItem({ item, onRemove, onToast }) {
  const { addItem } = useCart();
  const [addingCart, setAddingCart] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleCart = async () => {
    try {
      setAddingCart(true);
      await addItem(item.product_id, 1);
      if (onToast) onToast(`Berhasil menambahkan ${item.name} ke keranjang!`, 'success');
    } catch (err) {
      if (onToast) onToast(err.message || 'Gagal menambahkan ke keranjang', 'error');
    } finally {
      setAddingCart(false);
    }
  };

  const handleRemove = async () => {
    try {
      setRemoving(true);
      await onRemove(item.id);
      if (onToast) onToast(`Berhasil menghapus ${item.name} dari Wishlist`, 'info');
    } catch (err) {
      if (onToast) onToast(err.message || 'Gagal menghapus dari wishlist', 'error');
    } finally {
      setRemoving(false);
    }
  };

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(item.price);

  return (
    <article className="product-card" style={{ opacity: removing ? 0.6 : 1 }}>
      <div className="product-card__img">
        <img
          src={getProductImageUrl(item.image)}
          alt={item.name}
        />
      </div>
      <div className="product-card__body">
        <span className="product-card__category">{item.category_name || 'Menu'}</span>
        <h3 className="product-card__name">{item.name}</h3>
        <p className="product-card__desc">{item.description}</p>
        <div className="product-card__price">{formattedPrice}</div>
        <div className="product-card__actions">
          <Link to={`/products/${item.product_id}`} className="btn btn-secondary btn-sm">
            Detail
          </Link>
          <button
            onClick={handleRemove}
            className="btn btn-outline btn-sm btn-icon"
            title="Hapus dari Wishlist"
            disabled={removing}
          >
            {removing ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-heart" style={{ color: 'var(--primary)' }} />}
          </button>
          <button
            onClick={handleCart}
            className="btn btn-primary btn-sm"
            disabled={addingCart}
          >
            {addingCart ? <i className="fas fa-spinner fa-spin" /> : <><i className="fas fa-shopping-cart" /> +</>}
          </button>
        </div>
      </div>
    </article>
  );
}
