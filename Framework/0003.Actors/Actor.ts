import type { Page } from 'playwright';
import { pageFixture } from '../0009.Utils/Page.Fixture';

/** Cualquier cosa que un actor sepa ejecutar: task, interacción o pregunta. */
export interface Ejecutable {
  performAs(actor: Actor): Promise<void>;
}

/**
 * Quien ejecuta la prueba.
 *
 * El actor lleva el nombre del rol de negocio —"Ana, recepcionista"— porque ese
 * nombre acaba en el informe y en el mensaje de error. "El usuario" no distingue
 * nada cuando el fallo solo le ocurre al administrador.
 */
export class Actor {
  private readonly habilidades: unknown[] = [];

  constructor(public readonly name: string) {}

  getPage(): Page {
    const page = pageFixture.page;

    if (!page) {
      throw new Error(
        `${this.name} intentó usar el navegador sin página abierta. ` +
          'Solo el ciclo de vida abre contextos: revisa que Test.Life.cycle.ts esté en el "require" de cucumber.json.',
      );
    }

    return page;
  }

  /** Ejecuta en orden. Si una falla, las siguientes no corren. */
  async attemptsTo(...ejecutables: Ejecutable[]): Promise<void> {
    for (const ejecutable of ejecutables) {
      await ejecutable.performAs(this);
    }
  }

  can<T>(habilidad: T): this {
    this.habilidades.push(habilidad);
    return this;
  }
}
