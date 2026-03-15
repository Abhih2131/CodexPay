export function getMonthsInYear(dateOfJoining: string): number {
  const date = new Date(dateOfJoining);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date of joining');
  }

  const fiscalStart = new Date(date.getFullYear(), 3, 1);
  const fiscalEnd = new Date(date.getFullYear() + 1, 2, 31);
  const effectiveDate = date < fiscalStart ? fiscalStart : date;
  if (effectiveDate > fiscalEnd) return 0;

  return (fiscalEnd.getFullYear() - effectiveDate.getFullYear()) * 12 + (fiscalEnd.getMonth() - effectiveDate.getMonth()) + 1;
}
