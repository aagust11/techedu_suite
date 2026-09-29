(function(){
 const script=document.currentScript,base=new URL('../',script.src),P=TechEduProfiles;let domain=script.dataset.domain;
 const panel=document.createElement('div');panel.className='suite-header techedu-profile-bar';panel.setAttribute('role','banner');
 document.body.prepend(panel);
 document.querySelector('header')?.classList.add('module-toolbar');
 const guestCourse=()=>{try{return localStorage.getItem('techedu.course')==='batx'?'batx':'eso'}catch{return 'eso'}};
 window.TechEduCurrent=()=>{const profile=P.active();return {profile,course:profile?.course||guestCourse(),level:P.effective(profile,domain),supports:profile?.supports||{shortText:false,stepByStep:false,hideSolution:false}};};
 window.TechEduSetDomain=next=>{domain=next;render()};
 let signature=null;
 function render(){
  const data=P.load(),active=P.active(data),current=window.TechEduCurrent();
  const next=JSON.stringify({domain,guest:guestCourse(),activeId:data.activeId,profiles:data.profiles.map(({work,attempts,...p})=>p)});
  if(signature===next)return;signature=next;
  panel.replaceChildren();
  const brand=document.createElement('a');brand.className='suite-brand';brand.href=base.href;brand.innerHTML='<span class="suite-mark">T</span><span>TechEdu <b>Suite</b></span>';
  const context=document.createElement('span');context.className='suite-context';context.textContent=['communications','logic'].includes(domain)?(current.course==='batx'?'Batxillerat':'ESO · iniciació'):['suite','account'].includes(domain)?'El teu espai de tecnologia':'Tecnologia · 3r d’ESO';
  const menu=document.createElement('details');menu.className='account-menu';const summary=document.createElement('summary');summary.textContent=(active?active.name:'Visitant')+' · El meu compte';
  const body=document.createElement('div');body.className='account-dropdown';
  const label=document.createElement('label');label.textContent='Compte actiu';const select=document.createElement('select');select.setAttribute('aria-label','Compte actiu');
  for(const p of [{id:'',name:'Visitant · sense desament de quadern'},...data.profiles]){const o=document.createElement('option');o.value=p.id;o.textContent=p.name;select.append(o)}select.value=active?.id||'';label.append(select);
  const link=document.createElement('a');link.href=new URL('account/',base).href;link.textContent=active?'Configuració, proves i treball →':'Crea un compte local →';
  const note=document.createElement('p');note.textContent='Només en aquest navegador. Sense sincronització.';
  body.append(label,link,note);
  if(!active){const label=document.createElement('label');label.textContent='Itinerari de comunicacions i lògica';const course=document.createElement('select');course.setAttribute('aria-label','Itinerari de visitant');course.innerHTML='<option value="eso">ESO</option><option value="batx">Batxillerat</option>';course.value=current.course;label.append(course);body.append(label);course.onchange=()=>{try{localStorage.setItem('techedu.course',course.value);render()}catch(e){alert('No s’ha pogut desar l’itinerari: '+e.message)}};}
  menu.append(summary,body);panel.append(brand,context,menu);
  select.onchange=()=>{if(window.TechEduBeforeAccountChange?.()===false){select.value=active?.id||'';return;}const latest=P.load();latest.activeId=select.value||null;try{P.save(latest);if(domain==='account')location.reload()}catch(e){alert('No s’ha pogut canviar de compte: '+e.message);signature=null;render()}};
  document.documentElement.dataset.course=current.course;
  window.dispatchEvent(new CustomEvent('techedu-level',{detail:current}));
 }
 window.addEventListener('techedu-profile-change',render);
 window.addEventListener('storage',e=>{if(e.key===P.KEY||e.key==='techedu.course'||e.key===null)render()});
 render();
})();
