// ===== Admin Panel =====
import { COURSES, QUESTIONS } from '../data.js';
import { getCurrentUser, isAdmin } from '../store.js';
import { USERS } from '../data.js';

let activeTab = 'questions';

export function renderAdmin() {
  const user = getCurrentUser();
  if (!user || !isAdmin()) {
    return `
      <div class="page">
        <div class="container">
          <div class="empty-state" style="padding-top: 120px;">
            <div class="empty-state-icon">🛡️</div>
            <h2>Admin Access Only</h2>
            <p style="color: var(--text-secondary); margin: 12px 0 24px;">You need admin privileges to access this panel.</p>
            <button class="btn btn-primary" onclick="location.hash='#/login'">Sign In as Admin</button>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="page">
      <div class="container" style="padding-top: 100px; padding-bottom: 60px;">
        <div class="animate-in" style="margin-bottom: 32px;">
          <h1 class="section-title">🛡️ Admin Panel</h1>
          <p class="section-subtitle">Manage questions, courses, and view user data</p>
        </div>

        <!-- Tabs -->
        <div class="tabs animate-in">
          <button class="tab ${activeTab === 'questions' ? 'active' : ''}" data-tab="questions">📝 Questions</button>
          <button class="tab ${activeTab === 'courses' ? 'active' : ''}" data-tab="courses">📚 Courses</button>
          <button class="tab ${activeTab === 'users' ? 'active' : ''}" data-tab="users">👥 Users</button>
        </div>

        <div id="admin-tab-content" class="animate-in">
          ${renderTabContent()}
        </div>
      </div>
    </div>
  `;
}

function renderTabContent() {
  switch (activeTab) {
    case 'questions': return renderQuestionsTab();
    case 'courses': return renderCoursesTab();
    case 'users': return renderUsersTab();
    default: return '';
  }
}

function renderQuestionsTab() {
  const subjectNames = { ds: 'Data Structures', dbms: 'DBMS', os: 'Operating Systems' };
  const grouped = {};
  QUESTIONS.forEach(q => {
    const key = `${q.subject}-${q.difficulty}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(q);
  });

  return `
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <h3>Question Bank (${QUESTIONS.length} questions)</h3>
      </div>

      ${Object.entries(grouped).map(([key, questions]) => {
        const [sub, diff] = key.split('-');
        return `
          <div style="margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
              <strong>${subjectNames[sub] || sub}</strong>
              <span class="badge badge-${diff}">${diff}</span>
              <span style="color: var(--text-muted); font-size: 0.82rem;">(${questions.length} questions)</span>
            </div>
            ${questions.map(q => `
              <div class="admin-item">
                <div style="flex: 1; font-size: 0.88rem;">${q.question}</div>
                <div class="admin-item-actions">
                  <span style="color: var(--success); font-size: 0.8rem;">${q.options[q.correct]}</span>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderCoursesTab() {
  return `
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <h3>Courses & Topics</h3>
      </div>

      ${COURSES.map(course => `
        <div style="margin-bottom: 20px; padding: 16px; background: var(--bg-secondary); border-radius: var(--radius-md);">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
            <span style="font-size: 1.5rem;">${course.icon}</span>
            <div>
              <strong>${course.name}</strong>
              <div style="font-size: 0.82rem; color: var(--text-muted);">${course.description}</div>
            </div>
          </div>
          ${course.topics.map(t => `
            <div class="admin-item">
              <span style="font-size: 0.88rem;">📄 ${t.name}</span>
              <span class="badge badge-accent">${t.id}</span>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `;
}

function renderUsersTab() {
  return `
    <div class="card">
      <h3 style="margin-bottom: 16px;">Registered Users</h3>
      <div class="empty-state">
        <div class="empty-state-icon">👥</div>
        <h2>Users Management</h2>
        <p style="color: var(--text-secondary);">User data migration to Supabase is in progress. This tab will be available soon.</p>
      </div>
    </div>
  `;
}

export function bindAdminEvents() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeTab = tab.dataset.tab;
      // Re-render admin
      const appContent = document.getElementById('app-content');
      if (appContent) {
        appContent.innerHTML = renderAdmin();
        bindAdminEvents();
      }
    });
  });
}
