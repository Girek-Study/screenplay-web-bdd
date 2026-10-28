import type { Actor, Ejecutable } from '../0003.Actors/Actor';

/** Abre una URL y espera a que el DOM esté listo. */
export class NavigateTo implements Ejecutable {
  constructor(private readonly url: string) {}

  static la(url: string): NavigateTo {
    return new NavigateTo(url);
  }

  async performAs(actor: Actor): Promise<void> {
    await actor.getPage().goto(this.url, { waitUntil: 'domcontentloaded' });
  }
}
