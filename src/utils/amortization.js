/**
 * Core amortization math functions.
 */

export function calculateMonthlyPayment(principal, annualRate, termYears) {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;

  if (monthlyRate === 0) {
    return principal / numPayments;
  }

  const factor = Math.pow(1 + monthlyRate, numPayments);
  return principal * (monthlyRate * factor) / (factor - 1);
}

export function calculatePITI({
  propertyPrice,
  downPaymentPercent,
  annualRate,
  termYears,
  annualPropertyTaxRate = 0,
  annualInsurance = 0,
  pmiRate = 0.5,
  includesTax = true,
  includesInsurance = true,
  includesPMI = true,
}) {
  const downPayment = propertyPrice * (downPaymentPercent / 100);
  const loanAmount = propertyPrice - downPayment;
  const monthlyPI = calculateMonthlyPayment(loanAmount, annualRate, termYears);
  const monthlyTax = includesTax ? (propertyPrice * annualPropertyTaxRate / 100) / 12 : 0;
  const monthlyInsurance = includesInsurance ? annualInsurance / 12 : 0;
  const monthlyPMI = includesPMI && downPaymentPercent < 20
    ? (loanAmount * pmiRate / 100) / 12
    : 0;

  const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI;

  return {
    downPayment,
    loanAmount,
    monthlyPrincipalAndInterest: monthlyPI,
    monthlyTax,
    monthlyInsurance,
    monthlyPMI,
    totalMonthly,
    totalInterest: (monthlyPI * termYears * 12) - loanAmount,
    totalCost: (monthlyPI * termYears * 12) + downPayment,
    numPayments: termYears * 12,
  };
}

export function generateAmortizationSchedule(principal, annualRate, termYears) {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termYears);
  let balance = principal;
  const schedule = [];
  let cumulativeInterest = 0;

  for (let month = 1; month <= numPayments; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    cumulativeInterest += interestPayment;

    schedule.push({
      month,
      payment: monthlyPayment,
      principalPayment,
      interestPayment,
      remainingBalance: Math.max(0, balance),
      cumulativeInterest,
    });
  }

  return schedule;
}
