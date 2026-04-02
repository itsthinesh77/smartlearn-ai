const router = require('express').Router();
const QuizResult = require('../models/QuizResult');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// GET /api/performance — overall stats
router.get('/', auth, async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.user._id });

    if (results.length === 0) {
      return res.json({
        totalQuizzes: 0, avgScore: 0, accuracy: 0,
        totalCorrect: 0, totalQuestions: 0,
        subjectPerformance: {}, topicPerformance: {}
      });
    }

    const totalQuizzes = results.length;
    const totalCorrect = results.reduce((s, r) => s + r.score, 0);
    const totalQuestions = results.reduce((s, r) => s + r.total, 0);
    const accuracy = Math.round((totalCorrect / totalQuestions) * 100);

    // Per-subject
    const subjects = {};
    results.forEach(r => {
      if (!r.subject) return;
      if (!subjects[r.subject]) subjects[r.subject] = { correct: 0, total: 0, quizzes: 0 };
      subjects[r.subject].correct += r.score;
      subjects[r.subject].total += r.total;
      subjects[r.subject].quizzes += 1;
    });
    for (const s of Object.keys(subjects)) {
      subjects[s].accuracy = Math.round((subjects[s].correct / subjects[s].total) * 100);
    }

    // Per-topic
    const topics = {};
    results.forEach(r => {
      if (!r.topicId) return;
      if (!topics[r.topicId]) topics[r.topicId] = { scores: [], courseId: r.courseId, subject: r.subject };
      topics[r.topicId].scores.push(Math.round((r.score / r.total) * 100));
    });
    for (const t of Object.keys(topics)) {
      const best = Math.max(...topics[t].scores);
      topics[t] = { ...topics[t], accuracy: best, attempts: topics[t].scores.length };
      delete topics[t].scores;
    }

    res.json({
      totalQuizzes, avgScore: accuracy, accuracy,
      totalCorrect, totalQuestions,
      subjectPerformance: subjects,
      topicPerformance: topics
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/performance/weak — weak topics
router.get('/weak', auth, async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.user._id });
    const topics = {};
    results.forEach(r => {
      if (!r.topicId) return;
      if (!topics[r.topicId]) topics[r.topicId] = { scores: [], courseId: r.courseId, subject: r.subject };
      topics[r.topicId].scores.push(Math.round((r.score / r.total) * 100));
    });

    const weak = [];
    for (const [topicId, data] of Object.entries(topics)) {
      const best = Math.max(...data.scores);
      if (best < 70) {
        weak.push({
          topicId, courseId: data.courseId, subject: data.subject,
          accuracy: best, attempts: data.scores.length,
          status: best < 40 ? 'weak' : 'average'
        });
      }
    }
    weak.sort((a, b) => a.accuracy - b.accuracy);

    // Resolve topic names
    const courseIds = [...new Set(weak.map(w => w.courseId).filter(Boolean))];
    const courses = await Course.find({ cid: { $in: courseIds } });
    const topicNames = {};
    courses.forEach(c => c.topics.forEach(t => { topicNames[t.tid] = { name: t.name, courseName: c.name }; }));

    const enriched = weak.map(w => ({
      ...w,
      topicName: topicNames[w.topicId]?.name || w.topicId,
      courseName: topicNames[w.topicId]?.courseName || ''
    }));

    res.json({ weakTopics: enriched });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/performance/recommendations — smart recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.user._id }).sort({ date: -1 }).limit(5);
    const recs = [];

    for (const r of results) {
      const pct = Math.round((r.score / r.total) * 100);
      if (pct < 70 && r.topicId) {
        recs.push({
          type: pct < 40 ? 'notes' : 'practice',
          topicId: r.topicId,
          courseId: r.courseId,
          subject: r.subject,
          accuracy: pct,
          message: pct < 40
            ? `Review notes for this topic — you scored ${pct}%`
            : `Practice more quizzes — ${pct}% accuracy`
        });
      }
    }

    res.json({ recommendations: recs.slice(0, 5) });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/performance/history — recent quiz history
router.get('/history', auth, async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.user._id })
      .sort({ date: -1 }).limit(20)
      .select('courseId topicId subject score total difficulty xpEarned date');
    res.json({ history: results });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
