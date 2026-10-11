# MetroRush

Jeu de réflexion 2D en React (Vite) : pilote les feux aux croisements du métro de 10 villes pour éviter les collisions.
Construit à partir de `../PRD - MetroRush.md` et des maquettes de `../MetroRush_Design`.

## Lancer

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:5173. `npm run build` produit une version statique dans `dist/`.

## Sur smartphone (PWA)

Le jeu est une application web installable (PWA) : plein écran, en paysage, et jouable hors connexion une fois installé.

```bash
npm run pwa
```

Cette commande construit la version finale et la sert sur le réseau local (port 4173). Le terminal affiche une adresse
« Network » du type `http://192.168.x.x:4173` : l'ouvrir sur le téléphone, connecté au même Wi-Fi, pour jouer.

**Installer l'application** nécessite une adresse en HTTPS (les navigateurs refusent l'installation et le mode
hors connexion sur une simple adresse `http://` du réseau local). Publier le dossier `dist/` sur un hébergeur
HTTPS (Netlify, Vercel, GitHub Pages…), puis sur le téléphone :

- **Android (Chrome)** : menu ⋮ → « Installer l'application » (ou « Ajouter à l'écran d'accueil »)
- **iPhone (Safari)** : bouton Partager → « Sur l'écran d'accueil »

Fichiers concernés : `public/manifest.webmanifest` (nom, icônes, plein écran, paysage), `public/sw.js`
(service worker, cache hors connexion ; changer `VERSION` à chaque publication pour forcer la mise à jour),
`public/icons/` (icônes).

## Organisation

- `src/engine.js` : moteur de jeu pur (croisements, feux, rames, collisions, score, aide visuelle)
- `src/data.js` : réseaux simplifiés des villes, paramètres des 3 niveaux, boucles en U du niveau difficile
- `src/audio.js` : sons et musique électro légère, un style par ville (Web Audio)
- `src/i18n.jsx` : textes en français et en anglais
- `src/storage.js` : records, paramètres et dernière partie (localStorage)
- `src/screens/` : Splash, Accueil, Tutoriel (3 étapes jouables), Ville, Niveau, Partie + Pause, Résultats, Records, Paramètres
- `src/components/` : cadre 844 x 390 mis à l'échelle (zones sûres des téléphones comprises), carte du réseau, icônes
