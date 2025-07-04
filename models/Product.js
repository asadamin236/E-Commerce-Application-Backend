// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  price: Number,
  image: String,
});

module.exports = mongoose.model("Product", productSchema);
