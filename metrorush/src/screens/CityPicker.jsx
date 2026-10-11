import React from 'react';
import { CITIES, CITY_ORDER, MAP_W, MAP_H } from '../data.js';
import { bestOfCity } from '../storage.js';
import { useT } from '../i18n.jsx';
import { BackIcon, TrophyIcon } from '../components/Icons.jsx';

function Preview({ city }) {
  return (
    <svg className="city-preview" viewBox={`20 10 ${MAP_W - 40} ${MAP_H - 10}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {city.lines.map((ln, i) => (
        <polyline key={i} points={ln.p.map((q) => q.join(',')).join(' ')} fill="none" stroke={ln.c}
          strokeWidth={ln.shared ? 22 : 18} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  );
}

export default function CityPicker({ scores, onBack, onPick }) {
  const t = useT();

  return (
    <div className="screen bg-sunset padded">
      <header className="screen-head">
        <button type="button" className="back-btn" onClick={onBack} aria-label={t('backHome')}><BackIcon /></button>
        <h1>{t('pickCity')}</h1>
      </header>
      <div className="city-grid">
        {CITY_ORDER.map((key) => {
          const city = CITIES[key];
          const best = bestOfCity(scores, key);
          return (
            <button key={key} type="button" className="card city-card" onClick={() => onPick(key)} title={t.tagline(key)}>
              {city.recommended && <div className="tag-green">{t('recommended')}</div>}
              <Preview city={city} />
              <div className="card-title">{t.city(key)}</div>
              <div className="card-sub">{t.tagline(key)}</div>
              {best != null ? (
                <div className="card-record"><TrophyIcon size={13} color="#C98A00" />{t('record', best)}</div>
              ) : (
                <div className="card-record none"><TrophyIcon size={13} color="#5A6380" />{t('notPlayed')}</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
