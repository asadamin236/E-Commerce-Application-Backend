const Product = require("../models/productModel");

// Enhanced voice search with better keyword extraction
const extractSearchKeywords = (text) => {
  // Remove common words and extract meaningful keywords
  const commonWords = ['show', 'me', 'find', 'search', 'for', 'get', 'please', 'i', 'want', 'need', 'looking', 'the', 'a', 'an'];
  const words = text.toLowerCase().split(/\s+/).filter(word => 
    word.length > 2 && !commonWords.includes(word)
  );
  return words;
};

const handleVoiceToGemini = async (req, res) => {
  try {
    console.log("Voice search endpoint hit");
    console.log("Request body:", req.body);
    
    const { text } = req.body;
    console.log("Voice search request received:", text);
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ 
        error: "No transcription text provided",
        message: "Please provide a search query"
      });
    }

    // Check if Product model is available
    if (!Product) {
      console.error("Product model is not available");
      return res.status(500).json({
        success: false,
        error: "Database model not found",
        message: "Product model is not available"
      });
    }

    // Extract keywords from voice input
    const keywords = extractSearchKeywords(text);
    console.log("Extracted keywords:", keywords);

    let products = [];
    
    try {
      if (keywords.length > 0) {
        // Create regex patterns for each keyword
        const regexPatterns = keywords.map(keyword => new RegExp(keyword, "i"));
        
        // Search for products matching any of the keywords
        products = await Product.find({
          $or: [
            ...regexPatterns.map(regex => ({ title: regex })),
            ...regexPatterns.map(regex => ({ category: regex })),
            ...regexPatterns.map(regex => ({ description: regex })),
          ],
        }).limit(50); // Limit results to prevent overwhelming response
      } else {
        // Fallback: search with original text
        const regex = new RegExp(text, "i");
        products = await Product.find({
          $or: [
            { title: regex },
            { category: regex },
            { description: regex },
          ],
        }).limit(50);
      }
    } catch (dbError) {
      console.error("Database query error:", dbError);
      
      // Return a fallback response instead of complete failure
      return res.json({
        success: true,
        products: [],
        searchQuery: text,
        extractedKeywords: keywords,
        totalResults: 0,
        message: `Voice search processed for "${text}" but database is temporarily unavailable. Please try again later.`,
        fallback: true,
        error: "Database temporarily unavailable",
        timestamp: new Date().toISOString()
      });
    }

    console.log(`Found ${products.length} products for voice search: "${text}"`);
    
    // Enhanced response with more details
    const response = {
      success: true,
      products,
      searchQuery: text,
      extractedKeywords: keywords,
      totalResults: products.length,
      message: products.length > 0 
        ? `Found ${products.length} products matching "${text}"` 
        : `No products found for "${text}". Try searching for categories like "shoes", "laptops", or "phones"`,
      timestamp: new Date().toISOString()
    };

    res.json(response);
    
  } catch (error) {
    console.error("Voice search error:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Error details:", error);
    
    res.status(500).json({ 
      success: false,
      error: "Failed to process voice input",
      message: "Internal server error occurred while processing your voice search",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = { handleVoiceToGemini };
