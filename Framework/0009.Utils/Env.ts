// Carga .env una sola vez, en silencio, y falla temprano si falta algo obligatorio.
//
// Un framework que arranca sin configuración no falla aquí: falla veinte segundos
// más tarde, dentro del navegador, con un error que no menciona la causa. Por eso
// la validación vive en el primer archivo que se importa.

declare global {
  // eslint-disable-next-line no-var
  var __ENV_CARGADO__: boolean | undefined;
}

if (!globalThis.__ENV_CARGADO__) {
  process.env.DOTENV_CONFIG_DEBUG = 'false';
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config({ debug: false, quiet: true });
  globalThis.__ENV_CARGADO__ = true;

  const OBLIGATORIAS = ['PROJECT_NAME', 'URL_WEB'] as const;
  const faltan = OBLIGATORIAS.filter((k) => !process.env[k]?.trim());

  if (faltan.length) {
    throw new Error(
      `Faltan variables de entorno: ${faltan.join(', ')}. ` +
        'Copia .env.example a .env antes de ejecutar la suite.',
    );
  }
}

export {};
