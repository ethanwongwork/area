import {bez,line} from './pp.mjs';
const md=(A,B)=>{let m=1e9;for(const p of A)for(const q of B){const d=(p[0]-q[0])**2+(p[1]-q[1])**2;if(d<m)m=d;}return Math.sqrt(m)-1.125;};
const ok=g=>(g>=0.875&&g<=2.0)||g>=2.5;
const sh=1, mouth=line([6.072-sh/2,4.072+sh/2],[11.928-sh/2,9.928+sh/2],40); const res=[];
for(const sy0 of [5,5.25,5.5]) for(const sx of [0,0.5]){
 const Sp=[...bez([10+sx,sy0],[10+sx,3.75],[10.75+sx,3.5],[11.5+sx,3.5],20),...bez([11.5+sx,3.5],[12.25+sx,3.5],[13+sx,3.25],[13+sx,2],20)];
 for(const tx of [7.5,8.5]) {const T=line([tx,2],[tx,3.5],8);
 for(let ax=11;ax<=13;ax+=0.25)for(let ay=6;ay<=9.5;ay+=0.25)for(const L of [1.25,1.5]){ if(Math.abs((ax-ay)-Math.round(ax-ay))>1e-9||ax+L>13.94) continue; const D1=line([ax,ay],[ax+L,ay+L],8);
  for(let bx=11;bx<=13;bx+=0.25)for(let by=4.5;by<=7;by+=0.25)for(const M of [1.25,1.5]){ if(bx+M>13.94) continue; const D2=line([bx,by],[bx+M,by-M/3],8);
   const g=[md(mouth,T),md(mouth,Sp),md(mouth,D1),md(mouth,D2),md(T,Sp),md(T,D1),md(T,D2),md(Sp,D1),md(Sp,D2),md(D1,D2)];
   if(!g.every(ok)) continue; const m=Math.min(...g); res.push({m,sy0,sx,tx,ax,ay,L,bx,by,M,g:g.map(v=>v.toFixed(2)).join(" ")});}}}}
res.sort((a,b)=>b.m-a.m); for(const r of res.slice(0,12)) console.log(JSON.stringify(r)); console.log(res.length);
