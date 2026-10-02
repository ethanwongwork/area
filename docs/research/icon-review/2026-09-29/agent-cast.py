import subprocess, math
def g(*a): return subprocess.check_output(['node','apps/docs/scripts/icon-geometry.mjs',*a]).decode().strip()
f=lambda v: ('%.3f'%v).rstrip('0').rstrip('.')
St='fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"'
# the hat line: a quadratic sagging round the head
X0,X1,YE,YC=1.5,14.5,6.25,8
HL=0
def y_at(x,dy=0):
    t=(x-X0)/(X1-X0); return YE+2*t*(1-t)*(YC-YE)+dy+HL
def seg(xa,xb,dy=0):
    # sub-curve of the (linear-in-x) quadratic between xa and xb: control by blossoming
    ta=(xa-X0)/(X1-X0); tb=(xb-X0)/(X1-X0)
    def B(u,v): # blossom of y
        return YE*(1-u)*(1-v)+YC*((1-u)*v+u*(1-v))+YE*u*v
    cx=(xa+xb)/2; cy=B(ta,tb)+dy+HL
    return 'Q%s %s %s %s'%(f(cx),f(cy),f(xb),f(y_at(xb,dy)))
def curve(xa,xb,dy=0): return 'M%s %s'%(f(xa),f(y_at(xa,dy)))+seg(xa,xb,dy)
# where the head's corner arcs meet the hat line
def hit():
    lo,hi=math.pi,1.5*math.pi
    for _ in range(60):
        m=(lo+hi)/2; x=4.5+2.5*math.cos(m); y=8.5+2.5*math.sin(m)
        if y<y_at(x): hi=m
        else: lo=m
    m=(lo+hi)/2; return 4.5+2.5*math.cos(m),8.5+2.5*math.sin(m)
def mk():
    global hx,hy,HEAD,LINE_FULL,LINE_HEAD
    hx,hy=hit()
    HEAD='<path d="M%s %sA2.5 2.5 0 0 0 2 8.5V11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V8.5A2.5 2.5 0 0 0 %s %s" %s/>'%(f(hx),f(hy),f(16-hx),f(hy),St)
    LINE_FULL='<path d="%s" %s/>'%(curve(X0,X1),St)
    LINE_HEAD='<path d="%s" %s/>'%(curve(hx,16-hx),St)
hx,hy=hit()
HEAD='<path d="M%s %sA2.5 2.5 0 0 0 2 8.5V11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V8.5A2.5 2.5 0 0 0 %s %s" %s/>'%(f(hx),f(hy),f(16-hx),f(hy),St)
LINE_FULL='<path d="%s" %s/>'%(curve(X0,X1),St)
LINE_HEAD='<path d="%s" %s/>'%(curve(hx,16-hx),St)
MOUTH='<circle cx="8" cy="11.25" r="0.75" fill="currentColor"/>'
GLASSES='<circle data-filled="knockout" cx="5" cy="9.75" r="1.25" %s/>\n<circle data-filled="knockout" cx="11" cy="9.75" r="1.25" %s/>\n<path data-filled="knockout" d="M6.25 9.75H9.75" %s/>\n<circle data-filled="hole" cx="8" cy="11.75" r="0.75" fill="currentColor"/>'%(St,St,St)
EYES='<path d="M5 9V10.5M11 9V10.5" %s/>\n%s'%(St,MOUTH)
L1=g('fillet','3,8.75 6.75,8.75 6.75,11 3,11','0.25,0.25,1.5,1'); L2=g('fillet','9.25,8.75 13,8.75 13,11 9.25,11','0.25,0.25,1,1.5')
SUN='<path data-filled="hole" d="%s" fill="currentColor"/>\n<path data-filled="hole" d="%s" fill="currentColor"/>\n<path data-filled="knockout" d="M6.75 10A1.25 1.25 0 0 1 9.25 10" %s/>\n%s'%(L1,L2,St,MOUTH)
def ontop(pts_top, radii, xa, xb):
    # an open outline from the hat line at xa over the given points to the hat line at xb, closed along the hat line
    pts=['%s,%s'%(f(xa),f(y_at(xa)))]+pts_top+['%s,%s'%(f(xb),f(y_at(xb)))]
    d=g('open-fillet',' '.join(pts),','.join(['0']+radii+['0']))
    return d+seg(xb,xa)+'Z'
