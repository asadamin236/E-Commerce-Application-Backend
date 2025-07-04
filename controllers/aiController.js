// controllers/aiController.js

const Product = require("../models/Product");
const { askGemini } = require("../services/geminiService");

// Handle product-specific AI Q&A (you can edit logic as needed)
const handleAskProductAI = async (req, res) => {
  try {
    const { question, productId } = req.body;

    if (!question || !productId) {
      return res.status(400).json({ error: "Missing question or productId." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    const prompt = `
You're an AI assistant helping users understand products.

Question: "${question}"
Product Details:
Title: ${product.title}
Category: ${product.category}
Description: ${product.description}
Price: ${product.price}

Answer clearly and helpfully based on this product.
`;

    const aiAnswer = await askGemini(prompt);
    res.json({ answer: aiAnswer });
  } catch (err) {
    console.error("AI Product Q&A Error:", err);
    res.status(500).json({ error: "Failed to answer product question." });
  }
};

module.exports = { handleAskProductAI };
