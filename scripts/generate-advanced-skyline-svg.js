const fs = require('fs');

// Constants from preview.html
const DAY_MS = 86400000;
const clamp01 = v => (v > 0 ? (v < 1 ? v : 1) : 0);
const lerp = (a, b, t) => a + (b - a) * t;
const toKey = ms => new Date(ms).toISOString().slice(0, 10);
const dayMs = v => {
  if (typeof v === "number") return Math.floor(v / DAY_MS) * DAY_MS;
  if (typeof v === "string") {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v);
    if (m) return Date.UTC(+m[1], +m[2] - 1, +m[3]);
    v = new Date(v);
  }
  return Date.UTC(v.getFullYear(), v.getMonth(), v.getDate());
};

const rng = seed => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const generateContributions = (endMs, seed = 7, days = 371) => {
  const r = rng(seed);
  const bursts = Array.from({ length: 4 }, () => ({ at: r(), width: 0.035 + r() * 0.07, gain: 0.6 + r() * 1.1 }));
  const out = [];
  let mood = 0.5;
  for (let i = 0; i < days; i++) {
    const ms = endMs - (days - 1 - i) * DAY_MS;
    const x = i / Math.max(1, days - 1);
    const dow = new Date(ms).getUTCDay();
    const weekend = dow === 0 || dow === 6;
    let heat = 0.2;
    for (const b of bursts) heat += b.gain * Math.exp(-((x - b.at) ** 2) / (2 * b.width ** 2));
    mood = mood * 0.85 + r() * 0.15;
    heat *= 0.55 + mood * 0.9;
    const pActive = Math.min(0.94, (weekend ? 0.22 : 0.5) + heat * 0.4);
    let count = 0;
    if (r() < pActive) count = 1 + Math.floor(-Math.log(1 - r()) * (1.2 + heat * 7) * (weekend ? 0.5 : 1));
    if (r() < 0.01) count += 18 + Math.floor(r() * 24);
    out.push({ date: toKey(ms), count });
  }
  return out;
};

const levelOf = (count, busy) => (count <= 0 ? 0 : busy <= 0 ? 4 : 1 + Math.min(3, Math.floor((count / busy) * 4)));

const buildGrid = (data, endMs, weekStart = 0) => {
  const counts = new Map();
  for (const d of data) {
    if (!d || typeof d.date !== "string") continue;
    const ms = dayMs(d.date);
    const c = Number(d.count);
    if (!Number.isFinite(ms) || !(c > 0) || !Number.isFinite(c)) continue;
    const k = toKey(ms);
    counts.set(k, (counts.get(k) ?? 0) + c);
  }
  let start = endMs - 364 * DAY_MS;
  start -= ((new Date(start).getUTCDay() - weekStart + 7) % 7) * DAY_MS;
  const cells = [];
  for (let ms = start, i = 0; ms <= endMs; ms += DAY_MS, i++) {
    const date = toKey(ms);
    cells.push({ date, count: counts.get(date) ?? 0, level: 0, week: Math.floor(i / 7), day: i % 7 });
  }
  const nz = cells.map(c => c.count).filter(c => c > 0).sort((a, b) => a - b);
  const busy = nz.length ? nz[Math.floor(0.95 * (nz.length - 1))] : 0;
  for (const c of cells) c.level = levelOf(c.count, busy);
  return { cells, weeks: cells.length ? cells[cells.length - 1].week + 1 : 0, max: nz.length ? nz[nz.length - 1] : 0 };
};

const barHeight = (count, max, scale = 1.05) =>
  count > 0 && max > 0 ? 0.4 + Math.pow(count / max, 0.85) * 7.2 * scale : 0.2;

const YAW_3D = Math.PI / 4;
const ELEV_3D = (34 * Math.PI) / 180;

function camera() {
  const yaw = YAW_3D;
  const elev = ELEV_3D;
  return {
    cs: Math.cos(yaw),
    sn: Math.sin(yaw),
    se: Math.sin(elev),
    ce: Math.cos(elev)
  };
}

function project(cam, x, y, z) {
  const { cs, sn, se, ce } = cam;
  return [x * cs - y * sn, (x * sn + y * cs) * se - z * ce];
}

