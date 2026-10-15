const STORAGE_KEY = "marsscanner_api_base";
const DEFAULT_API_BASE =
  (import.meta as any)?.env?.VITE_API_BASE?.toString().trim() || "https://mars-scanner-9ttm.onrender.com";

export function getApiBase(): string {
  const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
  return (stored || DEFAULT_API_BASE).replace(/\/+$/, "");
}

export function setApiBase(url: string) {
  const cleaned = url.trim().replace(/\/+$/, "");
  window.localStorage.setItem(STORAGE_KEY, cleaned);
}

export function toWebSocketUrl(httpBase: string, path: string): string {
  const wsBase = httpBase.replace(/^http/i, (m) => (m.toLowerCase() === "https" ? "wss" : "ws"));
  return `${wsBase}${path}`;
}

export function isLikelyValidBase(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
