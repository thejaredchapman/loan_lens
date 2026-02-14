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
    <div className="mb-6">
      <h2 className="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider">Loan Product</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {LOAN_PRODUCTS.map((product) => {
          const isActive = product.id === loanProductId;
          return (
            <button
              key={product.id}
              onClick={() => handleSelect(product)}
              className={`relative p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'border-white/30 bg-white/15 shadow-lg scale-[1.02]'
                  : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className="text-2xl mb-2">{product.icon}</div>
              <div className="text-sm font-semibold text-white">{product.name}</div>
              <div className="text-xs text-white/50 mt-1">{product.defaultRate}% typical</div>
              {isActive && (
                <div
                  className="absolute top-2 right-2 w-2 h-2 rounded-full"
                  style={{ backgroundColor: product.theme.accent }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
