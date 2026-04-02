const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  courseId: { type: String, required: true },
  topicId: { type: String, default: '' },
  subject: { type: String, default: '' },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  answers: [{
    question: String,
    options: [String],
    correct: Number,
    userAnswer: Number,
    isCorrect: Boolean,
    explanation: String
  }],
  xpEarned: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

quizResultSchema.index({ userId: 1, topicId: 1 });
quizResultSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('QuizResult', quizResultSchema);
