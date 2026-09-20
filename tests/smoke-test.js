const fs=require('fs');
const path=require('path');
const vm=require('vm');
const assert=require('node:assert/strict');

const project=path.resolve(__dirname,'..'),index=path.join(project,'index.html');
const html=fs.readFileSync(index,'utf8'),app=fs.readFileSync(path.join(project,'assets/js/app.js'),'utf8');
for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g))assert(fs.existsSync(path.resolve(project,match[1])),`Broken SPA asset: ${match[1]}`);
assert((app.match(/'\/[a-z][^']*':'[a-z]/g)||[]).length===23,'SPA route registry must contain 23 product views');
assert(app.includes('assets/images/daily-ledger-logo.png'),'Sidebar logo asset is missing');
assert(app.includes('assets/images/workout-anatomy.png'),'Supplied workout anatomy image is missing');
assert(app.includes('body.dataset.module=currentModule()'),'Each SPA route must expose its module color context');

const css=fs.readFileSync(path.join(project,'assets/css/tokens.css'),'utf8');
['#0B0D0B','#94A27A','#B89058','#96998D','max-width:1000px','max-width:720px','max-width:420px'].forEach(token=>assert(css.includes(token),`Missing design token/breakpoint: ${token}`));
['--bg:#0B0A08','--surface-2:#1A1814','--border-hi:rgba(245,230,190,.16)','--income:#E3C27F','--expense:#F0716B','--accent-grad:linear-gradient(135deg,#EBCF8B,#B98D3E)','mobile-tab-wrap','prefers-reduced-motion:reduce'].forEach(token=>assert(css.includes(token),`Missing premium finance token/behavior: ${token}`));
['fx-hero','fx-review','fx-strip','fx-monthbar','animateFinanceNumbers'].forEach(token=>assert(app.includes(token),`Missing premium finance UI: ${token}`));
['data-module="finance"','data-module="tasks"','data-module="routines"','data-module="fitness"','data-module="meals"','data-module="life"'].forEach(token=>assert(css.includes(token),`Missing module accent: ${token}`));
assert(css.includes('.anatomy-part.trained-4')&&css.includes('mix-blend-mode:color'),'Weekly anatomy color levels are missing');
assert(css.includes('.mini-btn[class*="delete"]')&&css.includes('.week-complete{display:flex'),'Edit, remove, and workout completion actions must render as real buttons');
assert(app.includes("interaction:type==='line'?{mode:'index',intersect:false,axis:'x'}:undefined"),'Line charts must show the nearest tooltip without requiring an exact point hover');

const requiredKeys=['lp_settings','dl_finance','lp_finance_log','lp_finance_budgets','lp_finance_savings_debt','lp_tasks_variable','lp_tasks_recurring_rules','lp_tasks_recurring_instances','lp_habits','lp_cleaning','lp_workouts_setup','lp_workouts_plan','lp_weight_log','lp_meals_setup','lp_meals_plan','lp_grocery_list','lp_goals','lp_timeblocks'];
const values=new Map(),localStorage={getItem:key=>values.has(key)?values.get(key):null,setItem:(key,value)=>values.set(key,String(value))};
const context={window:{},localStorage,console};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(project,'assets/js/storage.js'),'utf8'),context);
const store=context.window.LPStorage;assert(store&&requiredKeys.every(k=>store.KEYS.includes(k)),'Storage key contract mismatch');
assert.deepEqual(store.getItem('missing',[]),[],'First-run fallback failed');store.setItem('lp_tasks_variable',[{id:'test',title:'Smoke test'}]);
const backup=store.exportAllData();values.clear();store.importAllData(backup);assert.equal(store.getItem('lp_tasks_variable',[])[0].title,'Smoke test','Storage round trip failed');

console.log('Life Planner SPA smoke test passed: one entry point, 23 hash routes, local assets, responsive tokens, storage, and backup/restore.');