import type { Actor, Ejecutable } from '../../../0003.Actors/Actor';
import { NavigateTo } from '../../../0004.Interactions/I0003.Navigate.To';
import '../../../0009.Utils/Env';

/** Abre la aplicación bajo prueba. La URL viene del entorno, no del escenario. */
export class AbrirLaAplicacion implements Ejecutable {
  static ahora(): AbrirLaAplicacion {
    return new AbrirLaAplicacion();
  }

  async performAs(actor: Actor): Promise<void> {
    await actor.attemptsTo(NavigateTo.la(process.env.URL_WEB as string));
  }
}
