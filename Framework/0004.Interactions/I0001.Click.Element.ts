import type { Actor, Ejecutable } from '../0003.Actors/Actor';

/**
 * Pulsa un elemento.
 *
 * Sin `waitForTimeout` previo: el `click` de Playwright ya espera a que el
 * elemento sea visible, estable y reciba eventos. Un sleep antes del clic no
 * añade garantías, solo tiempo — y esconde el fallo que habría que ver.
 */
export class ClickElement implements Ejecutable {
  constructor(
    private readonly selector: string,
    private readonly nombre = selector,
  ) {}

  static en(selector: string, nombre?: string): ClickElement {
    return new ClickElement(selector, nombre);
  }

  async performAs(actor: Actor): Promise<void> {
    try {
      await actor.getPage().click(this.selector);
    } catch (error) {
      throw new Error(`${actor.name} no pudo pulsar "${this.nombre}": ${(error as Error).message}`);
    }
  }
}
