#!/usr/bin/env python3
import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT_DIR = "dist-packages/issue-01-watering-grass/x/cards"
os.makedirs(OUT_DIR, exist_ok=True)

# Color Palette — Cyber-Zen Sumi-e Graphic Novel
C_CHARCOAL = (8, 9, 10, 255)
C_PANEL_BG = (14, 16, 20, 248)
C_INNER_BOX = (20, 24, 30, 255)
C_OFFWHITE = (230, 228, 221, 255)
C_MUTED = (165, 168, 165, 255)
C_AMBER = (217, 119, 6, 255)
C_CRIMSON = (220, 38, 38, 255)
C_BORDER = (230, 228, 221, 48)
C_GRID_LINE = (230, 228, 221, 6)

FONT_SANS = "/System/Library/Fonts/HelveticaNeue.ttc"
FONT_MONO = "/System/Library/Fonts/SFNSMono.ttf"
if not os.path.exists(FONT_MONO):
    FONT_MONO = "/System/Library/Fonts/Menlo.ttc"

def get_sans(size, bold=False, condensed=False):
    index = 1 if bold else (4 if condensed else 0)
    try:
        return ImageFont.truetype(FONT_SANS, size, index=index)
    except:
        return ImageFont.load_default()

def get_mono(size, bold=False):
    try:
        return ImageFont.truetype(FONT_MONO, size)
    except:
        return ImageFont.load_default()

def draw_corner_brackets(draw, x0, y0, x1, y1, size=24, stroke=4, accent_color=C_AMBER):
    # Top-Left (Off-white)
    draw.line([(x0 - 2, y0 - 2), (x0 + size, y0 - 2)], fill=C_OFFWHITE, width=stroke)
    draw.line([(x0 - 2, y0 - 2), (x0 - 2, y0 + size)], fill=C_OFFWHITE, width=stroke)
    # Bottom-Right (Accent)
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

def create_base_canvas(width=1600, height=900):
    canvas = Image.new("RGBA", (width, height), C_CHARCOAL)
    c_draw = ImageDraw.Draw(canvas)
    
    # 64px Sumi-e Grid texture overlay (.bg-sumi-grid)
    grid_spacing = 64
    for x in range(0, width, grid_spacing):
        c_draw.line([(x, 0), (x, height)], fill=C_GRID_LINE, width=1)
    for y in range(0, height, grid_spacing):
        c_draw.line([(y, 0), (width, y)], fill=C_GRID_LINE, width=1)
        
    # Outer hairline border
    c_draw.rectangle([(16, 16), (width - 17, height - 17)], outline=(230, 228, 221, 30), width=1)
    return canvas

