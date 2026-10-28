import type { Actor, Ejecutable } from '../../../../0003.Actors/Actor';
import { ClickElement } from '../../../../0004.Interactions/I0001.Click.Element';
import { PageTareas } from '../../../../0005.Interfaces/Web/Desktop/001.Tareas/Page.0001.Tareas';

/** Marca una tarea como completada, identificándola por su texto. */
export class CompletarTarea implements Ejecutable {
  constructor(private readonly texto: string) {}

  static la(texto: string): CompletarTarea {
    return new CompletarTarea(texto);
  }

  async performAs(actor: Actor): Promise<void> {
    await actor.attemptsTo(ClickElement.en(PageTareas.casillaDe(this.texto), `casilla de "${this.texto}"`));
  }
}
