# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

MetroRush : jeu de réflexion 2D en React 18 + Vite 5 (JavaScript, sans TypeScript). Le joueur passe des feux au
rouge ou au vert aux croisements de plans de métro simplifiés (10 villes) pour éviter les collisions. Le jeu est
installable en PWA (plein écran, paysage, hors connexion).

- `metrorush/` : l'application (toutes les commandes npm se lancent ici, ou avec `npm --prefix metrorush …`)
- `MetroRush_Design/` : maquettes de référence (`*.dc.html`) ; `PRD - MetroRush.md` : cahier des charges
- Dépôt GitHub : https://github.com/TimBotLux/MetroRush (branche `main`). Git n'est pas dans le PATH :
  utiliser `C:\Program Files\Git\cmd\git.exe`. Un `git push` qui doit s'authentifier ne peut pas demander
  d'identifiants dans un shell non interactif : le lancer dans le terminal de l'utilisateur.

L'utilisateur parle français. Le code, les commentaires et les messages de commit sont en français.

## Commandes

```bash
npm install          # dans metrorush/
npm run dev          # serveur de dev Vite (http://localhost:5173)
npm run build        # version statique dans metrorush/dist/
npm run pwa          # build + vite preview --host --port 4173 (test sur téléphone via l'adresse « Network »)
```

Il n'y a ni tests automatisés ni linter. Vérifier une modification en lançant le jeu (configurations
`metrorush`, `metrorush-alt` sur le port 5174 si le 5173 est pris, et `metrorush-pwa` dans `.claude/launch.json`)
et, pour le moteur, en important `/src/data.js` et `/src/engine.js` depuis la page pour simuler des parties
(`createGame` puis `step(g, 1/30)` en boucle, `drainEvents(g)`).

**Piège Vite** : sur cette machine, le serveur de dev rate parfois un événement de modification et continue à
servir une ancienne version d'un fichier (y compris une version intermédiaire entre deux éditions rapprochées).
Après des éditions, si le comportement ne suit pas le code, mettre à jour la date du fichier
(`(Get-Item fichier).LastWriteTime = Get-Date`), vérifier le contenu servi, puis recharger la page.

## Architecture

**Moteur pur, rendu React.** `src/engine.js` ne dépend pas de React. `buildNetwork(lines, names)` transforme les
lignes d'une ville en réseau jouable : croisements calculés par intersection de segments, un feu par ligne et par
croisement (placé `STOP_GAP` px avant), quais avant chaque feu et sur les tronçons libres. `createGame(cfg)`
crée un état mutable ; `step(state, dt)` le fait avancer (apparition des rames, déplacements, arrêts à quai,
attente aux feux, collisions, pénalités, heure de pointe) et empile des événements (`spawn`, `arrive`, `crash`,
`late`, `rushStart`, `comboUp`, `end`…). Les écrans appellent `step` dans `useLoop` (requestAnimationFrame,
re-rendu à chaque image), puis `drainEvents` pour déclencher sons, vibrations et effets.

**Données.** `src/data.js` contient les villes (`CITIES`, ordre dans `CITY_ORDER`), les niveaux (`LEVELS`), la
durée (`GAME_SECONDS`), la montée en difficulté (`RAMP`) et l'heure de pointe (`RUSH`). Une ligne est une suite
de points dans la zone de carte 844 × 334 ; elle circule du premier point vers le dernier (le premier point est
son terminus d'entrée). `names` associe un nom de station à une paire d'indices de lignes `'i-j'` (seul le
premier croisement de la paire reçoit le nom). Un niveau n'utilise que les `lines` premières lignes de la ville.
En difficile, `uTurnLines` transforme chaque ligne droite verticale en boucle en U en cherchant une largeur et une
hauteur qui ne longent aucune autre voie et gardent les croisements espacés (`Game.jsx` l'applique).

**Écrans.** `App.jsx` gère la navigation par un état `screen` (splash, home, tutorial, city, level, game,
results, scores, settings) et la sauvegarde (`storage.js`, clé localStorage `metrorush.v1` : records, paramètres
dont la langue, tutoriel vu, dernière partie). `Game.jsx` construit la partie depuis `LEVELS` (les feux démarrent
au rouge avec `startRed`), `Tutorial.jsx` réutilise le même moteur avec des apparitions programmées
(`scheduled`) et des feux verts. `components/MapView.jsx` dessine le plan (couche SVG fixe mémorisée + éléments
dynamiques en HTML positionné).

**Cadre fixe.** Tout est dessiné en 844 × 390 px (paysage mobile) ; `components/Stage.jsx` met ce cadre à
l'échelle de la fenêtre en tenant compte des zones sûres (encoche) et affiche un message en portrait sur mobile.
Les positions dans le CSS et les composants sont donc en pixels de ce cadre.

**Textes.** Tous les textes affichés passent par `src/i18n.jsx` (`useT()` : `t('clé', …args)`, `t.city`,
`t.tagline`, `t.level`, `t.facts`), en français et en anglais. Ajouter une clé dans les deux langues. Les champs
`label`, `tagline` et `facts` de `data.js` ne servent plus à l'affichage.

**Audio.** `src/audio.js` génère tout avec Web Audio (aucun fichier son) : effets, et musique électro par style
de ville (`STYLES`, une entrée par clé de `CITIES`) modulée par la difficulté (`MOODS`), le nombre de rames et
l'heure de pointe. `audio.setTheme(city, level)` avant `startMusic()`. Le contexte audio est débloqué au premier
geste (`main.jsx`).

**PWA.** `public/manifest.webmanifest`, `public/icons/`, `public/sw.js` (enregistré seulement en production
dans `main.jsx`). `VERSION` dans `sw.js` vaut `metrorush-__BUILD_ID__` : un petit plugin de `vite.config.js`
remplace ce marqueur par la date et l'heure du build dans `dist/sw.js`, pour que les téléphones remplacent
l'ancien cache à chaque publication. Ne pas modifier le marqueur à la main. L'installation exige une adresse HTTPS (ou localhost). Déploiement Netlify configuré par
`netlify.toml` à la racine (base `metrorush`, publication `dist`, en-têtes de cache pour `sw.js` et `assets/`).
Netlify compile sous Linux : la casse des chemins d'import doit correspondre exactement aux noms de fichiers.

## Ajouter une ville

1. Entrée dans `CITIES` (`lines`, `names`, `bg` = dégradé pastel de l'écran de jeu) et clé dans `CITY_ORDER`.
2. Nom et description dans `cities` des deux langues de `i18n.jsx`.
3. Style musical dans `STYLES` de `audio.js`.
4. Vérifier par simulation que le réseau se construit aux 3 niveaux (croisements, feux, quais, U en difficile).
