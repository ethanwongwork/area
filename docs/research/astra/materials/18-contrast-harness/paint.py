"""Task 18: finite sRGB source-over model, NOT a DOM/CSS renderer.

Opaque constant ink; solid RGBA body; at most one premultiplied sRGB linear
gradient behind the ink; opaque RGB-box backdrop. Unsupported input raises
Unresolved. Uniform backdrops remain adversaries at every blur radius.
"""
from dataclasses import dataclass
from itertools import product
import math

class Unresolved(ValueError):
    pass

def rgb(hex_color):
    if not isinstance(hex_color, str) or len(hex_color) != 7 or hex_color[0] != '#':
        raise Unresolved('Only opaque #rrggbb source colors are supported')
    try:
        return tuple(int(hex_color[i:i+2], 16)/255 for i in (1, 3, 5))
    except ValueError as error:
        raise Unresolved('Invalid hex color') from error

def linear(c):
    return c/12.92 if c <= .04045 else ((c+.055)/1.055)**2.4

def luminance(c):
    return sum(w*linear(v) for w,v in zip((.2126,.7152,.0722),c))

def contrast(a,b):
    a,b=luminance(a),luminance(b)
    return (max(a,b)+.05)/(min(a,b)+.05)

def mix(a,b,t):
    return tuple(x+(y-x)*t for x,y in zip(a,b))

def over(color,alpha,backdrop):
    return tuple(alpha*s+(1-alpha)*b for s,b in zip(color,backdrop))

def valid_unit(value):
    return isinstance(value,(int,float)) and math.isfinite(value) and 0 <= value <= 1

@dataclass(frozen=True)
class Stop:
    position: float
    color: tuple
    alpha: float

@dataclass(frozen=True)
class Paint:
    body: tuple
    alpha: float = 1
    stops: tuple = ()
    low: tuple = (0.,0.,0.)
    high: tuple = (1.,1.,1.)
    space: str = 'srgb'
    blend: str = 'source-over'

    def __post_init__(self):
        if self.space != 'srgb' or self.blend != 'source-over':
            raise Unresolved('Unsupported interpolation/compositing space or blend')
        colors=[self.body,self.low,self.high]+[s.color for s in self.stops]
        if any(len(c)!=3 or not all(map(valid_unit,c)) for c in colors):
            raise Unresolved('RGB colors must be finite in-gamut triples')
        if not valid_unit(self.alpha) or any(not valid_unit(s.alpha) for s in self.stops):
            raise Unresolved('Alpha must be in [0,1]')
        if any(a>b for a,b in zip(self.low,self.high)):
            raise Unresolved('Invalid backdrop box')
        if self.stops and (len(self.stops)<2 or self.stops[0].position!=0 or self.stops[-1].position!=1
            or any(not valid_unit(s.position) for s in self.stops)
            or any(a.position>=b.position for a,b in zip(self.stops,self.stops[1:]))):
            raise Unresolved('Need strictly increasing stops spanning [0,1]; hard stops unresolved')

    def sample(self,backdrop,position=0):
        ground=over(self.body,self.alpha,backdrop)
        if not self.stops:
            return ground
        a,b=next(((a,b) for a,b in zip(self.stops,self.stops[1:])
                  if a.position<=position<=b.position), (None,None))
        if a is None:
            raise Unresolved('Gradient position outside [0,1]')
        t=(position-a.position)/(b.position-a.position)
        alpha=a.alpha+(b.alpha-a.alpha)*t
        # Interpolate premultiplied channels. Do not leak hue from transparent stops.
        premult=mix(tuple(v*a.alpha for v in a.color),tuple(v*b.alpha for v in b.color),t)
        return tuple(v+(1-alpha)*g for v,g in zip(premult,ground))

