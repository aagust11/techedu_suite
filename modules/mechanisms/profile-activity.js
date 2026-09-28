(function(){
 const area=document.querySelector('#mechanismActivity');
 function adapt(){
  const {profile,level,supports}=window.TechEduCurrent?.()||{level:'standard',supports:{}};
  const label=profile?' · '+profile.name.replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';'):'';
  if(level==='guided'){
   area.innerHTML='<b>Repte pautat'+label+'</b><span>1. Prem Demo. 2. Identifica la motriu. 3. Compara les dents de dues rodes. 4. Prediu el sentit abans de simular. 5. Comprova les rpm.</span><label>Si una roda de 20 dents mou una de 40, la segona gira… <select id="gearPrediction"><option value="">Tria</option><option value="faster">Més ràpid</option><option value="slower">Més lent</option></select></label><button id="checkGear">Comprova la predicció</button><small id="gearFeedback" role="status"></small>';
   area.querySelector('#checkGear').onclick=()=>{area.querySelector('#gearFeedback').textContent=area.querySelector('#gearPrediction').value==='slower'?'Correcte: gira a la meitat de rpm i en sentit contrari.':'Revisa la relació n₁·z₁=n₂·z₂.'};
  }else if(level==='extension'){
   area.innerHTML='<b>Repte d’ampliació'+label+'</b><span>Construeix un tren compost amb dues etapes. Fes que la sortida giri a un quart de les rpm d’entrada. Prediu les rpm i el sentit abans de simular i justifica cada relació.</span>';
  }else area.innerHTML='<b>Exploració autònoma'+label+'</b><span>Construeix dues rodes, prediu la relació de velocitats i contrasta-la amb la simulació.</span>';
  if(supports.stepByStep&&level!=='guided')area.insertAdjacentHTML('beforeend','<ol><li>Identifica la motriu i anota les rpm.</li><li>Calcula la relació de dents de cada parell.</li><li>Multiplica les relacions.</li><li>Prediu i comprova la sortida.</li></ol>');
  if(supports.shortText)area.querySelector('span').textContent=level==='extension'?'Dissenya dues etapes: sortida = entrada / 4. Justifica-les.':'Compara dents, prediu rpm i comprova-les.';
 }
 window.addEventListener('techedu-level',adapt);adapt();
})();
