const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/productModel");
const { verifyAdmin } = require("../middlewares/authMiddleware");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const { Parser } = require('json2csv');

// Middleware to verify user (for placing orders)
function verifyUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied: No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// User places an order
router.post("/", verifyUser, async (req, res) => {
  try {
    const { items, name, email, phone, address } = req.body; // [{ product, quantity }], user details
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items in order" });
    }
    if (!name || !email || !phone || !address) {
      return res.status(400).json({ error: "All user details are required" });
    }
    // Fetch product details for each item
    const detailedItems = [];
    let total = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ error: `Product not found: ${item.product}` });
      }
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      detailedItems.push({
        product: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
      });
    }
    const order = new Order({
      user: req.user.id,
      name,
      email,
      phone,
      address,
      items: detailedItems,
      total,
      status: "pending",
    });
    await order.save();
    res.status(201).json({
      message: "Order placed and pending admin approval",
      orderSummary: {
        name,
        email,
        phone,
        address,
        items: detailedItems,
        total,
        status: order.status,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to place order" });
  }
});

// Admin approves an order
router.patch("/:id/approve", verifyAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Send email to user
    const itemLines = order.items.map(item => `${item.title} (x${item.quantity}) - Rs. ${item.price * item.quantity}`).join("\n");
    const emailText = `Dear ${order.name},\n\nYour order has been approved!\n\nOrder Details:\nName: ${order.name}\nEmail: ${order.email}\nPhone: ${order.phone}\nAddress: ${order.address}\n\nProducts:\n${itemLines}\n\nTotal Payment: Rs. ${order.total}\n\nThank you for shopping with us!`;
    try {
      await sendEmail(order.email, "Order Approved - AI E-Commerce App", emailText);
    } catch (e) {
      // Log but don't fail the approval if email fails
      console.error("Order approval email failed:", e.message);
    }

    res.json({ message: "Order approved and user notified via email", order });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve order" });
  }
});

// Admin rejects an order
router.patch("/:id/reject", verifyAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order rejected", order });
  } catch (err) {
    res.status(500).json({ error: "Failed to reject order" });
  }
});

// Admin gets all orders
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("items.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Admin export approved orders as CSV
router.get("/export-approved", verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find({ status: "approved" });
    const rows = [];
    orders.forEach(order => {
      order.items.forEach(item => {
        rows.push({
          Name: order.name,
          Email: order.email,
          Phone: order.phone,
          Address: order.address,
          Product: item.title,
          Quantity: item.quantity,
          Price: item.price,
          Total: order.total,
          OrderDate: order.createdAt,
        });
      });
    });
    const parser = new Parser();
    const csv = parser.parse(rows);
    res.header('Content-Type', 'text/csv');
    res.attachment('approved-orders.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: "Failed to export approved orders" });
  }
});

module.exports = router; 