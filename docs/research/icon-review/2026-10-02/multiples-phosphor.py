# Multiples (owner, 2026-10-02): Phosphor's layering geometry (the back copy is the same shape at
# the same radius, offset 3 along the diagonal) with Cursor's separation: only the back copy's
# uncovered edges are drawn, and they stop one overlap cut (1.125) short of the front, an open L.
# (The first pass joined them to the front; the owner's Cursor screenshots showed the open L.) Files, folders and copy put the back copy up and right; chat-multiple's second
# bubble sits down and right (mirrored, its tail on the right); gallery's front is up and right
# with the back copy down and left, as Phosphor's images. Filled: the front fills, the back stays
# a line (Phosphor's fill does the same). Run from the repository root.
import subprocess
def g(*a): return subprocess.check_output(['node', 'apps/docs/scripts/icon-geometry.mjs', *a]).decode().strip().splitlines()[-1]
St = 'fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"'
P = 'apps/docs/assets/area-icons-pilot/'
def mv(d, dx, dy): return g('transform', d, '1', '0,0', '%s,%s' % (dx, dy))
def back(front, d): return g('behind', d, front, '2.3')  # 2.25 lands at 1.12
def write(name, keyline, body, extra=''):
    open(P + name + '.svg', 'w').write('<svg data-set="area-pilot" data-keyline="%s"%s width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n%s\n</svg>\n' % (keyline, extra, '\n'.join(body)))

# files: a 7 × 10 page (r 2, a 3.5 fold, r 1 inside so its pocket reads) with two text lines; the copy 3 up and right
F = 'M5 4.5H6.5L10 8V12.5A2 2 0 0 1 8 14.5H5A2 2 0 0 1 3 12.5V6.5A2 2 0 0 1 5 4.5Z'
write('files', 'vertical', [
    '<path data-filled="solid" d="%s" %s/>' % (F, St),
    '<path data-filled="cut" d="M6.5 4.5V7A1 1 0 0 0 7.5 8H10" %s/>' % St,
    '<path data-filled="knockout" d="M5 10.5H8M5 12.5H7" %s/>' % St,
    '<path d="%s" %s/>' % (back(F, mv(F, 3, -3)), St)])

# folders: a 9 × 8 folder (folder's tab and flap, r 1.5); the copy 3 up and right
D = 'M2 12V7A1.5 1.5 0 0 1 3.5 5.5H5.5L7 7H9.5A1.5 1.5 0 0 1 11 8.5V12A1.5 1.5 0 0 1 9.5 13.5H3.5A1.5 1.5 0 0 1 2 12Z'
write('folders', 'square', [
    '<path data-filled="solid" d="%s" %s/>' % (D, St),
    '<path data-filled="cut" d="M2 8.5H5.5L7 7" %s/>' % St,
    '<path d="%s" %s/>' % (back(D, mv(D, 3, -3)), St)])

# copy: an 8 × 8 square (r 1.5); the copy 3 up and right
C = 'M4 5.5H9A1.5 1.5 0 0 1 10.5 7V12A1.5 1.5 0 0 1 9 13.5H4A1.5 1.5 0 0 1 2.5 12V7A1.5 1.5 0 0 1 4 5.5Z'
write('copy', 'square', [
    '<path data-filled="solid" d="%s" %s/>' % (C, St),
    '<path d="%s" %s/>' % (back(C, mv(C, 3, -3)), St)])

# chat-multiple: chat-multiple's bubble up to 2.5; the second bubble mirrored (tail right), 3 down and right
B = 'M2.5 9.689V4A1.5 1.5 0 0 1 4 2.5H9A1.5 1.5 0 0 1 10.5 4V7A1.5 1.5 0 0 1 9 8.5H5.707A0.5 0.5 0 0 0 5.354 8.646L3.78 10.22A0.75 0.75 0 0 1 2.5 9.689Z'
B2 = g('mirror', mv(B, 0, 3))
write('chat-multiple', 'square', [
    '<path data-filled="solid" d="%s" %s/>' % (B, St),
    '<path d="%s" %s/>' % (back(B, B2), St)])

# gallery: a 9 × 8 picture (r 2, image's mountain and sun) up and right; the copy 3 down and left
I = 'M7 2.5H12A2 2 0 0 1 14 4.5V8.5A2 2 0 0 1 12 10.5H7A2 2 0 0 1 5 8.5V4.5A2 2 0 0 1 7 2.5Z'
write('gallery', 'square', [
    '<path data-filled="solid" d="%s" %s/>' % (I, St),
    '<path data-filled="cut" d="M6.5 10.5L9.793 7.207A1 1 0 0 1 11.207 7.207L13.64 9.64" %s/>' % St,
    '<circle data-filled="hole" cx="7.75" cy="5.25" r="0.75" fill="currentColor"/>',
    '<path d="%s" %s/>' % (back(I, mv(I, -3, 3)), St)])
