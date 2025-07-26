const Product = require("../models/productModel");

const handleVoiceToGemini = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text)
      return res.status(400).json({ error: "No transcription text provided" });

    // Directly use the text as a search query (like /search)
    const regex = new RegExp(text, "i");
    const products = await Product.find({
      $or: [
        { title: regex },
        { category: regex },
        { description: regex },
      ],
    });

    res.json({ products });
  } catch (error) {
    console.error("Voice search error:", error.message);
    res.status(500).json({ error: "Failed to process voice input" });
  }
};

module.exports = { handleVoiceToGemini };
