// ===== Dashboard Page (with Weak Topics + Performance) =====
import { getCurrentUser, getPerformanceSummary, getWeakAreas, getCompletionProgress, getSubjectPerformance, getUserQuizHistory, getEducationLevel, getWeakTopics, getAllTopicPerformances, getStreakData } from '../store.js';
import { SCHOOL_COURSES } from '../data_school.js';
import { UNI_COURSES } from '../data_university.js';

export function renderDashboard() {
  const user = getCurrentUser();
  if (!user) {
    return `<div class="page"><div class="container"><div class="empty-state" style="padding-top: 120px;">
      <div class="empty-state-icon">🔒</div><h2>Please Sign In</h2>
      <p style="color: var(--text-secondary); margin: 12px 0 24px;">You need to be logged in to view your dashboard.</p>
      <button class="btn btn-primary" onclick="location.hash='#/login'">Sign In</button>
    </div></div></div>`;
  }

  const level = getEducationLevel(user.id);
  const courses = level === 'school' ? SCHOOL_COURSES : level === 'university' ? UNI_COURSES : [];
  window.__COURSES = courses;

  if (!level) {
    return `<div class="page"><div class="container"><div class="empty-state" style="padding-top: 120px;">
      <div class="empty-state-icon">🎓</div><h2>Choose Your Education Level</h2>
      <p style="color: var(--text-secondary); margin: 12px 0 24px;">Select your level to see personalized courses and dashboard.</p>
      <button class="btn btn-primary" onclick="location.hash='#/level-select'">Select Level</button>
    </div></div></div>`;
  }

  // Get sync data first
  const progress = getCompletionProgress(user.id);
  const streak = getStreakData(user.id);

  // Show loading skeleton, then async-load performance data
  setTimeout(() => loadDashboardData(user, courses), 100);

  return `
    <div class="page" style="position: relative; overflow: hidden;">
      <div class="orb orb-1"></div><div class="orb orb-2"></div>
      <div class="container" style="position: relative; z-index: 1;">
        <div class="dashboard-header animate-in">
          <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap; justify-content: space-between;">
            <div>
              <h1 style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 2rem;">${user.avatar}</span> Welcome back, ${user.name}!
              </h1>
              <p>${level === 'school' ? '🏫 School' : '🎓 University'} Level · ${courses.length} courses available</p>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
              ${streak && streak.currentStreak > 0 ? `
                <div style="display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2); border-radius: var(--radius-full);">
                  <span style="font-size: 1.1rem;">🔥</span>
                  <span style="font-weight: 700; color: var(--warning);">${streak.currentStreak}</span>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">day streak</span>
                </div>
              ` : ''}
              <button class="btn btn-primary btn-sm" onclick="location.hash='#/quiz'">📝 Take Quiz</button>
              <button class="btn btn-ghost btn-sm" onclick="location.hash='#/courses'">📚 Courses</button>
            </div>
          </div>
        </div>

        <!-- Stats (will be populated async) -->
        <div class="stats-grid" style="margin-top: 12px;" id="dashboard-stats">
          <div class="stat-card animate-in stagger-1">
            <div class="stat-icon blue">📝</div>
            <div class="stat-info"><h3>-</h3><p>Quizzes Taken</p></div>
          </div>
          <div class="stat-card animate-in stagger-2">
            <div class="stat-icon green">📊</div>
            <div class="stat-info"><h3>-<span style="font-size:0.9rem;opacity:0.6;">%</span></h3><p>Average Score</p></div>
          </div>
          <div class="stat-card animate-in stagger-3">
            <div class="stat-icon purple">🎯</div>
            <div class="stat-info"><h3>-<span style="font-size:0.9rem;opacity:0.6;">%</span></h3><p>Accuracy Rate</p></div>
          </div>
          <div class="stat-card animate-in stagger-4">
            <div class="stat-icon cyan">📚</div>
            <div class="stat-info"><h3>${progress.completed}<span style="font-size:0.9rem;opacity:0.6;">/${progress.total}</span></h3><p>Topics Done</p></div>
          </div>
        </div>

        <!-- Progress -->
        <div class="card animate-in" style="margin-bottom: 28px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <span style="font-weight: 700;">Overall Progress</span>
            <span style="color: var(--accent-light); font-weight: 800; font-size: 1.2rem;">${progress.percentage}%</span>
          </div>
          <div class="progress-bar-container" style="height: 10px;">
            <div class="progress-bar-fill" style="width: ${progress.percentage}%;"></div>
          </div>
        </div>

        <!-- Streak Calendar -->
        ${streak ? `
        <div class="card animate-in" style="margin-bottom: 28px;">
          <h3 style="margin-bottom: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
            🔥 Daily Streak
            ${streak.currentStreak > 0 ? `<span class="badge badge-easy">${streak.currentStreak} days</span>` : ''}
          </h3>
          <div style="display: flex; gap: 8px; justify-content: center;">
            ${(streak.calendar || []).map(day => `
              <div style="text-align: center;">
                <div style="font-size: 0.68rem; color: var(--text-muted); margin-bottom: 4px;">${day.day}</div>
                <div style="width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
                  background: ${day.active ? 'var(--success-bg)' : day.isToday ? 'rgba(79,125,247,0.1)' : 'rgba(255,255,255,0.03)'};
                  border: 2px solid ${day.active ? 'var(--success)' : day.isToday ? 'var(--accent)' : 'var(--border)'};
                  font-size: 0.8rem;">
                  ${day.active ? '🔥' : day.isToday ? '·' : ''}
                </div>
              </div>
            `).join('')}
          </div>
          <div style="display: flex; justify-content: center; gap: 24px; margin-top: 14px; font-size: 0.78rem; color: var(--text-muted);">
            <span>Current: <strong style="color: var(--warning);">${streak.currentStreak}</strong></span>
            <span>Longest: <strong style="color: var(--accent-light);">${streak.longestStreak}</strong></span>
          </div>
          ${streak.willExpire ? '<div style="text-align: center; margin-top: 12px; font-size: 0.82rem; color: var(--warning);">⚠️ Streak expires today! Take a quiz to keep it going.</div>' : ''}
        </div>
        ` : ''}

        <!-- Dynamic sections loaded async -->
        <div id="dashboard-dynamic">
          <div style="text-align: center; padding: 40px; color: var(--text-muted);">
            <div style="width: 32px; height: 32px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px;"></div>
            Loading performance data...
          </div>
        </div>
      </div>
    </div>`;
}

