#!/usr/bin/env python3
"""
Programmatic X (Twitter) 1600x900 Widescreen Card Generator — Issue #04
"The Century of Self-Inflicted Humiliation" | Observations by Moth1

Generates 5 high-contrast editorial graphic-novel data cards:
  01_hero_hook.png
  02_extraction_ledger.png
  03_outrage_multiplier.png
  04_casualties_and_asymmetry.png
  05_the_multifold_antidote.png
"""

import os
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = "dist-packages/issue-04-self-inflicted-humiliation/x/cards"
os.makedirs(OUT_DIR, exist_ok=True)

# Issue 04 Cyber-Zen Obsidian & Opium-Amber Palette
C_OBSIDIAN = (9, 10, 15, 255)        # #090a0f
C_PANEL_BG = (13, 16, 24, 248)       # #0d1018
C_INNER_BOX = (8, 9, 13, 255)        # #08090d
C_OFFWHITE = (248, 250, 252, 255)    # #f8fafc
C_SLATE300 = (203, 213, 225, 255)    # #cbd5e1
C_MUTED = (148, 163, 184, 255)       # #94a3b8
C_AMBER = (234, 179, 8, 255)         # #eab308
C_GREEN = (34, 197, 94, 255)         # #22c55e
C_CRIMSON = (220, 38, 38, 255)       # #dc2626
C_RED = (239, 68, 68, 255)           # #ef4444
C_BORDER = (51, 65, 85, 180)         # #334155
C_GRID_LINE = (234, 179, 8, 12)

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


def draw_corner_brackets(draw, x0, y0, x1, y1, size=24, stroke=4, accent_color=C_AMBER):
    draw.line([(x0 - 2, y0 - 2), (x0 + size, y0 - 2)], fill=C_OFFWHITE, width=stroke)
    draw.line([(x0 - 2, y0 - 2), (x0 - 2, y0 + size)], fill=C_OFFWHITE, width=stroke)
    draw.line([(x1 - size, y1 + 2), (x1 + 2, y1 + 2)], fill=accent_color, width=stroke)
    draw.line([(x1 + 2, y1 - size), (x1 + 2, y1 + 2)], fill=accent_color, width=stroke)


