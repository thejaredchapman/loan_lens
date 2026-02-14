import { useState } from 'react';
import { formatCurrencyDetailed } from '../utils/formatters';

export default function AmortizationSchedule({ schedule }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!schedule || schedule.length === 0) return null;

  const displayRows = isExpanded ? schedule : schedule.slice(0, 12);

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-5 mb-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">
          Amortization Schedule
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-white/40 hover:text-white/70 transition cursor-pointer"
        >
          {isExpanded ? 'Show less' : `Show all ${schedule.length} months`}
        </button>
      </div>

      <div className="overflow-x-auto schedule-scroll">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-white/40 text-xs border-b border-white/10">
              <th className="pb-2 text-left font-medium">Month</th>
              <th className="pb-2 text-right font-medium">Payment</th>
              <th className="pb-2 text-right font-medium">Principal</th>
              <th className="pb-2 text-right font-medium">Interest</th>
              <th className="pb-2 text-right font-medium">Balance</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row) => (
              <tr
                key={row.month}
                className="border-b border-white/5 text-white/70 hover:bg-white/5 transition"
              >
                <td className="py-2 text-left">{row.month}</td>
                <td className="py-2 text-right">{formatCurrencyDetailed(row.payment)}</td>
                <td className="py-2 text-right">{formatCurrencyDetailed(row.principalPayment)}</td>
                <td className="py-2 text-right">{formatCurrencyDetailed(row.interestPayment)}</td>
                <td className="py-2 text-right">{formatCurrencyDetailed(row.remainingBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isExpanded && schedule.length > 12 && (
        <div className="mt-3 text-center">
          <button
            onClick={() => setIsExpanded(true)}
            className="text-xs text-white/40 hover:text-white/70 transition cursor-pointer"
          >
            + {schedule.length - 12} more months
          </button>
        </div>
      )}
    </div>
  );
}
