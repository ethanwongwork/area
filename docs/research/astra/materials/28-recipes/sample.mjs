// Samples the reference images at chosen points (a 3x3 average), via a page run in headless Edge: node sample.mjs
// <references-dir> <out.html>, then evaluate window.result. The points name what they hit (fill, edge, gradient stop).

import { readFileSync, writeFileSync } from "node:fs";
const [imdir, out] = process.argv.slice(2);
const P = {
  1: { page: [60, 60], card: [300, 250], cardEdgeTop: [600, 186], cardEdgeL: [125, 370], shadow1: [600, 560], shadow2: [600, 580], shadow3: [600, 605], btnTop: [200, 476], btnMid: [200, 499], btnBot: [200, 521], btnEdgeL: [152, 499], btnEdgeT: [200, 472], btnEdgeB: [200, 525], btnBelow: [237, 530], text: [152, 410] },
  2: { page: [20, 20], y92: [135, 92], y95: [135, 95], y100: [135, 100], y105: [135, 105], y110: [135, 110], y115: [135, 115], y117: [135, 117], y120: [135, 120], y125: [135, 125], y130: [135, 130], y135: [135, 135], y138: [135, 138], y140: [135, 140], edgeL: [112, 116], edgeT: [160, 91], edgeB: [160, 142], below: [160, 146] },
  3: { bgBL: [50, 600], bgTR: [1150, 100], panelTop: [600, 150], panelMid: [600, 400], rimL: [158, 200], rimB: [600, 452], outsideB: [600, 470], pillTop: [330, 296], pillMid: [330, 340], pillBot: [330, 382], pillRimT: [330, 288], pillShadow: [330, 400], pillRimL: [215, 340] },
  4: { page: [50, 50], trackTop: [600, 252], trackIn: [600, 290], trackRimL: [125, 600], trackL: [150, 600], pillRing: [204, 600], y320: [320, 320], y360: [320, 360], y450: [320, 450], y600: [320, 600], y750: [320, 750], y840: [320, 840], y870: [320, 870], pillRimB: [600, 882], glyph: [597, 470] },
  5: { page: [30, 30], tileTL: [250, 230], tileTR: [600, 230], tileMid: [300, 400], tileBot: [420, 700], rimL: [142, 450], rimT: [430, 156], rimB: [430, 735], wellTop: [420, 462], wellMid: [600, 560], wellBot: [420, 670], glyph: [300, 560] },
  6: { page: [50, 50], t230: [250, 230], t300: [250, 300], t400: [250, 400], t500: [250, 500], t600: [250, 600], t655: [250, 655], b455: [440, 455], b470: [440, 470], b500: [440, 500], b550: [440, 550], b590: [440, 590], b612: [440, 612], rimB: [480, 624], glyph: [480, 520] },
  7: { page: [50, 50], housing: [370, 250], housingR: [840, 450], keyTop: [470, 250], keyMid: [470, 330], keyBot: [470, 420], keyEdgeB: [470, 430], key2: [470, 560], rocker250: [720, 250], rocker330: [720, 330], rocker450: [720, 470], rocker600: [720, 620], rocker680: [720, 690], led: [492, 519], ledHalo: [492, 508] },
  8: { page: [30, 30], frontTop: [300, 200], frontMid: [300, 300], frontBot: [450, 420], frontEdgeT: [300, 140], back: [520, 75], paper: [400, 95], shadow1: [360, 448], shadow2: [360, 462] },
};
let html = `<!doctype html><meta charset=utf8><body><script>const P=${JSON.stringify(P)};const IM={`;
for (const k of Object.keys(P)) html += `${k}:"data:image/png;base64,${readFileSync(`${imdir}/${k}.png`).toString("base64")}",`;
html += `};window.result=(async()=>{const out={};for(const [k,pts] of Object.entries(P)){const img=new Image();img.src=IM[k];await img.decode();const c=document.createElement("canvas");c.width=img.naturalWidth;c.height=img.naturalHeight;const x=c.getContext("2d");x.drawImage(img,0,0);out[k]={};for(const [n,[px,py]] of Object.entries(pts)){const d=x.getImageData(px-1,py-1,3,3).data;let r=0,g=0,b=0;for(let i=0;i<36;i+=4){r+=d[i];g+=d[i+1];b+=d[i+2];}out[k][n]="#"+[r,g,b].map(v=>Math.round(v/9).toString(16).padStart(2,"0")).join("");}}return out;})();</script>`;
writeFileSync(out, html);
