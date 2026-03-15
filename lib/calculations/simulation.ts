import { METRO_CITIES } from '../config/constants';
import { calculateProfessionalTax } from './professionalTax';
import { calculateSalaryStructure } from './salaryStructure';
import { calculateTax } from './taxEngine';
import { keepTwo } from './rounding';
import { SimulationInput, SimulationResult } from '@/types/simulation';
import { getMonthsInYear } from './annualization';

const pair = (annual: number) => ({ annual: keepTwo(annual), monthly: keepTwo(annual / 12) });

export function deriveDefaultHra(city: string): number {
  return METRO_CITIES.has(city) ? 50 : 40;
}

export function runSimulation(input: SimulationInput): SimulationResult {
  const monthsInYear = getMonthsInYear(input.dateOfJoining);
  const structure = calculateSalaryStructure(input);
  const professionalTax = calculateProfessionalTax(input.state, input.professionalTaxApplicability);
  const salaryBeforeTax = keepTwo(structure.grossSalary - structure.employeePf - professionalTax);
  const tax = calculateTax(salaryBeforeTax);
  const netAnnual = keepTwo(salaryBeforeTax - tax.totalAnnualTax);
  const variableMonthly = input.variablePayPayoutTiming === 'monthly' ? input.annualVariablePay / 12 : 0;

  const variablePayout = {
    annual: input.annualVariablePay,
    monthlyEquivalent: variableMonthly,
    quarterlyEquivalent: input.variablePayPayoutTiming === 'quarterly' ? input.annualVariablePay / 4 : 0,
    includedInMonthlyInHand: input.variablePayPayoutTiming === 'monthly'
  };

  return {
    inputs: input,
    monthsInYear,
    ctcStructure: {
      basic: pair(structure.basic),
      hra: pair(structure.hra),
      employerPf: pair(structure.employerPf),
      gratuity: pair(structure.gratuity),
      otherAllowance: pair(structure.otherAllowance),
      fixedCtc: pair(input.annualFixedCtc),
      variablePay: pair(input.annualVariablePay),
      totalCtc: pair(input.annualFixedCtc + input.annualVariablePay)
    },
    monthlyGrossCalculation: {
      basic: pair(structure.basic),
      hra: pair(structure.hra),
      otherAllowance: pair(structure.otherAllowance),
      grossSalary: pair(structure.grossSalary)
    },
    deductions: {
      grossSalary: pair(structure.grossSalary),
      employeePf: pair(structure.employeePf),
      professionalTax: pair(professionalTax),
      salaryBeforeTax: pair(salaryBeforeTax)
    },
    tax,
    netSalary: {
      salaryBeforeTax: pair(salaryBeforeTax),
      totalTax: pair(tax.totalAnnualTax),
      netSalary: pair(netAnnual)
    },
    variablePayout,
    summary: {
      totalCtc: keepTwo(input.annualFixedCtc + input.annualVariablePay),
      monthlyGross: keepTwo(structure.grossSalary / 12),
      monthlyNetSalary: keepTwo(netAnnual / 12 + variableMonthly),
      annualTax: tax.totalAnnualTax
    },
    notes: [
      'Variable pay is kept separate from regular monthly in-hand unless Monthly payout timing is selected.',
      monthsInYear < 12 ? `Date of joining results in ${monthsInYear} months in fiscal year for annualization context.` : 'Full-year assumptions applied.'
    ]
  };
}
