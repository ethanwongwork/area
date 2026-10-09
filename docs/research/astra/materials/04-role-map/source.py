"""Read the immutable main snapshot, never the research worktree's stale production files."""
from pathlib import Path
import subprocess,re,json
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[4]
SHA='6f896789a5200bcbd34fe87de458e60ca82141d6'
def read(path):return subprocess.check_output(['git','show',f'{SHA}:{path}'],cwd=ROOT,text=True)
def paths(prefix):return subprocess.check_output(['git','ls-tree','-r','--name-only',SHA,prefix],cwd=ROOT,text=True).splitlines()
def manifest():
 raw=read('packages/styles/src/manifest.ts')
 js="import {stripTypeScriptTypes} from 'node:module';let s='';for await (const c of process.stdin)s+=c;const m=await import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(s)).toString('base64'));console.log(JSON.stringify(m.MANIFESTS));"
 data=json.loads(subprocess.check_output(['node','--input-type=module','-e',js],input=raw,cwd=ROOT,text=True))
 for k,v in data.items():
  offset=raw.index('block: "'+v['block']+'"');v['line']=raw[:offset].count('\n')+1
 return data

def split_selectors(s):
 out=[];depth=0;start=0;quote=None
 for i,c in enumerate(s):
  if quote:
   if c==quote and (not i or s[i-1]!='\\'):quote=None
  elif c in '\"\'':quote=c
  elif c in '([':depth+=1
  elif c in ')]':depth-=1
  elif c==',' and depth==0:out.append(s[start:i].strip());start=i+1
 out.append(s[start:].strip());return out

def rules():
 out=[]
 for path in paths('packages/styles/src'):
  if not path.endswith('.css'):continue
  raw=read(path)
  clean=re.sub(r'/\*.*?\*/',lambda m:re.sub(r'[^\n]',' ',m[0]),raw,flags=re.S)
  for m in re.finditer(r'([^{}]+)\{([^{}]*)\}',clean):
   sel=m[1].strip()
   if sel.startswith('@') or not sel:continue
   offset=m.start(1)+len(m[1])-len(m[1].lstrip())
   line=clean[:offset].count('\n')+1
   props=dict(re.findall(r'(?:^|;)\s*([\w-]+)\s*:\s*([^;]+)',m[2]))
   for selector in split_selectors(sel):
    if '.area-' not in selector:continue
    out.append({'path':path,'line':line,'end':clean[:m.end()].count('\n')+1,'selector':' '.join(selector.split()),'props':props})
 return out
if __name__=='__main__':
 data=manifest();rs=rules()
 for key,m in data.items():
  block=m['block'];owned=[r for r in rs if any(c.split('--')[0].split('__')[0]==block for c in re.findall(r'\.(area-[\w-]+)',r['selector']))]
  classes=sorted(set(c.split('--')[0] for r in owned for c in re.findall(r'\.(area-[\w-]+)',r['selector']) if c.split('--')[0].split('__')[0]==block))
  print(key,block,'manifest:',','.join(m.get('elements',[])),'CSS:',','.join(c[len(block):] or '(root)' for c in classes),'files:',','.join(sorted(set(r['path'].split('/')[-1] for r in owned))))
 print('TOTAL',len(data),'contracts',len(rs),'selector records')
