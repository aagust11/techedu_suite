(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ReliabilityCore=api;})(globalThis,function(){
 const methods=['none','parity','checksum'];
 function binary(raw){if(typeof raw!=='string'||/[^01\s]/.test(raw))throw Error('Només es permeten bits 0 i 1 i espais.');return raw.replace(/\s/g,'');}
 function bytes(bits){return Array.from({length:bits.length/8},(_,i)=>parseInt(bits.slice(8*i,8*i+8),2));}
 const bitsOf=data=>data.map(b=>b.toString(2).padStart(8,'0')).join('');
 const ones=bits=>[...bits].filter(b=>b==='1').length;
 const checksum=data=>data.reduce((sum,b)=>(sum+b)%256,0);
 function protect(raw,method){if(!methods.includes(method))throw Error('Protecció desconeguda.');const payload=binary(raw);if(!payload.length||payload.length%8||payload.length>512)throw Error('Utilitza d’1 a 64 bytes complets.');const check=method==='parity'?String(ones(payload)%2):method==='checksum'?checksum(bytes(payload)).toString(2).padStart(8,'0'):'';return {payload,check,frame:payload+check,overhead:check.length};}
 // The receiver only gets a frame and the agreed protection, never the source.
 function verify(raw,method){if(!methods.includes(method))throw Error('Protecció desconeguda.');const frame=binary(raw),n=method==='parity'?1:method==='checksum'?8:0,len=frame.length-n;if(len<8||len%8||len>512)throw Error('La longitud de la trama no correspon a bytes complets i al control escollit.');const payload=frame.slice(0,len),received=frame.slice(len),expected=protect(payload,method).check;return {payload,received,expected,passed:method==='none'?null:received===expected,ones:ones(frame),sum:checksum(bytes(payload)),data:bytes(payload)};}
 function flip(raw,indices){let bits=binary(raw).split('');for(const i of indices){if(!Number.isInteger(i)||i<0||i>=bits.length)throw Error('Posició de bit fora de rang.');bits[i]=bits[i]==='1'?'0':'1';}return bits.join('');}
 function observe(original,received){const a=binary(original),b=binary(received);return {same:a===b,changes:a.length===b.length?[...a].reduce((n,x,i)=>n+(x!==b[i]),0):null};}
 function random(seed,index,round,lane){let x=(Math.imul(seed,668265263)^Math.imul(index+1,374761393)^Math.imul(round+1,1274126177)^Math.imul(lane+1,2246822519))>>>0;x=Math.imul(x^(x>>>13),1274126177);return ((x^(x>>>16))>>>0)/4294967296;}
 function packets(raw={}){
  const c={message:'Hola, món!',packetSize:3,method:'checksum',loss:25,corruption:20,jitter:200,bitRate:512,retries:2,seed:42,...raw};
  if(typeof c.message!=='string')throw Error('Escriu un missatge.');const data=[...new TextEncoder().encode(c.message)];if(!data.length||data.length>64)throw Error('El missatge ha de tenir entre 1 i 64 bytes UTF-8.');
  for(const [k,min,max] of [['packetSize',1,8],['loss',0,60],['corruption',0,60],['jitter',0,500],['bitRate',64,4096],['retries',0,3],['seed',1,999999]]){c[k]=Number(c[k]);if(!Number.isInteger(c[k])||c[k]<min||c[k]>max)throw Error('Valor fora de rang: '+k);}
  if(!methods.includes(c.method))throw Error('Protecció desconeguda.');
  const blocks=Array.from({length:Math.ceil(data.length/c.packetSize)},(_,i)=>data.slice(i*c.packetSize,(i+1)*c.packetSize)),received=new Map(),events=[];
  let pending=blocks.map((_,i)=>i),clock=0,totalBits=0,acks=0;
  for(let round=0;round<=c.retries&&pending.length;round++){
   let wire=clock;const batch=[];
   for(const seq of pending){const payload=blocks[seq],frame=protect(bitsOf([seq,payload.length,...payload]),c.method).frame,start=wire;wire+=frame.length/c.bitRate*1000;totalBits+=frame.length;
    const lost=random(c.seed,seq,round,0)<c.loss/100,corrupt=!lost&&random(c.seed,seq,round,1)<c.corruption/100;
    // Headers are reliable in this teaching model; a corruption flips one data bit.
    const altered=corrupt?flip(frame,[16+Math.floor(random(c.seed,seq,round,2)*payload.length*8)]):frame;
    batch.push({seq,round,start,sentAt:wire,arrival:lost?null:wire+40+c.jitter*random(c.seed,seq,round,3),lost,corrupt,frame:altered,bits:frame.length});
   }
   clock=wire;
   for(const event of batch.sort((a,b)=>(a.arrival??Infinity)-(b.arrival??Infinity))){
    if(event.lost){event.status='lost';clock=Math.max(clock,event.sentAt+40+c.jitter+50);}
    else{const v=verify(event.frame,c.method);event.status=v.passed===false?'rejected':'accepted';event.receiverCheck=v.passed;
     if(v.passed!==false){const [seq,length,...payload]=v.data;received.set(seq,payload.slice(0,length));acks++;totalBits+=8;clock=Math.max(clock,event.arrival+40+8/c.bitRate*1000);}
     else clock=Math.max(clock,event.sentAt+40+c.jitter+50);
    }events.push(event);
   }
   pending=blocks.map((_,i)=>i).filter(i=>!received.has(i));
  }
  const assembled=blocks.flatMap((_,i)=>received.get(i)||[]),complete=pending.length===0,identical=complete&&assembled.length===data.length&&assembled.every((b,i)=>b===data[i]);
  let text=null,utf8Valid=null;if(complete){try{text=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(new Uint8Array(assembled));utf8Valid=true;}catch{utf8Valid=false;}}
  return {config:c,blocks,events,totalBits,acks,timeMs:clock,received:[...received.entries()].sort((a,b)=>a[0]-b[0]),missing:pending,complete,identical,text,utf8Valid,originalBytes:data.length};
 }
 function challenge(raw){const fixed={message:'Hola, món!',loss:25,corruption:20,jitter:200,bitRate:512},runs=[42,43,44].map(seed=>packets({...raw,...fixed,seed}));return {runs,passed:runs.every(r=>r.identical&&r.totalBits<=900&&r.timeMs<=5000),maxBits:Math.max(...runs.map(r=>r.totalBits)),maxTime:Math.max(...runs.map(r=>r.timeMs))};}
 return {binary,bitsOf,bytes,ones,checksum,protect,verify,flip,observe,packets,challenge};
});
