#!/usr/bin/env python3
import os
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = "dist-packages/issue-03-war-on-drugs/x/cards"
SUBSTACK_DIR = "dist-packages/issue-03-war-on-drugs/substack"
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(SUBSTACK_DIR, exist_ok=True)

# Acid Halftone & Surveillance Blueprint Palette (Issue 03)
C_OBSIDIAN = (10, 11, 14, 255)      # #0a0b0e
C_PANEL_BG = (14, 16, 21, 248)      # #0e1015
C_INNER_BOX = (8, 9, 12, 255)       # #08090c
C_OFFWHITE = (241, 245, 249, 255)   # #f1f5f9
C_SLATE300 = (203, 213, 225, 255)   # #cbd5e1
C_MUTED = (148, 163, 184, 255)      # #94a3b8
C_YELLOW = (234, 179, 8, 255)       # #eab308 (Acid Amber)
C_GREEN = (34, 197, 94, 255)        # #22c55e (Phosphor Green)
C_RED = (239, 68, 68, 255)          # #ef4444 (Blood Vermilion)
C_BORDER = (51, 65, 85, 180)        # #334155
C_GRID_LINE = (234, 179, 8, 14)

FONT_SANS = "/System/Library/Fonts/HelveticaNeue.ttc"
FONT_MONO = "/System/Library/Fonts/SFNSMono.ttf"
if not os.path.exists(FONT_MONO):
    FONT_MONO = "/System/Library/Fonts/Menlo.ttc"


def get_sans(size, bold=False, condensed=False):
    index = 1 if bold else (4 if condensed else 0)
    try:
        return ImageFont.truetype(FONT_SANS, size, index=index)
    except Exception:
        return ImageFont.load_default()


def get_mono(size, bold=False):
    try:
        return ImageFont.truetype(FONT_MONO, size)
    except Exception:
        return ImageFont.load_default()


def draw_corner_brackets(draw, x0, y0, x1, y1, size=24, stroke=4, accent_color=C_YELLOW):
    draw.line([(x0 - 2, y0 - 2), (x0 + size, y0 - 2)], fill=C_OFFWHITE, width=stroke)
    draw.line([(x0 - 2, y0 - 2), (x0 - 2, y0 + size)], fill=C_OFFWHITE, width=stroke)
    draw.line([(x1 - size, y1 + 2), (x1 + 2, y1 + 2)], fill=accent_color, width=stroke)
    draw.line([(x1 + 2, y1 - size), (x1 + 2, y1 + 2)], fill=accent_color, width=stroke)


def draw_seal(img, x, y, size=52, text="MOTH1"):
    seal_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(seal_img)
    s_draw.rectangle([(2, 2), (size - 3, size - 3)], fill=C_RED, outline=C_OFFWHITE, width=2)
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

    grid_spacing = 56
    for x in range(0, width, grid_spacing):
        c_draw.line([(x, 0), (x, height)], fill=C_GRID_LINE, width=1)
    for y in range(0, height, grid_spacing):
        c_draw.line([(0, y), (width, y)], fill=(34, 197, 94, 12), width=1)

    c_draw.rectangle([(16, 16), (width - 17, height - 17)], outline=(234, 179, 8, 45), width=1)
    return canvas


