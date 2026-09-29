const mats=[['Acer',7850,200,'Conductor'],['Alumini',2700,69,'Conductor'],['Fusta',600,11,'Aïllant en sec'],['Coure',8960,117,'Conductor'],['Vidre',2500,70,'Aïllant'],['PMMA',1180,3.2,'Aïllant']];
const $=s=>document.querySelector(s);
function draw(){document.querySelector('#mat').innerHTML='<thead><tr><th>Material</th><th>Densitat kg/m³</th><th>Comportament elèctric</th></tr></thead><tbody>'+mats.map(m=>'<tr>'+m.filter((_,i)=>i!==2).map((x,i)=>`<td>${i===0?'<b>'+x+'</b>':x}</td>`).join('')+'</tr>').join('')+'</tbody>'}
const advice={bike:'Per a un quadre cal equilibrar <b>baixa densitat, rigidesa i resistència</b>. Compara especialment alumini i acer i justifica quin criteri prioritzes.',cable:'En un conductor el criteri principal és la <b>conductivitat elèctrica</b>, però també importen cost, ductilitat i massa.',window:'Cal <b>transparència</b>, estabilitat i resistència ambiental. Vidre i PMMA resolen el problema de maneres diferents.',beam:'En una biga són especialment importants la <b>rigidesa, resistència i massa</b>. La geometria de la secció també és determinant.'};
const shortAdvice={bike:'Compara massa i rigidesa d’acer i alumini.',cable:'Identifica els conductors i justifica els altres requisits del cable.',window:'Compara transparència, massa i fragilitat de vidre i PMMA.',beam:'Compara rigidesa, massa i forma de la secció.'};
function recommend(){const {supports}=window.TechEduCurrent?.()||{supports:{}};$('#recommendation').innerHTML=(supports.shortText?shortAdvice:advice)[$('#use').value]}
function adapt(){
 const {profile,level,supports}=window.TechEduCurrent?.()||{level:'standard',supports:{}};
 const area=$('#materialActivity'),name=profile?' · '+profile.name.replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';'):'';
 if(level==='guided'){
  area.innerHTML='<b>Selecció pautada'+name+'</b><p>1. Tria una aplicació. 2. Identifica la propietat imprescindible. 3. Compara només dos materials. 4. Justifica quin triaries.</p><label>Per a un cable, quina propietat necessites primer? <select id="propertyChoice"><option value="">Tria</option><option value="density">Densitat</option><option value="conductivity">Conductivitat</option><option value="transparent">Transparència</option></select></label><button id="checkProperty">Comprova</button><span id="propertyFeedback" role="status"></span>';
  $('#checkProperty').onclick=()=>{$('#propertyFeedback').textContent=$('#propertyChoice').value==='conductivity'?'Correcte. Ara identifica els conductors de la taula i justifica quines altres dades necessites per triar-ne un.':'Revisa què ha de circular per un cable.'};
 }else if(level==='extension'){
  area.innerHTML='<b>Repte d’ampliació'+name+'</b><p>Per a dues peces del mateix volum, compara les densitats de l’acer i l’alumini. Calcula quantes vegades és més dens l’acer (7850/2700). Després explica per què la peça més lleugera no sempre és la més adequada.</p><label>Quin pesa menys si el volum és el mateix? <select id="specificChoice"><option value="">Tria</option><option value="steel">Acer</option><option value="aluminium">Alumini</option></select></label><button id="checkSpecific">Comprova</button><span id="specificFeedback" role="status"></span>';
  $('#checkSpecific').onclick=()=>{$('#specificFeedback').textContent=$('#specificChoice').value==='aluminium'?'Sí. A igual volum, l’alumini té menys massa. L’acer té aproximadament 2,91 vegades la seva densitat. També cal valorar la forma, la resistència, les unions i el cost.':'Compara 7850 i 2700 kg/m³. A igual volum, menys densitat vol dir menys massa.'};
 }else area.innerHTML='<b>Selecció autònoma'+name+'</b><p>Per a una finestra, compara vidre i PMMA: tots dos poden ser transparents, però tenen densitats diferents. Quin pesa menys a igual volum? Quina informació sobre cops i ratllades et falta per decidir?</p>';
 if(supports.stepByStep&&level!=='guided')area.insertAdjacentHTML('beforeend','<p>Passos: requisits → propietats → dos candidats → compromís → decisió.</p>');
 recommend();
}
$('#recommend').onclick=recommend;$('#use').onchange=recommend;
window.addEventListener('techedu-level',adapt);
draw();adapt();

window.TechEduActivity={restore:()=>recommend()};
