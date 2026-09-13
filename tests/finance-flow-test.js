const {openApp}=require('./open-app');
const assert=require('node:assert/strict');

const dom=openApp('financial-planner/log.html',{lp_settings:{currency:'USD',theme:'dark',financeSessions:[{id:'qa',name:'QA balance',openingBalance:50000,startDate:'2026-01-01'}],activeFinanceSession:'qa'}}),w=dom.window,d=w.document;

function balance(){return Number(d.querySelector('.stat-value').textContent.replace(/[^0-9.-]/g,''))}
function add(type,amount,status='Cleared'){
  const form=d.querySelector('#entry-form');
  const values={type,date:'2026-09-12',amount:String(amount),category:type+' QA',account:'Cash',status,note:'Automated test'};
  Object.entries(values).forEach(([name,value])=>{form.elements[name].value=value});
  form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
}

assert(balance()===50000,'Opening balance should be 50,000');
add('Expense',10000);assert(balance()===40000,'Expense should reduce balance to 40,000');
add('Bill',5000,'Pending');assert(balance()===40000,'Pending bill must not reduce balance');
const bill=d.querySelector('.bill-toggle');bill.checked=true;bill.dispatchEvent(new w.Event('change',{bubbles:true}));assert(balance()===35000,'Paid bill should reduce balance to 35,000');
add('Savings',5000);assert(balance()===30000,'Savings transfer should reduce available balance to 30,000');
add('Income',2000);assert(balance()===32000,'Income should increase balance to 32,000');

const session=d.querySelector('#session-form');session.elements.name.value='New month';session.elements.opening.value='100000';session.elements.start.value='2026-10-01';session.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
assert(balance()===100000,'New session should start with its own opening balance');
assert(JSON.parse(w.localStorage.getItem('lp_finance_log')).length===4,'Starting a new session must preserve old entries');
dom.window.close();
console.log('Finance flow test passed: opening balance, expense, pending/paid bill, savings, income, and new-session history.');
