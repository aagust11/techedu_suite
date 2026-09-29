/* Ideal baseband teaching model. No DOM, network or nondeterministic noise. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SignalCore=api;})(globalThis,function(){
 const TAU=2*Math.PI;
 const defaults={mode:'digital',bits:'10110010',amplitude:1,frequency:3,phase:0,bitRate:4,gain:1,noise:0,interference:0,interferenceFrequency:5,threshold:.5,seed:42};
 function config(raw={}){
  const c={...defaults,...raw};
  if(!['analog','digital'].includes(c.mode))throw Error('Tria senyal analògic o digital.');
  if(c.mode==='analog'&&(typeof c.bits!=='string'||!/^[01]{4,16}$/.test(c.bits)))c.bits=defaults.bits;
  if(typeof c.bits!=='string'||!/^[01]{4,16}$/.test(c.bits))throw Error('Escriu entre 4 i 16 bits, només 0 i 1.');
  const ranges={amplitude:[.2,2],frequency:[.5,8],phase:[0,360],bitRate:[1,8],gain:[0,1],noise:[0,1],interference:[0,1],interferenceFrequency:[.5,20],threshold:[0,2],seed:[1,999999]};
  for(const [key,[min,max]] of Object.entries(ranges)){const n=Number(c[key]);if(!Number.isFinite(n)||n<min||n>max)throw Error('Valor fora de rang: '+key);c[key]=n;}
  c.seed=Math.floor(c.seed);return c;
 }
 // Repeatable noise: independent bounded knots at 80 Hz, linearly interpolated.
 function knot(index,seed){let x=(Math.imul(index+1,374761393)^Math.imul(seed,668265263))>>>0;x=Math.imul(x^(x>>>13),1274126177);return ((x^(x>>>16))>>>0)/4294967295*2-1;}
 function disturbance(t,c){const x=Math.max(0,t)*80,i=Math.floor(x),f=x-i;return c.noise*(knot(i,c.seed)*(1-f)+knot(i+1,c.seed)*f)+c.interference*Math.sin(TAU*c.interferenceFrequency*t);}
 function sent(t,c){return c.mode==='analog'?c.amplitude*Math.sin(TAU*c.frequency*t+c.phase*Math.PI/180):Number(c.bits[Math.min(c.bits.length-1,Math.max(0,Math.floor(t*c.bitRate)))])*c.amplitude;}
 function received(t,c){return c.gain*sent(t,c)+disturbance(t,c);}
 function simulate(raw){
  const c=config(raw),duration=c.mode==='digital'?c.bits.length/c.bitRate:2;
  const samples=Array.from({length:2401},(_,i)=>{const t=duration*i/2400;return {t,sent:sent(t,c),received:received(t,c)}});
  const decisions=c.mode==='digital'?[...c.bits].map((bit,i)=>{const t=(i+.5)/c.bitRate,v=received(t,c),decoded=v>=c.threshold?1:0;return {index:i,t,value:v,sent:Number(bit),decoded,error:decoded!==Number(bit)}}):[];
  const errors=decisions.filter(x=>x.error).length;
  const rms=Math.sqrt(samples.reduce((sum,p)=>sum+(p.received-p.sent)**2,0)/samples.length);
  return {config:c,duration,samples,decisions,errors,ber:decisions.length?errors/decisions.length:null,rms};
 }
 return {defaults,config,sent,received,disturbance,simulate};
});
