// Réseaux simplifiés (coordonnées dans la zone de carte 844 x 334).
// Chaque ligne circule dans un seul sens : du premier point vers le dernier.
export const CITIES = {
  berlin: {
    key: 'berlin',
    bg: 'linear-gradient(135deg, #FFF4C7 0%, #E9E4F5 55%, #D6DEEF 100%)', // fond pastel de l'écran de jeu
    label: 'Berlin',
    tagline: 'Réseau aéré, peu de croisements',
    recommended: true,
    lines: [
      { n: 'U2', c: '#DA421E', p: [[30, 170], [810, 170]] },
      { n: 'U6', c: '#8C6DAB', p: [[300, 20], [300, 310]] },
      { n: 'U8', c: '#224F86', p: [[560, 20], [560, 100], [640, 180], [640, 310]] },
      { n: 'U7', c: '#3690C0', p: [[30, 260], [410, 260], [610, 60], [810, 60]] },
      { n: 'U5', c: '#7E5330', p: [[720, 310], [720, 120]] },
      { n: 'U1', c: '#7DAD4C', p: [[30, 110], [470, 110]] }
    ],
    names: { '0-1': 'Stadtmitte', '0-2': 'Alexanderplatz', '1-3': 'Mehringdamm', '2-3': 'Hermannplatz', '0-3': 'Bismarckstraße', '1-5': 'Hallesches Tor', '0-4': 'Warschauer Straße' }
  },
  london: {
    key: 'london',
    bg: 'linear-gradient(135deg, #FFD9D6 0%, #E3E6F7 50%, #CFE0FA 100%)', // fond pastel de l'écran de jeu
    label: 'Londres',
    tagline: 'Des lignes partagent la même voie',
    lines: [
      { n: 'Circle', c: '#FFD300', tc: '#1D2B53', edge: '#B8960A', p: [[30, 220], [810, 220]] },
      { n: 'District', c: '#00843D', shared: [2], p: [[30, 300], [360, 300], [440, 220], [620, 220], [700, 300], [810, 300]] },
      { n: 'Northern', c: '#1C1C1C', p: [[230, 20], [230, 310]] },
      { n: 'Central', c: '#DC241F', p: [[30, 120], [810, 120]] },
      { n: 'Piccadilly', c: '#0019A8', p: [[30, 40], [680, 40], [760, 120], [760, 310]] },
      { n: 'Victoria', c: '#0098D4', p: [[340, 310], [340, 20]] }
    ],
    names: { '0-1': 'Gloucester Road', '0-2': "King's Cross", '1-2': 'Embankment', '2-3': 'Bank', '3-4': 'Holborn', '1-4': "Earl's Court", '0-5': 'Victoria', '3-5': 'Oxford Circus', '2-4': 'Leicester Square', '1-5': 'Pimlico', '0-4': 'South Kensington' }
  },
  paris: {
    key: 'paris',
    bg: 'linear-gradient(135deg, #DDF1E8 0%, #F7EAD9 50%, #F3D6E3 100%)', // fond pastel de l'écran de jeu
    label: 'Paris',
    tagline: 'Croisements très serrés',
    lines: [
      { n: '1', c: '#FFCD00', tc: '#1D2B53', edge: '#B89200', p: [[30, 170], [810, 170]] },
      { n: '4', c: '#C04191', p: [[380, 20], [380, 310]] },
      { n: '7', c: '#FA9ABA', tc: '#1D2B53', p: [[600, 20], [460, 160], [460, 310]] },
      { n: '11', c: '#8D5E2A', p: [[810, 90], [220, 90], [150, 20]] },
      { n: '14', c: '#62259D', p: [[30, 250], [560, 250], [700, 110], [810, 110]] },
      { n: '9', c: '#B6BD00', tc: '#1D2B53', p: [[130, 20], [130, 310]] }
    ],
    names: { '0-1': 'Châtelet', '0-2': 'Palais Royal', '0-4': 'Gare de Lyon', '2-4': 'Pyramides', '0-5': 'Franklin D. Roosevelt', '1-3': 'Réaumur', '1-4': 'Saint-Michel', '2-3': 'Opéra', '4-5': 'Saint-Lazare' }
  },
  newyork: {
    key: 'newyork',
    bg: 'linear-gradient(135deg, #FFF0C9 0%, #FDE0CC 50%, #D7E3F4 100%)', // fond pastel de l'écran de jeu
    label: 'New York',
    tagline: 'Grille de Manhattan, lignes express',
    lines: [
      { n: '1', c: '#EE352E', p: [[250, 20], [250, 310]] },
      { n: 'A', c: '#0039A6', p: [[30, 240], [450, 240], [530, 160], [810, 160]] },
      { n: 'L', c: '#A7A9AC', tc: '#1D2B53', p: [[30, 110], [810, 110]] },
      { n: '4', c: '#00933C', p: [[420, 20], [420, 180], [500, 260], [500, 310]] },
      { n: 'N', c: '#FCCC0A', tc: '#1D2B53', p: [[30, 40], [600, 40], [680, 120], [680, 310]] },
      { n: '7', c: '#B933AD', p: [[810, 280], [120, 280], [120, 20]] }
    ],
    names: { '0-1': 'Chambers St', '0-2': '14 St', '0-4': 'Times Sq–42 St', '1-3': 'Fulton St', '1-4': 'Canal St', '2-3': 'Union Sq', '2-4': '14 St–Union Sq', '3-4': 'Brooklyn Bridge', '0-5': 'Times Sq', '1-5': '42 St–Port Authority', '2-5': 'Court Sq', '3-5': 'Grand Central', '4-5': 'Queensboro Plaza' }
  },
  madrid: {
    key: 'madrid',
    bg: 'linear-gradient(135deg, #FFE1D1 0%, #FFF0C2 50%, #FBD6D6 100%)', // fond pastel de l'écran de jeu
    label: 'Madrid',
    tagline: 'Lignes longues autour de Sol',
    lines: [
      { n: 'L1', c: '#38A3DC', p: [[350, 20], [350, 180], [450, 280], [810, 280]] },
      { n: 'L2', c: '#E3292E', p: [[30, 150], [810, 150]] },
      { n: 'L3', c: '#FFD500', tc: '#1D2B53', p: [[520, 20], [520, 310]] },
      { n: 'L5', c: '#7BBF3E', p: [[30, 60], [650, 60], [750, 160], [750, 310]] },
      { n: 'L10', c: '#005AA9', p: [[200, 310], [200, 20]] },
      { n: 'L6', c: '#9DA1A4', tc: '#1D2B53', p: [[30, 230], [810, 230]] }
    ],
    names: { '0-1': 'Sol', '0-2': 'Legazpi', '1-2': 'Ópera', '0-3': 'Bilbao', '1-3': 'Ventas', '2-3': 'Callao', '1-4': 'Plaza de España', '3-4': 'Alonso Martínez', '0-5': 'Cuatro Caminos', '2-5': 'Plaza Elíptica', '3-5': 'Oporto', '4-5': 'Príncipe Pío' }
  },
  rome: {
    key: 'rome',
    bg: 'linear-gradient(135deg, #FCE3CF 0%, #F6D5C8 50%, #E9E2C9 100%)', // fond pastel de l'écran de jeu
    label: 'Rome',
    tagline: 'Peu de lignes, croisements décisifs',
    lines: [
      { n: 'A', c: '#E94E1B', p: [[30, 90], [420, 90], [580, 250], [810, 250]] },
      { n: 'B', c: '#0072BC', p: [[120, 310], [120, 170], [810, 170]] },
      { n: 'C', c: '#57B947', p: [[700, 20], [700, 310]] },
      { n: 'B1', c: '#00A0E2', p: [[30, 40], [810, 40]] },
      { n: 'Lido', c: '#C1272D', p: [[30, 230], [530, 230]] },
      { n: '8', c: '#8E3E97', p: [[400, 310], [400, 20]] }
    ],
    names: { '0-1': 'Termini', '0-2': 'San Giovanni', '1-2': 'Colosseo', '2-3': 'Pigneto', '1-4': 'Piramide', '0-5': 'Barberini', '1-5': 'Circo Massimo', '3-5': 'Bologna', '4-5': 'Porta San Paolo' }
  },
  seoul: {
    key: 'seoul',
    bg: 'linear-gradient(135deg, #DDF1FB 0%, #E9E1F8 50%, #FBDDEB 100%)', // fond pastel de l'écran de jeu
    label: 'Séoul',
    tagline: 'Réseau dense, nombreuses correspondances',
    lines: [
      { n: '1', c: '#0052A4', p: [[30, 140], [810, 140]] },
      { n: '2', c: '#00A84D', p: [[200, 20], [200, 310]] },
      { n: '3', c: '#EF7C1C', p: [[30, 300], [360, 300], [560, 100], [810, 100]] },
      { n: '4', c: '#00A5DE', p: [[640, 20], [640, 310]] },
      { n: '5', c: '#996CAC', p: [[30, 60], [810, 60]] },
      { n: '9', c: '#BDB092', tc: '#1D2B53', p: [[810, 250], [30, 250]] }
    ],
    names: { '0-1': 'Sindorim', '0-2': 'Jongno 3-ga', '1-2': 'Euljiro 3-ga', '0-3': 'Seoul Station', '2-3': 'Chungmuro', '1-4': 'Yeongdeungpo-gu Office', '3-4': 'Dongdaemun', '1-5': 'Dangsan', '2-5': 'Express Bus Terminal', '3-5': 'Dongjak' }
  },
  tokyo: {
    key: 'tokyo',
    bg: 'linear-gradient(135deg, #FFDDE6 0%, #FBEAEF 50%, #DCE8F8 100%)', // fond pastel de l'écran de jeu
    label: 'Tokyo',
    tagline: 'Lignes en diagonale, rythme soutenu',
    lines: [
      { n: 'G', c: '#FF9500', tc: '#1D2B53', p: [[30, 120], [500, 120], [620, 240], [810, 240]] },
      { n: 'M', c: '#F62E36', p: [[300, 310], [300, 200], [400, 100], [400, 20]] },
      { n: 'H', c: '#B5B5AC', tc: '#1D2B53', p: [[30, 280], [560, 280], [700, 140], [810, 140]] },
      { n: 'T', c: '#009BBF', p: [[720, 20], [720, 310]] },
      { n: 'C', c: '#00BB85', p: [[30, 40], [810, 40]] },
      { n: 'Z', c: '#8F76D6', p: [[810, 190], [150, 190]] }
    ],
    names: { '0-1': 'Ginza', '0-2': 'Ueno', '1-2': 'Kasumigaseki', '0-3': 'Nihombashi', '2-3': 'Kayabacho', '1-4': 'Kokkai-gijidomae', '3-4': 'Otemachi', '0-5': 'Mitsukoshimae', '1-5': 'Nagatacho', '2-5': 'Ningyocho', '3-5': 'Kudanshita' }
  },
  beijing: {
    key: 'beijing',
    bg: 'linear-gradient(135deg, #FBD9D3 0%, #FFEFC8 50%, #F6E1C6 100%)', // fond pastel de l'écran de jeu
    label: 'Pékin',
    tagline: 'Grands axes en damier',
    lines: [
      { n: '1', c: '#C23A30', p: [[30, 170], [810, 170]] },
      { n: '2', c: '#006098', p: [[30, 80], [600, 80], [700, 180], [700, 310]] },
      { n: '5', c: '#A6217F', p: [[450, 20], [450, 310]] },
      { n: '4', c: '#008E9C', p: [[260, 310], [260, 20]] },
      { n: '10', c: '#0092C7', p: [[30, 260], [810, 260]] },
      { n: '6', c: '#B58500', p: [[810, 120], [30, 120]] }
    ],
    names: { '0-1': 'Jianguomen', '0-2': 'Dongdan', '1-2': 'Yonghegong', '0-3': 'Xidan', '1-3': 'Xizhimen', '1-4': 'Sanyuanqiao', '2-4': 'Huixinxijie Nankou', '3-4': 'Haidian Huangzhuang', '1-5': 'Chaoyangmen', '2-5': 'Dongsi', '3-5': "Ping'anli" }
  },
  rio: {
    key: 'rio',
    bg: 'linear-gradient(135deg, #D9F5EE 0%, #FFF3C4 50%, #FFDCC8 100%)', // fond pastel de l'écran de jeu
    label: 'Rio',
    tagline: 'Métro, VLT et trains de banlieue',
    // Métro (lignes 1, 2 et 4), tramway VLT, train de banlieue SuperVia et bus rapide BRT
    lines: [
      { n: '1', c: '#F58220', p: [[30, 210], [380, 210], [500, 90], [810, 90]] },
      { n: '2', c: '#00A651', p: [[30, 140], [810, 140]] },
      { n: '4', c: '#FDC82F', tc: '#1D2B53', p: [[560, 310], [560, 20]] },
      { n: 'VLT', c: '#0072BC', p: [[200, 20], [200, 310]] },
      { n: 'SV', c: '#D7262E', p: [[810, 270], [30, 270]] },
      { n: 'BRT', c: '#00A19A', p: [[30, 40], [810, 40]] }
    ],
    names: { '0-1': 'Estácio', '0-2': 'General Osório', '1-2': 'Botafogo', '0-3': 'Cinelândia', '1-3': 'Central', '2-4': 'Jardim Oceânico', '3-4': 'Praça XV', '2-5': 'São Conrado', '3-5': 'Saúde' }
  }
};

