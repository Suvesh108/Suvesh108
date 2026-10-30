import fs from 'node:fs';

// 1. Commit Activity Card SVG (480 x 240)
export function generateCommitActivitySvg() {
  const vals = [18, 26, 24, 40, 34, 58, 52, 72, 64, 82, 98, 90, 115, 102, 130, 120, 150, 138, 168, 155, 185, 172, 198, 190];
  const maxV = 210;
  const W = 432;
  const H = 90;
  const startX = 24;
  const startY = 110;

  const pts = vals.map((v, i) => {
    const x = startX + (i / (vals.length - 1)) * W;
    const y = startY + H - (v / maxV) * (H - 10);
    return [x, y, v];
  });

  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    d += ` C ${mx.toFixed(1)} ${pts[i][1].toFixed(1)}, ${mx.toFixed(1)} ${pts[i + 1][1].toFixed(1)}, ${pts[i + 1][0].toFixed(1)} ${pts[i + 1][1].toFixed(1)}`;
  }

  const areaD = `${d} L ${startX + W} ${startY + H} L ${startX} ${startY + H} Z`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 240" width="100%" height="100%">
  <defs>
    <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.32" />
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.0" />
    </linearGradient>
    <filter id="amberGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Card Background -->
  <rect width="476" height="236" x="2" y="2" fill="#121217" rx="12" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
  <rect width="476" height="236" x="2" y="2" fill="none" rx="12" stroke="#f59e0b" stroke-width="1" stroke-opacity="0.25" />

  <!-- Top Title & Badge -->
  <text x="24" y="32" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="11.5" font-weight="700" fill="#a1a1aa" letter-spacing="0.8">COMMIT ACTIVITY</text>
  
  <g transform="translate(376, 18)">
    <rect width="80" height="20" fill="rgba(245,158,11,0.12)" rx="4" stroke="rgba(245,158,11,0.4)" stroke-width="1" />
    <text x="40" y="14" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="10" font-weight="700" fill="#f59e0b" text-anchor="middle">↗ 24.8% More</text>
  </g>

  <!-- Stat Number & Subtext -->
  <text x="24" y="66" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="30" font-weight="800" fill="#fafafa" letter-spacing="-0.03em">486<tspan font-size="12" font-weight="500" fill="#71717a"> Commits (12m)</tspan></text>
  <text x="24" y="86" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="11.5" fill="#a1a1aa">Consistent concurrent code delivery across all repositories</text>

  <!-- Grid Lines -->
  <line x1="24" y1="130" x2="456" y2="130" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
  <line x1="24" y1="165" x2="456" y2="165" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
  <line x1="24" y1="200" x2="456" y2="200" stroke="rgba(255,255,255,0.05)" stroke-width="1" />

  <!-- Curve Fill & Line -->
  <path d="${areaD}" fill="url(#curveGrad)" />
  <path d="${d}" fill="none" stroke="#f59e0b" stroke-width="2.4" stroke-linecap="round" filter="url(#amberGlow)" />

  <!-- Bottom Axis Ticks -->
  <g transform="translate(24, 218)" font-family="ui-monospace, SFMono-Regular, monospace" font-size="9" fill="#71717a">
    <text x="0" y="0">Nov</text>
    <text x="70" y="0">Jan</text>
    <text x="140" y="0">Mar</text>
    <text x="210" y="0">May</text>
    <text x="280" y="0">Jul</text>
    <text x="350" y="0">Sep</text>
    <text x="420" y="0">Nov</text>
  </g>
