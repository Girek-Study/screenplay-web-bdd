// El paquete no publica tipos. Se declara lo que el framework usa de verdad,
// no la API completa: un `declare module` vacío dejaría pasar cualquier error.
declare module 'multiple-cucumber-html-reporter' {
  interface Metadatos {
    browser?: { name?: string; version?: string };
    device?: string;
    platform?: { name?: string; version?: string };
  }

  interface DatoPersonalizado {
    title: string;
    data: Array<{ label: string; value: string }>;
  }

  interface Opciones {
    jsonDir: string;
    reportPath: string;
    pageTitle?: string;
    reportName?: string;
    displayDuration?: boolean;
    metadata?: Metadatos;
    customData?: DatoPersonalizado;
  }

  export function generate(opciones: Opciones): void;
}
