import { expect } from '@playwright/test';
import type { Actor, Ejecutable } from '../0003.Actors/Actor';

/** Comprueba que la URL actual contiene un fragmento. */
export class CurrentUrlContains implements Ejecutable {
  constructor(private readonly fragmento: string) {}

  static el(fragmento: string): CurrentUrlContains {
    return new CurrentUrlContains(fragmento);
  }

  async performAs(actor: Actor): Promise<void> {
    await expect(actor.getPage()).toHaveURL(new RegExp(escaparRegExp(this.fragmento)));
  }
}

/** Una URL lleva puntos, barras y signos de interrogación: todos significan algo en una expresión regular. */
export function escaparRegExp(texto: string): string {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
