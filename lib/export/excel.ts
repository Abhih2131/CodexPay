import * as XLSX from 'xlsx';
import { SimulationResult } from '@/types/simulation';
import { buildExportPayload } from './exportData';
import { INPUT_LABELS, SECTION_LABELS, mapSectionRows } from './labels';

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

function configureWorksheet(worksheet: XLSX.WorkSheet, widths: number[], withFilter = true) {
  worksheet['!cols'] = widths.map((wch) => ({ wch }));
  const ref = worksheet['!ref'];
  if (!ref) return;
  const range = XLSX.utils.decode_range(ref);
  if (withFilter && range.e.r >= 1) {
    worksheet['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: range.e.r, c: range.e.c } }) };
  }
}

export function downloadExcel(result: SimulationResult) {
  const payload = buildExportPayload(result);
  const wb = XLSX.utils.book_new();

  const summarySheet = XLSX.utils.json_to_sheet([
    { Metric: 'Total CTC', Value: payload.summary.totalCtc },
    { Metric: 'Monthly Gross', Value: payload.summary.monthlyGross },
    { Metric: 'Monthly Net Salary / In-hand', Value: payload.summary.monthlyNetSalary },
    { Metric: 'Annual Tax', Value: payload.summary.annualTax },
    { Metric: 'Generated At', Value: payload.timestamp }
  ]);
  applyNumberFormat(summarySheet, [1]);
  configureWorksheet(summarySheet, [34, 20]);
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

  const inputSheet = XLSX.utils.json_to_sheet(
    Object.entries(payload.inputs).map(([field, value]) => ({ Field: INPUT_LABELS[field as keyof typeof INPUT_LABELS] ?? field, Value: String(value) }))
  );
  configureWorksheet(inputSheet, [36, 34]);
  XLSX.utils.book_append_sheet(wb, inputSheet, 'Input Snapshot');

  const ctcSheet = XLSX.utils.json_to_sheet(mapSectionRows(payload.sections.ctcStructure, SECTION_LABELS.ctcStructure));
  applyNumberFormat(ctcSheet, [1, 2]);
  configureWorksheet(ctcSheet, [36, 20, 20]);
  XLSX.utils.book_append_sheet(wb, ctcSheet, 'CTC Structure');

  const grossSheet = XLSX.utils.json_to_sheet(mapSectionRows(payload.sections.monthlyGrossCalculation, SECTION_LABELS.monthlyGrossCalculation));
  applyNumberFormat(grossSheet, [1, 2]);
  configureWorksheet(grossSheet, [36, 20, 20]);
  XLSX.utils.book_append_sheet(wb, grossSheet, 'Monthly Gross');

  const deductionSheet = XLSX.utils.json_to_sheet(mapSectionRows(payload.sections.deductions, SECTION_LABELS.deductions));
  applyNumberFormat(deductionSheet, [1, 2]);
  configureWorksheet(deductionSheet, [36, 20, 20]);
  XLSX.utils.book_append_sheet(wb, deductionSheet, 'Deductions');

  const taxSheet = XLSX.utils.json_to_sheet([
    { Item: 'Taxable Income', Annual: payload.sections.tax.taxableIncome },
    ...payload.sections.tax.slabTaxes.map((x) => ({ Item: `Tax on ${x.label}`, Annual: x.amount })),
    { Item: 'Total Slab Tax', Annual: payload.sections.tax.totalSlabTax },
    { Item: 'Rebate', Annual: -payload.sections.tax.rebate },
    { Item: 'Surcharge', Annual: payload.sections.tax.surcharge },
    { Item: 'Marginal Relief', Annual: -payload.sections.tax.marginalRelief },
    { Item: 'Cess (4%)', Annual: payload.sections.tax.cess },
    { Item: 'Total Annual Tax', Annual: payload.sections.tax.totalAnnualTax }
  ]);
  applyNumberFormat(taxSheet, [1]);
  configureWorksheet(taxSheet, [44, 20]);
  XLSX.utils.book_append_sheet(wb, taxSheet, 'Tax Calculation');

  const netSheet = XLSX.utils.json_to_sheet(mapSectionRows(payload.sections.netSalary, SECTION_LABELS.netSalary));
  applyNumberFormat(netSheet, [1, 2]);
  configureWorksheet(netSheet, [36, 20, 20]);
  XLSX.utils.book_append_sheet(wb, netSheet, 'Net Salary');

  const ts = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
  XLSX.writeFile(wb, `pay-insights-simulation-${ts}.xlsx`);
}
