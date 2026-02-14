import { useStore } from '../store/useStore';
import { LOAN_PRODUCTS } from '../data/loanProducts';

const gradientMap = {
  home: 'from-blue-900 via-blue-800 to-slate-900',
  auto: 'from-red-900 via-red-800 to-slate-900',
  personal: 'from-green-900 via-green-800 to-slate-900',
  student: 'from-purple-900 via-purple-800 to-slate-900',
};

export default function DynamicBackground() {
  const loanProductId = useStore((s) => s.loanProductId);
  const product = LOAN_PRODUCTS.find((p) => p.id === loanProductId);
  const theme = product?.theme;
  const gradient = gradientMap[loanProductId] || gradientMap.home;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-all duration-1000`} />

      <div
        className="absolute inset-0 opacity-30 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${theme.particleColor} 0%, transparent 50%),
                       radial-gradient(ellipse at 70% 80%, ${theme.particleColor} 0%, transparent 50%)`,
        }}
      />

      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={`${loanProductId}-${i}`}
            className="absolute rounded-full animate-float opacity-10 transition-colors duration-1000"
            style={{
              backgroundColor: theme.accent,
              width: `${60 + i * 40}px`,
              height: `${60 + i * 40}px`,
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 3) * 25}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + i * 3}s`,
            }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(${theme.primary}22 1px, transparent 1px),
                            linear-gradient(90deg, ${theme.primary}22 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}
