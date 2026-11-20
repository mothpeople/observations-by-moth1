#!/usr/bin/env python3
"""
Programmatic Pinterest Pin Generator (1000x1500, 2:3) — Issues #03 & #04
Observations by Moth1
"""

import os
from PIL import Image, ImageDraw, ImageFont

# Master Palette — Cyber-Zen Sumi-e
C_CHARCOAL = (9, 10, 15, 255)        # #090a0f
C_PANEL_BG = (14, 16, 22, 248)       # #0e1016
C_INNER_BOX = (20, 24, 32, 255)      # #141820
C_OFFWHITE = (241, 245, 249, 255)    # #f1f5f9
C_SLATE300 = (203, 213, 225, 255)    # #cbd5e1
C_MUTED = (148, 163, 184, 255)       # #94a3b8
C_AMBER = (234, 179, 8, 255)         # #eab308
C_GREEN = (34, 197, 94, 255)         # #22c55e
C_CRIMSON = (220, 38, 38, 255)       # #dc2626
C_RED = (239, 68, 68, 255)           # #ef4444
C_BORDER = (230, 228, 221, 45)
C_GRID_LINE = (230, 228, 221, 8)

FONT_SANS = "/System/Library/Fonts/HelveticaNeue.ttc"
FONT_SERIF = "/System/Library/Fonts/Supplemental/Georgia.ttf"
FONT_SERIF_ITALIC = "/System/Library/Fonts/Supplemental/Georgia Italic.ttf"
FONT_MONO = "/System/Library/Fonts/SFNSMono.ttf"
if not os.path.exists(FONT_MONO):
    FONT_MONO = "/System/Library/Fonts/Menlo.ttc"


def get_sans(size, bold=False):
    index = 1 if bold else 0
    try:
        return ImageFont.truetype(FONT_SANS, size, index=index)
    except Exception:
        return ImageFont.load_default()


def get_serif(size, italic=False):
    path = FONT_SERIF_ITALIC if italic else FONT_SERIF
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return get_sans(size, bold=False)


def get_mono(size, bold=False):
    try:
        return ImageFont.truetype(FONT_MONO, size)
    except Exception:
        return ImageFont.load_default()


def draw_corner_brackets(draw, x0, y0, x1, y1, size=24, stroke=3, accent=C_AMBER):
    draw.line([(x0 - 2, y0 - 2), (x0 + size, y0 - 2)], fill=C_OFFWHITE, width=stroke)
    draw.line([(x0 - 2, y0 - 2), (x0 - 2, y0 + size)], fill=C_OFFWHITE, width=stroke)
    draw.line([(x1 - size, y1 + 2), (x1 + 2, y1 + 2)], fill=accent, width=stroke)
    draw.line([(x1 + 2, y1 - size), (x1 + 2, y1 + 2)], fill=accent, width=stroke)


def draw_seal(img, x, y, size=56, text="MOTH1"):
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
    cur = []
    for w in words:
        test = " ".join(cur + [w])
        if draw.textbbox((0, 0), test, font=font)[2] <= max_width:
            cur.append(w)
        else:
            if cur:
                lines.append(" ".join(cur))
            cur = [w]
    if cur:
        lines.append(" ".join(cur))
    return lines


def create_pin_canvas():
    w, h = 1000, 1500
    canvas = Image.new("RGBA", (w, h), C_CHARCOAL)
    draw = ImageDraw.Draw(canvas)
    for x in range(0, w, 48):
        draw.line([(x, 0), (x, h)], fill=C_GRID_LINE, width=1)
    for y in range(0, h, 48):
        draw.line([(0, y), (w, y)], fill=C_GRID_LINE, width=1)
    draw.rectangle([(20, 20), (w - 21, h - 21)], outline=C_BORDER, width=1)
    return canvas


