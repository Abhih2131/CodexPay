import { formatInr } from '@/lib/formatters/number';

export function OutputSectionTable({ title, rows }: { title: string; rows: Array<{ label: string; annual: number; monthly: number; emphasis?: boolean }> }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-lg">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2 text-left font-semibold">Item</th>
              <th className="py-2 text-right font-semibold">Annual</th>
              <th className="py-2 text-right font-semibold">Monthly</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-slate-100 last:border-0">
                <td className={`py-3 ${row.emphasis ? 'font-semibold' : ''}`}>{row.label}</td>
                <td className={`py-3 text-right ${row.emphasis ? 'font-semibold' : ''}`}>{formatInr(row.annual)}</td>
                <td className={`py-3 text-right ${row.emphasis ? 'font-semibold' : ''}`}>{formatInr(row.monthly)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
