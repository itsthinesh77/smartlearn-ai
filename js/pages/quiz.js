// ===== Quiz Page (Integrated with Course/Topic System) =====
import { SCHOOL_COURSES } from '../data_school.js';
import { UNI_COURSES } from '../data_university.js';
import { getTopicQuestions, getCourseQuestions } from '../data_questions.js';
import { getCurrentUser, saveQuizResult, getRecommendedDifficulty, getEducationLevel } from '../store.js';
import { navigate } from '../router.js';

const ALL_COURSES = [...SCHOOL_COURSES, ...UNI_COURSES];

let quizState = {
  active: false, questions: [], currentIndex: 0, answers: [],
  subject: '', difficulty: '', courseId: '', topicId: '', timeLeft: 0, timerId: null,
};

export function renderQuiz() {
  const user = getCurrentUser();
  if (quizState.active) return renderQuizQuestion();

  // Parse query params from hash: #/quiz?course=xxx&topic=yyy
  const hash = window.location.hash || '';
  const qIdx = hash.indexOf('?');
  let qCourse = '', qTopic = '';
  if (qIdx > -1) {
    const params = new URLSearchParams(hash.substring(qIdx + 1));
    qCourse = params.get('course') || '';
    qTopic = params.get('topic') || '';
  }

  return renderQuizSetup(user, qCourse, qTopic);
}

function getUserCourses(user) {
  if (!user) return ALL_COURSES;
  const level = getEducationLevel(user.id);
  if (level === 'school') return SCHOOL_COURSES;
  if (level === 'university') return UNI_COURSES;
  return ALL_COURSES;
}

