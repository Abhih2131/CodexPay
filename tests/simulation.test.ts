import { describe, expect, test } from 'vitest';
import { calculateGratuity } from '@/lib/calculations/gratuity';
import { calculatePf } from '@/lib/calculations/pf';
import { calculateProfessionalTax } from '@/lib/calculations/professionalTax';
import { calculateTax } from '@/lib/calculations/taxEngine';
import { runSimulation } from '@/lib/calculations/simulation';
import { buildExportPayload } from '@/lib/export/exportData';
import { SimulationInput } from '@/types/simulation';

const benchmark: SimulationInput = {
  annualFixedCtc: 6000000,
  annualVariablePay: 0,
  dateOfJoining: '2026-04-01',
  state: 'Maharashtra',
  city: 'Mumbai',
  basicCalculationMethod: 'fixed_ctc',
  basicPercentage: 50,
  hraPercentage: 50,
  pfApplicability: 'yes',
  pfCalculationBasis: 'actual_basic',
  variablePayPayoutTiming: 'annual',
  taxRegime: 'new',
  professionalTaxApplicability: 'auto',
  roundingMethod: '2_decimals_internal'
};

describe('pay insights engine', () => {
  test('fixed CTC composition and total CTC integrity', () => {
    const result = runSimulation(benchmark);
    const composed = result.ctcStructure.basic.annual + result.ctcStructure.hra.annual + result.ctcStructure.employerPf.annual + result.ctcStructure.gratuity.annual + result.ctcStructure.otherAllowance.annual;
    expect(composed).toBeCloseTo(6000000, 1);
    expect(result.ctcStructure.totalCtc.annual).toBe(6000000);
    expect(result.summary.totalCtc).toBe(6000000);
  });

  test('PF actual vs ceiling basis', () => {
    expect(calculatePf(3000000, true, 'actual_basic').employeePf).toBe(360000);
    expect(calculatePf(3000000, true, 'statutory_ceiling').employeePf).toBe(21600);
  });

  test('gratuity formula', () => {
    expect(calculateGratuity(1200000)).toBeCloseTo(57692.307, 2);
  });

  test('Maharashtra PT support', () => {
    expect(calculateProfessionalTax('Maharashtra', 'auto')).toBe(2500);
  });

  test('tax slabs, rebate, surcharge, marginal relief, cess', () => {
    const low = calculateTax(600000);
    expect(low.rebate).toBeGreaterThan(0);
    const near50L = calculateTax(5001000);
    expect(near50L.surcharge).toBeGreaterThan(0);
    expect(near50L.marginalRelief).toBeGreaterThanOrEqual(0);
    const near1Cr = calculateTax(10001000);
    expect(near1Cr.surcharge).toBeGreaterThan(near50L.surcharge);
    const near2Cr = calculateTax(20001000);
    expect(near2Cr.surcharge).toBeGreaterThan(near1Cr.surcharge);
    expect(near2Cr.cess).toBeGreaterThan(0);
  });

  test('variable payout timing behavior', () => {
    const monthly = runSimulation({ ...benchmark, annualVariablePay: 1200000, variablePayPayoutTiming: 'monthly' });
    const separate = runSimulation({ ...benchmark, annualVariablePay: 1200000, variablePayPayoutTiming: 'separate' });
    expect(monthly.variablePayout.includedInMonthlyInHand).toBe(true);
    expect(monthly.summary.monthlyNetSalary).toBeGreaterThan(separate.summary.monthlyNetSalary);
  });

  test('monthly and annual output consistency + export mapping', () => {
    const result = runSimulation(benchmark);
    expect(result.ctcStructure.fixedCtc.monthly * 12).toBeCloseTo(result.ctcStructure.fixedCtc.annual, 0);
    const payload = buildExportPayload(result);
    expect(payload.summary.totalCtc).toBe(result.summary.totalCtc);
    expect(payload.sections.ctcStructure.totalCtc.annual).toBe(result.ctcStructure.totalCtc.annual);
  });
});
