# TechEdu Suite

Suite modular d'eines educatives per a Tecnologia i Digitalització (ESO i Batxillerat).

## Mòduls

- **Perfils i proves de nivell** — àlies locals, grau de pauta general i per àmbit, preferències de presentació, quatre proves inicials breus i historial revisable. Les recomanacions no canvien el perfil fins que el docent les aplica.

- **TechDrawings** — còpia integrada de l'editor vectorial d'esquemes tecnològics. La palanca es pot editar per gènere i braços físics en metres, o manualment per les posicions de fulcre, P i R. TechProblems hi obre directament la palanca generada.
- **MechanismLab / GearLab** — simulador de mecanismes i transmissions. Motor existent reutilitzat.
- **TechProblems** — problemes paramètrics amb raonament guiat. Les palanques tenen esquema coherent amb el gènere, els braços i l'equilibri de moments.
- **TechLab** — laboratoris guiats i simulacions.
- **TechWorksheet** — construcció de fitxes i activitats.
- **LogicLab** — expressions de fins a cinc variables, comparació, contraexemples i taules de veritat. Per a dues a quatre variables mostra Karnaugh, agrupacions i expressió mínima en suma de productes. El mode docent oculta també les agrupacions i el veredicte.
- **CircuitLab** — circuits elèctrics educatius.
- **StructureLab** — estructures, càrregues i esforços.
- **MaterialsLab** — propietats i selecció de materials.

## Principis d'arquitectura

No duplicar motors que ja existeixen. TechDrawings serà el motor gràfic reutilitzable i GearLab el punt de partida del mòdul de mecanismes. Els mòduls nous compartiran models de dades, components visuals i formats d'exportació.

La portada és una aplicació estàtica compatible amb GitHub Pages. LogicLab i TechProblems no necessiten serveis externs.

## Perfils i privacitat

Els perfils es desen amb `localStorage` al mateix navegador i origen de GitHub Pages. No hi ha comptes, servidor de dades ni sincronització automàtica. Es poden exportar i importar com a JSON i eliminar des de l'editor. En ordinadors compartits, utilitza àlies o codis: altres persones que facin servir el mateix navegador podrien veure les dades locals. La neteja de dades del navegador les pot esborrar; exporta una còpia si cal conservar-les.

Els quatre àmbits de la prova són lògica, mecanismes, electricitat i materials. Cadascun té sis preguntes (dues de reconeixement, dues d'aplicació i dues de transferència). La proposta de nivell és una orientació de treball, no una mesura validada de capacitat ni un diagnòstic. El docent pot establir un nivell general i ajustar cada àmbit de forma independent: més pautes, autonomia habitual o ampliació. LogicLab, TechProblems, MaterialsLab i MechanismLab llegeixen el perfil actiu i presenten itineraris diferents.

## Sintaxi de LogicLab

Variables `A`–`E`, constants `0` i `1`, negació `!`, conjunció `&`, disjunció `|` i parèntesis. Exemples: `!(A & B)` i `!A | !B`. El mapa enumera les cel·les en ordre Gray, inclou agrupacions que continuen per la vora oposada i permet ressaltar cada grup amb el cursor o el teclat. Amb cinc variables es mostra la taula i la comparació, sense mapa.

## Projectes relacionats

- TechDrawings: https://github.com/aagust11/techdrawings
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

Verificació: `node --test tests/*.test.js` (16 proves). Amb Playwright instal·lat i servidor local: `node tests/browser-signals.cjs` i `node tests/browser-digital.cjs`; `BASE_URL` per defecte `http://localhost:8766`. Comproven canvis de perfil, desament, mostreig, UTF-8, transferència del byte, píxels, resultats ocults i amplada mòbil. `tests/browser-progress.cjs` verifica els mòduls previs.
