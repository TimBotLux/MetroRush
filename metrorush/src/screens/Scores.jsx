import React from 'react';
import { CITY_ORDER, LEVEL_ORDER } from '../data.js';
import { bestOf } from '../storage.js';
import { leaderboardEnabled } from '../leaderboard.js';
import { useT } from '../i18n.jsx';
import { BackIcon, StarIcon } from '../components/Icons.jsx';
import OnlineBoard from '../components/OnlineBoard.jsx';

// Records : onglet « Cet appareil » (records locaux) et, si Supabase est configuré, onglet « En ligne ».
export default function Scores({ scores, onBack, view, onView, pseudo }) {
  const t = useT();
  const online = leaderboardEnabled && view.tab === 'online';
  let top = 0;
  CITY_ORDER.forEach((c) => LEVEL_ORDER.forEach((l) => { top = Math.max(top, bestOf(scores, c, l) ?? 0); }));

  return (
    <div className="screen bg-sunset padded gap14">
      <header className="screen-head">
        <button type="button" className="back-btn" onClick={onBack} aria-label={t('backHome')}><BackIcon /></button>
        <h1>{t('myScores')}</h1>
        {leaderboardEnabled && (
          <div className="lang-switch tabs" role="tablist">
            {['local', 'online'].map((tab) => (
              <button key={tab} type="button" role="tab" aria-selected={view.tab === tab}
                className={view.tab === tab ? 'on' : ''} onClick={() => onView({ ...view, tab })}>
                {tab === 'local' ? t('tabLocal') : t('tabOnline')}
              </button>
            ))}
          </div>
        )}
      </header>

      {online ? (
        <OnlineBoard city={view.city} level={view.level} pseudo={pseudo}
          onCity={(city) => onView({ ...view, city })} onLevel={(level) => onView({ ...view, level })} />
      ) : (
        <>
          <div role="table" aria-label={t('scoresTable')} className="score-table">
            <div role="row" className="score-row">
              <span role="columnheader" />
              {LEVEL_ORDER.map((l) => <span key={l} role="columnheader" className="score-colhead">{t.level(l)}</span>)}
            </div>
            <div className="score-body" role="rowgroup">
            {CITY_ORDER.map((c) => (
              <div key={c} role="row" className="score-row">
                <span role="rowheader" className="score-city">{t.city(c)}</span>
                {LEVEL_ORDER.map((l) => {
                  const v = bestOf(scores, c, l);
                  return (
                    <span key={l} role="cell" className={'score-cell' + (v != null ? ' filled' : '')}>
                      {v != null && v === top && top > 0 && <StarIcon size={20} fill="#FFC93C" strokeColor="#C98A00" />}
                      {v != null ? v : t('toPlay')}
                    </span>
                  );
                })}
              </div>
            ))}
            </div>
          </div>
          <p className="note">{t('scoresNote')}</p>
        </>
      )}
    </div>
  );
}