export const CITY_ORDER = ['berlin', 'london', 'paris', 'newyork', 'madrid', 'rome', 'seoul', 'tokyo', 'beijing', 'rio'];

export const LEVELS = {
  facile: {
    key: 'facile', label: 'Facile', rank: 1, lines: 3, maxTrains: 6, spawn: 1.8, crossSeconds: 30, accel: 0,
    aid: 'full', gameOver: false,
    facts: ['3 lignes', 'De 6 à 9 rames, de plus en plus fréquentes', 'Aide : halo rouge sur les dangers', 'Pas de game over']
  },
  moyen: {
    key: 'moyen', label: 'Moyen', rank: 2, lines: 5, maxTrains: 11, spawn: 1.2, crossSeconds: 20, accel: 0,
    aid: 'short', gameOver: true,
    facts: ['5 lignes', 'De 11 à 17 rames, de plus en plus fréquentes', 'Aide : halo 1 s avant', 'Game over à 5 collisions']
  },
  difficile: {
    key: 'difficile', label: 'Difficile', rank: 3, lines: 8, maxTrains: 26, spawn: 0.7, crossSeconds: 13, accel: 0.3,
    aid: 'none', gameOver: true,
    facts: ['Toutes les lignes', 'De 26 à 39 rames, de plus en plus rapides', 'Aucune aide', 'Game over à 5 collisions']
  }
};

