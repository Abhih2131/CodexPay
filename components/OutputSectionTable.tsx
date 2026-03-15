import { formatInrDisplay } from '@/lib/formatters/number';

export function OutputSectionTable({ title, rows }: { title: string; rows: Array<{ label: string; annual: number; monthly: number; emphasis?: boolean }> }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-[0_12px_28px_rgba(8,15,35,0.14)]">
      <h3 className="mb-4 text-lg font-semibold tracking-tight">{title}</h3>
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-slate-500">
              <th className="px-3 py-2 text-left font-semibold">Item</th>
              <th className="px-3 py-2 text-right font-semibold">Annual</th>
              <th className="px-3 py-2 text-right font-semibold">Monthly</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.label} className={`border-t border-slate-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                <td className={`px-3 py-3 ${row.emphasis ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{row.label}</td>
                <td className={`px-3 py-3 text-right ${row.emphasis ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{formatInrDisplay(row.annual)}</td>
                <td className={`px-3 py-3 text-right ${row.emphasis ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{formatInrDisplay(row.monthly)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
