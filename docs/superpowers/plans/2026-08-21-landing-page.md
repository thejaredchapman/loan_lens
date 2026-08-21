# LoanLens Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy the existing `loan_lens` React app as-is, then build and deploy `loan-lens-landing` — a single static case-study page explaining what LoanLens is, why it was built twice, and how each version was built, linking out to both live apps.

**Architecture:** A single self-contained static HTML page (no framework, no build step) with inline CSS. Deployed to Vercel as a zero-config static site.

**Tech Stack:** Plain HTML + CSS. No JS framework, no bundler.

## Global Constraints

- **Prerequisite:** the `loan-lens-angular` production URL must exist before Task 4 of this plan (the final link-and-deploy step). That comes from `docs/superpowers/plans/2026-08-21-angular-port.md`, Task 13. If it isn't recorded anywhere accessible, retrieve it by running `vercel ls` inside `~/coding_stuff/personal_projects/loan-lens-angular` (lists deployments, including the current production one) or by asking the user.
- Repo lives at `~/coding_stuff/personal_projects/loan-lens-landing`, a sibling of `loan_lens/` and `loan-lens-angular/`.
- **Every task assumes a fresh shell** — if tasks run via `subagent-driven-development`, `cd` to the relevant project directory as the first line of every bash step; don't rely on a previous task's `cd` persisting.
- Tone: general-audience hero, technical "how it was built" section — per the approved spec, both audiences get their own section rather than one blended tone.
- No automated tests — this is a static marketing/explainer page with no logic to unit test. Verification is visual (open it in a browser).

---

### Task 1: Deploy the existing React app to Vercel

**Files:** none (deployment only, no code changes to `loan_lens/`)

**Interfaces:**
- Consumes: nothing
- Produces: a live production URL for the existing React app, needed by Task 4 of this plan

- [ ] **Step 1: Deploy a preview**

```bash
cd ~/coding_stuff/personal_projects/loan_lens
vercel --yes
```

This links the directory to a new Vercel project (already authenticated as `thejaredchapman`) and returns a preview URL. Vercel auto-detects the Vite/React preset.

- [ ] **Step 2: Verify the preview**

Open the returned preview URL and confirm the app loads and the loan product selector responds to clicks.

- [ ] **Step 3: Confirm with the user before going to production**

Stop and ask the user to confirm before running the production deploy.

- [ ] **Step 4: Deploy to production**

```bash
vercel --prod --yes
```

- [ ] **Step 5: Record the production URL**

Note the returned production URL — it is needed by Task 4 of this plan.

---

### Task 2: Scaffold the landing page with real content

**Files:**
- Create: `loan-lens-landing/index.html`
- Create: `loan-lens-landing/.gitignore`

**Interfaces:**
- Consumes: nothing
- Produces: a complete, real (if plainly styled) static page with Hero / Why / How / Links sections, ready for a visual redesign pass in Task 3

- [ ] **Step 1: Create the repo**

```bash
mkdir -p ~/coding_stuff/personal_projects/loan-lens-landing
cd ~/coding_stuff/personal_projects/loan-lens-landing
git init
```

- [ ] **Step 2: Add a `.gitignore`**

```
.vercel
.DS_Store
```

- [ ] **Step 3: Write the page**

