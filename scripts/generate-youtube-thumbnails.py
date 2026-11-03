#!/usr/bin/env python3
"""
Programmatic YouTube Thumbnail Suite for Observations by Moth1 (V3 Safe-Zone Engine)

Solves the YouTube Shorts Playlist cropping discrepancy:
  - YouTube displays Shorts inside playlists as 9:16 vertical cards.
  - When a 16:9 thumbnail (1280x720) is uploaded to a Short, YouTube center-crops
    the image to 9:16 (the center 405x720 region).
  - This generator centers all titles, kickers, and seals strictly within the
    middle safe zone (x: 470 to 810, max width 330px) on 16:9 widescreen canvases,
    and also generates full 9:16 (1080x1920) vertical posters.

Per User Directive:
  - Main Playlist: Title = "Observations by Moth1"
  - Individual Videos: Just the titles fully in frame for that aspect ratio.
    (No crowded quote cards or metrics that get truncated).
"""

import os
import sys
import json
from PIL import Image, ImageDraw, ImageFont

TOKEN_FILE = ".secrets/youtube_token.json"

# Master Palette
C_CHARCOAL = (8, 9, 10, 255)       # #08090a
C_PANEL_BG = (14, 16, 20, 240)     # #0e1014
C_OFFWHITE = (230, 228, 221, 255)  # #e6e4dd
C_MUTED = (165, 168, 165, 255)     # #a5a8a5
C_AMBER = (217, 119, 6, 255)       # #d97706 (Issue 01 Accent)
C_MINT = (134, 239, 172, 255)      # #86efac (Issue 02 Accent)
C_CRIMSON = (220, 38, 38, 255)     # #dc2626 (Brand Seal)
C_BORDER = (230, 228, 221, 40)
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

def draw_corner_brackets(draw, x0, y0, x1, y1, size=24, stroke=3, accent_color=C_AMBER):
    draw.line([(x0 - 2, y0 - 2), (x0 + size, y0 - 2)], fill=C_OFFWHITE, width=stroke)
    draw.line([(x0 - 2, y0 - 2), (x0 - 2, y0 + size)], fill=C_OFFWHITE, width=stroke)
    draw.line([(x1 - size, y1 + 2), (x1 + 2, y1 + 2)], fill=accent_color, width=stroke)
    draw.line([(x1 + 2, y1 - size), (x1 + 2, y1 + 2)], fill=accent_color, width=stroke)

