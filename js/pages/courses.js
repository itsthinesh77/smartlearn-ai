// ===== Courses Page (Topic detail with overview + video + quiz) =====
import { SCHOOL_COURSES } from '../data_school.js';
import { UNI_COURSES } from '../data_university.js';
import { TOPIC_VIDEOS } from '../data_videos.js';
import { getCurrentUser, getEducationLevel, isTopicCompleted, markTopicComplete, getCompletedTopics, getTopicPerformance } from '../store.js';
import { navigate } from '../router.js';

let subjectFilter = 'all';

function getCoursesForLevel(userId) {
  const level = getEducationLevel(userId);
  if (level === 'school') return SCHOOL_COURSES;
  if (level === 'university') return UNI_COURSES;
  return [];
}

function getSubjects(courses) { return [...new Set(courses.map(c => c.subject))]; }

function getCourseProgress(course, userId) {
  if (!userId) return 0;
  const completed = getCompletedTopics(userId);
  const total = course.topics.length;
  const done = course.topics.filter(t => completed.find(ct => ct.topicId === t.id)).length;
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

export function renderCourses(params) {
  const user = getCurrentUser();
  if (user && !getEducationLevel(user.id)) {
    setTimeout(() => navigate('/level-select'), 50);
    return '<div class="page"></div>';
  }

  const hashParts = (window.location.hash || '').replace('#/courses', '').split('/').filter(Boolean);
  const courses = user ? getCoursesForLevel(user.id) : [...SCHOOL_COURSES, ...UNI_COURSES];
  window.__COURSES = courses;

  if (hashParts.length >= 2) return renderTopicDetail(courses, user, hashParts[0], hashParts[1]);
  if (hashParts.length === 1) return renderTopicsList(courses, user, hashParts[0]);
  return renderCourseList(courses, user);
}

// ──── Course Grid ────
function renderCourseList(courses, user) {
  const level = user ? getEducationLevel(user.id) : null;
  const subjects = getSubjects(courses);
  const filtered = subjectFilter === 'all' ? courses : courses.filter(c => c.subject === subjectFilter);

  return `
    <div class="page" style="position: relative; overflow: hidden;">
      <div class="orb orb-1"></div><div class="orb orb-2"></div>
      <div class="container" style="position: relative; z-index: 1; padding-top: 100px; padding-bottom: 60px;">
        <div class="animate-in" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; margin-bottom: 32px;">
          <div>
            <h1 class="section-title" style="font-size: 2rem;">
              ${level === 'school' ? '🏫' : '🎓'} ${level === 'school' ? 'School' : level === 'university' ? 'University' : 'All'} Courses
            </h1>
            <p class="section-subtitle" style="margin-bottom: 0;">${filtered.length} courses available · Select a course to start learning</p>
          </div>
          ${user ? `<button class="btn btn-ghost btn-sm" onclick="location.hash='#/level-select'">🔄 Change Level</button>` : ''}
        </div>

        <div class="animate-in" style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px;">
          <button class="btn ${subjectFilter === 'all' ? 'btn-primary' : 'btn-ghost'} btn-sm subject-filter" data-subject="all" style="border-radius: var(--radius-full);">All</button>
          ${subjects.map(s => `
            <button class="btn ${subjectFilter === s ? 'btn-primary' : 'btn-ghost'} btn-sm subject-filter" data-subject="${s}" style="border-radius: var(--radius-full);">${s}</button>
          `).join('')}
        </div>

        <div class="grid-3 animate-in">
          ${filtered.map(course => {
            const progress = user ? getCourseProgress(course, user.id) : 0;
            return `
              <div class="course-card" onclick="location.hash='#/courses/${course.id}'">
                <div class="course-card-banner" style="background: linear-gradient(135deg, ${course.color}22, ${course.color}08);">
                  <span style="font-size: 3.5rem; position: relative; z-index: 1;">${course.icon}</span>
                </div>
                <div class="course-card-body">
                  <span class="badge badge-accent" style="margin-bottom: 10px;">${course.subject}</span>
                  <h3>${course.name}</h3>
                  <p>${course.description}</p>
                  ${user ? `
                    <div style="margin-top: 4px;">
                      <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 6px;">
                        <span>${course.topics.length} topics</span>
                        <span style="color: ${progress > 0 ? 'var(--accent-light)' : 'var(--text-muted)'}; font-weight: 600;">${progress}%</span>
                      </div>
                      <div class="progress-bar-container" style="height: 4px;">
                        <div class="progress-bar-fill ${progress >= 80 ? 'success' : ''}" style="width: ${progress}%;"></div>
                      </div>
                    </div>
                  ` : `<div class="course-meta"><span>${course.topics.length} topics</span></div>`}
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>
    </div>`;
}

// ──── Topics List ────
function renderTopicsList(courses, user, courseId) {
  const course = courses.find(c => c.id === courseId);
  if (!course) return `<div class="page"><div class="container" style="padding-top: 120px;"><p>Course not found.</p></div></div>`;
  const progress = user ? getCourseProgress(course, user.id) : 0;

  return `
    <div class="page" style="position: relative; overflow: hidden;">
      <div class="orb orb-1" style="opacity: 0.3;"></div>
      <div class="container" style="position: relative; z-index: 1; padding-top: 100px; padding-bottom: 60px;">
        <button class="back-btn" onclick="location.hash='#/courses'">← Back to Courses</button>

        <div class="card animate-in" style="margin-bottom: 28px;">
          <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
            <div style="width: 64px; height: 64px; border-radius: var(--radius-lg); background: ${course.color}15; display: flex; align-items: center; justify-content: center; font-size: 2rem;">${course.icon}</div>
            <div style="flex: 1;">
              <span class="badge badge-accent" style="margin-bottom: 6px;">${course.subject}</span>
              <h2 style="font-size: 1.5rem; font-weight: 800;">${course.name}</h2>
              <p style="color: var(--text-secondary); font-size: 0.88rem;">${course.description}</p>
            </div>
            ${user ? `<div style="text-align: right;"><div style="font-size: 1.4rem; font-weight: 800; color: var(--accent-light);">${progress}%</div><div style="font-size: 0.78rem; color: var(--text-muted);">completed</div></div>` : ''}
          </div>
          ${user ? `<div class="progress-bar-container" style="margin-top: 20px;"><div class="progress-bar-fill ${progress >= 80 ? 'success' : ''}" style="width: ${progress}%;"></div></div>` : ''}
        </div>

        <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 16px;">📚 Topics (${course.topics.length})</h3>

        ${course.topics.map((topic, i) => {
          const completed = user ? isTopicCompleted(user.id, topic.id) : false;
          const perf = user ? getTopicPerformance(user.id, topic.id) : null;
          const perfPct = perf ? perf.accuracy : null;
          let perfIcon = '';
          if (perfPct !== null) {
            if (perfPct >= 80) perfIcon = '<span style="color: var(--success);" title="Strong">🟢</span>';
            else if (perfPct >= 50) perfIcon = '<span style="color: var(--warning);" title="Average">🟡</span>';
            else perfIcon = '<span style="color: var(--danger);" title="Weak">🔴</span>';
          }
          return `
            <div class="topic-item animate-in stagger-${(i % 5) + 1} ${completed ? 'completed' : ''}" onclick="location.hash='#/courses/${course.id}/${topic.id}'">
              <div class="topic-name">
                <span style="width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.82rem; font-weight: 700;
                  background: ${completed ? 'var(--success-bg)' : 'rgba(79,125,247,0.08)'}; color: ${completed ? 'var(--success)' : 'var(--text-muted)'}; border: 1px solid ${completed ? 'rgba(52,211,153,0.2)' : 'var(--border)'};">
                  ${completed ? '✓' : i + 1}
                </span>
                <div>
                  <span style="font-weight: 600;">${topic.name}</span>
                  ${completed ? '<span class="badge badge-easy" style="margin-left: 8px;">Done</span>' : ''}
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                ${perfIcon}
                ${perfPct !== null ? `<span style="font-size: 0.78rem; color: var(--text-muted);">${perfPct}%</span>` : ''}
                <span style="color: var(--text-muted); font-size: 1.2rem;">→</span>
              </div>
            </div>`;
        }).join('')}

        <div style="margin-top: 28px; display: flex; gap: 12px; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="location.hash='#/quiz?course=${course.id}'">📝 Quiz on ${course.name}</button>
        </div>
      </div>
    </div>`;
}

// ──── Topic Detail — Clean Overview + Quiz ────
function renderTopicDetail(courses, user, courseId, topicId) {
  const course = courses.find(c => c.id === courseId);
  if (!course) return '<div class="page"><div class="container" style="padding-top: 120px;"><p>Course not found.</p></div></div>';
  const topic = course.topics.find(t => t.id === topicId);
  if (!topic) return '<div class="page"><div class="container" style="padding-top: 120px;"><p>Topic not found.</p></div></div>';

  const completed = user ? isTopicCompleted(user.id, topic.id) : false;
  const topicIndex = course.topics.indexOf(topic);
  const prev = topicIndex > 0 ? course.topics[topicIndex - 1] : null;
  const next = topicIndex < course.topics.length - 1 ? course.topics[topicIndex + 1] : null;
  const perf = user ? getTopicPerformance(user.id, topic.id) : null;
  const videoUrl = TOPIC_VIDEOS[topic.id] || null;

  return `
    <div class="page" style="position: relative; overflow: hidden;">
      <div class="orb orb-1" style="opacity: 0.2;"></div>
      <div class="container" style="position: relative; z-index: 1; padding-top: 100px; padding-bottom: 60px; max-width: 860px;">
        <button class="back-btn" onclick="location.hash='#/courses/${course.id}'">← Back to ${course.name}</button>

        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;" class="animate-in">
          <span class="badge badge-accent">${course.subject}</span>
          <span style="color: var(--text-muted); font-size: 0.82rem;">Topic ${topicIndex + 1} of ${course.topics.length}</span>
          ${perf ? `
            <span style="margin-left: auto; font-size: 0.82rem; color: var(--text-muted);">
              Best: <strong style="color: ${perf.accuracy >= 80 ? 'var(--success)' : perf.accuracy >= 50 ? 'var(--warning)' : 'var(--danger)'};">${perf.accuracy}%</strong>
              · ${perf.attempts} attempt${perf.attempts !== 1 ? 's' : ''}
            </span>
          ` : ''}
        </div>

        <h2 class="animate-in" style="font-size: 1.6rem; font-weight: 800; margin-bottom: 24px;">${topic.name}</h2>

        <!-- Topic Overview -->
        <div class="card animate-in" style="margin-bottom: 28px;">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
            <div style="width: 56px; height: 56px; border-radius: var(--radius-lg); background: linear-gradient(135deg, ${course.color}30, ${course.color}10); display: flex; align-items: center; justify-content: center; font-size: 1.8rem;">${course.icon}</div>
            <div>
              <h3 style="margin-bottom: 4px;">${topic.name}</h3>
              <p style="color: var(--text-secondary); font-size: 0.85rem; margin: 0;">Part of ${course.name} · ${course.subject}</p>
            </div>
          </div>
          <div style="padding: 16px 20px; background: rgba(79,125,247,0.04); border: 1px solid var(--border); border-radius: var(--radius-md); font-size: 0.88rem; color: var(--text-secondary); line-height: 1.7;">
            ${topic.notes || `<p>This topic covers key concepts in <strong>${topic.name}</strong> as part of the ${course.name} curriculum. Test your understanding by taking a quiz below.</p>`}
          </div>
          ${user ? `
            <div style="margin-top: 20px;">
              <button class="btn ${completed ? 'btn-success' : 'btn-ghost'} btn-sm" id="mark-complete-btn" data-topic="${topic.id}">
                ${completed ? '✅ Completed' : '☐ Mark as Read'}
              </button>
            </div>
          ` : ''}
        </div>

        <!-- Video Section -->
        <div class="card animate-in" style="margin-bottom: 28px;">
          <h3 style="margin-bottom: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.1rem;">🎥</span> Video Lesson
          </h3>
          ${videoUrl ? `
            <div class="video-container">
              <iframe src="${videoUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <p style="margin-top: 12px; font-size: 0.82rem; color: var(--text-muted);">📺 Watch and learn at your own pace. Pause, rewind, and take notes as needed.</p>
          ` : `
            <div style="text-align: center; padding: 32px 24px; background: rgba(79,125,247,0.03); border: 1px dashed var(--border); border-radius: var(--radius-md);">
              <div style="font-size: 2.5rem; margin-bottom: 12px;">🎥</div>
              <h4 style="margin-bottom: 6px; color: var(--text-secondary);">Video Coming Soon</h4>
              <p style="color: var(--text-muted); font-size: 0.82rem;">We're preparing a video lesson for this topic. Check back later!</p>
            </div>
          `}
        </div>

        <!-- Quiz Section -->
        <div class="card animate-in" style="text-align: center; padding: 40px 32px;">
          <div style="width: 72px; height: 72px; background: linear-gradient(135deg, var(--accent), var(--purple)); border-radius: var(--radius-lg); display: inline-flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 20px; box-shadow: 0 12px 40px rgba(79, 125, 247, 0.3);">🧠</div>
          <h3 style="margin-bottom: 8px;">Test Your Knowledge</h3>
          <p style="color: var(--text-secondary); margin-bottom: 28px; font-size: 0.9rem;">Choose a difficulty level and take a quiz on ${topic.name}</p>

          ${perf ? `
            <div style="display: flex; gap: 20px; justify-content: center; margin-bottom: 28px; flex-wrap: wrap;">
              <div style="padding: 16px 24px; background: rgba(8,13,28,0.5); border: 1px solid var(--border); border-radius: var(--radius-md);">
                <div style="font-size: 1.3rem; font-weight: 800; color: ${perf.accuracy >= 80 ? 'var(--success)' : perf.accuracy >= 50 ? 'var(--warning)' : 'var(--danger)'};">${perf.accuracy}%</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Best Score</div>
              </div>
              <div style="padding: 16px 24px; background: rgba(8,13,28,0.5); border: 1px solid var(--border); border-radius: var(--radius-md);">
                <div style="font-size: 1.3rem; font-weight: 800;">${perf.attempts}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Attempts</div>
              </div>
            </div>
          ` : ''}

          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="location.hash='#/quiz?course=${course.id}&topic=${topic.id}&diff=easy'" style="min-width: 120px;">🟢 Easy</button>
            <button class="btn btn-secondary" onclick="location.hash='#/quiz?course=${course.id}&topic=${topic.id}&diff=medium'" style="min-width: 120px;">🟡 Medium</button>
            <button class="btn btn-danger" onclick="location.hash='#/quiz?course=${course.id}&topic=${topic.id}&diff=hard'" style="min-width: 120px;">🔴 Hard</button>
          </div>
        </div>

        <!-- Topic Nav -->
        <div style="display: flex; justify-content: space-between; margin-top: 24px;">
          ${prev ? `<button class="btn btn-ghost btn-sm" onclick="location.hash='#/courses/${course.id}/${prev.id}'">← ${prev.name.length > 25 ? prev.name.slice(0, 25) + '…' : prev.name}</button>` : '<div></div>'}
          ${next ? `<button class="btn btn-ghost btn-sm" onclick="location.hash='#/courses/${course.id}/${next.id}'">${next.name.length > 25 ? next.name.slice(0, 25) + '…' : next.name} →</button>` : '<div></div>'}
        </div>
      </div>
    </div>`;
}

export function bindCoursesEvents() {
  // Subject filter
  document.querySelectorAll('.subject-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      subjectFilter = btn.dataset.subject;
      const appContent = document.getElementById('app-content');
      if (appContent) { appContent.innerHTML = renderCourses(); bindCoursesEvents(); }
    });
  });

  // Mark complete
  const markBtn = document.getElementById('mark-complete-btn');
  if (markBtn) {
    markBtn.addEventListener('click', async () => {
      const user = getCurrentUser();
      if (!user) return;
      const topicId = markBtn.dataset.topic;
      if (!isTopicCompleted(user.id, topicId)) {
        await markTopicComplete(user.id, topicId);
      }
      const appContent = document.getElementById('app-content');
      if (appContent) { appContent.innerHTML = renderCourses(); bindCoursesEvents(); }
    });
  }
}
