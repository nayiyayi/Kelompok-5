const db = require('../config/db');

// ── POST /orders ─────────────────────────────────────────────
const createOrder = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const {
      name, full_name,
      email,
      phone,
      address,
      province,
      postal_code,
      note, notes,
      payment_method,
      shipping,
      tax,
      items
    } = req.body;

    let userId = req.user ? req.user.id : null;

    if (userId) {
      const [userCheck] = await conn.query('SELECT id FROM users WHERE id = ?', [userId]);
      if (userCheck.length === 0) {
        userId = null;
      }
    }
    const customerFullName = (full_name || name || '').trim();
    const orderNotes = notes || note || null;
    const paymentMethod = (payment_method || 'cod').toLowerCase();

    // Validasi
    if (!customerFullName || !phone || !address) {
      return res.status(400).json({ success: false, message: 'Nama lengkap, nomor HP, dan alamat wajib diisi.' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Tidak ada item yang dipesan.' });
    }
    if (!/^\d+$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Nomor HP hanya boleh berisi angka.' });
    }

    await conn.beginTransaction();

    // Hitung total dan persiapkan order items
    let subtotalTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const pId = item.product_id || item.id;
      const [product] = await conn.query(
        `SELECT p.id, p.title, p.price, p.image, p.stock, c.name AS category_name
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.id = ? AND p.is_active = 1`,
        [pId]
      );

      if (product.length === 0) {
        await conn.rollback();
        return res.status(404).json({ success: false, message: `Produk ID ${pId} tidak ditemukan atau tidak aktif.` });
      }

      const prod = product[0];
      const itemQty = parseInt(item.quantity || item.qty) || 1;
      const itemSubtotal = prod.price * itemQty;
      subtotalTotal += itemSubtotal;

      orderItems.push({
        product_id: prod.id,
        title: prod.title,
        price: prod.price,
        quantity: itemQty,
        image: prod.image,
        category: prod.category_name || 'Umum',
      });
    }

    const shippingFee = shipping !== undefined ? Number(shipping) : 10000; // default 10k shipping
    const taxFee = tax !== undefined ? Number(tax) : Math.round(subtotalTotal * 0.1); // 10% tax
    const grandTotal = subtotalTotal + shippingFee + taxFee;

    // Insert order ke tabel `orders`
    const [orderResult] = await conn.query(
      `INSERT INTO orders
        (user_id, status, full_name, email, phone, address, province, postal_code, notes, payment_method, total, shipping, tax, grand_total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        'pending',
        customerFullName,
        email || (req.user ? req.user.email : null),
        phone,
        address.trim(),
        province || 'D.I. Yogyakarta',
        postal_code || '55000',
        orderNotes,
        paymentMethod,
        subtotalTotal,
        shippingFee,
        taxFee,
        grandTotal,
      ]
    );

    const orderId = orderResult.insertId;

    // Insert order items ke `order_items`
    for (const item of orderItems) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, title, price, quantity, image, category)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.title, item.price, item.quantity, item.image, item.category]
      );
    }

    // Insert payment record ke `payments`
    await conn.query(
      `INSERT INTO payments (order_id, provider, status, amount, paid_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        orderId,
        paymentMethod === 'cod' ? 'COD' : 'Bank Transfer',
        'pending',
        grandTotal,
        null,
      ]
    );

    // Kosongkan cart_items jika cart ada
    if (userId) {
      const [userCarts] = await conn.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
      if (userCarts.length > 0) {
        await conn.query('DELETE FROM cart_items WHERE cart_id = ?', [userCarts[0].id]);
      }
    } else {
      const [guestCarts] = await conn.query('SELECT id FROM carts WHERE user_id IS NULL');
      if (guestCarts.length > 0) {
        await conn.query('DELETE FROM cart_items WHERE cart_id = ?', [guestCarts[0].id]);
      }
    }

    await conn.commit();

    res.status(201).json({
      success: true,
      message: `Pesanan berhasil dibuat! Terima kasih ${customerFullName}, pesananmu sedang diproses.`,
      order_id: orderId,
      total: grandTotal,
    });
  } catch (err) {
    await conn.rollback();
    console.error('CreateOrder Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
};

// ── GET /orders/my (Customer Riwayat) ────────────────────────
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const [orders] = await db.query(
      'SELECT o.*, o.full_name AS customer_name, o.notes AS note FROM orders o WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    for (let order of orders) {
      const [items] = await db.query(
        'SELECT oi.*, oi.title AS name, oi.quantity AS qty, (oi.price * oi.quantity) AS subtotal FROM order_items oi WHERE order_id = ?',
        [order.id]
      );
      order.items = items;

      const [payments] = await db.query('SELECT * FROM payments WHERE order_id = ?', [order.id]);
      order.payment = payments.length > 0 ? payments[0] : null;
    }

    res.json({ success: true, data: orders });
  } catch (err) {
    console.error('GetMyOrders Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /orders/my/:id (Customer Hapus Riwayat Pesanan) ─────
const deleteMyOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const [existing] = await db.query('SELECT id FROM orders WHERE id = ? AND user_id = ?', [id, userId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    await db.query('DELETE FROM payments WHERE order_id = ?', [id]);
    await db.query('DELETE FROM order_items WHERE order_id = ?', [id]);
    await db.query('DELETE FROM orders WHERE id = ?', [id]);

    res.json({ success: true, message: 'Pesanan telah dihapus dari riwayat.' });
  } catch (err) {
    console.error('DeleteMyOrder Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /orders/my/:id/complete (Customer Konfirmasi Pesanan Diterima) ─
const completeMyOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const [existing] = await db.query('SELECT id FROM orders WHERE id = ? AND user_id = ?', [id, userId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    await db.query('UPDATE orders SET status = "delivered" WHERE id = ?', [id]);
    await db.query('UPDATE payments SET status = "paid", paid_at = CURRENT_TIMESTAMP WHERE order_id = ?', [id]);

    res.json({ success: true, message: 'Terima kasih! Pesanan telah dikonfirmasi selesai.' });
  } catch (err) {
    console.error('CompleteMyOrder Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /orders (admin) ──────────────────────────────────────
const getOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, o.full_name AS customer_name, o.notes AS note, COUNT(oi.id) AS item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    res.json({ success: true, data: orders });
  } catch (err) {
    console.error('GetOrders Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /orders/:id ──────────────────────────────────────────
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await db.query('SELECT o.*, o.full_name AS customer_name, o.notes AS note FROM orders o WHERE id = ?', [id]);
    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    const [items] = await db.query('SELECT oi.*, oi.title AS name, oi.quantity AS qty, (oi.price * oi.quantity) AS subtotal FROM order_items oi WHERE order_id = ?', [id]);
    const [payments] = await db.query('SELECT * FROM payments WHERE order_id = ?', [id]);

    res.json({ success: true, data: { ...orders[0], items, payment: payments[0] || null } });
  } catch (err) {
    console.error('GetOrderById Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /orders/:id (update status - admin) ──────────────────
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status harus salah satu dari: ${validStatuses.join(', ')}.`,
      });
    }

    const [existing] = await db.query('SELECT id FROM orders WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    if (status === 'delivered') {
      await db.query('UPDATE payments SET status = "paid", paid_at = CURRENT_TIMESTAMP WHERE order_id = ?', [id]);
    }
    res.json({ success: true, message: `Status pesanan diperbarui menjadi ${status}.` });
  } catch (err) {
    console.error('UpdateOrderStatus Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /orders/:id (admin) ───────────────────────────────
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT id FROM orders WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    await db.query('DELETE FROM payments WHERE order_id = ?', [id]);
    await db.query('DELETE FROM order_items WHERE order_id = ?', [id]);
    await db.query('DELETE FROM orders WHERE id = ?', [id]);

    res.json({ success: true, message: 'Pesanan berhasil dihapus.' });
  } catch (err) {
    console.error('DeleteOrder Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createOrder, getOrders, getMyOrders, deleteMyOrder, completeMyOrder, getOrderById, updateOrderStatus, deleteOrder };
