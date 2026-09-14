import fs from 'node:fs';

const username = process.argv[2] || 'Suvesh108';
const token = process.env.GITHUB_TOKEN;

const HeaderTemplate = `           ____ _ _   _   _       _     
          / ___(_) |_| | | |_   _| |__  
         | |  _| | __| |_| | | | | '_ \\ 
         | |_| | | |_|  _  | |_| | |_) |
          \\____|_|\\__|_| |_|\\__,_|_.__/ 

          ____  _          _ _            
         / ___|| | ___   _| (_)_ __   ___ 
         \\___ \\| |/ / | | | | | '_ \\ / _ \\
          ___) |   <| |_| | | | | | | __/
         |____/|_|\\_\\\\__, |_|_|_| |_|\\___|
                    |___/`;

const GridWidth = 53;

function centerText(text) {
  const visualWidth = text.length;
  if (visualWidth >= GridWidth) return text.slice(0, GridWidth) + '\n';
  const totalPadding = GridWidth - visualWidth;
  if (totalPadding <= 1) return text + '\n';
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;
  return ' '.repeat(leftPadding) + text + ' '.repeat(rightPadding) + '\n';
}

const EmptyBlock = ' ';
const FutureBlock = '.';
const FoundationLow = '░';
const FoundationMed = '▒';
const FoundationHigh = '▓';
const MiddleLow = '░';
const MiddleMed = '▒';
const MiddleHigh = '▓';
const TopLow = '╻';
const TopMed = '┃';
const TopHigh = '╽';

const blockSets = {
  foundation: [FoundationLow, FoundationMed, FoundationHigh],
  middle: [MiddleLow, MiddleMed, MiddleHigh],
  top: [TopLow, TopMed, TopHigh]
};

function getBlockType(normalized) {
  if (normalized < 0.33) return 0;
  if (normalized < 0.66) return 1;
  return 2;
}

function getBlock(normalized, dayIdx, nonZeroIdx) {
  if (normalized === 0) return EmptyBlock;
  const blockType = getBlockType(normalized);
  if (nonZeroIdx === 1) return blockSets.foundation[blockType];
  switch (dayIdx) {
    case nonZeroIdx - 1:
      return blockSets.top[blockType];
    case 0:
      return blockSets.foundation[blockType];
    default:
      return blockSets.middle[blockType];
  }
}

