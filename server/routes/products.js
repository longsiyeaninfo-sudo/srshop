const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/products (with search, category, pricing, badge filters & sorting)
router.get('/', (req, res) => {
  try {
    const {
      q,
      category,
      min_price,
      max_price,
      sort,
      filter, // 'featured', 'trending', 'best_seller', 'in_stock'
      rating
    } = req.query;

    let sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (q && q.trim()) {
      sql += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.short_description LIKE ?)`;
      const term = `%${q.trim()}%`;
      params.push(term, term, term);
    }

    if (category && category !== 'all') {
      sql += ` AND (c.slug = ? OR c.id = ?)`;
      params.push(category, category);
    }

    if (min_price) {
      sql += ` AND p.price >= ?`;
      params.push(Number(min_price));
    }

    if (max_price) {
      sql += ` AND p.price <= ?`;
      params.push(Number(max_price));
    }

    if (rating) {
      sql += ` AND p.rating >= ?`;
      params.push(Number(rating));
    }

    if (filter === 'featured') {
      sql += ` AND p.is_featured = 1`;
    } else if (filter === 'trending') {
      sql += ` AND p.is_trending = 1`;
    } else if (filter === 'best_seller') {
      sql += ` AND p.is_best_seller = 1`;
    } else if (filter === 'in_stock') {
      sql += ` AND p.stock > 0`;
    }

    // Sorting
    if (sort === 'price-low') {
      sql += ` ORDER BY p.price ASC`;
    } else if (sort === 'price-high') {
      sql += ` ORDER BY p.price DESC`;
    } else if (sort === 'rating') {
      sql += ` ORDER BY p.rating DESC, p.review_count DESC`;
    } else if (sort === 'newest') {
      sql += ` ORDER BY p.created_at DESC`;
    } else {
      sql += ` ORDER BY p.is_featured DESC, p.is_best_seller DESC, p.rating DESC`;
    }

    const products = db.prepare(sql).all(...params).map(p => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      variants: JSON.parse(p.variants || '[]'),
      specs: JSON.parse(p.specs || '{}')
    }));

    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/products/:idOrSlug
router.get('/:idOrSlug', (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const product = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ? OR p.slug = ?
    `).get(idOrSlug, idOrSlug);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const formattedProduct = {
      ...product,
      images: JSON.parse(product.images || '[]'),
      variants: JSON.parse(product.variants || '[]'),
      specs: JSON.parse(product.specs || '{}')
    };

    // Get verified customer reviews
    const reviews = db.prepare(`
      SELECT * FROM reviews
      WHERE product_id = ?
      ORDER BY created_at DESC
    `).all(product.id);

    // Get related products from same category
    const related = db.prepare(`
      SELECT * FROM products
      WHERE category_id = ? AND id != ?
      LIMIT 4
    `).all(product.category_id, product.id).map(p => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      variants: JSON.parse(p.variants || '[]'),
      specs: JSON.parse(p.specs || '{}')
    }));

    res.json({
      success: true,
      product: formattedProduct,
      reviews,
      related
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/products (Admin create product)
router.post('/', (req, res) => {
  try {
    const {
      name,
      category_id,
      description,
      short_description,
      cost_price = 0,
      price,
      compare_at_price,
      stock = 10,
      is_featured = 0,
      is_trending = 0,
      is_best_seller = 0,
      badge,
      images = [],
      variants = [],
      specs = {},
      supplier_info = ''
    } = req.body;

    if (!name || !price || !category_id) {
      return res.status(400).json({ success: false, message: 'Name, price, and category are required' });
    }

    const id = 'prod_' + Date.now();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(Math.random() * 1000);

    const stmt = db.prepare(`
      INSERT INTO products (
        id, name, slug, category_id, description, short_description, cost_price, price,
        compare_at_price, stock, is_featured, is_trending, is_best_seller, badge,
        rating, review_count, images, variants, specs, supplier_info
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 5.0, 1, ?, ?, ?, ?)
    `);

    stmt.run(
      id, name, slug, category_id, description || '', short_description || '',
      Number(cost_price), Number(price), compare_at_price ? Number(compare_at_price) : null,
      Number(stock), is_featured ? 1 : 0, is_trending ? 1 : 0, is_best_seller ? 1 : 0,
      badge || null, JSON.stringify(images), JSON.stringify(variants),
      JSON.stringify(specs), supplier_info
    );

    res.json({ success: true, message: 'Product created successfully', id, slug });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/products/:id (Admin update product)
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const {
      name = existing.name,
      category_id = existing.category_id,
      description = existing.description,
      short_description = existing.short_description,
      cost_price = existing.cost_price,
      price = existing.price,
      compare_at_price = existing.compare_at_price,
      stock = existing.stock,
      is_featured = existing.is_featured,
      is_trending = existing.is_trending,
      is_best_seller = existing.is_best_seller,
      badge = existing.badge,
      images,
      variants,
      specs,
      supplier_info = existing.supplier_info
    } = req.body;

    const stmt = db.prepare(`
      UPDATE products SET
        name = ?, category_id = ?, description = ?, short_description = ?,
        cost_price = ?, price = ?, compare_at_price = ?, stock = ?,
        is_featured = ?, is_trending = ?, is_best_seller = ?, badge = ?,
        images = ?, variants = ?, specs = ?, supplier_info = ?
      WHERE id = ?
    `);

    stmt.run(
      name, category_id, description, short_description,
      Number(cost_price), Number(price), compare_at_price ? Number(compare_at_price) : null,
      Number(stock), is_featured ? 1 : 0, is_trending ? 1 : 0, is_best_seller ? 1 : 0,
      badge || null,
      images ? JSON.stringify(images) : existing.images,
      variants ? JSON.stringify(variants) : existing.variants,
      specs ? JSON.stringify(specs) : existing.specs,
      supplier_info,
      id
    );

    res.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/products/:id (Admin delete product)
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
