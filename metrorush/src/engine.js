// Moteur de jeu MetroRush : pur JavaScript, sans dépendance à React.
// Les distances sont en pixels de carte, le temps en secondes.

export const TRAIN_LEN = 36;
export const ZONE = 25; // demi-largeur de la zone de croisement (distance au centre de la rame)
export const STOP_GAP = 30; // la rame s'arrête avec son centre à STOP_GAP px du croisement
export const FOLLOW_GAP = 42; // distance minimale entre deux rames qui se suivent (longueur + 6 px)
export const BLOCK_SECONDS = 3;
export const WARN_WAIT = 7;
export const PENALTY_WAIT = 10;
export const DWELL = 3; // arrêt à quai, en secondes
export const PLATFORM_LEN = 50;
export const SPAWN_WARN = 1.5; // le terminus clignote jusqu'à 1,5 s avant l'apparition d'une rame
export const RUSH_WARN = 3; // compte à rebours avant l'heure de pointe
export const COMBO_STEP = 5; // le multiplicateur monte toutes les 5 arrivées sans erreur
export const COMBO_MAX = 4;
const PLATFORM_GAP = 44; // distance entre le centre du quai et la ligne d'arrêt du feu
const EXTRA_SPACING = 140; // écart visé entre deux quais supplémentaires sur un tronçon libre

// ---------- Géométrie ----------

function segCross(a, b, c, d) {
  const rx = b[0] - a[0], ry = b[1] - a[1], sx = d[0] - c[0], sy = d[1] - c[1];
  const den = rx * sy - ry * sx;
  if (Math.abs(den) < 1e-9) return null;
  const qx = c[0] - a[0], qy = c[1] - a[1];
  const t = (qx * sy - qy * sx) / den;
  const u = (qx * ry - qy * rx) / den;
  if (t < 0.001 || t > 1.0001 || u < 0.001 || u > 1.0001) return null;
  return { x: a[0] + t * rx, y: a[1] + t * ry, t, u };
}

function distToSeg(px, py, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const l2 = dx * dx + dy * dy;
  let k = l2 ? ((px - a[0]) * dx + (py - a[1]) * dy) / l2 : 0;
  k = Math.max(0, Math.min(1, k));
  return Math.hypot(px - (a[0] + k * dx), py - (a[1] + k * dy));
}

function prepLine(line, index) {
  const segs = [];
  let total = 0;
  for (let i = 0; i < line.p.length - 1; i++) {
    const a = line.p[i], b = line.p[i + 1];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    segs.push({ a, b, len, start: total, dx: (b[0] - a[0]) / len, dy: (b[1] - a[1]) / len });
    total += len;
  }
  return { ...line, index, segs, total, stops: [], platforms: [] };
}

export function pointAt(line, s) {
  const segs = line.segs;
  let seg = segs[segs.length - 1];
  for (let i = 0; i < segs.length; i++) {
    if (s <= segs[i].start + segs[i].len) { seg = segs[i]; break; }
  }
  const k = Math.max(0, Math.min(seg.len, s - seg.start));
  return {
    x: seg.a[0] + seg.dx * k,
    y: seg.a[1] + seg.dy * k,
    dx: seg.dx,
    dy: seg.dy,
    a: Math.atan2(seg.dy, seg.dx) * 180 / Math.PI
  };
}

