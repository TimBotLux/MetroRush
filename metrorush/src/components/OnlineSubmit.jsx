import React, { useState } from 'react';
import { leaderboardEnabled, submitScore, PLAYER_MAX } from '../leaderboard.js';
import { useT } from '../i18n.jsx';

// Écran de résultats : envoi du score au classement en ligne, avec le pseudo du joueur (mémorisé).
export default function OnlineSubmit({ result, pseudo, onPseudo, onSeeBoard }) {
  const t = useT();
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [rank, setRank] = useState(null);
  if (!leaderboardEnabled || result.score <= 0) return null;

  const send = async () => {
    if (!pseudo.trim() || status === 'sending' || status === 'done') return;
    setStatus('sending');
    try {
      setRank(await submitScore({ player: pseudo, city: result.city, level: result.level, score: result.score }));
      setStatus('done');
    } catch (e) {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div className="online-submit done">
        <span>{t('rank', rank)}</span>
        <button type="button" className="link-btn" onClick={onSeeBoard}>{t('seeBoard')}</button>
      </div>
    );
  }

  return (
    <div className="online-submit">
      <span className="online-title">{t('online')}</span>
      <div className="online-row">
        <input type="text" value={pseudo} maxLength={PLAYER_MAX} placeholder={t('pseudoPh')} aria-label={t('pseudoPh')}
          onChange={(e) => onPseudo(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} />
        <button type="button" className="btn-navy" onClick={send} disabled={!pseudo.trim() || status === 'sending'}>
          {status === 'sending' ? t('sending') : t('send')}
        </button>
      </div>
      {status === 'error' && <span className="online-error">{t('sendError')}</span>}
    </div>
  );
}
