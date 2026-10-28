import * as fs from 'fs-extra';
import * as path from 'path';

type Dimensiones = Readonly<{ width: number; height: number }>;

/**
 * Tamaño de ventana de la corrida.
 *
 * Se lee de `windows.Config.json` y, si el archivo no está o trae basura, se
 * mantiene el valor por defecto y se avisa por consola. Una resolución mal
 * configurada no justifica abortar la suite, pero sí decirlo en voz alta.
 */
export class ConfigLoader {
  private static _windowSize: Dimensiones = Object.freeze({ width: 1920, height: 1080 });

  public static get windowSize(): Dimensiones {
    return this._windowSize;
  }

  public static setWindowSize(nuevo: { width: number; height: number }): void {
    const w = Number(nuevo?.width);
    const h = Number(nuevo?.height);

    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
      throw new Error(`Dimensiones inválidas: ${JSON.stringify(nuevo)}`);
    }

    this._windowSize = Object.freeze({ width: w, height: h });
  }

  public static loadWindowConfig(): void {
    // La ruta es relativa a ESTE archivo. Apuntar al nombre equivocado no lanza
    // ningún error: el existsSync devuelve false y la configuración se ignora en
    // silencio para siempre. Es el fallo más silencioso de un framework.
    const ruta = path.join(__dirname, 'windows.Config.json');
    if (!fs.existsSync(ruta)) return;

    try {
      const crudo = JSON.parse(fs.readFileSync(ruta, 'utf-8'));
      const w = Number(crudo?.width);
      const h = Number(crudo?.height);

      if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) {
        this._windowSize = Object.freeze({ width: w, height: h });
      } else {
        console.warn('[ConfigLoader] windows.Config.json trae dimensiones inválidas; se usa el valor por defecto.');
      }
    } catch (error: unknown) {
      const detalle = error instanceof Error ? (error.stack ?? error.message) : String(error);
      console.error('[ConfigLoader] No se pudo leer windows.Config.json; se usa el valor por defecto.', detalle);
    }
  }
}