async function loadDashboardData(user, courses) {
  const dynamicEl = document.getElementById('dashboard-dynamic');
  const statsEl = document.getElementById('dashboard-stats');
  if (!dynamicEl) return;

  try {
    // Load all data in parallel
    const [perf, weakTopics, topicPerfs, subjectPerf, history] = await Promise.all([
      Promise.resolve(getPerformanceSummary(user.id)),
      Promise.resolve(getWeakTopics(user.id)),
      Promise.resolve(getAllTopicPerformances(user.id)),
      Promise.resolve(getSubjectPerformance(user.id)),
      Promise.resolve(getUserQuizHistory(user.id)),
    ]);

    const resolvedPerf = await perf;
    const resolvedWeak = await weakTopics;
    const resolvedTopics = await topicPerfs;
    const resolvedSubject = await subjectPerf;
    const resolvedHistory = await history;

    const recentQuizzes = (resolvedHistory || []).slice(-5).reverse();

    // Build topic name map
    const topicNameMap = {};
    courses.forEach(c => c.topics.forEach(t => { topicNameMap[t.id] = { name: t.name, courseId: c.id, courseName: c.name }; }));

    // Update stats cards
    if (statsEl && resolvedPerf) {
      statsEl.innerHTML = `
        <div class="stat-card animate-in stagger-1">
          <div class="stat-icon blue">📝</div>
          <div class="stat-info"><h3>${resolvedPerf.totalQuizzes || 0}</h3><p>Quizzes Taken</p></div>
        </div>
        <div class="stat-card animate-in stagger-2">
          <div class="stat-icon green">📊</div>
          <div class="stat-info"><h3>${resolvedPerf.avgScore || 0}<span style="font-size:0.9rem;opacity:0.6;">%</span></h3><p>Average Score</p></div>
        </div>
        <div class="stat-card animate-in stagger-3">
          <div class="stat-icon purple">🎯</div>
          <div class="stat-info"><h3>${resolvedPerf.accuracy || 0}<span style="font-size:0.9rem;opacity:0.6;">%</span></h3><p>Accuracy Rate</p></div>
        </div>
        <div class="stat-card animate-in stagger-4">
          <div class="stat-icon cyan">📚</div>
          <div class="stat-info"><h3>${resolvedPerf.totalCorrect || 0}<span style="font-size:0.9rem;opacity:0.6;">/${resolvedPerf.totalQuestions || 0}</span></h3><p>Correct Answers</p></div>
        </div>
      `;
    }

    // Build dynamic sections
    let html = '';

    // Weak Topics
    if (resolvedPerf && resolvedPerf.totalQuizzes > 0) {
      const weakArr = resolvedWeak || [];
      html += `
        <div class="card animate-in" style="margin-bottom: 28px;">
          <h3 style="margin-bottom: 20px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
            ⚠️ Your Weak Topics
            <span class="badge badge-hard" style="margin-left: 8px;">${weakArr.length}</span>
          </h3>
          ${weakArr.length > 0 ? `
            <div style="display: grid; gap: 10px;">
              ${weakArr.map(wt => {
                const info = topicNameMap[wt.topicId] || { name: wt.topicId, courseId: '', courseName: '' };
                const icon = wt.accuracy < 40 ? '🔴' : '🟡';
                const barColor = wt.accuracy < 40 ? 'danger' : 'warning';
                return `
                  <div class="weak-topic-card" onclick="location.hash='#/courses/${info.courseId}/${wt.topicId}'" style="cursor:pointer;">
                    <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0;">
                      <span style="font-size: 1.2rem;">${icon}</span>
                      <div style="flex: 1; min-width: 0;">
                        <div style="font-weight: 600; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${info.name}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${info.courseName} · ${wt.attempts} attempt${wt.attempts !== 1 ? 's' : ''}</div>
                      </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px; flex-shrink: 0;">
                      <div style="width: 80px;">
                        <div class="progress-bar-container" style="height: 6px;">
                          <div class="progress-bar-fill ${barColor}" style="width: ${wt.accuracy}%;"></div>
                        </div>
                      </div>
                      <span style="font-weight: 700; font-size: 0.85rem; color: ${wt.accuracy < 40 ? 'var(--danger)' : 'var(--warning)'}; min-width: 36px; text-align: right;">${wt.accuracy}%</span>
                      <span style="color: var(--text-muted);">→</span>
                    </div>
                  </div>`;
              }).join('')}
            </div>
          ` : `
            <div style="text-align: center; padding: 24px; color: var(--text-muted);">
              🎉 No weak areas — great performance across all topics!
            </div>
          `}
        </div>`;
    }

    // Topic Performance Grid
    const topicEntries = Object.entries(resolvedTopics || {});
    if (topicEntries.length > 0) {
      html += `
        <div class="card animate-in" style="margin-bottom: 28px;">
          <h3 style="margin-bottom: 20px; font-weight: 700; display: flex; align-items: center; gap: 8px;">📈 Topic Performance</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px;">
            ${topicEntries.map(([topicId, data]) => {
              const info = topicNameMap[topicId] || { name: topicId };
              const icon = data.accuracy >= 80 ? '🟢' : data.accuracy >= 50 ? '🟡' : '🔴';
              const barClass = data.accuracy >= 80 ? 'success' : data.accuracy < 50 ? 'danger' : '';
              return `
                <div class="perf-topic-chip" onclick="location.hash='#/courses/${data.courseId || ''}/${topicId}'" style="cursor:pointer;">
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <span>${icon}</span>
                    <span style="font-weight: 600; font-size: 0.82rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${info.name}</span>
                  </div>
                  <div class="progress-bar-container" style="height: 4px; margin-bottom: 4px;">
                    <div class="progress-bar-fill ${barClass}" style="width: ${data.accuracy}%;"></div>
                  </div>
                  <div style="font-size: 0.72rem; color: var(--text-muted); display: flex; justify-content: space-between;">
                    <span>${data.attempts} attempt${data.attempts !== 1 ? 's' : ''}</span>
                    <span style="font-weight: 700; color: ${data.accuracy >= 80 ? 'var(--success)' : data.accuracy >= 50 ? 'var(--warning)' : 'var(--danger)'};">${data.accuracy}%</span>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>`;
    }

    // Subject Performance
    const subjectEntries = Object.entries(resolvedSubject || {});
    if (subjectEntries.length > 0) {
      html += `
        <div class="card animate-in" style="margin-bottom: 28px;">
          <h3 style="margin-bottom: 20px; font-weight: 700;">📊 Performance by Course</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px;">
            ${subjectEntries.map(([sub, data]) => `
              <div style="padding: 18px; background: rgba(8,13,28,0.5); border: 1px solid var(--border); border-radius: var(--radius-md);">
                <div style="font-weight: 700; font-size: 0.88rem; margin-bottom: 10px;">${sub}</div>
                <div style="font-size: 1.4rem; font-weight: 800; color: ${data.accuracy >= 80 ? 'var(--success)' : data.accuracy >= 50 ? 'var(--accent-light)' : 'var(--danger)'}; margin-bottom: 8px;">${data.accuracy}%</div>
                <div class="progress-bar-container" style="margin-bottom: 6px;">
                  <div class="progress-bar-fill ${data.accuracy >= 80 ? 'success' : data.accuracy < 50 ? 'danger' : ''}" style="width: ${data.accuracy}%;"></div>
                </div>
                <div style="font-size: 0.76rem; color: var(--text-muted);">${data.quizzes} quiz${data.quizzes !== 1 ? 'zes' : ''}</div>
              </div>
            `).join('')}
          </div>
        </div>`;
    }

    // Recent Activity
    if (recentQuizzes.length > 0) {
      html += `
        <div class="card animate-in" style="margin-bottom: 48px;">
          <h3 style="margin-bottom: 18px; font-weight: 700;">🕐 Recent Activity</h3>
          <div class="table-wrapper" style="border:none; background:transparent; backdrop-filter:none;">
            <table class="table">
              <thead><tr><th>Course</th><th>Difficulty</th><th>Score</th><th>Date</th></tr></thead>
              <tbody>
                ${recentQuizzes.map(q => {
                  const pct = Math.round((q.score / q.total) * 100);
                  const icon = pct >= 80 ? '🟢' : pct >= 50 ? '🟡' : '🔴';
                  return `<tr>
                    <td style="font-weight:600;">${icon} ${q.subject}</td>
                    <td><span class="badge badge-${q.difficulty}">${q.difficulty}</span></td>
                    <td><span style="color:${pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)'}; font-weight:700;">${q.score}/${q.total}</span></td>
                    <td style="color:var(--text-muted); font-size:0.85rem;">${new Date(q.date).toLocaleDateString()}</td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>`;
    }

    if (!html) {
      html = `
        <div class="card animate-in" style="text-align: center; padding: 48px;">
          <div style="font-size: 3rem; margin-bottom: 16px;">📝</div>
          <h3 style="margin-bottom: 8px;">No Quiz Data Yet</h3>
          <p style="color: var(--text-secondary); margin-bottom: 24px;">Take your first quiz to see detailed performance analytics here.</p>
          <button class="btn btn-primary" onclick="location.hash='#/quiz'">🚀 Start a Quiz</button>
        </div>`;
    }

    dynamicEl.innerHTML = html;
  } catch (err) {
    console.error('Dashboard data load error:', err);
    dynamicEl.innerHTML = `
      <div class="card" style="text-align: center; padding: 48px;">
        <div style="font-size: 3rem; margin-bottom: 16px;">📝</div>
        <h3 style="margin-bottom: 8px;">Start Learning</h3>
        <p style="color: var(--text-secondary); margin-bottom: 24px;">Take your first quiz to see performance data here.</p>
        <button class="btn btn-primary" onclick="location.hash='#/quiz'">🚀 Start a Quiz</button>
      </div>`;
  }
}
