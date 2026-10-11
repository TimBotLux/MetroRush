// Traductions de l'interface (français et anglais).
// Une entrée est soit un texte, soit une fonction qui reçoit des valeurs et renvoie le texte (ou du JSX).
import React, { createContext, useContext } from 'react';

export const LANGS = ['fr', 'en'];

const STR = {
  fr: {
    // Accueil
    pitch: 'Pilote les feux du métro et évite les collisions !',
    play: 'Jouer',
    replay: 'Rejouer',
    myScores: 'Mes records',
    settings: 'Paramètres',
    language: 'Langue',
    credits: "Plans redessinés d'après les données © contributeurs OpenStreetMap (ODbL)",
    creditsFull: "Plans redessinés d'après les données © contributeurs OpenStreetMap (ODbL). Couleurs et noms de lignes : RATP, TfL, BVG.",
    // Chargement et cadre
    loading: 'Chargement des cartes…',
    loadingLabel: 'Chargement des cartes',
    rotate: 'Tourne ton téléphone en mode paysage pour jouer.',
    // Navigation
    backHome: "Retour à l'accueil",
    backCity: 'Retour au choix de la ville',
    // Villes
    pickCity: 'Choisis ta ville',
    recommended: 'Conseillé pour débuter',
    record: (n) => `Record : ${n}`,
    notPlayed: 'Pas encore joué',
    // Niveaux
    pickLevel: 'Choisis ton niveau',
    difficulty: 'Niveau de difficulté',
    go: "C'est parti !",
    // Partie
    pause: 'Pause',
    trains: (n) => `${n} rame${n > 1 ? 's' : ''}`,
    music: 'Musique',
    soundOn: 'Son',
    soundOff: 'Son coupé',
    scoreLabel: (s, m) => `Score ${s}, multiplicateur ×${m}`,
    timeLeft: 'Temps restant',
    collisions: 'Collisions',
    crashes: 'Chocs',
    rushLabel: (n) => `Heure de pointe, encore ${n} secondes`,
    rushIn: 'dans',
    gameOverBang: 'Game over !',
    timeUp: 'Temps écoulé !',
    resume: 'Reprendre',
    restart: 'Recommencer',
    quit: 'Quitter la partie',
    // Carte
    incoming: (n) => `Une rame arrive sur la ligne ${n}`,
    lightLabel: (n, green) => `Feu de la ligne ${n} : ${green ? 'vert' : 'rouge'}`,
    bubble: 'Attention ! Deux rames arrivent à ce croisement.',
    // Résultats
    subGameOver: '5 chocs, la partie s’arrête. Pense à mettre un feu au rouge plus tôt !',
    subBetter: 'Le temps est écoulé. Tu as fait mieux que la dernière fois.',
    subFirst: 'Le temps est écoulé. Premier record sur ce réseau !',
    subClean: 'Le temps est écoulé. Aucun choc : beau pilotage !',
    subAgain: 'Le temps est écoulé. Encore un essai pour battre ton record ?',
    score: 'Score',
    arrived: 'Rames arrivées',
    yourRecord: 'Ton record',
    titleGameOver: 'Game over',
    titleBravo: 'Bravo !',
    titleDone: 'Terminé !',
    newRecord: 'Nouveau record !',
    bestStreak: 'Meilleure série sans erreur',
    streak: (n) => `${n} rame${n > 1 ? 's' : ''}`,
    changeLevel: 'Changer de niveau',
    home: 'Accueil',
    // Records
    scoresTable: 'Meilleurs scores par ville et par niveau',
    toPlay: 'À jouer',
    scoresNote: 'Tes records restent sur cet appareil.',
    // Classement en ligne
    online: 'Classement en ligne',
    pseudoPh: 'Ton pseudo',
    send: 'Envoyer',
    sending: 'Envoi…',
    rank: (n) => `Tu es ${n}${n === 1 ? 'er' : 'e'} au classement en ligne !`,
    sendError: 'Envoi impossible. Vérifie ta connexion.',
    seeBoard: 'Voir le classement',
    tabLocal: 'Cet appareil',
    tabOnline: 'En ligne',
    cityLabel: 'Ville',
    levelLabel: 'Niveau',
    boardLoading: 'Chargement…',
    boardEmpty: 'Personne n’a encore joué ici. À toi !',
    boardError: 'Classement indisponible. Vérifie ta connexion.',
    // Paramètres
    sounds: 'Sons',
    soundsHint: 'Feux, chocs, arrivées',
    musicHint: 'Un style par ville, plus rapide quand le niveau monte',
    vibrations: 'Vibrations',
    vibrationsHint: 'Si ton appareil le permet',
    shake: 'Secousses de l’écran',
    shakeHint: 'Quand deux rames se percutent',
    tutorialAgain: 'Revoir le tutoriel',
    resetScores: 'Effacer mes records',
    resetDone: 'Tes records ont été effacés.',
    resetNote: "On te demandera de confirmer avant d'effacer.",
    resetTitle: 'Effacer tes records ?',
    resetText: 'Tous tes meilleurs scores seront supprimés de cet appareil. Impossible de revenir en arrière.',
    resetYes: 'Oui, tout effacer',
    cancel: 'Annuler',
    // Tutoriel
    tutoSteps: [
      {
        title: 'Touche le feu !',
        text: <>Chaque rame marque 3 s d'arrêt à quai, puis passe le feu avant le croisement. Touche le feu de la ligne bleue pour le passer au <span className="hl">rouge</span>.</>,
        done: 'Bien joué ! Rouge = stop, vert = ça roule.'
      },
      {
        title: 'Arrête une rame',
        text: <>Mets le feu bleu au <span className="hl">rouge</span> avant que la rame arrive : elle s'arrête et attend. Repasse-le au vert pour la relancer.</>,
        done: 'Parfait ! Attention : une rame qui attend plus de 10 s te coûte 1 point.'
      },
      {
        title: 'Évite la collision',
        text: <>Deux rames arrivent au même croisement. Arrête l'une d'elles, laisse passer l'autre, puis relance-la.</>,
        done: 'Bravo, tu es prêt ! Chaque rame arrivée rapporte 1 point.'
      }
    ],
    tutoStep: (i, n) => `Étape ${i} sur ${n}`,
    tutoFail: 'Boum ! Les deux rames se sont percutées. On recommence…',
    tutoPlay: 'Jouer !',
    next: 'Suivant',
    skipTuto: 'Passer le tutoriel',
    legend: <>Rouge = stop<br />Vert = ça roule</>,
    // Villes et niveaux
    cities: {
      berlin: ['Berlin', 'Réseau aéré, peu de croisements'],
      london: ['Londres', 'Des lignes partagent la même voie'],
      paris: ['Paris', 'Croisements très serrés'],
      newyork: ['New York', 'Grille de Manhattan, lignes express'],
      madrid: ['Madrid', 'Lignes longues autour de Sol'],
      rome: ['Rome', 'Peu de lignes, croisements décisifs'],
      seoul: ['Séoul', 'Réseau dense, nombreuses correspondances'],
      tokyo: ['Tokyo', 'Lignes en diagonale, rythme soutenu'],
      beijing: ['Pékin', 'Grands axes en damier'],
      rio: ['Rio', 'Métro, VLT et trains de banlieue']
    },
    levels: {
      facile: ['Facile', ['3 lignes', 'De 6 à 9 rames, de plus en plus fréquentes', 'Aide : halo rouge sur les dangers', 'Pas de game over']],
      moyen: ['Moyen', ['5 lignes', 'De 11 à 17 rames, de plus en plus fréquentes', 'Aide : halo 1 s avant', 'Game over à 5 collisions']],
      difficile: ['Difficile', ['Toutes les lignes', 'De 26 à 39 rames, de plus en plus rapides', 'Aucune aide', 'Game over à 5 collisions']]
    }
  },

  en: {
    pitch: 'Control the metro signals and avoid collisions!',
    play: 'Play',
    replay: 'Play again',
    myScores: 'My records',
    settings: 'Settings',
    language: 'Language',
    credits: 'Maps redrawn from data © OpenStreetMap contributors (ODbL)',
    creditsFull: 'Maps redrawn from data © OpenStreetMap contributors (ODbL). Line colours and names: RATP, TfL, BVG.',
    loading: 'Loading maps…',
    loadingLabel: 'Loading maps',
    rotate: 'Turn your phone to landscape to play.',
    backHome: 'Back to home',
    backCity: 'Back to city selection',
    pickCity: 'Pick your city',
    recommended: 'Best for beginners',
    record: (n) => `Record: ${n}`,
    notPlayed: 'Not played yet',
    pickLevel: 'Pick your level',
    difficulty: 'Difficulty level',
    go: "Let's go!",
    pause: 'Pause',
    trains: (n) => `${n} train${n === 1 ? '' : 's'}`,
    music: 'Music',
    soundOn: 'Sound',
    soundOff: 'Muted',
    scoreLabel: (s, m) => `Score ${s}, multiplier ×${m}`,
    timeLeft: 'Time left',
    collisions: 'Collisions',
    crashes: 'Crashes',
    rushLabel: (n) => `Rush hour, ${n} seconds left`,
    rushIn: 'in',
    gameOverBang: 'Game over!',
    timeUp: "Time's up!",
    resume: 'Resume',
    restart: 'Restart',
    quit: 'Quit game',
    incoming: (n) => `A train is coming on line ${n}`,
    lightLabel: (n, green) => `Line ${n} signal: ${green ? 'green' : 'red'}`,
    bubble: 'Watch out! Two trains are heading for this crossing.',
    subGameOver: '5 crashes, game over. Try switching a signal to red earlier!',
    subBetter: "Time's up. You beat your last score.",
    subFirst: "Time's up. Your first record on this network!",
    subClean: "Time's up. No crashes: great driving!",
    subAgain: "Time's up. One more try to beat your record?",
    score: 'Score',
    arrived: 'Trains arrived',
    yourRecord: 'Your record',
    titleGameOver: 'Game over',
    titleBravo: 'Well done!',
    titleDone: 'Finished!',
    newRecord: 'New record!',
    bestStreak: 'Best streak without a mistake',
    streak: (n) => `${n} train${n > 1 ? 's' : ''}`,
    changeLevel: 'Change level',
    home: 'Home',
    scoresTable: 'Best scores by city and level',
    toPlay: 'To play',
    scoresNote: 'Your records stay on this device.',
    online: 'Online leaderboard',
    pseudoPh: 'Your nickname',
    send: 'Submit',
    sending: 'Sending…',
    rank: (n) => `You're #${n} on the online leaderboard!`,
    sendError: 'Could not submit. Check your connection.',
    seeBoard: 'See leaderboard',
    tabLocal: 'This device',
    tabOnline: 'Online',
    cityLabel: 'City',
    levelLabel: 'Level',
    boardLoading: 'Loading…',
    boardEmpty: 'Nobody has played here yet. Your turn!',
    boardError: 'Leaderboard unavailable. Check your connection.',
    sounds: 'Sounds',
    soundsHint: 'Signals, crashes, arrivals',
    musicHint: 'A style for each city, faster as the level rises',
    vibrations: 'Vibrations',
    vibrationsHint: 'If your device supports it',
    shake: 'Screen shake',
    shakeHint: 'When two trains collide',
    tutorialAgain: 'Replay the tutorial',
    resetScores: 'Erase my records',
    resetDone: 'Your records have been erased.',
    resetNote: "You'll be asked to confirm before erasing.",
    resetTitle: 'Erase your records?',
    resetText: 'All your best scores will be deleted from this device. This cannot be undone.',
    resetYes: 'Yes, erase everything',
    cancel: 'Cancel',
    tutoSteps: [
      {
        title: 'Tap the signal!',
        text: <>Each train stops at the platform for 3 s, then passes the signal before the crossing. Tap the blue line's signal to switch it to <span className="hl">red</span>.</>,
        done: 'Nice! Red = stop, green = go.'
      },
      {
        title: 'Stop a train',
        text: <>Switch the blue signal to <span className="hl">red</span> before the train arrives: it stops and waits. Switch it back to green to let it go.</>,
        done: 'Perfect! Careful: a train that waits more than 10 s costs you 1 point.'
      },
      {
        title: 'Avoid the collision',
        text: <>Two trains are heading for the same crossing. Stop one of them, let the other pass, then send it off again.</>,
        done: "Well done, you're ready! Each train that arrives earns 1 point."
      }
    ],
    tutoStep: (i, n) => `Step ${i} of ${n}`,
    tutoFail: 'Boom! The two trains collided. Let’s try again…',
    tutoPlay: 'Play!',
    next: 'Next',
    skipTuto: 'Skip tutorial',
    legend: <>Red = stop<br />Green = go</>,
    cities: {
      berlin: ['Berlin', 'Airy network, few crossings'],
      london: ['London', 'Some lines share the same track'],
      paris: ['Paris', 'Very tight crossings'],
      newyork: ['New York', 'Manhattan grid, express lines'],
      madrid: ['Madrid', 'Long lines around Sol'],
      rome: ['Rome', 'Few lines, decisive crossings'],
      seoul: ['Seoul', 'Dense network, many transfers'],
      tokyo: ['Tokyo', 'Diagonal lines, steady pace'],
      beijing: ['Beijing', 'Wide grid of main lines'],
      rio: ['Rio', 'Metro, light rail and suburban trains']
    },
    levels: {
      facile: ['Easy', ['3 lines', '6 to 9 trains, more and more frequent', 'Help: red halo on dangers', 'No game over']],
      moyen: ['Medium', ['5 lines', '11 to 17 trains, more and more frequent', 'Help: halo 1 s ahead', 'Game over at 5 collisions']],
      difficile: ['Hard', ['All lines', '26 to 39 trains, faster and faster', 'No help', 'Game over at 5 collisions']]
    }
  }
};

export function translator(lang) {
  const dict = STR[lang] || STR.fr;
  const t = (key, ...args) => {
    const v = key in dict ? dict[key] : STR.fr[key];
    return typeof v === 'function' ? v(...args) : v;
  };
  t.lang = lang;
  t.city = (key) => dict.cities[key][0];
  t.tagline = (key) => dict.cities[key][1];
  t.level = (key) => dict.levels[key][0];
  t.facts = (key) => dict.levels[key][1];
  return t;
}

const LangContext = createContext(translator('fr'));
export const LangProvider = LangContext.Provider;
export const useT = () => useContext(LangContext);
