import { formatInrDisplay } from '@/lib/formatters/number';
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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-[0_12px_28px_rgba(8,15,35,0.14)]">
      <h3 className="mb-4 text-lg font-semibold tracking-tight">Detailed Tax Calculation</h3>
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.label} className={`border-t border-slate-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                <td className={`px-3 py-3 ${row.emphasis ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{row.label}</td>
                <td className={`px-3 py-3 text-right ${row.emphasis ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{formatInrDisplay(row.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-500">Marginal relief ensures post-surcharge tax does not increase more than income above the active surcharge threshold.</p>
    </section>
  );
}
