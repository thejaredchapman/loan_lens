import { formatCurrencyDetailed, formatCurrency } from '../utils/formatters';
import { COMPONENT_COLORS } from '../data/chartColors';


export default function AmortizationResults({ piti, product }) {
  if (!piti) return null;

  const items = [{ label: 'Principal & interest', value: piti.monthlyPrincipalAndInterest, color: COMPONENT_COLORS.pi }];
  if (product.includesTax && piti.monthlyTax > 0) items.push({ label: 'Property tax', value: piti.monthlyTax, color: COMPONENT_COLORS.tax });
  if (product.includesInsurance && piti.monthlyInsurance > 0) items.push({ label: 'Insurance', value: piti.monthlyInsurance, color: COMPONENT_COLORS.ins });
  if (piti.monthlyPMI > 0) items.push({ label: 'PMI', value: piti.monthlyPMI, color: COMPONENT_COLORS.pmi });

  const stats = [
    ['Down payment', formatCurrency(piti.downPayment)],
    ['Loan amount', formatCurrency(piti.loanAmount)],
    ['Total interest', formatCurrency(piti.totalInterest)],
    ['Total cost', formatCurrency(piti.totalCost)],
  ];

  return (
    <section className="panel lg:col-span-3 rise" style={{ '--i': 3 }}>
      <h3 className="kicker mb-4">Monthly payment</h3>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="display text-6xl sm:text-7xl font-extrabold text-[var(--accent)] leading-none">
          {formatCurrencyDetailed(piti.totalMonthly)}
        </span>
        <span className="text-muted text-sm">/ month</span>
      </div>

      <dl className="mt-6 border-t border-ink">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-rule">
            <dt className="flex items-center gap-3 text-sm">
              <span className="w-3 h-3" style={{ background: item.color }} />
              {item.label}
            </dt>
            <dd className="num text-sm font-medium">{formatCurrencyDetailed(item.value)}</dd>
          </div>
        ))}
      </dl>

      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {stats.map(([k, v]) => (
          <div key={k}>
            <dt className="field-label !mb-1">{k}</dt>
            <dd className="num text-base font-medium">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