def draw_seal(img, x, y, size=52, text="MOTH1"):
    seal_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(seal_img)
    s_draw.rectangle([(2, 2), (size - 3, size - 3)], fill=C_CRIMSON, outline=C_OFFWHITE, width=2)
    s_font = get_mono(11, bold=True)
    bbox = s_draw.textbbox((0, 0), text, font=s_font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    s_draw.text(((size - tw) // 2, (size - th) // 2 - 1), text, fill=C_OFFWHITE, font=s_font)
    img.alpha_composite(seal_img, (x, y))


def wrap_text(text, font, max_width, draw):
    words = text.split()
    lines = []
    current_line = []
    for word in words:
        test_line = " ".join(current_line + [word])
        bbox = draw.textbbox((0, 0), test_line, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(" ".join(current_line))
            current_line = [word]
    if current_line:
        lines.append(" ".join(current_line))
    return lines


def create_base_canvas(width=1600, height=900):
    canvas = Image.new("RGBA", (width, height), C_OBSIDIAN)
    c_draw = ImageDraw.Draw(canvas)
    for x in range(0, width, 56):
        c_draw.line([(x, 0), (x, height)], fill=C_GRID_LINE, width=1)
    for y in range(0, height, 56):
        c_draw.line([(0, y), (width, y)], fill=(220, 38, 38, 10), width=1)
    c_draw.rectangle([(16, 16), (width - 17, height - 17)], outline=(234, 179, 8, 45), width=1)
    return canvas


def paste_cover_art(canvas, img_path, box_x0, box_y0, box_x1, box_y1):
    if not os.path.exists(img_path):
        return
    art = Image.open(img_path).convert("RGBA")
    bw, bh = box_x1 - box_x0, box_y1 - box_y0
    scale = max(bw / art.width, bh / art.height)
    nw, nh = int(art.width * scale), int(art.height * scale)
    scaled = art.resize((nw, nh), Image.Resampling.LANCZOS)
    cx_off = (nw - bw) // 2
    cy_off = (nh - bh) // 2
    cropped = scaled.crop((cx_off, cy_off, cx_off + bw, cy_off + bh))
    canvas.alpha_composite(cropped, (box_x0, box_y0))


# ==============================================================================
# CARD 01: THE SECOND OPIUM WAR (HERO HOOK)
# ==============================================================================
def render_card_01():
    canvas = create_base_canvas()
    hero_path = "public/issues/issue-04/hero-humen-2am.webp"
    if os.path.exists(hero_path):
        hero = Image.open(hero_path).convert("RGBA")
        h_w, h_h = hero.size
        target_h = 900
        target_w = int(h_w * (target_h / h_h))
        hero_scaled = hero.resize((target_w, target_h), Image.Resampling.LANCZOS)

        fade_mask = Image.new("L", (target_w, target_h), 255)
        fade_draw = ImageDraw.Draw(fade_mask)
        fade_start = int(target_w * 0.45)
        for x in range(fade_start, target_w):
            alpha = int(255 * (1.0 - (x - fade_start) / (target_w - fade_start)))
            fade_draw.line([(x, 0), (x, target_h)], fill=alpha)
        hero_scaled.putalpha(fade_mask)
        canvas.alpha_composite(hero_scaled, (0, 0))

    px0, py0, px1, py1 = 740, 64, 1536, 836
    panel = Image.new("RGBA", (px1 - px0, py1 - py0), C_PANEL_BG)
    canvas.alpha_composite(panel, (px0, py0))

    draw = ImageDraw.Draw(canvas)
    draw.rectangle([(px0, py0), (px1, py1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, px0, py0, px1, py1, size=28, stroke=4, accent_color=C_AMBER)

    cur_y = py0 + 46
    draw.text((px0 + 48, cur_y), "OBSERVATIONS BY MOTH1  •  ISSUE 04", fill=C_AMBER, font=get_mono(15, bold=True))
    cur_y += 42

    for line in ["THE CENTURY OF", "SELF-INFLICTED", "HUMILIATION"]:
        color = C_AMBER if line == "SELF-INFLICTED" else C_OFFWHITE
        draw.text((px0 + 48, cur_y), line, fill=color, font=get_sans(56, bold=True))
        cur_y += 66
    cur_y += 16

    draw.line([(px0 + 48, cur_y), (px0 + 240, cur_y)], fill=C_AMBER, width=3)
    cur_y += 28

    body = (
        "In 1839, Britain used gunboats to force 2.6M lbs of opium onto China. "
        "Today, there are no cannons off the coast — billions lie awake at 2:00 AM "
        "voluntarily injecting algorithmic dopamine, swipe after endless swipe."
    )
    for bl in wrap_text(body, get_sans(22, bold=False), px1 - px0 - 96, draw):
        draw.text((px0 + 48, cur_y), bl, fill=C_SLATE300, font=get_sans(22, bold=False))
        cur_y += 32
    cur_y += 26

    # Stat Strip
    box_h = 136
    draw.rectangle([(px0 + 48, cur_y), (px1 - 48, cur_y + box_h)], fill=C_INNER_BOX, outline=C_AMBER, width=2)
    col_w = (px1 - px0 - 96) // 2
    stats = [
        ("2.6M LBS", "OPIUM DESTROYED AT HUMEN (1839)", C_RED),
        ("35+ DAYS/YR", "WAKING LIFE SURRENDERED TO FEEDS", C_AMBER),
    ]
    for i, (val, lbl, col) in enumerate(stats):
        sx = px0 + 68 + i * col_w
        draw.text((sx, cur_y + 24), val, fill=col, font=get_sans(42, bold=True))
        draw.text((sx, cur_y + 84), lbl, fill=C_MUTED, font=get_mono(12, bold=True))

    draw.text((px0 + 48, py1 - 78), "Ref: Imperial Maritime Customs (1839) • DataReportal (2025)", fill=C_MUTED, font=get_mono(11))
    draw_seal(canvas, px0 + 48, py1 - 50, size=36)
    draw.text((px0 + 96, py1 - 42), "observations.moth1.xyz/century-of-self-inflicted-humiliation", fill=C_OFFWHITE, font=get_mono(14, bold=True))

    out_path = os.path.join(OUT_DIR, "01_hero_hook.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered:", out_path)


# ==============================================================================
# CARD 02: THE ATTENTION LEDGER (1839 VS 2026)
# ==============================================================================
def render_card_02():
    canvas = create_base_canvas()
    draw = ImageDraw.Draw(canvas)

    draw.text((64, 48), "THE SILVER DEFICIT & THE ATTENTION LEDGER", fill=C_AMBER, font=get_mono(15, bold=True))
    draw.text((64, 78), "FROM CANTON OPIUM TO VARIABLE-RATIO FEEDS", fill=C_OFFWHITE, font=get_sans(46, bold=True))

    # Left Column: 1839 East India Company Model
    lx0, ly0, lx1, ly1 = 64, 155, 780, 795
    panel_l = Image.new("RGBA", (lx1 - lx0, ly1 - ly0), C_PANEL_BG)
    canvas.alpha_composite(panel_l, (lx0, ly0))
    draw.rectangle([(lx0, ly0), (lx1, ly1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, lx0, ly0, lx1, ly1, size=24, stroke=3, accent_color=C_AMBER)

    paste_cover_art(canvas, "public/issues/issue-04/canton-silver-ledger.webp", lx0 + 24, ly0 + 24, lx1 - 24, ly0 + 310)
    draw.rectangle([(lx0 + 24, ly0 + 24), (lx1 - 24, ly0 + 310)], outline=C_BORDER, width=1)

    cy = ly0 + 336
    draw.text((lx0 + 28, cy), "1839 • BENGAL-TO-CANTON MODEL", fill=C_AMBER, font=get_mono(14, bold=True))
    cy += 34
    draw.text((lx0 + 28, cy), "THE SILVER LEDGER", fill=C_OFFWHITE, font=get_sans(32, bold=True))
    cy += 50
    for bullet in [
        "• Commodity: Chemically refined Bengal opium",
        "• Objective: Reverse British silver trade deficit",
        "• Distribution: Armed clippers bypassing customs",
        "• Outcome: 20,283 chests burned; century of collapse",
    ]:
        draw.text((lx0 + 28, cy), bullet, fill=C_SLATE300, font=get_sans(21, bold=False))
        cy += 42

    # Right Column: 2026 Attention Extraction Model
    rx0, ry0, rx1, ry1 = 820, 155, 1536, 795
    panel_r = Image.new("RGBA", (rx1 - rx0, ry1 - ry0), C_PANEL_BG)
    canvas.alpha_composite(panel_r, (rx0, ry0))
    draw.rectangle([(rx0, ry0), (rx1, ry1)], outline=C_RED, width=2)
    draw_corner_brackets(draw, rx0, ry0, rx1, ry1, size=24, stroke=3, accent_color=C_RED)

    paste_cover_art(canvas, "public/issues/issue-04/attention-slot-machine.webp", rx0 + 24, ry0 + 24, rx1 - 24, ry0 + 310)
    draw.rectangle([(rx0 + 24, ry0 + 24), (rx1 - 24, ry0 + 310)], outline=C_BORDER, width=1)

    cy = ry0 + 336
    draw.text((rx0 + 28, cy), "2026 • ALGORITHMIC EXTRACTION", fill=C_RED, font=get_mono(14, bold=True))
    cy += 34
    draw.text((rx0 + 28, cy), "THE ATTENTION SLOT MACHINE", fill=C_OFFWHITE, font=get_sans(32, bold=True))
    cy += 50
    for bullet in [
        "• Commodity: 6h 40m/day total screen captivity",
        "• Social Feeds: 2h 23m/day (35+ waking days/yr)",
        "• Mechanism: Variable-ratio pull-to-refresh rewards",
        "• Outcome: Citizens pay for their own pacification",
    ]:
        draw.text((rx0 + 28, cy), bullet, fill=C_SLATE300, font=get_sans(21, bold=False))
        cy += 42

    draw.text((64, 834), "Ref: Julia Lovell, The Opium War (2011) • DataReportal (2025) • Natasha Dow Schüll, Addiction by Design", fill=C_MUTED, font=get_mono(12))
    draw_seal(canvas, 1490, 822, size=42)

    out_path = os.path.join(OUT_DIR, "02_extraction_ledger.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered:", out_path)


# ==============================================================================
# CARD 03: SELLING RAGE AT 5X (THE OUTRAGE MULTIPLIER)
# ==============================================================================
def render_card_03():
    canvas = create_base_canvas()
    draw = ImageDraw.Draw(canvas)

    draw.text((64, 48), "INTERNAL RANKING DISCLOSURES & PNAS TELEMETRY", fill=C_RED, font=get_mono(15, bold=True))
    draw.text((64, 78), "PEACE IS UNPROFITABLE: SELLING RAGE AT 5X", fill=C_OFFWHITE, font=get_sans(46, bold=True))

    # Left Artwork Box
    ax0, ay0, ax1, ay1 = 64, 160, 640, 780
    paste_cover_art(canvas, "public/issues/issue-04/rage-multiplier-5x.webp", ax0, ay0, ax1, ay1)
    draw.rectangle([(ax0, ay0), (ax1, ay1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, ax0, ay0, ax1, ay1, size=24, stroke=3, accent_color=C_RED)

    # Right Data Panel
    px0, py0, px1, py1 = 680, 160, 1536, 780
    panel = Image.new("RGBA", (px1 - px0, py1 - py0), C_PANEL_BG)
    canvas.alpha_composite(panel, (px0, py0))
    draw.rectangle([(px0, py0), (px1, py1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, px0, py0, px1, py1, size=24, stroke=3, accent_color=C_AMBER)

    cy = py0 + 46
    draw.text((px0 + 44, cy), "ALGORITHMIC ENGAGEMENT WEIGHTS", fill=C_AMBER, font=get_mono(15, bold=True))
    cy += 48

    # Bar 1: Standard Like (1x)
    draw.text((px0 + 44, cy), "STANDARD 'LIKE' REACTION (1 PT)", fill=C_SLATE300, font=get_mono(16, bold=True))
    cy += 30
    bar_max = px1 - px0 - 180
    draw.rectangle([(px0 + 44, cy), (px0 + 44 + int(bar_max * 0.20), cy + 44)], fill=C_MUTED)
    draw.text((px0 + 58 + int(bar_max * 0.20), cy + 8), "1x WEIGHT", fill=C_OFFWHITE, font=get_sans(22, bold=True))
    cy += 76

    # Bar 2: Moral-Emotional Language (+20% per word)
    draw.text((px0 + 44, cy), "MORAL-EMOTIONAL LANGUAGE DIFFUSION", fill=C_AMBER, font=get_mono(16, bold=True))
    cy += 30
    draw.rectangle([(px0 + 44, cy), (px0 + 44 + int(bar_max * 0.48), cy + 44)], fill=C_AMBER)
    draw.text((px0 + 58 + int(bar_max * 0.48), cy + 8), "+20% / WORD", fill=C_AMBER, font=get_sans(22, bold=True))
    cy += 76

    # Bar 3: Angry Reaction (5x)
    draw.text((px0 + 44, cy), "'ANGRY' REACTION AMPLIFICATION (5 PTS)", fill=C_RED, font=get_mono(16, bold=True))
    cy += 30
    draw.rectangle([(px0 + 44, cy), (px0 + 44 + bar_max, cy + 52)], fill=C_RED)
    draw.text((px0 + 64, cy + 10), "5x RANKING MULTIPLIER", fill=C_OFFWHITE, font=get_sans(24, bold=True))
    cy += 92

    # Thesis Callout
    qbox_h = 140
    draw.rectangle([(px0 + 44, cy), (px1 - 44, cy + qbox_h)], fill=C_INNER_BOX, outline=C_RED, width=2)
    quote = "“Contentment makes people close the app. Moral outrage and humiliation keep them locked to the screen for quarterly earnings.”"
    qy = cy + 24
    for ql in wrap_text(quote, get_sans(21, bold=True), px1 - px0 - 128, draw):
        draw.text((px0 + 64, qy), ql, fill=C_OFFWHITE, font=get_sans(21, bold=True))
        qy += 32

    draw.text((64, 834), "Ref: Internal Platform Ranking Disclosures (2021) • Brady et al., PNAS (2017)", fill=C_MUTED, font=get_mono(12))
    draw_seal(canvas, 1490, 822, size=42)

    out_path = os.path.join(OUT_DIR, "03_outrage_multiplier.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered:", out_path)


# ==============================================================================
# CARD 04: FORGOTTEN CASUALTIES & CLASS ASYMMETRY
# ==============================================================================
def render_card_04():
    canvas = create_base_canvas()
    draw = ImageDraw.Draw(canvas)

    draw.text((64, 48), "DEMOGRAPHIC CAPTURE & SILICON VALLEY HYPOCRISY", fill=C_AMBER, font=get_mono(15, bold=True))
    draw.text((64, 78), "FORGOTTEN ELDERS & DEALERS WHO DON'T CONSUME", fill=C_OFFWHITE, font=get_sans(44, bold=True))

    # Left Card: The Forgotten Casualties (Seniors 65+)
    lx0, ly0, lx1, ly1 = 64, 155, 780, 795
    panel_l = Image.new("RGBA", (lx1 - lx0, ly1 - ly0), C_PANEL_BG)
    canvas.alpha_composite(panel_l, (lx0, ly0))
    draw.rectangle([(lx0, ly0), (lx1, ly1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, lx0, ly0, lx1, ly1, size=24, stroke=3, accent_color=C_RED)

    paste_cover_art(canvas, "public/issues/issue-04/forgotten-elders.webp", lx0 + 24, ly0 + 24, lx1 - 24, ly0 + 310)
    draw.rectangle([(lx0 + 24, ly0 + 24), (lx1 - 24, ly0 + 310)], outline=C_BORDER, width=1)

    cy = ly0 + 332
    draw.text((lx0 + 28, cy), "ISOLATED ADULTS AGED 65+", fill=C_RED, font=get_mono(14, bold=True))
    cy += 34
    draw.text((lx0 + 28, cy), "+30% TO 50% DEMENTIA RISK", fill=C_OFFWHITE, font=get_sans(32, bold=True))
    cy += 46
    draw.text((lx0 + 28, cy), "7x MORE FABRICATED SHARES", fill=C_AMBER, font=get_sans(26, bold=True))
    cy += 48
    txt_l = "Hypercapitalist cities erased community hubs. Left in silent flats, elders become foot soldiers in synthetic culture wars."
    for tl in wrap_text(txt_l, get_sans(20, bold=False), lx1 - lx0 - 56, draw):
        draw.text((lx0 + 28, cy), tl, fill=C_SLATE300, font=get_sans(20, bold=False))
        cy += 30

    # Right Card: Palo Alto Asymmetry
    rx0, ry0, rx1, ry1 = 820, 155, 1536, 795
    panel_r = Image.new("RGBA", (rx1 - rx0, ry1 - ry0), C_PANEL_BG)
    canvas.alpha_composite(panel_r, (rx0, ry0))
    draw.rectangle([(rx0, ry0), (rx1, ry1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, rx0, ry0, rx1, ry1, size=24, stroke=3, accent_color=C_AMBER)

    paste_cover_art(canvas, "public/issues/issue-04/palo-alto-asymmetry.webp", rx0 + 24, ry0 + 24, rx1 - 24, ry0 + 310)
    draw.rectangle([(rx0 + 24, ry0 + 24), (rx1 - 24, ry0 + 310)], outline=C_BORDER, width=1)

    cy = ry0 + 332
    draw.text((rx0 + 28, cy), "PALO ALTO PRIVATE SCHOOLS", fill=C_AMBER, font=get_mono(14, bold=True))
    cy += 34
    draw.text((rx0 + 28, cy), "SCREEN-FREE UNTIL HIGH SCHOOL", fill=C_OFFWHITE, font=get_sans(30, bold=True))
    cy += 46
    draw.text((rx0 + 28, cy), "2x EXPOSURE FOR WORKING CLASS", fill=C_RED, font=get_sans(26, bold=True))
    cy += 48
    txt_r = "Dealers never smoke their own supply. Digital minimalism is sold to executives while unthrottled feeds pacify everyone else."
    for tr in wrap_text(txt_r, get_sans(20, bold=False), rx1 - rx0 - 56, draw):
        draw.text((rx0 + 28, cy), tr, fill=C_SLATE300, font=get_sans(20, bold=False))
        cy += 30

    draw.text((64, 834), "Ref: Guess et al., Science Advances (2019) • The Lancet Commission (2024) • Common Sense Media Census", fill=C_MUTED, font=get_mono(12))
    draw_seal(canvas, 1490, 822, size=42)

    out_path = os.path.join(OUT_DIR, "04_casualties_and_asymmetry.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered:", out_path)


# ==============================================================================
# CARD 05: THE MULTIFOLD ANTIDOTE
# ==============================================================================
def render_card_05():
    canvas = create_base_canvas()
    draw = ImageDraw.Draw(canvas)

    draw.text((64, 48), "STRUCTURAL INTERVENTIONS BEYOND PERSONAL WILLPOWER", fill=C_GREEN, font=get_mono(15, bold=True))
    draw.text((64, 78), "THE 4-FRONT ANTIDOTE TO ALGORITHMIC CAPTURE", fill=C_OFFWHITE, font=get_sans(44, bold=True))

    # 2x2 Grid of Structural Interventions
    cards = [
        ("01 • ZK-KYC PROOF-OF-PERSONHOOD", "Kill Bot & Troll Farms", "Every account maps 1:1 to a verified human via Zero-Knowledge cryptographic credentials while preserving pseudonymity.", "public/issues/issue-04/zk-kyc-shield.webp", C_GREEN),
        ("02 • CHRONOLOGICAL FEEDS BY LAW", "Outlaw 5x Outrage Ranking", "Ban engagement-driven ranking by default. Show only accounts users intentionally chose to follow, in chronological order.", "public/issues/issue-04/chronological-stream-law.webp", C_AMBER),
        ("03 • DISMANTLE WALLED GARDENS", "End Slot-Machine UI", "Prohibit infinite auto-play and pull-to-refresh traps while mandating protocol interoperability for clean user clients.", "public/issues/issue-04/mirror-of-history.webp", C_AMBER),
        ("04 • REBUILD THIRD PLACES", "Tax Ad Extraction", "Divert digital ad-extraction taxes into unmonetised public libraries, parks, and senior hubs for real human contact.", "public/issues/issue-04/third-places-renewal.webp", C_GREEN),
    ]

    cw, ch = 720, 300
    positions = [(64, 155), (816, 155), (64, 480), (816, 480)]

    for (kicker, title, desc, img_path, accent), (x0, y0) in zip(cards, positions):
        x1, y1 = x0 + cw, y0 + ch
        panel = Image.new("RGBA", (cw, ch), C_PANEL_BG)
        canvas.alpha_composite(panel, (x0, y0))
        draw.rectangle([(x0, y0), (x1, y1)], outline=C_BORDER, width=2)
        draw_corner_brackets(draw, x0, y0, x1, y1, size=20, stroke=3, accent_color=accent)

        paste_cover_art(canvas, img_path, x0 + 20, y0 + 20, x0 + 240, y1 - 20)
        draw.rectangle([(x0 + 20, y0 + 20), (x0 + 240, y1 - 20)], outline=C_BORDER, width=1)

        tx = x0 + 266
        ty = y0 + 30
        draw.text((tx, ty), kicker, fill=accent, font=get_mono(13, bold=True))
        ty += 30
        draw.text((tx, ty), title, fill=C_OFFWHITE, font=get_sans(28, bold=True))
        ty += 46
        for dl in wrap_text(desc, get_sans(19, bold=False), cw - 294, draw):
            draw.text((tx, ty), dl, fill=C_SLATE300, font=get_sans(19, bold=False))
            ty += 28

    draw.text((64, 834), "Ref: Oxford Internet Institute • Ray Oldenburg, The Great Good Place • observations.moth1.xyz/century-of-self-inflicted-humiliation", fill=C_MUTED, font=get_mono(12))
    draw_seal(canvas, 1490, 822, size=42)

    out_path = os.path.join(OUT_DIR, "05_the_multifold_antidote.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered:", out_path)


if __name__ == "__main__":
    render_card_01()
    render_card_02()
    render_card_03()
    render_card_04()
    render_card_05()
    print("\nAll 5 Issue #04 X cards rendered cleanly!")