# ==============================================================================
# CARD 01: THE COLD OPEN / HERO HOOK
# ==============================================================================
def render_card_01():
    canvas = create_base_canvas()
    
    hero_path = "public/issues/issue-01/hero-storm.webp"
    hero = Image.open(hero_path).convert("RGBA")
    
    h_w, h_h = hero.size
    target_h = 900
    target_w = int(h_w * (target_h / h_h))
    hero_scaled = hero.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    fade_mask = Image.new("L", (target_w, target_h), 255)
    fade_draw = ImageDraw.Draw(fade_mask)
    fade_start = int(target_w * 0.52)
    for x in range(fade_start, target_w):
        alpha = int(255 * (1.0 - (x - fade_start) / (target_w - fade_start)))
        fade_draw.line([(x, 0), (x, target_h)], fill=alpha)
    
    hero_scaled.putalpha(fade_mask)
    canvas.alpha_composite(hero_scaled, (0, 0))
    
    panel_x0, panel_y0 = 770, 70
    panel_x1, panel_y1 = 1530, 830
    
    panel = Image.new("RGBA", (panel_x1 - panel_x0, panel_y1 - panel_y0), C_PANEL_BG)
    p_draw = ImageDraw.Draw(panel)
    p_draw.rectangle([(0, 0), (panel_x1 - panel_x0 - 1, panel_y1 - panel_y0 - 1)], outline=C_BORDER, width=2)
    canvas.alpha_composite(panel, (panel_x0, panel_y0))
    
    draw = ImageDraw.Draw(canvas)
    draw_corner_brackets(draw, panel_x0, panel_y0, panel_x1, panel_y1, size=28, stroke=4, accent_color=C_AMBER)
    
    cur_y = panel_y0 + 50
    # Stark Monospace Kicker
    f_mono_tag = get_mono(14, bold=True)
    draw.text((panel_x0 + 50, cur_y), "// DISPATCH_01 • ESSAY_HOOK", fill=C_AMBER, font=f_mono_tag)
    cur_y += 34
    
    # Title
    f_title = get_sans(56, bold=True)
    draw.text((panel_x0 + 50, cur_y), "WATERING GRASS", fill=C_OFFWHITE, font=f_title)
    cur_y += 66
    draw.text((panel_x0 + 50, cur_y), "IN A THUNDERSTORM", fill=C_OFFWHITE, font=f_title)
    cur_y += 85
    
    draw.line([(panel_x0 + 50, cur_y), (panel_x0 + 200, cur_y)], fill=C_AMBER, width=3)
    cur_y += 35
    
    f_quote = get_sans(28, bold=True)
    quote_text = "“As simple as it sounds, people generally don't take to the streets to protest if their governments were actually doing their jobs.”"
    lines = wrap_text(quote_text, f_quote, 640, draw)
    for l in lines:
        draw.text((panel_x0 + 50, cur_y), l, fill=C_OFFWHITE, font=f_quote)
        cur_y += 40
    cur_y += 22
    
    f_sec = get_sans(20, bold=False)
    sec_text = "Why protests keep exploding, why geriatrics keep lecturing, and why nothing gets solved."
    lines_sec = wrap_text(sec_text, f_sec, 640, draw)
    for l in lines_sec:
        draw.text((panel_x0 + 50, cur_y), l, fill=C_MUTED, font=f_sec)
        cur_y += 30
        
    draw_seal(canvas, panel_x0 + 50, panel_y1 - 85, size=46, text="MOTH1")
    f_badge = get_mono(13, bold=True)
    draw.text((panel_x0 + 115, panel_y1 - 70), "SYS // OBSERVATIONS BY MOTH1 • 2026", fill=C_MUTED, font=f_badge)
    
    f_thread = get_mono(15, bold=True)
    draw.text((panel_x1 - 180, panel_y1 - 70), "THREAD [ 1 / 5 ]", fill=C_AMBER, font=f_thread)
    
    out_path = os.path.join(OUT_DIR, "01_hero_hook.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered:", out_path)

