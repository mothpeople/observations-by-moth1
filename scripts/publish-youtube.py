#!/usr/bin/env python3
"""
Automated YouTube Shorts Publisher for Observations by Moth1
Publishes 9:16 Shorts with title, description, tags, privacy status,
and automatically posts the gateway pinned comment with UTM tracking.

Usage:
  python3 scripts/publish-youtube.py --issue 01
  python3 scripts/publish-youtube.py --issue 02 --privacy unlisted
  python3 scripts/publish-youtube.py --issue 02 --privacy public
"""

import os
import sys
import json
import argparse
import requests

TOKEN_FILE = ".secrets/youtube_token.json"
PLAYLIST_ID = "PLXNcetLtk5xU" # Observations by Moth1 playlist

ISSUE_MAP = {
    "01": {
        "slug": "watering-grass-in-a-thunderstorm",
        "dir": "dist-packages/issue-01-watering-grass/youtube",
        "video": "dist-packages/issue-01-watering-grass/youtube/video/watering-grass-in-a-thunderstorm-shorts-1080x1920.mp4",
        "title": "Issue 01: Watering Grass in a Thunderstorm",
        "tags": [
            "climate change", "sustainability", "carbon footprint myth", "paper straws",
            "systemic emissions", "IPCC", "global warming", "philosophy", "visual essay",
            "scrollytelling", "sumi-e animation", "observations by moth1", "corporate accountability"
        ],
        "description": (
            "What happens when the youth of today get their futures blocked by geriatric politicians and massive wealth extraction from their cohort?\n\n"
            "When the 1.5°C threshold is missed, power structures don't face accountability. Instead, they turn systemic collapse into an individual guilt audit. "
            "Vacuuming the rug while the house is burning is not a virtue. It is a psychological defense mechanism against confronting real power.\n\n"
            "Experience the full interactive visual essay here:\n"
            "https://observations.moth1.xyz/watering-grass-in-a-thunderstorm?utm_source=youtube&utm_medium=shorts&utm_campaign=issue-01\n\n"
            "Subscribe to Observations by Moth1 on Substack for monthly long-form visual essays:\n"
            "https://observationsbymoth1.substack.com/\n\n"
            "#ClimateChange #Sustainability #Philosophy #Economics #SystemicThinking #ObservationsByMoth1 #Shorts #Animation #Art"
        ),
        "pinned_comment": (
            "“We are rearranging deck chairs while congratulating ourselves on the aesthetic precision of our seat cushion placement.”\n\n"
            "Read the complete interactive scrollytelling essay with live audio & animated sumi-e loops:\n"
            "👉 https://observations.moth1.xyz/watering-grass-in-a-thunderstorm?utm_source=youtube&utm_medium=shorts_comment&utm_campaign=issue-01"
        )
    },
    "02": {
        "slug": "the-meat-grinder-needs-more-meat",
        "dir": "dist-packages/issue-02-the-meat-grinder/youtube",
        "video": "dist-packages/issue-02-the-meat-grinder/youtube/video/the-meat-grinder-needs-more-meat-shorts-1080x1920.mp4",
        "title": "Issue 02: The Meat Grinder Needs More Meat",
        "tags": [
            "fertility rate", "demographic collapse", "birth rate crisis", "South Korea birth rate",
            "degrowth", "economics", "artificial intelligence", "biocapacity overshoot",
            "carrying capacity", "visual essay", "scrollytelling", "observations by moth1", "philosophy"
        ],
        "description": (
            "Listen to tech billionaires and politicians whine about falling birth rates, and they will tell you society became \"selfish.\"\n\n"
            "What they really mean is the meat grinder is running out of meat.\n\n"
            "They don’t care about the poetry of human life. They care about future taxpayers to fund debt deficits and warm bodies to keep consumer demand humming. "
            "Meanwhile, humanity already consumes 1.73 Earths of biocapacity every year, and 300 million jobs are exposed to AI.\n\n"
            "Having less people is not a crisis. It is a biological correction. The planet is tired of us, and declining birth rates are simply society’s immune response.\n\n"
            "👉 Experience the full interactive scrollytelling essay with real-time Venn diagram simulators:\n"
            "https://observations.moth1.xyz/the-meat-grinder?utm_source=youtube&utm_medium=shorts&utm_campaign=issue-02\n\n"
            "Subscribe on Substack for future deep-dive visual essays:\n"
            "https://observationsbymoth1.substack.com/\n\n"
            "#Demographics #FertilityCrisis #Economics #Degrowth #AI #Philosophy #ObservationsByMoth1 #Shorts #Animation #SumiE"
        ),
        "pinned_comment": (
            "“Having less people is not a crisis. It is a biological correction. The planet is tired of us, and declining birth rates are simply society's immune response.”\n\n"
            "Explore the full interactive essay with live demographic collapse simulators & empirical ledgers:\n"
            "👉 https://observations.moth1.xyz/the-meat-grinder?utm_source=youtube&utm_medium=shorts_comment&utm_campaign=issue-02"
        )
    }
}

