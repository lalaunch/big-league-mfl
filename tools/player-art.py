"""Turn a transparent PNG of a player into assets/players/<slug>.webp for the team hero.

    python tools/player-art.py "C:/path/LA Launch QB.png" la-launch

The hero shows the art at about 315px tall on desktop, so the WebP is capped at 900px tall
(sharp on a retina screen, ~60-120 KB). The PNG must have a real alpha channel: a checkerboard
baked into the pixels is not transparency and will show as a checkerboard on the page.
"""
import os, sys
from PIL import Image

if len(sys.argv) != 3:
    sys.exit(__doc__)
src, slug = sys.argv[1], sys.argv[2]
im = Image.open(src)
if im.mode != 'RGBA' or im.getextrema()[3][0] == 255:
    sys.exit(f'{src}: no transparent pixels. Export the render with a transparent background first.')
im = im.crop(im.getbbox())
if im.height > 900:
    im = im.resize((round(im.width * 900 / im.height), 900), Image.LANCZOS)
out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets', 'players', f'{slug}.webp')
im.save(out, 'WEBP', quality=88, method=6)
print(f'{out}: {im.width}x{im.height}, {os.path.getsize(out)//1024} KB. Bump V in bigleague-v8.js and push.')
