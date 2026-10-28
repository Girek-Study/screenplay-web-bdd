// Runner de la suite web. Funciona igual en Windows, Linux y macOS.
//
// No usa `npx` ni los `.cmd` de node_modules/.bin: resuelve el binario de
// cucumber desde su propio package.json y lo ejecuta con el Node en curso. Eso
// es lo que evita el clásico "funciona en mi máquina pero no en el contenedor".

import '../0009.Utils/Env';
import { spawn, spawnSync, type ChildProcess } from 'child_process';
import * as path from 'path';
import { expresionDeEtiquetas } from './R000.tags.util';

const NODE = process.execPath;
const TS_NODE = require.resolve('ts-node/register');
const RAIZ = path.resolve(__dirname, '..', '..');

function binarioDeCucumber(): string {
  const rutaPkg = require.resolve('@cucumber/cucumber/package.json');
  const pkg = require(rutaPkg) as { bin?: string | Record<string, string> };
  const campo = pkg.bin;

  const relativo = typeof campo === 'string' ? campo : (campo?.['cucumber-js'] ?? Object.values(campo ?? {})[0]);

  if (!relativo) {
    throw new Error('No se pudo resolver el ejecutable de cucumber-js desde su package.json.');
  }

  return path.join(path.dirname(rutaPkg), relativo);
}

/**
 * Levanta la app de ejemplo si la suite apunta a localhost.
 *
 * La demo vive dentro del repositorio a propósito: una demo pública se cae un
 * martes cualquiera y ensucia el CI con fallos que no son del código.
 */
async function levantarDemo(): Promise<ChildProcess | undefined> {
  const url = process.env.URL_WEB ?? '';
  if (!/localhost|127\.0\.0\.1/.test(url)) return undefined;

  const puerto = new URL(url).port || '4173';
  const hijo = spawn(NODE, [path.join(RAIZ, 'scripts', 'serve-demo.js')], {
    env: { ...process.env, PUERTO: puerto },
    stdio: 'ignore',
  });

  // Esperar a que responda en vez de dormir un número redondo de segundos.
  const limite = Date.now() + 15_000;
  while (Date.now() < limite) {
    try {
      const respuesta = await fetch(url);
      if (respuesta.ok) return hijo;
    } catch {
      /* todavía no escucha */
    }
    await new Promise((listo) => setTimeout(listo, 150));
  }

  hijo.kill();
  throw new Error(`La app de ejemplo no respondió en ${url} tras 15 s.`);
}

async function principal(): Promise<void> {
  const demo = await levantarDemo();

  try {
    const etiquetas = expresionDeEtiquetas(process.argv.slice(2), process.env.CUCUMBER_TAGS);
    const argumentos = ['-r', TS_NODE, binarioDeCucumber()];

    if (etiquetas) {
      argumentos.push('--tags', etiquetas);
      console.log(`\x1b[36m▸ etiquetas:\x1b[0m ${etiquetas}`);
    } else {
      console.log('\x1b[36m▸ etiquetas:\x1b[0m todas');
    }

    const resultado = spawnSync(NODE, argumentos, { stdio: 'inherit', env: process.env, cwd: RAIZ });
    process.exitCode = resultado.status ?? 1;
  } finally {
    demo?.kill();
  }
}

void principal();
