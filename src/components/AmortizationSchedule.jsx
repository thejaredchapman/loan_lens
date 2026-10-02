import { useState } from 'react';
import { formatCurrencyDetailed } from '../utils/formatters';

export default function AmortizationSchedule({ schedule }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!schedule || schedule.length === 0) return null;

  const displayRows = isExpanded ? schedule : schedule.slice(0, 12);

  return (
    <section className="panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="kicker">Amortization schedule</h3>
        {schedule.length > 12 && (
          <button onClick={() => setIsExpanded(!isExpanded)} className="btn-link">
            {isExpanded ? 'Show first year' : `Show all ${schedule.length} months`}
          </button>
        )}
      </div>

      <div className={`overflow-x-auto ${isExpanded ? 'schedule-scroll' : ''}`}>
        <table className="w-full text-sm num">
          <thead className="sticky top-0 bg-card">
            <tr className="border-b-2 border-ink text-[.7rem] uppercase tracking-wider text-muted font-sans">
              <th className="py-2 text-left font-semibold">Month</th>
              <th className="py-2 text-right font-semibold">Payment</th>
              <th className="py-2 text-right font-semibold">Principal</th>
              <th className="py-2 text-right font-semibold">Interest</th>
              <th className="py-2 text-right font-semibold">Balance</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row) => (
              <tr key={row.month} className="border-b border-rule odd:bg-paper/60 hover:bg-[var(--accent-soft)]">
                <td className="py-2 text-left text-muted">{row.month}</td>
                <td className="py-2 text-right">{formatCurrencyDetailed(row.payment)}</td>
                <td className="py-2 text-right text-[var(--accent)]">{formatCurrencyDetailed(row.principalPayment)}</td>
                <td className="py-2 text-right">{formatCurrencyDetailed(row.interestPayment)}</td>
                <td className="py-2 text-right">{formatCurrencyDetailed(row.remainingBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
