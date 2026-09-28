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
const TechEduAlternates={
 logic:[
 [1,'operadors','Amb A=0, quant val !A?',['0','1','No es pot saber'],1],
 [1,'taules de veritat','Quina entrada fa que A | B sigui 0?',['0,0','0,1','1,1'],0],
 [2,'operadors','Amb A=1 i B=0, quant val A & !B?',['0','1','2'],1],
 [2,'prioritat i parèntesis','Amb A=0 i B=0, quant val !(A | B)?',['0','1','Depèn de C'],1],
 [3,'equivalència','Quina expressió equival a !(A & B)?',['!A & !B','!A | !B','A | B'],1],
 [3,'simplificació','Quina expressió equival a (A | B) & (A | !B)?',['A','B','!A'],0]],
 mechanisms:[
 [1,'elements','Quin element uneix dues politges per transmetre el moviment?',['Corretja','Biga','Fulcre'],0],
 [1,'sentit de gir','Tres engranatges exteriors consecutius: el primer i el tercer giren…',['Igual','En sentit contrari','No giren'],0],
 [2,'relació de transmissió','Una roda de 40 dents mou una de 20. La conduïda gira…',['El doble','La meitat','Igual'],0],
 [2,'eixos','Una roda gira a 90 rpm. Una altra fixada al seu mateix eix gira a…',['45 rpm','90 rpm','180 rpm'],1],
 [3,'càlcul','Una motriu de 30 dents gira a 200 rpm. Quantes dents necessita la conduïda per girar a 100 rpm?',['15','30','60'],2],
 [3,'tren compost','Dos parells successius redueixen cadascun la velocitat a la meitat. Amb 400 rpm d’entrada, la sortida té…',['100 rpm','200 rpm','400 rpm'],0]],
 electricity:[
 [1,'magnituds','En quina unitat mesurem la intensitat del corrent?',['Volt','Ampere','Ohm'],1],
 [1,'circuit tancat','Una bombeta ideal s’encén quan el circuit amb la pila està…',['Obert','Tancat','Sense connexió a la pila'],1],
 [2,'llei d’Ohm','Una resistència de 6 Ω està connectada a 12 V. Intensitat?',['0,5 A','2 A','72 A'],1],
 [2,'energia útil','Una màquina rep 250 J i en dissipa 50 J. Energia útil?',['200 J','300 J','50 J'],0],
 [3,'variació de variables','Amb R constant, reduïm V a la meitat. Què passa amb I?',['Es duplica','Es manté','Es redueix a la meitat'],2],
 [3,'rendiment','Cal obtenir 180 J útils amb un rendiment del 60%. Quina energia d’entrada cal?',['108 J','240 J','300 J'],2]],
 materials:[
 [1,'propietats','Quina propietat mesura la resistència a ser ratllat?',['Duresa','Densitat','Transparència'],0],
 [1,'conductivitat','Per recobrir un cable elèctric, quin material triaries?',['Coure','Plàstic aïllant','Alumini'],1],
 [2,'comparació','Dues peces tenen el mateix volum. A té densitat 2700 i B 7800 kg/m³. Quina té menys massa?',['A','B','Igual'],0],
 [2,'requisits','Per a un mànec que toca una olla calenta, quin criteri prioritzes?',['Alta conductivitat tèrmica','Baixa conductivitat tèrmica','Transparència'],1],
 [3,'compromisos','Una peça lleugera es deforma massa. Quina modificació cal estudiar mantenint el límit de massa?',['Canviar secció i comparar rigidesa i massa','Triar sempre el material més dens','Canviar només el color'],0],
 [3,'comparació justa','Vols comparar materials amb una prova de flexió. Què mantens igual?',['Només el color','Geometria, suports i càrrega','Només la massa'],1]]
};
for(const [domain,bank] of Object.entries(TechEduBank)){
 bank.questions.forEach((q,i)=>q.id=domain+'-a-'+i);
 bank.alternates=TechEduAlternates[domain].map(([tier,skill,text,options,correct],i)=>({id:domain+'-b-'+i,tier,skill,text,options,correct}));
 bank.version=2;
 bank.resolve=ids=>ids?ids.map(id=>[...bank.questions,...bank.alternates].find(q=>q.id===id)).filter(Boolean):bank.questions;
}
if(typeof module==='object'&&module.exports)module.exports=TechEduBank;
