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

const barHeight = (count, max, scale = 1.0) =>
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

  const w = 0.9;
  const off = (1 - w) / 2;

  // Exact GitHub Green Palette from user's original code:
  // dark: ["#0e4429","#006d32","#26a641","#39d353"]
  // empty: "#24292f"
  const colors = [
    { top: "#24292f", left: "#1b2025", right: "#161b22", border: "rgba(255,255,255,0.06)" }, // Level 0 (Empty)
    { top: "#0e4429", left: "#0c3922", right: "#092e1b", border: "rgba(255,255,255,0.08)" }, // Level 1
    { top: "#006d32", left: "#005c2a", right: "#004a22", border: "rgba(255,255,255,0.10)" }, // Level 2
    { top: "#26a641", left: "#208b37", right: "#1a712c", border: "rgba(255,255,255,0.15)" }, // Level 3
    { top: "#39d353", left: "#30b146", right: "#279039", border: "rgba(255,255,255,0.25)" }  // Level 4
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

  const W = 1100;
  const H = 400;
  const pad = 20;
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
    const mx = px(m.week + 0.5, 7.3).toFixed(1);
    const my = (py(m.week + 0.5, 7.3, 0) + 4).toFixed(1);
    monthXml += `  <text x="${mx}" y="${my}" fill="#8b949e" font-size="10" font-family="Inter,ui-sans-serif,system-ui,-apple-system,sans-serif" text-anchor="middle">${m.label}</text>\n`;
  });

  const df = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  const dfy = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  const nf = new Intl.NumberFormat();

  const totalStr = nf.format(stats.total);
  const busiestCountStr = nf.format(stats.busiest.count);
  const busiestDateStr = stats.busiest.date ? df.format(dayMs(stats.busiest.date)) : "—";
  const dateRangeStr = stats.first && stats.last ? `${dfy.format(dayMs(stats.first))} — ${dfy.format(dayMs(stats.last))}` : "—";
  const longestStr = `${stats.longest.days}`;
  const longestSub = stats.longest.start && stats.longest.end ? `${df.format(dayMs(stats.longest.start))} — ${df.format(dayMs(stats.longest.end))}` : "—";
  const currentStr = `${stats.current.days}`;
  const currentSub = stats.current.start && stats.current.end ? `${df.format(dayMs(stats.current.start))} — ${df.format(dayMs(stats.current.end))}` : "—";

  // Exact styling matching user's original CSS:
  // :root { --bg:#0d1117; --fg:#e6edf3; --muted:#8b949e; --border:#30363d; --accent:#39d353 }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 480" width="100%" height="100%">
  <!-- Container (.skyline) -->
  <rect x="1" y="1" width="1098" height="478" rx="14" fill="#0d1117" stroke="#30363d" stroke-width="1" />

  <!-- Header (.head) - Headline removed completely -->

  <!-- Toggle Buttons (.toggle) -->
  <g transform="translate(1008, 14)">
    <rect width="74" height="30" rx="7" fill="transparent" stroke="#30363d" stroke-width="1" />
    
    <!-- 2D button (inactive) -->
    <rect x="2" y="2" width="34" height="26" rx="5" fill="transparent" />
    <rect x="11.5" y="7.5" width="5.5" height="5.5" rx="1" fill="#8b949e" />
    <rect x="19" y="7.5" width="5.5" height="5.5" rx="1" fill="#8b949e" />
    <rect x="11.5" y="15" width="5.5" height="5.5" rx="1" fill="#8b949e" />
    <rect x="19" y="15" width="5.5" height="5.5" rx="1" fill="#8b949e" />

    <!-- 3D button (active: background var(--fg): #e6edf3, color var(--bg): #0d1117) -->
    <rect x="38" y="2" width="34" height="26" rx="5" fill="#e6edf3" />
    <path d="M55 5.2 L61.2 8.6 v6.8 L55 18.8 L48.8 15.4 V8.6 Z" fill="none" stroke="#0d1117" stroke-width="1.5" stroke-linejoin="round" />
    <path d="M48.8 8.6 L55 12 L61.2 8.6 M55 12 v6.8" fill="none" stroke="#0d1117" stroke-width="1.5" stroke-linejoin="round" />
  </g>

  <!-- Stage Panel (.panel) -->
  <rect x="18" y="52" width="1064" height="376" rx="10" fill="#0d1117" stroke="#30363d" stroke-width="1" />

  <!-- Top-Right Stats (.corner.top) -->
  <g transform="translate(1066, 76)" font-family="Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" text-anchor="end">
    <text x="0" y="0" font-size="12" fill="#8b949e">1 year total</text>
    <text x="0" y="32" font-size="34" font-weight="650" letter-spacing="-0.03em" fill="#e6edf3">${totalStr}</text>
    <text x="0" y="48" font-size="11" fill="#8b949e">contributions · ${dateRangeStr}</text>

    <text x="0" y="88" font-size="12" fill="#8b949e">Busiest day</text>
    <text x="0" y="120" font-size="34" font-weight="650" letter-spacing="-0.03em" fill="#e6edf3">${busiestCountStr}</text>
    <text x="0" y="136" font-size="11" fill="#8b949e">contributions · ${busiestDateStr}</text>
  </g>

  <!-- Bottom-Left Stats (.corner.bottom) -->
  <g transform="translate(32, 290)" font-family="Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
    <text x="0" y="0" font-size="12" fill="#8b949e">Longest streak</text>
    <text x="0" y="32" font-size="34" font-weight="650" letter-spacing="-0.03em" fill="#e6edf3">${longestStr}</text>
    <text x="0" y="48" font-size="11" fill="#8b949e">days · ${longestSub}</text>

    <text x="0" y="88" font-size="12" fill="#8b949e">Current streak</text>
    <text x="0" y="120" font-size="34" font-weight="650" letter-spacing="-0.03em" fill="#e6edf3">${currentStr}</text>
    <text x="0" y="136" font-size="11" fill="#8b949e">days · ${currentSub}</text>
  </g>

  <!-- Isometric 3D Skyline Polygons Group -->
  <g transform="translate(0, 10)">
${polys}  </g>

  <!-- Month Labels along stage axis -->
  <g transform="translate(0, 10)">
${monthXml}  </g>

  <!-- Footer (.footer) -->
  <g transform="translate(32, 456)" font-family="Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" fill="#8b949e">
    <text x="0" y="0">Hover a day for details · arrow keys to explore</text>
  </g>

  <!-- Swatch Legend (.legend) -->
  <g transform="translate(942, 456)" font-family="Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" fill="#8b949e">
    <text x="-32" y="0">Less</text>
    <rect x="0" y="-10" width="12" height="12" rx="2" fill="#24292f" stroke="#7f7f7f20" stroke-width="1" />
    <rect x="17" y="-10" width="12" height="12" rx="2" fill="#0e4429" stroke="#7f7f7f20" stroke-width="1" />
    <rect x="34" y="-10" width="12" height="12" rx="2" fill="#006d32" stroke="#7f7f7f20" stroke-width="1" />
    <rect x="51" y="-10" width="12" height="12" rx="2" fill="#26a641" stroke="#7f7f7f20" stroke-width="1" />
    <rect x="68" y="-10" width="12" height="12" rx="2" fill="#39d353" stroke="#7f7f7f20" stroke-width="1" />
    <text x="88" y="0">More</text>
  </g>
</svg>`;

  fs.writeFileSync(outputFile, svg);
  console.log(`Generated ${outputFile} successfully with original colors & layout!`);
}

renderSkylineSvg().catch(err => {
  console.error("Fatal render error:", err);
  process.exit(1);
});
