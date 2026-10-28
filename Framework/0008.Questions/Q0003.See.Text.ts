import { expect } from '@playwright/test';
import type { Actor, Ejecutable } from '../0003.Actors/Actor';

/** Comprueba que un elemento contiene un texto. */
export class SeeText implements Ejecutable {
  constructor(
    private readonly texto: string,
    private readonly selector: string,
  ) {}

  static el(texto: string) {
    return {
      en: (selector: string) => new SeeText(texto, selector),
    };
  }

  async performAs(actor: Actor): Promise<void> {
    await expect(actor.getPage().locator(this.selector)).toContainText(this.texto);
  }
}
