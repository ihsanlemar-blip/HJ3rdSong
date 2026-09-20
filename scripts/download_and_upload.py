#!/usr/bin/env python3
import os
import sys
import json
import time
import subprocess
import argparse

WORKSPACE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if WORKSPACE_DIR not in sys.path:
    sys.path.insert(0, WORKSPACE_DIR)

from scripts.upload_to_youtube import upload_video

DEFAULT_RUN_ID = "35541113186"
ARTIFACT_NAME = "Hakim_Jan_Faryadi_Master"
OUT_DIR = os.path.join(WORKSPACE_DIR, "out")
VIDEO_FILE = os.path.join(OUT_DIR, "Hakim_Jan_Faryadi_Master.mp4")

def get_latest_run_id():
    try:
        res = subprocess.run(
            ["gh", "run", "list", "-L", "1", "--json", "databaseId"],
            capture_output=True,
            text=True,
            cwd=WORKSPACE_DIR
        )
        data = json.loads(res.stdout)
        if data and len(data) > 0:
            return str(data[0]["databaseId"])
    except Exception:
        pass
    return DEFAULT_RUN_ID

def check_run_status(run_id):
    result = subprocess.run(
        ["gh", "run", "view", run_id, "--json", "status,conclusion,startedAt,updatedAt"],
        capture_output=True,
        text=True,
        cwd=WORKSPACE_DIR
    )
    if result.returncode != 0:
        print(f"[!] Error querying GitHub run: {result.stderr}")
        return None, None
    try:
        data = json.loads(result.stdout)
        return data.get("status"), data.get("conclusion")
    except Exception as e:
        print(f"[!] JSON parsing error: {e}")
        return None, None

def download_video(run_id):
    os.makedirs(OUT_DIR, exist_ok=True)
    print(f"[*] Downloading artifact '{ARTIFACT_NAME}' from run {run_id} into '{OUT_DIR}'...")
    cmd = ["gh", "run", "download", run_id, "-n", ARTIFACT_NAME, "-D", OUT_DIR]
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=WORKSPACE_DIR)
    if result.returncode != 0:
        raise RuntimeError(f"Download failed: {result.stderr}")
    print(f"[✓] Artifact downloaded successfully!")

def main():
    parser = argparse.ArgumentParser(description="Download rendered video from GitHub Actions and upload to YouTube")
    parser.add_argument("--watch", action="store_true", help="Wait in a loop until render finishes, then upload")
    parser.add_argument("--run-id", default=None, help="Specific GitHub run ID (defaults to latest run)")
    parser.add_argument("--title", default="Hakim Jan - Faryadi (Master)", help="YouTube video title")
    parser.add_argument("--description", default="", help="YouTube description")
    parser.add_argument("--privacy", default="private", choices=["public", "unlisted", "private"], help="Privacy status (default: private draft)")
    args = parser.parse_args()

    run_id = args.run_id or get_latest_run_id()
    print(f"[*] Monitoring GitHub Actions Run ID: {run_id}")

    status, conclusion = check_run_status(run_id)
    print(f"[*] Current Run Status: {status} (Conclusion: {conclusion})")

    if status == "in_progress":
        if not args.watch:
            print("[*] Video is still rendering in GitHub Actions cloud runner.")
            print("    Run with --watch if you want this script to wait and upload automatically upon completion.")
            return
        else:
            print("[*] Watching render run until completion...")
            while status == "in_progress":
                time.sleep(30)
                status, conclusion = check_run_status(run_id)
                print(f"    ... still rendering (status: {status})")

    if conclusion != "success":
        print(f"[!] Run concluded with: {conclusion}. Please inspect with `gh run view {run_id}`")
        return

    # Download if not already present
    download_video(run_id)

    if not os.path.exists(VIDEO_FILE):
        # Look if it was downloaded directly in out
        candidates = [os.path.join(OUT_DIR, f) for f in os.listdir(OUT_DIR) if f.endswith(".mp4")]
        if candidates:
            target_file = candidates[0]
        else:
            raise FileNotFoundError(f"Could not find .mp4 in {OUT_DIR}")
    else:
        target_file = VIDEO_FILE

    print(f"[✓] Found video: {target_file}")
    upload_video(
        file_path=target_file,
        title=args.title,
        description=args.description,
        privacy_status=args.privacy
    )

if __name__ == '__main__':
    main()
