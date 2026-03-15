import { formatInr } from '@/lib/formatters/number';
import { TaxBreakdown } from '@/types/simulation';

export function TaxTable({ tax }: { tax: TaxBreakdown }) {
  const rows = [
    { label: 'Taxable Income', value: tax.taxableIncome },
    ...tax.slabTaxes.map((s) => ({ label: `Tax on ${s.label}`, value: s.amount })),
    { label: 'Total Slab Tax', value: tax.totalSlabTax, emphasis: true },
    { label: 'Rebate', value: -tax.rebate },
    { label: 'Surcharge', value: tax.surcharge },
    { label: 'Marginal Relief', value: -tax.marginalRelief },
    { label: 'Cess (4%)', value: tax.cess },
    { label: 'Total Annual Tax', value: tax.totalAnnualTax, emphasis: true }
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-lg">
      <h3 className="mb-4 text-lg font-semibold">Detailed Tax Calculation</h3>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-slate-100 last:border-0">
              <td className={`py-3 ${row.emphasis ? 'font-semibold' : ''}`}>{row.label}</td>
              <td className={`py-3 text-right ${row.emphasis ? 'font-semibold' : ''}`}>{formatInr(row.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-slate-500">Marginal relief ensures post-surcharge tax does not increase more than income above the applicable surcharge threshold.</p>
    </section>
  );
}
