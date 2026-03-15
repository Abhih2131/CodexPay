import { formatInr } from '@/lib/formatters/number';

export function OutputSectionTable({ title, rows }: { title: string; rows: Record<string, { annual: number; monthly: number }> }) {
  return (
    <section className="rounded-xl bg-white p-4 text-slate-900 shadow-soft">
      <h3 className="mb-3 text-lg font-semibold">{title}</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Item</th>
            <th className="py-2 text-right">Annual</th>
            <th className="py-2 text-right">Monthly</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(rows).map(([label, value]) => (
            <tr key={label} className="border-b last:border-0">
              <td className="py-2 capitalize">{label.replace(/([A-Z])/g, ' $1')}</td>
              <td className="py-2 text-right">{formatInr(value.annual)}</td>
              <td className="py-2 text-right">{formatInr(value.monthly)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
