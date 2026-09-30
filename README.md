# TechEdu Suite

Suite modular d'eines educatives per a Tecnologia i Digitalització (ESO i Batxillerat).

## Mòduls

- **El meu compte (espai transversal)** — àlies locals, grau de pauta general i per àmbit, preferències de presentació, cinc proves inicials breus i historial revisable. Les recomanacions no canvien el perfil fins que el docent les aplica.

- **Tecnofigures** — còpia integrada de l'editor vectorial d'esquemes tecnològics. La palanca es pot editar per gènere i braços físics en metres, o manualment per les posicions de fulcre, P i R. TechProblems hi obre directament la palanca generada.
- **MechanismLab / GearLab** — simulador de mecanismes i transmissions. Motor existent reutilitzat.
- **TechProblems** — problemes paramètrics amb raonament guiat. Les palanques tenen esquema coherent amb el gènere, els braços i l'equilibri de moments.
- **TechLab** — laboratoris guiats i simulacions.
- **TechWorksheet** — construcció de fitxes i activitats.
- **LogicLab** — expressions de fins a cinc variables, comparació, contraexemples i taules de veritat. Per a dues a quatre variables mostra Karnaugh, agrupacions i expressió mínima en suma de productes. El mode docent oculta també les agrupacions i el veredicte.
- **CircuitLab** — circuits elèctrics educatius.
- **StructureLab** — estructures, càrregues i esforços.
- **MaterialsLab** — propietats i selecció de materials.

## Principis d'arquitectura

No duplicar motors que ja existeixen. Tecnofigures serà el motor gràfic reutilitzable i GearLab el punt de partida del mòdul de mecanismes. Els mòduls nous compartiran models de dades, components visuals i formats d'exportació.

La portada és una aplicació estàtica compatible amb GitHub Pages. LogicLab i TechProblems no necessiten serveis externs.

## Perfils i privacitat

Els perfils es desen amb `localStorage` al mateix navegador i origen de GitHub Pages. Els comptes són locals; no hi ha autenticació remota, servidor de dades ni sincronització automàtica. Es poden exportar i importar com a JSON i eliminar des de l'editor. En ordinadors compartits, utilitza àlies o codis: altres persones que facin servir el mateix navegador podrien veure les dades locals. La neteja de dades del navegador les pot esborrar; exporta una còpia si cal conservar-les.

