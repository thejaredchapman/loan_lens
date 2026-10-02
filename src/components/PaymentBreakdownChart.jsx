import { COMPONENT_COLORS } from '../data/chartColors';

export default function PaymentBreakdownChart({ piti, product }) {
  if (!piti || piti.totalMonthly === 0) return null;

  const total = piti.totalMonthly;
  const segments = [{ label: 'Principal & interest', value: piti.monthlyPrincipalAndInterest, color: COMPONENT_COLORS.pi }];
  if (product.includesTax && piti.monthlyTax > 0) segments.push({ label: 'Tax', value: piti.monthlyTax, color: COMPONENT_COLORS.tax });
  if (product.includesInsurance && piti.monthlyInsurance > 0) segments.push({ label: 'Insurance', value: piti.monthlyInsurance, color: COMPONENT_COLORS.ins });
  if (piti.monthlyPMI > 0) segments.push({ label: 'PMI', value: piti.monthlyPMI, color: COMPONENT_COLORS.pmi });

  const size = 180;
  const strokeWidth = 34;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const arcs = segments.map((seg) => {
    const pct = seg.value / total;
    const arc = { ...seg, dashArray: `${pct * circumference} ${circumference}`, dashOffset: -offset * circumference, pct };
    offset += pct;
    return arc;
  });

  return (
    <section className="panel lg:col-span-2 rise" style={{ '--i': 4 }}>
      <h3 className="kicker mb-5">Where it goes</h3>
      <div className="flex flex-col items-center gap-6">
        <svg width={size} height={size} role="img" aria-label="Payment distribution donut chart">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#d9d1c0" strokeWidth={strokeWidth} opacity="0.4" />
          {arcs.map((arc, i) => (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={strokeWidth}
              strokeDasharray={arc.dashArray}
              strokeDashoffset={arc.dashOffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              style={{ transition: 'stroke-dasharray .5s' }}
            />
          ))}
          <text x={size / 2} y={size / 2 + 4} textAnchor="middle" fill="#17140f" fontSize="22" fontWeight="800" fontFamily="Fraunces, serif">
            ${Math.round(total).toLocaleString()}
          </text>
          <text x={size / 2} y={size / 2 + 22} textAnchor="middle" fill="#6b6457" fontSize="11">per month</text>
        </svg>

        <ul className="w-full space-y-2">
          {arcs.map((arc, i) => (
            <li key={i} className="flex items-center justify-between gap-4 text-sm">
              <span className="flex items-center gap-3"><span className="w-3 h-3" style={{ background: arc.color }} />{arc.label}</span>
              <span className="num text-muted">{(arc.pct * 100).toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
