import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// À chaque build, le service worker reçoit un numéro de version unique (date et heure du build)
// et la liste de tous les fichiers produits, qu'il téléchargera dès son installation.
// Les téléphones qui ont installé le jeu détectent le changement et téléchargent la nouvelle version.
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
      const files = readdirSync(outDir, { recursive: true, withFileTypes: true })
        .filter((f) => f.isFile())
        .map((f) => './' + relative(outDir, resolve(f.parentPath ?? f.path, f.name)).split('\\').join('/'))
        .filter((p) => p !== './sw.js');
      writeFileSync(file, readFileSync(file, 'utf8')
        .replace('__BUILD_ID__', id)
        .replace('__PRECACHE__', JSON.stringify(files)));
    }
  };
}

export default defineConfig({
  plugins: [react(), serviceWorkerVersion()],
  base: './'
});
