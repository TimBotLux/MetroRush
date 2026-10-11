# PRD - MetroRush

Oct 10, 2026 · @Co

## 1. Vision & objectifs

MetroRush est un jeu de réflexion en 2D où le joueur pilote les feux aux croisements d'un vrai réseau de métro (Paris, Londres, Berlin) pour éviter les collisions entre rames.

### Problème

Les jeux de simulation de transport sont souvent complexes à prendre en main (gestion économique, construction de lignes). Il manque un jeu court, lisible et nerveux qui s'appuie sur des réseaux réels qu'on reconnaît et qu'on prend plaisir à « maîtriser ».

### Solution

MetroRush affiche une carte simplifiée d'un réseau réel. Les rames circulent automatiquement sur leurs lignes. Aux intersections, des feux de croisement bloquent ou libèrent les rames. Le joueur touche un feu pour le faire passer au vert ou au rouge. Chaque collision fait perdre un point. Plus la difficulté monte, plus il y a de rames et de feux à gérer en même temps.

### Public cible

- Joueurs occasionnels (15-45 ans) qui cherchent des parties courtes de 3 à 5 minutes, sur mobile ou navigateur
- Passionnés de transports et de cartes de métro qui aiment reconnaître leurs lignes et stations
- Amateurs de jeux de réflexes et de gestion de flux (type puzzle de trafic)

### Objectifs du MVP

- Une partie compréhensible en moins de 30 secondes, sans lire de tutoriel long (en test : au moins 4 joueurs sur 5 touchent un feu volontairement dans les 30 premières secondes)
- 3 villes jouables, chacune en 3 niveaux de difficulté
- Un score clair et un meilleur score par ville et par niveau, pour donner envie de rejouer (en test : au moins 3 joueurs sur 5 relancent une deuxième partie sans qu'on le leur propose)

## 2. Règles du jeu

Une partie dure un temps fixe : le joueur marque des points quand une rame termine son trajet, et en perd un à chaque collision ou attente trop longue.

### Boucle de jeu

1. La partie démarre sur la carte du réseau choisi, avec un chronomètre (3 minutes par défaut).
2. Des rames apparaissent à intervalles réguliers au terminus d'une ligne et roulent seules vers l'autre terminus, où elles disparaissent. Au MVP, chaque ligne circule dans un seul sens.
3. Avant chaque intersection, la rame regarde son feu : vert, elle passe ; rouge, elle s'arrête et attend.
4. Une rame ne double jamais : si la rame de devant est arrêtée, celle qui suit s'arrête derrière elle, sans collision.
5. Les rames à l'arrêt comptent dans le nombre maximum de rames en circulation ; quand ce maximum est atteint, l'apparition suivante attend qu'une place se libère.
6. Le joueur touche un feu pour l'inverser (vert → rouge ou rouge → vert).
7. Si deux rames de lignes différentes se trouvent en même temps dans la zone d'un croisement (ou au point de fusion d'une voie partagée), c'est une collision.
8. À la fin du chronomètre, l'écran de résultats affiche le score.

### Feux de croisement

- Un feu est placé sur chaque branche qui arrive à une intersection active (deux lignes qui se croisent ou se partagent une voie).
- Un feu a deux états : vert (passage autorisé) et rouge (arrêt).
- Le joueur est seul à commander les feux : aucun feu ne change tout seul.
- Au début de la partie, tous les feux sont verts.
- Une rame déjà engagée dans le croisement termine sa traversée même si son feu passe au rouge.
- Voie partagée : un feu est placé sur chaque ligne juste avant le point de fusion, qui est traité comme un croisement. Une fois sur le tronçon commun, les rames se suivent et ne peuvent plus se percuter.
- Démarrage : les premières rames sont lancées pour arriver à un même croisement dans les 15 premières secondes, afin que le joueur rencontre un premier conflit très vite.

### Score

| Événement | Points |
| --- | --- |
| Rame arrivée à son terminus | +1 |
| Collision entre deux rames | −1 |
| Rame à l'arrêt plus de 10 secondes (au feu rouge ou dans une file) | −1, une fois par arrêt (la rame clignote dès 7 s pour prévenir) |

- Le score ne descend pas sous 0.
- Après une collision, les deux rames disparaissent avec une animation et le croisement est bloqué pendant 3 secondes.
- Un meilleur score est enregistré pour chaque combinaison ville + difficulté.

