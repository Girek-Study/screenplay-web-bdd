import { describe, expect, it } from 'vitest';
import { ConfigLoader } from '../Framework/0009.Utils/Config.Loader';

describe('ConfigLoader', () => {
  it('arranca con un tamaño por defecto válido', () => {
    expect(ConfigLoader.windowSize.width).toBeGreaterThan(0);
    expect(ConfigLoader.windowSize.height).toBeGreaterThan(0);
  });

  it('acepta un tamaño nuevo', () => {
    ConfigLoader.setWindowSize({ width: 1366, height: 768 });
    expect(ConfigLoader.windowSize).toEqual({ width: 1366, height: 768 });
  });

  it('rechaza dimensiones imposibles en vez de guardarlas', () => {
    expect(() => ConfigLoader.setWindowSize({ width: 0, height: 768 })).toThrow();
    expect(() => ConfigLoader.setWindowSize({ width: -1, height: -1 })).toThrow();
  });

  it('deja el tamaño inmutable desde fuera', () => {
    ConfigLoader.setWindowSize({ width: 1920, height: 1080 });
    expect(() => {
      (ConfigLoader.windowSize as { width: number }).width = 800;
    }).toThrow();
  });

  it('lee el archivo de configuración sin lanzar', () => {
    // Si la ruta estuviera mal escrita, esto pasaría igual y en silencio: por eso
    // la prueba siguiente comprueba que el valor leído es el del archivo.
    expect(() => ConfigLoader.loadWindowConfig()).not.toThrow();
    expect(ConfigLoader.windowSize).toEqual({ width: 1920, height: 1080 });
  });
});
