// ===== Education Level Selection Page =====
import { getCurrentUser, setEducationLevel, getEducationLevel } from '../store.js';
import { navigate } from '../router.js';

export function renderLevelSelect() {
  const user = getCurrentUser();
  if (!user) { setTimeout(() => navigate('/login'), 50); return '<div class="page"></div>'; }

  const current = getEducationLevel(user.id);

  return `
    <div class="page" style="position: relative; overflow: hidden;">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>

      <div class="container" style="position: relative; z-index: 1;">
        <div style="max-width: 700px; margin: 60px auto 0; text-align: center;">
          <div class="animate-in">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--accent), var(--purple)); border-radius: var(--radius-lg); display: inline-flex; align-items: center; justify-content: center; font-size: 2.2rem; margin-bottom: 24px; box-shadow: 0 12px 40px rgba(79, 125, 247, 0.3); animation: glowPulse 3s ease-in-out infinite;">🎓</div>
            <h1 class="section-title" style="font-size: 2.2rem;">Select Your Level</h1>
            <p class="section-subtitle" style="margin-bottom: 48px; font-size: 1rem;">Choose your education level to get personalized courses and learning paths</p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <!-- School Card -->
            <div class="card animate-in stagger-1 level-card" data-level="school"
                 style="padding: 44px 28px; cursor: pointer; text-align: center; ${current === 'school' ? 'border-color: var(--accent); box-shadow: var(--shadow-glow);' : ''}"
                 onmouseover="this.style.transform='translateY(-8px)'" onmouseout="this.style.transform='translateY(0)'">
              <div style="font-size: 3.5rem; margin-bottom: 20px;">🏫</div>
              <h2 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 8px;">School Student</h2>
              <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.6; margin-bottom: 20px;">Courses in Mathematics, Physics, Chemistry, Biology, Computer Science & Social Science</p>
              
              <div style="display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-bottom: 20px;">
                <span class="badge badge-accent">🔢 Math</span>
                <span class="badge badge-accent">⚡ Physics</span>
                <span class="badge badge-accent">🧪 Chemistry</span>
                <span class="badge badge-accent">🧬 Biology</span>
                <span class="badge badge-accent">💻 CS</span>
                <span class="badge badge-accent">📜 Social Science</span>
              </div>

              <div style="font-size: 0.82rem; color: var(--text-muted);">
                <strong style="color: var(--accent-light);">26</strong> courses · <strong style="color: var(--accent-light);">140+</strong> topics
              </div>
              ${current === 'school' ? '<div style="margin-top: 16px;"><span class="badge badge-easy">✓ Selected</span></div>' : ''}
            </div>

            <!-- University Card -->
            <div class="card animate-in stagger-2 level-card" data-level="university"
                 style="padding: 44px 28px; cursor: pointer; text-align: center; ${current === 'university' ? 'border-color: var(--accent); box-shadow: var(--shadow-glow);' : ''}"
                 onmouseover="this.style.transform='translateY(-8px)'" onmouseout="this.style.transform='translateY(0)'">
              <div style="font-size: 3.5rem; margin-bottom: 20px;">🎓</div>
              <h2 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 8px;">University Student</h2>
              <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.6; margin-bottom: 20px;">Advanced courses in Programming, CS, AI/ML, Web Dev, App Dev, Cybersecurity & Mathematics</p>
              
              <div style="display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-bottom: 20px;">
                <span class="badge badge-purple">🐍 Programming</span>
                <span class="badge badge-purple">🏗️ Core CS</span>
                <span class="badge badge-purple">🤖 AI / ML</span>
                <span class="badge badge-purple">🌐 Web Dev</span>
                <span class="badge badge-purple">📱 App Dev</span>
                <span class="badge badge-purple">🔒 Security</span>
              </div>

              <div style="font-size: 0.82rem; color: var(--text-muted);">
                <strong style="color: var(--purple);">25</strong> courses · <strong style="color: var(--purple);">140+</strong> topics
              </div>
              ${current === 'university' ? '<div style="margin-top: 16px;"><span class="badge badge-easy">✓ Selected</span></div>' : ''}
            </div>
          </div>

          ${current ? `
          <div style="margin-top: 32px;" class="animate-in stagger-3">
            <button class="btn btn-primary btn-lg" onclick="location.hash='#/courses'">
              📚 Continue to Courses →
            </button>
          </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

export function bindLevelSelectEvents() {
  document.querySelectorAll('.level-card').forEach(card => {
    card.addEventListener('click', async () => {
      const user = getCurrentUser();
      if (!user) return;
      const level = card.dataset.level;
      await setEducationLevel(user.id, level);
      navigate('/courses');
    });
  });
}
