const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/match', require('./routes/match'));

// Test route
app.get('/test', (req, res) => res.send("Server is working!"));

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 InternshipMatch Server running on port ${PORT}`);
  console.log(`-----------------------------------------------`);
});