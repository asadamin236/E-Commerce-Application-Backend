// routes/aiRoutes.js
const express = require("express");
const router = express.Router();
const { recommendProducts } = require("../controllers/aiController");

router.post("/recommend", recommendProducts);

module.exports = router;
