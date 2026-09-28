// Each bank has two recognition, two application and two transfer items.
// These are classroom starting-point checks, not validated psychometric tests.
const TechEduBank={
 logic:{title:'Lògica i portes',questions:[
  {tier:1,skill:'operadors',text:'Quan A=1, quin valor té !A?',options:['0','1','Depèn de B'],correct:0},
  {tier:1,skill:'taules de veritat',text:'A & B val 1 quan…',options:['A o B val 1','A i B valen 1','A i B valen 0'],correct:1},
  {tier:2,skill:'operadors',text:'Amb A=0 i B=1, quant val A | B?',options:['0','1','No es pot saber'],correct:1},
  {tier:2,skill:'prioritat i parèntesis',text:'Amb A=1 i B=0, quant val !(A & B)?',options:['0','1','2'],correct:1},
  {tier:3,skill:'equivalència',text:'Quina expressió equival a !(A | B)?',options:['!A | !B','!A & !B','A & B'],correct:1},
  {tier:3,skill:'simplificació',text:'Quina és la forma més simple de (A & B) | (A & !B)?',options:['A','B','A & B'],correct:0}
 ]},
 mechanisms:{title:'Mecanismes i transmissió',questions:[
  {tier:1,skill:'elements',text:'Quina peça transmet el gir entre dues rodes dentades?',options:['Engranatge','Molla','Biga'],correct:0},
  {tier:1,skill:'sentit de gir',text:'Dues rodes dentades exteriors en contacte giren…',options:['En el mateix sentit','En sentits contraris','Sense relació'],correct:1},
  {tier:2,skill:'relació de transmissió',text:'Una roda de 20 dents mou una de 40. La segona gira…',options:['El doble de ràpid','A la meitat de velocitat','Igual'],correct:1},
  {tier:2,skill:'eixos',text:'Dues rodes solidàries al mateix eix tenen…',options:['Les mateixes rpm','El mateix nombre de dents','Sentits oposats'],correct:0},
  {tier:3,skill:'càlcul',text:'20 dents a 120 rpm mouen 40 dents. Quantes rpm té la segona?',options:['60','120','240'],correct:0},
  {tier:3,skill:'tren compost',text:'La roda 2 comparteix eix amb la 3. Si 2 gira a 60 rpm, 3 gira a…',options:['30 rpm','60 rpm','Depèn de les dents'],correct:1}
 ]},
 electricity:{title:'Electricitat i energia',questions:[
  {tier:1,skill:'magnituds',text:'Quina és la unitat de la resistència elèctrica?',options:['Volt','Ampere','Ohm'],correct:2},
  {tier:1,skill:'circuit tancat',text:'Si un interruptor en sèrie és obert, el corrent…',options:['No circula','Augmenta','No canvia'],correct:0},
  {tier:2,skill:'llei d’Ohm',text:'Amb R=4 Ω i I=2 A, quina tensió hi ha?',options:['2 V','6 V','8 V'],correct:2},
  {tier:2,skill:'energia útil',text:'Una màquina rep 100 J i lliura 80 J útils. Quant dissipa?',options:['20 J','80 J','180 J'],correct:0},
  {tier:3,skill:'variació de variables',text:'Amb tensió constant, si la resistència es duplica, el corrent…',options:['Es duplica','Es redueix a la meitat','Es manté'],correct:1},
  {tier:3,skill:'rendiment',text:'Una màquina rep 200 J i en lliura 150 J útils. Rendiment?',options:['25%','75%','133%'],correct:1}
 ]},
 materials:{title:'Materials i selecció',questions:[
  {tier:1,skill:'propietats',text:'Quina propietat indica la massa per unitat de volum?',options:['Densitat','Duresa','Elasticitat'],correct:0},
  {tier:1,skill:'conductivitat',text:'Per a un conductor elèctric, quin material és més adequat?',options:['Coure','Vidre','Fusta seca'],correct:0},
  {tier:2,skill:'comparació',text:'Per reduir massa d’una peça, què compares primer?',options:['Color','Densitat','Nom comercial'],correct:1},
  {tier:2,skill:'requisits',text:'Per a una finestra, quina propietat és imprescindible?',options:['Transparència','Conductivitat elèctrica','Magnetisme'],correct:0},
  {tier:3,skill:'compromisos',text:'Un material és més lleuger però menys rígid. Què cal comprovar?',options:['La funció i les càrregues','Només el preu','Només el color'],correct:0},
  {tier:3,skill:'comparació justa',text:'Dues bigues de materials diferents tenen gruixos diferents. Per comparar deformació cal considerar…',options:['Només el material','Material, geometria i càrrega','Només el pes'],correct:1}
 ]}
};
if(typeof module==='object'&&module.exports)module.exports=TechEduBank;
