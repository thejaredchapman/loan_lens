export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 mt-12">
      <div className="container mx-auto px-4 py-6 max-w-7xl text-center">
        <p className="text-xs text-white/30">
          LoanLens is for educational and estimation purposes only. All calculations are approximate.
          Consult a licensed financial advisor or lender for actual loan terms and rates.
        </p>
        <p className="text-xs text-white/20 mt-2">
          Property tax rates, insurance estimates, and city data are approximate averages and may vary.
        </p>
      </div>
    </footer>
  );
}
