'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SimulationResult } from '@/types/simulation';

const mapSection = (title: string, data: Record<string, { annual: number; monthly: number }>) => ({
  title,
  body: Object.entries(data).map(([k, v]) => [k, v.annual.toFixed(2), v.monthly.toFixed(2)])
});

export function downloadPdf(result: SimulationResult) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text('Pay Insights Simulation', 14, 12);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 18);

  let y = 24;
  const sections = [
    mapSection('CTC Structure', result.ctcStructure),
    mapSection('Monthly Gross Calculation', result.monthlyGrossCalculation),
    mapSection('Deductions / Salary Before Tax', result.deductions),
    mapSection('Net Salary', result.netSalary)
  ];

  sections.forEach((section) => {
    autoTable(doc, {
      startY: y,
      head: [[section.title, 'Annual', 'Monthly']],
      body: section.body,
      theme: 'grid',
      headStyles: { fillColor: [19, 40, 74] }
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  });

  autoTable(doc, {
    startY: y,
    head: [['Detailed Tax Calculation', 'Amount']],
    body: [
      ['Taxable Income', result.tax.taxableIncome.toFixed(2)],
      ...result.tax.slabTaxes.map((s) => [s.label, s.amount.toFixed(2)]),
      ['Total Slab Tax', result.tax.totalSlabTax.toFixed(2)],
      ['Rebate', result.tax.rebate.toFixed(2)],
      ['Surcharge', result.tax.surcharge.toFixed(2)],
      ['Marginal Relief', result.tax.marginalRelief.toFixed(2)],
      ['Cess', result.tax.cess.toFixed(2)],
      ['Total Annual Tax', result.tax.totalAnnualTax.toFixed(2)]
    ],
    theme: 'grid'
  });

  const ts = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15);
  doc.save(`pay-insights-simulation-${ts}.pdf`);
}
