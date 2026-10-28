import * as fs from 'fs-extra';
import * as path from 'path';
import type { Page } from 'playwright';

/**
 * Evidencia de un escenario: captura siempre, vídeo y trace solo si falla.
 *
 * Guardar vídeo de todo lo que pasa llena el disco y nadie lo mira. Guardar
 * vídeo solo de lo que falla es la diferencia entre una evidencia que se revisa
 * y una carpeta de 4 GB que se borra sin abrir.
 */
export class EvidenceManager {
  constructor(private readonly raiz: string = 'Reports') {}

  private nombreSeguro(texto: string): string {
    return texto.replace(/[^\w.-]+/g, '_').slice(0, 120);
  }

  async capturarPantalla(page: Page, escenario: string): Promise<Buffer> {
    const destino = path.join(this.raiz, 'Screenshots', `${this.nombreSeguro(escenario)}.png`);
    await fs.ensureDir(path.dirname(destino));
    return page.screenshot({ path: destino, fullPage: true });
  }

  async conservarVideo(page: Page, escenario: string): Promise<string | undefined> {
    const video = page.video();
    if (!video) return undefined;

    const destino = path.join(this.raiz, 'Videos', `${this.nombreSeguro(escenario)}.webm`);
    await fs.ensureDir(path.dirname(destino));
    await video.saveAs(destino);
    return destino;
  }

  async descartarVideo(page: Page): Promise<void> {
    await page.video()?.delete();
  }
}
