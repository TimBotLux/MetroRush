import React from 'react';
import { CITIES, LEVELS } from '../data.js';
import { LANGS, useT } from '../i18n.jsx';
import { PlayIcon, ReplayIcon, TrophyIcon, GearIcon } from '../components/Icons.jsx';

export default function Home({ last, onPlay, onReplay, onScores, onSettings, lang, onLang }) {
  const t = useT();
  return (
    <div className="screen bg-home">
      <div className="home-left">
        <div className="logo">Metro<span>Rush</span></div>
        <p className="home-pitch">{t('pitch')}</p>
        <button type="button" className="btn-primary btn-play" onClick={onPlay}>
          <PlayIcon size={26} />
          {t('play')}
        </button>
        {last && CITIES[last.city] && LEVELS[last.level] && (
          <button type="button" className="btn-outline btn-replay" onClick={onReplay}>
            <ReplayIcon />
            {t('replay')} <span className="muted">· {t.city(last.city)}, {t.level(last.level)}</span>
          </button>
        )}
        <div className="home-row">
          <button type="button" className="btn-navy" onClick={onScores}>
            <TrophyIcon />
            {t('myScores')}
          </button>
          <button type="button" className="btn-navy btn-square" onClick={onSettings} aria-label={t('settings')}>
            <GearIcon />
          </button>
          <div className="lang-switch" role="radiogroup" aria-label={t('language')}>
            {LANGS.map((l) => (
              <button key={l} type="button" role="radio" aria-checked={l === lang}
                className={l === lang ? 'on' : ''} lang={l}
                aria-label={l === 'fr' ? 'Français' : 'English'} onClick={() => onLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="home-art" aria-hidden="true">
        <div style={{ left: 0, top: 146, width: 344, height: 12, background: '#DA421E' }} className="art-track" />
        <div style={{ left: 164, top: 0, width: 12, height: 318, background: '#224F86' }} className="art-track" />
        {/* Lignes perpendiculaires : une horizontale (verte) et une verticale (violette) */}
        <div style={{ left: 0, top: 230, width: 344, height: 12, background: '#00843D' }} className="art-track" />
        <div style={{ left: 294, top: 0, width: 12, height: 318, background: '#8C6DAB' }} className="art-track" />
        <div className="art-station" style={{ left: 160, top: 142 }} />
        <div className="art-station" style={{ left: 160, top: 226 }} />
        <div className="art-station" style={{ left: 290, top: 142 }} />
        <div className="art-station" style={{ left: 290, top: 226 }} />
        <div className="art-train art-train-g" style={{ background: '#00843D' }} />
        <div className="art-train art-train-p" style={{ background: '#8C6DAB' }} />
        <div className="art-train art-train-h" style={{ background: '#DA421E' }} />
        <div className="art-train art-train-v" style={{ background: '#224F86' }} />
        <div className="art-light red" style={{ left: 158, top: 104 }} />
        <div className="art-light green" style={{ left: 116, top: 140 }} />      </div>

      <p className="credits">{t('credits')}</p>
    </div>
  );
}
