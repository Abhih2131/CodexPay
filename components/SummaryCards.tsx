import { formatInrDisplay } from '@/lib/formatters/number';

export function SummaryCards({ summary }: { summary: { totalCtc: number; monthlyGross: number; monthlyNetSalary: number; annualTax: number } }) {
  const cards = [
    { label: 'Total CTC', value: summary.totalCtc, tone: 'from-cyan-300/30 to-cyan-100/0' },
    { label: 'Monthly Gross', value: summary.monthlyGross, tone: 'from-indigo-300/30 to-indigo-100/0' },
    { label: 'Monthly Net Salary / In-hand', value: summary.monthlyNetSalary, tone: 'from-emerald-300/30 to-emerald-100/0' },
    { label: 'Annual Tax', value: summary.annualTax, tone: 'from-amber-300/30 to-amber-100/0' }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-[0_10px_30px_rgba(8,15,35,0.15)]">
          <div className={`absolute inset-0 bg-gradient-to-br ${card.tone}`} />
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{card.label}</p>
            <p className="mt-3 text-2xl font-bold leading-tight text-slate-900">{formatInrDisplay(card.value)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
