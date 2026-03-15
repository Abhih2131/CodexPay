import { formatInr } from '@/lib/formatters/number';

export function SummaryCards({ summary }: { summary: { totalCtc: number; monthlyGross: number; monthlyNetSalary: number; annualTax: number } }) {
  const cards = [
    ['Total CTC', summary.totalCtc],
    ['Monthly Gross', summary.monthlyGross],
    ['Monthly Net Salary / In-hand', summary.monthlyNetSalary],
    ['Annual Tax', summary.annualTax]
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map(([label, value]) => (
        <div key={label} className="rounded-xl bg-white p-4 text-slate-900 shadow-soft">
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-xl font-bold">{formatInr(Number(value))}</p>
        </div>
      ))}
    </div>
  );
}
