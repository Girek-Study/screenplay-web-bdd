import type { Actor, Ejecutable } from '../../../../0003.Actors/Actor';
import { ClickElement } from '../../../../0004.Interactions/I0001.Click.Element';
import { EnterText } from '../../../../0004.Interactions/I0002.Enter.Text';
import { SeeText } from '../../../../0008.Questions/Q0003.See.Text';
import { PageTareas } from '../../../../0005.Interfaces/Web/Desktop/001.Tareas/Page.0001.Tareas';

/**
 * Agrega una tarea y espera a verla en la lista.
 *
 * La app demo tarda 250 ms a propósito en agregarla. No hay ningún sleep aquí:
 * la espera la hace la aserción de la postcondición. Si alguien mete un
 * `waitForTimeout` en este framework, esta task es la prueba de que no hacía falta.
 */
export class AgregarTarea implements Ejecutable {
  constructor(private readonly texto: string) {}

  static con(texto: string): AgregarTarea {
    return new AgregarTarea(texto);
  }

  async performAs(actor: Actor): Promise<void> {
    await actor.attemptsTo(
      EnterText.elTexto(this.texto).en(PageTareas.campoNuevaTarea, 'nueva tarea'),
      ClickElement.en(PageTareas.botonAgregar, 'Agregar'),
      SeeText.el(this.texto).en(PageTareas.lista),
    );
  }
}
