import React from 'react';
import { LEVELS } from '../data.js';
import { useT } from '../i18n.jsx';
import { ReplayIcon, StarIcon } from '../components/Icons.jsx';
import OnlineSubmit from '../components/OnlineSubmit.jsx';

function subtitle(r, t) {
  if (r.gameOver) return t('subGameOver');
  if (r.isRecord && r.prev != null) return t('subBetter');
  if (r.isRecord) return t('subFirst');
  if (r.collisions === 0) return t('subClean');
  return t('subAgain');
}

export default function Results({ result: r, onReplay, onChangeLevel, onHome, pseudo, onPseudo, onSeeBoard }) {
  const t = useT();
  const stats = [
    { label: t('score'), value: r.score },
    { label: t('arrived'), value: r.arrived },
    { label: t('crashes'), value: LEVELS[r.level].gameOver ? `${r.collisions} / 5` : r.collisions, bad: r.gameOver },
    { label: t('yourRecord'), value: r.best ?? '—' }
  ];
  const title = r.gameOver ? t('titleGameOver') : r.isRecord ? t('titleBravo') : t('titleDone');

  return (
    <div className={'screen padded results ' + (r.gameOver ? 'bg-gameover' : 'bg-sunset')}>
      <div className="results-top">
        <div className="results-head">
          <div className="results-ctx">{t.city(r.city)} · {t.level(r.level)}</div>
          <h1>{title}</h1>
          <p>{subtitle(r, t)}</p>
          {r.isRecord && (
            <div className="record-badge"><StarIcon />{t('newRecord')}</div>
          )}
          <OnlineSubmit result={r} pseudo={pseudo} onPseudo={onPseudo} onSeeBoard={onSeeBoard} />
        </div>
        <div className="stats">
          {stats.map((s) => (
            <div key={s.label} className="stat">
              <span>{s.label}</span>
              <b className={s.bad ? 'bad' : ''}>{s.value}</b>
            </div>
          ))}
          {r.bestCombo > 0 && (
            <div className="stat wide">
              <span>{t('bestStreak')}</span>
              <b>{t('streak', r.bestCombo)}</b>
            </div>
          )}
        </div>
      </div>
      <div className="results-actions">
        <button type="button" className="btn-primary btn-go" onClick={onReplay} autoFocus>
          <ReplayIcon size={22} w={2.8} />{t('replay')}
        </button>
        <button type="button" className="btn-outline" onClick={onChangeLevel}>{t('changeLevel')}</button>
        <button type="button" className="btn-outline" onClick={onHome}>{t('home')}</button>
      </div>
    </div>
  );
}
