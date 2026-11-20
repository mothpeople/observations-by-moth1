#!/usr/bin/env python3
"""
Official YouTube Channel Banner Generator for Observations by Moth1
Generates the master 2048 x 1152 channel banner with certified safe-zone compliance:
  - Total Dimensions: 2048 x 1152 px (under 6MB limit)
  - Full Canvas (2048 x 1152): Visible on TV screens
  - Desktop Strip (2048 x 338, y: 407 to 745): Full panoramic background
  - Mobile & Text Safe Area (1237 x 338, x: 406 to 1643, y: 407 to 745):
    Contains all essential typography, branding, crimson seal, and website URL.

Aesthetic:
  - Cyber-zen Japanese sumi-e ink wash meets modern graphic novel.
  - Charcoal/Obsidian canvas (#08090a), bone-white text (#f1f5f9),
    crimson seal (#dc2626), subtle 40px grid lines.
"""

import os
from PIL import Image, ImageDraw, ImageFont

# Master Brand Palette
C_CHARCOAL = (8, 9, 10, 255)         # #08090a
C_PANEL_BG = (14, 16, 21, 245)       # #0e1015
C_OFFWHITE = (241, 245, 249, 255)    # #f1f5f9
C_MUTED = (165, 172, 180, 255)       # #a5acb4
C_SLATE = (203, 213, 225, 255)       # #cbd5e1
C_AMBER = (217, 119, 6, 255)         # #d97706
C_CRIMSON = (220, 38, 38, 255)       # #dc2626
C_BORDER = (230, 228, 221, 45)
C_GRID_LINE = (230, 228, 221, 8)

FONT_SANS = "/System/Library/Fonts/HelveticaNeue.ttc"
FONT_MONO = "/System/Library/Fonts/SFNSMono.ttf"
if not os.path.exists(FONT_MONO):
    FONT_MONO = "/System/Library/Fonts/Menlo.ttc"

def get_sans(size, bold=False):
    index = 1 if bold else 0
    try:
        return ImageFont.truetype(FONT_SANS, size, index=index)
    except Exception:
        return ImageFont.load_default()

def get_mono(size, bold=False):
    try:
        return ImageFont.truetype(FONT_MONO, size)
    except Exception:
        return ImageFont.load_default()

def draw_corner_brackets(draw, x0, y0, x1, y1, size=32, stroke=3, accent_color=C_CRIMSON):
    draw.line([(x0 - 2, y0 - 2), (x0 + size, y0 - 2)], fill=C_OFFWHITE, width=stroke)
    draw.line([(x0 - 2, y0 - 2), (x0 - 2, y0 + size)], fill=C_OFFWHITE, width=stroke)
    draw.line([(x1 - size, y1 + 2), (x1 + 2, y1 + 2)], fill=accent_color, width=stroke)
    draw.line([(x1 + 2, y1 - size), (x1 + 2, y1 + 2)], fill=accent_color, width=stroke)