def get_access_token():
    if not os.path.exists(TOKEN_FILE):
        print(f"❌ Error: Token file not found at '{TOKEN_FILE}'. Run auth-youtube.py first.")
        sys.exit(1)
        
    with open(TOKEN_FILE, "r") as f:
        tok = json.load(f)
        
    payload = {
        "client_id": tok["client_id"],
        "client_secret": tok["client_secret"],
        "refresh_token": tok["refresh_token"],
        "grant_type": "refresh_token"
    }
    
    res = requests.post(tok.get("token_uri", "https://oauth2.googleapis.com/token"), data=payload, timeout=10)
    if res.status_code != 200:
        print(f"❌ Failed to refresh YouTube access token: {res.text}")
        sys.exit(1)
        
    return res.json()["access_token"]

def upload_short(issue_key, privacy_status="public"):
    data = ISSUE_MAP.get(issue_key)
    if not data:
        print(f"❌ Invalid issue '{issue_key}'. Available: {list(ISSUE_MAP.keys())}")
        sys.exit(1)
        
    video_path = data["video"]
    if not os.path.exists(video_path):
        print(f"❌ Video file not found at: {video_path}")
        sys.exit(1)
        
    file_size = os.path.getsize(video_path)
    access_token = get_access_token()
    
    print("\n" + "=" * 70)
    print(f"PUBLISHING YOUTUBE SHORT: ISSUE #{issue_key} ({data['slug']})")
    print("=" * 70)
    print(f"Video File: {video_path} ({file_size / (1024*1024):.2f} MB)")
    print(f"Title: {data['title']}")
    print(f"Privacy: {privacy_status.upper()}")
    
    # 1. Initiate Resumable Upload Session
    metadata = {
        "snippet": {
            "title": data["title"],
            "description": data["description"],
            "tags": data["tags"],
            "categoryId": "27" # Education
        },
        "status": {
            "privacyStatus": privacy_status,
            "selfDeclaredMadeForKids": False
        }
    }
    
    init_headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": "video/mp4",
        "X-Upload-Content-Length": str(file_size)
    }
    
    init_url = "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status"
    init_res = requests.post(init_url, headers=init_headers, json=metadata, timeout=15)
    
    if init_res.status_code != 200:
        print(f"❌ Failed to initiate video upload: {init_res.status_code} - {init_res.text}")
        sys.exit(1)
        
    upload_url = init_res.headers.get("Location")
    if not upload_url:
        print("❌ Did not receive resumable upload location header.")
        sys.exit(1)
        
    print("\nInitiated resumable upload session. Uploading video bytes...")
    
    # 2. Upload Video Bytes
    with open(video_path, "rb") as vf:
        upload_headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "video/mp4",
            "Content-Length": str(file_size)
        }
        up_res = requests.put(upload_url, headers=upload_headers, data=vf, timeout=180)
        
    if up_res.status_code not in (200, 201):
        print(f"❌ Video upload failed: {up_res.status_code} - {up_res.text}")
        sys.exit(1)
        
    video_info = up_res.json()
    video_id = video_info.get("id")
    shorts_url = f"https://youtube.com/shorts/{video_id}"
    watch_url = f"https://www.youtube.com/watch?v={video_id}"
    
    print("\n" + "✨" * 30)
    print("✅ YOUTUBE SHORT UPLOADED SUCCESSFULLY!")
    print(f"Shorts URL: {shorts_url}")
    print(f"Watch URL:  {watch_url}")
    print("✨" * 30)
    
    # 3. Post & Pin Gateway Comment
    print("\nPosting gateway comment with UTM tracking...")
    comment_payload = {
        "snippet": {
            "videoId": video_id,
            "topLevelComment": {
                "snippet": {
                    "textOriginal": data["pinned_comment"]
                }
            }
        }
    }
    com_headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    com_res = requests.post(
        "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet",
        headers=com_headers,
        json=comment_payload,
        timeout=15
    )
    
    if com_res.status_code in (200, 201):
        print("✅ Gateway comment posted successfully under the video.")
    else:
        print(f"⚠️ Note on comment creation: {com_res.status_code} (video processing on YouTube may take 1-2 minutes).")
        
    # 4. Add Video to "Observations by Moth1" Playlist
    if PLAYLIST_ID:
        print(f"\nAdding video to playlist 'Observations by Moth1' ({PLAYLIST_ID})...")
        pl_payload = {
            "snippet": {
                "playlistId": PLAYLIST_ID,
                "resourceId": {
                    "kind": "youtube#video",
                    "videoId": video_id
                }
            }
        }
        pl_res = requests.post(
            "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet",
            headers=com_headers,
            json=pl_payload,
            timeout=15
        )
        if pl_res.status_code in (200, 201):
            print("✅ Successfully added video to 'Observations by Moth1' playlist!")
        else:
            print(f"⚠️ Note on playlist insertion: {pl_res.status_code} - {pl_res.text}")
        
    return video_id, shorts_url

def main():
    parser = argparse.ArgumentParser(description="Publish YouTube Shorts for Observations by Moth1")
    parser.add_argument("--issue", required=True, choices=["01", "02", "1", "2"], help="Issue number (01 or 02)")
    parser.add_argument("--privacy", default="public", choices=["public", "unlisted", "private"], help="Video privacy status (default: public)")
    
    args = parser.parse_args()
    issue_key = args.issue.zfill(2)
    upload_short(issue_key, args.privacy)

if __name__ == "__main__":
    main()
