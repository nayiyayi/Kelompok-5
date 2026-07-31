const db = require('../config/db');

// Helper untuk mendapatkan / membuat Wishlist ID
const getOrCreateWishlistId = async (userId = null) => {
  let wishlistId;
  if (userId) {
    const [userCheck] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
    if (userCheck.length === 0) {
      userId = null;
    }
  }

  if (userId) {
    const [userWishlists] = await db.query('SELECT id FROM wishlist WHERE user_id = ? ORDER BY id DESC LIMIT 1', [userId]);
    if (userWishlists.length > 0) {
      wishlistId = userWishlists[0].id;
    } else {
      const [newWishlist] = await db.query('INSERT INTO wishlist (user_id) VALUES (?)', [userId]);
      wishlistId = newWishlist.insertId;
    }
  } else {
    const [guestWishlists] = await db.query('SELECT id FROM wishlist WHERE user_id IS NULL ORDER BY id DESC LIMIT 1');
    if (guestWishlists.length > 0) {
      wishlistId = guestWishlists[0].id;
    } else {
      const [newWishlist] = await db.query('INSERT INTO wishlist (user_id) VALUES (NULL)');
      wishlistId = newWishlist.insertId;
    }
  }
  return wishlistId;
};

// GET /wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const wishlistId = await getOrCreateWishlistId(userId);

    const [rows] = await db.query(
      `SELECT wi.id, wi.wishlist_id, wi.created_at, wi.updated_at,
              p.id AS product_id, p.title, p.title AS name, p.price, p.image, p.description,
              c.name AS category_name
       FROM wishlist_items wi
       JOIN products p ON wi.product_id = p.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE wi.wishlist_id = ?
       ORDER BY wi.created_at DESC`,
      [wishlistId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('GetWishlist Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /wishlist
const addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!product_id) {
      return res.status(400).json({ success: false, message: 'product_id wajib diisi' });
    }

    // Cek produk ada
    const [product] = await db.query('SELECT id, title FROM products WHERE id = ?', [product_id]);
    if (product.length === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    const wishlistId = await getOrCreateWishlistId(userId);

    // Cek sudah ada di wishlist_items
    const [existing] = await db.query('SELECT id FROM wishlist_items WHERE wishlist_id = ? AND product_id = ?', [wishlistId, product_id]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Produk sudah ada di wishlist' });
    }

    const [result] = await db.query(
      'INSERT INTO wishlist_items (wishlist_id, product_id, title) VALUES (?, ?, ?)',
      [wishlistId, product_id, product[0].title]
    );

    res.status(201).json({ success: true, message: 'Produk ditambahkan ke wishlist', id: result.insertId });
  } catch (err) {
    console.error('AddToWishlist Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /wishlist/:id
const removeFromWishlist = async (req, res) => {
  try {
    const [existing] = await db.query('SELECT id FROM wishlist_items WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Item wishlist tidak ditemukan' });
    }

    await db.query('DELETE FROM wishlist_items WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Produk berhasil dihapus dari wishlist' });
  } catch (err) {
    console.error('RemoveFromWishlist Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
