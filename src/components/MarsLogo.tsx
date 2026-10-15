export default function MarsLogo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 via-red-500 to-rose-700 shadow-[0_0_20px_rgba(239,68,68,0.55)]" />
      <div className="absolute inset-0 overflow-hidden rounded-full opacity-40 mix-blend-overlay">
        <div className="absolute left-1 top-2 h-2 w-3 rounded-full bg-black" />
        <div className="absolute right-1.5 top-4 h-1.5 w-1.5 rounded-full bg-black" />
        <div className="absolute bottom-1.5 left-3 h-1 w-2 rounded-full bg-black" />
      </div>
      <div className="absolute -inset-1 rounded-full border border-red-400/30" />
    </div>
  );
}
