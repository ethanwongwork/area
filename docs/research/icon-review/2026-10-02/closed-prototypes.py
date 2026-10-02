# Cursor's "technical look" on Area (2026-10-02, for the owner's decision): where today's drawing
# opens a shape or cuts a gap to show overlap, close it. Objects in front of others hide them with a
# join (the back edges run into the front outline, as the multiples now do); geometric shapes that
# overlap are both drawn whole and cross. Writes explore candidates (group "closed-<icon>").
# Run from the repository root: python3 docs/research/icon-review/2026-10-02/closed-prototypes.py
import subprocess
def g(*a): return subprocess.check_output(['node', 'apps/docs/scripts/icon-geometry.mjs', *a]).decode().strip().splitlines()[-1]
St = 'fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"'
P = 'apps/docs/assets/area-icons-pilot/explore/'
circle = lambda cx, cy, r: 'M%g %gA%g %g 0 1 0 %g %gA%g %g 0 1 0 %g %gZ' % (cx - r, cy, r, r, cx + r, cy, r, r, cx - r, cy)
def write(name, label, keyline, body, extra=''):
    open(P + 'closed-%s.svg' % name, 'w').write('<svg data-set="area-pilot" data-keyline="%s"%s data-group="closed-%s" data-label="%s" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n%s\n</svg>\n' % (keyline, extra, name, label, '\n'.join(body)))

# shapes: both shapes whole, crossing (Cursor's ✓)
write('shapes', 'circle and square both whole, crossing', 'square', [
    '<rect data-filled="solid" x="6.5" y="6.5" width="7" height="7" rx="1.5" %s/>' % St,
    '<circle cx="6" cy="6" r="3.5" %s/>' % St])

# coins: the back coin hides behind the front one with a join (no gap)

write('coins', 'back coin joins the front (no gap)', 'square', [
    '<circle data-filled="solid" cx="6" cy="6" r="4" %s/>' % St,
    '<path d="M6 10A4 4 0 1 0 10 6" %s/>' % St,
    '<circle data-filled="knockout" cx="6" cy="6" r="2" %s/>' % St])

# people: the back figure hides behind the front one with a join; its head moves in to touch
FH = circle(5.5, 5.5, 2)
FB = 'M2 14V13.5A3 3 0 0 1 5 10.5H6A3 3 0 0 1 9 13.5V14Z'
BH = g('behind', circle(9.5, 4, 2), FH, '0')
BB = g('behind', 'M7 12.5V12A3 3 0 0 1 10 9H11A3 3 0 0 1 14 12V12.5Z', FB, '0')
write('people', 'back figure joins the front (no gap)', 'circle', [
    '<circle data-filled="solid" cx="5.5" cy="5.5" r="2" %s/>' % St,
    '<path data-filled="solid" d="%s" %s/>' % (FB, St),
    '<path d="%s" %s/>' % (BH, St), '<path d="%s" %s/>' % (BB, St)], ' data-angles="free"')

# cloud-sun: the sun hides behind the cloud with a join
CL = 'M7.667 14A1.667 1.667 0 0 1 7.362 10.695A2.333 2.333 0 1 1 11.976 10A2 2 0 1 1 12 14Z'
write('cloud-sun', 'sun joins the cloud (no gap)', 'square', [
    '<path data-filled="solid" d="%s" %s/>' % (CL, St),
    '<path d="%s" %s/>' % (g('behind', circle(7, 7, 1.5), CL, '0'), St),
    '<path d="M4.172 9.828L3.464 10.536M3 7L2 7M4.172 4.172L3.464 3.464M7 3L7 2M9.828 4.172L10.536 3.464" %s/>' % St], ' data-angles="free"')

