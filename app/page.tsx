'use client';

import { useState } from 'react';
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

export default function Home() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Pay Insights Output</h2>
          <SummaryCards summary={result.summary} />
          <OutputSectionTable title="CTC Structure" rows={result.ctcStructure} />
          <OutputSectionTable title="Monthly Gross Calculation" rows={result.monthlyGrossCalculation} />
          <OutputSectionTable title="Deductions / Salary Before Tax" rows={result.deductions} />
          <TaxTable tax={result.tax} />
          <OutputSectionTable title="Net Salary" rows={result.netSalary} />
          <div className="flex gap-3">
            <button className="rounded-lg border px-4 py-2" onClick={() => setResult(null)}>Edit Inputs</button>
            <button className="rounded-lg bg-accent px-4 py-2 text-slate-950" onClick={() => downloadPdf(result)}>Download PDF</button>
            <button className="rounded-lg bg-white px-4 py-2 text-slate-900" onClick={() => downloadExcel(result)}>Download Excel</button>
          </div>
        </div>
      )}
      {error && <p className="mt-3 rounded-lg bg-rose-900/40 p-3 text-sm">{error}</p>}
    </PageShell>
  );
}
