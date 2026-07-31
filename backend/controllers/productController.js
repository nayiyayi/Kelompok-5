const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ── Pastikan folder uploads ada ───────────────────────────────
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ── Multer config for image upload ────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extOk = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowedTypes.test(file.mimetype);
    if (extOk && mimeOk) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diizinkan (jpeg, jpg, png, webp, gif)!'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ── GET /products?category_id=&search=&sort=&min_price=&max_price= ──
const getProducts = async (req, res) => {
  try {
    const { category_id, search, sort, min_price, max_price } = req.query;

    let sql = `
      SELECT p.*, p.title AS name, c.name AS category_name, c.key AS category_key
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
    `;
    const params = [];

    if (category_id) {
      sql += ' AND p.category_id = ?';
      params.push(category_id);
    }
    if (search) {
      sql += ' AND (p.title LIKE ? OR p.description LIKE ? OR c.name LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    if (min_price) {
      sql += ' AND p.price >= ?';
      params.push(Number(min_price));
    }
    if (max_price) {
      sql += ' AND p.price <= ?';
      params.push(Number(max_price));
    }

    // Sorting
    switch (sort) {
      case 'price_asc':   sql += ' ORDER BY p.price ASC';       break;
      case 'price_desc':  sql += ' ORDER BY p.price DESC';      break;
      case 'name_asc':    sql += ' ORDER BY p.title ASC';       break;
      case 'name_desc':   sql += ' ORDER BY p.title DESC';      break;
      case 'newest':      sql += ' ORDER BY p.created_at DESC'; break;
      case 'popular':     sql += ' ORDER BY p.rating DESC, p.reviews DESC'; break;
      default:            sql += ' ORDER BY p.created_at DESC'; break;
    }

    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows, total: rows.length });
  } catch (err) {
    console.error('GetProducts Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /products/:id ────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, p.title AS name, c.name AS category_name, c.key AS category_key
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('GetProductById Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /products (dengan upload gambar) ────────────────────
const createProduct = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { category_id, title, name, description, price, rating, reviews, badge, stock, is_active, status } = req.body;
      const productTitle = title || name;

      if (!productTitle || !price) {
        return res.status(400).json({ success: false, message: 'Judul/nama dan harga produk wajib diisi.' });
      }

      if (isNaN(Number(price)) || Number(price) < 0) {
        return res.status(400).json({ success: false, message: 'Harga harus berupa angka positif.' });
      }

      const catId = parseInt(category_id) || 1;
      const [cat] = await db.query('SELECT id FROM categories WHERE id = ?', [catId]);
      if (cat.length === 0) {
        return res.status(400).json({ success: false, message: 'Kategori tidak ditemukan.' });
      }

      const image = req.file ? req.file.filename : null;
      const activeState = is_active !== undefined ? (is_active ? 1 : 0) : (status === 'inactive' ? 0 : 1);

      const [result] = await db.query(
        'INSERT INTO products (category_id, title, description, price, rating, reviews, badge, stock, image, is_active) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [
          catId,
          productTitle.trim(),
          description || '',
          Number(price),
          rating ? Number(rating) : 4.50,
          reviews ? parseInt(reviews) : 10,
          badge || null,
          parseInt(stock) || 0,
          image,
          activeState,
        ]
      );

      res.status(201).json({
        success: true,
        message: 'Produk berhasil ditambahkan.',
        id: result.insertId,
      });
    } catch (err) {
      console.error('CreateProduct Error:', err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  },
];

// ── PUT /products/:id ────────────────────────────────────────
const updateProduct = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { category_id, title, name, description, price, rating, reviews, badge, stock, is_active, status } = req.body;
      const { id } = req.params;

      const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
      if (existing.length === 0) {
        return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
      }

      const prod = existing[0];
      const image = req.file ? req.file.filename : prod.image;
      const updatedTitle = title || name ? (title || name).trim() : prod.title;
      const activeState = is_active !== undefined ? (is_active ? 1 : 0) : (status ? (status === 'active' ? 1 : 0) : prod.is_active);

      await db.query(
        'UPDATE products SET category_id=?, title=?, description=?, price=?, rating=?, reviews=?, badge=?, stock=?, image=?, is_active=? WHERE id=?',
        [
          parseInt(category_id) || prod.category_id,
          updatedTitle,
          description !== undefined ? description : prod.description,
          price ? Number(price) : prod.price,
          rating ? Number(rating) : prod.rating,
          reviews !== undefined ? parseInt(reviews) : prod.reviews,
          badge !== undefined ? badge : prod.badge,
          stock !== undefined ? parseInt(stock) : prod.stock,
          image,
          activeState,
          id,
        ]
      );

      res.json({ success: true, message: 'Produk berhasil diperbarui.' });
    } catch (err) {
      console.error('UpdateProduct Error:', err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  },
];

// ── DELETE /products/:id ─────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const [existing] = await db.query('SELECT id, image FROM products WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    }

    const prod = existing[0];
    if (prod.image && /^\d+-/.test(prod.image)) {
      const imgPath = path.join(uploadsDir, prod.image);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Produk berhasil dihapus.' });
  } catch (err) {
    console.error('DeleteProduct Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
