const fs = require('fs');

const username = process.env.USERNAME || process.argv[2] || 'Suvesh108';
const outputFile = process.argv[3] || 'contribution-skyline-3d.svg';
const token = process.env.GITHUB_TOKEN;

const DAY_MS = 86400000;
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

const query = `
query($username: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $username) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
            weekday
          }
        }
      }
    }
  }
}`;

async function fetchContributionData() {
  if (token) {
    try {
      console.log(`Querying GitHub GraphQL API for ${username}...`);
      const to = new Date();
      const from = new Date(to.getTime() - 364 * DAY_MS);
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          "Authorization": `bearer ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "Antigravity-Profile-Skyline"
        },
        body: JSON.stringify({
          query,
          variables: { username, from: from.toISOString(), to: to.toISOString() }
        })
      });
      if (res.ok) {
        const json = await res.json();
        const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
        if (cal && cal.weeks) {
          const list = [];
          for (const w of cal.weeks) {
            for (const d of w.contributionDays) {
              list.push({ date: d.date, count: d.contributionCount });
            }
          }
          fs.writeFileSync('suvesh-contributions.json', JSON.stringify(list));
          console.log(`Fetched ${list.length} live contribution days (total: ${cal.totalContributions}).`);
          return list;
        }
      } else {
        console.warn(`GraphQL response error: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      console.warn("Could not fetch live GraphQL data, falling back to local json:", err.message);
    }
  }

  if (fs.existsSync('suvesh-contributions.json')) {
    console.log("Loading contribution data from suvesh-contributions.json...");
    return JSON.parse(fs.readFileSync('suvesh-contributions.json', 'utf8'));
  }

  throw new Error("No contribution data found.");
}

const levelOf = (count, busy) => (count <= 0 ? 0 : busy <= 0 ? 4 : 1 + Math.min(3, Math.floor((count / busy) * 4)));

function buildGrid(data, endMs, weekStart = 0) {
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
}

function statsOf(cells) {
  let total = 0, best = 0, bestDate = null, run = 0, runStart = null, longest = { days: 0, start: null, end: null };
  for (const c of cells) {
    total += c.count;
    if (c.count > best) {
      best = c.count;
      bestDate = c.date;
    }
    if (c.count > 0) {
      if (!run) runStart = c.date;
      run++;
      if (run > longest.days) longest = { days: run, start: runStart, end: c.date };
    } else {
      run = 0;
    }
  }
  let j = cells.length - 1;
  if (j >= 0 && !cells[j].count) j--;
  const endAt = j;
  while (j >= 0 && cells[j].count > 0) j--;
  const days = endAt - j;
  const current = days > 0 ? { days, start: cells[j + 1].date, end: cells[endAt].date } : { days: 0, start: null, end: null };
  return { total, first: cells[0]?.date || null, last: cells[cells.length - 1]?.date || null, busiest: { count: best, date: bestDate }, longest, current };
}

function monthLabels(cells, weeks) {
  const f = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
  const out = [];
  let prev = -1;
  for (let w = 0; w < weeks; w++) {
    const c = cells[w * 7];
    if (!c) break;
    const m = +c.date.slice(5, 7);
    if (m !== prev) out.push({ week: w, label: f.format(dayMs(c.date)) });
    prev = m;
  }
  if (out.length > 1 && out[1].week - out[0].week < 3) out.shift();
  return out;
}

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

