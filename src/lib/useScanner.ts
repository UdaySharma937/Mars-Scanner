import { useCallback, useRef, useState } from "react";
import { getApiBase, toWebSocketUrl } from "./api";
import type { ScanMode, ScanResult, ScanState } from "../types/scan";

const WS_PATHS: Record<ScanMode, string> = {
  subdomains: "/ws/subdomains",
  directories: "/ws/directories",
};

export function useScanner(mode: ScanMode) {
  const [state, setState] = useState<ScanState>({
    status: "idle",
    target: "",
    results: [],
  });
  const socketRef = useRef<WebSocket | null>(null);

  const start = useCallback(
    (targetInput: string) => {
      if (!targetInput.trim()) {
        setState((s) => ({ ...s, status: "error", error: "Please enter a domain or URL." }));
        return;
      }

      // close any previous connection
      socketRef.current?.close();

      setState({ status: "connecting", target: targetInput.trim(), results: [] });

      let socket: WebSocket;
      try {
        const base = getApiBase();
        const url = toWebSocketUrl(base, WS_PATHS[mode]);
        socket = new WebSocket(url);
      } catch (err) {
        setState((s) => ({ ...s, status: "error", error: "Invalid backend API URL. Check Settings." }));
        return;
      }

      socketRef.current = socket;

      socket.onopen = () => {
        const payload = mode === "subdomains" ? { domain: targetInput.trim() } : { url: targetInput.trim() };
        socket.send(JSON.stringify(payload));
        setState((s) => ({ ...s, status: "scanning" }));
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "started") {
            setState((s) => ({ ...s, status: "scanning", target: data.target || s.target }));
          } else if (data.type === "found") {
            setState((s) => ({ ...s, status: "scanning", results: [...s.results, data as ScanResult] }));
          } else if (data.type === "complete") {
            setState((s) => ({ ...s, status: data.stopped ? "stopped" : "complete" }));
          } else if (data.type === "error") {
            setState((s) => ({ ...s, status: "error", error: data.message || "Unknown error occurred." }));
          }
        } catch {
          // ignore malformed message
        }
      };

      socket.onerror = () => {
        setState((s) => ({
          ...s,
          status: "error",
          error: "Could not reach the MarsScanner backend. Check the API URL in Settings and make sure the server is running.",
        }));
      };

      socket.onclose = () => {
        setState((s) => (s.status === "scanning" ? { ...s, status: "complete" } : s));
      };
    },
    [mode]
  );

  const stop = useCallback(() => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ action: "stop" }));
    }
  }, []);

  const reset = useCallback(() => {
    socketRef.current?.close();
    setState({ status: "idle", target: "", results: [] });
  }, []);

  return { state, start, stop, reset };
}
