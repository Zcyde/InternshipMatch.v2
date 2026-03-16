const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// ================= REGISTER =================
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ status: "error", message: "Missing username or password" });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ status: "error", message: "Student already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role: 'student' });
    await newUser.save();

    return res.status(201).json({ status: "success", message: "Registration successful" });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    return res.status(500).json({ status: "error", message: "Registration failed" });
  }
});

// ================= LOGIN =================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (username === "admin" && password === "admin123") {
      return res.json({ status: "success", role: "admin" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }

    return res.json({ status: "success", role: user.role, userId: user._id });
  } catch (err) {
    console.error("❌ Login Error:", err);
    return res.status(500).json({ status: "error", message: "Server error during login" });
  }
});

module.exports = router;