// ===== SmartLearn AI — Dual-Mode State Management =====
// Mode 1: C++ Native Backend (localhost:5000) — for local use
// Mode 2: localStorage fallback — for Vercel/cloud deployments (fully persistent)

// ---- In-memory cache ----
let _currentUser = null;

// ---- Storage Keys ----
const KEY_USERS_DB    = 'sl_users_db';     // all registered accounts
const KEY_RESULTS_DB  = 'sl_results_db';   // all quiz results
const KEY_SESSION     = 'sl_user';         // active session (email + password)

const CPP_API_URL = 'http://localhost:5000/api';
let _cppAvailable = null; // null = not checked yet

// =====================================================
// ---- Backend Detection ----
// =====================================================
async function isCppAvailable() {
  if (_cppAvailable !== null) return _cppAvailable;
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 1500);
    const res = await fetch(`${CPP_API_URL}/courses?level=all`, { signal: ctrl.signal });
    _cppAvailable = res.ok;
  } catch {
    _cppAvailable = false;
  }
  console.log(_cppAvailable ? '🖥️ C++ Backend detected' : '☁️ Using localStorage fallback');
  return _cppAvailable;
}

// =====================================================
// ---- localStorage Helpers ----
// =====================================================
function ls_getUsers() {
  try { return JSON.parse(localStorage.getItem(KEY_USERS_DB) || '[]'); } catch { return []; }
}
function ls_saveUsers(users) {
  localStorage.setItem(KEY_USERS_DB, JSON.stringify(users));
}
function ls_getResults() {
  try { return JSON.parse(localStorage.getItem(KEY_RESULTS_DB) || '[]'); } catch { return []; }
}
function ls_saveResults(results) {
  localStorage.setItem(KEY_RESULTS_DB, JSON.stringify(results));
}
function ls_getUserById(id) {
  return ls_getUsers().find(u => u.id === id) || null;
}
function ls_updateUser(updated) {
  const users = ls_getUsers().map(u => u.id === updated.id ? { ...u, ...updated } : u);
  ls_saveUsers(users);
  // Also keep in-memory cache in sync
  if (_currentUser && _currentUser.id === updated.id) {
    _currentUser = { ..._currentUser, ...updated };
  }
}
function generateId() {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

// =====================================================
// ---- Auth (localStorage mode) ----
// =====================================================
function ls_register(name, email, password) {
  const users = ls_getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { error: 'User already exists' };
  }
  const newUser = {
    id: generateId(), name, email, password,
    xp: 0, education_level: null, completed_topics: [],
    streak_current: 0, streak_longest: 0,
    streak_last_active: null, streak_active_days: [],
    badges: [], avatar: '🎓', created_at: new Date().toISOString()
  };
  ls_saveUsers([...users, newUser]);
  return { status: 'success', user: newUser };
}

function ls_login(email, password) {
  const user = ls_getUsers().find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) {
    const exists = ls_getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    return { error: exists ? 'Invalid password' : 'User not found' };
  }
  return { status: 'success', user };
}

