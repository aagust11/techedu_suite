# StructureLab: abast i verificació

## Models disponibles

Biga de llum L, articulació A i corró B, càrrega puntual vertical P situada a distància a d'A. Sense pes propi, càrregues distribuïdes ni moments aplicats. Equilibri estàtic pla:

- RA = P(L − a)/L; RB = Pa/L.
- V = RA a l'esquerra de la càrrega, V = −RB a la dreta.
- M(x) = RA·x − P·max(0, x − a).
- M màxim = Pa(L − a)/L; moments nuls als recolzaments.

L'encavallada és triangular: A = (0,0), B = (L,0), C = (a,h), barres articulades AC, BC i AB. La càrrega actua al nus C. Amb esforç axial positiu de tracció:

- N_AC = −RA·sqrt(a²+h²)/h.
- N_BC = −RB·sqrt((L−a)²+h²)/h.
- N_AB = RA·a/h.

El càlcul no s'estén a encavallades arbitràries ni a unions rígides. La geometria visual de l'encavallada és esquemàtica, no a escala.

## Separació entre il·lustració i càlcul

El traç discontinu de la biga és una corba il·lustrativa regulada per un control sense unitats. No és una solució elàstica. No es calcula fletxa, tensió, deformació de barres, vinclament ni càrrega de ruptura. No hi ha dades de material ni de secció.

Els diagrames d'esforços es normalitzen visualment per mostrar la forma. Per comparar magnituds cal activar els valors numèrics. L'encavallada mostra signe i tipus d'esforç també amb text, a més del color.

## Verificació

`tests/structures.test.js` comprova casos centrats i excèntrics, càrrega nul·la, suma de forces, moments de recolzament, valor màxim i equilibri horitzontal/vertical dels tres nusos. També comprova que el control il·lustratiu no canvia el càlcul i que es rebutgen entrades fora de rang.

Això és verificació del model educatiu acotat; no és validació experimental ni certificació per dimensionar estructures.

Referència de contrast del mètode dels nusos: [Engineering Statics: Open and Interactive, Baker i Haynes, 6.4](https://eng.libretexts.org/Bookshelves/Mechanical_Engineering/Engineering_Statics%3A_Open_and_Interactive_%28Baker_and_Haynes%29/06%3A_Equilibrium_of_Structures/6.04%3A_Method_of_Joints). El codi, diagrames i proves són implementació pròpia.
