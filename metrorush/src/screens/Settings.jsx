import React, { useState } from 'react';
import { useT } from '../i18n.jsx';
import { BackIcon, HelpIcon, TrashIcon } from '../components/Icons.jsx';

const ITEMS = [
  { key: 'son', label: 'sounds', hint: 'soundsHint' },
  { key: 'musique', label: 'music', hint: 'musicHint' },
  { key: 'vibrations', label: 'vibrations', hint: 'vibrationsHint', needs: () => typeof navigator !== 'undefined' && 'vibrate' in navigator },
  { key: 'mouvement', label: 'shake', hint: 'shakeHint' }
];

export default function Settings({ settings, onChange, onTutorial, onReset, onBack }) {
  const t = useT();
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const items = ITEMS.filter((it) => !it.needs || it.needs());

  return (
    <div className="screen bg-sunset padded">
      <header className="screen-head">
        <button type="button" className="back-btn" onClick={onBack} aria-label={t('backHome')}><BackIcon /></button>
        <h1>{t('settings')}</h1>
      </header>

      <div className="settings-body">
        <div className="toggles">
          {items.map((it) => {
            const on = !!settings[it.key];
            return (
              <div key={it.key} className="toggle-row">
                <span className="toggle-text">
                  <b>{t(it.label)}</b>
                  <small>{t(it.hint)}</small>
                </span>
                <button type="button" role="switch" aria-checked={on} aria-label={t(it.label)}
                  className={'switch' + (on ? ' on' : '')}
                  onClick={() => onChange({ ...settings, [it.key]: !on })}>
                  <span />
                </button>
              </div>
            );
          })}
        </div>
        <div className="settings-side">
          <button type="button" className="btn-primary btn-side" onClick={onTutorial}>
            <HelpIcon />{t('tutorialAgain')}
          </button>
          <button type="button" className="btn-danger" onClick={() => setConfirm(true)}>
            <TrashIcon />{t('resetScores')}
          </button>
          <p className="note sm">{done ? t('resetDone') : t('resetNote')}</p>
          <p className="credits static">{t('creditsFull')}</p>
        </div>
      </div>

      {confirm && (
        <div className="overlay">
          <div className="dialog" role="alertdialog" aria-label={t('resetScores')}>
            <h1 className="sm">{t('resetTitle')}</h1>
            <p className="dialog-text">{t('resetText')}</p>
            <button type="button" className="btn-danger full" onClick={() => { onReset(); setConfirm(false); setDone(true); }}>
              <TrashIcon />{t('resetYes')}
            </button>
            <button type="button" className="btn-outline full center-text" onClick={() => setConfirm(false)} autoFocus>{t('cancel')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