// =====================================================
// ---- Public Auth API ----
// =====================================================
export async function loginUser(email, password) {
  const cpp = await isCppAvailable();

  if (cpp) {
    try {
      const res = await fetch(`${CPP_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.status === 'success') {
        _currentUser = { ...data.user, email };
        localStorage.setItem(KEY_SESSION, JSON.stringify({ email, password }));
        window.dispatchEvent(new Event('auth-changed'));
        console.log('✅ Authenticated via C++ Backend');
        return { user: getFormattedUser() };
      }
      return { error: data.error || 'Login failed' };
    } catch (e) {
      _cppAvailable = false; // mark as unavailable and fallback
    }
  }

  // localStorage fallback
  const result = ls_login(email, password);
  if (result.error) return { error: result.error };

  _currentUser = result.user;
  localStorage.setItem(KEY_SESSION, JSON.stringify({ email, password }));
  window.dispatchEvent(new Event('auth-changed'));
  console.log('✅ Authenticated via localStorage');
  return { user: getFormattedUser() };
}

export async function registerUser(name, email, password) {
  const cpp = await isCppAvailable();

  if (cpp) {
    try {
      const res = await fetch(`${CPP_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const data = await res.json();
      if (data.status === 'success') {
        return await loginUser(email, password);
      }
      return { error: data.error || 'Registration failed' };
    } catch (e) {
      _cppAvailable = false;
    }
  }

  // localStorage fallback
  const result = ls_register(name, email, password);
  if (result.error) return { error: result.error };

  _currentUser = result.user;
  localStorage.setItem(KEY_SESSION, JSON.stringify({ email, password }));
  window.dispatchEvent(new Event('auth-changed'));
  console.log('✅ Registered via localStorage');
  return { user: getFormattedUser() };
}

export async function initAuth() {
  const saved = localStorage.getItem(KEY_SESSION);
  if (saved) {
    try {
      const { email, password } = JSON.parse(saved);
      await loginUser(email, password);
    } catch { localStorage.removeItem(KEY_SESSION); }
  }
}

export async function logout() {
  // Persist any pending profile changes before logout
  if (_currentUser) ls_updateUser(_currentUser);
  _currentUser = null;
  localStorage.removeItem(KEY_SESSION);
  window.dispatchEvent(new Event('auth-changed'));
}

export function isAdmin() {
  return _currentUser?.email === 'admin@smartlearn.com';
}

// =====================================================
// ---- User Formatting ----
// =====================================================
export function getCurrentUser() {
  if (!_currentUser) return null;
  return getFormattedUser();
}

function getFormattedUser() {
  if (!_currentUser) return null;
  return {
    id: _currentUser.id,
    email: _currentUser.email || '',
    name: _currentUser.name || 'Student',
    avatar: _currentUser.avatar || '🎓',
    role: _currentUser.email === 'admin@smartlearn.com' ? 'admin' : 'student',
    xp: _currentUser.xp || 0,
    education_level: _currentUser.education_level || null,
    level: Math.floor((_currentUser.xp || 0) / 200) + 1,
    badges: _currentUser.badges || [],
    streak: {
      current: _currentUser.streak_current || 0,
      longest: _currentUser.streak_longest || 0,
      lastActiveDate: _currentUser.streak_last_active,
      activeDays: _currentUser.streak_active_days || []
    }
  };
}

// =====================================================
// ---- Education Level ----
// =====================================================
export async function setEducationLevel(userId, level) {
  if (_currentUser) {
    _currentUser.education_level = level;
    ls_updateUser({ id: _currentUser.id, education_level: level });
    await saveProfileUpdate();
  }
}

export function getEducationLevel(userId) {
  return _currentUser?.education_level || null;
}

// =====================================================
// ---- Courses ----
// =====================================================
export async function fetchCourses(level) {
  const cpp = await isCppAvailable();
  if (cpp) {
    try {
      const res = await fetch(`${CPP_API_URL}/courses?level=${level || 'all'}`);
      const data = await res.json();
      console.log(`📚 Loaded ${data.length} courses from C++ Backend`);
      return data;
    } catch { _cppAvailable = false; }
  }
  return []; // Frontend static data used via window.__COURSES in app.js
}

export async function fetchCourse(cid) {
  const courses = await fetchCourses('all');
  return courses.find(c => c.id === cid);
}

// =====================================================
// ---- Quiz ----
// =====================================================
export async function fetchQuestions(topicId, difficulty, limit = 10) {
  if (window.__GET_QUESTIONS) {
    return window.__GET_QUESTIONS(topicId, difficulty, limit);
  }
  return [];
}

export async function saveQuizResult(result) {
  const entry = {
    ...result,
    id: Date.now().toString(),
    date: new Date().toISOString()
  };

  // Try C++ backend
  const cpp = await isCppAvailable();
  if (cpp) {
    try {
      await fetch(`${CPP_API_URL}/quiz/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    } catch { _cppAvailable = false; }
  }

  // Always persist to localStorage (source of truth for cloud)
  const results = ls_getResults();
  ls_saveResults([...results, entry]);

  // Update user XP in memory and localStorage
  if (_currentUser) {
    _currentUser.xp = (_currentUser.xp || 0) + (result.xpEarned || 0);
    ls_updateUser({ id: _currentUser.id, xp: _currentUser.xp });
    await saveProfileUpdate();
  }

  return entry;
}

export async function getUserQuizHistory(userId) {
  const cpp = await isCppAvailable();
  if (cpp) {
    try {
      const res = await fetch(`${CPP_API_URL}/quiz/results`);
      const data = await res.json();
      return (data || []).filter(r => r.userId === userId);
    } catch { _cppAvailable = false; }
  }
  // localStorage fallback
  return ls_getResults().filter(r => r.userId === userId);
}

// =====================================================
// ---- Leaderboard ----
// =====================================================
export async function fetchLeaderboard() {
  let results = [];
  const cpp = await isCppAvailable();
  if (cpp) {
    try {
      const res = await fetch(`${CPP_API_URL}/quiz/results`);
      results = await res.json();
    } catch { _cppAvailable = false; }
  }
  if (!results.length) results = ls_getResults();

  const userStats = {};
  results.forEach(r => {
    if (!userStats[r.userId]) userStats[r.userId] = { name: r.name || 'Student', score: 0, quizzes: 0, totalCorrect: 0, totalQ: 0 };
    userStats[r.userId].score += r.xpEarned || 0;
    userStats[r.userId].quizzes += 1;
    userStats[r.userId].totalCorrect += r.score;
    userStats[r.userId].totalQ += r.total;
  });

  return Object.entries(userStats).map(([id, s]) => ({
    userId: id, name: s.name, avatar: '🎓',
    score: s.score, quizzes: s.quizzes,
    accuracy: s.totalQ > 0 ? Math.round((s.totalCorrect / s.totalQ) * 100) : 0
  })).sort((a, b) => b.score - a.score);
}

// =====================================================
// ---- Profile Sync ----
// =====================================================
async function saveProfileUpdate() {
  if (!_currentUser) return;
  // Persist to localStorage immediately
  ls_updateUser({
    id: _currentUser.id,
    xp: _currentUser.xp,
    education_level: _currentUser.education_level,
    completed_topics: _currentUser.completed_topics || []
  });
  // Try C++ backend
  try {
    const cpp = await isCppAvailable();
    if (cpp) {
      await fetch(`${CPP_API_URL}/profiles/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: _currentUser.id,
          xp: _currentUser.xp,
          education_level: _currentUser.education_level
        })
      });
    }
  } catch {}
}

