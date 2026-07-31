const db = require('../config/db');

// Helper untuk mendapatkan / membuat Cart ID
const getOrCreateCartId = async (userId = null) => {
  let cartId;
  if (userId) {
    const [userCheck] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
    if (userCheck.length === 0) {
      userId = null;
    }
  }

  if (userId) {
    const [userCarts] = await db.query('SELECT id FROM carts WHERE user_id = ? ORDER BY id DESC LIMIT 1', [userId]);
    if (userCarts.length > 0) {
      cartId = userCarts[0].id;
    } else {
      const [newCart] = await db.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
      cartId = newCart.insertId;
    }
  } else {
    const [guestCarts] = await db.query('SELECT id FROM carts WHERE user_id IS NULL ORDER BY id DESC LIMIT 1');
    if (guestCarts.length > 0) {
      cartId = guestCarts[0].id;
    } else {
      const [newCart] = await db.query('INSERT INTO carts (user_id) VALUES (NULL)');
      cartId = newCart.insertId;
    }
  }
  return cartId;
};

// GET /cart
const getCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const cartId = await getOrCreateCartId(userId);

    const [rows] = await db.query(
      `SELECT ci.id, ci.cart_id, ci.quantity, ci.quantity AS qty, ci.created_at, ci.updated_at,
              p.id AS product_id, p.title, p.title AS name, p.price, p.image, p.stock,
              cat.name AS category_name,
              (p.price * ci.quantity) AS subtotal
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       LEFT JOIN categories cat ON p.category_id = cat.id
       WHERE ci.cart_id = ?
       ORDER BY ci.created_at DESC`,
      [cartId]
    );

    const total = rows.reduce((sum, item) => sum + Number(item.subtotal), 0);
    res.json({ success: true, data: rows, total });
  } catch (err) {
    console.error('GetCart Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /cart
const addToCart = async (req, res) => {
  try {
    const { product_id, quantity, qty } = req.body;
    const itemQty = parseInt(quantity || qty) || 1;
    const userId = req.user ? req.user.id : null;

    if (!product_id) {
      return res.status(400).json({ success: false, message: 'product_id wajib diisi' });
    }

    // Cek produk ada dan aktif
    const [product] = await db.query('SELECT * FROM products WHERE id = ? AND is_active = 1', [product_id]);
    if (product.length === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan atau tidak aktif' });
    }

    const cartId = await getOrCreateCartId(userId);

    // Cek apakah produk sudah ada di cart_items
    const [existing] = await db.query('SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, product_id]);

    if (existing.length > 0) {
      const newQty = existing[0].quantity + itemQty;
      await db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing[0].id]);
      res.json({ success: true, message: 'Kuantitas keranjang diperbarui', qty: newQty, quantity: newQty });
    } else {
      const [result] = await db.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cartId, product_id, itemQty]
      );
      res.status(201).json({ success: true, message: 'Produk ditambahkan ke keranjang', id: result.insertId });
    }
  } catch (err) {
    console.error('AddToCart Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /cart/:id (update quantity)
const updateCartQty = async (req, res) => {
  try {
    const { quantity, qty } = req.body;
    const { id } = req.params;
    const itemQty = parseInt(quantity || qty);

    if (!itemQty || itemQty < 1) {
      return res.status(400).json({ success: false, message: 'Jumlah minimal 1' });
    }

    const [existing] = await db.query('SELECT * FROM cart_items WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Item keranjang tidak ditemukan' });
    }

    await db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [itemQty, id]);
    res.json({ success: true, message: 'Kuantitas keranjang berhasil diupdate' });
  } catch (err) {
    console.error('UpdateCartQty Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /cart/:id
const removeFromCart = async (req, res) => {
  try {
    const [existing] = await db.query('SELECT id FROM cart_items WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Item keranjang tidak ditemukan' });
    }

    await db.query('DELETE FROM cart_items WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Item berhasil dihapus dari keranjang' });
  } catch (err) {
    console.error('RemoveFromCart Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /cart (clear all)
const clearCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const cartId = await getOrCreateCartId(userId);
    await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
    res.json({ success: true, message: 'Keranjang berhasil dikosongkan' });
  } catch (err) {
    console.error('ClearCart Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCart, addToCart, updateCartQty, removeFromCart, clearCart };