async function renderSkylineSvg() {
  const data = await fetchContributionData();
  const endMs = dayMs(new Date());
  const grid = buildGrid(data, endMs, 0);
  const stats = statsOf(grid.cells);
  const months = monthLabels(grid.cells, grid.weeks);
  const n = grid.cells.length;
  const cam = camera();

  const w = 0.88;
  const off = (1 - w) / 2;

  // Amber Obsidian theme palette matching index.html
  const colors = [
    { top: "#181820", left: "#121217", right: "#0e0e13", border: "rgba(255,255,255,0.06)" }, // Level 0
    { top: "#5c2409", left: "#451a06", right: "#301204", border: "rgba(245,158,11,0.15)" }, // Level 1
    { top: "#8f3a09", left: "#702c06", right: "#522004", border: "rgba(245,158,11,0.25)" }, // Level 2
    { top: "#c25e08", left: "#9c4906", right: "#753604", border: "rgba(245,158,11,0.35)" }, // Level 3
    { top: "#f59e0b", left: "#d97706", right: "#b45309", border: "rgba(255,255,255,0.4)" }   // Level 4
  ];

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

  const W = 1060;
  const H = 400;
  const pad = 28;
  const aw = W - pad * 2;
  const ah = H - pad * 2;
  const bw = maxx - minx;
  const bh = maxy - miny;
  const s = Math.min(aw / bw, ah / bh);
  const ox = pad + (aw - bw * s) / 2 - minx * s;
  const oy = pad + (ah - bh * s) / 2 - miny * s + 6;

  const px = (x, y) => ox + (x * cam.cs - y * cam.sn) * s;
  const py = (x, y, z) => oy + ((x * cam.sn + y * cam.cs) * cam.se - z * cam.ce) * s;

  // Sort back to front for proper occlusion
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
    polys += `  <polygon points="${topPts}" fill="${col.top}" stroke="${col.border}" stroke-width="0.5" />\n`;

    // Right face
    if (z > 0.25) {
      const rightPts = `${px(x1, y0).toFixed(1)},${py(x1, y0, z).toFixed(1)} ${px(x1, y1).toFixed(1)},${py(x1, y1, z).toFixed(1)} ${px(x1, y1).toFixed(1)},${py(x1, y1, 0).toFixed(1)} ${px(x1, y0).toFixed(1)},${py(x1, y0, 0).toFixed(1)}`;
      polys += `  <polygon points="${rightPts}" fill="${col.right}" stroke="rgba(0,0,0,0.4)" stroke-width="0.5" />\n`;

      // Left face
      const leftPts = `${px(x0, y1).toFixed(1)},${py(x0, y1, z).toFixed(1)} ${px(x1, y1).toFixed(1)},${py(x1, y1, z).toFixed(1)} ${px(x1, y1).toFixed(1)},${py(x1, y1, 0).toFixed(1)} ${px(x0, y1).toFixed(1)},${py(x0, y1, 0).toFixed(1)}`;
      polys += `  <polygon points="${leftPts}" fill="${col.left}" stroke="rgba(0,0,0,0.4)" stroke-width="0.5" />\n`;
    }
  }

  // Month labels
  let monthXml = '';
  months.forEach(m => {
    const mx = px(m.week + 0.5, 7.4).toFixed(1);
    const my = (py(m.week + 0.5, 7.4, 0) + 4).toFixed(1);
    monthXml += `  <text x="${mx}" y="${my}" fill="#71717a" font-size="9.5" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" text-anchor="middle">${m.label}</text>\n`;
  });

  const df = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  const dfy = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
  const nf = new Intl.NumberFormat();

  const totalStr = nf.format(stats.total);
  const busiestCountStr = nf.format(stats.busiest.count);
  const busiestDateStr = stats.busiest.date ? df.format(dayMs(stats.busiest.date)) : "—";
  const dateRangeStr = `${dfy.format(dayMs(stats.first))} — ${dfy.format(dayMs(stats.last))}`;
  const longestStr = `${stats.longest.days} ${stats.longest.days === 1 ? 'day' : 'days'}`;
  const currentStr = `${stats.current.days} ${stats.current.days === 1 ? 'day' : 'days'}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 480" width="100%" height="100%">
  <defs>
    <radialGradient id="skylineGlow" cx="50%" cy="0%" r="85%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.09" />
      <stop offset="60%" stop-color="#121217" stop-opacity="0.02" />
      <stop offset="100%" stop-color="#09090b" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="cardBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(245,158,11,0.35)" />
      <stop offset="50%" stop-color="rgba(255,255,255,0.08)" />
      <stop offset="100%" stop-color="rgba(245,158,11,0.15)" />
    </linearGradient>
  </defs>

  <!-- Card Surface -->
  <rect x="2" y="2" width="1056" height="476" rx="14" fill="#0c0d12" stroke="url(#cardBorder)" stroke-width="1.2" />
  <rect x="2" y="2" width="1056" height="476" rx="14" fill="url(#skylineGlow)" />

  <!-- Inner Stage Frame -->
  <rect x="18" y="58" width="1024" height="376" rx="10" fill="#05070c" stroke="rgba(255,255,255,0.05)" stroke-width="1" />

  <!-- Header -->
  <g transform="translate(24, 37)">
    <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14.5" fill="#fafafa">
      <tspan font-weight="700" fill="#f59e0b">${totalStr}</tspan> <tspan fill="#a1a1aa">contributions in the last year</tspan>
    </text>
  </g>

  <!-- Toggle Buttons Indicator -->
  <g transform="translate(966, 20)">
    <rect width="76" height="28" rx="6" fill="#181820" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
    <!-- 2D inactive -->
    <rect x="3" y="3" width="34" height="22" rx="4" fill="transparent" />
    <rect x="12" y="7" width="5" height="5" rx="1" fill="#71717a" />
    <rect x="19" y="7" width="5" height="5" rx="1" fill="#71717a" />
    <rect x="12" y="14" width="5" height="5" rx="1" fill="#71717a" />
    <rect x="19" y="14" width="5" height="5" rx="1" fill="#71717a" />
    <!-- 3D active -->
    <rect x="39" y="3" width="34" height="22" rx="4" fill="#f59e0b" />
    <path d="M56 6.5 L63 10.3 v7 L56 21.1 L49 17.3 v-7 Z" fill="none" stroke="#121217" stroke-width="1.3" stroke-linejoin="round" />
    <path d="M49 10.3 L56 14.1 L63 10.3 M56 14.1 v7" fill="none" stroke="#121217" stroke-width="1.3" stroke-linejoin="round" />
  </g>

  <!-- Top-Right Stats -->
  <g transform="translate(1018, 86)" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" text-anchor="end">
    <text x="0" y="0" font-size="9.5" font-weight="700" fill="#71717a" letter-spacing="0.5">1 YEAR TOTAL</text>
    <text x="0" y="24" font-family="ui-monospace, SFMono-Regular, monospace" font-size="24" font-weight="800" fill="#f59e0b">${totalStr}</text>
    <text x="0" y="38" font-size="9" fill="#a1a1aa">contributions · ${dateRangeStr}</text>

    <text x="0" y="72" font-size="9.5" font-weight="700" fill="#71717a" letter-spacing="0.5">BUSIEST DAY</text>
    <text x="0" y="96" font-family="ui-monospace, SFMono-Regular, monospace" font-size="24" font-weight="800" fill="#f59e0b">${busiestCountStr}</text>
    <text x="0" y="110" font-size="9" fill="#a1a1aa">contributions · ${busiestDateStr}</text>
  </g>

  <!-- Bottom-Left Stats -->
  <g transform="translate(36, 310)" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif">
    <text x="0" y="0" font-size="9.5" font-weight="700" fill="#71717a" letter-spacing="0.5">LONGEST STREAK</text>
    <text x="0" y="24" font-family="ui-monospace, SFMono-Regular, monospace" font-size="24" font-weight="800" fill="#f59e0b">${longestStr}</text>
    <text x="0" y="38" font-size="9" fill="#a1a1aa">consecutive days</text>

    <text x="0" y="72" font-size="9.5" font-weight="700" fill="#71717a" letter-spacing="0.5">CURRENT STREAK</text>
    <text x="0" y="96" font-family="ui-monospace, SFMono-Regular, monospace" font-size="24" font-weight="800" fill="#f59e0b">${currentStr}</text>
    <text x="0" y="110" font-size="9" fill="#a1a1aa">active streak</text>
  </g>

  <!-- Isometric 3D Skyline Polygons -->
  <g transform="translate(0, 10)">
${polys}  </g>

  <!-- Months along axis -->
  <g transform="translate(0, 10)">
${monthXml}  </g>

  <!-- Footer -->
  <g transform="translate(26, 456)" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="11.5" fill="#71717a">
    <text x="0" y="0">Live synced contribution activity</text>
  </g>

  <g transform="translate(900, 456)" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="11.5" fill="#71717a">
    <text x="-34" y="0">Less</text>
    <rect x="0" y="-10" width="11" height="11" rx="2" fill="#181820" stroke="rgba(255,255,255,0.06)" />
    <rect x="15" y="-10" width="11" height="11" rx="2" fill="#5c2409" />
    <rect x="30" y="-10" width="11" height="11" rx="2" fill="#8f3a09" />
    <rect x="45" y="-10" width="11" height="11" rx="2" fill="#c25e08" />
    <rect x="60" y="-10" width="11" height="11" rx="2" fill="#f59e0b" />
    <text x="80" y="0">More</text>
  </g>
</svg>`;

  fs.writeFileSync(outputFile, svg);
  console.log(`Generated ${outputFile} successfully!`);
}

renderSkylineSvg().catch(err => {
  console.error("Fatal render error:", err);
  process.exit(1);
});