// Construit le réseau jouable : lignes actives, croisements et feux.
export function buildNetwork(rawLines, names = {}) {
  const lines = rawLines.map(prepLine);
  const crossings = [];
  const seen = {};
  const named = {}; // deux lignes qui se croisent deux fois (boucle en U) : le nom va au premier croisement
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      const A = lines[i], B = lines[j];
      A.segs.forEach((sa) => {
        B.segs.forEach((sb) => {
          const r = segCross(sa.a, sa.b, sb.a, sb.b);
          if (!r) return;
          const key = Math.round(r.x) + ',' + Math.round(r.y);
          if (seen[key]) return;
          seen[key] = true;
          const pair = i + '-' + j;
          crossings.push({
            id: crossings.length,
            x: r.x, y: r.y, i, j,
            di: sa.start + r.t * sa.len,
            dj: sb.start + r.u * sb.len,
            name: named[pair] ? null : names[pair] || null
          });
          named[pair] = true;
        });
      });
    }
  }

  const lights = [];
  crossings.forEach((cr) => {
    [[cr.i, cr.di], [cr.j, cr.dj]].forEach(([li, d]) => {
      const line = lines[li];
      const stop = pointAt(line, Math.max(0, d - STOP_GAP));
      // Le feu se place à côté de la voie, du côté le plus dégagé.
      const nx = -stop.dy, ny = stop.dx;
      const OFF = 24;
      let side = 1;
      const crowded = (sx) => lines.some((other) => other.index !== li &&
        other.segs.some((sg) => distToSeg(stop.x + nx * OFF * sx, stop.y + ny * OFF * sx, sg.a, sg.b) < 16));
      if (crowded(1) && !crowded(-1)) side = -1;
      const light = {
        id: lights.length,
        crossing: cr.id,
        line: li,
        d,
        stopX: stop.x, stopY: stop.y, stopA: stop.a,
        x: stop.x + nx * OFF * side,
        y: stop.y + ny * OFF * side,
        side
      };
      lights.push(light);
      line.stops.push({ d, light: light.id, crossing: cr.id, side });
    });
  });
  lines.forEach((l) => l.stops.sort((a, b) => a.d - b.d));

  // Un quai avant chaque feu : la rame marque l'arrêt, puis le feu, puis le croisement.
  const platforms = [];
  lines.forEach((line) => {
    let prevEnd = 20;
    line.stops.forEach((st) => {
      const stopS = st.d - STOP_GAP;
      let s = stopS - PLATFORM_GAP;
      if (s < prevEnd) s = (prevEnd + stopS) / 2;
      if (stopS - s >= 22 && s >= prevEnd - 0.5) {
        const p = pointAt(line, s);
        const pf = { id: platforms.length, line: line.index, s, x: p.x, y: p.y, a: p.a, nx: -p.dy * -st.side, ny: p.dx * -st.side };
        platforms.push(pf);
        line.platforms.push(pf);
      }
      prevEnd = st.d + ZONE + TRAIN_LEN / 2 + 4;
    });
  });

  // Quais supplémentaires : sur chaque long tronçon libre (sans croisement, feu, virage ni terminus).
  lines.forEach((line) => {
    const half = PLATFORM_LEN / 2;
    // Zones interdites, en tenant compte de la demi-longueur du quai (son centre doit rester hors de ces zones)
    // Un quai peut se trouver juste après le terminus de départ (station de départ)
    const busy = [[0, half + 6], [line.total - 45 - half, line.total]];
    line.stops.forEach((st) => busy.push([st.d - STOP_GAP - half - 2, st.d + ZONE + TRAIN_LEN / 2 + half]));
    line.platforms.forEach((p) => busy.push([p.s - PLATFORM_LEN - 12, p.s + PLATFORM_LEN + 12]));
    line.segs.slice(1).forEach((sg) => busy.push([sg.start - half - 4, sg.start + half + 4]));
    busy.sort((a, b) => a[0] - b[0]);
    let cursor = 0;
    const gaps = [];
    busy.forEach(([a, b]) => {
      if (a > cursor) gaps.push([cursor, a]);
      cursor = Math.max(cursor, b);
    });
    gaps.forEach(([a, b]) => {
      const len = b - a;
      if (len < 0) return;
      // Un quai par tronçon libre, plus un tous les EXTRA_SPACING px sur les grands tronçons
      const n = 1 + Math.floor(len / EXTRA_SPACING);
      for (let k = 0; k < n; k++) {
        const s = n === 1 ? (a + b) / 2 : a + (len * k) / (n - 1);
        const p = pointAt(line, s);
        // Côté le plus dégagé de la voie
        const nx = -p.dy, ny = p.dx;
        const crowded = (sx) => lines.some((other) => other.index !== line.index &&
          other.segs.some((sg) => distToSeg(p.x + nx * 13 * sx, p.y + ny * 13 * sx, sg.a, sg.b) < 12));
        const side = crowded(-1) && !crowded(1) ? 1 : -1;
        const pf = { id: platforms.length, line: line.index, s, x: p.x, y: p.y, a: p.a, nx: nx * side, ny: ny * side };
        platforms.push(pf);
        line.platforms.push(pf);
      }
    });
    line.platforms.sort((a, b) => a.s - b.s);
  });

  return { lines, crossings, lights, platforms };
}

