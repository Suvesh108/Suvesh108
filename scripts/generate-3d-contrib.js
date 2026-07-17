import fs from 'node:fs';

const username = process.argv[2] || 'test-user';
const outputFile = process.argv[3] || 'isometric-profile.svg';
const isMock = process.argv[4] === 'mock';

const token = process.env.GITHUB_TOKEN;

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
            color
            weekday
          }
        }
      }
    }
  }
}`;

async function main() {
  try {
    let calendar;
    
    if (isMock || !token) {
      console.log("Generating with mock data...");
      calendar = {
        totalContributions: 1420,
        weeks: Array.from({ length: 53 }, (_, c) => ({
          contributionDays: Array.from({ length: 7 }, (_, r) => {
            // Generate random count: mostly 0, but some highs
            const rand = Math.random();
            let count = 0;
            if (rand > 0.8) count = Math.floor(Math.random() * 3) + 1; // 1-3
            else if (rand > 0.92) count = Math.floor(Math.random() * 4) + 4; // 4-7
            else if (rand > 0.98) count = Math.floor(Math.random() * 5) + 8; // 8-12
            
            return {
              contributionCount: count,
              date: new Date(Date.now() - (53 - c) * 7 * 24 * 3600 * 1000).toISOString(),
              weekday: r
            };
          })
        }))
      };
    } else {
      const to = new Date();
      const from = new Date(to.getTime() - 364 * 24 * 60 * 60 * 1000);
      
      console.log(`Fetching contributions for ${username}...`);
      
      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          "Authorization": `bearer ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "node-fetch"
        },
        body: JSON.stringify({
          query,
          variables: { username, from: from.toISOString(), to: to.toISOString() }
        })
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API HTTP error: ${response.status} ${response.statusText}`);
      }
      
      const json = await response.json();
      if (json.errors) {
        throw new Error(`GitHub GraphQL error: ${json.errors[0].message}`);
      }
      
      calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
      if (!calendar) {
        throw new Error(`User "${username}" not found or contributions unavailable.`);
      }
    }
    
    console.log(`Total contributions: ${calendar.totalContributions}`);
    
    const grid = Array.from({ length: 53 }, () => Array(7).fill(null));
    
    calendar.weeks.forEach((week, c) => {
      if (c >= 53) return;
      week.contributionDays.forEach(day => {
        const r = day.weekday;
        grid[c][r] = {
          count: day.contributionCount,
          date: day.date
        };
      });
    });
    
    const svgWidth = 900;
    const svgHeight = 650;
    const offsetX = 50;
    const offsetY = 120;
    
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" height="100%">
  <!-- Background -->
  <rect width="100%" height="100%" fill="#0d1117" rx="12" />
  
  <!-- Header Text -->
  <text x="40" y="45" font-family="Segoe UI, -apple-system, sans-serif" font-size="20" font-weight="bold" fill="#ac4d19">${username}'s 3D Contribution Skyline</text>
  <text x="40" y="70" font-family="Segoe UI, -apple-system, sans-serif" font-size="13" fill="#b3aca7">Last 365 days: ${calendar.totalContributions} contributions</text>
  
  <!-- Isometric Grid -->
  <g>`;
    
    function getCubeDetails(count) {
      if (count === 0) return { height: 4, color: "#181816" };
      if (count <= 3) return { height: 12, color: "#4d2715" };
      if (count <= 6) return { height: 22, color: "#733717" };
      if (count <= 9) return { height: 32, color: "#944418" };
      return { height: 44, color: "#ac4d19" };
    }
    
    for (let c = 0; c < 53; c++) {
      for (let r = 0; r < 7; r++) {
        const dayData = grid[c][r];
        const count = dayData ? dayData.count : 0;
        const { height, color } = getCubeDetails(count);
        
        const cx = offsetX + (c - r) * 14 + 100;
        const cy = offsetY + (c + r) * 8 + 50;
        
        svgContent += `
    <!-- Cube at week ${c}, day ${r} -->
    <polygon points="${cx},${cy - height} ${cx + 14},${cy + 8 - height} ${cx},${cy + 16 - height} ${cx - 14},${cy + 8 - height}" fill="${color}" />
    <!-- Left Face -->
    <polygon points="${cx - 14},${cy + 8 - height} ${cx},${cy + 16 - height} ${cx},${cy + 16} ${cx - 14},${cy + 8}" fill="${color}" />
    <polygon points="${cx - 14},${cy + 8 - height} ${cx},${cy + 16 - height} ${cx},${cy + 16} ${cx - 14},${cy + 8}" fill="#000000" opacity="0.15" />
    <!-- Right Face -->
    <polygon points="${cx},${cy + 16 - height} ${cx + 14},${cy + 8 - height} ${cx + 14},${cy + 8} ${cx},${cy + 16}" fill="${color}" />
    <polygon points="${cx},${cy + 16 - height} ${cx + 14},${cy + 8 - height} ${cx + 14},${cy + 8} ${cx},${cy + 16}" fill="#000000" opacity="0.30" />`;
      }
    }
    
    const legendX = 640;
    const legendY = 580;
    svgContent += `
  </g>
  
  <!-- Legend -->
  <g transform="translate(${legendX}, ${legendY})">
    <text x="0" y="15" font-family="Segoe UI, -apple-system, sans-serif" font-size="12" fill="#b3aca7">Less</text>
    
    <!-- Level 0 -->
    <g transform="translate(40, 5)">
      <polygon points="10,0 20,5 10,10 0,5" fill="#181816" />
      <polygon points="0,5 10,10 10,14 0,9" fill="#181816" />
      <polygon points="0,5 10,10 10,14 0,9" fill="#000000" opacity="0.15" />
      <polygon points="10,10 20,5 20,9 10,14" fill="#181816" />
      <polygon points="10,10 20,5 20,9 10,14" fill="#000000" opacity="0.30" />
    </g>
    
    <!-- Level 1 -->
    <g transform="translate(70, -3)">
      <polygon points="10,0 20,5 10,10 0,5" fill="#4d2715" />
      <polygon points="0,5 10,10 10,18 0,13" fill="#4d2715" />
      <polygon points="0,5 10,10 10,18 0,13" fill="#000000" opacity="0.15" />
      <polygon points="10,10 20,5 20,13 10,18" fill="#4d2715" />
      <polygon points="10,10 20,5 20,13 10,18" fill="#000000" opacity="0.30" />
    </g>

    <!-- Level 2 -->
    <g transform="translate(100, -13)">
      <polygon points="10,0 20,5 10,10 0,5" fill="#733717" />
      <polygon points="0,5 10,10 10,28 0,23" fill="#733717" />
      <polygon points="0,5 10,10 10,28 0,23" fill="#000000" opacity="0.15" />
      <polygon points="10,10 20,5 20,23 10,28" fill="#733717" />
      <polygon points="10,10 20,5 20,23 10,28" fill="#000000" opacity="0.30" />
    </g>

    <!-- Level 3 -->
    <g transform="translate(130, -23)">
      <polygon points="10,0 20,5 10,10 0,5" fill="#944418" />
      <polygon points="0,5 10,10 10,38 0,33" fill="#944418" />
      <polygon points="0,5 10,10 10,38 0,33" fill="#000000" opacity="0.15" />
      <polygon points="10,10 20,5 20,33 10,38" fill="#944418" />
      <polygon points="10,10 20,5 20,33 10,38" fill="#000000" opacity="0.30" />
    </g>

    <!-- Level 4 -->
    <g transform="translate(160, -35)">
      <polygon points="10,0 20,5 10,10 0,5" fill="#ac4d19" />
      <polygon points="0,5 10,10 10,50 0,45" fill="#ac4d19" />
      <polygon points="0,5 10,10 10,50 0,45" fill="#000000" opacity="0.15" />
      <polygon points="10,10 20,5 20,45 10,50" fill="#ac4d19" />
      <polygon points="10,10 20,5 20,45 10,50" fill="#000000" opacity="0.30" />
    </g>
    
    <text x="195" y="15" font-family="Segoe UI, -apple-system, sans-serif" font-size="12" fill="#b3aca7">More</text>
  </g>
  
  <!-- Credit -->
  <text x="40" y="605" font-family="Segoe UI, -apple-system, sans-serif" font-size="11" fill="#b3aca7">Generated via Custom GitHub Actions Skyline Workflow</text>
</svg>`;
    
    fs.writeFileSync(outputFile, svgContent, "utf8");
    console.log(`✓ Successfully generated ${outputFile}`);
    
  } catch (error) {
    console.error("Error generating graph:", error);
    process.exit(1);
  }
}

main();
