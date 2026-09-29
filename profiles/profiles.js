const P=TechEduProfiles,B=TechEduBank,$=s=>document.querySelector(s);
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let data=P.load(),testDomain=null,lastResult=null;
let testQuestions=[],testRecord=null;
const current=()=>P.active(data);
function commit(message='Canvis desats en aquest navegador.'){try{data=P.save(data);$('#saveStatus').textContent=message}catch(e){$('#saveStatus').textContent='No s’ha pogut desar: '+e.message}}
function render(){
 const p=current();$('#empty').hidden=!!p;$('#editor').hidden=!p;
 $('#profileList').innerHTML=data.profiles.map(x=>'<button type="button" data-id="'+escapeHTML(x.id)+'" class="'+(x.id===data.activeId?'active':'')+'">'+escapeHTML(x.name)+'<small>'+P.labels[x.level]+'</small></button>').join('')||'<p class="fine">Encara no hi ha cap perfil.</p>';
 if(!p)return;
 $('#profileTitle').textContent=p.name;$('#profileName').value=p.name;$('#generalLevel').value=p.level;
 for(const key of Object.keys(p.supports))$('#'+key).checked=p.supports[key];
 $('#domainLevels').innerHTML=P.DOMAINS.map(d=>'<label>'+B[d].title+'<select data-domain="'+d+'"><option value="">Segons l’orientació general</option>'+P.LEVELS.map(level=>'<option value="'+level+'" '+(p.domains[d]===level?'selected':'')+'>'+P.labels[level]+'</option>').join('')+'</select></label>').join('');
 $('#testButtons').innerHTML=P.DOMAINS.map(d=>'<button type="button" data-test="'+d+'" class="'+(testDomain===d?'active':'')+'">'+B[d].title+'</button>').join('');
 $('#history').innerHTML=p.attempts.length?[...p.attempts].reverse().map(a=>{const result=P.suggest(B[a.domain].resolve(a.questionIds),a.answers);return '<div class="history-item"><b>'+B[a.domain].title+'</b> · '+escapeHTML(a.date.slice(0,10))+' · '+result.score+'/'+result.total+' <span class="badge">Proposta: '+P.labels[result.level]+'</span></div>'}).join(''):'<p class="fine">Encara no hi ha proves desades.</p>';
 const work=P.load().profiles.find(x=>x.id===p.id)?.work||{};
 $('#workOverview').replaceChildren();
 for(const [activity,entry] of Object.entries(work)){if(activity.startsWith('test-'))continue;const a=document.createElement('a');a.href=activity==='communications-digitization'?'../modules/communications/digitization.html':activity==='communications-encoding'?'../modules/communications/encoding.html':activity==='communications-errors'?'../modules/communications/errors.html':activity==='communications-packets'?'../modules/communications/packets.html':'../modules/'+activity+'/';a.textContent=activity+' · '+(entry.updatedAt||'').slice(0,10)+' · '+(entry.history?.length||0)+' evidències';const row=document.createElement('p');row.append(a);$('#workOverview').append(row);}
}
$('#addForm').onsubmit=e=>{
 e.preventDefault();const name=$('#newName').value.trim();if(!name)return;if(data.profiles.length>=100){$('#saveStatus').textContent='Màxim de 100 perfils locals. Exporta una còpia abans d’eliminar perfils.';return;}
 const p={id:crypto.randomUUID(),name,level:'standard',domains:Object.fromEntries(P.DOMAINS.map(d=>[d,null])),supports:{shortText:false,stepByStep:false,hideSolution:false},attempts:[]};
 data.profiles.push(p);data.activeId=p.id;testDomain=null;lastResult=null;commit();$('#newName').value='';$('#testArea').innerHTML='';render();
};
$('#profileList').onclick=e=>{const button=e.target.closest('[data-id]');if(!button)return;data.activeId=button.dataset.id;testDomain=null;lastResult=null;$('#testArea').innerHTML='';commit();render()};
$('#profileName').onchange=e=>{const p=current();if(!p)return;const name=e.target.value.trim().slice(0,60);if(!name){e.target.value=p.name;return}p.name=name;commit();render()};
$('#generalLevel').onchange=e=>{current().level=e.target.value;commit();render()};
$('#domainLevels').onchange=e=>{if(!e.target.matches('[data-domain]'))return;current().domains[e.target.dataset.domain]=e.target.value||null;commit();render()};
for(const key of ['shortText','stepByStep','hideSolution'])$('#'+key).onchange=e=>{current().supports[key]=e.target.checked;commit()};
$('#deleteProfile').onclick=()=>{
 const p=current();if(!p||!confirm('Eliminar el perfil «'+p.name+'» i tot el seu treball i proves desades en aquest navegador?'))return;
 data.profiles=data.profiles.filter(x=>x.id!==p.id);data.activeId=data.profiles[0]?.id||null;testDomain=null;lastResult=null;$('#testArea').innerHTML='';commit();render();
};
$('#testButtons').onclick=e=>{const button=e.target.closest('[data-test]');if(!button)return;testDomain=button.dataset.test;lastResult=null;showTest();render()};
function showTest(){
 const bank=B[testDomain];if(!bank)return;
 testRecord=P.readWork(current().id,'test-'+testDomain);
 const last=current().attempts.filter(a=>a.domain===testDomain).at(-1);
 testQuestions=Array.isArray(testRecord?.draft?.questionIds)?bank.resolve(testRecord.draft.questionIds):(last?.questionIds?.[0]?.includes('-a-')||last&&!last.questionIds?bank.alternates:bank.questions);
 if(testQuestions.length!==6)testQuestions=bank.questions;
 $('#testArea').innerHTML='<form id="testForm"><h3>'+bank.title+'</h3><p class="fine">Respon sense ajuda per orientar el punt de partida. Pots repetir-la després d’haver practicat.</p>'+testQuestions.map((q,i)=>'<fieldset class="test-question"><legend>'+(i+1)+'. '+escapeHTML(q.text)+'</legend>'+q.options.map((option,j)=>'<label><input type="radio" name="q'+i+'" value="'+j+'" required> '+escapeHTML(option)+'</label>').join('')+'<label><input type="radio" name="q'+i+'" value="-1" required> Encara no ho sé</label></fieldset>').join('')+'<button class="primary">Guarda i interpreta les respostes</button></form>';
 const form=$('#testForm');
 for(const [i,a] of (Array.isArray(testRecord?.draft?.answers)?testRecord.draft.answers:[]).slice(0,6).entries()){if(!Number.isInteger(a)||a< -1||a>=testQuestions[i].options.length)continue;const input=form.querySelector('[name="q'+i+'"][value="'+a+'"]');if(input)input.checked=true;}
 form.onchange=()=>{try{const answers=testQuestions.map((_,i)=>{const v=new FormData(form).get('q'+i);return v===null?null:Number(v)});testRecord=P.writeWork(current().id,'test-'+testDomain,{draft:{questionIds:testQuestions.map(q=>q.id),answers}},testRecord?.revision||0);$('#saveStatus').textContent='Prova en curs desada.'}catch(e){$('#saveStatus').textContent='No s’ha desat: '+e.message}};
 $('#testForm').onsubmit=e=>{e.preventDefault();const answers=testQuestions.map((_,i)=>Number(new FormData(e.target).get('q'+i)));if(answers.some(x=>!Number.isInteger(x)))return;
  try{const attempt={domain:testDomain,date:new Date().toISOString(),answers,questionIds:testQuestions.map(q=>q.id),bankVersion:bank.version};
   data=P.finishTest(current().id,testDomain,attempt,testRecord?.revision||0,data.metaRevision);testRecord=P.readWork(current().id,'test-'+testDomain);lastResult=P.suggest(testQuestions,answers);$('#saveStatus').textContent='Prova desada en aquest navegador.';showResult(answers);render();
  }catch(err){$('#saveStatus').textContent='No s’ha desat: '+err.message;}

 };
}
function showResult(answers){
 const result=lastResult,questions=testQuestions;
 $('#testArea').innerHTML='<div class="test-result" role="status"><h3>Resultat: '+result.score+'/'+result.total+'</h3><p>Orientació proposada per a <b>'+B[testDomain].title+'</b>: <b>'+P.labels[result.level]+'</b>. Les preguntes breus poden fallar per molts motius; compara-ho amb el treball habitual i decideix el perfil.</p><p><b>Conceptes a revisar:</b> '+(result.needs.length?result.needs.map(escapeHTML).join(', '):'cap dels conceptes d’aquesta prova')+'.</p><ul>'+result.skills.map(x=>'<li>'+escapeHTML(x.skill)+': '+x.correct+'/'+x.total+'</li>').join('')+'</ul><button id="applySuggestion" type="button">Aplica només a aquest àmbit</button><button id="retryTest" type="button">Repeteix la prova</button><details><summary>Revisa les respostes</summary><ol>'+questions.map((q,i)=>'<li>'+escapeHTML(q.text)+' — '+(answers[i]===q.correct?'Correcte':'Resposta correcta: '+escapeHTML(q.options[q.correct]))+'</li>').join('')+'</ol></details></div>';
 $('#applySuggestion').onclick=()=>{current().domains[testDomain]=result.level;commit('Orientació aplicada a '+B[testDomain].title+'.');render()};
 $('#retryTest').onclick=()=>{lastResult=null;showTest()};
}
$('#exportData').onclick=()=>{
 const blob=new Blob([JSON.stringify(P.load(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='techedu-perfils.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
$('#importData').onchange=async e=>{
 const file=e.target.files?.[0];if(!file)return;
 try{if(file.size>10_000_000)throw Error('El fitxer supera 10 MB.');
  const raw=JSON.parse(await file.text());if(raw?.version!==1||!Array.isArray(raw.profiles))throw Error('Format de perfils no compatible.');
  const incoming=P.sanitize(raw);if(incoming.profiles.length!==raw.profiles.length)throw Error('Hi ha perfils invàlids, duplicats o més de 100 perfils. No s’ha substituït cap dada.');if(!confirm('La importació substituirà tots els perfils locals actuals. Vols continuar?'))return;
  data=P.save(incoming,true);testDomain=null;lastResult=null;$('#testArea').innerHTML='';render();
 }catch(err){alert('No s’ha pogut importar: '+err.message)}finally{e.target.value=''}
};
render();