FED=ontop(['4.25,2.5','7.25,2.5','8,3.5','8.75,2.5','11.75,2.5'],['1','0.5','0.5','0.5','1'],3.5,12.5)
KING=ontop(['2.5,3.25','5.25,4.75','8,3.25','10.75,4.75','13.5,3.25'],['0.75','0.5','0.75','0.5','0.75'],hx,16-hx)
PILOT=ontop(['1.5,1.75','14.5,1.75'],['1','1'],3,13)
WIZ='M3.25 %s C4.5 4.25 6.25 1.5 9.25 1.5C10.5 1.5 11.75 2 12.5 2.75A0.5 0.5 0 0 1 11.85 3.45C11.2 3.05 10.4 3.2 10.65 4.15L12.75 %s'%(f(y_at(3.25)),f(y_at(12.75)))+seg(12.75,3.25)+'Z'
DOME='M%s %sA5.75 4.75 0 0 1 %s %s'%(f(2.25),f(y_at(2.25)),f(13.75),f(y_at(13.75)))+seg(13.75,2.25)+'Z'  # closed along the hat line
CAPD='M%s %sA5.5 4.6 0 0 1 %s %s'%(f(2.5),f(y_at(2.5)),f(13.5),f(y_at(13.5)))
BOARD=g('fillet','8,1.5 14.5,3.25 8,5 1.5,3.25','0.5,0.5,0.5,0.5')
CHEF=g('lobes','4.25','4.75,3.25,1.75 8,3.25,1.75 11.25,3.25,1.75')
band=lambda xa,xb: '<path data-filled="knockout" d="%s" %s/>'%(curve(xa,xb,-2.25),St)
STARD='M8.135 2.221L8.415 2.788A0.05 0.05 0 0 0 8.452 2.816L9.078 2.907A0.15 0.15 0 0 1 9.161 3.163L8.708 3.604A0.05 0.05 0 0 0 8.694 3.648L8.801 4.272A0.15 0.15 0 0 1 8.583 4.43L8.023 4.136A0.05 0.05 0 0 0 7.977 4.136L7.417 4.43A0.15 0.15 0 0 1 7.199 4.272L7.306 3.648A0.05 0.05 0 0 0 7.292 3.604L6.839 3.163A0.15 0.15 0 0 1 6.922 2.907L7.548 2.816A0.05 0.05 0 0 0 7.585 2.788L7.865 2.221A0.15 0.15 0 0 1 8.135 2.221Z'

RECT='M4.5 6H11.5A2.5 2.5 0 0 1 14 8.5V11A2.5 2.5 0 0 1 11.5 13.5H4.5A2.5 2.5 0 0 1 2 11V8.5A2.5 2.5 0 0 1 4.5 6Z'
def head_open(xa,xb):
    d='M%s 6H4.5A2.5 2.5 0 0 0 2 8.5V11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V8.5A2.5 2.5 0 0 0 11.5 6H%s'%(f(xa),f(xb))
    return '<path data-filled="line" d="%s" %s/>\n<path data-filled="fill" d="%s" %s/>\n<path data-filled="gap" d="M0.5 8.375H15.5" %s/>'%(d,St,RECT,St,St)
def head_behind(front):
    d=g('behind',RECT,front)
    return '<path data-filled="line" d="%s" %s/>\n<path data-filled="fill" d="%s" %s/>'%(d,St,RECT,St)
# the crown and chef hat icons, scaled onto the head
CR_BODY='M2.5 11.5L2.5 8.101A0.75 0.75 0 0 1 3.73 7.525L4.84 8.45A0.75 0.75 0 0 0 5.956 8.271L7.364 6.018A0.75 0.75 0 0 1 8.636 6.018L10.044 8.271A0.75 0.75 0 0 0 11.16 8.45L12.27 7.525A0.75 0.75 0 0 1 13.5 8.101L13.5 11.5A1.5 1.5 0 0 1 12 13L4 13A1.5 1.5 0 0 1 2.5 11.5Z'
cs=0.55; cdy=7.25-13
CRB=g('transform',CR_BODY,str(cs),'8,13','0,%s'%cdy); CRC=g('transform','M2.5 10.5H13.5',str(cs),'8,13','0,%s'%cdy)
def tp(x,y,s_,a,dy): return (a[0]+(x-a[0])*s_, a[1]+(y-a[1])*s_+dy)
balls=[tp(x,y,cs,(8,13),cdy) for x,y in ((2.5,4.75),(8,3),(13.5,4.75))]
CROWN='<path data-filled="solid" d="%s" %s/>\n<path data-filled="cut" d="%s" %s/>\n'%(CRB,St,CRC,St)+'\n'.join('<circle cx="%s" cy="%s" r="%s" fill="currentColor"/>'%(f(x),f(y),f(cs)) for x,y in balls)
CH_P='M4.5 10.5V8.5A2.5 2.5 0 1 1 6 4A2.5 2.5 0 0 1 10 4A2.5 2.5 0 1 1 11.5 8.5V10.5Z'; CH_B='M5.5 10.5H10.5A1 1 0 0 1 11.5 11.5V12.5A1 1 0 0 1 10.5 13.5H5.5A1 1 0 0 1 4.5 12.5V11.5A1 1 0 0 1 5.5 10.5Z'
hs=0.5; hdy=7.5-13.5
CHP=g('transform',CH_P,str(hs),'8,13.5','0,%s'%hdy); CHB=g('transform',CH_B,str(hs),'8,13.5','0,%s'%hdy); CHG=g('transform','M2.5 10.5H13.5',str(hs),'8,13.5','0,%s'%hdy)
CHEFHAT='<path data-filled="solid" d="%s" %s/>\n<path data-filled="solid" d="%s" %s/>\n<path data-filled="gap" d="%s" %s/>'%(CHP,St,CHB,St,CHG,St)
CHEFSIL=CHP+CHB
# a small solid bill under the hat line
def bill(xa,xb,drop):
    ya=y_at(xa); yb=y_at(xb); mid=y_at(8)+drop; c=(4*mid-ya-yb)/2
    return '<path data-filled="solid" d="M%s %s%sQ8 %s %s %sZ" fill="currentColor"/>'%(f(xa),f(ya),seg(xa,xb),f(c),f(xa),f(ya))
