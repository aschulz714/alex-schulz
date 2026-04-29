"""Generate a 1200x630 OG image in the minimalist palette.

Run: python scripts/generate-og-image.py
Output: public/og-image.png

Re-run whenever the hero copy or palette changes, then bump OG_IMAGE_VERSION
in src/layouts/Base.astro to force LinkedIn to re-scrape.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

PAPER = (250, 250, 250)
INK = (10, 10, 10)
INK_SOFT = (64, 64, 64)
INK_MUTED = (115, 115, 115)
HAIRLINE = (229, 229, 229)

W, H = 1200, 630
OUT = Path(__file__).resolve().parent.parent / "public" / "og-image.png"


def find_font(candidates, size):
    for name in candidates:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


SANS = ["segoeui.ttf", "arial.ttf", "Arial.ttf"]
SANS_BOLD = ["segoeuib.ttf", "arialbd.ttf"]
MONO = ["consola.ttf", "cour.ttf"]


def main():
    img = Image.new("RGB", (W, H), PAPER)
    draw = ImageDraw.Draw(img)

    # Single hairline across the top of the content block
    draw.line([(80, 120), (W - 80, 120)], fill=HAIRLINE, width=1)

    # Coordinate line
    coord_font = find_font(MONO, 18)
    draw.text((80, 90), "47.9790° N · 122.2021° W", font=coord_font, fill=INK_MUTED)

    # Name — big, near-black, tight tracking
    title_font = find_font(SANS_BOLD, 170)
    draw.text((76, 150), "Alex", font=title_font, fill=INK)
    draw.text((76, 320), "Schulz.", font=title_font, fill=INK)

    # Tagline
    tagline_font = find_font(SANS, 30)
    tagline_small = find_font(SANS, 24)
    draw.text((80, 500), "CPA · Geospatial Intelligence MS · Developer.", font=tagline_font, fill=INK_SOFT)
    draw.text((80, 540), "One of ~10–20 people in the US with that combination.", font=tagline_small, fill=INK_MUTED)

    # Footer URL
    url_font = find_font(MONO, 16)
    draw.text((80, H - 45), "aschulz714.github.io", font=url_font, fill=INK_MUTED)

    # Tiny hairline at bottom
    draw.line([(80, H - 60), (W - 80, H - 60)], fill=HAIRLINE, width=1)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "PNG", optimize=True)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
