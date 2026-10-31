/**
 * scripts/update-releases.js
 * Automatically pulls the latest real releases across all public repos of the user
 * and updates both README.md and index.html with live release logs.
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

const USERNAME = process.argv[2] || process.env.GITHUB_ACTOR || 'Suvesh108';
const TOKEN = process.env.GITHUB_TOKEN || '';

const KNOWN_SUMMARIES = {
  'EDM': 'Edge Download Manager',
  'Universal-Shared': 'Core Shared Library',
  'NetPulse': 'Real-Time Network Speed & Latency',
  'UnitWise': 'Wi-Fi & Bluetooth Device Discovery',
  'Settlr': 'Android Financial Settlement Engine',
  'solar': 'Sunward Solar Telemetry Dashboard',
  'jobscrap': 'Multi-Platform Job Search Pipeline',
  'HailUninstaller': 'Lightweight App Uninstaller Utility',
  'BlockVerify': 'Anti-Counterfeit Smart Contracts'
};

const KNOWN_TAGS = {
  'EDM': 'latest',
  'Universal-Shared': 'pkg:core',
  'NetPulse': 'edge:v1.2',
  'UnitWise': 'iot:ble',
  'Settlr': 'app:v0.9',
  'solar': 'solar:v0.1',
  'jobscrap': 'crawler',
  'HailUninstaller': 'tools',
  'BlockVerify': 'contracts'
};

const FALLBACK_RELEASES = [
  { repo: 'EDM', tag: 'v0.0.5', name: 'EDM v0.0.5', published_at: '2026-10-29T11:43:37Z', url: 'https://github.com/Suvesh108/EDM/releases/tag/v0.0.5' },
  { repo: 'EDM', tag: 'v0.0.4', name: 'EDM v0.0.4', published_at: '2026-10-29T10:10:35Z', url: 'https://github.com/Suvesh108/EDM/releases/tag/v0.0.4' },
  { repo: 'Universal-Shared', tag: 'v0.2.4', name: 'Universal Shared v0.2.4', published_at: '2026-10-21T19:14:59Z', url: 'https://github.com/Suvesh108/Universal-Shared/releases/tag/v0.2.4' },
  { repo: 'NetPulse', tag: 'v1.2', name: 'NetPulse v1.2', published_at: '2026-10-19T11:10:06Z', url: 'https://github.com/Suvesh108/NetPulse/releases/tag/v1.2' },
  { repo: 'NetPulse', tag: 'v1.1', name: 'NetPulse v1.1', published_at: '2026-10-19T10:40:59Z', url: 'https://github.com/Suvesh108/NetPulse/releases/tag/v1.1' },
  { repo: 'Settlr', tag: 'v0.0.9', name: 'Settlr Android Release v0.0.9', published_at: '2026-10-18T15:16:57Z', url: 'https://github.com/Suvesh108/Settlr/releases/tag/v0.0.9' },
  { repo: 'UnitWise', tag: 'v0.0.8', name: 'UnitWise v0.0.8 — Dual-Mode Wi-Fi & Bluetooth LE Live Signal Auto-Discovery', published_at: '2026-10-18T10:08:28Z', url: 'https://github.com/Suvesh108/UnitWise/releases/tag/v0.0.8' },
  { repo: 'UnitWise', tag: 'v0.0.7', name: 'UnitWise v0.0.7 — Sense-Grade Vampire Load Disaggregation', published_at: '2026-10-18T09:45:50Z', url: 'https://github.com/Suvesh108/UnitWise/releases/tag/v0.0.7' },
  { repo: 'solar', tag: 'v0.1.6', name: 'v0.1.6 - Sunward Solar App Update', published_at: '2026-10-14T09:29:10Z', url: 'https://github.com/Suvesh108/solar/releases/tag/v0.1.6' },
  { repo: 'jobscrap', tag: 'v0.4', name: 'v0.4 — 9-Platform Parallel Synchronization', published_at: '2026-09-03T07:16:16Z', url: 'https://github.com/Suvesh108/jobscrap/releases/tag/v0.4' }
];

function githubApi(endpoint) {
  return new Promise((resolve) => {
    const headers = {
      'User-Agent': 'NodeJS-Update-Releases',
      'Accept': 'application/vnd.github.v3+json'
    };
    if (TOKEN) {
      headers['Authorization'] = `token ${TOKEN}`;
    }

    const req = https.get(`https://api.github.com${endpoint}`, { headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', (err) => {
      console.warn(`Request error on ${endpoint}:`, err.message);
      resolve(null);
    });
  });
}

async function fetchAllReleases() {
  console.log(`Fetching repositories for ${USERNAME}...`);
  const repos = await githubApi(`/users/${USERNAME}/repos?per_page=100&sort=pushed`);
  if (!Array.isArray(repos)) {
    console.warn('API returned non-array (likely unauthenticated rate limit). Using verified fallback release snapshot.');
    return FALLBACK_RELEASES;
  }

  const allReleases = [];
  for (const repo of repos) {
    const rels = await githubApi(`/repos/${USERNAME}/${repo.name}/releases?per_page=10`);
    if (Array.isArray(rels) && rels.length > 0) {
      for (const rel of rels) {
        allReleases.push({
          repo: repo.name,
          tag: rel.tag_name,
          name: rel.name || rel.tag_name,
          published_at: rel.published_at || rel.created_at,
          url: rel.html_url
        });
      }
    }
  }

  if (allReleases.length === 0) {
    return FALLBACK_RELEASES;
  }

  allReleases.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
  return allReleases;
}

function formatReadmeTerminal(releases) {
  let lines = [];
  lines.push(`suvesh@desktop:~/github$ gh release list --limit 8 --repo ${USERNAME}`);
  lines.push('');

  releases.slice(0, 8).forEach((r, idx) => {
    const num = String(idx + 1).padStart(2, '0') + '.';
    const title = `${r.repo} ${r.tag}`.padEnd(24, ' ');
    const desc = (KNOWN_SUMMARIES[r.repo] || r.name).padEnd(38, ' ');
    const badgeText = idx === 0 ? '[latest]' : `[${KNOWN_TAGS[r.repo] || r.tag}]`;
    lines.push(`${num} 🚀  ${title}${desc}${badgeText}`);
  });

  return lines.join('\n');
}

function formatHtmlLogs(releases) {
  let items = [];
  releases.slice(0, 10).forEach((r, idx) => {
    const num = String(idx + 1).padStart(2, '0') + '.';
    const badgeText = idx === 0 ? 'latest' : (KNOWN_TAGS[r.repo] || r.tag);
    items.push(`          <li class="cmd-log-item">
            <span class="cmd-idx">${num}</span>
            <span class="cmd-icon">🚀</span>
            <span class="cmd-text">Published release <a href="${r.url}" target="_blank" rel="noreferrer">${r.repo} ${r.tag} — ${KNOWN_SUMMARIES[r.repo] || r.name}</a> in <a href="https://github.com/${USERNAME}/${r.repo}" target="_blank" rel="noreferrer">${USERNAME}/${r.repo}</a></span>
            <span class="cmd-tag-badge">${badgeText}</span>
          </li>`);
  });
  return items.join('\n');
}

async function main() {
  const allReleases = await fetchAllReleases();
  if (!allReleases || allReleases.length === 0) {
    console.log('No releases available, skipping file updates.');
    return;
  }

  // Filter to keep up to 2 recent releases per repo to ensure multi-project visibility across top 8
  const repoCounts = {};
  const selectedForReadme = [];
  for (const rel of allReleases) {
    repoCounts[rel.repo] = (repoCounts[rel.repo] || 0) + 1;
    if (repoCounts[rel.repo] <= 2) {
      selectedForReadme.push(rel);
    }
    if (selectedForReadme.length === 8) break;
  }

  // 1. Update README.md
  const readmePath = path.resolve(__dirname, '../README.md');
  if (fs.existsSync(readmePath)) {
    let readme = fs.readFileSync(readmePath, 'utf8');
    const startTag = '<!-- RECENT_RELEASES_START -->';
    const endTag = '<!-- RECENT_RELEASES_END -->';

    const formattedTerminal = formatReadmeTerminal(selectedForReadme);
    const replacement = `${startTag}\n\`\`\`console\n${formattedTerminal}\n\`\`\`\n${endTag}`;

    if (readme.includes(startTag) && readme.includes(endTag)) {
      const regex = new RegExp(`${startTag}[\\s\\S]*?${endTag}`);
      readme = readme.replace(regex, replacement);
      fs.writeFileSync(readmePath, readme, 'utf8');
      console.log('✓ Successfully updated README.md recent releases block.');
    } else {
      const fallbackRegex = /### 📋 Recent Releases\s*```console[\s\S]*?```/;
      if (fallbackRegex.test(readme)) {
        readme = readme.replace(fallbackRegex, `### 📋 Recent Releases\n\n${replacement}`);
        fs.writeFileSync(readmePath, readme, 'utf8');
        console.log('✓ Successfully inserted markers and updated README.md.');
      }
    }
  }

  // 2. Update index.html logs
  const indexPath = path.resolve(__dirname, '../index.html');
  if (fs.existsSync(indexPath)) {
    let indexHtml = fs.readFileSync(indexPath, 'utf8');
    const startLogTag = '<!-- RECENT_LOGS_START -->';
    const endLogTag = '<!-- RECENT_LOGS_END -->';

    const formattedHtml = formatHtmlLogs(allReleases);
    const logBlock = `${startLogTag}\n        <ol class="cmd-log-list">\n${formattedHtml}\n        </ol>\n        ${endLogTag}`;

    if (indexHtml.includes(startLogTag) && indexHtml.includes(endLogTag)) {
      const regex = new RegExp(`${startLogTag}[\\s\\S]*?${endLogTag}`);
      indexHtml = indexHtml.replace(regex, logBlock);
      fs.writeFileSync(indexPath, indexHtml, 'utf8');
      console.log('✓ Successfully updated index.html command log list.');
    } else {
      const listRegex = /<ol class="cmd-log-list">[\s\S]*?<\/ol>/;
      if (listRegex.test(indexHtml)) {
        indexHtml = indexHtml.replace(listRegex, logBlock);
        fs.writeFileSync(indexPath, indexHtml, 'utf8');
        console.log('✓ Successfully inserted markers and updated index.html.');
      }
    }
  }
}

main().catch(err => {
  console.error('Fatal error updating releases:', err);
  process.exit(1);
});
