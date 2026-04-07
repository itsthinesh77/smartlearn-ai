// ===== Home Page =====

export function renderHome() {
  return `
    <section class="hero">
      <div class="container">
        <div class="hero-badge">✨ AI-Powered Learning Platform</div>
        <h1>Learn Smart.<br><span class="gradient-text">Not Hard.</span></h1>
        <p>AI-powered personalized learning platform that adapts to your pace, identifies your weak areas, and helps you master subjects faster.</p>
        <div class="hero-buttons">
          <button class="btn btn-primary btn-lg" onclick="location.hash='#/courses'">🚀 Start Learning</button>
        </div>
      </div>
    </section>

    <section class="container" style="padding-bottom: 80px;">
      <div style="text-align: center; margin-bottom: 48px;">
        <h2 class="section-title">Why Choose Our Platform?</h2>
        <p class="section-subtitle">Powered by intelligent features that make learning effective and fun</p>
      </div>

      <div class="features-grid">
        <div class="feature-card animate-in stagger-1">
          <div class="feature-icon" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa;">🧠</div>
          <h3>Adaptive Quizzes</h3>
          <p>Our smart system adjusts difficulty based on your performance. Score high? We'll challenge you more. Struggling? We'll help you build confidence.</p>
        </div>

        <div class="feature-card animate-in stagger-2">
          <div class="feature-icon" style="background: rgba(34, 197, 94, 0.15); color: #22c55e;">📊</div>
          <h3>Progress Tracking</h3>
          <p>Detailed analytics of your learning journey. Track completion rates, quiz scores, and visualize your improvement over time.</p>
        </div>

        <div class="feature-card animate-in stagger-3">
          <div class="feature-icon" style="background: rgba(168, 85, 247, 0.15); color: #a855f7;">💡</div>
          <h3>Smart Recommendations</h3>
          <p>AI-driven recommendations identify your weak areas and suggest topics to study, ensuring you focus on what matters most.</p>
        </div>
      </div>

      <!-- Stats Section -->
      <div style="margin-top: 60px; text-align: center;">
        <div class="grid-3">
          <div class="card card-elevated" style="padding: 32px; text-align: center;">
            <div style="font-size: 2.5rem; font-weight: 900; color: var(--accent-light);">3+</div>
            <div style="color: var(--text-secondary); margin-top: 4px;">Subjects Available</div>
          </div>
          <div class="card card-elevated" style="padding: 32px; text-align: center;">
            <div style="font-size: 2.5rem; font-weight: 900; color: var(--success);">45+</div>
            <div style="color: var(--text-secondary); margin-top: 4px;">Quiz Questions</div>
          </div>
          <div class="card card-elevated" style="padding: 32px; text-align: center;">
            <div style="font-size: 2.5rem; font-weight: 900; color: var(--purple);">13+</div>
            <div style="color: var(--text-secondary); margin-top: 4px;">Learning Topics</div>
          </div>
        </div>
      </div>
    </section>
  `;
}
