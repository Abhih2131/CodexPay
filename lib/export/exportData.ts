import { SimulationResult } from '@/types/simulation';

export function buildExportPayload(result: SimulationResult) {
  return {
    timestamp: new Date().toISOString(),
    inputs: result.inputs,
    summary: result.summary,
    sections: {
      ctcStructure: result.ctcStructure,
      monthlyGrossCalculation: result.monthlyGrossCalculation,
      deductions: result.deductions,
      tax: result.tax,
      netSalary: result.netSalary
    }
  };
}
