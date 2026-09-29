(function(){
 const script=document.currentScript;let domain=script.dataset.domain;
 const panel=document.createElement('div');panel.className='techedu-profile-bar';
 const style=document.createElement('style');style.textContent='.techedu-profile-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;background:#e8f1ee;color:#183d37;padding:10px 24px;font:13px system-ui,sans-serif;border-bottom:1px solid #c5ded2}.techedu-profile-bar label{display:flex;flex-direction:row;align-items:center;gap:8px;font-size:13px}.techedu-profile-bar select{min-width:150px;padding:6px}.techedu-profile-bar a{color:#285a50;font-weight:700}';
 document.head.append(style);
 document.querySelector('header')?.after(panel);
 window.TechEduCurrent=()=>{
  const data=TechEduProfiles.load(),profile=TechEduProfiles.active(data);
  return {profile,level:TechEduProfiles.effective(profile,domain),supports:profile?.supports||{shortText:false,stepByStep:false,hideSolution:false}};
 };
 window.TechEduSetDomain=next=>{domain=next;render()};
 let renderedSignature=null;
 function render(){
  const data=TechEduProfiles.load(),active=TechEduProfiles.active(data);
  const signature=JSON.stringify({domain,activeId:data.activeId,profiles:data.profiles.map(({work,attempts,...profile})=>profile)});
  if(signature===renderedSignature)return;renderedSignature=signature;
  const options=data.profiles.map(p=>{const o=document.createElement('option');o.value=p.id;o.textContent=p.name;return o});
  panel.replaceChildren();
  const label=document.createElement('label');label.textContent='Perfil actiu ';
  const select=document.createElement('select');select.setAttribute('aria-label','Perfil actiu');
  const none=document.createElement('option');none.value='';none.textContent='Sense perfil · nivell habitual';select.append(none,...options);select.value=active?.id||'';
  label.append(select);const info=document.createElement('span');info.textContent='Activitat: '+TechEduProfiles.labels[TechEduProfiles.effective(active,domain)];
  const link=document.createElement('a');link.href='../../profiles/';link.textContent='Configura perfils i proves →';
  panel.append(label,info,link);
  select.onchange=()=>{data.activeId=select.value||null;try{TechEduProfiles.save(data)}catch(e){alert('No s’ha pogut canviar el perfil: '+e.message);render()}};
  window.dispatchEvent(new CustomEvent('techedu-level',{detail:window.TechEduCurrent()}));
 }
 window.addEventListener('techedu-profile-change',render);
 window.addEventListener('storage',e=>{if(e.key===TechEduProfiles.KEY)render()});
 render();
})();
