const express = require('express');
const router = express.Router();
const db = require('../db/database');

// POST /api/coupons/validate
router.post('/validate', (req, res) => {
  try {
    const { code, subtotal = 0 } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please enter a coupon code' });
    }

    const coupon = db.prepare('SELECT * FROM coupons WHERE code = ? AND is_active = 1').get(code.trim().toUpperCase());

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    if (coupon.times_used >= coupon.usage_limit) {
      return res.status(400).json({ success: false, message: 'This coupon usage limit has been reached' });
    }

    if (Number(subtotal) < coupon.min_spend) {
      return res.status(400).json({
        success: false,
        message: `Minimum order spend of $${coupon.min_spend} required for this code`
      });
    }

    let discountAmount = 0;
    if (coupon.discount_type === 'percent') {
      discountAmount = Number(((Number(subtotal) * coupon.discount_value) / 100).toFixed(2));
    } else {
      discountAmount = Number(coupon.discount_value.toFixed(2));
    }

    res.json({
      success: true,
      message: `Coupon "${coupon.code}" applied!`,
      coupon: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount_amount: discountAmount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/coupons (Admin list all coupons)
router.get('/', (req, res) => {
  try {
    const coupons = db.prepare('SELECT * FROM coupons ORDER BY code ASC').all();
    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
