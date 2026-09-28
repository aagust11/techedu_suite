let seed=1,randomState=1;
function random(){randomState=(Math.imul(randomState,1664525)+1013904223)>>>0;return randomState/4294967296;}
const $=s=>document.querySelector(s),rnd=(a,b)=>Math.round((a+random()*(b-a))*10)/10,ri=(a,b)=>Math.floor(a+random()*(b-a+1));
let generated=[],generatedConfig;
function problem(type,d){
 if(type==='mixed')type=['lever','gears','ohm','energy','multigear'][ri(0,d===1?3:4)];
 if(type==='multigear'){
  const z1=ri(10,30),z2=ri(30,70),z3=ri(12,35),z4=ri(35,80),n1=ri(8,28)*50,n2=n1*z1/z2,n4=n2*z3/z4;
  return {title:'Tren compost d’engranatges',q:`Un motor gira a <b>${n1} rpm</b>. La roda 1 (${z1} dents) mou la 2 (${z2}); al mateix eix hi ha la 3 (${z3}), que mou la 4 (${z4}). Calcula les rpm finals.`,guide:['Calcula n₂ amb n₁·z₁=n₂·z₂.','Les rodes 2 i 3 comparteixen eix: n₂=n₃.','Calcula n₄ i compara-la amb n₁.'],answer:n4,unit:'rpm',s:`n₂=${n2.toFixed(1)} rpm; n₃=n₂; n₄=n₃·${z3}/${z4}=<b>${n4.toFixed(1)} rpm</b>.`,extra:'Prediu el sentit de gir de la roda 4 respecte de la 1 i justifica els dos contactes entre rodes.',extraSolution:'Hi ha dos contactes exteriors; cada contacte inverteix el sentit. La roda 4 gira en el mateix sentit que la 1.'};
 }
 if(type==='lever'){
  const genre=ri(1,3),P=ri(d===1?4:8,d===1?16:40)*10;
  const bp10=genre===2?ri(8,20):genre===3?ri(3,9):ri(5,18);
  const br10=genre===2?ri(2,bp10-2):genre===3?ri(bp10+2,20):ri(5,18);
  const m=LeverModel.create(genre,P,bp10/10,br10/10),num=LeverModel.num;
  return {title:`Palanca de ${genre}r gènere`,diagram:LeverModel.svg(m),editURL:`../drawings/?lever=${genre},${P},${m.bp},${m.br}`,q:`Una potència de <b>${P} N</b> actua a <b>${num(m.bp)} m</b> del fulcre. La resistència és a <b>${num(m.br)} m</b>. Calcula R per mantenir l’equilibri.`,guide:['Localitza fulcre, P i R. Quin queda entre els altres dos?','Els braços es mesuren sempre des del fulcre. Identifica bₚ i bᵣ.','Escriu P·bₚ=R·bᵣ i aïlla R.'],answer:m.resistance,unit:'N',s:`R=(${P}·${num(m.bp)})/${num(m.br)}=<b>${num(m.resistance)} N</b>.`,extra:'Si el braç de potència es reduís a la meitat, com canviaria la resistència equilibrada sense variar P ni bᵣ?',extraSolution:'R també es reduiria a la meitat perquè R és proporcional a bₚ.'};
 }
 if(type==='gears'){
  const z1=d===1?ri(1,4)*10:ri(10,40),z2=d===1?z1*2:ri(20,80),n1=d===1?ri(4,12)*100:ri(5,30)*50,n2=n1*z1/z2;
  return {title:'Transmissió per engranatges',q:`La roda motriu té <b>${z1} dents</b> i gira a <b>${n1} rpm</b>. Mou una roda de <b>${z2} dents</b>. Calcula les rpm de la conduïda.`,guide:['Identifica la roda motriu i la conduïda.','Escriu n₁·z₁=n₂·z₂.','Comprova si la roda amb més dents gira més lentament.'],answer:n2,unit:'rpm',s:`n₂=${n1}·${z1}/${z2}=<b>${n2.toFixed(1)} rpm</b>. Els sentits de gir són contraris.`,extra:'Què passaria amb la velocitat conduïda si dupliquéssim les dents de la roda 2?',extraSolution:'Es reduiria a la meitat si n₁ i z₁ no canvien.'};
 }
 if(type==='ohm'){
  const R=d===1?ri(1,10)*2:ri(2,20)*5,I=d===1?ri(1,5):rnd(.2,3),V=Math.round(R*I*10)/10;
  return {title:"Llei d'Ohm",q:`Per una resistència de <b>${R} Ω</b> circulen <b>${I} A</b>. Calcula la tensió.`,guide:['Tria la relació V=R·I.','Substitueix R i I amb les seves unitats.','Comprova que el resultat s’expressa en volts.'],answer:V,unit:'V',s:`V=${R}·${I}=<b>${V} V</b>.`,extra:'Si la tensió es mantingués i es dupliqués R, què passaria amb I?',extraSolution:'El corrent es reduiria a la meitat segons I=V/R.'};
 }
 const Ein=ri(2,20)*100,percent=d===1?ri(5,9)*10:ri(55,92),Eout=Ein*percent/100;
 return {title:'Rendiment energètic',q:`Una màquina rep <b>${Ein} J</b> i en transforma <b>${Eout} J</b> en energia útil. Calcula el rendiment en percentatge.`,guide:['Distingeix l’energia d’entrada de l’energia útil.','Divideix Eútil entre Eentrada.','Multiplica per 100 per expressar-ho en percentatge.'],answer:percent,unit:'%',s:`η=${Eout}/${Ein}·100=<b>${percent}%</b>. Dissipa ${Ein-Eout} J.`,extra:'Quina energia útil obtindries amb la mateixa entrada si el rendiment augmentés 5 punts percentuals?',extraSolution:`${Ein}·${(percent+5)/100} = ${Ein*(percent+5)/100} J (si el rendiment no supera el 100%).`};
}
function paint(){
 const previous=window.TechEduCapture?.();
 const show=$('#solutions').checked,guide=$('#guided').checked,level=window.TechEduCurrent?.().level||'standard';
 $('#output').innerHTML=generated.map((p,i)=>`<article><small>VARIANT ${i+1}</small><h2>${p.title}</h2><p>${window.TechEduCurrent?.().supports.shortText?p.q.replaceAll('. ','.<br>'):p.q}</p>${p.diagram||''}${p.editURL?`<p><a href="${p.editURL}" target="_blank" rel="noopener">Edita aquesta palanca a TechDrawings →</a></p>`:''}${guide?`<div class="solution"><b>Passos concrets</b><ol>${p.guide.map(x=>'<li>'+x+'</li>').join('')}</ol></div>`:''}<label>Resposta (${p.unit})<input class="answer" data-index="${i}" inputmode="decimal" placeholder="Escriu un nombre"></label><button class="check-answer" data-index="${i}">Comprova</button><p class="feedback" data-index="${i}" role="status"></p>${level==='extension'?`<div class="extension"><b>Repte de transferència</b><p>${p.extra}</p><label>Predicció i justificació<textarea class="reasoning" data-index="${i}"></textarea></label>${show?'<p>'+p.extraSolution+'</p>':''}</div>`:''}${show?`<div class="solution"><b>Resolució</b><p>${p.s}</p></div>`:''}</article>`).join('');
 if(previous)window.TechEduRestoreFields?.(previous);

}
function generate(nextSeed){
 seed=Number.isInteger(nextSeed)?nextSeed:crypto.getRandomValues(new Uint32Array(1))[0];randomState=seed;
 const n=Math.min(30,Math.max(1,+$('#count').value||1));generatedConfig={topic:$('#topic').value,difficulty:$('#difficulty').value,count:n};generated=Array.from({length:n},()=>problem($('#topic').value,+$('#difficulty').value));paint();
}
let adaptedProfile;
function adapt(){
 const {profile,level,supports}=window.TechEduCurrent?.()||{level:'standard',supports:{}};
 $('#profileHint').textContent=profile?profile.name+' · '+({guided:'Dades senzilles i passos concrets',standard:'Pràctica autònoma',extension:'Càlcul i transferència'}[level]):'Sense perfil: nivell habitual.';
 if(profile){$('#difficulty').value={guided:'1',standard:'2',extension:'3'}[level];$('#guided').checked=level==='guided'||supports.stepByStep;$('#solutions').checked=false;$('#count').value=level==='guided'?2:level==='extension'?3:4;}
 if(adaptedProfile!==profile?.id||!generated.length){adaptedProfile=profile?.id;generate();}else paint();
}
$('#output').onclick=e=>{
 const button=e.target.closest('.check-answer');if(!button)return;const i=Number(button.dataset.index),input=$('#output').querySelector('.answer[data-index="'+i+'"]'),feedback=$('#output').querySelector('.feedback[data-index="'+i+'"]');
 const value=Number(input.value.replace(',','.'));if(!input.value.trim()||!Number.isFinite(value)){feedback.textContent='Introdueix un nombre abans de comprovar.';return}
 const target=generated[i].answer,tolerance=Math.max(.11,Math.abs(target)*.005);
 feedback.textContent=Math.abs(value-target)<=tolerance?'Correcte. Explica també per què el resultat és coherent.':'Encara no. Revisa la fórmula i les unitats; pots mostrar els passos o la resolució.';
};
$('#generate').onclick=()=>{if(window.TechEduSession?.archive()===false)return;generate();document.querySelectorAll('#output .answer,#output .reasoning').forEach(x=>x.value='');document.querySelectorAll('#output .feedback').forEach(x=>x.textContent='')};$('#solutions').onchange=paint;$('#guided').onchange=paint;
$('#topic').onchange=()=>{window.TechEduSetDomain?.(['ohm','energy'].includes($('#topic').value)?'electricity':'mechanisms')};
window.addEventListener('techedu-level',adapt);
adapt();

window.TechEduActivity={capture:()=>({seed,config:generatedConfig}),restore:extra=>{if(extra?.config){for(const id of ['topic','difficulty','count'])$('#'+id).value=extra.config[id];}generate(Number.isInteger(extra?.seed)?extra.seed:undefined)}};
