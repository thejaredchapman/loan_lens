export default function PaymentBreakdownChart({ piti, product }) {
  if (!piti || piti.totalMonthly === 0) return null;

  const segments = [];
  const total = piti.totalMonthly;

  segments.push({
    label: 'Principal & Interest',
    value: piti.monthlyPrincipalAndInterest,
    color: product.theme.accent,
  });

  if (product.includesTax && piti.monthlyTax > 0) {
    segments.push({ label: 'Tax', value: piti.monthlyTax, color: '#f59e0b' });
  }
  if (product.includesInsurance && piti.monthlyInsurance > 0) {
    segments.push({ label: 'Insurance', value: piti.monthlyInsurance, color: '#10b981' });
  }
  if (piti.monthlyPMI > 0) {
    segments.push({ label: 'PMI', value: piti.monthlyPMI, color: '#f43f5e' });
  }

  // Build SVG donut
  const size = 180;
  const strokeWidth = 30;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const arcs = segments.map((seg) => {
    const pct = seg.value / total;
    const dashArray = `${pct * circumference} ${circumference}`;
    const dashOffset = -offset * circumference;
    offset += pct;
    return { ...seg, dashArray, dashOffset, pct };
  });

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-5 mb-6 backdrop-blur-sm">
      <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">
        Payment Distribution
      </h3>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <svg width={size} height={size} className="flex-shrink-0">
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
              className="transition-all duration-500"
            />
          ))}
          <text
            x={size / 2}
            y={size / 2 - 6}
            textAnchor="middle"
            className="fill-white text-lg font-bold"
            fontSize="18"
          >
            ${Math.round(total)}
          </text>
          <text
            x={size / 2}
            y={size / 2 + 12}
            textAnchor="middle"
            className="fill-white/50"
            fontSize="11"
          >
            /month
          </text>
        </svg>

        <div className="space-y-2 flex-1">
          {arcs.map((arc, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: arc.color }} />
                <span className="text-sm text-white/70">{arc.label}</span>
              </div>
              <span className="text-sm text-white/50">{(arc.pct * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
