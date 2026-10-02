export default function Footer() {
  return (
    <footer className="border-t-2 border-ink mt-16">
      <div className="mx-auto px-4 sm:px-6 max-w-6xl pt-8">
        <p className="px-4 py-3 border-l-4 border-gold bg-gold/10 text-sm font-medium">
          Verify everything. Rates, home prices, taxes, insurance, salaries, and city data shown here are
          estimates and may be outdated or inaccurate. Confirm all figures with a licensed lender,
          official sources, and a qualified financial advisor before making any decision.
        </p>
      </div>
      <div className="mx-auto px-4 sm:px-6 max-w-6xl py-8 grid gap-3 sm:grid-cols-2 text-xs text-muted leading-relaxed">
        <p>
          LoanLens is for educational and estimation purposes only. All calculations are approximate.
          Consult a licensed financial advisor or lender for actual loan terms and rates.
        </p>
        <p>
          Default rates reflect national averages as of October 2026 (Freddie Mac PMMS 30-yr: 7.28%).
          Property tax, insurance, and city data are approximate and may vary.
        </p>
      </div>
    </footer>
  );
}
