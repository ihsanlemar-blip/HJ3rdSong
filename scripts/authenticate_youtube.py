#!/usr/bin/env python3
import os
import sys
import json
import argparse
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/youtube.upload']
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
WORKSPACE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLIENT_SECRETS_FILE = os.path.join(WORKSPACE_DIR, 'client_secret.json')
TOKEN_FILE = os.path.join(WORKSPACE_DIR, 'token.json')
STATE_FILE = os.path.join(WORKSPACE_DIR, '.oauth_pending_state.json')

def start_auth():
    if not os.path.exists(CLIENT_SECRETS_FILE):
        print(f"Error: {CLIENT_SECRETS_FILE} not found!")
        sys.exit(1)

    flow = InstalledAppFlow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        redirect_uri="http://localhost:8080/"
    )
    auth_url, state = flow.authorization_url(prompt='consent', access_type='offline')

    # Save state and code_verifier so token exchange works seamlessly
    with open(STATE_FILE, 'w') as f:
        json.dump({
            "state": state,
            "code_verifier": flow.code_verifier
        }, f)

    print("\n" + "="*75)
    print("STEP 1: Open this URL in your browser to sign in to your YouTube channel:")
    print("="*75)
    print(f"\n{auth_url}\n")
    print("="*75)
    print("STEP 2: After signing in and clicking 'Continue' / 'Allow', your browser")
    print("        will redirect to a URL starting with http://localhost:8080/...")
    print("="*75)
    print("STEP 3: Simply COPY that entire redirected URL from your browser address bar")
    print("        and run:")
    print("        python3 scripts/authenticate_youtube.py --response \"<PASTE_URL_HERE>\"")
    print("="*75 + "\n")

def finish_auth(response_url_or_code):
    if not os.path.exists(STATE_FILE):
        print(f"Error: {STATE_FILE} not found. Please run with --start first.")
        sys.exit(1)

    with open(STATE_FILE, 'r') as f:
        saved = json.load(f)

    flow = InstalledAppFlow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        redirect_uri="http://localhost:8080/",
        state=saved.get("state")
    )
    flow.code_verifier = saved.get("code_verifier")

    val = response_url_or_code.strip()
    if val.startswith("http://") or val.startswith("https://"):
        flow.fetch_token(authorization_response=val)
    else:
        # User pasted just the code
        flow.fetch_token(code=val)

    creds = flow.credentials
    with open(TOKEN_FILE, 'w') as f:
        f.write(creds.to_json())

    if os.path.exists(STATE_FILE):
        os.remove(STATE_FILE)

    print("\n" + "="*60)
    print("[✓] AUTHENTICATION SUCCESSFUL!")
    print(f"[✓] Token saved to: {TOKEN_FILE}")

    # Verify channel name
    try:
        service = build('youtube', 'v3', credentials=creds)
        channels = service.channels().list(part="snippet", mine=True).execute()
        for item in channels.get("items", []):
            print(f"[✓] Connected to YouTube Channel: '{item['snippet']['title']}'")
    except Exception as e:
        print(f"[!] Note: Could not fetch channel name: {e}")

    print("="*60 + "\n")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Authenticate YouTube OAuth 2.0")
    parser.add_argument("--start", action="store_true", help="Generate authorization URL")
    parser.add_argument("--response", type=str, help="Paste redirected URL or code")
    args = parser.parse_args()

    if args.response:
        finish_auth(args.response)
    else:
        start_auth()
