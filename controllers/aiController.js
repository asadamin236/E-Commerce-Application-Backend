// controllers/aiController.js
const Product = require("../models/productModel");

const recommendProducts = async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const allProducts = await Product.find({});

    // Simple match based on keyword in title or description
    const recommended = allProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(text.toLowerCase()) ||
        product.description.toLowerCase().includes(text.toLowerCase())
    );

    res.json({ recommended });
  } catch (error) {
    console.error("AI Recommend Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { recommendProducts };