GOG=g('fillet','3,8.5 13,8.5 13,11 9.25,11 8,9.75 6.75,11 3,11','1,1,1,0.5,0.75,0.5,1')
GOGGLES='<path data-filled="knockout" d="%s" %s/>\n<path d="M2 9.5H3M13 9.5H14" %s/>\n<circle data-filled="hole" cx="8" cy="12" r="0.6" fill="currentColor"/>'%(GOG,St,St)
BIGGLASSES='<circle data-filled="knockout" cx="5.25" cy="10" r="1.75" %s/>\n<circle data-filled="knockout" cx="10.75" cy="10" r="1.75" %s/>\n<path data-filled="knockout" d="M7 9.75A1.25 1.25 0 0 1 9 9.75" %s/>\n<circle data-filled="hole" cx="5.25" cy="10" r="0.5" fill="currentColor"/>\n<circle data-filled="hole" cx="10.75" cy="10" r="0.5" fill="currentColor"/>\n<circle data-filled="hole" cx="8" cy="12.4" r="0.5" fill="currentColor"/>'%(St,St,St)
BOT_HEAD='<rect data-filled="solid" x="2" y="6" width="12" height="7.5" rx="2.5" %s/>'%St

import re as _re
def affine(d,sx,sy,ax,ay,dx,dy):
    """absolute M L H V A Q C Z paths only"""
    out=[]; toks=_re.findall(r'[MLHVAQCZ]|-?[\d.]+',d); i=0; cmd=None
    X=lambda x: ax+(x-ax)*sx+dx; Y=lambda y: ay+(y-ay)*sy+dy
    while i<len(toks):
        t=toks[i]
        if t.isalpha(): cmd=t; i+=1; out.append(cmd)
        if cmd=='Z': continue
        n={'M':2,'L':2,'H':1,'V':1,'A':7,'Q':4,'C':6}[cmd]; v=[float(x) for x in toks[i:i+n]]; i+=n
        if cmd in 'MLQC': v=[X(v[k]) if k%2==0 else Y(v[k]) for k in range(n)]
        elif cmd=='H': v=[X(v[0])]
        elif cmd=='V': v=[Y(v[0])]
        elif cmd=='A': v=[v[0]*sx,v[1]*sy,v[2],v[3],v[4],X(v[5]),Y(v[6])]
        out.append(' '.join(f(x) for x in v))
    return ''.join(out)
def side_y(x): return 8.5-math.sqrt(6.25-(4.5-x)**2)
def head_from(xa):  # the head from its left corner at x = xa round to the mirror point
    ya=side_y(xa) if xa<4.5 else 6
    xb=16-xa
    if xa<4.5: d='M%s %sA2.5 2.5 0 0 0 2 8.5V11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V8.5A2.5 2.5 0 0 0 %s %s'%(f(xa),f(ya),f(xb),f(ya))
    else: d='M%s 6H4.5A2.5 2.5 0 0 0 2 8.5V11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V8.5A2.5 2.5 0 0 0 11.5 6H%s'%(f(xa),f(xb))
    return '<path d="%s" %s/>'%(d,St)
# a band on the head (chef, scholar): filled, a gap centred on its sides and foot, from just above
# the head's top line, parts it from the head
def band_cut(xa):
    xo=xa-1.1875; ya=y_at(xa)
    return '<path data-filled="gap" d="M%s 5.25V%sH%s'%(f(xo),f(ya),f(xa))+seg(xa,16-xa)+'H%sV5.25" %s/>'%(f(16-xo),St)
