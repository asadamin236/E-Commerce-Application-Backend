const axios = require("axios");

const askGemini = async (prompt) => {
  const url = `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  const response = await axios.post(url, payload);
  const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

  return reply;
};

module.exports = { askGemini };
