# Life Planner

Life Planner is a private, client-side single-page app. Open `index.html` directly in a modern browser; its 22 views use hash routes, so no server, account, build step, or internet connection is required for app behavior or charts.

## Buyer quick start

1. Open `index.html`.
2. Use the ↕ menu and choose **Preferences** to set your name, currency, units, and visible modules.
3. Add data in any planner. The main Dashboard and Smart Calendar update from the saved data automatically.
4. Export a JSON backup from the ↕ menu before clearing browser data or moving to another device.

Data is stored only in the current browser's `localStorage` and is shared by every hash-routed view. Fonts use the approved Google Fonts import when internet is available and fall back to Georgia/system sans-serif offline. Chart.js is bundled locally in `assets/vendor`.

## QA

Run `npm install` once, then `npm run test:all` for the complete automated suite. See `TESTING.md` for the finance-calculation scenario and the desktop/tablet/mobile release checklist. The app itself still has no runtime dependency or build step.
