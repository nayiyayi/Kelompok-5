const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartQty, removeFromCart, clearCart } = require('../controllers/cartController');

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:id', updateCartQty);
// PENTING: DELETE /clear harus SEBELUM DELETE /:id agar tidak ter-capture sebagai :id = 'clear'
router.delete('/clear', clearCart);
router.delete('/:id', removeFromCart);

module.exports = router;
