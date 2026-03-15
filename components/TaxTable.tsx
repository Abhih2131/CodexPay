import { formatInr } from '@/lib/formatters/number';
import { TaxBreakdown } from '@/types/simulation';

export function TaxTable({ tax }: { tax: TaxBreakdown }) {
  return (
    <section className="rounded-xl bg-white p-4 text-slate-900 shadow-soft">
      <h3 className="mb-3 text-lg font-semibold">Detailed Tax Calculation</h3>
      <table className="w-full text-sm">
        <tbody>
          <tr><td>Taxable Income</td><td className="text-right">{formatInr(tax.taxableIncome)}</td></tr>
          {tax.slabTaxes.map((s) => <tr key={s.label}><td>Tax on {s.label}</td><td className="text-right">{formatInr(s.amount)}</td></tr>)}
          <tr><td>Total Slab Tax</td><td className="text-right">{formatInr(tax.totalSlabTax)}</td></tr>
          <tr><td>Rebate</td><td className="text-right">-{formatInr(tax.rebate)}</td></tr>
          <tr><td>Surcharge</td><td className="text-right">{formatInr(tax.surcharge)}</td></tr>
          <tr><td>Marginal Relief</td><td className="text-right">-{formatInr(tax.marginalRelief)}</td></tr>
          <tr><td>Cess</td><td className="text-right">{formatInr(tax.cess)}</td></tr>
          <tr className="font-semibold"><td>Total Annual Tax</td><td className="text-right">{formatInr(tax.totalAnnualTax)}</td></tr>
        </tbody>
      </table>
    </section>
  );
}
