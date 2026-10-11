import React, { memo } from 'react';
import { pointAt, isBlocked, incomingLines, WARN_WAIT, PLATFORM_LEN, TRAIN_LEN } from '../engine.js';
import { useT } from '../i18n.jsx';

const pts = (p) => p.map((q) => q.join(',')).join(' ');

// Couche fixe : voies, liaisons feu → voie, stations de correspondance.
const StaticLayer = memo(function StaticLayer({ net, width, height, light }) {
  return (
    <svg className="map-svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <defs>
        <filter id="mr-glow" filterUnits="userSpaceOnUse" x="-20" y="-20" width={width + 40} height={height + 40}>
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {net.lines.map((ln) => (ln.shared || []).map((si) => (
        <line key={`w${ln.index}-${si}`} x1={ln.p[si][0]} y1={ln.p[si][1]} x2={ln.p[si + 1][0]} y2={ln.p[si + 1][1]}
          stroke={ln.c} strokeWidth="18" strokeLinecap="round" />
      )))}
      {net.lines.map((ln) => (
        <g key={ln.index}>
          <polyline points={pts(ln.p)} fill="none" stroke={light ? '#1D2B53' : 'rgba(255,255,255,0.85)'} strokeWidth={light ? 14 : 12}
            strokeLinecap="round" strokeLinejoin="round" opacity={light ? 0.15 : 1} />
          <polyline points={pts(ln.p)} fill="none" stroke={ln.c} strokeWidth={light ? 10 : 8}
            strokeLinecap="round" strokeLinejoin="round" filter={light ? undefined : 'url(#mr-glow)'} />
        </g>
      ))}
      {net.platforms.map((p) => (
        <rect key={`q${p.id}`} x={-PLATFORM_LEN / 2} y={-4} width={PLATFORM_LEN} height={8} rx="2"
          fill={light ? '#E4E1EE' : '#D9D4EA'} stroke="#1D2B53" strokeWidth="1.5"
          transform={`translate(${p.x + p.nx * 13} ${p.y + p.ny * 13}) rotate(${p.a})`} />
      ))}
      {net.lights.map((l) => (
        <line key={l.id} x1={l.x} y1={l.y} x2={l.stopX} y2={l.stopY}
          stroke={light ? '#1D2B53' : '#FFFFFF'} strokeOpacity="0.55" strokeWidth="2" strokeDasharray="3 3" />
      ))}
      {net.crossings.map((c) => (
        <circle key={c.id} cx={c.x} cy={c.y} r="7" fill="#FFFFFF" stroke="#1D2B53" strokeWidth="3" />
      ))}
    </svg>
  );
});

export default function MapView({
  net, game, onToggle, width, height, showNames = true, light = false, bubble = false, highlight = null, terminiBadges = true
}) {
  const t = useT();
  const risk = new Set(game.risk);
  const firstRisk = game.risk.length ? net.crossings[game.risk[0]] : null;
  const incoming = incomingLines(game);

  return (
    <div className="map" style={{ width, height }}>
      <StaticLayer net={net} width={width} height={height} light={light} />

      {terminiBadges && net.lines.map((ln) => (
        <div key={ln.index} className={'terminus' + (incoming.has(ln.index) ? ' incoming' : '')}
          aria-label={incoming.has(ln.index) ? t('incoming', ln.n) : undefined} style={{ left: ln.p[0][0] - 11, top: ln.p[0][1] - 10, background: ln.c, color: ln.tc || '#FFFFFF' }}>{ln.n}</div>
      ))}

      {showNames && net.crossings.filter((c) => c.name).map((c) => (
        <div key={c.id} className="station-label" style={{ left: c.x + 10, top: c.y + 9 }}>{c.name}</div>
      ))}

      {net.crossings.map((c) => (risk.has(c.id) ? (
        <div key={c.id} className="halo" style={{ left: c.x - 35, top: c.y - 35 }} />
      ) : null))}

      {net.crossings.map((c) => (isBlocked(game, c.id) ? (
        <div key={c.id} className="blocked" style={{ left: c.x - 26, top: c.y - 26 }}>
          {Math.ceil(game.blocked[c.id] - game.elapsed)}
        </div>
      ) : null))}

      {game.trains.map((t) => {
        const ln = net.lines[t.line];
        const p = pointAt(ln, t.s);
        // Rame bloquée trop longtemps : surbrillance avant le retrait d'1 point
        const warn = t.wait >= WARN_WAIT && !t.penalized;
        return (
          <div key={t.id} className={'train' + (warn ? ' warn' : '') + (t.dwell > 0 ? ' dwell' : '')}
            style={{ background: ln.c, transform: `translate(${p.x - TRAIN_LEN / 2}px, ${p.y - 8}px) rotate(${p.a}deg)` }} />
        );
      })}

      {net.lights.map((l) => (game.green[l.id] ? null : (
        <div key={l.id} className="stop-bar" style={{ transform: `translate(${l.stopX - 9}px, ${l.stopY - 2}px) rotate(${l.stopA + 90}deg)` }} />
      )))}

      {net.lights.map((l) => {
        const green = game.green[l.id];
        const ln = net.lines[l.line];
        return (
          <button key={l.id} type="button" className="light-btn" style={{ left: l.x - 22, top: l.y - 22 }}
            aria-label={t('lightLabel', ln.n, green)}
            onPointerDown={(e) => { e.preventDefault(); onToggle && onToggle(l.id); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle && onToggle(l.id); } }}>
            {highlight === l.id && <span className="ripple" />}
            <span className={'light ' + (green ? 'is-green' : 'is-red')} style={{ outlineColor: ln.c }} />
          </button>
        );
      })}

      {game.effects.map((e) => (e.kind === 'boom' ? (
        <div key={e.id} className="boom" style={{ left: e.x - 40, top: e.y - 40 }} />
      ) : (
        <div key={e.id} className={'float ' + e.kind} style={{ left: e.x - 20, top: e.y - 30 }}>{e.text}</div>
      )))}

      {bubble && firstRisk && (
        <div className="bubble" style={{ left: Math.min(width - 190, firstRisk.x + 40), top: Math.max(8, firstRisk.y - 96) }}>
          {t('bubble')}
        </div>
      )}
    </div>
  );
}
