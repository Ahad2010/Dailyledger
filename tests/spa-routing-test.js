const fs=require('fs');
const path=require('path');
const assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');

(async()=>{
  const project=path.resolve(__dirname,'..'),storage=fs.readFileSync(path.join(project,'assets/js/storage.js'),'utf8'),app=fs.readFileSync(path.join(project,'assets/js/app.js'),'utf8');
  let html=fs.readFileSync(path.join(project,'index.html'),'utf8').replace(/<link[^>]+tokens\.css[^>]*>/,'').replace(/<script defer src="[^"]*chart\.umd\.min\.js"><\/script>/,'').replace(/<script defer src="[^"]*storage\.js"><\/script>/,'').replace(/<script defer src="[^"]*app\.js"><\/script>/,'');
  const seed=JSON.stringify([{id:'spa-task',title:'Persists between routes',due:'2099-01-01',priority:'High',status:'To do'}]);
  const chartStub=`window.__charts=[];window.Chart=function(el,config){this.el=el;this.config=config;this.destroyed=false;this.destroy=()=>this.destroyed=true;window.__charts.push(this)};`;
  html=html.replace('</body>',`<script>${storage}<\/script><script>localStorage.setItem('lp_tasks_variable',${JSON.stringify(seed)});${chartStub}<\/script><script>${app}<\/script></body>`);
  const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://life-planner.local/index.html#/task-tracker/dashboard'}),w=dom.window,d=w.document;
  assert.equal(d.querySelector('#page-title').textContent,'See the work behind your momentum');
  const firstChart=w.__charts[0];assert(firstChart,'Tasks chart did not initialize');
  w.location.hash='/financial-planner/annual-dashboard';await new Promise(resolve=>w.setTimeout(resolve,0));
  assert.equal(d.querySelector('#page-title').textContent,'The year, in one calm view');assert(firstChart.destroyed,'Old chart was not destroyed on route change');
  w.location.hash='/task-tracker/variable-tasks';await new Promise(resolve=>w.setTimeout(resolve,0));
  assert(d.body.textContent.includes('Persists between routes'),'localStorage data disappeared between SPA routes');
  assert([...d.querySelectorAll('a[href]')].every(a=>a.getAttribute('href').startsWith('#/')),'A rendered navigation link is not hash-based');
  dom.window.close();

  const values=new Map(),fileDom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'file:///C:/Life-Planner/index.html#/task-tracker/dashboard',beforeParse(window){Object.defineProperty(window,'localStorage',{value:{getItem:key=>values.has(key)?values.get(key):null,setItem:(key,value)=>values.set(key,String(value))}})}}),fw=fileDom.window;
  fw.location.hash='/task-tracker/variable-tasks';await new Promise(resolve=>fw.setTimeout(resolve,0));
  assert(fw.document.body.textContent.includes('Persists between routes'),'file:// hash navigation lost shared storage');
  fileDom.window.close();console.log('SPA routing test passed: hash navigation, shared localStorage, Chart.js cleanup, and simulated file:// view switches.');
})().catch(error=>{console.error(error);process.exitCode=1});