### Fin de partie

- Fin normale : le chronomètre arrive à 0.
- Fin anticipée (Moyen et Difficile uniquement) : 5 collisions dans la même partie (« Game over »). En Facile, la partie va toujours jusqu'au bout du chronomètre.
- Le game over mène à l'écran de résultats, avec le titre « Game over ».
- Si le chronomètre atteint 0 pendant une traversée ou un blocage de croisement, la partie s'arrête aussitôt ; les rames encore en route ne rapportent rien.
- Le joueur peut mettre en pause à tout moment ; les rames et le chronomètre s'arrêtent.

## 3. Niveaux de difficulté et villes

Trois niveaux font varier le nombre de rames, de feux actifs et la vitesse ; chaque ville propose les trois.

### Niveaux de difficulté

| Paramètre | Facile | Moyen | Difficile |
| --- | --- | --- | --- |
| Lignes actives | 3 | 5 | Toutes les lignes de la zone jouée (8 maximum) |
| Feux de croisement | 3 à 4 | 8 à 10 | 15 et plus |
| Rames en circulation en même temps | 4 maximum | 8 maximum | 15 maximum |
| Intervalle d'apparition d'une rame | 8 s | 5 s | 3 s |
| Vitesse des rames | Lente (traverse la carte en ~30 s) | Normale (~20 s) | Rapide (~14 s), +10 % toutes les 60 s |
| Aide visuelle | Halo rouge sur un croisement à risque | Halo seulement 1 s avant | Aucune aide |
| Game over à 5 collisions | Non | Oui | Oui |

Un croisement est « à risque » quand deux rames au vert doivent y arriver à moins de 2 secondes d'écart. Les valeurs ci-dessus sont des points de départ à ajuster pendant les tests de jeu.

### Villes

| Ville | Zone jouée au MVP | Particularité de jeu |
| --- | --- | --- |
| Paris | Lignes du centre (autour de Châtelet) | Beaucoup de correspondances très proches : croisements serrés |
| Londres | Zone 1 | Lignes qui partagent des tronçons : feux sur voies communes |
| Berlin | Centre, U-Bahn | Réseau plus aéré : idéal pour débuter |

### Source des plans

- Le tracé des lignes et la position des stations viennent de données ouvertes (OpenStreetMap, open data des opérateurs) en respectant leur licence.
- La carte est redessinée dans le style graphique propre au jeu (lignes droites, angles à 45°) : on ne reproduit pas les plans officiels, leurs logos ni leurs typographies.
- Les noms de stations et les couleurs de lignes sont conservés pour que le joueur reconnaisse le réseau.
- Les intersections du jeu sont des croisements simplifiés : dans la réalité, la plupart des lignes se croisent à des niveaux différents.

### Conception des niveaux

Dans la réalité, la plupart des lignes se croisent à des niveaux différents : chaque croisement du jeu est donc un choix de design, pas une donnée importée.

- Pour chaque ville et chaque niveau, on choisit à la main les lignes actives et les points où elles se croisent ou se partagent une voie, en partant en priorité des vraies correspondances.
- Cela fait 9 niveaux à concevoir et à équilibrer en tests de jeu : c'est un chantier à part entière du MVP, à planifier comme tel.
- Au zoom par défaut, tous les feux actifs d'un niveau doivent tenir à l'écran en paysage sur mobile, avec leurs zones tactiles de 44x44 px. C'est ce qui fixe la taille de la zone jouée, notamment pour Paris en Difficile.
- Berlin est mise en avant comme ville conseillée pour une première partie.

## 4. User stories

Douze user stories couvrent le MVP ; chacune correspond à un écran ou une action.

**US1. Accueil** — En tant que joueur, je veux lancer une partie en 3 taps depuis l'écran d'accueil (1 seul avec « Rejouer ») pour jouer tout de suite.

**US2. Tutoriel** — En tant que nouveau joueur, je veux un tutoriel interactif court pour comprendre comment fonctionnent les feux et les collisions.

**US3. Choix de la ville** — En tant que joueur, je veux choisir entre Paris, Londres et Berlin pour jouer sur le réseau que je préfère.

**US4. Choix de la difficulté** — En tant que joueur, je veux choisir Facile, Moyen ou Difficile pour adapter le défi à mon niveau.

