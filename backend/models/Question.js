const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  topicId: { type: String, required: true, index: true },
  courseId: { type: String, default: '' },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correct: { type: Number, required: true },
  explanation: { type: String, default: '' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
});

questionSchema.index({ topicId: 1, difficulty: 1 });

module.exports = mongoose.model('Question', questionSchema);
