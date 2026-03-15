import { CESS_RATE, STANDARD_DEDUCTION, SURCHARGE_THRESHOLDS, TAX_SLABS } from '../config/constants';
import { keepTwo } from './rounding';
import { TaxBreakdown } from '@/types/simulation';

const getRebate = (taxableIncome: number, slabTax: number) => (taxableIncome <= 1200000 ? Math.min(60000, slabTax) : 0);

function getApplicableSurchargeThreshold(taxableIncome: number) {
  let applicable: { threshold: number; rate: number } | null = null;
  for (const threshold of SURCHARGE_THRESHOLDS) {
    if (taxableIncome > threshold.threshold) {
      applicable = threshold;
    }
  }
  return applicable;
}

function calculateSlabTax(taxableIncome: number) {
  let previous = 0;
  let total = 0;
  const slabTaxes: Array<{ label: string; amount: number }> = [];

  for (const slab of TAX_SLABS) {
    const upper = slab.upTo;
    const taxableAtThisBand = Math.max(0, Math.min(taxableIncome, upper) - previous);
    const amount = keepTwo(taxableAtThisBand * slab.rate);
    if (taxableAtThisBand > 0) {
      slabTaxes.push({
        label: upper === Infinity ? `Above ₹${previous.toLocaleString('en-IN')}` : `₹${(previous + 1).toLocaleString('en-IN')} - ₹${upper.toLocaleString('en-IN')}`,
        amount
      });
    }
    total += amount;
    previous = upper;
  }

  return { total: keepTwo(total), slabTaxes };
}

/**
 * Marginal relief rule:
 * tax liability after surcharge must not exceed (tax at threshold + income above threshold).
 * This is applied at the currently active surcharge threshold (50L/1Cr/2Cr bands).
 */
function calculateMarginalRelief(taxableIncome: number, taxAfterSurcharge: number) {
  const applicableThreshold = getApplicableSurchargeThreshold(taxableIncome);
  if (!applicableThreshold) return 0;

  const excessIncome = taxableIncome - applicableThreshold.threshold;
  const taxAtThreshold = calculateSlabTax(applicableThreshold.threshold).total;
  const maxTaxAfterRelief = taxAtThreshold + excessIncome;

  return keepTwo(Math.max(0, taxAfterSurcharge - maxTaxAfterRelief));
}

export function calculateTax(salaryBeforeTaxAnnual: number): TaxBreakdown {
  const taxableIncome = Math.max(0, salaryBeforeTaxAnnual - STANDARD_DEDUCTION);
  const slabs = calculateSlabTax(taxableIncome);
  const rebate = getRebate(taxableIncome, slabs.total);
  const taxAfterRebate = Math.max(0, slabs.total - rebate);
  const surchargeThreshold = getApplicableSurchargeThreshold(taxableIncome);
  const surchargeRate = surchargeThreshold?.rate ?? 0;
  const surcharge = keepTwo(taxAfterRebate * surchargeRate);
  const taxWithSurcharge = taxAfterRebate + surcharge;
  const marginalRelief = calculateMarginalRelief(taxableIncome, taxWithSurcharge);
  const afterRelief = Math.max(0, taxWithSurcharge - marginalRelief);
  const cess = keepTwo(afterRelief * CESS_RATE);
  const totalAnnualTax = keepTwo(afterRelief + cess);

  return {
    taxableIncome: keepTwo(taxableIncome),
    slabTaxes: slabs.slabTaxes,
    totalSlabTax: slabs.total,
    rebate: keepTwo(rebate),
    surcharge,
    marginalRelief,
    cess,
    totalAnnualTax,
    monthlyTds: keepTwo(totalAnnualTax / 12)
  };
}
