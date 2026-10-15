import { useEffect, useState } from "react";
import { getApiBase, setApiBase } from "../lib/api";

export default function SettingsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [value, setValue] = useState(getApiBase());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      setValue(getApiBase());
      setSaved(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-[#120a0a] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Backend Settings</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          MarsScanner's frontend talks to your self-hosted{" "}
          <span className="font-medium text-orange-400">Python + FastAPI</span> backend. Enter the
          backend's public URL below (e.g. after deploying it to Render).
        </p>

        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Backend API URL
        </label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://your-backend.onrender.com"
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none ring-orange-500/50 focus:ring-2"
        />

        <button
          onClick={() => {
            setApiBase(value);
            setSaved(true);
          }}
          className="mt-4 w-full rounded-lg bg-gradient-to-r from-orange-500 to-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition hover:brightness-110"
        >
          Save
        </button>

        {saved && <p className="mt-3 text-center text-xs font-medium text-emerald-400">Saved! Backend URL updated.</p>}

        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-slate-400">
          <p className="mb-2 font-semibold text-slate-300">Running the backend locally?</p>
          <code className="block rounded bg-black/40 p-2 font-mono text-[11px] text-orange-300">
            cd backend && pip install -r requirements.txt && uvicorn main:app --reload
          </code>
          <p className="mt-2">
            Then use <span className="font-mono text-orange-300">http://localhost:8000</span> as the API URL above.
          </p>
          <p className="mt-3">
            Full free deployment guide (GitHub + Render + Vercel/Netlify) is included in{" "}
            <span className="font-mono text-orange-300">setup.txt</span> at the project root.
          </p>
        </div>
      </div>
    </div>
  );
}
