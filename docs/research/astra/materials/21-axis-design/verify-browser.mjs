import fs from 'node:fs';import path from 'node:path';import http from 'node:http';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {fileURLToPath} from 'node:url';import os from 'node:os';import crypto from 'node:crypto';
const here=path.dirname(fileURLToPath(import.meta.url));
const req=createRequire(path.join(process.env.BROWSER_DEPENDENCIES??process.cwd(),'package.json'));
const {chromium}=req('playwright'),{PNG}=req('pngjs');
const server=http.createServer((request,response)=>{const name=decodeURIComponent(new URL(request.url,'http://local').pathname);const p=path.resolve(here,'.'+(name==='/'?'/demo.html':name));if(!p.startsWith(here+path.sep)||!fs.existsSync(p)){response.writeHead(404);response.end();return;}response.setHeader('Content-Type',p.endsWith('.css')?'text/css':p.endsWith('.mjs')?'text/javascript':p.endsWith('.json')?'application/json':'text/html');response.end(fs.readFileSync(p));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{})});
const page=await browser.newPage({viewport:{width:1200,height:1100},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const results={checked:'2026-10-12',browser:browser.version(),platform:os.platform(),release:os.release(),viewport:[1200,1100],dpr:1,sourceHashes:Object.fromEntries(['demo.css','demo.html','demo.mjs','surface-parts.json'].map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(path.join(here,f))).digest('hex')])),nested:[],gates:[],surface:[],limits:'Local diagnostic fixture only; no whole-gallery identity, native AT, performance or cross-engine claim.'};
const diff=(a,b)=>{a=PNG.sync.read(a);b=PNG.sync.read(b);assert.equal(a.width,b.width);assert.equal(a.height,b.height);let changedPixels=0,maxChannelDelta=0;for(let i=0;i<a.data.length;i+=4){let changed=false;for(let k=0;k<4;k++){const d=Math.abs(a.data[i+k]-b.data[i+k]);if(d)changed=true;maxChannelDelta=Math.max(maxChannelDelta,d);}if(changed)changedPixels++;}return {changedPixels,maxChannelDelta};};
try{
 await page.goto(`http://127.0.0.1:${server.address().port}/demo.html`);await page.waitForFunction(()=>window.lab?.ready);await page.evaluate(()=>document.fonts.ready);
 for(const mode of ['light','dark']){
  await page.evaluate(m=>window.lab.mode(m==='dark'),mode);
  for(const [id,expected] of [['none',[0,0,0]],['tactile',[0,1,0]],['glass',[1,0,0]],['reset',[0,0,0]]]){
   const snapshot=await page.evaluate(id=>{const node=document.getElementById(id),c=getComputedStyle(node),p=getComputedStyle(node.firstElementChild);return{gates:['glass','tactile','soft'].map(k=>+c.getPropertyValue('--area-material-gate-'+k)),boxShadow:c.boxShadow,background:c.backgroundImage,filter:c.filter,color:c.color,optics:{opacity:p.opacity,filter:p.filter,backdropFilter:p.backdropFilter}};},id);
   assert.deepEqual(snapshot.gates,expected);assert.equal(snapshot.filter,'none');assert.equal(+snapshot.optics.opacity,expected[0]);
   // Remove ancestors' preset attributes, leaving only the receiver's immediate owner.
   const flat=await page.evaluate(id=>{const node=document.getElementById(id),own=node.closest('[data-area-material]'),saved=[];for(let p=own.parentElement;p;p=p.parentElement){if(p.hasAttribute('data-area-material')){saved.push([p,p.getAttribute('data-area-material')]);p.removeAttribute('data-area-material');}}
    const c=getComputedStyle(node),p=getComputedStyle(node.firstElementChild);const out={boxShadow:c.boxShadow,background:c.backgroundImage,filter:c.filter,color:c.color,optics:{opacity:p.opacity,filter:p.filter,backdropFilter:p.backdropFilter}};saved.forEach(([e,v])=>e.setAttribute('data-area-material',v));return out;},id);
   const {gates,...paint}=snapshot;assert.deepEqual(flat,paint);results.nested.push({mode,id,...snapshot,equalsIsolatedScope:true});
  }
  for(const kind of ['shadow','background','filter','backdrop','bad-shadow','bad-background','bad-filter','zero-blur']){
   await page.evaluate(k=>window.lab.probe(k,0,true),kind);const baseline=await page.locator('#probe-stage').screenshot();
   await page.evaluate(k=>window.lab.probe(k,0,false),kind);const off=await page.locator('#probe-stage').screenshot();const offDiff=diff(baseline,off);
   await page.evaluate(k=>window.lab.probe(k,1,false),kind);const on=await page.locator('#probe-stage').screenshot();const onDiff=diff(baseline,on);
   const offStyle=await page.evaluate(k=>{window.lab.probe(k,0,false);const s=getComputedStyle(document.querySelector('#probe-stage .sample'));const a=getComputedStyle(document.querySelector('#probe-stage .sample'),'::after');return {boxShadow:s.boxShadow,background:s.backgroundImage,filter:s.filter,layerOpacity:a.opacity,layerFilter:a.filter,backdropFilter:a.backdropFilter};},kind);
   if(kind.startsWith('bad-')||kind==='zero-blur')assert(offDiff.changedPixels>0,kind);else assert.equal(offDiff.changedPixels,0,kind);
   assert(onDiff.changedPixels>0,kind);results.gates.push({mode,kind,offDiff,onDiff,offStyle,expectedFailure:kind.startsWith('bad-')||kind==='zero-blur'});
  }
  for(let i=0;i<32;i++){
   await page.evaluate(i=>window.lab.surface(i,false),i);const old=await page.locator('#surface-stage').screenshot(),oldStyle=await page.locator('#surface-stage .surface').evaluate(e=>getComputedStyle(e).boxShadow);
   await page.evaluate(i=>window.lab.surface(i,true),i);const next=await page.locator('#surface-stage').screenshot(),nextStyle=await page.locator('#surface-stage .surface').evaluate(e=>getComputedStyle(e).boxShadow);
   const d=diff(old,next);assert.equal(d.changedPixels,0,`Surface ${mode}/${i}`);assert.equal(nextStyle,oldStyle);
   const c=await page.evaluate(i=>{const {surface,id}=window.lab.fixture.shadows[i];return{surface,id};},i);results.surface.push({mode,...c,...d,computedEqual:true,computed:nextStyle});
  }
 }
 assert.deepEqual(errors,[]);
 fs.mkdirSync(path.join(here,'.capture'),{recursive:true});await page.evaluate(()=>{window.lab.mode(false);window.lab.probe('shadow',0,false);window.lab.surface(12,false);});await page.screenshot({path:path.join(here,'.capture/demo.png'),fullPage:true});
 results.pass=true;fs.writeFileSync(path.join(here,'browser-results.json'),JSON.stringify(results,null,2)+'\n');console.log(`PASS: ${results.nested.length} nested cases; ${results.gates.length} zero/on comparisons incl. deliberate failures; ${results.surface.length} exact Surface pixel + computed-style matches.`);
}finally{await browser.close();await new Promise(r=>server.close(r));}
