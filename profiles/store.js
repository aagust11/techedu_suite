(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.TechEduProfiles=api;
})(typeof globalThis==='object'?globalThis:this,function(){
  const KEY='techedu.profiles.v1', LEVELS=['guided','standard','extension'];
  const DOMAINS=['logic','mechanisms','electricity','materials','communications'];
  const labels={guided:'Més pautes',standard:'Autonomia habitual',extension:'Ampliació'};
  const defaults=()=>({version:1,metaRevision:0,activeId:null,profiles:[]});
  function safeJSON(value){
    if(value===null||typeof value!=='object')return true;
    return Object.entries(value).every(([key,v])=>!['__proto__','prototype','constructor'].includes(key)&&safeJSON(v));
  }
  function cleanWork(work){
    if(!work||typeof work!=='object'||Array.isArray(work))return {};
    const result={};
    for(const key of ['logic','problems','materials','mechanisms','test-logic','test-mechanisms','test-electricity','test-materials','communications','test-communications','communications-digitization','communications-encoding','communications-errors','communications-packets','drawings','drawing-gallery','circuits','worksheet','structures',...['drawings','circuits','structures','worksheet','logic','materials','mechanisms','problems','communications','communications-encoding','communications-digitization','communications-errors','communications-packets'].map(k=>'journey-'+k)]){
      const w=work[key];
      if(w&&typeof w==='object'&&Number.isInteger(w.revision)&&w.revision>=0&&JSON.stringify(w).length<500000&&safeJSON(w)){
        result[key]={revision:w.revision,updatedAt:typeof w.updatedAt==='string'?w.updatedAt:'',draft:w.draft&&typeof w.draft==='object'?w.draft:null,history:Array.isArray(w.history)?w.history.filter(x=>x&&typeof x.at==='string'&&x.draft&&typeof x.draft==='object').slice(-12):[],events:Array.isArray(w.events)?w.events.slice(-200):[]};
      }
    }
    return result;
  }
  function cleanProfile(p){
    if(!p||typeof p!=='object'||typeof p.id!=='string'||typeof p.name!=='string')return null;
    const name=p.name.trim().slice(0,60);if(!name)return null;
    const level=LEVELS.includes(p.level)?p.level:'standard';
    const domains=Object.fromEntries(DOMAINS.map(d=>[d,LEVELS.includes(p.domains?.[d])?p.domains[d]:null]));
    const supports={shortText:!!p.supports?.shortText,stepByStep:!!p.supports?.stepByStep,hideSolution:!!p.supports?.hideSolution};
    const attempts=Array.isArray(p.attempts)?p.attempts.filter(a=>DOMAINS.includes(a.domain)&&Array.isArray(a.answers)&&typeof a.date==='string').slice(-40).map(a=>({domain:a.domain,date:a.date.slice(0,30),answers:a.answers.slice(0,12).map(x=>Number.isInteger(x)?x:-1),questionIds:Array.isArray(a.questionIds)?a.questionIds.slice(0,12).map(String):null,bankVersion:a.bankVersion||1})):[];
    return {id:p.id.slice(0,100),name,course:p.course==='batx'?'batx':'eso',level,domains,supports,attempts,work:cleanWork(p.work)};
  }
  function sanitize(data){
    const profiles=(Array.isArray(data?.profiles)?data.profiles:[]).slice(0,100).map(cleanProfile).filter(Boolean);
    const unique=profiles.filter((p,i)=>profiles.findIndex(x=>x.id===p.id)===i);
    const activeId=unique.some(p=>p.id===data?.activeId)?data.activeId:null;
    return {version:1,metaRevision:Number.isInteger(data?.metaRevision)?data.metaRevision:0,activeId,profiles:unique};
  }
  function load(){
    try{return sanitize(JSON.parse(localStorage.getItem(KEY)))}catch{return defaults()}
  }
  function save(data,replaceWork=false){
    const clean=sanitize(data);
    if(!replaceWork){const raw=localStorage.getItem(KEY),latest=raw?sanitize(JSON.parse(raw)):defaults();if(clean.metaRevision!==latest.metaRevision)throw Error('Els perfils han canviat en una altra pestanya. Recarrega abans de continuar.');for(const p of clean.profiles){const old=latest.profiles.find(x=>x.id===p.id);if(old)p.work=old.work;}}
    if(replaceWork){const latest=load();for(const p of clean.profiles)for(const [activity,w] of Object.entries(p.work))w.revision=Math.max(w.revision,latest.profiles.find(x=>x.id===p.id)?.work?.[activity]?.revision||0)+1;}
    clean.metaRevision=(replaceWork?load().metaRevision:clean.metaRevision)+1;
    localStorage.setItem(KEY,JSON.stringify(clean));
    if(typeof window!=='undefined')window.dispatchEvent(new Event('techedu-profile-change'));
    return clean;
  }
  function active(data=load()){return data.profiles.find(p=>p.id===data.activeId)||null}
  function effective(profile,domain){return profile?.domains?.[domain]||profile?.level||'standard'}
  function suggest(questions,answers){
    const correct=questions.map((q,i)=>answers[i]===q.correct);
    const basic=questions.reduce((n,q,i)=>n+(q.tier===1&&correct[i]?1:0),0);
    const transfer=questions.reduce((n,q,i)=>n+(q.tier===3&&correct[i]?1:0),0);
    const score=correct.filter(Boolean).length;
    const level=score<=2?'guided':score>=5&&transfer===2?'extension':'standard';
    const needs=[...new Set(questions.filter((q,i)=>!correct[i]).map(q=>q.skill))];
    return {score,total:questions.length,basic,transfer,level,needs,skills:[...new Set(questions.map(q=>q.skill))].map(skill=>({skill,correct:questions.filter((q,i)=>q.skill===skill&&correct[i]).length,total:questions.filter(q=>q.skill===skill).length}))};
  }
  function readWork(id,activity){return load().profiles.find(p=>p.id===id)?.work?.[activity]||null}
  function writeWork(id,activity,value,revision){
    const raw=localStorage.getItem(KEY),data=raw?sanitize(JSON.parse(raw)):defaults();
    const p=data.profiles.find(p=>p.id===id);if(!p)throw Error('El perfil ja no existeix.');
    if((p.work[activity]?.revision||0)!==revision)throw Error('Hi ha canvis en una altra pestanya. Recarrega abans de continuar.');
    const record={...value,revision:revision+1,updatedAt:new Date().toISOString()};
    if(JSON.stringify(record).length>=500000)throw Error('El treball supera la mida disponible per activitat.');
    p.work[activity]=record;localStorage.setItem(KEY,JSON.stringify(data));return record;
  }
  function finishTest(id,domain,attempt,revision,metaRevision){
    const raw=localStorage.getItem(KEY),data=raw?sanitize(JSON.parse(raw)):defaults(),p=data.profiles.find(x=>x.id===id),activity='test-'+domain;
    if(!p||!DOMAINS.includes(domain))throw Error('Perfil o prova no disponible.');
    if(data.metaRevision!==metaRevision||(p.work[activity]?.revision||0)!==revision)throw Error('La prova o el perfil ha canviat en una altra pestanya. No s’ha esborrat l’esborrany. Recarrega.');
    p.attempts.push(attempt);p.attempts=p.attempts.slice(-40);p.work[activity]={revision:revision+1,updatedAt:new Date().toISOString(),draft:null,history:[],events:[]};data.metaRevision++;
    const clean=sanitize(data);localStorage.setItem(KEY,JSON.stringify(clean));return clean;
  }
  return {finishTest,readWork,writeWork,KEY,LEVELS,DOMAINS,labels,defaults,sanitize,load,save,active,effective,suggest};
});
