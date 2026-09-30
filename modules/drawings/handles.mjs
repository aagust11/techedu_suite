import {pulleyGeometry,endpoint,detach} from './rigging.mjs';
import {inclineGeometry,upgradeRamp} from './incline.mjs';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function handles(objects,o){if(!o)return [];if(o.kind==='ramp'){const g=inclineGeometry(o);return [{key:'slope',x:g.x+g.L*g.c,y:g.y,name:'Angle i longitud del pla'}]}
 if(['pulley','fixedpulley','movablepulley'].includes(o.kind))return pulleyGeometry(o).ends.map((p,i)=>({...p,key:i?'ropeB':'ropeA',name:'Longitud i angle del tram '+(i?'B':'A')}));
 if(['arrow','line','wire','rope'].includes(o.kind))return ['start','end'].map(side=>({...(o.kind==='rope'?endpoint(objects,o,side):side==='start'?{x:o.x,y:o.y}:{x:o.x2??o.x+160,y:o.y2??o.y}),key:side,name:side==='start'?'Inici del segment':'Final del segment'}));return [];
}
export function moveHandle(objects,o,key,p,original){if(key==='slope'){const g=inclineGeometry(original),dx=Math.max(1,p.x-g.x),dy=Math.max(1,g.base-p.y),angle=clamp(Math.atan2(dy,dx)*180/Math.PI,5,70),length=clamp(Math.hypot(dx,dy),180,650);upgradeRamp(o);o.rampAngle=angle;o.rampLength=length;o.y=g.base-length*Math.sin(angle*Math.PI/180);return}
 if(key==='ropeA'||key==='ropeB'){const g=pulleyGeometry(original),dx=p.x-g.c.x,dy=p.y-g.c.y,len=clamp(Math.sqrt(Math.max(100,dx*dx+dy*dy-g.r*g.r)),10,650),sign=key==='ropeA'?1:-1,angle=(Math.atan2(dy,dx)-Math.atan2(sign*g.r,len))*180/Math.PI;const side=key.slice(-1);o['ropeLength'+side]=len;o['ropeAngle'+side]=angle;return}
 if(o.kind==='rope')detach(objects,o,key);if(key==='start'){o.x=p.x;o.y=p.y}else{o.x2=p.x;o.y2=p.y}
}