# ==============================================================================
# CARD 01: THE COLD OPEN / THE TRILLION-DOLLAR PHANTOM
# ==============================================================================
def render_card_01():
    canvas = create_base_canvas()

    hero_path = "public/issues/issue-03/hero-dossier.webp"
    hero = Image.open(hero_path).convert("RGBA")
    h_w, h_h = hero.size
    target_h = 900
    target_w = int(h_w * (target_h / h_h))
    hero_scaled = hero.resize((target_w, target_h), Image.Resampling.LANCZOS)

    fade_mask = Image.new("L", (target_w, target_h), 255)
    fade_draw = ImageDraw.Draw(fade_mask)
    fade_start = int(target_w * 0.48)
    for x in range(fade_start, target_w):
        alpha = int(255 * (1.0 - (x - fade_start) / (target_w - fade_start)))
        fade_draw.line([(x, 0), (x, target_h)], fill=alpha)

    hero_scaled.putalpha(fade_mask)
    canvas.alpha_composite(hero_scaled, (0, 0))

    panel_x0, panel_y0 = 750, 64
    panel_x1, panel_y1 = 1536, 836

    panel = Image.new("RGBA", (panel_x1 - panel_x0, panel_y1 - panel_y0), C_PANEL_BG)
    p_draw = ImageDraw.Draw(panel)
    p_draw.rectangle([(0, 0), (panel_x1 - panel_x0 - 1, panel_y1 - panel_y0 - 1)], outline=C_BORDER, width=2)
    canvas.alpha_composite(panel, (panel_x0, panel_y0))

    draw = ImageDraw.Draw(canvas)
    draw_corner_brackets(draw, panel_x0, panel_y0, panel_x1, panel_y1, size=28, stroke=4, accent_color=C_YELLOW)

    cur_y = panel_y0 + 42
    f_mono_tag = get_mono(14, bold=True)
    draw.text((panel_x0 + 48, cur_y), "OBSERVATIONS BY MOTH1 • ISSUE 03", fill=C_YELLOW, font=f_mono_tag)
    cur_y += 34

    f_title = get_sans(48, bold=True)
    draw.text((panel_x0 + 48, cur_y), "THE WAR NO ONE WAS", fill=C_OFFWHITE, font=f_title)
    cur_y += 58
    draw.text((panel_x0 + 48, cur_y), "SUPPOSED TO WIN", fill=C_YELLOW, font=f_title)
    cur_y += 72

    draw.line([(panel_x0 + 48, cur_y), (panel_x0 + 240, cur_y)], fill=C_RED, width=3)
    cur_y += 26

    f_quote = get_sans(23, bold=True)
    quote_text = "Over a trillion dollars of public wealth has been incinerated in the name of total eradication. Fifty years later, narcotics are cheaper, more potent, and more accessible than at any point in modern history."
    for l in wrap_text(quote_text, f_quote, 680, draw):
        draw.text((panel_x0 + 48, cur_y), l, fill=C_OFFWHITE, font=f_quote)
        cur_y += 33
    cur_y += 18

    # 3 KPI Metric Strip inside Card 1
    kpis = [
        ("$1,000,000,000,000+", "PUBLIC WEALTH INCINERATED SINCE 1971", C_RED),
        ("-81% PRICE • +190% POTENCY", "STREET RETAIL COST VS. LETHAL PURITY", C_YELLOW),
        ("$650B+ ANNUAL TURNOVER", "TAX-FREE CARTEL MONOPOLY VALUATION", C_GREEN),
    ]
    for val, lbl, col in kpis:
        draw.rectangle([(panel_x0 + 48, cur_y), (panel_x1 - 48, cur_y + 62)], fill=C_INNER_BOX, outline=C_BORDER, width=1)
        draw.rectangle([(panel_x0 + 48, cur_y), (panel_x0 + 54, cur_y + 62)], fill=col)
        draw.text((panel_x0 + 68, cur_y + 10), val, fill=col, font=get_mono(18, bold=True))
        draw.text((panel_x0 + 68, cur_y + 36), lbl, fill=C_SLATE300, font=get_mono(11, bold=True))
        cur_y += 72

    draw_seal(canvas, panel_x0 + 48, panel_y1 - 74, size=46, text="MOTH1")
    draw.text((panel_x0 + 108, panel_y1 - 60), "OBSERVATIONS BY MOTH1 • ISSUE 03", fill=C_MUTED, font=get_mono(13, bold=True))
    draw.text((panel_x1 - 185, panel_y1 - 60), "THREAD [ 1 / 5 ]", fill=C_YELLOW, font=get_mono(15, bold=True))

    out_path = os.path.join(OUT_DIR, "01_hero_hook.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered:", out_path)


