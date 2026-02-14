export default function Navbar() {
  return (
    <nav className="relative z-10 border-b border-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-lg">
            🏦
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">LoanLens</h1>
            <p className="text-xs text-white/50">Amortization & Affordability Calculator</p>
          </div>
        </div>
        <div className="text-xs text-white/40 hidden sm:block">
          Estimates only — consult a financial advisor
        </div>
      </div>
    </nav>
  );
}
