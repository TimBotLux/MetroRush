import { useEffect, useReducer, useRef } from 'react';

// Boucle d'animation (requestAnimationFrame) : appelle tick(dt) puis redessine.
export function useLoop(tick, running) {
  const [, force] = useReducer((n) => n + 1, 0);
  const tickRef = useRef(tick);
  tickRef.current = tick;

  useEffect(() => {
    if (!running) return undefined;
    let raf;
    let last = performance.now();
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      tickRef.current(dt);
      force();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  return force;
}
