const express = require("express");
const router = express.Router();
const { handleVoiceToGemini } = require("../controllers/voiceController");

router.post("/voice", handleVoiceToGemini);

// Allow GET requests for /voice (for browser testing)
router.get("/voice", (req, res) => {
  res.json({
    message: "Voice endpoint is working. Use POST for actual functionality.",
  });
});

module.exports = router;