// Temps pour atteindre la distance d sur une ligne, arrêts à quai compris.
export function travelTime(net, li, d, speed) {
  const line = net.lines[li];
  return d / speed + DWELL * line.platforms.filter((p) => p.s < d).length;
}

// ---------- Partie ----------

let uid = 1;

export function createGame(cfg) {
  const net = cfg.net;
  const state = {
    cfg,
    net,
    elapsed: 0,
    remaining: cfg.duration ?? Infinity,
    score: 0,
    arrived: 0,
    collisions: 0,
    trains: [],
    green: net.lights.map(() => !cfg.startRed), // en partie, tous les feux démarrent au rouge
    blocked: {},
    spawnTimer: cfg.spawnInterval,
    nextLine: 0,
    incoming: null, // ligne annoncée pour la prochaine apparition régulière
    combo: 0, // arrivées d'affilée sans collision ni retard
    bestCombo: 0,
    rushCount: null, // secondes avant l'heure de pointe pendant le compte à rebours
    scheduled: [],
    events: [],
    effects: [],
    risk: [],
    rushActive: false,
    over: null
  };
  if (cfg.scheduled) {
    state.scheduled = cfg.scheduled.map((s) => ({ ...s }));
  } else if (cfg.opening !== false) {
    state.scheduled = openingSchedule(net, cfg.speed);
  }
  return state;
}

// Les deux premières rames sont lancées pour arriver ensemble au même croisement (avant 15 s).
function openingSchedule(net, speed) {
  if (!net.crossings.length) return [];
  const timed = net.crossings.map((cr) => {
    const ti = travelTime(net, cr.i, cr.di, speed);
    const tj = travelTime(net, cr.j, cr.dj, speed);
    return { cr, ti, tj, T: Math.max(ti, tj) };
  });
  let best = null;
  timed.forEach((c) => {
    if (c.T > 14) return;
    const score = Math.abs(c.T - 10);
    if (!best || score < best.score) best = { ...c, score };
  });
  if (!best) best = timed.reduce((a, b) => (a.T < b.T ? a : b));
  const { cr, ti, tj } = best;
  // Le premier conflit arrive entre 9 et 14 s : assez tôt pour apprendre, assez tard pour réagir
  const T = Math.max(best.T, 9);
  return [
    { line: cr.i, at: Math.max(0, T - ti) },
    { line: cr.j, at: Math.max(0, T - tj) }
  ];
}

function currentSpeed(state) {
  const { speed, accel = 0, rush } = state.cfg;
  const boost = state.rushActive ? rush.factor : 1;
  // accel : gain de vitesse par minute, appliqué en continu (0,3 = +30 % au bout de 60 s)
  return speed * (1 + accel * state.elapsed / 60) * boost;
}

// Heure de pointe : fenêtre de temps pendant laquelle les rames roulent plus vite.
function updateRush(state) {
  const r = state.cfg.rush;
  if (!r) return;
  const cd = r.start - state.elapsed;
  const count = cd > 0 && cd <= RUSH_WARN ? Math.ceil(cd) : null;
  if (count !== state.rushCount) {
    state.rushCount = count;
    if (count) state.events.push({ type: 'rushCount', n: count });
  }
  const active = state.elapsed >= r.start && state.elapsed < r.start + r.duration;
  if (active !== state.rushActive) {
    state.rushActive = active;
    state.events.push({ type: active ? 'rushStart' : 'rushEnd' });
  }
}

