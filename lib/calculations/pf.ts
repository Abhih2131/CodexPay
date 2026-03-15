import { PF_WAGE_CEILING_ANNUAL } from '../config/constants';

export function calculatePf(baseBasic: number, isApplicable: boolean, basis: 'actual_basic' | 'statutory_ceiling' | undefined) {
  if (!isApplicable) return { employeePf: 0, employerPf: 0, pfWage: 0 };
  const pfWage = basis === 'statutory_ceiling' ? Math.min(baseBasic, PF_WAGE_CEILING_ANNUAL) : baseBasic;
  const pf = pfWage * 0.12;
  return { employeePf: pf, employerPf: pf, pfWage };
}
