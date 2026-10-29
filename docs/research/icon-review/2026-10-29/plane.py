# plane: a top-down airliner built upright (y up = nose) and turned 45° onto the rising diagonal, every constant-width
# edge solved onto the pixel lattice (axis x + y = 16.5). From the repository root: python3 docs/research/icon-review/2026-10-29/plane.py 1.165
# writes packages/icons/sources/plane.svg (docs/specs/icons.md, "Review against Cursor, 2026-10-29").
import math,subprocess,sys
k=math.sqrt(.5); s=float(sys.argv[1]); u=s*2*k; axis=16.5
w=2.5/u; wing=9.5/u; tail=5.5/u; nose=6.4; yt=-5.45
R=[(w,3.4),(w,1.6),(wing,-1.3),(wing,-2.3),(w,-0.6),(w,-3.3),(tail,-4.45),(tail,yt)]
rad=[0.5,0.5,0.4,0.4,0.5,0.5,0.4,0.4]
pts=[(0,nose)]+R+[(-x,y) for x,y in reversed(R)]; rs=[1.5]+rad+rad[::-1]
def box(m):
  Q=[((axis+u*x+u*y+m)/2,(axis+u*x-u*y-m)/2) for x,y in pts]
  xs=[q[0] for q in Q]; ys=[q[1] for q in Q]
  return (min(xs)+max(xs))/2-8,(min(ys)+max(ys))/2-8,max(max(xs)-min(xs),max(ys)-min(ys))
cands=[n-u*yt for n in range(-20,0)]
m=min(cands,key=lambda c:abs(box(c)[0])+abs(box(c)[1]))
print('box',[round(v,2) for v in box(m)])
Q=[((axis+u*x-8*2+16)/2 if False else (axis+u*x+u*y+m)/2, (axis+u*x-u*y-m)/2) for x,y in pts]
d=subprocess.run(["node","packages/icons/scripts/geometry.mjs","fillet"," ".join(f"{X:.4f},{Y:.4f}" for X,Y in Q),",".join(map(str,rs))],capture_output=True,text=True).stdout.strip()
open("packages/icons/sources/plane.svg","w").write(f'<svg data-set="area-pilot" data-keyline="square" data-angles="free" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path data-filled="solid" d="{d}" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>\n</svg>\n')
print("m",round(m,2),"tail x-y",round(u*yt+m,3))
