const test=require('node:test'),assert=require('node:assert/strict'),R=require('../modules/communications/reliability-core.js'),P=require('../profiles/store.js');
test('receiver verifies frames independently and detects every single-bit error',()=>{
 for(const method of ['parity','checksum'])for(let value=0;value<256;value++){const original=R.protect(R.bitsOf([value,255-value]),method);assert.equal(R.verify(original.frame,method).passed,true);for(let i=0;i<original.frame.length;i++)assert.equal(R.verify(R.flip(original.frame,[i]),method).passed,false);}
 assert.equal(R.verify(R.protect('01000001','none').frame,'none').passed,null);
});
test('parity and checksum have demonstrable undetected errors',()=>{
 const parity=R.protect(R.bitsOf([65,66]),'parity');assert.equal(R.verify(R.flip(parity.frame,[6,7]),'parity').passed,true);
 const sum=R.protect(R.bitsOf([65,66]),'checksum'),changed=R.flip(sum.frame,[7,15]);assert.equal(R.verify(changed,'checksum').passed,true);assert.equal(R.observe(sum.frame,changed).same,false);
 assert.equal(R.protect(R.bitsOf([255,1]),'checksum').check,'00000000');assert.equal(R.verify(R.bitsOf([66,65])+sum.check,'checksum').passed,true);
 assert.throws(()=>R.verify('10101','checksum'));assert.throws(()=>R.protect('a','parity'));
});
test('packet cost, ordered reconstruction and UTF-8 boundaries',()=>{
 const clean=R.packets({message:'À🛰',packetSize:1,loss:0,corruption:0,retries:0,jitter:500,bitRate:4096});assert.equal(clean.identical,true);assert.equal(clean.text,'À🛰');assert.equal(clean.originalBytes,6);
 assert.equal(clean.totalBits,6*(16+8+8+8)); // header, one data byte, checksum, ACK
 assert.equal(clean.received.length,6);assert.deepEqual(clean.received.map(x=>x[0]),[0,1,2,3,4,5]);
 const arrivals=clean.events.map(x=>x.seq);assert.notDeepEqual(arrivals,[0,1,2,3,4,5]);
});
test('seeded packets are repeatable; detected corruption cannot be accepted as correct',()=>{
 const c={loss:40,corruption:60,seed:42,packetSize:2,retries:3};assert.deepEqual(R.packets(c),R.packets(c));
 const r=R.packets(c);for(const e of r.events)if(e.corrupt)assert.equal(e.status,'rejected');
 assert.ok(r.events.length<=r.blocks.length*4);assert.equal(r.totalBits,r.events.reduce((n,e)=>n+e.bits,0)+r.acks*8);
 const none=R.packets({...c,loss:0,method:'none',retries:0});assert.equal(none.complete,true);assert.equal(none.identical,false);
});
test('final challenge is feasible and cannot be bypassed by lowering channel errors',()=>{
 assert.equal(R.challenge({packetSize:6,method:'checksum',retries:2}).passed,true);
 const a=R.challenge({packetSize:1,method:'none',retries:0}),b=R.challenge({packetSize:1,method:'none',retries:0,loss:0,corruption:0,message:'A',bitRate:4096});assert.deepEqual(a,b);assert.equal(a.passed,false);
});
test('test submission is atomic on stale revision and on storage failure',()=>{
 const storage=new Map();global.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
 let data=P.save({profiles:[{id:'a',name:'A'}],activeId:'a'});const draft=P.writeWork('a','test-logic',{draft:{answers:[0],questionIds:['logic-a-0']}},0);
 const attempt={domain:'logic',date:new Date().toISOString(),answers:[0],questionIds:['logic-a-0'],bankVersion:2};
 assert.throws(()=>P.finishTest('a','logic',attempt,0,data.metaRevision));assert.deepEqual(P.readWork('a','test-logic').draft.answers,[0]);assert.equal(P.load().profiles[0].attempts.length,0);
 const normal=global.localStorage.setItem;global.localStorage.setItem=()=>{throw Error('quota')};assert.throws(()=>P.finishTest('a','logic',attempt,draft.revision,data.metaRevision));global.localStorage.setItem=normal;
 assert.deepEqual(P.readWork('a','test-logic').draft.answers,[0]);data=P.finishTest('a','logic',attempt,draft.revision,data.metaRevision);assert.equal(data.profiles[0].attempts.length,1);assert.equal(P.readWork('a','test-logic').draft,null);
});