// Avancement de l'heure de pointe, de 0 (début) à 1 (fin) ; null hors heure de pointe.
export function rushProgress(state) {
  if (!state.rushActive) return null;
  const r = state.cfg.rush;
  return Math.min(1, (state.elapsed - r.start) / r.duration);
}

export function rushRemaining(state) {
  if (!state.rushActive) return 0;
  const r = state.cfg.rush;
  return Math.max(0, r.start + r.duration - state.elapsed);
}

// Avancement de la partie, de 0 (début) à 1 (fin du chronomètre)
function progress(state) {
  const d = state.cfg.duration;
  return d && d !== Infinity ? Math.min(1, state.elapsed / d) : 0;
}

export function spawnInterval(state) {
  const { spawnInterval: base, ramp } = state.cfg;
  if (!ramp) return base;
  return base * (1 - (1 - ramp.spawnEnd) * progress(state));
}

export function maxTrains(state) {
  const { maxTrains: base, ramp } = state.cfg;
  if (!ramp) return base;
  return Math.round(base * (1 + ramp.maxBoost * progress(state)));
}

// Durée de l'annonce, raccourcie quand les rames apparaissent très souvent.
function spawnWarn(state) {
  return Math.min(SPAWN_WARN, spawnInterval(state) * 0.6);
}

// Lignes dont le terminus annonce une rame imminente (apparitions régulières et programmées).
export function incomingLines(state) {
  const out = new Set();
  if (state.incoming != null) out.add(state.incoming);
  state.scheduled.forEach((sc) => { if (sc.at - state.elapsed <= SPAWN_WARN) out.add(sc.line); });
  return out;
}

export function comboMultiplier(state) {
  return Math.min(COMBO_MAX, 1 + Math.floor(state.combo / COMBO_STEP));
}

function breakCombo(state) {
  if (state.combo >= COMBO_STEP) state.events.push({ type: 'comboLost' });
  state.combo = 0;
}

const NEAR_START = 70; // un croisement à moins de 70 px du terminus est géré à l'apparition

function startFree(state, li) {
  if (state.trains.some((t) => t.line === li && t.s < FOLLOW_GAP + 4)) return false;
  // Croisement tout proche du terminus : la rame attend au terminus si son feu est rouge,
  // si le croisement est bloqué, ou si une rame de l'autre ligne arrive dessus.
  const line = state.net.lines[li];
  for (const st of line.stops) {
    if (st.d >= NEAR_START) break;
    if (!state.green[st.light] || isBlocked(state, st.crossing)) return false;
    const cr = state.net.crossings[st.crossing];
    const other = cr.i === li ? cr.j : cr.i;
    const od = cr.i === li ? cr.dj : cr.di;
    if (state.trains.some((t) => t.line === other && t.s > od - ZONE - 60 && t.s < od + ZONE)) return false;
  }
  return true;
}

function pickLine(state) {
  const n = state.net.lines.length;
  for (let k = 0; k < n; k++) {
    const li = (state.nextLine + k) % n;
    if (startFree(state, li)) return li;
  }
  return null;
}

function addTrain(state, li) {
  const t = { id: uid++, line: li, s: 0, wait: 0, penalized: false, moving: true, dwell: 0, nextPlat: 0 };
  state.trains.push(t);
  state.events.push({ type: 'spawn' });
  return t;
}

function effect(state, x, y, text, kind) {
  state.effects.push({ id: uid++, x, y, text, kind, age: 0 });
}

export function toggleLight(state, id) {
  state.green[id] = !state.green[id];
  return state.green[id];
}

export function isBlocked(state, crossingId) {
  const until = state.blocked[crossingId];
  return until != null && until > state.elapsed;
}

