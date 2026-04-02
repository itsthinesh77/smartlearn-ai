const router = require('express').Router();
const Question = require('../models/Question');
const QuizResult = require('../models/QuizResult');
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET /api/quiz/:topicId — get questions (adaptive difficulty)
router.get('/:topicId', auth, async (req, res) => {
  try {
    const { topicId } = req.params;
    let { difficulty, limit } = req.query;
    limit = parseInt(limit) || 10;

    // Adaptive difficulty: check past performance
    if (!difficulty) {
      const past = await QuizResult.find({ userId: req.user._id, topicId }).sort({ date: -1 }).limit(3);
      if (past.length > 0) {
        const avgPct = past.reduce((s, r) => s + (r.score / r.total), 0) / past.length * 100;
        if (avgPct >= 80) difficulty = 'hard';
        else if (avgPct >= 50) difficulty = 'medium';
        else difficulty = 'easy';
      } else {
        difficulty = 'easy';
      }
    }

    let questions = await Question.find({ topicId, difficulty }).limit(limit);

    // Fallback: if not enough questions at this difficulty, get any
    if (questions.length < 5) {
      questions = await Question.find({ topicId }).limit(limit);
    }

    // Shuffle
    questions = questions.sort(() => Math.random() - 0.5);

    res.json({
      questions: questions.map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options,
        difficulty: q.difficulty
      })),
      difficulty,
      total: questions.length
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/quiz/submit — submit quiz answers
router.post('/submit', auth, async (req, res) => {
  try {
    const { courseId, topicId, subject, difficulty, answers } = req.body;
    // answers: [{ questionId, userAnswer }]

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers array required' });
    }

    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });
    const qMap = {};
    questions.forEach(q => { qMap[q._id.toString()] = q; });

    let score = 0;
    const processedAnswers = answers.map(a => {
      const q = qMap[a.questionId];
      if (!q) return null;
      const isCorrect = a.userAnswer === q.correct;
      if (isCorrect) score++;
      return {
        question: q.question,
        options: q.options,
        correct: q.correct,
        userAnswer: a.userAnswer,
        isCorrect,
        explanation: q.explanation
      };
    }).filter(Boolean);

    const total = processedAnswers.length;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;

    // XP calculation
    let xpEarned = score * 10;
    if (difficulty === 'hard') xpEarned = Math.round(xpEarned * 1.5);
    if (pct === 100) xpEarned += 50; // Perfect bonus

    // Save result
    const result = await QuizResult.create({
      userId: req.user._id, courseId, topicId, subject,
      score, total, difficulty,
      answers: processedAnswers, xpEarned
    });

    // Update user XP, streak, level, badges
    const user = await User.findById(req.user._id);
    user.xp += xpEarned;
    user.level = Math.floor(user.xp / 200) + 1;

    // Streak update
    const today = new Date().toISOString().split('T')[0];
    if (!user.streak) user.streak = { current: 0, longest: 0, lastActiveDate: null, activeDays: [] };
    if (user.streak.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (user.streak.lastActiveDate === yesterday) {
        user.streak.current += 1;
      } else {
        user.streak.current = 1;
      }
      user.streak.lastActiveDate = today;
      if (!user.streak.activeDays.includes(today)) {
        user.streak.activeDays.push(today);
        if (user.streak.activeDays.length > 365) user.streak.activeDays.shift();
      }
      if (user.streak.current > user.streak.longest) user.streak.longest = user.streak.current;
    }

    // Check badges
    const totalQuizzes = await QuizResult.countDocuments({ userId: user._id });
    const badgeList = user.badges.map(b => b.id);

    if (totalQuizzes >= 10 && !badgeList.includes('quiz_master')) {
      user.badges.push({ id: 'quiz_master', name: 'Quiz Master', icon: '🏆', earnedAt: new Date() });
    }
    if (pct === 100 && !badgeList.includes('perfect_score')) {
      user.badges.push({ id: 'perfect_score', name: 'Perfect Score', icon: '💯', earnedAt: new Date() });
    }
    if (user.streak.current >= 7 && !badgeList.includes('week_warrior')) {
      user.badges.push({ id: 'week_warrior', name: 'Week Warrior', icon: '🔥', earnedAt: new Date() });
    }
    if (user.streak.current >= 30 && !badgeList.includes('month_champion')) {
      user.badges.push({ id: 'month_champion', name: 'Month Champion', icon: '👑', earnedAt: new Date() });
    }
    if (user.level >= 5 && !badgeList.includes('rising_star')) {
      user.badges.push({ id: 'rising_star', name: 'Rising Star', icon: '⭐', earnedAt: new Date() });
    }

    await user.save();

    res.json({
      result: {
        _id: result._id,
        score, total, percentage: pct,
        difficulty,
        answers: processedAnswers,
        courseId, topicId, subject,
        xpEarned
      },
      user: user.toJSON(),
      newBadges: user.badges.filter(b => !badgeList.includes(b.id))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
