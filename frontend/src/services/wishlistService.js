import api from './api';

export const getWishlist = () => api.get('/wishlist');
export const addToWishlist = (product_id) => api.post('/wishlist', { product_id });
export const removeFromWishlist = (id) => api.delete(`/wishlist/${id}`);
