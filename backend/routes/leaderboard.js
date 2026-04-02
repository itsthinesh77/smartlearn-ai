const router = require('express').Router();
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');

// GET /api/leaderboard — global + weekly rankings
router.get('/', async (req, res) => {
  try {
    const { period } = req.query; // 'weekly' or 'all'

    if (period === 'weekly') {
      const weekAgo = new Date(Date.now() - 7 * 86400000);
      const results = await QuizResult.aggregate([
        { $match: { date: { $gte: weekAgo } } },
        { $group: { _id: '$userId', totalScore: { $sum: '$score' }, quizzes: { $sum: 1 } } },
        { $sort: { totalScore: -1 } },
        { $limit: 20 }
      ]);

      const userIds = results.map(r => r._id);
      const users = await User.find({ _id: { $in: userIds } }).select('name avatar xp level');
      const userMap = {};
      users.forEach(u => { userMap[u._id.toString()] = u; });

      const leaderboard = results.map((r, i) => ({
        rank: i + 1,
        user: userMap[r._id.toString()] || { name: 'Unknown' },
        weeklyScore: r.totalScore,
        quizzes: r.quizzes
      }));

      return res.json({ leaderboard, period: 'weekly' });
    }

    // Global — by XP
    const users = await User.find({ role: 'student' })
      .sort({ xp: -1 }).limit(20)
      .select('name avatar xp level streak.current badges');

    const leaderboard = users.map((u, i) => ({
      rank: i + 1,
      user: { name: u.name, avatar: u.avatar, xp: u.xp, level: u.level, streak: u.streak?.current || 0, badges: u.badges?.length || 0 }
    }));

    res.json({ leaderboard, period: 'all' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
