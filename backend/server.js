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

// Helper function to log counts
const logUserStats = async () => {
  try {
    const count = await User.countDocuments();
    console.log(`📊 Current Database Stats: ${count} total users registered.`);
  } catch (err) {
    console.error("Could not fetch user stats");
  }
};

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("✅ Connected to MongoDB Atlas");
  logUserStats();
})
.catch(err => console.error("❌ MongoDB connection error:", err));

// ================= REGISTER =================
app.post('/api/register', async (req, res) => {
  try {
    console.log("\n--- 🆕 NEW REGISTRATION ATTEMPT ---");
    console.log("Incoming Data:", req.body);

    const { username, password } = req.body || {};

    if (!username || !password) {
      console.log("⚠️  Result: Failed (Missing username/password)");
      return res.status(400).json({ status: "error", message: "Missing username or password" });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      console.log(`⚠️  Result: Failed (User '${username}' already exists)`);
      return res.status(400).json({ status: "error", message: "Student already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // FIX: Explicitly include 'role' because your Schema requires it
    const newUser = new User({ 
      username, 
      password: hashedPassword,
      role: 'student' // This matches your requirements for InternshipMatch
    });

    await newUser.save();

    console.log(`🚀 SUCCESS: Account created for [${username}]`);
    await logUserStats();

    return res.status(201).json({ status: "success", message: "Registration successful" });
  } catch (err) {
    console.error("❌ Registration Error:", err); // This will no longer show 'role required'
    return res.status(500).json({ status: "error", message: "Registration failed" });
  }
});

// ================= LOGIN =================
app.post('/api/login', async (req, res) => {
  try {
    console.log("\n--- 🔑 LOGIN ATTEMPT ---");
    const { username, password } = req.body || {};

    if (username === "admin" && password === "admin123") {
      console.log("⚡ Result: Admin Override Login Successful");
      return res.json({ status: "success", role: "admin" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.log(`❌ Result: Failed (User '${username}' not found)`);
      return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`❌ Result: Failed (Incorrect password for '${username}')`);
      return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }

    console.log(`✅ Result: Successful Login for [${username}] as STUDENT`);
    return res.json({ status: "success", role: user.role });

  } catch (err) {
    console.error("❌ Login Route Error:", err);
    return res.status(500).json({ status: "error", message: "Server error during login" });
  }
});

// ================= TEST ROUTE =================
app.get('/test', (req, res) => res.send("Server is working!"));

// ================= SERVER START =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 InternshipMatch Server running on port ${PORT}`);
  console.log(`-----------------------------------------------`);
});