// =====================================================
// ---- Topic Completion ----
// =====================================================
export async function markTopicComplete(userId, topicId) {
  if (_currentUser) {
    if (!_currentUser.completed_topics) _currentUser.completed_topics = [];
    if (!_currentUser.completed_topics.includes(topicId)) {
      _currentUser.completed_topics.push(topicId);
      _currentUser.xp = (_currentUser.xp || 0) + 10;
      await saveProfileUpdate();
    }
  }
}

export function isTopicCompleted(userId, topicId) {
  return (_currentUser?.completed_topics || []).includes(topicId);
}

export function getCompletedTopics(userId) {
  return (_currentUser?.completed_topics || []).map(topicId => ({ userId, topicId }));
}

// =====================================================
// ---- Performance Analytics ----
// =====================================================
export async function getPerformanceSummary(userId) {
  const history = await getUserQuizHistory(userId);
  if (history.length === 0) return { totalQuizzes: 0, avgScore: 0, accuracy: 0, totalCorrect: 0, totalQuestions: 0 };
  const totalCorrect = history.reduce((s, q) => s + q.score, 0);
  const totalQuestions = history.reduce((s, q) => s + q.total, 0);
  return {
    totalQuizzes: history.length,
    avgScore: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
    accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
    totalCorrect, totalQuestions
  };
}

