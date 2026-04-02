// ===== Quiz Results Page (Enhanced with Recommendations) =====
import { SCHOOL_COURSES } from '../data_school.js';
import { UNI_COURSES } from '../data_university.js';

const ALL_COURSES = [...SCHOOL_COURSES, ...UNI_COURSES];

export function renderResults() {
  const result = window.__lastQuizResult;
  if (!result) {
    return `
      <div class="page"><div class="container">
        <div class="empty-state" style="padding-top: 120px;">
          <div class="empty-state-icon">📊</div>
          <h2>No Quiz Results</h2>
          <p style="color: var(--text-secondary); margin: 12px 0 24px;">Take a quiz to see your detailed results here.</p>
          <button class="btn btn-primary" onclick="location.hash='#/quiz'">📝 Take a Quiz</button>
        </div>
      </div></div>`;
  }

  const percentage = Math.round((result.score / result.total) * 100);
  const course = ALL_COURSES.find(c => c.id === result.courseId);
  const courseName = course ? course.name : result.subject;
  const courseIcon = course ? course.icon : '📖';
  const wrongAnswers = result.answers.filter(a => !a.isCorrect);

  let scoreClass, message, emoji;
  if (percentage >= 80) { scoreClass = 'excellent'; message = 'Outstanding Performance!'; emoji = '🎉'; }
  else if (percentage >= 60) { scoreClass = 'good'; message = 'Good Job, Keep It Up!'; emoji = '👏'; }
  else if (percentage >= 40) { scoreClass = 'average'; message = 'Room for Improvement'; emoji = '📈'; }
  else { scoreClass = 'poor'; message = 'Keep Practicing!'; emoji = '💪'; }

  const statusIcon = percentage >= 80 ? '🟢' : percentage >= 50 ? '🟡' : '🔴';

  // Build recommendations based on wrong answers
  let recommendations = '';
  if (wrongAnswers.length > 0 && percentage < 80) {
    const topicName = course?.topics?.find(t => t.id === result.topicId)?.name || result.subject;
    recommendations = `
      <div class="card animate-in" style="margin-top: 24px; border-left: 3px solid var(--warning);">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 16px;">💡 Recommendations to Improve</h3>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${percentage < 40 ? `
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.15); border-radius: var(--radius-md);">
              <span style="font-size: 1.2rem;">🔴</span>
              <div>
                <div style="font-weight: 600; font-size: 0.88rem;">Review "${topicName}" concepts</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">Your score is below 40%. Go back and study the topic overview.</div>
              </div>
              ${result.courseId && result.topicId ? `<button class="btn btn-ghost btn-sm" onclick="location.hash='#/courses/${result.courseId}/${result.topicId}'" style="margin-left: auto;">Review →</button>` : ''}
            </div>
          ` : ''}
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.15); border-radius: var(--radius-md);">
            <span style="font-size: 1.2rem;">🟡</span>
            <div>
              <div style="font-weight: 600; font-size: 0.88rem;">Retry on ${result.difficulty === 'hard' ? 'Medium' : 'Easy'} difficulty</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Build confidence with simpler questions first, then level up.</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: rgba(79,125,247,0.06); border: 1px solid rgba(79,125,247,0.15); border-radius: var(--radius-md);">
            <span style="font-size: 1.2rem;">📝</span>
            <div>
              <div style="font-weight: 600; font-size: 0.88rem;">Focus on ${wrongAnswers.length} missed question${wrongAnswers.length > 1 ? 's' : ''}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Read the explanations below for each question you got wrong.</div>
            </div>
          </div>
          ${course ? `
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: rgba(52,211,153,0.06); border: 1px solid rgba(52,211,153,0.15); border-radius: var(--radius-md);">
            <span style="font-size: 1.2rem;">🟢</span>
            <div>
              <div style="font-weight: 600; font-size: 0.88rem;">Try related topics in ${course.name}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Strengthen your understanding across the whole course.</div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="location.hash='#/courses/${course.id}'" style="margin-left: auto;">Browse →</button>
          </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  return `
    <div class="page" style="position: relative; overflow: hidden;">
      <div class="orb orb-1"></div><div class="orb orb-2"></div>
      <div class="container" style="position: relative; z-index: 1;">
        <div class="results-container">

          <div class="results-score-card animate-in">
            <div style="font-size: 2.5rem; margin-bottom: 12px;">${emoji}</div>
            <div class="score-circle ${scoreClass}">
              ${result.score}/${result.total}
              <span>Score</span>
            </div>
            <h2>${message}</h2>
            <p style="margin-top: 8px;">
              <span>${statusIcon}</span>
              <span style="color: var(--text-primary); font-weight: 600;">${courseIcon} ${courseName}</span>
              <span style="margin: 0 6px;">·</span>
              <span class="badge badge-${result.difficulty}" style="vertical-align: middle;">${result.difficulty}</span>
              <span style="margin: 0 6px;">·</span>
              <span style="font-weight: 700; color: ${percentage >= 60 ? 'var(--success)' : 'var(--danger)'};">${percentage}%</span>
            </p>

            <div style="display: flex; gap: 12px; justify-content: center; margin-top: 28px; flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="location.hash='#/quiz${result.courseId ? '?course=' + result.courseId + (result.topicId ? '&topic=' + result.topicId : '') : ''}'">🔄 Retry Quiz</button>
              <button class="btn btn-ghost" onclick="location.hash='#/dashboard'">📊 Dashboard</button>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="results-stats animate-in">
            <div class="result-stat-card">
              <div style="font-size: 1.6rem; font-weight: 800; color: var(--success);">${result.score}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Correct</div>
            </div>
            <div class="result-stat-card">
              <div style="font-size: 1.6rem; font-weight: 800; color: var(--danger);">${result.total - result.score}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Incorrect</div>
            </div>
            <div class="result-stat-card">
              <div style="font-size: 1.6rem; font-weight: 800; color: var(--accent-light);">${percentage}%</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Accuracy</div>
            </div>
            <div class="result-stat-card">
              <div style="font-size: 1.6rem; font-weight: 800; color: var(--purple);">${result.answers.filter(a => a.userAnswer === undefined).length}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Skipped</div>
            </div>
          </div>

          ${recommendations}

          <!-- Answer Review (always shown) -->
          <div style="margin-top: 28px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px;" class="animate-in">
              <h3 style="font-size: 1.1rem; font-weight: 700;">📋 Answer Review</h3>
              <span style="font-size: 0.82rem; color: var(--text-muted);">
                <span style="color: var(--success); font-weight: 700;">${result.score}</span> correct ·
                <span style="color: var(--danger); font-weight: 700;">${result.total - result.score}</span> wrong
              </span>
            </div>

            ${result.answers.map((a, i) => `
              <div class="result-answer-card animate-in stagger-${(i % 5) + 1}" style="border-left: 3px solid ${a.isCorrect ? 'var(--success)' : a.userAnswer === undefined ? 'var(--warning)' : 'var(--danger)'};">
                <h4>
                  <span style="width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.85rem; flex-shrink: 0;
                    background: ${a.isCorrect ? 'var(--success-bg)' : a.userAnswer === undefined ? 'var(--warning-bg)' : 'var(--danger-bg)'}; color: ${a.isCorrect ? 'var(--success)' : a.userAnswer === undefined ? 'var(--warning)' : 'var(--danger)'};">
                    ${a.isCorrect ? '✓' : a.userAnswer === undefined ? '—' : '✗'}
                  </span>
                  <span>Q${i + 1}. ${a.question}</span>
                </h4>
                <div>
                  ${a.options.map((opt, j) => {
                    let cls = '';
                    if (j === a.correct) cls = 'correct';
                    else if (j === a.userAnswer && !a.isCorrect) cls = 'wrong';
                    const letter = String.fromCharCode(65 + j);
                    return `
                      <div class="option-btn ${cls}" style="pointer-events: none; cursor: default; margin-bottom: 6px;">
                        <span class="option-letter">${letter}</span>
                        <span style="flex: 1;">${opt}</span>
                        ${j === a.correct ? '<span style="font-size: 0.78rem; font-weight: 700; color: var(--success);">✓ Correct</span>' : ''}
                        ${j === a.userAnswer && !a.isCorrect ? '<span style="font-size: 0.78rem; font-weight: 700; color: var(--danger);">✗ Your answer</span>' : ''}
                      </div>`;
                  }).join('')}
                </div>
                ${a.userAnswer === undefined ? '<div style="margin-top: 8px; font-size: 0.84rem; color: var(--warning); font-style: italic;">⚠️ Not answered</div>' : ''}
                <div class="explanation">💡 <strong>Explanation:</strong> ${a.explanation}</div>
              </div>
            `).join('')}
          </div>

          <div style="text-align: center; padding: 40px 0;">
            <button class="btn btn-primary btn-lg" onclick="location.hash='#/quiz'">📝 Take Another Quiz</button>
          </div>
        </div>
      </div>
    </div>`;
}

export function bindResultsEvents() {
  // No toggle needed — solutions always shown
}