# ==============================================================================
# CARD 02: THE OLIGARCH'S PHARMACY (THE CLASS CONTRADICTION)
# ==============================================================================
def render_card_02():
    canvas = create_base_canvas()
    draw = ImageDraw.Draw(canvas)

    draw.text((70, 44), "THE OLIGARCH'S PHARMACY • THE CLASS CONTRADICTION", fill=C_YELLOW, font=get_mono(14, bold=True))
    draw.text((70, 72), "CHEMICAL EXPLORATION IS ONLY ILLEGAL IF YOU ARE POOR", fill=C_OFFWHITE, font=get_sans(38, bold=True))
    draw.text((1600 - 235, 68), "THREAD [ 2 / 5 ]", fill=C_YELLOW, font=get_mono(15, bold=True))

    # Left Column: Sovereign Billionaire Boardroom
    lx0, ly0, lx1, ly1 = 70, 138, 780, 795
    panel_l = Image.new("RGBA", (lx1 - lx0, ly1 - ly0), C_PANEL_BG)
    canvas.alpha_composite(panel_l, (lx0, ly0))
    draw.rectangle([(lx0, ly0), (lx1, ly1)], outline=C_YELLOW, width=2)

    loft = Image.open("public/issues/issue-03/executive-loft.webp").convert("RGBA").resize((lx1 - lx0 - 4, 270), Image.Resampling.LANCZOS)
    canvas.alpha_composite(loft, (lx0 + 2, ly0 + 2))
    draw.rectangle([(lx0 + 18, ly0 + 18), (lx0 + 360, ly0 + 50)], fill=C_YELLOW)
    draw.text((lx0 + 28, ly0 + 26), "TIER A • SOVEREIGN CAPITAL", fill=C_OBSIDIAN, font=get_mono(13, bold=True))

    ty = ly0 + 292
    draw.text((lx0 + 32, ty), "The Penthouse Boardroom", fill=C_YELLOW, font=get_sans(30, bold=True))
    ty += 44
    copy_l = "Tech executives, venture capitalists, and hedge fund founders take ketamine for executive focus, microdose psilocybin for lateral bandwidth, or smoke cannabis on global livestreams. Prime ministers court their capital."
    for l in wrap_text(copy_l, get_sans(18), lx1 - lx0 - 64, draw):
        draw.text((lx0 + 32, ty), l, fill=C_OFFWHITE, font=get_sans(18))
        ty += 26
    ty += 18

    draw.rectangle([(lx0 + 32, ty), (lx1 - 32, ty + 96)], fill=C_INNER_BOX, outline=C_YELLOW, width=1)
    draw.text((lx0 + 50, ty + 16), "0 ARRESTS • BIOHACKING VISIONARY", fill=C_GREEN, font=get_mono(18, bold=True))
    draw.text((lx0 + 50, ty + 48), "Bespoke clinical ketamine & psilocybin retreats", fill=C_SLATE300, font=get_sans(16))

    # Right Column: Working-Class Holding Cell
    rx0, ry0, rx1, ry1 = 820, 138, 1530, 795
    panel_r = Image.new("RGBA", (rx1 - rx0, ry1 - ry0), C_PANEL_BG)
    canvas.alpha_composite(panel_r, (rx0, ry0))
    draw.rectangle([(rx0, ry0), (rx1, ry1)], outline=C_RED, width=2)

    cell = Image.open("public/issues/issue-03/concrete-cell.webp").convert("RGBA").resize((rx1 - rx0 - 4, 270), Image.Resampling.LANCZOS)
    canvas.alpha_composite(cell, (rx0 + 2, ry0 + 2))
    draw.rectangle([(rx0 + 18, ry0 + 18), (rx0 + 390, ry0 + 50)], fill=C_RED)
    draw.text((rx0 + 28, ry0 + 26), "TIER B • WORKING-CLASS REALITY", fill=C_OFFWHITE, font=get_mono(13, bold=True))

    ty = ry0 + 292
    draw.text((rx0 + 32, ty), "The Concrete Holding Cell", fill=C_RED, font=get_sans(30, bold=True))
    ty += 44
    copy_r = "Let an ordinary working-class citizen get stopped with a few grams of the exact same molecule. The state mobilizes tactical squads, mandatory minimum sentences, and permanent felony records that destroy their future."
    for l in wrap_text(copy_r, get_sans(18), rx1 - rx0 - 64, draw):
        draw.text((rx0 + 32, ty), l, fill=C_OFFWHITE, font=get_sans(18))
        ty += 26
    ty += 18

    draw.rectangle([(rx0 + 32, ty), (rx1 - 32, ty + 96)], fill=C_INNER_BOX, outline=C_RED, width=1)
    draw.text((rx0 + 50, ty + 16), "82% WORKING-CLASS POSSESSION ARRESTS", fill=C_RED, font=get_mono(18, bold=True))
    draw.text((rx0 + 50, ty + 48), "5 to 25 years imprisonment or capital punishment", fill=C_SLATE300, font=get_sans(16))

    # Bottom Verdict Bar
    draw.rectangle([(70, 812), (1530, 864)], fill=C_INNER_BOX, outline=C_BORDER, width=1)
    draw.text((95, 828), "VERDICT: The state does not fear the chemical molecule. It polices the socioeconomic class consuming it.", fill=C_YELLOW, font=get_sans(19, bold=True))

    out_path = os.path.join(OUT_DIR, "02_class_contradiction.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered:", out_path)


