// A single physical model drives the statement, the drawing and the export.
(function(root, factory) {
  const api=factory();
  if(typeof module==='object' && module.exports) module.exports=api;
  else root.LeverModel=api;
})(typeof globalThis==='object'?globalThis:this,function() {
  function create(genre, power, bp, br) {
    if(![1,2,3].includes(genre)||![power,bp,br].every(x=>Number.isFinite(x)&&x>0)) throw Error('Dades de palanca no vàlides.');
    if(genre===2 && bp<=br || genre===3 && bp>=br) throw Error('Els braços no corresponen al gènere.');
    const fulcrum=0, p=genre===1?-bp:bp, r=br;
    return {genre,power,bp,br,resistance:power*bp/br,fulcrum,p,r};
  }
  function geometry(model) {
    const min=Math.min(0,model.p,model.r),max=Math.max(0,model.p,model.r),span=max-min;
    const x=v=>Math.round(100+(v-min)/span*560);
    return {start:x(min),end:x(max),fulcrum:x(0),power:x(model.p),resistance:x(model.r)};
  }
  const num=n=>Number(n.toFixed(2)).toLocaleString('ca-ES',{maximumFractionDigits:2});
  function svg(model) {
    const g=geometry(model),pUp=model.genre!==1,rUp=false;
    const arrow=(x,up,color,label)=>'<path d="M'+x+' '+(up?113:53)+' V'+(up?59:107)+'" stroke="'+color+'" stroke-width="3" marker-end="url(#'+(up?'up':'down')+')"/><text x="'+x+'" y="'+(up?132:43)+'" fill="'+color+'" text-anchor="middle" font-size="17" font-weight="700">'+label+'</text>';
    const bracket=(x1,x2,y,label)=>'<path d="M'+x1+' '+(y-7)+'v14 M'+x1+' '+y+'H'+x2+' M'+x2+' '+(y-7)+'v14" fill="none" stroke="#69808a" stroke-width="1.5"/><text x="'+((x1+x2)/2)+'" y="'+(y+21)+'" text-anchor="middle" font-size="13" fill="#40545e">'+label+'</text>';
    return '<svg class="lever-diagram" role="img" aria-label="Palanca de '+model.genre+'r gènere: fulcre, potència i resistència amb els braços corresponents" viewBox="0 0 760 235" xmlns="http://www.w3.org/2000/svg"><defs><marker id="down" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#b34d2e"/></marker><marker id="up" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 8 L8 4 L0 0 Z" fill="#b34d2e"/></marker></defs><path d="M'+g.start+' 112 H'+g.end+'" stroke="#254b59" stroke-width="13" stroke-linecap="round"/><path d="M'+g.fulcrum+' 122 l-20 34 h40 Z" fill="#d8e9e1" stroke="#254b59" stroke-width="2"/><text x="'+g.fulcrum+'" y="174" text-anchor="middle" font-size="13" fill="#254b59">Fulcre</text>'+arrow(g.power,pUp,'#b34d2e','P = '+num(model.power)+' N')+arrow(g.resistance,rUp,'#b34d2e','R = ?')+bracket(Math.min(g.fulcrum,g.power),Math.max(g.fulcrum,g.power),190,'bₚ = '+num(model.bp)+' m')+bracket(Math.min(g.fulcrum,g.resistance),Math.max(g.fulcrum,g.resistance),218,'bᵣ = '+num(model.br)+' m')+'</svg>';
  }
  return {create,geometry,svg,num};
});
