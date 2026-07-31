const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const SALT_ROUNDS = 10;

// ── POST /auth/register ──────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validasi input
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nama, email, dan password wajib diisi.' });
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Format email tidak valid.' });
    }

    // Validasi panjang password
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password minimal 6 karakter.' });
    }

    // Cek apakah email sudah digunakan
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Simpan user baru
    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.toLowerCase(), hashedPassword, 'customer', phone ? phone.trim() : null]
    );

    // Buat token
    const token = jwt.sign(
      { id: result.insertId, name: name.trim(), email: email.toLowerCase(), role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: `Registrasi berhasil! Selamat datang, ${name.trim()}.`,
      token,
      user: {
        id: result.insertId,
        name: name.trim(),
        email: email.toLowerCase(),
        phone: phone ? phone.trim() : null,
        role: 'customer',
      },
    });
  } catch (err) {
    console.error('Register Error:', err.message);
    res.status(500).json({ success: false, message: 'Gagal mendaftarkan akun. Silakan coba lagi.' });
  }
};

// ── POST /auth/login ─────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });
    }

    // Cari user
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }

    const user = users[0];

    // Verifikasi password (password_hash)
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }

    // Buat token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: `Selamat datang kembali, ${user.name}!`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ success: false, message: 'Gagal login. Silakan coba lagi.' });
  }
};

// ── GET /auth/profile ────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, phone, role, created_at, updated_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    res.json({ success: true, data: users[0] });
  } catch (err) {
    console.error('GetProfile Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /auth/profile ────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const userId = req.user.id;

    if (!name && !email && phone === undefined) {
      return res.status(400).json({ success: false, message: 'Tidak ada data yang diperbarui.' });
    }

    const [current] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (current.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    const updatedName = name ? name.trim() : current[0].name;
    const updatedEmail = email ? email.toLowerCase() : current[0].email;
    const updatedPhone = phone !== undefined ? phone.trim() : current[0].phone;

    // Cek email tidak dipakai user lain
    if (email && email.toLowerCase() !== current[0].email) {
      const [emailCheck] = await db.query('SELECT id FROM users WHERE email = ? AND id != ?', [updatedEmail, userId]);
      if (emailCheck.length > 0) {
        return res.status(409).json({ success: false, message: 'Email sudah digunakan akun lain.' });
      }
    }

    await db.query('UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?', [updatedName, updatedEmail, updatedPhone, userId]);

    res.json({ success: true, message: 'Profil berhasil diperbarui.' });
  } catch (err) {
    console.error('UpdateProfile Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /auth/change-password ───────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Password lama dan baru wajib diisi.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password baru minimal 6 karakter.' });
    }

    const [users] = await db.query('SELECT password_hash FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, users[0].password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Password lama tidak sesuai.' });
    }

    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashed, userId]);

    res.json({ success: true, message: 'Password berhasil diubah.' });
  } catch (err) {
    console.error('ChangePassword Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /auth/users (admin only) ─────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, phone, role, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('GetAllUsers Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /auth/users/:id (admin only) ──────────────────────
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Tidak bisa menghapus akun sendiri.' });
    }

    const [existing] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true, message: 'User berhasil dihapus.' });
  } catch (err) {
    console.error('DeleteUser Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, getProfile, updateProfile, changePassword, getAllUsers, deleteUser };
