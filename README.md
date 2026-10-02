# LoanLens

**See what a loan really costs, and whether you can afford it, before you apply.**

LoanLens is a client-side loan and affordability calculator. Pick a loan type, enter a price or your salary, and it shows the full monthly payment, how that payment splits between principal, interest, taxes and insurance, and a payment-by-payment amortization schedule. For homes, it also shows the city you'd be buying in, the jobs that pay enough to qualify, and a link to matching listings.

There is no backend and no account. Your inputs are saved in your browser's local storage.

## Features

- **Four loan products**, each with its own default rate, terms, down payment and debt-to-income (DTI) limit:

  | Product | Default rate | Terms (years) | Max DTI |
  | --- | --- | --- | --- |
  | Home mortgage | 7.25% | 15, 20, 30 | 28% |
  | Auto loan | 6.5% | 3–7 | 15% |
  | Personal loan | 12.5% | 2–5 | 10% |
  | Student loan | 6.5% | 10, 15, 20, 25 | 10% |

- **Two ways to search**
  - **By property or price:** enter what you want to buy and get the monthly payment and the salary you need to qualify.
  - **By salary:** enter your income and DTI limit and get the maximum price you can afford.
- **Full PITI breakdown** for mortgages: principal and interest, property tax, homeowner's insurance, and PMI (applied when the down payment is under 20%). Tax, insurance and PMI are switched off for the other loan types.
- **Charts and schedule:** a payment breakdown chart and a month-by-month amortization table with running balance and cumulative interest.
- **City explorer (home loans):** 50 US cities with property, state and sales tax rates, insurance costs, weather, school ratings, walk/transit/bike scores and demographics. Current temperature and wind come live from the [Open-Meteo](https://open-meteo.com/) API, with static data as a fallback.
- **Matching jobs:** occupations across 10 categories whose median salary is within 15% of the salary you need.
- **Realtor.com links:** a pre-filled search for the selected city and your price range.

## Getting started

You need Node.js 20 or later and npm.

```bash
git clone https://github.com/thejaredchapman/loan_lens.git
cd loan_lens
npm install
npm run dev
```

Open the URL Vite prints, usually <http://localhost:5173>.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## How to use it

1. **Choose a loan type** at the top of the page. Rates, terms and limits update to match.
2. **Choose a search mode.**
   - *Property:* enter a price, down payment %, interest rate and term. For home loans, also pick a city so local tax and insurance are included.
   - *Salary:* enter your annual salary and DTI limit. LoanLens works backward to the most you can afford.
3. **Read the results:** the monthly payment, the split between its parts, total interest over the life of the loan, and the required salary.
4. **Expand the amortization schedule** to see every payment.
5. **Explore the city, jobs and listings** below the results to get a feel for what that budget buys.

Your last inputs are remembered the next time you open the app.

## How the math works

- **Monthly payment:** the standard amortization formula, `P × r(1+r)^n / ((1+r)^n − 1)`, where `r` is the monthly rate and `n` the number of payments. A 0% rate falls back to `P / n`.
- **PITI:** principal and interest, plus `price × tax rate / 12`, `insurance / 12`, and `loan × PMI rate / 12` when the down payment is under 20%.
- **Required salary:** `total monthly payment / max DTI × 12`.
- **Max affordable price:** the monthly budget (`salary / 12 × DTI`) is solved against the PITI formula for the price.

The code is in `src/utils/amortization.js` and `src/utils/affordability.js`.

> Results are estimates for planning, not a loan offer or financial advice. City figures, job salaries and default rates are static sample data and will drift from real market numbers.

## Tech stack

- [React 19](https://react.dev/) and [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Zustand](https://zustand.docs.pmnd.rs/) with the `persist` middleware for saved inputs
- [Open-Meteo](https://open-meteo.com/) for live weather (no API key needed)

## Project structure

```
src/
  components/   UI: forms, results, chart, schedule, city panel, jobs, listings
  data/         loan products, 50 cities, job salaries, chart colors
  hooks/        useCityData (city lookup + live weather)
  store/        Zustand store with persisted preferences
  utils/        amortization, affordability, formatters, Realtor.com URLs
docs/           design spec and plans for an Angular port and landing page
```

## Customizing

- **Loan types and defaults:** edit `src/data/loanProducts.js`.
- **Cities:** add an entry to `src/data/cities.js`. Each needs an `id`, tax and insurance figures, `lat`/`lng` for weather, and a `realtorSlug` such as `Austin_TX`.
- **Jobs:** edit `src/data/jobs.js`.

## Deploying

LoanLens is a static site. Run `npm run build` and host the `dist/` folder anywhere, for example Vercel, Netlify or GitHub Pages.
