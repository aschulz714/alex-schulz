"""Generate the 1200x630 link-preview image (og-image.png) in the Atlas look.

Run from the repo root, after `npm install` (the fonts are read from node_modules):

    python scripts/generate-og-image.py

Output: public/og-image.png

The headline must match the home page <h1> in src/pages/index.astro, and the sub-line is the
first sentence of the home page lede. Re-run whenever either changes, then bump
OG_IMAGE_VERSION in src/layouts/Base.astro so LinkedIn, Slack and others fetch the new file.
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "og-image.png"
MAP = ROOT / "public" / "figures" / "parcel-coverage-us.jpg"
FONTS = ROOT / "node_modules" / "@fontsource-variable"

# Palette: src/styles/global.css
PAPER = (243, 239, 228)
GRID = (233, 227, 212)
RULE = (207, 198, 173)
INK = (23, 34, 46)
INK_SOFT = (51, 65, 79)
INK_MUTED = (93, 104, 115)
SIGNAL = (184, 64, 44)
MAP_BG = (250, 247, 238)  # the figure's own background, keyed out below

W, H = 1200, 630
LEFT = 60

EYEBROW = "ALEX SCHULZ · CPA · MS GEOINT"
HEADLINE = ["I'm a CPA who builds", "working apps, data", "pipelines, and accounting", "automation with AI."]
SUB = ["I use AI to write Python steps that run the same", "way every time, so the result can be checked."]
STATS = "143.9M parcel records · 2,613 of 3,143 counties"


def font(package: str, file: str, size: int, weight: int | None = None) -> ImageFont.FreeTypeFont:
    f = ImageFont.truetype(str(FONTS / package / "files" / file), size)
    if weight is not None:
        f.set_variation_by_axes([weight])
    return f


def spaced(draw: ImageDraw.ImageDraw, xy, text: str, fnt, fill, tracking: float) -> None:
    """Draw text with letter spacing (PIL has none built in)."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + tracking


def main() -> None:
    img = Image.new("RGB", (W, H), PAPER)
    draw = ImageDraw.Draw(img)

    # Chart-paper grid and a two-pixel frame
    for x in range(48, W, 48):
        draw.line([(x, 0), (x, H)], fill=GRID, width=1)
    for y in range(48, H, 48):
        draw.line([(0, y), (W, y)], fill=GRID, width=1)
    draw.rectangle([0, 0, W - 1, H - 1], outline=RULE, width=2)

    # County coverage map on the right, with its own background keyed out
    m = Image.open(MAP).convert("RGB")
    mw = 580
    m = m.resize((mw, round(m.height * mw / m.width)), Image.LANCZOS)
    alpha = Image.new("L", m.size, 255)
    src, a = m.load(), alpha.load()
    for yy in range(m.height):
        for xx in range(m.width):
            r, g, b = src[xx, yy]
            d = abs(r - MAP_BG[0]) + abs(g - MAP_BG[1]) + abs(b - MAP_BG[2])
            if d < 14:
                a[xx, yy] = 0
            elif d < 40:
                a[xx, yy] = round(255 * (d - 14) / 26)
    img.paste(m, (W - mw - 26, (H - m.height) // 2 + 6), alpha)

    eyebrow = font("geist-mono", "geist-mono-latin-wght-normal.woff2", 19, 400)
    display = font("eb-garamond", "eb-garamond-latin-wght-normal.woff2", 54, 500)
    sub = font("geist", "geist-latin-wght-normal.woff2", 23, 400)
    mono = font("geist-mono", "geist-mono-latin-wght-normal.woff2", 16, 400)

    spaced(draw, (LEFT, 66), EYEBROW, eyebrow, INK_MUTED, 1.6)

    y = 118
    for line in HEADLINE:
        draw.text((LEFT, y), line, font=display, fill=INK)
        y += 60

    y += 34
    for line in SUB:
        draw.text((LEFT, y), line, font=sub, fill=INK_SOFT)
        y += 34

    y += 18
    draw.line([(LEFT, y), (LEFT + 520, y)], fill=RULE, width=1)
    spaced(draw, (LEFT, y + 16), STATS, mono, SIGNAL, 0.4)

    widest = max(draw.textlength(line, font=display) for line in HEADLINE)
    print(f"headline width {widest:.0f}px, text block ends y={y + 16 + 20}")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "PNG", optimize=True)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
