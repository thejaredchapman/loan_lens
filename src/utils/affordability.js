/**
 * Salary-to-affordability and affordability-to-salary calculations.
 * Uses the 28/36 rule for housing qualification.
 */

export function calculateRequiredSalary(totalMonthlyPayment, maxDTIPercent = 28) {
  const grossMonthlyIncome = totalMonthlyPayment / (maxDTIPercent / 100);
  return grossMonthlyIncome * 12;
}

export function calculateMaxAffordablePrice({
  annualSalary,
  maxDTIPercent = 28,
  annualRate,
  termYears,
  downPaymentPercent,
  annualPropertyTaxRate = 0,
  annualInsurance = 0,
  pmiRate = 0.5,
  includesTax = true,
  includesInsurance = true,
  includesPMI = true,
}) {
  const grossMonthlyIncome = annualSalary / 12;
  const maxTotalMonthly = grossMonthlyIncome * (maxDTIPercent / 100);

  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;

  if (monthlyRate === 0) {
    const L = 1 - downPaymentPercent / 100;
    const taxFactor = includesTax ? annualPropertyTaxRate / 100 / 12 : 0;
    const monthlyInsurance = includesInsurance ? annualInsurance / 12 : 0;
    const simpleFactor = L / numPayments + taxFactor;
    if (simpleFactor <= 0) return 0;
    return Math.max(0, Math.floor((maxTotalMonthly - monthlyInsurance) / simpleFactor));
  }

  const factor = Math.pow(1 + monthlyRate, numPayments);
  const paymentFactor = (monthlyRate * factor) / (factor - 1);

  const L = 1 - downPaymentPercent / 100;
  const taxFactor = includesTax ? annualPropertyTaxRate / 100 / 12 : 0;
  const pmiFactor = (includesPMI && downPaymentPercent < 20) ? (pmiRate / 100 / 12) : 0;
  const monthlyInsurance = includesInsurance ? annualInsurance / 12 : 0;

  const denominator = L * paymentFactor + taxFactor + L * pmiFactor;
  if (denominator <= 0) return 0;

  const maxPropertyPrice = (maxTotalMonthly - monthlyInsurance) / denominator;
  return Math.max(0, Math.floor(maxPropertyPrice));
}

export function calculateMaxMonthlyBudget(annualSalary, maxDTIPercent = 28) {
  return (annualSalary / 12) * (maxDTIPercent / 100);
}
