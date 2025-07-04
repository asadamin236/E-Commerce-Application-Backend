// models/RecommendedProduct.js
const mongoose = require("mongoose");

const recommendedProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: String,
  description: String,
  price: Number,
  image: String,
});

module.exports = mongoose.model("RecommendedProduct", recommendedProductSchema);
