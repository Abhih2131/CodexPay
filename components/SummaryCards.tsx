import { formatInr } from '@/lib/formatters/number';

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
        <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.label}</p>
          <p className="mt-3 text-2xl font-bold text-slate-900">{formatInr(card.value)}</p>
        </div>
      ))}
    </div>
  );
}
