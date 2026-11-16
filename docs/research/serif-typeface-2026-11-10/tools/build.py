import json, base64, io
from PIL import Image
figs=json.load(open('figs.json'))
src=open('plan.src.html').read()
for k,v in figs.items(): src=src.replace('{{%s}}'%k,'data:image/png;base64,'+v)
im=Image.open('img/6_nodes_lc.png').crop((0,180,1800,1440)).resize((1200,840),Image.LANCZOS).convert('P',palette=Image.ADAPTIVE,colors=16)
b=io.BytesIO(); im.save(b,'PNG',optimize=True); print('nodes',len(b.getvalue())//1024)
src=src.replace('{{nodes}}','data:image/png;base64,'+base64.b64encode(b.getvalue()).decode())
# metrics svg
cols=[('Georgia Pro',dict(desc=-217,xh=481,cap=693,asc=756,bt=917,bb=-219),'var(--ink)'),('Serrif',dict(desc=-195,xh=498,cap=721,asc=729,bt=910,bb=-225),'var(--handle)'),('Area Serif',dict(desc=-210,xh=500,cap=700,asc=742,bt=950,bb=-250),'var(--prop)')]
sc=0.24; top=20; W=780; H=int((960+270)*sc)+top+30
Y=lambda v: top+(960-v)*sc
s=['<svg viewBox="0 0 %d %d" width="%d" style="max-width:none;display:block" role="img" aria-label="Vertical metrics of Georgia Pro, Serrif and the proposal">'%(W,H,W)]
for i,(nm,m,c) in enumerate(cols):
    x=20+i*255
    s.append('<rect x="%d" y="%.1f" width="150" height="%.1f" fill="none" stroke="var(--rule)" stroke-dasharray="3 3"/>'%(x,Y(m['bt']),(m['bt']-m['bb'])*sc))
    s.append('<rect x="%d" y="%.1f" width="150" height="%.1f" fill="%s" opacity=".12"/>'%(x,Y(m['xh']),m['xh']*sc,c))
    for key,lab in (('asc','ascender'),('cap','cap'),('xh','x-height'),('desc','descender')):
        s.append('<line x1="%d" x2="%d" y1="%.1f" y2="%.1f" stroke="%s" stroke-width="1.5"/>'%(x,x+150,Y(m[key]),Y(m[key]),c))
    s.append('<line x1="%d" x2="%d" y1="%.1f" y2="%.1f" stroke="%s" stroke-width="2.5"/>'%(x,x+150,Y(0),Y(0),c))
    # labels, avoid overlap of asc/cap
    ya=Y(m['asc'])-3; yc=Y(m['cap'])+12
    s.append('<text x="%d" y="%.1f">asc %d</text>'%(x+156,ya,m['asc']))
    s.append('<text x="%d" y="%.1f">cap %d</text>'%(x+156,yc,m['cap']))
    s.append('<text x="%d" y="%.1f">x %d</text>'%(x+156,Y(m['xh'])+4,m['xh']))
    s.append('<text x="%d" y="%.1f">0</text>'%(x+156,Y(0)+4))
    s.append('<text x="%d" y="%.1f">desc %d</text>'%(x+156,Y(m['desc'])+4,m['desc']))
    s.append('<text x="%d" y="%.1f">line box %d / %d</text>'%(x,Y(m['bb'])+16,m['bt'],m['bb']))
    s.append('<text x="%d" y="14" style="fill:var(--ink);font-weight:500">%s</text>'%(x,nm))
s.append('</svg>'); src=src.replace('{{metrics_svg}}',''.join(s))
# stem chart
ser=[('var(--ink)',[(300,57),(400,91),(600,125),(700,160),(900,208)]),('var(--handle)',[(100,36),(300,68),(400,86),(500,111),(600,130),(700,158),(900,186)]),('var(--prop)',[(300,62),(400,88),(500,106),(600,126),(700,150),(800,176)])]
W=640;H=280;L=44;B=30;T=12;R=16
X=lambda w: L+(w-100)/800*(W-L-R); Yv=lambda v: T+(220-v)/220*(H-T-B)
s=['<svg viewBox="0 0 %d %d" width="%d" style="max-width:100%%;height:auto;display:block" role="img" aria-label="Stem thickness by weight">'%(W,H,W)]
for v in (0,50,100,150,200):
    s.append('<line x1="%d" x2="%d" y1="%.1f" y2="%.1f" stroke="var(--rule)"/><text x="%d" y="%.1f" text-anchor="end">%d</text>'%(L,W-R,Yv(v),Yv(v),L-6,Yv(v)+4,v))
for w in range(100,901,100): s.append('<text x="%.1f" y="%d" text-anchor="middle">%d</text>'%(X(w),H-10,w))
for c,pts in ser:
    s.append('<polyline fill="none" stroke="%s" stroke-width="2" points="%s"/>'%(c,' '.join('%.1f,%.1f'%(X(w),Yv(v)) for w,v in pts)))
    for w,v in pts: s.append('<circle cx="%.1f" cy="%.1f" r="3" fill="%s"/>'%(X(w),Yv(v),c))
s.append('</svg>'); src=src.replace('{{stem_svg}}',''.join(s))
research='''
<ul>
<li><strong>Serifs neither help nor hurt reading by themselves.</strong> Arditi and Cho (2005) varied only serif size and found no difference in reading speed. So the serifs here are character, and their one technical duty is to survive rendering: thick enough to stay black, short enough not to crowd.</li>
<li><strong>Screen faces run large in the x-height, but not extreme.</strong> Legge and Bigelow (2011) measured a mean x-height of 0.45 of the body for 51 text serifs, 0.49 for print faces adapted to screens and 0.52 for faces designed for screens; Georgia is 0.48. Roboto Serif's text design is 0.508 with a cap height of 0.710. The target of 0.500 and 0.700 sits inside that group.</li>
<li><strong>Georgia was drawn from the pixel up.</strong> Carter designed it for one-bit rendering. Microsoft's notes list the departures from its Scotch model: lighter capitals, larger x-height, ascenders above the cap height. Carter also says its bold is “bolder than most bolds” only because a stem had to jump from one pixel to two. That constraint is gone, which is why the new Bold is lighter.</li>
<li><strong>Serrif states the same aims for a newer context.</strong> Displaay describes it (released September 2025) as optimized for smaller sizes and long text, with “vertical stress axis, lower contrast and thicker serifs”, built on the construction of their sans. Its spacing and kerning were done by a specialist, which explains the 25,000 kerning records.</li>
<li><strong>Optical size is how current screen serifs solve small and large at once.</strong> Source Serif 4, Literata, Newsreader, Roboto Serif and Apple's New York all carry it. Small designs get sturdier details, wider letters and looser fit. Apple's own tracking table for New York adds 6 thousandths at 12 pt and reaches zero at 15 pt, which matches the 4% looser text fit planned here.</li>
<li><strong>Details can be simplified without losing the genre.</strong> Roboto Serif's designer asked whether ball terminals need to be balls and reduced them to upright rectangles. Charter cut curves for 300 dpi printers. Tiempos Text shortened capitals and ascenders and lowered contrast. Teardrops at text size follow that line and stop short of it.</li>
<li><strong>Letter-level findings</strong> (Beier and Larson, 2010): a two-story a is recognized better than a one-story a; wider j l t f beat narrow ones; an open c showed no measurable gain and only a very closed e was worse. So a stays two-story by default, f t l j get generous widths and feet, and the open apertures are kept for texture, not claimed as proven.</li>
<li><strong>Loose spacing has limits.</strong> Extra-wide letter spacing does not increase reading speed (Yu et al., 2007, in Legge and Bigelow). The text fit is slightly open, not tracked out.</li>
<li><strong>Rendering today.</strong> Windows and FreeType only snap vertically; Google recommends shipping variable fonts unhinted; glyf outlines are the web format because variable CFF2 support is uneven. One pixel is 77 units at 13 px, so any stroke under about 40 units is under half a pixel.</li>
</ul>'''
sources='''<ul>
<li><a href="https://learn.microsoft.com/en-us/typography/font-list/georgia">Microsoft Typography: Georgia</a>, <a href="https://learn.microsoft.com/en-us/typography/font-list/georgia-pro">Georgia Pro</a>; <a href="https://www.myfonts.com/pages/newsletters-cc-201310">Matthew Carter interview, 2013</a></li>
<li><a href="https://displaay.net/typeface/serrif">Displaay: Serrif</a>, <a href="https://displaay.net/info/license">licence terms</a></li>
<li><a href="https://legge.dl8.umn.edu/sites/legge.psych.umn.edu/files/2020-08/Legge%20Bigelow%202011%20Does%20size%20matter%20for%20reading%3F%20A%20review%20of%20findings%20from%20vision%20science%20and%20typography.pdf">Legge and Bigelow 2011</a>; <a href="https://www.microsoft.com/en-us/research/uploads/prod/2021/06/Beier-Larson-2010-Design-Improvements-for-Frequently-Misrecognized-Letters.pdf">Beier and Larson 2010</a>; Arditi and Cho 2005, Vision Research 45</li>
<li><a href="https://static.googleusercontent.com/media/fonts.google.com/en/us/specimen/Roboto-Serif.pdf">Roboto Serif specimen</a>; <a href="https://blog.adobe.com/en/publish/2021/03/04/source-serif-gets-optical-sizes">Source Serif optical sizes</a>; <a href="https://developer.apple.com/design/human-interface-guidelines/typography">Apple typography guidelines</a>; <a href="https://klim.co.nz/blog/tiempos-design-information/">Tiempos design notes</a></li>
<li><a href="https://googlefonts.github.io/gf-guide/metrics.html">Google Fonts: vertical metrics</a>, <a href="https://googlefonts.github.io/gf-guide/variable.html">variable fonts</a>, <a href="https://github.com/googlefonts/glyphsets">glyph sets</a>; <a href="https://learn.microsoft.com/en-us/typography/opentype/spec/dvaraxistag_opsz">OpenType: optical size axis</a>, <a href="https://learn.microsoft.com/en-us/typography/opentype/spec/stat">style attributes</a></li>
<li><a href="https://glyphsapp.com/learn/drawing-good-paths">Drawing good paths</a>, <a href="https://glyphsapp.com/learn/spacing">spacing</a>, <a href="https://glyphsapp.com/learn/kerning">kerning</a>; <a href="https://github.com/fonttools/fontspector">fontspector</a>; <a href="https://developer.chrome.com/blog/css-text-box-trim">CSS text-box-trim</a></li>
</ul>
<p>Not confirmed from a primary source: how current Safari maps font size to the optical size axis; whether fontmake flags overlaps in variable fonts by default (to be tested on macOS); numeric confusion rates for I l 1 and rn m.</p>'''
src=src.replace('{{research}}',research).replace('{{sources}}',sources)
assert '{{' not in src, src[src.index('{{'):src.index('{{')+40]
open('area-serif-plan.html','w').write(src); print(len(src)//1024,'KB')
