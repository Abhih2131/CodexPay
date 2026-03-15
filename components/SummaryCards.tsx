import { formatInrDisplay } from '@/lib/formatters/number';

export function SummaryCards({ summary }: { summary: { totalCtc: number; monthlyGross: number; monthlyNetSalary: number; annualTax: number } }) {
  const cards = [
    { label: 'Total CTC', value: summary.totalCtc },
    { label: 'Monthly Gross', value: summary.monthlyGross },
    { label: 'Monthly Net Salary / In-hand', value: summary.monthlyNetSalary },
    { label: 'Annual Tax', value: summary.annualTax }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-[0_10px_30px_rgba(8,15,35,0.15)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-300 to-indigo-300" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{card.label}</p>
          <p className="mt-3 text-2xl font-bold leading-tight text-slate-900">{formatInrDisplay(card.value)}</p>
        </div>
      ))}
    </div>
  );
}
