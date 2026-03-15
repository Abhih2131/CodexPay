'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SimulationResult } from '@/types/simulation';
import { formatDateTime, formatInrDisplay } from '@/lib/formatters/number';

const mapSection = (title: string, data: Record<string, { annual: number; monthly: number }>) => ({
  title,
  body: Object.entries(data).map(([k, v]) => [k, formatInrDisplay(v.annual), formatInrDisplay(v.monthly)])
});

export function downloadPdf(result: SimulationResult) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Pay Insights Simulation', 14, 14);
  doc.setFontSize(10);
  doc.text(`Generated: ${formatDateTime(new Date())}`, 14, 20);

  autoTable(doc, {
    startY: 24,
    head: [['Summary', 'Value']],
    body: [
      ['Total CTC', formatInrDisplay(result.summary.totalCtc)],
      ['Monthly Gross', formatInrDisplay(result.summary.monthlyGross)],
      ['Monthly Net Salary / In-hand', formatInrDisplay(result.summary.monthlyNetSalary)],
      ['Annual Tax', formatInrDisplay(result.summary.annualTax)]
    ],
    theme: 'grid',
    headStyles: { fillColor: [19, 40, 74] }
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 6,
    head: [['Input Snapshot', 'Value']],
    body: Object.entries(result.inputs).map(([k, v]) => [k, String(v)]),
    theme: 'grid',
    headStyles: { fillColor: [19, 40, 74] }
  });

  let y = (doc as any).lastAutoTable.finalY + 8;
  const sections = [
    mapSection('CTC Structure', result.ctcStructure),
    mapSection('Monthly Gross Calculation', result.monthlyGrossCalculation),
    mapSection('Deductions / Salary Before Tax', result.deductions),
    mapSection('Net Salary', result.netSalary)
  ];

  for (const section of sections) {
    autoTable(doc, {
      startY: y,
      head: [[section.title, 'Annual', 'Monthly']],
      body: section.body,
      theme: 'grid',
      headStyles: { fillColor: [19, 40, 74] }
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  autoTable(doc, {
    startY: y,
    head: [['Detailed Tax Calculation', 'Amount']],
    body: [
      ['Taxable Income', formatInrDisplay(result.tax.taxableIncome)],
      ...result.tax.slabTaxes.map((s) => [s.label, formatInrDisplay(s.amount)]),
      ['Total Slab Tax', formatInrDisplay(result.tax.totalSlabTax)],
      ['Rebate', formatInrDisplay(-result.tax.rebate)],
      ['Surcharge', formatInrDisplay(result.tax.surcharge)],
      ['Marginal Relief', formatInrDisplay(-result.tax.marginalRelief)],
      ['Cess', formatInrDisplay(result.tax.cess)],
      ['Total Annual Tax', formatInrDisplay(result.tax.totalAnnualTax)]
    ],
    theme: 'grid',
    headStyles: { fillColor: [19, 40, 74] }
  });

  const ts = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
  doc.save(`pay-insights-simulation-${ts}.pdf`);
}
