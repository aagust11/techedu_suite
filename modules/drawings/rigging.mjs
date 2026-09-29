// Geometry for editable diagrams. No dynamic or force-equilibrium solver.
export const limited=(v,f,min,max)=>Number.isFinite(Number(v))?Math.min(max,Math.max(min,Number(v))):f;
const polar=(c,r,a)=>({x:c.x+r*Math.cos(a),y:c.y+r*Math.sin(a)});
export function pulleyGeometry(o){
 const movable=o.kind==='movablepulley',r=limited(o.radius,52,20,100),c={x:o.x+70,y:o.y+(movable?105:70)};
 const angles=[limited(o.ropeAngleA,movable?270:90,-360,360),limited(o.ropeAngleB,movable?270:90,-360,360)];
 const lengths=[limited(o.ropeLengthA,110,10,650),limited(o.ropeLengthB,110,10,650)];
 const tangents=angles.map((a,i)=>polar(c,r,(a+(i? -90:90))*Math.PI/180));
 const ends=tangents.map((t,i)=>polar(t,lengths[i],angles[i]*Math.PI/180));
 const a=Math.atan2(tangents[0].y-c.y,tangents[0].x-c.x),b=Math.atan2(tangents[1].y-c.y,tangents[1].x-c.x),delta=(b-a+Math.PI*2)%(Math.PI*2);
 return {c,r,tangents,ends,path:`M${ends[0].x} ${ends[0].y} L${tangents[0].x} ${tangents[0].y} A${r} ${r} 0 ${delta>Math.PI?1:0} 1 ${tangents[1].x} ${tangents[1].y} L${ends[1].x} ${ends[1].y}`,mount:{x:c.x,y:c.y-r-30},load:{x:c.x,y:c.y+r+45}};
}
export function tackleGeometry(o){
 const pairs=Math.round(limited(o.pairs,2,1,4)),r=limited(o.radius,25,18,38),gap=limited(o.blockGap,190,120,360),tail=limited(o.freeLength,170,40,450),pitch=4*r;
 const top=o.y+55,bottom=top+gap,lower=[],upper=[];
 for(let i=0;i<pairs;i++){lower.push({x:o.x+2*r+i*pitch,y:bottom});upper.push({x:o.x+4*r+i*pitch,y:top});}
 const start={x:lower[0].x-r,y:o.y+5};let path=`M${start.x} ${start.y}`;
 for(let i=0;i<pairs;i++){const l=lower[i],u=upper[i];path+=` L${l.x-r} ${l.y} A${r} ${r} 0 0 0 ${l.x+r} ${l.y} L${u.x-r} ${u.y} A${r} ${r} 0 0 1 ${u.x+r} ${u.y}`;}
 const end={x:upper.at(-1).x+r,y:top+tail};path+=` L${end.x} ${end.y}`;
 return {pairs,r,lower,upper,path,start,end,mount:{x:(upper[0].x+upper.at(-1).x)/2,y:o.y+5},load:{x:(lower[0].x+lower.at(-1).x)/2,y:bottom+r+60}};
}
export function basePorts(o){
 if(['pulley','fixedpulley','movablepulley'].includes(o.kind)){const g=pulleyGeometry(o);return {a:g.ends[0],b:g.ends[1],mount:g.mount,load:g.load};}
 if(o.kind==='tackle'){const g=tackleGeometry(o);return {effort:g.end,load:g.load,mount:g.mount};}
 if(o.kind==='load'){const w=limited(o.w,100,40,260),h=limited(o.h,75,30,180);return {top:{x:o.x+w/2,y:o.y},bottom:{x:o.x+w/2,y:o.y+h}};}
 if(o.kind==='anchor')return {ring:{x:o.x+40,y:o.y+55}};
 if(o.kind==='hook')return {top:{x:o.x+30,y:o.y},bottom:{x:o.x+30,y:o.y+75}};
 if(o.kind==='dynamometer'){const h=limited(o.h,160,90,320);return {top:{x:o.x+35,y:o.y},bottom:{x:o.x+35,y:o.y+h+40}};}
 return {};
}
export const portNames={a:'Extrem A',b:'Extrem B',start:'Inici',end:'Final',mount:'Fixació',load:'Càrrega',effort:'Extrem lliure',top:'Superior',bottom:'Inferior',ring:'Anella'};
export function endpoint(objects,o,side,seen=new Set()){
 const fallback={x:side==='start'?o.x:(Number.isFinite(o.x2)?o.x2:o.x+160),y:side==='start'?o.y:(Number.isFinite(o.y2)?o.y2:o.y)};
 const key=o.id+':'+side;if(seen.has(key))return fallback;seen=new Set(seen).add(key);
 const ref=o[side+'Connection'];if(!ref)return fallback;
 const target=objects.find(v=>v.id===ref.objectId);if(!target)return fallback;
 if(target.kind==='rope'&&['start','end'].includes(ref.port))return endpoint(objects,target,ref.port,seen);
 return basePorts(target)[ref.port]||fallback;
}
export function ports(objects,o){return o.kind==='rope'?{start:endpoint(objects,o,'start'),end:endpoint(objects,o,'end')}:basePorts(o);}
export function canConnect(objects,id,side,ref){
 const visited=new Set([id+':'+side]);let next=ref;
 while(next){const key=next.objectId+':'+next.port;if(visited.has(key))return false;visited.add(key);const o=objects.find(v=>v.id===next.objectId);if(!o)return false;if(o.kind!=='rope')return !!basePorts(o)[next.port];if(!['start','end'].includes(next.port))return false;next=o[next.port+'Connection'];}return true;
}
export function detach(objects,o,side){const p=endpoint(objects,o,side);if(side==='start'){o.x=p.x;o.y=p.y}else{o.x2=p.x;o.y2=p.y}delete o[side+'Connection'];}
export function removeObject(objects,id){for(const o of objects)if(o.kind==='rope')for(const side of ['start','end'])if(o[side+'Connection']?.objectId===id)detach(objects,o,side);return objects.filter(o=>o.id!==id);}
export function remapObjects(objects,newId){const entries=objects.map(o=>({o,id:newId()})),ids=new Map(entries.filter(e=>typeof e.o.id==='string').map(e=>[e.o.id,e.id]));return entries.map(({o,id})=>{const copy=JSON.parse(JSON.stringify(o));copy.id=id;for(const side of ['start','end']){const ref=copy[side+'Connection'];if(ref){if(ids.has(ref.objectId))ref.objectId=ids.get(ref.objectId);else delete copy[side+'Connection'];}}return copy;});}
