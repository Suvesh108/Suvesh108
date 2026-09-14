import fs from 'node:fs';
import path from 'node:path';

export function theme3dSvg(svgPath) {
  if (!fs.existsSync(svgPath)) {
    throw new Error(`File not found: ${svgPath}`);
  }

  let svg = fs.readFileSync(svgPath, 'utf8');

  // Modern luxury palette (Obsidian & Champagne Gold)
  const PALETTE = {
    bg: '#090A0F',
    cardBorder: '#1F2433',
    gold: '#D4AF37',
    goldLight: '#F3E5AB',
    goldGlow: 'rgba(212, 175, 55, 0.45)',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    gridLine: '#1E2433',

    // Cube level gradients
    c0_top: '#131722',
    c0_left: '#0E1119',
    c0_right: '#0A0C13',
    c0_stroke: '#1A202E',

    c1_top: '#59441B',
    c1_left: '#443414',
    c1_right: '#30250D',
    c1_stroke: '#6D5321',

    c2_top: '#8E6D22',
    c2_left: '#72571A',
    c2_right: '#574213',
    c2_stroke: '#AA8329',

    c3_top: '#C99E2A',
    c3_left: '#A37F20',
    c3_right: '#7E6217',
    c3_stroke: '#E2B330',

    c4_top: '#F9DF7B',
    c4_left: '#D4AF37',
    c4_right: '#AD8E2A',
    c4_stroke: '#FFF1AA',

    // Language colors curated to match luxury theme
    lang_ts: '#D4AF37',
    lang_py: '#38BDF8',
    lang_js: '#F3E5AB',
    lang_go: '#34D399',
    lang_rs: '#FB923C'
  };

  const newStyles = `
* {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Roboto, Helvetica, Arial, sans-serif;
}
.fill-fg { fill: ${PALETTE.textPrimary}; }
.stroke-fg { stroke: ${PALETTE.textPrimary}; }
.fill-bg { fill: ${PALETTE.bg}; }
.stroke-bg { stroke: ${PALETTE.bg}; }
.fill-strong { fill: ${PALETTE.gold}; }
.fill-weak { fill: ${PALETTE.textMuted}; font-size: 11px; }
.stroke-weak { stroke: ${PALETTE.gridLine} !important; }

/* Radar Chart */
.radar {
  stroke-width: 2.5px;
  stroke: ${PALETTE.gold};
  fill: ${PALETTE.gold};
  fill-opacity: 0.32;
  filter: drop-shadow(0 0 10px ${PALETTE.goldGlow});
}
.axis text {
  fill: ${PALETTE.textPrimary} !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px;
}

/* 3D Isometric Matrix Cubes */
rect.cont-top-0 { fill: ${PALETTE.c0_top}; stroke: ${PALETTE.c0_stroke}; stroke-width: 0.5px; }
rect.cont-left-0 { fill: ${PALETTE.c0_left}; stroke: ${PALETTE.c0_stroke}; stroke-width: 0.5px; }
rect.cont-right-0 { fill: ${PALETTE.c0_right}; stroke: ${PALETTE.c0_stroke}; stroke-width: 0.5px; }

rect.cont-top-1 { fill: ${PALETTE.c1_top}; stroke: ${PALETTE.c1_stroke}; stroke-width: 0.5px; }
rect.cont-left-1 { fill: ${PALETTE.c1_left}; stroke: ${PALETTE.c1_stroke}; stroke-width: 0.5px; }
rect.cont-right-1 { fill: ${PALETTE.c1_right}; stroke: ${PALETTE.c1_stroke}; stroke-width: 0.5px; }

rect.cont-top-2 { fill: ${PALETTE.c2_top}; stroke: ${PALETTE.c2_stroke}; stroke-width: 0.5px; }
rect.cont-left-2 { fill: ${PALETTE.c2_left}; stroke: ${PALETTE.c2_stroke}; stroke-width: 0.5px; }
rect.cont-right-2 { fill: ${PALETTE.c2_right}; stroke: ${PALETTE.c2_stroke}; stroke-width: 0.5px; }

rect.cont-top-3 { fill: ${PALETTE.c3_top}; stroke: ${PALETTE.c3_stroke}; stroke-width: 0.5px; }
rect.cont-left-3 { fill: ${PALETTE.c3_left}; stroke: ${PALETTE.c3_stroke}; stroke-width: 0.5px; }
rect.cont-right-3 { fill: ${PALETTE.c3_right}; stroke: ${PALETTE.c3_stroke}; stroke-width: 0.5px; }

rect.cont-top-4 { fill: ${PALETTE.c4_top}; stroke: ${PALETTE.c4_stroke}; stroke-width: 0.5px; filter: drop-shadow(0 0 6px ${PALETTE.goldGlow}); }
rect.cont-left-4 { fill: ${PALETTE.c4_left}; stroke: ${PALETTE.c4_stroke}; stroke-width: 0.5px; }
rect.cont-right-4 { fill: ${PALETTE.c4_right}; stroke: ${PALETTE.c4_stroke}; stroke-width: 0.5px; }
`;

  // Replace existing <style>...</style>
  svg = svg.replace(/<style>[\s\S]*?<\/style>/, `<style>${newStyles}</style>`);

  // Ensure luxury defs and card wrapper are present
  if (!svg.includes('id="goldGlow"')) {
    const luxuryDefsAndCard = `
  <defs>
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <radialGradient id="cardAmbient" cx="50%" cy="0%" r="70%">
      <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.07" />
      <stop offset="100%" stop-color="#090A0F" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Luxury Card Shell -->
  <rect x="2" y="2" width="1276" height="846" rx="16" fill="${PALETTE.bg}" stroke="${PALETTE.cardBorder}" stroke-width="1.5" />
  <rect x="2" y="2" width="1276" height="846" rx="16" fill="none" stroke="${PALETTE.gold}" stroke-width="1" stroke-opacity="0.35" filter="url(#goldGlow)" />
  <rect x="2" y="2" width="1276" height="846" rx="16" fill="url(#cardAmbient)" />

  <!-- Modern Card Header -->
  <g transform="translate(48, 48)">
    <rect x="0" y="0" width="4" height="20" rx="2" fill="${PALETTE.gold}" />
    <text x="16" y="15" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="14" font-weight="700" fill="${PALETTE.gold}" letter-spacing="2">3D CONTRIBUTIONS SKYLINE &amp; VELOCITY</text>
  </g>
`;
    svg = svg.replace(/<rect x="0" y="0" width="1280" height="850" class="fill-bg"><\/rect>/, luxuryDefsAndCard);
  }

  // Modernize language colors
  svg = svg.replace(/fill="#3178c6"/g, `fill="${PALETTE.lang_ts}"`);
  svg = svg.replace(/style="fill: #3178c6;"/g, `style="fill: ${PALETTE.lang_ts};"`);

  svg = svg.replace(/fill="#3572A5"/g, `fill="${PALETTE.lang_py}"`);
  svg = svg.replace(/style="fill: #3572A5;"/g, `style="fill: ${PALETTE.lang_py};"`);

  svg = svg.replace(/fill="#f1e05a"/g, `fill="${PALETTE.lang_js}"`);
  svg = svg.replace(/style="fill: #f1e05a;"/g, `style="fill: ${PALETTE.lang_js};"`);

  svg = svg.replace(/fill="#00ADD8"/g, `fill="${PALETTE.lang_go}"`);
  svg = svg.replace(/style="fill: #00ADD8;"/g, `style="fill: ${PALETTE.lang_go};"`);

  svg = svg.replace(/fill="#dea584"/g, `fill="${PALETTE.lang_rs}"`);
  svg = svg.replace(/style="fill: #dea584;"/g, `style="fill: ${PALETTE.lang_rs};"`);

  // Donut stroke separation
  svg = svg.replace(/class="stroke-bg" stroke-width="2px"/g, `stroke="${PALETTE.bg}" stroke-width="3px"`);

  // Make language legend rects rounded
  svg = svg.replace(/<rect x="0" y="(\d+(\.\d+)?)" width="21\.666666666666668" height="21\.666666666666668"/g, '<rect x="0" y="$1" width="18" height="18" rx="4"');

  // Modern font size for language names
  svg = svg.replace(/font-size="21\.666666666666668px">/g, 'font-size="16px" font-weight="500">');

  // Accent the icons in stats footer with gold
  svg = svg.replace(/(<g transform="translate\(608, 802\), scale\(2\)">[\s\S]*?<path [^>]*?)(class="fill-fg")(>)/, `$1fill="${PALETTE.gold}"$3`);
  svg = svg.replace(/(<g transform="translate\(736, 802\), scale\(2\)">[\s\S]*?<path [^>]*?)(class="fill-fg")(>)/, `$1fill="${PALETTE.gold}"$3`);

  // Label styling in footer: "contributions" in muted slate
  svg = svg.replace('<text style="font-size: 24px;" x="394" y="830" text-anchor="start" class="fill-fg">contributions</text>',
    `<text style="font-size: 20px; font-weight: 500;" x="394" y="828" text-anchor="start" fill="${PALETTE.textSecondary}">contributions</text>`);

  // Date range styling at top right
  svg = svg.replace(/<text style="font-size: 16px;" x="1260" y="20" dominant-baseline="hanging" text-anchor="end" class="fill-weak">([^<]+)<\/text>/,
    `<text style="font-size: 13px; font-weight: 500;" x="1232" y="52" dominant-baseline="hanging" text-anchor="end" fill="${PALETTE.textMuted}">$1</text>`);

  fs.writeFileSync(svgPath, svg, 'utf8');
  console.log(`✓ Applied 2026 Minimalist Luxury theme to ${svgPath}`);
}

if (process.argv[1] && process.argv[1].endsWith('theme-3d-svg.js')) {
  const target = process.argv[2] || path.join(process.cwd(), 'profile-3d-contrib', 'profile-night-view.svg');
  theme3dSvg(target);
}
