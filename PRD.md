# Life Planner — Product Requirements Document

**Type:** Client-side digital product (single download, no backend, no login)
**Stack:** HTML + CSS + vanilla JS, Chart.js for graphs, browser `localStorage` for all data
**Note:** Assuming this builds on the same one-time-download model as your existing Ledger & Loop finance tool, just expanded into a full life-management suite with the six modules from your screenshot. Rename anything below if you already have a product name in mind.

---

## 1. Goals

- One offline-first HTML/CSS/JS product a buyer downloads and opens locally (or self-hosts) — no server, no account.
- Every module reads/writes its own slice of `localStorage`, so nothing is lost between sessions on the same browser.
- Consistent navigation shell across all pages ("Quick links" sidebar/menu, same as the screenshot).
- Chart.js used anywhere a trend or breakdown needs a visual (spending, weight, habit streaks, workout volume).

## 2. Global Structure

```
index.html                → Home / hub with quick links to every module
/financial-planner/
/task-tracker/
/my-routines/
/fitness-planner/
/meals-grocery/
/life-planner/
/assets/css/  /assets/js/  /assets/img/
```

Shared shell:
- Left nav (collapses to bottom bar on mobile) listing the 6 modules + Get Started.
- A `storage.js` helper used by every page: `getItem(key)`, `setItem(key, value)`, `exportAllData()`, `importAllData()` (so users can back up / move their data — important since it's local-only).
- A single design system (`tokens.css`) shared across modules so it doesn't feel like six different apps stitched together.

## 3. Modules & Pages

### 🚀 Get Started
- **Quick Setup** — one-time onboarding: name, currency, week start day, units (kg/lb), which modules they actually want visible in the nav (lets buyers hide modules they don't use).

### 💰 Financial Planner
- **Log** — add income/expense entries (date, amount, category, account, note).
- **Budget Tracker** — monthly budget per category vs. actual spent, progress bars, Chart.js donut for category split.
- **Savings & Debt** — savings goals with progress bars; debt payoff tracker (balance, interest rate, min payment, payoff projection).
- **Annual Dashboard** — Chart.js line/bar for income vs. expense by month, net worth trend, year-end summary.

### 📋 Task Tracker
- **Variable Tasks** — one-off to-dos: title, due date, priority, status, notes.
- **Recurring Rules** — define a recurring pattern (daily/weekly/monthly/custom interval, end date).
- **Recurring Tasks** — auto-generated instances from the rules, checkable per occurrence.
- **Tasks Dashboard** — completion rate, overdue count, Chart.js bar of tasks completed per week.

### 🧾 My Routines
- **Habit Tracker** — daily habit grid (streaks, weekly/monthly heatmap view).
- **Cleaning Schedule** — recurring chores by room/frequency (daily/weekly/monthly/seasonal), checklist per visit.

### ❤️ Fitness Planner
- **Workout Setup** — exercise library, default sets/reps, equipment tags.
- **Workout Planner** — weekly split, log sets/reps/weight per session.
- **Weight Tracker** — daily/weekly weigh-ins, Chart.js line trend, goal line overlay.

### 🛒 Meals & Grocery
- **Meal Setup** — recipe/meal library with ingredients and tags (breakfast/lunch/dinner, dietary tags).
- **Meal Planner** — weekly calendar assigning meals to days/slots.
- **Grocery List** — auto-generated from the week's planned meals (ingredient aggregation) + manual add-ons, checkable.

### 🌿 Life Planner
- **Goal Tracker** — long-term goals broken into milestones, progress %.
- **Weekly Time Block** — drag-fill weekly schedule grid (or click-to-assign blocks).
- **Smart Calendar** — combined view pulling due tasks, habits, meals, and workouts onto one calendar so the modules don't feel siloed.
- **Dashboard** — cross-module "today" summary: today's tasks, meals, workout, habits, budget status.

## 4. Data Model (localStorage keys, JSON-stringified)

| Key | Shape |
|---|---|
| `lp_settings` | user profile/prefs from Quick Setup |
| `lp_finance_log` | array of transactions |
| `lp_finance_budgets` | budgets per category/month |
| `lp_finance_savings_debt` | goals + debts |
| `lp_tasks_variable` | array of one-off tasks |
| `lp_tasks_recurring_rules` | array of recurrence rules |
| `lp_tasks_recurring_instances` | generated occurrences |
| `lp_habits` | habit list + daily check-ins |
| `lp_cleaning` | chores + schedule + log |
| `lp_workouts_setup` | exercise library |
| `lp_workouts_plan` | weekly plan + logged sessions |
| `lp_weight_log` | weigh-in entries |
| `lp_meals_setup` | recipe/meal library |
| `lp_meals_plan` | weekly meal assignments |
| `lp_grocery_list` | current list items |
| `lp_goals` | goals + milestones |
| `lp_timeblocks` | weekly schedule blocks |

All modules should degrade gracefully if a key is empty (first-run empty states, not errors).

## 5. Non-Functional Requirements

- Fully responsive (mobile-first, since the screenshot itself is a phone screen).
- Works with JS disabled for network calls entirely — everything is local, so it should also work opened straight from a `file://` path, not just when served.
- Export/Import JSON button somewhere global, so a buyer's data survives a browser wipe or moving devices.
- No external dependencies besides Chart.js (loaded from a CDN or vendored locally for a fully offline zip).

## 6. Build Order (proposed)

1. Shell + design system + Get Started/Quick Setup + Dashboard shell (empty states).
2. Financial Planner (closest to your existing Ledger & Loop code — likely reusable).
3. Task Tracker.
4. My Routines.
5. Fitness Planner.
6. Meals & Grocery.
7. Life Planner (built last since its Smart Calendar/Dashboard pulls from every other module).

## 7. Design Direction (updated per reference product)

Shell changes from the first hub mockup to a persistent **sidebar** layout, matching the couple-budget-app reference:

- **Left sidebar** (fixed, ~240px): brand name at top, then one nav link per module (Get Started, Financial Planner, Task Tracker, My Routines, Fitness Planner, Meals & Grocery, Life Planner), each with a small line icon. Active module highlighted. A short "your data stays on this device" line pinned to the bottom, since that's the product's main trust pitch.
- **Main area**: page eyebrow (module · sub-page) + heading, a theme toggle in the top-right, then a **tab row for that module's sub-pages** (e.g. Financial Planner shows Log / Budget Tracker / Savings & Debt / Annual Dashboard as tabs — active tab underlined), then a row of 4 stat cards, then a two-column area — left column for the primary chart + a list (upcoming bills / due tasks / whatever the module's "urgent" list is), right column for a secondary chart (donut/breakdown) + progress items (goals/habits/etc).
- This same shell (sidebar + topbar + stat row + two-column panel body) is reused across **all** modules — only the stat cards, chart data, and list contents change per module. Keeps the six modules feeling like one product instead of six.

**Themes — both required, toggle in the topbar:**

| Token | Dark | Light |
|---|---|---|
| Background | `#12140F` | `#F5F2E7` |
| Panel/card | `#181B14` | `#FFFDF8` |
| Border/hairline | `rgba(230,230,215,.09)` | `rgba(38,38,28,.10)` |
| Text | `#EFEEE3` | `#26261C` |
| Text muted | `#9A9C8C` | `#6C6B5C` |
| Olive (primary accent) | `#8CA05E` | `#5B6F3B` |
| Gold (secondary accent, amounts/highlights) | `#D6A44E` | `#B4863B` |
| Danger/attention | `#C97A6B` | `#B25B4D` |
| Sidebar background | `#0E100C` | `#EDE9DA` |

Typography stays as before: **Fraunces** (serif) for headings/values, **Inter** for body/UI text.

**Exact type setup (copy as-is into the shared stylesheet):**
```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap');

--font-display: 'Fraunces', Georgia, serif;   /* page titles, stat values, panel headings */
--font-body:    'Inter', -apple-system, sans-serif;  /* nav, labels, list text, buttons */
```
- Fraunces weights used: 500 (headings/titles), 600 (brand name only).
- Inter weights used: 400 (body/list text), 500 (labels/eyebrows), 600 (active nav item, amounts), 700 (rare emphasis only).
- Never mix a third typeface in in any module — reuse these two everywhere.

Components to standardize (build once, reuse everywhere): stat card, progress bar, donut chart legend row, bar chart column, list row (name + sub-label + right-aligned amount/date), sidebar nav link.

## 8. Handoff Note

You mentioned adding a reference video to the project folder for Codex — that's a good addition on top of this PRD and the two HTML mockups; between the three, Codex should have the page list, the data model, and the exact visual system to build from without guessing.

---

**Next step:** review both mockups (hub grid version + sidebar dashboard version) and confirm which shell to standardize on, then functional code can start per the build order in section 6.
