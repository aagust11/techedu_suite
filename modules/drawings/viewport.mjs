export function setupViewport(svg,scene,selection){
 let box={x:0,y:0,w:1200,h:720},pan=null;const bar=document.createElement('div');bar.className='view-controls';bar.innerHTML='<button id="zoomOut" title="Redueix">−</button><output id="zoomValue">100%</output><button id="zoomIn" title="Amplia">+</button><button id="fitDrawing">Enquadra tot</button><button id="fitSelection">Enquadra selecció</button><button id="resetView">Full complet</button><button id="panView" aria-pressed="false">Mou la vista</button><button id="focusView" aria-pressed="false">Pantalla completa</button>';
 svg.closest('.editor').querySelector('.editor-header').after(bar);const $=s=>bar.querySelector(s),editor=svg.closest('.editor');
 function apply(){svg.setAttribute('viewBox',`${box.x} ${box.y} ${box.w} ${box.h}`);$('#zoomValue').textContent=Math.round(1200/box.w*100)+'%'}
 function zoom(factor){const w=Math.max(150,Math.min(4800,box.w*factor)),h=w*720/1200;box={x:box.x+(box.w-w)/2,y:box.y+(box.h-h)/2,w,h};apply()}
 $('#zoomIn').onclick=()=>zoom(.8);$('#zoomOut').onclick=()=>zoom(1.25);$('#resetView').onclick=()=>{box={x:0,y:0,w:1200,h:720};apply()};
 function fit(target){if(!target||!scene.children.length)return;const b=target.getBBox(),w=Math.max(150,b.width+100,(b.height+100)*1200/720),h=w*720/1200;box={x:b.x+b.width/2-w/2,y:b.y+b.height/2-h/2,w,h};apply()}
 $('#fitDrawing').onclick=()=>fit(scene);$('#fitSelection').onclick=()=>fit([...scene.children].find(e=>e.dataset.id===selection()));
 $('#panView').onclick=()=>{$('#panView').setAttribute('aria-pressed',$('#panView').getAttribute('aria-pressed')!=='true');svg.classList.toggle('pan-active',$('#panView').getAttribute('aria-pressed')==='true')};
 function leave(){editor.classList.remove('focus-editor');$('#focusView').setAttribute('aria-pressed','false');if(document.fullscreenElement===editor)document.exitFullscreen?.().catch(()=>{})}
 $('#focusView').onclick=()=>{if(editor.classList.contains('focus-editor')){leave();return}editor.classList.add('focus-editor');$('#focusView').setAttribute('aria-pressed','true');editor.requestFullscreen?.().catch(()=>{})};document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement)leave()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){leave();pan=null;$('#panView').setAttribute('aria-pressed','false');svg.classList.remove('pan-active')}});
 const point=e=>{const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())};
 svg.addEventListener('pointerdown',e=>{if($('#panView').getAttribute('aria-pressed')!=='true'||e.button!==0)return;e.stopImmediatePropagation();pan={point:point(e),box:{...box}};svg.setPointerCapture(e.pointerId)},true);
 svg.addEventListener('pointermove',e=>{if(!pan)return;e.stopImmediatePropagation();const p=point(e);box.x-=p.x-pan.point.x;box.y-=p.y-pan.point.y;apply()},true);
 for(const name of ['pointerup','pointercancel'])svg.addEventListener(name,e=>{if(pan){e.stopImmediatePropagation();pan=null}},true);
 return {reset:()=>$('#resetView').click()};
}
