// ===== Supabase-backed State Management =====
import { supabase } from './supabase.js';

// ---- Local cache (for sync reads during render) ----
let _currentUser = null;
let _profile = null;

// ---- Auth ----
export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  _currentUser = data.user;
  await loadProfile();
  window.dispatchEvent(new Event('auth-changed'));
  return { user: getFormattedUser() };
}

/**
 * BYPASS AUTH (Dev Only) 
 * Bypasses Supabase email confirmation limits for local testing.
 */
export async function bypassAuth() {
  _currentUser = {
    id: '00000000-0000-0000-0000-000000000000',
    email: 'dev@smartlearn.com',
    user_metadata: { name: 'Dev Guest' }
  };
  _profile = {
    id: _currentUser.id,
    name: 'Dev Guest',
    email: _currentUser.email,
    education_level: 'university',
    xp: 1250,
    level: 7,
    streak_current: 5,
    streak_longest: 12,
    streak_last_active: new Date().toISOString().split('T')[0],
    streak_active_days: [new Date().toISOString().split('T')[0]],
    completed_topics: [],
    badges: [{ id: 'quiz_master', name: 'Quiz Master', icon: '🏆' }]
  };
  
  window.dispatchEvent(new Event('auth-changed'));
  return { user: getFormattedUser() };
}

export async function registerUser(name, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { name } }
  });
  if (error) return { error: error.message };

  _currentUser = data.user;

  // Update profile name
  if (_currentUser) {
    await supabase.from('profiles').update({ name }).eq('id', _currentUser.id);
    await loadProfile();
  }

  window.dispatchEvent(new Event('auth-changed'));
  return { user: getFormattedUser() };
}

export async function initAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    _currentUser = session.user;
    await loadProfile();
  }

  // Listen for auth changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      _currentUser = session.user;
      await loadProfile();
    } else {
      _currentUser = null;
      _profile = null;
    }
    window.dispatchEvent(new Event('auth-changed'));
  });
}

async function loadProfile() {
  if (!_currentUser) return;
  const { data } = await supabase.from('profiles').select('*').eq('id', _currentUser.id).single();
  _profile = data;
}

export function getCurrentUser() {
  if (!_currentUser || !_profile) return null;
  return getFormattedUser();
}

function getFormattedUser() {
  if (!_currentUser) return null;
  return {
    id: _currentUser.id,
    email: _currentUser.email,
    name: _profile?.name || _currentUser.email.split('@')[0],
    avatar: _profile?.avatar || '🎓',
    role: _profile?.email === 'admin@smartlearn.com' ? 'admin' : 'student',
    xp: _profile?.xp || 0,
    level: _profile?.level || 1,
    badges: _profile?.badges || [],
    streak: {
      current: _profile?.streak_current || 0,
      longest: _profile?.streak_longest || 0,
      lastActiveDate: _profile?.streak_last_active,
      activeDays: _profile?.streak_active_days || []
    }
  };
}

export async function logout() {
  await supabase.auth.signOut();
  _currentUser = null;
  _profile = null;
}

export function isAdmin() {
  return _profile?.email === 'admin@smartlearn.com';
}

// ---- Education Level ----
export async function setEducationLevel(userId, level) {
  await supabase.from('profiles').update({ education_level: level }).eq('id', userId);
  if (_profile) _profile.education_level = level;
}

export function getEducationLevel(userId) {
  return _profile?.education_level || null;
}

// ---- Courses (from Supabase) ----
export async function fetchCourses(level) {
  const query = supabase.from('courses').select('*');
  if (level) query.eq('level', level);
  const { data } = await query;
  return data || [];
}

export async function fetchCourse(cid) {
  const { data } = await supabase.from('courses').select('*').eq('cid', cid).single();
  return data;
}

// ---- Quiz ----
export async function fetchQuestions(topicId, difficulty, limit = 10) {
  let query = supabase.from('questions').select('*').eq('topic_id', topicId);
  if (difficulty) query = query.eq('difficulty', difficulty);
  query = query.limit(limit);
  const { data } = await query;
  return data || [];
}

