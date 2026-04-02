// ===== AI Smart Learning Platform — Main App =====
import { registerRoute, initRouter, setRouteChangeCallback, setAuthChecker, navigate } from './router.js';
import { getCurrentUser, logout, isAdmin, getEducationLevel, initAuth } from './store.js';
import { SCHOOL_COURSES } from './data_school.js';
import { UNI_COURSES } from './data_university.js';

// Pages
import { renderHome } from './pages/home.js';
import { renderLogin, bindLoginEvents } from './pages/login.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderCourses, bindCoursesEvents } from './pages/courses.js';
import { renderQuiz, bindQuizEvents, resetQuiz } from './pages/quiz.js';
import { renderResults, bindResultsEvents } from './pages/results.js';
import { renderLeaderboard, bindLeaderboardEvents } from './pages/leaderboard.js';
import { renderAdmin, bindAdminEvents } from './pages/admin.js';
import { renderLevelSelect, bindLevelSelectEvents } from './pages/level-select.js';

// Auth guard
setAuthChecker(() => !!getCurrentUser());

// Set courses globally
function updateGlobalCourses() {
  const user = getCurrentUser();
  if (user) {
    const level = getEducationLevel(user.id);
    if (level === 'school') window.__COURSES = SCHOOL_COURSES;
    else if (level === 'university') window.__COURSES = UNI_COURSES;
    else window.__COURSES = [...SCHOOL_COURSES, ...UNI_COURSES];
  } else {
    window.__COURSES = [...SCHOOL_COURSES, ...UNI_COURSES];
  }
}

// ---- Render Shell ----
function renderApp() {
  updateGlobalCourses();
  const user = getCurrentUser();
  const app = document.getElementById('app');

  app.innerHTML = `
    <nav class="navbar" id="navbar">
      <div class="navbar-inner">
        <div class="nav-brand" onclick="location.hash='#/${user ? 'dashboard' : 'login'}'">
          <div class="nav-brand-icon">🎓</div>
          <span>SmartLearn <span style="color: var(--accent-light); font-weight: 400; font-size: 0.75rem;">AI</span></span>
        </div>
        ${user ? `
        <div class="nav-links" id="nav-links">
          <a class="nav-link" data-route="/dashboard" onclick="location.hash='#/dashboard'">Dashboard</a>
          <a class="nav-link" data-route="/courses" onclick="location.hash='#/courses'">Courses</a>
          <a class="nav-link" data-route="/quiz" onclick="location.hash='#/quiz'">Quiz</a>
          <a class="nav-link" data-route="/leaderboard" onclick="location.hash='#/leaderboard'">Leaderboard</a>
          ${isAdmin() ? `<a class="nav-link" data-route="/admin" onclick="location.hash='#/admin'">Admin</a>` : ''}
          <a class="nav-auth-btn" id="logout-btn" style="cursor:pointer;">${user.avatar} Logout</a>
        </div>
        <button class="mobile-menu-btn" id="mobile-menu-btn">☰</button>
        ` : `
        <div class="nav-links" id="nav-links">
          <a class="nav-auth-btn" onclick="location.hash='#/login'">Login / Register</a>
        </div>
        `}
      </div>
    </nav>
    <main id="app-content"></main>
  `;

  bindNavEvents();
}

function bindNavEvents() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await logout();
      renderApp();
      navigate('/login');
      showToast('Logged out successfully', 'info');
    });
  }

  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('.nav-link, .nav-auth-btn').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }
}

function updateActiveNav(route) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.route === route);
  });
}

// ---- Routes ----
registerRoute('/home', () => renderHome());
registerRoute('/login', () => renderLogin());
registerRoute('/signup', () => renderLogin(true));
registerRoute('/dashboard', () => renderDashboard());
registerRoute('/courses', (params) => renderCourses(params));
registerRoute('/quiz', () => renderQuiz());
registerRoute('/results', () => renderResults());
registerRoute('/leaderboard', () => renderLeaderboard());
registerRoute('/admin', () => renderAdmin());
registerRoute('/level-select', () => renderLevelSelect());

// ---- After Route Change ----
setRouteChangeCallback((route) => {
  updateGlobalCourses();
  updateActiveNav(route);

  switch (route) {
    case '/login': case '/signup': bindLoginEvents(); break;
    case '/courses': bindCoursesEvents(); break;
    case '/quiz': bindQuizEvents(); break;
    case '/results': bindResultsEvents(); break;
    case '/leaderboard': bindLeaderboardEvents(); break;
    case '/admin': bindAdminEvents(); break;
    case '/level-select': bindLevelSelectEvents(); break;
  }
});

// ---- Auth changes ----
window.addEventListener('auth-changed', () => {
  renderApp();
  setTimeout(() => window.dispatchEvent(new HashChangeEvent('hashchange')), 50);
});

// ---- Toast ----
function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ---- Init (async for Supabase) ----
async function boot() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column; gap: 16px;">
      <div style="width: 48px; height: 48px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
      <p style="color: var(--text-muted); font-size: 0.9rem;">Connecting to SmartLearn...</p>
    </div>
    <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
  `;

  try {
    // Race initAuth against a 2.5s timeout so the app doesn't hang on connection issues
    await Promise.race([
      initAuth(),
      new Promise(resolve => setTimeout(resolve, 2500))
    ]);
  } catch (err) {
    console.warn('Auth init failed, continuing:', err);
  }

  renderApp();
  initRouter();
}

boot();
