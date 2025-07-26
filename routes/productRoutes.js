const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const upload = require("../middlewares/upload");
const { verifyAdmin } = require("../middlewares/authMiddleware");

// 🔒 Add Product (Admin only)
router.post("/add", verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, category, description, price, quantity } = req.body;
    const image = req.file?.filename || "";

    const newProduct = new Product({
      title,
      category,
      description,
      price,
      quantity,
      image,
    });
    await newProduct.save();
    res.status(201).json({ message: "Product added", product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Product creation failed" });
  }
});

// 🛒 Fetch all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// 📦 Get Product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// 🔍 Search products by keyword
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res.status(400).json({ error: "Search query is required" });
    }
    const regex = new RegExp(q, "i");
    const products = await Product.find({
      $or: [
        { title: regex },
        { category: regex },
        { description: regex },
      ],
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to search products" });
  }
});

// ✏️ Update Product by ID (Admin only)
router.put("/:id", verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, category, description, price, quantity } = req.body;
    const image = req.file?.filename;

    const updatedData = {
      title,
      category,
      description,
      price,
      quantity,
    };

    if (image) updatedData.image = image;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product updated", product: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// ❌ Delete Product by ID (Admin only)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// ✏️ Admin Update Quantity
router.patch("/:id/quantity", verifyAdmin, async (req, res) => {
  try {
    const { quantity } = req.body;
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update quantity" });
  }
});

module.exports = router;
