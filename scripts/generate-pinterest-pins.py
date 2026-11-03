#!/usr/bin/env python3
"""
Programmatic Pinterest Pin Generator for Observations by Moth1
Directly adapted from authentic X (Twitter) card sequences & website data:
  - Issue 01: The Geriatric Disconnect & Wage Data, 4-Stage Protest Loop, The Anchor Thesis
  - Issue 02: The Collapsing Venn Diagram (0.72-0.97 TFR), Biological Correction Quote, 3 Taboo Counter-Proposals

All pins rendered at 1000x1500 (2:3 aspect ratio) at 100% PNG quality.
"""

import os
import sys
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Color Palette — Cyber-Zen Sumi-e
C_CHARCOAL = (12, 13, 16, 255)       # #0c0d10 base canvas
C_PANEL_BG = (18, 20, 25, 248)       # Elevated card background
C_INNER_BOX = (24, 28, 35, 255)      # Metric callout container
C_OFFWHITE = (230, 228, 221, 255)    # Bone-white ink
C_MUTED = (165, 168, 165, 255)       # Muted slate secondary text
C_MINT = (134, 239, 172, 255)        # #86efac
C_CYAN = (103, 232, 249, 255)        # #67e8f9
C_ROSE = (253, 164, 175, 255)        # #fda4af
C_PURPLE = (192, 132, 252, 255)      # #c084fc
C_AMBER = (217, 119, 6, 255)         # #d97706
C_CRIMSON = (220, 38, 38, 255)       # #dc2626
C_BORDER = (230, 228, 221, 40)
C_GRID_LINE = (230, 228, 221, 7)

# Typography Paths
FONT_SANS = "/System/Library/Fonts/HelveticaNeue.ttc"
FONT_SERIF = "/System/Library/Fonts/Supplemental/Georgia.ttf"
FONT_SERIF_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
FONT_SERIF_ITALIC = "/System/Library/Fonts/Supplemental/Georgia Italic.ttf"
FONT_MONO = "/System/Library/Fonts/SFNSMono.ttf"
if not os.path.exists(FONT_MONO):
    FONT_MONO = "/System/Library/Fonts/Menlo.ttc"

def get_sans(size, bold=False, condensed=False):
    index = 1 if bold else (4 if condensed else 0)
    try:
        return ImageFont.truetype(FONT_SANS, size, index=index)
    except:
        return ImageFont.load_default()

def get_serif(size, bold=False, italic=False):
    f_path = FONT_SERIF_BOLD if bold else (FONT_SERIF_ITALIC if italic else FONT_SERIF)
    try:
        return ImageFont.truetype(f_path, size)
    except:
        return get_sans(size, bold=bold)

def get_mono(size, bold=False):
    try:
        return ImageFont.truetype(FONT_MONO, size)
    except:
        return ImageFont.load_default()

def draw_corner_brackets(draw, x0, y0, x1, y1, size=24, stroke=3, accent_color=C_AMBER):
    # Top-Left (Bone white)
    draw.line([(x0 - 2, y0 - 2), (x0 + size, y0 - 2)], fill=C_OFFWHITE, width=stroke)
    draw.line([(x0 - 2, y0 - 2), (x0 - 2, y0 + size)], fill=C_OFFWHITE, width=stroke)
    # Bottom-Right (Accent)
    draw.line([(x1 - size, y1 + 2), (x1 + 2, y1 + 2)], fill=accent_color, width=stroke)
    draw.line([(x1 + 2, y1 - size), (x1 + 2, y1 + 2)], fill=accent_color, width=stroke)

