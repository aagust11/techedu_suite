// Move existing controls, preserving listeners and property names.
const states=new Map();
export function sectionInspector(root,o){
 for(const wrap of [...root.querySelectorAll('fieldset,.row')]){wrap.querySelector('legend')?.remove();wrap.replaceWith(...wrap.childNodes)}
 const groups=new Map(),kind=o.kind;
 const category=node=>{const k=node.querySelector?.('[data-property]')?.dataset.property||'';
 if(node.id==='duplicateObj'||node.id==='deleteObj')return 'Accions';
 if(['label','color','size','exerciseLabel'].includes(k)||node.id==='resetLabels'||node.textContent.includes('Arrossega qualsevol'))return 'Etiquetes i aspecte';
 if(['x','y','x2','y2'].includes(k))return 'Posició';
 if(k.startsWith('rope')||node.querySelector?.('[data-connection]')||k==='thickness'||node.id==='connectionStatus')return 'Cordes i connexions';
 if(k.startsWith('mass')||k.startsWith('showMass'))return 'Càrregues';
 if(['rampWeight','rampNormal','rampForce','rampFriction','pulleyWeight','pulleyTension','showForces','powerForce','resistanceForce','powerDirection','resistanceDirection'].includes(k))return 'Forces';
 if(['rampObject','objectLabel','objectSize','objectPosition','showLoad'].includes(k))return 'Objecte';
 if(kind==='ramp'&&k)return 'Pla inclinat';
 if(k==='radius')return 'Roda';
 if(!k)return 'Ajuda';return 'Configuració';};
 for(const node of [...root.children]){const key=category(node);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(node)}root.replaceChildren();
 const order=['Pla inclinat','Configuració','Roda','Objecte','Cordes i connexions','Càrregues','Forces','Etiquetes i aspecte','Posició','Ajuda','Accions'];
 const actions=document.createElement('div');actions.className='inspector-actions';for(const [name,open] of [['Desplega tot',true],['Plega tot',false]]){const b=document.createElement('button');b.type='button';b.textContent=name;b.onclick=()=>root.querySelectorAll('.config-section').forEach(d=>{d.open=open;states.set(kind+':'+d.dataset.section,open)});actions.append(b)}root.append(actions);
 for(const name of order){const nodes=groups.get(name);if(!nodes?.length)continue;if(name==='Accions'){const div=document.createElement('div');div.className='inspector-actions';div.append(...nodes);root.append(div);continue}
 const d=document.createElement('details'),summary=document.createElement('summary'),body=document.createElement('div');d.className='config-section';d.dataset.section=name;const key=kind+':'+name;d.open=states.has(key)?states.get(key):['Pla inclinat','Configuració','Roda'].includes(name);const heading=document.createElement('strong');heading.textContent=name;summary.append(heading);const hint=document.createElement('small');hint.textContent=nodes.flatMap(n=>[...n.querySelectorAll('input,select')]).filter(e=>e.type!=='checkbox'&&e.type!=='color').slice(0,2).map(e=>e.tagName==='SELECT'?e.selectedOptions[0]?.textContent:e.value).filter(Boolean).join(' · ')||`${nodes.filter(n=>n.tagName==='LABEL').length} opcions`;summary.append(hint);body.className='config-body';body.append(...nodes);d.append(summary,body);d.addEventListener('toggle',()=>{if(d.isConnected)states.set(key,d.open)});root.append(d);
 }
}
