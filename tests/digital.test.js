const test=require('node:test'),assert=require('node:assert/strict'),D=require('../modules/communications/digital-core.js');
test('sampling captures the expected instants, payload and quantization bound',()=>{
 for(const depth of [1,2,4,8]){const r=D.sample({sampleRate:16,depth,frequency:3});assert.equal(r.samples.length,32);assert.equal(r.payloadBits,32*depth);assert.equal(r.samples.at(-1).t,31/16);assert.ok(r.maxError<=r.step/2+1e-12);assert.equal(r.undersampled,false);for(const s of r.samples)assert.equal(s.binary.length,depth);}
 assert.equal(D.quantize(-1,3).code,0);assert.equal(D.quantize(1,3).code,7);
});
test('aliasing preserves ideal samples; Nyquist boundary is not marked sufficient',()=>{
 const r=D.sample({frequency:7,sampleRate:8});assert.equal(r.alias,-1);assert.equal(r.undersampled,true);
 for(const s of r.samples)assert.ok(Math.abs(s.original-r.config.amplitude*Math.sin(2*Math.PI*r.alias*s.t))<1e-12);
 const edge=D.sample({frequency:2,sampleRate:4,phase:0});assert.equal(edge.undersampled,true);assert.ok(edge.samples.every(s=>Math.abs(s.original)<1e-12));
 const phase=D.sample({frequency:2,sampleRate:4,phase:90});assert.ok(Math.abs(phase.samples[0].original-.8)<1e-12);
});
test('UTF-8 round trips accents, emoji, combining marks, BOM and markup',()=>{
 for(const text of ['A','À','é e\u0301','🛰️','\uFEFFHola','<img src=x onerror=alert(1)>','']){const r=D.encodeText(text);assert.deepEqual(r.bytes,[...Buffer.from(text,'utf8')]);assert.equal(D.decodeText(r.binary),text);assert.equal(r.bits,r.bytes.length*8);}
 assert.equal(D.encodeText('À').bytes.length,2);assert.equal(D.encodeText('é').bytes.length,2);assert.equal(D.encodeText('e\u0301').bytes.length,3);
});
test('bit changes may alter text or invalidate UTF-8; malformed byte input is rejected',()=>{
 assert.equal(D.decodeText(D.flip(D.encodeText('A').binary,8)),'@');
 assert.throws(()=>D.decodeText(D.flip(D.encodeText('A').binary,1)),/UTF-8/);
 for(const bits of ['010','abcdefgh','0100000x'])assert.throws(()=>D.decodeText(bits));
 assert.throws(()=>D.flip('01000001',9));assert.throws(()=>D.sample({sampleRate:4.5}));
});
test('pixel payload and reconstruction follow selected grayscale depth',()=>{
 const image=Array.from({length:64},(_,i)=>Math.round(i*255/63));
 for(const depth of [1,2,4,8]){const r=D.pixels(image,depth);assert.equal(r.bits,64*depth);assert.equal(r.binary.replace(/ /g,'').length,64*depth);assert.equal(r.decoded[0],0);assert.equal(r.decoded[63],255);assert.ok(new Set(r.decoded).size<=2**depth);}
 assert.deepEqual(D.pixels(image,8).decoded,image);assert.throws(()=>D.pixels([255],8));assert.throws(()=>D.pixels(image,3));
});
