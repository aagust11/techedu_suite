# TechEdu Suite

Suite modular d'eines educatives per a Tecnologia i Digitalització (ESO i Batxillerat).

## Mòduls

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

## Sintaxi de LogicLab

Variables `A`–`E`, constants `0` i `1`, negació `!`, conjunció `&`, disjunció `|` i parèntesis. Exemples: `!(A & B)` i `!A | !B`. El mapa enumera les cel·les en ordre Gray, inclou agrupacions que continuen per la vora oposada i permet ressaltar cada grup amb el cursor o el teclat. Amb cinc variables es mostra la taula i la comparació, sense mapa.

## Projectes relacionats

- TechDrawings: https://github.com/aagust11/techdrawings
- GearLab: https://github.com/aagust11/dev_gearlab

Creat per Àngel AC.
