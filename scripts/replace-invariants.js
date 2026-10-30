const fs = require('fs');

let content = fs.readFileSync('preview.html', 'utf8');

const startTag = '<section id="invariants-honors">';
const startIdx = content.indexOf(startTag);
if (startIdx === -1) {
  console.error('Could not find invariants-honors tag');
  process.exit(1);
}

const endIdx = content.indexOf('</section>', startIdx);
if (endIdx === -1) {
  console.error('Could not find closing section tag');
  process.exit(1);
}

// Find previous comment if any
let commentStart = content.lastIndexOf('<!--', startIdx);
if (commentStart !== -1 && startIdx - commentStart < 120) {
  // start from comment
} else {
  commentStart = startIdx;
}

const newImportedSections = `<!-- =============================================================
       5. GITHUB ANALYTICS & VELOCITY (Imported from Profile Main)
       ============================================================= -->
  <section id="github-analytics-velocity">
    <div class="section-header">
      <div>
        <h2>
          <svg viewBox="0 0 24 24"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
          GitHub Analytics &amp; Velocity
        </h2>
        <p class="section-desc">Global platform telemetry, language distribution, and verified developer honors</p>
      </div>
    </div>

    <div class="metrics-dashboard-grid">
      <!-- Card A: Global Metrics -->
      <div class="metric-card">
        <div class="metric-card-header">
          <h3>GLOBAL METRICS</h3>
          <span class="metric-badge">Live Synced</span>
        </div>
        <div class="stats-matrix">
          <div class="stat-cell">
            <span class="stat-cell-label">Total Stars</span>
            <b class="stat-cell-val">0</b>
          </div>
          <div class="stat-cell">
            <span class="stat-cell-label">Total Forks</span>
            <b class="stat-cell-val">0</b>
          </div>
          <div class="stat-cell">
            <span class="stat-cell-label">Commits (Year)</span>
            <b class="stat-cell-val accent">327</b>
          </div>
          <div class="stat-cell">
            <span class="stat-cell-label">Pull Requests</span>
            <b class="stat-cell-val">0</b>
          </div>
          <div class="stat-cell">
            <span class="stat-cell-label">Total Issues</span>
            <b class="stat-cell-val">0</b>
          </div>
          <div class="stat-cell">
            <span class="stat-cell-label">Followers</span>
            <b class="stat-cell-val">1</b>
          </div>
        </div>
      </div>

      <!-- Card B: Top Languages -->
      <div class="metric-card">
        <div class="metric-card-header">
          <h3>TOP LANGUAGES</h3>
          <span class="metric-badge">Codebase Share</span>
        </div>
        <div class="languages-stack">
          <div class="lang-row">
            <div class="lang-meta">
              <span class="lang-name">JavaScript</span>
              <span class="lang-pct">52.9%</span>
            </div>
            <div class="lang-progress"><div class="lang-fill" style="width: 52.9%; background: #f59e0b;"></div></div>
          </div>
          <div class="lang-row">
            <div class="lang-meta">
              <span class="lang-name">TypeScript</span>
              <span class="lang-pct">21.1%</span>
            </div>
            <div class="lang-progress"><div class="lang-fill" style="width: 21.1%; background: #3b82f6;"></div></div>
          </div>
          <div class="lang-row">
            <div class="lang-meta">
              <span class="lang-name">HTML</span>
              <span class="lang-pct">6.6%</span>
            </div>
            <div class="lang-progress"><div class="lang-fill" style="width: 6.6%; background: #ef4444;"></div></div>
          </div>
          <div class="lang-row">
            <div class="lang-meta">
              <span class="lang-name">Dart</span>
              <span class="lang-pct">6.1%</span>
            </div>
            <div class="lang-progress"><div class="lang-fill" style="width: 6.1%; background: #06b6d4;"></div></div>
          </div>
          <div class="lang-row">
            <div class="lang-meta">
              <span class="lang-name">Kotlin</span>
              <span class="lang-pct">2.8%</span>
            </div>
            <div class="lang-progress"><div class="lang-fill" style="width: 2.8%; background: #a855f7;"></div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Honors & Achievements Subpanel -->
    <div class="honors-subpanel">
      <div class="honors-subpanel-header">
        <h3>HONORS &amp; ACHIEVEMENTS</h3>
      </div>
      <div class="honors-grid-refined">
        <div class="honor-badge-card">
          <span class="honor-symbol">✦</span>
          <div>
            <b>Code Specialist</b>
            <small>327+ Verified Commits</small>
          </div>
        </div>
        <div class="honor-badge-card">
          <span class="honor-symbol">★</span>
          <div>
            <b>Active Builder</b>
            <small>Shipping Distributed Systems</small>
          </div>
        </div>
        <div class="honor-badge-card">
          <span class="honor-symbol">◈</span>
          <div>
            <b>Networker</b>
            <small>Expanding Developer Reach</small>
          </div>
        </div>
        <div class="honor-badge-card">
          <span class="honor-symbol">◯</span>
          <div>
            <b>Systems Manager</b>
            <small>2+ Repositories Maintained</small>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- =============================================================
       6. ENGINEERING ACTIVITY & LOGS (Imported from Profile Main)
       ============================================================= -->
  <section id="engineering-activity-logs">
    <div class="section-header">
      <div>
        <h2>
          <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          Engineering Activity &amp; Logs
        </h2>
        <p class="section-desc">Production releases, architecture notes, and system audit trail</p>
      </div>
    </div>

    <div class="activity-log-container">
      <!-- Column 1: Technical Writing & Architecture -->
      <div class="activity-column">
        <div class="activity-col-header">
          <h3>Technical Writing &amp; RFCs</h3>
        </div>
        <ul class="activity-stream-list">
          <li class="activity-stream-item">
            <span class="stream-badge">RFC-104</span>
            <div class="stream-content">
              <b>Decentralized Edge Cache Invalidation</b>
              <p>Designing sub-millisecond cache eviction mechanisms across globally distributed worker nodes.</p>
            </div>
          </li>
          <li class="activity-stream-item">
            <span class="stream-badge">ARCH-08</span>
            <div class="stream-content">
              <b>Zero-Copy Stream Pipelines</b>
              <p>Benchmarks on IPC stream concurrency using Go channel rings and Rust memory buffers.</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Column 2: Recent Activity -->
      <div class="activity-column">
        <div class="activity-col-header">
          <h3>Recent Activity</h3>
        </div>
        <ol class="recent-events-list">
          <li class="event-item">
            <span class="event-icon">🚀</span>
            <div class="event-details">
              <span>Published release <a href="https://github.com/Suvesh108/EDM" target="_blank" rel="noreferrer">EDM v0.0.1 — Edge Download Manager</a> in <a href="https://github.com/Suvesh108/EDM" target="_blank" rel="noreferrer">Suvesh108/EDM</a></span>
              <span class="event-tag">Production Release</span>
            </div>
          </li>
          <li class="event-item">
            <span class="event-icon">📦</span>
            <div class="event-details">
              <span>Optimized distributed concurrency worker pool in <a href="https://github.com/Suvesh108" target="_blank" rel="noreferrer">jobscrap</a></span>
              <span class="event-tag">Commit 4f2a1b</span>
            </div>
          </li>
          <li class="event-item">
            <span class="event-icon">⚡</span>
            <div class="event-details">
              <span>Configured zero-trust token middleware and telemetry streams for <a href="https://github.com/Suvesh108" target="_blank" rel="noreferrer">suvesh-api</a></span>
              <span class="event-tag">Edge Gateway</span>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>`;

content = content.slice(0, commentStart) + newImportedSections + content.slice(endIdx + 10);

fs.writeFileSync('preview.html', content, 'utf8');
fs.writeFileSync('C:/Users/Suvesh/.gemini/antigravity/brain/96cf25d4-72df-4427-86d7-208e5cd2e459/profile_preview.html', content, 'utf8');
console.log('Sections successfully replaced and synced!');
