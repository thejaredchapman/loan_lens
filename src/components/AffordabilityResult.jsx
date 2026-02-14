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
    <div className="rounded-xl bg-white/5 border border-white/10 p-5 mb-6 backdrop-blur-sm">
      <h3 className="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider">
        What You Can Afford
      </h3>
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-white">{formatCurrency(maxPrice)}</div>
        <div className="text-sm text-white/50 mt-1">
          maximum {product?.id === 'home' ? 'property price' : 'loan amount'}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
        <div className="text-center">
          <div className="text-xs text-white/40 mb-1">Monthly Budget</div>
          <div className="text-sm font-semibold text-white">{formatCurrencyDetailed(monthlyBudget)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-white/40 mb-1">Down Payment Needed</div>
          <div className="text-sm font-semibold text-white">
            {formatCurrency(maxPrice * downPaymentPercent / 100)}
          </div>
        </div>
      </div>
    </div>
  );
}