# crown: the crown icon stretched wider (0.9 × 0.55), bottom at 7.25
csx,csy=0.9,0.55; cay=13; cdy2=7.25-13
CRB2=affine(CR_BODY,csx,csy,8,cay,0,cdy2); CRC2=affine('M2.5 10.5H13.5',csx,csy,8,cay,0,cdy2)
cb=[(8+(x-8)*csx, cay+(y-cay)*csy+cdy2) for x,y in ((2.5,4.75),(8,3),(13.5,4.75))]
CROWN2='<path data-filled="solid" d="%s" %s/>\n<path data-filled="cut" d="%s" %s/>\n'%(CRB2,St,CRC2,St)+'\n'.join('<circle cx="%s" cy="%s" r="0.75" fill="currentColor"/>'%(f(x),f(y)) for x,y in cb)
# chef hat: the chef-hat icon a little wider than tall (0.6 × 0.5), bottom at 7.5
hsx,hsy=0.6,0.5; hdy2=7.5-13.5
CHP2=affine(CH_P,hsx,hsy,8,13.5,0,hdy2); CHB2=affine(CH_B,hsx,hsy,8,13.5,0,hdy2); CHG2=affine('M2.5 10.5H13.5',hsx,hsy,8,13.5,0,hdy2)
CHEF2='<path data-filled="solid" d="%s" %s/>\n<path data-filled="solid" d="%s" %s/>\n<path data-filled="gap" d="%s" %s/>'%(CHP2,St,CHB2,St,CHG2,St)
# baseball cap: tall crown with near-upright sides and a round top, button, seam; a crescent bill wider than the crown
CAP_CROWN=ontop(['3,3.5','8,1.75','13,3.5'],['1.5','0','1.5'],3,13)
CAP_CROWN=g('open-fillet','%s,%s 3,3.25 5,1.75 11,1.75 13,3.25 %s,%s'%(f(3),f(y_at(3)),f(13),f(y_at(13))),'0,1.5,1.5,1.5,1.5,0')+seg(13,3)+'Z'
def crescent(xa,xb,drop):
    ya=y_at(xa); yb=y_at(xb); mid=y_at(8)+drop; c=(4*mid-ya-yb)/2
    return 'M%s %s%sQ8 %s %s %sZ'%(f(xa),f(ya),seg(xa,xb),f(c),f(xa),f(ya))
