import { expect } from '@playwright/test';
import type { Actor, Ejecutable } from '../0003.Actors/Actor';

/**
 * Comprueba que un elemento NO está a la vista.
 *
 * `expect(...).toBeHidden()` reintenta hasta el timeout. La versión con
 * `isVisible()` a secas lee el DOM una vez: si el elemento tarda 200 ms en
 * desaparecer, la prueba falla sin motivo. Eso es el 90% de las pruebas
 * intermitentes que se culpan al entorno.
 */
export class ElementNoVisible implements Ejecutable {
  constructor(
    private readonly selector: string,
    private readonly nombre = selector,
  ) {}

  static el(selector: string, nombre?: string): ElementNoVisible {
    return new ElementNoVisible(selector, nombre);
  }

  async performAs(actor: Actor): Promise<void> {
    await expect(actor.getPage().locator(this.selector), `"${this.nombre}" debía estar oculto`).toBeHidden();
  }
}
