# LoanLens Angular Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `loan-lens-angular`, a full-parity Angular port of the LoanLens React app (`loan_lens/`, sibling repo), then apply a distinct visual design via the `frontend-design` skill and deploy it to Vercel.

**Architecture:** Angular 22 standalone app (no NgModules, no router — single page), signals for all state (a `LoanState` service replaces the current Zustand store, a `CityData` service replaces the `useCityData` hook), `HttpClient` for the Open-Meteo weather call. Pure calculation logic ports to typed TS functions with unit tests; presentational components port 1:1 with inline templates; final task applies a holistic visual redesign.

**Tech Stack:** Angular 22 (`@angular/cli@22`), TypeScript ~6.0, Tailwind CSS v4 (`@tailwindcss/postcss`), Vitest (Angular's default `ng test` runner in this version — not Karma/Jasmine).

## Global Constraints

- Repo lives at `~/coding_stuff/personal_projects/loan-lens-angular`, created via `ng new` (which also runs `git init`), as a sibling to `~/coding_stuff/personal_projects/loan_lens` (the untouched original) and `~/coding_stuff/personal_projects/loan-lens-landing` (the landing page, separate plan).
- **Naming convention (verified against this Angular version's own schematics):** no `.component.ts` / `.service.ts` suffixes. A component `Navbar` lives in `navbar.ts`; a service `LoanState` lives in `loan-state.ts` and uses `@Service()` (Angular 22's decorator, root-provided by default, equivalent to `@Injectable({providedIn:'root'})`), not `@Injectable`.
- **Templates are inline** (`template: \`...\`` in the same `.ts` file), a deliberate authoring choice for this project — not the CLI's own generated default (which splits `.html`/`.css`), but fully valid Angular.
- Use the modern control-flow syntax (`@if`, `@for`), signal `input()`/`input.required()` for component inputs, `computed()` for derived state, `inject()` for DI — never `*ngIf`/`*ngFor`, `@Input()` decorators, or constructor-parameter injection.
- Selector prefix: `app-`.
- Every calculation function ports with **identical behavior** to its `loan_lens/src/utils/*.js` counterpart — same formulas, same default parameter values, same edge-case handling (e.g. 0% interest rate, PMI threshold at 20% down).
- Node 25.9.0 is the active local Node version; `npx @angular/cli@22` prints `EBADENGINE` warnings on this Node version — these are non-fatal and can be ignored (verified: `ng new`, `ng build`, and `ng test` all complete successfully despite the warning).
- No component-level automated tests — only the pure utility functions and the two services get unit tests (Vitest, via `ng test --watch=false`). Component correctness is verified by `ng build` (catches wiring/type errors) and a manual browser QA pass in the final task, matching the approved spec's testing scope.
- **Every task assumes a fresh shell.** If tasks run via `subagent-driven-development`, each task gets a new subagent with an unknown working directory — do not rely on a `cd` from a previous task persisting. Every file path in a task's `Files:` list and every bash command is relative to the `loan-lens-angular/` project root (`~/coding_stuff/personal_projects/loan-lens-angular`); run `cd ~/coding_stuff/personal_projects/loan-lens-angular` as the first line of any bash step in Tasks 2 onward before running `npx ng ...` or touching relative paths.

---

### Task 1: Scaffold the Angular workspace with Tailwind v4

**Files:**
- Create: entire `loan-lens-angular/` workspace (via `ng new`)
- Create: `loan-lens-angular/.postcssrc.json`
- Modify: `loan-lens-angular/src/styles.css`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: a working `ng build` / `ng test` / `ng serve` workspace with Tailwind v4 utilities available in every component's template

- [ ] **Step 1: Scaffold the workspace**

```bash
cd ~/coding_stuff/personal_projects
npx -y @angular/cli@22 new loan-lens-angular --style=css --routing=false --ssr=false --package-manager=npm
```

This creates the `loan-lens-angular/` folder, runs `git init` + an initial commit, and installs Angular's own dependencies. Ignore any `EBADENGINE` warnings.

- [ ] **Step 2: Install Tailwind v4**

```bash
cd ~/coding_stuff/personal_projects/loan-lens-angular
npm install -D tailwindcss @tailwindcss/postcss postcss
```

- [ ] **Step 3: Configure PostCSS for Tailwind**

Create `.postcssrc.json`:

```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

- [ ] **Step 4: Replace global styles**

Replace the full contents of `src/styles.css` with:

```css
@import "tailwindcss";

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(2deg); }
  50% { transform: translateY(-10px) rotate(-1deg); }
  75% { transform: translateY(-25px) rotate(1deg); }
}

.animate-float {
  animation: float 15s ease-in-out infinite;
}

.schedule-scroll::-webkit-scrollbar {
  width: 6px;
}
.schedule-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}
.schedule-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 5: Verify Tailwind is actually processing utility classes**

Temporarily add a Tailwind class to `src/app/app.html` (e.g. `<div class="bg-blue-900">`), then:

```bash
npx ng build 2>&1 | tail -20
grep -o "bg-blue-900[^}]*{[^}]*}" dist/loan-lens-angular/browser/styles-*.css
```

Expected: the build succeeds and the grep prints a rule like `bg-blue-900{background-color:var(--color-blue-900)}`. Revert the temporary test class from `app.html` afterward (it will be fully replaced in Task 6 anyway).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Scaffold Angular workspace with Tailwind v4"
```

---

### Task 2: Domain models and calculation utilities

**Files:**
- Create: `src/app/core/models/loan.models.ts`
- Create: `src/app/core/utils/amortization.ts`, `src/app/core/utils/amortization.spec.ts`
- Create: `src/app/core/utils/affordability.ts`, `src/app/core/utils/affordability.spec.ts`
- Create: `src/app/core/utils/formatters.ts`, `src/app/core/utils/formatters.spec.ts`
- Create: `src/app/core/utils/realtor-url.ts`, `src/app/core/utils/realtor-url.spec.ts`

**Interfaces:**
- Consumes: nothing
- Produces (used by every later task):
  - Types: `LoanTheme`, `LoanProduct`, `City`, `Job`, `SearchMode`, `PitiResult`, `AmortizationRow`, `RealtorLink` (all from `loan.models.ts`)
  - `calculateMonthlyPayment(principal: number, annualRate: number, termYears: number): number`
  - `calculatePITI(input: CalculatePitiInput): PitiResult`
  - `generateAmortizationSchedule(principal: number, annualRate: number, termYears: number): AmortizationRow[]`
  - `calculateRequiredSalary(totalMonthlyPayment: number, maxDTIPercent?: number): number`
  - `calculateMaxAffordablePrice(input: CalculateMaxAffordableInput): number`
  - `calculateMaxMonthlyBudget(annualSalary: number, maxDTIPercent?: number): number`
  - `formatCurrency(value: number): string`
  - `formatCurrencyDetailed(value: number): string`
  - `formatNumber(value: number): string`
  - `formatPercent(value: number, decimals?: number): string`
  - `formatSalaryRange(min: number, max: number): string`
  - `buildRealtorUrl(city: City, options?: RealtorUrlOptions): string`
  - `generateRealtorLinks(city: City, maxAffordablePrice: number): RealtorLink[]`

- [ ] **Step 1: Write the domain models**

Create `src/app/core/models/loan.models.ts`:

```typescript
export interface LoanTheme {
  primary: string;
  secondary: string;
  accent: string;
  particleColor: string;
  label: string;
}

export interface LoanProduct {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultRate: number;
  rateRange: { min: number; max: number };
  terms: number[];
  defaultTerm: number;
  defaultDownPaymentPercent: number;
  minDownPaymentPercent: number;
  includesTax: boolean;
  includesInsurance: boolean;
  includesPMI: boolean;
  pmiRate: number;
  maxDTI: number;
  theme: LoanTheme;
}

export interface CityWeather {
  avgHighSummer: number;
  avgLowWinter: number;
  avgAnnualRainfall: number;
  avgSunnyDays: number;
  climateType: string;
}

export interface CitySchools {
  rating: number;
  totalSchools: number;
  topDistrict: string;
  studentTeacherRatio: number;
}

export interface CityWalkability {
  walkScore: number;
  transitScore: number;
  bikeScore: number;
}

export interface CityAgeDistribution {
  under18: number;
  age18to34: number;
  age35to54: number;
  age55to74: number;
  age75plus: number;
}

export interface CityDemographics {
  population: number;
  medianAge: number;
  medianHouseholdIncome: number;
  medianHomePrice: number;
  costOfLivingIndex: number;
  ageDistribution: CityAgeDistribution;
}

export interface City {
  id: string;
  name: string;
  state: string;
  propertyTaxRate: number;
  stateTaxRate: number;
  salesTaxRate: number;
  avgHomeInsuranceAnnual: number;
  weather: CityWeather;
  schools: CitySchools;
  walkability: CityWalkability;
  demographics: CityDemographics;
  realtorSlug: string;
  lat: number;
  lng: number;
}

export interface Job {
  title: string;
  category: string;
  salaryMin: number;
  salaryMax: number;
  salaryMedian: number;
  growth: string;
  educationRequired: string;
}

export type SearchMode = 'property' | 'salary';

export interface PitiResult {
  downPayment: number;
  loanAmount: number;
  monthlyPrincipalAndInterest: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyPMI: number;
  totalMonthly: number;
  totalInterest: number;
  totalCost: number;
  numPayments: number;
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principalPayment: number;
  interestPayment: number;
  remainingBalance: number;
  cumulativeInterest: number;
}

export interface RealtorLink {
  label: string;
  url: string;
}
```

- [ ] **Step 2: Port amortization math**

Create `src/app/core/utils/amortization.ts`:

```typescript
import type { AmortizationRow, PitiResult } from '../models/loan.models';

export function calculateMonthlyPayment(principal: number, annualRate: number, termYears: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  if (monthlyRate === 0) return principal / numPayments;
  const factor = Math.pow(1 + monthlyRate, numPayments);
  return (principal * (monthlyRate * factor)) / (factor - 1);
}

export interface CalculatePitiInput {
  propertyPrice: number;
  downPaymentPercent: number;
  annualRate: number;
  termYears: number;
  annualPropertyTaxRate?: number;
  annualInsurance?: number;
  pmiRate?: number;
  includesTax?: boolean;
  includesInsurance?: boolean;
  includesPMI?: boolean;
}

export function calculatePITI({
  propertyPrice,
  downPaymentPercent,
  annualRate,
  termYears,
  annualPropertyTaxRate = 0,
  annualInsurance = 0,
  pmiRate = 0.5,
  includesTax = true,
  includesInsurance = true,
  includesPMI = true,
}: CalculatePitiInput): PitiResult {
  const downPayment = propertyPrice * (downPaymentPercent / 100);
  const loanAmount = propertyPrice - downPayment;
  const monthlyPI = calculateMonthlyPayment(loanAmount, annualRate, termYears);
  const monthlyTax = includesTax ? (propertyPrice * annualPropertyTaxRate) / 100 / 12 : 0;
  const monthlyInsurance = includesInsurance ? annualInsurance / 12 : 0;
  const monthlyPMI = includesPMI && downPaymentPercent < 20 ? (loanAmount * pmiRate) / 100 / 12 : 0;
  const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI;

  return {
    downPayment,
    loanAmount,
    monthlyPrincipalAndInterest: monthlyPI,
    monthlyTax,
    monthlyInsurance,
    monthlyPMI,
    totalMonthly,
    totalInterest: monthlyPI * termYears * 12 - loanAmount,
    totalCost: monthlyPI * termYears * 12 + downPayment,
    numPayments: termYears * 12,
  };
}

export function generateAmortizationSchedule(principal: number, annualRate: number, termYears: number): AmortizationRow[] {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termYears);
  let balance = principal;
  let cumulativeInterest = 0;
  const schedule: AmortizationRow[] = [];

  for (let month = 1; month <= numPayments; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    cumulativeInterest += interestPayment;
    schedule.push({
      month,
      payment: monthlyPayment,
      principalPayment,
      interestPayment,
      remainingBalance: Math.max(0, balance),
      cumulativeInterest,
    });
  }

  return schedule;
}
```

Create `src/app/core/utils/amortization.spec.ts`:

```typescript
import { calculateMonthlyPayment, calculatePITI, generateAmortizationSchedule } from './amortization';

describe('calculateMonthlyPayment', () => {
  it('amortizes a standard loan to a positive monthly payment', () => {
    const payment = calculateMonthlyPayment(280000, 6.75, 30);
    expect(payment).toBeGreaterThan(0);
    expect(payment).toBeLessThan(280000);
  });

  it('divides evenly when the rate is 0%', () => {
    const payment = calculateMonthlyPayment(120000, 0, 5);
    expect(payment).toBeCloseTo(120000 / 60, 5);
  });
});