Create `index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LoanLens — built twice, on purpose</title>
  <meta name="description" content="LoanLens is a loan and mortgage affordability calculator, built once in React and once in Angular as a direct comparison of both frameworks' current idioms." />
  <style>
    :root {
      --bg: #0b1020;
      --bg-panel: rgba(255, 255, 255, 0.05);
      --border: rgba(255, 255, 255, 0.1);
      --text: #f4f6fb;
      --text-dim: rgba(244, 246, 251, 0.6);
      --text-dimmer: rgba(244, 246, 251, 0.35);
      --accent-react: #61dafb;
      --accent-angular: #dd0031;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
      line-height: 1.5;
    }
    .wrap { max-width: 960px; margin: 0 auto; padding: 0 1.5rem; }
    header.hero { padding: 6rem 0 4rem; text-align: center; }
    header.hero h1 { font-size: 3rem; margin: 0 0 1rem; }
    header.hero p.tagline { font-size: 1.25rem; color: var(--text-dim); max-width: 40rem; margin: 0 auto 2rem; }
    .cta-row { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    .cta {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border);
      background: var(--bg-panel);
      color: var(--text);
      text-decoration: none;
      font-weight: 600;
    }
    .cta.react { border-color: var(--accent-react); }
    .cta.angular { border-color: var(--accent-angular); }
    section { padding: 3rem 0; border-top: 1px solid var(--border); }
    section h2 { font-size: 1.75rem; margin-bottom: 1rem; }
    section p { color: var(--text-dim); max-width: 42rem; }
    .stack-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 2rem; }
    @media (max-width: 640px) { .stack-grid { grid-template-columns: 1fr; } }
    .stack-card { border: 1px solid var(--border); background: var(--bg-panel); border-radius: 0.75rem; padding: 1.5rem; }
    .stack-card h3 { margin-top: 0; }
    .stack-card ul { color: var(--text-dim); padding-left: 1.25rem; margin: 0; }
    .stack-card li { margin-bottom: 0.4rem; }
    .shared-notes { margin-top: 2rem; padding: 1.5rem; border: 1px solid var(--border); border-radius: 0.75rem; background: var(--bg-panel); }
    .shared-notes h3 { margin-top: 0; }
    .shared-notes ul { color: var(--text-dim); padding-left: 1.25rem; }
    footer { padding: 3rem 0; text-align: center; color: var(--text-dimmer); font-size: 0.85rem; }
  </style>
</head>
<body>
  <div class="wrap">
    <header class="hero">
      <h1>LoanLens</h1>
      <p class="tagline">
        Figure out what you can actually afford. Tell it a property price and it works out your monthly payment —
        or tell it your salary and it works out your max price. Covers mortgages, auto loans, personal loans, and student loans.
      </p>
      <div class="cta-row">
        <a class="cta react" href="#" id="react-link">Try the React version →</a>
        <a class="cta angular" href="#" id="angular-link">Try the Angular version →</a>
      </div>
    </header>

    <section>
      <h2>Why it was built</h2>
      <p>
        Mortgage math — PITI, DTI, amortization, PMI thresholds — is usually locked inside a loan officer's tool or a
        spreadsheet. LoanLens makes it a live, editable calculator: change the interest rate or the down payment and
        watch the monthly payment, the salary requirement, and the amortization schedule update immediately.
      </p>
      <p>
        It was built twice, on purpose. Rather than a toy "hello world" per framework, the same real product spec —
        two search modes, four loan products with their own PMI/DTI rules, a live weather-enriched city panel, a
        payment breakdown chart — was implemented once in React and once in Angular, as a direct comparison of both
        frameworks' current idioms on identical requirements.
      </p>
    </section>

    <section>
      <h2>How it was built</h2>
      <p>Same product, two different framework toolkits — no shared code between the two apps.</p>
      <div class="stack-grid">
        <div class="stack-card">
          <h3>React edition</h3>
          <ul>
            <li>React 19 + Vite</li>
            <li>Tailwind CSS v4</li>
            <li>Zustand store with <code>persist</code> middleware for saved inputs</li>
            <li>Derived values (payment, schedule, affordability) via <code>useMemo</code></li>
          </ul>
        </div>
        <div class="stack-card">
          <h3>Angular edition</h3>
          <ul>
            <li>Angular 22, standalone components, inline templates</li>
            <li>Tailwind CSS v4</li>
            <li><code>@Service()</code>-provided state with signals, synced to <code>localStorage</code> via an <code>effect()</code></li>
            <li>Derived values via <code>computed()</code> signals</li>
          </ul>
        </div>
      </div>
      <div class="shared-notes">
        <h3>What's identical in both</h3>
        <ul>
          <li>No backend — every calculation runs client-side</li>
          <li>City, job, and tax data is static, bundled data</li>
          <li>Live weather comes from the free Open-Meteo API, with a silent fallback to static climate data if it's unreachable</li>
          <li>User inputs (loan product, search mode, prices, rates) persist to <code>localStorage</code></li>
        </ul>
      </div>
    </section>

    <section>
      <h2>Try it</h2>
      <p>Both versions are functionally identical — pick whichever framework you're curious about.</p>
      <div class="cta-row">
        <a class="cta react" href="#" id="react-link-2">React version →</a>
        <a class="cta angular" href="#" id="angular-link-2">Angular version →</a>
      </div>
    </section>

    <footer>
      LoanLens is for educational and estimation purposes only. All calculations are approximate.
    </footer>
  </div>
</body>
</html>
```

- [ ] **Step 4: Verify it renders**