CAP_BILL='<path data-filled="solid" d="%s" %s/>'%(crescent(2,14,1.5),St)
HL=-0.75; mk()
CAP_HEAD,CAP_LH=HEAD,LINE_HEAD
CAP_CROWN='M3 %sV4.5A5 3 0 0 1 13 4.5V%s'%(f(y_at(3)),f(y_at(13)))+seg(13,3)+'Z'
CAP_BILL='<path data-filled="solid" d="%s" fill="currentColor"/>'%crescent(2.5,13.5,1.5)
# military cap: a crown flaring to a wide flat top, a solid visor under the hat line
MIL_CROWN=g('open-fillet','%s,%s 1.5,3.25 2.5,2 13.5,2 14.5,3.25 %s,%s'%(f(3.5),f(y_at(3.5)),f(12.5),f(y_at(12.5))),'0,0.75,0.75,0.75,0.75,0')+seg(12.5,3.5)+'Z'
VISOR='<path d="%s" fill="currentColor"/>'%crescent(4,12,1.5)
SHIELD='<path data-filled="hole" d="%s" fill="currentColor"/>'%STARD
# filled (audit, 2026-10-01): the visor is in front of the crown, so a gap one weight above the hat
# line parts them (the crown, hat line and visor merged into one block); the stripe would meet that
# gap, so it is outline-only
STRIPE=band(3,13).replace('data-filled="knockout"','data-filled="line"')+'\n<path data-filled="gap" d="%s" %s/>'%(curve(0,16,-1.125),St)
MIL_HEAD,MIL_LH=HEAD,LINE_HEAD
HL=0; mk()
# faces: the mouth never moves (8, 11.25)
GOGGLES2='<path data-filled="knockout" d="%s" %s/>\n<path d="M2 8.75H3M13 8.75H14" %s/>\n%s'%(g('fillet','3,7.5 13,7.5 13,10.25 9.25,10.25 8,9 6.75,10.25 3,10.25','1.25,1.25,1.25,0.5,0.75,0.5,1.25'),St,St,MOUTH)
FRAMES='<path data-filled="knockout" d="%s" %s/>\n<path data-filled="knockout" d="%s" %s/>\n<path data-filled="knockout" d="M6.25 9.25H9.75" %s/>\n%s'%(g('fillet','3,8.5 6.25,8.5 6.25,10.5 3,10.5','0.75,0.75,0.75,0.75'),St,g('fillet','9.75,8.5 13,8.5 13,10.5 9.75,10.5','0.75,0.75,0.75,0.75'),St,St,MOUTH)
ANTENNA='<path d="M8 6V4.5M6.5 3.25A1.5 1.25 0 1 1 9.5 3.25A1.5 1.25 0 1 1 6.5 3.25Z" %s/>'%St
# ---- this pass ----
HL=-0.75; mk()
CAP_HEAD,CAP_LH=HEAD,LINE_HEAD
CAP_CROWN='M3 %sV5A2.5 2.5 0 0 1 5.5 2.5H10.5A2.5 2.5 0 0 1 13 5V%s'%(f(y_at(3)),f(y_at(13)))+seg(13,3)+'Z'
CAP_BILL='<path data-filled="solid" d="%s" fill="currentColor" %s/>'%(crescent(2,14,0.625),St.replace('fill="none" ',''))
CAP_BTN='<path d="M7.25 1.5H8.75" %s/>'%St
CAP_SEAM='<path data-filled="knockout" d="M8 2.5V%s" %s/>'%(f(y_at(8)),St)
STAR2=g('transform','M8.673 2.805L10.073 5.642A0.25 0.25 0 0 0 10.261 5.779L13.391 6.233A0.75 0.75 0 0 1 13.807 7.513L11.542 9.721A0.25 0.25 0 0 0 11.47 9.942L12.005 13.06A0.75 0.75 0 0 1 10.916 13.851L8.116 12.378A0.25 0.25 0 0 0 7.884 12.378L5.084 13.851A0.75 0.75 0 0 1 3.995 13.06L4.53 9.942A0.25 0.25 0 0 0 4.458 9.721L2.193 7.513A0.75 0.75 0 0 1 2.609 6.233L5.739 5.779A0.25 0.25 0 0 0 5.927 5.642L7.327 2.805A0.75 0.75 0 0 1 8.673 2.805Z','0.3','8,8.2','0,-4')
HL=0; mk()
# crown: the crown icon's own parts across the head (1.0 × 0.55)
CRB3=affine(CR_BODY,1.0,0.345,8,13,0,7-13); CRC3=affine('M2.5 10.5H13.5',1.0,0.55,8,13,0,7-13)
cb3=[(x, 13+(y-13)*0.55+7.25-13) for x,y in ((2.5,4.75),(8,3),(13.5,4.75))]
# larger balls (owner, 2026-09-30: closer to the crown icon's): ⌀1.5 floating a detail gap over a crown
# 0.345 tall, the most that leaves room; ⌀2 balls fit only on the tips (they blurred into them) or over
# a crown 0.28 tall
CROWN3='<path data-filled="solid" d="%s" %s/>\n'%(CRB3,St)+'\n'.join('<circle cx="%s" cy="%s" r="0.75" fill="currentColor"/>'%(f(x),f(y)) for x,y in ((2.5,2.75),(8,2.25),(13.5,2.75)))
# chef hat: the icon's puffs at 0.75 × 0.47 over a band whose foot follows the hat line
csx3,csy3=0.75,0.47; top_band=13.5-3; ya=y_at(8)
CHP3=affine(CH_P,csx3,csy3,8,10.5,0,5.25-10.5)
bx=3.5*csx3
CHBAND='M%s 5.25V%s'%(f(8-bx),f(y_at(8-bx)))+seg(8-bx,8+bx)+'V5.25'
CHEF3='<path data-filled="solid" d="%s" %s/>\n<path data-filled="solid" d="%s" %s/>\n<path data-filled="gap" d="M3 5.25H13" %s/>\n%s'%(CHP3,St,CHBAND,St,St,'<path d="%s" %s/>'%(curve(8-bx,8+bx),St))
# researcher: bot's head behind wide goggles
def head_behind_rect(front):
    d=g('behind',RECT,front,'0.01')
    return '<path d="%s" %s/>'%(d,St)
G1=g('fillet','1.5,7.5 14.5,7.5 14.5,10.25 9.25,10.25 8,9 6.75,10.25 1.5,10.25','1.25,1.25,1.25,0.5,0.75,0.5,1.25')
def researcher(front, extra, mouth=True):
    return head_behind_rect(front), ANTENNA, extra+('\n'+MOUTH if mouth else '')
