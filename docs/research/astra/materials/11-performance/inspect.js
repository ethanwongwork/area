'use strict';
// Uses the exact frozen benchmark mount function; inspection only, no timing or writes.
const inspect=document.getElementById('inspect');
for(const c of cases){const o=document.createElement('option');o.value=c.id;o.textContent=c.id+' · '+JSON.stringify(c);inspect.append(o);}
function inspectCase(){const c=cases.find(c=>c.id===inspect.value);mount({...c,mode:'scroll'},0);document.getElementById('case').textContent=JSON.stringify(c);document.getElementById('status').textContent='Static inspection of the benchmark mount. Original case mode shown below; no animation or timing is running.';}
inspect.onchange=inspectCase;preload.then(inspectCase);
