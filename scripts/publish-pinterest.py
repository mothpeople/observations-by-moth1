#!/usr/bin/env python3
"""
Automated Pinterest Pin Publisher for Observations by Moth1
Uploads 1000x1500 retina PNG pins via Pinterest Marketing API v5
with SEO title, description, and UTM destination link.

Usage:
  python3 scripts/publish-pinterest.py --issue 01
  python3 scripts/publish-pinterest.py --issue 02
  python3 scripts/publish-pinterest.py --issue 02 --board-id <board_id>
"""

import os
import sys
import json
import base64
import argparse
import requests

ENV_FILE = ".env.local"

ISSUE_MAP = {
    "01": {
        "slug": "watering-grass-in-a-thunderstorm",
        "dir": "dist-packages/issue-01-watering-grass/pinterest",
        "pins": [
            {
                "file": "dist-packages/issue-01-watering-grass/pinterest/pins/01_infographic_plate.png",
                "title": "The Geriatric Disconnect: Median Home Prices vs Youth Wages (11.4x Ratio) | Observations by Moth1",
                "description": (
                    "In 1980, the median home price to youth wage ratio was 3.2x. Today it sits at 11.4x, requiring two generational inheritances. "
                    "Meanwhile, real purchasing power dropped -38% as geriatrics with guaranteed mobility lecture locked-out youth on work ethic. "
                    "Young people are entering a world that effectively locked the door and pulled down the shutters before they could even get a foot in. "
                    "Read the full scrollytelling essay with interactive wage and housing ledgers at Observations by Moth1."
                ),
                "alt_text": "Data infographic plate detailing the geriatric disconnect, featuring 11.4x home price ratio, -38% real wage drop, 70+ year average leader age.",
                "link": "https://observations.moth1.xyz/watering-grass-in-a-thunderstorm?utm_source=pinterest&utm_medium=pin&utm_campaign=issue-01&utm_content=geriatric-disconnect"
            },
            {
                "file": "dist-packages/issue-01-watering-grass/pinterest/pins/02_thesis_quote_plate.png",
                "title": "The 4-Stage Protest Loop: Why Civil Unrest Escalates and Nothing Gets Solved | Observations by Moth1",
                "description": (
                    "Why do protests explode, why do governments swing harder, and why does nothing get solved? "
                    "Explore the 4-stage civil escalation engine: 01 The Catalyst (1,000 peaceful youth), 02 The Overreaction (tactical riot force arrives), "
                    "03 The Escalation (500,000 strike nationwide), and 04 The Void (rot bubbles under floorboards). "
                    "When law enforcement thinks de-escalation means swinging harder, societies don't get stability. They fracture."
                ),
                "alt_text": "Four-stage visual breakdown of civil protest escalation from catalyst to tactical overreaction, nationwide strike, and the resulting void.",
                "link": "https://observations.moth1.xyz/watering-grass-in-a-thunderstorm?utm_source=pinterest&utm_medium=pin&utm_campaign=issue-01&utm_content=protest-loop"
            },
            {
                "file": "dist-packages/issue-01-watering-grass/pinterest/pins/03_interactive_mockup_plate.png",
                "title": "Why People Protest: The Illusion of Governance and Moral Agency | Observations by Moth1",
                "description": (
                    "“As simple as it sounds, people generally don't take to the streets to protest if their governments were actually doing their jobs. "
                    "What the world actually needs is a fresh roster of leaders, and a governance model that gives more weight to the people who will live long enough to deal with the fallout. "
                    "Everything else is, and should be treated as, a scam.” Read the interactive visual essay with 24-frame sumi-e animation at observations.moth1.xyz."
                ),
                "alt_text": "Dramatic storm artwork with high-contrast editorial typography and quote: People don't take to the streets if governments were doing their jobs.",
                "link": "https://observations.moth1.xyz/watering-grass-in-a-thunderstorm?utm_source=pinterest&utm_medium=pin&utm_campaign=issue-01&utm_content=thesis-anchor"
            }
        ]
    },
    "02": {
        "slug": "the-meat-grinder-needs-more-meat",
        "dir": "dist-packages/issue-02-the-meat-grinder/pinterest",
        "pins": [
            {
                "file": "dist-packages/issue-02-the-meat-grinder/pinterest/pins/01_infographic_plate.png",
                "title": "The Demographic Black Hole: Why Birth Rates Collapsed (0.72 - 0.97 TFR) | Observations by Moth1",
                "description": (
                    "Why fertility rates are collapsing globally: when Family Support, Affordable Housing, and Financial Mobility drift apart, "
                    "society falls into the 0.72–0.97 TFR black hole. Cash bonuses cannot fix hyper-financialised housing, 300 million jobs exposed to AI, "
                    "and a 1.73x ecological biocapacity overdraft. Explore the interactive demographic wireframe at Observations by Moth1."
                ),
                "alt_text": "Three-circle glowing wireframe Venn diagram illustration showing Family Support, Social Policies, and Financial Mobility collapsing into a central demographic black hole.",
                "link": "https://observations.moth1.xyz/the-meat-grinder?utm_source=pinterest&utm_medium=pin&utm_campaign=issue-02&utm_content=venn-infographic"
            },
            {
                "file": "dist-packages/issue-02-the-meat-grinder/pinterest/pins/02_thesis_quote_plate.png",
                "title": "Declining Birth Rates Are Society’s Immune Response, Not a Crisis | Observations by Moth1",
                "description": (
                    "“People will have kids when they genuinely feel the future is brighter than the past. In an unaffordable world, "
                    "an unstable climate, and an automated job landscape run by billionaires who hoard the ladder, having less people is not a crisis. "
                    "It is a biological correction. Everything else is just noise from people who need more cogs in their machine.”"
                ),
                "alt_text": "Atmospheric twilight earth artwork with cyber-zen mint accents and bold quote: Having less people is not a crisis, it is a biological correction.",
                "link": "https://observations.moth1.xyz/the-meat-grinder?utm_source=pinterest&utm_medium=pin&utm_campaign=issue-02&utm_content=biological-correction-quote"
            },
            {
                "file": "dist-packages/issue-02-the-meat-grinder/pinterest/pins/03_interactive_mockup_plate.png",
                "title": "Three Taboo Solutions to the Global Fertility Crisis | Observations by Moth1",
                "description": (
                    "What governments refuse to talk about while crying over fertility charts: "
                    "01 Redefine the Family Unit (62% modern non-traditional households need full legal parity), "
                    "02 Dignity in Aging & Euthanasia (74% support end-of-life autonomy to relieve the sandwich generation), "
                    "and 03 Kill the Infinite Growth Fetish (1.73x planetary overshoot). You cannot prioritize perpetual GDP expansion and expect healthy families."
                ),
                "alt_text": "Three-panel infographic illustrating the 3 taboo counter-proposals to falling birth rates: redefine family, normalise dignity in aging, and kill infinite growth.",
                "link": "https://observations.moth1.xyz/the-meat-grinder?utm_source=pinterest&utm_medium=pin&utm_campaign=issue-02&utm_content=taboo-counter-proposals"
            }
        ]
    }
}