export async function saveQuizResult(result) {
  const { data, error } = await supabase.from('quiz_results').insert({
    user_id: result.userId,
    course_id: result.courseId,
    topic_id: result.topicId || '',
    subject: result.subject || '',
    score: result.score,
    total: result.total,
    difficulty: result.difficulty || 'medium',
    answers: result.answers || [],
    xp_earned: result.xpEarned || 0
  }).select();

  // Update XP + streak
  if (_profile && result.userId) {
    const newXp = (_profile.xp || 0) + (result.xpEarned || result.score * 10);
    const newLevel = Math.floor(newXp / 200) + 1;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let newStreak = _profile.streak_current || 0;
    let longest = _profile.streak_longest || 0;
    const activeDays = [...(_profile.streak_active_days || [])];

    if (_profile.streak_last_active !== today) {
      if (_profile.streak_last_active === yesterday) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
      if (!activeDays.includes(today)) activeDays.push(today);
      if (activeDays.length > 365) activeDays.shift();
    }
    if (newStreak > longest) longest = newStreak;

    // Check badges
    const badges = [...(_profile.badges || [])];
    const badgeIds = badges.map(b => b.id);
    const { count: totalQuizzes } = await supabase.from('quiz_results').select('*', { count: 'exact', head: true }).eq('user_id', result.userId);
    const pct = Math.round((result.score / result.total) * 100);

    if (totalQuizzes >= 10 && !badgeIds.includes('quiz_master')) badges.push({ id: 'quiz_master', name: 'Quiz Master', icon: '🏆', earnedAt: new Date().toISOString() });
    if (pct === 100 && !badgeIds.includes('perfect_score')) badges.push({ id: 'perfect_score', name: 'Perfect Score', icon: '💯', earnedAt: new Date().toISOString() });
    if (newStreak >= 7 && !badgeIds.includes('week_warrior')) badges.push({ id: 'week_warrior', name: 'Week Warrior', icon: '🔥', earnedAt: new Date().toISOString() });
    if (newStreak >= 30 && !badgeIds.includes('month_champion')) badges.push({ id: 'month_champion', name: 'Month Champion', icon: '👑', earnedAt: new Date().toISOString() });
    if (newLevel >= 5 && !badgeIds.includes('rising_star')) badges.push({ id: 'rising_star', name: 'Rising Star', icon: '⭐', earnedAt: new Date().toISOString() });

    await supabase.from('profiles').update({
      xp: newXp, level: newLevel,
      streak_current: newStreak, streak_longest: longest,
      streak_last_active: today, streak_active_days: activeDays,
      badges
    }).eq('id', result.userId);

    await loadProfile(); // Refresh cache
  }

  return data?.[0];
}

export async function getUserQuizHistory(userId) {
  const { data } = await supabase.from('quiz_results')
    .select('*').eq('user_id', userId).order('created_at', { ascending: false });
  // Map to match old format
  return (data || []).map(r => ({
    id: r.id, userId: r.user_id, courseId: r.course_id,
    topicId: r.topic_id, subject: r.subject,
    score: r.score, total: r.total, difficulty: r.difficulty,
    answers: r.answers, xpEarned: r.xp_earned,
    date: r.created_at
  }));
}

// ---- Leaderboard ----
export async function fetchLeaderboard() {
  const { data: profiles } = await supabase.from('profiles').select('*').order('xp', { ascending: false });
  const { data: results } = await supabase.from('quiz_results').select('user_id, score, total');
  
  if (!profiles) return [];

  return profiles.map(p => {
    const userResults = (results || []).filter(r => r.user_id === p.id);
    const totalCorrect = userResults.reduce((s, r) => s + r.score, 0);
    const totalQuestions = userResults.reduce((s, r) => s + r.total, 0);
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    
    return {
      userId: p.id,
      name: p.name || p.email.split('@')[0],
      avatar: p.avatar || '🎓',
      score: p.xp || 0,
      quizzes: userResults.length,
      accuracy: accuracy
    };
  }).sort((a, b) => b.score - a.score);
}

// ---- Topic Completion ----
export async function markTopicComplete(userId, topicId) {
  const topics = [...(_profile?.completed_topics || [])];
  if (!topics.includes(topicId)) {
    topics.push(topicId);
    await supabase.from('profiles').update({
      completed_topics: topics,
      xp: (_profile?.xp || 0) + 10
    }).eq('id', userId);
    await loadProfile();
  }
}

export function isTopicCompleted(userId, topicId) {
  return (_profile?.completed_topics || []).includes(topicId);
}

export function getCompletedTopics(userId) {
  return (_profile?.completed_topics || []).map(topicId => ({ userId, topicId }));
}

// ---- Performance (computed from cached/fetched results) ----
export function getTopicPerformance(userId, topicId) {
  // Sync version uses local cache — async version below for fresh data
  return null; // Will be populated by dashboard with async call
}