function renderQuizSetup(user, preselectedCourse, preselectedTopic) {
  const courses = getUserCourses(user);
  const course = preselectedCourse ? courses.find(c => c.id === preselectedCourse) : null;
  const subjects = [...new Set(courses.map(c => c.subject))];
  let recDiff = 'easy';
  if (user && course) recDiff = getRecommendedDifficulty(user.id, course.id);

  return `
    <div class="page" style="position: relative; overflow: hidden;">
      <div class="orb orb-1"></div>
      <div class="orb orb-3"></div>
      <div class="container" style="position: relative; z-index: 1;">
        <div class="quiz-setup animate-in">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--accent), var(--purple)); border-radius: var(--radius-lg); display: inline-flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 24px; box-shadow: 0 12px 40px rgba(79, 125, 247, 0.3); animation: glowPulse 3s ease-in-out infinite;">📝</div>
          <h1 class="section-title">Take a Quiz</h1>
          <p class="section-subtitle" style="margin-bottom: 36px;">Test your knowledge across topics and difficulty levels</p>

          <div class="card" style="text-align: left; padding: 36px;">
            <div class="form-group">
              <label class="form-label">📚 Select Course</label>
              <select class="form-select" id="quiz-course">
                <option value="">-- Choose a course --</option>
                ${subjects.map(sub => `
                  <optgroup label="${sub}">
                    ${courses.filter(c => c.subject === sub).map(c => `
                      <option value="${c.id}" ${preselectedCourse === c.id ? 'selected' : ''}>${c.icon} ${c.name}</option>
                    `).join('')}
                  </optgroup>
                `).join('')}
              </select>
            </div>

            <div class="form-group" id="topic-select-group" style="${preselectedCourse && course ? '' : 'display:none;'}">
              <label class="form-label">📖 Select Topic <span style="color: var(--text-muted); font-weight: 400;">(optional — leave blank for full course quiz)</span></label>
              <select class="form-select" id="quiz-topic">
                <option value="">All topics in this course</option>
                ${course ? course.topics.map(t => `
                  <option value="${t.id}" ${preselectedTopic === t.id ? 'selected' : ''}>${t.name}</option>
                `).join('') : ''}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">🎯 Select Difficulty</label>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;" id="difficulty-selector">
                ${['easy', 'medium', 'hard'].map(d => `
                  <button type="button" class="btn ${recDiff === d ? 'btn-primary' : 'btn-ghost'} btn-sm difficulty-option"
                          data-diff="${d}" style="border-radius: var(--radius-md); padding: 14px 12px; flex-direction: column; gap: 4px;">
                    <span style="font-size: 1.3rem;">${d === 'easy' ? '🟢' : d === 'medium' ? '🟡' : '🔴'}</span>
                    <span style="text-transform: capitalize; font-weight: 700;">${d}</span>
                  </button>
                `).join('')}
              </div>
              <input type="hidden" id="quiz-difficulty" value="${recDiff}" />
            </div>

            ${user ? `
            <div style="padding: 14px 18px; background: rgba(79, 125, 247, 0.06); border: 1px solid rgba(79, 125, 247, 0.12); border-radius: var(--radius-md); margin-bottom: 24px; font-size: 0.82rem; display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.2rem;">🤖</span>
              <span style="color: var(--text-secondary);">AI recommends <strong style="color: var(--accent-light); text-transform: capitalize;">${recDiff}</strong> difficulty based on your performance</span>
            </div>
            ` : `
            <div style="padding: 14px 18px; background: rgba(79, 125, 247, 0.04); border: 1px solid var(--border); border-radius: var(--radius-md); margin-bottom: 24px; font-size: 0.82rem; color: var(--text-muted);">
              💡 <a href="#/login" style="color: var(--accent-light);">Sign in</a> for AI recommendations and progress tracking
            </div>
            `}

            <button class="btn btn-primary btn-block btn-lg" id="start-quiz-btn" style="border-radius: var(--radius-md); padding: 16px; font-size: 1rem;">🚀 Start Quiz</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderQuizQuestion() {
  const q = quizState.questions[quizState.currentIndex];
  const selected = quizState.answers[quizState.currentIndex];
  const total = quizState.questions.length;
  const current = quizState.currentIndex + 1;
  const minutes = Math.floor(quizState.timeLeft / 60);
  const seconds = quizState.timeLeft % 60;
  const timeClass = quizState.timeLeft <= 30 ? 'danger' : quizState.timeLeft <= 60 ? 'warning' : '';
  const progressPct = (current / total) * 100;
  const course = ALL_COURSES.find(c => c.id === quizState.courseId);
  const courseName = course ? course.name : '';

  return `
    <div class="page" style="position: relative; overflow: hidden;">
      <div class="orb orb-1" style="opacity: 0.3;"></div>
      <div class="container" style="position: relative; z-index: 1;">
        <div class="quiz-container">
          <div class="quiz-header">
            <div>
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
                <span class="quiz-progress-text" style="font-weight: 700; color: var(--text-primary);">Q${current}</span>
                <span class="quiz-progress-text">of ${total}</span>
                <span class="badge badge-${quizState.difficulty}" style="margin-left: 4px;">${quizState.difficulty}</span>
              </div>
              <div class="progress-bar-container" style="width: 180px;">
                <div class="progress-bar-fill" style="width: ${progressPct}%;"></div>
              </div>
            </div>
            <div class="quiz-timer ${timeClass}" id="quiz-timer">⏱️ ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}</div>
          </div>

          <div class="question-card">
            <div style="margin-bottom: 20px;">
              <span style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500;">${courseName}</span>
            </div>
            <h3>${q.question}</h3>
            <div>
              ${q.options.map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                return `
                  <button class="option-btn ${selected === i ? 'selected' : ''}" data-index="${i}">
                    <span class="option-letter">${letter}</span>
                    <span>${opt}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <div class="quiz-nav">
            <button class="btn btn-ghost btn-sm" id="quiz-prev" ${quizState.currentIndex === 0 ? 'disabled' : ''}>← Previous</button>
            ${quizState.currentIndex === total - 1
              ? `<button class="btn btn-success" id="quiz-submit">✅ Submit Quiz</button>`
              : `<button class="btn btn-primary btn-sm" id="quiz-next">Next →</button>`}
          </div>

          <div style="display: flex; gap: 8px; justify-content: center; margin-top: 24px; flex-wrap: wrap;">
            ${quizState.questions.map((_, i) => {
              const answered = quizState.answers[i] !== undefined;
              const isCurrent = i === quizState.currentIndex;
              return `<div style="width: 14px; height: 14px; border-radius: 50%; cursor: pointer; transition: var(--transition);
                background: ${isCurrent ? 'var(--accent)' : answered ? 'var(--success)' : 'rgba(255,255,255,0.06)'};
                border: 2px solid ${isCurrent ? 'var(--accent-light)' : 'transparent'};
                ${isCurrent ? 'box-shadow: 0 0 12px rgba(79,125,247,0.4);' : ''}" class="quiz-dot" data-dot="${i}"></div>`;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindQuizEvents() {
  // Course change → populate topics
  const courseSelect = document.getElementById('quiz-course');
  if (courseSelect) {
    courseSelect.addEventListener('change', () => {
      const courseId = courseSelect.value;
      const course = ALL_COURSES.find(c => c.id === courseId);
      const topicGroup = document.getElementById('topic-select-group');
      const topicSelect = document.getElementById('quiz-topic');
      if (course && topicGroup && topicSelect) {
        topicGroup.style.display = '';
        topicSelect.innerHTML = `<option value="">All topics in this course</option>` +
          course.topics.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
      } else if (topicGroup) {
        topicGroup.style.display = 'none';
      }
    });
  }

  // Difficulty buttons
  document.querySelectorAll('.difficulty-option').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.difficulty-option').forEach(b => { b.classList.remove('btn-primary'); b.classList.add('btn-ghost'); });
      btn.classList.remove('btn-ghost'); btn.classList.add('btn-primary');
      document.getElementById('quiz-difficulty').value = btn.dataset.diff;
    });
  });

  // Start quiz
  const startBtn = document.getElementById('start-quiz-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      const courseId = document.getElementById('quiz-course')?.value;
      const topicId = document.getElementById('quiz-topic')?.value;
      const difficulty = document.getElementById('quiz-difficulty').value;

      if (!courseId) {
        showToast('Please select a course', 'error'); return;
      }

      let questions;
      if (topicId) {
        questions = getTopicQuestions(topicId, difficulty, 5);
      } else {
        questions = getCourseQuestions(courseId, difficulty, 5);
      }

      if (questions.length === 0) {
        showToast('No questions available for this selection', 'error'); return;
      }

      const course = ALL_COURSES.find(c => c.id === courseId);
      quizState = {
        active: true, questions, currentIndex: 0,
        answers: new Array(questions.length).fill(undefined),
        subject: course ? course.name : courseId, difficulty, courseId, topicId,
        timeLeft: questions.length * 60, timerId: null,
      };
      startTimer();
      rerenderQuiz();
    });
    return;
  }

  // Option buttons
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      quizState.answers[quizState.currentIndex] = parseInt(btn.dataset.index);
      rerenderQuiz();
    });
  });

  // Navigation
  const prevBtn = document.getElementById('quiz-prev');
  const nextBtn = document.getElementById('quiz-next');
  const submitBtn = document.getElementById('quiz-submit');
  if (prevBtn) prevBtn.addEventListener('click', () => { if (quizState.currentIndex > 0) { quizState.currentIndex--; rerenderQuiz(); } });
  if (nextBtn) nextBtn.addEventListener('click', () => { if (quizState.currentIndex < quizState.questions.length - 1) { quizState.currentIndex++; rerenderQuiz(); } });
  if (submitBtn) submitBtn.addEventListener('click', () => submitQuiz());

  document.querySelectorAll('.quiz-dot').forEach(dot => {
    dot.addEventListener('click', () => { quizState.currentIndex = parseInt(dot.dataset.dot); rerenderQuiz(); });
  });
}

