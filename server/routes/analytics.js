const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/analytics - Reseller Business Performance Metrics
router.get('/', (req, res) => {
  try {
    // 1. Overall Revenue, Cost, Profit
    const summary = db.prepare(`
      SELECT 
        COUNT(id) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(SUM(total_cost), 0) as total_cost,
        COALESCE(SUM(gross_profit), 0) as total_profit,
        COALESCE(AVG(total_amount), 0) as avg_order_value
      FROM orders
      WHERE status != 'Cancelled'
    `).get();

    const totalRevenue = Number(summary.total_revenue.toFixed(2));
    const totalCost = Number(summary.total_cost.toFixed(2));
    const totalProfit = Number(summary.total_profit.toFixed(2));
    const profitMargin = totalRevenue > 0 ? Number(((totalProfit / totalRevenue) * 100).toFixed(1)) : 0;
    const avgOrderValue = Number(summary.avg_order_value.toFixed(2));

    // 2. Orders grouped by Status
    const ordersByStatus = db.prepare(`
      SELECT status, COUNT(id) as count
      FROM orders
      GROUP BY status
    `).all();

    // 3. Top Selling Products
    const topProducts = db.prepare(`
      SELECT 
        oi.product_id,
        oi.product_name,
        oi.product_image,
        SUM(oi.quantity) as total_units_sold,
        SUM(oi.total_price) as total_sales,
        SUM(oi.total_price - (oi.cost_price * oi.quantity)) as profit_generated
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE o.status != 'Cancelled'
      GROUP BY oi.product_id
      ORDER BY total_sales DESC
      LIMIT 5
    `).all();

    // 4. Low Stock Alerts (Stock < 40)
    const lowStockAlerts = db.prepare(`
      SELECT id, name, stock, cost_price, price, supplier_info
      FROM products
      WHERE stock <= 40
      ORDER BY stock ASC
    `).all();

    // 5. Category Performance Breakdown
    const categoryStats = db.prepare(`
      SELECT 
        c.name as category_name,
        COUNT(DISTINCT p.id) as product_count,
        COALESCE(SUM(oi.total_price), 0) as total_revenue
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      LEFT JOIN order_items oi ON oi.product_id = p.id
      GROUP BY c.id
      ORDER BY total_revenue DESC
    `).all();

    res.json({
      success: true,
      metrics: {
        totalOrders: summary.total_orders,
        totalRevenue,
        totalCost,
        totalProfit,
        profitMargin,
        avgOrderValue,
        ordersByStatus,
        topProducts,
        lowStockAlerts,
        categoryStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
