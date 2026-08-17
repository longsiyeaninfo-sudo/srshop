const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET all categories with live product counts
router.get('/', (req, res) => {
  try {
    const query = `
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id
      ORDER BY c.display_order ASC, c.name ASC
    `;
    const categories = db.prepare(query).all();
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/categories (Admin create new category/catalog)
router.post('/', (req, res) => {
  try {
    const { name, slug, icon = '📦', description = '', image = '', display_order = 0 } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const generatedSlug = slug && slug.trim()
      ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(Math.random() * 1000);

    const id = 'cat_' + Date.now();

    const stmt = db.prepare(`
      INSERT INTO categories (id, name, slug, icon, description, image, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, name.trim(), generatedSlug, icon, description, image, Number(display_order) || 0);

    const newCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);

    res.json({
      success: true,
      message: 'Category created successfully',
      category: { ...newCategory, product_count: 0 }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/categories/:id (Admin update category)
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const {
      name = existing.name,
      slug = existing.slug,
      icon = existing.icon,
      description = existing.description,
      image = existing.image,
      display_order = existing.display_order
    } = req.body;

    const stmt = db.prepare(`
      UPDATE categories SET
        name = ?,
        slug = ?,
        icon = ?,
        description = ?,
        image = ?,
        display_order = ?
      WHERE id = ?
    `);

    stmt.run(name.trim(), slug.trim(), icon, description, image, Number(display_order) || 0, id);

    const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);

    res.json({
      success: true,
      message: 'Category updated successfully',
      category: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/categories/:id (Admin delete category)
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Reassign any existing products in this category to general auto accessories or first available category
    const defaultCat = db.prepare('SELECT id FROM categories WHERE id != ? LIMIT 1').get(id);
    if (defaultCat) {
      db.prepare('UPDATE products SET category_id = ? WHERE category_id = ?').run(defaultCat.id, id);
    }

    db.prepare('DELETE FROM categories WHERE id = ?').run(id);

    res.json({ success: true, message: 'Category removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