export const LEVEL_ORDER = ['facile', 'moyen', 'difficile'];

// Niveau difficile : chaque ligne droite verticale devient une boucle en U. La rame suit le
// premier bras, longe le bas (ou le haut) du plan, puis repart en sens inverse sur un second bras.
// On cherche une largeur et une hauteur de U qui ne longent aucune autre ligne.
// Largeurs essayées : de 60 à 300 px de chaque côté, les plus proches de 120 px d'abord
const U_WIDTHS = Array.from({ length: 25 }, (_, k) => 60 + 10 * k)
  .sort((a, b) => Math.abs(a - 120) - Math.abs(b - 120))
  .flatMap((w) => [w, -w]);
const U_CLEAR = 24; // écart minimal avec une voie parallèle
const U_SPACING = 36; // écart minimal entre deux croisements (ou avec un virage d'une autre ligne)
function segCross(a, b, c, d) {
  const rx = b[0] - a[0], ry = b[1] - a[1], sx = d[0] - c[0], sy = d[1] - c[1];
  const den = rx * sy - ry * sx;
  if (Math.abs(den) < 1e-9) return null;
  const t = ((c[0] - a[0]) * sy - (c[1] - a[1]) * sx) / den;
  const u = ((c[0] - a[0]) * ry - (c[1] - a[1]) * rx) / den;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1 ? [a[0] + t * rx, a[1] + t * ry] : null;
}
const segsOf = (ln) => ln.p.slice(1).map((b, k) => [ln.p[k], b]);
const crossPoints = (segsA, segsB) => segsA.flatMap(([a, b]) => segsB.map(([c, d]) => segCross(a, b, c, d)).filter(Boolean));
const overlap = (a1, a2, b1, b2) => Math.min(Math.max(a1, a2), Math.max(b1, b2)) > Math.max(Math.min(a1, a2), Math.min(b1, b2));
const permutations = (a) => (a.length <= 1 ? [a] : a.flatMap((v, i) => permutations([...a.slice(0, i), ...a.slice(i + 1)]).map((r) => [v, ...r])));