</svg>`;
}

// 2. Daily Coding Habits Card SVG (480 x 240)
export function generateDailyHabitsSvg() {
  const wave = (offset, amp) => {
    return Array.from({ length: 42 }, (_, i) => {
      const x = 24 + (i / 41) * 432;
      const n = i / 41;
      const y = 150 - Math.sin(n * Math.PI * 2 + offset) * amp - Math.cos(n * Math.PI * 4) * (amp * 0.35);
      return [x, Math.max(115, Math.min(195, y))];
    });
  };

  const smooth = pts => {
    let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const mx = (pts[i][0] + pts[i + 1][0]) / 2;
      d += ` C ${mx.toFixed(1)} ${pts[i][1].toFixed(1)}, ${mx.toFixed(1)} ${pts[i + 1][1].toFixed(1)}, ${pts[i + 1][0].toFixed(1)} ${pts[i + 1][1].toFixed(1)}`;
    }
    return d;
  };

  const p1 = smooth(wave(0.5, 26));
  const p2 = smooth(wave(1.8, 14));

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 240" width="100%" height="100%">
  <defs>
    <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Card Background -->
  <rect width="476" height="236" x="2" y="2" fill="#121217" rx="12" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
  <rect width="476" height="236" x="2" y="2" fill="none" rx="12" stroke="#818cf8" stroke-width="1" stroke-opacity="0.25" />

  <!-- Top Title & Badge -->
  <text x="24" y="32" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="11.5" font-weight="700" fill="#a1a1aa" letter-spacing="0.8">DAILY CODING HABITS</text>
  
  <g transform="translate(366, 18)">
    <rect width="90" height="20" fill="rgba(129,140,248,0.12)" rx="4" stroke="rgba(129,140,248,0.4)" stroke-width="1" />
    <text x="45" y="14" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="10" font-weight="700" fill="#818cf8" text-anchor="middle">Active Builder</text>
  </g>

  <!-- Stat Number & Subtext -->
  <text x="24" y="66" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="30" font-weight="800" fill="#fafafa" letter-spacing="-0.03em">32<tspan font-size="12" font-weight="500" fill="#71717a"> Pull Requests Merged</tspan></text>
  <text x="24" y="86" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="11.5" fill="#a1a1aa">Clean merge history across 29 active projects</text>

  <!-- Grid Lines -->
  <line x1="24" y1="130" x2="456" y2="130" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
  <line x1="24" y1="165" x2="456" y2="165" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
  <line x1="24" y1="200" x2="456" y2="200" stroke="rgba(255,255,255,0.05)" stroke-width="1" />

  <!-- Flow Waves -->
  <path d="${p1}" fill="none" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round" />
  <path d="${p2}" fill="none" stroke="#818cf8" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="4 3" filter="url(#purpleGlow)" />

  <!-- Bottom Axis Ticks -->
  <g transform="translate(24, 218)" font-family="ui-monospace, SFMono-Regular, monospace" font-size="9" fill="#71717a">
    <text x="0" y="0">Night</text>
    <text x="90" y="0">Morning</text>
    <text x="195" y="0">Afternoon</text>
    <text x="310" y="0">Evening</text>
    <text x="395" y="0">Midnight</text>
  </g>
</svg>`;
}

// 3. Top Repositories Card SVG (480 x 240)
export function generateTopReposSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 240" width="100%" height="100%">
  <!-- Card Background -->
  <rect width="476" height="236" x="2" y="2" fill="#121217" rx="12" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
  <rect width="476" height="236" x="2" y="2" fill="none" rx="12" stroke="#0ea5e9" stroke-width="1" stroke-opacity="0.25" />

  <!-- Top Title -->
  <text x="24" y="32" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="11.5" font-weight="700" fill="#a1a1aa" letter-spacing="0.8">TOP REPOSITORIES</text>

  <!-- Treemap Grid Simulation -->
  <!-- Tile 1: NetPulse (Lead) -->
  <g transform="translate(24, 52)">
    <rect width="210" height="164" fill="#0ea5e9" rx="8" />
    <text x="14" y="24" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="13" font-weight="700" fill="#032538">NetPulse</text>
    <text x="14" y="60" font-family="ui-monospace, SFMono-Regular, monospace" font-size="28" font-weight="800" fill="#032538">34%</text>
    <text x="14" y="146" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="11" font-weight="600" fill="#032538">Edge Telemetry &amp; Latency</text>
  </g>

  <!-- Tile 2: jobscrap -->
  <g transform="translate(244, 52)">
    <rect width="212" height="76" fill="#6366f1" rx="8" />
    <text x="14" y="22" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="12" font-weight="700" fill="#ffffff">jobscrap</text>
    <text x="14" y="52" font-family="ui-monospace, SFMono-Regular, monospace" font-size="22" font-weight="800" fill="#ffffff">26%</text>
    <text x="100" y="50" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="10" font-weight="500" fill="#e0e7ff">Scraping Core</text>
  </g>

  <!-- Tile 3: vortex -->
  <g transform="translate(244, 138)">
    <rect width="100" height="78" fill="#f59e0b" rx="8" />
    <text x="10" y="22" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="11.5" font-weight="700" fill="#2b1800">vortex</text>
    <text x="10" y="50" font-family="ui-monospace, SFMono-Regular, monospace" font-size="20" font-weight="800" fill="#2b1800">18%</text>
    <text x="10" y="68" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="9" font-weight="600" fill="#2b1800">Media Muxer</text>
  </g>

  <!-- Tile 4: BlockVerify -->
  <g transform="translate(352, 138)">
    <rect width="104" height="78" fill="#14b8a6" rx="8" />
    <text x="10" y="22" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="11.5" font-weight="700" fill="#032b26">BlockVerify</text>
    <text x="10" y="50" font-family="ui-monospace, SFMono-Regular, monospace" font-size="20" font-weight="800" fill="#032b26">14%</text>
    <text x="10" y="68" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="9" font-weight="600" fill="#032b26">Contracts</text>
  </g>
