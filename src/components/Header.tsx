import MarsLogo from "./MarsLogo";

export default function Header({
  onOpenSettings,
  onOpenGuide,
}: {
  onOpenSettings: () => void;
  onOpenGuide: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0607]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <MarsLogo />
          <div>
            <p className="text-base font-bold tracking-tight text-white sm:text-lg">
              Mars<span className="text-orange-500">Scanner</span>
            </p>
            <p className="hidden text-[11px] text-slate-500 sm:block">Subdomain &amp; Directory Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGuide}
            className="hidden rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/5 sm:inline-flex"
          >
            Deploy Guide
          </button>
          <button
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10"
          >
            ⚙️ <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}
