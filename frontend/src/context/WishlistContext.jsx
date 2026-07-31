import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWishlist, addToWishlist, removeFromWishlist } from '../services/wishlistService';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getWishlist();
      setWishlist(res.data.data || []);
    } catch {
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const addItem = async (product_id) => {
    await addToWishlist(product_id);
    await fetchWishlist();
  };

  const removeItem = async (id) => {
    await removeFromWishlist(id);
    await fetchWishlist();
  };

  const isWishlisted = (product_id) => wishlist.some(w => w.product_id === product_id);

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider value={{ wishlist, loading, wishlistCount, addItem, removeItem, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