async function fetchContributionData(user) {
  if (token) {
    console.log(`Fetching GraphQL contributions for ${user}...`);
    const to = new Date();
    const from = new Date(to.getTime() - 364 * 24 * 60 * 60 * 1000);
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
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'node-fetch'
      },
      body: JSON.stringify({ query, variables: { username: user, from: from.toISOString(), to: to.toISOString() } })
    });
    if (res.ok) {
      const json = await res.json();
      if (!json.errors && json?.data?.user?.contributionsCollection?.contributionCalendar) {
        return json.data.user.contributionsCollection.contributionCalendar;
      }
    }
  }

  // Fallback to public GitHub profile contribution endpoint (no token required!)
  console.log(`Fetching public HTML contributions for ${user}...`);
  const res = await fetch(`https://github.com/users/${user}/contributions`);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching contributions for ${user}`);
  const html = await res.text();
  
  // Extract days from table
  const dayRegex = /<td[^>]*data-date="([^"]+)"[^>]*data-level="(\d+)"/g;
  const countRegex = /data-date="([^"]+)"[^>]*>.*?(\d+)\s+contribution/gs;

  // Map counts from tooltips
  const countMap = {};
  const tooltipRegex = /<tool-tip[^>]*for="contribution-day-component-[^"]*"[^>]*>(?:(\d+)\s+contribution|No contribution)/g;
  const dayIdRegex = /id="(contribution-day-component-[^"]*)"[^>]*data-date="([^"]+)"/g;
  
  const days = [];
  let m;
  while ((m = dayRegex.exec(html)) !== null) {
    const date = m[1];
    const level = parseInt(m[2], 10);
    // Rough contribution approximation from level if exact tooltip not parsed
    const count = level === 0 ? 0 : level === 1 ? 1 : level === 2 ? 4 : level === 3 ? 7 : 12;
    days.push({ date, contributionCount: count });
  }

  // Group into 7-day weeks
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push({ contributionDays: days.slice(i, i + 7) });
  }

  return { totalContributions: days.reduce((a, b) => a + b.contributionCount, 0), weeks };
}

function generateASCII(calendar, user, year) {
  const weeks = calendar.weeks.slice(-53);
  let maxContributions = 0;
  for (const week of weeks) {
    for (const day of week.contributionDays) {
      if (day.contributionCount > maxContributions) maxContributions = day.contributionCount;
    }
  }

  const now = new Date();
  const asciiGrid = Array.from({ length: 7 }, () => Array(weeks.length).fill(' '));

  weeks.forEach((week, weekIdx) => {
    const nonZero = [];
    const zero = [];
    const future = [];

    week.contributionDays.forEach(day => {
      const d = new Date(day.date);
      if (d > now) {
        future.push({ contributionCount: -1, date: day.date });
      } else if (day.contributionCount > 0) {
        nonZero.push(day);
      } else {
        zero.push(day);
      }
    });

    const sortedDays = [...nonZero, ...zero, ...future];
    const nonZeroCount = nonZero.length;

    for (let dayIdx = 0; dayIdx < Math.min(sortedDays.length, 7); dayIdx++) {
      const day = sortedDays[dayIdx];
      if (!day) continue;
      if (day.contributionCount === -1) {
        asciiGrid[dayIdx][weekIdx] = FutureBlock;
      } else {
        const normalized = maxContributions !== 0 ? day.contributionCount / maxContributions : 0;
        asciiGrid[dayIdx][weekIdx] = getBlock(normalized, dayIdx, nonZeroCount);
      }
    }
  });

  let output = HeaderTemplate + '\n\n';

  // Rows from top (6) to bottom (0)
  for (let i = 6; i >= 0; i--) {
    output += asciiGrid[i].join('') + '\n';
  }

  output += '\n';
  output += centerText(user.toUpperCase());
  output += centerText(String(year));

  return output;
}

function generateSvgCard(asciiArt) {
  const lines = asciiArt.split('\n');
  const lineHeight = 18;
  const width = 640;
  const height = 40 + lines.length * lineHeight;

  const escapedLines = lines.map(line => 
    line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  );

  let textElements = '';
  escapedLines.forEach((line, idx) => {
    const y = 50 + idx * lineHeight;
    // Highlight headers and username with champagne gold
    const isGold = idx < 12 || idx >= lines.length - 3;
    const fill = isGold ? '#D4AF37' : '#E2E8F0';
    const fontWeight = isGold ? 'bold' : 'normal';
    textElements += `    <text x="30" y="${y}" fill="${fill}" font-weight="${fontWeight}">${line}</text>\n`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Terminal Window Background -->
  <rect width="${width - 4}" height="${height - 4}" x="2" y="2" fill="#090A0F" rx="8" stroke="#D4AF37" stroke-width="1" stroke-opacity="0.5" filter="url(#goldGlow)" />
  <rect width="${width - 4}" height="${height - 4}" x="2" y="2" fill="#090A0F" rx="8" stroke="#1F2433" stroke-width="1" />

  <!-- Terminal Controls -->
  <circle cx="22" cy="22" r="5" fill="#EF4444" opacity="0.8" />
  <circle cx="38" cy="22" r="5" fill="#F59E0B" opacity="0.8" />
  <circle cx="54" cy="22" r="5" fill="#10B981" opacity="0.8" />
  <text x="${width / 2}" y="26" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, monospace" font-size="11" fill="#94A3B8" text-anchor="middle">github-skyline --art-only</text>

  <!-- ASCII Art Body -->
  <g font-family="Courier New, Consolas, Monaco, monospace" font-size="13" xml:space="preserve">
${textElements}  </g>
</svg>`;
}

async function main() {
  try {
    const calendar = await fetchContributionData(username);
    const year = new Date().getFullYear();
    const ascii = generateASCII(calendar, username, year);

    console.log('\n--- Generated ASCII Art ---');
    console.log(ascii);

    // Save standalone ascii text and svg card
    fs.writeFileSync('skyline-ascii.txt', ascii, 'utf8');
    const svg = generateSvgCard(ascii);
    fs.writeFileSync('skyline-ascii.svg', svg, 'utf8');
    console.log('✓ Successfully generated skyline-ascii.svg and skyline-ascii.txt');
  } catch (err) {
    console.error('Error generating ASCII skyline:', err);
    process.exit(1);
  }
}

main();
