(function(){
  'use strict';
  const KEYS=['lp_settings','lp_finance_log','lp_finance_budgets','lp_finance_savings_debt','lp_tasks_variable','lp_tasks_recurring_rules','lp_tasks_recurring_instances','lp_habits','lp_cleaning','lp_workouts_setup','lp_workouts_plan','lp_weight_log','lp_meals_setup','lp_meals_plan','lp_grocery_list','lp_goals','lp_timeblocks'];
  function getItem(key,fallback){try{const raw=localStorage.getItem(key);return raw===null?(fallback===undefined?null:fallback):JSON.parse(raw)}catch(error){console.warn('Life Planner could not read '+key,error);return fallback===undefined?null:fallback}}
  function setItem(key,value){try{localStorage.setItem(key,JSON.stringify(value));return value}catch(error){console.error('Life Planner could not save '+key,error);throw error}}
  function exportAllData(){const data={version:1,exportedAt:new Date().toISOString(),data:{}};KEYS.forEach(k=>{const v=getItem(k,null);if(v!==null)data.data[k]=v});return JSON.stringify(data,null,2)}
  function importAllData(payload){const parsed=typeof payload==='string'?JSON.parse(payload):payload;if(!parsed||typeof parsed!=='object'||!parsed.data)throw new Error('This is not a Life Planner backup.');Object.keys(parsed.data).forEach(k=>{if(KEYS.includes(k))setItem(k,parsed.data[k])});return true}
  window.LPStorage={KEYS,getItem,setItem,exportAllData,importAllData};
})();
