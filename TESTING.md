# Life Planner release testing

The app has no build step. Test the same `index.html` that buyers receive.

## Automated checks

With Node.js installed, run:

```text
npm install
npm run test:all
```

This validates all 22 hash-routed views, shared localStorage, Chart.js cleanup between routes, first-run rendering, required storage keys, backup/restore, six finance calculators, recurring cashflow without duplicate entries, calendar quick-add, recurring-task generation, leap years, and the full finance calculation scenario: 50,000 opening balance → expense → pending bill → paid bill → savings → income → new session.

## Manual browser and device checklist

1. Open `index.html` directly in both Chrome and Edge. Do not use a local server for this check.
2. In Preferences, choose a currency and confirm the correct symbol appears on Finance amounts.
3. Start a Finance session with 50,000. Add a 10,000 expense; available balance must become 40,000.
4. Add a 5,000 pending bill; balance must stay 40,000. Mark it paid; balance must become 35,000.
5. Add a 5,000 savings transfer; balance must become 30,000. Add 2,000 income; it must become 32,000.
6. Start a new session and switch between sessions. Confirm the first session's entries remain intact.
7. Under Monthly Automation, add two 10,000 Income rules and one 3,000 Expense rule with today's day-of-month. Available balance must increase by a net 17,000. Refresh twice and confirm those entries do not duplicate. Pause a rule and confirm future months stop posting; previously posted entries must remain.
8. Open Calculator. Verify the default Loan payment is 2,027.64, Debt Payoff is 24 months, and Business Profit is 8,000 with a 40.0% margin. Set debt payment below monthly interest and confirm “Payment too low” appears.
9. Add transactions in at least three categories. Confirm the Dashboard and Budget Tracker donut use those real totals and tooltips.
10. Add a daily habit and check it on consecutive days (you can temporarily change the device date in a test browser profile). Confirm current and best streaks.
11. Add a task directly from Smart Calendar. Confirm it appears on the chosen calendar day and in Task Tracker. Then add a recurring rule, meals, a workout, cleaning, habits, a bill, and time blocks; confirm all appear on Smart Calendar and the main Dashboard calendar.
12. Switch Smart Calendar to Year, jump to 2024, and confirm February has 29 days. Check previous/next year and month controls.
13. Export a backup, open a separate browser profile, import it, and compare totals.
14. Test dark and light themes on every module.
15. Use browser device emulation at 1440×900, 1024×768, 768×1024, 390×844, and 360×800. Below 720px, confirm navigation is a hamburger drawer and module pages use the compact Page selector.
16. On a real phone, open the files through the device browser or a static-file viewer and repeat steps 2–13. Check drawer scrolling, form keyboards, calendar horizontal scrolling, modal sizing, and tap targets.

Before packaging, clear test data or use a clean browser profile. Buyers need only `index.html` and `assets`; exclude `node_modules`, tests, source references, and development files.
