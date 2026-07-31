# Kopi Kombo - Premium Cafe Fullstack Application

Aplikasi Fullstack modern berbasis **React JS**, **Express.js**, dan **MySQL** yang diubah dari website statis sebelumnya. Menggunakan arsitektur terpisah (Decoupled Architecture) antara Frontend dan Backend.

## 🚀 Fitur Utama
* **Menu Selection**: Mengambil daftar menu kopi & non-kopi dinamis langsung dari database MySQL.
* **Search & Filter & Sort**: Cari menu berdasarkan nama, saring berdasarkan kategori (Kopi / Non-Kopi), dan urutkan berdasarkan Harga Termurah, Termahal, atau Abjad A-Z secara real-time.
* **Shopping Cart & Wishlist**: Fungsionalitas penuh keranjang belanja dan daftar keinginan (Wishlist) yang terhubung ke REST API MySQL dengan Context API untuk state management global.
* **Reservasi Meja (Dine-In Booking)**: Form reservasi lengkap dengan validasi nomor HP (angka saja), validasi tanggal minimal hari ini, dan tersimpan langsung ke MySQL.
* **Checkout Form**: Halaman checkout pesanan dengan validasi data pengiriman dan pembersihan keranjang otomatis setelah checkout sukses.
* **Rekomendasi Produk (Public API)**: Mengambil 10 data eksternal secara dinamis menggunakan **Axios** dari `https://fakestoreapi.com/products` dilengkapi dengan loading spinner dan error handling.

---

## 🛠️ Teknologi yang Digunakan

### Frontend
* **React JS** (Vite template)
* **React Router DOM** (Single Page Application routing)
* **Axios** (HTTP request handler ke Backend & Public API)
* **Context API** (State management global untuk Cart, Wishlist, dan Products)
* **Vanilla CSS** (Responsive design dengan Flexbox, CSS Grid, Media Queries, dan Smooth Transitions)

### Backend
* **Node.js** & **Express.js** (Server & API Development)
* **MySQL2** (Driver koneksi database MySQL dengan Connection Pool)
* **CORS** (Cross-Origin Resource Sharing)
* **Dotenv** (Manajemen Environment Variables)
* **Multer** (Penanganan upload gambar produk baru)
* **Nodemon** (Auto-restart server saat masa development)

### Database
* **MySQL** (XAMPP / phpMyAdmin)

---

## 📁 Struktur Folder Project

```text
combo-project/
├── frontend/                  # React Application
│   ├── public/
│   │   └── assets/            # Video, gambar, dan ikon cafe (salinan dari statis)
│   ├── src/
│   │   ├── components/        # Reusable UI Components (Navbar, Footer, ProductCard, dll)
│   │   ├── context/           # CartContext, WishlistContext, ProductContext
│   │   ├── pages/             # Pages (Home, Menu, ProductDetail, Reservasi, dll)
│   │   ├── services/          # API Services (Axios Instance & HTTP Requests)
│   │   ├── App.jsx            # Router and Provider Wrapper
│   │   ├── index.css          # CSS Design System
│   │   └── main.jsx           # App entry point
│   ├── index.html
│   └── package.json
│
├── backend/                   # Node.js + Express.js API
│   ├── config/
│   │   └── db.js              # MySQL Connection Pool Config
│   ├── controllers/           # API Logic Controllers (product, cart, reservation, dll)
│   ├── routes/                # API Route Definitions
│   ├── uploads/               # Folder penyimpanan gambar yang diupload
│   ├── app.js                 # Express Application Setup
│   ├── server.js              # Entrypoint server (Port 5000)
│   └── package.json
│
├── database/
│   └── kopi_kombo.sql         # File SQL database siap import
├── .gitignore
└── README.md
```

---

## 💾 Cara Import Database

1. Buka control panel **XAMPP** dan jalankan modul **Apache** dan **MySQL**.
2. Buka browser dan akses **http://localhost/phpmyadmin**.
3. Buat database baru dengan nama `kopi_kombo`.
4. Pilih database `kopi_kombo`, lalu klik tab **Import** di bagian atas.
5. Klik **Choose File** / **Browse** dan pilih file `kopi_kombo.sql` yang berada di dalam folder `database/` project ini.
6. Klik tombol **Go** / **Import** di bagian bawah. Database telah siap!

