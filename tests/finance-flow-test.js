const {openApp}=require('./open-app');
const assert=require('node:assert/strict');

const dom=openApp('financial-planner/money-setup.html',{lp_settings:{currency:'USD',theme:'dark'}}),w=dom.window,d=w.document;
const submit=(form,values)=>{Object.entries(values).forEach(([key,value])=>form.elements[key].value=value);form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}))};
const month=new Date().toISOString().slice(0,7);

assert.equal(d.querySelectorAll('.tabs a').length,4,'Finance navigation must be Overview, Transactions, Plan, Calculator');
submit(d.querySelector('#source-form'),{name:'Client work',amount:1000,dayOfMonth:5});
let data=JSON.parse(w.localStorage.getItem('dl_finance'));
assert.equal(data.incomeSources[0].name,'Client work');

w.location.hash='#/financial-planner/log';w.dispatchEvent(new w.HashChangeEvent('hashchange'));
assert(d.querySelector('.source-receive'),'Expected income must appear in Transactions');
d.querySelector('.source-receive').click();
data=JSON.parse(w.localStorage.getItem('dl_finance'));
assert.equal(data.transactions.filter(x=>x.type==='income').length,1,'Mark received must create an income transaction');

d.querySelector('[data-finance-kind="expense"]').click();
const expenseCategory=d.querySelector('#transaction-category option:not([value="__add"])').value;
submit(d.querySelector('#finance-transaction-form'),{amount:400,date:`${month}-10`,categoryId:expenseCategory,note:'Groceries'});
data=JSON.parse(w.localStorage.getItem('dl_finance'));
assert.equal(JSON.stringify(w.DLFinance.getMonthSummary(data,month)),JSON.stringify({expected:1000,income:1000,spent:400,net:600,leftToSpend:600,savingsRate:60}));
d.querySelector('.transaction-edit').click();d.querySelector('#edit-transaction-note').value='Edited groceries';d.querySelector('#edit-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
data=JSON.parse(w.localStorage.getItem('dl_finance'));assert(data.transactions.some(x=>x.note==='Edited groceries'),'Transaction edit did not persist');
d.querySelector('.transaction-delete').click();data=JSON.parse(w.localStorage.getItem('dl_finance'));assert.equal(w.DLFinance.getMonthSummary(data,month).spent,0,'Deleting a transaction did not update totals');d.querySelector('.toast .mini-btn').click();data=JSON.parse(w.localStorage.getItem('dl_finance'));assert.equal(w.DLFinance.getMonthSummary(data,month).spent,400,'Transaction undo did not restore totals');
const previous=new Date(`${month}-01T00:00:00`);previous.setMonth(previous.getMonth()-1);const previousMonth=`${previous.getFullYear()}-${String(previous.getMonth()+1).padStart(2,'0')}`;
const incomeCategory=data.categories.find(x=>x.type==='income').id;data.transactions.push({id:'previous-income',type:'income',amount:800,date:`${previousMonth}-05`,categoryId:incomeCategory},{id:'previous-expense',type:'expense',amount:200,date:`${previousMonth}-10`,categoryId:expenseCategory});w.DLFinance.saveData(data);

w.location.hash='#/financial-planner/money-setup';w.dispatchEvent(new w.HashChangeEvent('hashchange'));
d.querySelector('[data-plan-tab="budgets"]').click();
submit(d.querySelector('#budget-form'),{categoryId:expenseCategory,limit:300});
d.querySelector('[data-plan-tab="bills"]').click();
submit(d.querySelector('#bill-form'),{name:'Internet',amount:100,dueDay:12,categoryId:expenseCategory});

w.location.hash='#/financial-planner/annual-dashboard';w.dispatchEvent(new w.HashChangeEvent('hashchange'));
assert(d.body.textContent.includes('Left to spend')&&d.body.textContent.includes('Internet'),'Overview must show hero and pending bill');
d.querySelector('.bill-pay').click();
data=JSON.parse(w.localStorage.getItem('dl_finance'));
assert.equal(w.DLFinance.getMonthSummary(data,month).spent,500,'Paid bill must update month spending');
assert.equal(w.DLFinance.getBillsStatus(data,month).find(x=>x.name==='Internet').status,'Paid');
d.querySelector('.toast .mini-btn').click();
data=JSON.parse(w.localStorage.getItem('dl_finance'));
assert.notEqual(w.DLFinance.getBillsStatus(data,month).find(x=>x.name==='Internet').status,'Paid','Undo must restore pending bill');
assert.equal(w.DLFinance.getMonthReview(data,month).budgetsExceeded,1,'Month review must derive exceeded budgets');
assert.equal(w.DLFinance.getMonthReview(data,month).incomeChangePct,25,'Income change vs previous month is wrong');
assert.equal(w.DLFinance.getMonthReview(data,month).spendChangePct,100,'Spend change vs previous month is wrong');

data.transactions.push({id:'old',type:'expense',amount:999,date:'2025-01-01',categoryId:expenseCategory});w.DLFinance.saveData(data);
assert.equal(w.DLFinance.getMonthSummary(data,month).spent,400,'Another month must not affect selected month');
dom.window.close();
console.log('Finance flow test passed: connected store, received income, expense, budget, bill/undo, review, and month isolation.');
