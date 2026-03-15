import * as XLSX from 'xlsx';
import { SimulationResult } from '@/types/simulation';
import { buildExportPayload } from './exportData';

function sectionRows(section: Record<string, { annual: number; monthly: number }>) {
  return Object.entries(section).map(([label, values]) => ({
    Item: label,
    Annual: values.annual,
    Monthly: values.monthly
  }));
}

export function downloadExcel(result: SimulationResult) {
  const payload = buildExportPayload(result);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet([
      { Metric: 'Total CTC', Value: payload.summary.totalCtc },
      { Metric: 'Monthly Gross', Value: payload.summary.monthlyGross },
      { Metric: 'Monthly Net Salary', Value: payload.summary.monthlyNetSalary },
      { Metric: 'Annual Tax', Value: payload.summary.annualTax },
      { Metric: 'Generated At', Value: payload.timestamp }
    ]),
    'Summary'
  );

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(Object.entries(payload.inputs).map(([field, value]) => ({ Field: field, Value: String(value) }))),
    'Input Snapshot'
  );

  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sectionRows(payload.sections.ctcStructure)), 'CTC Structure');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sectionRows(payload.sections.monthlyGrossCalculation)), 'Gross');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sectionRows(payload.sections.deductions)), 'Deductions');

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet([
      { Item: 'Taxable Income', Annual: payload.sections.tax.taxableIncome },
      ...payload.sections.tax.slabTaxes.map((x) => ({ Item: x.label, Annual: x.amount })),
      { Item: 'Total Slab Tax', Annual: payload.sections.tax.totalSlabTax },
      { Item: 'Rebate', Annual: -payload.sections.tax.rebate },
      { Item: 'Surcharge', Annual: payload.sections.tax.surcharge },
      { Item: 'Marginal Relief', Annual: -payload.sections.tax.marginalRelief },
      { Item: 'Cess', Annual: payload.sections.tax.cess },
      { Item: 'Total Annual Tax', Annual: payload.sections.tax.totalAnnualTax }
    ]),
    'Tax'
  );

  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sectionRows(payload.sections.netSalary)), 'Net Salary');

  const ts = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
  XLSX.writeFile(wb, `pay-insights-simulation-${ts}.xlsx`);
}
