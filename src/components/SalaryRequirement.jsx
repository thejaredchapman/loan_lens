import { formatCurrency } from '../utils/formatters';
import { calculateRequiredSalary } from '../utils/affordability';

export default function SalaryRequirement({ totalMonthly, maxDTI }) {
  if (!totalMonthly || totalMonthly <= 0) return null;

  const requiredSalary = calculateRequiredSalary(totalMonthly, maxDTI);

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-5 mb-6 backdrop-blur-sm">
      <h3 className="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider">
        Salary Requirement
      </h3>
      <div className="text-center">
        <div className="text-3xl font-bold text-white">{formatCurrency(requiredSalary)}</div>
        <div className="text-sm text-white/50 mt-1">minimum annual gross salary needed</div>
        <div className="text-xs text-white/30 mt-2">
          Based on {maxDTI}% debt-to-income ratio (industry standard: housing costs ≤ {maxDTI}% of gross income)
        </div>
      </div>
    </div>
  );
}
