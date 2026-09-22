const fs=require('fs');
const path=require('path');
const {JSDOM}=require('jsdom');

const project=path.resolve(__dirname,'..');
const storage=fs.readFileSync(path.join(project,'assets/js/storage.js'),'utf8');
const app=fs.readFileSync(path.join(project,'assets/js/app.js'),'utf8');
const routes={
  'index.html':'#/dashboard','financial-planner/log.html':'#/financial-planner/log','financial-planner/money-setup.html':'#/financial-planner/money-setup','financial-planner/budget-tracker.html':'#/financial-planner/budget-tracker','financial-planner/savings-debt.html':'#/financial-planner/savings-debt','financial-planner/annual-dashboard.html':'#/financial-planner/annual-dashboard','financial-planner/calculator.html':'#/financial-planner/calculator',
  'task-tracker/variable-tasks.html':'#/task-tracker/variable-tasks','task-tracker/recurring-rules.html':'#/task-tracker/recurring-rules','task-tracker/recurring-tasks.html':'#/task-tracker/recurring-tasks',
  'my-routines/habit-tracker.html':'#/task-tracker/habit-tracker','my-routines/daily-journal.html':'#/task-tracker/daily-journal','fitness-planner/workout-setup.html':'#/fitness-planner/train','fitness-planner/workout-planner.html':'#/fitness-planner/routines','fitness-planner/weight-tracker.html':'#/fitness-planner/progress',
  'meals-grocery/meal-setup.html':'#/meals-grocery/meal-setup','meals-grocery/meal-planner.html':'#/meals-grocery/meal-planner','meals-grocery/grocery-list.html':'#/meals-grocery/grocery-list','meals-grocery/pantry.html':'#/meals-grocery/pantry','life-planner/goal-tracker.html':'#/life-planner/goal-tracker','life-planner/weekly-time-block.html':'#/life-planner/weekly-time-block','life-planner/smart-calendar.html':'#/life-planner/smart-calendar'
};

function openApp(file,seed={},query=''){
  let html=fs.readFileSync(path.join(project,'index.html'),'utf8')
    .replace(/<link[^>]+tokens\.css[^>]*>/,'')
    .replace(/<script defer src="[^"]*chart\.umd\.min\.js"><\/script>/,'')
    .replace(/<script defer src="[^"]*storage\.js"><\/script>/,'')
    .replace(/<script defer src="[^"]*app\.js"><\/script>/,'');
  const seeds=Object.entries(seed).map(([key,value])=>`localStorage.setItem(${JSON.stringify(key)},${JSON.stringify(JSON.stringify(value))});`).join('');
  html=html.replace('</body>',`<script>${storage}<\/script><script>${seeds}<\/script><script>${app}<\/script></body>`);
  const route=query.includes('setup=1')?'#/preferences':routes[file];
  if(!route)throw new Error(`Unknown SPA route fixture: ${file}`);
  return new JSDOM(html,{runScripts:'dangerously',url:`https://life-planner.local/index.html${route}`});
}

module.exports={openApp};