describe('calculatePITI', () => {
  it('reduces the loan amount as down payment percent increases', () => {
    const low = calculatePITI({ propertyPrice: 400000, downPaymentPercent: 5, annualRate: 6.5, termYears: 30 });
    const high = calculatePITI({ propertyPrice: 400000, downPaymentPercent: 25, annualRate: 6.5, termYears: 30 });
    expect(high.loanAmount).toBeLessThan(low.loanAmount);
  });

  it('includes PMI below 20% down and excludes it at or above 20% down', () => {
    const belowThreshold = calculatePITI({ propertyPrice: 400000, downPaymentPercent: 10, annualRate: 6.5, termYears: 30 });
    const atThreshold = calculatePITI({ propertyPrice: 400000, downPaymentPercent: 20, annualRate: 6.5, termYears: 30 });
    expect(belowThreshold.monthlyPMI).toBeGreaterThan(0);
    expect(atThreshold.monthlyPMI).toBe(0);
  });

  it('omits tax, insurance, and PMI when a product excludes them', () => {
    const result = calculatePITI({
      propertyPrice: 30000,
      downPaymentPercent: 10,
      annualRate: 7.5,
      termYears: 5,
      includesTax: false,
      includesInsurance: false,
      includesPMI: false,
    });
    expect(result.monthlyTax).toBe(0);
    expect(result.monthlyInsurance).toBe(0);
    expect(result.monthlyPMI).toBe(0);
    expect(result.totalMonthly).toBe(result.monthlyPrincipalAndInterest);
  });
});

describe('generateAmortizationSchedule', () => {
  it('produces one row per month for the full term and pays the balance to (near) zero', () => {
    const schedule = generateAmortizationSchedule(280000, 6.75, 30);
    expect(schedule.length).toBe(360);
    expect(schedule[0].month).toBe(1);
    expect(schedule[359].month).toBe(360);
    expect(schedule[359].remainingBalance).toBeCloseTo(0, 0);
  });

  it('accumulates cumulative interest monotonically', () => {
    const schedule = generateAmortizationSchedule(150000, 5.5, 15);
    for (let i = 1; i < schedule.length; i++) {
      expect(schedule[i].cumulativeInterest).toBeGreaterThanOrEqual(schedule[i - 1].cumulativeInterest);
    }
  });
});
```

- [ ] **Step 3: Port affordability math**

Create `src/app/core/utils/affordability.ts`:

```typescript
export interface CalculateMaxAffordableInput {
  annualSalary: number;
  maxDTIPercent?: number;
  annualRate: number;
  termYears: number;
  downPaymentPercent: number;
  annualPropertyTaxRate?: number;
  annualInsurance?: number;
  pmiRate?: number;
  includesTax?: boolean;
  includesInsurance?: boolean;
  includesPMI?: boolean;
}

export function calculateRequiredSalary(totalMonthlyPayment: number, maxDTIPercent = 28): number {
  const grossMonthlyIncome = totalMonthlyPayment / (maxDTIPercent / 100);
  return grossMonthlyIncome * 12;
}

export function calculateMaxAffordablePrice({
  annualSalary,
  maxDTIPercent = 28,
  annualRate,
  termYears,
  downPaymentPercent,
  annualPropertyTaxRate = 0,
  annualInsurance = 0,
  pmiRate = 0.5,
  includesTax = true,
  includesInsurance = true,
  includesPMI = true,
}: CalculateMaxAffordableInput): number {
  const grossMonthlyIncome = annualSalary / 12;
  const maxTotalMonthly = grossMonthlyIncome * (maxDTIPercent / 100);
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;

  if (monthlyRate === 0) {
    const L = 1 - downPaymentPercent / 100;
    const taxFactor = includesTax ? annualPropertyTaxRate / 100 / 12 : 0;
    const monthlyInsurance = includesInsurance ? annualInsurance / 12 : 0;
    const simpleFactor = L / numPayments + taxFactor;
    if (simpleFactor <= 0) return 0;
    return Math.max(0, Math.floor((maxTotalMonthly - monthlyInsurance) / simpleFactor));
  }

  const factor = Math.pow(1 + monthlyRate, numPayments);
  const paymentFactor = (monthlyRate * factor) / (factor - 1);
  const L = 1 - downPaymentPercent / 100;
  const taxFactor = includesTax ? annualPropertyTaxRate / 100 / 12 : 0;
  const pmiFactor = includesPMI && downPaymentPercent < 20 ? pmiRate / 100 / 12 : 0;
  const monthlyInsurance = includesInsurance ? annualInsurance / 12 : 0;
  const denominator = L * paymentFactor + taxFactor + L * pmiFactor;
  if (denominator <= 0) return 0;

  const maxPropertyPrice = (maxTotalMonthly - monthlyInsurance) / denominator;
  return Math.max(0, Math.floor(maxPropertyPrice));
}

export function calculateMaxMonthlyBudget(annualSalary: number, maxDTIPercent = 28): number {
  return (annualSalary / 12) * (maxDTIPercent / 100);
}
```

Create `src/app/core/utils/affordability.spec.ts`:

```typescript
import { calculateMaxAffordablePrice, calculateMaxMonthlyBudget, calculateRequiredSalary } from './affordability';
import { calculatePITI } from './amortization';

describe('calculateRequiredSalary', () => {
  it('is the round-trip inverse of the DTI budget used to build a PITI payment', () => {
    const salary = 90000;
    const dti = 28;
    const monthlyBudget = calculateMaxMonthlyBudget(salary, dti);
    const requiredSalary = calculateRequiredSalary(monthlyBudget, dti);
    expect(requiredSalary).toBeCloseTo(salary, 5);
  });
});

