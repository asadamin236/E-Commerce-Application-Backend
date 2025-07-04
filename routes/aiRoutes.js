// routes/aiRoutes.js
const express = require("express");
const router = express.Router();

const { handleVoiceToGemini } = require("../controllers/voiceController");
const { recommendProducts } = require("../controllers/recommendController");
const { handleAskProductAI } = require("../controllers/aiController");

router.post("/voice-search", handleVoiceToGemini);
router.post("/recommend", recommendProducts);
router.post("/ask-product", handleAskProductAI);

module.exports = router;