export async function getTopicPerformanceAsync(userId, topicId) {
  const { data } = await supabase.from('quiz_results')
    .select('score, total').eq('user_id', userId).eq('topic_id', topicId);
  if (!data || data.length === 0) return null;
  const best = Math.max(...data.map(r => Math.round((r.score / r.total) * 100)));
  return { accuracy: best, attempts: data.length };
}

export async function getAllTopicPerformances(userId) {
  const { data } = await supabase.from('quiz_results')
    .select('topic_id, course_id, subject, score, total').eq('user_id', userId);
  const topics = {};
  (data || []).forEach(r => {
    if (!r.topic_id) return;
    if (!topics[r.topic_id]) topics[r.topic_id] = { scores: [], subject: r.subject, courseId: r.course_id };
    topics[r.topic_id].scores.push(Math.round((r.score / r.total) * 100));
  });
  const result = {};
  for (const [tid, d] of Object.entries(topics)) {
    result[tid] = { accuracy: Math.max(...d.scores), attempts: d.scores.length, subject: d.subject, courseId: d.courseId };
  }
  return result;
}

export async function getWeakTopics(userId) {
  const perfs = await getAllTopicPerformances(userId);
  const weak = [];
  for (const [topicId, data] of Object.entries(perfs)) {
    if (data.accuracy < 60) {
      weak.push({ topicId, ...data, status: data.accuracy < 40 ? 'weak' : 'average' });
    }
  }
  return weak.sort((a, b) => a.accuracy - b.accuracy);
}

// ---- Smart Features ----
export async function getPerformanceSummary(userId) {
  const history = await getUserQuizHistory(userId);
  if (history.length === 0) return { totalQuizzes: 0, avgScore: 0, accuracy: 0, totalCorrect: 0, totalQuestions: 0 };
  const totalQuizzes = history.length;
  const totalCorrect = history.reduce((s, q) => s + q.score, 0);
  const totalQuestions = history.reduce((s, q) => s + q.total, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  return { totalQuizzes, avgScore: accuracy, accuracy, totalCorrect, totalQuestions };
}

export async function getSubjectPerformance(userId) {
  const history = await getUserQuizHistory(userId);
  const subjects = {};
  history.forEach(q => {
    if (!subjects[q.subject]) subjects[q.subject] = { correct: 0, total: 0, quizzes: 0 };
    subjects[q.subject].correct += q.score;
    subjects[q.subject].total += q.total;
    subjects[q.subject].quizzes += 1;
  });
  const result = {};
  for (const [sub, data] of Object.entries(subjects)) {
    result[sub] = { ...data, accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0 };
  }
  return result;
}

export async function getWeakAreas(userId) {
  const perf = await getSubjectPerformance(userId);
  const weak = [];
  for (const [sub, data] of Object.entries(perf)) {
    if (data.accuracy < 60) weak.push({ subject: sub, name: sub, accuracy: data.accuracy });
  }
  return weak.sort((a, b) => a.accuracy - b.accuracy);
}

export function getRecommendedDifficulty(userId, subject) {
  // Sync fallback
  return 'easy';
}

export function getCompletionProgress(userId) {
  const completed = _profile?.completed_topics || [];
  const courses = window.__COURSES || [];
  const totalTopics = courses.reduce((s, c) => s + (c.topics?.length || 0), 0);
  return {
    completed: completed.length, total: totalTopics || 1,
    percentage: totalTopics > 0 ? Math.round((completed.length / totalTopics) * 100) : 0
  };
}

// ---- Streak ----
export function getStreakData(userId) {
  if (!_profile) return { currentStreak: 0, longestStreak: 0, isActiveToday: false, willExpire: false, calendar: [] };

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const isActiveToday = _profile.streak_last_active === today;
  const willExpire = !isActiveToday && _profile.streak_last_active === yesterday;

  let displayStreak = _profile.streak_current || 0;
  if (!isActiveToday && _profile.streak_last_active !== yesterday) displayStreak = 0;

  const calendar = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    calendar.push({
      date: dateStr,
      day: d.toLocaleDateString('en', { weekday: 'short' }),
      active: (_profile.streak_active_days || []).includes(dateStr),
      isToday: dateStr === today
    });
  }

  return { currentStreak: displayStreak, longestStreak: _profile.streak_longest || 0, isActiveToday, willExpire, calendar };
}

// ---- Unmark topic (keep for compatibility) ----
export async function unmarkTopicComplete(userId, topicId) {
  const topics = (_profile?.completed_topics || []).filter(t => t !== topicId);
  await supabase.from('profiles').update({ completed_topics: topics }).eq('id', userId);
  await loadProfile();
}