</svg>`;
}

// 4. Languages & Skills Card SVG (480 x 240)
export function generateLanguagesSkillsSvg() {
  const slices = [
    { name: "TypeScript", share: 37.9, color: "#38bdf8" },
    { name: "JavaScript", share: 24.1, color: "#f59e0b" },
    { name: "Python", share: 10.3, color: "#10b981" },
    { name: "Rust", share: 6.9, color: "#f43f5e" },
    { name: "Go & Kotlin", share: 7.0, color: "#818cf8" },
    { name: "Other", share: 13.8, color: "#64748b" }
  ];

  const cx = 110;
  const cy = 135;
  const R = 64;
  const r = 44;

  let currentA = -Math.PI / 2;
  let paths = '';

  slices.forEach(s => {
    const sliceA = (s.share / 100) * 2 * Math.PI;
    const gap = 0.04;
    const startA = currentA + gap / 2;
    const endA = currentA + sliceA - gap / 2;
    currentA += sliceA;

    const x1 = cx + R * Math.cos(startA);
    const y1 = cy + R * Math.sin(startA);
    const x2 = cx + R * Math.cos(endA);
    const y2 = cy + R * Math.sin(endA);
    const x3 = cx + r * Math.cos(endA);
    const y3 = cy + r * Math.sin(endA);
    const x4 = cx + r * Math.cos(startA);
    const y4 = cy + r * Math.sin(startA);

    const largeArc = sliceA > Math.PI ? 1 : 0;
    const d = `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${R} ${R} 0 ${largeArc} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L ${x3.toFixed(1)} ${y3.toFixed(1)} A ${r} ${r} 0 ${largeArc} 0 ${x4.toFixed(1)} ${y4.toFixed(1)} Z`;

    paths += `<path d="${d}" fill="${s.color}" stroke="#121217" stroke-width="1.5" opacity="0.95" />\n`;
  });

  let legendRows = '';
  slices.forEach((s, i) => {
    const y = 62 + i * 27;
    legendRows += `
    <g transform="translate(225, ${y})">
      <circle cx="5" cy="5" r="4" fill="${s.color}" />
      <text x="16" y="8" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="11.5" font-weight="500" fill="#e2e8f0">${s.name}</text>
      <text x="210" y="8" font-family="ui-monospace, SFMono-Regular, monospace" font-size="11.5" font-weight="700" fill="#fafafa" text-anchor="end">${s.share}%</text>
    </g>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 240" width="100%" height="100%">
  <!-- Card Background -->
  <rect width="476" height="236" x="2" y="2" fill="#121217" rx="12" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
  <rect width="476" height="236" x="2" y="2" fill="none" rx="12" stroke="#10b981" stroke-width="1" stroke-opacity="0.25" />

  <!-- Top Title -->
  <text x="24" y="32" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="11.5" font-weight="700" fill="#a1a1aa" letter-spacing="0.8">LANGUAGES &amp; SKILLS</text>

  <!-- Donut Chart -->
  ${paths}
  <text x="${cx}" y="${cy - 2}" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, monospace" font-size="17" font-weight="800" fill="#fafafa">29</text>
  <text x="${cx}" y="${cy + 13}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="9" font-weight="600" fill="#71717a">Repositories</text>

  <!-- Legend List -->
  ${legendRows}
