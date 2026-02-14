import { formatCurrencyDetailed, formatCurrency } from '../utils/formatters';

export default function AmortizationResults({ piti, product }) {
  if (!piti) return null;

  const items = [
    { label: 'Principal & Interest', value: piti.monthlyPrincipalAndInterest, color: product.theme.accent },
  ];

  if (product.includesTax && piti.monthlyTax > 0) {
    items.push({ label: 'Property Tax', value: piti.monthlyTax, color: '#f59e0b' });
  }
  if (product.includesInsurance && piti.monthlyInsurance > 0) {
    items.push({ label: 'Insurance', value: piti.monthlyInsurance, color: '#10b981' });
  }
  if (piti.monthlyPMI > 0) {
    items.push({ label: 'PMI', value: piti.monthlyPMI, color: '#f43f5e' });
  }

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-5 mb-6 backdrop-blur-sm">
      <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">
        Monthly Payment Breakdown
      </h3>

      <div className="text-center mb-5">
        <div className="text-4xl font-bold text-white">{formatCurrencyDetailed(piti.totalMonthly)}</div>
        <div className="text-sm text-white/50 mt-1">per month</div>
      </div>

      <div className="space-y-2 mb-5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-white/70">{item.label}</span>
            </div>
            <span className="text-sm font-medium text-white">{formatCurrencyDetailed(item.value)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
        <div className="text-center">
          <div className="text-xs text-white/40 mb-1">Down Payment</div>
          <div className="text-sm font-semibold text-white">{formatCurrency(piti.downPayment)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-white/40 mb-1">Loan Amount</div>
          <div className="text-sm font-semibold text-white">{formatCurrency(piti.loanAmount)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-white/40 mb-1">Total Interest</div>
          <div className="text-sm font-semibold text-white">{formatCurrency(piti.totalInterest)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-white/40 mb-1">Total Cost</div>
          <div className="text-sm font-semibold text-white">{formatCurrency(piti.totalCost)}</div>
        </div>
      </div>
    </div>
  );
}
