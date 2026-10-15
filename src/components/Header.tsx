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
          
        </div>
      </div>
    </header>
  );
}
