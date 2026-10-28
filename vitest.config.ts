import { defineConfig } from 'vitest/config';

/**
 * Las unitarias cubren las utilidades del framework —parseo de etiquetas,
 * carga de configuración, escapado de selectores—, no los escenarios.
 *
 * Un framework de pruebas sin pruebas propias es una contradicción que nadie
 * comenta hasta que una utilidad rompe treinta escenarios a la vez.
 */
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage/unit',
      include: ['Framework/0009.Utils/**', 'Framework/0010.Runners/**', 'Framework/0008.Questions/**'],
    },
  },
});
