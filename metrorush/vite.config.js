import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// À chaque build, le service worker reçoit un numéro de version unique (date et heure du build) :
// les téléphones qui ont installé le jeu détectent ce changement et téléchargent la nouvelle version.
function serviceWorkerVersion() {
  let outDir = 'dist';
  return {
    name: 'service-worker-version',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const file = resolve(outDir, 'sw.js');
      const id = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
      writeFileSync(file, readFileSync(file, 'utf8').replace('__BUILD_ID__', id));
    }
  };
}

export default defineConfig({
  plugins: [react(), serviceWorkerVersion()],
  base: './'
});
