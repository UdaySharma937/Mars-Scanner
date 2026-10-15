export default function DeployGuideModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  const steps = [
    {
      title: "1. Push the project to GitHub",
      body: "Create a new GitHub repository and push the whole project (frontend + backend/ folder) to it.",
    },
    {
      title: "2. Deploy the backend (FastAPI) — Render.com (Free)",
      body:
        "On render.com → New → Web Service → connect your repo → Root Directory: backend → Build Command: pip install -r requirements.txt → Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT. Copy the generated URL, e.g. https://marsscanner-api.onrender.com",
    },
    {
      title: "3. Deploy the frontend — Vercel or Netlify (Free)",
      body:
        "Import the same repo on vercel.com or netlify.com. Build command: npm run build, Output directory: dist. Deploy — you'll get a live URL like https://marsscanner.vercel.app",
    },
    {
      title: "4. Connect frontend to backend",
      body:
        'Open your deployed site → click "Settings" → paste your Render backend URL → Save. The app now performs real scans.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#120a0a] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Free Deployment Guide</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {steps.map((s) => (
            <div key={s.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-1 text-sm font-semibold text-orange-400">{s.title}</h3>
              <p className="text-sm leading-relaxed text-slate-300">{s.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs text-slate-500">
          📄 A complete, detailed step-by-step guide (with exact commands) is included in the{" "}
          <span className="font-mono text-orange-300">setup.txt</span> file at the root of this project.
        </p>
      </div>
    </div>
  );
}
