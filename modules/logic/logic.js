const $ = s => document.querySelector(s);
const {parse, evaluate, variables, assignment, gray, simplify} = LogicCore;
const esc = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const format = s => esc(s.replaceAll('!','¬').replaceAll('&',' · ').replaceAll('|',' + '));
const bits = (v,n) => v.toString(2).padStart(n,'0');
function mapHTML(rows, names, key, title, minterms, hidden) {
  const n=names.length, rn=n===4?2:1, cn=n-rn, rv=names.slice(0,rn),cv=names.slice(rn),rg=gray(rn),cg=gray(cn);
  const result=simplify(names,minterms);
  let html='<article class="kmap-card"><div class="map-header"><b>'+title+'</b><span>'+rv.join('')+' / '+cv.join('')+'</span></div>';
  html+='<table class="kmap"><thead><tr><th>'+rv.join('')+'/'+cv.join('')+'</th>'+cg.map(g=>'<th>'+bits(g,cn)+'</th>').join('')+'</tr></thead><tbody>';
  for(const r of rg) {
    html+='<tr><th>'+bits(r,rn)+'</th>';
    for(const c of cg) {
      const i=parseInt(bits(r,rn)+bits(c,cn),2), value=rows[i][key];
      const groups=result.groups.map((g,j)=>g.cells.includes(i)?j+1:null).filter(Boolean);
      html+='<td class="'+(!hidden&&value?'one':'')+'" data-cell="'+i+'" title="m'+i+'">';
      html+='<small>m'+i+'</small><b>'+(hidden?'?':value)+'</b>';
      if(!hidden && groups.length) html+='<span class="group-badges">'+groups.map(j=>'<i>'+j+'</i>').join('')+'</span>';
      html+='</td>';
    }
    html+='</tr>';
  }
  html+='</tbody></table>';
  if(hidden) return html+'<p class="map-note">Resultats i agrupacions ocults. Desactiva el mode docent per comprovar-los.</p></article>';
  html+='<div class="map-explanation"><strong>Expressió mínima: '+format(result.expression)+'</strong>';
  if(result.groups.length) html+='<ol>'+result.groups.map((g,j)=>'<li><button type="button" class="group-step" data-cells="'+g.cells.join(',')+'"><span class="group-number">'+(j+1)+'</span> m'+g.cells.join(', m')+' → <b>'+format(g.term)+'</b> <small>('+g.cells.length+' cel·l'+(g.cells.length===1?'a':'es')+')</small></button></li>').join('')+'</ol>';
  html+='<p>Els grups poden unir vores oposades del mapa. Les variables que canvien dins d’un grup desapareixen; es conserva cada variable constant.</p></div></article>';
  return html;
}
function analyze() {
  const e1=$('#expr1').value.trim().toUpperCase(),e2=$('#expr2').value.trim().toUpperCase(),hidden=$('#hideOutputs').checked;
  $('#expr1').value=e1;$('#expr2').value=e2;
  try {
    const tree1=parse(e1),tree2=e2?parse(e2):null,names=variables(e1,e2);
    if(!names.length) throw Error('Cal utilitzar almenys una variable A–E.');
    const rows=[],m1=[],m2=[],diff=[];
    for(let i=0;i<2**names.length;i++) {
      const v=assignment(i,names),y1=evaluate(tree1,v),y2=tree2?evaluate(tree2,v):null;
      rows.push({i,v,y1,y2});
      if(y1)m1.push(i);if(y2===1)m2.push(i);
      if(tree2 && y1!==y2)diff.push({i,v,y1,y2});
    }
    const equivalent=tree2&&diff.length===0;
    $('#verdict').className='verdict '+(hidden?'single-result':tree2?(equivalent?'ok':'bad'):'single-result');
    $('#verdict').innerHTML=hidden?'<b>Mode docent actiu</b><span>Fes la predicció i mostra els resultats per comprovar-la.</span>':tree2?(equivalent?'<b>Expressions equivalents</b><span>Coincideixen en totes les combinacions.</span>':'<b>No són equivalents</b><span>'+diff.length+' combinacions donen resultats diferents.</span>'):'<b>Funció analitzada</b><span>Escriu Y₂ per comparar-la.</span>';
    $('#metrics').innerHTML='<article><b>'+names.length+'</b><span>variables</span></article><article><b>'+(2**names.length)+'</b><span>combinacions</span></article><article><b>'+(hidden?'?':m1.length)+'</b><span>uns a Y₁</span></article><article><b>'+(tree2?(hidden?'?':m2.length):'—')+'</b><span>uns a Y₂</span></article><article><b>'+(tree2?(hidden?'?':diff.length):'—')+'</b><span>discrepàncies</span></article>';
    $('#analysis').innerHTML='<b>Y₁ =</b> '+format(e1)+(tree2?' &nbsp; · &nbsp; <b>Y₂ =</b> '+format(e2):'')+'<br><small>Variables detectades: '+names.join(', ')+'.</small>';
    const head=names.map(v=>'<th>'+v+'</th>').join('')+'<th>Y₁</th>'+(tree2?'<th>Y₂</th><th>=?</th>':'');
    const body=rows.map(r=>'<tr class="'+(!hidden&&tree2&&r.y1!==r.y2?'different':'')+'">'+names.map(v=>'<td>'+r.v[v]+'</td>').join('')+'<td class="y">'+(hidden?'?':r.y1)+'</td>'+(tree2?'<td class="y y2">'+(hidden?'?':r.y2)+'</td><td>'+(hidden?'?':r.y1===r.y2?'✓':'≠')+'</td>':'')+'</tr>').join('');
    $('#truth').innerHTML='<thead><tr>'+head+'</tr></thead><tbody>'+body+'</tbody>';
    const visible=names.length>=2&&names.length<=4;
    $('#karnaughSection').hidden=!visible;
    $('#kmaps').innerHTML=visible?mapHTML(rows,names,'y1','Y₁',m1,hidden)+(tree2?mapHTML(rows,names,'y2','Y₂',m2,hidden):''):'';
    $('#minterms1').textContent=hidden?'Ocults en mode docent':m1.length?'Σm('+m1.join(', ')+')':'Cap minterm';
    $('#minterms2').textContent=!tree2?'—':hidden?'Ocults en mode docent':m2.length?'Σm('+m2.join(', ')+')':'Cap minterm';
    $('#counterexamples').textContent=!tree2?'Afegeix Y₂ per comparar.':hidden?'Ocults en mode docent':diff.length?diff.slice(0,8).map(d=>'m'+d.i+': '+names.map(v=>v+'='+d.v[v]).join(', ')+' → Y₁='+d.y1+', Y₂='+d.y2).join('\n'):'No n’hi ha: les expressions són equivalents.';
  } catch(err) {
    $('#verdict').className='verdict bad';$('#verdict').textContent='No es pot analitzar: '+err.message;
    $('#truth').innerHTML='';$('#metrics').innerHTML='';$('#kmaps').innerHTML='';$('#karnaughSection').hidden=true;
    $('#minterms1').textContent='—';$('#minterms2').textContent='—';$('#counterexamples').textContent='—';
  }
}
$('#kmaps').addEventListener('pointerover',e=>{
  const button=e.target.closest('.group-step');if(!button)return;
  const card=button.closest('.kmap-card'), cells=new Set(button.dataset.cells.split(','));
  card.querySelectorAll('[data-cell]').forEach(td=>td.classList.toggle('highlight',cells.has(td.dataset.cell)));
});
$('#kmaps').addEventListener('pointerout',e=>{if(e.target.closest('.group-step'))e.target.closest('.kmap-card').querySelectorAll('[data-cell]').forEach(td=>td.classList.remove('highlight'));});
$('#kmaps').addEventListener('focusin',e=>{const button=e.target.closest('.group-step');if(button)button.dispatchEvent(new PointerEvent('pointerover',{bubbles:true}));});
$('#kmaps').addEventListener('focusout',e=>{const button=e.target.closest('.group-step');if(button)button.dispatchEvent(new PointerEvent('pointerout',{bubbles:true}));});
$('#calc').onclick=analyze;$('#hideOutputs').onchange=analyze;
$('#swap').onclick=()=>{const old=$('#expr1').value;$('#expr1').value=$('#expr2').value;$('#expr2').value=old;analyze();};
$('#example').onclick=()=>{$('#expr1').value='!(A & B)';$('#expr2').value='!A | !B';analyze();};
function adaptLogic(){
  const {profile,level,supports}=window.TechEduCurrent?.()||{level:'standard',supports:{}};
  const area=$('#levelActivity');
  if(!profile){area.innerHTML='<b>Explora lliurement</b><p>Selecciona un perfil per rebre una proposta de treball ajustada a aquest àmbit.</p>';return;}
  if(level==='guided'){
    area.innerHTML='<b>Itinerari pautat · '+esc(profile.name)+'</b><p>1. Carrega A & B. 2. Abans de mostrar la taula, prediu què passarà amb A=1 i B=0. 3. Compara amb A=1 i B=1. 4. Comprova i explica quina condició necessita AND.</p><button id="loadLevel" type="button">Carrega l’activitat</button><label>A=1, B=0 → Y=? <select id="predict"><option value="">Tria</option><option value="0">0</option><option value="1">1</option></select></label><button id="checkPredict" type="button">Comprova la predicció</button><span id="predictResult" role="status"></span>';
    $('#checkPredict').onclick=()=>{$('#predictResult').textContent=$('#predict').value===''?'Tria un valor primer.':$('#predict').value==='0'?'Correcte. Amb AND cal que totes dues entrades siguin 1.':'Revisa B: val 0. AND només val 1 si A i B valen 1.'};
  }else if(level==='extension'){
    area.innerHTML='<b>Repte d’ampliació · '+esc(profile.name)+'</b><p>Sense consultar la taula, simplifica (A & B) | (A & !B) | (C & D). Escriu la proposta a Y₂, compara-la amb Y₁ i justifica cada grup del Karnaugh de 4 variables.</p><button id="loadLevel" type="button">Carrega el repte</button>';
  }else{
    area.innerHTML='<b>Itinerari autònom · '+esc(profile.name)+'</b><p>Construeix dues expressions. Prediu si són equivalents, busca un contraexemple i comprova la simplificació amb Karnaugh.</p><button id="loadLevel" type="button">Carrega un exemple</button>';
  }
  if(supports.stepByStep&&level!=='guided')area.insertAdjacentHTML('beforeend','<ol><li>Assigna un valor a cada variable.</li><li>Resol primer els parèntesis, després NOT, AND i OR.</li><li>Escriu la sortida esperada i contrasta-la.</li></ol>');
  if(supports.shortText)area.querySelector('p').textContent=level==='extension'?'Simplifica Y₁. Escriu Y₂. Justifica els grups.':level==='guided'?'Compara AND amb les entrades 1,0 i 1,1.':'Prediu, compara i justifica dues expressions.';
  $('#loadLevel').onclick=()=>{
    $('#expr1').value=level==='guided'?'A & B':level==='extension'?'(A & B) | (A & !B) | (C & D)':'!(A & B)';
    $('#expr2').value=level==='standard'?'!A | !B':'';
    $('#hideOutputs').checked=level==='guided'||!!supports.hideSolution;
    analyze();
  };
}
window.addEventListener('techedu-level',adaptLogic);
adaptLogic();
analyze();

window.TechEduActivity={restore:()=>analyze()};
