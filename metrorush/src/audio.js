// Sons et musique générés avec Web Audio (aucun fichier à charger).

// Musique électro légère, avec une couleur propre à chaque plan : boucle de 4 mesures (un accord
// par mesure), en doubles croches (16 pas par mesure). kick/clap/hat/bass/stab : pas joués dans
// chaque mesure ; bassOct : pas où la basse monte d'une octave ; keys : petites notes de mélodie
// sur la boucle de 64 pas. Les nappes « pompent » à chaque grosse caisse (effet sidechain).
const FOUR = [0, 4, 8, 12];
const OFF = [2, 6, 10, 14];
const STYLES = {
  berlin: { // électro minimale douce, nappes sombres et arpège en dents de scie
    bpm: 120, swing: 0, cutoff: 1500, pad: 'sawtooth', padGain: 0.014, lead: 'sawtooth', keyWave: 'triangle',
    chords: [
      { root: 33, notes: [57, 60, 64, 67] }, { root: 33, notes: [57, 60, 64, 67] },
      { root: 29, notes: [53, 57, 60, 64] }, { root: 28, notes: [52, 55, 59, 62] }
    ],
    kick: FOUR, clap: [4, 12], hat: OFF, bass: [2, 6, 10, 14], bassOct: [],
    stab: [], strum: false, arp: true,
    keys: { 6: 76, 22: 72, 38: 76, 54: 71 }
  },
  london: { // électro légère légèrement chaloupée, accords d'orgue sur les contretemps
    bpm: 124, swing: 0.12, cutoff: 1800, pad: 'triangle', padGain: 0.02, lead: 'square', keyWave: 'sine',
    chords: [
      { root: 36, notes: [58, 62, 63, 67] }, { root: 32, notes: [55, 60, 63, 67] },
      { root: 29, notes: [56, 60, 63, 67] }, { root: 31, notes: [53, 58, 62, 65] }
    ],
    kick: [0, 4, 8, 12], clap: [4, 12], hat: [2, 6, 10, 14, 15], bass: [0, 3, 6, 10, 13], bassOct: [6, 13],
    stab: [3, 11], strum: false, arp: false,
    keys: { 3: 75, 6: 79, 11: 77, 19: 75, 22: 72, 35: 79, 38: 82, 43: 79, 51: 77, 54: 74 }
  },
  paris: { // french touch légère : accords filtrés sur les contretemps
    bpm: 118, swing: 0.05, cutoff: 1600, pad: 'triangle', padGain: 0.016, lead: 'sawtooth', keyWave: 'triangle',
    chords: [
      { root: 38, notes: [60, 64, 65, 69] }, { root: 31, notes: [59, 62, 64, 65] },
      { root: 36, notes: [59, 62, 64, 67] }, { root: 33, notes: [55, 60, 64, 67] }
    ],
    kick: FOUR, clap: [4, 12], hat: OFF, bass: [0, 2, 4, 7, 8, 10, 14], bassOct: [2, 10],
    stab: OFF, strum: false, arp: false,
    keys: { 6: 76, 10: 77, 22: 74, 30: 72, 38: 76, 42: 79, 54: 72, 58: 69 }
  },
  newyork: { // électro-pop détendue, accords jazzy et nappes chaudes
    bpm: 110, swing: 0.1, cutoff: 1700, pad: 'triangle', padGain: 0.022, lead: 'triangle', keyWave: 'sine',
    chords: [
      { root: 29, notes: [57, 60, 64, 65] }, { root: 28, notes: [55, 59, 62, 64] },
      { root: 38, notes: [57, 60, 62, 65] }, { root: 31, notes: [53, 59, 62, 65] }
    ],
    kick: [0, 6, 8, 12], clap: [4, 12], hat: OFF, bass: [0, 6, 8, 11], bassOct: [11],
    stab: [], strum: false, arp: true,
    keys: { 2: 76, 6: 72, 10: 69, 18: 74, 22: 71, 34: 72, 38: 69, 42: 65, 50: 71, 54: 74 }
  },
  madrid: { // tropical house aux couleurs andalouses : notes pincées et cadence andalouse
    bpm: 110, swing: 0.05, cutoff: 2000, pad: 'triangle', padGain: 0.012, lead: 'triangle', keyWave: 'triangle',
    chords: [
      { root: 33, notes: [57, 60, 64, 69] }, { root: 31, notes: [55, 59, 62, 67] },
      { root: 29, notes: [53, 57, 60, 65] }, { root: 28, notes: [56, 59, 64, 68] }
    ],
    kick: FOUR, clap: [4, 12], hat: OFF, bass: [0, 6, 8, 14], bassOct: [6, 14],
    stab: [0, 3, 6, 10, 13], strum: true, arp: false,
    keys: { 0: 76, 3: 77, 6: 76, 10: 74, 16: 74, 19: 72, 22: 71, 32: 72, 35: 71, 38: 69, 48: 68, 51: 69, 54: 71, 58: 68 }
  },
  rome: { // nu-disco : basse en octaves et arpège carré
    bpm: 116, swing: 0, cutoff: 1900, pad: 'sawtooth', padGain: 0.014, lead: 'square', keyWave: 'square',
    chords: [
      { root: 33, notes: [57, 60, 64, 69] }, { root: 29, notes: [57, 60, 65, 69] },
      { root: 36, notes: [55, 60, 64, 67] }, { root: 31, notes: [55, 59, 62, 67] }
    ],
    kick: FOUR, clap: [4, 12], hat: OFF, bass: [0, 2, 4, 6, 8, 10, 12, 14], bassOct: [2, 6, 10, 14],
    stab: [], strum: false, arp: true,
    keys: { 4: 76, 8: 79, 12: 81, 20: 77, 24: 76, 36: 76, 40: 72, 52: 74, 56: 71 }
  },
  seoul: { // synth-pop lumineuse (I – V – vi – IV)
    bpm: 124, swing: 0, cutoff: 2200, pad: 'sawtooth', padGain: 0.016, lead: 'square', keyWave: 'triangle',
    chords: [
      { root: 36, notes: [60, 64, 67, 72] }, { root: 31, notes: [59, 62, 67, 71] },
      { root: 33, notes: [60, 64, 69, 72] }, { root: 29, notes: [60, 65, 69, 72] }
    ],
    kick: FOUR, clap: [4, 12], hat: OFF, bass: [0, 3, 6, 8, 11, 14], bassOct: [3, 11],
    stab: [2, 10], strum: false, arp: true,
    keys: { 2: 79, 6: 84, 10: 83, 14: 79, 18: 79, 22: 83, 26: 86, 34: 81, 38: 84, 42: 88, 50: 81, 54: 84, 58: 79 }
  },
  tokyo: { // future funk pétillante : accords jazzy et petite mélodie carrée
    bpm: 120, swing: 0.08, cutoff: 2000, pad: 'triangle', padGain: 0.02, lead: 'square', keyWave: 'square',
    chords: [
      { root: 29, notes: [57, 60, 64, 65] }, { root: 28, notes: [55, 59, 62, 64] },
      { root: 38, notes: [57, 60, 62, 65] }, { root: 36, notes: [55, 59, 60, 64] }
    ],
    kick: FOUR, clap: [4, 12], hat: OFF, bass: [0, 3, 6, 8, 10, 11, 14], bassOct: [3, 11],
    stab: [3, 7, 11], strum: false, arp: false,
    keys: { 2: 77, 5: 76, 6: 72, 10: 69, 18: 76, 22: 74, 26: 71, 34: 72, 38: 69, 42: 65, 50: 71, 54: 72, 58: 76 }
  },
  beijing: { // électro chill pentatonique, notes pincées façon guzheng
    bpm: 108, swing: 0.05, cutoff: 2100, pad: 'triangle', padGain: 0.014, lead: 'triangle', keyWave: 'triangle',
    chords: [
      { root: 33, notes: [57, 60, 62, 64, 67] }, { root: 31, notes: [55, 57, 62, 67] },
      { root: 36, notes: [55, 60, 62, 64] }, { root: 38, notes: [57, 62, 64, 69] }
    ],
    kick: FOUR, clap: [4, 12], hat: OFF, bass: [0, 8, 11], bassOct: [11],
    stab: [0, 6, 12], strum: true, arp: false,
    keys: { 0: 81, 3: 79, 6: 76, 8: 74, 12: 76, 16: 79, 19: 76, 22: 74, 32: 72, 35: 74, 38: 76, 44: 79, 48: 81, 51: 84, 54: 81, 58: 79 }
  },
  rio: { // tropical house ensoleillée : guitare pincée et accords bossa
    bpm: 112, swing: 0.08, cutoff: 1900, pad: 'triangle', padGain: 0.016, lead: 'triangle', keyWave: 'sine',
    chords: [
      { root: 38, notes: [60, 64, 65, 69] }, { root: 31, notes: [59, 62, 64, 65] },
      { root: 36, notes: [59, 62, 64, 67] }, { root: 33, notes: [55, 58, 61, 64] }
    ],
    kick: FOUR, clap: [4, 12], hat: OFF, bass: [0, 6, 8, 14], bassOct: [6, 14],
    stab: [0, 3, 6, 10, 13], strum: true, arp: false,
    keys: { 2: 76, 6: 74, 10: 72, 14: 69, 18: 74, 22: 71, 34: 76, 38: 79, 42: 76, 50: 73, 54: 76, 58: 73 }
  }
};
// La difficulté règle l'énergie : tempo, ouverture du filtre et couches supplémentaires.
const MOODS = {
  facile: { bpm: -8, cutoff: -300, energy: 0 },
  moyen: { bpm: 0, cutoff: 0, energy: 1 },
  difficile: { bpm: 10, cutoff: 600, energy: 2 }
};
const MUSIC_GAIN = 0.22;
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

