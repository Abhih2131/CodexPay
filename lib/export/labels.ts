import { SimulationInput } from '@/types/simulation';

export const SECTION_LABELS = {
  ctcStructure: {
    basic: 'Basic',
    hra: 'HRA',
    employerPf: 'Employer PF',
    gratuity: 'Gratuity',
    otherAllowance: 'Other Allowance',
    fixedCtc: 'Fixed CTC',
    variablePay: 'Variable Pay',
    totalCtc: 'Total CTC'
  },
  monthlyGrossCalculation: {
    basic: 'Basic',
    hra: 'HRA',
    otherAllowance: 'Other Allowance',
    grossSalary: 'Gross Salary'
  },
  deductions: {
    grossSalary: 'Gross Salary',
    employeePf: 'Employee PF',
    professionalTax: 'Professional Tax',
    salaryBeforeTax: 'Salary Before Tax'
  },
  netSalary: {
    salaryBeforeTax: 'Salary Before Tax',
    totalTax: 'Total Tax',
    netSalary: 'Net Salary / In-hand'
  }
} as const;

export const INPUT_LABELS: Record<keyof SimulationInput, string> = {
  annualFixedCtc: 'Annual Fixed CTC',
  annualVariablePay: 'Annual Variable Pay',
  dateOfJoining: 'Date of Joining',
  state: 'State',
  city: 'City',
  basicCalculationMethod: 'Basic Calculation Method',
  basicPercentage: 'Basic Percentage',
  hraPercentage: 'HRA Percentage',
  pfApplicability: 'PF Applicability',
  pfCalculationBasis: 'PF Calculation Basis',
  variablePayPayoutTiming: 'Variable Pay Payout Timing',
  taxRegime: 'Tax Regime',
  professionalTaxApplicability: 'Professional Tax Applicability',
  roundingMethod: 'Rounding Method'
};

export function mapSectionRows(
  section: Record<string, { annual: number; monthly: number }>,
  labels: Record<string, string>
) {
  return Object.entries(section).map(([key, value]) => ({
    label: labels[key] ?? key,
    annual: value.annual,
    monthly: value.monthly
  }));
}
