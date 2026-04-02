const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  tid: { type: String, required: true },
  name: { type: String, required: true },
  notes: { type: String, default: '' },
  videoUrl: { type: String, default: '' }
}, { _id: false });

const courseSchema = new mongoose.Schema({
  cid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  subject: { type: String, required: true },
  icon: { type: String, default: '📖' },
  color: { type: String, default: '#4f7df7' },
  description: { type: String, default: '' },
  level: { type: String, enum: ['school', 'university'], required: true },
  topics: [topicSchema]
});

courseSchema.index({ level: 1, subject: 1 });

module.exports = mongoose.model('Course', courseSchema);
