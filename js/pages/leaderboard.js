import { fetchLeaderboard } from '../store.js';

export function renderLeaderboard() {
  return `
    <div class="page" id="leaderboard-page" style="position: relative; overflow: hidden;">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>

      <div class="container" style="padding-top: 100px; padding-bottom: 60px; position: relative; z-index: 1;">
        <div style="text-align: center; margin-bottom: 52px;" class="animate-in">
          <div style="width: 72px; height: 72px; background: linear-gradient(135deg, #fbbf24, #f59e0b); border-radius: var(--radius-lg); display: inline-flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 20px; box-shadow: 0 12px 40px rgba(251, 191, 36, 0.25);">🏆</div>
          <h1 class="section-title" style="font-size: 2.2rem;">Global Leaderboard</h1>
          <p class="section-subtitle" style="margin-bottom: 0;">Top learners from around the world</p>
        </div>

        <div id="leaderboard-content">
          <div style="display: flex; align-items: center; justify-content: center; height: 300px; flex-direction: column; gap: 16px;">
            <div style="width: 48px; height: 48px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Fetching rankings...</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function bindLeaderboardEvents() {
  const contentEl = document.getElementById('leaderboard-content');
  if (!contentEl) return;

  try {
    const leaderboard = await fetchLeaderboard();

    if (!leaderboard || leaderboard.length === 0) {
      contentEl.innerHTML = `
        <div class="card animate-in" style="text-align: center; padding: 60px;">
          <div style="font-size: 3rem; margin-bottom: 20px;">🏁</div>
          <h3>No Rankings Yet</h3>
          <p style="color: var(--text-secondary);">Be the first to complete a quiz and claim the top spot!</p>
          <button class="btn btn-primary" style="margin-top: 24px;" onclick="location.hash='#/quiz'">📝 Take a Quiz</button>
        </div>
      `;
      return;
    }

    const top3 = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);
    const medals = ['gold', 'silver', 'bronze'];
    const medalIcons = ['🥇', '🥈', '🥉'];
    const rankColors = ['#fbbf24', '#94a3b8', '#cd7f32'];

    contentEl.innerHTML = `
      <!-- Podium -->
      <div class="leaderboard-podium animate-in">
        ${[1, 0, 2].map(idx => {
          const p = top3[idx];
          if (!p) return `<div class="podium-card empty ${medals[idx]}"></div>`;
          const isFirst = idx === 0;
          return `
            <div class="podium-card ${medals[idx]}" style="${isFirst ? 'animation: glowPulse 3s ease-in-out infinite;' : ''}">
              <div class="podium-medal">${medalIcons[idx]}</div>
              <div class="podium-avatar" style="width: ${isFirst ? '76px' : '68px'}; height: ${isFirst ? '76px' : '68px'}; font-size: ${isFirst ? '1.8rem' : '1.5rem'};">
                ${p.avatar}
              </div>
              <h3 style="font-size: ${isFirst ? '1.1rem' : '0.95rem'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">${p.name}</h3>
              <div class="podium-score" style="font-size: 1rem; font-weight: 800; color: ${rankColors[idx]}; margin: 4px 0;">${(p.score || 0).toLocaleString()} XP</div>
              <div style="display: flex; gap: 12px; justify-content: center; margin-top: 8px; font-size: 0.72rem; color: var(--text-muted);">
                <span>${p.quizzes || 0} quizzes</span>
                <span>${p.accuracy || 0}% acc</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Rankings Table -->
      <div class="table-wrapper animate-in" style="margin-top: 40px;">
        <table class="table">
          <thead>
            <tr>
              <th style="width: 80px;">Rank</th>
              <th>User</th>
              <th>Total XP</th>
              <th>Quizzes</th>
              <th>Accuracy</th>
            </tr>
          </thead>
          <tbody>
            ${leaderboard.map((entry, i) => `
              <tr class="${i < 3 ? 'rank-top' : ''}">
                <td>
                  <span style="font-weight: 800; color: ${i < 3 ? rankColors[i] : 'var(--text-muted)'}">
                    ${i < 3 ? medalIcons[i] : `#${i + 1}`}
                  </span>
                </td>
                <td>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(79, 125, 247, 0.08); display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
                      ${entry.avatar}
                    </div>
                    <span style="font-weight: 600;">${entry.name}</span>
                  </div>
                </td>
                <td style="font-weight: 800; color: var(--accent-light);">${(entry.score || 0).toLocaleString()}</td>
                <td style="color: var(--text-secondary);">${entry.quizzes || 0}</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="progress-bar-container" style="width: 60px; height: 5px;">
                      <div class="progress-bar-fill ${entry.accuracy >= 80 ? 'success' : entry.accuracy >= 50 ? '' : 'danger'}" style="width: ${entry.accuracy}%;"></div>
                    </div>
                    <span style="font-size: 0.75rem; font-weight: 700; color: ${entry.accuracy >= 80 ? 'var(--success)' : entry.accuracy >= 50 ? 'var(--warning)' : 'var(--danger)'};">${entry.accuracy}%</span>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    console.error('Leaderboard load error:', err);
    contentEl.innerHTML = `
      <div class="card" style="text-align: center; padding: 48px; border: 1px solid var(--danger-bg);">
         <div style="font-size: 3rem; margin-bottom: 20px;">⚠️</div>
         <h3>Failed to Load Rankings</h3>
         <p style="color: var(--text-secondary);">There was a connection error. Please try again later.</p>
         <button class="btn btn-ghost" style="margin-top: 16px;" onclick="location.reload()">🔄 Refresh Page</button>
      </div>
    `;
  }
}