export async function getSubjectPerformance(userId) {
  const history = await getUserQuizHistory(userId);
  const subjects = {};
  history.forEach(q => {
    const sub = q.subject || 'General';
    if (!subjects[sub]) subjects[sub] = { correct: 0, total: 0, quizzes: 0 };
    subjects[sub].correct += q.score;
    subjects[sub].total += q.total;
    subjects[sub].quizzes += 1;
  });
  const result = {};
  for (const [sub, data] of Object.entries(subjects)) {
    result[sub] = { ...data, accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0 };
  }
  return result;
}

export async function getWeakAreas(userId) {
  const perf = await getSubjectPerformance(userId);
  return Object.entries(perf)
    .filter(([_, data]) => data.accuracy < 60)
    .map(([sub, data]) => ({ subject: sub, name: sub, accuracy: data.accuracy }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

// =====================================================
// ---- Topic-Level Analytics ----
// =====================================================

/**
 * Returns a map of { [topicId]: { accuracy, attempts, courseId } }
 * built from localStorage quiz history.
 */
export async function getAllTopicPerformances(userId) {
  const history = await getUserQuizHistory(userId);
  const topics = {};
  history.forEach(r => {
    if (!r.topicId) return;
    if (!topics[r.topicId]) {
      topics[r.topicId] = { correct: 0, total: 0, attempts: 0, courseId: r.courseId || '' };
    }
    topics[r.topicId].correct  += r.score  || 0;
    topics[r.topicId].total    += r.total   || 0;
    topics[r.topicId].attempts += 1;
    if (r.courseId) topics[r.topicId].courseId = r.courseId;
  });
  const result = {};
  for (const [tid, d] of Object.entries(topics)) {
    result[tid] = {
      ...d,
      accuracy: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0
    };
  }
  return result;
}

/**
 * Returns an array of weak topics (accuracy < 60%) sorted worst-first.
 * Each entry: { topicId, courseId, accuracy, attempts }
 */
export async function getWeakTopics(userId) {
  const perfs = await getAllTopicPerformances(userId);
  return Object.entries(perfs)
    .filter(([_, d]) => d.accuracy < 60)
    .map(([topicId, d]) => ({ topicId, courseId: d.courseId, accuracy: d.accuracy, attempts: d.attempts }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

/**
 * Returns 'easy' | 'medium' | 'hard' based on the user's recent
 * performance in a given course. Falls back to 'easy' for new users.
 */
export function getRecommendedDifficulty(userId, courseId) {
  const results = ls_getResults().filter(r => r.userId === userId && r.courseId === courseId);
  if (results.length === 0) return 'easy';
  // Use most recent 5 attempts
  const recent = results.slice(-5);
  const totalCorrect = recent.reduce((s, r) => s + (r.score || 0), 0);
  const totalQ      = recent.reduce((s, r) => s + (r.total  || 1), 0);
  const accuracy    = Math.round((totalCorrect / totalQ) * 100);
  if (accuracy >= 80) return 'hard';
  if (accuracy >= 55) return 'medium';
  return 'easy';
}

/**
 * Synchronous version of topic performance for the courses list.
 * Uses localStorage results for immediate rendering.
 */
export function getTopicPerformance(userId, topicId) {
  const results = ls_getResults().filter(r => r.userId === userId && r.topicId === topicId);
  if (results.length === 0) return null;

  const totalCorrect = results.reduce((s, r) => s + (r.score || 0), 0);
  const totalQ      = results.reduce((s, r) => s + (r.total  || 1), 0);

  return {
    accuracy: Math.round((totalCorrect / totalQ) * 100),
    attempts: results.length
  };
}

export function getCompletionProgress(userId) {
  const completed = _currentUser?.completed_topics || [];
  const totalTopics = 100;
  return {
    completed: completed.length, total: totalTopics,
    percentage: Math.round((completed.length / totalTopics) * 100)
  };
}

export function getStreakData(userId) {
  return {
    currentStreak: _currentUser?.streak_current || 1,
    longestStreak: _currentUser?.streak_longest || 1,
    isActiveToday: true, willExpire: false, calendar: []
  };
}
