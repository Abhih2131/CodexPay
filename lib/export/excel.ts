import * as XLSX from 'xlsx';
import { SimulationResult } from '@/types/simulation';
import { buildExportPayload } from './exportData';

const INR_NUMBER_FORMAT = '[$₹-44D] #,##0;[Red]-[$₹-44D] #,##0';

function applyNumberFormat(worksheet: XLSX.WorkSheet, numericColumnIndexes: number[]) {
  const ref = worksheet['!ref'];
  if (!ref) return;
  const range = XLSX.utils.decode_range(ref);

  for (let row = range.s.r + 1; row <= range.e.r; row += 1) {
    for (const col of numericColumnIndexes) {
      const address = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = worksheet[address];
      if (cell && typeof cell.v === 'number') {
        cell.t = 'n';
        cell.z = INR_NUMBER_FORMAT;
      }
    }
  }
}

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

  const summarySheet = XLSX.utils.json_to_sheet([
    { Metric: 'Total CTC', Value: payload.summary.totalCtc },
    { Metric: 'Monthly Gross', Value: payload.summary.monthlyGross },
    { Metric: 'Monthly Net Salary', Value: payload.summary.monthlyNetSalary },
    { Metric: 'Annual Tax', Value: payload.summary.annualTax },
    { Metric: 'Generated At', Value: payload.timestamp }
  ]);
  applyNumberFormat(summarySheet, [1]);
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(Object.entries(payload.inputs).map(([field, value]) => ({ Field: field, Value: String(value) }))),
    'Input Snapshot'
  );

  const ctcSheet = XLSX.utils.json_to_sheet(sectionRows(payload.sections.ctcStructure));
  applyNumberFormat(ctcSheet, [1, 2]);
  XLSX.utils.book_append_sheet(wb, ctcSheet, 'CTC Structure');

  const grossSheet = XLSX.utils.json_to_sheet(sectionRows(payload.sections.monthlyGrossCalculation));
  applyNumberFormat(grossSheet, [1, 2]);
  XLSX.utils.book_append_sheet(wb, grossSheet, 'Gross');

  const deductionSheet = XLSX.utils.json_to_sheet(sectionRows(payload.sections.deductions));
  applyNumberFormat(deductionSheet, [1, 2]);
  XLSX.utils.book_append_sheet(wb, deductionSheet, 'Deductions');

  const taxSheet = XLSX.utils.json_to_sheet([
    { Item: 'Taxable Income', Annual: payload.sections.tax.taxableIncome },
    ...payload.sections.tax.slabTaxes.map((x) => ({ Item: x.label, Annual: x.amount })),
    { Item: 'Total Slab Tax', Annual: payload.sections.tax.totalSlabTax },
    { Item: 'Rebate', Annual: -payload.sections.tax.rebate },
    { Item: 'Surcharge', Annual: payload.sections.tax.surcharge },
    { Item: 'Marginal Relief', Annual: -payload.sections.tax.marginalRelief },
    { Item: 'Cess', Annual: payload.sections.tax.cess },
    { Item: 'Total Annual Tax', Annual: payload.sections.tax.totalAnnualTax }
  ]);
  applyNumberFormat(taxSheet, [1]);
  XLSX.utils.book_append_sheet(wb, taxSheet, 'Tax');

  const netSheet = XLSX.utils.json_to_sheet(sectionRows(payload.sections.netSalary));
  applyNumberFormat(netSheet, [1, 2]);
  XLSX.utils.book_append_sheet(wb, netSheet, 'Net Salary');

  const ts = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
  XLSX.writeFile(wb, `pay-insights-simulation-${ts}.xlsx`);
}
