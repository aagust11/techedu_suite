# Millores proposades per a TechEdu Suite

Revisió de la implementació del 30 de setembre de 2026. Actualització: la prioritat 1 i el primer StructureLab s’han implementat. Les ampliacions de prioritats 2 i 3 continuen pendents.

## Prioritat 1: implementada en aquesta etapa

| Àmbit | Situació observada | Millora i criteri d'acceptació |
| --- | --- | --- |
| Compte i portada | Hi ha compte local, nivell ràpid, esborranys i evidències per activitat. | «Continua treballant»: títol, mòdul, data i següent pas; obre el treball exacte i respecta el compte actiu. Mostrar projectes com a projectes, no com a zero evidències. |
| TechWorksheet | Combina preguntes, text i imatges; rep contingut d'altres mòduls. | Blocs amb origen editable: guardar una còpia del model de circuit/dibuix i poder tornar a editar-la. Confirmar qualsevol substitució i mantenir separats enunciat i solució. |
| Tota la suite | Hi ha estils comuns, però cada mòdul té controls propis. | Unificar ubicació i comportament de desar, exportar, ajuda, reiniciar i errors; mateix focus de teclat i missatges. Provar mòbil, teclat i ampliació del navegador. |
| Aprenentatge | Els itineraris i proves inicials ja diferencien pautes i ampliació. | Cada activitat: objectiu, predicció, prova, evidència i explicació. Afegir pistes graduades i autoavaluació; el docent continua decidint el grau de pauta. |

No deduir altes capacitats ni necessitats educatives d'un test breu. Guardar preferències i resultats per àmbit, revisables, separant curs, suport i domini observat.

## Prioritat 2: profunditat de cada mòdul

| Mòdul | Proposta concreta | Diferenciació |
| --- | --- | --- |
| Tecnofigures | Alinear, agrupar, bloquejar elements, duplicar conjunts amb connexions i exportar l'enquadrament. Control de resposta per etiqueta individual, a més del control actual per peça. | Plantilles incompletes amb pistes; construcció autònoma; anàlisi d'errors en un esquema. |
| CircuitLab | Amperímetre/voltímetre amb punts de mesura; avaries guiades (circuit obert i connexió errònia); després ampliar el model i el cablejat. Actualment resol resistències en sèrie, paral·lel i un circuit mixt definit. | Mesures guiades; predicció i comprovació; justificació amb Kirchhoff i potència a Batxillerat. |
| TechProblems | Resposta per passos, comprovació d'unitats, toleràncies explícites i pistes segons l'error. | Dades identificades; resolució autònoma; problemes inversos i disseny amb restriccions. |
| MechanismLab | Relacionar velocitat, sentit, relació de transmissió i parell en activitats guiades; explicitar hipòtesis i pèrdues del model abans d'afegir càrregues. | Predir el sentit; calcular relacions; optimitzar una transmissió. |
| MaterialsLab | Tria multicriteri amb pressupost, massa, rigidesa i impacte ambiental; dades amb unitats, font i rang d'aplicació. | Comparacions visuals; matriu de decisió; sensibilitat als pesos dels criteris. |
| LogicLab | Diagrama de portes sincronitzat amb expressió i taula; commutadors d'entrada i recorregut del senyal. | Completar una porta; expressió equivalent; minimització i comparació de circuits. |
| CommunicationsLab | Missió transversal: codifica un missatge, digitalitza, introdueix soroll, detecta errors i reconstrueix paquets. | Passos i representacions curtes; decisions autònomes; compromís entre qualitat, taxa i redundància. |
| TechWorksheet | Galeria de fitxes, rúbrica breu, versions equivalents amb dades diferents i revisió de salts de pàgina. | Mateix objectiu amb quantitat de pistes i profunditat ajustables. |

## Prioritat 3: nous laboratoris

- **StructureLab**: començar amb biga recolzada, càrrega i diagrama qualitatiu d'esforços; després encavallades. Separar deformació il·lustrativa de càlcul físic validat.
- **TechLab**: itineraris que coordinen mòduls existents, començant per «Dissenya un sistema d'elevació» i «Envia un missatge fiable»; evitar duplicar motors.
- **EnergyLab**, possible després: cadena energètica, rendiment i consum amb unitats coherents.

TechLab continua planificat. StructureLab ja ofereix biga recolzada i encavallada triangular; els marcs i encavallades arbitràries queden pendents. Els esforços de Tecnofigures continuen sent esquemes.

## Ordre recomanat

1. Unificar controls i resum «Continua treballant».
2. Blocs editables entre Tecnofigures/CircuitLab i TechWorksheet.
3. Mesures i avaries de CircuitLab; pistes per errors a TechProblems.
4. Missió integrada de comunicacions i vista de portes de LogicLab.
5. Ampliar mecanismes/materials i començar StructureLab amb un model acotat.

Mantenir exportació/importació i proves de canvi de compte, conflictes entre pestanyes i fallades de desament en cada etapa. La sincronització entre dispositius requeriria una decisió independent sobre comptes remots; el funcionament actual és local.

## Abast lliurat de la prioritat 1

- Represa de treball a portada i compte, incloent còpies de la galeria.
- Edició d'una còpia del model dins de blocs nous de fitxes; retorn amb control de conflictes.
- Controls i missatges comuns per al recorregut d'aprenentatge; es conserven els controls especialitzats dels editors.
- Predicció, pistes graduades, captures, explicació i autoavaluació, amb emmagatzematge local.

Les captures són registres de paràmetres i resultats visibles, no reproduccions interactives de totes les simulacions. Els tests inicials continuen orientant pautes, sense diagnosticar capacitats.
