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
router.get("/voice/status", async (req, res) => {
  const mongoose = require("mongoose");
  const RecommendedProduct = require("../models/RecommendedProduct");
  
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState;
    const dbStates = {
      0: "disconnected",
      1: "connected", 
      2: "connecting",
      3: "disconnecting"
    };

    // Try to count products
    let productCount = 0;
    let dbError = null;
    
    try {
      productCount = await RecommendedProduct.countDocuments();
    } catch (error) {
      dbError = error.message;
    }

    res.json({
      success: true,
      service: "Voice Search API",
      status: "operational",
      version: "1.0.0",
      database: {
        status: dbStates[dbStatus] || "unknown",
        connected: dbStatus === 1,
        productCount: productCount,
        error: dbError
      },
      features: [
        "Speech-to-text processing",
        "Keyword extraction", 
        "Product search",
        "Real-time results"
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      success: false,
      service: "Voice Search API", 
      status: "error",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
