// Source-tree CSS scanner: balances strings, comments, functions and blocks.
export const lineAt=(s,i)=>s.slice(0,i).split('\n').length;
export function split(s,delimiter=','){
 const parts=[];let start=0,depth=0,q='';
 for(let i=0;i<=s.length;i++){
  const c=s[i];if(q){if(c==='\\')i++;else if(c===q)q='';continue;}
  if(c==='"'||c==="'"){q=c;continue;}
  if(c==='('||c==='[')depth++;if(c===')'||c===']')depth--;
  if(i===s.length||(c===delimiter&&!depth)){parts.push(s.slice(start,i).trim());start=i+1;}
 }return parts;
}
export function closeParen(s,start){let depth=0,q='';for(let i=start;i<s.length;i++){const c=s[i];if(q){if(c==='\\')i++;else if(c===q)q='';continue;}if(c==='"'||c==="'")q=c;else if(c==='(')depth++;else if(c===')'&&!--depth)return i;}throw Error('Unclosed selector function');}
export function parseCSS(source,file){
 // Preserve offsets and line breaks while making comments invisible to the lexer.
 let s='',q='';for(let i=0;i<source.length;i++){
  const c=source[i];if(q){s+=c;if(c==='\\')s+=source[++i];else if(c===q)q='';}
  else if(c==='"'||c==="'"){q=c;s+=c;}
  else if(c==='/'&&source[i+1]==='*'){let end=source.indexOf('*/',i+2);if(end<0)throw Error(file+': unclosed comment');s+=source.slice(i,end+2).replace(/[^\n]/g,' ');i=end+1;}
  else s+=c;
 }
 const rules=[],declarations=[],stack=[];let start=0,depth=0;q='';
 function declaration(end){const raw=s.slice(start,end);if(!raw.trim())return;if(raw.trim().startsWith('@'))return;const m=raw.match(/^\s*([\w-]+)\s*:\s*([\s\S]*)$/);if(!m)throw Error(file+': unparsed '+raw.trim());declarations.push({property:m[1],value:m[2].replace(/\s+/g,' ').trim(),line:lineAt(source,start+raw.indexOf(m[1])),ruleIds:stack.map(r=>r.id)});}
 for(let i=0;i<s.length;i++){
  const c=s[i];if(q){if(c==='\\')i++;else if(c===q)q='';continue;}if(c==='"'||c==="'"){q=c;continue;}
  if(c==='('||c==='[')depth++;if(c===')'||c===']')depth--;if(depth)continue;
  if(c==='{'){const raw=s.slice(start,i),header=raw.trim().replace(/\s+/g,' ');const r={id:rules.length,header,at:header.startsWith('@'),start:start+raw.search(/\S/),atRules:stack.filter(r=>r.at).map(r=>r.header)};rules.push(r);stack.push(r);start=i+1;}
  else if(c===';'){declaration(i);start=i+1;}
  else if(c==='}'){declaration(i);if(!stack.length)throw Error(file+': unmatched }');stack.pop().end=i;start=i+1;}
 }
 declaration(s.length);if(stack.length||depth||q)throw Error(file+': unbalanced CSS');return {rules,declarations};
}
