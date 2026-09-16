const {openApp:open}=require('./open-app');
function assert(ok,message){if(!ok)throw new Error(message)}
function amount(text){return Number(text.replace(/[^0-9.-]/g,''))}
function localIso(date){return`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`}

let dom=open('financial-planner/calculator.html',{lp_settings:{currency:'USD',theme:'dark'}}),doc=dom.window.document;
assert(Math.abs(amount(doc.querySelector('#loan-payment').textContent)-2027.64)<.02,'Loan EMI calculation is inaccurate');
assert(amount(doc.querySelector('#goal-needed').textContent)===3750,'Savings-goal monthly contribution is inaccurate');
assert(amount(doc.querySelector('#pct-result').textContent)===11500,'Percentage-add calculation is inaccurate');
assert(doc.querySelector('#debt-months').textContent==='24 months','Debt payoff duration is inaccurate');
assert(amount(doc.querySelector('#biz-profit').textContent)===8000,'Business profit calculation is inaccurate');
assert(doc.querySelector('#biz-margin').textContent==='40.00%','Business margin calculation is inaccurate');
assert(doc.querySelector('#biz-profit').classList.contains('money-positive-text'),'Profit should use positive styling');
doc.querySelector('#biz-revenue').value='5000';doc.querySelector('#biz-revenue').dispatchEvent(new dom.window.Event('input',{bubbles:true}));
assert(amount(doc.querySelector('#biz-profit').textContent)===-7000,'Business loss calculation is inaccurate');
assert(doc.querySelector('#biz-profit').classList.contains('money-negative-text'),'Loss should use negative styling');dom.window.close();

const now=new Date(),todayIso=localIso(now),financeSession={id:'qa-session',name:'QA',openingBalance:0,startDate:todayIso};
const financeTemplates=[{id:'business-a',name:'Business A',type:'Income',amount:10000,day:now.getDate(),startDate:todayIso,active:true},{id:'rent',name:'Rent',type:'Expense',amount:3000,day:now.getDate(),startDate:todayIso,active:true}];
dom=open('financial-planner/log.html',{lp_settings:{currency:'USD',theme:'dark',financeSessions:[financeSession],activeFinanceSession:'qa-session',financeTemplates},lp_finance_log:[]});doc=dom.window.document;
let posted=JSON.parse(dom.window.localStorage.getItem('lp_finance_log'));
assert(posted.length===2,'Due monthly income and expense rules were not posted');
assert(amount(doc.querySelector('.stat-value').textContent)===7000,'Recurring monthly cashflow did not update available balance');
dom.window.location.hash='#/financial-planner/money-setup';dom.window.dispatchEvent(new dom.window.HashChangeEvent('hashchange'));
assert(doc.querySelectorAll('#cashflow-template-form input,#cashflow-template-form select').length===4,'Monthly cashflow setup should contain only four essential controls');
doc.querySelector('#session-select').dispatchEvent(new dom.window.Event('change',{bubbles:true}));posted=JSON.parse(dom.window.localStorage.getItem('lp_finance_log'));
assert(posted.length===2,'Recurring monthly cashflow created duplicate entries');dom.window.close();

const oldDaily={id:'daily-old',title:'Daily review',frequency:'Daily',interval:'1',start:'2020-01-01',end:''};
dom=open('task-tracker/recurring-tasks.html',{lp_tasks_recurring_rules:[oldDaily],lp_tasks_recurring_instances:[]});doc=dom.window.document;
const generated=JSON.parse(dom.window.localStorage.getItem('lp_tasks_recurring_instances'));
assert(generated.length>=90,'An old recurring rule did not generate the forward 90-day window');
assert(generated.some(x=>x.date===localIso(new Date())),'Recurring task for today was not generated');dom.window.close();

