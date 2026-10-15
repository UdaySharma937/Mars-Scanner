import { useMemo, useState, type ReactNode } from "react";
import { useScanner } from "../lib/useScanner";
import type { ScanMode, DirectoryResult, SubdomainResult } from "../types/scan";
import StatusBadge from "./StatusBadge";

interface Props {
  mode: ScanMode;
}

const COPY: Record<
  ScanMode,
  { title: string; tagline: string; placeholder: string; inputLabel: string; accent: string; icon: ReactNode }
> = {
  subdomains: {
    title: "Subdomain Finder",
    tagline: "Discover hidden & active subdomains of any domain with live DNS + HTTP verification.",
    placeholder: "example.com",
    inputLabel: "Target domain",
    accent: "from-orange-500 to-red-600",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.7 4 6.1 4 9s-1.5 6.3-4 9c-2.5-2.7-4-6.1-4-9s1.5-6.3 4-9z" />
      </svg>
    ),
  },
  directories: {
    title: "Directory Finder",
    tagline: "Brute-force hidden directories, files and admin panels on any live website.",
    placeholder: "https://example.com",
    inputLabel: "Target URL",
    accent: "from-rose-500 to-red-700",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
      </svg>
    ),
  },
};

export default function ScannerSection({ mode }: Props) {
  const copy = COPY[mode];
  const { state, start, stop, reset } = useScanner(mode);
  const [input, setInput] = useState("");

  const isBusy = state.status === "connecting" || state.status === "scanning";

  const exportText = useMemo(() => {
    return state.results
      .map((r) => (mode === "subdomains" ? (r as SubdomainResult).url : (r as DirectoryResult).url))
      .join("\n");
  }, [state.results, mode]);

  const handleDownload = () => {
    const blob = new Blob([exportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marsscanner-${mode}-${(state.target || "results").replace(/[^a-z0-9.-]/gi, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl backdrop-blur-sm sm:p-7">
      <div className="mb-5 flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${copy.accent} text-white shadow-lg`}>
          {copy.icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white sm:text-xl">{copy.title}</h3>
          <p className="mt-0.5 text-sm text-slate-400">{copy.tagline}</p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isBusy) start(input);
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <div className="flex-1">
          <label className="sr-only">{copy.inputLabel}</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={copy.placeholder}
            disabled={isBusy}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none ring-orange-500/40 transition focus:ring-2 disabled:opacity-50"
          />
        </div>
        {!isBusy ? (
          <button
            type="submit"
            className={`flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${copy.accent} px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-[0.98]`}
          >
            🚀 Start Scan
          </button>
        ) : (
          <button
            type="button"
            onClick={stop}
            className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-6 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20"
          >
            ■ Stop Scan
          </button>
        )}
      </form>

      {/* Status line */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
        {state.status === "connecting" && (
          <span className="inline-flex items-center gap-1.5 text-amber-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" /> Connecting to backend…
          </span>
        )}
        {state.status === "scanning" && (
          <span className="inline-flex items-center gap-1.5 text-emerald-400">
            <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" /> Scanning {state.target}… full wordlist in progress
          </span>
        )}
        {state.status === "complete" && (
          <span className="inline-flex items-center gap-1.5 text-sky-400">✔ Scan complete for {state.target}</span>
        )}
        {state.status === "stopped" && (
          <span className="inline-flex items-center gap-1.5 text-amber-400">■ Scan stopped</span>
        )}
        {state.status === "error" && (
          <span className="inline-flex items-center gap-1.5 text-rose-400">⚠ {state.error}</span>
        )}
        {state.results.length > 0 && (
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-semibold text-slate-200">
            {state.results.length} found
          </span>
        )}
        {state.results.length > 0 && !isBusy && (
          <div className="ml-auto flex gap-2">
            <button onClick={handleCopy} className="rounded-lg border border-white/10 px-3 py-1.5 font-medium text-slate-300 transition hover:bg-white/5">
              Copy
            </button>
            <button onClick={handleDownload} className="rounded-lg border border-white/10 px-3 py-1.5 font-medium text-slate-300 transition hover:bg-white/5">
              Download
            </button>
            <button onClick={reset} className="rounded-lg border border-white/10 px-3 py-1.5 font-medium text-slate-300 transition hover:bg-white/5">
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mt-4 max-h-[420px] overflow-y-auto rounded-xl border border-white/5">
        {state.results.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-14 text-center text-sm text-slate-600">
            <span className="text-3xl opacity-40">{mode === "subdomains" ? "🛰️" : "🗂️"}</span>
            <p>No results yet. Enter a {mode === "subdomains" ? "domain" : "URL"} above and start scanning.</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {state.results
              .slice()
              .reverse()
              .map((r, i) =>
                mode === "subdomains" ? (
                  <SubdomainRow key={i} result={r as SubdomainResult} />
                ) : (
                  <DirectoryRow key={i} result={r as DirectoryResult} />
                )
              )}
          </ul>
        )}
      </div>
    </div>
  );
}

function SubdomainRow({ result }: { result: SubdomainResult }) {
  return (
    <li className="flex flex-col gap-1.5 px-4 py-3 transition hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0 flex-1">
        <a
          href={result.url}
          target="_blank"
          rel="noreferrer"
          className="block truncate font-mono text-sm text-orange-300 hover:underline"
        >
          {result.url}
        </a>
        {result.ip && <p className="mt-0.5 font-mono text-xs text-slate-500">IP: {result.ip}</p>}
      </div>
      <StatusBadge status={result.status} />
    </li>
  );
}

function DirectoryRow({ result }: { result: DirectoryResult }) {
  return (
    <li className="flex flex-col gap-1.5 px-4 py-3 transition hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0 flex-1">
        <a
          href={result.url}
          target="_blank"
          rel="noreferrer"
          className="block truncate font-mono text-sm text-orange-300 hover:underline"
        >
          {result.url}
        </a>
        <p className="mt-0.5 font-mono text-xs text-slate-500">
          {result.path} · {result.size} bytes
        </p>
      </div>
      <StatusBadge status={result.status} />
    </li>
  );
}
