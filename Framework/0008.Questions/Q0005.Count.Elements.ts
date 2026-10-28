import { expect } from '@playwright/test';
import type { Actor, Ejecutable } from '../0003.Actors/Actor';

/** Comprueba cuántos elementos coinciden con un selector. */
export class CountElements implements Ejecutable {
  constructor(
    private readonly cuantos: number,
    private readonly selector: string,
    private readonly nombre = selector,
  ) {}

  static hay(cuantos: number) {
    return {
      de: (selector: string, nombre?: string) => new CountElements(cuantos, selector, nombre),
    };
  }

  async performAs(actor: Actor): Promise<void> {
    await expect(
      actor.getPage().locator(this.selector),
      `se esperaban ${this.cuantos} de "${this.nombre}"`,
    ).toHaveCount(this.cuantos);
  }
}