function startTimer() {
  if (quizState.timerId) clearInterval(quizState.timerId);
  quizState.timerId = setInterval(() => {
    quizState.timeLeft--;
    if (quizState.timeLeft <= 0) { submitQuiz(); return; }
    const timerEl = document.getElementById('quiz-timer');
    if (timerEl) {
      const m = Math.floor(quizState.timeLeft / 60), s = quizState.timeLeft % 60;
      timerEl.textContent = `⏱️ ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      timerEl.className = `quiz-timer ${quizState.timeLeft <= 30 ? 'danger' : quizState.timeLeft <= 60 ? 'warning' : ''}`;
    }
  }, 1000);
}

function submitQuiz() {
  if (quizState.timerId) { clearInterval(quizState.timerId); quizState.timerId = null; }
  const user = getCurrentUser();
  let score = 0;
  const answerDetails = quizState.questions.map((q, i) => {
    const userAnswer = quizState.answers[i];
    const isCorrect = userAnswer === q.correct;
    if (isCorrect) score++;
    return { question: q.question, options: q.options, userAnswer, correct: q.correct, isCorrect, explanation: q.explanation };
  });

  if (user) {
    saveQuizResult({ userId: user.id, subject: quizState.subject, difficulty: quizState.difficulty,
      courseId: quizState.courseId, topicId: quizState.topicId, score, total: quizState.questions.length, answers: answerDetails });
  }

  window.__lastQuizResult = { subject: quizState.subject, courseId: quizState.courseId, difficulty: quizState.difficulty,
    score, total: quizState.questions.length, answers: answerDetails };
  quizState.active = false;
  navigate('/results');
}

function rerenderQuiz() {
  const el = document.getElementById('app-content');
  if (el) { el.innerHTML = renderQuiz(); bindQuizEvents(); }
}

function showToast(msg, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

export function resetQuiz() {
  if (quizState.timerId) clearInterval(quizState.timerId);
  quizState = { active: false, questions: [], currentIndex: 0, answers: [], subject: '', difficulty: '', courseId: '', topicId: '', timeLeft: 0, timerId: null };
}