</svg>`;
}

// 5. Terminal Logs Window SVG (980 x 380)
export function generateTerminalLogsSvg() {
  const logEntries = [
    { num: "01.", repo: "Suvesh108/EDM", title: "EDM v0.0.1 — Edge Download Manager", tag: "latest" },
    { num: "02.", repo: "Suvesh108/Universal-Shared", title: "Universal Shared v0.2.4", tag: "pkg:core" },
    { num: "03.", repo: "Suvesh108/UnitWise", title: "UnitWise v0.0.8 — Dual-Mode Wi-Fi & BLE Live Discovery", tag: "iot:ble" },
    { num: "04.", repo: "Suvesh108/UnitWise", title: "UnitWise v0.0.7 — Real-Time Energy Flow", tag: "telemetry" },
    { num: "05.", repo: "Suvesh108/UnitWise", title: "UnitWise v0.0.6 — Real IoT Discovery & Fluid Motion", tag: "runtime" },
    { num: "06.", repo: "Suvesh108/UnitWise", title: "UnitWise v0.0.5 — Multi-Property Management & Dynamic OTA", tag: "ota:live" },
    { num: "07.", repo: "Suvesh108/UnitWise", title: "UnitWise v0.0.4 — Minimalist UI/UX Overhaul & Donut Graph", tag: "ui:v2" },
    { num: "08.", repo: "Suvesh108/UnitWise", title: "UnitWise v0.0.3 — Dual-Mode Auto-Discovery Scanner", tag: "scanner" }
  ];

  let logRows = '';
  logEntries.forEach((entry, i) => {
    const y = 80 + i * 32;
    logRows += `
    <g transform="translate(24, ${y})">
      <text x="0" y="14" font-family="ui-monospace, SFMono-Regular, monospace" font-size="11" fill="#71717a">${entry.num}</text>
      <text x="32" y="14" font-size="12">🚀</text>
      <text x="56" y="14" font-family="ui-monospace, SFMono-Regular, monospace" font-size="11.5" fill="#f8fafc">Published release <tspan fill="#f59e0b" font-weight="600">${entry.title}</tspan> in <tspan fill="#60a5fa">${entry.repo}</tspan></text>
      <rect x="830" y="2" width="76" height="18" fill="rgba(245,158,11,0.12)" rx="4" stroke="rgba(245,158,11,0.3)" stroke-width="0.8" />
      <text x="868" y="14" font-family="ui-monospace, SFMono-Regular, monospace" font-size="9.5" fill="#f59e0b" text-anchor="middle">${entry.tag}</text>
    </g>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 370" width="100%" height="100%">
  <!-- Window Container -->
  <rect width="976" height="366" x="2" y="2" fill="#06090e" rx="10" stroke="rgba(245,158,11,0.3)" stroke-width="1" />

  <!-- Window Title Bar -->
  <rect width="976" height="36" x="2" y="2" fill="#0f141d" rx="10" />
  <rect width="976" height="12" x="2" y="26" fill="#0f141d" />
  <line x1="2" y1="38" x2="978" y2="38" stroke="rgba(255,255,255,0.06)" stroke-width="1" />

  <!-- Window Dots -->
  <circle cx="20" cy="20" r="5" fill="#ff5f56" />
  <circle cx="36" cy="20" r="5" fill="#ffbd2e" />
  <circle cx="52" cy="20" r="5" fill="#27c93f" />

  <!-- Window Title -->
  <text x="490" y="23" font-family="ui-monospace, SFMono-Regular, monospace" font-size="11" font-weight="600" fill="#94a3b8" text-anchor="middle">suvesh@desktop: ~/github/release-journal</text>
  <text x="955" y="23" font-family="ui-monospace, SFMono-Regular, monospace" font-size="10" fill="#71717a" text-anchor="end">bash</text>

  <!-- Prompt Command Line -->
  <g transform="translate(24, 56)">
    <text x="0" y="0" font-family="ui-monospace, SFMono-Regular, monospace" font-size="12" fill="#10b981">suvesh@desktop<tspan fill="#a1a1aa">:</tspan><tspan fill="#60a5fa">~/github</tspan><tspan fill="#a1a1aa">$</tspan> <tspan fill="#f8fafc">gh release list --limit 8 --repo Suvesh108</tspan></text>
  </g>

  <!-- Log Rows -->
  ${logRows}

  <!-- Blinking Cursor Line -->
  <g transform="translate(24, 345)">
    <text x="0" y="0" font-family="ui-monospace, SFMono-Regular, monospace" font-size="12" fill="#10b981">suvesh@desktop<tspan fill="#a1a1aa">:</tspan><tspan fill="#60a5fa">~/github</tspan><tspan fill="#a1a1aa">$</tspan></text>
    <rect x="135" y="-11" width="7" height="14" fill="#f59e0b" />
  </g>
</svg>`;
}

// Write the files
fs.writeFileSync('analytics-commit-activity.svg', generateCommitActivitySvg());
fs.writeFileSync('analytics-daily-habits.svg', generateDailyHabitsSvg());
fs.writeFileSync('analytics-top-repos.svg', generateTopReposSvg());
fs.writeFileSync('analytics-languages-skills.svg', generateLanguagesSkillsSvg());
fs.writeFileSync('terminal-logs.svg', generateTerminalLogsSvg());

console.log('Successfully generated all 5 obsidian SVG cards!');
