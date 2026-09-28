const test=require('node:test'),assert=require('node:assert/strict');
const P=require('../profiles/store.js'),B=require('../profiles/bank.js');
let storage=new Map();global.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
test('single basic error does not force guided level',()=>{const q=B.logic.questions,a=q.map(x=>x.correct);a[0]=-1;assert.notEqual(P.suggest(q,a).level,'guided')});
test('alternate banks have distinct stable IDs and balanced tiers',()=>{for(const bank of Object.values(B)){assert.equal(bank.alternates.length,6);assert.equal(new Set([...bank.questions,...bank.alternates].map(q=>q.id)).size,12);assert.deepEqual([1,2,3].map(t=>bank.alternates.filter(q=>q.tier===t).length),[2,2,2]);assert.deepEqual(bank.resolve(bank.alternates.map(q=>q.id)),bank.alternates)}});
test('work isolation, optimistic conflict guard and export/import round trip',()=>{
 storage.clear();const initial=P.save({activeId:'a',profiles:[{id:'a',name:'A'},{id:'b',name:'B'}]});
 const saved=P.writeWork('a','logic',{draft:{fields:{expr1:'A & B'}},history:[],events:[]},0);
 assert.equal(saved.revision,1);assert.equal(P.readWork('b','logic'),null);
 assert.throws(()=>P.writeWork('a','logic',{draft:{}},0),/pestanya/);
 P.save(initial);assert.equal(P.readWork('a','logic').draft.fields.expr1,'A & B');
 const exported=JSON.parse(JSON.stringify(P.load()));storage.clear();P.save(exported,true);
 assert.equal(P.readWork('a','logic').draft.fields.expr1,'A & B');
 storage.set(P.KEY,'broken');assert.throws(()=>P.writeWork('a','logic',{},1));assert.equal(storage.get(P.KEY),'broken');
});
