const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// Signup Controller
const signup = async (req, res) => {
  try {
    const { name, email, password, role, adminKey } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    if (role === "admin") {
      if (adminKey !== process.env.JWT_ADMIN_KEY) {
        return res.status(403).json({ error: "Invalid admin key" });
      }

      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin) {
        return res.status(403).json({ error: "An admin already exists" });
      }
    }

    const user = new User({ name, email, password, role: role || "user" });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    // Detailed error logging
    console.error("Signup error:", err);
    console.error("Type:", err && err.name);
    console.error("Message:", err && err.message);
    console.error("Stack:", err && err.stack);
    // Send all info in response (for dev only)
    res.status(500).json({
      error: err.message || "Registration failed",
      type: err.name || null,
      stack: err.stack || null,
      raw: err
    });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

module.exports = { signup, login };