**US5. Carte de jeu** — En tant que joueur, je veux voir le plan du métro avec les lignes, les stations, les rames et les feux pour comprendre la situation d'un coup d'œil.

**US6. Commande des feux** — En tant que joueur, je veux toucher un feu pour le passer au vert ou au rouge afin de faire avancer ou arrêter les rames.

**US7. Collision** — En tant que joueur, je veux voir clairement quand deux rames entrent en collision et perdre un point pour comprendre mon erreur.

**US8. Score et chronomètre** — En tant que joueur, je veux voir mon score, le temps restant et mes collisions pendant la partie pour savoir où j'en suis.

**US9. Pause** — En tant que joueur, je veux mettre le jeu en pause pour reprendre plus tard sans perdre ma partie.

**US10. Résultats** — En tant que joueur, je veux voir mon score final et mon meilleur score pour savoir si je progresse.

**US11. Meilleurs scores** — En tant que joueur, je veux consulter mes meilleurs scores par ville et par niveau pour me fixer des objectifs.

**US12. Paramètres** — En tant que joueur, je veux régler le son, la musique, les vibrations et les effets de mouvement, revoir le tutoriel et réinitialiser ma progression.

## 5. Critères d'acceptation

Une user story est terminée quand toutes ses cases sont cochées ; l'IA s'en sert comme checklist.

**US1 — Accueil**

- [ ] L'écran affiche : Jouer, Meilleurs scores, Paramètres
- [ ] « Jouer » mène au choix de la ville
- [ ] Le dernier couple ville + difficulté joué est proposé en « Rejouer »

**US2 — Tutoriel**

- [ ] Le tutoriel se lance automatiquement au premier tap sur « Jouer », avant le choix de la ville
- [ ] Il contient 3 étapes maximum : toucher un feu, arrêter une rame, éviter une collision
- [ ] Le joueur peut le passer et le revoir depuis les paramètres

**US3 — Choix de la ville**

- [ ] Chaque ville affiche son nom et un aperçu miniature du réseau
- [ ] Le meilleur score du joueur est visible sous chaque ville
- [ ] Berlin porte la mention « Conseillé pour débuter »

**US4 — Choix de la difficulté**

- [ ] Les trois niveaux sont affichés avec une phrase d'explication (nombre de rames et de feux)
- [ ] Le niveau sélectionné est clairement mis en évidence

**US5 — Carte de jeu**

- [ ] Chaque ligne a sa couleur réelle et son numéro ou nom
- [ ] Les stations sont des points, leur nom s'affiche au zoom ou au survol
- [ ] Les rames sont des rectangles de la couleur de leur ligne qui avancent de façon fluide (60 images/s visées)
- [ ] Au zoom par défaut, la carte et tous les feux actifs tiennent à l'écran sans zoomer ; le zoom et le déplacement au doigt servent seulement à lire les noms de stations

**US6 — Commande des feux**

- [ ] Un tap sur un feu l'inverse instantanément (moins de 100 ms)
- [ ] La zone tactile de chaque feu fait au moins 44x44 px, même si l'icône est plus petite
- [ ] Le feu change de couleur et joue un son ou une vibration courte
- [ ] Une rame s'arrête avant un feu rouge et redémarre dès qu'il passe au vert

**US7 — Collision**

