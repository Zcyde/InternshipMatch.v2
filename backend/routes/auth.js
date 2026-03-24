const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// ================= REGISTER =================
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, email } = req.body || {};

    if (!username || !password || !name || !email) {
      return res.status(400).json({ 
        status: "error", 
        message: "All fields (Username, Password, Name, Email) are required." 
      });
    }

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) {
      return res.status(400).json({ 
        status: "error", 
        message: "Username or Email is already registered." 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ 
      username, 
      password: hashedPassword, 
      fullName: name, 
      email: email,
      role: 'student'
    });

    await newUser.save();

    // Return fullName so front-end can store it if needed
    return res.status(201).json({ 
      status: "success", 
      message: "Registration successful! You can now log in.",
      fullName: newUser.fullName
    });

  } catch (err) {
    console.error("❌ Registration Error:", err);
    return res.status(500).json({ 
      status: "error", 
      message: "Internal server error during registration." 
    });
  }
});

// ================= LOGIN =================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ 
        status: "error", 
        message: "Username/Email and Password are required." 
      });
    }

    const user = await User.findOne({ 
      $or: [{ username }, { email: username }] 
    });

    if (!user) {
      return res.status(401).json({ status: "error", message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: "error", message: "Invalid credentials." });
    }

    return res.json({ 
      status: "success", 
      role: user.role, 
      userId: user._id,
      fullName: user.fullName // Send real name to front-end
    });

  } catch (err) {
    console.error("❌ Login Error:", err);
    return res.status(500).json({ 
      status: "error", 
      message: "Internal server error during login." 
    });
  }
});

module.exports = router;