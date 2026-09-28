const test=require('node:test'),assert=require('node:assert/strict');
const P=require('../profiles/store.js'),B=require('../profiles/bank.js');
test('each topic has balanced recognition, application and transfer items',()=>{
 for(const domain of P.DOMAINS){
  const q=B[domain].questions;assert.equal(q.length,6);
  assert.deepEqual([1,2,3].map(t=>q.filter(x=>x.tier===t).length),[2,2,2]);
  for(const item of q)assert.ok(item.correct>=0&&item.correct<item.options.length);
 }
});
test('suggestions distinguish support and transfer without changing the profile',()=>{
 const questions=B.logic.questions,correct=questions.map(q=>q.correct),wrong=questions.map(q=>(q.correct+1)%q.options.length);
 assert.equal(P.suggest(questions,correct).level,'extension');
 assert.equal(P.suggest(questions,wrong).level,'guided');
 const middle=correct.slice();middle[4]=wrong[4];middle[5]=wrong[5];
 assert.equal(P.suggest(questions,middle).level,'standard');
 const profile={id:'1',name:'A01',level:'guided',domains:{logic:'extension'},supports:{},attempts:[]};
 assert.equal(P.effective(profile,'logic'),'extension');assert.equal(P.effective(profile,'materials'),'guided');
 P.suggest(questions,correct);assert.equal(profile.level,'guided');
});
test('imports discard unknown fields, invalid levels and duplicate ids',()=>{
 const clean=P.sanitize({activeId:'1',profiles:[
  {id:'1',name:' A01 ',level:'unknown',domains:{logic:'extension',materials:'wrong'},supports:{shortText:true,unwanted:true},attempts:[{domain:'logic',date:'2026-09-28',answers:[0,1]}],privateNote:'never stored'},
  {id:'1',name:'Duplicate',level:'standard'}
 ]});
 assert.equal(clean.profiles.length,1);assert.equal(clean.profiles[0].name,'A01');
 assert.equal(clean.profiles[0].level,'standard');assert.equal(clean.profiles[0].domains.logic,'extension');
 assert.equal(clean.profiles[0].domains.materials,null);assert.equal(clean.profiles[0].privateNote,undefined);
 assert.deepEqual(Object.keys(clean.profiles[0].supports),['shortText','stepByStep','hideSolution']);
});
