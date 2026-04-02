// ===== Login / Register Page (Supabase Auth) =====
import { loginUser, registerUser, getCurrentUser, getEducationLevel } from '../store.js';
import { navigate } from '../router.js';

let isRegisterMode = false;

export function renderLogin(forceRegister) {
  if (forceRegister === true) isRegisterMode = true;
  return getAuthHTML();
}

function getRedirectTarget() {
  const user = getCurrentUser();
  if (!user) return '/dashboard';
  const level = getEducationLevel(user.id);
  return level ? '/dashboard' : '/level-select';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(pw) {
  const checks = [];
  if (pw.length < 6) checks.push('At least 6 characters');
  if (!/[A-Z]/.test(pw)) checks.push('One uppercase letter');
  if (!/[0-9]/.test(pw)) checks.push('One number');
  return checks;
}

function getAuthHTML() {
  return `
    <div class="auth-page">
      <div class="auth-card">
        <div style="text-align: center; margin-bottom: 12px;">
          <div style="width: 56px; height: 56px; background: linear-gradient(135deg, var(--accent), var(--purple)); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 1.6rem; margin-bottom: 16px; box-shadow: 0 8px 30px rgba(79, 125, 247, 0.3);">🎓</div>
        </div>
        <h2 style="text-align: center;">${isRegisterMode ? 'Create Account' : 'Welcome Back'}</h2>
        <p class="auth-subtitle" style="text-align: center;">${isRegisterMode ? 'Join our AI-powered learning community' : 'Sign in to continue your learning journey'}</p>

        <div id="auth-error" class="auth-alert auth-alert-error" style="display: none;"></div>
        <div id="auth-info" class="auth-alert auth-alert-info" style="display: none;"></div>

        <form id="auth-form" novalidate>
          ${isRegisterMode ? `
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input class="form-input" type="text" id="auth-name" placeholder="e.g. Alex Johnson" required autocomplete="name" />
          </div>
          ` : ''}

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input class="form-input" type="email" id="auth-email" placeholder="you@example.com" required autocomplete="email" />
            <div class="field-hint" id="email-hint" style="display: none;"></div>
          </div>

          ${isRegisterMode ? `
          <div class="form-group">
            <label class="form-label">Password</label>
            <div style="position: relative;">
              <input class="form-input" type="password" id="auth-password" placeholder="Min 6 chars, 1 uppercase, 1 number" required autocomplete="new-password" />
              <button type="button" class="toggle-pw-btn" id="toggle-pw">👁</button>
            </div>
            <div class="field-hint" id="pw-strength" style="display: none;"></div>
          </div>
          <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <input class="form-input" type="password" id="auth-confirm-pw" placeholder="Re-enter password" required autocomplete="new-password" />
          </div>
          ` : `
          <div class="form-group">
            <label class="form-label">Password</label>
            <div style="position: relative;">
              <input class="form-input" type="password" id="auth-password" placeholder="••••••••" required autocomplete="current-password" />
              <button type="button" class="toggle-pw-btn" id="toggle-pw">👁</button>
            </div>
          </div>
          `}

          <button type="submit" class="btn btn-primary btn-block btn-lg" id="auth-submit-btn" style="margin-top: 4px; border-radius: var(--radius-md); padding: 15px;">
            ${isRegisterMode ? '🚀 Create Account' : '→ Sign In'}
          </button>
        </form>

        <div class="auth-divider">or</div>

        <div class="auth-toggle">
          ${isRegisterMode
            ? 'Already have an account? <a id="toggle-auth" href="#/login">Sign In</a>'
            : 'Don\'t have an account? <a id="toggle-auth" href="#/signup">Sign Up</a>'}
        </div>

        <div style="margin-top: 24px; padding: 16px 18px; background: rgba(79, 125, 247, 0.05); border: 1px solid rgba(79, 125, 247, 0.1); border-radius: var(--radius-md); font-size: 0.8rem; color: var(--text-muted);">
          <div style="font-weight: 700; color: var(--text-secondary); margin-bottom: 6px; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;">☁️ Cloud-Powered</div>
          <p style="margin: 0; font-size: 0.78rem;">Your data is stored securely in the cloud via Supabase. Sign up with any email to get started!</p>
        </div>

        <!-- DEV BYPASS BUTTON -->
        <button id="dev-skip-auth" class="btn btn-ghost btn-sm" style="margin-top: 16px; width: 100%; color: var(--text-muted); border: 1px dashed var(--border);">
          🛠️ Dev: Skip Auth (Bypass Email Limit)
        </button>
      </div>
    </div>
  `;
}

export function bindLoginEvents() {
  const form = document.getElementById('auth-form');
  const toggleBtn = document.getElementById('toggle-auth');
  const togglePw = document.getElementById('toggle-pw');

  if (togglePw) {
    togglePw.addEventListener('click', () => {
      const pwField = document.getElementById('auth-password');
      if (pwField.type === 'password') { pwField.type = 'text'; togglePw.textContent = '🙈'; }
      else { pwField.type = 'password'; togglePw.textContent = '👁'; }
    });
  }

  const emailField = document.getElementById('auth-email');
  if (emailField) {
    emailField.addEventListener('input', () => {
      const hint = document.getElementById('email-hint');
      const val = emailField.value.trim();
      if (val && !validateEmail(val)) {
        hint.textContent = '⚠️ Enter a valid email address';
        hint.style.display = 'block';
        hint.style.color = 'var(--danger)';
      } else {
        hint.style.display = 'none';
      }
    });
  }

  const pwField = document.getElementById('auth-password');
  if (pwField && isRegisterMode) {
    pwField.addEventListener('input', () => {
      const hint = document.getElementById('pw-strength');
      const issues = validatePassword(pwField.value);
      if (issues.length > 0) {
        hint.innerHTML = '⚠️ Missing: ' + issues.join(', ');
        hint.style.display = 'block';
        hint.style.color = 'var(--warning)';
      } else {
        hint.innerHTML = '✅ Strong password';
        hint.style.display = 'block';
        hint.style.color = 'var(--success)';
      }
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isRegisterMode = !isRegisterMode;
      window.location.hash = isRegisterMode ? '#/signup' : '#/login';
    });
  }

  const skipBtn = document.getElementById('dev-skip-auth');
  if (skipBtn) {
    skipBtn.addEventListener('click', async () => {
      const { bypassAuth } = await import('../store.js');
      await bypassAuth();
      showToast('🛠️ Dev Mode: Access Granted! 🎉', 'success');
      setTimeout(() => navigate('/dashboard'), 300);
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errorEl = document.getElementById('auth-error');
      const submitBtn = document.getElementById('auth-submit-btn');
      const email = document.getElementById('auth-email').value.trim();
      const password = document.getElementById('auth-password').value;

      if (!email || !password) {
        showAuthError(errorEl, '❌ Please fill in all fields'); return;
      }
      if (!validateEmail(email)) {
        showAuthError(errorEl, '❌ Please enter a valid email address'); return;
      }

      // Disable button while loading
      submitBtn.disabled = true;
      submitBtn.textContent = '⏳ Please wait...';

      try {
        if (isRegisterMode) {
          const name = document.getElementById('auth-name').value.trim();
          const confirmPw = document.getElementById('auth-confirm-pw').value;

          if (!name) { showAuthError(errorEl, '❌ Please enter your name'); submitBtn.disabled = false; submitBtn.textContent = '🚀 Create Account'; return; }
          const pwIssues = validatePassword(password);
          if (pwIssues.length > 0) { showAuthError(errorEl, '❌ Password: ' + pwIssues.join(', ')); submitBtn.disabled = false; submitBtn.textContent = '🚀 Create Account'; return; }
          if (password !== confirmPw) { showAuthError(errorEl, '❌ Passwords do not match'); submitBtn.disabled = false; submitBtn.textContent = '🚀 Create Account'; return; }

          const result = await registerUser(name, email, password);
          if (result.error) {
            showAuthError(errorEl, '❌ ' + result.error);
            submitBtn.disabled = false;
            submitBtn.textContent = '🚀 Create Account';
            return;
          }

          showToast('Account created! Welcome aboard! 🎉', 'success');
          setTimeout(() => navigate('/level-select'), 300);
        } else {
          const result = await loginUser(email, password);
          if (result.error) {
            showAuthError(errorEl, '❌ ' + result.error);
            submitBtn.disabled = false;
            submitBtn.textContent = '→ Sign In';
            return;
          }

          showToast(`Welcome back! 👋`, 'success');
          setTimeout(() => navigate(getRedirectTarget()), 300);
        }
      } catch (err) {
        showAuthError(errorEl, '❌ Connection error. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = isRegisterMode ? '🚀 Create Account' : '→ Sign In';
      }
    });
  }
}

function showAuthError(el, msg) {
  if (el) { el.innerHTML = msg; el.style.display = 'block'; setTimeout(() => { el.style.display = 'none'; }, 5000); }
}

function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
