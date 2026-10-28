import { After, AfterStep, Before, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import type { BrowserContext, Page } from 'playwright';
import * as fs from 'fs-extra';
import { pageFixture } from './Page.Fixture';
import { BrowserManager } from './Browser.Manager';
import { ConfigLoader } from './Config.Loader';
import { EvidenceManager } from './Evidence.Manager.Cucumber';
import './Env';

/**
 * El ciclo de vida de la corrida. Es el único archivo que toca el navegador
 * directamente: ni una task ni un step abren o cierran nada.
 */
const gestorNavegador = new BrowserManager();
const evidencia = new EvidenceManager();

let contexto: BrowserContext | undefined;
let pagina: Page | undefined;

setDefaultTimeout(Number(process.env.CUCUMBER_DEFAULT_TIMEOUT ?? 60_000));

BeforeAll(async () => {
  ConfigLoader.loadWindowConfig();
  await fs.ensureDir('Reports');
  await gestorNavegador.launchBrowser();
});

Before(async () => {
  const { width, height } = ConfigLoader.windowSize;

  contexto = await gestorNavegador.getBrowser().newContext({
    viewport: { width, height },
    ignoreHTTPSErrors: true,
    recordVideo: { dir: 'Reports/Videos', size: { width, height } },
  });

  // El trace se arranca siempre y se descarta si el escenario pasa: no se puede
  // activar a posteriori, cuando ya sabes que hacía falta.
  await contexto.tracing.start({ screenshots: true, snapshots: true });

  pagina = await contexto.newPage();
  pageFixture.page = pagina;
});

AfterStep(async function ({ result }) {
  if (result?.status === Status.FAILED && pagina) {
    this.attach(await evidencia.capturarPantalla(pagina, `fallo-${Date.now()}`), 'image/png');
  }
});

After(async function ({ pickle, result }) {
  const fallo = result?.status === Status.FAILED;

  if (pagina) {
    this.attach(await evidencia.capturarPantalla(pagina, pickle.name), 'image/png');
  }

  if (contexto) {
    if (fallo) {
      await contexto.tracing.stop({ path: `Reports/Traces/${pickle.name.replace(/[^\w.-]+/g, '_')}.zip` });
    } else {
      await contexto.tracing.stop();
    }
  }

  await pagina?.close();

  if (pagina) {
    if (fallo) await evidencia.conservarVideo(pagina, pickle.name);
    else await evidencia.descartarVideo(pagina);
  }

  await contexto?.close();
  contexto = undefined;
  pagina = undefined;
  pageFixture.page = undefined;
});

AfterAll(async () => {
  await gestorNavegador.closeBrowser();
});
