/**
 * ===================================================
 * FILE: reservationController.js
 * ASSIGNED TO: [Nama & NIM Anda]
 * JOBDESK: Controller API Reservasi Meja (MySQL CRUD)
 * ===================================================
 */

const db = require('../config/db');

// ── GET /reservations (Admin) ──────────────────────────────
const getReservations = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM reservations ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('GetReservations Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /reservations/my (Customer Riwayat) ─────────────────
const getMyReservations = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query('SELECT * FROM reservations WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('GetMyReservations Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /reservations/my/:id (Customer Hapus/Selesaikan Riwayat) ─
const deleteMyReservation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const [existing] = await db.query('SELECT id FROM reservations WHERE id = ? AND user_id = ?', [id, userId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Reservasi tidak ditemukan.' });
    }

    await db.query('DELETE FROM reservations WHERE id = ?', [id]);
    res.json({ success: true, message: 'Reservasi telah dikonfirmasi selesai & dihapus dari riwayat.' });
  } catch (err) {
    console.error('DeleteMyReservation Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /reservations ───────────────────────────────────────
const createReservation = async (req, res) => {
  try {
    const { name, phone, date, time, people, note } = req.body;
    let userId = req.user ? req.user.id : null;

    if (userId) {
      const [userCheck] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
      if (userCheck.length === 0) {
        userId = null;
      }
    }

    // Validasi field wajib
    if (!name || !phone || !date || !time || !people) {
      return res.status(400).json({
        success: false,
        message: 'Nama, telepon, tanggal, jam, dan jumlah orang wajib diisi.',
      });
    }

    // Validasi nama
    if (name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Nama minimal 2 karakter.' });
    }

    // Validasi phone (hanya angka, min 10 digit)
    if (!/^\d{10,15}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Nomor HP harus berisi 10-15 angka.' });
    }

    // Validasi tanggal tidak boleh sebelum hari ini
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      return res.status(400).json({ success: false, message: 'Tanggal tidak boleh sebelum hari ini.' });
    }

    // Validasi jumlah orang
    const peopleCount = parseInt(people);
    if (isNaN(peopleCount) || peopleCount < 1 || peopleCount > 50) {
      return res.status(400).json({ success: false, message: 'Jumlah orang harus antara 1 dan 50.' });
    }

    const [result] = await db.query(
      'INSERT INTO reservations (user_id, name, phone, date, time, people, note) VALUES (?,?,?,?,?,?,?)',
      [userId, name.trim(), phone, date, time, peopleCount, note ? note.trim() : null]
    );

    res.status(201).json({
      success: true,
      message: `Reservasi berhasil! Terima kasih ${name.trim()}, kami tunggu kedatangan Anda pada ${date} pukul ${time}.`,
      id: result.insertId,
    });
  } catch (err) {
    console.error('CreateReservation Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /reservations/:id (admin) ────────────────────────────
const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status harus salah satu dari: ${validStatuses.join(', ')}.`,
      });
    }

    const [existing] = await db.query('SELECT id FROM reservations WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Reservasi tidak ditemukan.' });
    }

    await db.query('UPDATE reservations SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: `Status reservasi diperbarui menjadi ${status}.` });
  } catch (err) {
    console.error('UpdateReservationStatus Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /reservations/:id (admin) ─────────────────────────
const deleteReservation = async (req, res) => {
  try {
    const [existing] = await db.query('SELECT id FROM reservations WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Reservasi tidak ditemukan.' });
    }

    await db.query('DELETE FROM reservations WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Reservasi berhasil dihapus.' });
  } catch (err) {
    console.error('DeleteReservation Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getReservations, getMyReservations, deleteMyReservation, createReservation, updateReservationStatus, deleteReservation };
