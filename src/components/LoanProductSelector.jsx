import { useStore } from '../store/useStore';
import { LOAN_PRODUCTS } from '../data/loanProducts';

export default function LoanProductSelector() {
  const { loanProductId, setLoanProduct, setInterestRate, setLoanTerm, setDownPaymentPercent } = useStore();

  const handleSelect = (product) => {
    setLoanProduct(product.id);
    setInterestRate(product.defaultRate);
    setLoanTerm(product.defaultTerm);
    setDownPaymentPercent(product.defaultDownPaymentPercent);
  };

  return (
    <section className="mb-8 rise">
      <h2 className="kicker mb-3">Choose a loan</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 border-[1.5px] border-ink bg-card" role="radiogroup" aria-label="Loan product">
        {LOAN_PRODUCTS.map((product, i) => {
          const isActive = product.id === loanProductId;
          return (
            <button
              key={product.id}
              role="radio"
              aria-checked={isActive}
              onClick={() => handleSelect(product)}
              style={isActive ? { background: product.theme.primary } : undefined}
              className={`text-left p-4 cursor-pointer transition-colors border-ink ${i % 2 === 1 ? 'border-l-[1.5px]' : ''} ${i > 0 ? 'md:border-l-[1.5px]' : ''} ${i > 1 ? 'border-t-[1.5px] md:border-t-0' : ''} ${
                isActive ? 'text-paper' : 'hover:bg-paper'
              }`}
            >
              <div className={`num text-xs ${isActive ? 'text-gold' : 'text-muted'}`}>{product.icon}</div>
              <div className="display text-xl font-semibold mt-3 leading-tight">{product.name}</div>
              <div className={`num text-xs mt-1 ${isActive ? 'text-paper/70' : 'text-muted'}`}>{product.defaultRate}% typical</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