def paste_cover_art(canvas, img_path, x0, y0, x1, y1):
    if not os.path.exists(img_path):
        return
    art = Image.open(img_path).convert("RGBA")
    bw, bh = x1 - x0, y1 - y0
    scale = max(bw / art.width, bh / art.height)
    nw, nh = int(art.width * scale), int(art.height * scale)
    scaled = art.resize((nw, nh), Image.Resampling.LANCZOS)
    cx_off = (nw - bw) // 2
    cy_off = (nh - bh) // 2
    canvas.alpha_composite(scaled.crop((cx_off, cy_off, cx_off + bw, cy_off + bh)), (x0, y0))


def draw_pin_footer(canvas, draw, url_text, cta_label, accent):
    foot_y = 1365
    draw.line([(60, foot_y - 24), (940, foot_y - 24)], fill=C_BORDER, width=1)
    draw_seal(canvas, 60, foot_y, size=60, text="MOTH1")
    draw.text((136, foot_y + 6), "OBSERVATIONS BY MOTH1  •  INTERACTIVE ESSAY", fill=C_MUTED, font=get_mono(11, bold=True))
    draw.text((136, foot_y + 28), url_text, fill=C_OFFWHITE, font=get_sans(19, bold=True))

    btn_w, btn_h = 210, 52
    bx0, by0 = 940 - btn_w, foot_y + 4
    draw.rectangle([(bx0, by0), (940, by0 + btn_h)], fill=accent, outline=C_OFFWHITE, width=2)
    bf = get_sans(14, bold=True)
    bb = draw.textbbox((0, 0), cta_label, font=bf)
    draw.text((bx0 + (btn_w - (bb[2] - bb[0])) // 2, by0 + 17), cta_label, fill=C_CHARCOAL, font=bf)


# ==============================================================================
# ISSUE 03 PINS (WAR ON DRUGS)
# ==============================================================================

def render_issue03_pin_01(out_dir):
    canvas = create_pin_canvas()
    draw = ImageDraw.Draw(canvas)

    draw.text((60, 56), "ISSUE 03  •  EMPIRICAL PROHIBITION LEDGER", fill=C_AMBER, font=get_mono(14, bold=True))
    draw.text((60, 92), "FIFTY YEARS OF PROHIBITION.", fill=C_OFFWHITE, font=get_sans(48, bold=True))
    draw.text((60, 150), "ZERO GROUND WON.", fill=C_RED, font=get_sans(48, bold=True))

    # Hero Artwork Frame
    ax0, ay0, ax1, ay1 = 60, 232, 940, 620
    paste_cover_art(canvas, "public/issues/issue-03/trillion-burn.webp", ax0, ay0, ax1, ay1)
    draw.rectangle([(ax0, ay0), (ax1, ay1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, ax0, ay0, ax1, ay1, size=28, stroke=3, accent=C_AMBER)

    # 3 Metric Cards
    metrics = [
        ("$1T+", "PUBLIC WEALTH INCINERATED", "Fifty years of militarized enforcement and prison expansion.", C_RED),
        ("+190%", "SYNTHETIC POTENCY SURGE", "Iron Law of Prohibition pushes supply toward concentrated synthetics.", C_AMBER),
        ("-81%", "REAL STREET PRICE DROP", "Illicit narcotics are cheaper and more accessible than ever.", C_GREEN),
    ]
    cy = 656
    card_h = 185
    for val, title, desc, col in metrics:
        draw.rectangle([(60, cy), (940, cy + card_h)], fill=C_PANEL_BG, outline=C_BORDER, width=2)
        draw_corner_brackets(draw, 60, cy, 940, cy + card_h, size=18, stroke=3, accent=col)
        draw.text((92, cy + 44), val, fill=col, font=get_sans(60, bold=True))
        draw.text((340, cy + 42), title, fill=C_OFFWHITE, font=get_mono(16, bold=True))
        ty = cy + 78
        for dl in wrap_text(desc, get_sans(21, bold=False), 560, draw):
            draw.text((340, ty), dl, fill=C_SLATE300, font=get_sans(21, bold=False))
            ty += 30
        cy += card_h + 22

    draw.text((60, 1295), "Ref: UNODC World Drug Report • Drug Policy Alliance • Global Commission on Drug Policy", fill=C_MUTED, font=get_mono(11))
    draw_pin_footer(canvas, draw, "observations.moth1.xyz/war-on-drugs", "READ ESSAY  ➔", C_AMBER)

    out_path = os.path.join(out_dir, "01_infographic_plate.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered Issue 03 Pin 1:", out_path)


def render_issue03_pin_02(out_dir):
    canvas = create_pin_canvas()
    draw = ImageDraw.Draw(canvas)

    draw.text((60, 56), "ISSUE 03  •  THE OLIGARCH'S PHARMACY", fill=C_AMBER, font=get_mono(14, bold=True))
    draw.text((60, 92), "THE CLASS CONTRADICTION", fill=C_OFFWHITE, font=get_sans(48, bold=True))

    # Split Graphic Novel Panels
    paste_cover_art(canvas, "public/issues/issue-03/executive-loft.webp", 60, 180, 488, 600)
    draw.rectangle([(60, 180), (488, 600)], outline=C_AMBER, width=2)
    draw.rectangle([(60, 548), (488, 600)], fill=(14, 16, 22, 235))
    draw.text((78, 564), "TIER A  •  EXECUTIVE BIOHACKING", fill=C_AMBER, font=get_mono(14, bold=True))

    paste_cover_art(canvas, "public/issues/issue-03/concrete-cell.webp", 512, 180, 940, 600)
    draw.rectangle([(512, 180), (940, 600)], outline=C_RED, width=2)
    draw.rectangle([(512, 548), (940, 600)], fill=(14, 16, 22, 235))
    draw.text((530, 564), "TIER B  •  WORKING-CLASS CAGES", fill=C_RED, font=get_mono(14, bold=True))

    # Quote Box
    qy0, qy1 = 638, 1080
    draw.rectangle([(60, qy0), (940, qy1)], fill=C_PANEL_BG, outline=C_BORDER, width=2)
    draw_corner_brackets(draw, 60, qy0, 940, qy1, size=28, stroke=3, accent=C_RED)

    quote = "“Billionaires microdose in high-rise boardrooms for creative clarity, while working-class kids rot in solitary cages for the exact same molecule.”"
    ty = qy0 + 54
    for ql in wrap_text(quote, get_serif(34, italic=True), 800, draw):
        draw.text((100, ty), ql, fill=C_OFFWHITE, font=get_serif(34, italic=True))
        ty += 52

    draw.line([(100, ty + 20), (340, ty + 20)], fill=C_RED, width=3)
    draw.text((100, ty + 42), "THE STATE DOES NOT FEAR THE MOLECULE. IT POLICES THE CLASS.", fill=C_AMBER, font=get_mono(15, bold=True))

    # Stat Strip
    sy0, sy1 = 1118, 1265
    draw.rectangle([(60, sy0), (940, sy1)], fill=C_INNER_BOX, outline=C_RED, width=2)
    draw.text((92, sy0 + 26), "82%", fill=C_RED, font=get_sans(62, bold=True))
    draw.text((255, sy0 + 32), "POSSESSION ARRESTS TARGET WORKING-CLASS CITIZENS", fill=C_OFFWHITE, font=get_mono(15, bold=True))
    draw.text((255, sy0 + 66), "Meanwhile, The Lancet ranks legal taxed Alcohol #1 in overall harm (72/100).", fill=C_SLATE300, font=get_sans(19, bold=False))

    draw.text((60, 1295), "Ref: FBI UCR • Sentencing Project • Prof. David Nutt et al., The Lancet (2010)", fill=C_MUTED, font=get_mono(11))
    draw_pin_footer(canvas, draw, "observations.moth1.xyz/war-on-drugs", "READ ESSAY  ➔", C_RED)

    out_path = os.path.join(out_dir, "02_thesis_quote_plate.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered Issue 03 Pin 2:", out_path)


def render_issue03_pin_03(out_dir):
    canvas = create_pin_canvas()
    draw = ImageDraw.Draw(canvas)

    draw.text((60, 56), "ISSUE 03  •  THE EMPIRICAL EXIT", fill=C_GREEN, font=get_mono(14, bold=True))
    draw.text((60, 92), "PORTUGAL LAW 30/2000:", fill=C_OFFWHITE, font=get_sans(48, bold=True))
    draw.text((60, 150), "HEALTH OVER HANDCUFFS", fill=C_GREEN, font=get_sans(48, bold=True))

    ax0, ay0, ax1, ay1 = 60, 232, 940, 620
    paste_cover_art(canvas, "public/issues/issue-03/lisbon-model.webp", ax0, ay0, ax1, ay1)
    draw.rectangle([(ax0, ay0), (ax1, ay1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, ax0, ay0, ax1, ay1, size=28, stroke=3, accent=C_GREEN)

    rows = [
        ("01 • -80% OVERDOSE DEATHS", "Down to 6 per million citizens—a fraction of EU & US averages.", C_GREEN),
        ("02 • -90% NEW HIV DIAGNOSES", "Needle exchange & medical clinics replaced felony prosecution.", C_AMBER),
        ("03 • -18% TOTAL SOCIAL COST", "Police & court budgets redirected to treatment and employment.", C_GREEN),
    ]
    cy = 656
    row_h = 185
    for title, desc, col in rows:
        draw.rectangle([(60, cy), (940, cy + row_h)], fill=C_PANEL_BG, outline=C_BORDER, width=2)
        draw_corner_brackets(draw, 60, cy, 940, cy + row_h, size=18, stroke=3, accent=col)
        draw.text((92, cy + 38), title, fill=col, font=get_sans(34, bold=True))
        ty = cy + 92
        for dl in wrap_text(desc, get_sans(22, bold=False), 800, draw):
            draw.text((92, ty), dl, fill=C_SLATE300, font=get_sans(22, bold=False))
            ty += 32
        cy += row_h + 22

    draw.text((60, 1295), "Ref: Portuguese SICAD • EMCDDA 20-Year Decriminalisation Telemetry", fill=C_MUTED, font=get_mono(11))
    draw_pin_footer(canvas, draw, "observations.moth1.xyz/war-on-drugs", "LAUNCH ESSAY  ➔", C_GREEN)

    out_path = os.path.join(out_dir, "03_interactive_mockup_plate.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered Issue 03 Pin 3:", out_path)


# ==============================================================================
# ISSUE 04 PINS (THE CENTURY OF SELF-INFLICTED HUMILIATION)
# ==============================================================================

def render_issue04_pin_01(out_dir):
    canvas = create_pin_canvas()
    draw = ImageDraw.Draw(canvas)

    draw.text((60, 56), "ISSUE 04  •  THE SECOND OPIUM WAR", fill=C_AMBER, font=get_mono(14, bold=True))
    draw.text((60, 92), "THE ATTENTION LEDGER:", fill=C_OFFWHITE, font=get_sans(48, bold=True))
    draw.text((60, 150), "1839 CANTON VS. 2026 FEEDS", fill=C_AMBER, font=get_sans(46, bold=True))

    ax0, ay0, ax1, ay1 = 60, 232, 940, 620
    paste_cover_art(canvas, "public/issues/issue-04/canton-silver-ledger.webp", ax0, ay0, ax1, ay1)
    draw.rectangle([(ax0, ay0), (ax1, ay1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, ax0, ay0, ax1, ay1, size=28, stroke=3, accent=C_AMBER)

    metrics = [
        ("2.6M LBS", "OPIUM BURNED AT HUMEN (1839)", "Britain waged war to reverse a silver deficit via chemical pacification.", C_RED),
        ("35+ DAYS", "WAKING LIFE LOST PER YEAR", "6h 40m daily screen time & 2h 23m on variable-ratio social feeds.", C_AMBER),
        ("5x RANK", "OUTRAGE OVER STANDARD LIKES", "Algorithms weight 'Angry' reactions 5x higher—peace is unprofitable.", C_RED),
    ]
    cy = 656
    card_h = 185
    for val, title, desc, col in metrics:
        draw.rectangle([(60, cy), (940, cy + card_h)], fill=C_PANEL_BG, outline=C_BORDER, width=2)
        draw_corner_brackets(draw, 60, cy, 940, cy + card_h, size=18, stroke=3, accent=col)
        draw.text((92, cy + 44), val, fill=col, font=get_sans(54, bold=True))
        draw.text((370, cy + 42), title, fill=C_OFFWHITE, font=get_mono(16, bold=True))
        ty = cy + 78
        for dl in wrap_text(desc, get_sans(21, bold=False), 530, draw):
            draw.text((370, ty), dl, fill=C_SLATE300, font=get_sans(21, bold=False))
            ty += 30
        cy += card_h + 22

    draw.text((60, 1295), "Ref: Imperial Maritime Customs (1839) • DataReportal (2025) • Internal Disclosures (2021)", fill=C_MUTED, font=get_mono(11))
    draw_pin_footer(canvas, draw, "observations.moth1.xyz/century-of-self-inflicted-humiliation", "READ ESSAY  ➔", C_AMBER)

    out_path = os.path.join(out_dir, "01_infographic_plate.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered Issue 04 Pin 1:", out_path)


def render_issue04_pin_02(out_dir):
    canvas = create_pin_canvas()
    draw = ImageDraw.Draw(canvas)

    draw.text((60, 56), "ISSUE 04  •  THE MIRROR OF HISTORY", fill=C_RED, font=get_mono(14, bold=True))
    draw.text((60, 92), "SELF-INFLICTED HUMILIATION", fill=C_OFFWHITE, font=get_sans(48, bold=True))

    ax0, ay0, ax1, ay1 = 60, 180, 940, 620
    paste_cover_art(canvas, "public/issues/issue-04/hero-humen-2am.webp", ax0, ay0, ax1, ay1)
    draw.rectangle([(ax0, ay0), (ax1, ay1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, ax0, ay0, ax1, ay1, size=28, stroke=3, accent=C_RED)

    qy0, qy1 = 656, 1080
    draw.rectangle([(60, qy0), (940, qy1)], fill=C_PANEL_BG, outline=C_BORDER, width=2)
    draw_corner_brackets(draw, 60, qy0, 940, qy1, size=28, stroke=3, accent=C_AMBER)

    quote = "“Two hundred years ago, foreign gunboats forced addiction to balance a ledger. Today, we carry the opium den in our pockets and thank the dealer for the distraction.”"
    ty = qy0 + 50
    for ql in wrap_text(quote, get_serif(33, italic=True), 800, draw):
        draw.text((100, ty), ql, fill=C_OFFWHITE, font=get_serif(33, italic=True))
        ty += 50

    draw.line([(100, ty + 18), (340, ty + 18)], fill=C_AMBER, width=3)
    draw.text((100, ty + 40), "DEALERS NEVER SMOKE THEIR OWN SUPPLY: SCREEN-FREE PALO ALTO SCHOOLS", fill=C_AMBER, font=get_mono(14, bold=True))

    sy0, sy1 = 1118, 1265
    draw.rectangle([(60, sy0), (940, sy1)], fill=C_INNER_BOX, outline=C_RED, width=2)
    draw.text((92, sy0 + 26), "7x", fill=C_RED, font=get_sans(64, bold=True))
    draw.text((195, sy0 + 32), "FABRICATED POLITICAL SHARES BY ISOLATED SENIORS (65+)", fill=C_OFFWHITE, font=get_mono(15, bold=True))
    draw.text((195, sy0 + 66), "Social isolation also drives a +30% to 50% surge in clinical dementia risk.", fill=C_SLATE300, font=get_sans(19, bold=False))

    draw.text((60, 1295), "Ref: Guess et al., Science Advances (2019) • The Lancet Commission on Dementia (2024)", fill=C_MUTED, font=get_mono(11))
    draw_pin_footer(canvas, draw, "observations.moth1.xyz/century-of-self-inflicted-humiliation", "READ ESSAY  ➔", C_RED)

    out_path = os.path.join(out_dir, "02_thesis_quote_plate.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered Issue 04 Pin 2:", out_path)


def render_issue04_pin_03(out_dir):
    canvas = create_pin_canvas()
    draw = ImageDraw.Draw(canvas)

    draw.text((60, 56), "ISSUE 04  •  THE MULTIFOLD ANTIDOTE", fill=C_GREEN, font=get_mono(14, bold=True))
    draw.text((60, 92), "FOUR STRUCTURAL REFORMS", fill=C_OFFWHITE, font=get_sans(48, bold=True))

    ax0, ay0, ax1, ay1 = 60, 175, 940, 480
    paste_cover_art(canvas, "public/issues/issue-04/third-places-renewal.webp", ax0, ay0, ax1, ay1)
    draw.rectangle([(ax0, ay0), (ax1, ay1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, ax0, ay0, ax1, ay1, size=24, stroke=3, accent=C_GREEN)

    reforms = [
        ("01 • ZK-KYC PROOF-OF-PERSONHOOD", "Every account maps 1:1 to a verified human, killing bot & state troll farms.", C_GREEN),
        ("02 • CHRONOLOGICAL FEEDS BY LAW", "Ban 5x algorithmic outrage ranking; show only followed accounts in order.", C_AMBER),
        ("03 • KILL SLOT-MACHINE UI TRAPS", "Prohibit infinite auto-play & mandate open protocol interoperability.", C_AMBER),
        ("04 • REBUILD THIRD PLACES", "Tax ad extraction to fund unmonetised public libraries, parks & senior hubs.", C_GREEN),
    ]
    cy = 510
    row_h = 175
    for title, desc, col in reforms:
        draw.rectangle([(60, cy), (940, cy + row_h)], fill=C_PANEL_BG, outline=C_BORDER, width=2)
        draw_corner_brackets(draw, 60, cy, 940, cy + row_h, size=16, stroke=3, accent=col)
        draw.text((90, cy + 30), title, fill=col, font=get_mono(18, bold=True))
        ty = cy + 68
        for dl in wrap_text(desc, get_sans(22, bold=False), 800, draw):
            draw.text((90, ty), dl, fill=C_OFFWHITE, font=get_sans(22, bold=False))
            ty += 32
        cy += row_h + 18

    draw.text((60, 1295), "Ref: Oxford Internet Institute • Ray Oldenburg, The Great Good Place", fill=C_MUTED, font=get_mono(11))
    draw_pin_footer(canvas, draw, "observations.moth1.xyz/century-of-self-inflicted-humiliation", "LAUNCH ESSAY  ➔", C_GREEN)

    out_path = os.path.join(out_dir, "03_interactive_mockup_plate.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered Issue 04 Pin 3:", out_path)


def main():
    p3_dir = "dist-packages/issue-03-war-on-drugs/pinterest/pins"
    p4_dir = "dist-packages/issue-04-self-inflicted-humiliation/pinterest/pins"
    os.makedirs(p3_dir, exist_ok=True)
    os.makedirs(p4_dir, exist_ok=True)

    print("=== Rendering Issue 03 Pins (1000x1500) ===")
    render_issue03_pin_01(p3_dir)
    render_issue03_pin_02(p3_dir)
    render_issue03_pin_03(p3_dir)

    print("\n=== Rendering Issue 04 Pins (1000x1500) ===")
    render_issue04_pin_01(p4_dir)
    render_issue04_pin_02(p4_dir)
    render_issue04_pin_03(p4_dir)
    print("\nAll Issue 03 & 04 Pinterest Pins generated successfully!")


if __name__ == "__main__":
    main()
