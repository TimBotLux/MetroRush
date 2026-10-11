import React, { useEffect, useState } from 'react';
import { RotateIcon } from './Icons.jsx';
import { useT } from '../i18n.jsx';

export const STAGE_W = 844;
export const STAGE_H = 390;

// Marges des zones sûres (encoche, coins arrondis, barre d'accueil) : un élément invisible
// reçoit ces marges en padding, et le navigateur nous les donne en pixels.
let probe = null;
function safeArea() {
  if (!probe) {
    probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;'
      + 'padding:var(--safe-top) var(--safe-right) var(--safe-bottom) var(--safe-left)';
    document.body.appendChild(probe);
  }
  const css = getComputedStyle(probe);
  const px = (v) => parseFloat(v) || 0;
  return {
    x: px(css.paddingLeft) + px(css.paddingRight),
    y: px(css.paddingTop) + px(css.paddingBottom)
  };
}

function measure() {
  const w = window.innerWidth, h = window.innerHeight;
  const safe = safeArea();
  return {
    scale: Math.min((w - safe.x) / STAGE_W, (h - safe.y) / STAGE_H),
    portrait: h > w && window.matchMedia('(pointer: coarse)').matches
  };
}

// Toutes les maquettes sont dessinées en 844 x 390 (paysage mobile) :
// on garde ce cadre et on le met à l'échelle de la fenêtre.
export default function Stage({ children }) {
  const [m, setM] = useState(measure);
  const t = useT();

  useEffect(() => {
    let timer;
    const onResize = () => {
      setM(measure());
      // Sur mobile, la taille finale n'est connue qu'un instant après la rotation
      clearTimeout(timer);
      timer = setTimeout(() => setM(measure()), 350);
    };
    onResize();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  return (
    <div className="viewport">
      <div className="stage-box" style={{ width: STAGE_W * m.scale, height: STAGE_H * m.scale }}>
        <div className="stage" style={{ transform: `scale(${m.scale})` }}>{children}</div>
      </div>
      {m.portrait && (
        <div className="rotate-hint" role="alert">
          <RotateIcon />
          <p>{t('rotate')}</p>
        </div>
      )}
    </div>
  );
}
