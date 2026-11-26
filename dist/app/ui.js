'use strict';
const byId = id => document.getElementById(id);
const loadJson = path => window.embeddedRoomFiles && Object.hasOwn(window.embeddedRoomFiles,path) ? Promise.resolve(JSON.parse(window.embeddedRoomFiles[path])) : fetch(path).then(response => {if (!response.ok) throw new Error('Could not load '+path); return response.json();});
const schema = loadJson('app/atlas-form.json');
const contract = loadJson('app/cases.json');
let library, liveForm, scratchDesigner, checkedLowInput, track='code';
const inputSignature = form => JSON.stringify([form.data.start,form.data.duration,form.data.roomBlocked]);
function loadFormio() {
  if (window.Formio) return Promise.resolve(window.Formio);
  if (!library) library = new Promise((resolve,reject) => {
    const script=document.createElement('script'); script.src='vendor/formio.full.min.js';
    script.onload=()=>resolve(window.Formio); script.onerror=()=>reject(new Error('Could not load Form.io.')); document.head.append(script);
  });
  return library;
}
async function createNativeForm(element) {
  const [api, definition]=await Promise.all([loadFormio(),schema]);
  return api.createForm(element,structuredClone(definition),{noAlerts:true,readOnly:false,disableAlerts:true});
}
function output(form) {
  const data=form.data;
  return {available:data.available,code:data.reasonCode,message:data.message};
}
function lowBookings(form) {const data=form.data;return [[data.firstStart,data.firstEnd],[data.secondStart,data.secondEnd]];}
function resultView(result) {
  const card=byId('result'); const validDecision=result && ['AVAILABLE','OVERLAP','BLOCKED'].includes(result.code);
  card.dataset.state=!result?'ready':result.available?'available':validDecision?'unavailable':'invalid';
  byId('decision').textContent=!result?'Ready to check':result.available?'Available':validDecision?'Unavailable':'Check input';
  byId('message').textContent=result?result.message:'The check leaves both bookings in place.';
  byId('reason').textContent=result?result.code:'';
}
function readCodeForm() {return {start:byId('start').value,duration:byId('duration').value,blocked:byId('blocked').checked};}
async function showRoom(mode) {
  track=mode; const low=mode==='low'; byId('code-form').hidden=low; byId('low-form').hidden=!low;
  for(const key of ['code','low']) byId('tab-'+key).setAttribute('aria-current',key===mode?'page':'false');
  resultView(null); byId('check').disabled=low && !liveForm;
  if (low && !liveForm) {
    const target=byId('low-form');target.replaceChildren();
    liveForm=await createNativeForm(target); liveForm.on('change',event=>{if (track==='low' && event?.changed && checkedLowInput !== inputSignature(liveForm)) resultView(null);});
  }
  byId('check').disabled=false;
}
byId('code-form').addEventListener('input',()=>resultView(null));
byId('code-form').addEventListener('submit',event=>{event.preventDefault();byId('check').click();});
byId('check').addEventListener('click',()=>{ if(track==='low') {if(liveForm){liveForm.checkData(null,{noEmit:true}); checkedLowInput=inputSignature(liveForm); resultView(output(liveForm));}} else resultView(CampusChecker.check(readCodeForm())); });
function testRow(row) {const tr=document.createElement('tr');for(const v of [row.id+' · '+row.label,row.expect,row.code.result,row.low.result]){const td=document.createElement('td');td.textContent=v;tr.append(td);}tr.children[2].className=row.code.ok?'ok':'bad';tr.children[3].className=row.low.ok?'ok':'bad';return tr;}
async function checkSuite() {
  const cases=await contract, host=document.createElement('div'); host.className='testhost';host.setAttribute('aria-hidden','true');document.body.append(host);
  const form=await createNativeForm(host); const rows=[]; const startCode=JSON.stringify(CampusChecker.bookings()), startLow=JSON.stringify(lowBookings(form));
  async function sample(c) {
    form.getComponent('start').setValue(c.start);
    form.getComponent('duration').setValue(c.duration);
    form.getComponent('roomBlocked').setValue(c.blocked);
    form.checkData(null,{noEmit:true}); return output(form);
  }
  try {
    for (const c of cases.cases) {
      const obs={id:c.id,label:c.label,expect:c.expect};
      if(c.id==='T8') {
        for(const again of cases.cases.slice(0,7)){CampusChecker.check(again); await sample(again);}
        for(const [name,before,after] of [['code',startCode,CampusChecker.bookings()],['low',startLow,lowBookings(form)]]) {
          const ok=before===JSON.stringify(cases.bookings) && JSON.stringify(after)===before;
          obs[name]={result:ok?'UNCHANGED':'CHANGED',ok,before:JSON.parse(before),after};
        }
      } else {
        for(const [name,res] of [['code',CampusChecker.check(c)],['low',await sample(c)]]) {
          obs[name]={result:res.code||'NO_RESULT',ok:res.code===c.expect && res.available===(c.expect==='AVAILABLE') && typeof res.message==='string' && res.message.length>0,available:res.available,message:res.message};
        }
      } rows.push(obs);
    }
    return rows;
  }finally{form.destroy(true);host.remove();}
}
byId('run-tests').addEventListener('click',async()=>{
  const b=byId('run-tests');b.disabled=true;byId('test-status').textContent='Running both implementations…';
  try{const rows=await checkSuite();const n=key=>rows.filter(row=>row[key].ok).length;byId('test-rows').replaceChildren(...rows.map(testRow));byId('score').textContent=`JavaScript ${n('code')}/8 · Form.io ${n('low')}/8`;byId('test-status').textContent='Latest run in this browser. T8 compares both stored intervals before and after repeated checks.';window.lastObservedRun=rows;byId('download-tests').hidden=false;}catch(error){byId('test-status').textContent='The suite could not finish: '+error.message;}finally{b.disabled=false;}
});
async function openDesigner(){if(scratchDesigner)return;const [api,definition]=await Promise.all([loadFormio(),schema]);scratchDesigner=await api.builder(byId('designer'),structuredClone(definition),{noDefaultSubmitButton:true});}
byId('export-form').addEventListener('click',()=>{if(!scratchDesigner)return;const url=URL.createObjectURL(new Blob([JSON.stringify(scratchDesigner.schema,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='Atlas_204_Form.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);});
async function route(){const name=location.hash.slice(1);const which=['tests','source','designer'].includes(name)?name:'room';for(const id of ['room','tests','source','designer'])byId(id+'-view').hidden=which!==id;document.querySelectorAll('[data-section]').forEach(a=>a.setAttribute('aria-current',a.dataset.section===(which==='designer'?'source':which)?'page':'false'));if(which==='room')await showRoom(name==='low'?'low':'code');if(which==='designer')await openDesigner();}
window.addEventListener('hashchange',route);route();

byId('download-tests').addEventListener('click',()=>{
  if(!window.lastObservedRun)return;
  const a=document.createElement('a');const u=URL.createObjectURL(new Blob([JSON.stringify(window.lastObservedRun,null,2)],{type:'application/json'}));
  a.href=u;a.download='Atlas_204_Observed.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),5000);
});
