import { formatCurrency, formatCurrencyDetailed } from '../utils/formatters';
import { calculateMaxAffordablePrice, calculateMaxMonthlyBudget } from '../utils/affordability';

export default function AffordabilityResult({
  annualSalary, dtiRatio, interestRate, loanTerm, downPaymentPercent,
  city, product,
}) {
  if (!annualSalary || annualSalary <= 0) return null;

  const maxPrice = calculateMaxAffordablePrice({
    annualSalary,
    maxDTIPercent: dtiRatio,
    annualRate: interestRate,
    termYears: loanTerm,
    downPaymentPercent,
    annualPropertyTaxRate: city?.propertyTaxRate || 0,
    annualInsurance: city?.avgHomeInsuranceAnnual || 0,
    pmiRate: product?.pmiRate || 0.5,
    includesTax: product?.includesTax || false,
    includesInsurance: product?.includesInsurance || false,
    includesPMI: product?.includesPMI || false,
  });

  const monthlyBudget = calculateMaxMonthlyBudget(annualSalary, dtiRatio);

  return (
    <section className="panel rise" style={{ '--i': 3 }}>
      <h3 className="kicker mb-4">What you can afford</h3>
      <div className="flex flex-wrap items-baseline gap-x-3">
        <span className="display text-6xl sm:text-7xl font-extrabold text-[var(--accent)] leading-none">{formatCurrency(maxPrice)}</span>
        <span className="text-muted text-sm">maximum {product?.id === 'home' ? 'property price' : 'loan amount'}</span>
      </div>
      <dl className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-ink">
        <div>
          <dt className="field-label !mb-1">Monthly budget</dt>
          <dd className="num text-base font-medium">{formatCurrencyDetailed(monthlyBudget)}</dd>
        </div>
        <div>
          <dt className="field-label !mb-1">Down payment needed</dt>
          <dd className="num text-base font-medium">{formatCurrency(maxPrice * downPaymentPercent / 100)}</dd>
        </div>
      </dl>
    </section>
  );
}
