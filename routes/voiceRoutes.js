const express = require("express");
const router = express.Router();
const { handleVoiceToGemini } = require("../controllers/voiceController");

// Enhanced voice search endpoint with better error handling
router.post("/voice", async (req, res) => {
  try {
    await handleVoiceToGemini(req, res);
  } catch (error) {
    console.error("Voice route error:", error);
    res.status(500).json({
      success: false,
      error: "Voice search service unavailable",
      message: "The voice search service is currently experiencing issues. Please try again later.",
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint for voice service
router.get("/voice", (req, res) => {
  res.json({
    success: true,
    message: "Voice search endpoint is operational. Use POST with 'text' parameter for voice search.",
    endpoint: "/api/ai/voice",
    method: "POST",
    expectedPayload: {
      text: "your voice transcript here"
    },
    timestamp: new Date().toISOString()
  });
});

// Voice search status endpoint
router.get("/voice/status", (req, res) => {
  res.json({
    success: true,
    service: "Voice Search API",
    status: "operational",
    version: "1.0.0",
    features: [
      "Speech-to-text processing",
      "Keyword extraction",
      "Product search",
      "Real-time results"
    ],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
