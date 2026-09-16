# Life Planner — Client Feature List

Life Planner is a private, dark-theme life-management web app that works offline from a single `index.html` file. It has no login, backend, analytics, or subscription. All information stays in the buyer's browser through localStorage and can be exported or restored as a JSON backup.

## Shared product features

- Single-page app with 23 hash-routed views and no page reloads.
- Works through `file://` and localhost, including shared storage across every module.
- Responsive desktop, tablet, and mobile layouts with a hamburger navigation drawer.
- Calm premium dark interface with consistent line icons.
- Startup workspace chooser for opening the required module quickly.
- Contextual Guide button on every page with page-specific instructions.
- Automatic local saving, edit controls, removal controls, and first-run empty states.
- Currency selection, week-start selection, weight units, and optional module visibility.
- Complete JSON backup export and restore.
- Interactive Chart.js charts with automatic cleanup between SPA routes.
- Accessible dialogs, keyboard Escape handling, reduced-motion support, and clear focus states.

## Dashboard

1. **Main Dashboard**
   - Daily task, habit, meal, and workout summary.
   - Six-month income-versus-expense line chart calculated from saved transactions.
   - Monthly spending-category donut chart.
   - Today's cross-module schedule and open tasks.
   - Habit and budget progress.
   - Seven-day Smart Calendar preview; habits appear only after being checked.

2. **Preferences**
   - User display name.
   - Currency and finance-symbol selection.
   - Monday- or Sunday-first week.
   - Kilogram or pound selection.
   - Sidebar module visibility controls.

## Financial Planner

3. **Finance Log**
   - Simplified one-transaction form for income, expenses, bills, savings, and debt payments.
   - Compact active-balance selector.
   - Automatic available-balance equation.
   - Paid bills, cleared expenses, savings, and debt payments deduct accurately.
   - Pending bills do not deduct until marked paid.
   - Optional account and note fields remain collapsed until needed.
   - Savings and debt entries can link to their matching tracker.
   - Editable transaction history and pending-bill area.
   - Real-data six-month income-versus-outflow line chart with exact currency tooltips.
   - Transaction-value mix chart across income, expenses, bills, savings, and debt payments.
   - Consistent finance colors: green for positive money, red for outflow/loss, and gold for savings.

4. **Money Setup**
   - Separate finance sessions with independent opening balances and history.
   - Multiple business or monthly income sources.
   - Fixed recurring expenses such as rent, gym, or subscriptions.
   - Automatic monthly posting on the selected day.
   - Pause, resume, edit, or remove monthly rules without deleting posted history.
   - Monthly expected income, fixed cost, and net summaries.

5. **Budget Tracker**
   - Monthly category limits.
   - Actual spending matched by category.
   - Budget-used progress indicators and overspending warnings.
   - Interactive spending split chart.

6. **Savings & Debt**
   - Savings-goal and debt-balance trackers.
   - Target, current balance, APR, and monthly payment fields.
   - Linked Finance Log contributions update balances automatically.
   - Savings progress and debt payoff estimates.

7. **Annual Dashboard**
   - Current-year income, expenses, net result, and pending-bill totals.
   - Monthly income-versus-expense line trend with exact currency tooltips.
   - Year-to-date savings-rate summary.
   - Positive and negative result cards change color automatically from the calculated net.

8. **Finance Calculator**
   - Loan/EMI payment and interest calculator.
   - Compound savings-growth calculator.
   - Monthly savings-goal calculator.
   - Percentage, discount, tax, tip, and markup calculator.
   - Debt payoff duration and interest calculator.
   - Business revenue, costs, profit, margin, and break-even calculator.
   - Business profit and margin turn green for profit and red for loss.

## Task Tracker

9. **Variable Tasks**
   - One-time tasks with due date, priority, status, and notes.
   - To Do, In Progress, and Done workflow board.
   - Today and overdue focus area.
   - Edit, advance, complete, reopen, or remove tasks.

10. **Recurring Rules**
    - Daily, weekly, and monthly schedules.
    - Custom repeat intervals, start dates, and optional end dates.
    - Preview of upcoming occurrence dates.
    - Editing a rule rebuilds future dates while preserving completed history.

11. **Recurring Tasks**
    - Independent checklist item for every generated date.
    - Today, upcoming, and completed sections.
    - Automatic 90-day forward generation without duplicates.

12. **Tasks Dashboard**
    - Total, completed, overdue, and completion-rate summaries.
    - Weekly completion chart.
    - Open-task priority distribution.

## My Routines

13. **Habit Tracker**
    - Adds exactly one habit per submission.
    - Daily, weekday, or weekly frequency with optional category.
    - Seven-day checklist with a separate saved check-in for each date.
    - Current and best streak calculations.
    - Completion score and all-time streak history.
    - Unlimited month/year habit calendar instead of a fixed 28-day view.
    - Only checked habits appear in Habit Calendar, Dashboard, and Smart Calendar.

14. **Cleaning Schedule**
    - Chore, room, frequency, and next-due tracking.
    - Daily, weekly, monthly, and seasonal schedules.
    - Completing a chore automatically advances the next due date exactly once.

## Fitness Planner

15. **Workout Setup**
    - Reusable exercise library.
    - Equipment plus default sets and reps.

16. **Workout Planner**
    - Date-based workout scheduling.
    - Exercise selection from the saved library.
    - Automatic default sets and reps with per-session adjustment.
    - Planned and Completed statuses.

17. **Weight Tracker**
    - Dated weight entries with notes.
    - Latest, lowest, and total-change summaries.
    - Interactive weight-trend chart.

## Meals & Grocery

18. **My Meals**
    - Reusable meal library with meal type, dietary tags, and ingredients.
    - Clear three-step meal-planning workflow.

19. **Meal Planner**
    - Seven-day breakfast, lunch, dinner, and snack planning.
    - Uses saved meals for consistent names and ingredients.
    - Editing or removing plans refreshes groceries automatically.

20. **Shopping List**
    - Automatic ingredient aggregation from the week's planned meals.
    - Manual household and pantry extras.
    - Quantity and packed/unpacked tracking.
    - Automatic items remain controlled by the meal plan.

## Life Planner

21. **Goal Tracker**
    - Goal, life area, target date, and milestones.
    - Milestone checklist with automatic percentage calculation.
    - Manual progress support when no milestones are used.

22. **Weekly Time Block**
    - Day, start time, end time, title, and category.
    - Overlap prevention with back-to-back blocks allowed.
    - Repeating weekly blocks feed into Smart Calendar.

23. **Smart Calendar**
    - Accurate month and full-year views for previous and future years.
    - Monday- or Sunday-first layout from Preferences.
    - Previous, next, Today, and direct year navigation.
    - Quick task creation from the toolbar or an individual date.
    - Aggregates tasks, recurring work, meals, workouts, bills, time blocks, and checked habits.
    - Saved calendar items can be edited from their event.
    - No demo data and no unchecked habit spam.

## QA status

- All 23 routes render successfully.
- Finance calculations, bill behavior, savings/debt linking, recurring monthly posting, and session isolation pass automated tests.
- Habit streaks, dated check-ins, unlimited calendar history, and checked-only calendar behavior pass automated tests.
- Recurring task generation, meal/grocery synchronization, goal math, time-block overlap prevention, leap years, backup/restore, Chart.js cleanup, and simulated `file://` navigation pass automated tests.
