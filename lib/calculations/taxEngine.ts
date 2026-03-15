import { CESS_RATE, STANDARD_DEDUCTION, SURCHARGE_THRESHOLDS, TAX_SLABS } from '../config/constants';
import { keepTwo } from './rounding';
import { TaxBreakdown } from '@/types/simulation';

const getRebate = (taxableIncome: number, slabTax: number) => (taxableIncome <= 1200000 ? Math.min(60000, slabTax) : 0);

function getSurchargeRate(taxableIncome: number) {
  let rate = 0;
  for (const item of SURCHARGE_THRESHOLDS) {
    if (taxableIncome > item.threshold) rate = item.rate;
  }
  return rate;
}

function calculateSlabTax(taxableIncome: number) {
  let previous = 0;
  let total = 0;
  const slabTaxes: Array<{ label: string; amount: number }> = [];

  TAX_SLABS.forEach((slab) => {
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
  });

  return { total: keepTwo(total), slabTaxes };
}

function calculateMarginalRelief(taxableIncome: number, taxAfterSurcharge: number) {
  const threshold = SURCHARGE_THRESHOLDS.find((s) => taxableIncome > s.threshold);
  if (!threshold) return 0;
  const excessIncome = taxableIncome - threshold.threshold;
  const taxAtThreshold = calculateSlabTax(threshold.threshold).total;
  const maxTax = taxAtThreshold + excessIncome;
  return keepTwo(Math.max(0, taxAfterSurcharge - maxTax));
}

export function calculateTax(salaryBeforeTaxAnnual: number): TaxBreakdown {
  const taxableIncome = Math.max(0, salaryBeforeTaxAnnual - STANDARD_DEDUCTION);
  const slabs = calculateSlabTax(taxableIncome);
  const rebate = getRebate(taxableIncome, slabs.total);
  const taxAfterRebate = Math.max(0, slabs.total - rebate);
  const surchargeRate = getSurchargeRate(taxableIncome);
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
