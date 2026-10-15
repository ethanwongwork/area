# Long axis-aligned stroked edges on whole-pixel coordinates (smear across two rows at 1x).
import re,os,sys
SRC='packages/icons/sources'
FILLED_ONLY=re.compile(r'data-filled="(gap|fill|stroke|halo|inset)"')
def num(s): return float(s)
out=[]
for f in sorted(os.listdir(SRC)):
    if not f.endswith('.svg') or f.startswith('zz-'): continue
    t=open(os.path.join(SRC,f)).read()
    if 'data-alias-of' in t: continue
    segs=[]
    for el in re.findall(r'<(rect|path|line)\b([^>]*)/?>',t):
        tag,attrs=el
        if FILLED_ONLY.search(attrs) or 'stroke="currentColor"' not in attrs: continue
        if tag=='rect':
            g={k:float(v) for k,v in re.findall(r'\b(x|y|width|height|rx)="([\d.]+)"',attrs)}
            x,y,w,h,rx=g.get('x',0),g.get('y',0),g['width'],g['height'],g.get('rx',0)
            for c,l in ((x,h-2*rx),(x+w,h-2*rx)): segs.append(('v',c,l))
            for c,l in ((y,w-2*rx),(y+h,w-2*rx)): segs.append(('h',c,l))
        else:
            d=re.search(r'\sd="([^"]+)"',attrs)
            if not d: continue
            toks=re.findall(r'[A-Za-z]|-?\d*\.?\d+',d.group(1))
            i=0;cx=cy=0;cmd=None;sx=sy=0
            while i<len(toks):
                if re.match('[A-Za-z]',toks[i]): cmd=toks[i];i+=1
                if cmd=='M': cx,cy=num(toks[i]),num(toks[i+1]);sx,sy=cx,cy;i+=2;cmd='L'
                elif cmd=='L':
                    nx,ny=num(toks[i]),num(toks[i+1]);i+=2
                    if nx==cx: segs.append(('v',cx,abs(ny-cy)))
                    elif ny==cy: segs.append(('h',cy,abs(nx-cx)))
                    cx,cy=nx,ny
                elif cmd=='H': nx=num(toks[i]);i+=1;segs.append(('h',cy,abs(nx-cx)));cx=nx
                elif cmd=='V': ny=num(toks[i]);i+=1;segs.append(('v',cx,abs(ny-cy)));cy=ny
                elif cmd=='A': cx,cy=num(toks[i+5]),num(toks[i+6]);i+=7
                elif cmd=='C': cx,cy=num(toks[i+4]),num(toks[i+5]);i+=6
                elif cmd in 'SQ': cx,cy=num(toks[i+2]),num(toks[i+3]);i+=4
                elif cmd=='Z': cx,cy=sx,sy
                else: i+=1
    whole=sum(l for a,c,l in segs if l>=3 and c==int(c))
    half=sum(l for a,c,l in segs if l>=3 and c!=int(c))
    if whole: out.append((whole,half,f[:-4]))
out.sort(reverse=True)
print(len(out),'icons with whole-pixel stroked runs >= 3')
for w,h,n in out[:int(sys.argv[1])]: print(f'{w:5.1f} whole  {h:5.1f} half  {n}')
