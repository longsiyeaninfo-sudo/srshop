const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/staff - List all staff & team members
router.get('/', (req, res) => {
  try {
    const staffMembers = db.prepare(`
      SELECT id, name, email, phone, role, avatar, is_active, last_login, created_at
      FROM users
      ORDER BY 
        CASE role
          WHEN 'admin' THEN 1
          WHEN 'manager' THEN 2
          ELSE 3
        END,
        created_at ASC
    `).all();

    res.json({ success: true, staff: staffMembers });
  } catch (err) {
    console.error('Error fetching staff list:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch staff members' });
  }
});

// POST /api/staff - Add new staff member
router.post('/', (req, res) => {
  try {
    const { name, email, phone, role, password, avatar } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'A team member with this email already exists' });
    }

    const id = 'usr_' + Date.now();
    const assignedRole = ['admin', 'manager', 'staff'].includes(role) ? role : 'staff';
    const pwd = password || 'staff123';

    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, phone, password, role, avatar, is_active, last_login)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
    `);

    stmt.run(
      id,
      name,
      email,
      phone || '',
      pwd,
      assignedRole,
      avatar || ''
    );

    const created = db.prepare('SELECT id, name, email, phone, role, avatar, is_active, created_at FROM users WHERE id = ?').get(id);
    res.json({ success: true, message: `Staff member ${name} created as ${assignedRole}`, staff: created });
  } catch (err) {
    console.error('Error creating staff member:', err);
    res.status(500).json({ success: false, message: 'Failed to create staff member' });
  }
});

// PUT /api/staff/:id - Update staff member
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, is_active, avatar } = req.body;

    const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    const stmt = db.prepare(`
      UPDATE users SET
        name = ?,
        email = ?,
        phone = ?,
        role = ?,
        is_active = ?,
        avatar = ?
      WHERE id = ?
    `);

    stmt.run(
      name !== undefined ? name : existing.name,
      email !== undefined ? email : existing.email,
      phone !== undefined ? phone : existing.phone,
      role !== undefined ? role : existing.role,
      is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
      avatar !== undefined ? avatar : existing.avatar,
      id
    );

    const updated = db.prepare('SELECT id, name, email, phone, role, avatar, is_active, created_at FROM users WHERE id = ?').get(id);
    res.json({ success: true, message: 'Staff member updated successfully', staff: updated });
  } catch (err) {
    console.error('Error updating staff member:', err);
    res.status(500).json({ success: false, message: 'Failed to update staff member' });
  }
});

// DELETE /api/staff/:id - Delete staff member
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Safety check: Prevent deleting the primary admin
    const target = db.prepare('SELECT email, role FROM users WHERE id = ?').get(id);
    if (!target) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }
    if (target.email === 'admin@srshop.store') {
      return res.status(403).json({ success: false, message: 'Cannot delete the primary Store Owner / Admin account' });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    res.json({ success: true, message: 'Staff member deleted successfully' });
  } catch (err) {
    console.error('Error deleting staff member:', err);
    res.status(500).json({ success: false, message: 'Failed to delete staff member' });
  }
});

module.exports = router;
