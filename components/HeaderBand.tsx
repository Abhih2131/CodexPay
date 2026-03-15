export function HeaderBand() {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-slate-600/30 bg-gradient-to-r from-[#0f2a52]/80 to-[#0b1c35]/80 p-7 shadow-2xl backdrop-blur-xl">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-indigo-300/10 blur-3xl" />
      <p className="relative text-xs uppercase tracking-[0.2em] text-sky-300">WorkplaceAI · Compensation Intelligence</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Pay Insights</h1>
          <p className="mt-1 text-sm text-slate-300 md:text-base">CTC-to-net salary breakdown with tax transparency</p>
        </div>
        <span className="rounded-full border border-sky-300/30 bg-sky-500/10 px-3 py-1 text-xs text-sky-200">India · New Regime V1</span>
      </div>
    </header>
  );
}