Els cinc àmbits de la prova són lògica, mecanismes, electricitat, materials i comunicacions. Cadascun té sis preguntes (dues de reconeixement, dues d'aplicació i dues de transferència). La proposta de nivell és una orientació de treball, no una mesura validada de capacitat ni un diagnòstic. El docent pot establir un nivell general i ajustar cada àmbit de forma independent: més pautes, autonomia habitual o ampliació. LogicLab, TechProblems, MaterialsLab i MechanismLab llegeixen el perfil actiu i presenten itineraris diferents.

## Sintaxi de LogicLab

Variables `A`–`E`, constants `0` i `1`, negació `!`, conjunció `&`, disjunció `|` i parèntesis. Exemples: `!(A & B)` i `!A | !B`. El mapa enumera les cel·les en ordre Gray, inclou agrupacions que continuen per la vora oposada i permet ressaltar cada grup amb el cursor o el teclat. Amb cinc variables es mostra la taula i la comparació, sense mapa.

## Projectes relacionats

- Tecnofigures: https://github.com/aagust11/techdrawings
- GearLab: https://github.com/aagust11/dev_gearlab

Creat per Àngel AC.


### Treball local per perfil

LogicLab, TechProblems, MaterialsLab i MechanismLab conserven l’esborrany del perfil actiu: respostes, retorn, prediccions, conclusions i configuració/escena. Sense perfil no hi ha desament persistent. «Desa com a evidència» conserva una instantània recuperable (12 darreres per mòdul); generar nous problemes arxiva el treball anterior. Els intents de comprovació i canvis de suport tenen un registre limitat a 200 esdeveniments per mòdul. El quadern i les proves en curs viatgen amb l’exportació JSON dels perfils. La importació substitueix les dades locals amb confirmació.

Els errors de quota i els conflictes detectats amb altres pestanyes es mostren sense indicar un desament reeixit. Els perfils anteriors són compatibles. No hi ha sincronització remota ni diagnòstic psicomètric: les dues versions de cada prova inicial orienten el docent, que decideix si aplica la proposta. Els suports es poden combinar amb els reptes d’ampliació.

Validació: `node --test tests/*.test.js`. La regressió de navegador és a `tests/browser-progress.cjs`; necessita Playwright disponible (o `PLAYWRIGHT_MODULE` amb el camí del mòdul) i un servidor local, per defecte a `http://localhost:8765` (`BASE_URL` configurable).


### CommunicationsLab: senyals, digitalització i codificació

- `modules/communications/`: sinusoide analògica o bits NRZ, guany del canal, soroll determinista i interferència periòdica. El receptor llegeix al centre de cada bit amb un llindar ajustable. Comparació A/B amb el mateix soroll, recompte d’errors de la prova i activitats per nivell.
- `modules/communications/digitization.html`: captura de 2 segons, freqüència de mostreig, fase, amplitud i 1–8 bits per mostra. Gràfic de mostres, quantificació uniforme, sortida mantinguda i ona compatible en casos d’aliasing. Mostra la mida de les dades, l’error de quantificació i una comparació A/B.
- `modules/communications/encoding.html`: UTF-8 real amb accents, emojis i combinacions Unicode; edició de bits i descodificació estricta. Un byte original es pot portar al canal mitjançant el fragment de l’URL, sense enviar-lo al servidor. Editor de 8 × 8 píxels amb 1, 2, 4 o 8 bits de gris, reconstrucció i mida sense capçalera.

Els tres laboratoris comparteixen el perfil d’àmbit «TIC i comunicacions», però tenen esborranys i evidències independents. Les proves inicials d’aquest àmbit comproven els fonaments del senyal i el canal. Els models expliciten les simplificacions: canal ideal en banda base, lectura sincronitzada, soroll sintètic, absència de filtres antialiasing, i sortida mantinguda que no s’ha de confondre amb una reconstrucció ideal. La codificació no és compressió ni xifrat.

Verificació: `node --test tests/*.test.js`. Amb Playwright instal·lat i servidor local: `node tests/browser-signals.cjs` i `node tests/browser-digital.cjs`; `BASE_URL` per defecte `http://localhost:8766`. Comproven canvis de perfil, desament, mostreig, UTF-8, transferència del byte, píxels, resultats ocults i amplada mòbil. `tests/browser-progress.cjs` verifica els mòduls previs.


### Fiabilitat i repte final

`modules/communications/errors.html` compara paritat parella global, suma de bytes mòdul 256 i absència de protecció. La funció del receptor rep únicament la trama i el mètode acordat; la comparació amb l’original és una vista d’observador separada. Permet alterar dades o control i reproduir col·lisions de paritat i suma. No és correcció d’errors ni criptografia.

`modules/communications/packets.html` fragmenta text UTF-8, afegeix capçaleres, permet pèrdues, alteracions, retard variable, reordenació i reenviaments per rondes. Compta totes les trames i confirmacions; les capçaleres i les confirmacions són fiables i només es corromp un bit de dades per paquet, segons el model explicat a la pàgina. La paritat detecta totes aquestes alteracions d’un bit; no cal extrapolar-ho a errors múltiples. El repte final fixa el canal i comprova tres patrons amb límits de 900 bits i 5 segons. Hi ha solucions verificades; p. ex., paquets de 6 bytes amb checksum i 2 reintents.

Revisió funcional: les proves inicials es desen atòmicament amb el tancament de l’esborrany; un conflicte o una quota exhaurida no esborren les respostes. Els canvis de treball en una altra pestanya ja no reconstrueixen innecessàriament les activitats i no fan desaparèixer retorns. La importació rebutja perfils invàlids o duplicats abans de substituir dades. La taula de materials expressa el comportament elèctric qualitativament i elimina puntuacions sense escala; distingeix mòdul de Young i rigidesa d’una peça. Les palanques transferides obren l’inspector directament.

Validació ampliada: 23 proves Node i `tests/browser-reliability.cjs`, `tests/browser-suite-review.cjs` (BASE_URL per defecte localhost:8767), més les regressions dels laboratoris anteriors. La revisió cobreix entrades operatives, dibuixos i exportació JSON, transferència de palanques, perfils, materials, exportació/importació, conflictes de pestanyes, fallada de quota i recuperació de proves. La inspecció visual cobreix els nous laboratoris en escriptori i mòbil.

## Compte de suite i itineraris educatius

El perfil s’obre des d’**El meu compte**, a la capçalera comuna, i ja no és una eina del catàleg. `/account/` concentra la configuració, les proves de fonaments, el treball i les còpies JSON. `/profiles/` redirigeix al compte. És un compte local sense contrasenya, servidor ni sincronització.

El curs (`eso` o `batx`) és independent del grau de pauta (`guided`, `standard`, `extension`) i dels suports. Els perfils anteriors passen a ESO conservant treball i proves. Materials, problemes, mecanismes i Tecnofigures parteixen de 3r d’ESO. Lògica i els cinc laboratoris de comunicacions tenen recorreguts ESO i Batxillerat. L’ampliació ESO proposa transferència i comparació dins del mateix nivell; no assigna automàticament contingut de Batxillerat. Les proves inicials són de fonaments ESO, no acrediten un nivell de Batxillerat.

**Tecnofigures** és el nom del mòdul abans anomenat TechDrawings. Es conserva `/modules/drawings/` per no trencar enllaços. Cada compte guarda el seu dibuix, inclòs en la còpia JSON. El dibuix global anterior continua disponible com a Visitant amb la clau històrica `techdrawings.v1`; es pot exportar i importar al compte desitjat.

Totes les pantalles comparteixen `shared/suite.css`, capçalera, menú de compte, colors, controls de focus i guies del curs. Les eines especialitzades mantenen el seu espai de treball. Els continguts d’aprofundiment (Karnaugh, Young i repte de transmissió) s’identifiquen i es despleguen separadament del recorregut inicial.

Validació del compte i dels itineraris: `tests/browser-account.cjs` comprova migració, independència entre curs i suports, reptes ESO/Batxillerat, separació dels dibuixos entre comptes, exportació i amplada mòbil de totes les pantalles. Sis recorreguts de navegador en total.

El menú **El meu compte** permet canviar ràpidament l’itinerari ESO/Batxillerat i el grau de pauta. Dins d’un àmbit canvia la seva orientació, amb l’opció de tornar a heretar el nivell general; a la portada i al compte ajusta el nivell general. El canvi s’aplica al moment i es desa localment, conserva el treball en curs i mostra un error si no es pot desar. `tests/browser-quicklevel.cjs` verifica persistència, abast, herència, canvi de compte i fallades de quota.

### Edició de Tecnofigures
Les etiquetes de les peces es poden arrossegar independentment (incloses P, R, fulcre i braços de la palanca); mantenen el desplaçament relatiu quan es mou la peça. L’inspector permet restablir-les. Els eixos tenen longituds horitzontal i vertical editables. Les palanques permeten ocultar l’etiqueta del gènere i configurar P i R cap amunt o cap avall; P també conserva el mode automàtic segons el gènere. Aquests ajustos es desen amb el dibuix, admeten desfer/refer i es conserven als JSON i a les imatges exportades. El dibuix no valida l’equilibri de les forces.


### Cordes i elevació
Tecnofigures incorpora politges amb radi, longituds i angles de corda editables; polispasts de 2, 4, 6 o 8 politges amb separació entre blocs i extrem lliure configurables; cordes, ancoratges, caixes, ganxos i dinamòmetres esquemàtics. L'eina **Connecta** uneix punts de peces o extrems de cordes, i les unions segueixen les peces quan es mouen. L'inspector permet canviar o desconnectar cada extrem; eliminar una peça conserva la corda a la seva última posició. Les connexions es desen per compte i es conserven en exportar/importar JSON, desfer/refer i exportar imatges. Les palanques poden mostrar o ocultar una caixa al punt R.

Els exemples connectats serveixen per construir esquemes: no calculen tensió, equilibri ni moviment. La lectura del dinamòmetre és editable i no és una mesura simulada. Totes les pantalles comparteixen ara la navegació de mòduls, la capçalera de compte i els estils de controls, títols i panells.

Verificació específica: `tests/rigging.test.js` cobreix geometria, dependències i remapatge d'identificadors; `tests/browser-rigging.cjs` comprova edició, connexions, persistència, importació, caixa de la palanca i vista mòbil.


### CircuitLab i TechWorksheet

**CircuitLab** (`modules/circuits/`) permet configurar circuits de resistències en sèrie, paral·lel (2–4 resistències) i mixtos R1 + (R2 ∥ R3), amb font ideal de 0–48 V i interruptor. Mostra Req, I, P i mesures de cada resistència. Les activitats inclouen predicció, càlcul, comprovació amb tolerància d’arrodoniment i conclusió, amb pautes o ampliació segons el compte. Es poden ocultar les mesures, recuperar el circuit amb JSON i enviar una activitat amb esquema i solucionari a TechWorksheet. És un model de corrent continu amb resistències ideals positives: no és un editor de cablejat lliure, ni modela curtcircuits o components no òhmics.

**TechWorksheet** (`modules/worksheet/`) prepara una fitxa editable amb fins a 30 blocs: text, preguntes i imatges. Inclou plantilles d’electricitat, palanques, lògica i materials en tres variants de suport; permet reordenar, duplicar i eliminar blocs, editar les solucions i l’espai de resposta. Imprimeix una versió d’alumnat sense solucions o una versió docent, i permet desar com a PDF amb el diàleg del navegador. El JSON conserva l’edició completa, inclòs el solucionari. També rep esquemes des del menú Exporta de Tecnofigures. Les activitats afegides conserven la seva variant encara que després es canviï de nivell.

Cada mòdul conserva un esborrany per compte (i un de Visitant separat), inclòs en la còpia del compte. Per conservar diverses fitxes, exporta-les com a JSON. Hi ha control de mida, errors de quota i detecció de versions modificades en altres pestanyes. Les imatges s’incrusten i la fitxa completa es limita a uns 390 kB per garantir-ne el desament local.

Proves: `tests/builders.test.js` comprova càlculs, conservació de potència, plantilles i còpia de compte; `tests/browser-builders.cjs` verifica controls, transferències, edició, impressió sense solucions, JSON, comptes, conflictes i vista mòbil.

### Esforços: abans i després
A Tecnofigures → Esforços hi ha cinc peces comparatives de tracció, compressió, flexió, tall/cisallament i torsió. Cada peça permet mostrar abans, després o tots dos; ajustar longitud, gruix i deformació visual (0–100); ocultar forces/moments i superposar el contorn inicial. Les etiquetes es mouen independentment. Són deformacions esquemàtiques, no un model quantitatiu del material: el cisallament representa distorsió sense ruptura i la torsió el gir relatiu entre seccions. Les peces utilitzen el mateix desament, desfer/refer i exportació de l’editor. `tests/browser-efforts.cjs` verifica els cinc esforços, controls, persistència, SVG i amplada mòbil.

Els esforços inclouen línies interiors de material (3–13, ocultables) que segueixen la deformació. La compressió eixampla el centre i la tracció l’aprima com a representació didàctica exagerada. La torsió corba les línies segons el gir de les seccions. S’afegeix el vinclament: peça esvelta amb forces axials de compressió i curvatura lateral, diferenciada de la flexió per càrrega transversal. No es calcula la càrrega crítica ni el comportament d’un material real.
