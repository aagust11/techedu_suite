(function(){
 const $=id=>document.getElementById(id),D=DigitalCore,keys=['frequency','amplitude','phase','sampleRate','depth'];
 let result=null,baseline=null;
 const fmt=(n,d=3)=>Number(n).toLocaleString('ca',{maximumFractionDigits:d});
 const read=()=>Object.fromEntries(keys.map(k=>[k,$(k).value]));
 const set=c=>{for(const [k,v] of Object.entries(c))if(keys.includes(k))$(k).value=v;};
 const presets={sampling:{frequency:2,amplitude:.8,phase:0,sampleRate:4,depth:3},quantization:{frequency:3,amplitude:.8,phase:0,sampleRate:16,depth:2},aliasing:{frequency:7,amplitude:.8,phase:0,sampleRate:8,depth:4}};
 const tasks={guided:{title:'Més bits no substitueixen les mostres que falten',text:'Compara 4 i 16 mostres/s d’una ona de 2 Hz amb fase zero. Mantén 3 bits per mostra. Observa els punts blaus: quina part de l’ona està quedant sense registrar?',steps:['Prepara el repte i fixa A.','Prediu si augmentar els bits resoldria el problema.','Canvia només les mostres/s de 4 a 16.','Compara els punts blaus amb les crestes de l’ona.']},standard:{title:'Més precisió, més dades',text:'Mantén una ona de 3 Hz i 16 mostres/s. Compara 2 i 6 bits per mostra. Quant augmenten els nivells disponibles i la mida de les dades? Quant es redueix l’error de quantificació?',steps:['Prepara el repte i fixa A.','Anota la mida i l’error màxim.','Canvia només de 2 a 6 bits per mostra.','Compara mida i error i justifica el compromís.']},extension:{title:'Digitalitza 7 Hz amb un pressupost de 256 bits',text:'Parteix de 8 mostres/s: l’ona de 7 Hz sembla una altra. Troba dues configuracions amb mostreig suficient que no superin 256 bits en 2 segons. Compara precisió i densitat de mostres.',steps:['Prepara el repte i activa l’ona compatible.','Augmenta les mostres/s per superar el doble de 7 Hz.','Ajusta els bits perquè 2 × mostres/s × bits ≤ 256.','Desa dues configuracions vàlides i defensa quan triaries cadascuna.']}};
 function adapt(){const {level='standard',supports={}}=window.TechEduCurrent?.()||{},t=tasks[level];$('activityTitle').textContent=t.title;$('activityText').textContent=supports.shortText?t.steps.slice(0,2).join(' '):t.text;$('activitySteps').replaceChildren(...t.steps.map(text=>{const li=document.createElement('li');li.textContent=text;return li}));$('activitySteps').hidden=!$('showSteps').checked;}
 function plot(){if(!result)return;const w=Math.max(300,Math.min(1000,$('samplingWave').clientWidth||850)),right=w-24,x=t=>56+t/2*(right-56),y=v=>170-v*130;
  $('samplingWave').setAttribute('viewBox',`0 0 ${w} 345`);
  const parts=['<title id="samplingTitle">Mostreig i quantificació de dos segons de senyal</title><desc id="samplingDesc">Ona original taronja discontínua, mostres ideals blaves i valor quantificat verd mantingut fins a la mostra següent.</desc>'];
  for(const v of [-1,-.5,0,.5,1])parts.push(`<line x1="56" x2="${right}" y1="${y(v)}" y2="${y(v)}" stroke="#dde4df"/><text x="46" y="${y(v)+4}" text-anchor="end" font-size="12">${fmt(v)}</text>`);
  for(const t of [0,.5,1,1.5,2])parts.push(`<text x="${x(t)}" y="325" text-anchor="middle" font-size="12">${fmt(t)}</text>`);
  const path=key=>result.curve.map((p,i)=>(i?'L':'M')+x(p.t).toFixed(2)+','+y(p[key]).toFixed(2)).join(' ');
  parts.push(`<text x="20" y="20" font-size="12">V</text><text x="${w-90}" y="342" font-size="12">Temps (s)</text><path d="${path('original')}" fill="none" stroke="#b74715" stroke-width="2" stroke-dasharray="6 4"/>`);
  // Exact sample-and-hold path, with a vertical jump at each sample instant.
  let held='M'+x(0)+','+y(result.samples[0].value);for(const s of result.samples.slice(1))held+='H'+x(s.t)+'V'+y(s.value);held+='H'+right;
  parts.push(`<path d="${held}" fill="none" stroke="#426a33" stroke-width="1.6"/>`);
  if($('showAlias').checked&&result.undersampled)parts.push(`<path d="${path('alias')}" fill="none" stroke="#85489d" stroke-width="2" stroke-dasharray="2 5"/>`);
  for(const s of result.samples)parts.push(`<circle cx="${x(s.t)}" cy="${y(s.original)}" r="3" fill="#245f83"/>`);
  $('samplingWave').innerHTML=parts.join('');
 }
 function compare(){
  $('clearBaseline').disabled=!baseline;
  if(!baseline||!result){$('comparisonSummary').textContent=baseline?'Corregeix la configuració per comparar.':'Encara no has fixat la prova A.';$('comparisonResult').textContent='';return;}
  const a=D.sample(baseline),changed=keys.filter(k=>a.config[k]!==result.config[k]),labels={frequency:'freqüència',amplitude:'amplitud',phase:'fase',sampleRate:'mostres/s',depth:'bits/mostra'};
  $('comparisonSummary').textContent=changed.length?'Canvis: '+changed.map(k=>labels[k]+' '+fmt(a.config[k])+' → '+fmt(result.config[k])).join('; ')+(changed.length>1?'. Has canviat diverses variables.':'.'): 'A i B tenen la mateixa configuració.';
  $('comparisonResult').textContent=$('reveal').checked?`A: ${a.payloadBits} bits; error màxim ${fmt(a.maxError)} V; ${a.undersampled?'mostreig insuficient o al límit':'mostreig suficient per a aquesta sinusoide'}. B: ${result.payloadBits} bits; error màxim ${fmt(result.maxError)} V; ${result.undersampled?'mostreig insuficient o al límit':'mostreig suficient per a aquesta sinusoide'}.`:'Mostra les mesures per comparar els resultats.';
 }
 function render(){
  const units={frequency:' Hz',amplitude:' V',phase:'°',sampleRate:' mostres/s',depth:' bits/mostra'};for(const k of keys)$(k+'Value').textContent=fmt($(k).value)+units[k];
  try{result=D.sample(read());$('sampleError').hidden=true;$('samplingWave').removeAttribute('hidden');$('pinBaseline').disabled=false;}catch(e){result=null;$('sampleError').textContent=e.message;$('sampleError').hidden=false;$('samplingWave').setAttribute('hidden','');$('pinBaseline').disabled=true;}
  $('samplingResults').hidden=!$('reveal').checked||!result;
  if(result){plot();$('samplingWarning').textContent=result.undersampled?`Mostreig insuficient o al límit: ${result.config.sampleRate} mostres/s ≤ 2 × ${fmt(result.config.frequency)} Hz. La freqüència plegada és ${fmt(Math.abs(result.alias))} Hz; al límit, cal considerar també la fase.`:`${result.config.sampleRate} mostres/s > 2 × ${fmt(result.config.frequency)} Hz. Aquesta condició permet distingir la freqüència; no elimina l’error de quantificació ni els esglaons de la sortida mantinguda.`;
   const metrics=[[result.samples.length,'mostres en 2 s'],[2**result.config.depth,'nivells disponibles'],[result.payloadBits+' bits','mida de les dades'],[fmt(result.maxError)+' V','error màxim de quantificació']];$('samplingMetrics').innerHTML=metrics.map(([v,label])=>`<div class="metric"><b>${v}</b><span>${label}</span></div>`).join('');$('sampleRows').innerHTML=result.samples.map((s,i)=>`<tr><td>${i+1}</td><td>${fmt(s.t)}</td><td>${fmt(s.original)}</td><td>${fmt(s.value)}</td><td><code>${s.binary}</code></td></tr>`).join('');}
  compare();
 }
 function preset(name){if(window.TechEduSession?.archive()===false)return false;set(presets[name]);baseline=null;$('samplingPrediction').value='';$('predictionFeedback').textContent='';render();}
 for(const key of keys)$(key).oninput=render;$('reveal').onchange=render;$('showAlias').onchange=plot;$('showSteps').onchange=adapt;
 document.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>preset(b.dataset.preset));
 $('loadChallenge').onclick=()=>{const {level,supports}=window.TechEduCurrent();if(preset({guided:'sampling',standard:'quantization',extension:'aliasing'}[level])===false)return;$('showAlias').checked=level==='extension';$('showSteps').checked=level==='guided'||supports.stepByStep;$('reveal').checked=!(level==='guided'||supports.hideSolution);adapt();render();};
 $('checkPrediction').onclick=()=>{$('predictionFeedback').textContent=!$('samplingPrediction').value?'Tria una resposta abans de comprovar.':$('samplingPrediction').value==='no'?'Correcte. Més bits afinen els valors capturats, però no afegeixen instants de mesura. Amb fase zero, 4 mostres/s d’una ona de 2 Hz cauen als passos per zero.':'Compara els instants dels punts blaus. Augmentar bits no els mou: cal augmentar les mostres/s.';};
 $('pinBaseline').onclick=()=>{if(result)baseline={...result.config};compare()};$('clearBaseline').onclick=()=>{baseline=null;compare()};
 window.TechEduActivity={capture:()=>({baseline,label:$('sampleRate').value+' mostres/s · '+$('depth').value+' bits/mostra'}),restore:extra=>{baseline=null;if(extra?.baseline){try{baseline=D.sample(extra.baseline).config}catch{}}adapt();render();},activate:({restored})=>{const {level,supports}=window.TechEduCurrent();if(!restored){$('showSteps').checked=level==='guided'||supports.stepByStep;$('reveal').checked=!(level==='guided'||supports.hideSolution);}adapt();render();$('workPrediction').parentElement.firstChild.textContent='Predicció: si canvies només les mostres/s, es mouran els instants de mesura? Si canvies només els bits, hi haurà més nivells? Indica quin canvi provaràs.';$('workConclusion').parentElement.firstChild.textContent='Evidència: anota mostres/s, bits/mostra, mida i error d’A i B. Explica quin problema has resolt i quin es manté.';}};
 window.addEventListener('resize',plot);window.addEventListener('techedu-level',adapt);adapt();render();
})();
