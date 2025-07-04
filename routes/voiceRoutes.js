const express = require("express");
const router = express.Router();
const { handleVoiceToGemini } = require("../controllers/voiceController");

router.post("/voice", handleVoiceToGemini);

module.exports = router;