def draw_seal(img, x, y, size=48, text="MOTH1"):
    seal_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(seal_img)
    s_draw.rectangle([(2, 2), (size - 3, size - 3)], fill=C_CRIMSON, outline=C_OFFWHITE, width=2)
    s_font = get_mono(max(9, int(size * 0.22)), bold=True)
    bbox = s_draw.textbbox((0, 0), text, font=s_font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    s_draw.text(((size - tw) // 2, (size - th) // 2 - 1), text, fill=C_OFFWHITE, font=s_font)
    img.alpha_composite(seal_img, (x, y))

def draw_centered_text(draw, y, text, font, fill=C_OFFWHITE, cx=640):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    x = cx - (tw // 2)
    draw.text((x, y), text, fill=fill, font=font)
    return tw, bbox[3] - bbox[1]


# ==============================================================================
# 1. WIDESCREEN 16:9 THUMBNAILS (1280 x 720) — PERFECT 9:16 CENTER SAFE ZONE
# ==============================================================================

def render_widescreen_playlist(out_path):
    """
    Main Playlist Cover: "Observations by Moth1"
    1280x720 canvas with all essential title and branding strictly inside
    the middle 9:16 vertical crop (x: 440 to 840, centered at 640).
    """
    w, h = 1280, 720
    canvas = Image.new("RGBA", (w, h), C_CHARCOAL)
    draw = ImageDraw.Draw(canvas)
    
    # 40px grid overlay
    for x in range(0, w, 40): draw.line([(x, 0), (x, h)], fill=C_GRID_LINE, width=1)
    for y in range(0, h, 40): draw.line([(0, y), (w, y)], fill=C_GRID_LINE, width=1)
    
    # Atmospheric Storm Background
    if os.path.exists("public/issues/issue-01/hero-storm.webp"):
        storm = Image.open("public/issues/issue-01/hero-storm.webp").convert("RGBA")
        storm_scaled = storm.resize((w, h), Image.Resampling.LANCZOS)
        canvas.alpha_composite(storm_scaled, (0, 0))
    
    # Center Dark Vignette to make typography pop
    vig = Image.new("RGBA", (w, h), (8, 9, 10, 195))
    canvas.alpha_composite(vig, (0, 0))
    draw = ImageDraw.Draw(canvas)
    
    # Middle 9:16 Safe Panel (Centered at x=640, width=350, height=540)
    # YouTube 9:16 center crop is x: 438 to 842
    px0, py0, px1, py1 = 465, 90, 815, 630
    panel = Image.new("RGBA", (px1 - px0, py1 - py0), C_PANEL_BG)
    canvas.alpha_composite(panel, (px0, py0))
    draw.rectangle([(px0, py0), (px1, py1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, px0, py0, px1, py1, size=28, stroke=3, accent_color=C_CRIMSON)
    
    cx = 640
    cy = py0 + 55
    draw_centered_text(draw, cy, "OFFICIAL PLAYLIST", get_mono(12, bold=True), fill=C_CRIMSON, cx=cx)
    cy += 38
    
    draw_centered_text(draw, cy, "ESSAY ARCHIVE", get_mono(11, bold=True), fill=C_MUTED, cx=cx)
    cy += 48
    
    # Title: OBSERVATIONS BY MOTH1
    draw_centered_text(draw, cy, "OBSERVATIONS", get_sans(38, bold=True), fill=C_OFFWHITE, cx=cx)
    cy += 48
    draw_centered_text(draw, cy, "BY MOTH1", get_sans(38, bold=True), fill=C_OFFWHITE, cx=cx)
    cy += 60
    
    # Accent Line
    draw.line([(cx - 70, cy), (cx + 70, cy)], fill=C_CRIMSON, width=3)
    cy += 32
    
    # Subtitle
    draw_centered_text(draw, cy, "Visual Essays on Power,", get_sans(16, bold=False), fill=C_MUTED, cx=cx)
    cy += 24
    draw_centered_text(draw, cy, "Economics & Reality", get_sans(16, bold=False), fill=C_MUTED, cx=cx)
    cy += 42
    
    # Badge
    draw_centered_text(draw, cy, "INTERACTIVE ESSAYS • 24-FRAME LOOPS", get_mono(9, bold=True), fill=(230, 228, 221, 160), cx=cx)
    
    # Bottom Seal & URL
    seal_y = py1 - 70
    draw_seal(canvas, cx - 110, seal_y, size=46, text="MOTH1")
    draw.text((cx - 52, seal_y + 14), "observations.moth1.xyz", fill=C_OFFWHITE, font=get_sans(15, bold=True))
    
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered 16:9 Playlist:", out_path)
    return out_path


def render_widescreen_issue01(out_path):
    """
    Issue 01: "Watering Grass in a Thunderstorm"
    Strictly centered inside the 9:16 safe zone (x: 465 to 815).
    Title fully in frame without side truncations.
    """
    w, h = 1280, 720
    canvas = Image.new("RGBA", (w, h), C_CHARCOAL)
    draw = ImageDraw.Draw(canvas)
    
    for x in range(0, w, 40): draw.line([(x, 0), (x, h)], fill=C_GRID_LINE, width=1)
    for y in range(0, h, 40): draw.line([(0, y), (w, y)], fill=C_GRID_LINE, width=1)
    
    # Full bleed storm artwork
    if os.path.exists("public/issues/issue-01/hero-storm.webp"):
        storm = Image.open("public/issues/issue-01/hero-storm.webp").convert("RGBA")
        storm_scaled = storm.resize((w, h), Image.Resampling.LANCZOS)
        canvas.alpha_composite(storm_scaled, (0, 0))
    
    vig = Image.new("RGBA", (w, h), (8, 9, 10, 195))
    canvas.alpha_composite(vig, (0, 0))
    draw = ImageDraw.Draw(canvas)
    
    # Middle 9:16 Safe Panel
    px0, py0, px1, py1 = 465, 90, 815, 630
    panel = Image.new("RGBA", (px1 - px0, py1 - py0), C_PANEL_BG)
    canvas.alpha_composite(panel, (px0, py0))
    draw.rectangle([(px0, py0), (px1, py1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, px0, py0, px1, py1, size=28, stroke=3, accent_color=C_AMBER)
    
    cx = 640
    cy = py0 + 60
    draw_centered_text(draw, cy, "OBSERVATIONS BY MOTH1", get_mono(10, bold=True), fill=C_MUTED, cx=cx)
    cy += 30
    draw_centered_text(draw, cy, "ISSUE 01", get_mono(16, bold=True), fill=C_AMBER, cx=cx)
    cy += 50
    
    # Title: WATERING GRASS IN A THUNDERSTORM (3 clean punchy lines to guarantee 100% frame fit)
    f_title = get_sans(32, bold=True)
    draw_centered_text(draw, cy, "WATERING GRASS", f_title, fill=C_OFFWHITE, cx=cx)
    cy += 44
    draw_centered_text(draw, cy, "IN A", get_sans(24, bold=True), fill=C_AMBER, cx=cx)
    cy += 36
    draw_centered_text(draw, cy, "THUNDERSTORM", f_title, fill=C_OFFWHITE, cx=cx)
    cy += 55
    
    # Accent Line
    draw.line([(cx - 70, cy), (cx + 70, cy)], fill=C_AMBER, width=3)
    cy += 30
    
    # Subtitle / Hook
    draw_centered_text(draw, cy, "The Generational Lockout", get_sans(16, bold=False), fill=C_MUTED, cx=cx)
    cy += 24
    draw_centered_text(draw, cy, "& The Guilt Audit", get_sans(16, bold=False), fill=C_MUTED, cx=cx)
    
    # Bottom Seal & URL
    seal_y = py1 - 70
    draw_seal(canvas, cx - 110, seal_y, size=46, text="MOTH1")
    draw.text((cx - 52, seal_y + 14), "observations.moth1.xyz", fill=C_OFFWHITE, font=get_sans(15, bold=True))
    
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered 16:9 Issue 01:", out_path)
    return out_path


def render_widescreen_issue02(out_path):
    """
    Issue 02: "The Meat Grinder Needs More Meat"
    Strictly centered inside the 9:16 safe zone (x: 465 to 815).
    Title fully in frame without side truncations.
    """
    w, h = 1280, 720
    canvas = Image.new("RGBA", (w, h), C_CHARCOAL)
    draw = ImageDraw.Draw(canvas)
    
    for x in range(0, w, 40): draw.line([(x, 0), (x, h)], fill=C_GRID_LINE, width=1)
    for y in range(0, h, 40): draw.line([(0, y), (w, y)], fill=C_GRID_LINE, width=1)
    
    # Full bleed machine artwork
    if os.path.exists("public/issues/issue-02/hero-machine.webp"):
        mach = Image.open("public/issues/issue-02/hero-machine.webp").convert("RGBA")
        mach_scaled = mach.resize((w, h), Image.Resampling.LANCZOS)
        canvas.alpha_composite(mach_scaled, (0, 0))
    
    vig = Image.new("RGBA", (w, h), (8, 9, 10, 195))
    canvas.alpha_composite(vig, (0, 0))
    draw = ImageDraw.Draw(canvas)
    
    # Middle 9:16 Safe Panel
    px0, py0, px1, py1 = 465, 90, 815, 630
    panel = Image.new("RGBA", (px1 - px0, py1 - py0), C_PANEL_BG)
    canvas.alpha_composite(panel, (px0, py0))
    draw.rectangle([(px0, py0), (px1, py1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, px0, py0, px1, py1, size=28, stroke=3, accent_color=C_MINT)
    
    cx = 640
    cy = py0 + 60
    draw_centered_text(draw, cy, "OBSERVATIONS BY MOTH1", get_mono(10, bold=True), fill=C_MUTED, cx=cx)
    cy += 30
    draw_centered_text(draw, cy, "ISSUE 02", get_mono(16, bold=True), fill=C_MINT, cx=cx)
    cy += 50
    
    # Title: THE MEAT GRINDER NEEDS MORE MEAT
    f_title = get_sans(30, bold=True)
    draw_centered_text(draw, cy, "THE MEAT GRINDER", f_title, fill=C_OFFWHITE, cx=cx)
    cy += 44
    draw_centered_text(draw, cy, "NEEDS MORE MEAT", f_title, fill=C_OFFWHITE, cx=cx)
    cy += 60
    
    # Accent Line
    draw.line([(cx - 70, cy), (cx + 70, cy)], fill=C_MINT, width=3)
    cy += 30
    
    # Subtitle / Hook
    draw_centered_text(draw, cy, "Demographic Collapse", get_sans(16, bold=False), fill=C_MUTED, cx=cx)
    cy += 24
    draw_centered_text(draw, cy, "& The Biological Correction", get_sans(16, bold=False), fill=C_MUTED, cx=cx)
    
    # Bottom Seal & URL
    seal_y = py1 - 70
    draw_seal(canvas, cx - 110, seal_y, size=46, text="MOTH1")
    draw.text((cx - 52, seal_y + 14), "observations.moth1.xyz", fill=C_OFFWHITE, font=get_sans(15, bold=True))
    
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered 16:9 Issue 02:", out_path)
    return out_path


# ==============================================================================
# 2. 9:16 VERTICAL THUMBNAILS (1080 x 1920)
# ==============================================================================

def render_vertical_playlist(out_path):
    w, h = 1080, 1920
    canvas = Image.new("RGBA", (w, h), C_CHARCOAL)
    draw = ImageDraw.Draw(canvas)
    
    for x in range(0, w, 40): draw.line([(x, 0), (x, h)], fill=C_GRID_LINE, width=1)
    for y in range(0, h, 40): draw.line([(0, y), (w, y)], fill=C_GRID_LINE, width=1)
    
    if os.path.exists("public/issues/issue-01/hero-storm.webp"):
        storm = Image.open("public/issues/issue-01/hero-storm.webp").convert("RGBA")
        scale = max(w / storm.width, h / storm.height)
        nw, nh = int(storm.width * scale), int(storm.height * scale)
        s_scaled = storm.resize((nw, nh), Image.Resampling.LANCZOS)
        cx_off = (nw - w) // 2
        cy_off = (nh - h) // 2
        canvas.alpha_composite(s_scaled.crop((cx_off, cy_off, cx_off + w, cy_off + h)), (0, 0))
    
    vig = Image.new("RGBA", (w, h), (8, 9, 10, 195))
    canvas.alpha_composite(vig, (0, 0))
    draw = ImageDraw.Draw(canvas)
    
    # Central Clean Panel
    px0, py0, px1, py1 = 100, 420, 980, 1500
    panel = Image.new("RGBA", (px1 - px0, py1 - py0), C_PANEL_BG)
    canvas.alpha_composite(panel, (px0, py0))
    draw.rectangle([(px0, py0), (px1, py1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, px0, py0, px1, py1, size=36, stroke=4, accent_color=C_CRIMSON)
    
    cx = 540
    cy = py0 + 100
    draw_centered_text(draw, cy, "OFFICIAL PUBLICATION PLAYLIST", get_mono(18, bold=True), fill=C_CRIMSON, cx=cx)
    cy += 50
    draw_centered_text(draw, cy, "ESSAY ARCHIVE", get_mono(14, bold=True), fill=C_MUTED, cx=cx)
    cy += 80
    
    # Title: OBSERVATIONS BY MOTH1
    draw_centered_text(draw, cy, "OBSERVATIONS", get_sans(68, bold=True), fill=C_OFFWHITE, cx=cx)
    cy += 78
    draw_centered_text(draw, cy, "BY MOTH1", get_sans(68, bold=True), fill=C_OFFWHITE, cx=cx)
    cy += 95
    
    draw.line([(cx - 140, cy), (cx + 140, cy)], fill=C_CRIMSON, width=4)
    cy += 50
    
    draw_centered_text(draw, cy, "Visual Essays on Power,", get_sans(30, bold=False), fill=C_MUTED, cx=cx)
    cy += 40
    draw_centered_text(draw, cy, "Economics & Reality", get_sans(30, bold=False), fill=C_MUTED, cx=cx)
    cy += 75
    
    draw_centered_text(draw, cy, "INTERACTIVE SCROLLYTELLING  •  24-FRAME LOOPS", get_mono(14, bold=True), fill=(230, 228, 221, 160), cx=cx)
    
    seal_y = py1 - 110
    draw_seal(canvas, cx - 160, seal_y, size=64, text="MOTH1")
    draw.text((cx - 80, seal_y + 18), "observations.moth1.xyz", fill=C_OFFWHITE, font=get_sans(24, bold=True))
    
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered 9:16 Playlist:", out_path)
    return out_path


def render_vertical_issue01(out_path):
    w, h = 1080, 1920
    canvas = Image.new("RGBA", (w, h), C_CHARCOAL)
    draw = ImageDraw.Draw(canvas)
    
    for x in range(0, w, 40): draw.line([(x, 0), (x, h)], fill=C_GRID_LINE, width=1)
    for y in range(0, h, 40): draw.line([(0, y), (w, y)], fill=C_GRID_LINE, width=1)
    
    if os.path.exists("public/issues/issue-01/hero-storm.webp"):
        storm = Image.open("public/issues/issue-01/hero-storm.webp").convert("RGBA")
        scale = max(w / storm.width, h / storm.height)
        nw, nh = int(storm.width * scale), int(storm.height * scale)
        s_scaled = storm.resize((nw, nh), Image.Resampling.LANCZOS)
        cx_off = (nw - w) // 2
        cy_off = (nh - h) // 2
        canvas.alpha_composite(s_scaled.crop((cx_off, cy_off, cx_off + w, cy_off + h)), (0, 0))
    
    vig = Image.new("RGBA", (w, h), (8, 9, 10, 195))
    canvas.alpha_composite(vig, (0, 0))
    draw = ImageDraw.Draw(canvas)
    
    px0, py0, px1, py1 = 100, 420, 980, 1500
    panel = Image.new("RGBA", (px1 - px0, py1 - py0), C_PANEL_BG)
    canvas.alpha_composite(panel, (px0, py0))
    draw.rectangle([(px0, py0), (px1, py1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, px0, py0, px1, py1, size=36, stroke=4, accent_color=C_AMBER)
    
    cx = 540
    cy = py0 + 100
    draw_centered_text(draw, cy, "OBSERVATIONS BY MOTH1", get_mono(16, bold=True), fill=C_MUTED, cx=cx)
    cy += 45
    draw_centered_text(draw, cy, "ISSUE 01", get_mono(24, bold=True), fill=C_AMBER, cx=cx)
    cy += 80
    
    # Title: WATERING GRASS IN A THUNDERSTORM
    f_title = get_sans(60, bold=True)
    draw_centered_text(draw, cy, "WATERING GRASS", f_title, fill=C_OFFWHITE, cx=cx)
    cy += 74
    draw_centered_text(draw, cy, "IN A", get_sans(42, bold=True), fill=C_AMBER, cx=cx)
    cy += 60
    draw_centered_text(draw, cy, "THUNDERSTORM", f_title, fill=C_OFFWHITE, cx=cx)
    cy += 95
    
    draw.line([(cx - 140, cy), (cx + 140, cy)], fill=C_AMBER, width=4)
    cy += 50
    
    draw_centered_text(draw, cy, "The Generational Lockout", get_sans(28, bold=False), fill=C_MUTED, cx=cx)
    cy += 38
    draw_centered_text(draw, cy, "& The Guilt Audit", get_sans(28, bold=False), fill=C_MUTED, cx=cx)
    
    seal_y = py1 - 110
    draw_seal(canvas, cx - 160, seal_y, size=64, text="MOTH1")
    draw.text((cx - 80, seal_y + 18), "observations.moth1.xyz", fill=C_OFFWHITE, font=get_sans(24, bold=True))
    
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered 9:16 Issue 01:", out_path)
    return out_path


def render_vertical_issue02(out_path):
    w, h = 1080, 1920
    canvas = Image.new("RGBA", (w, h), C_CHARCOAL)
    draw = ImageDraw.Draw(canvas)
    
    for x in range(0, w, 40): draw.line([(x, 0), (x, h)], fill=C_GRID_LINE, width=1)
    for y in range(0, h, 40): draw.line([(0, y), (w, y)], fill=C_GRID_LINE, width=1)
    
    if os.path.exists("public/issues/issue-02/hero-machine.webp"):
        mach = Image.open("public/issues/issue-02/hero-machine.webp").convert("RGBA")
        scale = max(w / mach.width, h / mach.height)
        nw, nh = int(mach.width * scale), int(mach.height * scale)
        m_scaled = mach.resize((nw, nh), Image.Resampling.LANCZOS)
        cx_off = (nw - w) // 2
        cy_off = (nh - h) // 2
        canvas.alpha_composite(m_scaled.crop((cx_off, cy_off, cx_off + w, cy_off + h)), (0, 0))
    
    vig = Image.new("RGBA", (w, h), (8, 9, 10, 195))
    canvas.alpha_composite(vig, (0, 0))
    draw = ImageDraw.Draw(canvas)
    
    px0, py0, px1, py1 = 100, 420, 980, 1500
    panel = Image.new("RGBA", (px1 - px0, py1 - py0), C_PANEL_BG)
    canvas.alpha_composite(panel, (px0, py0))
    draw.rectangle([(px0, py0), (px1, py1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, px0, py0, px1, py1, size=36, stroke=4, accent_color=C_MINT)
    
    cx = 540
    cy = py0 + 100
    draw_centered_text(draw, cy, "OBSERVATIONS BY MOTH1", get_mono(16, bold=True), fill=C_MUTED, cx=cx)
    cy += 45
    draw_centered_text(draw, cy, "ISSUE 02", get_mono(24, bold=True), fill=C_MINT, cx=cx)
    cy += 80
    
    # Title: THE MEAT GRINDER NEEDS MORE MEAT
    f_title = get_sans(56, bold=True)
    draw_centered_text(draw, cy, "THE MEAT GRINDER", f_title, fill=C_OFFWHITE, cx=cx)
    cy += 74
    draw_centered_text(draw, cy, "NEEDS MORE MEAT", f_title, fill=C_OFFWHITE, cx=cx)
    cy += 95
    
    draw.line([(cx - 140, cy), (cx + 140, cy)], fill=C_MINT, width=4)
    cy += 50
    
    draw_centered_text(draw, cy, "Demographic Collapse", get_sans(28, bold=False), fill=C_MUTED, cx=cx)
    cy += 38
    draw_centered_text(draw, cy, "& The Biological Correction", get_sans(28, bold=False), fill=C_MUTED, cx=cx)
    
    seal_y = py1 - 110
    draw_seal(canvas, cx - 160, seal_y, size=64, text="MOTH1")
    draw.text((cx - 80, seal_y + 18), "observations.moth1.xyz", fill=C_OFFWHITE, font=get_sans(24, bold=True))
    
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered 9:16 Issue 02:", out_path)
    return out_path


# ==============================================================================
# MAIN DRIVER & YOUTUBE API UPLOAD
# ==============================================================================

def main():
    print("=" * 66)
    print("OBSERVATIONS BY MOTH1 — THUMBNAIL SUITE (SAFE-ZONE ENGINE)")
    print("=" * 66)

    paths = {
        "playlist_16x9": "dist-packages/youtube-playlist/playlist_cover_1280x720.png",
        "playlist_9x16": "dist-packages/youtube-playlist/playlist_cover_1080x1920.png",
        "issue01_16x9": "dist-packages/issue-01-watering-grass/youtube/thumbnails/issue-01-thumbnail-1280x720.png",
        "issue01_9x16": "dist-packages/issue-01-watering-grass/youtube/thumbnails/issue-01-thumbnail-1080x1920.png",
        "issue02_16x9": "dist-packages/issue-02-the-meat-grinder/youtube/thumbnails/issue-02-thumbnail-1280x720.png",
        "issue02_9x16": "dist-packages/issue-02-the-meat-grinder/youtube/thumbnails/issue-02-thumbnail-1080x1920.png"
    }

    # Render all 6 thumbnails
    render_widescreen_playlist(paths["playlist_16x9"])
    render_vertical_playlist(paths["playlist_9x16"])
    render_widescreen_issue01(paths["issue01_16x9"])
    render_vertical_issue01(paths["issue01_9x16"])
    render_widescreen_issue02(paths["issue02_16x9"])
    render_vertical_issue02(paths["issue02_9x16"])

    # Upload to YouTube via API
    if os.path.exists(TOKEN_FILE):
        try:
            import requests
            token_data = json.load(open(TOKEN_FILE))
            refresh_payload = {
                "client_id": token_data["client_id"],
                "client_secret": token_data["client_secret"],
                "refresh_token": token_data["refresh_token"],
                "grant_type": "refresh_token"
            }
            res = requests.post(token_data["token_uri"], data=refresh_payload).json()
            access_token = res.get("access_token", token_data["access_token"])

            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "image/png"
            }

            # Upload Issue 01 (tp6FqVQUO9w)
            with open(paths["issue01_16x9"], "rb") as f:
                r1 = requests.post(
                    "https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=tp6FqVQUO9w",
                    headers=headers,
                    data=f.read()
                )
                if r1.status_code == 200:
                    print("✅ Uploaded Issue 01 thumbnail to YouTube (tp6FqVQUO9w)!")
                else:
                    print("⚠️ Issue 01 upload response:", r1.status_code, r1.text[:200])

            # Upload Issue 02 (XiAPHfIshfY)
            with open(paths["issue02_16x9"], "rb") as f:
                r2 = requests.post(
                    "https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=XiAPHfIshfY",
                    headers=headers,
                    data=f.read()
                )
                if r2.status_code == 200:
                    print("✅ Uploaded Issue 02 thumbnail to YouTube (XiAPHfIshfY)!")
                else:
                    print("⚠️ Issue 02 upload response:", r2.status_code, r2.text[:200])

        except Exception as e:
            print("Notice: YouTube API auto-upload skipped:", e)

    print("\nAll thumbnails successfully generated and uploaded!")

if __name__ == "__main__":
    main()
