const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// GET /api/gamification/profile — full gamification data
router.get('/profile', auth, async (req, res) => {
  try {
    const user = req.user;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const isActiveToday = user.streak?.lastActiveDate === today;
    const willExpire = !isActiveToday && user.streak?.lastActiveDate === yesterday;

    // Build 7-day calendar
    const calendar = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      calendar.push({
        date: dateStr,
        day: d.toLocaleDateString('en', { weekday: 'short' }),
        active: (user.streak?.activeDays || []).includes(dateStr),
        isToday: dateStr === today
      });
    }

    // Available badges
    const allBadges = [
      { id: 'quiz_master', name: 'Quiz Master', icon: '🏆', desc: 'Complete 10 quizzes' },
      { id: 'perfect_score', name: 'Perfect Score', icon: '💯', desc: 'Get 100% on a quiz' },
      { id: 'week_warrior', name: 'Week Warrior', icon: '🔥', desc: '7-day streak' },
      { id: 'month_champion', name: 'Month Champion', icon: '👑', desc: '30-day streak' },
      { id: 'rising_star', name: 'Rising Star', icon: '⭐', desc: 'Reach level 5' },
      { id: 'knowledge_seeker', name: 'Knowledge Seeker', icon: '📚', desc: 'Complete 20 topics' },
      { id: 'speed_demon', name: 'Speed Demon', icon: '⚡', desc: 'Complete 5 quizzes in one day' }
    ];

    const earnedIds = (user.badges || []).map(b => b.id);
    const badgeProgress = allBadges.map(b => ({
      ...b,
      earned: earnedIds.includes(b.id),
      earnedAt: user.badges?.find(ub => ub.id === b.id)?.earnedAt || null
    }));

    res.json({
      xp: user.xp,
      level: user.level,
      xpToNextLevel: ((user.level) * 200) - user.xp,
      xpProgress: Math.round((user.xp % 200) / 200 * 100),
      streak: {
        current: isActiveToday || willExpire ? (user.streak?.current || 0) : 0,
        longest: user.streak?.longest || 0,
        isActiveToday,
        willExpire,
        calendar
      },
      badges: badgeProgress,
      completedTopics: user.completedTopics?.length || 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
