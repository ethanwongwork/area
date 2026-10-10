/** Integrity checks only. Browser checks are initiated on the page and saved in verification.json. */
import {readFile, readdir, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname, join, resolve} from 'node:path';
import assert from 'node:assert/strict';
const here=dirname(fileURLToPath(import.meta.url));
const json=async path=>JSON.parse(await readFile(path,'utf8'));
const source=await json(resolve(here,'../13-presets/presets.json'));
const raw=await readFile(join(here,'preset-data.js'),'utf8');
const model=JSON.parse(raw.slice(raw.indexOf('window.M16_DATA=')+16).trim().replace(/;$/,''));
assert.deepEqual(model.presets,source.presets.filter(p=>['paper','glass','tactile'].includes(p.id)));
assert.deepEqual(model.roles,source.roles);
const html=await readFile(join(here,'index.html'),'utf8');
assert.equal((html.match(/class="m16-tile"/g)||[]).length,288);
assert.equal((html.match(/class="m16-context"/g)||[]).length,8);
assert.ok(html.includes('href="/packages/styles/dist/area.css"'));
const audit=await json(join(here,'verification.json'));
assert.equal(audit.cssSha256,model.cssSha256);
assert.equal(audit.areaCommit,model.areaCommit);
assert.equal(audit.checks.geometryOrForegroundDifferences,0);
assert.equal(audit.checks.duplicateIds,0);
assert.equal(audit.checks.glassWhileFallback,0);
assert.equal(audit.checks.viewportOverflow,false);
assert.equal(audit.checks.receivers,480);
assert.equal(audit.captures.length,4);
assert.equal(audit.resolved.length,480);
assert.equal(new Set(audit.resolved.map(r=>r.context)).size,8);
for(const value of Object.values(audit.patches)){assert.deepEqual(value.global,{});assert.deepEqual(value.roles,{});}
const fnv=text=>{let h=0x811c9dc5;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h.toString(16).padStart(8,'0');};
for(const capture of audit.captures){const {checksum,...rest}=capture;assert.equal(checksum,fnv(JSON.stringify(rest)));}
for(const name of await readdir(here)){const st=await stat(join(here,name));if(st.isFile())assert.ok(st.size<1000000,`${name} exceeds 1 MB`);}
console.log('PASS: exact source preset subset; 288 tiles / 8 contexts; 480 measured receivers; four capture checksums; every file <1 MB.');
