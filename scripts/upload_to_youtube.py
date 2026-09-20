#!/usr/bin/env python3
import os
import sys
import argparse
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError

SCOPES = ['https://www.googleapis.com/auth/youtube.upload']
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
WORKSPACE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLIENT_SECRETS_FILE = os.path.join(WORKSPACE_DIR, 'client_secret.json')
TOKEN_FILE = os.path.join(WORKSPACE_DIR, 'token.json')

def get_authenticated_service():
    creds = None
    if os.path.exists(TOKEN_FILE):
        try:
            creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
        except Exception as e:
            print(f"[!] Could not load existing token: {e}")
            creds = None

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("[*] Refreshing expired access token...")
            try:
                creds.refresh(Request())
            except Exception as e:
                print(f"[!] Token refresh failed: {e}. Re-authenticating...")
                creds = None

        if not creds:
            if not os.path.exists(CLIENT_SECRETS_FILE):
                raise FileNotFoundError(f"Client secret file not found at: {CLIENT_SECRETS_FILE}")

            print("\n[*] Initializing YouTube OAuth authorization...")
            redirect_uri = "http://localhost:8080/"
            flow = InstalledAppFlow.from_client_secrets_file(
                CLIENT_SECRETS_FILE,
                scopes=SCOPES,
                redirect_uri=redirect_uri
            )
            auth_url, _ = flow.authorization_url(prompt='consent', access_type='offline')

            print("\n" + "="*75)
            print("STEP 1: Open this URL in your browser to authorize your YouTube account:")
            print("="*75)
            print(f"\n{auth_url}\n")
            print("="*75)
            print("STEP 2: After logging in and approving permissions, Google will redirect to:")
            print("        http://localhost:8080/?code=...")
            print("="*75)

            auth_code = None
            code_event = threading.Event()

            class OAuthCallbackHandler(BaseHTTPRequestHandler):
                def do_GET(self):
                    nonlocal auth_code
                    query = urlparse(self.path).query
                    params = parse_qs(query)
                    if 'code' in params:
                        auth_code = params['code'][0]
                        self.send_response(200)
                        self.send_header("Content-Type", "text/html")
                        self.end_headers()
                        self.wfile.write(b"<html><body style='font-family:sans-serif;text-align:center;padding-top:50px;'><h2>Authentication successful!</h2><p>You can close this tab now.</p></body></html>")
                        code_event.set()
                    else:
                        self.send_response(400)
                        self.end_headers()
                        self.wfile.write(b"Authentication failed: no code parameter received.")
                def log_message(self, format, *args):
                    pass

            httpd = None
            try:
                httpd = HTTPServer(('0.0.0.0', 8080), OAuthCallbackHandler)
                server_thread = threading.Thread(target=httpd.handle_request, daemon=True)
                server_thread.start()
            except Exception as e:
                print(f"[*] Note: Local port listener notice: {e}")

            # Also allow manual input if redirect localhost doesn't reach codespace
            print("[*] Waiting for authorization... (Or paste the redirected URL/code below if prompted)")
            user_input = None
            try:
                # Wait up to 120 seconds or until callback received
                code_event.wait(timeout=5)
                if not auth_code:
                    print("If your browser says 'Cannot connect to localhost:8080', simply COPY the full URL from your browser address bar and paste it here:")
                    user_input = input("Paste URL or Code here (or press Enter if browser connected): ").strip()
            except EOFError:
                pass

            if user_input:
                if "code=" in user_input:
                    parsed = urlparse(user_input)
                    params = parse_qs(parsed.query)
                    auth_code = params.get('code', [user_input])[0]
                else:
                    auth_code = user_input

            if not auth_code and not code_event.is_set():
                print("[*] Still waiting for authentication callback...")
                code_event.wait(timeout=60)

            if not auth_code:
                raise RuntimeError("Failed to obtain authorization code.")

            flow.fetch_token(code=auth_code)
            creds = flow.credentials

            with open(TOKEN_FILE, 'w') as token_out:
                token_out.write(creds.to_json())
            print(f"\n[✓] Successfully authenticated! Token saved to: {TOKEN_FILE}")

    return build('youtube', 'v3', credentials=creds)

def upload_video(file_path, title="Hakim Jan (Draft)", description="", tags=None, category_id="10", privacy_status="private"):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Video file not found at: {file_path}")

    youtube = get_authenticated_service()

    body = {
        'snippet': {
            'title': title,
            'description': description,
            'tags': tags or [],
            'categoryId': category_id
        },
        'status': {
            'privacyStatus': privacy_status,
            'selfDeclaredMadeForKids': False
        }
    }

    file_size = os.path.getsize(file_path)
    print(f"\n[*] Starting direct upload to YouTube (DRAFT / PRIVATE):")
    print(f"    File:    {file_path} ({file_size / (1024*1024):.2f} MB)")
    print(f"    Title:   {title}")
    print(f"    Privacy: {privacy_status} (Not published - editable in YouTube Studio)")
    print("-" * 60)


    media = MediaFileUpload(
        file_path,
        chunksize=10 * 1024 * 1024, # 10MB chunks
        resumable=True,
        mimetype='video/mp4'
    )

    request = youtube.videos().insert(
        part=','.join(body.keys()),
        body=body,
        media_body=media
    )

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            progress = int(status.progress() * 100)
            print(f"    -> Upload progress: {progress}%")

    video_id = response.get('id')
    video_url = f"https://youtu.be/{video_id}"
    studio_url = f"https://studio.youtube.com/video/{video_id}/edit"

    print("\n" + "="*65)
    print(" [✓] VIDEO UPLOADED SUCCESSFULLY TO YOUTUBE!")
    print(f"     Watch URL:      {video_url}")
    print(f"     YouTube Studio: {studio_url}")
    print("="*65 + "\n")
    return video_id

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Upload video directly to YouTube")
    parser.add_argument("--file", help="Path to video file")
    parser.add_argument("--auth-only", action="store_true", help="Authenticate with YouTube and exit")
    parser.add_argument("--title", default="Hakim Jan (Draft)", help="Video title")
    parser.add_argument("--description", default="", help="Video description")
    parser.add_argument("--privacy", default="private", choices=["public", "unlisted", "private"], help="Privacy status (default: private)")
    parser.add_argument("--tags", nargs="*", default=[], help="Tags")
    args = parser.parse_args()


    if args.auth_only:
        print("[*] Running authentication test...")
        service = get_authenticated_service()
        channels = service.channels().list(part="snippet", mine=True).execute()
        for item in channels.get("items", []):
            print(f"[✓] Connected to YouTube Channel: {item['snippet']['title']}")
        sys.exit(0)

    if not args.file:
        print("Error: --file argument is required unless --auth-only is specified.")
        sys.exit(1)

    upload_video(
        file_path=args.file,
        title=args.title,
        description=args.description,
        tags=args.tags,
        privacy_status=args.privacy
    )