export function step(state, dt) {
  if (state.over) return state;
  const { net, cfg } = state;
  state.elapsed += dt;
  if (state.remaining !== Infinity) {
    state.remaining -= dt;
    if (state.remaining <= 0) {
      state.remaining = 0;
      state.over = 'time';
      state.events.push({ type: 'end' });
      return state;
    }
  }

  updateRush(state);
  const speed = currentSpeed(state);

  // Apparitions programmées (ouverture / tutoriel)
  state.scheduled = state.scheduled.filter((sc) => {
    if (state.elapsed < sc.at) return true;
    if (state.trains.length >= cfg.maxTrains || !startFree(state, sc.line)) return true;
    addTrain(state, sc.line);
    return false;
  });

  // Apparitions régulières, de plus en plus fréquentes : on attend qu'une place se libère.
  // La ligne est choisie un peu avant l'apparition, pour que son terminus l'annonce.
  if (cfg.spawnInterval !== Infinity) {
    state.spawnTimer = Math.max(0, state.spawnTimer - dt);
    const warn = spawnWarn(state);
    if (state.trains.length >= maxTrains(state)) {
      state.incoming = null;
    } else if (state.spawnTimer <= warn) {
      if (state.incoming == null) {
        state.incoming = pickLine(state);
        // Annonce (re)lancée : le joueur a toujours le temps de la voir
        if (state.incoming != null) state.spawnTimer = Math.max(state.spawnTimer, warn);
      }
      if (state.spawnTimer <= 0 && state.incoming != null) {
        const li = state.incoming;
        state.incoming = null;
        if (startFree(state, li)) {
          addTrain(state, li);
          state.nextLine = (li + 1) % net.lines.length;
          state.spawnTimer = spawnInterval(state);
        }
        // Sinon, le terminus annoncé s'est bloqué : une autre ligne sera annoncée
      }
    }
  }

  // Positions avant déplacement (pour le suivi sur voie partagée)
  const pos = new Map();
  state.trains.forEach((t) => pos.set(t.id, pointAt(net.lines[t.line], t.s)));

  // Déplacement, de la rame la plus avancée à la moins avancée sur chaque ligne
  const order = [...state.trains].sort((a, b) => (a.line - b.line) || (b.s - a.s));
  const leaderS = {};
  order.forEach((t) => {
    const line = net.lines[t.line];
    // Arrêt à quai : la rame attend, sans pénalité
    if (t.dwell > 0) {
      t.dwell = Math.max(0, t.dwell - dt);
      t.moving = false;
      t.wait = 0;
      leaderS[t.line] = t.s;
      return;
    }
    let limit = Infinity;
    const plat = line.platforms[t.nextPlat];
    if (plat) limit = plat.s;
    if (leaderS[t.line] != null) limit = Math.min(limit, leaderS[t.line] - FOLLOW_GAP);
    for (const st of line.stops) {
      const stopS = st.d - STOP_GAP;
      if (t.s > stopS + 0.5) continue; // déjà engagée : elle termine sa traversée
      if (!state.green[st.light] || isBlocked(state, st.crossing)) {
        limit = Math.min(limit, stopS);
        break;
      }
    }
    // Rames d'autres lignes devant, dans le même sens (tronçon commun)
    const me = pos.get(t.id);
    state.trains.forEach((o) => {
      if (o === t || o.line === t.line) return;
      const p = pos.get(o.id);
      if (me.dx * p.dx + me.dy * p.dy < 0.95) return;
      const vx = p.x - me.x, vy = p.y - me.y;
      const fwd = vx * me.dx + vy * me.dy;
      const lat = Math.abs(vx * me.dy - vy * me.dx);
      if (fwd > 0 && fwd < FOLLOW_GAP && lat < 7) limit = Math.min(limit, t.s);
    });

    const next = Math.max(t.s, Math.min(t.s + speed * dt, limit));
    const moved = next - t.s;
    t.s = next;
    leaderS[t.line] = t.s;
    if (plat && t.s >= plat.s - 0.01) {
      t.dwell = DWELL;
      t.nextPlat += 1;
      t.moving = false;
      t.wait = 0;
      return;
    }
    t.moving = moved > speed * dt * 0.3;
    if (t.moving) {
      t.wait = 0;
      t.penalized = false;
    } else {
      t.wait += dt;
      if (t.wait >= PENALTY_WAIT && !t.penalized) {
        t.penalized = true;
        state.score = Math.max(0, state.score - 1);
        breakCombo(state);
        const p = pointAt(line, t.s);
        effect(state, p.x, p.y, '−1', 'bad');
        state.events.push({ type: 'late' });
      }
    }
  });

  // Arrivées au terminus
  state.trains = state.trains.filter((t) => {
    const line = net.lines[t.line];
    if (t.s < line.total) return true;
    const mult = comboMultiplier(state);
    state.score += mult;
    state.arrived += 1;
    state.combo += 1;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    const end = line.p[line.p.length - 1];
    effect(state, end[0], end[1], '+' + mult, mult > 1 ? 'good combo' : 'good');
    state.events.push({ type: 'arrive' });
    const next = comboMultiplier(state);
    if (next > mult) state.events.push({ type: 'comboUp', mult: next });
    return false;
  });

  // Collisions
  net.crossings.forEach((cr) => {
    const inZone = (li, d) => state.trains.find((t) => t.line === li && Math.abs(t.s - d) < ZONE);
    const a = inZone(cr.i, cr.di);
    const b = a && inZone(cr.j, cr.dj);
    if (!a || !b) return;
    state.trains = state.trains.filter((t) => t !== a && t !== b);
    state.collisions += 1;
    state.score = Math.max(0, state.score - 1);
    breakCombo(state);
    state.blocked[cr.id] = state.elapsed + BLOCK_SECONDS;
    effect(state, cr.x, cr.y, '−1', 'bad');
    effect(state, cr.x, cr.y, '', 'boom');
    state.events.push({ type: 'crash', x: cr.x, y: cr.y });
  });
  if (cfg.gameOver && state.collisions >= 5) {
    state.over = 'gameover';
    state.events.push({ type: 'end' });
  }

  // Croisements à risque (aide visuelle)
  state.risk = computeRisk(state, speed);

  state.effects.forEach((e) => { e.age += dt; });
  state.effects = state.effects.filter((e) => e.age < 1.4);
  return state;
}

