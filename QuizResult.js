const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, default: 'general' },
    pct: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuizResult', quizResultSchema);