cast={
 'agent':('Agent (fedora with a band, sunglasses)',HEAD,'<path data-filled="solid" d="%s" %s/>\n%s\n%s'%(FED,St,LINE_FULL,band(4.85,11.15)), SUN),
 'builder':('Builder (hard hat)',HEAD,'<path data-filled="solid" d="%s" %s/>\n%s\n<path data-filled="knockout" d="M6.5 2.5V4.5M9.5 2.5V4.5" %s/>'%(DOME,St,LINE_FULL,St), EYES),
 'researcher':('Researcher (bot in lab goggles wider than its head)',)+researcher(G1,'<path d="%s" %s/>'%(G1,St),mouth=False),
 'scholar':('Scholar (mortarboard)',HEAD,'<path data-filled="solid" d="%s" %s/>\n<path d="M4 3.923V%sM12 3.923V%s" %s/>\n%s'%(BOARD,St,f(y_at(4)),f(y_at(12)),St,LINE_HEAD), EYES),
 #'guard-star':('Guard, A: military cap, a larger star set lower',MIL_HEAD,'<path data-filled="solid" d="%s" %s/>\n%s\n%s\n<path data-filled="hole" d="%s" fill="currentColor"/>'%(MIL_CROWN,St,MIL_LH,VISOR,STAR2), EYES),
 'guard-stripe':('Guard (military cap with a stripe, a visor narrower than the crown)',MIL_HEAD,'<path data-filled="solid" d="%s" %s/>\n%s\n%s\n%s'%(MIL_CROWN,St,MIL_LH,VISOR,STRIPE), EYES),
 'lead':('Lead (crown from the crown icon, full width, no band)',head_from(2.5),CROWN3, EYES),
 'designer':('Designer (baseball cap: rounded corners, flat top, button, a bill wider than the head)',CAP_HEAD,'<path data-filled="solid" d="%s" %s/>\n%s\n%s\n%s'%(CAP_CROWN,St,CAP_BTN,CAP_SEAM,CAP_BILL), EYES),
 'generator':('Generator (wizard hat, band, bent tip)',HEAD,'<path data-filled="solid" d="%s" %s/>\n%s\n%s'%(WIZ,St,LINE_FULL,band(5.25,10.25)), EYES),
 'automator':('Automator (the chef hat icon, larger, band on the hat line)',head_from(8-3.5*csx3),CHEF3, EYES),
}

# ---- explorations without a mouth ----
FEDHAT='<path data-filled="solid" d="%s" %s/>\n%s\n%s'%(FED,St,LINE_FULL,band(4.85,11.15))
def fil(pts,r): return g('fillet',pts,r)
def mir(d): return g('mirror',d)
def hole(d): return '<path d="%s" fill="currentColor"/>'%d  # the lenses stay solid when filled
def ko(d): return '<path data-filled="knockout" d="%s" %s/>'%(d,St)
wl=fil('2.75,8.5 7,8.5 6.5,11 3.5,11','0.5,0.5,1,1')
av=fil('3,8.75 7,8.75 6.5,10.75 4.5,11.5 3,10.25','0.5,0.5,1,1.25,0.75')
sl=fil('3,9.25 7,9.25 7,10.75 3,10.75','0.5,0.5,0.5,0.5')
ce=fil('2.75,8.25 7,9 6.75,10.75 4,11 3,9.75','0.5,0.5,1,1,0.5')
shield=fil('3.5,9 12.5,9 12,11.5 9.75,11.5 8,9.75 6.25,11.5 4,11.5','0.5,0.5,1,0.5,0.5,0.5,1')
sun={
 'wayfarer':('wayfarers: tapered lenses under one top bar', hole(wl)+'\n'+hole(mir(wl))+'\n'+ko('M6.75 8.75H9.25')),
 'aviator':('aviators: teardrop lenses, an arched bridge', hole(av)+'\n'+hole(mir(av))+'\n'+ko('M7 9.25A1.25 1.25 0 0 1 9 9.25')),
 'round':('round lenses, an arched bridge', '<circle data-filled="hole" cx="5" cy="10" r="1.9" fill="currentColor"/>\n<circle data-filled="hole" cx="11" cy="10" r="1.9" fill="currentColor"/>\n'+ko('M6.75 9.5A1.5 1.5 0 0 1 9.25 9.5')),
 'shield':('one wrap-around shield lens with a nose dip', hole(shield)),
 'slim':('slim rectangles, a straight bridge', hole(sl)+'\n'+hole(mir(sl))+'\n'+ko('M7 9.75H9')),
 'sport':('upswept sport lenses', hole(ce)+'\n'+hole(mir(ce))+'\n'+ko('M7 9.5H9')),
}
extras={}
cast['agent']=('Agent (fedora with a band, wrap-around sunglasses)',HEAD,FEDHAT,sun['shield'][1])
extras['agent-sun-round']=('Agent sunglasses: '+sun['round'][0],HEAD,FEDHAT,sun['round'][1])
G2rings='M3 9.25A2 2 0 1 1 7 9.25A2 2 0 1 1 3 9.25ZM9 9.25A2 2 0 1 1 13 9.25A2 2 0 1 1 9 9.25Z'
G3=fil('3,7.75 13,7.75 13,10.25 3,10.25','1,1,1,1')
G6=fil('2.5,4.75 13.5,4.75 13.5,7.25 2.5,7.25','1,1,1,1')
gog={
 'wide':('one wide frame over the head, a nose notch', G1, '<path d="%s" %s/>'%(G1,St), True),
 'swim':('two round lenses, straps past the head', G2rings+'M1.5 9.25H3M13 9.25H14.5', '<path d="%s" %s/>\n<path d="M1.5 9.25H3M7 9.25H9M13 9.25H14.5" %s/>'%(G2rings,St,St), True),
 'strap':('a frame inside the head, a strap across it', G3, '<path d="%s" %s/>\n<path d="M1.5 8.75H3M13 8.75H14.5" %s/>'%(G3,St,St), True),
 'split':('a wide frame split into two lenses', G1, '<path d="%s" %s/>\n<path d="M8 7.5V9" %s/>'%(G1,St,St), True),
 'dark':('solid lenses in a wide frame', G1, '<path d="%s" fill="currentColor"/>'%G1, True),
 'forehead':('pushed up on the forehead, eyes showing', G6, '<path d="%s" %s/>\n<path data-filled="knockout" d="M5 9V10.5M11 9V10.5" %s/>'%(G6,St,St), False),
}
for k,(lab,front,draw,_) in gog.items():
    hd,ant,_f=researcher(front,draw,mouth=False)
    extras['researcher-gog-'+k]=('Researcher goggles, no mouth: '+lab,hd,ant,draw)
