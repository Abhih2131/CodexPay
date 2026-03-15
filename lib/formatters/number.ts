/**
 * Display policy:
 * - engine keeps arithmetic at 2-decimal precision via keepTwo in calculation layer
 * - UI/exports show rounded INR values (0 fractional digits) per product requirement
 */
export const roundForDisplay = (value: number) => Math.round(value);

export const formatInr = (value: number, fractionDigits = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(value);

export const formatInrDisplay = (value: number) => formatInr(roundForDisplay(value), 0);

export const formatPercent = (value: number) => `${value.toFixed(2)}%`;

export const formatDateTime = (value: Date) =>
  new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(value);
