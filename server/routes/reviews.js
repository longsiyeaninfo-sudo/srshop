const express = require('express');
const router = express.Router();
const db = require('../db/database');

// POST /api/reviews - Submit customer review
router.post('/', (req, res) => {
  try {
    const { product_id, user_name, rating, comment } = req.body;

    if (!product_id || !user_name || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'All review fields are required' });
    }

    const reviewId = 'rev_' + Date.now();
    const isVerified = 1;

    db.prepare(`
      INSERT INTO reviews (id, product_id, user_name, rating, comment, is_verified, created_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(reviewId, product_id, user_name, Number(rating), comment, isVerified);

    // Recalculate average rating & review count for product
    const stats = db.prepare(`
      SELECT AVG(rating) as avg_rating, COUNT(id) as count
      FROM reviews
      WHERE product_id = ?
    `).get(product_id);

    db.prepare(`
      UPDATE products SET
        rating = ?,
        review_count = ?
      WHERE id = ?
    `).run(Number(stats.avg_rating.toFixed(1)), stats.count, product_id);

    res.json({
      success: true,
      message: 'Thank you for your verified review!',
      review: {
        id: reviewId,
        product_id,
        user_name,
        rating: Number(rating),
        comment,
        is_verified: 1,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
