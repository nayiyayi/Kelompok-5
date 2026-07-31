const express = require('express');
const router = express.Router();
const {
  getReservations,
  getMyReservations,
  deleteMyReservation,
  createReservation,
  updateReservationStatus,
  deleteReservation
} = require('../controllers/reservationController');
const { verifyToken, verifyAdmin, optionalToken } = require('../middleware/auth');

// GET /reservations/my - Riwayat reservasi milik user yang login
router.get('/my', verifyToken, getMyReservations);

// DELETE /reservations/my/:id - Hapus/Selesaikan reservasi milik user
router.delete('/my/:id', verifyToken, deleteMyReservation);

// GET /reservations - lihat semua (admin)
router.get('/', verifyToken, verifyAdmin, getReservations);

// POST /reservations - buat reservasi baru (opsional token jika logged-in)
router.post('/', optionalToken, createReservation);

// PUT /reservations/:id - update status (admin)
router.put('/:id', verifyToken, verifyAdmin, updateReservationStatus);

// DELETE /reservations/:id - hapus (admin)
router.delete('/:id', verifyToken, verifyAdmin, deleteReservation);

module.exports = router;
