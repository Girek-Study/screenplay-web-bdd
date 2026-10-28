import { expect } from '@playwright/test';
import type { Actor, Ejecutable } from '../0003.Actors/Actor';

/** Comprueba que un elemento está a la vista. */
export class SeeElement implements Ejecutable {
  constructor(
    private readonly selector: string,
    private readonly nombre = selector,
  ) {}

  static el(selector: string, nombre?: string): SeeElement {
    return new SeeElement(selector, nombre);
  }

  async performAs(actor: Actor): Promise<void> {
    await expect(actor.getPage().locator(this.selector), `${actor.name} no vio "${this.nombre}"`).toBeVisible();
  }
}
