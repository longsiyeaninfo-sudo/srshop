const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/slides - List slides (active only for storefront, or all for admin)
router.get('/', (req, res) => {
  try {
    const { all } = req.query;
    let slides;
    if (all === 'true') {
      slides = db.prepare('SELECT * FROM slides ORDER BY display_order ASC, created_at DESC').all();
    } else {
      slides = db.prepare('SELECT * FROM slides WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC').all();
    }
    res.json({ success: true, slides });
  } catch (err) {
    console.error('Error fetching slides:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch slides' });
  }
});

// POST /api/slides - Create new slide
router.post('/', (req, res) => {
  try {
    const {
      title,
      title_km,
      subtitle,
      subtitle_km,
      image,
      badge,
      price,
      compare_at_price,
      cta_text,
      cta_text_km,
      link_url,
      product_id,
      display_order
    } = req.body;

    if (!title || !image) {
      return res.status(400).json({ success: false, message: 'Title and image are required' });
    }

    const id = 'slide_' + Date.now();
    const order = display_order !== undefined ? Number(display_order) : 0;

    const stmt = db.prepare(`
      INSERT INTO slides (
        id, title, title_km, subtitle, subtitle_km, image, badge,
        price, compare_at_price, cta_text, cta_text_km, link_url, product_id, display_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    stmt.run(
      id,
      title,
      title_km || title,
      subtitle || '',
      subtitle_km || subtitle || '',
      image,
      badge || 'FEATURED',
      price !== undefined ? Number(price) : null,
      compare_at_price !== undefined ? Number(compare_at_price) : null,
      cta_text || 'Shop Now',
      cta_text_km || 'ទិញឥឡូវនេះ',
      link_url || '',
      product_id || null,
      order
    );

    const slide = db.prepare('SELECT * FROM slides WHERE id = ?').get(id);
    res.json({ success: true, message: 'Slide created successfully', slide });
  } catch (err) {
    console.error('Error creating slide:', err);
    res.status(500).json({ success: false, message: 'Failed to create slide' });
  }
});

// PUT /api/slides/reorder - Reorder slides
router.put('/reorder', (req, res) => {
  try {
    const { slideIds } = req.body; // Array of IDs in desired order
    if (!Array.isArray(slideIds)) {
      return res.status(400).json({ success: false, message: 'slideIds must be an array' });
    }

    const stmt = db.prepare('UPDATE slides SET display_order = ? WHERE id = ?');
    db.transaction(() => {
      slideIds.forEach((id, index) => {
        stmt.run(index, id);
      });
    })();

    const updatedSlides = db.prepare('SELECT * FROM slides ORDER BY display_order ASC').all();
    res.json({ success: true, message: 'Slides reordered successfully', slides: updatedSlides });
  } catch (err) {
    console.error('Error reordering slides:', err);
    res.status(500).json({ success: false, message: 'Failed to reorder slides' });
  }
});

// PUT /api/slides/:id - Update slide
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      title_km,
      subtitle,
      subtitle_km,
      image,
      badge,
      price,
      compare_at_price,
      cta_text,
      cta_text_km,
      link_url,
      product_id,
      display_order,
      is_active
    } = req.body;

    const existing = db.prepare('SELECT * FROM slides WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Slide not found' });
    }

    const stmt = db.prepare(`
      UPDATE slides SET
        title = ?,
        title_km = ?,
        subtitle = ?,
        subtitle_km = ?,
        image = ?,
        badge = ?,
        price = ?,
        compare_at_price = ?,
        cta_text = ?,
        cta_text_km = ?,
        link_url = ?,
        product_id = ?,
        display_order = ?,
        is_active = ?
      WHERE id = ?
    `);

    stmt.run(
      title !== undefined ? title : existing.title,
      title_km !== undefined ? title_km : existing.title_km,
      subtitle !== undefined ? subtitle : existing.subtitle,
      subtitle_km !== undefined ? subtitle_km : existing.subtitle_km,
      image !== undefined ? image : existing.image,
      badge !== undefined ? badge : existing.badge,
      price !== undefined ? (price !== null ? Number(price) : null) : existing.price,
      compare_at_price !== undefined ? (compare_at_price !== null ? Number(compare_at_price) : null) : existing.compare_at_price,
      cta_text !== undefined ? cta_text : existing.cta_text,
      cta_text_km !== undefined ? cta_text_km : existing.cta_text_km,
      link_url !== undefined ? link_url : existing.link_url,
      product_id !== undefined ? product_id : existing.product_id,
      display_order !== undefined ? Number(display_order) : existing.display_order,
      is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
      id
    );

    const slide = db.prepare('SELECT * FROM slides WHERE id = ?').get(id);
    res.json({ success: true, message: 'Slide updated successfully', slide });
  } catch (err) {
    console.error('Error updating slide:', err);
    res.status(500).json({ success: false, message: 'Failed to update slide' });
  }
});

// DELETE /api/slides/:id - Delete slide
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const info = db.prepare('DELETE FROM slides WHERE id = ?').run(id);
    if (info.changes === 0) {
      return res.status(404).json({ success: false, message: 'Slide not found' });
    }
    res.json({ success: true, message: 'Slide deleted successfully' });
  } catch (err) {
    console.error('Error deleting slide:', err);
    res.status(500).json({ success: false, message: 'Failed to delete slide' });
  }
});

module.exports = router;
