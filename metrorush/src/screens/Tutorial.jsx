import React, { useMemo, useRef, useState } from 'react';
import MapView from '../components/MapView.jsx';
import { buildNetwork, createGame, step, toggleLight, drainEvents, travelTime } from '../engine.js';
import { audio } from '../audio.js';
import { useLoop } from '../useLoop.js';
import { useT } from '../i18n.jsx';

const W = 378, H = 320;
const RED = 0, BLUE = 1;
const LINES = [
  { n: 'U2', c: '#DA421E', p: [[-20, 160], [W + 20, 160]] },
  { n: 'U8', c: '#224F86', p: [[189, -20], [189, H + 20]] }
];
const SPEED = 45;
const STEP_COUNT = 3; // textes des étapes : tutoSteps dans i18n.jsx

function newScene(stepIndex, net) {
  const cfg = {
    net, speed: SPEED, maxTrains: 3, spawnInterval: Infinity, aid: stepIndex === 2 ? 'full' : 'none',
    gameOver: false, duration: Infinity, opening: false,
    scheduled: stepIndex === 2
      ? (() => {
        const cr = net.crossings[0];
        const ti = travelTime(net, RED, cr.di, SPEED);
        const tj = travelTime(net, BLUE, cr.dj, SPEED);
        const T = Math.max(ti, tj) + 1;
        return [{ line: RED, at: T - ti }, { line: BLUE, at: T - tj }];
      })()
      : [{ line: BLUE, at: 0.3 }]
  };
  return createGame(cfg);
}

export default function Tutorial({ onDone }) {
  const t = useT();
  const net = useMemo(() => buildNetwork(LINES), []);
  const blueLight = net.lights.find((l) => l.line === BLUE).id;
  const [stepIndex, setStepIndex] = useState(0);
  const [status, setStatus] = useState(null); // null | 'ok' | 'fail'
  const game = useRef(null);
  if (!game.current) game.current = newScene(0, net);
  const failTimer = useRef(null);

  const goTo = (i) => {
    clearTimeout(failTimer.current);
    game.current = newScene(i, net);
    setStatus(null);
    setStepIndex(i);
  };

  useLoop((dt) => {
    const g = game.current;
    step(g, dt);
    drainEvents(g).forEach((e) => {
      if (e.type === 'crash') {
        audio.sfx('crash');
        if (stepIndex === 2 && status !== 'ok') {
          setStatus('fail');
          failTimer.current = setTimeout(() => goTo(2), 1600);
        }
      }
      if (e.type === 'arrive') audio.sfx('arrive');
    });
    if (stepIndex < 2 && g.trains.length === 0 && g.scheduled.length === 0) {
      g.scheduled.push({ line: BLUE, at: g.elapsed + 0.6 });
    }
    if (stepIndex === 1 && status !== 'ok' && g.trains.some((t) => t.line === BLUE && t.wait > 1)) setStatus('ok');
    if (stepIndex === 2 && status === null && g.arrived >= 2 && g.collisions === 0) setStatus('ok');
  }, true);

  const onToggle = (id) => {
    const green = toggleLight(game.current, id);
    audio.sfx(green ? 'green' : 'red');
    if (stepIndex === 0 && !green) setStatus('ok');
  };

  const s = t('tutoSteps')[stepIndex];
  const last = stepIndex === STEP_COUNT - 1;

  return (
    <div className="screen bg-sunset">
      <div className="tuto-left">
        <div className="tuto-progress">
          <span>{t('tutoStep', stepIndex + 1, STEP_COUNT)}</span>
          <div className="dots">
            {Array.from({ length: STEP_COUNT }, (_, i) => <div key={i} className={i === stepIndex ? 'dot on' : 'dot'} />)}
          </div>
        </div>
        <h1 className="tuto-title">{s.title}</h1>
        <p className="tuto-text">{s.text}</p>
        <div className={'tuto-status ' + (status || '')} role="status">
          {status === 'ok' && s.done}
          {status === 'fail' && t('tutoFail')}
        </div>
        <div className="tuto-actions">
          <button type="button" className={'btn-primary btn-md' + (status === 'ok' ? ' pulse' : '')}
            onClick={() => (last ? onDone() : goTo(stepIndex + 1))}>
            {last ? t('tutoPlay') : t('next')}
          </button>
          {!last && <button type="button" className="link-btn" onClick={onDone}>{t('skipTuto')}</button>}
        </div>
      </div>

      <div className="tuto-board">
        <MapView net={net} game={game.current} onToggle={onToggle} width={W} height={H} light showNames={false}
          terminiBadges={false} highlight={stepIndex < 2 && status !== 'ok' ? blueLight : null} />
        <div className="tuto-legend">{t('legend')}</div>
      </div>
    </div>
  );
}
