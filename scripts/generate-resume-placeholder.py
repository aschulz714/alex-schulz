"""Generate a single-page placeholder PDF so the about page's download link
doesn't 404 on first deploy. Replace public/resume.pdf with a real export
when you're ready.

Run: python scripts/generate-resume-placeholder.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

CREAM = (246, 241, 231)
INK = (26, 26, 26)
INK_MUTED = (107, 107, 107)
CARTOGRAPHIC = (192, 57, 43)

# US Letter at 150 DPI
W, H = 1275, 1650
OUT = Path(__file__).resolve().parent.parent / "public" / "resume.pdf"


def find_font(candidates, size):
    for name in candidates:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


SERIF = ["georgia.ttf", "Georgia.ttf", "times.ttf"]
SANS = ["segoeui.ttf", "arial.ttf"]


def main():
    img = Image.new("RGB", (W, H), CREAM)
    draw = ImageDraw.Draw(img)

    title_font = find_font(SERIF, 72)
    body_font = find_font(SANS, 28)
    small_font = find_font(SANS, 22)

    draw.text((120, 140), "Alex Schulz", font=title_font, fill=INK)
    draw.rectangle([120, 240, 240, 244], fill=CARTOGRAPHIC)
    draw.text((120, 270), "CPA · Geospatial · Developer", font=body_font, fill=INK)
    draw.text((120, 320), "alex.j.schulz@gmail.com", font=small_font, fill=INK_MUTED)

    draw.text(
        (120, 500),
        "Resume placeholder.",
        font=body_font,
        fill=INK,
    )
    draw.text(
        (120, 560),
        "Replace public/resume.pdf with a real export before sharing the site.",
        font=small_font,
        fill=INK_MUTED,
    )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "PDF", resolution=150.0)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
