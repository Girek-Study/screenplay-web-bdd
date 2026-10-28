import { chromium, firefox, webkit, type Browser, type LaunchOptions } from 'playwright';
import './Env';

type Navegador = 'chromium' | 'firefox' | 'webkit';

const MOTORES = { chromium, firefox, webkit } as const;

/**
 * Abre y cierra el navegador de la corrida.
 *
 * Un solo navegador para toda la ejecución y un contexto nuevo por escenario:
 * abrir el navegador cuesta segundos, abrir el contexto cuesta milisegundos, y
 * el contexto es lo que de verdad hay que aislar entre pruebas.
 */
export class BrowserManager {
  private browser?: Browser;

  async launchBrowser(): Promise<Browser> {
    const nombre = (process.env.BROWSER_PORTAL ?? 'chromium').toLowerCase() as Navegador;
    const motor = MOTORES[nombre];

    if (!motor) {
      throw new Error(`BROWSER_PORTAL="${nombre}" no es válido. Usa chromium, firefox o webkit.`);
    }

    const opciones: LaunchOptions = {
      headless: process.env.BROWSER_NO_VISUAL !== 'false',
      slowMo: Number(process.env.PW_SLOWMO ?? 0),
    };

    this.browser = await motor.launch(opciones);
    return this.browser;
  }

  getBrowser(): Browser {
    if (!this.browser) {
      throw new Error('El navegador no está abierto. Falta el hook BeforeAll del ciclo de vida.');
    }
    return this.browser;
  }

  async closeBrowser(): Promise<void> {
    await this.browser?.close();
    this.browser = undefined;
  }
}
