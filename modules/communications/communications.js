(function(){
 'use strict';
 const $=id=>document.getElementById(id),C=SignalCore,keys=Object.keys(C.defaults);
 let baseline=null,result=null;
 let incomingBits=new URLSearchParams(location.hash.slice(1)).get('bits');if(!/^[01]{4,16}$/.test(incomingBits||''))incomingBits=null;
 const fmt=(n,d=2)=>n.toLocaleString('ca',{maximumFractionDigits:d});
 const names={mode:'tipus de senyal',bits:'missatge',amplitude:'amplitud',frequency:'freqüència',phase:'fase',bitRate:'velocitat de bits',gain:'senyal conservat',noise:'soroll',interference:'interferència',interferenceFrequency:'freqüència de la interferència',threshold:'llindar',seed:'patró de soroll'};
 function read(){return Object.fromEntries(keys.map(k=>[k,$(k).value]));}
 function set(c){for(const [k,v] of Object.entries(c))if(keys.includes(k))$(k).value=v;}
 function line(points,x,y,key){return points.map((p,i)=>(i?'L':'M')+x(p.t).toFixed(2)+','+y(p[key]).toFixed(2)).join(' ');}
 function plot(r){
  const c=r.config,digital=c.mode==='digital',max=Math.max(c.amplitude,c.amplitude*c.gain+c.noise+c.interference,digital?c.threshold:0)+.2,min=digital?-c.noise-c.interference-.2:-max;
  const width=Math.max(300,Math.min(900,$('wave').clientWidth||900)),right=width-25;
  $('wave').setAttribute('viewBox',`0 0 ${width} 340`);
  const x=t=>60+t/r.duration*(width-85),y=v=>285-(v-min)/(max-min)*260;
  const parts=['<title id="waveTitle">Senyal enviat i rebut</title><desc id="waveDesc">Temps en segons, tensió en volts. El traç taronja discontinu és el senyal enviat i el blau continu és el rebut. '+(digital?'Les línies verticals marquen la lectura al centre dels bits.':'Es mostren dos segons de senyal analògic.')+'</desc>'];
  for(let i=0;i<=4;i++){const v=min+(max-min)*i/4;parts.push(`<line x1="60" x2="${right}" y1="${y(v)}" y2="${y(v)}" stroke="#dde4df"/><text x="50" y="${y(v)+4}" text-anchor="end" font-size="12" fill="#52646c">${fmt(v,1)}</text>`);}
  for(let i=0;i<=4;i++){const t=r.duration*i/4;parts.push(`<text x="${x(t)}" y="308" text-anchor="middle" font-size="12" fill="#52646c">${fmt(t)}</text>`);}
  parts.push(`<text x="18" y="18" font-size="12">V</text><text x="${width-90}" y="333" font-size="12">Temps (s)</text>`);
  if(digital){parts.push(`<line x1="60" x2="${right}" y1="${y(c.threshold)}" y2="${y(c.threshold)}" stroke="#555" stroke-dasharray="7 5"/>`);for(const d of r.decisions)parts.push(`<line x1="${x(d.t)}" x2="${x(d.t)}" y1="25" y2="285" stroke="#ccd7dc" stroke-dasharray="2 5"/>`);}
  parts.push(`<path d="${line(r.samples,x,y,'sent')}" fill="none" stroke="#b74715" stroke-width="3" stroke-dasharray="7 4"/><path d="${line(r.samples,x,y,'received')}" fill="none" stroke="#245f83" stroke-width="1.8"/>`);
  if(digital)for(const d of r.decisions)parts.push(`<circle cx="${x(d.t)}" cy="${y(d.value)}" r="3.5" fill="#245f83"/>`);
  $('wave').innerHTML=parts.join('');
 }
 function metrics(r){
  const digital=r.config.mode==='digital';
  const values=digital?[[r.errors+'/'+r.decisions.length,'bits llegits erròniament'],[fmt(r.ber*100,1)+'%','errors en aquest missatge'],[fmt(r.duration)+' s','durada del missatge']]:[[fmt(r.config.frequency)+' Hz','cicles per segon'],[fmt(r.config.amplitude)+' V','amplitud enviada'],[fmt(r.rms,3)+' V','diferència RMS rebut − enviat']];
  $('metrics').innerHTML=values.map(([v,label])=>`<div class="metric"><b>${v}</b><span>${label}</span></div>`).join('');
  $('bitResults').hidden=!digital;
  $('bitStrip').innerHTML=digital?'<div><small>Enviat</small>'+r.decisions.map(d=>`<span>${d.sent}</span>`).join('')+'</div><div><small>Llegit</small>'+r.decisions.map(d=>`<span class="${d.error?'wrong':''}" aria-label="Bit ${d.index+1}: ${d.decoded}${d.error?', error':''}">${d.decoded}${d.error?' ×':''}</span>`).join('')+'</div>':'';
  $('decisions').innerHTML=r.decisions.map(d=>`<tr class="${d.error?'wrong':''}"><td>${d.index+1}</td><td>${fmt(d.t,3)}</td><td>${fmt(d.value,3)}</td><td>${d.sent}</td><td>${d.decoded}</td><td>${d.error?'× Error':'✓ Correcte'}</td></tr>`).join('');
 }
 function describe(key,value){if(key==='gain')return fmt(value*100)+'%';if(['amplitude','threshold','noise','interference'].includes(key))return fmt(value)+' V';if(['frequency','interferenceFrequency'].includes(key))return fmt(value)+' Hz';if(key==='bitRate')return fmt(value)+' bit/s';if(key==='phase')return fmt(value)+'°';return value;}
 function compare(){
  $('clearBaseline').disabled=!baseline;$('comparisonResult').replaceChildren();
  if(!baseline){$('comparisonSummary').textContent='Encara no has fixat la prova A.';return;}
  if(!result){$('comparisonSummary').textContent='La prova A es conserva. Corregeix la configuració de B per comparar.';return;}
  const a=C.simulate(baseline),b=result,changed=keys.filter(k=>a.config[k]!==b.config[k]);
  const effective=changed.filter(k=>!((a.config.mode==='digital'&&b.config.mode==='digital'&&['frequency','phase'].includes(k))||(a.config.mode==='analog'&&b.config.mode==='analog'&&['bits','bitRate','threshold'].includes(k))));
  $('comparisonSummary').textContent=effective.length?'Variables modificades: '+effective.map(k=>names[k]+' ('+describe(k,a.config[k])+' → '+describe(k,b.config[k])+')').join('; ')+'. '+(effective.length>1?'Has canviat més d’una variable: no pots atribuir l’efecte a una sola causa.':'Només has canviat una variable.'):'A i B tenen la mateixa configuració efectiva.';
  if(!$('reveal').checked){$('comparisonResult').textContent='Mostra les mesures per comparar els resultats.';return;}
  if(a.config.mode!==b.config.mode){$('comparisonResult').textContent='A i B són tipus de senyal diferents. Fixa una nova prova A del mateix tipus per comparar les mesures.';return;}
  const p=document.createElement('p');p.textContent=a.config.mode==='digital'?`Prova A: ${a.errors}/${a.decisions.length} errors (${fmt(a.ber*100,1)}%). Prova B: ${b.errors}/${b.decisions.length} errors (${fmt(b.ber*100,1)}%).`:`Diferència RMS respecte del senyal enviat: A = ${fmt(a.rms,3)} V; B = ${fmt(b.rms,3)} V.`;$('comparisonResult').append(p);
 }
 function render(){
  const digital=$('mode').value==='digital';
  $('bitsControl').hidden=!digital;$('digitalControls').hidden=!digital;$('receiverControls').hidden=!digital;$('analogControls').hidden=digital;$('thresholdLegend').hidden=!digital;
  const units={amplitude:' V',frequency:' Hz',phase:'°',bitRate:' bit/s',gain:'%',noise:' V',interference:' V',interferenceFrequency:' Hz',threshold:' V'};
  for(const [id,unit] of Object.entries(units))$(id+'Value').textContent=fmt(Number($(id).value)*(id==='gain'?100:1))+unit;
  $('results').hidden=!$('reveal').checked;
  try{result=C.simulate(read());$('inputError').hidden=true;$('wave').removeAttribute('hidden');$('pinBaseline').disabled=false;$('durationLabel').textContent=fmt(result.duration)+' s de senyal';plot(result);metrics(result);}
  catch(e){result=null;$('inputError').textContent=e.message;$('inputError').hidden=false;$('wave').setAttribute('hidden','');$('results').hidden=true;$('pinBaseline').disabled=true;$('durationLabel').textContent='';}
  $('plotHelp').textContent=digital?'Temps en segons; tensió en volts. Les línies verticals marquen la lectura al centre de cada bit.':'Temps en segons; tensió en volts. Compara l’amplitud i el nombre d’oscil·lacions dels dos traços.';
  compare();
 }
 const tasks={
  guided:{title:'Per què un 1 acaba llegint-se com un 0?',text:'Envia 10110010 amb amplitud 1 V, llindar 0,5 V i sense soroll. Prediu què passarà als bits 1 si el canal només conserva el 30% del senyal.',steps:'1. Prepara el repte. 2. Tria la predicció. 3. Fixa la prova A. 4. Baixa «Senyal que es conserva» al 30%. 5. Mostra les mesures i compara els bits 1 amb el llindar.'},
  standard:{title:'Recupera el missatge afeblit',text:'El canal conserva el 30% d’un senyal d’1 V. Mantén el soroll a zero. Troba un llindar que recuperi tots els bits i explica per què un llindar de 0 V tampoc és una bona solució.',steps:'1. Prepara i fixa la prova A. 2. Modifica només el llindar. 3. Compara els errors. 4. Revisa la tensió d’un bit 0 i d’un bit 1 a la taula. 5. Escriu un interval de llindars que funcioni.'},
  extension:{title:'Un llindar que funcioni més d’una vegada',text:'Amb un guany del 55%, soroll màxim de 0,25 V i interferència de 0,15 V, ajusta només el llindar per reduir els errors. Comprova la proposta amb els patrons 42, 43 i 44. Explica per què zero errors en un missatge no garanteix una transmissió sempre fiable.',steps:'1. Prepara el repte i fixa A. 2. Prova diversos llindars mantenint el patró 42. 3. Desa l’evidència amb menys errors. 4. Mantén aquest llindar i prova els patrons 43 i 44. 5. Compara el nombre d’errors i els valors propers al llindar.'}
 };
 function adapt(){
  const {level='standard',supports={}}=window.TechEduCurrent?.()||{},task=tasks[level];
  $('activityTitle').textContent=task.title;$('activityText').textContent=supports.shortText?{guided:'Baixa el senyal d’1 V al 30%. Amb llindar 0,5 V, com es llegiran els bits 1?',standard:'Amb senyal al 30%, troba un llindar que recuperi tots els bits.',extension:'Ajusta el llindar. Comprova els patrons 42, 43 i 44. Justifica si funciona sempre.'}[level]:task.text;
  $('activitySteps').replaceChildren(...task.steps.split(/\d\. /).filter(Boolean).map(text=>{const li=document.createElement('li');li.textContent=text;return li}));$('activitySteps').hidden=!$('showSteps').checked;
 }
 function preset(type){
  if(window.TechEduSession?.archive()===false)return false;
  set(C.defaults);
  if(type==='attenuated')set({gain:.3});
  if(type==='noisy')set({gain:.55,noise:.25,interference:.15});
  if(type==='analog')set({mode:'analog',gain:.75,interference:.25});
  baseline=null;$('predictionFeedback').textContent='';$('bitPrediction').value='';render();
 }
 for(const k of keys)$(k).addEventListener('input',render);
 $('reveal').onchange=render;$('showSteps').onchange=adapt;
 document.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>preset(b.dataset.preset));
 $('newNoise').onclick=()=>{$('seed').value=Number($('seed').value)%999999+1;render()};
 $('pinBaseline').onclick=()=>{if(result)baseline={...result.config};compare()};$('clearBaseline').onclick=()=>{baseline=null;compare()};
 $('loadChallenge').onclick=()=>{const {level,supports}=window.TechEduCurrent();if(preset({guided:'clean',standard:'attenuated',extension:'noisy'}[level])===false)return;$('reveal').checked=!(level==='guided'||supports.hideSolution);$('showSteps').checked=level==='guided'||supports.stepByStep;adapt();render()};
 $('checkPrediction').onclick=()=>{$('predictionFeedback').textContent=!$('bitPrediction').value?'Tria primer 0 o 1.':$('bitPrediction').value==='zero'?'Correcte: 1 V × 0,30 = 0,30 V. Com que 0,30 < 0,50 V, el receptor llegeix 0.':'Compara 0,30 V amb el llindar de 0,50 V. El senyal no arriba al llindar: es llegeix 0.'};
 window.TechEduActivity={
  capture:()=>({baseline,label:($('mode').value==='digital'?'Bits':'Ona analògica')+' · senyal '+fmt(Number($('gain').value)*100)+'% · soroll '+fmt(Number($('noise').value))+' V'}),
  restore:extra=>{baseline=null;if(extra?.baseline){try{baseline=C.config(extra.baseline)}catch{}}adapt();render()},
  activate:({restored})=>{const {level,supports}=window.TechEduCurrent();if(!restored){$('reveal').checked=!(supports.hideSolution||level==='guided');$('showSteps').checked=level==='guided'||supports.stepByStep;}adapt();render();
   if(incomingBits){const bits=incomingBits;incomingBits=null;if(window.TechEduSession?.archive()!==false){set({...C.defaults,bits});baseline=null;render();window.TechEduSession?.save('byte importat');}}
   $('workPrediction').parentElement.firstChild.textContent='Abans de provar: quin bit canviarà si la tensió rebuda queda per sota del llindar? En mode analògic, indica com canviarà l’amplitud en baixar el guany.';
   $('workConclusion').parentElement.firstChild.textContent='Després de provar: anota el guany, el llindar i els errors d’A i B. Justifica un bit amb la tensió rebuda. En mode analògic, compara les amplituds.';
  }
 };
 window.addEventListener('resize',()=>{if(result)plot(result)});
 window.addEventListener('techedu-level',adapt);adapt();render();
})();
