#!/usr/bin/env python3
"""
YouTube Data API v3 — One-Time OAuth2 Authorizer
Reads `.secrets/google_client_secrets.json`, provides the Google OAuth consent URL,
captures the authorization code via local web server (or terminal paste fallback),
and saves the persistent refresh token to `.secrets/youtube_token.json`.
"""

import os
import sys
import json
import urllib.parse
import http.server
import socketserver
import threading
import requests

SECRETS_FILE = ".secrets/google_client_secrets.json"
TOKEN_FILE = ".secrets/youtube_token.json"
PORT = 8080
REDIRECT_URI = f"http://localhost:{PORT}/"

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.force-ssl"
]

def load_client_secrets():
    if not os.path.exists(SECRETS_FILE):
        print(f"❌ Error: Secrets file not found at '{SECRETS_FILE}'")
        sys.exit(1)
    with open(SECRETS_FILE, "r") as f:
        data = json.load(f)
    client_type = "installed" if "installed" in data else ("web" if "web" in data else list(data.keys())[0])
    client_info = data[client_type]
    return client_info["client_id"], client_info["client_secret"], client_info.get("auth_uri", "https://accounts.google.com/o/oauth2/auth"), client_info.get("token_uri", "https://oauth2.googleapis.com/token")

def main():
    client_id, client_secret, auth_uri, token_uri = load_client_secrets()
    
    # Check if already authenticated
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, "r") as f:
            tok = json.load(f)
        if tok.get("refresh_token"):
            print("✅ YouTube is already authenticated!")
            print(f"Token cached at: {TOKEN_FILE}")
            print(f"Channel Refresh Token present: {tok['refresh_token'][:10]}...")
            return

    auth_params = {
        "client_id": client_id,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": " ".join(SCOPES),
        "access_type": "offline",
        "prompt": "consent",
    }
    
    auth_url = f"{auth_uri}?{urllib.parse.urlencode(auth_params)}"
    
    print("\n" + "=" * 70)
    print("YOUTUBE DATA API (v3) — ONE-TIME AUTHORIZATION")
    print("=" * 70)
    print("\nPlease open this link in your browser:")
    print("\n👉 " + auth_url + "\n")
    print("Sign in with the Google Account that manages @ObservationsByMoth1 and grant permissions.")
    print(f"Waiting for local redirect on {REDIRECT_URI} ...\n")
    
    code = None
    
    class OAuthHandler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            nonlocal code
            parsed = urllib.parse.urlparse(self.path)
            query = urllib.parse.parse_qs(parsed.query)
            if "code" in query:
                code = query["code"][0]
                self.send_response(200)
                self.send_header("Content-Type", "text/html")
                self.end_headers()
                self.wfile.write(b"""
                    <html>
                    <body style="font-family: -apple-system, sans-serif; background: #0c0d10; color: #e6e4dd; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
                        <div style="border: 2px solid #86efac; padding: 40px; border-radius: 8px; text-align: center; max-width: 500px; background: #121419;">
                            <h1 style="color: #86efac; margin-top: 0;">&#10004; Connected to YouTube</h1>
                            <p style="font-size: 17px; line-height: 1.5;">Observations by Moth1 is now authorized.</p>
                            <p style="color: #a5a8a5; font-size: 14px;">You can close this window and return to your terminal / agent.</p>
                        </div>
                    </body>
                    </html>
                """)
            else:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b"No code received.")
        def log_message(self, format, *args):
            return

    try:
        with socketserver.TCPServer(("", PORT), OAuthHandler) as httpd:
            httpd.handle_request()
    except Exception as e:
        print(f"(Local server notice: {e})")
        
    if not code:
        print("Could not capture code via local server.")
        try:
            code = input("If your browser opened a page showing 'localhost refused to connect' with '?code=...' in the address bar, paste that full URL or code here: ").strip()
            if "code=" in code:
                code = urllib.parse.parse_qs(urllib.parse.urlparse(code).query).get("code", [code])[0]
        except:
            sys.exit(1)
        
    if not code:
        print("❌ No code provided.")
        sys.exit(1)
        
    print("\nAuthorization code received! Exchanging for persistent refresh token...")
    
    token_payload = {
        "code": code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    
    res = requests.post(token_uri, data=token_payload, timeout=15)
    if res.status_code != 200:
        print(f"❌ Failed to exchange token: {res.text}")
        sys.exit(1)
        
    tokens = res.json()
    saved_data = {
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": tokens.get("refresh_token"),
        "token_uri": token_uri,
        "scope": tokens.get("scope"),
    }
    
    with open(TOKEN_FILE, "w") as f:
        json.dump(saved_data, f, indent=2)
        
    print(f"\n✅ SUCCESS! Persistent refresh token saved to {TOKEN_FILE}")
    print("Observations by Moth1 can now upload YouTube Shorts automatically via API!")

if __name__ == "__main__":
    main()
