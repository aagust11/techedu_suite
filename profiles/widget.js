(function(){
 const script=document.currentScript,base=new URL('../',script.src),P=TechEduProfiles;let domain=script.dataset.domain;
 const panel=document.createElement('div');panel.className='suite-header techedu-profile-bar';panel.setAttribute('role','banner');
 document.body.prepend(panel);
 document.querySelector('header')?.classList.add('module-toolbar');
 const navigation=document.createElement('nav');navigation.className='suite-nav';navigation.setAttribute('aria-label','Mòduls de TechEdu Suite');
 const destinations=[['Inici',''],['Tecnofigures','modules/drawings/'],['Mecanismes','modules/mechanisms/'],['Problemes','modules/problems/'],['Materials','modules/materials/'],['Lògica','modules/logic/'],['Comunicacions','modules/communications/']];
 for(const [name,path] of destinations){const a=document.createElement('a');a.href=new URL(path||'index.html',base).href;a.textContent=name;const here=location.pathname,target=new URL(a.href).pathname;if(path?here.startsWith(new URL(path,base).pathname):here===target||here===base.pathname)a.setAttribute('aria-current','page');navigation.append(a);}
 panel.after(navigation);

 const guestCourse=()=>{try{return localStorage.getItem('techedu.course')==='batx'?'batx':'eso'}catch{return 'eso'}};
 window.TechEduCurrent=()=>{const profile=P.active();return {profile,course:profile?.course||guestCourse(),level:P.effective(profile,domain),supports:profile?.supports||{shortText:false,stepByStep:false,hideSolution:false}};};
 window.TechEduSetDomain=next=>{domain=next;render()};
 let signature=null,notice='';
 function render(){
  const data=P.load(),active=P.active(data),current=window.TechEduCurrent();
  const next=JSON.stringify({domain,guest:guestCourse(),activeId:data.activeId,profiles:data.profiles.map(({work,attempts,...p})=>p)});
  if(signature===next)return;signature=next;
  const wasOpen=panel.querySelector('.account-menu')?.open,focused=panel.contains(document.activeElement)?document.activeElement.id:null;
  panel.replaceChildren();
  const brand=document.createElement('a');brand.className='suite-brand';brand.href=base.href;brand.innerHTML='<span class="suite-mark">T</span><span>TechEdu <b>Suite</b></span>';
  const context=document.createElement('span');context.className='suite-context';context.textContent=['communications','logic'].includes(domain)?(current.course==='batx'?'Batxillerat':'ESO · iniciació'):['suite','account'].includes(domain)?'El teu espai de tecnologia':'Tecnologia · 3r d’ESO';
  const menu=document.createElement('details');menu.className='account-menu';menu.open=!!wasOpen;const summary=document.createElement('summary');summary.textContent=(active?active.name:'Visitant')+' · El meu compte';
  const body=document.createElement('div');body.className='account-dropdown';
  const label=document.createElement('label');label.textContent='Compte actiu';const select=document.createElement('select');select.setAttribute('aria-label','Compte actiu');
  for(const p of [{id:'',name:'Visitant · sense desament de quadern'},...data.profiles]){const o=document.createElement('option');o.value=p.id;o.textContent=p.name;select.append(o)}select.value=active?.id||'';label.append(select);
  const link=document.createElement('a');link.href=new URL('account/',base).href;link.textContent=active?'Configuració, proves i treball →':'Crea un compte local →';
  const note=document.createElement('p');note.textContent='Només en aquest navegador. Sense sincronització.';
  body.append(label);
  if(active){
   const courseLabel=document.createElement('label');courseLabel.textContent='Itinerari de comunicacions i lògica';
   const course=document.createElement('select');course.id='quickCourse';course.setAttribute('aria-label','Itinerari del compte');course.innerHTML='<option value="eso">ESO · iniciació</option><option value="batx">Batxillerat · aprofundiment</option>';course.value=current.course;courseLabel.append(course);
   const scoped=P.DOMAINS.includes(domain),names={logic:'lògica',mechanisms:'mecanismes',electricity:'electricitat',materials:'materials',communications:'TIC i comunicacions'};
   const levelLabel=document.createElement('label');levelLabel.textContent=scoped?'Nivell en '+names[domain]:'Nivell general';
   const level=document.createElement('select');level.id='quickLevel';level.setAttribute('aria-label','Nivell ràpid');
   if(scoped){const option=document.createElement('option');option.value='';option.textContent='General · '+P.labels[active.level];level.append(option);}
   for(const value of P.LEVELS){const option=document.createElement('option');option.value=value;option.textContent=P.labels[value];level.append(option);}
   level.value=scoped?(active.domains[domain]||''):active.level;levelLabel.append(level);
   const scope=document.createElement('p');scope.textContent=scoped?'Aquest grau de pauta només s’aplica a aquest àmbit.':'El nivell general s’aplica als àmbits sense un ajust propi.';
   const status=document.createElement('p');status.id='quickAccountStatus';status.setAttribute('aria-live','polite');status.textContent=notice;
   body.append(courseLabel,levelLabel,scope,status);
   function update(change,message){
    try{
     if(window.TechEduBeforeAccountChange?.()===false)throw Error('Exporta primer els canvis pendents del dibuix.');
     if(window.TechEduSession&&window.TechEduSession.save()===false)throw Error('No s’ha pogut desar el treball pendent. Revisa el quadern abans de canviar el nivell.');
     const latest=P.load();if(latest.activeId!==active.id||latest.metaRevision!==data.metaRevision)throw Error('El compte ha canviat en una altra pestanya. Torna a triar el nivell.');
     const snapshot=window.TechEduCapture?.();
     change(P.active(latest));notice=message+' Desat en aquest navegador.';P.save(latest);
     if(snapshot){for(const key of ['difficulty','count','guided'])delete snapshot.fields[key];window.TechEduRestoreFields?.(snapshot);}
     window.TechEduRefreshAccount?.();
    }catch(e){notice='No s’ha desat el canvi: '+e.message;signature=null;render();}
   }
   course.onchange=()=>{const value=course.value;update(p=>p.course=value,'Itinerari actualitzat.');};
   level.onchange=()=>{const value=level.value,scopeDomain=domain;update(p=>{if(scoped)p.domains[scopeDomain]=value||null;else p.level=value;},'Nivell actualitzat.');};
  }
  body.append(link,note);
  if(!active){const label=document.createElement('label');label.textContent='Itinerari de comunicacions i lògica';const course=document.createElement('select');course.setAttribute('aria-label','Itinerari de visitant');course.innerHTML='<option value="eso">ESO</option><option value="batx">Batxillerat</option>';course.value=current.course;label.append(course);body.append(label);course.onchange=()=>{try{localStorage.setItem('techedu.course',course.value);render()}catch(e){alert('No s’ha pogut desar l’itinerari: '+e.message)}};}
  menu.append(summary,body);panel.append(brand,context,menu);
  select.onchange=()=>{notice='';if(window.TechEduBeforeAccountChange?.()===false){select.value=active?.id||'';return;}const latest=P.load();latest.activeId=select.value||null;try{P.save(latest);if(domain==='account')location.reload()}catch(e){alert('No s’ha pogut canviar de compte: '+e.message);signature=null;render()}};
  if(focused)document.getElementById(focused)?.focus();
  document.documentElement.dataset.course=current.course;
  window.dispatchEvent(new CustomEvent('techedu-level',{detail:current}));
 }
 window.addEventListener('techedu-profile-change',render);
 window.addEventListener('storage',e=>{if(e.key===P.KEY||e.key==='techedu.course'||e.key===null)render()});
 render();
})();