def draw_seal(img, x, y, size=52, text="MOTH1"):
    seal_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(seal_img)
    s_draw.rectangle([(2, 2), (size - 3, size - 3)], fill=C_CRIMSON, outline=C_OFFWHITE, width=2)
    s_font = get_mono(max(9, int(size * 0.22)), bold=True)
    bbox = s_draw.textbbox((0, 0), text, font=s_font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    s_draw.text(((size - tw) // 2, (size - th) // 2 - 1), text, fill=C_OFFWHITE, font=s_font)
    img.alpha_composite(seal_img, (x, y))

def draw_centered_text(draw, y, text, font, fill=C_OFFWHITE, cx=1024):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    x = cx - (tw // 2)
    draw.text((x, y), text, fill=fill, font=font)
    return tw, bbox[3] - bbox[1]


def render_channel_banner(out_dir):
    os.makedirs(out_dir, exist_ok=True)
    w, h = 2048, 1152
    cx, cy = w // 2, h // 2

    canvas = Image.new("RGBA", (w, h), C_CHARCOAL)

    # 1. Background Artwork Composite (Left Storm + Right Quiet Earth)
    # Left: Hero Storm (Issue 01)
    if os.path.exists("public/assets/hero-storm.webp"):
        storm = Image.open("public/assets/hero-storm.webp").convert("RGBA")
        s_h = h
        s_w = int(storm.width * (s_h / storm.height))
        s_scaled = storm.resize((s_w, s_h), Image.Resampling.LANCZOS)
        fade_l = Image.new("L", (s_w, s_h), 255)
        fl_draw = ImageDraw.Draw(fade_l)
        fade_start = int(s_w * 0.35)
        for x in range(fade_start, s_w):
            alpha = int(255 * (1.0 - (x - fade_start) / (s_w - fade_start)))
            fl_draw.line([(x, 0), (x, s_h)], fill=alpha)
        s_scaled.putalpha(fade_l)
        canvas.alpha_composite(s_scaled, (0, 0))

    # Right: Quiet Earth (Issue 02)
    if os.path.exists("public/assets/quiet-earth.webp"):
        earth = Image.open("public/assets/quiet-earth.webp").convert("RGBA")
        e_h = h
        e_w = int(earth.width * (e_h / earth.height))
        e_scaled = earth.resize((e_w, e_h), Image.Resampling.LANCZOS)
        fade_r = Image.new("L", (e_w, e_h), 255)
        fr_draw = ImageDraw.Draw(fade_r)
        fade_r_end = int(e_w * 0.65)
        for x in range(0, fade_r_end):
            alpha = int(255 * (x / fade_r_end))
            fr_draw.line([(x, 0), (x, e_h)], fill=alpha)
        e_scaled.putalpha(fade_r)
        canvas.alpha_composite(e_scaled, (w - e_w, 0))

    # 2. Deep Obsidian Vignette Overlay
    vig = Image.new("RGBA", (w, h), (8, 9, 10, 185))
    canvas.alpha_composite(vig, (0, 0))

    # 3. 40px Japanese Rice Paper Grid Overlay
    draw = ImageDraw.Draw(canvas)
    for x in range(0, w, 40): draw.line([(x, 0), (x, h)], fill=C_GRID_LINE, width=1)
    for y in range(0, h, 40): draw.line([(0, y), (w, y)], fill=C_GRID_LINE, width=1)

    # 4. Central Safe-Zone Brand Panel
    # YouTube Safe Area at 2048x1152 is x: 406 to 1643, y: 407 to 745
    px0, py0, px1, py1 = 440, 420, 1608, 732
    panel = Image.new("RGBA", (px1 - px0, py1 - py0), C_PANEL_BG)
    canvas.alpha_composite(panel, (px0, py0))
    draw.rectangle([(px0, py0), (px1, py1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, px0, py0, px1, py1, size=32, stroke=3, accent_color=C_CRIMSON)

    cur_y = py0 + 38
    # Kicker
    draw_centered_text(draw, cur_y, "OFFICIAL PUBLICATION ARCHIVE • INTERACTIVE VISUAL ESSAYS", get_mono(12, bold=True), fill=C_CRIMSON, cx=cx)
    cur_y += 34

    # Main Title: OBSERVATIONS BY MOTH1
    draw_centered_text(draw, cur_y, "OBSERVATIONS BY MOTH1", get_sans(54, bold=True), fill=C_OFFWHITE, cx=cx)
    cur_y += 66

    # Crimson Accent Divider
    draw.line([(cx - 90, cur_y), (cx + 90, cur_y)], fill=C_CRIMSON, width=3)
    cur_y += 24

    # Subtitle / Editorial Focus
    draw_centered_text(draw, cur_y, "Visual Essays on Power, Economics & Reality", get_sans(21, bold=False), fill=C_SLATE, cx=cx)
    cur_y += 38

    # Editorial Feature Badges
    draw_centered_text(draw, cur_y, "DEMOGRAPHIC SIMULATORS  •  SCROLLYTELLING  •  EMPIRICAL RESEARCH", get_mono(10, bold=True), fill=C_MUTED, cx=cx)
    cur_y += 38

    # Bottom Seal & Domain
    draw_seal(canvas, cx - 120, cur_y - 8, size=46, text="MOTH1")
    draw.text((cx - 62, cur_y + 4), "observations.moth1.xyz", fill=C_OFFWHITE, font=get_sans(16, bold=True))

    # Save Master Production Banner
    out_master = os.path.join(out_dir, "channel_banner_2048x1152.png")
    canvas.save(out_master, "PNG", optimize=True)
    size_mb = os.path.getsize(out_master) / (1024 * 1024)
    print(f"✅ Rendered Master YouTube Banner: {out_master} ({size_mb:.2f} MB)")

    # 5. Generate Companion Device Safe-Zone Preview
    preview = canvas.copy()
    p_draw = ImageDraw.Draw(preview)
    # Safe zone outline: x: 406 to 1643, y: 407 to 745
    p_draw.rectangle([(406, 407), (1643, 745)], outline=(234, 179, 8, 200), width=3)
    p_draw.text((416, 412), "MOBILE & TEXT SAFE AREA (1237 x 338)", fill=(234, 179, 8, 255), font=get_mono(12, bold=True))
    # Desktop strip outline: full width 2048 x 338 (y: 407 to 745)
    p_draw.line([(0, 407), (w, 407)], fill=(34, 197, 94, 160), width=2)
    p_draw.line([(0, 745), (w, 745)], fill=(34, 197, 94, 160), width=2)
    p_draw.text((30, 412), "DESKTOP BANNER STRIP (2048 x 338)", fill=(34, 197, 94, 255), font=get_mono(12, bold=True))
    # TV area label
    p_draw.text((30, 50), "TV DISPLAY AREA (2048 x 1152)", fill=(148, 163, 184, 255), font=get_mono(14, bold=True))

    out_preview = os.path.join(out_dir, "channel_banner_safe_zone_preview.png")
    preview.save(out_preview, "PNG", optimize=True)
    print(f"✅ Rendered Safe-Zone Visual Guide: {out_preview}")

    return out_master

if __name__ == "__main__":
    render_channel_banner("dist-packages/youtube-channel")
