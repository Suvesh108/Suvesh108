import fs from 'node:fs';

const username = process.argv[2] || 'Suvesh108';
const isMock = process.argv[3] === 'mock';

const token = process.env.GITHUB_TOKEN;

const query = `
query($username: String!) {
  user(login: $username) {
    name
    login
    followers {
      totalCount
    }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
      nodes {
        name
        stargazerCount
        forkCount
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalRepositoryContributions
    }
  }
}`;

async function main() {
  try {
    let data;
    
    if (isMock || !token) {
      console.log("Generating stats with mock data...");
      data = {
        name: "Suvesh Kumar",
        login: username,
        followers: { totalCount: 15 },
        repositories: {
          nodes: [
            { name: "ai-quiz-generator", stargazerCount: 4, forkCount: 1, languages: { edges: [{ size: 50000, node: { name: "TypeScript", color: "#3178c6" } }, { size: 10000, node: { name: "HTML", color: "#e34c26" } }] } },
            { name: "Lumina-Search", stargazerCount: 6, forkCount: 2, languages: { edges: [{ size: 40000, node: { name: "Go", color: "#00ADD8" } }, { size: 5000, node: { name: "CSS", color: "#563d7c" } }] } },
            { name: "TaskFlow", stargazerCount: 3, forkCount: 0, languages: { edges: [{ size: 30000, node: { name: "Python", color: "#3572A5" } }] } },
            { name: "Portfolio", stargazerCount: 5, forkCount: 1, languages: { edges: [{ size: 45000, node: { name: "JavaScript", color: "#f1e05a" } }, { size: 15000, node: { name: "CSS", color: "#563d7c" } }] } }
          ]
        },
        contributionsCollection: {
          totalCommitContributions: 486,
          totalPullRequestContributions: 32,
          totalIssueContributions: 12,
          totalRepositoryContributions: 8
        }
      };
    } else {
      console.log(`Fetching stats for ${username}...`);
      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          "Authorization": `bearer ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "node-fetch"
        },
        body: JSON.stringify({
          query,
          variables: { username }
        })
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API HTTP error: ${response.status} ${response.statusText}`);
      }
      
      const json = await response.json();
      if (json.errors) {
        throw new Error(`GitHub GraphQL error: ${json.errors[0].message}`);
      }
      
      data = json?.data?.user;
      if (!data) {
        throw new Error(`User "${username}" not found or data unavailable.`);
      }
    }
    
    // Aggregations
    let totalStars = 0;
    let totalForks = 0;
    const languageSizes = {};
    
    data.repositories.nodes.forEach(repo => {
      totalStars += repo.stargazerCount;
      totalForks += repo.forkCount;
      
      repo.languages.edges.forEach(edge => {
        const name = edge.node.name;
        const size = edge.size;
        if (!languageSizes[name]) {
          languageSizes[name] = { size: 0, color: edge.node.color || '#cccccc' };
        }
        languageSizes[name].size += size;
      });
    });
    
    const totalSize = Object.values(languageSizes).reduce((a, b) => a + b.size, 0) || 1;
    const sortedLanguages = Object.entries(languageSizes)
      .map(([name, info]) => ({
        name,
        color: info.color,
        percentage: ((info.size / totalSize) * 100).toFixed(1)
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);
      
    const commits = data.contributionsCollection.totalCommitContributions;
    const prs = data.contributionsCollection.totalPullRequestContributions;
    const issues = data.contributionsCollection.totalIssueContributions;
    const followers = data.followers.totalCount;
    
    console.log(`Aggregated stats: Stars=${totalStars}, Commits=${commits}, PRs=${prs}, Followers=${followers}`);
    
    // SVG Glow Filter definition
    const svgGlowFilter = `
  <defs>
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>`;

    // 1. Generate Stats Card SVG
    const statsSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 220" width="100%" height="100%">
  ${svgGlowFilter}
  
  <!-- Outer glowing border and background (Tokyo Night Slate) -->
  <rect width="476" height="216" x="2" y="2" fill="#0f172a" rx="8" stroke="#06b6d4" stroke-width="1.5" filter="url(#neonGlow)" />
  <rect width="476" height="216" x="2" y="2" fill="#0f172a" rx="8" stroke="#0b0f19" stroke-width="1" />
  
  <text x="25" y="38" font-family="Segoe UI, -apple-system, sans-serif" font-size="14" font-weight="bold" fill="#06b6d4" letter-spacing="1">📊 GLOBAL METRICS</text>
  
  <!-- Row 1: Stars & Commits -->
  <g transform="translate(25, 65)">
    <text x="0" y="15" font-family="Segoe UI, -apple-system, sans-serif" font-size="12" fill="#cbd5e1">⭐ Total Stars:</text>
    <text x="140" y="15" font-family="Segoe UI, -apple-system, sans-serif" font-size="13" font-weight="bold" fill="#ffffff">${totalStars}</text>
    
    <text x="0" y="45" font-family="Segoe UI, -apple-system, sans-serif" font-size="12" fill="#cbd5e1">📝 Commits (Year):</text>
    <text x="140" y="45" font-family="Segoe UI, -apple-system, sans-serif" font-size="13" font-weight="bold" fill="#ffffff">${commits}</text>
  </g>
  
  <!-- Row 2: Forks & Pull Requests -->
  <g transform="translate(240, 65)">
    <text x="0" y="15" font-family="Segoe UI, -apple-system, sans-serif" font-size="12" fill="#cbd5e1">🍴 Total Forks:</text>
    <text x="140" y="15" font-family="Segoe UI, -apple-system, sans-serif" font-size="13" font-weight="bold" fill="#ffffff">${totalForks}</text>
    
    <text x="0" y="45" font-family="Segoe UI, -apple-system, sans-serif" font-size="12" fill="#cbd5e1">🔀 Pull Requests:</text>
    <text x="140" y="45" font-family="Segoe UI, -apple-system, sans-serif" font-size="13" font-weight="bold" fill="#ffffff">${prs}</text>
  </g>
  
  <!-- Row 3: Issues & Followers -->
  <g transform="translate(25, 145)">
    <text x="0" y="15" font-family="Segoe UI, -apple-system, sans-serif" font-size="12" fill="#cbd5e1">🪲 Total Issues:</text>
    <text x="140" y="15" font-family="Segoe UI, -apple-system, sans-serif" font-size="13" font-weight="bold" fill="#ffffff">${issues}</text>
    
    <text x="0" y="45" font-family="Segoe UI, -apple-system, sans-serif" font-size="12" fill="#cbd5e1">👥 Followers:</text>
    <text x="140" y="45" font-family="Segoe UI, -apple-system, sans-serif" font-size="13" font-weight="bold" fill="#ffffff">${followers}</text>
  </g>
</svg>`;

    // 2. Generate Top Languages SVG
    let langRows = '';
    sortedLanguages.forEach((lang, i) => {
      const y = 65 + i * 28;
      const barWidth = Math.round(Number(lang.percentage) * 2.0); // Scale to fit max width 200px
      langRows += `
  <g transform="translate(25, ${y})">
    <text x="0" y="10" font-family="Segoe UI, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#cbd5e1">${lang.name}</text>
    <text x="170" y="10" font-family="Segoe UI, -apple-system, sans-serif" font-size="11" fill="#cbd5e1" text-anchor="end">${lang.percentage}%</text>
    
    <!-- Progress Bar -->
    <rect x="190" y="1" width="220" height="8" fill="#0b0f19" rx="4" />
    <rect x="190" y="1" width="${barWidth}" height="8" fill="${lang.color}" rx="4" filter="url(#neonGlow)" />
    <rect x="190" y="1" width="${barWidth}" height="8" fill="${lang.color}" rx="4" />
  </g>`;
    });

    const langSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 220" width="100%" height="100%">
  ${svgGlowFilter}
  
  <!-- Outer glowing border and background -->
  <rect width="476" height="216" x="2" y="2" fill="#0f172a" rx="8" stroke="#06b6d4" stroke-width="1.5" filter="url(#neonGlow)" />
  <rect width="476" height="216" x="2" y="2" fill="#0f172a" rx="8" stroke="#0b0f19" stroke-width="1" />
  
  <text x="25" y="38" font-family="Segoe UI, -apple-system, sans-serif" font-size="14" font-weight="bold" fill="#06b6d4" letter-spacing="1">🎨 TOP LANGUAGES</text>
  
  ${langRows}
</svg>`;

    // 3. Generate Achievements SVG (Trophy Cabinet replacement)
    const badges = [];
    if (commits > 100) badges.push({ emoji: "🚀", title: "Code Specialist", desc: `${commits}+ Commits` });
    else badges.push({ emoji: "🌱", title: "Rising coder", desc: "Building core skills" });
    
    if (totalStars > 0) badges.push({ emoji: "⭐", title: "Star Collector", desc: `${totalStars} Stars Earned` });
    else badges.push({ emoji: "🛠️", title: "Active Builder", desc: "Shipping projects" });
    
    if (followers > 5) badges.push({ emoji: "🤝", title: "Community Pillar", desc: `${followers} Followers` });
    else badges.push({ emoji: "📣", title: "Networker", desc: "Growing connection" });
    
    if (data.repositories.nodes.length > 5) badges.push({ emoji: "📦", title: "Library Manager", desc: `${data.repositories.nodes.length} Repositories` });
    else badges.push({ emoji: "💻", title: "Creator", desc: "Deploying code" });

    let badgeBlocks = '';
    badges.forEach((badge, i) => {
      const x = 20 + i * 238;
      badgeBlocks += `
    <!-- Badge ${i + 1} -->
    <g transform="translate(${x}, 45)">
      <!-- Pill Container with neon glow border -->
      <rect width="222" height="60" fill="#0b0f19" rx="8" stroke="#06b6d4" stroke-width="1" filter="url(#neonGlow)" />
      <rect width="222" height="60" fill="#0b0f19" rx="8" stroke="#0f172a" stroke-width="1" />
      <text x="15" y="38" font-size="24">${badge.emoji}</text>
      <text x="55" y="25" font-family="Segoe UI, -apple-system, sans-serif" font-size="12" font-weight="bold" fill="#06b6d4">${badge.title}</text>
      <text x="55" y="43" font-family="Segoe UI, -apple-system, sans-serif" font-size="11" fill="#cbd5e1">${badge.desc}</text>
    </g>`;
    });

    const achievementsSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 130" width="100%" height="100%">
  ${svgGlowFilter}
  
  <!-- Outer glowing border and background -->
  <rect width="976" height="126" x="2" y="2" fill="#0f172a" rx="8" stroke="#06b6d4" stroke-width="1.5" filter="url(#neonGlow)" />
  <rect width="976" height="126" x="2" y="2" fill="#0f172a" rx="8" stroke="#0b0f19" stroke-width="1" />
  
  <text x="20" y="25" font-family="Segoe UI, -apple-system, sans-serif" font-size="13" font-weight="bold" fill="#06b6d4" letter-spacing="1">🏆 TROPHY CABINET &amp; ACHIEVEMENTS</text>
  
  ${badgeBlocks}
</svg>`;

    fs.writeFileSync('github-stats.svg', statsSvg, 'utf8');
    fs.writeFileSync('top-languages.svg', langSvg, 'utf8');
    fs.writeFileSync('github-achievements.svg', achievementsSvg, 'utf8');
    
    console.log("✓ Successfully generated Tokyo Night stats, languages, and achievements SVGs!");
    
  } catch (error) {
    console.error("Error generating stats:", error);
    process.exit(1);
  }
}

main();
