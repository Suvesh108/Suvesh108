<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Contribution Skyline</title>
<style>
  :root{color-scheme:light dark;--bg:#fff;--fg:#171717;--muted:#737373;--border:#e5e5e5;--accent:#196127}
  @media(prefers-color-scheme:dark){:root{--bg:#0d1117;--fg:#e6edf3;--muted:#8b949e;--border:#30363d;--accent:#39d353}}
  *{box-sizing:border-box}
  body{margin:0;padding:24px;background:var(--bg);color:var(--fg);font:14px/1.45 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
  .skyline{width:100%;max-width:1100px;margin:auto;border:1px solid var(--border);border-radius:14px;padding:18px;background:var(--bg)}
  .head{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:12px}
  .heading{font-size:15px;margin:0;font-weight:400}.heading strong{font-weight:650;font-variant-numeric:tabular-nums}
  .toggle{display:flex;gap:3px;padding:3px;border:1px solid var(--border);border-radius:7px}
  .toggle button{width:34px;height:30px;border:0;border-radius:5px;background:transparent;color:var(--muted);cursor:pointer;display:grid;place-items:center}
  .toggle button[aria-pressed=true]{background:var(--fg);color:var(--bg)}
  .toggle svg{width:15px;height:15px}
  .panel{border:1px solid var(--border);border-radius:10px;overflow:hidden}
  .stage-wrap{position:relative;padding:14px 14px 0}
  .stage{position:relative;width:100%;min-height:180px;overflow:hidden}
  canvas{position:absolute;inset:0;display:block;outline:0;max-width:none;touch-action:pan-y}
  .tooltip{position:absolute;z-index:4;top:10px;left:10px;padding:7px 10px;border-radius:6px;background:var(--fg);color:var(--bg);font-size:12px;white-space:nowrap;pointer-events:none;opacity:0;transform:translate(-50%,-100%);transition:opacity .12s;box-shadow:0 4px 15px #0002}
  .tooltip:after{content:"";position:absolute;top:100%;left:var(--arrow,50%);margin-left:-5px;border:5px solid transparent;border-top-color:var(--fg);border-bottom:0}
  .stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;padding:16px 16px 8px}
  .stat-label{color:var(--muted);font-size:12px}.stat-value{font-size:26px;font-weight:650;letter-spacing:-.03em;line-height:1.15;margin-top:3px;font-variant-numeric:tabular-nums}.stat-sub{font-size:11px;color:var(--muted);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .footer{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;padding:13px 14px;color:var(--muted);font-size:12px}
  .legend{display:flex;align-items:center;gap:5px}.swatch{width:12px;height:12px;padding:0;border:0;border-radius:2px;cursor:pointer;box-shadow:inset 0 0 0 1px #7f7f7f20}.swatch[aria-pressed=true]{outline:2px solid var(--fg);outline-offset:2px}
  .corner{position:absolute;z-index:2;pointer-events:none;display:flex;flex-direction:column;gap:20px;transition:opacity .4s}
  .corner.top{right:8px;top:8px;align-items:flex-end;text-align:right}.corner.bottom{left:8px;bottom:8px}
  .corner .stat-value{font-size:clamp(28px,5vw,48px)}.corner .stat-sub{max-width:180px}
  .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
  @media(max-width:650px){body{padding:10px}.skyline{padding:12px}.stats{grid-template-columns:repeat(2,minmax(0,1fr))}.corner .stat-value{font-size:25px}.corner .stat-sub{max-width:120px}}
  @media(prefers-reduced-motion:reduce){*,*:before,*:after{scroll-behavior:auto!important;transition:none!important}}
</style>
</head>
<body>
<section class="skyline" id="contribution-skyline">
  <header class="head">
    <h3 class="heading" id="skyline-title"></h3>
    <div class="toggle" role="group" aria-label="Chart view" id="view-toggle">
      <button type="button" data-view="2d" aria-label="Flat heat map" title="Flat heat map"><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" fill="currentColor"/><rect x="9" y="1.5" width="5.5" height="5.5" rx="1" fill="currentColor"/><rect x="1.5" y="9" width="5.5" height="5.5" rx="1" fill="currentColor"/><rect x="9" y="9" width="5.5" height="5.5" rx="1" fill="currentColor"/></svg></button>
      <button type="button" data-view="3d" aria-label="3D skyline" title="3D skyline"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.2 14.2 4.6v6.8L8 14.8 1.8 11.4V4.6Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M1.8 4.6 8 8l6.2-3.4M8 8v6.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg></button>
    </div>
  </header>
  <div class="panel">
    <div class="stage-wrap">
      <div class="stage" id="stage">
        <canvas id="skyline-canvas" tabindex="0" role="img" aria-label="Contribution activity chart. Use arrow keys to explore individual days."></canvas>
        <div class="corner top" id="corner-top"></div><div class="corner bottom" id="corner-bottom"></div>
        <div class="tooltip" id="tooltip"></div>
      </div>
    </div>
    <div class="stats" id="stats"></div>
    <div class="footer"><span id="hint">Hover a day for details · arrow keys to explore</span><div class="legend" id="legend"><span>Less</span><span>More</span></div></div>
  </div>
  <p class="sr-only" aria-live="polite" id="announce"></p>
</section>
<script>
/* Standalone Contribution Skyline — no React, dependencies, build step, or external assets.
   Supply window.CONTRIBUTION_DATA = [{date:"YYYY-MM-DD",count:3}, ...] before this script
   to use real activity. Optional settings are in the CONFIG object below. */
(() => {
"use strict";
const CONFIG = {
  data: window.CONTRIBUTION_DATA || null,
  endDate: null,
  defaultView: "3d",
  palette: "github",
  unit: "contribution",
  unitPlural: "contributions",
  heightScale: 1,
  duration: 1300,
  weekStart: 0,
  orbit: true,
  showStats: true,
  showLegend: true,
  showToggle: true,
  seed: 7,
  title: null
};
const DAY=86400000, $=id=>document.getElementById(id);
const palettes={
 github:{light:["#c6e48b","#7bc96f","#239a3b","#196127"],dark:["#0e4429","#006d32","#26a641","#39d353"]},
 halloween:{light:["#ffee4a","#ffc501","#fe9600","#b33c00"],dark:["#631c03","#bd561d","#fa7a18","#fddf68"]},
 ocean:{light:["#b8e3f5","#6ec3eb","#2a8fd1","#0b4f8a"],dark:["#0c2d4a","#12508a","#2a88d8","#7cc7ff"]},
 ember:{light:["#fde2c4","#fbad6e","#f06b3a","#b3261e"],dark:["#4a1a10","#8f2f16","#e0572a","#ffa46b"]},
 grape:{light:["#e4d4fb","#b794f4","#805ad5","#44337a"],dark:["#2d1f4f","#553c9a","#8b5cf6","#c4b5fd"]},
 mono:{light:["#d4d4d4","#a3a3a3","#525252","#171717"],dark:["#333333","#5c5c5c","#a3a3a3","#fafafa"]}
};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>{t=clamp(t,0,1);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
const easeOut=t=>1-Math.pow(1-clamp(t,0,1),3);
const key=ms=>new Date(ms).toISOString().slice(0,10);
const dayMs=v=>{if(typeof v==="number")return Math.floor(v/DAY)*DAY;if(typeof v==="string"){const m=/^(\d{4})-(\d{2})-(\d{2})/.exec(v);if(m)return Date.UTC(+m[1],+m[2]-1,+m[3]);v=new Date(v);}return Date.UTC(v.getFullYear(),v.getMonth(),v.getDate());};
function rng(seed){let a=seed>>>0;return()=>{a=(a+0x6d2b79f5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
function generate(end,seed=7,days=371){const r=rng(seed),bursts=Array.from({length:4},()=>({at:r(),width:.035+r()*.07,gain:.6+r()*1.1})),out=[];let mood=.5;for(let i=0;i<days;i++){const ms=end-(days-1-i)*DAY,x=i/Math.max(1,days-1),dow=new Date(ms).getUTCDay(),weekend=dow===0||dow===6;let heat=.2;for(const b of bursts)heat+=b.gain*Math.exp(-((x-b.at)**2)/(2*b.width**2));mood=mood*.85+r()*.15;heat*=.55+mood*.9;const p=Math.min(.94,(weekend?.22:.5)+heat*.4);let count=0;if(r()<p)count=1+Math.floor(-Math.log(1-r())*(1.2+heat*7)*(weekend?.5:1));if(r()<.01)count+=18+Math.floor(r()*24);out.push({date:key(ms),count});}return out;}
const levelOf=(c,b)=>c<=0?0:b<=0?4:1+Math.min(3,Math.floor(c/b*4));
function buildGrid(data,end,weekStart=0){const counts=new Map();for(const d of data||[]){if(!d||typeof d.date!=="string")continue;const ms=dayMs(d.date),c=Number(d.count);if(!Number.isFinite(ms)||!(c>0)||!Number.isFinite(c))continue;const k=key(ms);counts.set(k,(counts.get(k)||0)+c);}let start=end-364*DAY;start-=((new Date(start).getUTCDay()-weekStart+7)%7)*DAY;const cells=[];for(let ms=start,i=0;ms<end;ms+=DAY,i++)cells.push({date:key(ms),count:counts.get(key(ms))||0,level:0,week:Math.floor(i/7),day:i%7});const nz=cells.map(c=>c.count).filter(c=>c>0).sort((a,b)=>a-b),busy=nz.length?nz[Math.floor(.95*(nz.length-1))]:0;cells.forEach(c=>c.level=levelOf(c.count,busy));return{cells,weeks:cells.length?cells.at(-1).week+1:0,max:nz.length?nz.at(-1):0};}
function statsOf(cells){let total=0,best=0,bestDate=null,run=0,runStart=null,longest={days:0,start:null,end:null};for(const c of cells){total+=c.count;if(c.count>best){best=c.count;bestDate=c.date;}if(c.count>0){if(!run)runStart=c.date;run++;if(run>longest.days)longest={days:run,start:runStart,end:c.date};}else run=0;}let j=cells.length-1;if(j>=0&&!cells[j].count)j--;const endAt=j;while(j>=0&&cells[j].count>0)j--;const days=endAt-j;const current=days>0?{days,start:cells[j+1].date,end:cells[endAt].date}:{days:0,start:null,end:null};return{total,first:cells[0]?.date||null,last:cells.at(-1)?.date||null,busiest:{count:best,date:bestDate},longest,current};}
function monthLabels(cells,weeks){const f=new Intl.DateTimeFormat(undefined,{month:"short",timeZone:"UTC"}),out=[];let prev=-1;for(let w=0;w<weeks;w++){const c=cells[w*7];if(!c)break;const m=+c.date.slice(5,7);if(m!==prev)out.push({week:w,label:f.format(dayMs(c.date))});prev=m;}if(out.length>1&&out[1].week-out[0].week<3)out.shift();return out;}
const barHeight=(c,m)=>c>0&&m>0?.4+Math.pow(c/m,.85)*7.2*CONFIG.heightScale:.2;
const camera=e=>{const yaw=Math.PI/4*e, el=lerp(Math.PI/2,34*Math.PI/180,e);return{cs:Math.cos(yaw),sn:Math.sin(yaw),se:Math.sin(el),ce:Math.cos(el)};};
const project=(c,x,y,z)=>[x*c.cs-y*c.sn,(x*c.sn+y*c.cs)*c.se-z*c.ce];
const color=hex=>{const n=parseInt(hex.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];};
const rgb=v=>`rgb(${v.map(x=>Math.round(x)).join(",")})`;
const mix=(a,b,t)=>a.map((v,i)=>lerp(v,b[i],t));
const nf=new Intl.NumberFormat(),df=new Intl.DateTimeFormat(undefined,{month:"short",day:"numeric",timeZone:"UTC"}),dfy=new Intl.DateTimeFormat(undefined,{month:"short",day:"numeric",year:"numeric",timeZone:"UTC"}),dfl=new Intl.DateTimeFormat(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric",timeZone:"UTC"});
const noun=n=>n===1?CONFIG.unit:CONFIG.unitPlural;
const range=(a,b,year=false)=>a&&b?`${(year?dfy:df).format(dayMs(a))} — ${(year?dfy:df).format(dayMs(b))}`:"—";
const endFromData=()=>{if(CONFIG.endDate)return dayMs(CONFIG.endDate);const dates=(CONFIG.data||[]).map(d=>dayMs(d.date)).filter(Number.isFinite);return dates.length?Math.max(...dates):dayMs(new Date());};
let model=buildGrid(CONFIG.data||generate(endFromData(),CONFIG.seed),endFromData(),CONFIG.weekStart),stats=statsOf(model.cells),months=monthLabels(model.cells,model.weeks);
let view=CONFIG.defaultView,legendLevel=-1,active=-1,pinned=-1,hovered=-1,yaw=0,elev=0,yawGoal=0,elevGoal=0,t=view==="3d"?1:0,target=t,raf=0,drag=null,W=0,H=0,dpr=1,geometry=[],palette=[],dark=matchMedia("(prefers-color-scheme: dark)").matches;
const canvas=$("skyline-canvas"),ctx=canvas.getContext("2d"),stage=$("stage"),tip=$("tooltip");
function getPalette(){const p=palettes[CONFIG.palette]||palettes.github;return p[dark?"dark":"light"].map(color);}
function theme(){dark=matchMedia("(prefers-color-scheme: dark)").matches;palette=getPalette();$("legend").querySelectorAll(".swatch").forEach((b,i)=>b.style.background=i===0?(dark?"#24292f":"#ebedf0"):rgb(palette[i-1]));}
function cellDescription(i){const c=model.cells[i];return c?`${c.count?nf.format(c.count)+" "+noun(c.count):"No "+CONFIG.unitPlural} on ${dfl.format(dayMs(c.date))}`:"";}
function statMarkup(b){return `<div><div class="stat-label">${b.label}</div><div class="stat-value">${b.value}</div><div class="stat-sub">${b.unit} · ${b.sub}</div></div>`;}
function statBlocks(){return[
  {label:"1 year total",value:nf.format(stats.total),unit:noun(stats.total),sub:range(stats.first,stats.last,true)},
  {label:"Busiest day",value:nf.format(stats.busiest.count),unit:noun(stats.busiest.count),sub:stats.busiest.date?df.format(dayMs(stats.busiest.date)):"—"},
  {label:"Longest streak",value:nf.format(stats.longest.days),unit:stats.longest.days===1?"day":"days",sub:range(stats.longest.start,stats.longest.end)},
  {label:"Current streak",value:nf.format(stats.current.days),unit:stats.current.days===1?"day":"days",sub:range(stats.current.start,stats.current.end)}
];}
function renderChrome(){const blocks=statBlocks();$("skyline-title").innerHTML=CONFIG.title||`<strong>${nf.format(stats.total)}</strong> ${noun(stats.total)} in the last year`;$("stats").innerHTML=CONFIG.showStats?blocks.map(statMarkup).join(""):"";$("stats").style.display=CONFIG.showStats&&view==="2d"?"grid":"none";$("corner-top").innerHTML=blocks.slice(0,2).map(statMarkup).join("");$("corner-bottom").innerHTML=blocks.slice(2).map(statMarkup).join("");$("corner-top").style.display=$("corner-bottom").style.display=CONFIG.showStats&&view==="3d"?"flex":"none";$("view-toggle").style.display=CONFIG.showToggle?"flex":"none";$("legend").style.display=CONFIG.showLegend?"flex":"none";$("hint").textContent=view==="3d"&&CONFIG.orbit?"Drag to orbit · double-click to reset":"Hover a day for details · arrow keys to explore";document.querySelectorAll("[data-view]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.view===view)));}
function resize(){W=Math.round(stage.clientWidth);if(!W)return;dpr=Math.min(2,devicePixelRatio||1);const e=view==="3d"?1:0, cam=camera(e), w=lerp(.78,.9,e), off=(1-w)/2;let minx=Infinity,maxx=-Infinity,miny=Infinity,maxy=-Infinity;const add=(x,y,z)=>{const p=project(cam,x,y,z);minx=Math.min(minx,p[0]);maxx=Math.max(maxx,p[0]);miny=Math.min(miny,p[1]);maxy=Math.max(maxy,p[1]);};model.cells.forEach(c=>{const z=e?barHeight(c.count,model.max):0;add(c.week+off,c.day+off,z);add(c.week+off+w,c.day+off,z);add(c.week+off,c.day+off+w,0);add(c.week+off+w,c.day+off+w,0);});add(0,7+1.5*e,0);add(model.weeks,7+1.5*e,0);const natural=(maxy-miny)/(maxx-minx)*(W-40)+40;H=e?Math.max(Math.min(natural,W*.72,620),Math.min(natural,240)):Math.max(100,((maxy-miny)/(maxx-minx))*(W-34)+28);stage.style.height=H+"px";canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);canvas.style.width=W+"px";canvas.style.height=H+"px";draw();}
function draw(){if(!W)return;const e=ease(t), cam=camera(e), w=lerp(.78,.9,e), off=(1-w)/2, pad=lerp(2,20,e), gutter=W<520?0:30;const heights=model.cells.map(c=>barHeight(c.count,model.max)), zs=model.cells.map(c=>{const delay=(model.weeks>1?c.week/(model.weeks-1):0)*.36+(c.day/6)*.06;return easeOut((t-delay)/.58)*heights[model.cells.indexOf(c)];});let minx=Infinity,maxx=-Infinity,miny=Infinity,maxy=-Infinity;const add=(x,y,z)=>{const p=project(cam,x,y,z);minx=Math.min(minx,p[0]);maxx=Math.max(maxx,p[0]);miny=Math.min(miny,p[1]);maxy=Math.max(maxy,p[1]);};model.cells.forEach((c,i)=>{const z=zs[i];add(c.week+off,c.day+off,z);add(c.week+off+w,c.day+off,z);add(c.week+off,c.day+off+w,0);add(c.week+off+w,c.day+off+w,0);});add(0,7+1.5*e,0);add(model.weeks,7+1.5*e,0);const bw=maxx-minx,bh=maxy-miny,s=Math.min((W-pad-gutter-pad)/bw,(H-pad*2)/bh),ox=pad+gutter+(W-pad-gutter-pad-bw*s)/2-minx*s,oy=pad+(H-pad*2-bh*s)/2-miny*s;const px=(x,y)=>ox+(x*cam.cs-y*cam.sn)*s, py=(x,y,z)=>oy+((x*cam.sn+y*cam.cs)*cam.se-z*cam.ce)*s;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);const bg=getComputedStyle(document.documentElement), fg=color(dark?"#e6edf3":"#171717"), empty=color(dark?"#24292f":"#ebedf0"), cols=[empty,...palette];const order=model.cells.map((_,i)=>i).sort((a,b)=>(model.cells[a].week+.5)*cam.sn+(model.cells[a].day+.5)*cam.cs-((model.cells[b].week+.5)*cam.sn+(model.cells[b].day+.5)*cam.cs));geometry=[];for(const i of order){const c=model.cells[i], x=c.week+off, y=c.day+off, z=zs[i]+(i===active?.7*e:0), x1=x+w, y1=y+w;const pts=[[px(x,y),py(x,y,z)],[px(x1,y),py(x1,y,z)],[px(x1,y1),py(x1,y1,z)],[px(x,y1),py(x,y1,z)]];const left=[[px(x,y1),py(x,y1,0)],[px(x1,y1),py(x1,y1,0)],pts[2],pts[3]];const right=[[px(x1,y),py(x1,y,0)],[px(x1,y1),py(x1,y1,0)],pts[2],pts[1]];const base=cols[c.level].slice(), dim=legendLevel>=0&&c.level!==legendLevel? .72:0;const fill=mix(base,empty,dim);const path=poly=>{ctx.beginPath();ctx.moveTo(...poly[0]);poly.slice(1).forEach(p=>ctx.lineTo(...p));ctx.closePath();};if(z*cam.ce*s>.35){path(left);ctx.fillStyle=rgb(fill.map(v=>v*.84));ctx.fill();path(right);ctx.fillStyle=rgb(fill.map(v=>v*.68));ctx.fill();}path(pts);ctx.fillStyle=rgb(fill);ctx.fill();if(i===active){ctx.strokeStyle=rgb(fg);ctx.lineWidth=1.5;ctx.stroke();}geometry[i]=[pts,left,right];}
const muted=dark?"#8b949e":"#737373";ctx.fillStyle=muted;ctx.font="10px sans-serif";ctx.textBaseline="top";if(e<.75){ctx.globalAlpha=1-e/.75;months.forEach(m=>ctx.fillText(m.label,px(m.week+off,-.3),py(m.week+off,-.3,0)-14));}if(e>.6){ctx.globalAlpha=(e-.6)/.4;months.forEach(m=>ctx.fillText(m.label,px(m.week+.5,7.3),py(m.week+.5,7.3,0)+3));}ctx.globalAlpha=1;if(active>=0&&model.cells[active]){const c=model.cells[active], p=project(cam,c.week+.5,c.day+.5,zs[active]);const tx=ox+p[0]*s, ty=oy+p[1]*s;tip.innerHTML=`<strong>${c.count?nf.format(c.count)+" "+noun(c.count):"No "+CONFIG.unitPlural}</strong> <span style="opacity:.75">on ${dfy.format(dayMs(c.date))}</span>`;tip.style.left=clamp(tx,70,W-70)+"px";tip.style.top=Math.max(8,ty-6)+"px";tip.style.setProperty("--arrow",clamp(tx-(clamp(tx,70,W-70)-70),5,tip.offsetWidth-5)+"px");tip.style.opacity=1;}else tip.style.opacity=0;}
function animate(){raf=0;const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches, step=reduce?1:16/Math.max(1,CONFIG.duration);if(t!==target) t=target>t?Math.min(target,t+step):Math.max(target,t-step);yaw+=(yawGoal-yaw)*(reduce?1:.18);elev+=(elevGoal-elev)*(reduce?1:.18);draw();if(t!==target||Math.abs(yaw-yawGoal)>.001||Math.abs(elev-elevGoal)>.001) raf=requestAnimationFrame(animate);}
function kick(){if(!raf) raf=requestAnimationFrame(animate);}
function setView(v){if(v===view)return;view=v;target=v==="3d"?1:0;if(v==="2d"){yawGoal=elevGoal=0;}renderChrome();resize();kick();}
function hit(x,y){for(let i=geometry.length-1;i>=0;i--){const polys=geometry[i]||[];for(const poly of polys){let inside=false;for(let a=0,b=poly.length-1;a<poly.length;b=a){const [xi,yi]=poly[a],[xj,yj]=poly[b];if(((yi>y)!==(yj>y))&& (x< (xj-xi)*(y-yi)/(yj-yi)+xi)) inside=!inside;}if(inside) return i;}}return -1;}
function setActive(i){active=i;$("announce").textContent=i>=0?cellDescription(i):"";kick();}
function pointerPos(e){const r=canvas.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top];}
canvas.addEventListener("pointerdown",e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,yaw:yawGoal,elev:elevGoal,moved:false,orbit:CONFIG.orbit&&view==="3d",mouse:e.pointerType==="mouse"};if(drag.orbit)canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener("pointermove",e=>{if(drag&&drag.orbit&&drag.id===e.pointerId){const dx=e.clientX-drag.x, dy=e.clientY-drag.y; if(drag.moved||Math.hypot(dx,dy)>4){drag.moved=true; yawGoal=clamp(drag.yaw+dx*.006,-.65,.65); if(drag.mouse) elevGoal=clamp(drag.elev+dy*.004,-.28,.49); canvas.style.cursor="grabbing"; hovered=-1; setActive(-1); return;}} if(e.pointerType!=="mouse")return; const [x,y]=pointerPos(e), i=hit(x,y); if(i!==hovered){hovered=i; setActive(i);} canvas.style.cursor=CONFIG.orbit&&view==="3d"?"grab":i>=0?"pointer":"default";});
canvas.addEventListener("pointerup",e=>{if(!drag||drag.id!==e.pointerId)return; const moved=drag.moved; drag=null; if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId); canvas.style.cursor="default"; if(moved)return; const [x,y]=pointerPos(e), i=hit(x,y); pinned=i===pinned?-1:i; if(e.pointerType!=="mouse")hovered=-1; setActive(hovered>=0?hovered:pinned); if(i>=0&&typeof CONFIG.onCellClick==="function")CONFIG.onCellClick({date:model.cells[i].date,count:model.cells[i].count});});
canvas.addEventListener("pointerleave",()=>{if(drag)return; hovered=-1; setActive(pinned);});
canvas.addEventListener("pointercancel",()=>{drag=null});
canvas.addEventListener("dblclick",()=>{yawGoal=elevGoal=0; kick();});
canvas.addEventListener("keydown",e=>{const keys=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End","Escape","Enter"," "];if(!keys.includes(e.key))return;e.preventDefault(); if(e.key==="Escape"){pinned=hovered=-1; setActive(-1);return;} let i=pinned>=0?pinned:active>=0?active:model.cells.length-1; if(e.key==="Enter"||e.key===" "){const c=model.cells[i]; if(typeof CONFIG.onCellClick==="function")CONFIG.onCellClick({date:c.date,count:c.count});return;} if(i>=0){if(e.key==="ArrowLeft")i-=7; if(e.key==="ArrowRight")i+=7; if(e.key==="ArrowUp")i--; if(e.key==="ArrowDown")i++; if(e.key==="Home")i=0; if(e.key==="End")i=model.cells.length-1;} pinned=clamp(i,0,model.cells.length-1); hovered=-1; setActive(pinned);});
canvas.addEventListener("blur",()=>{pinned=-1; setActive(hovered);});
$("view-toggle").addEventListener("click",e=>{const b=e.target.closest("[data-view]"); if(b) setView(b.dataset.view);});
function buildLegend(){const legend=$("legend"); legend.innerHTML="<span>Less</span>"; const names=["No activity","Light","Moderate","Heavy","Heaviest"]; for(let i=0;i<5;i++){const b=document.createElement("button"); b.className="swatch"; b.type="button"; b.title=names[i]; b.setAttribute("aria-label","Highlight "+names[i].toLowerCase()+" days"); b.addEventListener("mouseenter",()=>{legendLevel=i;kick();}); b.addEventListener("focus",()=>{legendLevel=i;kick();}); b.addEventListener("blur",()=>{legendLevel=-1;kick();}); b.addEventListener("click",()=>{legendLevel=legendLevel===i?-1:i; b.setAttribute("aria-pressed",String(legendLevel===i)); kick();}); legend.appendChild(b);} const more=document.createElement("span"); more.textContent="More"; legend.appendChild(more); legend.addEventListener("mouseleave",()=>{legendLevel=-1;kick();}); }
buildLegend(); theme(); renderChrome(); resize(); if(view==="3d") target=1; new ResizeObserver(()=>{resize();}).observe(stage); matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{theme();kick();}); if("IntersectionObserver"in window){const io=new IntersectionObserver(entries=>{if(entries.some(x=>x.isIntersecting)){kick();io.disconnect();}},{threshold:.2});io.observe(stage);}else kick();
})();
</script>
</body>
</html>