import { PT_STATE_RULES } from '../config/constants';

export function calculateProfessionalTax(state: string, applicability: 'auto' | 'yes' | 'no'): number {
  if (applicability === 'no') return 0;
  if (applicability === 'yes') return PT_STATE_RULES[state] ?? 2500;
  return PT_STATE_RULES[state] ?? 0;
}