def draw_seal(img, x, y, size=56, text="MOTH1"):
    seal_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(seal_img)
    s_draw.rectangle([(2, 2), (size - 3, size - 3)], fill=C_CRIMSON, outline=C_OFFWHITE, width=2)
    s_font = get_mono(12, bold=True)
    bbox = s_draw.textbbox((0, 0), text, font=s_font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    s_draw.text(((size - tw) // 2, (size - th) // 2 - 1), text, fill=C_OFFWHITE, font=s_font)
    img.alpha_composite(seal_img, (x, y))

def wrap_text(text, font, max_width, draw):
    words = text.split()
    lines = []
    current_line = []
    for word in words:
        test_line = ' '.join(current_line + [word])
        bbox = draw.textbbox((0, 0), test_line, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(' '.join(current_line))
            current_line = [word]
    if current_line:
        lines.append(' '.join(current_line))
    return lines

def create_base_canvas(width=1000, height=1500):
    canvas = Image.new("RGBA", (width, height), C_CHARCOAL)
    c_draw = ImageDraw.Draw(canvas)
    
    # 50px Sumi-e Grid texture overlay
    grid_spacing = 50
    for x in range(0, width, grid_spacing):
        c_draw.line([(x, 0), (x, height)], fill=C_GRID_LINE, width=1)
    for y in range(0, height, grid_spacing):
        c_draw.line([(0, y), (width, y)], fill=C_GRID_LINE, width=1)
        
    # Inset canvas border
    c_draw.rectangle([(16, 16), (width - 17, height - 17)], outline=(230, 228, 221, 26), width=1)
    return canvas

# ==============================================================================
# ISSUE 01: WATERING GRASS IN A THUNDERSTORM
# ==============================================================================

def render_issue01_pin_01(out_dir):
    """
    Pin 1: Data / Infographic Plate — The Geriatric Disconnect & Wage Data
    Reference: X Card 02 (11.4x home price, -38% purchasing power, 70+ yr avg leader age)
    """
    canvas = create_base_canvas()
    draw = ImageDraw.Draw(canvas)
    
    # Top Header
    draw.text((60, 48), "// OBSERVATIONS BY MOTH1 • ISSUE 01", fill=C_AMBER, font=get_mono(14, bold=True))
    draw.text((1000 - 180, 48), "PIN [ 1 / 3 ]", fill=C_AMBER, font=get_mono(14, bold=True))
    
    f_title = get_sans(38, bold=True)
    draw.text((60, 78), "THE GERIATRIC DISCONNECT", fill=C_OFFWHITE, font=f_title)
    f_sub = get_sans(17, bold=False)
    draw.text((60, 126), "A detached political class lecturing locked-out youth on work ethic.", fill=C_MUTED, font=f_sub)
    
    # Hero Artwork Panel (60, 165) to (940, 505) - 340px high
    art_x0, art_y0, art_x1, art_y1 = 60, 165, 940, 505
    art_w = art_x1 - art_x0
    art_h = art_y1 - art_y0
    
    balcony = Image.open("public/issues/issue-01/disconnect-balcony.webp").convert("RGBA")
    b_scaled = balcony.resize((art_w, art_h), Image.Resampling.LANCZOS)
    canvas.alpha_composite(b_scaled, (art_x0, art_y0))
    
    draw.rectangle([(art_x0, art_y0), (art_x1, art_y1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, art_x0, art_y0, art_x1, art_y1, size=24, stroke=3, accent_color=C_CRIMSON)
    
    # Pill on Artwork
    draw.rectangle([(art_x0 + 20, art_y1 - 44), (art_x0 + 440, art_y1 - 14)], fill=(12, 13, 16, 230), outline=C_CRIMSON, width=1)
    draw.text((art_x0 + 32, art_y1 - 36), "// GENERATIONAL LOCKOUT • THE HIGH BALCONY", fill=C_CRIMSON, font=get_mono(11, bold=True))
    
    # 3 Empirical Metric Panels (from X Card 2)
    metrics = [
        (
            "11.4x",
            C_AMBER,
            "MEDIAN HOME PRICE TO YOUTH WAGES",
            "Locked doors. In 1980, the ratio sat at 3.2x. Today, homeownership requires two generational inheritances.",
            "Ref: St. Louis Fed / Housing Affordability Ledger"
        ),
        (
            "-38%",
            C_CRIMSON,
            "REAL PURCHASING POWER VS 1990 BASELINE",
            "The economy alleged 'growth' while everyday purchasing power quietly collapsed beneath floorboards.",
            "Ref: OECD Generational Wage Index"
        ),
        (
            "70+ YRS",
            C_OFFWHITE,
            "AVG LEADER AGE VS 28 YR CITIZEN MEDIAN",
            "Geriatrics whose upward mobility was guaranteed now lecture the locked-out on grit and discipline.",
            "Ref: Global Legislative Demographics (2024)"
        )
    ]
    
    cur_y = 530
    for val, col, label, desc, ref in metrics:
        box_h = 160
        draw.rectangle([(60, cur_y), (940, cur_y + box_h)], fill=C_INNER_BOX, outline=C_BORDER, width=1)
        draw_corner_brackets(draw, 60, cur_y, 940, cur_y + box_h, size=18, stroke=3, accent_color=col)
        
        # Big number
        draw.text((85, cur_y + 14), val, fill=col, font=get_sans(46, bold=True))
        draw.text((85, cur_y + 68), f"// {label}", fill=C_OFFWHITE, font=get_mono(12, bold=True))
        
        dlines = wrap_text(desc, get_sans(15, bold=False), 800, draw)
        dy = cur_y + 94
        for l in dlines:
            draw.text((85, dy), l, fill=C_MUTED, font=get_sans(15, bold=False))
            dy += 20
            
        cur_y += box_h + 16
        
    # Generational Reality Box
    v_box_h = 115
    draw.rectangle([(60, cur_y), (940, cur_y + v_box_h)], fill=(20, 24, 30, 255), outline=C_AMBER, width=2)
    draw.text((85, cur_y + 16), "// GENERATIONAL_REALITY", fill=C_AMBER, font=get_mono(12, bold=True))
    v_text = "“Young people are entering a world that effectively locked the door and pulled down the shutters before they could even get a foot in.”"
    f_v = get_sans(19, bold=True)
    v_lines = wrap_text(v_text, f_v, 810, draw)
    vy = cur_y + 42
    for vl in v_lines:
        draw.text((85, vy), vl, fill=C_OFFWHITE, font=f_v)
        vy += 26
    
    # Bottom Footer
    foot_y = 1380
    draw.line([(60, foot_y - 20), (940, foot_y - 20)], fill=C_BORDER, width=1)
    draw_seal(canvas, 60, foot_y, size=60, text="MOTH1")
    draw.text((135, foot_y + 8), "// READ THE FULL INTERACTIVE SCROLLYTELLING ESSAY:", fill=C_MUTED, font=get_mono(11, bold=True))
    draw.text((135, foot_y + 28), "observations.moth1.xyz/watering-grass", fill=C_OFFWHITE, font=get_sans(22, bold=True))
    
    btn_w, btn_h = 240, 54
    btn_x0 = 940 - btn_w
    btn_y0 = foot_y + 4
    draw.rectangle([(btn_x0, btn_y0), (940, btn_y0 + btn_h)], fill=C_AMBER, outline=C_OFFWHITE, width=2)
    b_font = get_sans(15, bold=True)
    bb = draw.textbbox((0, 0), "EXPLORE ESSAY  ➔", font=b_font)
    draw.text((btn_x0 + (btn_w - (bb[2] - bb[0])) // 2, btn_y0 + 18), "EXPLORE ESSAY  ➔", fill=(12, 13, 16, 255), font=b_font)
    
    out_path = os.path.join(out_dir, "01_infographic_plate.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered Issue 01 Pin 1:", out_path)

def render_issue01_pin_02(out_dir):
    """
    Pin 2: Mechanism / Escalation Plate — The 4-Stage Protest Loop
    Reference: X Card 03 (The Catalyst, The Overreaction, The Escalation, The Void)
    """
    canvas = create_base_canvas()
    draw = ImageDraw.Draw(canvas)
    
    # Top Header
    draw.text((60, 48), "// SYSTEMIC_MECHANISM • ESCALATION_ENGINE", fill=C_AMBER, font=get_mono(14, bold=True))
    draw.text((1000 - 180, 48), "PIN [ 2 / 3 ]", fill=C_AMBER, font=get_mono(14, bold=True))
    
    f_title = get_sans(38, bold=True)
    draw.text((60, 78), "THE 4-STAGE PROTEST LOOP", fill=C_OFFWHITE, font=f_title)
    f_sub = get_sans(17, bold=False)
    draw.text((60, 126), "Why protests keep exploding, why leaders swing harder, and why nothing gets solved.", fill=C_MUTED, font=f_sub)
    
    stages = [
        (
            "PHASE 01",
            "The Catalyst",
            "1,000 PEACEFUL YOUTH",
            "A thousand young people gather peacefully against an obvious injustice. They hold signs. They want to be heard.",
            "public/issues/issue-01/protest-1.webp",
            C_AMBER
        ),
        (
            "PHASE 02",
            "The Overreaction",
            "MILITARY RIOT GEAR FORCE",
            "An overpowered police force arrives in tactical gear, shutting down the crowd with unprovoked, disproportionate violence.",
            "public/issues/issue-01/protest-2.webp",
            C_CRIMSON
        ),
        (
            "PHASE 03",
            "The Escalation",
            "500,000 STRIKE NATIONWIDE",
            "The youth bring parents, aunts, colleagues. That 1,000-person gathering erupts into a multi-city general strike.",
            "public/issues/issue-01/protest-3.webp",
            C_CRIMSON
        ),
        (
            "PHASE 04",
            "The Void",
            "0 SOLUTIONS • ROT BUBBLES",
            "Opportunists move in. Nothing gets solved. The systemic rot bubbles under the floorboards until the next eruption.",
            "public/issues/issue-01/protest-4.webp",
            C_AMBER
        ),
    ]
    
    cur_y = 175
    row_h = 245
    for phase, name, stat, copy, img_path, accent in stages:
        rx0, ry0 = 60, cur_y
        rx1, ry1 = 940, cur_y + row_h
        
        # Panel Background
        panel = Image.new("RGBA", (880, row_h), C_PANEL_BG)
        canvas.alpha_composite(panel, (rx0, ry0))
        draw.rectangle([(rx0, ry0), (rx1, ry1)], outline=C_BORDER, width=2)
        draw_corner_brackets(draw, rx0, ry0, rx1, ry1, size=20, stroke=3, accent_color=accent)
        
        # Thumbnail Image on Left
        img = Image.open(img_path).convert("RGBA")
        thumb_w = 320
        thumb_h = row_h - 4
        img_scaled = img.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        canvas.alpha_composite(img_scaled, (rx0 + 2, ry0 + 2))
        draw.line([(rx0 + thumb_w + 2, ry0), (rx0 + thumb_w + 2, ry1)], fill=C_BORDER, width=2)
        
        # Right Side Content
        cx = rx0 + thumb_w + 25
        cy = ry0 + 20
        
        draw.text((cx, cy), f"// {phase}", fill=accent, font=get_mono(12, bold=True))
        cy += 22
        draw.text((cx, cy), name, fill=C_OFFWHITE, font=get_sans(24, bold=True))
        cy += 34
        
        # Stat Pill
        draw.rectangle([(cx, cy), (cx + 360, cy + 32)], fill=C_INNER_BOX, outline=accent, width=1)
        draw.text((cx + 12, cy + 8), f"➔ {stat}", fill=accent, font=get_mono(11, bold=True))
        cy += 44
        
        # Narrative Copy
        lines = wrap_text(copy, get_sans(15, bold=False), 490, draw)
        for l in lines:
            draw.text((cx, cy), l, fill=C_MUTED, font=get_sans(15, bold=False))
            cy += 20
            
        cur_y += row_h + 18
        
    # System Verdict Callout Box (from X Card 3)
    v_box_h = 100
    draw.rectangle([(60, cur_y), (940, cur_y + v_box_h)], fill=(38, 14, 14, 255), outline=C_CRIMSON, width=2)
    draw.text((85, cur_y + 16), "// CIVIL STABILITY VERDICT:", fill=C_CRIMSON, font=get_mono(12, bold=True))
    draw.text((85, cur_y + 38), "“When law enforcement thinks de-escalation means swinging harder,", fill=C_OFFWHITE, font=get_sans(18, bold=True))
    draw.text((85, cur_y + 64), "societies don't get stability. They fracture.”", fill=C_CRIMSON, font=get_sans(18, bold=True))
    
    # Bottom Footer
    foot_y = 1380
    draw.line([(60, foot_y - 20), (940, foot_y - 20)], fill=C_BORDER, width=1)
    draw_seal(canvas, 60, foot_y, size=60, text="MOTH1")
    draw.text((135, foot_y + 8), "// EXPLORE THE LIVE INTERACTIVE PROTEST SIMULATOR:", fill=C_MUTED, font=get_mono(11, bold=True))
    draw.text((135, foot_y + 28), "observations.moth1.xyz/watering-grass", fill=C_OFFWHITE, font=get_sans(22, bold=True))
    
    btn_w, btn_h = 240, 54
    btn_x0 = 940 - btn_w
    btn_y0 = foot_y + 4
    draw.rectangle([(btn_x0, btn_y0), (940, btn_y0 + btn_h)], fill=C_AMBER, outline=C_OFFWHITE, width=2)
    b_font = get_sans(15, bold=True)
    bb = draw.textbbox((0, 0), "LAUNCH ESSAY  ➔", font=b_font)
    draw.text((btn_x0 + (btn_w - (bb[2] - bb[0])) // 2, btn_y0 + 18), "LAUNCH ESSAY  ➔", fill=(12, 13, 16, 255), font=b_font)
    
    out_path = os.path.join(out_dir, "02_thesis_quote_plate.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered Issue 01 Pin 2:", out_path)

def render_issue01_pin_03(out_dir):
    """
    Pin 3: Aesthetic / Thesis Quote & Anchor Plate — The Core Realization
    Reference: X Card 01 & Card 05 (Hero Storm, Opening Statement & Finale Anchor)
    """
    canvas = create_base_canvas()
    draw = ImageDraw.Draw(canvas)
    
    # Hero Storm Artwork with Deep Charcoal Vignette
    hero = Image.open("public/issues/issue-01/hero-storm.webp").convert("RGBA")
    h_w, h_h = hero.size
    target_w = 1000
    target_h = int(h_h * (target_w / h_w))
    hero_scaled = hero.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    fade_mask = Image.new("L", (target_w, target_h), 255)
    f_draw = ImageDraw.Draw(fade_mask)
    fade_start = int(target_h * 0.42)
    for y in range(fade_start, target_h):
        alpha = int(255 * (1.0 - (y - fade_start) / (target_h - fade_start)))
        f_draw.line([(0, y), (target_w, y)], fill=alpha)
    hero_scaled.putalpha(fade_mask)
    canvas.alpha_composite(hero_scaled, (0, 0))
    
    # Top Header
    draw.text((60, 48), "// OBSERVATIONS BY MOTH1 • ESSAY THESIS", fill=C_AMBER, font=get_mono(14, bold=True))
    draw.text((1000 - 180, 48), "PIN [ 3 / 3 ]", fill=C_AMBER, font=get_mono(14, bold=True))
    
    # Lower Half Narrative Panel
    panel_y0 = 550
    panel_y1 = 1340
    panel = Image.new("RGBA", (880, panel_y1 - panel_y0), C_PANEL_BG)
    canvas.alpha_composite(panel, (60, panel_y0))
    draw.rectangle([(60, panel_y0), (940, panel_y1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, 60, panel_y0, 940, panel_y1, size=28, stroke=3, accent_color=C_CRIMSON)
    
    cur_y = panel_y0 + 44
    draw.text((100, cur_y), "// CORE_REALIZATION", fill=C_AMBER, font=get_mono(13, bold=True))
    cur_y += 36
    
    # Opening Hook Serif Quote (from X Card 1)
    f_quote = get_serif(32, bold=True)
    quote_text = "“As simple as it sounds, people generally don't take to the streets to protest if their governments were actually doing their jobs.”"
    q_lines = wrap_text(quote_text, f_quote, 800, draw)
    for ql in q_lines:
        draw.text((100, cur_y), ql, fill=C_OFFWHITE, font=f_quote)
        cur_y += 44
    cur_y += 24
    
    # Body Thesis (from X Card 5)
    f_body = get_sans(21, bold=False)
    body_text = "“What the world actually needs is a fresh roster of leaders, and a governance model that gives more weight to the people who will live long enough to deal with the fallout.”"
    b_lines = wrap_text(body_text, f_body, 800, draw)
    for bl in b_lines:
        draw.text((100, cur_y), bl, fill=C_MUTED, font=f_body)
        cur_y += 32
    cur_y += 32
    
    # Crimson Punchline Box (from X Card 5)
    box_h = 105
    draw.rectangle([(100, cur_y), (900, cur_y + box_h)], fill=(38, 12, 12, 255), outline=C_CRIMSON, width=2)
    f_punch = get_sans(26, bold=True)
    punch_txt = "“Everything else is, and should be treated as, a scam.”"
    p_lines = wrap_text(punch_txt, f_punch, 760, draw)
    tot_h = len(p_lines) * 34
    sy = cur_y + (box_h - tot_h) // 2
    for pl in p_lines:
        bb = draw.textbbox((0, 0), pl, font=f_punch)
        tw = bb[2] - bb[0]
        draw.text((100 + (800 - tw) // 2, sy), pl, fill=C_CRIMSON, font=f_punch)
        sy += 34
    cur_y += box_h + 36
    
    # Scrollytelling Features Summary
    feats = ["✦ 24-Frame Ink Wash Loops", "✦ Native Sticky Viewport", "✦ Empirical Citations"]
    fx = 100
    for f in feats:
        draw.rectangle([(fx, cur_y), (fx + 250, cur_y + 36)], fill=C_INNER_BOX, outline=C_BORDER, width=1)
        draw.text((fx + 16, cur_y + 10), f, fill=C_AMBER, font=get_mono(11, bold=True))
        fx += 265
        
    # Footer
    foot_y = 1380
    draw.line([(60, foot_y - 20), (940, foot_y - 20)], fill=C_BORDER, width=1)
    draw_seal(canvas, 60, foot_y, size=60, text="MOTH1")
    draw.text((135, foot_y + 8), "// INTERACTIVE ESSAY AVAILABLE ON ALL DEVICES:", fill=C_MUTED, font=get_mono(11, bold=True))
    draw.text((135, foot_y + 28), "observations.moth1.xyz/watering-grass", fill=C_OFFWHITE, font=get_sans(22, bold=True))
    
    btn_w, btn_h = 240, 54
    btn_x0 = 940 - btn_w
    btn_y0 = foot_y + 4
    draw.rectangle([(btn_x0, btn_y0), (940, btn_y0 + btn_h)], fill=C_AMBER, outline=C_OFFWHITE, width=2)
    b_font = get_sans(15, bold=True)
    bb = draw.textbbox((0, 0), "READ ESSAY  ➔", font=b_font)
    draw.text((btn_x0 + (btn_w - (bb[2] - bb[0])) // 2, btn_y0 + 18), "READ ESSAY  ➔", fill=(12, 13, 16, 255), font=b_font)
    
    out_path = os.path.join(out_dir, "03_interactive_mockup_plate.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered Issue 01 Pin 3:", out_path)

# ==============================================================================
# ISSUE 02: THE MEAT GRINDER NEEDS MORE MEAT
# ==============================================================================

def render_issue02_pin_01(out_dir):
    """
    Pin 1: Data / Infographic Plate — The 3-Circle Collapsing Venn Diagram
    Reference: X Card 02 (The Collapsing Venn Diagram wireframe with 0.72-0.97 TFR Void)
    """
    canvas = create_base_canvas()
    draw = ImageDraw.Draw(canvas)
    
    # Top Header
    draw.text((60, 48), "// OBSERVATIONS BY MOTH1 • ISSUE 02", fill=C_MINT, font=get_mono(14, bold=True))
    draw.text((1000 - 180, 48), "PIN [ 1 / 3 ]", fill=C_MINT, font=get_mono(14, bold=True))
    
    f_title = get_sans(38, bold=True)
    draw.text((60, 78), "THE DEMOGRAPHIC BLACK HOLE", fill=C_OFFWHITE, font=f_title)
    f_sub = get_sans(17, bold=False)
    draw.text((60, 126), "Why birth rates collapse when the 3 reproductive circles drift apart.", fill=C_MUTED, font=f_sub)
    
    # Venn Diagram Panel (60, 165) to (940, 775) - 610px height
    v_x0, v_y0, v_x1, v_y1 = 60, 165, 940, 775
    v_w = v_x1 - v_x0
    v_h = v_y1 - v_y0
    
    venn_surface = Image.new("RGBA", (v_w, v_h), C_PANEL_BG)
    v_draw = ImageDraw.Draw(venn_surface)
    
    # Internal Coordinate Grid
    for x in range(0, v_w, 40):
        v_draw.line([(x, 0), (x, v_h)], fill=(30, 41, 59, 100), width=1)
    for y in range(0, v_h, 40):
        v_draw.line([(0, y), (v_w, y)], fill=(30, 41, 59, 100), width=1)
        
    cx = v_w // 2   # 440
    cy = 310
    v_draw.line([(cx, 80), (cx, v_h - 60)], fill=(51, 65, 85, 180), width=1)
    v_draw.line([(50, cy), (v_w - 50, cy)], fill=(51, 65, 85, 180), width=1)
    
    # Circle Layer
    circles_layer = Image.new("RGBA", (v_w, v_h), (0, 0, 0, 0))
    c_draw = ImageDraw.Draw(circles_layer)
    r = 150
    
    # Circle 1: Family Support (Top-Left)
    c1_x, c1_y = cx - 110, cy - 85
    c_draw.ellipse([(c1_x - r, c1_y - r), (c1_x + r, c1_y + r)], fill=(134, 239, 172, 35), outline=C_MINT, width=3)
    c_draw.ellipse([(c1_x - r + 8, c1_y - r + 8), (c1_x + r - 8, c1_y + r - 8)], outline=(134, 239, 172, 80), width=1)
    
    # Circle 2: Social Policies & Housing (Top-Right)
    c2_x, c2_y = cx + 110, cy - 85
    c_draw.ellipse([(c2_x - r, c2_y - r), (c2_x + r, c2_y + r)], fill=(103, 232, 249, 35), outline=C_CYAN, width=3)
    c_draw.ellipse([(c2_x - r + 8, c2_y - r + 8), (c2_x + r - 8, c2_y + r - 8)], outline=(103, 232, 249, 80), width=1)
    
    # Circle 3: Financial Sustainability (Bottom-Center)
    c3_x, c3_y = cx, cy + 90
    c_draw.ellipse([(c3_x - r, c3_y - r), (c3_x + r, c3_y + r)], fill=(253, 164, 175, 35), outline=C_ROSE, width=3)
    c_draw.ellipse([(c3_x - r + 8, c3_y - r + 8), (c3_x + r - 8, c3_y + r - 8)], outline=(253, 164, 175, 80), width=1)
    
    venn_surface.alpha_composite(circles_layer)
    
    # Central TFR Black Hole Void
    void_x, void_y = cx, cy - 5
    v_r = 72
    v_draw.ellipse([(void_x - v_r, void_y - v_r), (void_x + v_r, void_y + v_r)], fill=(8, 9, 10, 255), outline=C_ROSE, width=2)
    v_draw.ellipse([(void_x - v_r + 10, void_y - v_r + 10), (void_x + v_r - 10, void_y + v_r - 10)], outline=C_PURPLE, width=1)
    
    bb1 = v_draw.textbbox((0, 0), "TFR BLACK HOLE", font=get_mono(11, bold=True))
    v_draw.text((void_x - (bb1[2] - bb1[0]) // 2, void_y - 24), "TFR BLACK HOLE", fill=C_ROSE, font=get_mono(11, bold=True))
    
    bb2 = v_draw.textbbox((0, 0), "0.72 - 0.97", font=get_sans(22, bold=True))
    v_draw.text((void_x - (bb2[2] - bb2[0]) // 2, void_y - 4), "0.72 - 0.97", fill=C_OFFWHITE, font=get_sans(22, bold=True))
    
    bb3 = v_draw.textbbox((0, 0), "THE MIDDLE FELL THROUGH", font=get_mono(9, bold=True))
    v_draw.text((void_x - (bb3[2] - bb3[0]) // 2, void_y + 22), "THE MIDDLE FELL THROUGH", fill=C_PURPLE, font=get_mono(9, bold=True))
    
    # Circle Labels
    v_draw.text((c1_x - 120, c1_y - 80), "FAMILY SUPPORT", fill=C_MINT, font=get_mono(14, bold=True))
    v_draw.text((c1_x - 120, c1_y - 58), "Kin Care & Trust", fill=C_OFFWHITE, font=get_sans(13, bold=False))
    
    v_draw.text((c2_x - 10, c2_y - 80), "SOCIAL POLICIES", fill=C_CYAN, font=get_mono(14, bold=True))
    v_draw.text((c2_x - 10, c2_y - 58), "Housing & Subsidies", fill=C_OFFWHITE, font=get_sans(13, bold=False))
    
    v_draw.text((c3_x - 90, c3_y + 115), "FINANCIAL MOBILITY", fill=C_ROSE, font=get_mono(14, bold=True))
    v_draw.text((c3_x - 90, c3_y + 135), "Fair Wages & Security", fill=C_OFFWHITE, font=get_sans(13, bold=False))
    
    canvas.alpha_composite(venn_surface, (v_x0, v_y0))
    draw.rectangle([(v_x0, v_y0), (v_x1, v_y1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, v_x0, v_y0, v_x1, v_y1, size=24, stroke=3, accent_color=C_MINT)
    
    # 3 Stat Cards below Venn
    stats_y0 = 800
    stat_items = [
        ("0.72 TFR", "SOUTH KOREA FERTILITY", "World's lowest recorded national birth rate; replacement is 2.10.", C_ROSE),
        ("300M ROLES", "EXPOSED TO AI", "Breeding workers for a cognitive economy that is automating entry ladders.", C_CYAN),
        ("1.73x DEFICIT", "BIOCAPACITY OVERSHOOT", "Humanity consumes ecological resources at 173% of Earth's renewal capacity.", C_PURPLE),
    ]
    sw = (880 - 32) // 3
    for i, (stat, label, copy, col) in enumerate(stat_items):
        sx0 = 60 + i * (sw + 16)
        sx1 = sx0 + sw
        draw.rectangle([(sx0, stats_y0), (sx1, stats_y0 + 200)], fill=C_INNER_BOX, outline=C_BORDER, width=1)
        draw_corner_brackets(draw, sx0, stats_y0, sx1, stats_y0 + 200, size=16, stroke=3, accent_color=col)
        draw.text((sx0 + 16, stats_y0 + 16), stat, fill=col, font=get_sans(26, bold=True))
        draw.text((sx0 + 16, stats_y0 + 52), f"// {label}", fill=C_MUTED, font=get_mono(10, bold=True))
        clines = wrap_text(copy, get_sans(13, bold=False), sw - 32, draw)
        cy_text = stats_y0 + 82
        for cl in clines:
            draw.text((sx0 + 16, cy_text), cl, fill=C_OFFWHITE, font=get_sans(13, bold=False))
            cy_text += 18
            
    # Empirical Verdict Strip
    strip_y = 1025
    draw.rectangle([(60, strip_y), (940, strip_y + 110)], fill=(14, 16, 20, 255), outline=C_MINT, width=2)
    draw.text((85, strip_y + 16), "// SYSTEMIC REALITY", fill=C_MINT, font=get_mono(12, bold=True))
    draw.text((85, strip_y + 38), "“Continuing the species has turned into an underpaid freelance gig.”", fill=C_OFFWHITE, font=get_sans(20, bold=True))
    draw.text((85, strip_y + 74), "Raising a child now averages $310,000+ while housing is traded as a speculative asset.", fill=C_MUTED, font=get_sans(14, bold=False))
    
    # 3 Taboo Counter-Proposals Summary
    t_y0 = 1160
    draw.text((60, t_y0), "// THREE TABOO COUNTER-PROPOSALS", fill=C_CYAN, font=get_mono(13, bold=True))
    t_y0 += 24
    
    t_items = [
        ("01 Redefine Family Unit", "62% modern non-traditional households"),
        ("02 Dignity in Aging", "74% support end-of-life autonomy (Lancet)"),
        ("03 Kill Infinite Growth", "Perpetual GDP growth on finite Earth"),
    ]
    tw = (880 - 20) // 3
    for i, (t_title, t_sub) in enumerate(t_items):
        tx0 = 60 + i * (tw + 10)
        tx1 = tx0 + tw
        draw.rectangle([(tx0, t_y0), (tx1, t_y0 + 64)], fill=C_PANEL_BG, outline=C_BORDER, width=1)
        draw.text((tx0 + 12, t_y0 + 12), t_title, fill=C_OFFWHITE, font=get_sans(14, bold=True))
        draw.text((tx0 + 12, t_y0 + 36), t_sub, fill=C_MUTED, font=get_mono(10, bold=False))
        
    # Footer
    foot_y = 1380
    draw.line([(60, foot_y - 20), (940, foot_y - 20)], fill=C_BORDER, width=1)
    draw_seal(canvas, 60, foot_y, size=60, text="MOTH1")
    draw.text((135, foot_y + 8), "// INTERACTIVE VENN SIMULATOR & DATA LEDGERS:", fill=C_MUTED, font=get_mono(11, bold=True))
    draw.text((135, foot_y + 28), "observations.moth1.xyz/the-meat-grinder", fill=C_OFFWHITE, font=get_sans(22, bold=True))
    
    btn_w, btn_h = 240, 54
    btn_x0 = 940 - btn_w
    btn_y0 = foot_y + 4
    draw.rectangle([(btn_x0, btn_y0), (940, btn_y0 + btn_h)], fill=C_MINT, outline=C_OFFWHITE, width=2)
    b_font = get_sans(15, bold=True)
    bb = draw.textbbox((0, 0), "EXPLORE ESSAY  ➔", font=b_font)
    draw.text((btn_x0 + (btn_w - (bb[2] - bb[0])) // 2, btn_y0 + 18), "EXPLORE ESSAY  ➔", fill=(12, 13, 16, 255), font=b_font)
    
    out_path = os.path.join(out_dir, "01_infographic_plate.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered Issue 02 Pin 1:", out_path)

def render_issue02_pin_02(out_dir):
    """
    Pin 2: Aesthetic / Thesis Quote Plate — The Biological Correction
    Reference: X Card 05 (Quiet Earth & Bounded Punchline Callout)
    """
    canvas = create_base_canvas()
    draw = ImageDraw.Draw(canvas)
    
    # Background Hero Artwork (Quiet Earth)
    quiet = Image.open("public/issues/issue-02/quiet-earth.webp").convert("RGBA")
    q_w, q_h = quiet.size
    target_w = 1000
    target_h = int(q_h * (target_w / q_w))
    quiet_scaled = quiet.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    fade_mask = Image.new("L", (target_w, target_h), 255)
    f_draw = ImageDraw.Draw(fade_mask)
    fade_start = int(target_h * 0.42)
    for y in range(fade_start, target_h):
        alpha = int(255 * (1.0 - (y - fade_start) / (target_h - fade_start)))
        f_draw.line([(0, y), (target_w, y)], fill=alpha)
    quiet_scaled.putalpha(fade_mask)
    canvas.alpha_composite(quiet_scaled, (0, 0))
    
    # Top Header
    draw.text((60, 48), "// OBSERVATIONS BY MOTH1 • EDITORIAL THESIS", fill=C_MINT, font=get_mono(14, bold=True))
    draw.text((1000 - 180, 48), "PIN [ 2 / 3 ]", fill=C_MINT, font=get_mono(14, bold=True))
    
    # Thesis Container Panel
    panel_y0 = 550
    panel_y1 = 1340
    panel = Image.new("RGBA", (880, panel_y1 - panel_y0), C_PANEL_BG)
    canvas.alpha_composite(panel, (60, panel_y0))
    draw.rectangle([(60, panel_y0), (940, panel_y1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, 60, panel_y0, 940, panel_y1, size=28, stroke=3, accent_color=C_MINT)
    
    cur_y = panel_y0 + 44
    draw.text((100, cur_y), "// THE BIOLOGICAL CORRECTION", fill=C_MINT, font=get_mono(13, bold=True))
    cur_y += 36
    
    # Primary Serif Quote
    f_quote = get_serif(34, bold=True)
    quote_text = "“People will have kids when they genuinely feel the future is brighter than the past.”"
    q_lines = wrap_text(quote_text, f_quote, 800, draw)
    for ql in q_lines:
        draw.text((100, cur_y), ql, fill=C_OFFWHITE, font=f_quote)
        cur_y += 48
    cur_y += 24
    
    # Extended Body Thesis
    f_body = get_sans(21, bold=False)
    body_text = "“When you look around at an unaffordable world, an unstable climate, and an automated job landscape run by billionaires who hoard the ladder, having less people is not a crisis. It is a biological correction. The planet is tired of us, and declining birth rates are simply society's immune response.”"
    b_lines = wrap_text(body_text, f_body, 800, draw)
    for bl in b_lines:
        draw.text((100, cur_y), bl, fill=C_MUTED, font=f_body)
        cur_y += 32
    cur_y += 32
    
    # Bounded Punchline Callout Box
    box_h = 105
    draw.rectangle([(100, cur_y), (900, cur_y + box_h)], fill=(15, 30, 20, 255), outline=C_MINT, width=2)
    f_punch = get_sans(24, bold=True)
    punch_txt = "“Everything else is just noise from people who need more cogs in their machine.”"
    p_lines = wrap_text(punch_txt, f_punch, 760, draw)
    tot_h = len(p_lines) * 32
    sy = cur_y + (box_h - tot_h) // 2
    for pl in p_lines:
        bb = draw.textbbox((0, 0), pl, font=f_punch)
        tw = bb[2] - bb[0]
        draw.text((100 + (800 - tw) // 2, sy), pl, fill=C_MINT, font=f_punch)
        sy += 32
        
    # Footer
    foot_y = 1380
    draw.line([(60, foot_y - 20), (940, foot_y - 20)], fill=C_BORDER, width=1)
    draw_seal(canvas, 60, foot_y, size=60, text="MOTH1")
    draw.text((135, foot_y + 8), "// INTERACTIVE ESSAY AVAILABLE ON ALL DEVICES:", fill=C_MUTED, font=get_mono(11, bold=True))
    draw.text((135, foot_y + 28), "observations.moth1.xyz/the-meat-grinder", fill=C_OFFWHITE, font=get_sans(22, bold=True))
    
    btn_w, btn_h = 240, 54
    btn_x0 = 940 - btn_w
    btn_y0 = foot_y + 4
    draw.rectangle([(btn_x0, btn_y0), (940, btn_y0 + btn_h)], fill=C_MINT, outline=C_OFFWHITE, width=2)
    b_font = get_sans(15, bold=True)
    bb = draw.textbbox((0, 0), "READ ESSAY  ➔", font=b_font)
    draw.text((btn_x0 + (btn_w - (bb[2] - bb[0])) // 2, btn_y0 + 18), "READ ESSAY  ➔", fill=(12, 13, 16, 255), font=b_font)
    
    out_path = os.path.join(out_dir, "02_thesis_quote_plate.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered Issue 02 Pin 2:", out_path)

def render_issue02_pin_03(out_dir):
    """
    Pin 3: Mechanism / Policy Plate — The Three Taboo Counter-Proposals
    Reference: X Card 04 (Redefine Family Unit, Dignity in Aging, Kill Growth Fetish)
    """
    canvas = create_base_canvas()
    draw = ImageDraw.Draw(canvas)
    
    # Top Header
    draw.text((60, 48), "// PARADIGM_SHIFT • THREE UNCOMFORTABLE TRUTHS", fill=C_MINT, font=get_mono(14, bold=True))
    draw.text((1000 - 180, 48), "PIN [ 3 / 3 ]", fill=C_MINT, font=get_mono(14, bold=True))
    
    f_title = get_sans(38, bold=True)
    draw.text((60, 78), "THREE TABOO COUNTER-PROPOSALS", fill=C_OFFWHITE, font=f_title)
    f_sub = get_sans(17, bold=False)
    draw.text((60, 126), "What governments refuse to talk about while crying over fertility charts.", fill=C_MUTED, font=f_sub)
    
    proposals = [
        (
            "PROPOSAL 01",
            "Redefine the Family Unit",
            "62% OF HOUSEHOLDS",
            "NON-TRADITIONAL / COHABITING SHARE",
            "The rigid nuclear model is outdated. Legal frameworks must open fully to cohabitation, single parents, and queer partners with equal housing and childcare rights.",
            "Ref: OECD Household Projections (2024–2040)",
            "public/issues/issue-02/taboo-1-unit.webp",
            C_MINT
        ),
        (
            "PROPOSAL 02",
            "Dignity in Aging & Euthanasia",
            "74% AUTONOMY SUPPORT",
            "PUBLIC END-OF-LIFE AUTONOMY (LANCET)",
            "Nobody admits millions of elderly citizens are trapped in medicalized decay. Legalised euthanasia restores dignity and relieves the impossible caregiver burden on adult children.",
            "Ref: The Lancet Commission on Value of Death",
            "public/issues/issue-02/taboo-2-dignity.webp",
            C_CYAN
        ),
        (
            "PROPOSAL 03",
            "Kill the Growth at All Costs Fetish",
            "1.73x OVERSHOOT",
            "EARTHS CONSUMED ANNUALLY (BIOCAPACITY)",
            "You cannot demand infinite GDP growth on a finite planet. Shrinking birth rates are not a catastrophe; they are the planet's and society's overdue biological correction.",
            "Ref: Global Footprint Network (2024)",
            "public/issues/issue-02/taboo-3-degrowth.webp",
            C_PURPLE
        ),
    ]
    
    cur_y = 175
    row_h = 340
    for code, title, stat, stat_lbl, copy, ref, img_path, accent in proposals:
        rx0, ry0 = 60, cur_y
        rx1, ry1 = 940, cur_y + row_h
        
        # Panel Background
        panel = Image.new("RGBA", (880, row_h), C_PANEL_BG)
        canvas.alpha_composite(panel, (rx0, ry0))
        draw.rectangle([(rx0, ry0), (rx1, ry1)], outline=C_BORDER, width=2)
        draw_corner_brackets(draw, rx0, ry0, rx1, ry1, size=20, stroke=3, accent_color=accent)
        
        # 16:9 Thumbnail Image on Left
        img = Image.open(img_path).convert("RGBA")
        thumb_w = 340
        thumb_h = row_h - 4
        img_scaled = img.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        canvas.alpha_composite(img_scaled, (rx0 + 2, ry0 + 2))
        draw.line([(rx0 + thumb_w + 2, ry0), (rx0 + thumb_w + 2, ry1)], fill=C_BORDER, width=2)
        
        # Right Side Content
        cx = rx0 + thumb_w + 25
        cy = ry0 + 24
        
        draw.text((cx, cy), f"// {code}", fill=accent, font=get_mono(12, bold=True))
        cy += 24
        
        draw.text((cx, cy), title, fill=C_OFFWHITE, font=get_sans(23, bold=True))
        cy += 38
        
        # Metric Highlight Box
        draw.rectangle([(cx, cy), (cx + 460, cy + 64)], fill=C_INNER_BOX, outline=C_BORDER, width=1)
        draw.text((cx + 18, cy + 10), stat, fill=accent, font=get_sans(24, bold=True))
        draw.text((cx + 18, cy + 40), f"// {stat_lbl}", fill=C_MUTED, font=get_mono(10, bold=True))
        cy += 78
        
        # Narrative Copy
        lines = wrap_text(copy, get_sans(15, bold=False), 470, draw)
        for l in lines:
            draw.text((cx, cy), l, fill=C_OFFWHITE, font=get_sans(15, bold=False))
            cy += 22
            
        # Footnote Ref
        draw.text((cx, ry1 - 26), ref, fill=(165, 168, 165, 180), font=get_mono(10, bold=False))
        
        cur_y += row_h + 18
        
    # Bottom System Verdict Bar (from X Card 4)
    v_box_h = 75
    draw.rectangle([(60, cur_y), (940, cur_y + v_box_h)], fill=(14, 16, 20, 255), outline=C_MINT, width=2)
    draw.text((85, cur_y + 16), "SYSTEM_VERDICT:", fill=C_MINT, font=get_mono(13, bold=True))
    draw.text((250, cur_y + 14), "You cannot prioritize perpetual GDP expansion and expect people to build healthy families.", fill=C_OFFWHITE, font=get_sans(16, bold=True))
    draw.text((85, cur_y + 44), "Treating shrinking birth rates as an economic crisis ignores the planet's finite carrying capacity.", fill=C_MUTED, font=get_sans(14, bold=False))
    
    # Bottom Footer
    foot_y = 1380
    draw.line([(60, foot_y - 20), (940, foot_y - 20)], fill=C_BORDER, width=1)
    draw_seal(canvas, 60, foot_y, size=60, text="MOTH1")
    draw.text((135, foot_y + 8), "// ENTER THE LIVE INTERACTIVE ESSAY & SIMULATORS:", fill=C_MUTED, font=get_mono(11, bold=True))
    draw.text((135, foot_y + 28), "observations.moth1.xyz/the-meat-grinder", fill=C_OFFWHITE, font=get_sans(22, bold=True))
    
    btn_w, btn_h = 240, 54
    btn_x0 = 940 - btn_w
    btn_y0 = foot_y + 4
    draw.rectangle([(btn_x0, btn_y0), (940, btn_y0 + btn_h)], fill=C_MINT, outline=C_OFFWHITE, width=2)
    b_font = get_sans(15, bold=True)
    bb = draw.textbbox((0, 0), "LAUNCH ESSAY  ➔", font=b_font)
    draw.text((btn_x0 + (btn_w - (bb[2] - bb[0])) // 2, btn_y0 + 18), "LAUNCH ESSAY  ➔", fill=(12, 13, 16, 255), font=b_font)
    
    out_path = os.path.join(out_dir, "03_interactive_mockup_plate.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered Issue 02 Pin 3:", out_path)

def main():
    print("==================================================================")
    print("RE-RENDERING PINTEREST PINS — DIRECT X POST ALIGNMENT")
    print("==================================================================")
    
    p1_dir = "dist-packages/issue-01-watering-grass/pinterest/pins"
    p2_dir = "dist-packages/issue-02-the-meat-grinder/pinterest/pins"
    os.makedirs(p1_dir, exist_ok=True)
    os.makedirs(p2_dir, exist_ok=True)
    
    print("\n--- Rendering Issue 01 Pins (1000x1500) ---")
    render_issue01_pin_01(p1_dir)
    render_issue01_pin_02(p1_dir)
    render_issue01_pin_03(p1_dir)
    
    print("\n--- Rendering Issue 02 Pins (1000x1500) ---")
    render_issue02_pin_01(p2_dir)
    render_issue02_pin_02(p2_dir)
    render_issue02_pin_03(p2_dir)
    
    print("\nAll Pinterest Pins regenerated and aligned with X references.")

if __name__ == "__main__":
    main()
