const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../modules/communications/signal-core.js');
const P=require('../profiles/store.js');
test('clean channel reconstructs all messages at the middle of each bit',()=>{
 for(let word=0;word<256;word++){const bits=word.toString(2).padStart(8,'0'),r=C.simulate({bits});assert.equal(r.errors,0);assert.equal(r.decisions.map(d=>d.decoded).join(''),bits);r.decisions.forEach((d,i)=>assert.equal(d.t,(i+.5)/4));}
});
test('attenuation and decision threshold change decoding without altering the source',()=>{
 const weak=C.simulate({gain:.3});assert.equal(weak.errors,4);assert.equal(weak.decisions.map(d=>d.decoded).join(''),'00000000');
 assert.equal(C.simulate({gain:.3,threshold:.15}).errors,0);
 assert.equal(C.simulate({gain:.3,threshold:0}).decisions.map(d=>d.decoded).join(''),'11111111');
 assert.equal(C.simulate({amplitude:.5,threshold:.5}).errors,0);
 assert.equal(C.simulate({gain:0}).errors,4);
});
test('noise is deterministic, bounded and changes with seed',()=>{
 const a=C.simulate({noise:.25,seed:42}),b=C.simulate({noise:.25,seed:42}),other=C.simulate({noise:.25,seed:43});
 assert.deepEqual(a,b);assert.notDeepEqual(a.samples,other.samples);
 for(const p of a.samples)assert.ok(Math.abs(p.received-p.sent)<=.25000001);
});
test('analog signal preserves frequency under attenuation; phase and interference work',()=>{
 const c=C.config({mode:'analog',amplitude:2,frequency:1,gain:.5});
 assert.ok(Math.abs(C.sent(.25,c)-2)<1e-10);assert.ok(Math.abs(C.received(.25,c)-1)<1e-10);
 assert.ok(Math.abs(C.sent(0,{...c,phase:90})-2)<1e-10);
 const r=C.simulate({...c,gain:1});assert.equal(r.rms,0);assert.equal(r.ber,null);assert.equal(r.decisions.length,0);
 assert.ok(Math.abs(C.received(.25,{...c,interference:.3,interferenceFrequency:1})-1.3)<1e-10);
});
test('invalid values are rejected, and communications drafts survive profile sanitization',()=>{
 for(const config of [{bits:'abc'},{bits:'1'},{noise:-1},{gain:2},{seed:NaN},{mode:'unknown'}])assert.throws(()=>C.simulate(config));
 const data=P.sanitize({profiles:[{id:'a',name:'A',domains:{communications:'extension'},work:{communications:{revision:1,draft:{fields:{bits:'1011'},extra:{baseline:C.defaults}},history:[],events:[]}}}]});
 assert.equal(data.profiles[0].domains.communications,'extension');assert.equal(data.profiles[0].work.communications.draft.fields.bits,'1011');
});