- [ ] Une collision déclenche une animation (flash + secousse de l'écran, désactivable dans les paramètres) et un son
- [ ] Le compteur affiche −1 à l'endroit de la collision
- [ ] Le croisement concerné est bloqué 3 secondes puis libéré

**US8 — Score et chronomètre**

- [ ] Le score, le temps restant et le nombre de collisions (sur 5 en Moyen et Difficile) sont toujours visibles en haut de l'écran
- [ ] Le chronomètre passe en rouge pendant les 10 dernières secondes

**US9 — Pause**

- [ ] Un bouton pause est visible pendant toute la partie
- [ ] Le menu pause propose : Reprendre, Recommencer, Quitter
- [ ] La partie se met en pause automatiquement si l'onglet ou le navigateur passe en arrière-plan

**US10 — Résultats**

- [ ] L'écran affiche : score final, rames arrivées, collisions, meilleur score
- [ ] Un message spécial s'affiche en cas de nouveau record ; le titre devient « Game over » si la partie s'est arrêtée à 5 collisions
- [ ] Boutons : Rejouer, Changer de niveau, Accueil

**US11 — Meilleurs scores**

- [ ] Un tableau affiche le meilleur score pour chaque ville et chaque difficulté (9 cases)
- [ ] Les scores sont sauvegardés sur l'appareil et conservés après fermeture de l'app

**US12 — Paramètres**

- [ ] Activer/désactiver le son et la musique
- [ ] Activer/désactiver les vibrations (option masquée si le navigateur ne les prend pas en charge, à vérifier sur iPhone)
- [ ] Activer/désactiver les effets de mouvement (secousse de l'écran)
- [ ] Revoir le tutoriel
- [ ] Réinitialiser les scores, avec une confirmation

## 6. Écrans de l'application

Le jeu compte 10 écrans (le tutoriel compte pour un écran en 3 étapes) ; le joueur passe de l'accueil à la partie en 3 taps, ou en 1 seul avec « Rejouer ».

| Écran | Description |
| --- | --- |
| Splash | Logo + chargement des cartes |
| Accueil | Jouer, Rejouer, Meilleurs scores, Paramètres |
| Tutoriel (3 étapes) | Toucher un feu, arrêter une rame, éviter une collision |
| Choix de la ville | Paris, Londres, Berlin avec aperçu et meilleur score |
| Choix de la difficulté | Facile, Moyen, Difficile avec explication |
| Partie | Carte du réseau, rames, feux, barre score / temps / collisions |
| Pause | Reprendre, Recommencer, Quitter |
| Résultats | Score final, record, Rejouer, Changer de niveau, Accueil ; titre « Game over » si la partie s'arrête à 5 collisions |
| Meilleurs scores | Tableau 3 villes x 3 difficultés |
| Paramètres | Son, vibrations, tutoriel, réinitialisation |

_(Le schéma de navigation entre les écrans est disponible dans la version en ligne du doc.)_

Depuis les résultats, le joueur peut rejouer directement, changer de niveau ou revenir à l'accueil.

## 7. Contraintes

Ces règles sont non négociables, côté interface comme côté expérience de jeu.

| Contrainte | Exigence |
| --- | --- |
| Plateforme | Jeu web jouable sur mobile et ordinateur, en mode paysage sur mobile |
| Rendu 2D | Vue de dessus, style plan de métro schématique, 60 images/s visées avec 15 rames à l'écran |
| Réactivité | Un tap sur un feu est pris en compte en moins de 100 ms |
| Chargement | Une carte se charge en moins de 2 secondes |
| Accessibilité | Zones tactiles de 44x44 px minimum ; feux reconnaissables sans la couleur (forme ou icône différente pour rouge et vert) ; secousse d'écran désactivable |
| Lisibilité | Noms de stations lisibles au zoom ; les feux restent visibles au-dessus des lignes |
| Feedback | Chaque action et chaque événement (feu, collision, arrivée) a un retour visuel et sonore ; le son d'arrivée reste discret et ne se répète pas plus d'une fois toutes les 0,5 s |
| Données des plans | Données ouvertes uniquement, créditées dans l'app ; pas de reproduction des plans, logos ou polices officiels ; licence ODbL d'OpenStreetMap respectée (attribution, partage à l'identique des données dérivées) ; usage des noms et couleurs de lignes (RATP, TfL, BVG) à faire valider avant la sortie |
| Hors ligne | Une fois chargé, le jeu fonctionne sans connexion |
| Langue | Interface en français ; noms de stations dans leur langue d'origine |

## 8. Ce qu'on ne fait PAS (MVP)

- Pas de multijoueur ni de classement en ligne
- Pas de création de compte : la progression reste sur l'appareil
- Pas d'autres villes que Paris, Londres et Berlin
- Pas de construction ou de modification de lignes par le joueur
- Pas de feux automatiques ni d'aiguillages
- Pas de passagers, d'horaires réels ni de trafic en temps réel
- Pas de mode sombre (prévu pour la v2)
- Pas d'achats intégrés ni de publicité

> Ce PRD se concentre sur le QUOI (règles, écrans, fonctionnalités). Le COMMENT technique (moteur 2D, format des cartes, détection des collisions) viendra dans un second temps, une fois le gameplay validé sur un prototype.