def load_env():
    env = {}
    if os.path.exists(ENV_FILE):
        with open(ENV_FILE, "r") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                parts = line.split("=", 1)
                if len(parts) == 2:
                    env[parts[0].strip()] = parts[1].strip().strip("\"'")
    return env

def get_or_select_board(token, override_board_id=None):
    if override_board_id:
        return override_board_id
    env = load_env()
    if env.get("PINTEREST_BOARD_ID"):
        return env["PINTEREST_BOARD_ID"]
        
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    r = requests.get("https://api.pinterest.com/v5/boards", headers=headers, timeout=10)
    if r.status_code == 200:
        items = r.json().get("items", [])
        if not items:
            print("ℹ️ No boards found on your Pinterest account. Creating board 'Observations by Moth1'...")
            create_payload = {
                "name": "Observations by Moth1",
                "description": "Visual essays, demographic wireframes, and civil analysis by Observations by Moth1.",
                "privacy": "PUBLIC"
            }
            create_res = requests.post("https://api.pinterest.com/v5/boards", headers=headers, json=create_payload, timeout=10)
            if create_res.status_code in (200, 201):
                new_board = create_res.json()
                print(f"✅ Created board: {new_board.get('name')} (ID: {new_board.get('id')})")
                return new_board.get("id")
            else:
                print(f"❌ Failed to create board: {create_res.status_code} - {create_res.text}")
                print("Please create a board manually on Pinterest at https://www.pinterest.com/moth1siv/")
                sys.exit(1)
        print("\nAvailable Pinterest Boards:")
        for idx, b in enumerate(items):
            print(f"  [{idx + 1}] {b['name']} (ID: {b['id']})")
        choice = input("\nEnter board number to publish to [1]: ").strip() or "1"
        return items[int(choice) - 1]["id"]
    else:
        print(f"❌ Failed to fetch boards: {r.status_code} - {r.text}")
        sys.exit(1)

def publish_pin(token, board_id, pin_info):
    img_path = pin_info["file"]
    if not os.path.exists(img_path):
        print(f"❌ File not found: {img_path}")
        return False
        
    with open(img_path, "rb") as f:
        img_b64 = base64.b64encode(f.read()).decode("utf-8")
        
    payload = {
        "board_id": board_id,
        "title": pin_info["title"][:100],
        "description": pin_info["description"][:500],
        "alt_text": pin_info["alt_text"][:500],
        "link": pin_info["link"],
        "media_source": {
            "source_type": "image_base64",
            "content_type": "image/png",
            "data": img_b64
        }
    }
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    res = requests.post("https://api.pinterest.com/v5/pins", headers=headers, json=payload, timeout=20)
    if res.status_code in (200, 201):
        pin_data = res.json()
        print(f"✅ Published: {pin_info['title'][:50]}... -> https://pinterest.com/pin/{pin_data.get('id')}")
        return True
    else:
        print(f"❌ Error publishing pin: {res.status_code} - {res.text}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Publish Pinterest Pins for Observations by Moth1")
    parser.add_argument("--issue", required=True, choices=["01", "02", "1", "2"], help="Issue number (01 or 02)")
    parser.add_argument("--board-id", help="Pinterest Board ID (optional, defaults to .env.local or interactive select)")
    
    args = parser.parse_args()
    issue_key = args.issue.zfill(2)
    
    env = load_env()
    token = env.get("PINTEREST_ACCESS_TOKEN")
    if not token:
        print("❌ PINTEREST_ACCESS_TOKEN is missing in .env.local")
        sys.exit(1)
        
    board_id = get_or_select_board(token, args.board_id)
    pins = ISSUE_MAP[issue_key]["pins"]
    
    print(f"\nPublishing {len(pins)} Pins for Issue #{issue_key} to Board ID {board_id}...")
    for p in pins:
        publish_pin(token, board_id, p)

if __name__ == "__main__":
    main()
