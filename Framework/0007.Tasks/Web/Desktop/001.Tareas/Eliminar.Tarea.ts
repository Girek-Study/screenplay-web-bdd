import type { Actor, Ejecutable } from '../../../../0003.Actors/Actor';
import { ClickElement } from '../../../../0004.Interactions/I0001.Click.Element';
import { PageTareas } from '../../../../0005.Interfaces/Web/Desktop/001.Tareas/Page.0001.Tareas';

/** Elimina una tarea de la lista, identificándola por su texto. */
export class EliminarTarea implements Ejecutable {
  constructor(private readonly texto: string) {}

  static la(texto: string): EliminarTarea {
    return new EliminarTarea(texto);
  }

  async performAs(actor: Actor): Promise<void> {
    await actor.attemptsTo(ClickElement.en(PageTareas.borrarDe(this.texto), `eliminar "${this.texto}"`));
  }
}
