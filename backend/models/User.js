const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  educationLevel: { type: String, enum: ['school', 'university', null], default: null },
  avatar: { type: String, default: '🎓' },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },

  // Gamification
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [{ id: String, name: String, icon: String, earnedAt: Date }],

  // Streak
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActiveDate: { type: String, default: null },
    activeDays: [String]
  },

  completedTopics: [String],
  createdAt: { type: Date, default: Date.now }
});

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
