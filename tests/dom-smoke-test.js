const {openApp}=require('./open-app');
const pages=[
  'index.html','financial-planner/log.html','financial-planner/money-setup.html','financial-planner/budget-tracker.html','financial-planner/savings-debt.html','financial-planner/annual-dashboard.html','financial-planner/calculator.html',
  'task-tracker/variable-tasks.html','task-tracker/recurring-rules.html','task-tracker/recurring-tasks.html','task-tracker/dashboard.html',
  'my-routines/habit-tracker.html','my-routines/cleaning-schedule.html','fitness-planner/workout-setup.html','fitness-planner/workout-planner.html','fitness-planner/weight-tracker.html',
  'meals-grocery/meal-setup.html','meals-grocery/meal-planner.html','meals-grocery/grocery-list.html','life-planner/goal-tracker.html','life-planner/weekly-time-block.html','life-planner/smart-calendar.html'
];

for(const file of pages){
  const dom=openApp(file),doc=dom.window.document;
  if(!doc.querySelector('.shell')||!doc.querySelector('.sidebar')||!doc.querySelector('#app'))throw new Error(`${file}: shared shell did not render`);
  if(!doc.querySelector('#page-title')?.textContent.trim())throw new Error(`${file}: page title is empty`);
  if(!doc.querySelector('#guide-btn')||!doc.querySelector('#guide-modal .guide-steps'))throw new Error(`${file}: contextual page guide is missing`);
  const bad=[...doc.querySelectorAll('a[href]')].filter(a=>!a.getAttribute('href').startsWith('#/'));
  if(bad.length)throw new Error(`${file}: non-hash navigation remains: ${bad[0].getAttribute('href')}`);
  dom.window.close();
}
const preferences=openApp('index.html',{},'?setup=1');
if(preferences.window.document.body.dataset.page!=='setup')throw new Error('Preferences SPA route did not render');
preferences.window.close();
console.log(`DOM smoke test passed: all ${pages.length+1} SPA routes rendered from index.html with hash-only navigation.`);
