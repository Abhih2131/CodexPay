import { SimulationInput } from '@/types/simulation';
import { keepTwo } from './rounding';
import { calculatePf } from './pf';
import { calculateGratuity } from './gratuity';

export function calculateSalaryStructure(input: SimulationInput) {
  const baseForBasic = input.annualFixedCtc;
  let basic = keepTwo(baseForBasic * (input.basicPercentage / 100));

  if (input.basicCalculationMethod === 'gross') {
    const grossApprox = input.annualFixedCtc * 0.8;
    basic = keepTwo(grossApprox * (input.basicPercentage / 100));
  }

  const hra = keepTwo(basic * (input.hraPercentage / 100));
  const pf = calculatePf(basic, input.pfApplicability === 'yes', input.pfCalculationBasis);
  const gratuity = keepTwo(calculateGratuity(basic));
  const otherAllowance = keepTwo(input.annualFixedCtc - (basic + hra + pf.employerPf + gratuity));

  return {
    basic,
    hra,
    employerPf: pf.employerPf,
    employeePf: pf.employeePf,
    gratuity,
    otherAllowance,
    grossSalary: keepTwo(basic + hra + otherAllowance)
  };
}