describe('calculateMaxAffordablePrice', () => {
  it('increases with a higher salary, all else equal', () => {
    const base = { annualRate: 6.5, termYears: 30, downPaymentPercent: 20, annualPropertyTaxRate: 1.5, annualInsurance: 1500 };
    const low = calculateMaxAffordablePrice({ ...base, annualSalary: 60000 });
    const high = calculateMaxAffordablePrice({ ...base, annualSalary: 120000 });
    expect(high).toBeGreaterThan(low);
  });

  it('round-trips with calculatePITI: affording the max price keeps the payment within budget', () => {
    const input = {
      annualSalary: 90000,
      maxDTIPercent: 28,
      annualRate: 6.5,
      termYears: 30,
      downPaymentPercent: 20,
      annualPropertyTaxRate: 1.8,
      annualInsurance: 1400,
    };
    const maxPrice = calculateMaxAffordablePrice(input);
    const piti = calculatePITI({
      propertyPrice: maxPrice,
      downPaymentPercent: input.downPaymentPercent,
      annualRate: input.annualRate,
      termYears: input.termYears,
      annualPropertyTaxRate: input.annualPropertyTaxRate,
      annualInsurance: input.annualInsurance,
    });
    const monthlyBudget = calculateMaxMonthlyBudget(input.annualSalary, input.maxDTIPercent);
    expect(piti.totalMonthly).toBeLessThanOrEqual(monthlyBudget + 1);
  });

  it('handles a 0% interest rate without dividing by zero', () => {
    const price = calculateMaxAffordablePrice({
      annualSalary: 90000,
      annualRate: 0,
      termYears: 30,
      downPaymentPercent: 20,
    });
    expect(price).toBeGreaterThan(0);
    expect(Number.isFinite(price)).toBe(true);
  });
});
```

- [ ] **Step 4: Port formatters**

Create `src/app/core/utils/formatters.ts`:

```typescript
const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const currencyDetailFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const numberFormatter = new Intl.NumberFormat('en-US');

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatCurrencyDetailed(value: number): string {
  return currencyDetailFormatter.format(value);
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatSalaryRange(min: number, max: number): string {
  return `${formatCurrency(min)} – ${formatCurrency(max)}`;
}
```

Create `src/app/core/utils/formatters.spec.ts`:

```typescript
import { formatCurrency, formatCurrencyDetailed, formatNumber, formatPercent, formatSalaryRange } from './formatters';

describe('formatters', () => {
  it('formats whole-dollar currency with no decimals', () => {
    expect(formatCurrency(350000)).toBe('$350,000');
  });

  it('formats detailed currency with two decimals', () => {
    expect(formatCurrencyDetailed(1816.4)).toBe('$1,816.40');
  });

  it('formats large numbers with thousands separators', () => {
    expect(formatNumber(8336817)).toBe('8,336,817');
  });

  it('formats a percent with the given decimal precision', () => {
    expect(formatPercent(6.75)).toBe('6.8%');
    expect(formatPercent(6.75, 2)).toBe('6.75%');
  });

  it('formats a salary range as two currency values joined by an en dash', () => {
    expect(formatSalaryRange(85000, 150000)).toBe('$85,000 – $150,000');
  });
});
```

- [ ] **Step 5: Port the Realtor.com URL builder**

Create `src/app/core/utils/realtor-url.ts`:

```typescript
import type { City, RealtorLink } from '../models/loan.models';

export interface RealtorUrlOptions {
  priceMin?: number;
  priceMax?: number;
  propertyType?: string;
}

export function buildRealtorUrl(city: City, options: RealtorUrlOptions = {}): string {
  const { priceMin, priceMax, propertyType } = options;
  let url = `https://www.realtor.com/realestateandhomes-search/${city.realtorSlug}`;
  if (priceMin || priceMax) {
    const min = priceMin ? Math.round(priceMin) : 'na';
    const max = priceMax ? Math.round(priceMax) : 'na';
    url += `/price-${min}-${max}`;
  }
  if (propertyType) {
    url += `/type-${propertyType}`;
  }
  return url;
}

export function generateRealtorLinks(city: City, maxAffordablePrice: number): RealtorLink[] {
  if (!city) return [];
  const buffer = 0.1;
  const min = Math.round(maxAffordablePrice * (1 - buffer));
  const max = Math.round(maxAffordablePrice * (1 + buffer));
  return [
    { label: `All listings in ${city.name}, ${city.state}`, url: buildRealtorUrl(city) },
    { label: `Homes in your budget ($${min.toLocaleString()} – $${max.toLocaleString()})`, url: buildRealtorUrl(city, { priceMin: min, priceMax: max }) },
    { label: `Condos in ${city.name}`, url: buildRealtorUrl(city, { priceMax: max, propertyType: 'condo' }) },
    { label: `Single-family homes in ${city.name}`, url: buildRealtorUrl(city, { priceMax: max, propertyType: 'single-family-home' }) },
  ];
}
```

Create `src/app/core/utils/realtor-url.spec.ts`:

```typescript
import { buildRealtorUrl, generateRealtorLinks } from './realtor-url';
import type { City } from '../models/loan.models';

const SAMPLE_CITY: City = {
  id: 'austin-tx', name: 'Austin', state: 'TX', propertyTaxRate: 1.8, stateTaxRate: 0, salesTaxRate: 8.25,
  avgHomeInsuranceAnnual: 1900,
  weather: { avgHighSummer: 96, avgLowWinter: 40, avgAnnualRainfall: 34, avgSunnyDays: 228, climateType: 'Humid Subtropical' },
  schools: { rating: 7, totalSchools: 250, topDistrict: 'Austin ISD', studentTeacherRatio: 15 },
  walkability: { walkScore: 40, transitScore: 35, bikeScore: 48 },
  demographics: { population: 964000, medianAge: 34, medianHouseholdIncome: 75752, medianHomePrice: 550000, costOfLivingIndex: 120, ageDistribution: { under18: 19, age18to34: 30, age35to54: 28, age55to74: 17, age75plus: 6 } },
  realtorSlug: 'Austin_TX',
  lat: 30.2672, lng: -97.7431,
};

describe('buildRealtorUrl', () => {
  it('builds a bare search URL with no options', () => {
    expect(buildRealtorUrl(SAMPLE_CITY)).toBe('https://www.realtor.com/realestateandhomes-search/Austin_TX');
  });

  it('appends a price range segment', () => {
    expect(buildRealtorUrl(SAMPLE_CITY, { priceMin: 400000, priceMax: 600000 })).toBe(
      'https://www.realtor.com/realestateandhomes-search/Austin_TX/price-400000-600000'
    );
  });

  it('appends a property type segment', () => {
    expect(buildRealtorUrl(SAMPLE_CITY, { propertyType: 'condo' })).toBe(
      'https://www.realtor.com/realestateandhomes-search/Austin_TX/type-condo'
    );
  });
});

describe('generateRealtorLinks', () => {
  it('returns four links including an all-listings link and a budget-range link', () => {
    const links = generateRealtorLinks(SAMPLE_CITY, 500000);
    expect(links).toHaveLength(4);
    expect(links[0].label).toContain('All listings in Austin');
    expect(links[1].url).toContain('/price-450000-550000');
  });
});
```

- [ ] **Step 6: Run the full test suite**

```bash
npx ng test --watch=false 2>&1 | tail -40
```

Expected: all tests across the four spec files pass.

- [ ] **Step 7: Commit**

```bash
git add src/app/core
git commit -m "Port domain models and calculation utilities with tests"
```

---

### Task 3: Static reference data

**Files:**
- Create: `src/app/core/data/loan-products.ts`
- Create: `src/app/core/data/jobs.ts` (generated from `loan_lens/src/data/jobs.js`)
- Create: `src/app/core/data/cities.ts` (generated from `loan_lens/src/data/cities.js`)

**Interfaces:**
- Consumes: `LoanProduct`, `Job`, `City` types from Task 2 (`../models/loan.models`)
- Produces: `LOAN_PRODUCTS: LoanProduct[]`, `JOB_CATEGORIES: string[]`, `JOBS: Job[]`, `CITIES: City[]`

- [ ] **Step 1: Write the loan products data**

Create `src/app/core/data/loan-products.ts`:

```typescript
import type { LoanProduct } from '../models/loan.models';

export const LOAN_PRODUCTS: LoanProduct[] = [
  {
    id: 'home',
    name: 'Home Mortgage',
    icon: '🏠',
    description: 'Finance your dream home with competitive fixed-rate mortgage options.',
    defaultRate: 6.75,
    rateRange: { min: 3.0, max: 12.0 },
    terms: [15, 20, 30],
    defaultTerm: 30,
    defaultDownPaymentPercent: 20,
    minDownPaymentPercent: 3,
    includesTax: true,
    includesInsurance: true,
    includesPMI: true,
    pmiRate: 0.5,
    maxDTI: 28,
    theme: {
      primary: '#1E40AF',
      secondary: '#3B82F6',
      accent: '#93C5FD',
      particleColor: 'rgba(59, 130, 246, 0.15)',
      label: 'blue',
    },
  },
  {
    id: 'auto',
    name: 'Auto Loan',
    icon: '🚗',
    description: 'Get on the road with affordable auto financing for new or used vehicles.',
    defaultRate: 7.5,
    rateRange: { min: 3.0, max: 15.0 },
    terms: [3, 4, 5, 6, 7],
    defaultTerm: 5,
    defaultDownPaymentPercent: 10,
    minDownPaymentPercent: 0,
    includesTax: false,
    includesInsurance: false,
    includesPMI: false,
    pmiRate: 0,
    maxDTI: 15,
    theme: {
      primary: '#991B1B',
      secondary: '#EF4444',
      accent: '#FCA5A5',
      particleColor: 'rgba(239, 68, 68, 0.15)',
      label: 'red',
    },
  },
  {
    id: 'personal',
    name: 'Personal Loan',
    icon: '💳',
    description: 'Flexible personal loans for debt consolidation, renovations, or major purchases.',
    defaultRate: 11.5,
    rateRange: { min: 5.0, max: 36.0 },
    terms: [2, 3, 4, 5],
    defaultTerm: 3,
    defaultDownPaymentPercent: 0,
    minDownPaymentPercent: 0,
    includesTax: false,
    includesInsurance: false,
    includesPMI: false,
    pmiRate: 0,
    maxDTI: 10,
    theme: {
      primary: '#166534',
      secondary: '#22C55E',
      accent: '#86EFAC',
      particleColor: 'rgba(34, 197, 94, 0.15)',
      label: 'green',
    },
  },
  {
    id: 'student',
    name: 'Student Loan',
    icon: '🎓',
    description: 'Invest in your future with student loan options for education expenses.',
    defaultRate: 5.5,
    rateRange: { min: 3.0, max: 12.0 },
    terms: [10, 15, 20, 25],
    defaultTerm: 10,
    defaultDownPaymentPercent: 0,
    minDownPaymentPercent: 0,
    includesTax: false,
    includesInsurance: false,
    includesPMI: false,
    pmiRate: 0,
    maxDTI: 10,
    theme: {
      primary: '#6B21A8',
      secondary: '#A855F7',
      accent: '#D8B4FE',
      particleColor: 'rgba(168, 85, 247, 0.15)',
      label: 'purple',
    },
  },
];
```

- [ ] **Step 2: Port `jobs.js` and `cities.js` mechanically**

These two files are pure data (802 and 118 lines). Port them with a script rather than hand-copying, so the data is guaranteed byte-identical to the source:

```bash
node -e "
const fs = require('fs');

let jobs = fs.readFileSync('../loan_lens/src/data/jobs.js', 'utf8');
jobs = jobs.replace('export const JOB_CATEGORIES = [', 'export const JOB_CATEGORIES: string[] = [');
jobs = jobs.replace('export const JOBS = [', 'export const JOBS: Job[] = [');
fs.writeFileSync('src/app/core/data/jobs.ts', \"import type { Job } from '../models/loan.models';\n\n\" + jobs);

let cities = fs.readFileSync('../loan_lens/src/data/cities.js', 'utf8');
cities = cities.replace('export const CITIES = [', 'export const CITIES: City[] = [');
fs.writeFileSync('src/app/core/data/cities.ts', \"import type { City } from '../models/loan.models';\n\n\" + cities);
"
```

- [ ] **Step 3: Verify the ported data is identical to the source**

```bash
diff <(grep -o 'id: "[a-z0-9-]*"' ../loan_lens/src/data/cities.js) <(grep -o 'id: "[a-z0-9-]*"' src/app/core/data/cities.ts)
diff <(grep -o 'title: "[^"]*"' ../loan_lens/src/data/jobs.js) <(grep -o 'title: "[^"]*"' src/app/core/data/jobs.ts)
```

Expected: both `diff` commands produce no output (identical city id and job title lists).

- [ ] **Step 4: Verify it compiles**

```bash
npx ng build 2>&1 | tail -20
```

Expected: build succeeds with no type errors (confirms the ported data literals satisfy the `City[]` and `Job[]` types).

- [ ] **Step 5: Commit**

```bash
git add src/app/core/data
git commit -m "Port static reference data (loan products, jobs, cities)"
```

---

### Task 4: `LoanState` service (signals + localStorage persistence)

**Files:**
- Create: `src/app/core/services/loan-state.ts`
- Create: `src/app/core/services/loan-state.spec.ts`

**Interfaces:**
- Consumes: `SearchMode` type (Task 2)
- Produces: injectable `LoanState` (`@Service()`) with signals `loanProductId`, `searchMode`, `selectedCityId`, `propertyPrice`, `downPaymentPercent`, `interestRate`, `loanTerm`, `annualSalary`, `dtiRatio`, and setters `setLoanProduct(id: string)`, `setSearchMode(mode: SearchMode)`, `setSelectedCity(cityId: string)`, `setPropertyPrice(val: number)`, `setDownPaymentPercent(val: number)`, `setInterestRate(val: number)`, `setLoanTerm(val: number)`, `setAnnualSalary(val: number)`, `setDtiRatio(val: number)`

- [ ] **Step 1: Write the service**

Create `src/app/core/services/loan-state.ts`:

```typescript
import { Service, effect, signal } from '@angular/core';
import type { SearchMode } from '../models/loan.models';

const STORAGE_KEY = 'loan-lens-angular-prefs';

interface PersistedState {
  loanProductId: string;
  searchMode: SearchMode;
  selectedCityId: string;
  propertyPrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
  annualSalary: number;
  dtiRatio: number;
}

const DEFAULTS: PersistedState = {
  loanProductId: 'home',
  searchMode: 'property',
  selectedCityId: 'austin-tx',
  propertyPrice: 350000,
  downPaymentPercent: 20,
  interestRate: 6.75,
  loanTerm: 30,
  annualSalary: 75000,
  dtiRatio: 28,
};

function loadPersisted(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

@Service()
export class LoanState {
  private initial = loadPersisted();

  loanProductId = signal(this.initial.loanProductId);
  searchMode = signal<SearchMode>(this.initial.searchMode);
  selectedCityId = signal(this.initial.selectedCityId);
  propertyPrice = signal(this.initial.propertyPrice);
  downPaymentPercent = signal(this.initial.downPaymentPercent);
  interestRate = signal(this.initial.interestRate);
  loanTerm = signal(this.initial.loanTerm);
  annualSalary = signal(this.initial.annualSalary);
  dtiRatio = signal(this.initial.dtiRatio);

  setLoanProduct(id: string): void { this.loanProductId.set(id); }
  setSearchMode(mode: SearchMode): void { this.searchMode.set(mode); }
  setSelectedCity(cityId: string): void { this.selectedCityId.set(cityId); }
  setPropertyPrice(val: number): void { this.propertyPrice.set(val); }
  setDownPaymentPercent(val: number): void { this.downPaymentPercent.set(val); }
  setInterestRate(val: number): void { this.interestRate.set(val); }
  setLoanTerm(val: number): void { this.loanTerm.set(val); }
  setAnnualSalary(val: number): void { this.annualSalary.set(val); }
  setDtiRatio(val: number): void { this.dtiRatio.set(val); }

  constructor() {
    effect(() => {
      const state: PersistedState = {
        loanProductId: this.loanProductId(),
        searchMode: this.searchMode(),
        selectedCityId: this.selectedCityId(),
        propertyPrice: this.propertyPrice(),
        downPaymentPercent: this.downPaymentPercent(),
        interestRate: this.interestRate(),
        loanTerm: this.loanTerm(),
        annualSalary: this.annualSalary(),
        dtiRatio: this.dtiRatio(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    });
  }
}
```

- [ ] **Step 2: Write the tests**

Create `src/app/core/services/loan-state.spec.ts`. Note: `effect()` does not flush on a plain `await Promise.resolve()` in tests — it requires `TestBed.tick()` (verified against this Angular version; `TestBed.flushEffects()` is the deprecated alias for the same thing):

```typescript
import { TestBed } from '@angular/core/testing';
import { LoanState } from './loan-state';

const STORAGE_KEY = 'loan-lens-angular-prefs';

describe('LoanState', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('initializes with default values when nothing is persisted', () => {
    const service = TestBed.inject(LoanState);
    expect(service.loanProductId()).toBe('home');
    expect(service.propertyPrice()).toBe(350000);
    expect(service.searchMode()).toBe('property');
  });

  it('loads persisted values on construction', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ propertyPrice: 999000 }));
    const service = TestBed.inject(LoanState);
    expect(service.propertyPrice()).toBe(999000);
  });

  it('persists state to localStorage when a value changes', () => {
    const service = TestBed.inject(LoanState);
    service.setPropertyPrice(500000);
    TestBed.tick();
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.propertyPrice).toBe(500000);
  });

  it('setLoanProduct updates the loanProductId signal', () => {
    const service = TestBed.inject(LoanState);
    service.setLoanProduct('auto');
    expect(service.loanProductId()).toBe('auto');
  });
});
```

- [ ] **Step 3: Run the tests**

```bash
npx ng test --watch=false 2>&1 | tail -30
```

Expected: all `LoanState` tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/app/core/services/loan-state.ts src/app/core/services/loan-state.spec.ts
git commit -m "Add LoanState service (signals + localStorage persistence)"
```

---

### Task 5: `CityData` service (weather fetch with graceful fallback)

**Files:**
- Create: `src/app/core/services/city-data.ts`
- Create: `src/app/core/services/city-data.spec.ts`
- Modify: `src/app/app.config.ts`

**Interfaces:**
- Consumes: `CITIES` (Task 3), `City` type (Task 2)
- Produces: injectable `CityData` (`@Service()`) with signals `city: Signal<City | null>`, `liveWeather: Signal<LiveWeather | null>`, `isEnriching: Signal<boolean>`, method `selectCity(cityId: string): void`; exported `LiveWeather` interface (`{ currentTemp: number; windSpeed: number; isDay: boolean }`)

- [ ] **Step 1: Write the service**

Create `src/app/core/services/city-data.ts`:

```typescript
import { HttpClient } from '@angular/common/http';
import { Service, inject, signal } from '@angular/core';
import { CITIES } from '../data/cities';
import type { City } from '../models/loan.models';

export interface LiveWeather {
  currentTemp: number;
  windSpeed: number;
  isDay: boolean;
}

interface OpenMeteoResponse {
  current_weather: {
    temperature: number;
    windspeed: number;
    is_day: number;
  };
}

@Service()
export class CityData {
  private http = inject(HttpClient);

  city = signal<City | null>(null);
  liveWeather = signal<LiveWeather | null>(null);
  isEnriching = signal(false);

  selectCity(cityId: string): void {
    const found = CITIES.find((c) => c.id === cityId) ?? null;
    this.city.set(found);
    this.liveWeather.set(null);
    if (found) this.fetchWeather(found);
  }

  private fetchWeather(city: City): void {
    this.isEnriching.set(true);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current_weather=true&temperature_unit=fahrenheit`;
    this.http.get<OpenMeteoResponse>(url).subscribe({
      next: (data) => {
        this.liveWeather.set({
          currentTemp: Math.round(data.current_weather.temperature),
          windSpeed: Math.round(data.current_weather.windspeed),
          isDay: data.current_weather.is_day === 1,
        });
        this.isEnriching.set(false);
      },
      error: () => {
        this.isEnriching.set(false);
      },
    });
  }
}
```

- [ ] **Step 2: Register `provideHttpClient()`**

In `src/app/app.config.ts`, add the HttpClient provider:

```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
  ]
};
```

- [ ] **Step 3: Write the tests**

Create `src/app/core/services/city-data.spec.ts`:

```typescript
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CityData } from './city-data';

