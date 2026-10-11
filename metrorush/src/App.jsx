import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { loadAll, saveAll, bestOf } from './storage.js';
import { audio } from './audio.js';
import { LangProvider, translator } from './i18n.jsx';
import Stage from './components/Stage.jsx';
import Splash from './screens/Splash.jsx';
import Home from './screens/Home.jsx';
import Tutorial from './screens/Tutorial.jsx';
import CityPicker from './screens/CityPicker.jsx';
import LevelPicker from './screens/LevelPicker.jsx';
import Game from './screens/Game.jsx';
import Results from './screens/Results.jsx';
import Scores from './screens/Scores.jsx';
import Settings from './screens/Settings.jsx';

export default function App() {
  const [data, setData] = useState(loadAll);
  const [screen, setScreen] = useState('splash');
  const [city, setCity] = useState(data.last?.city || 'berlin');
  const [level, setLevel] = useState(data.last?.level || 'facile');
  const [afterTutorial, setAfterTutorial] = useState('city');
  const [gameId, setGameId] = useState(0);
  const [result, setResult] = useState(null);
  // Écran des records : onglet affiché, et ville / niveau du classement en ligne
  const [scoresView, setScoresView] = useState({ tab: 'local', city, level });

  const update = useCallback((fn) => {
    setData((d) => {
      const next = fn(d);
      saveAll(next);
      return next;
    });
  }, []);

  useEffect(() => { audio.sfxOn = data.settings.son; }, [data.settings.son]);

  const lang = data.settings.langue;
  const t = useMemo(() => translator(lang), [lang]);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const setLang = (l) => update((d) => ({ ...d, settings: { ...d.settings, langue: l } }));
  const setPseudo = (p) => update((d) => ({ ...d, settings: { ...d.settings, pseudo: p } }));

  const startGame = (c, l) => {
    setCity(c);
    setLevel(l);
    update((d) => ({ ...d, last: { city: c, level: l } }));
    setGameId((n) => n + 1);
    setScreen('game');
  };

  const onPlay = () => {
    if (!data.tutorialSeen) {
      setAfterTutorial('city');
      setScreen('tutorial');
    } else {
      setScreen('city');
    }
  };

  const onTutorialDone = () => {
    update((d) => ({ ...d, tutorialSeen: true }));
    setScreen(afterTutorial);
  };

  const onGameEnd = (r) => {
    const prev = bestOf(data.scores, city, level);
    const isRecord = r.score > 0 && (prev == null || r.score > prev);
    const best = isRecord ? r.score : prev ?? r.score;
    update((d) => {
      const scores = { ...d.scores, [city]: { ...(d.scores[city] || {}) } };
      const old = scores[city][level];
      if (typeof old !== 'number' || r.score > old) scores[city][level] = r.score;
      return { ...d, scores };
    });
    setResult({ ...r, city, level, best, isRecord, prev });
    setScreen('results');
  };

  let content;
  switch (screen) {
    case 'splash':
      content = <Splash onDone={() => setScreen('home')} />;
      break;
    case 'home':
      content = (
        <Home last={data.last} onPlay={onPlay} onReplay={() => startGame(data.last.city, data.last.level)}
          onScores={() => setScreen('scores')} onSettings={() => setScreen('settings')}
          lang={lang} onLang={setLang} />
      );
      break;
    case 'tutorial':
      content = <Tutorial onDone={onTutorialDone} />;
      break;
    case 'city':
      content = (
        <CityPicker scores={data.scores} onBack={() => setScreen('home')}
          onPick={(c) => { setCity(c); setScreen('level'); }} />
      );
      break;
    case 'level':
      content = (
        <LevelPicker city={city} initial={data.last?.city === city ? data.last.level : level} scores={data.scores}
          onBack={() => setScreen('city')} onStart={(l) => startGame(city, l)} />
      );
      break;
    case 'game':
      content = (
        <Game key={gameId} city={city} level={level} settings={data.settings}
          onEnd={onGameEnd} onRestart={() => setGameId((n) => n + 1)} onQuit={() => setScreen('home')} />
      );
      break;
    case 'results':
      content = (
        <Results result={result} onReplay={() => startGame(city, level)}
          onChangeLevel={() => setScreen('level')} onHome={() => setScreen('home')}
          pseudo={data.settings.pseudo} onPseudo={setPseudo}
          onSeeBoard={() => { setScoresView({ tab: 'online', city, level }); setScreen('scores'); }} />
      );
      break;
    case 'scores':
      content = (
        <Scores scores={data.scores} onBack={() => setScreen('home')}
          view={scoresView} onView={setScoresView} pseudo={data.settings.pseudo} />
      );
      break;
    case 'settings':
      content = (
        <Settings settings={data.settings}
          onChange={(s) => update((d) => ({ ...d, settings: s }))}
          onTutorial={() => { setAfterTutorial('settings'); setScreen('tutorial'); }}
          onReset={() => update((d) => ({ ...d, scores: {}, last: null }))}
          onBack={() => setScreen('home')} />
      );
      break;
    default:
      content = null;
  }

  return <LangProvider value={t}><Stage>{content}</Stage></LangProvider>;
}
