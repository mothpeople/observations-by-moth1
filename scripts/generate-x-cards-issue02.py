#!/usr/bin/env python3
import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT_DIR = "dist-packages/issue-02-the-meat-grinder/x/cards"
os.makedirs(OUT_DIR, exist_ok=True)

# Color Palette — Cyber-Zen Sumi-e Graphic Novel (Issue 02 accents: mint #86efac, cyan #67e8f9, rose #fda4af, purple #c084fc)
C_CHARCOAL = (8, 9, 10, 255)
C_PANEL_BG = (14, 16, 20, 248)
C_INNER_BOX = (20, 24, 30, 255)
C_OFFWHITE = (230, 228, 221, 255)
C_MUTED = (165, 168, 165, 255)
C_MINT = (134, 239, 172, 255)     # #86efac
C_CYAN = (103, 232, 249, 255)     # #67e8f9
C_ROSE = (253, 164, 175, 255)     # #fda4af
C_PURPLE = (192, 132, 252, 255)   # #c084fc
C_AMBER = (217, 119, 6, 255)      # #d97706
C_CRIMSON = (220, 38, 38, 255)    # #dc2626
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

def draw_corner_brackets(draw, x0, y0, x1, y1, size=24, stroke=4, accent_color=C_MINT):
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
        
    c_draw.rectangle([(16, 16), (width - 17, height - 17)], outline=(230, 228, 221, 30), width=1)
    return canvas

# ==============================================================================
# CARD 01: THE COLD OPEN / HERO HOOK
# ==============================================================================
def render_card_01():
    canvas = create_base_canvas()
    
    hero_path = "public/issues/issue-02/hero-machine.webp"
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
    draw_corner_brackets(draw, panel_x0, panel_y0, panel_x1, panel_y1, size=28, stroke=4, accent_color=C_MINT)
    
    cur_y = panel_y0 + 50
    f_mono_tag = get_mono(14, bold=True)
    draw.text((panel_x0 + 50, cur_y), "// DISPATCH_02 • THE_COLD_OPEN", fill=C_MINT, font=f_mono_tag)
    cur_y += 34
    
    f_title = get_sans(52, bold=True)
    draw.text((panel_x0 + 50, cur_y), "THE MEAT GRINDER", fill=C_OFFWHITE, font=f_title)
    cur_y += 62
    draw.text((panel_x0 + 50, cur_y), "NEEDS MORE MEAT", fill=C_OFFWHITE, font=f_title)
    cur_y += 80
    
    draw.line([(panel_x0 + 50, cur_y), (panel_x0 + 200, cur_y)], fill=C_MINT, width=3)
    cur_y += 32
    
    f_quote = get_sans(26, bold=True)
    quote_text = "“Listen to tech billionaires whine on podcasts, and they'll tell you civilisation is collapsing because people became selfish. What they really mean is the meat grinder is running out of meat.”"
    lines = wrap_text(quote_text, f_quote, 640, draw)
    for l in lines:
        draw.text((panel_x0 + 50, cur_y), l, fill=C_OFFWHITE, font=f_quote)
        cur_y += 38
    cur_y += 18
    
    f_sec = get_sans(19, bold=False)
    sec_text = "Why the total fertility rate is in freefall, why the Venn diagram collapsed, and why the earth is quietly exhausted."
    lines_sec = wrap_text(sec_text, f_sec, 640, draw)
    for l in lines_sec:
        draw.text((panel_x0 + 50, cur_y), l, fill=C_MUTED, font=f_sec)
        cur_y += 28
        
    draw_seal(canvas, panel_x0 + 50, panel_y1 - 85, size=46, text="MOTH1")
    f_badge = get_mono(13, bold=True)
    draw.text((panel_x0 + 115, panel_y1 - 70), "SYS // OBSERVATIONS BY MOTH1 • ISSUE 02", fill=C_MUTED, font=f_badge)
    
    f_thread = get_mono(15, bold=True)
    draw.text((panel_x1 - 180, panel_y1 - 70), "THREAD [ 1 / 5 ]", fill=C_MINT, font=f_thread)
    
    out_path = os.path.join(OUT_DIR, "01_hero_hook.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered:", out_path)

