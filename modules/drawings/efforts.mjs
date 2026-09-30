const clamp=(v,d,a,b)=>Number.isFinite(Number(v))?Math.max(a,Math.min(b,Number(v))):d;
export const names={tension:'Tracció',compression:'Compressió',bending:'Flexió',shear:'Tall / cisallament',torsion:'Torsió',buckling:'Vinclament'};
export function geometry(o){return {w:clamp(o.effortWidth,340,140,600),h:clamp(o.effortHeight,50,20,90),amount:clamp(o.deformation,60,0,100)/100,type:o.kind.slice(7),view:['before','after','both'].includes(o.effortView)?o.effortView:'both'}}
export function renderEffort(o,label,color){const {w,h,amount,type,view}=geometry(o),x=Number(o.x)||0,y=Number(o.y)||0;
 const stroke=`stroke="${color}" stroke-width="3" stroke-linejoin="round"`,path=d=>`<path d="${d}" ${stroke} fill="#edf3f1"/>`;
 const arrow=(ax,ay,dx,dy)=>{const angle=Math.atan2(dy,dx)*180/Math.PI,len=Math.hypot(dx,dy);return `<g transform="translate(${ax} ${ay}) rotate(${angle})" stroke="#cb542a" stroke-width="3" fill="none"><path d="M0 0 H${len} M${len-10} -6 L${len} 0 L${len-10} 6"/></g>`};
 function stage(after){const a=after?amount:0,bx=x+95,by=y+(after?270:70),center=bx+w/2;let shape='',forces='';const rect=(xx,yy,ww,hh)=>`<rect x="${xx}" y="${yy}" width="${ww}" height="${hh}" ${stroke} fill="#edf3f1"/>`;
 const fibers=(fn)=>o.showFibers===false?'':Array.from({length:Math.round(clamp(o.fiberCount,7,3,13))},(_,j)=>{const u=(j+1)/(Math.round(clamp(o.fiberCount,7,3,13))+1);return `<path data-material-line="true" d="${Array.from({length:41},(_,i)=>{const [xx,yy]=fn(i/40,u);return `${i?'L':'M'}${xx} ${yy}`}).join(' ')}" stroke="${color}" stroke-width="1.4" fill="none" opacity=".8"/>`}).join('');
 if(type==='tension'||type==='compression'){
  const out=type==='tension',len=w*(1+(out?.3:-.25)*a),left=center-len/2;
  const point=(t,u)=>[left+len*t,by+h/2+(u-.5)*h*(1+(out?-.6:.65)*a*Math.sin(Math.PI*t))];
  const edge=u=>Array.from({length:41},(_,i)=>{const t=u===0?i/40:1-i/40,p=point(t,u);return `${i?'L':u===0?'M':'L'}${p[0]} ${p[1]}`}).join(' ');
  shape=path(edge(0)+' '+edge(1)+' Z')+fibers(point);
  forces=out?arrow(left,by+h/2,-60,0)+arrow(left+len,by+h/2,60,0):arrow(left-65,by+h/2,60,0)+arrow(left+len+65,by+h/2,-60,0);
 }
 if(type==='buckling'){
  const len=w*(1-.12*a),left=center-len/2,bow=70*a;
  const point=(t,u)=>[left+len*t,by+h*u+bow*Math.sin(Math.PI*t)];
  const edge=u=>Array.from({length:41},(_,i)=>{const t=u===0?i/40:1-i/40,p=point(t,u);return `${i?'L':u===0?'M':'L'}${p[0]} ${p[1]}`}).join(' ');
  shape=path(edge(0)+' '+edge(1)+' Z')+fibers(point);
  forces=arrow(left-65,by+h/2,60,0)+arrow(left+len+65,by+h/2,-60,0);
 }
 if(type==='bending'){const sag=75*a;shape=path(`M${bx} ${by} Q${center} ${by+2*sag} ${bx+w} ${by} L${bx+w} ${by+h} Q${center} ${by+h+2*sag} ${bx} ${by+h} Z`);shape+=fibers((t,u)=>[bx+w*t,by+h*u+4*sag*t*(1-t)]);shape+=path(`M${bx} ${by+h} l-16 25 h32 Z M${bx+w} ${by+h} l-16 25 h32 Z`);forces=arrow(center,by+sag-65,0,60)+arrow(bx,by+h+65,0,-35)+arrow(bx+w,by+h+65,0,-35);}
 if(type==='shear'){const shift=65*a;shape=path(`M${bx+shift} ${by} h${w} l${-shift} ${h} h${-w} Z`);shape+=fibers((t,u)=>[bx+shift*(1-u)+w*t,by+h*u]);forces=arrow(center+shift-30,by-15,60,0)+arrow(center+30,by+h+15,-60,0);}
 if(type==='torsion'){const cy=by+h/2,rx=15,ry=h/2;shape=rect(bx,by,w,h)+`<ellipse cx="${bx}" cy="${cy}" rx="${rx}" ry="${ry}" ${stroke} fill="#edf3f1"/><ellipse cx="${bx+w}" cy="${cy}" rx="${rx}" ry="${ry}" ${stroke} fill="#edf3f1"/>`;
 shape+=fibers((t,u)=>{const smooth=t*t*(3-2*t),phase=Math.asin((2*u-1)*.94),twist=a*Math.PI*(smooth-.5);return [bx+w*t,cy+ry*.96*Math.sin(phase+twist)]});
 const angle=a*Math.PI;shape+=`<path d="M${bx+w} ${cy} l${Math.sin(angle)*rx} ${-Math.cos(angle)*ry}" stroke="${color}" stroke-width="3"/>`;
 forces=`<path d="M${bx-28} ${cy-30} C${bx-70} ${cy-30} ${bx-70} ${cy+30} ${bx-28} ${cy+30} l-10 -9 m10 9 l-13 3 M${bx+w+28} ${cy-30} C${bx+w+70} ${cy-30} ${bx+w+70} ${cy+30} ${bx+w+28} ${cy+30} l10 -9 m-10 9 l13 3" fill="none" stroke="#cb542a" stroke-width="3"/>`;
 }
 let ghost=after&&o.showOriginal?`<rect x="${bx}" y="${by}" width="${w}" height="${h}" fill="none" stroke="#8b999e" stroke-width="2" stroke-dasharray="7 5"/>`:'';
 return label(center,by-85,after?'Després · deformació esquemàtica':'Abans · sense deformació',19,'middle',color)+shape+ghost+(after&&o.showForces!==false?forces:'');}
 const before=stage(false),after=stage(true),title=label(x+95+w/2,y+Math.max(435,270+h+(['bending','buckling'].includes(type)?75*amount:0)+45),o.label||names[type],22,'middle',color);
 // Keep label indices stable when changing the view.
 return `<g data-effort="${type}">${view!=='after'?before:''}${view!=='before'?`<g transform="translate(0 ${view==='after'?-200:0})">${after}</g>`:''}${view==='both'?title:`<g transform="translate(0 -200)">${title}</g>`}</g>`;
}
export function effortFields(o,field){if(!o.kind.startsWith('effort-'))return '';const g=geometry(o);return `<label>Vista<select data-property="effortView">${[['both','Abans i després'],['before','Només abans'],['after','Només després']].map(([v,n])=>`<option value="${v}" ${g.view===v?'selected':''}>${n}</option>`).join('')}</select></label>`+field('deformation','Deformació visual (0–100)','number',g.amount*100)+field('effortWidth','Longitud de l’element (px)','number',g.w)+field('effortHeight','Gruix de l’element (px)','number',g.h)+`<label>Línies interiors del material<input type="checkbox" data-property="showFibers" ${o.showFibers!==false?'checked':''}></label>${field('fiberCount','Nombre de línies (3–13)','number',Math.round(clamp(o.fiberCount,7,3,13)))}<label>Mostra les forces / moments<input type="checkbox" data-property="showForces" ${o.showForces!==false?'checked':''}></label><label>Superposa el contorn inicial<input type="checkbox" data-property="showOriginal" ${o.showOriginal?'checked':''}></label><p class="muted">Deformació exagerada per explicar l’esforç; no calcula forces, material ni ruptura. El cisallament mostra distorsió sense separar la peça. La torsió mostra el gir relatiu entre seccions. El vinclament és la curvatura lateral d’una peça esvelta comprimida. L’eixamplament i l’aprimament centrals són exageracions didàctiques, no una predicció universal del material.</p>`;}
