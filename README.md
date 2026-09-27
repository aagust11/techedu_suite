# TechEdu Suite

Suite modular d'eines educatives per a Tecnologia i Digitalització (ESO i Batxillerat).

## Mòduls

- **TechDrawings** — editor vectorial d'esquemes tecnològics. Operatiu i en evolució.
- **MechanismLab / GearLab** — simulador de mecanismes i transmissions. Motor existent reutilitzat.
- **TechProblems** — generació paramètrica de problemes. Següent mòdul.
- **TechLab** — laboratoris guiats i simulacions.
- **TechWorksheet** — construcció de fitxes i activitats.
- **LogicLab** — àlgebra de Boole, Karnaugh i portes.
- **CircuitLab** — circuits elèctrics educatius.
- **StructureLab** — estructures, càrregues i esforços.
- **MaterialsLab** — propietats i selecció de materials.

## Principis d'arquitectura

No duplicar motors que ja existeixen. TechDrawings serà el motor gràfic reutilitzable i GearLab el punt de partida del mòdul de mecanismes. Els mòduls nous compartiran models de dades, components visuals i formats d'exportació.

La portada és una aplicació estàtica compatible amb GitHub Pages.

## Projectes relacionats

- TechDrawings: https://github.com/aagust11/techdrawings
- GearLab: https://github.com/aagust11/dev_gearlab

Creat per Àngel AC.
