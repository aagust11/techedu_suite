(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.TechEduProfiles=api;
})(typeof globalThis==='object'?globalThis:this,function(){
  const KEY='techedu.profiles.v1', LEVELS=['guided','standard','extension'];
  const DOMAINS=['logic','mechanisms','electricity','materials'];
  const labels={guided:'Més pautes',standard:'Autonomia habitual',extension:'Ampliació'};
  const defaults=()=>({version:1,activeId:null,profiles:[]});
  function cleanProfile(p){
    if(!p||typeof p!=='object'||typeof p.id!=='string'||typeof p.name!=='string')return null;
    const name=p.name.trim().slice(0,60);if(!name)return null;
    const level=LEVELS.includes(p.level)?p.level:'standard';
    const domains=Object.fromEntries(DOMAINS.map(d=>[d,LEVELS.includes(p.domains?.[d])?p.domains[d]:null]));
    const supports={shortText:!!p.supports?.shortText,stepByStep:!!p.supports?.stepByStep,hideSolution:!!p.supports?.hideSolution};
    const attempts=Array.isArray(p.attempts)?p.attempts.filter(a=>DOMAINS.includes(a.domain)&&Array.isArray(a.answers)&&typeof a.date==='string').slice(-40).map(a=>({domain:a.domain,date:a.date.slice(0,30),answers:a.answers.slice(0,12).map(x=>Number.isInteger(x)?x:-1)})):[];
    return {id:p.id.slice(0,100),name,level,domains,supports,attempts};
  }
  function sanitize(data){
    const profiles=(Array.isArray(data?.profiles)?data.profiles:[]).slice(0,100).map(cleanProfile).filter(Boolean);
    const unique=profiles.filter((p,i)=>profiles.findIndex(x=>x.id===p.id)===i);
    const activeId=unique.some(p=>p.id===data?.activeId)?data.activeId:null;
    return {version:1,activeId,profiles:unique};
  }
  function load(){
    try{return sanitize(JSON.parse(localStorage.getItem(KEY)))}catch{return defaults()}
  }
  function save(data){
    const clean=sanitize(data);
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
    const level=basic<2||score<=2?'guided':score>=5&&transfer===2?'extension':'standard';
    const needs=[...new Set(questions.filter((q,i)=>!correct[i]).map(q=>q.skill))];
    return {score,total:questions.length,basic,transfer,level,needs};
  }
  return {KEY,LEVELS,DOMAINS,labels,defaults,sanitize,load,save,active,effective,suggest};
});
