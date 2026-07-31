import api from './api';

export const getReservations = () => api.get('/reservations');
export const getMyReservations = () => api.get('/reservations/my');
export const deleteMyReservation = (id) => api.delete(`/reservations/my/${id}`);
export const createReservation = (data) => api.post('/reservations', data);
export const updateReservationStatus = (id, status) => api.put(`/reservations/${id}`, { status });
export const deleteReservation = (id) => api.delete(`/reservations/${id}`);