// Generate the 3D skyline SVG
function generateAdvancedSkylineSvg() {
  const end = Date.now();
  const rawData = generateContributions(end, 7, 371);
  const grid = buildGrid(rawData, end, 0);
  const n = grid.cells.length;
  const weeks = grid.weeks;
  const cam = camera();

  const w = 0.9;
  const off = (1 - w) / 2;

  // Obsidian Amber Palette colors for the 5 levels
  const colors = [
    { top: "#181820", left: "#121217", right: "#0e0e13" }, // Level 0
    { top: "#78350f", left: "#5c280b", right: "#451e08" }, // Level 1
    { top: "#b45309", left: "#92400e", right: "#78350f" }, // Level 2
    { top: "#d97706", left: "#b45309", right: "#92400e" }, // Level 3
    { top: "#f59e0b", left: "#d97706", right: "#b45309" }  // Level 4
  ];

  // Calculate extent
  let minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity;
  const add = (x, y, z) => {
    const p = project(cam, x, y, z);
    if (p[0] < minx) minx = p[0];
    if (p[0] > maxx) maxx = p[0];
    if (p[1] < miny) miny = p[1];
    if (p[1] > maxy) maxy = p[1];
  };

  const hgts = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const c = grid.cells[i];
    const h = barHeight(c.count, grid.max);
    hgts[i] = h;
    const x0 = c.week + off;
    const y0 = c.day + off;
    add(x0, y0, h);
    add(x0 + w, y0, h);
    add(x0, y0 + w, h);
    add(x0 + w, y0 + w, 0);
    add(x0, y0 + w, 0);
    add(x0 + w, y0, 0);
  }

  const W = 980;
  const H = 340;
  const pad = 24;
  const aw = W - pad * 2;
  const ah = H - pad * 2;
  const bw = maxx - minx;
  const bh = maxy - miny;
  const s = Math.min(aw / bw, ah / bh);
  const ox = pad + (aw - bw * s) / 2 - minx * s;
  const oy = pad + (ah - bh * s) / 2 - miny * s;

  const px = (x, y) => ox + (x * cam.cs - y * cam.sn) * s;
  const py = (x, y, z) => oy + ((x * cam.sn + y * cam.cs) * cam.se - z * cam.ce) * s;

  // Sort cubes back to front for proper isometric occlusions
  const order = Array.from({ length: n }, (_, i) => i);
  order.sort((a, b) => {
    const ca = grid.cells[a];
    const cb = grid.cells[b];
    return (ca.week + 0.5) * cam.sn + (ca.day + 0.5) * cam.cs - ((cb.week + 0.5) * cam.sn + (cb.day + 0.5) * cam.cs);
  });

  let polys = '';
  for (let k = 0; k < n; k++) {
    const i = order[k];
    const c = grid.cells[i];
    const z = hgts[i];
    const col = colors[c.level];

    const x0 = c.week + off;
    const y0 = c.day + off;
    const x1 = x0 + w;
    const y1 = y0 + w;

    // Top face
    const topPts = `${px(x0, y0).toFixed(1)},${py(x0, y0, z).toFixed(1)} ${px(x1, y0).toFixed(1)},${py(x1, y0, z).toFixed(1)} ${px(x1, y1).toFixed(1)},${py(x1, y1, z).toFixed(1)} ${px(x0, y1).toFixed(1)},${py(x0, y1, z).toFixed(1)}`;
    polys += `  <polygon points="${topPts}" fill="${col.top}" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" />\n`;

    // Right face
    const rightPts = `${px(x1, y0).toFixed(1)},${py(x1, y0, z).toFixed(1)} ${px(x1, y1).toFixed(1)},${py(x1, y1, z).toFixed(1)} ${px(x1, y1).toFixed(1)},${py(x1, y1, 0).toFixed(1)} ${px(x1, y0).toFixed(1)},${py(x1, y0, 0).toFixed(1)}`;
    polys += `  <polygon points="${rightPts}" fill="${col.right}" stroke="rgba(0,0,0,0.3)" stroke-width="0.5" />\n`;

    // Left face
    const leftPts = `${px(x0, y1).toFixed(1)},${py(x0, y1, z).toFixed(1)} ${px(x1, y1).toFixed(1)},${py(x1, y1, z).toFixed(1)} ${px(x1, y1).toFixed(1)},${py(x1, y1, 0).toFixed(1)} ${px(x0, y1).toFixed(1)},${py(x0, y1, 0).toFixed(1)}`;
    polys += `  <polygon points="${leftPts}" fill="${col.left}" stroke="rgba(0,0,0,0.3)" stroke-width="0.5" />\n`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 430" width="100%" height="100%">
  <defs>
    <radialGradient id="skylineGlow" cx="50%" cy="10%" r="80%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#04060a" stop-opacity="0" />
    </radialGradient>
    <filter id="amberSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Container Box -->
  <rect width="976" height="426" x="2" y="2" fill="#04060a" rx="14" stroke="rgba(245,158,11,0.3)" stroke-width="1" />
  <rect width="976" height="426" x="2" y="2" fill="url(#skylineGlow)" rx="14" />

  <!-- Header -->
  <g transform="translate(24, 28)">
    <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="16" font-weight="700" fill="#fafafa">1,830 <tspan font-size="12" font-weight="500" fill="#a1a1aa">contributions in the last year</tspan></text>
  </g>

  <!-- Mode Badge (Indicating 3D Skyline Active) -->
  <g transform="translate(860, 16)">
    <rect width="96" height="24" rx="6" fill="#181820" stroke="rgba(245,158,11,0.4)" stroke-width="1" />
    <text x="48" y="16" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="10.5" font-weight="700" fill="#f59e0b" text-anchor="middle">3D SKYLINE</text>
  </g>

  <!-- Top-Right Corner Stats -->
  <g transform="translate(770, 72)" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif">
    <text x="180" y="0" font-size="9" font-weight="700" fill="#71717a" text-anchor="end" letter-spacing="0.5">1 YEAR TOTAL</text>
    <text x="180" y="24" font-family="ui-monospace, SFMono-Regular, monospace" font-size="22" font-weight="800" fill="#f59e0b" text-anchor="end">1,830</text>
    <text x="180" y="38" font-size="9" fill="#a1a1aa" text-anchor="end">Oct 2025 — Oct 2026</text>

    <text x="180" y="70" font-size="9" font-weight="700" fill="#71717a" text-anchor="end" letter-spacing="0.5">BUSIEST DAY</text>
    <text x="180" y="94" font-family="ui-monospace, SFMono-Regular, monospace" font-size="22" font-weight="800" fill="#f59e0b" text-anchor="end">54</text>
    <text x="180" y="108" font-size="9" fill="#a1a1aa" text-anchor="end">Jul 17, 2026</text>
  </g>

  <!-- Bottom-Left Corner Stats -->
  <g transform="translate(24, 270)" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif">
    <text x="0" y="0" font-size="9" font-weight="700" fill="#71717a" letter-spacing="0.5">LONGEST STREAK</text>
    <text x="0" y="24" font-family="ui-monospace, SFMono-Regular, monospace" font-size="22" font-weight="800" fill="#f59e0b">33</text>
    <text x="0" y="38" font-size="9" fill="#a1a1aa">33 consecutive days</text>

    <text x="0" y="70" font-size="9" font-weight="700" fill="#71717a" letter-spacing="0.5">CURRENT STREAK</text>
    <text x="0" y="94" font-family="ui-monospace, SFMono-Regular, monospace" font-size="22" font-weight="800" fill="#f59e0b">2</text>
    <text x="0" y="108" font-size="9" fill="#a1a1aa">active streak</text>
  </g>

  <!-- 3D Skyline Polygons Group -->
  <g transform="translate(0, 10)">
${polys}  </g>

  <!-- Legend in Footer -->
  <g transform="translate(820, 400)" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="10" fill="#71717a">
    <text x="-32" y="10">Less</text>
    <rect x="0" y="1" width="11" height="11" rx="2" fill="#181820" />
    <rect x="15" y="1" width="11" height="11" rx="2" fill="#78350f" />
    <rect x="30" y="1" width="11" height="11" rx="2" fill="#b45309" />
    <rect x="45" y="1" width="11" height="11" rx="2" fill="#d97706" />
    <rect x="60" y="1" width="11" height="11" rx="2" fill="#f59e0b" />
    <text x="78" y="10">More</text>
  </g>
</svg>`;
}

fs.writeFileSync('contribution-skyline-3d.svg', generateAdvancedSkylineSvg());
console.log('Successfully generated contribution-skyline-3d.svg!');