describe('CityData', () => {
  let httpMock: HttpTestingController;
  let service: CityData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CityData);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('sets the static city immediately and marks enriching while weather loads', () => {
    service.selectCity('austin-tx');
    expect(service.city()?.id).toBe('austin-tx');
    expect(service.isEnriching()).toBe(true);

    const req = httpMock.expectOne((r) => r.url.includes('api.open-meteo.com'));
    req.flush({ current_weather: { temperature: 88.4, windspeed: 5.2, is_day: 1 } });

    expect(service.liveWeather()).toEqual({ currentTemp: 88, windSpeed: 5, isDay: true });
    expect(service.isEnriching()).toBe(false);
  });

  it('falls back gracefully when the weather request fails', () => {
    service.selectCity('austin-tx');
    const req = httpMock.expectOne((r) => r.url.includes('api.open-meteo.com'));
    req.error(new ProgressEvent('error'));

    expect(service.liveWeather()).toBeNull();
    expect(service.isEnriching()).toBe(false);
  });

  it('sets city to null for an unknown city id and does not fetch weather', () => {
    service.selectCity('not-a-real-city');
    expect(service.city()).toBeNull();
    httpMock.expectNone(() => true);
  });
});
```

- [ ] **Step 4: Run the tests**

```bash
npx ng test --watch=false 2>&1 | tail -30
```

Expected: all `CityData` tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/app/core/services/city-data.ts src/app/core/services/city-data.spec.ts src/app/app.config.ts
git commit -m "Add CityData service with Open-Meteo weather fetch and fallback"
```

---

### Task 6: Shell components and minimal app wiring

**Files:**
- Create: `src/app/components/dynamic-background.ts`
- Create: `src/app/components/navbar.ts`
- Create: `src/app/components/footer.ts`
- Modify: `src/app/app.ts`
- Delete: `src/app/app.html`, `src/app/app.css`, `src/app/app.spec.ts`

**Interfaces:**
- Consumes: `LoanState` (Task 4), `LOAN_PRODUCTS` (Task 3)
- Produces: `DynamicBackground`, `Navbar`, `Footer` components (no inputs), a minimal `App` root component other tasks will keep extending

- [ ] **Step 1: Write `DynamicBackground`**

Create `src/app/components/dynamic-background.ts`:

```typescript
import { Component, computed, inject } from '@angular/core';
import { LoanState } from '../core/services/loan-state';
import { LOAN_PRODUCTS } from '../core/data/loan-products';

const GRADIENT_MAP: Record<string, string> = {
  home: 'from-blue-900 via-blue-800 to-slate-900',
  auto: 'from-red-900 via-red-800 to-slate-900',
  personal: 'from-green-900 via-green-800 to-slate-900',
  student: 'from-purple-900 via-purple-800 to-slate-900',
};

@Component({
  selector: 'app-dynamic-background',
  template: `
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br transition-all duration-1000" [class]="gradient()"></div>
      <div class="absolute inset-0 opacity-30 transition-all duration-1000" [style.background]="radialStyle()"></div>
      <div class="absolute inset-0">
        @for (i of dots; track i) {
          <div
            class="absolute rounded-full animate-float opacity-10 transition-colors duration-1000"
            [style.background-color]="theme().accent"
            [style.width.px]="60 + i * 40"
            [style.height.px]="60 + i * 40"
            [style.left.%]="10 + i * 15"
            [style.top.%]="15 + (i % 3) * 25"
            [style.animation-delay.s]="i * 2"
            [style.animation-duration.s]="15 + i * 3"
          ></div>
        }
      </div>
      <div class="absolute inset-0 opacity-5" [style.background-image]="gridStyle()" style="background-size: 60px 60px;"></div>
    </div>
  `,
})
export class DynamicBackground {
  private loanState = inject(LoanState);
  dots = [0, 1, 2, 3, 4, 5];

  theme = computed(() => LOAN_PRODUCTS.find((p) => p.id === this.loanState.loanProductId())!.theme);
  gradient = computed(() => GRADIENT_MAP[this.loanState.loanProductId()] ?? GRADIENT_MAP['home']);

  radialStyle = computed(() => {
    const color = this.theme().particleColor;
    return `radial-gradient(ellipse at 30% 20%, ${color} 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, ${color} 0%, transparent 50%)`;
  });

  gridStyle = computed(() => {
    const primary = this.theme().primary;
    return `linear-gradient(${primary}22 1px, transparent 1px), linear-gradient(90deg, ${primary}22 1px, transparent 1px)`;
  });
}
```

- [ ] **Step 2: Write `Navbar`**

Create `src/app/components/navbar.ts`:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="relative z-10 border-b border-white/10 backdrop-blur-sm">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-lg">🏦</div>
          <div>
            <h1 class="text-xl font-bold text-white leading-tight">LoanLens</h1>
            <p class="text-xs text-white/50">Amortization & Affordability Calculator</p>
          </div>
        </div>
        <div class="text-xs text-white/40 hidden sm:block">Estimates only — consult a financial advisor</div>
      </div>
    </nav>
  `,
})
export class Navbar {}
```

- [ ] **Step 3: Write `Footer`**

Create `src/app/components/footer.ts`:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="relative z-10 border-t border-white/10 mt-12">
      <div class="container mx-auto px-4 py-6 max-w-7xl text-center">
        <p class="text-xs text-white/30">
          LoanLens is for educational and estimation purposes only. All calculations are approximate.
          Consult a licensed financial advisor or lender for actual loan terms and rates.
        </p>
        <p class="text-xs text-white/20 mt-2">
          Property tax rates, insurance estimates, and city data are approximate averages and may vary.
        </p>
      </div>
    </footer>
  `,
})
export class Footer {}
```

- [ ] **Step 4: Rewrite `App` with an inline template and remove the generated `.html`/`.css`/`.spec.ts`**

```bash
rm src/app/app.html src/app/app.css src/app/app.spec.ts
```

Replace `src/app/app.ts`:

```typescript
import { Component } from '@angular/core';
import { DynamicBackground } from './components/dynamic-background';
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';

@Component({
  selector: 'app-root',
  imports: [DynamicBackground, Navbar, Footer],
  template: `
    <div class="min-h-screen relative text-white">
      <app-dynamic-background />
      <app-navbar />
      <main class="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <p class="text-white/50 text-sm">LoanLens — Angular Edition (product selector and forms coming next)</p>
      </main>
      <app-footer />
    </div>
  `,
})
export class App {}
```

- [ ] **Step 5: Verify the build**

```bash
npx ng build 2>&1 | tail -20
```

Expected: build succeeds with no errors referencing the removed `app.html`/`app.css`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add shell components (background, navbar, footer) and minimal App wiring"
```

---

### Task 7: Product and search-mode selection

**Files:**
- Create: `src/app/components/loan-product-selector.ts`
- Create: `src/app/components/search-mode-toggle.ts`
- Modify: `src/app/app.ts`

**Interfaces:**
- Consumes: `LoanState` (Task 4), `LOAN_PRODUCTS` (Task 3)
- Produces: `LoanProductSelector`, `SearchModeToggle` components (no inputs, read/write `LoanState` directly)

- [ ] **Step 1: Write `LoanProductSelector`**

Create `src/app/components/loan-product-selector.ts`:

```typescript
import { Component, inject } from '@angular/core';
import { LoanState } from '../core/services/loan-state';
import { LOAN_PRODUCTS } from '../core/data/loan-products';
import type { LoanProduct } from '../core/models/loan.models';

@Component({
  selector: 'app-loan-product-selector',
  template: `
    <div class="mb-6">
      <h2 class="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider">Loan Product</h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        @for (product of products; track product.id) {
          <button
            (click)="select(product)"
            class="relative p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer"
            [class]="product.id === loanState.loanProductId() ? 'border-white/30 bg-white/15 shadow-lg scale-[1.02]' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'"
          >
            <div class="text-2xl mb-2">{{ product.icon }}</div>
            <div class="text-sm font-semibold text-white">{{ product.name }}</div>
            <div class="text-xs text-white/50 mt-1">{{ product.defaultRate }}% typical</div>
            @if (product.id === loanState.loanProductId()) {
              <div class="absolute top-2 right-2 w-2 h-2 rounded-full" [style.background-color]="product.theme.accent"></div>
            }
          </button>
        }
      </div>
    </div>
  `,
})
export class LoanProductSelector {
  loanState = inject(LoanState);
  products = LOAN_PRODUCTS;

  select(product: LoanProduct): void {
    this.loanState.setLoanProduct(product.id);
    this.loanState.setInterestRate(product.defaultRate);
    this.loanState.setLoanTerm(product.defaultTerm);
    this.loanState.setDownPaymentPercent(product.defaultDownPaymentPercent);
  }
}
```

- [ ] **Step 2: Write `SearchModeToggle`**

Create `src/app/components/search-mode-toggle.ts`:

```typescript
import { Component, inject } from '@angular/core';
import { LoanState } from '../core/services/loan-state';

@Component({
  selector: 'app-search-mode-toggle',
  template: `
    <div class="mb-6">
      <div class="inline-flex rounded-lg bg-white/5 border border-white/10 p-1">
        <button
          (click)="loanState.setSearchMode('property')"
          class="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer"
          [class]="loanState.searchMode() === 'property' ? 'bg-white/15 text-white shadow-sm' : 'text-white/50 hover:text-white/70'"
        >
          Search by Property
        </button>
        <button
          (click)="loanState.setSearchMode('salary')"
          class="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer"
          [class]="loanState.searchMode() === 'salary' ? 'bg-white/15 text-white shadow-sm' : 'text-white/50 hover:text-white/70'"
        >
          Search by Salary
        </button>
      </div>
    </div>
  `,
})
export class SearchModeToggle {
  loanState = inject(LoanState);
}
```

- [ ] **Step 3: Wire both into `App`**

In `src/app/app.ts`, add the imports and render them above the placeholder paragraph:

```typescript
import { Component } from '@angular/core';
import { DynamicBackground } from './components/dynamic-background';
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';
import { LoanProductSelector } from './components/loan-product-selector';
import { SearchModeToggle } from './components/search-mode-toggle';

@Component({
  selector: 'app-root',
  imports: [DynamicBackground, Navbar, Footer, LoanProductSelector, SearchModeToggle],
  template: `
    <div class="min-h-screen relative text-white">
      <app-dynamic-background />
      <app-navbar />
      <main class="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <app-loan-product-selector />
        <app-search-mode-toggle />
        <p class="text-white/50 text-sm">Search forms coming next</p>
      </main>
      <app-footer />
    </div>
  `,
})
export class App {}
```

- [ ] **Step 4: Verify the build**

```bash
npx ng build 2>&1 | tail -20
```

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/components src/app/app.ts
git commit -m "Add loan product selector and search mode toggle"
```

---

### Task 8: Input forms (city selector, property form, salary form)

**Files:**
- Create: `src/app/components/city-selector.ts`
- Create: `src/app/components/property-search-form.ts`
- Create: `src/app/components/salary-search-form.ts`
- Modify: `src/app/app.ts`

**Interfaces:**
- Consumes: `LoanState` (Task 4), `CITIES` (Task 3), `LOAN_PRODUCTS` (Task 3)
- Produces: `CitySelector`, `PropertySearchForm`, `SalarySearchForm` components (no inputs, read/write `LoanState` directly)

- [ ] **Step 1: Write `CitySelector`**

Create `src/app/components/city-selector.ts`:

