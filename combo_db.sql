-- ============================================================
-- DATABASE: combo_db
-- Aplikasi: Kopi Kombo Fullstack (React + Express + MySQL)
-- ERD Schema: Matches ERD Diagram (10 Tabel Utama + Reservations)
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;
SET time_zone = "+07:00";
SET NAMES utf8mb4;

-- ============================================================
-- Buat & Gunakan Database
-- ============================================================
CREATE DATABASE IF NOT EXISTS `combo_db`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `combo_db`;

-- ============================================================
-- Drop Tables (Urutan dependent tables first)
-- ============================================================
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `carts`;
DROP TABLE IF EXISTS `wishlist_items`;
DROP TABLE IF EXISTS `wishlist`;
DROP TABLE IF EXISTS `reservations`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

-- ============================================================
-- 1. Tabel: users
-- ============================================================
CREATE TABLE `users` (
  `id`            INT(11)       NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(200)  NOT NULL,
  `email`         VARCHAR(200)  NOT NULL,
  `password_hash` VARCHAR(255)  NOT NULL,
  `role`          VARCHAR(50)   NOT NULL DEFAULT 'customer',
  `phone`         VARCHAR(20)   DEFAULT NULL,
  `created_at`    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Password default: admin123
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `phone`) VALUES
(1, 'Admin Kombo',  'admin@kopikombo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin',    '081299998888'),
(2, 'Budi Santoso', 'budi@example.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'customer', '081234567890'),
(3, 'Siti Rahayu',  'siti@example.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'customer', '082345678901');

-- ============================================================
-- 2. Tabel: categories
-- ============================================================
CREATE TABLE `categories` (
  `id`          INT(11)      NOT NULL AUTO_INCREMENT,
  `key`         VARCHAR(50)  NOT NULL,
  `name`        VARCHAR(100) NOT NULL,
  `description` TEXT         DEFAULT NULL,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_categories_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `key`, `name`, `description`) VALUES
(1, 'kopi',     'Kopi',     'Aneka olahan kopi espresso premium pilihan'),
(2, 'non-kopi', 'Non-Kopi', 'Minuman Cokelat, Matcha & Varian Non-Kopi Segar');

-- ============================================================
-- 3. Tabel: products
-- ============================================================
CREATE TABLE `products` (
  `id`          INT(11)      NOT NULL AUTO_INCREMENT,
  `title`       VARCHAR(200) NOT NULL,
  `description` TEXT         DEFAULT NULL,
  `category_id` INT(11)      NOT NULL,
  `image`       VARCHAR(255) DEFAULT NULL,
  `price`       INT(11)      NOT NULL DEFAULT 0,
  `rating`      DECIMAL(3,2) DEFAULT 4.50,
  `reviews`     INT(11)      DEFAULT 12,
  `badge`       VARCHAR(50)  DEFAULT NULL,
  `stock`       INT(11)      NOT NULL DEFAULT 50,
  `is_active`   TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_products_category` (`category_id`),
  KEY `idx_products_is_active` (`is_active`),
  KEY `idx_products_price` (`price`),
  CONSTRAINT `fk_products_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `products` (`id`, `category_id`, `title`, `description`, `price`, `rating`, `reviews`, `badge`, `stock`, `image`, `is_active`) VALUES
(1, 1, 'Kombo Aren',          'Perpaduan espresso premium dengan gula aren asli Jawa, menghasilkan rasa manis legit yang khas dengan aroma kopi yang kuat.', 15000, 4.90, 128, 'Best Seller', 50, 'KOMBO AREN.png', 1),
(2, 1, 'Kombo Susu',          'Espresso lembut berpadu susu segar full cream pilihan, menciptakan tekstur creamy yang sempurna.',                                   15000, 4.80, 95,  'Popular',     45, 'KOMBO SUSU.png', 1),
(3, 1, 'Kombo Salted Caramel', 'Perpaduan unik espresso bold dengan saus salted caramel premium dan sejumput garam laut.',                                18000, 4.95, 110, 'Signature',   30, 'KOMBO SALTED CARAMEL.png', 1),
(4, 1, 'Americano',           'Espresso murni double shot dilarutkan dengan air panas, menghasilkan kopi hitam klasik dengan rasa bold.',                         10000, 4.70, 60,  NULL,          60, 'AMERICANO.png', 1),
(5, 1, 'Americano Berry',     'Inovasi segar Americano dengan tambahan ekstrak buah berry asam manis yang menyegarkan.',                                          18000, 4.60, 42,  'New',         25, 'AMERICANO BERRY.png', 1),
(6, 2, 'Choco Berry',         'Minuman cokelat premium dengan sentuhan buah berry segar. Manis, sedikit asam, dengan tekstur creamy.',                           18000, 4.85, 84,  'Favorite',    35, 'CHOCO BERRY.png', 1),
(7, 2, 'Choco Milk',          'Dark chocolate berkualitas tinggi diblend dengan susu full cream segar, menghasilkan minuman cokelat susu yang kaya rasa.',       15000, 4.75, 76,  NULL,          40, 'CHOCO MILK.png', 1),
(8, 2, 'Matcha Latte',        'Matcha premium grade ceremonial dari Jepang dipadukan susu oat creamy. Warna hijau cantik, rasa earthy yang khas.',               18000, 4.90, 105, 'Best Seller', 20, 'MATCHA.png', 1);

-- ============================================================
-- 4. Tabel: carts
-- ============================================================
CREATE TABLE `carts` (
  `id`         INT(11)   NOT NULL AUTO_INCREMENT,
  `user_id`    INT(11)   DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_carts_user` (`user_id`),
  CONSTRAINT `fk_carts_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. Tabel: cart_items
-- ============================================================
CREATE TABLE `cart_items` (
  `id`         INT(11)   NOT NULL AUTO_INCREMENT,
  `cart_id`    INT(11)   NOT NULL,
  `product_id` INT(11)   NOT NULL,
  `quantity`   INT(11)   NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cart_items_cart` (`cart_id`),
  KEY `idx_cart_items_product` (`product_id`),
  CONSTRAINT `fk_cart_items_cart`
    FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cart_items_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. Tabel: orders
-- ============================================================
CREATE TABLE `orders` (
  `id`             INT(11)      NOT NULL AUTO_INCREMENT,
  `user_id`        INT(11)      DEFAULT NULL,
  `status`         VARCHAR(50)  NOT NULL DEFAULT 'pending',
  `full_name`      VARCHAR(200) NOT NULL,
  `email`          VARCHAR(200) DEFAULT NULL,
  `phone`          VARCHAR(20)  NOT NULL,
  `address`        TEXT         NOT NULL,
  `province`       VARCHAR(100) DEFAULT NULL,
  `postal_code`    VARCHAR(20)  DEFAULT NULL,
  `notes`          TEXT         DEFAULT NULL,
  `payment_method` VARCHAR(50)  NOT NULL DEFAULT 'cod',
  `total`          INT(11)      NOT NULL DEFAULT 0,
  `shipping`       INT(11)      NOT NULL DEFAULT 0,
  `tax`            INT(11)      NOT NULL DEFAULT 0,
  `grand_total`    INT(11)      NOT NULL DEFAULT 0,
  `created_at`     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_orders_user` (`user_id`),
  KEY `idx_orders_status` (`status`),
  CONSTRAINT `fk_orders_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. Tabel: order_items
-- ============================================================
CREATE TABLE `order_items` (
  `id`         INT(11)      NOT NULL AUTO_INCREMENT,
  `order_id`   INT(11)      NOT NULL,
  `product_id` INT(11)      DEFAULT NULL,
  `title`      VARCHAR(200) NOT NULL,
  `price`      INT(11)      NOT NULL DEFAULT 0,
  `quantity`   INT(11)      NOT NULL DEFAULT 1,
  `image`      VARCHAR(255) DEFAULT NULL,
  `category`   VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order` (`order_id`),
  KEY `idx_order_items_product` (`product_id`),
  CONSTRAINT `fk_order_items_order`
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. Tabel: wishlist
-- ============================================================
CREATE TABLE `wishlist` (
  `id`         INT(11)   NOT NULL AUTO_INCREMENT,
  `user_id`    INT(11)   DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_wishlist_user` (`user_id`),
  CONSTRAINT `fk_wishlist_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. Tabel: wishlist_items
-- ============================================================
CREATE TABLE `wishlist_items` (
  `id`          INT(11)      NOT NULL AUTO_INCREMENT,
  `wishlist_id` INT(11)      NOT NULL,
  `product_id`  INT(11)      NOT NULL,
  `title`       VARCHAR(200) DEFAULT NULL,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_wishlist_items_wishlist` (`wishlist_id`),
  KEY `idx_wishlist_items_product` (`product_id`),
  CONSTRAINT `fk_wishlist_items_wishlist`
    FOREIGN KEY (`wishlist_id`) REFERENCES `wishlist` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_wishlist_items_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. Tabel: payments
-- ============================================================
CREATE TABLE `payments` (
  `id`         INT(11)     NOT NULL AUTO_INCREMENT,
  `order_id`   INT(11)     NOT NULL,
  `provider`   VARCHAR(50) NOT NULL DEFAULT 'COD',
  `status`     VARCHAR(50) NOT NULL DEFAULT 'pending',
  `amount`     INT(11)     NOT NULL DEFAULT 0,
  `paid_at`    TIMESTAMP   NULL DEFAULT NULL,
  `created_at` TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payments_order` (`order_id`),
  CONSTRAINT `fk_payments_order`
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. Tabel: reservations (Fitur Reservasi Meja Cafe)
-- ============================================================
CREATE TABLE `reservations` (
  `id`         INT(11)      NOT NULL AUTO_INCREMENT,
  `user_id`    INT(11)      DEFAULT NULL,
  `name`       VARCHAR(200) NOT NULL,
  `phone`      VARCHAR(20)  NOT NULL,
  `date`       DATE         NOT NULL,
  `time`       TIME         NOT NULL,
  `people`     INT(11)      NOT NULL DEFAULT 1,
  `note`       TEXT         DEFAULT NULL,
  `status`     VARCHAR(50)  NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reservations_user` (`user_id`),
  KEY `idx_reservations_date` (`date`),
  KEY `idx_reservations_status` (`status`),
  CONSTRAINT `fk_reservations_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Data Dummy: orders, order_items, payments, reservations
-- ============================================================
INSERT INTO `orders` (`id`, `user_id`, `status`, `full_name`, `email`, `phone`, `address`, `province`, `postal_code`, `notes`, `payment_method`, `total`, `shipping`, `tax`, `grand_total`, `created_at`) VALUES
(1, 2, 'delivered', 'Budi Santoso', 'budi@example.com', '081234567890', 'Jl. Gejayan No. 12, Yogyakarta', 'D.I. Yogyakarta', '55281', 'Tolong bungkus rapi', 'cod',      45000, 10000, 4500, 59500, '2026-07-01 10:00:00'),
(2, 3, 'confirmed', 'Siti Rahayu',  'siti@example.com', '082345678901', 'Jl. Malioboro No. 5, Yogyakarta', 'D.I. Yogyakarta', '55271', NULL,                  'transfer', 33000, 10000, 3300, 46300, '2026-07-03 14:30:00');

INSERT INTO `order_items` (`order_id`, `product_id`, `title`, `price`, `quantity`, `image`, `category`) VALUES
(1, 1, 'Kombo Aren',          15000, 2, 'KOMBO AREN.png',          'Kopi'),
(1, 4, 'Americano',           10000, 1, 'AMERICANO.png',           'Kopi'),
(2, 3, 'Kombo Salted Caramel',18000, 1, 'KOMBO SALTED CARAMEL.png', 'Kopi'),
(2, 2, 'Kombo Susu',          15000, 1, 'KOMBO SUSU.png',          'Kopi');

INSERT INTO `payments` (`id`, `order_id`, `provider`, `status`, `amount`, `paid_at`) VALUES
(1, 1, 'COD',           'paid',    59500, '2026-07-01 10:05:00'),
(2, 2, 'Bank Transfer', 'pending', 46300, NULL);

INSERT INTO `reservations` (`name`, `phone`, `date`, `time`, `people`, `note`, `status`) VALUES
('Eko Prasetyo', '085678901234', '2026-07-10', '19:00:00', 4, 'Meja dekat panggung', 'confirmed'),
('Maya Sari',    '086789012345', '2026-07-12', '18:30:00', 2, NULL,                  'pending');

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
