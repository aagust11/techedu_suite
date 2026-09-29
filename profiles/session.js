/* Per-profile activity drafts. Data is restored as values/text, never HTML. */
(function(){
 const moduleId=document.currentScript.dataset.activity,P=TechEduProfiles;
 const panel=document.createElement('section');panel.className='work-session';
 panel.innerHTML='<b>Quadern de treball</b><p id="workStatus" role="status"></p><label>Predicció: què passarà en el cas que provaràs?<textarea id="workPrediction"></textarea></label><label>Resultat i justificació: què has observat i quina dada ho demostra?<textarea id="workConclusion"></textarea></label><button type="button" id="workFinish">Desa com a evidència</button><details><summary>Evidències anteriors (12 darreres)</summary><div id="workHistory"></div></details>';
 if(moduleId==='mechanisms')document.querySelector('footer').before(panel);else (document.querySelector('main')||document.body).append(panel);
 const style=document.createElement('style');style.textContent='.work-session{margin:24px;padding:20px;background:#f1f6f3;border:1px solid #c5ded2;border-radius:12px;color:#183d37;font:14px system-ui}.work-session label{display:block;margin:12px 0}.work-session textarea,.reasoning{display:block;box-sizing:border-box;width:100%;min-height:75px;font:inherit;padding:9px}.work-session button{margin:6px}.work-session #workStatus{font-weight:600}';document.head.append(style);
 let owner=null,record=null,restoring=false,blocked=false,ready=false;
 const status=message=>document.querySelector('#workStatus').textContent=message;
 function elements(){return [...document.querySelectorAll('main input,main select,main textarea,aside input,aside select,.work-session textarea')].filter(e=>e.type!=='file'&&!e.readOnly&&!e.closest('#gear-editor')&&(e.id||e.dataset.index!==undefined));}
 function key(e){return e.id||e.className+':'+e.dataset.index;}
 function capture(){return {fields:Object.fromEntries(elements().map(e=>[key(e),e.type==='checkbox'||e.type==='radio'?e.checked:e.value])),feedback:Object.fromEntries([...document.querySelectorAll('[role="status"]')].filter(e=>e.id!=='workStatus'&&e.id!=='profileHint').map(e=>[e.id||'feedback:'+e.dataset.index,e.textContent]))};}
 function restoreFields(state){
  for(const e of elements()){const v=state?.fields?.[key(e)];if(v!==undefined){if(e.type==='checkbox'||e.type==='radio')e.checked=v===true;else if(typeof v==='string')e.value=v.slice(0,20000);}}
  for(const e of document.querySelectorAll('[role="status"]')){const v=state?.feedback?.[e.id||'feedback:'+e.dataset.index];if(e.id!=='workStatus'&&e.id!=='profileHint'&&typeof v==='string')e.textContent=v.slice(0,2000);}
 }
 window.TechEduCapture=capture;window.TechEduRestoreFields=restoreFields;
 function extra(){return window.TechEduActivity?.capture?.()||{}}
 function persist(event){
  if(restoring||!ready||!owner||blocked)return false;
  try{
   const next={draft:{...capture(),course:window.TechEduCurrent?.().course||'eso',extra:extra()},events:(record?.events||[]),history:record?.history||[]};
   if(event)next.events=[...next.events,{at:new Date().toISOString(),action:event,...(event==='check-answer'?{responses:next.draft.fields,feedback:next.draft.feedback}:{})}].slice(-200);
   record=P.writeWork(owner,moduleId,next,record?.revision||0);status('Desat en aquest navegador · '+new Date().toLocaleTimeString('ca'));return true;
  }catch(e){blocked=true;status('No s’ha desat: '+e.message+' Copia el text pendent abans de recarregar.');return false;}
 }
 function history(){
  const container=document.querySelector('#workHistory');container.replaceChildren();
  (record?.history||[]).slice().reverse().forEach(item=>{const button=document.createElement('button');button.type='button';button.textContent='Reprèn '+(typeof item.draft?.extra?.label==='string'?item.draft.extra.label.slice(0,100)+' · ':'')+new Date(item.at).toLocaleString('ca');button.onclick=()=>{if(!persist())return;apply(item.draft);persist('reprendre evidència')};container.append(button)});
 }
 function apply(draft){
  restoring=true;
  try{restoreFields(draft);window.TechEduActivity?.restore?.(draft?.extra);restoreFields(draft);window.TechEduActivity?.afterRestore?.();}catch(e){blocked=true;status('No es pot recuperar aquesta activitat: '+e.message)}finally{restoring=false}
 }
 function archive(){
  if(!owner)return true;
  if(!persist())return false;
  record.history=[...(record.history||[]),{at:new Date().toISOString(),draft:record.draft}].slice(-12);
  const saved=persist('evidència desada');history();return saved;
 }
 window.TechEduSession={archive,save:persist};
 let defaults;
 function activate(){
  const next=P.active()?.id||null;if(ready&&next===owner)return;
  owner=next;blocked=false;record=owner?P.readWork(owner,moduleId):null;ready=true;
  // Reset fields before applying this learner's draft; no data crosses profiles.
  for(const e of elements()){if(e.type==='checkbox'||e.type==='radio')e.checked=false;else e.value='';}
  document.querySelectorAll('.feedback,#predictResult,#propertyFeedback,#specificFeedback,#gearFeedback').forEach(e=>e.textContent='');
  apply(defaults);
  const current=window.TechEduCurrent?.();
  if(!record&&current){const h=document.querySelector('#hideOutputs');if(h)h.checked=!!current.supports.hideSolution||current.level==='guided';const g=document.querySelector('#guided');if(g)g.checked=!!current.supports.stepByStep||current.level==='guided';}
  if(!record&&moduleId==='problems'){document.querySelector('#difficulty').value={guided:'1',standard:'2',extension:'3'}[current.level];document.querySelector('#count').value=current.level==='guided'?2:current.level==='extension'?3:4;window.TechEduActivity.restore({});}
  if(record?.draft)apply(record.draft);
  else if(moduleId==='logic')window.TechEduActivity?.restore?.();
  window.TechEduActivity?.activate?.({restored:!!record?.draft});
  history();if(!blocked)status(owner?(record?'Treball recuperat.':'Preparat per desar el treball.'): 'Obre El meu compte per desar i reprendre el treball.');
 }
 function init(){defaults={...capture(),extra:extra()};activate();}
 window.addEventListener('techedu-level',()=>{if(ready)activate()});
 document.addEventListener('input',e=>{if(!e.target.closest('.techedu-profile-bar'))persist()});
 document.addEventListener('change',e=>{if(!e.target.closest('.techedu-profile-bar'))persist(e.target.id||'canvi')});
 document.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&!b.closest('.techedu-profile-bar')&&!b.closest('.work-session'))persist(b.id||b.className)});
 document.addEventListener('pointerup',e=>{if(e.target.tagName==='CANVAS')setTimeout(()=>persist('modificació de l’escena'),0)});
 document.querySelector('#workFinish').onclick=archive;
 window.addEventListener('pagehide',()=>persist());
 window.addEventListener('storage',e=>{if(e.key===P.KEY&&owner&&(P.readWork(owner,moduleId)?.revision||0)!==(record?.revision||0)){blocked=true;status('El treball ha canviat en una altra pestanya. Recarrega per recuperar-lo; aquesta pestanya no sobreescriurà els canvis.')}});
 if(moduleId==='mechanisms'){
  window.addEventListener('techedu-gear-ready',()=>{
   window.TechEduActivity={capture:()=>({board:JSON.parse(JSON.stringify(window.techEduGear.board))}),restore:x=>{if(x?.board){window.techEduGear.isPlaying=false;window.techEduGear.replaceBoard(window.gearlab.model.Board.fromObject(x.board))}}};init();
   setInterval(()=>{if(ready&&owner&&!blocked&&!window.techEduGear.isPlaying&&JSON.stringify(extra())!==JSON.stringify(record?.draft?.extra))persist()},3000);
  });
 }else init();
})();
