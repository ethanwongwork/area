const [a,b]=process.argv.slice(2).map(Number); const d=a/Math.SQRT2, f=v=>+v.toFixed(3);
const p=(s)=>{const t1=[8+d,8+s*d].map(f),t2=[8-d,8-s*d].map(f),rot=s>0?45:135;return `M${t1[0]} ${t1[1]}A${a} ${b} ${rot} 1 1 ${t2[0]} ${t2[1]}A${a} ${b} ${rot} 1 1 ${t1[0]} ${t1[1]}Z`};
const P=(s)=>s>0?p(1):`M${f(8+d)} ${f(8-d)}A${a} ${b} 135 1 1 ${f(8-d)} ${f(8+d)}A${a} ${b} 135 1 1 ${f(8+d)} ${f(8-d)}Z`;
console.log(`<svg data-set="area-pilot" data-keyline="circle" data-angles="free" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="${p(1)}" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${P(-1)}" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="8" cy="8" r="1" fill="currentColor"/>
</svg>`);
