export type BasicCalculationMethod = 'fixed_ctc' | 'gross';
export type PfApplicability = 'yes' | 'no';
export type PfCalculationBasis = 'actual_basic' | 'statutory_ceiling';
export type VariablePayPayoutTiming = 'annual' | 'quarterly' | 'monthly' | 'separate';
export type TaxRegime = 'new';
export type ProfessionalTaxApplicability = 'auto' | 'yes' | 'no';

export interface SimulationInput {
  annualFixedCtc: number;
  annualVariablePay: number;
  dateOfJoining: string;
  state: string;
  city: string;
  basicCalculationMethod: BasicCalculationMethod;
  basicPercentage: number;
  hraPercentage: number;
  pfApplicability: PfApplicability;
  pfCalculationBasis?: PfCalculationBasis;
  variablePayPayoutTiming: VariablePayPayoutTiming;
  taxRegime: TaxRegime;
  professionalTaxApplicability: ProfessionalTaxApplicability;
  roundingMethod: '2_decimals_internal';
}

export interface CurrencyPair { annual: number; monthly: number; }

export interface TaxBreakdown {
  taxableIncome: number;
  slabTaxes: Array<{ label: string; amount: number }>;
  totalSlabTax: number;
  rebate: number;
  surcharge: number;
  marginalRelief: number;
  cess: number;
  totalAnnualTax: number;
  monthlyTds: number;
}

export interface SimulationResult {
  inputs: SimulationInput;
  monthsInYear: number;
  ctcStructure: {
    basic: CurrencyPair;
    hra: CurrencyPair;
    employerPf: CurrencyPair;
    gratuity: CurrencyPair;
    otherAllowance: CurrencyPair;
    fixedCtc: CurrencyPair;
    variablePay: CurrencyPair;
    totalCtc: CurrencyPair;
  };
  monthlyGrossCalculation: {
    basic: CurrencyPair;
    hra: CurrencyPair;
    otherAllowance: CurrencyPair;
    grossSalary: CurrencyPair;
  };
  deductions: {
    grossSalary: CurrencyPair;
    employeePf: CurrencyPair;
    professionalTax: CurrencyPair;
    salaryBeforeTax: CurrencyPair;
  };
  tax: TaxBreakdown;
  netSalary: {
    salaryBeforeTax: CurrencyPair;
    totalTax: CurrencyPair;
    netSalary: CurrencyPair;
  };
  variablePayout: {
    annual: number;
    monthlyEquivalent: number;
    quarterlyEquivalent: number;
    includedInMonthlyInHand: boolean;
  };
  summary: {
    totalCtc: number;
    monthlyGross: number;
    monthlyNetSalary: number;
    annualTax: number;
  };
  notes: string[];
}
