'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SimulationResult } from '@/types/simulation';
import { formatDateTime, formatInrDisplay } from '@/lib/formatters/number';
import { INPUT_LABELS, SECTION_LABELS, mapSectionRows } from './labels';

function addSectionTable(doc: jsPDF, startY: number, title: string, rows: Array<{ label: string; annual: number; monthly: number }>) {
  autoTable(doc, {
    startY,
    head: [[title, 'Annual', 'Monthly']],
    body: rows.map((row) => [row.label, formatInrDisplay(row.annual), formatInrDisplay(row.monthly)]),
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 2.6, textColor: [31, 41, 55] },
    headStyles: { fillColor: [15, 42, 82], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  return (doc as any).lastAutoTable.finalY + 6;
}

export function downloadPdf(result: SimulationResult) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  doc.setFillColor(8, 24, 49);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 86, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(17);
  doc.text('Pay Insights', 40, 34);
  doc.setFontSize(10);
  doc.text('CTC-to-net salary breakdown with tax transparency', 40, 52);
  doc.text(`Generated: ${formatDateTime(new Date())}`, 40, 69);

  let y = 104;

  autoTable(doc, {
    startY: y,
    head: [['Summary KPI', 'Value']],
    body: [
      ['Total CTC', formatInrDisplay(result.summary.totalCtc)],
      ['Monthly Gross', formatInrDisplay(result.summary.monthlyGross)],
      ['Monthly Net Salary / In-hand', formatInrDisplay(result.summary.monthlyNetSalary)],
      ['Annual Tax', formatInrDisplay(result.summary.annualTax)]
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 2.8, textColor: [31, 41, 55] },
    headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  autoTable(doc, {
    startY: y,
    head: [['Input Snapshot', 'Value']],
    body: Object.entries(result.inputs).map(([key, value]) => [INPUT_LABELS[key as keyof typeof INPUT_LABELS] ?? key, String(value)]),
    theme: 'grid',
    styles: { fontSize: 8.5, cellPadding: 2.5, textColor: [31, 41, 55] },
    headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  y = addSectionTable(doc, y, 'CTC Structure', mapSectionRows(result.ctcStructure, SECTION_LABELS.ctcStructure));
  y = addSectionTable(doc, y, 'Monthly Gross Calculation', mapSectionRows(result.monthlyGrossCalculation, SECTION_LABELS.monthlyGrossCalculation));
  y = addSectionTable(doc, y, 'Deductions / Salary Before Tax', mapSectionRows(result.deductions, SECTION_LABELS.deductions));

  autoTable(doc, {
    startY: y,
    head: [['Detailed Tax Calculation', 'Amount']],
    body: [
      ['Taxable Income', formatInrDisplay(result.tax.taxableIncome)],
      ...result.tax.slabTaxes.map((s) => [`Tax on ${s.label}`, formatInrDisplay(s.amount)]),
      ['Total Slab Tax', formatInrDisplay(result.tax.totalSlabTax)],
      ['Rebate', formatInrDisplay(-result.tax.rebate)],
      ['Surcharge', formatInrDisplay(result.tax.surcharge)],
      ['Marginal Relief', formatInrDisplay(-result.tax.marginalRelief)],
      ['Cess (4%)', formatInrDisplay(result.tax.cess)],
      ['Total Annual Tax', formatInrDisplay(result.tax.totalAnnualTax)]
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 2.6, textColor: [31, 41, 55] },
    headStyles: { fillColor: [15, 42, 82], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });
  y = (doc as any).lastAutoTable.finalY + 6;

  addSectionTable(doc, y, 'Net Salary', mapSectionRows(result.netSalary, SECTION_LABELS.netSalary));

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text(`WorkplaceAI • Pay Insights • Page ${i} of ${pageCount}`, 40, doc.internal.pageSize.getHeight() - 20);
  }

  const ts = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
  doc.save(`pay-insights-simulation-${ts}.pdf`);
}
