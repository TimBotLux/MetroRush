import React, { useEffect, useState } from 'react';
import { CITY_ORDER, LEVEL_ORDER } from '../data.js';
import { fetchTop } from '../leaderboard.js';
import { useT } from '../i18n.jsx';

// Écran des records, onglet « En ligne » : 10 meilleurs joueurs d'une ville et d'un niveau.
export default function OnlineBoard({ city, level, onCity, onLevel, pseudo }) {
  const t = useT();
  const [rows, setRows] = useState(null); // null = chargement
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    setRows(null);
    setError(false);
    fetchTop(city, level, 10)
      .then((r) => { if (alive) setRows(r); })
      .catch(() => { if (alive) setError(true); });
    return () => { alive = false; };
  }, [city, level]);

  const me = pseudo.trim().toLowerCase();

  return (
    <div className="online-board">
      <div className="online-filters">
        <select value={city} onChange={(e) => onCity(e.target.value)} aria-label={t('cityLabel')}>
          {CITY_ORDER.map((c) => <option key={c} value={c}>{t.city(c)}</option>)}
        </select>
        <div className="online-levels" role="radiogroup" aria-label={t('levelLabel')}>
          {LEVEL_ORDER.map((l) => (
            <button key={l} type="button" role="radio" aria-checked={l === level}
              className={l === level ? 'on' : ''} onClick={() => onLevel(l)}>{t.level(l)}</button>
          ))}
        </div>
      </div>
      <ol className="online-list">
        {error && <li className="online-msg">{t('boardError')}</li>}
        {!error && rows === null && <li className="online-msg">{t('boardLoading')}</li>}
        {!error && rows && rows.length === 0 && <li className="online-msg">{t('boardEmpty')}</li>}
        {!error && rows && rows.map((r, i) => (
          <li key={r.player + i} className={'online-entry' + (r.player.toLowerCase() === me ? ' me' : '')}>
            <span className="online-rank">{i + 1}</span>
            <span className="online-player">{r.player}</span>
            <b>{r.score}</b>
          </li>
        ))}
      </ol>
    </div>
  );
}
