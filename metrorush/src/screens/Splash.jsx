import React, { useEffect } from 'react';
import { useT } from '../i18n.jsx';

export default function Splash({ onDone }) {
  const t = useT();
  useEffect(() => {
    const t = setTimeout(onDone, 1400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="screen bg-sunset splash" onClick={onDone}>
      <div className="logo logo-xl">Metro<span>Rush</span></div>
      <div className="loader" role="progressbar" aria-label={t('loadingLabel')}><div /></div>
      <p className="splash-sub">{t('loading')}</p>
    </div>
  );
}