```bash
cd ~/coding_stuff/personal_projects/loan-lens-landing
npx --yes serve . -l 5050 &
sleep 1
curl -s http://localhost:5050 | grep -o "<title>[^<]*</title>"
kill %1
```

Expected: prints `<title>LoanLens — built twice, on purpose</title>`, confirming the static server serves the page.

- [ ] **Step 5: Commit**

```bash
git add index.html .gitignore
git commit -m "Add LoanLens landing page with hero, why, how, and links sections"
```

---

### Task 3: Visual redesign via `frontend-design`

**Files:** `loan-lens-landing/index.html` (redesigned in place)

**Interfaces:**
- Consumes: the complete page from Task 2
- Produces: the same content, restyled with a distinct visual identity

- [ ] **Step 1: Invoke the `frontend-design` skill**

Use the Skill tool to invoke `frontend-design`. Brief it with: this is a case-study/landing page for LoanLens (a loan affordability calculator built twice — once in React, once in Angular). The page has four sections already written with real copy — a hero with two CTA buttons, a "Why it was built" section, a "How it was built" technical comparison (React stack vs Angular stack side by side, plus a shared-architecture callout), and a closing links section. Keep all existing copy and section structure; redesign the visual treatment (typography, color, spacing, the stack-comparison layout) into something distinctive rather than the current plain dark-panel placeholder styling.

- [ ] **Step 2: Apply the resulting design**

Update the `<style>` block (or extract to an inline `<style>` still within the single `index.html` file — no external stylesheet needed for a one-page site) with the new design. Keep the `id="react-link"`, `id="angular-link"`, `id="react-link-2"`, `id="angular-link-2"` attributes on the CTA anchors — Task 4 depends on them to fill in the real URLs.

- [ ] **Step 3: Re-verify it renders**

```bash
cd ~/coding_stuff/personal_projects/loan-lens-landing
npx --yes serve . -l 5050 &
sleep 1
curl -s http://localhost:5050 | grep -o "<title>[^<]*</title>"
kill %1
```

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Apply frontend-design visual system to landing page"
```

---

### Task 4: Link both apps and deploy

**Files:** `loan-lens-landing/index.html` (link hrefs only)

**Interfaces:**
- Consumes: the React production URL (Task 1 of this plan), the Angular production URL (`loan-lens-angular` plan, Task 13)
- Produces: a live `loan-lens-landing` production URL

- [ ] **Step 1: Fill in the real URLs**

Replace the four placeholder `href="#"` values in `index.html` (`react-link`, `angular-link`, `react-link-2`, `angular-link-2`) with the actual production URLs recorded in Task 1 Step 5 of this plan and Task 13 Step 5 of the Angular port plan. For example, if the React URL is `https://loan-lens.vercel.app` and the Angular URL is `https://loan-lens-angular.vercel.app`:

```bash
cd ~/coding_stuff/personal_projects/loan-lens-landing
sed -i '' 's|id="react-link" href="#"|id="react-link" href="https://loan-lens.vercel.app"|' index.html
sed -i '' 's|id="react-link-2" href="#"|id="react-link-2" href="https://loan-lens.vercel.app"|' index.html
sed -i '' 's|id="angular-link" href="#"|id="angular-link" href="https://loan-lens-angular.vercel.app"|' index.html
sed -i '' 's|id="angular-link-2" href="#"|id="angular-link-2" href="https://loan-lens-angular.vercel.app"|' index.html
```

(Substitute the actual recorded URLs for the two example URLs above — the `sed` pattern matches on the `id="..."` attribute so it's safe even if `frontend-design` reordered the `href`/`id` attributes; adjust the match string to the real attribute order in the file if needed.)

- [ ] **Step 2: Verify the links**

```bash
grep -o 'id="[a-z0-9-]*" href="[^"]*"' index.html
```

Expected: four lines, none containing `href="#"`.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Link to live React and Angular app URLs"
```

- [ ] **Step 4: Deploy a preview**

```bash
vercel --yes
```

- [ ] **Step 5: Verify the preview**

Open the returned preview URL and click both CTA links, confirming each opens the correct live app.

- [ ] **Step 6: Confirm with the user before going to production**

Stop and ask the user to confirm before running the production deploy.

- [ ] **Step 7: Deploy to production**

```bash
vercel --prod --yes
```

- [ ] **Step 8: Report the final URLs**

Report all three production URLs to the user: `loan_lens` (React), `loan-lens-angular` (Angular), `loan-lens-landing` (case study/landing page).