```typescript
import { Component, ElementRef, HostListener, computed, inject, signal } from '@angular/core';
import { LoanState } from '../core/services/loan-state';
import { CITIES } from '../core/data/cities';

@Component({
  selector: 'app-city-selector',
  template: `
    <div class="relative">
      <label class="block text-xs text-white/50 mb-1">City</label>
      <button
        (click)="isOpen.set(!isOpen())"
        class="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white text-sm text-left hover:bg-white/15 transition cursor-pointer"
      >
        {{ selectedCity() ? selectedCity()!.name + ', ' + selectedCity()!.state : 'Select a city...' }}
        <span class="float-right text-white/40">▾</span>
      </button>

      @if (isOpen()) {
        <div class="absolute z-50 mt-1 w-full rounded-lg bg-slate-800 border border-white/15 shadow-xl overflow-hidden">
          <div class="p-2 border-b border-white/10">
            <input
              type="text"
              [value]="search()"
              (input)="search.set($any($event.target).value)"
              placeholder="Search cities..."
              class="w-full px-3 py-2 rounded-md bg-white/10 border border-white/10 text-white text-sm placeholder-white/30 outline-none focus:border-white/30"
            />
          </div>
          <div class="max-h-60 overflow-y-auto schedule-scroll">
            @for (city of filtered(); track city.id) {
              <button
                (click)="selectCity(city.id)"
                class="w-full px-3 py-2 text-left text-sm hover:bg-white/10 transition cursor-pointer"
                [class]="city.id === loanState.selectedCityId() ? 'bg-white/10 text-white' : 'text-white/70'"
              >
                {{ city.name }}, {{ city.state }}
                <span class="float-right text-white/30 text-xs">Median: {{ '$' + city.demographics.medianHomePrice.toLocaleString() }}</span>
              </button>
            }
            @if (filtered().length === 0) {
              <div class="px-3 py-4 text-center text-white/30 text-sm">No cities found</div>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class CitySelector {
  loanState = inject(LoanState);
  private elementRef = inject(ElementRef);

  search = signal('');
  isOpen = signal(false);

  selectedCity = computed(() => CITIES.find((c) => c.id === this.loanState.selectedCityId()) ?? null);

  filtered = computed(() => {
    const q = this.search().toLowerCase();
    if (!q) return CITIES;
    return CITIES.filter((c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q));
  });

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  selectCity(cityId: string): void {
    this.loanState.setSelectedCity(cityId);
    this.isOpen.set(false);
    this.search.set('');
  }
}
```

- [ ] **Step 2: Write `PropertySearchForm`**

Create `src/app/components/property-search-form.ts`:

```typescript
import { Component, computed, inject } from '@angular/core';
import { LoanState } from '../core/services/loan-state';
import { LOAN_PRODUCTS } from '../core/data/loan-products';
import { CitySelector } from './city-selector';

@Component({
  selector: 'app-property-search-form',
  imports: [CitySelector],
  template: `
    <div class="relative z-20 rounded-xl bg-white/5 border border-white/10 p-5 mb-6 backdrop-blur-sm">
      <h3 class="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">
        {{ product().id === 'home' ? 'Property Details' : product().name + ' Details' }}
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs text-white/50 mb-1">{{ product().id === 'home' ? 'Property Price' : 'Loan Amount' }}</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
            <input
              type="number"
              [value]="loanState.propertyPrice()"
              (input)="loanState.setPropertyPrice(+$any($event.target).value)"
              class="w-full pl-7 pr-3 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white text-sm outline-none focus:border-white/30 transition"
              min="0"
              step="1000"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs text-white/50 mb-1">Down Payment (%)</label>
          <input
            type="number"
            [value]="loanState.downPaymentPercent()"
            (input)="loanState.setDownPaymentPercent(+$any($event.target).value)"
            class="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white text-sm outline-none focus:border-white/30 transition"
            [attr.min]="product().minDownPaymentPercent"
            max="100"
            step="1"
          />
        </div>

        <div>
          <label class="block text-xs text-white/50 mb-1">Interest Rate (%)</label>
          <input
            type="number"
            [value]="loanState.interestRate()"
            (input)="loanState.setInterestRate(+$any($event.target).value)"
            class="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white text-sm outline-none focus:border-white/30 transition"
            min="0"
            max="30"
            step="0.125"
          />
        </div>

        <div>
          <label class="block text-xs text-white/50 mb-1">Loan Term</label>
          <select
            [value]="loanState.loanTerm()"
            (change)="loanState.setLoanTerm(+$any($event.target).value)"
            class="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white text-sm outline-none focus:border-white/30 transition cursor-pointer appearance-none"
          >
            @for (t of product().terms; track t) {
              <option [value]="t" class="bg-slate-800">{{ t }} {{ t === 1 ? 'year' : 'years' }}</option>
            }
          </select>
        </div>

        @if (product().id === 'home') {
          <app-city-selector />
        }
      </div>

      @if (product().id === 'home' && loanState.downPaymentPercent() < 20) {
        <div class="mt-3 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-xs">
          Down payment below 20% — PMI will be included in your payment estimate.
        </div>
      }
    </div>
  `,
})
export class PropertySearchForm {
  loanState = inject(LoanState);
  product = computed(() => LOAN_PRODUCTS.find((p) => p.id === this.loanState.loanProductId())!);
}
```

- [ ] **Step 3: Write `SalarySearchForm`**

Create `src/app/components/salary-search-form.ts`:

```typescript
import { Component, computed, inject } from '@angular/core';
import { LoanState } from '../core/services/loan-state';
import { LOAN_PRODUCTS } from '../core/data/loan-products';
import { CitySelector } from './city-selector';

@Component({
  selector: 'app-salary-search-form',
  imports: [CitySelector],
  template: `
    <div class="relative z-20 rounded-xl bg-white/5 border border-white/10 p-5 mb-6 backdrop-blur-sm">
      <h3 class="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Salary & Budget</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs text-white/50 mb-1">Annual Gross Salary</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
            <input
              type="number"
              [value]="loanState.annualSalary()"
              (input)="loanState.setAnnualSalary(+$any($event.target).value)"
              class="w-full pl-7 pr-3 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white text-sm outline-none focus:border-white/30 transition"
              min="0"
              step="5000"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs text-white/50 mb-1">Max DTI Ratio (%)</label>
          <input
            type="number"
            [value]="loanState.dtiRatio()"
            (input)="loanState.setDtiRatio(+$any($event.target).value)"
            class="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white text-sm outline-none focus:border-white/30 transition"
            min="10"
            max="50"
            step="1"
          />
        </div>

        <div>
          <label class="block text-xs text-white/50 mb-1">Interest Rate (%)</label>
          <input
            type="number"
            [value]="loanState.interestRate()"
            (input)="loanState.setInterestRate(+$any($event.target).value)"
            class="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white text-sm outline-none focus:border-white/30 transition"
            min="0"
            max="30"
            step="0.125"
          />
        </div>

        <div>
          <label class="block text-xs text-white/50 mb-1">Loan Term</label>
          <select
            [value]="loanState.loanTerm()"
            (change)="loanState.setLoanTerm(+$any($event.target).value)"
            class="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white text-sm outline-none focus:border-white/30 transition cursor-pointer appearance-none"
          >
            @for (t of product().terms; track t) {
              <option [value]="t" class="bg-slate-800">{{ t }} {{ t === 1 ? 'year' : 'years' }}</option>
            }
          </select>
        </div>

        <div>
          <label class="block text-xs text-white/50 mb-1">Down Payment (%)</label>
          <input
            type="number"
            [value]="loanState.downPaymentPercent()"
            (input)="loanState.setDownPaymentPercent(+$any($event.target).value)"
            class="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white text-sm outline-none focus:border-white/30 transition"
            [attr.min]="product().minDownPaymentPercent"
            max="100"
            step="1"
          />
        </div>

        @if (product().id === 'home') {
          <app-city-selector />
        }
      </div>
    </div>
  `,
})
export class SalarySearchForm {
  loanState = inject(LoanState);
  product = computed(() => LOAN_PRODUCTS.find((p) => p.id === this.loanState.loanProductId())!);
}
```

- [ ] **Step 4: Wire both forms into `App`, switching on search mode**

Update `src/app/app.ts`:

```typescript
import { Component, inject } from '@angular/core';
import { LoanState } from './core/services/loan-state';
import { DynamicBackground } from './components/dynamic-background';
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';
import { LoanProductSelector } from './components/loan-product-selector';
import { SearchModeToggle } from './components/search-mode-toggle';
import { PropertySearchForm } from './components/property-search-form';
import { SalarySearchForm } from './components/salary-search-form';

@Component({
  selector: 'app-root',
  imports: [DynamicBackground, Navbar, Footer, LoanProductSelector, SearchModeToggle, PropertySearchForm, SalarySearchForm],
  template: `
    <div class="min-h-screen relative text-white">
      <app-dynamic-background />
      <app-navbar />
      <main class="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <app-loan-product-selector />
        <app-search-mode-toggle />
        @if (loanState.searchMode() === 'property') {
          <app-property-search-form />
        } @else {
          <app-salary-search-form />
        }
        <p class="text-white/50 text-sm">Results coming next</p>
      </main>
      <app-footer />
    </div>
  `,
})
export class App {
  loanState = inject(LoanState);
}
```

- [ ] **Step 5: Verify the build**

```bash
npx ng build 2>&1 | tail -20
```

Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/app/components src/app/app.ts
git commit -m "Add city selector and property/salary search forms"
```

---

### Task 9: Results display and full calculation wiring

**Files:**
- Create: `src/app/components/amortization-results.ts`
- Create: `src/app/components/payment-breakdown-chart.ts`
- Create: `src/app/components/amortization-schedule.ts`
- Create: `src/app/components/salary-requirement.ts`
- Create: `src/app/components/affordability-result.ts`
- Modify: `src/app/app.ts`

**Interfaces:**
- Consumes: `PitiResult`, `AmortizationRow`, `LoanProduct`, `City` types (Task 2); `calculatePITI`, `generateAmortizationSchedule`, `calculateRequiredSalary`, `calculateMaxAffordablePrice`, `calculateMaxMonthlyBudget` (Task 2); `formatCurrency`, `formatCurrencyDetailed` (Task 2); `LoanState` (Task 4), `CityData` (Task 5)
- Produces: `AmortizationResults` (inputs `piti: PitiResult | null`, `product: LoanProduct`), `PaymentBreakdownChart` (same inputs), `AmortizationSchedule` (input `schedule: AmortizationRow[]`), `SalaryRequirement` (inputs `totalMonthly: number`, `maxDTI: number`), `AffordabilityResult` (inputs `annualSalary`, `dtiRatio`, `interestRate`, `loanTerm`, `downPaymentPercent`: `number`, `city: City | null`, `product: LoanProduct | null`); `App` now computes `piti`, `schedule`, `requiredSalary`, `maxAffordable`, `salaryPiti`, `salarySchedule`, `activePiti`, `activeSchedule` and syncs `CityData` to the selected city

- [ ] **Step 1: Write `AmortizationResults`**

Create `src/app/components/amortization-results.ts`:

```typescript
import { Component, computed, input } from '@angular/core';
import { formatCurrency, formatCurrencyDetailed } from '../core/utils/formatters';
import type { LoanProduct, PitiResult } from '../core/models/loan.models';

interface BreakdownItem { label: string; value: number; color: string; }

@Component({
  selector: 'app-amortization-results',
  template: `
    @if (piti(); as p) {
      <div class="rounded-xl bg-white/5 border border-white/10 p-5 mb-6 backdrop-blur-sm">
        <h3 class="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Monthly Payment Breakdown</h3>
        <div class="text-center mb-5">
          <div class="text-4xl font-bold text-white">{{ formatCurrencyDetailed(p.totalMonthly) }}</div>
          <div class="text-sm text-white/50 mt-1">per month</div>
        </div>
        <div class="space-y-2 mb-5">
          @for (item of items(); track item.label) {
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full" [style.background-color]="item.color"></div>
                <span class="text-sm text-white/70">{{ item.label }}</span>
              </div>
              <span class="text-sm font-medium text-white">{{ formatCurrencyDetailed(item.value) }}</span>
            </div>
          }
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
          <div class="text-center">
            <div class="text-xs text-white/40 mb-1">Down Payment</div>
            <div class="text-sm font-semibold text-white">{{ formatCurrency(p.downPayment) }}</div>
          </div>
          <div class="text-center">
            <div class="text-xs text-white/40 mb-1">Loan Amount</div>
            <div class="text-sm font-semibold text-white">{{ formatCurrency(p.loanAmount) }}</div>
          </div>
          <div class="text-center">
            <div class="text-xs text-white/40 mb-1">Total Interest</div>
            <div class="text-sm font-semibold text-white">{{ formatCurrency(p.totalInterest) }}</div>
          </div>
          <div class="text-center">
            <div class="text-xs text-white/40 mb-1">Total Cost</div>
            <div class="text-sm font-semibold text-white">{{ formatCurrency(p.totalCost) }}</div>
          </div>
        </div>
      </div>
    }
  `,
})
export class AmortizationResults {
  piti = input.required<PitiResult | null>();
  product = input.required<LoanProduct>();

  formatCurrency = formatCurrency;
  formatCurrencyDetailed = formatCurrencyDetailed;

  items = computed<BreakdownItem[]>(() => {
    const p = this.piti();
    const product = this.product();
    if (!p) return [];
    const result: BreakdownItem[] = [
      { label: 'Principal & Interest', value: p.monthlyPrincipalAndInterest, color: product.theme.accent },
    ];
    if (product.includesTax && p.monthlyTax > 0) result.push({ label: 'Property Tax', value: p.monthlyTax, color: '#f59e0b' });
    if (product.includesInsurance && p.monthlyInsurance > 0) result.push({ label: 'Insurance', value: p.monthlyInsurance, color: '#10b981' });
    if (p.monthlyPMI > 0) result.push({ label: 'PMI', value: p.monthlyPMI, color: '#f43f5e' });
    return result;
  });
}
```

- [ ] **Step 2: Write `PaymentBreakdownChart`**

Create `src/app/components/payment-breakdown-chart.ts`:

```typescript
import { Component, computed, input } from '@angular/core';
import type { LoanProduct, PitiResult } from '../core/models/loan.models';

interface DonutSegment {
  label: string;
  value: number;
  color: string;
  pct: number;
  dashArray: string;
  dashOffset: number;
}

const SIZE = 180;
const STROKE_WIDTH = 30;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

@Component({
  selector: 'app-payment-breakdown-chart',
  template: `
    @if (piti(); as p) {
      @if (p.totalMonthly > 0) {
        <div class="rounded-xl bg-white/5 border border-white/10 p-5 mb-6 backdrop-blur-sm">
          <h3 class="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Payment Distribution</h3>
          <div class="flex flex-col sm:flex-row items-center gap-6">
            <svg [attr.width]="size" [attr.height]="size" class="flex-shrink-0">
              @for (arc of arcs(); track arc.label) {
                <circle
                  [attr.cx]="size / 2"
                  [attr.cy]="size / 2"
                  [attr.r]="radius"
                  fill="none"
                  [attr.stroke]="arc.color"
                  [attr.stroke-width]="strokeWidth"
                  [attr.stroke-dasharray]="arc.dashArray"
                  [attr.stroke-dashoffset]="arc.dashOffset"
                  [attr.transform]="'rotate(-90 ' + size / 2 + ' ' + size / 2 + ')'"
                  class="transition-all duration-500"
                />
              }
              <text [attr.x]="size / 2" [attr.y]="size / 2 - 6" text-anchor="middle" class="fill-white text-lg font-bold" font-size="18">
                {{ '$' + roundedTotal() }}
              </text>
              <text [attr.x]="size / 2" [attr.y]="size / 2 + 12" text-anchor="middle" class="fill-white/50" font-size="11">/month</text>
            </svg>
            <div class="space-y-2 flex-1">
              @for (arc of arcs(); track arc.label) {
                <div class="flex items-center justify-between gap-4">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full" [style.background-color]="arc.color"></div>
                    <span class="text-sm text-white/70">{{ arc.label }}</span>
                  </div>
                  <span class="text-sm text-white/50">{{ (arc.pct * 100).toFixed(1) }}%</span>
                </div>
              }
            </div>
          </div>
        </div>
      }
    }
  `,
})
export class PaymentBreakdownChart {
  piti = input.required<PitiResult | null>();
  product = input.required<LoanProduct>();

  size = SIZE;
  strokeWidth = STROKE_WIDTH;
  radius = RADIUS;

  roundedTotal = computed(() => Math.round(this.piti()?.totalMonthly ?? 0));

  arcs = computed<DonutSegment[]>(() => {
    const p = this.piti();
    const product = this.product();
    if (!p || p.totalMonthly === 0) return [];
    const total = p.totalMonthly;
    const segments: { label: string; value: number; color: string }[] = [
      { label: 'Principal & Interest', value: p.monthlyPrincipalAndInterest, color: product.theme.accent },
    ];
    if (product.includesTax && p.monthlyTax > 0) segments.push({ label: 'Tax', value: p.monthlyTax, color: '#f59e0b' });
    if (product.includesInsurance && p.monthlyInsurance > 0) segments.push({ label: 'Insurance', value: p.monthlyInsurance, color: '#10b981' });
    if (p.monthlyPMI > 0) segments.push({ label: 'PMI', value: p.monthlyPMI, color: '#f43f5e' });

    let offset = 0;
    return segments.map((seg) => {
      const pct = seg.value / total;
      const dashArray = `${pct * CIRCUMFERENCE} ${CIRCUMFERENCE}`;
      const dashOffset = -offset * CIRCUMFERENCE;
      offset += pct;
      return { ...seg, pct, dashArray, dashOffset };
    });
  });
}
```

- [ ] **Step 3: Write `AmortizationSchedule`**

Create `src/app/components/amortization-schedule.ts`:

```typescript
import { Component, computed, input, signal } from '@angular/core';
import { formatCurrencyDetailed } from '../core/utils/formatters';
import type { AmortizationRow } from '../core/models/loan.models';

@Component({
  selector: 'app-amortization-schedule',
  template: `
    @if (schedule().length > 0) {
      <div class="rounded-xl bg-white/5 border border-white/10 p-5 mb-6 backdrop-blur-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-white/60 uppercase tracking-wider">Amortization Schedule</h3>
          <button (click)="isExpanded.set(!isExpanded())" class="text-xs text-white/40 hover:text-white/70 transition cursor-pointer">
            {{ isExpanded() ? 'Show less' : 'Show all ' + schedule().length + ' months' }}
          </button>
        </div>
        <div class="overflow-x-auto schedule-scroll">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-white/40 text-xs border-b border-white/10">
                <th class="pb-2 text-left font-medium">Month</th>
                <th class="pb-2 text-right font-medium">Payment</th>
                <th class="pb-2 text-right font-medium">Principal</th>
                <th class="pb-2 text-right font-medium">Interest</th>
                <th class="pb-2 text-right font-medium">Balance</th>
              </tr>
            </thead>
            <tbody>
              @for (row of displayRows(); track row.month) {
                <tr class="border-b border-white/5 text-white/70 hover:bg-white/5 transition">
                  <td class="py-2 text-left">{{ row.month }}</td>
                  <td class="py-2 text-right">{{ formatCurrencyDetailed(row.payment) }}</td>
                  <td class="py-2 text-right">{{ formatCurrencyDetailed(row.principalPayment) }}</td>
                  <td class="py-2 text-right">{{ formatCurrencyDetailed(row.interestPayment) }}</td>
                  <td class="py-2 text-right">{{ formatCurrencyDetailed(row.remainingBalance) }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        @if (!isExpanded() && schedule().length > 12) {
          <div class="mt-3 text-center">
            <button (click)="isExpanded.set(true)" class="text-xs text-white/40 hover:text-white/70 transition cursor-pointer">
              + {{ schedule().length - 12 }} more months
            </button>
          </div>
        }
      </div>
    }
  `,
})
export class AmortizationSchedule {
  schedule = input.required<AmortizationRow[]>();
  isExpanded = signal(false);

  formatCurrencyDetailed = formatCurrencyDetailed;

  displayRows = computed(() => (this.isExpanded() ? this.schedule() : this.schedule().slice(0, 12)));
}
```

- [ ] **Step 4: Write `SalaryRequirement`**

Create `src/app/components/salary-requirement.ts`:

```typescript
import { Component, computed, input } from '@angular/core';
import { formatCurrency } from '../core/utils/formatters';
import { calculateRequiredSalary } from '../core/utils/affordability';

@Component({
  selector: 'app-salary-requirement',
  template: `
    @if (totalMonthly() > 0) {
      <div class="rounded-xl bg-white/5 border border-white/10 p-5 mb-6 backdrop-blur-sm">
        <h3 class="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider">Salary Requirement</h3>
        <div class="text-center">
          <div class="text-3xl font-bold text-white">{{ formatCurrency(requiredSalary()) }}</div>
          <div class="text-sm text-white/50 mt-1">minimum annual gross salary needed</div>
          <div class="text-xs text-white/30 mt-2">
            Based on {{ maxDTI() }}% debt-to-income ratio (industry standard: housing costs ≤ {{ maxDTI() }}% of gross income)
          </div>
        </div>
      </div>
    }
  `,
})
export class SalaryRequirement {
  totalMonthly = input.required<number>();
  maxDTI = input.required<number>();

  formatCurrency = formatCurrency;
  requiredSalary = computed(() => calculateRequiredSalary(this.totalMonthly(), this.maxDTI()));
}
```

- [ ] **Step 5: Write `AffordabilityResult`**

Create `src/app/components/affordability-result.ts`:

```typescript
import { Component, computed, input } from '@angular/core';
import { formatCurrency, formatCurrencyDetailed } from '../core/utils/formatters';
import { calculateMaxAffordablePrice, calculateMaxMonthlyBudget } from '../core/utils/affordability';
import type { City, LoanProduct } from '../core/models/loan.models';

@Component({
  selector: 'app-affordability-result',
  template: `
    @if (annualSalary() > 0) {
      <div class="rounded-xl bg-white/5 border border-white/10 p-5 mb-6 backdrop-blur-sm">
        <h3 class="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider">What You Can Afford</h3>
        <div class="text-center mb-4">
          <div class="text-4xl font-bold text-white">{{ formatCurrency(maxPrice()) }}</div>
          <div class="text-sm text-white/50 mt-1">maximum {{ product()?.id === 'home' ? 'property price' : 'loan amount' }}</div>
        </div>
        <div class="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
          <div class="text-center">
            <div class="text-xs text-white/40 mb-1">Monthly Budget</div>
            <div class="text-sm font-semibold text-white">{{ formatCurrencyDetailed(monthlyBudget()) }}</div>
          </div>
          <div class="text-center">
            <div class="text-xs text-white/40 mb-1">Down Payment Needed</div>
            <div class="text-sm font-semibold text-white">{{ formatCurrency(maxPrice() * downPaymentPercent() / 100) }}</div>
          </div>
        </div>
      </div>
    }
  `,
})
export class AffordabilityResult {
  annualSalary = input.required<number>();
  dtiRatio = input.required<number>();
  interestRate = input.required<number>();
  loanTerm = input.required<number>();
  downPaymentPercent = input.required<number>();
  city = input.required<City | null>();
  product = input.required<LoanProduct | null>();

  formatCurrency = formatCurrency;
  formatCurrencyDetailed = formatCurrencyDetailed;

  maxPrice = computed(() =>
    calculateMaxAffordablePrice({
      annualSalary: this.annualSalary(),
      maxDTIPercent: this.dtiRatio(),
      annualRate: this.interestRate(),
      termYears: this.loanTerm(),
      downPaymentPercent: this.downPaymentPercent(),
      annualPropertyTaxRate: this.city()?.propertyTaxRate || 0,
      annualInsurance: this.city()?.avgHomeInsuranceAnnual || 0,
      pmiRate: this.product()?.pmiRate || 0.5,
      includesTax: this.product()?.includesTax || false,
      includesInsurance: this.product()?.includesInsurance || false,
      includesPMI: this.product()?.includesPMI || false,
    })
  );

  monthlyBudget = computed(() => calculateMaxMonthlyBudget(this.annualSalary(), this.dtiRatio()));
}
```

- [ ] **Step 6: Wire the full calculation chain into `App`**

Replace `src/app/app.ts`:

```typescript
import { Component, computed, effect, inject } from '@angular/core';
import { LoanState } from './core/services/loan-state';
import { CityData } from './core/services/city-data';
import { LOAN_PRODUCTS } from './core/data/loan-products';
import { calculatePITI, generateAmortizationSchedule } from './core/utils/amortization';
import { calculateRequiredSalary, calculateMaxAffordablePrice } from './core/utils/affordability';
import { DynamicBackground } from './components/dynamic-background';
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';
import { LoanProductSelector } from './components/loan-product-selector';
import { SearchModeToggle } from './components/search-mode-toggle';
import { PropertySearchForm } from './components/property-search-form';
import { SalarySearchForm } from './components/salary-search-form';
import { AmortizationResults } from './components/amortization-results';
import { PaymentBreakdownChart } from './components/payment-breakdown-chart';
import { AmortizationSchedule } from './components/amortization-schedule';
import { SalaryRequirement } from './components/salary-requirement';
import { AffordabilityResult } from './components/affordability-result';

@Component({
  selector: 'app-root',
  imports: [
    DynamicBackground, Navbar, Footer, LoanProductSelector, SearchModeToggle,
    PropertySearchForm, SalarySearchForm, AmortizationResults, PaymentBreakdownChart,
    AmortizationSchedule, SalaryRequirement, AffordabilityResult,
  ],
  template: `
    <div class="min-h-screen relative text-white">
      <app-dynamic-background />
      <app-navbar />
      <main class="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <app-loan-product-selector />
        <app-search-mode-toggle />

        @if (loanState.searchMode() === 'property') {
          <app-property-search-form />
        } @else {
          <app-salary-search-form />
        }

        @if (loanState.searchMode() === 'salary') {
          <app-affordability-result
            [annualSalary]="loanState.annualSalary()"
            [dtiRatio]="loanState.dtiRatio()"
            [interestRate]="loanState.interestRate()"
            [loanTerm]="loanState.loanTerm()"
            [downPaymentPercent]="loanState.downPaymentPercent()"
            [city]="cityData.city()"
            [product]="product()"
          />
        }

        @if (activePiti(); as piti) {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <app-amortization-results [piti]="piti" [product]="product()" />
            <app-payment-breakdown-chart [piti]="piti" [product]="product()" />
          </div>

          @if (loanState.searchMode() === 'property') {
            <app-salary-requirement [totalMonthly]="piti.totalMonthly" [maxDTI]="product().maxDTI" />
          }

          <app-amortization-schedule [schedule]="activeSchedule()" />
        }
      </main>
      <app-footer />
    </div>
  `,
})
export class App {
  loanState = inject(LoanState);
  cityData = inject(CityData);

  product = computed(() => LOAN_PRODUCTS.find((p) => p.id === this.loanState.loanProductId())!);

  constructor() {
    effect(() => {
      this.cityData.selectCity(this.loanState.selectedCityId());
    });
  }

  piti = computed(() => {
    if (this.loanState.searchMode() !== 'property') return null;
    const price = this.loanState.propertyPrice();
    if (!price || price <= 0) return null;
    const city = this.cityData.city();
    const product = this.product();
    return calculatePITI({
      propertyPrice: price,
      downPaymentPercent: this.loanState.downPaymentPercent(),
      annualRate: this.loanState.interestRate(),
      termYears: this.loanState.loanTerm(),
      annualPropertyTaxRate: city?.propertyTaxRate || 0,
      annualInsurance: city?.avgHomeInsuranceAnnual || 0,
      pmiRate: product.pmiRate || 0.5,
      includesTax: product.includesTax,
      includesInsurance: product.includesInsurance,
      includesPMI: product.includesPMI,
    });
  });

  schedule = computed(() => {
    const p = this.piti();
    if (!p) return [];
    return generateAmortizationSchedule(p.loanAmount, this.loanState.interestRate(), this.loanState.loanTerm());
  });

  requiredSalary = computed(() => {
    const p = this.piti();
    if (!p) return 0;
    return calculateRequiredSalary(p.totalMonthly, this.product().maxDTI);
  });

  maxAffordable = computed(() => {
    if (this.loanState.searchMode() !== 'salary') return 0;
    const salary = this.loanState.annualSalary();
    if (!salary || salary <= 0) return 0;
    const city = this.cityData.city();
    const product = this.product();
    return calculateMaxAffordablePrice({
      annualSalary: salary,
      maxDTIPercent: this.loanState.dtiRatio(),
      annualRate: this.loanState.interestRate(),
      termYears: this.loanState.loanTerm(),
      downPaymentPercent: this.loanState.downPaymentPercent(),
      annualPropertyTaxRate: city?.propertyTaxRate || 0,
      annualInsurance: city?.avgHomeInsuranceAnnual || 0,
      pmiRate: product.pmiRate || 0.5,
      includesTax: product.includesTax,
      includesInsurance: product.includesInsurance,
      includesPMI: product.includesPMI,
    });
  });

  salaryPiti = computed(() => {
    const maxAff = this.maxAffordable();
    if (this.loanState.searchMode() !== 'salary' || !maxAff || maxAff <= 0) return null;
    const city = this.cityData.city();
    const product = this.product();
    return calculatePITI({
      propertyPrice: maxAff,
      downPaymentPercent: this.loanState.downPaymentPercent(),
      annualRate: this.loanState.interestRate(),
      termYears: this.loanState.loanTerm(),
      annualPropertyTaxRate: city?.propertyTaxRate || 0,
      annualInsurance: city?.avgHomeInsuranceAnnual || 0,
      pmiRate: product.pmiRate || 0.5,
      includesTax: product.includesTax,
      includesInsurance: product.includesInsurance,
      includesPMI: product.includesPMI,
    });
  });

  salarySchedule = computed(() => {
    const p = this.salaryPiti();
    if (!p) return [];
    return generateAmortizationSchedule(p.loanAmount, this.loanState.interestRate(), this.loanState.loanTerm());
  });

  activePiti = computed(() => (this.loanState.searchMode() === 'property' ? this.piti() : this.salaryPiti()));
  activeSchedule = computed(() => (this.loanState.searchMode() === 'property' ? this.schedule() : this.salarySchedule()));
}
```

- [ ] **Step 7: Verify the build**

```bash
npx ng build 2>&1 | tail -20
```

Expected: build succeeds.

- [ ] **Step 8: Commit**

```bash
git add src/app/components src/app/app.ts
git commit -m "Add results display components and wire full calculation chain into App"
```

---

### Task 10: Supplementary panels and final App parity

**Files:**
- Create: `src/app/components/city-info-panel.ts`
- Create: `src/app/components/job-listings.ts`
- Create: `src/app/components/realtor-listings.ts`
- Modify: `src/app/app.ts`

**Interfaces:**
- Consumes: `City`, `Job` types (Task 2); `JOBS` (Task 3); `generateRealtorLinks` (Task 2); `formatNumber`, `formatPercent`, `formatCurrency` (Task 2); `LiveWeather` (Task 5); `App`'s existing computed signals (Task 9)
- Produces: `CityInfoPanel` (inputs `city: City | null`, `liveWeather: LiveWeather | null`, `isEnriching: boolean`), `JobListings` (input `targetSalary: number`), `RealtorListings` (inputs `city: City | null`, `maxAffordablePrice: number`); `App` gains `targetSalary`, `targetPrice`, `showCityInfo` computed signals and renders the final layout matching `App.jsx` exactly

- [ ] **Step 1: Write `CityInfoPanel`**

Create `src/app/components/city-info-panel.ts`:

```typescript
import { Component, input } from '@angular/core';
import { formatNumber, formatPercent } from '../core/utils/formatters';
import type { City } from '../core/models/loan.models';
import type { LiveWeather } from '../core/services/city-data';

@Component({
  selector: 'app-city-info-panel',
  template: `
    @if (city(); as c) {
      <div class="rounded-xl bg-white/5 border border-white/10 p-5 mb-6 backdrop-blur-sm">
        <h3 class="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">About {{ c.name }}, {{ c.state }}</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-4 rounded-lg bg-white/5 border border-white/5">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-lg">🌤️</span>
              <span class="text-sm font-medium text-white">Weather</span>
              @if (isEnriching()) {
                <span class="text-xs text-white/30 animate-pulse">updating...</span>
              }
            </div>
            @if (liveWeather(); as w) {
              <div class="mb-2 px-2 py-1 rounded bg-white/5 text-xs text-white/70">
                Now: {{ w.currentTemp }}°F, Wind {{ w.windSpeed }} mph
              </div>
            }
            <div class="space-y-1 text-xs text-white/60">
              <div class="flex justify-between"><span>Summer High</span><span class="text-white/80">{{ c.weather.avgHighSummer }}°F</span></div>
              <div class="flex justify-between"><span>Winter Low</span><span class="text-white/80">{{ c.weather.avgLowWinter }}°F</span></div>
              <div class="flex justify-between"><span>Annual Rainfall</span><span class="text-white/80">{{ c.weather.avgAnnualRainfall }}"</span></div>
              <div class="flex justify-between"><span>Sunny Days</span><span class="text-white/80">{{ c.weather.avgSunnyDays }}/yr</span></div>
              <div class="mt-1 text-white/40">{{ c.weather.climateType }}</div>
            </div>
          </div>

          <div class="p-4 rounded-lg bg-white/5 border border-white/5">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-lg">🎓</span>
              <span class="text-sm font-medium text-white">Schools</span>
            </div>
            <div class="space-y-1 text-xs text-white/60">
              <div class="flex justify-between"><span>Avg Rating</span><span class="text-white/80">{{ c.schools.rating }}/10</span></div>
              <div class="flex justify-between"><span>Total Schools</span><span class="text-white/80">{{ formatNumber(c.schools.totalSchools) }}</span></div>
              <div class="flex justify-between"><span>Student:Teacher</span><span class="text-white/80">{{ c.schools.studentTeacherRatio }}:1</span></div>
              <div class="mt-1 text-white/40">Top: {{ c.schools.topDistrict }}</div>
            </div>
          </div>

          <div class="p-4 rounded-lg bg-white/5 border border-white/5">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-lg">🚶</span>
              <span class="text-sm font-medium text-white">Walkability</span>
            </div>
            <div class="space-y-2 text-xs">
              @for (item of walkabilityItems(c); track item.label) {
                <div>
                  <div class="flex justify-between text-white/60 mb-1"><span>{{ item.label }}</span><span class="text-white/80">{{ item.value }}/100</span></div>
                  <div class="w-full h-1.5 rounded-full bg-white/10">
                    <div class="h-full rounded-full transition-all duration-500" [style.width.%]="item.value" [style.background-color]="item.value >= 70 ? '#22c55e' : item.value >= 40 ? '#f59e0b' : '#ef4444'"></div>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="p-4 rounded-lg bg-white/5 border border-white/5">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-lg">👥</span>
              <span class="text-sm font-medium text-white">Demographics</span>
            </div>
            <div class="space-y-1 text-xs text-white/60">
              <div class="flex justify-between"><span>Population</span><span class="text-white/80">{{ formatNumber(c.demographics.population) }}</span></div>
              <div class="flex justify-between"><span>Median Age</span><span class="text-white/80">{{ c.demographics.medianAge }}</span></div>
              <div class="flex justify-between"><span>Median Income</span><span class="text-white/80">{{ '$' + formatNumber(c.demographics.medianHouseholdIncome) }}</span></div>
              <div class="flex justify-between"><span>Cost of Living</span><span class="text-white/80">{{ c.demographics.costOfLivingIndex }} (100=avg)</span></div>
              <div class="mt-2 text-white/40">
                Age groups: Under 18: {{ formatPercent(c.demographics.ageDistribution.under18, 0) }} |
                18-34: {{ formatPercent(c.demographics.ageDistribution.age18to34, 0) }} |
                35-54: {{ formatPercent(c.demographics.ageDistribution.age35to54, 0) }} |
                55+: {{ formatPercent(c.demographics.ageDistribution.age55to74 + c.demographics.ageDistribution.age75plus, 0) }}
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
          <div class="text-center">
            <div class="text-xs text-white/40 mb-1">Property Tax Rate</div>
            <div class="text-sm font-semibold text-white">{{ formatPercent(c.propertyTaxRate) }}</div>
          </div>
          <div class="text-center">
            <div class="text-xs text-white/40 mb-1">State Income Tax</div>
            <div class="text-sm font-semibold text-white">{{ c.stateTaxRate === 0 ? 'None' : formatPercent(c.stateTaxRate) }}</div>
          </div>
          <div class="text-center">
            <div class="text-xs text-white/40 mb-1">Sales Tax</div>
            <div class="text-sm font-semibold text-white">{{ formatPercent(c.salesTaxRate) }}</div>
          </div>
        </div>
      </div>
    }
  `,
})
export class CityInfoPanel {
  city = input.required<City | null>();
  liveWeather = input.required<LiveWeather | null>();
  isEnriching = input.required<boolean>();

  formatNumber = formatNumber;
  formatPercent = formatPercent;

  walkabilityItems(city: City) {
    return [
      { label: 'Walk Score', value: city.walkability.walkScore },
      { label: 'Transit Score', value: city.walkability.transitScore },
      { label: 'Bike Score', value: city.walkability.bikeScore },
    ];
  }
}
```

- [ ] **Step 2: Write `JobListings`**

Create `src/app/components/job-listings.ts`:

```typescript
import { Component, computed, input, signal } from '@angular/core';
import { JOBS } from '../core/data/jobs';
import { formatCurrency } from '../core/utils/formatters';
import type { Job } from '../core/models/loan.models';

@Component({
  selector: 'app-job-listings',
  template: `
    @if (targetSalary() > 0) {
      <div class="rounded-xl bg-white/5 border border-white/10 p-5 mb-6 backdrop-blur-sm">
        <h3 class="text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Jobs in This Salary Range</h3>
        <p class="text-xs text-white/30 mb-4">Showing jobs with median salary near {{ formatCurrency(targetSalary()) }} (±15%)</p>

        @if (matchingJobs().length === 0) {
          <div class="text-center py-4 text-white/30 text-sm">
            No matching jobs found for this salary range. Try adjusting the property price or salary.
          </div>
        } @else {
          <div class="space-y-2">
            @for (group of groupedJobs(); track group.category) {
              <div class="rounded-lg bg-white/5 border border-white/5">
                <button (click)="toggleCategory(group.category)" class="w-full px-4 py-2.5 flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition rounded-lg">
                  <span class="text-sm font-medium text-white/80">{{ group.category }}</span>
                  <span class="text-xs text-white/40">{{ group.jobs.length }} {{ group.jobs.length === 1 ? 'job' : 'jobs' }}</span>
                </button>
                @if (expandedCategory() === group.category) {
                  <div class="px-4 pb-3 space-y-2">
                    @for (job of group.jobs; track job.title) {
                      <div class="flex items-center justify-between py-1.5 border-t border-white/5">
                        <div>
                          <div class="text-sm text-white/70">{{ job.title }}</div>
                          <div class="text-xs text-white/30">{{ job.educationRequired }} · {{ job.growth }} growth</div>
                        </div>
                        <div class="text-right">
                          <div class="text-sm text-white/70">{{ formatCurrency(job.salaryMedian) }}</div>
                          <div class="text-xs text-white/30">{{ formatCurrency(job.salaryMin) }} – {{ formatCurrency(job.salaryMax) }}</div>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    }
  `,
})
export class JobListings {
  targetSalary = input.required<number>();
  expandedCategory = signal<string | null>(null);

  formatCurrency = formatCurrency;

  matchingJobs = computed<Job[]>(() => {
    const target = this.targetSalary();
    if (!target || target <= 0) return [];
    const buffer = 0.15;
    const min = target * (1 - buffer);
    const max = target * (1 + buffer);
    return JOBS.filter((job) => job.salaryMedian >= min && job.salaryMedian <= max);
  });

  groupedJobs = computed<{ category: string; jobs: Job[] }[]>(() => {
    const groups = new Map<string, Job[]>();
    for (const job of this.matchingJobs()) {
      const list = groups.get(job.category) ?? [];
      list.push(job);
      groups.set(job.category, list);
    }
    return Array.from(groups.entries()).map(([category, jobs]) => ({ category, jobs }));
  });

  toggleCategory(category: string): void {
    this.expandedCategory.set(this.expandedCategory() === category ? null : category);
  }
}
```

- [ ] **Step 3: Write `RealtorListings`**

Create `src/app/components/realtor-listings.ts`:

```typescript
import { Component, computed, input } from '@angular/core';
import { generateRealtorLinks } from '../core/utils/realtor-url';
import type { City } from '../core/models/loan.models';

@Component({
  selector: 'app-realtor-listings',
  template: `
    @if (city(); as c) {
      <div class="rounded-xl bg-white/5 border border-white/10 p-5 mb-6 backdrop-blur-sm">
        <h3 class="text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Real Estate Listings</h3>
        <p class="text-xs text-white/30 mb-4">Browse current listings on Realtor.com for {{ c.name }}, {{ c.state }}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          @for (link of links(); track link.url) {
            <a [href]="link.url" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition group">
              <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm group-hover:bg-white/15 transition">🏠</div>
              <div class="flex-1 min-w-0">
                <div class="text-sm text-white/80 group-hover:text-white transition truncate">{{ link.label }}</div>
                <div class="text-xs text-white/30">realtor.com →</div>
              </div>
            </a>
          }
        </div>
      </div>
    }
  `,
})
export class RealtorListings {
  city = input.required<City | null>();
  maxAffordablePrice = input.required<number>();

  links = computed(() => {
    const c = this.city();
    const price = this.maxAffordablePrice();
    if (!c || !price || price <= 0) return [];
    return generateRealtorLinks(c, price);
  });
}
```

- [ ] **Step 4: Finish `App` — add the three panels and the remaining derived signals**

Update `src/app/app.ts`: add the three new imports/component references, and append `targetSalary`, `targetPrice`, `showCityInfo` computed signals. The full, final file:

```typescript
import { Component, computed, effect, inject } from '@angular/core';
import { LoanState } from './core/services/loan-state';
import { CityData } from './core/services/city-data';
import { LOAN_PRODUCTS } from './core/data/loan-products';
import { calculatePITI, generateAmortizationSchedule } from './core/utils/amortization';
import { calculateRequiredSalary, calculateMaxAffordablePrice } from './core/utils/affordability';
import { DynamicBackground } from './components/dynamic-background';
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';
import { LoanProductSelector } from './components/loan-product-selector';
import { SearchModeToggle } from './components/search-mode-toggle';
import { PropertySearchForm } from './components/property-search-form';
import { SalarySearchForm } from './components/salary-search-form';
import { AmortizationResults } from './components/amortization-results';
import { PaymentBreakdownChart } from './components/payment-breakdown-chart';
import { AmortizationSchedule } from './components/amortization-schedule';
import { SalaryRequirement } from './components/salary-requirement';
import { AffordabilityResult } from './components/affordability-result';
import { CityInfoPanel } from './components/city-info-panel';
import { JobListings } from './components/job-listings';
import { RealtorListings } from './components/realtor-listings';

@Component({
  selector: 'app-root',
  imports: [
    DynamicBackground, Navbar, Footer, LoanProductSelector, SearchModeToggle,
    PropertySearchForm, SalarySearchForm, AmortizationResults, PaymentBreakdownChart,
    AmortizationSchedule, SalaryRequirement, AffordabilityResult, CityInfoPanel,
    JobListings, RealtorListings,
  ],
  template: `
    <div class="min-h-screen relative text-white">
      <app-dynamic-background />
      <app-navbar />
      <main class="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <app-loan-product-selector />
        <app-search-mode-toggle />

        @if (loanState.searchMode() === 'property') {
          <app-property-search-form />
        } @else {
          <app-salary-search-form />
        }

        @if (loanState.searchMode() === 'salary') {
          <app-affordability-result
            [annualSalary]="loanState.annualSalary()"
            [dtiRatio]="loanState.dtiRatio()"
            [interestRate]="loanState.interestRate()"
            [loanTerm]="loanState.loanTerm()"
            [downPaymentPercent]="loanState.downPaymentPercent()"
            [city]="cityData.city()"
            [product]="product()"
          />
        }

        @if (activePiti(); as piti) {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <app-amortization-results [piti]="piti" [product]="product()" />
            <app-payment-breakdown-chart [piti]="piti" [product]="product()" />
          </div>

          @if (loanState.searchMode() === 'property') {
            <app-salary-requirement [totalMonthly]="piti.totalMonthly" [maxDTI]="product().maxDTI" />
          }

          <app-amortization-schedule [schedule]="activeSchedule()" />
        }

        @if (showCityInfo(); as city) {
          <app-city-info-panel [city]="city" [liveWeather]="cityData.liveWeather()" [isEnriching]="cityData.isEnriching()" />
        }

        <app-job-listings [targetSalary]="targetSalary()" />

        @if (showCityInfo(); as city) {
          <app-realtor-listings [city]="city" [maxAffordablePrice]="targetPrice()" />
        }
      </main>
      <app-footer />
    </div>
  `,
})
export class App {
  loanState = inject(LoanState);
  cityData = inject(CityData);

  product = computed(() => LOAN_PRODUCTS.find((p) => p.id === this.loanState.loanProductId())!);

  constructor() {
    effect(() => {
      this.cityData.selectCity(this.loanState.selectedCityId());
    });
  }

  piti = computed(() => {
    if (this.loanState.searchMode() !== 'property') return null;
    const price = this.loanState.propertyPrice();
    if (!price || price <= 0) return null;
    const city = this.cityData.city();
    const product = this.product();
    return calculatePITI({
      propertyPrice: price,
      downPaymentPercent: this.loanState.downPaymentPercent(),
      annualRate: this.loanState.interestRate(),
      termYears: this.loanState.loanTerm(),
      annualPropertyTaxRate: city?.propertyTaxRate || 0,
      annualInsurance: city?.avgHomeInsuranceAnnual || 0,
      pmiRate: product.pmiRate || 0.5,
      includesTax: product.includesTax,
      includesInsurance: product.includesInsurance,
      includesPMI: product.includesPMI,
    });
  });

  schedule = computed(() => {
    const p = this.piti();
    if (!p) return [];
    return generateAmortizationSchedule(p.loanAmount, this.loanState.interestRate(), this.loanState.loanTerm());
  });

  requiredSalary = computed(() => {
    const p = this.piti();
    if (!p) return 0;
    return calculateRequiredSalary(p.totalMonthly, this.product().maxDTI);
  });

  maxAffordable = computed(() => {
    if (this.loanState.searchMode() !== 'salary') return 0;
    const salary = this.loanState.annualSalary();
    if (!salary || salary <= 0) return 0;
    const city = this.cityData.city();
    const product = this.product();
    return calculateMaxAffordablePrice({
      annualSalary: salary,
      maxDTIPercent: this.loanState.dtiRatio(),
      annualRate: this.loanState.interestRate(),
      termYears: this.loanState.loanTerm(),
      downPaymentPercent: this.loanState.downPaymentPercent(),
      annualPropertyTaxRate: city?.propertyTaxRate || 0,
      annualInsurance: city?.avgHomeInsuranceAnnual || 0,
      pmiRate: product.pmiRate || 0.5,
      includesTax: product.includesTax,
      includesInsurance: product.includesInsurance,
      includesPMI: product.includesPMI,
    });
  });

  salaryPiti = computed(() => {
    const maxAff = this.maxAffordable();
    if (this.loanState.searchMode() !== 'salary' || !maxAff || maxAff <= 0) return null;
    const city = this.cityData.city();
    const product = this.product();
    return calculatePITI({
      propertyPrice: maxAff,
      downPaymentPercent: this.loanState.downPaymentPercent(),
      annualRate: this.loanState.interestRate(),
      termYears: this.loanState.loanTerm(),
      annualPropertyTaxRate: city?.propertyTaxRate || 0,
      annualInsurance: city?.avgHomeInsuranceAnnual || 0,
      pmiRate: product.pmiRate || 0.5,
      includesTax: product.includesTax,
      includesInsurance: product.includesInsurance,
      includesPMI: product.includesPMI,
    });
  });

  salarySchedule = computed(() => {
    const p = this.salaryPiti();
    if (!p) return [];
    return generateAmortizationSchedule(p.loanAmount, this.loanState.interestRate(), this.loanState.loanTerm());
  });

  activePiti = computed(() => (this.loanState.searchMode() === 'property' ? this.piti() : this.salaryPiti()));
  activeSchedule = computed(() => (this.loanState.searchMode() === 'property' ? this.schedule() : this.salarySchedule()));
  targetSalary = computed(() => (this.loanState.searchMode() === 'property' ? this.requiredSalary() : this.loanState.annualSalary()));
  targetPrice = computed(() => (this.loanState.searchMode() === 'property' ? this.loanState.propertyPrice() : this.maxAffordable()));
  showCityInfo = computed(() => (this.product().id === 'home' && this.cityData.city() ? this.cityData.city() : null));
}
```

- [ ] **Step 5: Verify the build and full test suite**

```bash
npx ng build 2>&1 | tail -20
npx ng test --watch=false 2>&1 | tail -40
```

Expected: both succeed. This is now a feature-complete Angular port of `loan_lens/src/App.jsx`.

- [ ] **Step 6: Commit**

```bash
git add src/app/components src/app/app.ts
git commit -m "Add city info, job listings, and realtor listings panels; finish App parity"
```

---

### Task 11: Manual QA verification pass

**Files:** none (verification only)

**Interfaces:**
- Consumes: the complete app from Tasks 1–10
- Produces: a verified-working app, ready for the visual redesign pass

- [ ] **Step 1: Start the dev server**

```bash
cd ~/coding_stuff/personal_projects/loan-lens-angular
npx ng serve &
```

- [ ] **Step 2: Browser-verify the checklist from the approved spec**

Using the claude-in-chrome browser tools (or ask the user to check manually if unavailable), navigate to `http://localhost:4200` and verify:

1. Both search modes work: "Search by Property" shows a property price + PITI breakdown; "Search by Salary" shows salary/DTI inputs + "What You Can Afford".
2. Switching between at least 3 of the 4 loan products (Home, Auto, Personal, Student) changes the background gradient, the form fields shown, and recalculates results.
3. Changing the city in the City dropdown (Home product, Property mode) updates the City Info panel, refetches live weather, and updates the Realtor Listings links.
4. The payment breakdown donut chart renders and its segment percentages sum to ~100%.
5. The amortization schedule table shows 12 rows by default and expands to the full term on "Show all N months".
6. Job Listings shows jobs near the target salary and categories expand/collapse on click.
7. Reload the page: the previously-selected loan product, search mode, and input values are restored from `localStorage`.

- [ ] **Step 3: Fix any discrepancies found**

If any check fails, fix it in the relevant component/service file from Tasks 1–10 and re-verify. Do not proceed to Task 12 until all 7 checks pass.

- [ ] **Step 4: Stop the dev server**

```bash
kill %1
```

---

### Task 12: Visual redesign via `frontend-design`

**Files:** likely touches every file under `src/app/components/`, `src/app/app.ts`, and `src/styles.css` — exact file list depends on the design produced

**Interfaces:**
- Consumes: the complete, QA-verified app from Tasks 1–11
- Produces: the same functional app with a new, distinct visual identity (not a copy of the React app's blue/red/green/purple glass-panel look)

- [ ] **Step 1: Invoke the `frontend-design` skill**

Use the Skill tool to invoke `frontend-design`. Brief it with: this is LoanLens, a loan/mortgage affordability calculator (property-price-to-payment and salary-to-max-price modes) with 4 loan product types that re-theme the whole UI (home/auto/personal/student), a payment breakdown donut chart, an amortization table, and city/job/listings panels. The existing React version uses a dark glassmorphism look (frosted white/10 panels over a gradient background); this Angular version should get a genuinely distinct design system — new color language, typography, and layout treatment — while preserving the same information architecture (product selector → search form → results → city/jobs/listings) and the per-product re-theming concept.

- [ ] **Step 2: Apply the resulting design system**

Update `src/styles.css` with the new design tokens (colors, fonts, etc.) and update each component's Tailwind classes to match, keeping every `input()`/signal binding, `@if`/`@for` block, and event handler unchanged — this is a visual pass only, not a behavior change.

- [ ] **Step 3: Re-run the full verification**

```bash
npx ng build 2>&1 | tail -20
npx ng test --watch=false 2>&1 | tail -40
```

Expected: both still succeed (confirms the redesign didn't break any logic or wiring).

- [ ] **Step 4: Re-run the Task 11 manual QA checklist**

Confirm all 7 checks from Task 11 still pass with the new visual design.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Apply frontend-design visual system"
```

---

### Task 13: Deploy to Vercel

**Files:** none (deployment only)

**Interfaces:**
- Consumes: the finished, redesigned app from Task 12
- Produces: a live Vercel URL for `loan-lens-angular`

- [ ] **Step 1: Deploy a preview**

```bash
cd ~/coding_stuff/personal_projects/loan-lens-angular
vercel --yes
```

This creates the Vercel project (already authenticated as `thejaredchapman`) and returns a preview URL. Vercel auto-detects the Angular framework and build output (`dist/loan-lens-angular/browser`); if it does not, set the output directory explicitly when prompted.

- [ ] **Step 2: Verify the preview**

Open the returned preview URL and spot-check that the app loads and the loan-product selector responds to clicks.

- [ ] **Step 3: Confirm with the user before going to production**

Stop and ask the user to confirm before running the production deploy — this is the step that makes the app live at its permanent URL.

- [ ] **Step 4: Deploy to production**

```bash
vercel --prod --yes
```

- [ ] **Step 5: Record the production URL**

Note the returned production URL — it is needed by the `loan-lens-landing` plan (separate document) to link to this app.
