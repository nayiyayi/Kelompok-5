import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, addToCart, updateCartQty, removeFromCart, clearCart } from '../services/cartService';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCart();
      setCart(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch {
      setCart([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addItem = async (product_id, qty = 1) => {
    await addToCart(product_id, qty);
    await fetchCart();
  };

  const updateQty = async (id, qty) => {
    await updateCartQty(id, qty);
    await fetchCart();
  };

  const removeItem = async (id) => {
    await removeFromCart(id);
    await fetchCart();
  };

  const clearAll = async () => {
    await clearCart();
    await fetchCart();
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, total, loading, cartCount, addItem, updateQty, removeItem, clearAll, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
