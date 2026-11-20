// Vice Platinum Tracker — hand-in program (Node 22, standard library only).
// The guide is plain static files in app/ (index.html, app.js, style.css and
// data/trophies.json), offline by design. This program copies app/ and
// screenshots/ beside it into /output and writes /output/dossier.json with the
// kit's vendored library, vendor/makefun-frontend.ts, left unchanged.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Serve the guide locally with `node serve.ts` (http://localhost:8080).

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail fast with a readable message instead of cpSync's raw ENOENT when the
// guide is missing — a checkout that lost app/ should say so up front.
if (!existsSync(join(repoRoot, 'app', 'index.html'))) {
  throw new Error(`app/index.html is missing under ${repoRoot}; cannot hand in the guide`);
}

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The kit's gate takes 3 to 4 screenshots: refuse early, with the count,
// instead of handing in a dossier the scorer would reject outright.
const shotCount = readdirSync(join(outputDir, 'screenshots')).filter((f) => /\.(png|jpe?g)$/i.test(f)).length;
if (shotCount < 3 || shotCount > 4) {
  throw new Error(`expected 3 to 4 screenshots, found ${shotCount} in screenshots/`);
}

// The scorer's caps from the kit (reference/gate.json): the text cap shapes the
// dossier's bytes; the others refuse an entry the scorer would refuse — more
// than 4 screenshots, one over 256 KiB, or app/ past 993 files and 48 MiB.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
