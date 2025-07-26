const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

// ✅ Load environment variables from .env
dotenv.config();

// ✅ Create Express app
const app = express();
<<<<<<< HEAD
=======

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "https://e-commerce-application-jzff.vercel.app/", // frontend Vercel URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(morgan("dev"));
>>>>>>> e3e5f0a823ee9b7714046671609ac4f50af66788

// ✅ Middleware
app.use(express.json()); // Parses incoming JSON
app.use(cors()); // Enables CORS
app.use(morgan("dev")); // Logs HTTP requests
// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const voiceRoutes = require("./routes/voiceRoutes");
const aiRoutes = require("./routes/aiRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

// ✅ Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", voiceRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

<<<<<<< HEAD
// ✅ Test Route
=======
// Test route
>>>>>>> e3e5f0a823ee9b7714046671609ac4f50af66788
app.get("/", (req, res) => {
  res.send("✅ AI Server is Running");
});

<<<<<<< HEAD
// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Start the Server
=======
// DB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
>>>>>>> e3e5f0a823ee9b7714046671609ac4f50af66788
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

