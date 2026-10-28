import type { Actor, Ejecutable } from '../../../../0003.Actors/Actor';
import { ClickElement } from '../../../../0004.Interactions/I0001.Click.Element';
import { EnterText } from '../../../../0004.Interactions/I0002.Enter.Text';
import { SeeElement } from '../../../../0008.Questions/Q0002.See.Element';
import { PageIniciarSesion } from '../../../../0005.Interfaces/Web/Desktop/000.Iniciar.Sesion/Page.0001.Iniciar.Sesion';
import { PageTareas } from '../../../../0005.Interfaces/Web/Desktop/001.Tareas/Page.0001.Tareas';
import type { Usuario } from '../../../../0006.Models/Usuarios';

/**
 * Inicia sesión y garantiza su propia postcondición.
 *
 * La última línea no es decoración: una task que deja al actor a medio camino
 * hace fallar la siguiente con un error que no tiene nada que ver con la causa.
 * Si el ingreso no terminó, el fallo se ve aquí, donde se entiende.
 */
export class IniciarSesion implements Ejecutable {
  constructor(private readonly credenciales: Usuario) {}

  static como(credenciales: Usuario): IniciarSesion {
    return new IniciarSesion(credenciales);
  }

  async performAs(actor: Actor): Promise<void> {
    await actor.attemptsTo(
      EnterText.elTexto(this.credenciales.usuario).en(PageIniciarSesion.campoUsuario, 'usuario'),
      EnterText.elTexto(this.credenciales.clave).en(PageIniciarSesion.campoClave, 'clave'),
      ClickElement.en(PageIniciarSesion.botonIngresar, 'Ingresar'),
      SeeElement.el(PageTareas.pantalla, 'pantalla de tareas'),
    );
  }
}

/** Intenta ingresar sin exigir que funcione: para los escenarios de error. */
export class IntentarIniciarSesion implements Ejecutable {
  constructor(private readonly credenciales: Usuario) {}

  static como(credenciales: Usuario): IntentarIniciarSesion {
    return new IntentarIniciarSesion(credenciales);
  }

  async performAs(actor: Actor): Promise<void> {
    await actor.attemptsTo(
      EnterText.elTexto(this.credenciales.usuario).en(PageIniciarSesion.campoUsuario, 'usuario'),
      EnterText.elTexto(this.credenciales.clave).en(PageIniciarSesion.campoClave, 'clave'),
      ClickElement.en(PageIniciarSesion.botonIngresar, 'Ingresar'),
    );
  }
}
