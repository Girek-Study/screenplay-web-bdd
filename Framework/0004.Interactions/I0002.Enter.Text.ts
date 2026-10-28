import type { Actor, Ejecutable } from '../0003.Actors/Actor';

/** Escribe texto en un campo, reemplazando lo que hubiera. */
export class EnterText implements Ejecutable {
  constructor(
    private readonly texto: string,
    private readonly selector: string,
    private readonly nombre = selector,
  ) {}

  static elTexto(texto: string) {
    return {
      en: (selector: string, nombre?: string) => new EnterText(texto, selector, nombre),
    };
  }

  async performAs(actor: Actor): Promise<void> {
    try {
      await actor.getPage().fill(this.selector, this.texto);
    } catch (error) {
      throw new Error(`${actor.name} no pudo escribir en "${this.nombre}": ${(error as Error).message}`);
    }
  }
}
