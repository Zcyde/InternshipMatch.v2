const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'company', 'admin'], required: true, default: 'student' },
  
  // Updated fields
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Added this
  
  // Student specific
  course: { type: String },    
  skills: [String],              
  
  // Company specific
  companyName: { type: String },
  industry: { type: String }     
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);