def luminance_extrema(paint,backdrop,start,end):
    # Each composed channel is affine within a premultiplied gradient segment.
    # Split at every sRGB transfer knee rather than assuming its rounded
    # piecewise constants produce a perfectly continuous/convex join.
    c0=paint.sample(backdrop,start); c1=paint.sample(backdrop,end)
    slope=tuple(b-a for a,b in zip(c0,c1))
    breaks=[0.,1.]
    for c,d in zip(c0,slope):
        if d and 0 < (t:=(.04045-c)/d) < 1: breaks.append(t)
    breaks=sorted(set(breaks)); candidates=list(breaks)
    def derivative(t):
        c=mix(c0,c1,t)
        return sum(w*d*(1/12.92 if v<=.04045 else 2.4/1.055*((v+.055)/1.055)**1.4)
                   for w,d,v in zip((.2126,.7152,.0722),slope,c))
    for a,b in zip(breaks,breaks[1:]):
        lo=math.nextafter(a,b); hi=math.nextafter(b,a)
        candidates.extend([lo,hi])
        if derivative(lo)<0<derivative(hi):
            for _ in range(64):
                t=(lo+hi)/2
                if derivative(t)<0: lo=t
                else: hi=t
            candidates.append((lo+hi)/2)
    evaluate=lambda t:luminance(paint.sample(backdrop,start+(end-start)*t))
    return tuple(start+(end-start)*pick(candidates,key=evaluate) for pick in (min,max))

def worst(ink,paint,threshold):
    """Grid witnesses + continuous extrema/root search over the whole RGB box.

    PASS is conditional on this mathematical model. Ratios within 1e-8 of
    the floor are UNRESOLVED, never rounded up. No formal float proof claimed.
    """
    if len(ink)!=3 or not all(map(valid_unit,ink)):
        raise Unresolved('Foreground must be constant opaque in-gamut RGB')
    if not math.isfinite(threshold) or threshold<1:
        raise Unresolved('Invalid threshold')
    positions=([s.position for s in paint.stops] if paint.stops else [0.,1.])
    candidates=[]
    def record(backdrop,x,method):
        ground=paint.sample(backdrop,x)
        candidates.append((contrast(ink,ground),backdrop,x,ground,method))
    # Explicit sampling is also an independent sanity check on the minimizer.
    for n in range(17):
        backdrop=mix(paint.low,paint.high,n/16)
        for a,b in zip(positions,positions[1:]):
            for j in range(17): record(backdrop,a+(b-a)*j/16,'grid')
    for backdrop in product(*zip(paint.low,paint.high)):
        for x in positions: record(backdrop,x,'rgb-box-vertex')
    target=luminance(ink)
    for a,b in zip(positions,positions[1:]):
        xlo,_=luminance_extrema(paint,paint.low,a,b)
        _,xhi=luminance_extrema(paint,paint.high,a,b)
        lower=luminance(paint.sample(paint.low,xlo))
        upper=luminance(paint.sample(paint.high,xhi))
        record(paint.low,xlo,'continuous-minimum'); record(paint.high,xhi,'continuous-maximum')
        if lower<=target<=upper:
            # A continuous path through backdrop AND gradient coordinates joins
            # the extrema. Intermediate value theorem supplies a 1:1 witness.
            lo=0.; hi=1.
            for _ in range(64):
                t=(lo+hi)/2
                backdrop=mix(paint.low,paint.high,t); x=xlo+(xhi-xlo)*t
                if luminance(paint.sample(backdrop,x))<target: lo=t
                else: hi=t
            t=(lo+hi)/2
            record(mix(paint.low,paint.high,t),xlo+(xhi-xlo)*t,'interior-equal-luminance')
    ratio,backdrop,x,ground,method=min(candidates,key=lambda c:c[0])
    if abs(ratio-threshold)<=1e-8: status='UNRESOLVED'
    else: status='PASS' if ratio>threshold else 'FAIL'
    return dict(status=status,ratio=ratio,backdrop=list(backdrop),position=x,
                ground=list(ground),method=method,samples=len(candidates))
