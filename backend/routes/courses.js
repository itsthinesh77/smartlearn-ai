const router = require('express').Router();
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// GET /api/courses — list courses (filterable by level, subject)
router.get('/', async (req, res) => {
  try {
    const { level, subject } = req.query;
    const filter = {};
    if (level) filter.level = level;
    if (subject) filter.subject = subject;

    const courses = await Course.find(filter).select('-topics.notes');
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/courses/:id — full course with topics
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findOne({ cid: req.params.id });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ course });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/courses/complete-topic — mark topic complete
router.put('/complete-topic', auth, async (req, res) => {
  try {
    const { topicId } = req.body;
    if (!topicId) return res.status(400).json({ error: 'topicId required' });

    if (!req.user.completedTopics.includes(topicId)) {
      req.user.completedTopics.push(topicId);
      req.user.xp += 10;
      await req.user.save();
    }
    res.json({ user: req.user, xpEarned: 10 });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
