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
import { SECTION_LABELS, mapSectionRows } from '@/lib/export/labels';
import { SimulationResult } from '@/types/simulation';

export default function Home() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rowSets = useMemo(() => {
    if (!result) return null;
    return {
      ctcStructure: mapSectionRows(result.ctcStructure, SECTION_LABELS.ctcStructure),
      gross: mapSectionRows(result.monthlyGrossCalculation, SECTION_LABELS.monthlyGrossCalculation),
      deductions: mapSectionRows(result.deductions, SECTION_LABELS.deductions),
      net: mapSectionRows(result.netSalary, SECTION_LABELS.netSalary)
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
        <section className="space-y-6 rounded-3xl border border-slate-500/30 bg-gradient-to-b from-slate-900/70 to-slate-900/40 p-5 shadow-2xl backdrop-blur-md md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Pay Insights Output</h2>
              <p className="mt-1 text-sm text-slate-300">Annual and monthly compensation view with transparent tax logic.</p>
            </div>
            <div className="rounded-2xl border border-slate-600/40 bg-slate-950/30 p-2">
              <div className="flex flex-wrap gap-2">
                <button className="rounded-xl border border-slate-300/70 bg-slate-950/25 px-4 py-2 text-sm font-medium" onClick={() => setResult(null)}>Edit Inputs</button>
                <button className="rounded-xl bg-gradient-to-r from-sky-300 to-cyan-200 px-4 py-2 text-sm font-semibold text-slate-900 shadow" onClick={() => downloadPdf(result)}>Download PDF</button>
                <button className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow" onClick={() => downloadExcel(result)}>Download Excel</button>
              </div>
            </div>
          </div>

          <SummaryCards summary={result.summary} />
          {rowSets && (
            <div className="grid gap-4">
              <OutputSectionTable title="CTC Structure" rows={rowSets.ctcStructure} emphasisLabels={['Fixed CTC', 'Total CTC']} />
              <OutputSectionTable title="Monthly Gross Calculation" rows={rowSets.gross} emphasisLabels={['Gross Salary']} />
              <OutputSectionTable title="Deductions / Salary Before Tax" rows={rowSets.deductions} emphasisLabels={['Salary Before Tax']} />
              <TaxTable tax={result.tax} />
              <OutputSectionTable title="Net Salary" rows={rowSets.net} emphasisLabels={['Net Salary / In-hand']} />
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
