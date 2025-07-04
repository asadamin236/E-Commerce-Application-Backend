// services/geminiService.js
const axios = require("axios");

const askGemini = async (prompt) => {
  try {
    const response = await axios.post(
      `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    return "Something went wrong with Gemini AI.";
  }
};

module.exports = { askGemini };
