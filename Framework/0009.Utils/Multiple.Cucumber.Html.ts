import * as fs from 'fs-extra';
import * as os from 'os';
import { generate } from 'multiple-cucumber-html-reporter';
import './Env';

/**
 * Convierte el JSON de Cucumber en el informe HTML.
 *
 * Los metadatos —navegador, sistema, entorno— no son decoración: cuando una
 * prueba falla solo en el informe de ayer, lo primero que se mira es en qué
 * navegador y en qué entorno corrió.
 */
const ORIGEN = 'Reports/cucumber-report.json';

if (!fs.existsSync(ORIGEN)) {
  console.warn(`[informe] No existe ${ORIGEN}; no hay nada que convertir.`);
  process.exit(0);
}

generate({
  jsonDir: 'Reports',
  reportPath: 'Reports/html',
  pageTitle: process.env.PROJECT_NAME ?? 'Suite web',
  reportName: `${process.env.PROJECT_NAME ?? 'Suite web'} — ${process.env.ENV_WEB ?? 'local'}`,
  displayDuration: true,
  metadata: {
    browser: { name: process.env.BROWSER_PORTAL ?? 'chromium', version: '-' },
    device: os.hostname(),
    platform: { name: os.platform(), version: os.release() },
  },
  customData: {
    title: 'Ejecución',
    data: [
      { label: 'Proyecto', value: process.env.PROJECT_NAME ?? '-' },
      { label: 'Entorno', value: process.env.ENV_WEB ?? 'local' },
      { label: 'URL', value: process.env.URL_WEB ?? '-' },
    ],
  },
});
