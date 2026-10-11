import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import { audio } from './audio.js';

// Les navigateurs n'autorisent le son qu'après un vrai geste de l'utilisateur :
// chaque clic ou touche débloque (ou répare) le contexte audio.
['pointerdown', 'keydown', 'touchend'].forEach((type) => {
  window.addEventListener(type, () => audio.unlock(), { capture: true, passive: true });
});

// Application installée (PWA) : on verrouille l'écran en paysage au premier contact,
// quand le navigateur le permet (Android en plein écran ; ignoré ailleurs).
const installed = window.matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches;
if (installed) {
  window.addEventListener('pointerdown', () => {
    if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {});
  }, { once: true });
}

// Service worker : installation et jeu hors connexion (version publiée seulement,
// pour ne pas garder en cache d'anciens fichiers pendant le développement).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
