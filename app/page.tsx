'use client';

import { useMemo, useState } from 'react';
import { HeaderBand } from '@/components/HeaderBand';
import { OutputSectionTable } from '@/components/OutputSectionTable';
import { PageShell } from '@/components/PageShell';
import { PayInsightsForm } from '@/components/PayInsightsForm';
import { SummaryCards } from '@/components/SummaryCards';
import { TaxTable } from '@/components/TaxTable';
import { runSimulation } from '@/lib/calculations/simulation';
import { downloadExcel } from '@/lib/export/excel';
import { downloadPdf } from '@/lib/export/pdf';
import { SimulationResult } from '@/types/simulation';

const toRows = (section: Record<string, { annual: number; monthly: number }>, labels: Record<string, string>, emphasisKeys: string[] = []) =>
  Object.entries(section).map(([key, value]) => ({
    label: labels[key] ?? key,
    annual: value.annual,
    monthly: value.monthly,
    emphasis: emphasisKeys.includes(key)
  }));

export default function Home() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rowSets = useMemo(() => {
    if (!result) return null;
    return {
      ctcStructure: toRows(
        result.ctcStructure,
        {
          basic: 'Basic',
          hra: 'HRA',
          employerPf: 'Employer PF',
          gratuity: 'Gratuity',
          otherAllowance: 'Other Allowance',
          fixedCtc: 'Fixed CTC',
          variablePay: 'Variable Pay',
          totalCtc: 'Total CTC'
        },
        ['fixedCtc', 'totalCtc']
      ),
      gross: toRows(
        result.monthlyGrossCalculation,
        { basic: 'Basic', hra: 'HRA', otherAllowance: 'Other Allowance', grossSalary: 'Gross Salary' },
        ['grossSalary']
      ),
      deductions: toRows(
        result.deductions,
        {
          grossSalary: 'Gross Salary',
          employeePf: 'Employee PF',
          professionalTax: 'Professional Tax',
          salaryBeforeTax: 'Salary Before Tax'
        },
        ['salaryBeforeTax']
      ),
      net: toRows(
        result.netSalary,
        { salaryBeforeTax: 'Salary Before Tax', totalTax: 'Total Tax', netSalary: 'Net Salary / In-hand' },
        ['netSalary']
      )
    };
  }, [result]);

  return (
    <PageShell>
      <HeaderBand />
      {!result ? (
        <PayInsightsForm
          onSubmit={(input) => {
            try {
              setResult(runSimulation(input));
              setError(null);
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Simulation failed');
            }
          }}
        />
      ) : (
        <section className="space-y-6 rounded-3xl border border-slate-500/30 bg-gradient-to-b from-slate-900/60 to-slate-900/35 p-5 shadow-2xl backdrop-blur-md md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold">Pay Insights Output</h2>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-xl border border-slate-300/70 bg-slate-950/25 px-4 py-2 text-sm font-medium" onClick={() => setResult(null)}>Edit Inputs</button>
              <button className="rounded-xl bg-gradient-to-r from-sky-300 to-cyan-200 px-4 py-2 text-sm font-semibold text-slate-900 shadow" onClick={() => downloadPdf(result)}>Download PDF</button>
              <button className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow" onClick={() => downloadExcel(result)}>Download Excel</button>
            </div>
          </div>
          <SummaryCards summary={result.summary} />
          {rowSets && (
            <div className="grid gap-4">
              <OutputSectionTable title="CTC Structure" rows={rowSets.ctcStructure} />
              <OutputSectionTable title="Monthly Gross Calculation" rows={rowSets.gross} />
              <OutputSectionTable title="Deductions / Salary Before Tax" rows={rowSets.deductions} />
              <TaxTable tax={result.tax} />
              <OutputSectionTable title="Net Salary" rows={rowSets.net} />
            </div>
          )}
          <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-3 text-xs text-sky-100">
            {result.notes.map((n) => (
              <p key={n}>{n}</p>
            ))}
          </div>
        </section>
      )}
      {error && <p className="rounded-xl border border-rose-400/30 bg-rose-900/40 p-3 text-sm">{error}</p>}
    </PageShell>
  );
}
