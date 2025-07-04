const Product = require("../models/Product");
const { askGemini } = require("../services/geminiService");

const handleVoiceToGemini = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No transcription text provided" });
    }

    // ✅ Improved Prompt
    const prompt = `
The user said: "${text}".
Return only 3-5 short keywords or product categories — comma-separated. Example: phone, camera, android, under 1000
Do not include full sentences.
`;

    const geminiResponse = await askGemini(prompt);

    // ✅ Tag Extraction (safe)
    let tags = [];
    try {
      tags = geminiResponse
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0);
    } catch (err) {
      console.error("Tag Parse Error:", err);
      return res.status(400).json({ error: "Invalid Gemini response" });
    }

    // Product Search
    const products = await Product.find({
      $or: [
        { title: { $in: tags.map((t) => new RegExp(t, "i")) } },
        { category: { $in: tags.map((t) => new RegExp(t, "i")) } },
      ],
    }).limit(10);

    return res.json({ tags, recommended: products });
  } catch (error) {
    console.error("Voice to Gemini Error:", error);
    res.status(500).json({ error: "Failed to process voice input" });
  }
};

module.exports = { handleVoiceToGemini };
