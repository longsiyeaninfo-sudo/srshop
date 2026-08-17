const express = require('express');
const router = express.Router();
const db = require('../db/database');

// POST /api/orders - Create & Place Order
router.post('/', (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      city,
      country = 'Local',
      shipping_method = 'Standard Delivery',
      shipping_cost = 0,
      payment_method = 'Credit Card',
      coupon_code = null,
      notes = '',
      items = []
    } = req.body;

    if (!customer_name || !customer_phone || !shipping_address || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, phone, shipping address, and items are required'
      });
    }

    const orderId = 'ord_' + Date.now();
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `SR-${randomSuffix}`;

    let subtotal = 0;
    let totalCost = 0;

    // Validate items and calculate accurate subtotal and cost
    const processedItems = items.map(item => {
      const prod = db.prepare('SELECT * FROM products WHERE id = ?').get(item.product_id);
      const unitPrice = prod ? prod.price : Number(item.unit_price || 0);
      const costPrice = prod ? prod.cost_price : Number(item.cost_price || 0);
      const quantity = Math.max(1, Number(item.quantity || 1));
      const lineTotal = unitPrice * quantity;
      const lineCost = costPrice * quantity;

      subtotal += lineTotal;
      totalCost += lineCost;

      return {
        id: 'item_' + Math.random().toString(36).substring(2, 10),
        order_id: orderId,
        product_id: item.product_id,
        product_name: prod ? prod.name : item.product_name,
        product_image: prod ? JSON.parse(prod.images || '[]')[0] : item.product_image,
        variant_info: item.variant_info || '',
        cost_price: costPrice,
        unit_price: unitPrice,
        quantity,
        total_price: lineTotal
      };
    });

    // Check discount coupon
    let discountAmount = 0;
    if (coupon_code) {
      const coupon = db.prepare('SELECT * FROM coupons WHERE code = ? AND is_active = 1').get(coupon_code.toUpperCase());
      if (coupon && subtotal >= (coupon.min_spend || 0)) {
        if (coupon.discount_type === 'percent') {
          discountAmount = (subtotal * coupon.discount_value) / 100;
        } else {
          discountAmount = coupon.discount_value;
        }
        db.prepare('UPDATE coupons SET times_used = times_used + 1 WHERE code = ?').run(coupon.code);
      }
    }

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = Number((taxableAmount * 0.07).toFixed(2)); // Standard 7% tax
    const totalAmount = Number((taxableAmount + Number(shipping_cost) + taxAmount).toFixed(2));
    const grossProfit = Number((totalAmount - totalCost - taxAmount).toFixed(2));

    // Assign initial tracking number for import store
    const initialCarrier = shipping_method.includes('Overnight') ? 'FedEx Priority' : 'Standard Express';
    const initialTracking = `SR-TRK-${Math.floor(100000000 + Math.random() * 900000000)}`;

    const orderStmt = db.prepare(`
      INSERT INTO orders (
        id, order_number, customer_name, customer_email, customer_phone,
        shipping_address, city, country, shipping_method, shipping_cost,
        payment_method, payment_status, subtotal, discount_amount, coupon_code,
        tax_amount, total_amount, total_cost, gross_profit, status,
        tracking_carrier, tracking_number, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    const itemStmt = db.prepare(`
      INSERT INTO order_items (
        id, order_id, product_id, product_name, product_image,
        variant_info, cost_price, unit_price, quantity, total_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const stockStmt = db.prepare(`
      UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?
    `);

    db.transaction(() => {
      orderStmt.run(
        orderId, orderNumber, customer_name, customer_email || '', customer_phone,
        shipping_address, city || '', country, shipping_method, Number(shipping_cost),
        payment_method, payment_method === 'Cash on Delivery (COD)' ? 'Pending' : 'Paid',
        subtotal, discountAmount, coupon_code || null,
        taxAmount, totalAmount, totalCost, grossProfit, 'Processing',
        initialCarrier, initialTracking, notes
      );

      for (const it of processedItems) {
        itemStmt.run(
          it.id, it.order_id, it.product_id, it.product_name,
          it.product_image || '', it.variant_info, it.cost_price,
          it.unit_price, it.quantity, it.total_price
        );
        stockStmt.run(it.quantity, it.product_id);
      }
    })();

    const placedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);

    res.json({
      success: true,
      message: 'Order created successfully',
      order: {
        ...placedOrder,
        items: orderItems
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/orders (Admin list all orders)
router.get('/', (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    let sql = 'SELECT * FROM orders';
    const params = [];

    if (status && status !== 'all') {
      sql += ' WHERE status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC LIMIT ?';
    params.push(Number(limit));

    const orders = db.prepare(sql).all(...params);

    const fullOrders = orders.map(ord => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(ord.id);
      return { ...ord, items };
    });

    res.json({ success: true, count: fullOrders.length, orders: fullOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/orders/track/:orderNumber (Customer live tracking lookup)
router.get('/track/:orderNumber', (req, res) => {
  try {
    const { orderNumber } = req.params;
    const cleanNum = (orderNumber || '').replace(/^#/, '').trim();
    
    const order = db.prepare(`
      SELECT * FROM orders 
      WHERE UPPER(order_number) = UPPER(?) OR id = ? OR UPPER(tracking_number) = UPPER(?)
    `).get(cleanNum, cleanNum, cleanNum);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found. Please verify your order number.' });
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);

    // Build timeline stages
    const stages = [
      { key: 'placed', label: 'Order Confirmed', completed: true, timestamp: order.created_at },
      { key: 'processing', label: 'Processing & Quality Check', completed: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.status), timestamp: order.created_at },
      { key: 'shipped', label: 'Dispatched / In Transit', completed: ['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status), timestamp: order.status !== 'Processing' ? 'In Transit' : null },
      { key: 'out_for_delivery', label: 'Out for Delivery', completed: ['Out for Delivery', 'Delivered'].includes(order.status), timestamp: ['Out for Delivery', 'Delivered'].includes(order.status) ? 'With Courier' : null },
      { key: 'delivered', label: 'Delivered', completed: order.status === 'Delivered', timestamp: order.status === 'Delivered' ? 'Completed' : null }
    ];

    res.json({
      success: true,
      order: {
        ...order,
        items,
        timeline: stages
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/orders/:id/status (Admin update fulfillment & tracking info)
router.put('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, tracking_carrier, tracking_number, notes } = req.body;

    const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const stmt = db.prepare(`
      UPDATE orders SET
        status = COALESCE(?, status),
        tracking_carrier = COALESCE(?, tracking_carrier),
        tracking_number = COALESCE(?, tracking_number),
        notes = COALESCE(?, notes)
      WHERE id = ?
    `);

    stmt.run(status, tracking_carrier, tracking_number, notes, id);

    res.json({ success: true, message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
