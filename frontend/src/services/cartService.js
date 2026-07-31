import api from './api';

export const getCart = () => api.get('/cart');
export const addToCart = (product_id, qty = 1) => api.post('/cart', { product_id, qty });
export const updateCartQty = (id, qty) => api.put(`/cart/${id}`, { qty });
export const removeFromCart = (id) => api.delete(`/cart/${id}`);
export const clearCart = () => api.delete('/cart/clear');
