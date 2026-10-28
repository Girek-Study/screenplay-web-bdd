import type { Actor, Ejecutable } from '../../../../0003.Actors/Actor';
import { ClickElement } from '../../../../0004.Interactions/I0001.Click.Element';
import { PageTareas } from '../../../../0005.Interfaces/Web/Desktop/001.Tareas/Page.0001.Tareas';

/** Borra de la lista todas las tareas ya completadas. */
export class LimpiarCompletadas implements Ejecutable {
  static ahora(): LimpiarCompletadas {
    return new LimpiarCompletadas();
  }

  async performAs(actor: Actor): Promise<void> {
    await actor.attemptsTo(ClickElement.en(PageTareas.botonLimpiarCompletadas, 'Limpiar completadas'));
  }
}