# ---- owner, 2026-09-30 ----
# baseball cap (owner's reference): a brim arched over the face, its ends curving down to the head's sides
def par(xa,ya,ym,xe):  # the parabola through (xa,ya) with its vertex at (8,ym), as a quadratic from xe to 16-xe
    a=(ya-ym)/(8-xa)**2; ye=ym+a*(8-xe)**2
    return 'M%s %sQ8 %s %s %s'%(f(xe),f(ye),f(2*ym-ye),f(16-xe),f(ye))
BT,BB,BE=5.5,6.375,8.25   # brim top and bottom at the centre, its ends at x 2 and 14
def ptop(x): return BT+(BE-BT)*((x-8)/6)**2
BRIM='M2 %sQ8 %s 14 %sQ8 %s 2 %sZ'%(f(BE),f(2*BT-BE),f(BE),f(2*BB-BE),f(BE))
yc=ptop(3)
def ptop_seg(xa,xb):  # the brim's top from xa to xb, as a quadratic sub-curve
    a=(BE-BT)/36; yA=ptop(xa); yB=ptop(xb); cx=(xa+xb)/2; cy=yA+2*a*(xa-8)*(cx-xa)
    return 'Q%s %s %s %s'%(f(cx),f(cy),f(xb),f(yB))
# the first cap's crown (upright sides, r 2.5 corners, flat top), its sides on the head's sides (owner, 2026-09-30)
CX=2; yc=ptop(CX)
# its sides curve in very slightly toward the top (owner, 2026-09-30): one curve each side, vertical at the brim
CAP4='M%s %sC%s 5.25 %s 2.5 %s 2.5H%sC%s 2.5 %s 5.25 %s %s'%(f(CX),f(yc),f(CX),f(CX+0.25),f(CX+2.5),f(16-CX-2.5),f(16-CX-0.25),f(16-CX),f(16-CX),f(yc))+ptop_seg(16-CX,CX)+'Z'
DES_HEAD='<path data-filled="line" d="M2 %sV11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V%s" %s/>\n<path data-filled="fill" d="M2 %sV11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V%sQ8 %s 2 %sZ" %s/>\n<path data-filled="gap" d="%s" %s/>'%(f(BE),f(BE),St,f(BE),f(BE),f(2*BB-BE),f(BE),St,par(2,BE+0.25,BB+0.25,0.5),St)
DES_HEAD='<path d="M2 %sV11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V%s" %s/>'%(f(BE),f(BE),St)
DES_HAT='<path data-filled="solid" d="%s" %s/>\n<path data-filled="gap" d="%s" %s/>\n%s\n<path data-filled="line" d="M8 2.5V%s" %s/>\n<path data-filled="solid" d="%s" %s/>'%(CAP4,St,par(2,BE-1.1875,BT-1.1875,1),St,CAP_BTN,f(BT),St,BRIM,St)
cast['designer']=('Designer (baseball cap, the brim arched and curving down at the sides)',DES_HEAD,DES_HAT,EYES)
# researcher: taller goggles set lower (7.5–10.25 → 8–11.5), detail gaps to the head's top and bottom
G7=fil('1.5,8 14.5,8 14.5,11.5 9.25,11.5 8,10.25 6.75,11.5 1.5,11.5','1.25,1.25,1.25,0.5,0.75,0.5,1.25')
# filled: the goggles stay whole in front; the head behind is cut one weight outside their top and bottom edges
G7GAP='<path data-filled="gap" d="M0.5 6.8125H15.5" %s/>\n<path data-filled="gap" d="M0.5 12.6875H7.243L8 11.93L8.757 12.6875H15.5" %s/>'%(St,St)
cast['researcher']=('Researcher (taller lab goggles, set lower)',)+researcher(G7,'<path data-filled="solid" d="%s" %s/>'%(G7,St),mouth=False)
# chef hat: round puffs (circles, not the icon squashed) on a band as wide as their foot; the foot
# at 4 keeps the side puffs 2 clear of the head's top, the band's sides on the grid at 5 and 11
PUFF=g('lobes','4','5,2.75,1.25 8,3.5,2 11,2.75,1.25').replace(' 2.559',' 2.56')  # the meet rounded up, so the top lobe's crown stays on 1.5
bx4=3
CHBAND4='M%s 4V%s'%(f(8-bx4),f(y_at(8-bx4)))+seg(8-bx4,8+bx4)+'V4'
CHEF4='<path data-filled="solid" d="%s" %s/>\n<path data-filled="solid" d="%s" %s/>\n<path data-filled="gap" d="M2.5 4H13.5" %s/>\n<path data-filled="line" d="%s" %s/>'%(PUFF,St,CHBAND4,St,St,curve(8-bx4,8+bx4),St)
cast['automator']=('Automator (chef hat: round puffs, band on the hat line)',head_from(8-bx4),CHEF4,EYES)
# scholar sizes (owner, 2026-09-30): a board W wide and H tall on a skull cap whose sides stand at
# 8 ± sk; below the largest size the head stays whole, as the chef's does, the cap sitting on its top
def scholar(W,H,top,sk):
    mid=top+H/2; bot=top+H
    board=g('fillet','8,%s %s,%s 8,%s %s,%s'%(f(top),f(8+W/2),f(mid),f(bot),f(8-W/2),f(mid)),'0.5,0.5,0.5,0.5')
    ytop=lambda x: mid+(H/2)*(1-abs(x-8)/(W/2))
    xa,xb=8-sk,8+sk
    band='M%s %sV%s'%(f(xa),f(ytop(xa)),f(y_at(xa)))+seg(xa,xb)+'V%s'%f(ytop(xb))
    o=1.1875
    gap='M%s %sL8 %sL%s %s'%(f(8-W/2-1),f(mid+o+1*H/W),f(bot+o),f(8+W/2+1),f(mid+o+1*H/W))
    hat='<path data-filled="solid" d="%s" %s/>\n<path data-filled="gap" d="%s" %s/>\n<path data-filled="solid" d="%s" %s/>'%(band,St,gap,St,board,St)
    return head_from(xa), hat
