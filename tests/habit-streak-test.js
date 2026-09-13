const {openApp}=require('./open-app');
const iso=d=>{const copy=new Date(d);return`${copy.getFullYear()}-${String(copy.getMonth()+1).padStart(2,'0')}-${String(copy.getDate()).padStart(2,'0')}`};
const d0=new Date(),d1=new Date(),d2=new Date();d1.setDate(d1.getDate()-1);d2.setDate(d2.getDate()-2);
const habit={id:'habit-qa',name:'Read',frequency:'Daily',checks:{[iso(d0)]:true,[iso(d1)]:true,[iso(d2)]:true}};
const dom=openApp('my-routines/habit-tracker.html',{lp_habits:[habit]}),doc=dom.window.document;
const values=[...doc.querySelectorAll('.stat-value')].map(x=>x.textContent.trim());
if(!values.includes('3 days'))throw new Error('Three consecutive daily check-ins should produce a 3-day streak');
if(!doc.querySelector('.streak-row')?.textContent.includes('3 current'))throw new Error('Habit streak panel did not render the current streak');
dom.window.close();console.log('Habit streak test passed: current and best streaks are calculated from consecutive check-ins.');
