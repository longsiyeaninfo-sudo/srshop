const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'sr_shop.db');
const db = new Database(dbPath);

// Enable WAL mode for high concurrency
db.pragma('journal_mode = WAL');

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      icon TEXT,
      description TEXT,
      image TEXT,
      display_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      category_id TEXT NOT NULL,
      description TEXT,
      short_description TEXT,
      cost_price REAL DEFAULT 0,
      price REAL NOT NULL,
      compare_at_price REAL,
      stock INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      is_trending INTEGER DEFAULT 0,
      is_best_seller INTEGER DEFAULT 0,
      badge TEXT,
      rating REAL DEFAULT 5.0,
      review_count INTEGER DEFAULT 0,
      images TEXT,       -- JSON array of image URLs
      variants TEXT,     -- JSON array of variant options (colors, sizes, bundles)
      specs TEXT,        -- JSON object of key-value specs
      supplier_info TEXT,-- JSON or text for import supplier tracking
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT,
      customer_phone TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      city TEXT,
      country TEXT DEFAULT 'Local',
      shipping_method TEXT DEFAULT 'Standard Delivery',
      shipping_cost REAL DEFAULT 0,
      payment_method TEXT NOT NULL,
      payment_status TEXT DEFAULT 'Paid',
      subtotal REAL NOT NULL,
      discount_amount REAL DEFAULT 0,
      coupon_code TEXT,
      tax_amount REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      total_cost REAL DEFAULT 0,
      gross_profit REAL DEFAULT 0,
      status TEXT DEFAULT 'Processing', -- Processing, Shipped, Out for Delivery, Delivered, Cancelled
      tracking_carrier TEXT,
      tracking_number TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      product_image TEXT,
      variant_info TEXT,
      cost_price REAL DEFAULT 0,
      unit_price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      total_price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS coupons (
      code TEXT PRIMARY KEY,
      discount_type TEXT NOT NULL, -- 'percent' or 'fixed'
      discount_value REAL NOT NULL,
      min_spend REAL DEFAULT 0,
      usage_limit INTEGER DEFAULT 1000,
      times_used INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      is_verified INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS slides (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      title_km TEXT,
      subtitle TEXT,
      subtitle_km TEXT,
      image TEXT NOT NULL,
      badge TEXT,
      price REAL,
      compare_at_price REAL,
      cta_text TEXT DEFAULT 'Shop Now',
      cta_text_km TEXT DEFAULT 'ទិញឥឡូវនេះ',
      link_url TEXT,
      product_id TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'staff', -- 'admin', 'manager', 'staff'
      avatar TEXT,
      is_active INTEGER DEFAULT 1,
      last_login DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✅ SQLite Database schema initialized successfully at:', dbPath);
}

initializeDatabase();

module.exports = db;
