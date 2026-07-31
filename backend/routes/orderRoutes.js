const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getMyOrders,
  deleteMyOrder,
  completeMyOrder,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');
const { verifyToken, verifyAdmin, optionalToken } = require('../middleware/auth');

// POST /orders - buat order baru (opsional token)
router.post('/', optionalToken, createOrder);

// GET /orders/my - lihat riwayat order milik user
router.get('/my', verifyToken, getMyOrders);

// DELETE /orders/my/:id - hapus/selesaikan riwayat order user
router.delete('/my/:id', verifyToken, deleteMyOrder);

// PUT /orders/my/:id/complete - konfirmasi pesanan diterima/selesai
router.put('/my/:id/complete', verifyToken, completeMyOrder);

// GET /orders - lihat semua order (admin)
router.get('/', verifyToken, verifyAdmin, getOrders);

// GET /orders/:id - lihat detail order (admin)
router.get('/:id', verifyToken, verifyAdmin, getOrderById);

// PUT /orders/:id - update status order (admin)
router.put('/:id', verifyToken, verifyAdmin, updateOrderStatus);

// DELETE /orders/:id - hapus order (admin)
router.delete('/:id', verifyToken, verifyAdmin, deleteOrder);

module.exports = router;
