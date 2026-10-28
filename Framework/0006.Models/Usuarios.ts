import '../0009.Utils/Env';

export interface Usuario {
  readonly rol: string;
  readonly usuario: string;
  readonly clave: string;
}

/**
 * Las credenciales salen del entorno, nunca del código.
 *
 * El `rol` es lo que se nombra en el Gherkin —"como recepcionista"— para que el
 * escenario hable de negocio y no de cuentas. En un repositorio de cliente este
 * archivo es lo único que cambia entre entornos.
 */
export const USUARIOS: Record<string, Usuario> = {
  valido: {
    rol: 'usuario registrado',
    usuario: process.env.USUARIO_DEMO ?? 'demo',
    clave: process.env.CLAVE_DEMO ?? 'demo123',
  },
  invalido: {
    rol: 'usuario con clave equivocada',
    usuario: process.env.USUARIO_DEMO ?? 'demo',
    clave: 'clave-que-no-es',
  },
};

export function usuario(clave: keyof typeof USUARIOS | string): Usuario {
  const encontrado = USUARIOS[clave];
  if (!encontrado) {
    throw new Error(`No existe el usuario "${clave}". Definidos: ${Object.keys(USUARIOS).join(', ')}.`);
  }
  return encontrado;
}