class AudioEngine {
  constructor() {
    this.ac = null;
    this.sfxOn = true;
    this.music = null;
    this.theme = { style: STYLES.berlin, mood: MOODS.moyen };
    this.lastArrive = 0;
    this.paused = false;
    this.broken = false;
    this.watchdog = null;
    this.attempts = 0; // recréations successives sans succès (on s'arrête à 3)
  }

  // Renvoie un contexte audio qui fonctionne. Les navigateurs bloquent le son avant le premier
  // vrai clic, et un contexte peut rester bloqué après une erreur du périphérique audio
  // (casque débranché, changement de sortie…) : dans ce cas on en recrée un neuf.
  ctx() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!this.ac || this.ac.state === 'closed' || this.broken) this.recreate();
    if (this.ac.state !== 'running' && !this.paused) {
      const ac = this.ac;
      ac.resume().catch(() => {});
      // Si la reprise ne répond pas alors que l'utilisateur a déjà cliqué, le contexte est bloqué
      clearTimeout(this.watchdog);
      this.watchdog = setTimeout(() => {
        const active = !navigator.userActivation || navigator.userActivation.hasBeenActive;
        if (ac === this.ac && ac.state !== 'running' && !this.paused && active && this.attempts < 3) {
          this.recreate();
          this.ac.resume().catch(() => {});
        }
      }, 600);
    }
    return this.ac;
  }

  recreate() {
    const AC = window.AudioContext || window.webkitAudioContext;
    const old = this.music ? { live: this.music.live, rush: this.music.rush } : null;
    this.stopMusic();
    if (this.ac) {
      this.ac.onerror = null;
      try { this.ac.close(); } catch (e) { /* déjà fermé */ }
    }
    this.broken = false;
    this.attempts += 1;
    this.ac = new AC();
    // Erreur du périphérique ou du moteur audio : le contexte sera recréé au prochain son
    this.ac.onerror = () => { this.broken = true; };
    this.ac.onstatechange = () => { if (this.ac && this.ac.state === 'running') this.attempts = 0; };
    if (old) {
      this.startMusic();
      this.music.live = old.live;
      this.music.rush = old.rush;
    }
  }

  // À appeler sur chaque vrai geste de l'utilisateur (clic, touche) : débloque le son.
  unlock() {
    this.ctx();
  }

  note(m, t, d, type, v, out) {
    const ac = this.ac;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.value = hz(m);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g);
    g.connect(out || ac.destination);
    o.start(t);
    o.stop(t + d + 0.05);
  }

  noiseBuffer(sec) {
    const ac = this.ac;
    const len = Math.floor(ac.sampleRate * sec);
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  // ---------- Effets sonores ----------

  sfx(name) {
    if (!this.sfxOn) return;
    const ac = this.ctx();
    if (!ac) return;
    const t = ac.currentTime + 0.01;
    if (name === 'green') this.note(84, t, 0.09, 'square', 0.18);
    else if (name === 'red') this.note(67, t, 0.09, 'square', 0.18);
    else if (name === 'spawn') {
      this.note(76, t, 0.12, 'triangle', 0.15);
      this.note(83, t + 0.1, 0.18, 'triangle', 0.15);
    } else if (name === 'arrive') {
      if (t - this.lastArrive < 0.5) return; // discret, pas plus d'une fois toutes les 0,5 s
      this.lastArrive = t;
      this.note(88, t, 0.15, 'sine', 0.12);
    } else if (name === 'late') {
      this.note(60, t, 0.2, 'sawtooth', 0.1);
      this.note(55, t + 0.15, 0.25, 'sawtooth', 0.1);
    } else if (name === 'crash') {
      const src = ac.createBufferSource();
      src.buffer = this.noiseBuffer(0.6);
      const f = ac.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.setValueAtTime(2400, t);
      f.frequency.exponentialRampToValueAtTime(120, t + 0.5);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.7, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
      src.connect(f); f.connect(g); g.connect(ac.destination);
      src.start(t);
      const o = ac.createOscillator();
      const og = ac.createGain();
      o.frequency.setValueAtTime(160, t);
      o.frequency.exponentialRampToValueAtTime(40, t + 0.3);
      og.gain.setValueAtTime(0.6, t);
      og.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      o.connect(og); og.connect(ac.destination);
      o.start(t); o.stop(t + 0.4);
    } else if (name === 'end') {
      [72, 76, 79, 84].forEach((m, i) => this.note(m, t + i * 0.12, 0.3, 'triangle', 0.2));
    } else if (name === 'rush') {
      // Alarme montante à l'entrée en heure de pointe
      [0, 0.18, 0.36, 0.54].forEach((d, i) => this.note(72 + i * 4, t + d, 0.16, 'square', 0.14));
    } else if (name === 'rushEnd') {
      [84, 79, 72].forEach((m, i) => this.note(m, t + i * 0.14, 0.2, 'triangle', 0.16));
    } else if (name === 'rushCount') {
      this.note(81, t, 0.12, 'square', 0.14);
    } else if (name === 'comboUp') {
      [79, 83, 86, 91].forEach((m, i) => this.note(m, t + i * 0.06, 0.12, 'triangle', 0.14));
    } else if (name === 'comboLost') {
      this.note(64, t, 0.18, 'triangle', 0.12);
      this.note(58, t + 0.12, 0.25, 'triangle', 0.12);
    } else if (name === 'tap') {
      this.note(79, t, 0.06, 'square', 0.1);
    }
  }

  // ---------- Musique ----------

  // Choisit le style (selon le plan) et l'énergie (selon la difficulté) de la musique.
  setTheme(city, level) {
    this.theme = { style: STYLES[city] || STYLES.berlin, mood: MOODS[level] || MOODS.moyen };
    if (this.music) Object.assign(this.music, this.theme);
  }

  startMusic() {
    const ac = this.ctx();
    if (!ac || this.music) return;
    // Chaîne : les nappes et mélodies passent par un passe-bas, puis par un gain « pompé »
    // à chaque grosse caisse (sidechain), avant la sortie.
    const master = ac.createGain();
    master.gain.value = MUSIC_GAIN;
    const duck = ac.createGain();
    const tone = ac.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = 1600;
    tone.Q.value = 0.7;
    master.connect(ac.destination);
    duck.connect(master);
    tone.connect(duck);
    // Écho court pour les accords et les touches de clavier
    const echo = ac.createDelay(1);
    const fb = ac.createGain();
    const wet = ac.createGain();
    fb.gain.value = 0.35;
    wet.gain.value = 0.3;
    echo.connect(fb); fb.connect(echo);
    echo.connect(wet); wet.connect(tone);
    this.music = {
      master, duck, tone, echo, step: 0, nextT: ac.currentTime + 0.05, live: 2, tick: null,
      noise: this.noiseBuffer(0.3), ...this.theme
    };
    this.music.tick = setInterval(() => this.schedule(), 25);
  }

  setIntensity(live) {
    if (this.music) this.music.live = live;
  }

  // Heure de pointe : p de 0 à 1 pendant les 15 s, null en dehors. Le tempo grimpe au fil de p.
  setRush(p) {
    if (this.music) this.music.rush = p;
  }

  pauseMusic(paused) {
    this.paused = paused;
    if (!this.ac) return;
    if (paused) this.ac.suspend().catch(() => {});
    else this.ctx();
  }

  stopMusic() {
    if (!this.music) return;
    clearInterval(this.music.tick);
    try {
      this.music.master.disconnect();
      this.music.tone.disconnect();
    } catch (e) { /* déjà déconnecté */ }
    this.music = null;
  }

  schedule() {
    const m = this.music;
    const ac = this.ac;
    if (!m || ac.state !== 'running') return;
    if (m.nextT < ac.currentTime) m.nextT = ac.currentTime + 0.02;
    // Le tempo et l'ouverture du filtre dépendent du plan, de la difficulté
    // et du nombre de rames en circulation.
    const rush = m.rush;
    const st = m.style;
    const energy = m.mood.energy;
    const base = st.bpm + m.mood.bpm;
    // En heure de pointe : boucle dédiée, 10 % plus rapide au départ puis jusqu'à +40 %
    const bpm = rush == null ? base + Math.min(12, 1.5 * m.live) : base * (1.1 + 0.3 * rush);
    const dur = 60 / bpm / 4;
    const cutoff = rush == null ? Math.min(4200, st.cutoff + m.mood.cutoff + 180 * m.live) : 6000;
    m.tone.frequency.setTargetAtTime(cutoff, ac.currentTime, rush == null ? 0.8 : 0.2);
    m.echo.delayTime.setValueAtTime(dur * 3, ac.currentTime);
    while (m.nextT < ac.currentTime + 0.12) {
      const s = m.step % 64;
      const b = s % 16;
      const chord = st.chords[Math.floor(s / 16)];
      if (rush != null) {
        this.rushStep(s, b, chord, m.nextT, dur, rush, m);
      } else {
        // Swing propre au style sur les doubles croches impaires
        const t = m.nextT + (b % 2 === 1 ? dur * st.swing : 0);
        if (b === 0) this.pad(chord.notes, t, dur * 15, m);
        if (st.stab.includes(b)) this.stab(chord.notes, t, dur * (st.strum ? 3 : 2), m);
        if (st.bass.includes(b)) {
          // La note tient jusqu'à la suivante (au plus 2,5 doubles croches)
          const next = st.bass.find((x) => x > b);
          const gap = (next == null ? st.bass[0] + 16 : next) - b;
          this.bass(chord.root + (st.bassOct.includes(b) ? 12 : 0), t, dur * Math.min(2.5, gap * 0.9), m);
        }
        if (st.kick.includes(b) || (energy === 2 && b === 14)) this.kick(t, m);
        if (st.clap.includes(b)) this.clap(t, m);
        // Charleston : motif du style, plus des doubles croches quand ça s'emballe
        if (st.hat.includes(b)) this.hat(t, m, 0.09, 0.09);
        else if (m.live >= [9, 6, 0][energy] && b % 2 === 1) this.hat(t, m, 0.035, 0.03);
        // Arpège : dès le niveau moyen pour les styles qui en ont un, en difficile pour les autres
        if (b % 2 === 0 && (st.arp ? energy >= 1 : energy === 2 && m.live >= 4)) {
          this.note(chord.notes[(s * 3) % chord.notes.length] + 12, t, dur * 0.9, st.lead, 0.025, m.tone);
        }
        const key = st.keys[s];
        if (key && m.live >= [1, 3, 3][energy]) this.keyNote(key, t, m);
      }
      m.nextT += dur;
      m.step += 1;
    }
  }

  // Heure de pointe : boucle techno plus rythmée, sans swing.
  // Basse « pompe » en doubles croches, charleston continu, clap renforcé et arpège qui monte.
  rushStep(s, b, chord, t, dur, rush, m) {
    // Kick sur chaque temps, plus un kick fantôme en fin de mesure pour relancer
    if (b % 4 === 0 || b === 14) this.kick(t, m);
    // Basse : fondamentale sur les contretemps, octave sur les autres doubles croches
    if (b % 4 !== 0) this.bass(chord.root + (b % 2 === 1 ? 12 : 0), t, dur * 0.8, m);
    // Charleston fermé à chaque double croche, ouvert sur les contretemps
    this.hat(t, m, b % 4 === 2 ? 0.12 : 0.05, b % 4 === 2 ? 0.14 : 0.03);
    // Clap sur les temps 2 et 4, doublé en fin d'heure de pointe
    if (b === 4 || b === 12 || (rush > 0.5 && b === 15)) this.clap(t, m);
    // Arpège carré sur les notes de l'accord, une octave plus haut quand l'heure de pointe avance
    const notes = chord.notes;
    const n = notes[(s * 3) % notes.length] + 12 + (rush > 0.6 ? 12 : 0);
    if (b % 2 === 0) this.note(n, t, dur * 0.9, m.style.lead, 0.045, m.master);
    // Montée de « riser » : bruit filtré de plus en plus fort sur la dernière mesure de chaque cycle
    if (s === 48) this.riser(t, dur * 16, m);
  }

  riser(t, d, m) {
    const ac = this.ac;
    const src = ac.createBufferSource();
    src.buffer = m.noise;
    src.loop = true;
    const f = ac.createBiquadFilter();
    f.type = 'bandpass';
    f.Q.value = 2;
    f.frequency.setValueAtTime(400, t);
    f.frequency.exponentialRampToValueAtTime(6000, t + d);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + d * 0.95);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    src.connect(f); f.connect(g); g.connect(m.master);
    src.start(t); src.stop(t + d + 0.05);
  }

  pad(notes, t, d, m) {
    const ac = this.ac;
    notes.forEach((n, i) => {
      [-6, 6].forEach((cents) => {
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = i === 0 ? 'triangle' : m.style.pad;
        o.frequency.value = hz(n);
        o.detune.value = cents;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(m.style.padGain, t + 0.35);
        g.gain.setTargetAtTime(0.0001, t + d - 0.3, 0.25);
        o.connect(g); g.connect(m.tone);
        o.start(t); o.stop(t + d + 0.8);
      });
    });
  }

  stab(notes, t, d, m) {
    // Guitare ou cordes pincées : les notes sont grattées l'une après l'autre
    const strum = m.style.strum ? 0.022 : 0;
    notes.slice(1, 4).forEach((n, i) => {
      this.note(n + 12, t + i * strum, d, 'triangle', 0.05, m.tone);
      this.note(n + 12, t + i * strum, d, 'triangle', 0.03, m.echo);
    });
  }

  bass(n, t, d, m) {
    const ac = this.ac;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = 'sine';
    o.frequency.value = hz(n + 12);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.45, t + 0.02);
    g.gain.setTargetAtTime(0.0001, t + d * 0.7, 0.06);
    o.connect(g); g.connect(m.master);
    o.start(t); o.stop(t + d + 0.3);
  }

  keyNote(n, t, m) {
    // Les ondes carrées et triangle sonnent plus fort que le sinus : on les baisse un peu
    const v = m.style.keyWave === 'sine' ? 0.09 : m.style.keyWave === 'square' ? 0.04 : 0.07;
    this.note(n, t, 0.6, m.style.keyWave, v, m.tone);
    this.note(n, t, 0.6, m.style.keyWave, v * 0.66, m.echo);
  }

  kick(t, m) {
    const ac = this.ac;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(110, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.75, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
    o.connect(g); g.connect(m.master);
    o.start(t); o.stop(t + 0.35);
    // Sidechain : les nappes s'effacent sur le coup de grosse caisse puis remontent
    m.duck.gain.cancelScheduledValues(t);
    m.duck.gain.setValueAtTime(0.35, t);
    m.duck.gain.linearRampToValueAtTime(1, t + 0.28);
  }

  clap(t, m) {
    const ac = this.ac;
    const src = ac.createBufferSource();
    src.buffer = m.noise;
    const f = ac.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 1400;
    f.Q.value = 0.9;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.22, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    src.connect(f); f.connect(g); g.connect(m.master);
    src.start(t); src.stop(t + 0.25);
  }

  hat(t, m, v, len) {
    const ac = this.ac;
    const src = ac.createBufferSource();
    src.buffer = m.noise;
    const f = ac.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = 6000;
    const g = ac.createGain();
    g.gain.setValueAtTime(v, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    src.connect(f); f.connect(g); g.connect(m.master);
    src.start(t); src.stop(t + len + 0.05);
  }
}

export const audio = new AudioEngine();

export function vibrate(settings, pattern) {
  if (settings.vibrations && navigator.vibrate) navigator.vibrate(pattern);
}
