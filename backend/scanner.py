"""
MarsScanner - Scanning Engine
==============================
Fast, concurrent, async scanning for:
  - Subdomains  (DNS resolution + live HTTP check)
  - Directories (HTTP probing of paths on a target site)

Both scanners ALWAYS use the full wordlist generated in wordlists.py
(100,000+ entries each). Results are streamed back (as an async
generator) so the API layer can push them to the client in real time
over a WebSocket, instead of forcing the user to wait for the whole
scan to finish.
"""

from __future__ import annotations

import asyncio
import socket
from typing import AsyncGenerator, Optional
from urllib.parse import urlparse

import httpx

from wordlists import get_subdomain_wordlist, get_directory_wordlist

# ---------------------------------------------------------------------------
# Tunables
# ---------------------------------------------------------------------------
SUBDOMAIN_CONCURRENCY = 400      # concurrent DNS lookups
DIRECTORY_CONCURRENCY = 150      # concurrent HTTP requests
DNS_TIMEOUT = 3.0
HTTP_TIMEOUT = 5.0
BATCH_SIZE = 3000                # process wordlist in batches to keep memory/responsiveness sane

DIRECTORY_VALID_STATUS = {200, 201, 204, 301, 302, 303, 307, 308, 401, 403}


def normalize_domain(raw: str) -> str:
    """Turn 'https://www.example.com/path' or 'example.com' into bare 'example.com'."""
    raw = raw.strip()
    if not raw:
        return ""
    if "://" not in raw:
        raw = f"http://{raw}"
    parsed = urlparse(raw)
    host = parsed.netloc or parsed.path
    host = host.split("/")[0].split(":")[0]
    if host.lower().startswith("www."):
        host = host[4:]
    return host.lower()


def normalize_base_url(raw: str) -> str:
    """Turn a user supplied domain/URL into a usable base URL with scheme."""
    raw = raw.strip()
    if not raw:
        return ""
    if "://" not in raw:
        raw = f"https://{raw}"
    parsed = urlparse(raw)
    scheme = parsed.scheme if parsed.scheme in ("http", "https") else "https"
    netloc = parsed.netloc or parsed.path.split("/")[0]
    return f"{scheme}://{netloc}"


async def _resolve_host(hostname: str, loop: asyncio.AbstractEventLoop) -> Optional[str]:
    try:
        info = await asyncio.wait_for(
            loop.run_in_executor(None, socket.gethostbyname, hostname),
            timeout=DNS_TIMEOUT,
        )
        return info
    except Exception:
        return None


async def _probe_subdomain(
    word: str,
    domain: str,
    client: httpx.AsyncClient,
    semaphore: asyncio.Semaphore,
    loop: asyncio.AbstractEventLoop,
) -> Optional[dict]:
    hostname = f"{word}.{domain}"
    async with semaphore:
        ip = await _resolve_host(hostname, loop)
        if not ip:
            return None

        status = None
        final_url = f"http://{hostname}"
        for scheme in ("https", "http"):
            try:
                resp = await client.get(f"{scheme}://{hostname}", timeout=HTTP_TIMEOUT)
                status = resp.status_code
                final_url = str(resp.url)
                break
            except Exception:
                continue

        return {
            "subdomain": hostname,
            "url": final_url,
            "ip": ip,
            "status": status,
        }


async def _probe_directory(
    word: str,
    base_url: str,
    client: httpx.AsyncClient,
    semaphore: asyncio.Semaphore,
) -> Optional[dict]:
    target = f"{base_url.rstrip('/')}/{word.lstrip('/')}"
    async with semaphore:
        try:
            resp = await client.get(target, timeout=HTTP_TIMEOUT, follow_redirects=False)
        except Exception:
            return None

        if resp.status_code in DIRECTORY_VALID_STATUS:
            return {
                "path": f"/{word.lstrip('/')}",
                "url": target,
                "status": resp.status_code,
                "size": len(resp.content) if resp.content else 0,
            }
        return None


async def scan_subdomains(domain: str, stop_event: asyncio.Event) -> AsyncGenerator[dict, None]:
    domain = normalize_domain(domain)
    if not domain:
        return

    wordlist = get_subdomain_wordlist()
    loop = asyncio.get_event_loop()
    semaphore = asyncio.Semaphore(SUBDOMAIN_CONCURRENCY)

    limits = httpx.Limits(max_connections=SUBDOMAIN_CONCURRENCY, max_keepalive_connections=50)
    async with httpx.AsyncClient(limits=limits, verify=False) as client:
        for start in range(0, len(wordlist), BATCH_SIZE):
            if stop_event.is_set():
                break
            batch = wordlist[start:start + BATCH_SIZE]
            tasks = [
                asyncio.create_task(_probe_subdomain(w, domain, client, semaphore, loop))
                for w in batch
            ]
            for task in asyncio.as_completed(tasks):
                if stop_event.is_set():
                    for t in tasks:
                        t.cancel()
                    break
                result = await task
                if result:
                    yield result


async def scan_directories(target: str, stop_event: asyncio.Event) -> AsyncGenerator[dict, None]:
    base_url = normalize_base_url(target)
    if not base_url:
        return

    wordlist = get_directory_wordlist()
    semaphore = asyncio.Semaphore(DIRECTORY_CONCURRENCY)

    limits = httpx.Limits(max_connections=DIRECTORY_CONCURRENCY, max_keepalive_connections=50)
    async with httpx.AsyncClient(limits=limits, verify=False) as client:
        for start in range(0, len(wordlist), BATCH_SIZE):
            if stop_event.is_set():
                break
            batch = wordlist[start:start + BATCH_SIZE]
            tasks = [
                asyncio.create_task(_probe_directory(w, base_url, client, semaphore))
                for w in batch
            ]
            for task in asyncio.as_completed(tasks):
                if stop_event.is_set():
                    for t in tasks:
                        t.cancel()
                    break
                result = await task
                if result:
                    yield result
