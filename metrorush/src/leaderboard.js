// Classement en ligne (Supabase), par l'API REST : pas de bibliothèque à charger.
// Table et vue créées par supabase/leaderboard.sql. La clé « anon » est publique par conception :
// la sécurité repose sur les règles RLS (lecture et ajout seulement).
// Sans clé (VITE_SUPABASE_ANON_KEY), le classement est simplement masqué.

const URL_BASE = (import.meta.env.VITE_SUPABASE_URL || 'https://orxbxsvbdzeyyjhmeznn.supabase.co').replace(/\/$/, '');
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const leaderboardEnabled = Boolean(KEY);
export const PLAYER_MAX = 16;

const headers = (extra = {}) => ({ apikey: KEY, Authorization: `Bearer ${KEY}`, ...extra });

async function request(path, options = {}) {
  const res = await fetch(`${URL_BASE}/rest/v1/${path}`, { ...options, headers: headers(options.headers) });
  if (!res.ok) throw new Error(`Classement indisponible (${res.status})`);
  return res;
}

// Meilleurs joueurs d'une ville et d'un niveau (un seul score par joueur)
export async function fetchTop(city, level, limit = 10) {
  const q = `leaderboard_best?select=player,score&city=eq.${city}&level=eq.${level}`
    + `&order=score.desc,created_at.asc&limit=${limit}`;
  return (await request(q)).json();
}

// Enregistre un score et renvoie le rang du joueur (1 = premier)
export async function submitScore({ player, city, level, score }) {
  const name = player.trim().slice(0, PLAYER_MAX);
  await request('leaderboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ player: name, city, level, score })
  });
  // Rang = nombre de joueurs ayant un meilleur score strictement supérieur, plus un
  const res = await request(`leaderboard_best?select=player&city=eq.${city}&level=eq.${level}&score=gt.${score}`, {
    method: 'HEAD',
    headers: { Prefer: 'count=exact' }
  });
  const total = Number((res.headers.get('content-range') || '*/0').split('/')[1]) || 0;
  return total + 1;
}