---

## ⚙️ Cara Menjalankan Backend

1. Buka terminal/cmd dan masuk ke direktori backend:
   ```bash
   cd backend
   ```
2. Pastikan file `.env` sudah sesuai (DB_HOST, DB_USER, DB_PASSWORD, dll).
3. Instal seluruh dependensi:
   ```bash
   npm install
   ```
4. Jalankan backend dalam mode development:
   ```bash
   npm run dev
   ```
5. Server backend akan berjalan di **http://localhost:5000**.

---

## 💻 Cara Menjalankan Frontend

1. **PENTING**: Salin/copy seluruh isi folder `assets` dari project statis lama Anda (`combo-main/terbaru/assets/`) dan letakkan ke dalam folder `frontend/public/assets/` agar semua video background, gambar galeri, dan gambar produk kopi dapat dimuat dengan sempurna di website React.
2. Buka terminal baru dan masuk ke direktori frontend:
   ```bash
   cd frontend
   ```
3. Instal seluruh dependensi frontend:
   ```bash
   npm install
   ```
4. Jalankan aplikasi frontend:
   ```bash
   npm run dev
   ```
5. Aplikasi akan berjalan di **http://localhost:5173**. Buka URL tersebut di browser Anda.

---

## 📡 Endpoint API (REST API)

### 1. Produk (`/products`)
* `GET /products` - Mengambil semua produk aktif (bisa disaring via query: `?search=kopi&category_id=1&sort=price_asc`)
* `GET /products/:id` - Mengambil detail satu produk berdasarkan ID
* `POST /products` - Menambahkan produk baru (Mendukung upload gambar produk)
* `PUT /products/:id` - Mengubah data produk yang ada
* `DELETE /products/:id` - Menghapus produk dari sistem

### 2. Kategori (`/categories`)
* `GET /categories` - Mengambil daftar kategori menu aktif (Kopi & Non-Kopi)

### 3. Keranjang Belanja (`/cart`)
* `GET /cart` - Mengambil seluruh item di dalam keranjang beserta total belanjaan
* `POST /cart` - Menambahkan item produk ke keranjang belanja
* `PUT /cart/:id` - Memperbarui kuantitas (Qty) produk di keranjang belanja
* `DELETE /cart/:id` - Menghapus satu item dari keranjang
* `DELETE /cart/clear` - Mengosongkan seluruh keranjang belanja

### 4. Wishlist (`/wishlist`)
* `GET /wishlist` - Mengambil daftar produk favorit pengguna
* `POST /wishlist` - Menambahkan produk ke daftar favorit
* `DELETE /wishlist/:id` - Menghapus produk dari wishlist berdasarkan ID wishlist

### 5. Reservasi Meja (`/reservations`)
* `GET /reservations` - Melihat daftar reservasi meja
* `POST /reservations` - Mengajukan reservasi meja baru (Telah divalidasi)

---

## 🛠️ Troubleshooting & Penanganan Error

1. **Error: `MySQL Connection Error: Access denied for user 'root'@'localhost'`**
   * **Penyebab**: Password user database MySQL di XAMPP Anda tidak kosong.
   * **Solusi**: Buka file `backend/.env` dan ubah `DB_PASSWORD=` dengan password MySQL Anda, contoh: `DB_PASSWORD=12345`.
2. **Gambar Produk/Kopi Pecah atau Kosong**
   * **Penyebab**: Folder `assets` belum dipindahkan.
   * **Solusi**: Pastikan Anda telah menyalin folder `assets` dari project statis lama Anda ke `frontend/public/assets/` seperti dijelaskan di langkah persiapan frontend.
3. **Error CORS di Console Browser**
   * **Penyebab**: Port frontend atau URL asal tidak diizinkan oleh backend.
   * **Solusi**: Di file `backend/app.js`, pastikan `origin` pada pengaturan middleware CORS diatur ke `http://localhost:5173` (port default Vite).
4. **Port 5000 atau 5173 Sudah Digunakan**
   * **Penyebab**: Ada aplikasi lain yang sedang berjalan menggunakan port yang sama.
   * **Solusi**: Ubah nilai `PORT` di file `backend/.env` ke port lain (misal `5001`), dan sesuaikan `baseURL` di `frontend/src/services/api.js`.