# owner chose M (2026-09-30); S (10, 3, 2, 3) and XS (8, 2.5, 2.75, 2.5) were the other sizes
hd,hat=scholar(12,3.25,1.5,3.5)
cast['scholar']=('Scholar (mortarboard 12 wide on a skull cap, the head whole)',hd,hat,EYES)
cast.update(extras)
# the owner's cast (2026-09-30) as real icons: bot-<role>
REAL={'agent':'bot-agent','builder':'bot-builder','researcher':'bot-researcher','scholar':'bot-scholar','guard-stripe':'bot-guard','lead':'bot-lead','designer':'bot-designer','generator':'bot-generator','automator':'bot-automator'}
for k,(label,hd,hat,face) in cast.items():
    svg='<svg data-set="area-pilot" data-keyline="square" data-angles="free" data-dot="free" data-counter="sliver" data-group="agent" data-label="%s" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n%s\n%s\n%s\n</svg>\n'%(label,hd,hat,face)
    if k in REAL:
        # only the exceptions each bot needs (audit, 2026-10-01): free angles for the hats' slants,
        # the wizard tip's sliver pockets; no free dots
        need={'builder':'','designer':'','automator':'','generator':' data-angles="free" data-counter="sliver"'}.get(k,' data-angles="free"')
        real=svg.replace(' data-group="agent" data-label="%s"'%label,'').replace(' data-angles="free" data-dot="free" data-counter="sliver"',need).replace('data-keyline="square"','data-keyline="circle"')
        open('apps/docs/assets/area-icons-pilot/%s.svg'%REAL[k],'w').write(real)
    elif k.startswith('agent-sun') or k.startswith('researcher-gog'):
        continue  # settled 2026-09-30
    else:
        open('apps/docs/assets/area-icons-pilot/explore/agent-cast-%s.svg'%k,'w').write(svg)
