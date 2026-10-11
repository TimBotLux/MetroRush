// Sauvegarde locale (sur l'appareil) : records, paramètres, tutoriel vu, dernière partie.

const KEY = 'metrorush.v1';

const DEFAULT = {
  scores: {},
  settings: { son: true, musique: true, vibrations: false, mouvement: true, langue: 'fr' },
  tutorialSeen: false,
  last: null
};

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT);
    const data = JSON.parse(raw);
    return { ...structuredClone(DEFAULT), ...data, settings: { ...DEFAULT.settings, ...(data.settings || {}) } };
  } catch (e) {
    return structuredClone(DEFAULT);
  }
}

function write(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    /* stockage indisponible : la partie continue sans sauvegarde */
  }
}

export function loadAll() {
  return read();
}

export function saveAll(data) {
  write(data);
}

export function bestOf(scores, city, level) {
  const v = scores[city] && scores[city][level];
  return typeof v === 'number' ? v : null;
}

export function bestOfCity(scores, city) {
  const all = Object.values(scores[city] || {}).filter((v) => typeof v === 'number');
  return all.length ? Math.max(...all) : null;
}
