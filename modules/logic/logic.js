const $=s=>document.querySelector(s);
const VARS='ABCDEFG'.split('');
function normalize(e){return e.trim().toUpperCase();}
function varsOf(...es){const set=new Set(es.join('').match(/[A-G]/g)||[]);return VARS.filter(v=>set.has(v));}
function validate(e){if(!e)return;if(!/^[A-G01!&|()\s]+$/.test(e))throw Error('Només es permeten A–G, 0, 1, !, &, | i parèntesis.');}
function evaluate(e,v){validate(e);if(!e)return null;let x=e.replace(/([A-G])/g,m=>`v.${m}`).replaceAll('&','&&').replaceAll('|','||');return Number(!!Function('v',`return !!(${x})`)(v));}
function fmt(e){return e.replaceAll('!','¬').replaceAll('&',' · ').replaceAll('|',' + ');}
function assignment(i,vs){const v={};vs.forEach((name,j)=>v[name]=(i>>(vs.length-j-1))&1);return v;}
function analyze(){const e1=normalize($('#expr1').value),e2=normalize($('#expr2').value);$('#expr1').value=e1;$('#expr2').value=e2;try{if(!e1)throw Error('Escriu com a mínim Y₁.');validate(e1);validate(e2);const vs=varsOf(e1,e2);if(!vs.length)throw Error('Cal utilitzar almenys una variable A–G.');const n=2**vs.length, rows=[],m1=[],m2=[],diff=[];
for(let i=0;i<n;i++){const v=assignment(i,vs),y1=evaluate(e1,v),y2=e2?evaluate(e2,v):null;if(y1)m1.push(i);if(y2===1)m2.push(i);if(e2&&y1!==y2)diff.push({i,v,y1,y2});rows.push({i,v,y1,y2});}
const equivalent=e2&&diff.length===0,hidden=$('#hideOutputs').checked;
$('#verdict').className='verdict '+(e2?(equivalent?'ok':'bad'):'single-result');$('#verdict').innerHTML=e2?(equivalent?'<b>Expressions equivalents</b><span>Y₁ i Y₂ coincideixen en totes les combinacions.</span>':`<b>No són equivalents</b><span>Hi ha ${diff.length} combinació${diff.length===1?'':'ns'} on donen resultats diferents.</span>`):'<b>Funció analitzada</b><span>Activa Y₂ per comparar equivalència.</span>';
$('#metrics').innerHTML=`<article><b>${vs.length}</b><span>variables</span></article><article><b>${n}</b><span>combinacions</span></article><article><b>${m1.length}</b><span>uns a Y₁</span></article><article><b>${e2?m2.length:'—'}</b><span>uns a Y₂</span></article><article><b>${e2?diff.length:'—'}</b><span>discrepàncies</span></article>`;
$('#analysis').innerHTML=`<b>Y₁ =</b> ${fmt(e1)}${e2?` &nbsp; · &nbsp; <b>Y₂ =</b> ${fmt(e2)}`:''}<br><small>Variables detectades: ${vs.join(', ')}.</small>`;
let head=vs.map(v=>`<th>${v}</th>`).join('')+'<th>Y₁</th>'+(e2?'<th>Y₂</th><th>=?</th>':'');
let body=rows.map(r=>`<tr class="${e2&&r.y1!==r.y2?'different':''}">${vs.map(v=>`<td>${r.v[v]}</td>`).join('')}<td class="y">${hidden?'?':r.y1}</td>${e2?`<td class="y y2">${hidden?'?':r.y2}</td><td>${hidden?'?':r.y1===r.y2?'✓':'≠'}</td>`:''}</tr>`).join('');
$('#truth').innerHTML=`<thead><tr>${head}</tr></thead><tbody>${body}</tbody>`;
$('#minterms1').textContent=hidden?'Ocults en mode docent':m1.length?`Σm(${m1.join(', ')})`:'Cap minterm';
$('#minterms2').textContent=!e2?'—':hidden?'Ocults en mode docent':m2.length?`Σm(${m2.join(', ')})`:'Cap minterm';
$('#counterexamples').innerHTML=!e2?'Afegeix Y₂ per comparar.':hidden?'Ocults en mode docent':diff.length?diff.slice(0,8).map(d=>`m${d.i}: ${vs.map(v=>v+'='+d.v[v]).join(', ')} → Y₁=${d.y1}, Y₂=${d.y2}`).join('<br>'):'No n’hi ha: les expressions són equivalents.';
}catch(err){$('#verdict').className='verdict bad';$('#verdict').innerHTML='<b>No es pot analitzar</b><span>'+err.message+'</span>';$('#truth').innerHTML='';$('#metrics').innerHTML='';}}
$('#calc').onclick=analyze;$('#hideOutputs').onchange=analyze;$('#swap').onclick=()=>{const a=$('#expr1').value;$('#expr1').value=$('#expr2').value;$('#expr2').value=a;analyze()};$('#example').onclick=()=>{$('#expr1').value='!(A & B)';$('#expr2').value='!A | !B';analyze()};analyze();