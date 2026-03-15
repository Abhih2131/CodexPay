export const METRO_CITIES = new Set(['Mumbai', 'Delhi', 'Chennai', 'Kolkata']);

export const PT_STATE_RULES: Record<string, number> = {
  Maharashtra: 2500
};

export const STANDARD_DEDUCTION = 75000;
export const CESS_RATE = 0.04;
export const PF_WAGE_CEILING_ANNUAL = 180000;

export const TAX_SLABS = [
  { upTo: 400000, rate: 0 },
  { upTo: 800000, rate: 0.05 },
  { upTo: 1200000, rate: 0.1 },
  { upTo: 1600000, rate: 0.15 },
  { upTo: 2000000, rate: 0.2 },
  { upTo: 2400000, rate: 0.25 },
  { upTo: Infinity, rate: 0.3 }
];

export const SURCHARGE_THRESHOLDS = [
  { threshold: 5000000, rate: 0.1 },
  { threshold: 10000000, rate: 0.15 },
  { threshold: 20000000, rate: 0.25 }
];
