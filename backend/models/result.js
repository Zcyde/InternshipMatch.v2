const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  isReady: {
    type: Boolean,
    required: true
  },
  matchedSkills: [
    {
      name: { type: String },
      studentLevel: { type: Number },
      targetLevel: { type: Number },
      contribution: { type: Number }
    }
  ],
  missingSkills: [
    {
      name: { type: String },
      targetLevel: { type: Number }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);