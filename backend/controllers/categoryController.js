const db = require('../config/db');

// ── GET /categories ──────────────────────────────────────────
const getCategories = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY id ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('GetCategories Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /categories (admin) ─────────────────────────────────
const createCategory = async (req, res) => {
  try {
    const { key, name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi.' });
    }

    const catKey = key ? key.trim().toLowerCase() : name.trim().toLowerCase().replace(/\s+/g, '-');

    const [existing] = await db.query('SELECT id FROM categories WHERE `key` = ? OR name = ?', [catKey, name.trim()]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Kategori sudah ada.' });
    }

    const [result] = await db.query(
      'INSERT INTO categories (`key`, name, description) VALUES (?, ?, ?)',
      [catKey, name.trim(), description || null]
    );

    res.status(201).json({ success: true, message: 'Kategori berhasil ditambahkan.', id: result.insertId });
  } catch (err) {
    console.error('CreateCategory Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /categories/:id (admin) ──────────────────────────────
const updateCategory = async (req, res) => {
  try {
    const { key, name, description } = req.body;
    const { id } = req.params;

    const [existing] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
    }

    const currentCat = existing[0];
    const updatedName = name ? name.trim() : currentCat.name;
    const updatedKey = key ? key.trim().toLowerCase() : currentCat.key;
    const updatedDesc = description !== undefined ? description : currentCat.description;

    await db.query(
      'UPDATE categories SET `key` = ?, name = ?, description = ? WHERE id = ?',
      [updatedKey, updatedName, updatedDesc, id]
    );

    res.json({ success: true, message: 'Kategori berhasil diperbarui.' });
  } catch (err) {
    console.error('UpdateCategory Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /categories/:id (admin) ───────────────────────────
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT id FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
    }

    // Cek apakah ada produk yang menggunakan kategori ini
    const [products] = await db.query('SELECT COUNT(*) AS count FROM products WHERE category_id = ?', [id]);
    if (products[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: `Kategori tidak bisa dihapus karena masih digunakan oleh ${products[0].count} produk.`,
      });
    }

    await db.query('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ success: true, message: 'Kategori berhasil dihapus.' });
  } catch (err) {
    console.error('DeleteCategory Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
