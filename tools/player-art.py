"""Turn a player render into assets/players/<slug>.webp for the team hero.

    python tools/player-art.py "C:/path/LA Launch QB.png" la-launch

Accepts a PNG with a real alpha channel, or a render on a flat background (white or a single
color): in that case the background is keyed out by flood fill from the four corners, so only the
outside is removed and white jersey details inside the figure survive. A checkerboard baked into the
pixels cannot be keyed; export the render without it.

The hero shows the art at about 315px tall on desktop, so the WebP is capped at 900px tall
(sharp on a retina screen, ~60-150 KB).
"""
import os, sys
from collections import deque
from PIL import Image

if len(sys.argv) != 3:
    sys.exit(__doc__)
src, slug = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGBA')
alpha = im.getchannel('A')
has_alpha = alpha.getextrema()[0] < 250

if not has_alpha:
    # key the background: flood fill from the corners over pixels close to the corner color
    px = im.load()
    w, h = im.size
    corners = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
    bg = tuple(sum(c[i] for c in corners) // 4 for i in range(3))
    tol = 40
    def near(p): return all(abs(p[i] - bg[i]) <= tol for i in range(3))
    seen = bytearray(w * h)
    q = deque([(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)])
    removed = 0
    while q:
        x, y = q.popleft()
        idx = y * w + x
        if seen[idx]: continue
        seen[idx] = 1
        p = px[x, y]
        if not near(p): continue
        px[x, y] = (p[0], p[1], p[2], 0); removed += 1
        if x > 0: q.append((x - 1, y))
        if x < w - 1: q.append((x + 1, y))
        if y > 0: q.append((x, y - 1))
        if y < h - 1: q.append((x, y + 1))
    if removed < w * h * 0.05:
        sys.exit(f'{src}: no alpha and the corner color {bg} does not surround the figure. Export with a transparent or flat background.')
    print(f'keyed out background {bg}: {removed} px')

bbox = im.getbbox()
im = im.crop(bbox)
if im.height > 900:
    im = im.resize((round(im.width * 900 / im.height), 900), Image.LANCZOS)
out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets', 'players', f'{slug}.webp')
os.makedirs(os.path.dirname(out), exist_ok=True)
im.save(out, 'WEBP', quality=88, method=6)
print(f'{out}: {im.width}x{im.height}, {os.path.getsize(out)//1024} KB. Bump V in bigleague-v8.js and push.')
