const express = require('express');
const router = express.Router();
const db = require('../db/database');

// User Authentication: Supports Admin, Manager, Staff and Customers
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Check if user exists in database
    const dbUser = db.prepare('SELECT id, name, email, phone, role, avatar, password, is_active FROM users WHERE LOWER(email) = LOWER(?)').get(email.trim());

    if (dbUser) {
      if (!dbUser.is_active) {
        return res.status(403).json({ success: false, message: 'This staff account has been deactivated. Please contact the Store Owner.' });
      }

      // Update last login
      db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(dbUser.id);

      const { password: _, ...safeUser } = dbUser;
      return res.json({
        success: true,
        user: safeUser,
        token: `jwt_token_${dbUser.role}_${dbUser.id}`
      });
    }

    // Default customer account creation if not in staff table
    res.json({
      success: true,
      user: {
        id: 'usr_' + Date.now(),
        name: email.split('@')[0],
        email: email,
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
      },
      token: 'jwt_mock_customer_token'
    });
  } catch (err) {
    console.error('Error during auth login:', err);
    res.status(500).json({ success: false, message: 'Authentication error' });
  }
});

module.exports = router;
