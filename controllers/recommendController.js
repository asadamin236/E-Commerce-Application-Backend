// controllers/recommendController.js
const Product = require("../models/productModel");
const { askGemini } = require("../services/geminiService");

const recommendProducts = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Missing input text." });
    }

    const prompt = `
You are a smart assistant. From the user's message below, extract product-related tags or categories.

Respond only with a comma-separated list.

Message: "${text}"
`;

    const aiResponse = await askGemini(prompt);
    const tags = aiResponse
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    if (tags.length === 0) {
      return res.status(400).json({ message: "No tags found" });
    }

    const recommended = await Product.find({
      $or: tags.map((tag) => ({
        $or: [
          { title: { $regex: tag, $options: "i" } },
          { category: { $regex: tag, $options: "i" } },
          { description: { $regex: tag, $options: "i" } },
        ],
      })),
    });

    return res.json({ tags, recommended });
  } catch (err) {
    console.error("AI Recommend Error:", err);
    res.status(500).json({ error: "AI recommendation failed." });
  }
};

module.exports = { recommendProducts };
