# The slash crosses flat (owner, 2026-10-02, Cursor's "no shadow effects"): each slashed icon's
# outline is its base drawn whole (outline-only `line` roles) under the shared slash; the filled
# variant keeps its filled-only fill and gap, so the slash stays parted from the solid.
# Run from the repository root: python3 docs/research/icon-review/2026-10-02/flat-slash.py
import re
P = 'apps/docs/assets/area-icons-pilot/'
BASES = {'bell-off': 'bell', 'bug-off': 'bug', 'brain-off': 'brain', 'camera-off': 'camera', 'cloud-off': 'cloud',
         'flask-off': 'flask', 'link-off': 'link', 'mic-off': 'mic', 'star-off': 'star', 'unpin': 'pushpin',
         'video-off': 'video', 'wifi-off': 'wifi'}
FILLED_ONLY = ('fill', 'gap', 'stroke', 'halo')
el = re.compile(r'<(path|circle|rect)\b[^>]*/>')
for off, base in BASES.items():
    src = open(P + off + '.svg').read()
    head = src.split('\n')[0]
    # keep everything the filled variant draws: filled-only parts, knockouts, and the plain lines
    # (legs, stands, needles) that stay lines when filled; drop only the outline-only `line` pieces.
    # In the outline the kept plain lines lie on the whole base, so the outline reads whole.
    keep = [e.group(0) for e in el.finditer(src) if 'data-filled="line"' not in e.group(0)]
    slash = [e for e in keep if 'M2 2L14 14' in e]
    keep = [e for e in keep if 'M2 2L14 14' not in e]
    outline = []
    for e in el.finditer(open(P + base + '.svg').read()):
        e = e.group(0)
        m = re.search(r'data-filled="([a-z]+)"', e)
        if m and m.group(1) in FILLED_ONLY: continue
        if m: e = e.replace(m.group(0), 'data-filled="line"')
        else: e = re.sub(r'^<(path|circle|rect)', r'<\1 data-filled="line"', e)
        outline.append(e)
    if off in ('camera-off', 'flask-off', 'unpin') and 'data-counter' not in head:
        head = head.replace('<svg data-set="area-pilot"', '<svg data-set="area-pilot" data-counter="sliver"')  # the slash's sliver (mic-off's exception)
    if off == 'video-off': head = re.sub(r'data-keyline="[a-z]+"', 'data-keyline="circle"', head)  # whole video under the slash
    open(P + off + '.svg', 'w').write('\n'.join([head] + outline + keep + slash + ['</svg>']) + '\n')
    print(off, len(outline), 'outline from', base, '+', len(keep), 'filled parts')
