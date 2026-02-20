import { useStore } from '../store/useStore';
import { LOAN_PRODUCTS } from '../data/loanProducts';
import CitySelector from './CitySelector';

export default function SalarySearchForm() {
  const {
    loanProductId, annualSalary, dtiRatio,
    setAnnualSalary, setDtiRatio, interestRate, loanTerm, downPaymentPercent,
    setInterestRate, setLoanTerm, setDownPaymentPercent,
  } = useStore();

  const product = LOAN_PRODUCTS.find((p) => p.id === loanProductId);

  return (
    <div className="relative z-20 rounded-xl bg-white/5 border border-white/10 p-5 mb-6 backdrop-blur-sm">
      <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">
        Salary & Budget
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-white/50 mb-1">Annual Gross Salary</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
            <input
              type="number"
              value={annualSalary}
              onChange={(e) => setAnnualSalary(Number(e.target.value))}
              className="w-full pl-7 pr-3 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white text-sm outline-none focus:border-white/30 transition"
              min={0}
              step={5000}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-white/50 mb-1">Max DTI Ratio (%)</label>
          <input
            type="number"
            value={dtiRatio}
            onChange={(e) => setDtiRatio(Number(e.target.value))}
            className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white text-sm outline-none focus:border-white/30 transition"
            min={10}
            max={50}
            step={1}
          />
        </div>

        <div>
          <label className="block text-xs text-white/50 mb-1">Interest Rate (%)</label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white text-sm outline-none focus:border-white/30 transition"
            min={0}
            max={30}
            step={0.125}
          />
        </div>

        <div>
          <label className="block text-xs text-white/50 mb-1">Loan Term</label>
          <select
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white text-sm outline-none focus:border-white/30 transition cursor-pointer appearance-none"
          >
            {product.terms.map((t) => (
              <option key={t} value={t} className="bg-slate-800">
                {t} {t === 1 ? 'year' : 'years'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-white/50 mb-1">Down Payment (%)</label>
          <input
            type="number"
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white text-sm outline-none focus:border-white/30 transition"
            min={product.minDownPaymentPercent}
            max={100}
            step={1}
          />
        </div>

        {product.id === 'home' && <CitySelector />}
      </div>
    </div>
  );
}
