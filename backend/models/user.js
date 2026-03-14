const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'company', 'admin'], required: true },
  
  fullName: { type: String },
  course: { type: String },    
  skills: [String],              
  companyName: { type: String },
  industry: { type: String }     
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);