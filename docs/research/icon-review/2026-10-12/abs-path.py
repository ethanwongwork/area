# Convert an SVG path to absolute commands (M L H V C S Q T A Z), keeping its geometry exactly.
# Used to bring Fluent's globe ink into Area's sources, whose lint accepts absolute commands only.
import re,sys
def absolute(d):
    toks=re.findall(r'[MmLlHhVvCcSsQqTtAaZz]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?',d)
    out=[];i=0;cx=cy=sx=sy=0;cmd=None
    N={'M':2,'L':2,'H':1,'V':1,'C':6,'S':4,'Q':4,'T':2,'A':7,'Z':0}
    f=lambda v: f"{round(v,4):g}"
    while i<len(toks):
        if re.match(r'[A-Za-z]',toks[i]): cmd=toks[i]; i+=1
        elif cmd in 'Mm': cmd='l' if cmd=='m' else 'L'
        up=cmd.upper(); rel=cmd.islower()
        if up=='Z': out.append('Z'); cx,cy=sx,sy; continue
        a=[float(t) for t in toks[i:i+N[up]]]; i+=N[up]
        if up=='H': x=a[0]+(cx if rel else 0); out.append('H'+f(x)); cx=x; continue
        if up=='V': y=a[0]+(cy if rel else 0); out.append('V'+f(y)); cy=y; continue
        if up=='A':
            x=a[5]+(cx if rel else 0); y=a[6]+(cy if rel else 0)
            out.append(f"A{f(a[0])} {f(a[1])} {f(a[2])} {int(a[3])} {int(a[4])} {f(x)} {f(y)}"); cx,cy=x,y; continue
        pts=[(a[k]+(cx if rel else 0),a[k+1]+(cy if rel else 0)) for k in range(0,len(a),2)]
        out.append(up+' '.join(f"{f(x)} {f(y)}" for x,y in pts)); cx,cy=pts[-1]
        if up=='M': sx,sy=cx,cy; cmd='l' if rel else 'L'
    return ''.join(out)
if __name__=='__main__': print(absolute(sys.argv[1]))
