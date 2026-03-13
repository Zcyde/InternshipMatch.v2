const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/user');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ================= REGISTER =================
app.post('/api/register', async (req, res) => {
  try {
    console.log("Register request body:", req.body);

    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ status: "error", message: "Missing username or password" });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ status: "error", message: "Student already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ status: "success", message: "Registration successful" });
  } catch (err) {
    console.error("Registration Error:", err);
    return res.status(500).json({ status: "error", message: "Registration failed" });
  }
});

// ================= LOGIN =================
app.post('/api/login', async (req, res) => {
  try {
    console.log("Login request body:", req.body);

    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ status: "error", message: "Missing username or password" });
    }

    // Admin override
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

    return res.json({ status: "success", role: "student" });

  } catch (err) {
    console.error("Login Route Error:", err);
    return res.status(500).json({ status: "error", message: "Server error during login" });
  }
});

// ================= TEST ROUTE =================
app.get('/test', (req, res) => res.send("Server is working!"));

// ================= SERVER START =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));