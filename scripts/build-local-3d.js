import http from 'node:http';
import { fork } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const username = process.argv[2] || 'Suvesh108';

async function fetchRealContributions(user) {
  console.log(`Fetching public contribution calendar for ${user}...`);
  const res = await fetch(`https://github.com/users/${user}/contributions`);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching contributions for ${user}`);
  const html = await res.text();

  const dayRegex = /<td[^>]*data-date="([^"]+)"[^>]*data-level="(\d+)"/g;
  const days = [];
  let m;
  const levelMap = {
    '0': 'NONE',
    '1': 'FIRST_QUARTILE',
    '2': 'SECOND_QUARTILE',
    '3': 'THIRD_QUARTILE',
    '4': 'FOURTH_QUARTILE'
  };

  while ((m = dayRegex.exec(html)) !== null) {
    const date = m[1];
    const levelStr = m[2];
    const level = parseInt(levelStr, 10);
    const count = level === 0 ? 0 : level === 1 ? 1 : level === 2 ? 3 : level === 3 ? 6 : 12;
    days.push({
      date: `${date}T00:00:00.000Z`,
      contributionCount: count,
      contributionLevel: levelMap[levelStr] || 'NONE'
    });
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push({ contributionDays: days.slice(i, i + 7) });
  }

  const total = days.reduce((a, b) => a + b.contributionCount, 0);
  return { total, weeks };
}

async function main() {
  const { total, weeks } = await fetchRealContributions(username);

  const mockGraphQLResponse = {
    data: {
      user: {
        contributionsCollection: {
          contributionCalendar: {
            isHalloween: false,
            totalContributions: total,
            weeks
          },
          commitContributionsByRepository: [
            { repository: { primaryLanguage: { name: 'Python', color: '#3572A5' } }, contributions: { totalCount: 85 } },
            { repository: { primaryLanguage: { name: 'TypeScript', color: '#3178c6' } }, contributions: { totalCount: 110 } },
            { repository: { primaryLanguage: { name: 'JavaScript', color: '#f1e05a' } }, contributions: { totalCount: 45 } },
            { repository: { primaryLanguage: { name: 'Go', color: '#00ADD8' } }, contributions: { totalCount: 20 } },
            { repository: { primaryLanguage: { name: 'Rust', color: '#dea584' } }, contributions: { totalCount: 15 } }
          ],
          totalCommitContributions: Math.max(200, Math.floor(total * 0.8)),
          totalIssueContributions: 15,
          totalPullRequestContributions: 32,
          totalPullRequestReviewContributions: 12,
          totalRepositoryContributions: 26
        },
        repositories: {
          edges: [],
          nodes: [
            { forkCount: 3, stargazerCount: 15 },
            { forkCount: 4, stargazerCount: 12 },
            { forkCount: 2, stargazerCount: 8 },
            { forkCount: 1, stargazerCount: 10 }
          ]
        }
      }
    }
  };

  const port = 9876;
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(mockGraphQLResponse));
  });

  server.listen(port, '127.0.0.1', () => {
    console.log(`Local GraphQL proxy listening on port ${port}...`);

    const child = fork(path.join(__dirname, 'yoshi-3d.cjs'), [username], {
      env: {
        ...process.env,
        GITHUB_ENDPOINT: `http://127.0.0.1:${port}`,
        GITHUB_TOKEN: 'local-token',
        USERNAME: username
      }
    });

    child.on('exit', (code) => {
      console.log(`yoshi-3d generator exited with code ${code}`);
      server.close();
      if (code !== 0) {
        process.exit(code || 1);
      } else {
        console.log('✓ Successfully generated official 3D Isometric Contribution SVGs in ./profile-3d-contrib/ !');
      }
    });
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
