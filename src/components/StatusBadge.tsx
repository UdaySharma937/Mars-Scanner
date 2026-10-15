function colorForStatus(status: number | null | undefined) {
  if (status == null) return "bg-slate-600/20 text-slate-300 border-slate-500/30";
  if (status >= 200 && status < 300) return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  if (status >= 300 && status < 400) return "bg-sky-500/15 text-sky-400 border-sky-500/30";
  if (status === 401 || status === 403) return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  if (status >= 400) return "bg-rose-500/15 text-rose-400 border-rose-500/30";
  return "bg-slate-600/20 text-slate-300 border-slate-500/30";
}

export default function StatusBadge({ status }: { status: number | null | undefined }) {
  return (
    <span
      className={`inline-flex min-w-[3.25rem] items-center justify-center rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${colorForStatus(
        status
      )}`}
    >
      {status ?? "N/A"}
    </span>
  );
}
