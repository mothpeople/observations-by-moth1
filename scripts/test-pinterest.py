#!/usr/bin/env python3
import os
import sys
import json
import requests

def load_env(env_path=".env.local"):
    env = {}
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                parts = line.split("=", 1)
                if len(parts) == 2:
                    k = parts[0].strip()
                    v = parts[1].strip().strip("\"'")
                    env[k] = v
    return env

def main():
    env = load_env()
    token = env.get("PINTEREST_ACCESS_TOKEN")
    if not token or token == "your_pinterest_access_token_here":
        print("Error: PINTEREST_ACCESS_TOKEN is missing or not set in .env.local")
        sys.exit(1)
        
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    print("Testing Pinterest Marketing API v5 connection...")
    
    # 1. User Profile Test
    try:
        r = requests.get("https://api.pinterest.com/v5/user_account", headers=headers, timeout=10)
        if r.status_code == 200:
            user_data = r.json()
            print("✅ Pinterest User Connected:")
            print(f"   Username: {user_data.get('username')}")
            print(f"   Account Type: {user_data.get('account_type')}")
        else:
            print(f"❌ User profile error {r.status_code}: {r.text}")
    except Exception as e:
        print(f"❌ Network / connection error: {e}")
        sys.exit(2)
        
    # 2. Boards List Test
    try:
        r_boards = requests.get("https://api.pinterest.com/v5/boards", headers=headers, timeout=10)
        if r_boards.status_code == 200:
            boards_data = r_boards.json()
            items = boards_data.get("items", [])
            print(f"\n✅ Found {len(items)} Pinterest Board(s):")
            for b in items:
                print(f"   • {b.get('name')} (ID: {b.get('id')}) — Privacy: {b.get('privacy')}")
            if not items:
                print("   (No boards found yet. You can create one on Pinterest or via API!)")
        else:
            print(f"❌ Boards list error {r_boards.status_code}: {r_boards.text}")
    except Exception as e:
        print(f"❌ Boards connection error: {e}")

if __name__ == "__main__":
    main()
