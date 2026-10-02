export default function Navbar() {
  return (
    <header className="border-b-2 border-ink">
      <div className="mx-auto px-4 sm:px-6 max-w-6xl py-5 flex items-end justify-between gap-6">
        <div className="flex items-center gap-3">
          <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" fill="#17140f" />
            <circle cx="15" cy="15" r="7" fill="none" stroke="#f3eee3" strokeWidth="3" />
            <path d="M20.5 20.5 26 26" stroke="#e0a526" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
          <div>
            <h1 className="display text-3xl font-extrabold leading-none">LoanLens</h1>
            <p className="text-[.7rem] tracking-[.16em] uppercase text-muted mt-1">Amortization &amp; Affordability</p>
          </div>
        </div>
        <p className="hidden sm:block text-xs text-muted italic display">
          Estimates only — consult a financial advisor.
        </p>
      </div>
    </header>
  );
}
