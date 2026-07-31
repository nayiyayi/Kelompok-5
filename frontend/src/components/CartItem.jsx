import { useState } from 'react';
import { getProductImageUrl } from '../utils/media';

export default function CartItem({ item, onUpdateQty, onRemove, onToast }) {
  const [updating, setUpdating] = useState(false);

  const handleQtyChange = async (newQty) => {
    if (newQty < 1) return;
    try {
      setUpdating(true);
      await onUpdateQty(item.id, newQty);
    } catch (err) {
      if (onToast) onToast(err.message || 'Gagal mengubah kuantitas', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      setUpdating(true);
      await onRemove(item.id);
      if (onToast) onToast(`Berhasil menghapus ${item.name} dari keranjang`, 'info');
    } catch (err) {
      if (onToast) onToast(err.message || 'Gagal menghapus produk', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(item.price);

  const formattedSubtotal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(item.subtotal);

  return (
    <div className="cart-item" style={{ opacity: updating ? 0.6 : 1 }}>
      <img
        src={getProductImageUrl(item.image)}
        alt={item.name}
        className="cart-item__img"
      />
      <div className="cart-item__info">
        <h4 className="cart-item__name">{item.name}</h4>
        <p className="cart-item__price">{formattedPrice}</p>
      </div>
      <div className="qty-controls">
        <button
          className="qty-btn"
          onClick={() => handleQtyChange(item.qty - 1)}
          disabled={item.qty <= 1 || updating}
        >
          -
        </button>
        <span className="qty-value">{item.qty}</span>
        <button
          className="qty-btn"
          onClick={() => handleQtyChange(item.qty + 1)}
          disabled={updating}
        >
          +
        </button>
      </div>
      <div className="cart-item__subtotal">{formattedSubtotal}</div>
      <button
        onClick={handleRemove}
        className="btn btn-danger btn-icon btn-sm"
        style={{ marginLeft: '15px' }}
        title="Hapus item"
        disabled={updating}
      >
        <i className="fas fa-trash" />
      </button>
    </div>
  );
}
