"""
MarsScanner API
================
FastAPI backend powering the MarsScanner web app.

Endpoints:
  GET  /                         -> health check / welcome message
  GET  /api/health               -> health check (for uptime monitors)
  WS   /ws/subdomains             -> stream subdomain scan results in real time
  WS   /ws/directories            -> stream directory/file scan results in real time

Run locally:
    uvicorn main:app --reload --host 0.0.0.0 --port 8000

See ../setup.txt in the project root for full deployment instructions
(Render / Railway / Fly.io / your own VPS).
"""

from __future__ import annotations

import asyncio
import logging

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from scanner import scan_subdomains, scan_directories, normalize_domain, normalize_base_url
from wordlists import wordlist_sizes

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("marsscanner")

app = FastAPI(
    title="MarsScanner API",
    description="Fast subdomain & directory enumeration API powering the MarsScanner web app.",
    version="1.0.0",
)

# Allow the frontend (hosted anywhere - Vercel/Netlify/etc.) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "service": "MarsScanner API",
        "status": "online",
        "docs": "/docs",
        "websockets": ["/ws/subdomains", "/ws/directories"],
    }


@app.get("/api/health")
async def health():
    # Note: wordlist sizes are intentionally NOT exposed on the frontend UI.
    # This endpoint is only for backend diagnostics / uptime checks.
    sizes = wordlist_sizes()
    return {"status": "ok", "engine_ready": sizes["subdomains"] > 0 and sizes["directories"] > 0}


async def _run_scan(websocket: WebSocket, kind: str):
    await websocket.accept()
    stop_event = asyncio.Event()
    found = 0

    async def watch_disconnect():
        """Watch for the client closing the connection or sending a 'stop' message."""
        try:
            while True:
                msg = await websocket.receive_json()
                if isinstance(msg, dict) and msg.get("action") == "stop":
                    stop_event.set()
                    break
        except Exception:
            stop_event.set()

    try:
        init_msg = await websocket.receive_json()
    except Exception:
        await websocket.close()
        return

    target_raw = (init_msg or {}).get("domain") or (init_msg or {}).get("url") or ""

    if kind == "subdomains":
        target = normalize_domain(target_raw)
    else:
        target = normalize_base_url(target_raw)

    if not target:
        await websocket.send_json({"type": "error", "message": "Please provide a valid domain/URL."})
        await websocket.close()
        return

    await websocket.send_json({"type": "started", "target": target})

    watcher_task = asyncio.create_task(watch_disconnect())

    try:
        generator = scan_subdomains(target, stop_event) if kind == "subdomains" else scan_directories(target, stop_event)
        async for result in generator:
            if stop_event.is_set():
                break
            found += 1
            await websocket.send_json({"type": "found", "found_count": found, **result})
        await websocket.send_json({"type": "complete", "found_count": found, "stopped": stop_event.is_set()})
    except WebSocketDisconnect:
        pass
    except Exception as e:
        logger.exception("Scan error")
        try:
            await websocket.send_json({"type": "error", "message": f"Scan error: {e}"})
        except Exception:
            pass
    finally:
        stop_event.set()
        watcher_task.cancel()
        try:
            await websocket.close()
        except Exception:
            pass


@app.websocket("/ws/subdomains")
async def ws_subdomains(websocket: WebSocket):
    await _run_scan(websocket, "subdomains")


@app.websocket("/ws/directories")
async def ws_directories(websocket: WebSocket):
    await _run_scan(websocket, "directories")
