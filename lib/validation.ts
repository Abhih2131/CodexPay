import { z } from 'zod';

export const inputSchema = z
  .object({
    annualFixedCtc: z.number().positive('Fixed CTC must be greater than zero'),
    annualVariablePay: z.number().min(0, 'Variable pay cannot be negative'),
    dateOfJoining: z.string().min(1, 'Date of joining is required'),
    state: z.string().min(1, 'State is required'),
    city: z.string().min(1, 'City is required'),
    basicCalculationMethod: z.enum(['fixed_ctc', 'gross']),
    basicPercentage: z.number().min(1).max(90),
    hraPercentage: z.number().min(1).max(90),
    pfApplicability: z.enum(['yes', 'no']),
    pfCalculationBasis: z.enum(['actual_basic', 'statutory_ceiling']).optional(),
    variablePayPayoutTiming: z.enum(['annual', 'quarterly', 'monthly', 'separate']),
    taxRegime: z.literal('new'),
    professionalTaxApplicability: z.enum(['auto', 'yes', 'no']),
    roundingMethod: z.literal('2_decimals_internal')
  })
  .superRefine((data, ctx) => {
    if (data.pfApplicability === 'yes' && !data.pfCalculationBasis) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['pfCalculationBasis'], message: 'PF basis is required when PF is Yes' });
    }
  });
