const mats=[['Acer',7850,200,15,6,2],['Alumini',2700,69,37,5,4],['Fusta',600,11,.0001,3,5],['Coure',8960,117,58,6,3],['Vidre',2500,70,.00001,2,4],['PMMA',1180,3.2,.0002,2,4]];
const $=s=>document.querySelector(s);
function draw(){document.querySelector('#mat').innerHTML='<thead><tr><th>Material</th><th>Densitat kg/m³</th><th>Rigidesa GPa</th><th>Conductivitat</th><th>Resistència*</th><th>Reciclabilitat*</th></tr></thead><tbody>'+mats.map(m=>'<tr>'+m.map((x,i)=>`<td>${i===0?'<b>'+x+'</b>':x}</td>`).join('')+'</tr>').join('')+'</tbody>'}
const advice={bike:'Per a un quadre cal equilibrar <b>baixa densitat, rigidesa i resistència</b>. Compara especialment alumini i acer i justifica quin criteri prioritzes.',cable:'En un conductor el criteri principal és la <b>conductivitat elèctrica</b>, però també importen cost, ductilitat i massa.',window:'Cal <b>transparència</b>, estabilitat i resistència ambiental. Vidre i PMMA resolen el problema de maneres diferents.',beam:'En una biga són especialment importants la <b>rigidesa, resistència i massa</b>. La geometria de la secció també és determinant.'};
const shortAdvice={bike:'Compara massa i rigidesa d’acer i alumini.',cable:'Compara la conductivitat de coure i alumini.',window:'Compara transparència, massa i fragilitat de vidre i PMMA.',beam:'Compara rigidesa, massa i forma de la secció.'};
function recommend(){const {supports}=window.TechEduCurrent?.()||{supports:{}};$('#recommendation').innerHTML=(supports.shortText?shortAdvice:advice)[$('#use').value]}
function adapt(){
 const {profile,level,supports}=window.TechEduCurrent?.()||{level:'standard',supports:{}};
 const area=$('#materialActivity'),name=profile?' · '+profile.name:'';
 if(level==='guided'){
  area.innerHTML='<b>Selecció pautada'+name+'</b><p>1. Tria una aplicació. 2. Identifica la propietat imprescindible. 3. Compara només dos materials. 4. Justifica quin triaries.</p><label>Per a un cable, quina propietat necessites primer? <select id="propertyChoice"><option value="">Tria</option><option value="density">Densitat</option><option value="conductivity">Conductivitat</option><option value="transparent">Transparència</option></select></label><button id="checkProperty">Comprova</button><span id="propertyFeedback" role="status"></span>';
  $('#checkProperty').onclick=()=>{$('#propertyFeedback').textContent=$('#propertyChoice').value==='conductivity'?'Correcte. Ara compara coure i alumini a la taula.':'Revisa què ha de circular per un cable.'};
 }else if(level==='extension'){
  area.innerHTML='<b>Repte d’ampliació'+name+'</b><p>Compara la rigidesa específica E/ρ de l’acer i l’alumini amb les dades de la taula. Quin és més alt? Justifica per què aquest quocient no és suficient per triar un quadre de bicicleta.</p><label>Quin material té E/ρ més alt? <select id="specificChoice"><option value="">Tria</option><option value="steel">Acer</option><option value="aluminium">Alumini</option></select></label><button id="checkSpecific">Comprova</button><span id="specificFeedback" role="status"></span>';
  $('#checkSpecific').onclick=()=>{$('#specificFeedback').textContent=$('#specificChoice').value==='aluminium'?'Sí: 69/2700 és lleugerament superior a 200/7850. La geometria, les unions, la fatiga i el cost també importen.':'Calcula 200/7850 i 69/2700 abans de decidir.'};
 }else area.innerHTML='<b>Selecció autònoma'+name+'</b><p>Tria una aplicació, identifica dos requisits que entren en tensió i defensa una elecció amb dades de la taula.</p>';
 if(supports.stepByStep&&level!=='guided')area.insertAdjacentHTML('beforeend','<p>Passos: requisits → propietats → dos candidats → compromís → decisió.</p>');
 recommend();
}
$('#recommend').onclick=recommend;$('#use').onchange=recommend;
window.addEventListener('techedu-level',adapt);
draw();adapt();