const savedMeal={id:'meal-1',name:'Chicken bowl',slot:'Dinner',tags:'',ingredients:'Chicken, Rice, Onion',createdAt:new Date().toISOString()};
dom=open('meals-grocery/meal-planner.html',{lp_meals_setup:[savedMeal],lp_meals_plan:[],lp_grocery_list:[]});doc=dom.window.document;
assert(doc.querySelectorAll('.meal-workflow a').length===3,'Meal workflow must show three clear steps');
doc.querySelector('#meal-plan-form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
assert(JSON.parse(dom.window.localStorage.getItem('lp_meals_plan')).length===1,'Meal was not added to the weekly plan');
assert(JSON.parse(dom.window.localStorage.getItem('lp_grocery_list')).length===3,'Planned meal ingredients did not build the shopping list');dom.window.close();

dom=open('meals-grocery/meal-setup.html',{lp_meals_setup:[savedMeal]});doc=dom.window.document;doc.querySelector('.row-edit').click();doc.querySelector('#edit-name').value='Edited chicken bowl';doc.querySelector('#edit-form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
assert(JSON.parse(dom.window.localStorage.getItem('lp_meals_setup'))[0].name==='Edited chicken bowl','Shared edit popup did not update a saved meal');dom.window.close();

const goal={id:'goal-1',name:'Launch product',category:'Business',targetDate:todayIso,progress:'0',milestones:'Finish design, Test checkout',milestoneChecks:{}};
dom=open('life-planner/goal-tracker.html',{lp_goals:[goal]});doc=dom.window.document;
assert(doc.querySelectorAll('.goal-workflow>div').length===3,'Goal page must explain its three-step workflow');
const firstMilestone=doc.querySelector('.goal-milestone');firstMilestone.checked=true;firstMilestone.dispatchEvent(new dom.window.Event('change',{bubbles:true}));
assert(Number(JSON.parse(dom.window.localStorage.getItem('lp_goals'))[0].progress)===50,'Goal progress did not calculate from completed milestones');dom.window.close();

const monthly={id:'month-end',title:'Month-end review',frequency:'Monthly',interval:'1',start:'2024-01-31',end:''};
dom=open('life-planner/smart-calendar.html',{lp_tasks_recurring_rules:[monthly],lp_tasks_recurring_instances:[],lp_habits:[{id:'daily-habit',name:'Development',frequency:'Daily',checks:{}}]});doc=dom.window.document;
assert(!doc.querySelector('.calendar-event.type-habit'),'Daily habits must not fill every date in Smart Calendar');
doc.querySelector('#cal-add').click();doc.querySelector('#calendar-task-title').value='Calendar quick task';doc.querySelector('#calendar-task-date').value=todayIso;doc.querySelector('#calendar-task-form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
const quickTasks=JSON.parse(dom.window.localStorage.getItem('lp_tasks_variable'));
assert(quickTasks.some(x=>x.title==='Calendar quick task'&&x.source==='calendar'),'Calendar quick-add task was not saved to Task Tracker storage');doc=dom.window.document;
doc.querySelector('[data-view="year"]').click();doc=dom.window.document;const year=doc.querySelector('#cal-year');year.value='2024';year.dispatchEvent(new dom.window.Event('change',{bubbles:true}));doc=dom.window.document;
assert(doc.querySelectorAll('.mini-month').length===12,'Year view must render all 12 months');
assert(doc.querySelectorAll('.mini-month')[1].querySelectorAll('.mini-days button').length===29,'Leap-year February must have 29 days');
doc.querySelectorAll('.mini-month-title')[1].click();doc=dom.window.document;
assert(doc.querySelectorAll('.month-cell').length===42,'Month view must render a complete six-week grid');
const leapDay=[...doc.querySelectorAll('.month-cell')].find(x=>x.querySelector('time')?.getAttribute('datetime')==='2024-02-29');
assert(leapDay?.textContent.includes('Month-end review'),'Monthly rule on the 31st must anchor to leap-year February 29');dom.window.close();

console.log('Planner feature test passed: calculators, recurring finance, guided meals and groceries, milestone goal math, shared editing, calendar quick-add, recurring rules, year view, and leap-year dates.');