// Un U posé peut prendre la place d'un autre : on essaie chaque ordre et on garde celui
// qui transforme le plus de lignes.
export function uTurnLines(lines) {
  const verticals = lines.map((ln, i) => i).filter((i) => lines[i].p.length === 2 && lines[i].p[0][0] === lines[i].p[1][0]);
  let best = null;
  permutations(verticals).forEach((order) => {
    const res = uTurnInOrder(lines, order);
    if (!best || res.count > best.count) best = res;
  });
  return best.out;
}

function uTurnInOrder(lines, order) {
  const out = lines.map((ln) => ({ ...ln }));
  let count = 0;
  order.forEach((idx) => {
    const ln = out[idx];
    const [[x, yA], [, yB]] = ln.p;
    const down = yB > yA;
    const otherLines = out.filter((_, k) => k !== idx);
    const others = otherLines.flatMap(segsOf);
    // Points à tenir à distance : croisements entre les autres lignes et virages des autres lignes
    const busy = otherLines.flatMap((A, i) => otherLines.slice(i + 1).flatMap((B) => crossPoints(segsOf(A), segsOf(B))))
      .concat(otherLines.flatMap((A) => A.p.slice(1, -1)));
    const original = crossPoints(segsOf(ln), others);
    const free = (x2, yT) => {
      if (x2 < 80 || x2 > 764) return false; // loin des terminus des lignes horizontales
      const parallelOk = others.every(([a, b]) => {
        if (a[0] === b[0]) return !(Math.abs(a[0] - x2) < U_CLEAR && overlap(a[1], b[1], yA, yT));
        if (a[1] === b[1]) return !(Math.abs(a[1] - yT) < U_CLEAR && overlap(a[0], b[0], x, x2));
        return true;
      });
      if (!parallelOk) return false;
      // Seuls les nouveaux croisements (hors ceux déjà présents sur la ligne droite) sont contrôlés
      const near = (p, q, dist) => Math.hypot(p[0] - q[0], p[1] - q[1]) < dist;
      const mine = crossPoints(segsOf({ p: [[x, yA], [x, yT], [x2, yT], [x2, yA]] }), others);
      const fresh = mine.filter((p) => !original.some((q) => near(p, q, 1)));
      return fresh.every((p) => busy.concat(mine).every((q) => q === p || !near(p, q, U_SPACING)));
    };
    const yEdge = down ? Math.min(yB, 295) : Math.max(yB, 35);
    for (let k = 0; k <= 12; k++) { // bas du U rapproché du centre si la place est prise
      const yT = yEdge + (down ? -10 : 10) * k;
      const w = U_WIDTHS.find((dx) => free(x + dx, yT));
      if (w != null) {
        ln.p = [[x, yA], [x, yT], [x + w, yT], [x + w, yA]];
        count += 1;
        return;
      }
    }
  });
  return { out, count };
}

export const GAME_SECONDS = 60;
// Au fil de la partie, les rames apparaissent de plus en plus souvent :
// l'intervalle d'apparition descend jusqu'à 40 % de sa valeur de départ,
// et le nombre maximum de rames en circulation augmente jusqu'à +50 %.
export const RAMP = { spawnEnd: 0.4, maxBoost: 0.5 };
// Heure de pointe : 15 s pendant lesquelles les rames roulent 2 fois plus vite.
// Elle démarre à un moment tiré au hasard entre 20 s et 35 s de partie (finie au plus tard à 50 s).
export const RUSH = { duration: 15, factor: 2, earliest: 20, latest: 35 };
export const MAP_W = 844;
export const MAP_H = 334;
