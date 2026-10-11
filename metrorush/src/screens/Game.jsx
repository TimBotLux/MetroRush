import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CITIES, LEVELS, GAME_SECONDS, RAMP, RUSH, MAP_W, MAP_H, uTurnLines } from '../data.js';
import {
  buildNetwork, createGame, step, toggleLight, drainEvents, rushProgress, rushRemaining, comboMultiplier, COMBO_STEP, COMBO_MAX
} from '../engine.js';
import { audio, vibrate } from '../audio.js';
import { useLoop } from '../useLoop.js';
import { useT } from '../i18n.jsx';
import MapView from '../components/MapView.jsx';
import { PauseIcon, TrainIcon, MusicIcon, ClockIcon, BurstIcon, PlayIcon, ReplayIcon } from '../components/Icons.jsx';

const fmt = (sec) => {
  const s = Math.ceil(sec);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export default function Game({ city, level, settings, onEnd, onRestart, onQuit }) {
  const t = useT();
  const cityData = CITIES[city];
  const lv = LEVELS[level];
  const net = useMemo(() => {
    const lines = cityData.lines.slice(0, Math.min(lv.lines, cityData.lines.length));
    return buildNetwork(level === 'difficile' ? uTurnLines(lines) : lines, cityData.names);
  }, [cityData, lv, level]);
  const game = useRef(null);
  if (!game.current) {
    game.current = createGame({
      net,
      speed: 780 / lv.crossSeconds,
      accel: lv.accel,
      maxTrains: lv.maxTrains,
      spawnInterval: lv.spawn,
      aid: lv.aid,
      gameOver: lv.gameOver,
      startRed: true,
      duration: GAME_SECONDS,
      ramp: RAMP,
      rush: {
        start: RUSH.earliest + Math.random() * (RUSH.latest - RUSH.earliest),
        duration: RUSH.duration,
        factor: RUSH.factor
      }
    });
  }

  const [paused, setPaused] = useState(false);
  const [ending, setEnding] = useState(null);
  const shakeRef = useRef(null);
  const [flash, setFlash] = useState(0);
  const [musicOn, setMusicOn] = useState(settings.musique);
  const ended = useRef(false);

  // Musique
  useEffect(() => {
    audio.setTheme(city, level);
    if (musicOn) audio.startMusic();
    else audio.stopMusic();
    return undefined;
  }, [musicOn]);
  useEffect(() => () => audio.stopMusic(), []);
  useEffect(() => { audio.pauseMusic(paused); }, [paused]);

  // Pause automatique si l'onglet passe en arrière-plan
  useEffect(() => {
    const onVis = () => { if (document.hidden) setPaused(true); };
    const onKey = (e) => { if (e.key === 'Escape' || e.key === 'p') setPaused((p) => !p); };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const finish = (g) => {
    if (ended.current) return;
    ended.current = true;
    audio.stopMusic();
    audio.sfx('end');
    setEnding(g.over);
    setTimeout(() => onEnd({
      score: g.score, arrived: g.arrived, collisions: g.collisions, bestCombo: g.bestCombo, gameOver: g.over === 'gameover'
    }), 1500);
  };

  useLoop((dt) => {
    const g = game.current;
    step(g, dt);
    audio.setIntensity(g.trains.length);
    audio.setRush(rushProgress(g));
    drainEvents(g).forEach((e) => {
      if (e.type === 'rushStart') {
        audio.sfx('rush');
        vibrate(settings, [100, 60, 100]);
      } else if (e.type === 'rushEnd') audio.sfx('rushEnd');
      else if (e.type === 'rushCount') audio.sfx('rushCount');
      else if (e.type === 'comboUp') {
        audio.sfx('comboUp');
        vibrate(settings, 30);
      } else if (e.type === 'comboLost') audio.sfx('comboLost');
      if (e.type === 'crash') {
        audio.sfx('crash');
        vibrate(settings, [60, 40, 120]);
        setFlash((n) => n + 1);
        if (settings.mouvement && shakeRef.current && shakeRef.current.animate) {
          shakeRef.current.animate([
            { transform: 'translate(0, 0)' }, { transform: 'translate(-8px, 4px)' }, { transform: 'translate(7px, -5px)' },
            { transform: 'translate(-5px, -3px)' }, { transform: 'translate(4px, 3px)' }, { transform: 'translate(0, 0)' }
          ], { duration: 420, easing: 'ease-out' });
        }
      } else if (e.type === 'arrive') audio.sfx('arrive');
      else if (e.type === 'late') audio.sfx('late');
      else if (e.type === 'spawn' && g.elapsed > 0.5) audio.sfx('spawn');
      else if (e.type === 'end') finish(g);
    });
  }, !paused && !ending);

  const onToggle = (id) => {
    if (paused || ending) return;
    const green = toggleLight(game.current, id);
    audio.sfx(green ? 'green' : 'red');
    vibrate(settings, 15);
  };

  const toggleSound = () => setMusicOn((on) => !on);
  const soundOn = musicOn;

  const g = game.current;
  const lastSeconds = g.remaining <= 10;
  const firstMinute = g.elapsed < 40;
  const rush = g.rushActive;
  const mult = comboMultiplier(g);
  const comboFill = mult >= COMBO_MAX ? 1 : (g.combo % COMBO_STEP) / COMBO_STEP;

  return (
    <div className={'screen' + (rush ? '' : ' pastel')} style={{ background: cityData.bg }}>
      {rush && <div className={'rush-bg' + (settings.mouvement ? ' blink' : '')} aria-hidden="true" />}
      <div ref={shakeRef} className="game-layer">
        <div className={'game-wrap' + (paused ? ' blurred' : '')}>
          <div className="hud">
            <button type="button" className="hud-btn" aria-label={t('pause')} onClick={() => setPaused(true)}><PauseIcon /></button>
            <div className="hud-pill">
              {t.city(city)}
              <span className="hud-dots" aria-hidden="true">
                {[1, 2, 3].map((n) => <span key={n} className={n <= lv.rank ? 'on' : ''} />)}
              </span>
              <span className="hud-level">{t.level(level)}</span>
            </div>
            <div className="hud-spacer" />
            <div className="hud-pill h40"><TrainIcon />{t('trains', g.trains.length)}</div>
            <button type="button" className={'hud-btn hud-sound' + (soundOn ? ' on' : '')} aria-label={t('music')}
              aria-pressed={soundOn} onClick={toggleSound}>
              <MusicIcon color={soundOn ? '#1D2B53' : '#FFFFFF'} />
              {soundOn ? t('soundOn') : t('soundOff')}
            </button>
            <div className="hud-score" aria-label={t('scoreLabel', g.score, mult)}>
              <span>SCORE</span><b>{g.score}</b>
              {mult > 1
                ? <span key={mult} className="hud-combo">×{mult}</span>
                : <span className="hud-combo-bar" aria-hidden="true"><i style={{ width: `${comboFill * 100}%` }} /></span>}
            </div>
            <div className={'hud-pill h40' + (lastSeconds ? ' danger' : '')} aria-label={t('timeLeft')}>
              <ClockIcon /><b className="hud-num">{fmt(g.remaining)}</b>
            </div>
            <div className="hud-pill h40" aria-label={t('collisions')}>
              <BurstIcon /><span>{t('crashes')}</span><b className="hud-num sm">{lv.gameOver ? `${g.collisions} / 5` : g.collisions}</b>
            </div>
          </div>

          <div className="game-map">
            <MapView net={net} game={g} onToggle={onToggle} width={MAP_W} height={MAP_H} light={!rush}
              bubble={lv.aid === 'full' && firstMinute && !rush} />
            {rush && (
              <div className="rush-banner" role="status" aria-label={t('rushLabel', Math.ceil(rushRemaining(g)))}>
                RUSH <small>{Math.ceil(rushRemaining(g))} s</small>
              </div>
            )}
            {!rush && g.rushCount && (
              <div key={g.rushCount} className="rush-banner countdown" role="status">
                RUSH <small>{t('rushIn')}</small> {g.rushCount}
              </div>
            )}
          </div>
          {flash > 0 && <div className="crash-flash" key={`f${flash}`} />}
        </div>
      </div>

      {ending && (
        <div className="end-banner" role="alert">{ending === 'gameover' ? t('gameOverBang') : t('timeUp')}</div>
      )}

      {paused && !ending && (
        <div className="overlay">
          <div className="dialog" role="dialog" aria-label={t('pause')}>
            <h1>{t('pause')}</h1>
            <button type="button" className="btn-primary btn-md full" onClick={() => setPaused(false)} autoFocus>
              <PlayIcon />{t('resume')}
            </button>
            <button type="button" className="btn-outline full center-text" onClick={onRestart}>
              <ReplayIcon size={18} />{t('restart')}
            </button>
            <button type="button" className="link-btn dark" onClick={onQuit}>{t('quit')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
