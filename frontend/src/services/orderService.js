import api from './api';

// Buat order baru (checkout)
export const createOrder = (data) => api.post('/orders', data);

// Ambil riwayat order user
export const getMyOrders = () => api.get('/orders/my');

// Hapus/hilangkan order dari riwayat user
export const deleteMyOrder = (id) => api.delete(`/orders/my/${id}`);

// Konfirmasi order telah diterima/selesai
export const completeMyOrder = (id) => api.put(`/orders/my/${id}/complete`);

// Ambil semua order (admin)
export const getOrders = () => api.get('/orders');

// Ambil detail order by ID (admin)
export const getOrderById = (id) => api.get(`/orders/${id}`);

// Update status order (admin)
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}`, { status });

// Hapus order (admin)
export const deleteOrder = (id) => api.delete(`/orders/${id}`);