# ==============================================================================
# CARD 03: THE LANCET 16-CRITERIA HARM MATRIX (SORTED MOST -> LEAST HARMFUL)
# ==============================================================================
def render_card_03():
    canvas = create_base_canvas()
    draw = ImageDraw.Draw(canvas)

    draw.text((70, 44), "THE STATE'S FAVORITE POISON • THE ALCOHOL PARADOX", fill=C_YELLOW, font=get_mono(14, bold=True))
    draw.text((70, 72), "THE LANCET 16-CRITERIA DRUG HARM MATRIX (0–100)", fill=C_OFFWHITE, font=get_sans(38, bold=True))
    draw.text((1600 - 235, 68), "THREAD [ 3 / 5 ]", fill=C_YELLOW, font=get_mono(15, bold=True))

    # Left Chart Panel
    cx0, cy0, cx1, cy1 = 70, 138, 1010, 845
    panel_c = Image.new("RGBA", (cx1 - cx0, cy1 - cy0), C_PANEL_BG)
    canvas.alpha_composite(panel_c, (cx0, cy0))
    draw.rectangle([(cx0, cy0), (cx1, cy1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, cx0, cy0, cx1, cy1, size=24, stroke=4, accent_color=C_YELLOW)

    substances = [
        ("1. Alcohol", 26, 46, 72, "LEGAL • TOP SHELF TAXED", C_YELLOW),
        ("2. Heroin", 34, 21, 55, "SCHEDULE I • CONTRABAND", C_RED),
        ("3. Crack Cocaine", 37, 17, 54, "SCHEDULE I • CONTRABAND", C_RED),
        ("4. Methamphetamine", 32, 1, 33, "SCHEDULE II • CONTRABAND", C_RED),
        ("5. Tobacco", 16, 10, 26, "LEGAL • STATE EXCISE TAXED", C_YELLOW),
        ("6. Cannabis", 11, 9, 20, "CRIMINALISED IN MOST STATES", C_GREEN),
        ("7. Ketamine", 11, 4, 15, "EXECUTIVE CLINIC / STREET FELONY", C_GREEN),
        ("8. MDMA (Ecstasy)", 8, 1, 9, "SCHEDULE I • FELONY", C_GREEN),
        ("9. Psilocybin Mushrooms", 6, 0, 6, "SCHEDULE I • ZERO LETHAL OVERDOSE", C_GREEN),
    ]

    ry = cy0 + 28
    for name, user_h, soc_h, tot, status, col in substances:
        draw.text((cx0 + 32, ry), name, fill=C_OFFWHITE, font=get_sans(18, bold=True))
        draw.text((cx0 + 285, ry + 2), status, fill=col, font=get_mono(11, bold=True))
        score_str = f"User: {user_h} + Society: {soc_h} = {tot} pts"
        bb = draw.textbbox((0, 0), score_str, font=get_mono(13, bold=True))
        draw.text((cx1 - 32 - (bb[2] - bb[0]), ry + 2), score_str, fill=C_OFFWHITE, font=get_mono(13, bold=True))

        bar_x = cx0 + 32
        bar_y = ry + 28
        bar_max_w = cx1 - cx0 - 64
        draw.rectangle([(bar_x, bar_y), (bar_x + bar_max_w, bar_y + 20)], fill=C_INNER_BOX, outline=C_BORDER, width=1)

        u_w = int((user_h / 78.0) * bar_max_w)
        s_w = int((soc_h / 78.0) * bar_max_w)
        if u_w > 0:
            draw.rectangle([(bar_x, bar_y), (bar_x + u_w, bar_y + 20)], fill=C_RED)
        if s_w > 0:
            draw.rectangle([(bar_x + u_w, bar_y), (bar_x + u_w + s_w, bar_y + 20)], fill=C_YELLOW)

        ry += 68

    # Legend inside chart panel
    draw.rectangle([(cx0 + 32, cy1 - 46), (cx0 + 50, cy1 - 28)], fill=C_RED)
    draw.text((cx0 + 58, cy1 - 44), "Harm to User (Direct Toxicology)", fill=C_RED, font=get_mono(12, bold=True))
    draw.rectangle([(cx0 + 350, cy1 - 46), (cx0 + 368, cy1 - 28)], fill=C_YELLOW)
    draw.text((cx0 + 376, cy1 - 44), "Harm to Society (Collateral)", fill=C_YELLOW, font=get_mono(12, bold=True))
    draw.text((cx0 + 640, cy1 - 44), "Ref: Prof. David Nutt et al., The Lancet", fill=C_MUTED, font=get_mono(11))

    # Right Analytical Panel
    rx0, ry0, rx1, ry1 = 1045, 138, 1530, 845
    panel_r = Image.new("RGBA", (rx1 - rx0, ry1 - ry0), C_PANEL_BG)
    canvas.alpha_composite(panel_r, (rx0, ry0))
    draw.rectangle([(rx0, ry0), (rx1, ry1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, rx0, ry0, rx1, ry1, size=24, stroke=4, accent_color=C_RED)

    alc_img = Image.open("public/issues/issue-03/alcohol-paradox.webp").convert("RGBA").resize((rx1 - rx0 - 4, 245), Image.Resampling.LANCZOS)
    canvas.alpha_composite(alc_img, (rx0 + 2, ry0 + 2))

    ty = ry0 + 268
    draw.text((rx0 + 28, ty), "72 / 100 HARM SCORE", fill=C_YELLOW, font=get_mono(15, bold=True))
    ty += 28
    draw.text((rx0 + 28, ty), "Taxed on the Top Shelf", fill=C_OFFWHITE, font=get_sans(28, bold=True))
    ty += 42
    copy_r = "When Professor David Nutt and the UK Independent Scientific Committee on Drugs evaluated 20 substances across 16 physical, psychological, and social harm criteria in The Lancet, Alcohol ranked #1 most harmful overall (72), ahead of Heroin (55) and Crack (54)."
    for l in wrap_text(copy_r, get_sans(17), rx1 - rx0 - 56, draw):
        draw.text((rx0 + 28, ty), l, fill=C_SLATE300, font=get_sans(17))
        ty += 25
    ty += 16
    copy_r2 = "Psilocybin (6) and Cannabis (20) sit near the bottom, yet carry felony prison terms. The line between legal medicine and criminal contraband was drawn by corporate lobbying and excise tax revenue, not toxicology."
    for l in wrap_text(copy_r2, get_sans(17, bold=True), rx1 - rx0 - 56, draw):
        draw.text((rx0 + 28, ty), l, fill=C_OFFWHITE, font=get_sans(17, bold=True))
        ty += 25

    out_path = os.path.join(OUT_DIR, "03_lancet_harm_matrix.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered:", out_path)


# ==============================================================================
# CARD 04: THE 4 STRUCTURAL REALITIES (RAT PARK, HYDRANT, RECORD, PORTUGAL)
# ==============================================================================
def render_card_04():
    canvas = create_base_canvas()
    draw = ImageDraw.Draw(canvas)

    draw.text((70, 44), "FORENSIC EVIDENCE LEDGER • FOUR EMPIRICAL REALITIES", fill=C_GREEN, font=get_mono(14, bold=True))
    draw.text((70, 72), "ISOLATION, SYNTHETICS, AND THE PORTUGAL BLUEPRINT", fill=C_OFFWHITE, font=get_sans(38, bold=True))
    draw.text((1600 - 235, 68), "THREAD [ 4 / 5 ]", fill=C_GREEN, font=get_mono(15, bold=True))

    stages = [
        (
            "EXHIBIT 01",
            "Rat Park Reality",
            "-91%",
            "MORPHINE INTAKE IN COLONY",
            "Isolated rats overdosed on morphine. In a connected 200x colony, rats rejected the drugged water. Addiction is a symptom of an unlivable cage.",
            "public/issues/issue-03/rat-park.webp",
            C_GREEN,
        ),
        (
            "EXHIBIT 02",
            "Iron Law of Prohibition",
            "50x–500x",
            "SYNTHETIC POTENCY SURGE",
            "Clamping border supply with constant demand forces cartels to replace bulky leaves with flat envelopes of lethal fentanyl and nitazenes.",
            "public/issues/issue-03/supply-hydrant.webp",
            C_RED,
        ),
        (
            "EXHIBIT 03",
            "The Remedy as Weapon",
            "44,000+",
            "STATUTORY LOCKOUT BARRIERS",
            "A minor possession conviction locks citizens out of jobs, housing, and loans, manufacturing the exact poverty that drives despair.",
            "public/issues/issue-03/remedy-weapon.webp",
            C_YELLOW,
        ),
        (
            "EXHIBIT 04",
            "Portugal Law 30/2000",
            "-90% HIV",
            "6 PER 1M OVERDOSE DEATHS",
            "Portugal decriminalised personal possession and moved budgets from prisons to health panels, achieving Europe's lowest overdose mortality.",
            "public/issues/issue-03/civic-renewal.webp",
            C_GREEN,
        ),
    ]

    col_w = 345
    gap = 26
    start_x = 70
    start_y = 142
    col_h = 645

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

        ty = cy0 + img_h + 18
        draw.text((cx0 + 20, ty), phase, fill=accent, font=get_mono(13, bold=True))
        ty += 24

        draw.text((cx0 + 20, ty), name, fill=C_OFFWHITE, font=get_sans(25, bold=True))
        ty += 38

        draw.rectangle([(cx0 + 16, ty), (cx1 - 16, ty + 72)], fill=C_INNER_BOX, outline=C_BORDER, width=1)
        draw.text((cx0 + 26, ty + 10), stat, fill=accent, font=get_sans(29, bold=True))
        draw.text((cx0 + 26, ty + 46), stat_lbl, fill=C_MUTED, font=get_mono(11, bold=True))
        ty += 88

        for l in wrap_text(copy, get_sans(15), col_w - 40, draw):
            draw.text((cx0 + 20, ty), l, fill=C_OFFWHITE, font=get_sans(15))
            ty += 22

    draw.rectangle([(70, 805), (1530, 862)], fill=C_INNER_BOX, outline=C_BORDER, width=1)
    draw.text((95, 824), "PRAGMATIC GOVERNANCE: Decriminalise personal use, regulate the supply chain, and treat trauma instead of caging citizens.", fill=C_GREEN, font=get_sans(18, bold=True))

    out_path = os.path.join(OUT_DIR, "04_evidence_and_rat_park.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered:", out_path)


# ==============================================================================
# CARD 05: THE MIRROR (WHO WAS REALLY WINNING ALL ALONG?)
# ==============================================================================
def render_card_05():
    canvas = create_base_canvas()

    mirror = Image.open("public/issues/issue-03/the-mirror.webp").convert("RGBA")
    m_w, m_h = mirror.size
    m_scaled = mirror.resize((1600, int(m_h * (1600 / m_w))), Image.Resampling.LANCZOS)

    overlay = Image.new("RGBA", (1600, 900), (10, 11, 14, 210))
    canvas.alpha_composite(m_scaled, (0, -50))
    canvas.alpha_composite(overlay, (0, 0))

    draw = ImageDraw.Draw(canvas)

    cx0, cy0 = 130, 75
    cx1, cy1 = 1470, 825
    panel_w = cx1 - cx0
    panel_h = cy1 - cy0

    panel = Image.new("RGBA", (panel_w, panel_h), C_PANEL_BG)
    canvas.alpha_composite(panel, (cx0, cy0))
    draw.rectangle([(cx0, cy0), (cx1, cy1)], outline=C_BORDER, width=2)
    draw_corner_brackets(draw, cx0, cy0, cx1, cy1, size=32, stroke=4, accent_color=C_YELLOW)

    cur_y = cy0 + 40
    draw.text((cx0 + 55, cur_y), "OBSERVATIONS BY MOTH1 • THE MIRROR VERDICT", fill=C_YELLOW, font=get_mono(14, bold=True))
    draw.text((cx1 - 220, cur_y), "THREAD [ 5 / 5 ]", fill=C_YELLOW, font=get_mono(15, bold=True))
    cur_y += 38

    draw.text((cx0 + 55, cur_y), "If the War on Drugs has failed every public health metric for 50 years, why does it continue?", fill=C_YELLOW, font=get_sans(23, bold=True))
    cur_y += 42

    # 3 Winner Columns
    winners = [
        ("1. THE CARTELS", "$650B+ TAX-FREE MONOPOLY", "Prohibition guarantees a 10,000% risk-premium markup with zero state regulation.", C_YELLOW),
        ("2. SECURITY APPARATUS", "$100B+ ANNUAL BUDGETS", "Perpetual budgets, military hardware, asset forfeiture, and private prison quotas.", C_RED),
        ("3. POLITICAL CLASS", "MORAL PANIC THEATRE", "A convenient scapegoat to distract voters from housing, wage, and healthcare decay.", C_GREEN),
    ]
    w_col = (panel_w - 110 - 40) // 3
    for i, (actor, stat, desc, col) in enumerate(winners):
        wx0 = cx0 + 55 + i * (w_col + 20)
        wx1 = wx0 + w_col
        draw.rectangle([(wx0, cur_y), (wx1, cur_y + 150)], fill=C_INNER_BOX, outline=col, width=1)
        draw.text((wx0 + 20, cur_y + 16), stat, fill=col, font=get_mono(13, bold=True))
        draw.text((wx0 + 20, cur_y + 42), actor, fill=C_OFFWHITE, font=get_sans(20, bold=True))
        wy = cur_y + 74
        for l in wrap_text(desc, get_sans(14), w_col - 40, draw):
            draw.text((wx0 + 20, wy), l, fill=C_SLATE300, font=get_sans(14))
            wy += 20
    cur_y += 174

    thesis = "The only people who lose are the working-class families torn apart by mandatory minimums, the addicts dying of poisoned street supply in isolated rooms, and the taxpayers funding their own surveillance."
    for l in wrap_text(thesis, get_sans(22), panel_w - 110, draw):
        draw.text((cx0 + 55, cur_y), l, fill=C_OFFWHITE, font=get_sans(22))
        cur_y += 32
    cur_y += 16

    # Punchline Box
    box_x0, box_y0 = cx0 + 55, cur_y
    box_x1, box_y1 = cx1 - 55, cur_y + 78
    draw.rectangle([(box_x0, box_y0), (box_x1, box_y1)], fill=(20, 18, 8, 255), outline=C_YELLOW, width=2)
    punch_txt = "“The War on Drugs is not broken. It is working exactly as intended, for the people who built it.”"
    f_punch = get_sans(23, bold=True)
    bb = draw.textbbox((0, 0), punch_txt, font=f_punch)
    draw.text((box_x0 + ((box_x1 - box_x0) - (bb[2] - bb[0])) // 2, box_y0 + 24), punch_txt, fill=C_YELLOW, font=f_punch)
    cur_y = box_y1 + 24

    draw.line([(cx0 + 55, cur_y), (cx1 - 55, cur_y)], fill=(241, 245, 249, 40), width=1)
    cur_y += 20

    draw_seal(canvas, cx0 + 55, cur_y, size=58, text="MOTH1")
    draw.text((cx0 + 130, cur_y + 4), "EXPLORE THE FULL INTERACTIVE DOSSIER & SIMULATORS:", fill=C_MUTED, font=get_mono(12, bold=True))
    draw.text((cx0 + 130, cur_y + 26), "observations.moth1.xyz/war-on-drugs", fill=C_OFFWHITE, font=get_sans(25, bold=True))

    btn_x0, btn_y0 = cx1 - 320, cur_y + 2
    btn_x1, btn_y1 = cx1 - 55, cur_y + 56
    draw.rectangle([(btn_x0, btn_y0), (btn_x1, btn_y1)], fill=C_YELLOW, outline=C_OFFWHITE, width=2)
    btn_font = get_sans(18, bold=True)
    bb_btn = draw.textbbox((0, 0), "ENTER DOSSIER  ➔", font=btn_font)
    draw.text((btn_x0 + ((btn_x1 - btn_x0) - (bb_btn[2] - bb_btn[0])) // 2, btn_y0 + 16), "ENTER DOSSIER  ➔", fill=C_OBSIDIAN, font=btn_font)

    out_path = os.path.join(OUT_DIR, "05_the_mirror_verdict.png")
    canvas.save(out_path, "PNG", quality=100)
    print("Rendered:", out_path)


# ==============================================================================
# SUBSTACK ANIMATED BANNER (3:1, 960x320, < 2MB) & HEADER (16:9, 800x450, < 2MB)
# ==============================================================================
def render_substack_gifs():
    import math
    src_webp = Image.open("public/issues/issue-03/hero-dossier.webp")
    src_webp.seek(0)
    base_rgb = src_webp.convert("RGB")
    w, h = base_rgb.size
    target_h = w // 3
    top = max(0, (h - target_h) // 2)
    base_banner = base_rgb.crop((0, top, w, top + target_h)).resize((960, 320), Image.Resampling.LANCZOS)

    # 1. Copy 16:9 header GIF into dist-packages/issue-03-war-on-drugs/substack/
    header_src = "public/issues/issue-03/substack-header-16x9.gif"
    header_dst = os.path.join(SUBSTACK_DIR, "substack-header-16x9.gif")
    if os.path.exists(header_src):
        with open(header_src, "rb") as fsrc, open(header_dst, "wb") as fdst:
            fdst.write(fsrc.read())
        print("Copied Substack 16:9 Header GIF:", header_dst, f"({os.path.getsize(header_dst)/1024:.1f} KB)")

    # 2. Generate 3:1 Substack Banner GIF (960x320, < 2MB) using static base + animated surveillance reticle
    frames_rgb = []
    for idx in range(24):
        frame = base_banner.copy()
        draw = ImageDraw.Draw(frame)
        angle = (idx / 24.0) * 2.0 * math.pi
        rx = int(480 + math.sin(angle) * 140)
        ry = int(160 + math.cos(angle * 2) * 36)
        # Forensic crosshair reticle & scan bar
        draw.ellipse([(rx - 28, ry - 28), (rx + 28, ry + 28)], outline=(234, 179, 8), width=2)
        draw.line([(rx - 42, ry), (rx - 14, ry)], fill=(234, 179, 8), width=2)
        draw.line([(rx + 14, ry), (rx + 42, ry)], fill=(234, 179, 8), width=2)
        draw.line([(rx, ry - 42), (rx, ry - 14)], fill=(234, 179, 8), width=2)
        draw.line([(rx, ry + 14), (rx, ry + 42)], fill=(234, 179, 8), width=2)
        draw.rectangle([(rx - 3, ry - 3), (rx + 3, ry + 3)], outline=(239, 68, 68), width=2)
        scan_y = int((idx / 24.0) * 318)
        draw.line([(0, scan_y), (960, scan_y)], fill=(34, 197, 94), width=1)
        frames_rgb.append(frame)

    master_palette = frames_rgb[0].quantize(colors=256, dither=Image.Dither.NONE)
    quantized_frames = [f.quantize(palette=master_palette, dither=Image.Dither.NONE) for f in frames_rgb]

    banner_public = "public/issues/issue-03/substack-banner-3x1.gif"
    banner_pkg = os.path.join(SUBSTACK_DIR, "substack-banner-3x1.gif")
    for p in [banner_public, banner_pkg]:
        quantized_frames[0].save(
            p,
            save_all=True,
            append_images=quantized_frames[1:],
            duration=65,
            loop=0,
            optimize=True,
        )
    print("Rendered Substack 3:1 Banner GIF:", banner_pkg, f"({os.path.getsize(banner_pkg)/1024:.1f} KB)")


if __name__ == "__main__":
    print("Generating Issue 03 X Retina Cards & Substack GIFs...")
    render_card_01()
    render_card_02()
    render_card_03()
    render_card_04()
    render_card_05()
    render_substack_gifs()
    print("Done!")