# alarm: closed bells (lobes joined to the ring) instead of open strokes
RING = circle(8, 9, 4.5)
bells = [g('behind', circle(4, 5, 2), RING, '0'), g('behind', circle(12, 5, 2), RING, '0')]
write('alarm', 'closed bells joined to the ring', 'circle', [
    '<circle data-filled="solid" cx="8" cy="9" r="4.5" %s/>' % St,
    '<path data-filled="knockout" d="M8 7V9L9.5 10.5" %s/>' % St,
    '<path data-filled="solid" d="%s" %s/>' % (bells[0], St), '<path data-filled="solid" d="%s" %s/>' % (bells[1], St),
    '<path d="M4.818 12.182L3.5 13.5M11.182 12.182L12.5 13.5" %s/>' % St], ' data-angles="free"')

# strikethrough: one continuous S, crossed by the bar
write('strikethrough', 'one continuous S crossed by the bar', 'square', [
    '<path d="M11.031 3.875A3.5 2.75 0 0 0 4.5 5.5C4.5 7.25 6.25 8 8 8A3.5 2.75 0 1 1 4.969 12.125" %s/>' % St,
    '<path d="M3 8H13" %s/>' % St], ' data-angles="free"')

# --- Refined after the owner's Cursor screenshots (2026-10-02) ---
# Stacks as Cursor's copy and folders: the back copy (same shape and radius, offset 3) shows only
# its uncovered edges and stops one overlap cut short of the front (a gap that separates layers).
def stack(name, front, parts, dx, dy, keyline, mirror=False):
    back = g('transform', front, '1', '0,0', '%s,%s' % (dx, dy))
    if mirror: back = g('mirror', back)
    vis = g('behind', back, front)
    write('stack-' + name, 'back copy stops a gap short (Cursor)', keyline,
          ['<path data-filled="solid" d="%s" %s/>' % (front, St)] + parts + ['<path d="%s" %s/>' % (vis, St)])
stack('files', 'M5 4.5H6.5L10 8V12.5A2 2 0 0 1 8 14.5H5A2 2 0 0 1 3 12.5V6.5A2 2 0 0 1 5 4.5Z',
      ['<path data-filled="cut" d="M6.5 4.5V7A1 1 0 0 0 7.5 8H10" %s/>' % St, '<path data-filled="knockout" d="M5 10.5H8M5 12.5H7" %s/>' % St], 3, -3, 'vertical')
stack('folders', 'M2 12V7A1.5 1.5 0 0 1 3.5 5.5H5.5L7 7H9.5A1.5 1.5 0 0 1 11 8.5V12A1.5 1.5 0 0 1 9.5 13.5H3.5A1.5 1.5 0 0 1 2 12Z',
      ['<path data-filled="cut" d="M2 8.5H5.5L7 7" %s/>' % St], 3, -3, 'square')
stack('copy', 'M4 5.5H9A1.5 1.5 0 0 1 10.5 7V12A1.5 1.5 0 0 1 9 13.5H4A1.5 1.5 0 0 1 2.5 12V7A1.5 1.5 0 0 1 4 5.5Z', [], 3, -3, 'square')
stack('gallery', 'M7 2.5H12A2 2 0 0 1 14 4.5V8.5A2 2 0 0 1 12 10.5H7A2 2 0 0 1 5 8.5V4.5A2 2 0 0 1 7 2.5Z',
      ['<path data-filled="cut" d="M6.5 10.5L9.793 7.207A1 1 0 0 1 11.207 7.207L13.64 9.64" %s/>' % St, '<circle data-filled="hole" cx="7.75" cy="5.25" r="0.75" fill="currentColor"/>'], -3, 3, 'square')

# Slashes as Cursor's: the shape stays whole and the slash crosses it flat, no gap in the outline
for off, base in [('bell-off', 'bell'), ('mic-off', 'mic'), ('wifi-off', 'wifi'), ('video-off', 'video'), ('brain-off', 'brain'), ('link-off', 'link')]:
    src = open('apps/docs/assets/area-icons-pilot/%s.svg' % base).read()
    head = src.split('\n')[0]
    body = [l for l in src.split('\n')[1:] if l and not l.startswith('</svg')]
    key = head.split('data-keyline="')[1].split('"')[0]
    write('slash-' + off, 'the slash crosses flat (Cursor)', key, body + ['<path d="M2 2L14 14" %s/>' % St], ' data-angles="free" data-off="own"')
