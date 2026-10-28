import type { Actor, Ejecutable } from '../0003.Actors/Actor';

/** Pulsa una tecla sobre un elemento enfocado. */
export class PressKey implements Ejecutable {
  constructor(
    private readonly tecla: string,
    private readonly selector: string,
  ) {}

  static la(tecla: string) {
    return {
      en: (selector: string) => new PressKey(tecla, selector),
    };
  }

  async performAs(actor: Actor): Promise<void> {
    await actor.getPage().press(this.selector, this.tecla);
  }
}