function eta(state, li, cr, d, speed) {
  const line = state.net.lines[li];
  let best = Infinity;
  state.trains.forEach((t) => {
    if (t.line !== li) return;
    const gap = d - t.s;
    if (gap < -ZONE || gap > 260) return;
    // Un feu rouge entre la rame et le croisement : pas de danger
    const st = line.stops.find((x) => x.crossing === cr.id);
    if (st && !state.green[st.light] && t.s <= d - STOP_GAP + 0.5) return;
    const stopsLeft = line.platforms.slice(t.nextPlat).filter((p) => p.s < d).length;
    best = Math.min(best, Math.max(0, gap - ZONE) / speed + t.dwell + DWELL * stopsLeft);
  });
  return best;
}

function computeRisk(state, speed) {
  const aid = state.cfg.aid;
  if (aid === 'none') return [];
  const horizon = aid === 'full' ? 5 : 1;
  const out = [];
  state.net.crossings.forEach((cr) => {
    if (isBlocked(state, cr.id)) return;
    const ea = eta(state, cr.i, cr, cr.di, speed);
    const eb = eta(state, cr.j, cr, cr.dj, speed);
    if (ea === Infinity || eb === Infinity) return;
    if (Math.abs(ea - eb) < 2 && Math.min(ea, eb) <= horizon) out.push(cr.id);
  });
  return out;
}

export function drainEvents(state) {
  const ev = state.events;
  state.events = [];
  return ev;
}
