const {openApp}=require('./open-app');
const localIso=date=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const today=localIso(new Date());
function assert(ok,message){if(!ok)throw new Error(message)}
const open=(file,seed={},query='')=>openApp(file,{lp_settings:{currency:'USD'},...seed},query);

// B1: history survives a rule edit while future open occurrences are rebuilt.
{
  const past=new Date();past.setDate(past.getDate()-7);const future=new Date();future.setDate(future.getDate()+7);
  const rule={id:'r1',title:'Weekly review',frequency:'Weekly',interval:'1',start:today,end:''};
  const dom=open('task-tracker/recurring-rules.html',{lp_tasks_recurring_rules:[rule],lp_tasks_recurring_instances:[{id:'done',ruleId:'r1',title:rule.title,date:localIso(past),done:true},{id:'past',ruleId:'r1',title:rule.title,date:localIso(past),done:false},{id:'future',ruleId:'r1',title:rule.title,date:localIso(future),done:false}]});const d=dom.window.document;
  d.querySelector('.rule-edit').click();d.querySelector('#edit-title').value='Updated review';d.querySelector('#edit-form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
  const out=JSON.parse(dom.window.localStorage.getItem('lp_tasks_recurring_instances'));
  assert(out.some(x=>x.id==='done'&&x.done),'B1 completed history was deleted');assert(out.some(x=>x.id==='past'),'B1 past instance was deleted');assert(!out.some(x=>x.id==='future'),'B1 old future instance survived');assert(out.some(x=>x.date===localIso(future)&&x.title==='Updated review'),'B1 future instance was not rebuilt');dom.window.close();
}

// M1: completing a weekly chore advances one record by seven days.
{
  const due=new Date(),next=new Date();next.setDate(next.getDate()+7);const dom=open('my-routines/cleaning-schedule.html',{lp_cleaning:[{id:'c1',chore:'Vacuum',room:'Living room',frequency:'Weekly',next:localIso(due),done:false}]});const d=dom.window.document,box=d.querySelector('.row-done');box.checked=true;box.dispatchEvent(new dom.window.Event('change',{bubbles:true}));const out=JSON.parse(dom.window.localStorage.getItem('lp_cleaning'));assert(out.length===1&&out[0].next===localIso(next)&&!out[0].done,'M1 weekly chore did not advance exactly once');dom.window.close();
}

// M2: linked savings and debt transactions recalculate trackers.
{
  const settings={currency:'USD',financeSessions:[{id:'s',name:'QA',openingBalance:10000,startDate:today}],activeFinanceSession:'s'};
  const trackers=[{id:'save',type:'Savings',name:'Emergency',target:'5000',current:'1000',baseCurrent:1000},{id:'debt',type:'Debt',name:'Card',target:'4000',current:'4000',baseCurrent:4000}];
  const dom=open('financial-planner/log.html',{lp_settings:settings,lp_finance_savings_debt:trackers,lp_finance_log:[]});let d=dom.window.document;
  const add=(type,amount,target)=>{d.querySelector('#type').value=type;d.querySelector('#type').dispatchEvent(new dom.window.Event('change',{bubbles:true}));d.querySelector('#amount').value=amount;d.querySelector('#trackerId').value=target;d.querySelector('#entry-form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));d=dom.window.document};
  add('Savings','500','save');add('Debt Payment','750','debt');const out=JSON.parse(dom.window.localStorage.getItem('lp_finance_savings_debt'));assert(Number(out.find(x=>x.id==='save').current)===1500,'M2 savings tracker did not update');assert(Number(out.find(x=>x.id==='debt').current)===3250,'M2 debt tracker did not reduce');dom.window.close();
}

// M3: overspending exposes actual, limit, overage and danger class.
{
  const month=today.slice(0,7),dom=open('financial-planner/budget-tracker.html',{lp_finance_budgets:[{id:'b',month,category:'Rent',amount:'5000'}],lp_finance_log:[{id:'e',type:'Expense',status:'Cleared',category:'Rent',amount:'6000',date:today}]});const p=dom.window.document.querySelector('.budget-progress');assert(p?.classList.contains('danger'),'M3 danger class missing');assert(p.textContent.includes('$6,000.00 / $5,000.00')&&p.textContent.includes('$1,000.00 over'),'M3 overage details missing');dom.window.close();
}

// Shared spending totals feed the dashboard summary; annual totals remain intact.
{
  let dom=open('index.html',{lp_finance_budgets:[{id:'b',month:today.slice(0,7),category:'Rent',amount:'5000'}],lp_finance_log:[{id:'e',type:'Expense',status:'Cleared',category:'Rent',amount:'1250',date:today}]});assert([...dom.window.document.querySelectorAll('.progress-meta')].some(x=>x.textContent.includes('Rent')&&x.textContent.includes('25%')),'Dashboard budget total is inaccurate');dom.window.close();dom=open('financial-planner/annual-dashboard.html',{lp_finance_log:[{id:'i',type:'Income',status:'Cleared',category:'Work',amount:'9000',date:today},{id:'e',type:'Expense',status:'Cleared',category:'Rent',amount:'2500',date:today}]});const values=[...dom.window.document.querySelectorAll('.stat-value')].map(x=>x.textContent);assert(values.some(x=>x.includes('9,000'))&&values.some(x=>x.includes('2,500'))&&values.some(x=>x.includes('6,500')),'Annual dashboard totals are inaccurate');assert(dom.window.document.querySelector('#annual-chart'),'Annual dashboard chart did not render');dom.window.close();
}

// M4: a negative balance is flagged in both balance displays.
{
  const settings={currency:'USD',financeSessions:[{id:'s',name:'Negative',openingBalance:100,startDate:today}],activeFinanceSession:'s'},dom=open('financial-planner/log.html',{lp_settings:settings,lp_finance_log:[{id:'e',sessionId:'s',type:'Expense',status:'Cleared',category:'Test',amount:'200',date:today}]});const d=dom.window.document;assert(d.querySelector('.stat.danger'),'M4 summary danger state missing');assert(d.querySelector('.finance-equation strong.balance-negative'),'M4 equation danger state missing');dom.window.close();
}

// M5: only checked habit dates appear on the full calendar.
{
  let dom=open('life-planner/smart-calendar.html',{lp_habits:[{id:'h',name:'Read',frequency:'Daily',checks:{[today]:true}}]});const events=dom.window.document.querySelectorAll('.calendar-event.type-habit');assert(events.length===1&&events[0].textContent.includes('✓ Read'),'M5 checked habit marker missing or repeated');dom.window.close();dom=open('index.html',{lp_habits:[{id:'h',name:'Read',frequency:'Daily',checks:{}}]});assert(![...dom.window.document.querySelectorAll('.dashboard-calendar .calendar-item')].some(x=>x.textContent.includes('Habit · Read')),'M5 dashboard calendar showed an unchecked future habit');dom.window.close();
}

// M6: overlap is rejected, exact back-to-back is accepted.
{
  const dom=open('life-planner/weekly-time-block.html',{lp_timeblocks:[{id:'a',day:'Monday',start:'09:00',end:'10:00',title:'Focus',category:'Work'}]});const d=dom.window.document,submit=()=>d.querySelector('#entry-form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));d.querySelector('#day').value='Monday';d.querySelector('#start').value='09:30';d.querySelector('#end').value='10:30';d.querySelector('#title').value='Overlap';d.querySelector('#category').value='Work';submit();assert(JSON.parse(dom.window.localStorage.getItem('lp_timeblocks')).length===1,'M6 overlap was accepted');d.querySelector('#start').value='10:00';d.querySelector('#end').value='11:00';d.querySelector('#title').value='Back to back';submit();assert(JSON.parse(dom.window.localStorage.getItem('lp_timeblocks')).length===2,'M6 back-to-back block was rejected');dom.window.close();
}

// N1: sidebar preview reacts without reload.
{
  const modules=['finance','tasks','routines','fitness','meals','life'],dom=open('index.html',{lp_settings:{currency:'USD',modules}},'?setup=1'),d=dom.window.document,input=d.querySelector('input[name="modules"][value="tasks"]'),link=d.querySelector('.modules a[data-module="tasks"]');input.checked=false;input.dispatchEvent(new dom.window.Event('change',{bubbles:true}));assert(link.classList.contains('hidden'),'N1 sidebar did not hide immediately');input.checked=true;input.dispatchEvent(new dom.window.Event('change',{bubbles:true}));assert(!link.classList.contains('hidden'),'N1 sidebar did not reappear immediately');dom.window.close();
}

// N2: both business cases consistently show two decimals.
{
  const dom=open('financial-planner/calculator.html'),d=dom.window.document;assert(d.querySelector('#biz-margin').textContent==='40.00%','N2 first margin precision wrong');d.querySelector('#biz-revenue').value='15000';d.querySelector('#biz-fixed').value='4000';d.querySelector('#biz-variable').value='3000';d.querySelector('#biz-variable').dispatchEvent(new dom.window.Event('input',{bubbles:true}));assert(d.querySelector('#biz-margin').textContent==='53.33%','N2 second margin precision wrong');dom.window.close();
}

// N3: Monday preference reorders the calendar header.
{
  const dom=open('life-planner/smart-calendar.html',{lp_settings:{currency:'USD',weekStart:'Monday'}}),labels=[...dom.window.document.querySelectorAll('.weekday-row span')].map(x=>x.textContent);assert(labels[0]==='Mon'&&labels[6]==='Sun','N3 Monday-first header not applied');dom.window.close();
}

// N4: workout plan selects a library record and inherits defaults.
{
  const exercise={id:'ex',name:'Squat',equipment:'Barbell',sets:'4',reps:'8'},dom=open('fitness-planner/workout-planner.html',{lp_workouts_setup:[exercise],lp_workouts_plan:[]}),d=dom.window.document,select=d.querySelector('#exerciseId');assert(select&&select.options.length===2,'N4 exercise library dropdown missing');select.value='ex';select.dispatchEvent(new dom.window.Event('change',{bubbles:true}));assert(d.querySelector('#sets').value==='4'&&d.querySelector('#reps').value==='8','N4 defaults not inherited');d.querySelector('#entry-form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));const saved=JSON.parse(dom.window.localStorage.getItem('lp_workouts_plan'))[0];assert(saved.exerciseId==='ex'&&saved.exercise==='Squat','N4 workout not linked to library');dom.window.close();
}

// N5: simple plural and numeric quantities aggregate.
{
  const meals=[{id:'m1',name:'Soup',slot:'Dinner',ingredients:'1 onion'},{id:'m2',name:'Curry',slot:'Dinner',ingredients:'2 onions'}],plans=[{id:'p1',date:today,slot:'Dinner',meal:'Soup'},{id:'p2',date:today,slot:'Dinner',meal:'Curry'}],dom=open('meals-grocery/grocery-list.html',{lp_meals_setup:meals,lp_meals_plan:plans,lp_grocery_list:[]}),rows=[...dom.window.document.querySelectorAll('#auto-groceries .list-row')];assert(rows.length===1&&rows[0].textContent.includes('Onion')&&rows[0].textContent.includes('3'),'N5 onion quantities did not aggregate');dom.window.close();
}

console.log('QA fixes test passed: B1, M1-M6, and N1-N5.');