# ==============================================================================
# CARD 02: THE GERIATRIC DISCONNECT
# ==============================================================================
def render_card_02():
    canvas = create_base_canvas()
    draw = ImageDraw.Draw(canvas)
    
    art_x0, art_y0 = 70, 70
    art_x1, art_y1 = 760, 830
    
    balcony = Image.open("public/issues/issue-01/disconnect-balcony.webp").convert("RGBA")
    b_scaled = balcony.resize((art_x1 - art_x0, art_y1 - art_y0 - 80), Image.Resampling.LANCZOS)
    canvas.alpha_composite(b_scaled, (art_x0, art_y0))
    
    draw.rectangle([(art_x0, art_y0), (art_x1, art_y1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, art_x0, art_y0, art_x1, art_y1, size=24, stroke=4, accent_color=C_AMBER)
    
    f_art_tag = get_mono(13, bold=True)
    draw.text((art_x0 + 24, art_y1 - 58), "// THE GERIATRIC DISCONNECT", fill=C_AMBER, font=f_art_tag)
    f_art_sub = get_sans(15, bold=False)
    draw.text((art_x0 + 24, art_y1 - 34), "A detached political class lecturing youth from high balconies.", fill=C_MUTED, font=f_art_sub)
    
    p_x0, p_y0 = 810, 70
    p_x1, p_y1 = 1530, 830
    
    panel = Image.new("RGBA", (p_x1 - p_x0, p_y1 - p_y0), C_PANEL_BG)
    canvas.alpha_composite(panel, (p_x0, p_y0))
    draw.rectangle([(p_x0, p_y0), (p_x1, p_y1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, p_x0, p_y0, p_x1, p_y1, size=24, stroke=4, accent_color=C_CRIMSON)
    
    cur_y = p_y0 + 40
    f_kicker = get_mono(14, bold=True)
    draw.text((p_x0 + 45, cur_y), "// EMPIRICAL_METRICS • GENERATIONAL_LOCKOUT", fill=C_CRIMSON, font=f_kicker)
    cur_y += 34
    
    metrics = [
        ("11.4x", C_AMBER, "MEDIAN HOME PRICE TO YOUTH WAGES", "Locked doors. In 1980, the ratio sat at 3.2x. Today, homeownership requires two generational inheritances."),
        ("-38%", C_CRIMSON, "REAL PURCHASING POWER VS 1990 BASELINE", "The economy alleged 'growth' while everyday purchasing power quietly collapsed beneath floorboards."),
        ("70+ YRS", C_OFFWHITE, "AVG LEADER AGE VS 28 YR CITIZEN MEDIAN", "Geriatrics whose upward mobility was guaranteed now lecture the locked-out on work ethic.")
    ]
    
    for val, color, label, desc in metrics:
        box_y1 = cur_y + 145
        draw.rectangle([(p_x0 + 40, cur_y), (p_x1 - 40, box_y1)], fill=C_INNER_BOX, outline=C_BORDER, width=1)
        
        f_val = get_sans(52, bold=True)
        draw.text((p_x0 + 65, cur_y + 15), val, fill=color, font=f_val)
        
        f_lbl = get_mono(14, bold=True)
        draw.text((p_x0 + 65, cur_y + 76), f"// {label}", fill=C_OFFWHITE, font=f_lbl)
        
        f_desc = get_sans(15, bold=False)
        d_lines = wrap_text(desc, f_desc, 600, draw)
        d_y = cur_y + 102
        for dl in d_lines:
            draw.text((p_x0 + 65, d_y), dl, fill=C_MUTED, font=f_desc)
            d_y += 18
            
        cur_y = box_y1 + 18
        
    f_cit = get_mono(12, bold=False)
    draw.text((p_x0 + 45, p_y1 - 40), "[ REF: ST. LOUIS FED / OECD GENERATIONAL WAGE INDEX ]", fill=C_MUTED, font=f_cit)
    
    f_thread = get_mono(15, bold=True)
    draw.text((p_x1 - 180, p_y1 - 42), "THREAD [ 2 / 5 ]", fill=C_AMBER, font=f_thread)
    
    out_path = os.path.join(OUT_DIR, "02_the_disconnect.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered:", out_path)

# ==============================================================================
# CARD 03: THE 4-STAGE PROTEST LOOP
# ==============================================================================
def render_card_03():
    canvas = create_base_canvas()
    draw = ImageDraw.Draw(canvas)
    
    f_kicker = get_mono(14, bold=True)
    draw.text((70, 50), "// MECHANISM // CIVIL_ESCALATION_ENGINE", fill=C_AMBER, font=f_kicker)
    
    f_title = get_sans(42, bold=True)
    draw.text((70, 78), "THE 4-STAGE PROTEST LOOP", fill=C_OFFWHITE, font=f_title)
    
    f_thread = get_mono(15, bold=True)
    draw.text((1600 - 240, 75), "THREAD [ 3 / 5 ]", fill=C_AMBER, font=f_thread)
    
    stages = [
        ("PHASE 1", "The Catalyst", "1,000", "PEACEFUL YOUTH", "A thousand young people gather peacefully against an obvious injustice. They hold signs. They want to be heard.", "public/issues/issue-01/protest-1.webp", C_AMBER),
        ("PHASE 2", "The Overreaction", "MILITARY", "RIOT GEAR FORCE", "An overpowered police force arrives in tactical gear, shutting down the crowd with unprovoked thuggery.", "public/issues/issue-01/protest-2.webp", C_CRIMSON),
        ("PHASE 3", "The Escalation", "500,000", "STRIKE ACROSS 4 CITIES", "The youth bring parents, aunts, colleagues. That 1,000-person gathering becomes a nationwide strike.", "public/issues/issue-01/protest-3.webp", C_CRIMSON),
        ("PHASE 4", "The Void", "0 SOLUTIONS", "ROT BUBBLES UNDER", "Opportunists move in. Nothing gets solved. The rot bubbles under the floorboards until the next eruption.", "public/issues/issue-01/protest-4.webp", C_AMBER),
    ]
    
    col_w = 345
    gap = 26
    start_x = 70
    start_y = 150
    col_h = 630
    
    for i, (phase, name, stat, stat_lbl, copy, img_path, accent) in enumerate(stages):
        cx0 = start_x + i * (col_w + gap)
        cx1 = cx0 + col_w
        cy0 = start_y
        cy1 = start_y + col_h
        
        panel = Image.new("RGBA", (col_w, col_h), C_PANEL_BG)
        canvas.alpha_composite(panel, (cx0, cy0))
        draw.rectangle([(cx0, cy0), (cx1, cy1)], outline=C_BORDER, width=2)
        draw_corner_brackets(draw, cx0, cy0, cx1, cy1, size=20, stroke=3, accent_color=accent)
        
        img = Image.open(img_path).convert("RGBA")
        img_h = 210
        img_scaled = img.resize((col_w - 4, img_h), Image.Resampling.LANCZOS)
        canvas.alpha_composite(img_scaled, (cx0 + 2, cy0 + 2))
        draw.line([(cx0, cy0 + 2 + img_h), (cx1, cy0 + 2 + img_h)], fill=C_BORDER, width=2)
        
        ty = cy0 + img_h + 20
        f_phase = get_mono(13, bold=True)
        draw.text((cx0 + 20, ty), f"// {phase}", fill=accent, font=f_phase)
        ty += 24
        
        f_name = get_sans(26, bold=True)
        draw.text((cx0 + 20, ty), name, fill=C_OFFWHITE, font=f_name)
        ty += 40
        
        draw.rectangle([(cx0 + 16, ty), (cx1 - 16, ty + 70)], fill=C_INNER_BOX, outline=C_BORDER, width=1)
        f_stat = get_sans(30, bold=True)
        draw.text((cx0 + 28, ty + 10), stat, fill=accent, font=f_stat)
        f_lbl = get_mono(11, bold=True)
        draw.text((cx0 + 28, ty + 46), f"// {stat_lbl}", fill=C_MUTED, font=f_lbl)
        ty += 88
        
        f_copy = get_sans(15, bold=False)
        lines = wrap_text(copy, f_copy, col_w - 40, draw)
        for l in lines:
            draw.text((cx0 + 20, ty), l, fill=C_OFFWHITE, font=f_copy)
            ty += 21
            
    draw.rectangle([(70, 805), (1600 - 70, 860)], fill=(14, 16, 20, 255), outline=C_BORDER, width=1)
    f_bot = get_mono(15, bold=True)
    draw.text((95, 824), "SYSTEM_VERDICT:", fill=C_CRIMSON, font=f_bot)
    f_bot_sub = get_sans(16, bold=False)
    draw.text((270, 823), "When law enforcement thinks de-escalation means swinging harder, societies don't get stability. They fracture.", fill=C_OFFWHITE, font=f_bot_sub)
    
    out_path = os.path.join(OUT_DIR, "03_the_protest_loop.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered:", out_path)

# ==============================================================================
# CARD 04: THE MISPLACED PRIORITIES
# ==============================================================================
def render_card_04():
    canvas = create_base_canvas()
    draw = ImageDraw.Draw(canvas)
    
    art_x0, art_y0 = 70, 70
    art_x1, art_y1 = 760, 830
    
    scale_img = Image.open("public/issues/issue-01/scale.webp").convert("RGBA")
    s_scaled = scale_img.resize((art_x1 - art_x0, art_y1 - art_y0 - 80), Image.Resampling.LANCZOS)
    canvas.alpha_composite(s_scaled, (art_x0, art_y0))
    
    draw.rectangle([(art_x0, art_y0), (art_x1, art_y1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, art_x0, art_y0, art_x1, art_y1, size=24, stroke=4, accent_color=C_CRIMSON)
    
    f_art_tag = get_mono(13, bold=True)
    draw.text((art_x0 + 24, art_y1 - 58), "// THE TIPPING SCALES", fill=C_CRIMSON, font=f_art_tag)
    f_art_sub = get_sans(15, bold=False)
    draw.text((art_x0 + 24, art_y1 - 34), "Hardware for containment vs. investment in the generational future.", fill=C_MUTED, font=f_art_sub)
    
    p_x0, p_y0 = 810, 70
    p_x1, p_y1 = 1530, 830
    
    panel = Image.new("RGBA", (p_x1 - p_x0, p_y1 - p_y0), C_PANEL_BG)
    canvas.alpha_composite(panel, (p_x0, p_y0))
    draw.rectangle([(p_x0, p_y0), (p_x1, p_y1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, p_x0, p_y0, p_x1, p_y1, size=24, stroke=4, accent_color=C_AMBER)
    
    cur_y = p_y0 + 40
    f_kicker = get_mono(14, bold=True)
    draw.text((p_x0 + 45, cur_y), "// BUDGETARY_ILLUSION • PRIORITY_ASYMMETRY", fill=C_AMBER, font=f_kicker)
    cur_y += 34
    
    b1_h = 160
    draw.rectangle([(p_x0 + 40, cur_y), (p_x1 - 40, cur_y + b1_h)], fill=C_INNER_BOX, outline=C_CRIMSON, width=2)
    draw.text((p_x0 + 65, cur_y + 18), "// HEAVY SIDE: PUBLIC SECURITY & RIOT HARDWARE", fill=C_CRIMSON, font=get_mono(13, bold=True))
    draw.text((p_x0 + 65, cur_y + 44), "Tactical Gear & Surveillance Procurement", fill=C_OFFWHITE, font=get_sans(24, bold=True))
    p1_desc = "Unconditional municipal and state funding allocated to tactical containment, tear gas canisters, and surveillance tech while social fabric rots."
    lines1 = wrap_text(p1_desc, get_sans(16, bold=False), 600, draw)
    dy = cur_y + 82
    for l in lines1:
        draw.text((p_x0 + 65, dy), l, fill=C_MUTED, font=get_sans(16, bold=False))
        dy += 22
    cur_y += b1_h + 20
    
    b2_h = 160
    draw.rectangle([(p_x0 + 40, cur_y), (p_x1 - 40, cur_y + b2_h)], fill=C_INNER_BOX, outline=C_AMBER, width=2)
    draw.text((p_x0 + 65, cur_y + 18), "// STARVED SIDE: EDUCATION, HEALTHCARE & HOUSING", fill=C_AMBER, font=get_mono(13, bold=True))
    draw.text((p_x0 + 65, cur_y + 44), "Public Education & Youth Family Formation", fill=C_OFFWHITE, font=get_sans(24, bold=True))
    p2_desc = "Constant calls for 'fiscal restraint' whenever funding youth education, medical infrastructure, or family formation comes to vote."
    lines2 = wrap_text(p2_desc, get_sans(16, bold=False), 600, draw)
    dy = cur_y + 82
    for l in lines2:
        draw.text((p_x0 + 65, dy), l, fill=C_MUTED, font=get_sans(16, bold=False))
        dy += 22
    cur_y += b2_h + 25
    
    f_pq = get_sans(20, bold=True)
    pq = "“When a national budget spends more on riot gear than public education, you get a future too unappealing for anyone to start a family.”"
    pq_lines = wrap_text(pq, f_pq, 640, draw)
    for l in pq_lines:
        draw.text((p_x0 + 45, cur_y), l, fill=C_OFFWHITE, font=f_pq)
        cur_y += 28
        
    f_cit = get_mono(12, bold=False)
    draw.text((p_x0 + 45, p_y1 - 40), "[ REF: SIPRI SECURITY DATABASE & UNESCO EDUCATION LEDGER ]", fill=C_MUTED, font=f_cit)
    
    f_thread = get_mono(15, bold=True)
    draw.text((p_x1 - 180, p_y1 - 42), "THREAD [ 4 / 5 ]", fill=C_AMBER, font=f_thread)
    
    out_path = os.path.join(OUT_DIR, "04_misplaced_priorities.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered:", out_path)

# ==============================================================================
# CARD 05: THE ANCHOR & CALL TO ACTION
# ==============================================================================
def render_card_05():
    canvas = create_base_canvas()
    
    anchor = Image.open("public/issues/issue-01/anchor-finale.webp").convert("RGBA")
    a_w, a_h = anchor.size
    a_scaled = anchor.resize((1600, int(a_h * (1600 / a_w))), Image.Resampling.LANCZOS)
    
    overlay = Image.new("RGBA", (1600, 900), (8, 9, 10, 195))
    canvas.alpha_composite(a_scaled, (0, -100))
    canvas.alpha_composite(overlay, (0, 0))
    
    draw = ImageDraw.Draw(canvas)
    
    cx0, cy0 = 160, 90
    cx1, cy1 = 1440, 810
    
    panel = Image.new("RGBA", (cx1 - cx0, cy1 - cy0), C_PANEL_BG)
    canvas.alpha_composite(panel, (cx0, cy0))
    draw.rectangle([(cx0, cy0), (cx1, cy1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, cx0, cy0, cx1, cy1, size=32, stroke=4, accent_color=C_CRIMSON)
    
    cur_y = cy0 + 55
    f_kicker = get_mono(14, bold=True)
    draw.text((cx0 + 60, cur_y), "// OBSERVATIONS BY MOTH1 • CORE_THESIS", fill=C_AMBER, font=f_kicker)
    
    f_thread = get_mono(15, bold=True)
    draw.text((cx1 - 240, cur_y), "THREAD [ 5 / 5 ]", fill=C_AMBER, font=f_thread)
    cur_y += 50
    
    f_thesis = get_sans(34, bold=True)
    thesis = "“What the world actually needs is a fresh roster of leaders, and a governance model that gives more weight to the people who will live long enough to deal with the fallout.”"
    lines = wrap_text(thesis, f_thesis, 1140, draw)
    for l in lines:
        draw.text((cx0 + 60, cur_y), l, fill=C_OFFWHITE, font=f_thesis)
        cur_y += 48
    cur_y += 25
    
    f_punch = get_sans(40, bold=True)
    punch_txt = "“Everything else is, and should be treated as, a scam.”"
    draw.rectangle([(cx0 + 60, cur_y), (cx1 - 60, cur_y + 80)], fill=(38, 12, 12, 255), outline=C_CRIMSON, width=2)
    draw.text((cx0 + 90, cur_y + 18), punch_txt, fill=C_CRIMSON, font=f_punch)
    cur_y += 125
    
    draw.line([(cx0 + 60, cur_y), (cx1 - 60, cur_y)], fill=(230, 228, 221, 40), width=1)
    cur_y += 35
    
    draw_seal(canvas, cx0 + 60, cur_y + 5, size=64, text="MOTH1")
    
    draw.text((cx0 + 145, cur_y + 10), "// READ THE FULL INTERACTIVE ESSAY WITH DATA SIMULATORS:", fill=C_MUTED, font=get_mono(13, bold=True))
    draw.text((cx0 + 145, cur_y + 36), "observations.moth1.xyz", fill=C_OFFWHITE, font=get_sans(32, bold=True))
    
    btn_x0 = cx1 - 360
    btn_y0 = cur_y + 8
    btn_x1 = cx1 - 60
    btn_y1 = cur_y + 66
    draw.rectangle([(btn_x0, btn_y0), (btn_x1, btn_y1)], fill=C_AMBER, outline=C_OFFWHITE, width=2)
    draw.text((btn_x0 + 40, btn_y0 + 16), "ENTER ESSAY  ➔", fill=(8, 9, 10, 255), font=get_sans(20, bold=True))
    
    out_path = os.path.join(OUT_DIR, "05_the_anchor.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered:", out_path)

if __name__ == "__main__":
    print("Generating 5 widescreen X cards with Cyber-Zen sumi-grid & monospace typography...")
    render_card_01()
    render_card_02()
    render_card_03()
    render_card_04()
    render_card_05()
    print("Cards rendered at 100% PNG quality.")
