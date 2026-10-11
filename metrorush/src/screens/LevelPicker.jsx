import React, { useState } from 'react';
import { LEVELS, LEVEL_ORDER } from '../data.js';
import { bestOf } from '../storage.js';
import { useT } from '../i18n.jsx';
import { BackIcon } from '../components/Icons.jsx';

export default function LevelPicker({ city, initial, scores, onBack, onStart }) {
  const t = useT();
  const [picked, setPicked] = useState(LEVELS[initial] ? initial : 'facile');

  const onKey = (e) => {
    const i = LEVEL_ORDER.indexOf(picked);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setPicked(LEVEL_ORDER[(i + 1) % 3]);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setPicked(LEVEL_ORDER[(i + 2) % 3]);
  };

  return (
    <div className="screen bg-sunset padded gap14">
      <header className="screen-head">
        <button type="button" className="back-btn" onClick={onBack} aria-label={t('backCity')}><BackIcon /></button>
        <h1>{t('pickLevel')}</h1>
        <div className="chip-city">{t.city(city)}</div>
      </header>

      <div className="grid3 gap20" role="radiogroup" aria-label={t('difficulty')} onKeyDown={onKey}>
        {LEVEL_ORDER.map((key) => {
          const lv = LEVELS[key];
          const sel = key === picked;
          const best = bestOf(scores, city, key);
          return (
            <button key={key} type="button" role="radio" aria-checked={sel} tabIndex={sel ? 0 : -1}
              className={'card level-card' + (sel ? ' selected' : '')} onClick={() => setPicked(key)}
              onDoubleClick={() => onStart(key)}>
              <div className="level-top">
                <span className="card-title">{t.level(key)}</span>
                <span className="level-dots" aria-hidden="true">
                  {[1, 2, 3].map((n) => <span key={n} className={n <= lv.rank ? 'on' : ''} />)}
                </span>
              </div>
              {t.facts(key).map((f) => (
                <span key={f} className="fact"><span className="bullet" aria-hidden="true" />{f}</span>
              ))}
              <span className="fact record">{best != null ? t('record', best) : t('notPlayed')}</span>
            </button>
          );
        })}
      </div>

      <div className="center">
        <button type="button" className="btn-primary btn-go" onClick={() => onStart(picked)}>{t('go')}</button>
      </div>
    </div>
  );
}
