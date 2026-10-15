# MarsScanner Backend (Python + FastAPI)

Fast, async, real-time subdomain & directory/file scanner API.

## Features
- 100,000+ generated subdomain wordlist (always scans the full list, no selection needed)
- 100,000+ generated directory/file wordlist (always scans the full list, no selection needed)
- Real DNS resolution + live HTTP status checks for subdomains
- Real HTTP probing for directories/files on the target site
- Streams results in real time over WebSockets (fast + responsive, no waiting for the whole scan)
- CORS enabled so any frontend (Vercel/Netlify/etc.) can call it

## Run locally

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API will be live at: http://localhost:8000
Interactive docs: http://localhost:8000/docs

## WebSocket protocol

Connect to `ws://<host>/ws/subdomains` or `ws://<host>/ws/directories`,
then send one JSON message to start:

```json
{ "domain": "example.com" }
```
(for directories you can send `{ "url": "https://example.com" }` instead)

You will receive a stream of JSON messages:

```json
{ "type": "started", "target": "example.com" }
{ "type": "found", "found_count": 1, "subdomain": "api.example.com", "url": "https://api.example.com", "ip": "1.2.3.4", "status": 200 }
{ "type": "complete", "found_count": 12, "stopped": false }
```

Send `{ "action": "stop" }` at any time to stop a running scan early.

## Deployment

See `setup.txt` in the project root for full, free deployment instructions.