# ==============================================================================
# CARD 02: THE COLLAPSING VENN DIAGRAM (AUTHENTIC SVG-GRADE WIREFRAME)
# ==============================================================================
def render_card_02():
    canvas = create_base_canvas()
    draw = ImageDraw.Draw(canvas)
    
    # Left Panel: The Actual 3-Circle Collapsing Venn Diagram
    p_x0, p_y0 = 70, 70
    p_x1, p_y1 = 760, 830
    w_venn = p_x1 - p_x0
    h_venn = p_y1 - p_y0
    
    venn_surface = Image.new("RGBA", (w_venn, h_venn), C_PANEL_BG)
    v_draw = ImageDraw.Draw(venn_surface)
    
    # Subtle internal grid on the diagram surface
    for x in range(0, w_venn, 44):
        v_draw.line([(x, 0), (x, h_venn)], fill=(30, 41, 59, 100), width=1)
    for y in range(0, h_venn, 44):
        v_draw.line([(0, y), (w_venn, y)], fill=(30, 41, 59, 100), width=1)
        
    # Coordinate crosshairs
    cx = w_venn // 2   # 345
    cy = 440
    v_draw.line([(cx, 130), (cx, 710)], fill=(51, 65, 85, 180), width=1)
    v_draw.line([(40, cy), (w_venn - 40, cy)], fill=(51, 65, 85, 180), width=1)
    
    # Top Titles in Venn Panel
    f_v_kicker = get_mono(13, bold=True)
    v_draw.text((32, 28), "// DEMOGRAPHIC_WIREFRAME • COLLAPSED_VENN", fill=C_CYAN, font=f_v_kicker)
    f_v_sub = get_sans(16, bold=True)
    v_draw.text((32, 52), "The 3 Circles of Human Reproduction", fill=C_OFFWHITE, font=f_v_sub)
    f_v_desc = get_sans(13, bold=False)
    v_draw.text((32, 74), "When the intersection breaks, birth rates collapse into the void.", fill=C_MUTED, font=f_v_desc)
    
    # Layer for alpha circles
    circles_layer = Image.new("RGBA", (w_venn, h_venn), (0, 0, 0, 0))
    c_layer_draw = ImageDraw.Draw(circles_layer)
    
    r = 138  # Circle radius
    
    # Circle 1: Family Support (Top-Left)
    c1_x, c1_y = cx - 100, cy - 100
    c_layer_draw.ellipse([(c1_x - r, c1_y - r), (c1_x + r, c1_y + r)], fill=(134, 239, 172, 32), outline=C_MINT, width=3)
    c_layer_draw.ellipse([(c1_x - r + 8, c1_y - r + 8), (c1_x + r - 8, c1_y + r - 8)], outline=(134, 239, 172, 90), width=1)
    
    # Circle 2: Social Policies & Housing (Top-Right)
    c2_x, c2_y = cx + 100, cy - 100
    c_layer_draw.ellipse([(c2_x - r, c2_y - r), (c2_x + r, c2_y + r)], fill=(103, 232, 249, 32), outline=C_CYAN, width=3)
    c_layer_draw.ellipse([(c2_x - r + 8, c2_y - r + 8), (c2_x + r - 8, c2_y + r - 8)], outline=(103, 232, 249, 90), width=1)
    
    # Circle 3: Financial Sustainability (Bottom-Center)
    c3_x, c3_y = cx, cy + 95
    c_layer_draw.ellipse([(c3_x - r, c3_y - r), (c3_x + r, c3_y + r)], fill=(253, 164, 175, 32), outline=C_ROSE, width=3)
    c_layer_draw.ellipse([(c3_x - r + 8, c3_y - r + 8), (c3_x + r - 8, c3_y + r - 8)], outline=(253, 164, 175, 90), width=1)
    
    venn_surface.alpha_composite(circles_layer)
    
    # Central TFR Black Hole Void
    void_x, void_y = cx, cy - 10
    v_r = 62
    v_draw.ellipse([(void_x - v_r, void_y - v_r), (void_x + v_r, void_y + v_r)], fill=(5, 6, 8, 255), outline=C_ROSE, width=2)
    v_draw.ellipse([(void_x - v_r + 10, void_y - v_r + 10), (void_x + v_r - 10, void_y + v_r - 10)], outline=C_PURPLE, width=1)
    
    f_vh1 = get_mono(11, bold=True)
    bb1 = v_draw.textbbox((0, 0), "TFR BLACK HOLE", font=f_vh1)
    v_draw.text((void_x - (bb1[2] - bb1[0]) // 2, void_y - 20), "TFR BLACK HOLE", fill=C_ROSE, font=f_vh1)
    
    f_vh2 = get_sans(19, bold=True)
    bb2 = v_draw.textbbox((0, 0), "0.72 - 0.97", font=f_vh2)
    v_draw.text((void_x - (bb2[2] - bb2[0]) // 2, void_y - 4), "0.72 - 0.97", fill=C_OFFWHITE, font=f_vh2)
    
    f_vh3 = get_mono(9, bold=True)
    bb3 = v_draw.textbbox((0, 0), "THE MIDDLE FELL THROUGH", font=f_vh3)
    v_draw.text((void_x - (bb3[2] - bb3[0]) // 2, void_y + 18), "THE MIDDLE FELL THROUGH", fill=C_PURPLE, font=f_vh3)
    
    # Labels positioned inside / beside each circle
    f_c1 = get_mono(14, bold=True)
    v_draw.text((c1_x - 110, c1_y - 70), "FAMILY SUPPORT", fill=C_MINT, font=f_c1)
    f_c1_sub = get_sans(12, bold=False)
    v_draw.text((c1_x - 110, c1_y - 50), "Caregiving & Kin Trust", fill=C_OFFWHITE, font=f_c1_sub)
    
    f_c2 = get_mono(14, bold=True)
    v_draw.text((c2_x - 15, c2_y - 70), "SOCIAL POLICIES", fill=C_CYAN, font=f_c2)
    f_c2_sub = get_sans(12, bold=False)
    v_draw.text((c2_x - 15, c2_y - 50), "Housing & Parental Leave", fill=C_OFFWHITE, font=f_c2_sub)
    
    f_c3 = get_mono(14, bold=True)
    bb_c3 = v_draw.textbbox((0, 0), "FINANCIAL SUSTAINABILITY", font=f_c3)
    v_draw.text((c3_x - (bb_c3[2] - bb_c3[0]) // 2, c3_y + 60), "FINANCIAL SUSTAINABILITY", fill=C_ROSE, font=f_c3)
    f_c3_sub = get_sans(12, bold=False)
    bb_c3s = v_draw.textbbox((0, 0), "Upward Mobility & Real Savings", font=f_c3_sub)
    v_draw.text((c3_x - (bb_c3s[2] - bb_c3s[0]) // 2, c3_y + 80), "Upward Mobility & Real Savings", fill=C_OFFWHITE, font=f_c3_sub)
    
    f_cit_v = get_mono(11, bold=False)
    v_draw.text((32, h_venn - 32), "[ REF: OECD FAMILY DATABASE (2024), SINGSTAT & KOSTAT ]", fill=C_MUTED, font=f_cit_v)
    
    v_draw.rectangle([(0, 0), (w_venn - 1, h_venn - 1)], outline=C_BORDER, width=2)
    canvas.alpha_composite(venn_surface, (p_x0, p_y0))
    
    draw_corner_brackets(draw, p_x0, p_y0, p_x1, p_y1, size=24, stroke=4, accent_color=C_CYAN)
    
    # RIGHT SIDE: The Metric Cards & Analytical Breakdown
    r_x0, r_y0 = 810, 70
    r_x1, r_y1 = 1530, 830
    
    panel_r = Image.new("RGBA", (r_x1 - r_x0, r_y1 - r_y0), C_PANEL_BG)
    canvas.alpha_composite(panel_r, (r_x0, r_y0))
    draw.rectangle([(r_x0, r_y0), (r_x1, r_y1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, r_x0, r_y0, r_x1, r_y1, size=24, stroke=4, accent_color=C_ROSE)
    
    cur_y = r_y0 + 40
    f_kicker = get_mono(14, bold=True)
    draw.text((r_x0 + 45, cur_y), "// DEMOGRAPHIC_COLLAPSE • THE_BLACK_HOLE", fill=C_ROSE, font=f_kicker)
    cur_y += 34
    
    metrics = [
        ("0.72 - 0.97", C_ROSE, "URBAN FERTILITY RATE FREEFALL (TFR)", "South Korea (0.72), Singapore (0.97) — far below the 2.10 replacement threshold. Cash subsidies fail to close the void."),
        ("3 CIRCLES", C_CYAN, "BROKEN INTERSECTION OF REPRODUCTION", "Family support, affordable shelter, and upward mobility once intersected. The middle has completely fallen through."),
        ("$310K+", C_MINT, "LIFETIME PARENTING COST PER CHILD", "Continuing the species has turned from a baseline community norm into an underpaid, high-risk freelance gig.")
    ]
    
    for val, color, label, desc in metrics:
        box_y1 = cur_y + 145
        draw.rectangle([(r_x0 + 40, cur_y), (r_x1 - 40, box_y1)], fill=C_INNER_BOX, outline=C_BORDER, width=1)
        
        f_val = get_sans(48, bold=True)
        draw.text((r_x0 + 65, cur_y + 15), val, fill=color, font=f_val)
        
        f_lbl = get_mono(13, bold=True)
        draw.text((r_x0 + 65, cur_y + 76), f"// {label}", fill=C_OFFWHITE, font=f_lbl)
        
        f_desc = get_sans(15, bold=False)
        d_lines = wrap_text(desc, f_desc, 600, draw)
        d_y = cur_y + 102
        for dl in d_lines:
            draw.text((r_x0 + 65, d_y), dl, fill=C_MUTED, font=f_desc)
            d_y += 18
            
        cur_y = box_y1 + 18
        
    f_cit = get_mono(12, bold=False)
    draw.text((r_x0 + 45, r_y1 - 40), "[ REF: KOSTAT / SINGSTAT / BROOKINGS INSTITUTION (2024) ]", fill=C_MUTED, font=f_cit)
    
    f_thread = get_mono(15, bold=True)
    draw.text((r_x1 - 180, r_y1 - 42), "THREAD [ 2 / 5 ]", fill=C_MINT, font=f_thread)
    
    out_path = os.path.join(OUT_DIR, "02_the_venn_collapse.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered:", out_path)

# ==============================================================================
# CARD 03: THE 4 GRAND CONTRADICTIONS
# ==============================================================================
def render_card_03():
    canvas = create_base_canvas()
    draw = ImageDraw.Draw(canvas)
    
    f_kicker = get_mono(14, bold=True)
    draw.text((70, 50), "// SYSTEMIC_PARADOX // THE_GRAND_CONTRADICTIONS", fill=C_CYAN, font=f_kicker)
    
    f_title = get_sans(42, bold=True)
    draw.text((70, 78), "THE FOUR GRAND CONTRADICTIONS", fill=C_OFFWHITE, font=f_title)
    
    f_thread = get_mono(15, bold=True)
    draw.text((1600 - 240, 75), "THREAD [ 3 / 5 ]", fill=C_CYAN, font=f_thread)
    
    stages = [
        ("PARADOX 1", "The AI Trap", "300M", "ROLES EXPOSED TO AI", "Breeding workers for a market that is automating them out. Cognitive career ladders dismantled.", "public/issues/issue-02/contradiction-1-ai.webp", C_MINT),
        ("PARADOX 2", "Sinking Seas", "1.73x", "EARTHS OVERDRAFT", "Major Asian hubs face chronic flooding by 2050, yet leaders plead for more mouths to feed.", "public/issues/issue-02/contradiction-2-sinking.webp", C_CYAN),
        ("PARADOX 3", "The Paid Gig", "$310K", "CHILD COST BURDEN", "Shelter turned into an asset to flip. Tiny baby bonuses won't fix hyper-financialised housing.", "public/issues/issue-02/contradiction-3-subsidy.webp", C_ROSE),
        ("PARADOX 4", "Sandwich Meat", "54%", "CAREGIVER STRAIN", "Dual pressure: carrying elderly parents past retirement while bearing kids with zero help.", "public/issues/issue-02/contradiction-4-sandwich.webp", C_PURPLE),
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
    draw.text((95, 824), "SYSTEM_VERDICT:", fill=C_ROSE, font=f_bot)
    f_bot_sub = get_sans(16, bold=False)
    draw.text((270, 823), "Raising a human into a rigged market with no economic purpose is not a blessing. It is cruelty.", fill=C_OFFWHITE, font=f_bot_sub)
    
    out_path = os.path.join(OUT_DIR, "03_the_grand_contradictions.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered:", out_path)

# ==============================================================================
# CARD 04: CARRYING CAPACITY & THE 3 TABOO COUNTER-PROPOSALS
# ==============================================================================
def render_card_04():
    canvas = create_base_canvas()
    draw = ImageDraw.Draw(canvas)
    
    # Top Header
    f_kicker = get_mono(14, bold=True)
    draw.text((70, 44), "// PARADIGM_SHIFT • THREE UNCOMFORTABLE COUNTER-PROPOSALS", fill=C_MINT, font=f_kicker)
    
    f_title = get_sans(40, bold=True)
    draw.text((70, 72), "THREE TABOO COUNTER-PROPOSALS", fill=C_OFFWHITE, font=f_title)
    
    f_thread = get_mono(15, bold=True)
    draw.text((1529 - 180, 68), "THREAD [ 4 / 5 ]", fill=C_MINT, font=f_thread)
    
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
    
    col_w = 469
    gap = 26
    start_x = 70
    start_y = 138
    col_h = 650
    
    for i, (code, title, stat, stat_lbl, copy, ref, img_path, accent) in enumerate(proposals):
        cx0 = start_x + i * (col_w + gap)
        cx1 = cx0 + col_w
        cy0 = start_y
        cy1 = start_y + col_h
        
        # Panel Background
        panel = Image.new("RGBA", (col_w, col_h), C_PANEL_BG)
        canvas.alpha_composite(panel, (cx0, cy0))
        draw.rectangle([(cx0, cy0), (cx1, cy1)], outline=C_BORDER, width=2)
        draw_corner_brackets(draw, cx0, cy0, cx1, cy1, size=22, stroke=3, accent_color=accent)
        
        # 16:9 Thumbnail Artwork
        img = Image.open(img_path).convert("RGBA")
        img_h = 210
        img_scaled = img.resize((col_w - 4, img_h), Image.Resampling.LANCZOS)
        canvas.alpha_composite(img_scaled, (cx0 + 2, cy0 + 2))
        draw.line([(cx0, cy0 + 2 + img_h), (cx1, cy0 + 2 + img_h)], fill=C_BORDER, width=2)
        
        # Content Block
        ty = cy0 + img_h + 18
        f_code = get_mono(12, bold=True)
        draw.text((cx0 + 20, ty), f"// {code}", fill=accent, font=f_code)
        ty += 22
        
        f_name = get_sans(22, bold=True)
        title_lines = wrap_text(title, f_name, col_w - 40, draw)
        for tl in title_lines:
            draw.text((cx0 + 20, ty), tl, fill=C_OFFWHITE, font=f_name)
            ty += 28
        ty += 8
        
        # Metric Highlight Box
        draw.rectangle([(cx0 + 16, ty), (cx1 - 16, ty + 72)], fill=C_INNER_BOX, outline=C_BORDER, width=1)
        f_stat = get_sans(26, bold=True)
        draw.text((cx0 + 26, ty + 10), stat, fill=accent, font=f_stat)
        f_lbl = get_mono(11, bold=True)
        draw.text((cx0 + 26, ty + 44), f"// {stat_lbl}", fill=C_MUTED, font=f_lbl)
        ty += 72 + 16
        
        # Narrative Copy
        f_copy = get_sans(15, bold=False)
        lines = wrap_text(copy, f_copy, col_w - 40, draw)
        for l in lines:
            draw.text((cx0 + 20, ty), l, fill=C_OFFWHITE, font=f_copy)
            ty += 22
            
        # Empirical Source Footnote
        f_ref = get_mono(10, bold=False)
        draw.text((cx0 + 20, cy1 - 28), ref, fill=(165, 168, 165, 180), font=f_ref)
        
    # System Verdict Bottom Bar
    draw.rectangle([(70, 804), (1529, 862)], fill=(14, 16, 20, 255), outline=C_BORDER, width=1)
    f_bot = get_mono(14, bold=True)
    draw.text((95, 824), "SYSTEM_VERDICT:", fill=C_MINT, font=f_bot)
    f_bot_sub = get_sans(17, bold=True)
    draw.text((260, 822), "You cannot prioritize perpetual GDP expansion and expect people to build healthy families.", fill=C_OFFWHITE, font=f_bot_sub)
    
    out_path = os.path.join(OUT_DIR, "04_carrying_capacity.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered:", out_path)

# ==============================================================================
# CARD 05: THE ANCHOR & BIOLOGICAL CORRECTION (PERFECT PUNCHLINE WRAPPING)
# ==============================================================================
def render_card_05():
    canvas = create_base_canvas()
    
    quiet = Image.open("public/issues/issue-02/quiet-earth.webp").convert("RGBA")
    q_w, q_h = quiet.size
    q_scaled = quiet.resize((1600, int(q_h * (1600 / q_w))), Image.Resampling.LANCZOS)
    
    overlay = Image.new("RGBA", (1600, 900), (8, 9, 10, 205))
    canvas.alpha_composite(q_scaled, (0, -100))
    canvas.alpha_composite(overlay, (0, 0))
    
    draw = ImageDraw.Draw(canvas)
    
    # Center Hero Panel: width 1320, height 720
    cx0, cy0 = 140, 85
    cx1, cy1 = 1460, 815
    panel_w = cx1 - cx0
    panel_h = cy1 - cy0
    
    panel = Image.new("RGBA", (panel_w, panel_h), C_PANEL_BG)
    canvas.alpha_composite(panel, (cx0, cy0))
    draw.rectangle([(cx0, cy0), (cx1, cy1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, cx0, cy0, cx1, cy1, size=32, stroke=4, accent_color=C_MINT)
    
    cur_y = cy0 + 45
    # Kicker
    f_kicker = get_mono(14, bold=True)
    draw.text((cx0 + 55, cur_y), "// OBSERVATIONS BY MOTH1 • THE_BIOLOGICAL_CORRECTION", fill=C_MINT, font=f_kicker)
    
    f_thread = get_mono(15, bold=True)
    draw.text((cx1 - 220, cur_y), "THREAD [ 5 / 5 ]", fill=C_MINT, font=f_thread)
    cur_y += 40
    
    # Lead sentence
    f_lead = get_sans(22, bold=True)
    draw.text((cx0 + 55, cur_y), "“People will have kids when they genuinely feel the future is brighter than the past.”", fill=C_MINT, font=f_lead)
    cur_y += 42
    
    # Main Body / Thesis (Wrapped neatly)
    f_thesis = get_sans(27, bold=False)
    thesis = "“When you look around at an unaffordable world, an unstable climate, and an automated job landscape run by billionaires who hoard the ladder, having less people is not a crisis. It is a biological correction. The planet is tired of us, and declining birth rates are simply society's immune response.”"
    lines = wrap_text(thesis, f_thesis, panel_w - 110, draw)
    for l in lines:
        draw.text((cx0 + 55, cur_y), l, fill=C_OFFWHITE, font=f_thesis)
        cur_y += 38
    cur_y += 24
    
    # The Punchline Box: Perfectly centered and bounded
    box_x0 = cx0 + 55
    box_y0 = cur_y
    box_x1 = cx1 - 55
    box_y1 = cur_y + 105
    box_w = box_x1 - box_x0
    box_h = box_y1 - box_y0
    
    draw.rectangle([(box_x0, box_y0), (box_x1, box_y1)], fill=(15, 30, 20, 255), outline=C_MINT, width=2)
    
    # Punchline text: Auto-wrapped and vertically/horizontally centered
    f_punch = get_sans(28, bold=True)
    punch_txt = "“Everything else is just noise from people who need more cogs in their machine.”"
    p_lines = wrap_text(punch_txt, f_punch, box_w - 50, draw)
    line_h = 36
    tot_text_h = len(p_lines) * line_h
    start_py = box_y0 + (box_h - tot_text_h) // 2
    for pline in p_lines:
        bb = draw.textbbox((0, 0), pline, font=f_punch)
        tw = bb[2] - bb[0]
        tx = box_x0 + (box_w - tw) // 2
        draw.text((tx, start_py), pline, fill=C_MINT, font=f_punch)
        start_py += line_h
        
    cur_y = box_y1 + 30
    
    # Subtle divider rule
    draw.line([(cx0 + 55, cur_y), (cx1 - 55, cur_y)], fill=(230, 228, 221, 40), width=1)
    cur_y += 28
    
    # Gateway Link Box: Seal + URL + Action Button
    draw_seal(canvas, cx0 + 55, cur_y - 2, size=62, text="MOTH1")
    
    draw.text((cx0 + 135, cur_y + 4), "// READ THE FULL INTERACTIVE ESSAY WITH VENN SIMULATORS:", fill=C_MUTED, font=get_mono(12, bold=True))
    draw.text((cx0 + 135, cur_y + 26), "observations.moth1.xyz/the-meat-grinder", fill=C_OFFWHITE, font=get_sans(26, bold=True))
    
    # CTA Button
    btn_x0 = cx1 - 320
    btn_y0 = cur_y + 2
    btn_x1 = cx1 - 55
    btn_y1 = cur_y + 58
    draw.rectangle([(btn_x0, btn_y0), (btn_x1, btn_y1)], fill=C_MINT, outline=C_OFFWHITE, width=2)
    btn_font = get_sans(19, bold=True)
    bb_btn = draw.textbbox((0, 0), "ENTER ESSAY  ➔", font=btn_font)
    btn_tw = bb_btn[2] - bb_btn[0]
    draw.text((btn_x0 + (btn_x1 - btn_x0 - btn_tw) // 2, btn_y0 + 16), "ENTER ESSAY  ➔", fill=(8, 9, 10, 255), font=btn_font)
    
    out_path = os.path.join(OUT_DIR, "05_the_anchor.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered:", out_path)

if __name__ == "__main__":
    print("Generating full suite of 5 widescreen X cards for Issue 02...")
    render_card_01()
    render_card_02()
    render_card_03()
    render_card_04()
    render_card_05()
    print("All Issue 02 X cards rendered at 100% PNG quality.")
