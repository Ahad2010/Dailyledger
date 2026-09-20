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

const fitnessDate=localIso(new Date()),fitnessPastDate=localIso(new Date(Date.now()-7*86400000)),fitnessPlans=[...[1,2,3].map(id=>({id:`chest-${id}`,date:fitnessDate,exercise:'Bench Press',done:'Completed'})),...[1,2,3,4].map(id=>({id:`arms-${id}`,date:fitnessDate,exercise:'Arm Curl',done:'Completed'})),{id:'feet-1',date:fitnessDate,exercise:'Toe Raises',done:'Completed'},{id:'old-chest',date:fitnessPastDate,exercise:'Bench Press',done:'Completed'}];
dom=open('fitness-planner/workout-setup.html',{lp_workouts_plan:fitnessPlans});doc=dom.window.document;
assert(!doc.querySelector('.anatomy-weekbar'),'Weekly anatomy should not show a week selector');
assert(doc.querySelectorAll('.wl-remove').length===8,'This week should list every logged workout');
assert(doc.querySelector('.anatomy-part[data-muscle="chest"]').classList.contains('trained-3'),'Three completed chest sessions should use the green frequency level');
assert(doc.querySelector('.anatomy-part[data-muscle="arms"]').classList.contains('trained-4'),'Four completed arm sessions should use the red frequency level');
assert(doc.querySelector('.anatomy-part[data-muscle="feet"]').classList.contains('trained-1')&&!doc.querySelector('[data-muscle="calves"]'),'Feet should track completed sessions while calves overlay stays removed');
const chestPart=doc.querySelector('.anatomy-part[data-muscle="chest"]');chestPart.dispatchEvent(new dom.window.Event('mouseenter'));
assert(doc.querySelector('.anatomy-map').classList.contains('is-previewing')&&chestPart.classList.contains('active'),'Hover should switch to the single-area light preview');
chestPart.dispatchEvent(new dom.window.Event('mouseleave'));
assert(!doc.querySelector('.anatomy-map').classList.contains('is-previewing')&&chestPart.classList.contains('trained-3'),'Leaving hover should restore calendar-based weekly colors');
const exerciseName=doc.querySelector('#wl-name');exerciseName.value='Bench Press';exerciseName.dispatchEvent(new dom.window.Event('input',{bubbles:true}));
assert(doc.querySelectorAll('.anatomy-part[data-muscle].active').length===0&&doc.querySelector('.anatomy-part[data-muscle="chest"]').classList.contains('trained-3'),'Typing an exercise must not change the completed-workout frequency map');
doc.querySelector('#wl-name').value='Back Squat';doc.querySelector('#wl-sets').value='4';doc.querySelector('#wl-reps').value='8';doc.querySelector('#wl-weight').value='80';doc.querySelector('#workout-log-form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
assert(JSON.parse(dom.window.localStorage.getItem('lp_workouts_plan')).some(x=>x.exercise==='Back Squat'&&x.done==='Completed'&&x.weight==='80'),'Logging a workout must save it as completed');
assert(JSON.parse(dom.window.localStorage.getItem('lp_workouts_setup')).some(x=>x.name==='Back Squat'),'A new exercise typed while logging must join the library');doc=dom.window.document;
assert(doc.querySelector('.anatomy-part[data-muscle="legs"]').classList.contains('trained-1'),'Logging a squat should update the weekly anatomy map');
doc.querySelector('#wl-name').value='Back Squat';doc.querySelector('#wl-name').dispatchEvent(new dom.window.Event('change',{bubbles:true}));
assert(doc.querySelector('#wl-hint').textContent.includes('80'),'Choosing a logged exercise must show what you lifted last time');dom.window.close();
// routines: a template fills the week, and today’s routine becomes a tick-off list
dom=open('fitness-planner/workout-planner.html',{});doc=dom.window.document;
doc.querySelector('.rt-template[data-id="fb"]').click();doc=dom.window.document;
const savedRoutines=JSON.parse(dom.window.localStorage.getItem('lp_routines'));
assert(savedRoutines.length===1&&savedRoutines[0].exercises.length===5&&savedRoutines[0].exercises[0].sets==='3','A routine template must save its exercises with sets and reps');dom.window.close();
const todayName=new Date().toLocaleDateString('en-US',{weekday:'long'});
dom=open('fitness-planner/workout-setup.html',{lp_routines:[{id:'r1',name:'Push day',days:[todayName],exercises:[{name:'Bench press',sets:'3',reps:'8'},{name:'Overhead press',sets:'3',reps:'8'}]}]});doc=dom.window.document;
const tick=doc.querySelector('.ft-tick');tick.checked=true;tick.dispatchEvent(new dom.window.Event('change',{bubbles:true}));
assert(JSON.parse(dom.window.localStorage.getItem('lp_workouts_plan')).some(x=>x.exercise==='Bench press'&&x.done==='Completed'),'Ticking a routine exercise must log it as completed');doc=dom.window.document;
assert(doc.querySelector('.anatomy-part[data-muscle="chest"]').classList.contains('trained-1'),'Ticking a chest exercise must color the chest');dom.window.close();

const now=new Date(),todayIso=localIso(now),financeSession={id:'qa-session',name:'QA',openingBalance:0,startDate:todayIso};
const financeTemplates=[{id:'business-a',name:'Business A',type:'Income',amount:10000,day:now.getDate(),startDate:todayIso,active:true},{id:'rent',name:'Rent',type:'Expense',amount:3000,day:now.getDate(),startDate:todayIso,active:true}];
dom=open('financial-planner/log.html',{lp_settings:{currency:'USD',theme:'dark',financeSessions:[financeSession],activeFinanceSession:'qa-session',financeTemplates},lp_finance_log:[]});doc=dom.window.document;
let posted=JSON.parse(dom.window.localStorage.getItem('dl_finance')).transactions;
assert(posted.length===0,'Income sources must not create duplicate transactions');
assert(amount(doc.querySelector('.stat-value').textContent)===0,'Expected income must stay separate from received income');
dom.window.location.hash='#/financial-planner/money-setup';dom.window.dispatchEvent(new dom.window.HashChangeEvent('hashchange'));
assert(doc.querySelectorAll('#source-form input').length===3&&!doc.querySelector('#session-form'),'Plan source form should contain name, amount, and received day');
assert(doc.querySelectorAll('.source-delete').length===1,'Migrated income source is missing from Plan');
posted=JSON.parse(dom.window.localStorage.getItem('dl_finance')).transactions;assert(posted.length===0,'Viewing income sources created a transaction');dom.window.close();

const oldDaily={id:'daily-old',title:'Daily review',frequency:'Daily',interval:'1',start:'2020-01-01',end:''};
dom=open('task-tracker/recurring-tasks.html',{lp_tasks_recurring_rules:[oldDaily],lp_tasks_recurring_instances:[]});doc=dom.window.document;
const generated=JSON.parse(dom.window.localStorage.getItem('lp_tasks_recurring_instances'));
assert(generated.length>=90,'An old recurring rule did not generate the forward 90-day window');
assert(generated.some(x=>x.date===localIso(new Date())),'Recurring task for today was not generated');
assert(doc.querySelectorAll('.recurring-grid .panel').length===2&&doc.querySelector('.tomorrow-panel'),'Recurring UI must show only Today and Tomorrow');
assert(doc.querySelectorAll('.occurrence').length===1&&doc.querySelector('.tomorrow-panel .day-lock'),'Only Today should expose an active recurring-task checkbox');dom.window.close();

const savedMeal={id:'meal-1',name:'Chicken bowl',slot:'Dinner',tags:'',ingredients:'Chicken, Rice, Onion',createdAt:new Date().toISOString()};
dom=open('meals-grocery/meal-planner.html',{lp_meals_setup:[savedMeal],lp_meals_plan:[],lp_grocery_list:[]});doc=dom.window.document;
assert(doc.querySelectorAll('.ml-day').length===7,'Meal plan must show seven days');
doc.querySelector('.ml-add').click();const mealName=doc.querySelector('#meal-dlg-name');mealName.value='Chicken bowl';mealName.dispatchEvent(new dom.window.Event('input',{bubbles:true}));doc.querySelector('#edit-form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
assert(JSON.parse(dom.window.localStorage.getItem('lp_meals_plan')).length===1,'Meal was not added to the weekly plan');
assert(JSON.parse(dom.window.localStorage.getItem('lp_grocery_list')).length===3,'Planned meal ingredients did not build the shopping list');
doc.querySelector('.ml-add').click();const newMeal=doc.querySelector('#meal-dlg-name');newMeal.value='Egg toast';newMeal.dispatchEvent(new dom.window.Event('input',{bubbles:true}));doc.querySelector('#meal-dlg-ing').value='2 eggs, 1 bread';doc.querySelector('#edit-form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
assert(JSON.parse(dom.window.localStorage.getItem('lp_meals_setup')).some(x=>x.name==='Egg toast'&&x.ingredients.includes('2 eggs')),'A new meal typed while planning must be saved to the library');
assert(JSON.parse(dom.window.localStorage.getItem('lp_grocery_list')).length===5,'Ingredients typed while planning must reach the shopping list');dom.window.close();

dom=open('meals-grocery/meal-planner.html',{lp_meals_setup:[savedMeal],lp_meals_plan:[{id:'pp',date:todayIso,slot:'Dinner',meal:'Chicken bowl'}],lp_pantry:[{id:'pn',name:'Rice'}],lp_grocery_list:[]});
assert(JSON.parse(dom.window.localStorage.getItem('lp_grocery_list')).map(x=>x.name).join(',')==='Chicken,Onion','Pantry items must be left off the shopping list');dom.window.close();
dom=open('meals-grocery/meal-setup.html',{lp_meals_setup:[savedMeal]});doc=dom.window.document;doc.querySelector('.row-edit').click();doc.querySelector('#edit-name').value='Edited chicken bowl';doc.querySelector('#edit-form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
assert(JSON.parse(dom.window.localStorage.getItem('lp_meals_setup'))[0].name==='Edited chicken bowl','Shared edit popup did not update a saved meal');dom.window.close();

const goal={id:'goal-1',name:'Launch product',category:'Business',targetDate:todayIso,progress:'0',milestones:'Finish design, Test checkout',milestoneChecks:{}};
dom=open('life-planner/goal-tracker.html',{lp_goals:[goal]});doc=dom.window.document;
assert(doc.querySelector('#goal-add-form')&&doc.querySelectorAll('.goal-milestone').length===2,'Goal page must show the add form and each goal step');
const firstMilestone=doc.querySelector('.goal-milestone');firstMilestone.checked=true;firstMilestone.dispatchEvent(new dom.window.Event('change',{bubbles:true}));
assert(Number(JSON.parse(dom.window.localStorage.getItem('lp_goals'))[0].progress)===50,'Goal progress did not calculate from completed milestones');
const stepInput=doc.querySelector('.goal-step-form input[name="step"]');stepInput.value='Launch ads';doc.querySelector('.goal-step-form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
assert(JSON.parse(dom.window.localStorage.getItem('lp_goals'))[0].milestones.includes('Launch ads'),'A step added from the goal card was not saved');dom.window.close();

const monthly={id:'month-end',title:'Month-end review',frequency:'Monthly',interval:'1',start:'2024-01-31',end:''};
dom=open('life-planner/smart-calendar.html',{lp_tasks_recurring_rules:[monthly],lp_tasks_recurring_instances:[],lp_habits:[{id:'daily-habit',name:'Development',frequency:'Daily',checks:{}}]});doc=dom.window.document;
assert(!doc.querySelector('.calendar-event.type-habit'),'Daily habits must not fill every date in Smart Calendar');
doc.querySelector('#cal-add').click();doc.querySelector('#calendar-task-title').value='Calendar quick task';doc.querySelector('#calendar-task-date').value=todayIso;doc.querySelector('#calendar-task-form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
const quickTasks=JSON.parse(dom.window.localStorage.getItem('lp_tasks_variable'));
assert(quickTasks.some(x=>x.title==='Calendar quick task'&&x.source==='calendar'),'Calendar quick-add task was not saved to Task Tracker storage');doc=dom.window.document;
doc.querySelector('#cal-add').click();doc.querySelector('[data-add-type="Event"]').click();doc.querySelector('#calendar-task-title').value='Dentist';doc.querySelector('#calendar-task-date').value=todayIso;doc.querySelector('#cal-start').value='16:30';doc.querySelector('#calendar-task-form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
assert(JSON.parse(dom.window.localStorage.getItem('lp_events')).some(x=>x.title==='Dentist'&&x.start==='16:30'),'An event added from the calendar was not saved');doc=dom.window.document;
assert([...doc.querySelectorAll('#day-panel .cal-day-row')].some(x=>x.textContent.includes('Dentist')),'The selected-day panel must list the new event');
doc.querySelector('#cal-add').click();doc.querySelector('[data-add-type="Meal"]').click();doc.querySelector('#calendar-task-title').value='Calendar dinner';doc.querySelector('#calendar-task-date').value=todayIso;doc.querySelector('#calendar-task-form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
assert(JSON.parse(dom.window.localStorage.getItem('lp_meals_plan')).some(x=>x.meal==='Calendar dinner'),'A meal added from the calendar was not planned');doc=dom.window.document;
doc.querySelector('[data-view="year"]').click();doc=dom.window.document;const year=doc.querySelector('#cal-year');year.value='2024';year.dispatchEvent(new dom.window.Event('change',{bubbles:true}));doc=dom.window.document;
assert(doc.querySelectorAll('.mini-month').length===12,'Year view must render all 12 months');
assert(doc.querySelectorAll('.mini-month')[1].querySelectorAll('.mini-days button').length===29,'Leap-year February must have 29 days');
doc.querySelectorAll('.mini-month-title')[1].click();doc=dom.window.document;
assert(doc.querySelectorAll('.month-cell').length===42,'Month view must render a complete six-week grid');
const leapDay=[...doc.querySelectorAll('.month-cell')].find(x=>x.querySelector('time')?.getAttribute('datetime')==='2024-02-29');
assert(leapDay?.textContent.includes('Month-end review'),'Monthly rule on the 31st must anchor to leap-year February 29');dom.window.close();

console.log('Planner feature test passed: calculators, recurring finance, guided meals and groceries, milestone goal math, shared editing, calendar quick-add, recurring rules, year view, and leap-year dates.');